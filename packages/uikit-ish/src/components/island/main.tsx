import '../glass/style.css';
import './style.css';

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  stopsOf,
  useContentScrolled,
  useGroupStops,
  useSnap,
} from '../sheet/snap.js';
import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import {
  EdgeEffects,
  useAnchorRegistration,
  useCurrentLayer,
  useScrollerRegistration,
  useSizeClass,
  useVisualViewport,
  ViewportInsetContext,
  ViewportScopeContext,
} from '../viewport/main.js';
import type {
  IslandContentProps,
  IslandGrabberProps,
  IslandHeaderProps,
  IslandRootProps,
  IslandSnapGroupProps,
  IslandSnapPointChangeDetails,
} from './props.js';

export type {
  IslandContentProps,
  IslandGrabberProps,
  IslandHeaderProps,
  IslandRootProps,
  IslandSnapGroupProps,
  IslandSnapPointChangeDetails,
} from './props.js';

// An island: a sheet's glass capsule, always there (not a dialog: no
// portal, backdrop, focus trap, or open state), usually in a bottom
// `Viewport.Anchor` over a page's content (e.g. a map, filling the content
// layer). Its box is what it shows: as tall as its content (up to as tall as
// it may be), or, with snap groups (see `SnapGroup`), as tall as its stop,
// so the anchor's size (the paddings', the content layer's
// `--uikit-viewport-anchor-block-end`) follows it as it settles there.
// Snapping natively, as a medium sheet's (see sheet/snap.ts): within its
// box, pinned to its bottom, a scroller as tall as it may be (overflowing
// it upward, touched on all of it: iOS scrolls no scroller touches pass
// through), a spacer as tall, its panel (the capsule) as tall, a marker per
// stop. Never closed, nor scrolled below its lowest stop (its spacer short
// of it: its scroll from there): its lowest stop its least (e.g. a sliver, its
// grabber alone: then its capsule's glass a pill around its grabber alone,
// the whole capsule's fading in as it's swiped up past it). Touched only on
// its capsule (the rest touched through, to the content beneath). A mouse
// drags it by its header (its
// grabber, its bar but its buttons); pressed there, to its next stop.
// Its header over its content, as a sheet's: a block-start anchor in its
// own scope (its content making room with a `Viewport.Padding`), its
// content fading out under it, its edge effects. Compact, as wide as the
// screen (but 8px); regular, a floating panel at the inline start; 8px
// from the bottom (the home indicator over its bottom margin), its
// corners 42px (iOS 26's floating sheets', measured).

/** Up to how close to the top it may reach (px; below the top inset). */
const topRoom = 64;

/** Below the top inset, at least (px). */
const insetRoom = 10;

/**
 * A group's report (see `SnapGroup`): its end, or `undefined` (gone);
 * pinned (`isPinned`: in its header, or empty, its header alone: not
 * scrolled out with its content, see snap.ts).
 */
type SnapReport = (
  value: string,
  height: number | undefined,
  isPinned?: boolean,
) => void;

const SnapReportContext = createContext<SnapReport | undefined>(undefined);

/** A sliver's stop (a group in its header, see `SnapGroup`), or none. */
type SliverReport = (value: string | undefined) => void;

const SliverContext = createContext<SliverReport | undefined>(undefined);

/** What a mouse drags it by (see sheet/snap.ts). */
const handle = '[data-island-part=header], [data-island-part=grabber]';

/**
 * With a sliver, how far it's swiped up past it (0 to 1 at its next stop:
 * `--uikit-island-sliver`, on its root: its rim's too), as it scrolls.
 */
const useSliverProgress = (
  ref: RefObject<HTMLElement | null>,
  scroller: RefObject<HTMLElement | null>,
  sliverTo: number | undefined,
) => {
  useLayoutEffect(() => {
    const { current: root } = ref;
    const { current: element } = scroller;
    if (!root || !element || sliverTo === undefined || sliverTo <= 0) {
      return undefined;
    }
    let frame = 0;

    const update = () => {
      frame = 0;
      root.style.setProperty(
        '--uikit-island-sliver',
        String(Math.min(Math.max(element.scrollTop / sliverTo, 0), 1)),
      );
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    element.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('scroll', onScroll);
      root.style.removeProperty('--uikit-island-sliver');
    };
  }, [ref, scroller, sliverTo]);
};

/** How long (ms) after a wheel or key it may rest again (see below). */
const idleDelay = 300;

