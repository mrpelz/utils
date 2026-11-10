import '../glass/style.css';
import './style.css';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useSettingsPortalProps } from '../settings/main.js';
import { cn, useForwardedRef, usePortalContainer } from '../utils/main.js';
import {
  EdgeEffects,
  useAnchorRegistration,
  useScrollerRegistration,
  useSizeClass,
  ViewportInsetContext,
  ViewportScopeContext,
} from '../viewport/main.js';
import type {
  SheetContentProps,
  SheetDetent,
  SheetGrabberProps,
  SheetHandle,
  SheetHeaderProps,
  SheetPopupProps,
  SheetRegular,
  SheetRootProps,
  SheetSnapGroupProps,
  SheetTriggerProps,
} from './props.js';
import { stopsOf, useContentScrolled, useGroupStops, useSnap } from './snap.js';

export type {
  SheetContentProps,
  SheetDetent,
  SheetGrabberProps,
  SheetHandle,
  SheetHeaderProps,
  SheetPopupProps,
  SheetRegular,
  SheetRootProps,
  SheetSnapGroupProps,
  SheetSwipeDirection,
  SheetTriggerProps,
} from './props.js';

// Sheets, over the page dimmed (black, 20%; dark: 48%):
// - large: opaque (elevated background:
//   white; dark: #1c1c1e), from 10px below the top to the bottom, its top
//   corners 38px, its shadow 0 15px 75px at 18%;
// - medium: glass, 8px from the sides and the bottom (the home indicator
//   over its bottom margin), as high as its content, its corners 42px
//   (iOS 26's, measured);
// - in a regular width (the window from 768px, or not `compact`), a form
//   sheet: opaque, centered, up to 936px by 852px, its
//   corners 38px; or (`regular` `card`) a card from the bottom at the
//   leading edge (as a regular Island: 375px wide, 10px in, 8px from the
//   bottom), its detent's
//   look, all its corners round, up to 64px below the top.
// Its header: a grabber (`Grabber`, 36px by 5px, 5px from
// the top, #cfcfcf; optional) above the app's content (e.g. a `Toolbar`: a 44px title and
// controls). Base UI's `Drawer` (a `Dialog` with gestures): modal,
// dismissed by a press outside it (or Escape); swiped down (anywhere, its
// content scrolled to its top), far enough or flung, too, otherwise
// springing back.
//
// Also:
// - The glass is the menus' (see `Menu`).
// - Detents don't change by dragging (`detent` is the app's), and the page
//   behind a large sheet doesn't shrink back (no stacked look).

// Opaque, grouped (`background`, for grouped lists, as a page's): on the
// grouped background, a list in it without its own (which would end with
// it, the sheet's around it). In it,
// the elevated backgrounds (dark mode: #1c1c1e, groups #2c2c2e), as
// tokens for all its content (e.g. a navigation's pages).

/** Its root's `swipeDirection`: `none`, not swiped away at all. */
const NoSwipeContext = createContext(false);

type SnapPoint = BaseDrawer.Root.SnapPoint;

/** Nothing (e.g. a scroll told while not snapping). */
const noop = () => undefined;

/**
 * Its snap groups' stops (see `SnapGroup`), and its own snapping by them
 * (see snap.ts): the stop it's at, a stop chosen, closed.
 */
type SnapContextValue = {
  /** Its stop now (an index of `stops`). */
  active: number;
  close: (event: Event) => void;
  /**
   * Its stops not snapped to (by index; its content scrolled from its
   * start, its groups in it: see snap.ts).
   */
  ignored: readonly boolean[];
  /**
   * A group's end (px from the popup's top), or `undefined`: gone; pinned
   * (`isPinned`: its header alone, not of its content's scroll).
   */
  report: (
    value: string,
    height: number | undefined,
    isPinned?: boolean,
  ) => void;
  select: (index: number, event: Event) => void;
  /** Its content scrolled from its start, or back at it (see `stops`). */
  setContentScrolled: (isScrolled: boolean) => void;
  /**
   * Its stops' heights, ascending (none: not snapping by groups): all of
   * them, always (their markers kept in place, see snap.ts).
   */
  stops: readonly number[];
};

const SnapContext = createContext<SnapContextValue | undefined>(undefined);

