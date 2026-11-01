import '../glass/style.css';
import './style.css';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  ReactNode,
  useContext,
  useState,
} from 'react';

import { cn, useForwardedRef, usePortalContainer } from '../utils/main.js';
import {
  EdgeEffects,
  useAnchorRegistration,
  useScrollerRegistration,
  useSizeClass,
  ViewportScopeContext,
} from '../viewport/main.js';
import type {
  SheetContentProps,
  SheetGrabberProps,
  SheetHandle,
  SheetHeaderProps,
  SheetPopupProps,
  SheetRootProps,
} from './props.js';

export type {
  SheetContentProps,
  SheetDetent,
  SheetGrabberProps,
  SheetHandle,
  SheetHeaderProps,
  SheetPopupProps,
  SheetRootProps,
  SheetSwipeDirection,
} from './props.js';

// Sheets, over the page dimmed (black, 20%; dark: 48%):
// - large: opaque (elevated background:
//   white; dark: #1c1c1e), from 10px below the top to the bottom, its top
//   corners 38px, its shadow 0 15px 75px at 18%;
// - medium: glass, 6px from the sides, on the bottom safe area (the home
//   indicator below it; without one, 6px from the bottom), as high as its
//   content, its corners 34px;
// - in a regular width (the window from 768px, or not `compact`), a form
//   sheet: opaque, centered, up to 936px by 852px, its
//   corners 38px.
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

/**
 * Base UI's `Drawer.Root`, its `swipeDirection` also `none`: its popup
 * then ignored by its swipes (Base UI's swipe ignore, see `Popup`).
 */
const Root = <Payload,>({
  swipeDirection,
  ...props
}: SheetRootProps<Payload>): ReactNode => (
  <NoSwipeContext.Provider value={swipeDirection === 'none'}>
    <BaseDrawer.Root
      swipeDirection={swipeDirection === 'none' ? undefined : swipeDirection}
      {...props}
    />
  </NoSwipeContext.Provider>
);

/** The sheet, the page dimmed behind it. */
const Popup = forwardRef<HTMLDivElement, SheetPopupProps>(
  (
    {
      background = 'plain',
      className,
      compact: compactProp,
      container,
      detent = 'large',
      ...props
    },
    ref,
  ) => {
    // (By the window's size class, see Viewport.)
    const sizeClass = useSizeClass();
    const isNotSwiped = useContext(NoSwipeContext);
    const isCompact = compactProp ?? sizeClass === 'compact';
    // Its anchors' scope: fixed to it (see Viewport.Padding).
    const [scope] = useState(() => ({}));

    return (
      // (No box of its own: nothing shifts in its container, e.g. a flex
      // layout's gaps.)
      <ViewportScopeContext.Provider value={scope}>
        <BaseDrawer.Portal
          className="uikit-sheet-portal"
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
              // (Not swiped away: none of its swipes start, see `Root`.)
              data-base-ui-swipe-ignore={isNotSwiped ? '' : undefined}
              data-compact={isCompact ? '' : undefined}
              data-detent={detent}
              data-sheet-part="popup"
              className={cn(
                'uikit-sheet-popup',
                isCompact && detent === 'medium'
                  ? cn('uikit-glass-medium', className)
                  : className,
              )}
              {...props}
            />
          </BaseDrawer.Viewport>
        </BaseDrawer.Portal>
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
  Popup,
  Header,
  Grabber,
  Content,
  createHandle,
};