/**
 * Stranded (no stop below its top one counting, its content scrolled, see
 * snap.ts): not moved at all. Its scroller's own pans (a touch or a wheel
 * not starting in its content, e.g. on its header) prevented (iOS: a
 * non-passive move's, the native pan's only reliable stop; `touch-action`
 * doesn't reach a header's parts, its clipped title a scroll container of
 * its own). Its content still scrolls.
 */
const useStrandedPanBlock = (
  scroller: RefObject<HTMLDivElement | null>,
  isStranded: boolean,
) => {
  useEffect(() => {
    const { current: element } = scroller;
    if (!element || !isStranded) return undefined;
    const isOutsideContent = (event: Event) =>
      !(
        event.target instanceof Element &&
        event.target.closest('[data-island-part=content]')
      );
    const onMove = (event: Event) => {
      if (isOutsideContent(event)) event.preventDefault();
    };
    const options = { passive: false };
    element.addEventListener('touchmove', onMove, options);
    element.addEventListener('wheel', onMove, options);
    return () => {
      element.removeEventListener('touchmove', onMove);
      element.removeEventListener('wheel', onMove);
    };
  }, [isStranded, scroller]);
};

/**
 * Its hit area (see style.css): at rest, its box (its scroller clipped to
 * it, the content beneath touched above it); moved (pressed, wheeled,
 * keyed, scrolled away from its stop `top`), all of its scroller's (it may
 * grow), till it rests at its stop again (`data-moving`, on `ref`). Its
 * layout untouched: its clip's reach alone (its clip kept).
 */
const useHitArea = (
  ref: RefObject<HTMLElement | null>,
  scroller: RefObject<HTMLElement | null>,
  top: number | undefined,
) => {
  const topRef = useRef(top);
  // (Its checks: its stop's changes, and its scroller's events.)
  const check = useRef<(() => void) | undefined>(undefined);
  const hasTop = top !== undefined;

  useEffect(() => {
    const { current: root } = ref;
    const { current: element } = scroller;
    if (!root || !element || !hasTop) return undefined;
    let isPressed = false;
    let frame = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const move = () => {
      root.dataset.moving = '';
    };
    const rest = () => {
      if (isPressed) return;
      const { current: stop } = topRef;
      const end = element.scrollHeight - element.clientHeight;
      if (
        stop !== undefined &&
        Math.abs(element.scrollTop - Math.min(stop, end)) < 1
      ) {
        delete root.dataset.moving;
      } else {
        move();
      }
    };
    check.current = rest;
    // (Scrolled: read once a frame.)
    const onScroll = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        rest();
      });
    };

    // Wheeled, keyed: rested again a while after (scrolling its content,
    // or past its range's end, its scroller unscrolled).
    const onInput = () => {
      move();
      clearTimeout(idle);
      idle = setTimeout(rest, idleDelay);
    };
    const onPress = () => {
      isPressed = true;
      move();
    };
    const onRelease = () => {
      if (!isPressed) return;
      isPressed = false;
      rest();
    };
    const listening = { capture: true, passive: true };
    element.addEventListener('pointerdown', onPress, listening);
    element.addEventListener('wheel', onInput, listening);
    element.addEventListener('keydown', onInput, listening);
    element.addEventListener('scroll', onScroll, { passive: true });
    element.addEventListener('scrollend', rest);
    globalThis.addEventListener('pointerup', onRelease, listening);
    globalThis.addEventListener('pointercancel', onRelease, listening);
    return () => {
      check.current = undefined;
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      element.removeEventListener('pointerdown', onPress, listening);
      element.removeEventListener('wheel', onInput, listening);
      element.removeEventListener('keydown', onInput, listening);
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('scrollend', rest);
      globalThis.removeEventListener('pointerup', onRelease, listening);
      globalThis.removeEventListener('pointercancel', onRelease, listening);
      delete root.dataset.moving;
    };
  }, [hasTop, ref, scroller]);

  // (Its stop moved: away from it, till it's there; before it's scrolled.)
  useLayoutEffect(() => {
    topRef.current = top;
    check.current?.();
  }, [top]);
};

/** A stop chosen by the user, cancelable (see `onSnapPointChange`). */
const snapDetails = (event: Event): IslandSnapPointChangeDetails => {
  let isCanceled = false;
  return {
    cancel: () => {
      isCanceled = true;
    },
    event,
    get isCanceled() {
      return isCanceled;
    },
  };
};