/** Base UI's event details, for a stop chosen by a drag (cancelable). */
const snapDetails = (event: Event) => {
  let isCanceled = false;
  return {
    allowPropagation: () => undefined,
    cancel: () => {
      isCanceled = true;
    },
    event,
    get isCanceled() {
      return isCanceled;
    },
    isPropagationAllowed: false,
    reason: 'swipe',
    trigger: undefined,
  } as unknown as BaseDrawer.Root.SnapPointChangeEventDetails;
};

/**
 * Base UI's `Drawer.Root`, its `swipeDirection` also `none`: its popup
 * then ignored by its swipes (Base UI's swipe ignore, see `Popup`). With
 * snap groups in it (see `SnapGroup`) and no `snapPoints` of the app's, it
 * snaps by them, the library's own (see snap.ts), named by their `value`s
 * in `snapPoint`, `defaultSnapPoint` (else the lowest) and
 * `onSnapPointChange`; swiped down, a stop at a time, closed from the
 * lowest only.
 */
const Root = <Payload,>({
  actionsRef,
  defaultSnapPoint,
  onOpenChange,
  onSnapPointChange,
  snapPoint,
  snapPoints,
  swipeDirection,
  ...props
}: SheetRootProps<Payload>): ReactNode => {
  const [heights, report] = useGroupStops();
  // Its content scrolled from its start (see `SnapContextValue` `stops`).
  const [isContentScrolled, setContentScrolled] = useState(false);
  // (Its own, uncontrolled: from `defaultSnapPoint`, again as it opens.)
  const [own, setOwn] = useState<SnapPoint | null | undefined>(
    defaultSnapPoint,
  );
  const ownActions = useRef<BaseDrawer.Root.Actions>(null);
  const actions = actionsRef ?? ownActions;
  const isNamed = snapPoints === undefined && heights.size > 0;
  const active = snapPoint === undefined ? own : snapPoint;

  // Its stops, those not snapped to (its content scrolled: see snap.ts).
  const { ignored, index, stops } = useMemo(
    () => stopsOf(heights, isContentScrolled, active),
    [active, heights, isContentScrolled],
  );

  const snap = useMemo<SnapContextValue>(
    () => ({
      active: Math.max(index, 0),
      close: () => actions.current?.close(),
      ignored,
      report,
      select: (next, event) => {
        const name = stops[next]?.[0];
        if (name === undefined) return;
        const details = snapDetails(event);
        onSnapPointChange?.(name, details);
        if (snapPoint === undefined && !details.isCanceled) setOwn(name);
      },
      setContentScrolled,
      stops: isNamed ? stops.map(([, height]) => height) : [],
    }),
    [
      actions,
      ignored,
      index,
      isNamed,
      onSnapPointChange,
      report,
      snapPoint,
      stops,
    ],
  );

  return (
    <SnapContext.Provider value={snap}>
      <NoSwipeContext.Provider value={swipeDirection === 'none'}>
        <BaseDrawer.Root
          actionsRef={actions}
          swipeDirection={
            swipeDirection === 'none' ? undefined : swipeDirection
          }
          onOpenChange={(isOpen, details) => {
            onOpenChange?.(isOpen, details);
            if (!isOpen || details.isCanceled) return;
            // Opened by a trigger linking into a stop (its `snapPoint`):
            // there; else at its default (again).
            const { event, trigger } = details;
            const source =
              trigger ??
              (event?.target instanceof Element ? event.target : undefined);
            const linked = source?.closest<HTMLElement>(
              '[data-sheet-snap-point]',
            )?.dataset.sheetSnapPoint;
            if (linked !== undefined && snapPoint !== undefined) {
              onSnapPointChange?.(
                linked,
                snapDetails(event ?? new Event('open')),
              );
            }
            setOwn(linked ?? defaultSnapPoint);
          }}
          // (Base UI's snap points, the app's; with groups, none: the
          // library's own.)
          {...(isNamed
            ? {}
            : {
                defaultSnapPoint,
                onSnapPointChange,
                snapPoints,
                ...(snapPoint !== undefined && { snapPoint }),
              })}
          {...props}
        />
      </NoSwipeContext.Provider>
    </SnapContext.Provider>
  );
};

/** What a mouse drags it by: its header (its grabber, its bar but its buttons). */
const dragHandle = '[data-sheet-part=header], [data-sheet-part=grabber]';

