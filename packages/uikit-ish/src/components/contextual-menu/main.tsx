import '../menu/style.css';
import './style.css';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import {
  ComponentProps,
  createContext,
  CSSProperties,
  forwardRef,
  ReactNode,
  Ref,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { Menu, MenuTrigger } from '../menu/main.js';
import { cn, useForwardedRef } from '../utils/main.js';
import type {
  Align,
  Box,
  ContextualMenuContextValue,
  ContextualMenuHandle,
  ContextualMenuPopupProps,
  ContextualMenuPortalProps,
  ContextualMenuPositionerProps,
  ContextualMenuPreviewProps,
  ContextualMenuRootProps,
  ContextualMenuTriggerProps,
  PortalContainer,
} from './props.js';

export type {
  ContextualMenuHandle,
  ContextualMenuPopupProps,
  ContextualMenuPortalProps,
  ContextualMenuPositionerProps,
  ContextualMenuPreviewProps,
  ContextualMenuRootProps,
  ContextualMenuTriggerProps,
} from './props.js';

// A contextual menu (UIKit `UIContextMenuInteraction`): a trigger and its
// `Menu`, below it. Opening, the trigger is lifted (above a blurred
// `Backdrop`) as far as the menu needs to fit below it in the viewport, and
// can turn into a `Preview` of what the menu acts on (e.g. a photo to
// share), shown in its place, lifted with it; closing, it settles back.
// Source: behavior after iOS (Figma: menus only, see `Menu`).
//
// Deviations:
// - The trigger lifts by a translation (and above the page by a
//   `z-index`): in stacking contexts of its ancestors, it can't rise above
//   the backdrop.
// - Opened as Base UI menus are (a press; on touch already on touch down,
//   see `MenuTrigger`), not by a long press.
// - The preview takes no pointer events (iOS: pressing it commits).
// - Rendered into a container (its `Portal`'s), it lifts within that, as a
//   device's screen (e.g. the views' frames), else within the viewport.
// - Too tall for the viewport together (e.g. a large preview), the preview
//   (or trigger) and the menu scroll together: a transparent scroll
//   container over the whole viewport (behind the menu, wheel input over
//   the menu scrolling it too) moves them, opened scrolled to its end (the
//   menu in view, the preview partly out of it, above).

/** The gap between the lifted trigger and the menu, and the viewport. */
const gap = 8;
const margin = 8;

const ContextualMenuContext = createContext<ContextualMenuContextValue>({
  align: 'center',
  lift: 0,
  open: false,
  overflowing: false,
  preview: false,
  scrollerRef: { current: null },
  setAlign: () => undefined,
  setContainer: () => undefined,
  setPopupHeight: () => undefined,
  setPreviewSize: () => undefined,
  triggerRef: { current: null },
});

/** The screen it's on: its portal's container's box, or the viewport. */
const screenOf = (container: PortalContainer | undefined): Box => {
  const target =
    container && 'current' in container ? container.current : container;
  const element = target instanceof ShadowRoot ? target.host : target;
  if (!element) {
    return { height: innerHeight, left: 0, top: 0, width: innerWidth };
  }
  const { height, left, top, width } = element.getBoundingClientRect();
  return { height, left, top, width };
};

/** Where a box (`height`) would be for a menu below it to fit. */
const fittingTop = (screen: Box, height: number, menu: number) =>
  screen.top + screen.height - margin - menu - gap - height;

/**
 * How far a box (`top`, `height`) lifts for a menu below it to fit, never
 * leaving the screen (negative: moved down, e.g. scrolled partly above).
 */
const liftFor = (screen: Box, top: number, height: number, menu: number) =>
  top -
  Math.max(
    screen.top + margin,
    Math.min(top, fittingTop(screen, height, menu)),
  );

/** How much a box (`height`) and the menu below it are too tall. */
const overflowFor = (screen: Box, height: number, menu: number) =>
  Math.max(0, screen.top + margin - fittingTop(screen, height, menu));

/**
 * The lifted box for the trigger's (`trigger`): the preview's (from the
 * trigger's top, aligned to it as the menu is, within the screen), or the
 * trigger's.
 */
const boxOf = (
  screen: Box,
  trigger: Box,
  preview: { height: number; width: number } | undefined,
  align: Align,
  rtl: boolean,
): Box => {
  if (!preview) return trigger;
  const start = rtl
    ? trigger.left + trigger.width - preview.width
    : trigger.left;
  const end = rtl ? trigger.left : trigger.left + trigger.width - preview.width;
  const left = {
    center: trigger.left + trigger.width / 2 - preview.width / 2,
    end,
    start,
  }[align];

  return {
    ...preview,
    left: Math.max(
      screen.left + margin,
      Math.min(left, screen.left + screen.width - margin - preview.width),
    ),
    top: trigger.top,
  };
};

const isRtl = (element: Element | null) =>
  element ? getComputedStyle(element).direction === 'rtl' : false;

/**
 * The contextual menu: its `Trigger` (and optional `Preview`), and its menu
 * (`Portal` with a `Backdrop`, `Positioner`, `Popup`, items).
 */
const Root = <Payload,>({
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: ContextualMenuRootProps<Payload>): ReactNode => {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const triggerRef = useRef<HTMLElement | null>(null);
  // The trigger's box when it opened (unlifted).
  const [origin, setOrigin] = useState<(Box & { rtl: boolean }) | undefined>(
    undefined,
  );
  const [popupHeight, setPopupHeight] = useState(0);
  const [previewSize, setPreviewSize] = useState<
    { height: number; width: number } | undefined
  >(undefined);
  // The menu's alignment (see `Positioner`), also the preview's.
  const [align, setAlign] = useState<Align>('center');

  // Opening, the trigger's box, before it lifts.
  const [opened, setOpened] = useState(open);
  if (opened !== open) {
    setOpened(open);
    if (!open) setOrigin(undefined);
  }
  useLayoutEffect(() => {
    const { current: trigger } = triggerRef;
    if (!open || origin || !trigger) return;
    const { height, left, top, width } = trigger.getBoundingClientRect();
    setOrigin({ height, left, rtl: isRtl(trigger), top, width });
  }, [open, origin]);

  // Its screen (its portal's container, see `Portal`), as it opened.
  const [container, setContainer] = useState<PortalContainer | undefined>(
    undefined,
  );
  const screen = useMemo(
    () => (origin ? screenOf(container) : undefined),
    [container, origin],
  );
  const box =
    origin && screen && boxOf(screen, origin, previewSize, align, origin.rtl);
  // Too tall: scrolled (by `Scroller`, from 0 to the overflow), lifted
  // further as it scrolls on; opened at its end (the menu in view).
  const overflow =
    open && screen && box && popupHeight
      ? overflowFor(screen, box.height, popupHeight)
      : 0;
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState<number | undefined>(undefined);
  if (!open && scrolled !== undefined) setScrolled(undefined);
  const lift =
    open && screen && box
      ? liftFor(screen, box.top, box.height, popupHeight) +
        Math.min(scrolled ?? overflow, overflow)
      : 0;
  useLayoutEffect(() => {
    const { current: scroller } = scrollerRef;
    if (!scroller || overflow === 0 || scrolled !== undefined) return;
    scroller.scrollTop = overflow;
  }, [overflow, scrolled]);

  const value = useMemo<ContextualMenuContextValue>(
    () => ({
      // Where the trigger is now (e.g. scrolled), lifted.
      anchor: {
        // Tracked (scroll containers, layout shifts) as the trigger.
        get contextElement() {
          return triggerRef.current ?? undefined;
        },
        getBoundingClientRect: () => {
          const { current: trigger } = triggerRef;
          const now = boxOf(
            screenOf(container),
            trigger?.getBoundingClientRect() ?? new DOMRect(),
            previewSize,
            align,
            isRtl(trigger),
          );
          return new DOMRect(now.left, now.top - lift, now.width, now.height);
        },
      },
      align,
      box,
      lift,
      open,
      origin,
      overflowing: overflow > 0,
      preview: previewSize !== undefined,
      scrollerRef,
      setAlign,
      setContainer,
      setPopupHeight,
      setPreviewSize,
      triggerRef,
    }),
    [align, box, container, lift, open, origin, overflow, previewSize],
  );

  return (
    <ContextualMenuContext.Provider value={value}>
      {overflow > 0
        ? createPortal(
            // Too tall: over the whole viewport (above the backdrop, below the
            // menu, the preview taking no pointer events), transparent,
            // scrolling them.
            <div
              ref={scrollerRef}
              className="uikit-contextual-menu-scroller"
              data-contextual-menu-part="scroller"
              onScroll={(event) => setScrolled(event.currentTarget.scrollTop)}
            >
              <div style={{ height: window.innerHeight + overflow }} />
            </div>,
            document.body,
          )
        : null}
      <Menu.Root
        {...props}
        open={open}
        onOpenChange={(next, details) => {
          // Released off the trigger (it lifted away under the pointer):
          // open all the same, as iOS's stays open as the finger lifts.
          if (!next && details.reason === 'cancel-open') {
            details.cancel();
            return;
          }
          setOpenState(next);
          onOpenChange?.(next, details);
        }}
      />
    </ContextualMenuContext.Provider>
  );
};

/**
 * What the menu is about (e.g. a `Button.Root`, rendered by `render`): it
 * opens the menu, lifting as far as the menu needs.
 */
const Trigger = forwardRef<HTMLElement, ContextualMenuTriggerProps>(
  (props, forwardedRef) => {
    const { lift, open, overflowing, preview, triggerRef } = useContext(
      ContextualMenuContext,
    );
    const ref = useForwardedRef(forwardedRef);

    return (
      // Lifted: above the page (and the backdrop), its trigger moved up as far
      // as needed (the wrapper stays, for the menu's anchor); with a preview,
      // hidden behind it.
      <span
        ref={(element: HTMLElement | null) => {
          triggerRef.current = element;
        }}
        className="uikit-contextual-menu-trigger"
        data-contextual-menu-part="trigger"
        data-lifted={open ? '' : undefined}
        data-overflowing={open && overflowing ? '' : undefined}
        data-previewed={open && preview ? '' : undefined}
        style={{ '--uikit-contextual-menu-lift': lift } as CSSProperties}
      >
        <MenuTrigger
          ref={ref as Ref<HTMLElement>}
          {...props}
        />
      </span>
    );
  },
);

/**
 * What the trigger turns into while the menu is open (e.g. the content the
 * menu acts on), in its place (aligned as the menu, see `Positioner`),
 * lifted with it, always in the viewport (at most as large).
 */
const Preview = forwardRef<HTMLDivElement, ContextualMenuPreviewProps>(
  ({ className, style, ...props }, forwardedRef) => {
    const { align, box, lift, open, origin, overflowing, setPreviewSize } =
      useContext(ContextualMenuContext);
    const ref = useForwardedRef(forwardedRef);
    // Rendered once the trigger's box is known (see `Root`).
    const shown = open && origin !== undefined;

    useLayoutEffect(() => {
      const { current: preview } = ref;
      if (!shown || !preview) return undefined;
      const measure = () =>
        setPreviewSize({
          height: preview.offsetHeight,
          width: preview.offsetWidth,
        });
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(preview);
      return () => {
        observer.disconnect();
        setPreviewSize(undefined);
      };
    }, [ref, setPreviewSize, shown]);

    if (!shown) return null;

    return createPortal(
      // Over the page and the backdrop, at the lifted place; scaling in from
      // the trigger's top.
      <div
        ref={ref}
        data-overflowing={overflowing ? '' : undefined}
        {...props}
        className={cn('uikit-contextual-menu-preview', className)}
        data-contextual-menu-part="preview"
        style={
          {
            '--uikit-contextual-menu-lift': lift,
            // Measured, at its place; not yet, at the trigger's.
            left: `${String((box ?? origin).left)}px`,
            top: `${String(origin.top)}px`,
            transformOrigin: `top ${{ center: 'center', end: 'right', start: 'left' }[align]}`,
            ...(typeof style === 'object' && style),
          } as CSSProperties
        }
      />,
      document.body,
    );
  },
);

/**
 * The menu's portal (a `Menu`'s): into its `container`, also the screen the
 * trigger lifts within (as a device's: e.g. the views' frames), else the
 * viewport.
 */
const Portal = forwardRef<HTMLDivElement, ContextualMenuPortalProps>(
  ({ container, ...props }, ref) => {
    const { setContainer } = useContext(ContextualMenuContext);
    useLayoutEffect(() => {
      setContainer(container ?? undefined);
      return () => setContainer(undefined);
    }, [container, setContainer]);

    return (
      <Menu.Portal
        ref={ref}
        container={container}
        {...props}
      />
    );
  },
);

// iOS: the page blurred and dimmed behind the lifted trigger and the menu.
const Backdrop = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseMenu.Backdrop>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseMenu.Backdrop
    ref={ref}
    className={cn('uikit-contextual-menu-backdrop', className)}
    data-contextual-menu-part="backdrop"
    {...props}
  />
));