const noop = () => undefined;

/** A data attribute's value: present (empty), or absent. */
const flag = (is: boolean) => (is ? '' : undefined);

/**
 * How tall it may be (px): from its bottom up to `topRoom` below its
 * screen's top (the content layer beside its anchor's; else the window's),
 * clear of the top inset; measured as they resize. Its anchor pushed up by
 * the keyboard (`keyboard` `push`), the keyboard's height less (unless
 * that layer's resized above it already).
 */
const useMaxHeight = (ref: RefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState<number | undefined>();
  const { keyboardInset } = useVisualViewport();

  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    const anchor = element.closest<HTMLElement>('[data-viewport-part=anchor]');
    const layer = anchor?.parentElement?.querySelector<HTMLElement>(
      ':scope > [data-viewport-part=content]',
    );

    const measure = () => {
      const style = getComputedStyle(element);
      // (Pushed up by the keyboard, over a screen that isn't resized above
      // it: as much less.)
      const isPushed =
        anchor?.dataset.keyboard === 'push' &&
        layer?.dataset.keyboard !== 'resize';
      const screen =
        (layer?.clientHeight ?? document.documentElement.clientHeight) -
        (isPushed ? keyboardInset : 0);
      const insetTop =
        Number.parseFloat(
          style.getPropertyValue('--uikit-safe-area-inset-top'),
        ) || 0;
      // Its gap below (its anchor's padding, its own margin).
      const below =
        (anchor
          ? Number.parseFloat(getComputedStyle(anchor).paddingBottom) || 0
          : 0) + (Number.parseFloat(style.marginBottom) || 0);
      setHeight(
        Math.max(
          0,
          Math.floor(screen - below - Math.max(topRoom, insetTop + insetRoom)),
        ),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layer ?? document.documentElement);
    if (anchor) observer.observe(anchor);
    return () => observer.disconnect();
  }, [keyboardInset, ref]);

  return height;
};

/**
 * The island (see above): its stops by its snap groups' `value`s, at
 * `snapPoint` (controlled) or `defaultSnapPoint` (else its lowest), a stop
 * the user swipes to told by `onSnapPointChange`.
 */