/** What a press there is for itself (its buttons…), not a drag. */
const interactive =
  'a, button, input, label, select, textarea, [contenteditable], [role=button], [role=link]';

/** How fast (px/ms) a mouse lets go for a fling (closing it). */
const flingSpeed = 0.4;

/**
 * Not snapping (from the bottom, swiped down): dragged down by a mouse by its
 * header (Base UI's swipes a touch's), following it; let go past a third of
 * its height, or flung, closed (`close`), else back.
 */
const useMouseSwipe = (
  ref: RefObject<HTMLElement | null>,
  isBottom: boolean,
  isSnapping: boolean,
) => {
  const close = useContext(SnapContext)?.close;
  const isNotSwiped = useContext(NoSwipeContext);
  const isEnabled = isBottom && !isSnapping && !isNotSwiped;
  const closeRef = useRef(close);
  useLayoutEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    const { current: element } = ref;
    if (!element || !isEnabled) return undefined;
    let drag:
      | { id: number; moves: [time: number, y: number][]; startY: number }
      | undefined;
    const release = () => {
      element.style.removeProperty('transform');
      element.style.removeProperty('transition');
    };

    const onDown = (event: PointerEvent) => {
      if (
        event.pointerType !== 'mouse' ||
        event.button !== 0 ||
        !(event.target instanceof Element) ||
        !event.target.closest(dragHandle) ||
        event.target.closest(interactive)
      ) {
        return;
      }
      drag = {
        id: event.pointerId,
        moves: [[event.timeStamp, event.clientY]],
        startY: event.clientY,
      };
      element.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      const distance = Math.max(0, event.clientY - drag.startY);
      drag.moves = [
        ...drag.moves.filter(([time]) => event.timeStamp - time < 100),
        [event.timeStamp, event.clientY],
      ];
      element.style.transition = 'none';
      element.style.transform = `translateY(${String(distance)}px)`;
    };
    const onUp = (event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      const { moves, startY } = drag;
      drag = undefined;
      const distance = event.clientY - startY;
      const [first] = moves;
      const speed =
        first && event.timeStamp > first[0]
          ? (event.clientY - first[1]) / (event.timeStamp - first[0])
          : 0;
      // (Its transition back: from where it was let go, closed or not.)
      release();
      if (distance > element.offsetHeight / 3 || speed > flingSpeed) {
        closeRef.current?.(event);
      }
    };

    element.addEventListener('pointerdown', onDown);
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerup', onUp);
    element.addEventListener('pointercancel', onUp);
    return () => {
      element.removeEventListener('pointerdown', onDown);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerup', onUp);
      element.removeEventListener('pointercancel', onUp);
      release();
    };
  }, [isEnabled, ref]);
};

/**
 * Its lowest stop's height as a property of its popup
 * (`--uikit-sheet-lowest-stop`, px; `undefined`: not snapping, none), for
 * its style (see style.css): swiped out whole below it, its corners no more
 * than half as high as shown. As far as it scrolls at most (a stop past its
 * end rests at its end, as its markers do, see snap.ts): e.g. its top stop,
 * beyond the sheet's height, as its lowest that counts (its content
 * scrolled), else past where it rests, its swipe-out moving the sheet out
 * of view while open. Again as it resizes.
 */
