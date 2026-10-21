import '../glass/style.css';
import './style.css';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import {
  ComponentProps,
  forwardRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { cn } from '../utils/main.js';
import type {
  SheetContentProps,
  SheetHandle,
  SheetPopupProps,
} from './props.js';

export type {
  SheetContentProps,
  SheetDetent,
  SheetHandle,
  SheetPopupProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Sheets”): over the page dimmed (black, 20%;
// dark: 48%):
// - large (Figma “Full Screen - iPhone”): opaque (elevated background:
//   white; dark: #1c1c1e), from 10px below the top to the bottom, its top
//   corners 38px, its shadow 0 15px 75px at 18%;
// - medium (Figma “Inspector - iPhone”): glass, 6px from the sides and the
//   bottom, as high as its content, its corners 34px;
// - in a regular width (iPad: the window from 768px, or not `compact`), a
//   form sheet (Figma “iPad”): opaque, centered, up to 936px by 852px, its
//   corners 38px.
// Its header (Figma “Toolbar”): a grabber (36px by 5px, 5px from the top,
// #cfcfcf) above the app's content (e.g. a `Toolbar`: Figma's 44px title
// and controls). Base UI's `Drawer` (a `Dialog` with gestures): modal,
// dismissed by a press outside it (or Escape); swiped down (anywhere, its
// content scrolled to its top), far enough or flung, too, otherwise
// springing back.
//
// Deviations:
// - The glass is the menus' (see `Menu`).
// - Detents don't change by dragging (`detent` is the app's), and the page
//   behind a large sheet doesn't shrink back (UIKit's stacked look).

// Opaque, with a list (see List): on the grouped background, the list
// without its own (which would end with it, the sheet's around it). In it,
// UIKit's elevated backgrounds (dark mode: #1c1c1e, groups #2c2c2e), as
// tokens for all its content (e.g. a navigation's pages).

// A regular width (iPad): the window's, from 768px.
const regularQuery = '(width >= 768px)';

const subscribeRegular = (onChange: () => void) => {
  const query = matchMedia(regularQuery);
  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
};

const useRegularWidth = () =>
  useSyncExternalStore(
    subscribeRegular,
    () => matchMedia(regularQuery).matches,
    () => false,
  );

/** The sheet, the page dimmed behind it. */
const Popup = forwardRef<HTMLDivElement, SheetPopupProps>(
  (
    { className, compact: compactProp, container, detent = 'large', ...props },
    ref,
  ) => {
    const regular = useRegularWidth();
    const compact = compactProp ?? !regular;

    return (
      <BaseDrawer.Portal container={container}>
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
            data-compact={compact ? '' : undefined}
            data-detent={detent}
            data-sheet-part="popup"
            className={cn(
              'uikit-sheet-popup',
              compact && detent === 'medium'
                ? cn('uikit-glass-medium', className)
                : className,
            )}
            {...props}
          />
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    );
  },
);

/** Its header: its grabber, above the app's content (e.g. a `Toolbar`). */
const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, children, ...props }, ref) => {
    // Only the grabber: over the content (see style.css).
    const grabberOnly = children === undefined || children === null;

    return (
      <div
        ref={ref}
        data-grabber-only={grabberOnly ? '' : undefined}
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
 * a mouse without swiping the sheet).
 */
const Content = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Content
      ref={ref}
      className={cn('uikit-sheet-content', className)}
      data-sheet-part="content"
      {...props}
    />
  ),
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
 * A sheet (UIKit `UISheetPresentationController`; Base UI's `Drawer`): a
 * modal panel for a scoped task, from the bottom (large or medium), or a
 * form sheet in a regular width.
 */
export const Sheet = {
  ...BaseDrawer,
  Popup,
  Header,
  Content,
  createHandle,
};