const Root = forwardRef<HTMLDivElement, IslandRootProps>(
  (
    {
      children,
      className,
      defaultSnapPoint,
      onSnapPointChange,
      snapPoint,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const scroller = useRef<HTMLDivElement>(null);
    const isRegular = useSizeClass() === 'regular';
    const maxHeight = useMaxHeight(ref);
    // Its header's scope (see Viewport.Padding): its own.
    const [scope] = useState(() => ({}));

    const [heights, report] = useGroupStops();
    // Its content scrolled from its start: its groups in it not snapped to
    // meanwhile (see snap.ts).
    const [isContentScrolled, setContentScrolled] = useState(false);
    // (Its content's, as soon as its scroll rests: not moved meanwhile.)
    const [isContentSettled, setContentSettled] = useState(false);
    const [sliver, setSliver] = useState<string | undefined>();
    const [own, setOwn] = useState(defaultSnapPoint);
    const active = snapPoint ?? own;
    // (`isStranded`: none below its top stop counting, its content
    // scrolled: not moved at all, see `useStrandedPanBlock`.)
    const {
      ignored,
      index: found,
      ofContent,
      stops,
    } = useMemo(
      () => stopsOf(heights, isContentScrolled, active),
      [active, heights, isContentScrolled],
    );
    // (Not moved: as soon as its content's scroll rests, see snap.ts.)
    const { isStranded } = useMemo(
      () => stopsOf(heights, isContentSettled, active),
      [active, heights, isContentSettled],
    );
    const index = Math.max(found, 0);
    const isSnapping = stops.length > 0 && maxHeight !== undefined;
    // Its scroll from its lowest stop (its spacer short of it: never
    // scrolled below it), its stops as scroll positions.
    const lowest = stops[0]?.[1] ?? 0;
    const positions = stops.map(([, height]) => height - lowest);
    // (A sliver, its lowest stop: from it, to the next.)
    const isSliver =
      isSnapping && sliver !== undefined && stops[0]?.[0] === sliver;
    const sliverTo = positions[1];

    // A stop chosen by the user (by its index).
    const select = (next: number, event: Event) => {
      const name = stops[next]?.[0];
      if (name === undefined) return;
      const details = snapDetails(event);
      onSnapPointChange?.(name, details);
      if (snapPoint === undefined && !details.isCanceled) {
        setOwn(name);
      }
    };

    useSnap(
      scroller,
      isSnapping
        ? {
            active: index,
            canClose: false,
            content: '[data-island-part=content]',
            handle,
            ignored,
            isStranded,
            ofContent,
            onClose: noop,
            onSelect: select,
            stops: positions,
          }
        : undefined,
    );
    useContentScrolled(
      ref,
      '[data-island-part=content]',
      setContentScrolled,
      isSnapping,
      setContentSettled,
    );
    useSliverProgress(ref, scroller, isSliver ? sliverTo : undefined);
    useStrandedPanBlock(scroller, isStranded);
    useHitArea(ref, scroller, isSnapping ? positions[index] : undefined);

    // (Its box: its stop's, at most as tall as it may be.)
    const shown = isSnapping
      ? Math.min(stops[index]?.[1] ?? 0, maxHeight)
      : undefined;

    return (
      <ViewportScopeContext.Provider value={scope}>
        <ViewportInsetContext.Provider value>
          <SnapReportContext.Provider value={report}>
            <SliverContext.Provider value={setSliver}>
              <div
                ref={ref}
                data-regular={flag(isRegular)}
                data-sliver={flag(isSliver)}
                data-snap={flag(isSnapping)}
                style={withStyle(
                  {
                    '--uikit-island-max-height':
                      maxHeight === undefined
                        ? undefined
                        : `${String(maxHeight)}px`,
                    '--uikit-island-lowest': `${String(lowest)}px`,
                    '--uikit-island-shown':
                      shown === undefined ? undefined : `${String(shown)}px`,
                  },
                  style,
                )}
                {...props}
                className={cn('uikit-island', className)}
                data-island-part="root"
              >
                <div
                  ref={scroller}
                  className="uikit-island-scroller"
                  data-island-part="scroller"
                  data-stranded={flag(isStranded)}
                >
                  {/* The room it's scrolled up out of (snapping; short of its
                    lowest stop), its stops in its flow (see Sheet's), within
                    its scroll's range (the last at its end). */}
                  <div
                    aria-hidden="true"
                    className="uikit-island-spacer"
                    data-island-part="spacer"
                  >
                    {isSnapping
                      ? positions.map((stop, stopIndex) => (
                          <span
                            // (By place: one re-measured moves, still the
                            // one snapped to.)

                            key={stopIndex}
                            className="uikit-island-stop"
                            data-island-part="stop"
                            // (Not snapped to: its content scrolled, see
                            // snap.ts.)
                            data-ignored={
                              ignored[stopIndex] === true ? '' : undefined
                            }
                            style={{
                              marginTop: `min(${String(stop)}px, 100cqh)`,
                            }}
                          />
                        ))
                      : null}
                  </div>
                  {/* Its capsule: its glass's colors (by class), its glass a
                    layer of its own (a sliver's fading in, see above). */}
                  <div
                    className="uikit-island-panel uikit-glass-medium uikit-glass-panel"
                    data-island-part="panel"
                  >
                    <div
                      aria-hidden="true"
                      className="uikit-island-glass"
                      data-island-part="glass"
                    />
                    {children}
                  </div>
                </div>
              </div>
            </SliverContext.Provider>
          </SnapReportContext.Provider>
        </ViewportInsetContext.Provider>
      </ViewportScopeContext.Provider>
    );
  },
);

/**
 * Its grabber (36px by 5px, 5px from the top): showing it can be swiped up
 * (with snap groups); a mouse drags it, or presses it to its next stop.
 */
const Grabber = forwardRef<HTMLDivElement, IslandGrabberProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      data-island-part="grabber"
      {...props}
      className={cn('uikit-island-grabber', className)}
    />
  ),
);

/**
 * Its content, scrolling under its header (snapping: at its top stop); a
 * scroller (registered), drawing its bars' edge effects beside it (see
 * `Viewport`), clipped to its capsule's corners itself (WebKit lets a
 * composited scroller past a parent's rounded clip).
 */