const useStopProperty = (
  ref: RefObject<HTMLElement | null>,
  name: string,
  height: number | undefined,
) => {
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    if (height === undefined) {
      element.style.removeProperty(name);
      return undefined;
    }
    const apply = () => {
      const range = element.scrollHeight - element.clientHeight;
      const at = range > 0 ? Math.min(height, range) : height;
      element.style.setProperty(name, `${String(at)}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(element);
    return () => observer.disconnect();
  }, [height, name, ref]);
};

/**
 * Where it is: from the bottom (its detent's, swiped, snapping), compact
 * (by the window's size class, see Viewport, or set), or a card (regular,
 * `regular` `card`: at the leading edge); else a form sheet.
 */
const usePlacement = (compact: boolean | undefined, regular: SheetRegular) => {
  const sizeClass = useSizeClass();
  const isCompact = compact ?? sizeClass === 'compact';
  const isCard = !isCompact && regular === 'card';
  return { isBottom: isCompact || isCard, isCard };
};

/** Snapping, its kind: a medium one's capsule, a large one's sheet. */
const snapKindOf = (isSnapping: boolean, detent: SheetDetent) => {
  if (!isSnapping) return undefined;
  return detent === 'medium' ? 'capsule' : 'sheet';
};

/** The sheet, the page dimmed behind it. */
const Popup = forwardRef<HTMLDivElement, SheetPopupProps>(
  (
    {
      background = 'plain',
      children,
      className,
      compact: compactProp,
      container,
      detent = 'large',
      regular = 'form',
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const isNotSwiped = useContext(NoSwipeContext);
    const { isBottom, isCard } = usePlacement(compactProp, regular);
    // Snapping by its groups (see `SnapGroup`, snap.ts), natively, from the
    // bottom: a medium one within its capsule, a large one moved up and
    // down; Base UI's swipes not its own.
    const snap = useContext(SnapContext);
    const isSnapping = snap !== undefined && snap.stops.length > 0 && isBottom;
    const isGlass = isBottom && detent === 'medium';
    useSnap(
      ref,
      isSnapping
        ? {
            active: snap.active,
            canClose: !isNotSwiped,
            content: '[data-sheet-part=content]',
            handle: dragHandle,
            ignored: snap.ignored,
            onClose: snap.close,
            onSelect: snap.select,
            stops: snap.stops,
          }
        : undefined,
    );
    useContentScrolled(
      ref,
      '[data-sheet-part=content]',
      snap?.setContentScrolled ?? noop,
      isSnapping,
    );
    useMouseSwipe(ref, isBottom, isSnapping);
    // (Its lowest that counts: its content scrolled, none below its top
    // stop counting, its top stop, swiped out from there, see snap.ts.)
    useStopProperty(
      ref,
      '--uikit-sheet-lowest-stop',
      isSnapping
        ? snap.stops.find((_, index) => snap.ignored[index] !== true)
        : undefined,
    );
    const snapKind = snapKindOf(isSnapping, detent);
    // Its anchors' scope: fixed to it (see Viewport.Padding).
    const [scope] = useState(() => ({}));

    return (
      // (No box of its own: nothing shifts in its container, e.g. a flex
      // layout's gaps.)
      <ViewportScopeContext.Provider value={scope}>
        <ViewportInsetContext.Provider value>
          <BaseDrawer.Portal
            className="uikit-sheet-portal"
            {...useSettingsPortalProps()}
            container={usePortalContainer(container)}
          >
            <BaseDrawer.Backdrop
              className="uikit-sheet-backdrop"
              data-sheet-part="backdrop"
            />
            <BaseDrawer.Viewport
              className="uikit-sheet-viewport"
              data-sheet-part="viewport"
            >
              <BaseDrawer.Popup
                ref={ref}
                data-background={background}
                // (Not swiped away, or snapping: none of Base UI's swipes
                // start, see `Root`.)
                // (From the bottom, see above: compact, or a card.)
                data-card={isCard ? '' : undefined}
                data-compact={isBottom ? '' : undefined}
                data-detent={detent}
                data-sheet-part="popup"
                data-snap={snapKind}
                className={cn(
                  'uikit-sheet-popup',
                  isGlass && !isSnapping
                    ? cn('uikit-glass-medium uikit-glass-panel', className)
                    : className,
                )}
                data-base-ui-swipe-ignore={
                  isNotSwiped || isSnapping ? '' : undefined
                }
                {...props}
              >
                {/* Snapping (see snap.ts): the room it's scrolled up out of
                  (pressed, closed as the backdrop would), its panel, and its
                  stops. Not snapping: the panel no box of its own. */}
                <div
                  aria-hidden="true"
                  className="uikit-sheet-spacer"
                  data-sheet-part="spacer"
                  onClick={(event) => {
                    if (isSnapping) snap.close(event as unknown as Event);
                  }}
                >
                  {/* Its stops, in its flow (not positioned: Safari takes
                    those, in a transformed container, from elsewhere), and
                    within its scroll's range (the last at its end, the
                    panel's start: Safari holds on to one past it, see
                    snap.ts; its spacer whole pixels, see style.css). */}
                  {isSnapping
                    ? [0, ...snap.stops].map((stop, index) => (
                        <span
                          // (By place, not height: one re-measured moves, so
                          // it's still the one snapped to.)
                          key={index}
                          className="uikit-sheet-stop"
                          data-sheet-part="stop"
                          // (Not snapped to: its content scrolled, see
                          // snap.ts; index 0 closed, never.)
                          data-ignored={
                            snap.ignored[index - 1] === true ? '' : undefined
                          }
                          style={{
                            marginTop: `min(${String(stop)}px, 100cqh)`,
                          }}
                        />
                      ))
                    : null}
                </div>
                <div
                  data-sheet-part="panel"
                  className={cn(
                    'uikit-sheet-panel',
                    isGlass && isSnapping
                      ? 'uikit-glass-medium uikit-glass-panel'
                      : undefined,
                  )}
                >
                  {children as ReactNode}
                </div>
              </BaseDrawer.Popup>
            </BaseDrawer.Viewport>
          </BaseDrawer.Portal>
        </ViewportInsetContext.Provider>
      </ViewportScopeContext.Provider>
    );
  },
);

/**
 * Its grabber (36px by 5px, 5px from the top): showing the sheet
 * can be swiped (it can be anywhere); left out, a cleaner top.
 */
const Grabber = forwardRef<HTMLDivElement, SheetGrabberProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      data-sheet-part="grabber"
      {...props}
      className={cn('uikit-sheet-grabber', className)}
    />
  ),
);

/** Not registered (see `Header`). */
const noElement = { current: null };

/**
 * Its header: its grabber (`Grabber`), above the app's content (e.g. a
 * `Toolbar`). Over the content, which scrolls under it (its edge effect,
 * see `EdgeEffects`): a bar of the sheet's (a block-start anchor in its
 * scope), its content making room with a `Viewport.Padding` (as a page
 * under its toolbar). Only a grabber: over the content too, no bar (the
 * content's own bars below it, see style.css).
 */
const Header = forwardRef<HTMLDivElement, SheetHeaderProps>(
  (
    { children, className, edgeEffect = 'soft', edgeTint, ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const isGrabberOnly = Children.toArray(children).every(
      (child) => isValidElement(child) && child.type === Grabber,
    );
    useAnchorRegistration(
      isGrabberOnly ? noElement : ref,
      'block-start',
      undefined,
      { effect: edgeEffect, tint: edgeTint },
    );

    return (
      <div
        ref={ref}
        data-sheet-part="header"
        {...props}
        className={cn('uikit-sheet-header', className)}
      >
        {children}
      </div>
    );
  },
);

/**
 * Its content, scrolling (Base UI's `Drawer.Content`: its text selectable by
 * a mouse without swiping the sheet); a scroller (registered), drawing its
 * bars' edge effects (see `Viewport`): beside it, not in it, so its mask
 * (fading it out under the header, see style.css) leaves them be.
 */
const Content = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ children, className, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    useScrollerRegistration(ref);

    return (
      <>
        <BaseDrawer.Content
          ref={ref}
          className={cn('uikit-sheet-content', className)}
          data-sheet-part="content"
          data-snap-scroller=""
          data-viewport-scroller=""
          {...props}
        >
          {children as ReactNode}
        </BaseDrawer.Content>
        <EdgeEffects scroller={ref} />
      </>
    );
  },
);

/**
 * Base UI's `Drawer.Trigger`; with `snapPoint` (a snap group's `value`), a
 * deep link: opening the sheet at that stop (see `Root`).
 */
const Trigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ snapPoint, ...props }, ref) => (
    <BaseDrawer.Trigger
      // (Base UI's ref type, a union with its own callbacks, takes no
      // forwarded ref.)
      ref={ref as never}
      data-sheet-snap-point={snapPoint}
      {...props}
    />
  ),
);

/**
 * A stop of the sheet's (see `Root`): swiped up, the sheet reveals its
 * content group by group, snapping to show everything up to a group's end
 * (its header too, and clear of the bottom safe area), measured live.
 * Groups follow one another in its content; the last holds the rest (its
 * end beyond the sheet's height: the whole sheet).
 */
const SnapGroup = forwardRef<HTMLDivElement, SheetSnapGroupProps>(
  ({ className, value, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    // (Its report alone: stable, unlike the stops it changes.)
    const report = useContext(SnapContext)?.report;

    useLayoutEffect(() => {
      const { current: element } = ref;
      const popup = element?.closest<HTMLElement>('[data-sheet-part=popup]');
      if (!element || !popup || !report) return undefined;
      const content = element.closest<HTMLElement>('[data-sheet-part=content]');
      const panel = element.closest<HTMLElement>('[data-sheet-part=panel]');

      // From the sheet's top (its panel's, snapping; else the popup's, the
      // panel no box of its own), as unscrolled (both moved alike: opening,
      // snapped), and the bottom inset it keeps clear of (a large sheet's,
      // to the screen's edge; a floating one's, medium or a card, none: the
      // home indicator over its bottom margin, see style.css).
      const measure = () => {
        const origin =
          panel && getComputedStyle(panel).display !== 'contents'
            ? panel
            : popup;
        const isFloating =
          popup.dataset.card === '' ||
          (popup.dataset.detent === 'medium' && popup.dataset.compact === '');
        const inset = isFloating
          ? 0
          : Number.parseFloat(
              getComputedStyle(popup).getPropertyValue(
                '--uikit-sheet-inset-bottom',
              ),
            ) || 0;
        const end =
          element.getBoundingClientRect().bottom -
          origin.getBoundingClientRect().top +
          (content?.scrollTop ?? 0);
        // Another group after it: the content margin below it, as at a
        // content's end (the last's its own, e.g. a padding's).
        // (Empty, e.g. a stop showing only the header: none.)
        const isFollowed =
          element.offsetHeight > 0 &&
          (element.nextElementSibling?.matches(
            '[data-sheet-part=snap-group]',
          ) ??
            false);
        const margin = isFollowed
          ? Number.parseFloat(
              getComputedStyle(element).getPropertyValue(
                '--uikit-content-margin-block-end',
              ),
            ) || 16
          : 0;
        // Empty (its header alone): its bar as far from the stop's end as
        // from the sheet's top, centered in it.
        const bar = popup.querySelector<HTMLElement>(
          ':scope [data-sheet-part=header] > :last-child:not([data-sheet-part=grabber])',
        );
        if (element.offsetHeight === 0 && bar) {
          const { top } = origin.getBoundingClientRect();
          // (What shows in it, e.g. its buttons: not its box, which may
          // reach further.)
          let contentTop = Number.POSITIVE_INFINITY;
          let contentBottom = Number.NEGATIVE_INFINITY;
          for (const part of bar.querySelectorAll('*')) {
            const box = part.getBoundingClientRect();
            if (box.height === 0) continue;
            contentTop = Math.min(contentTop, box.top);
            contentBottom = Math.max(contentBottom, box.bottom);
          }
          if (contentBottom > contentTop) {
            report(
              value,
              Math.round(contentBottom - top + (contentTop - top) + inset),
              true,
            );
            return;
          }
        }
        // (Pinned: empty, its header alone, or not in its content: not
        // scrolled out with it, see `SnapContextValue` `stops`.)
        report(
          value,
          Math.round(end + inset + margin),
          !content || element.offsetHeight === 0,
        );
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      observer.observe(popup);
      if (panel) observer.observe(panel);
      // What precedes it (e.g. a padding as its header's measured, groups
      // before it): moving it, not resizing it.
      for (const sibling of element.parentElement?.children ?? []) {
        if (sibling === element) break;
        observer.observe(sibling);
      }
      if (content) observer.observe(content);

      return () => {
        observer.disconnect();
        report(value, undefined);
      };
    }, [ref, report, value]);

    return (
      <div
        ref={ref}
        data-sheet-part="snap-group"
        {...props}
        className={cn('uikit-sheet-snap-group', className)}
      />
    );
  },
);

/**
 * A handle linking a sheet (its `handle`) to its triggers outside it, and
 * opening or closing it imperatively (Base UI's `Drawer.createHandle`):
 * made once, e.g. at a module's top level (in a component:
 * `useCreateSheetHandle`).
 */
const createHandle = <Payload = unknown,>(): SheetHandle<Payload> =>
  BaseDrawer.createHandle<Payload>();

/** `Sheet.createHandle`, in a component: made once, for its lifetime. */
export const useCreateSheetHandle = <
  Payload = unknown,
>(): SheetHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());

  return handle;
};

/**
 * A sheet (Base UI's `Drawer`): a
 * modal panel for a scoped task, from the bottom (large or medium), or a
 * form sheet in a regular width.
 */
export const Sheet = {
  ...BaseDrawer,
  Root,
  Trigger,
  Popup,
  Header,
  Grabber,
  Content,
  SnapGroup,
  createHandle,
};
