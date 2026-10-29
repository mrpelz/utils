import './style.css';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import {
  createContext,
  forwardRef,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  cn,
  useForwardedRef,
  usePortalContainer,
  withStyle,
} from '../utils/main.js';
import { ViewportScopeContext } from '../viewport/main.js';
import type {
  DrawerHandle,
  DrawerPopupProps,
  DrawerRootProps,
  DrawerSide,
  DrawerSwipeAreaProps,
} from './props.js';

export type {
  DrawerHandle,
  DrawerPopupProps,
  DrawerRootProps,
  DrawerSide,
  DrawerSwipeAreaProps,
} from './props.js';

// A drawer (Base UI's `Drawer`, from a side; Framework7's panels): a column
// over the content from the inline start or end (e.g. a compact layout's
// sidebar or inspector, see `Layout`), the content dimmed behind it, hidden
// until opened: swiped in from its edge (its `SwipeArea`) or by a
// `Trigger` (in it, or linked by a handle, `Drawer.createHandle` or, in a
// component, `useCreateDrawerHandle`), swiped back (or the dimmed content
// pressed, or a `Close`) to close. Its state is the app's, or its own;
// which of its content shows as a drawer, and which side by side (e.g. by
// the size class, `useSizeClass`), is the app's choice.
//
// Deviations:
// - Drawers (iOS: a compact split view shows one column at a time, pushed as
//   a navigation stack; Framework7's panels swipe in).

/** A drawer's side, for its parts. */
const SideContext = createContext<DrawerSide>('inline-start');

/** The physical direction a drawer at a side is swiped towards to close. */
const closingDirection = (side: DrawerSide, isRightToLeft: boolean) =>
  (side === 'inline-start') === isRightToLeft ? 'right' : 'left';

/**
 * A drawer (Base UI's `Drawer.Root`) at its side: opened by its
 * `SwipeArea` or a `Trigger`, closed by swiping it back, a press on the
 * dimmed content (unless `disablePointerDismissal`) or a `Close`.
 */
const Root = <Payload,>({
  side = 'inline-start',
  ...props
}: DrawerRootProps<Payload>): ReactElement => {
  // The document's direction, for its side's swipes (as it mounts).
  const [isRightToLeft] = useState(
    () =>
      typeof document !== 'undefined' &&
      getComputedStyle(document.documentElement).direction === 'rtl',
  );

  return (
    <SideContext.Provider value={side}>
      <BaseDrawer.Root
        swipeDirection={closingDirection(side, isRightToLeft)}
        {...props}
      />
    </SideContext.Provider>
  );
};

/**
 * Its column (Base UI's `Drawer.Popup`, in its portal, over a backdrop and
 * in a viewport): over the content at its side, the content dimmed behind
 * it; kept mounted while closed (its pages keep their state).
 */
const Popup = forwardRef<HTMLDivElement, DrawerPopupProps>(
  (
    { className, container, floating = false, size = 320, style, ...props },
    ref,
  ) => {
    const side = useContext(SideContext);
    // Its anchors' scope: fixed to it (see Viewport.Padding).
    const [scope] = useState(() => ({}));

    return (
      <ViewportScopeContext.Provider value={scope}>
        <BaseDrawer.Portal
          keepMounted
          className="uikit-drawer-portal"
          container={usePortalContainer(container)}
        >
          <BaseDrawer.Backdrop
            className="uikit-drawer-backdrop"
            data-drawer-part="backdrop"
          />
          <BaseDrawer.Viewport
            className="uikit-drawer-viewport"
            data-drawer-part="viewport"
          >
            <BaseDrawer.Popup
              ref={ref}
              data-drawer-part="popup"
              data-floating={floating ? '' : undefined}
              data-side={side}
              style={withStyle(
                { '--uikit-drawer-size': `${String(size)}px` },
                style,
              )}
              {...props}
              className={cn('uikit-drawer-popup', className)}
            />
          </BaseDrawer.Viewport>
        </BaseDrawer.Portal>
      </ViewportScopeContext.Provider>
    );
  },
);

/** How far a touch moves before its axis is taken (px, as Base UI's). */
const axisSlop = 6;

/**
 * A touch on `area` moving sideways first is a swipe, scrolling nothing
 * until it ends (its moves cancelled); moving vertically first, it scrolls
 * the page. Base UI leaves the area's vertical panning to the browser
 * (`touch-action: pan-y`), not cancelling a swipe's moves either, so the
 * swipe's vertical drift scrolled the page.
 */
const useSwipeScrollLock = (area: { current: HTMLElement | null }) => {
  useEffect(() => {
    const { current: element } = area;
    if (!element) return undefined;

    let start: Touch | undefined;
    let isSwipe: boolean | undefined;

    const onTouchStart = (event: TouchEvent) => {
      start = event.touches.length === 1 ? event.touches[0] : undefined;
      isSwipe = undefined;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!start || !touch) return;

      if (isSwipe === undefined) {
        const x = Math.abs(touch.clientX - start.clientX);
        const y = Math.abs(touch.clientY - start.clientY);
        if (Math.max(x, y) < axisSlop) return;
        isSwipe = x > y;
      }
      if (isSwipe && event.cancelable) event.preventDefault();
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
    };
  }, [area]);
};

/**
 * A strip at its drawer's edge (`width`, 20px) it's swiped in from (where
 * it's rendered: e.g. the app's root, or a layout's); without one, a drawer
 * isn't swiped in. Swiped, nothing scrolls meanwhile (see
 * `useSwipeScrollLock`).
 */
const SwipeArea = forwardRef<HTMLDivElement, DrawerSwipeAreaProps>(
  ({ className, style, width = 20, ...props }, forwardedRef) => {
    const side = useContext(SideContext);
    const ref = useForwardedRef(forwardedRef);
    useSwipeScrollLock(ref);

    return (
      <BaseDrawer.SwipeArea
        ref={ref}
        data-drawer-part="swipe-area"
        data-side={side}
        style={withStyle(
          { '--uikit-drawer-swipe-area-width': `${String(width)}px` },
          style,
        )}
        {...props}
        className={cn('uikit-drawer-swipe-area', className)}
      />
    );
  },
);

/**
 * A handle linking a drawer (its `handle`) to its triggers outside it (e.g.
 * in a column's bar, their `handle`), and opening or closing it
 * imperatively (Base UI's `Drawer.createHandle`): made once, e.g. at a
 * module's top level (in a component: `useCreateDrawerHandle`).
 */
const createHandle = <Payload = unknown,>(): DrawerHandle<Payload> =>
  BaseDrawer.createHandle<Payload>();

/** `Drawer.createHandle`, in a component: made once, for its lifetime. */
export const useCreateDrawerHandle = <
  Payload = unknown,
>(): DrawerHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());

  return handle;
};

export const Drawer = {
  ...BaseDrawer,
  Root,
  Popup,
  SwipeArea,
  createHandle,
};