const Content = forwardRef<HTMLDivElement, IslandContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    // (An overlay's: never what a provider tracks, see Viewport.)
    useScrollerRegistration(ref, true, true);
    // (the current scroller while scrolled from its start, see Viewport's `useCurrentScroller`.)
    useCurrentLayer(ref, 'scrolled');

    return (
      <>
        <div
          ref={ref}
          data-island-part="content"
          data-viewport-scroller=""
          {...props}
          className={cn('uikit-island-content', className)}
        />
        <EdgeEffects scroller={ref} />
      </>
    );
  },
);

/**
 * A stop of the island's (see `Root`): swiped up, it reveals its content
 * group by group, snapping to show everything up to a group's end (and the
 * content margin after it, a group following). Empty, after the content's
 * start: its header alone, its bar centered in it; empty, in its header
 * right after its grabber: a sliver, its grabber alone.
 */
const SnapGroup = forwardRef<HTMLDivElement, IslandSnapGroupProps>(
  ({ className, value, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    // (Its report alone: stable.)
    const report = useContext(SnapReportContext);
    const setSliver = useContext(SliverContext);

    useLayoutEffect(() => {
      const { current: element } = ref;
      const panel = element?.closest<HTMLElement>('[data-island-part=panel]');
      if (!element || !panel || !report) return undefined;
      const content = element.closest<HTMLElement>(
        '[data-island-part=content]',
      );
      const header = panel.querySelector<HTMLElement>(
        ':scope > [data-island-part=header]',
      );
      const isInHeader = header?.contains(element) ?? false;
      // (In its header: a sliver's.)
      if (isInHeader) setSliver?.(value);

      // From its panel's top, as unscrolled.
      const measure = () => {
        const { top } = panel.getBoundingClientRect();
        const end =
          element.getBoundingClientRect().bottom -
          top +
          (content?.scrollTop ?? 0);
        // Empty, in the content (its header alone): its bar as far from
        // the stop's end as from the top (what shows in it, e.g. its
        // buttons: not its box).
        const bar = header?.querySelector<HTMLElement>(
          ':scope > :last-child:not([data-island-part=grabber])',
        );
        if (!isInHeader && element.offsetHeight === 0 && bar) {
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
              Math.round(contentBottom - top + (contentTop - top)),
              true,
            );
            return;
          }
        }
        // Another group after it: the content margin below it.
        const isFollowed =
          element.offsetHeight > 0 &&
          (element.nextElementSibling?.matches(
            '[data-island-part=snap-group]',
          ) ??
            false);
        const margin = isFollowed
          ? Number.parseFloat(
              getComputedStyle(element).getPropertyValue(
                '--uikit-content-margin-block-end',
              ),
            ) || 16
          : 0;
        // (Pinned: in its header, empty, or not in its content.)
        report(
          value,
          Math.round(end + margin),
          isInHeader || !content || element.offsetHeight === 0,
        );
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      observer.observe(panel);
      // What precedes it: moving it, not resizing it.
      for (const sibling of element.parentElement?.children ?? []) {
        if (sibling === element) break;
        observer.observe(sibling);
      }
      if (header) observer.observe(header);
      if (content) observer.observe(content);

      return () => {
        observer.disconnect();
        report(value, undefined);
        if (isInHeader) setSliver?.(undefined);
      };
    }, [ref, report, setSliver, value]);

    return (
      <div
        ref={ref}
        data-island-part="snap-group"
        {...props}
        className={cn('uikit-island-snap-group', className)}
      />
    );
  },
);

/** Not registered (see `Header`). */
const noElement = { current: null };

/**
 * Its header: its grabber (`Grabber`) above the app's bar (e.g. a
 * `Toolbar`), over its content, which scrolls under it (its edge effect): a
 * block-start anchor in its scope, the content making room with a
 * `Viewport.Padding`. Only a grabber (and a sliver's stop): not one.
 */
const Header = forwardRef<HTMLDivElement, IslandHeaderProps>(
  (
    { children, className, edgeEffect = 'soft', edgeTint, ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const isGrabberOnly = Children.toArray(children).every(
      (child) =>
        isValidElement(child) &&
        (child.type === Grabber || child.type === SnapGroup),
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
        data-island-part="header"
        {...props}
        className={cn('uikit-island-header', className)}
      >
        {children}
      </div>
    );
  },
);

/**
 * An island: a sheet's glass capsule, always there, over a page's content
 * (in a bottom `Viewport.Anchor`), revealing more as it's swiped up (its
 * snap groups).
 */
export const Island = {
  Root,
  Header,
  Grabber,
  Content,
  SnapGroup,
};