/** The menu's place: below the lifted trigger (or preview). */
const Positioner = forwardRef<HTMLDivElement, ContextualMenuPositionerProps>(
  (props, ref) => {
    const { anchor, setAlign } = useContext(ContextualMenuContext);
    const align = props.align ?? 'center';
    useLayoutEffect(() => setAlign(align), [align, setAlign]);

    return (
      <Menu.Positioner
        ref={ref}
        align="center"
        anchor={anchor}
        collisionAvoidance={{ align: 'shift', side: 'none' }}
        side="block-end"
        sideOffset={gap}
        {...props}
      />
    );
  },
);

/**
 * The menu (its height decides how far the trigger lifts; too tall for the
 * viewport, it scrolls with it, see `Root`).
 */
const Popup = forwardRef<HTMLDivElement, ContextualMenuPopupProps>(
  ({ onWheel, style, ...props }, forwardedRef) => {
    const { overflowing, scrollerRef, setPopupHeight } = useContext(
      ContextualMenuContext,
    );
    const ref = useForwardedRef(forwardedRef);

    useLayoutEffect(() => {
      const { current: popup } = ref;
      if (!popup) return undefined;
      setPopupHeight(popup.scrollHeight);
      return () => setPopupHeight(0);
    }, [ref, setPopupHeight]);

    return (
      <Menu.Popup
        ref={ref}
        // Scrolled with the preview: its whole height (not the space below
        // it), wheel input over it scrolling them.
        style={
          overflowing
            ? (state) => ({
                ...(typeof style === 'function' ? style(state) : style),
                maxHeight: 'none',
              })
            : style
        }
        onWheel={(event) => {
          onWheel?.(event);
          if (overflowing) scrollerRef.current?.scrollBy({ top: event.deltaY });
        }}
        {...props}
      />
    );
  },
);

/**
 * A handle opening or closing the menu imperatively (Base UI's
 * `Menu.createHandle`): pass it to the root's and its trigger's `handle`
 * (its trigger inside the root, to lift; in a component, see
 * `useCreateContextualMenuHandle`).
 */
const createHandle = <Payload = unknown,>(): ContextualMenuHandle<Payload> =>
  BaseMenu.createHandle<Payload>();

/** `ContextualMenu.createHandle`, in a component: made once. */
export const useCreateContextualMenuHandle = <
  Payload = unknown,
>(): ContextualMenuHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());
  return handle;
};

export const ContextualMenu = {
  ...Menu,
  Root,
  createHandle,
  Trigger,
  Preview,
  Portal,
  Backdrop,
  Positioner,
  Popup,
};
