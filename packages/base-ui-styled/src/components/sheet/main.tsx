import '../glass/style.css';
import './style.css';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { ComponentProps, forwardRef, PointerEvent, useRef } from 'react';

import { cn } from '../utils/main.js';
import type { SheetPopupProps } from './props.js';

export type { SheetDetent, SheetPopupProps } from './props.js';

// Source: Apple iOS 26 Figma (“Sheets”): over the page dimmed (black, 20%;
// dark: 48%):
// - large (Figma “Full Screen - iPhone”): opaque (elevated background:
//   white; dark: #1c1c1e), from 10px below the top to the bottom, its top
//   corners 38px, its shadow 0 15px 75px at 18%;
// - medium (Figma “Inspector - iPhone”): glass, 6px from the sides and the
//   bottom, as high as its content, its corners 34px;
// - in a regular width (iPad, from 768px), a form sheet (Figma “iPad”):
//   opaque, centered, up to 936px by 852px, its corners 38px.
// Its header (Figma “Toolbar”): a grabber (36px by 5px, 5px from the top,
// #cfcfcf) above the app's content (e.g. a `Toolbar`: Figma's 44px title
// and controls). Base UI's `Dialog`: modal, dismissed by a press outside it
// (or Escape); dragged down by its header, far enough (a third of its
// height) or flung, too, otherwise springing back.
//
// Deviations:
// - The glass is the menus' (see `Menu`).
// - Detents don't change by dragging (`detent` is the app's), and the page
//   behind a large sheet doesn't shrink back (UIKit's stacked look).

// Opaque, with a list (see List): on the grouped background (elevated: in
// dark mode, #1c1c1e, its groups #2c2c2e), the list without its own (which
// would end with it, the sheet's around it).

/** The sheet, the page dimmed behind it. */
const Popup = forwardRef<HTMLDivElement, SheetPopupProps>(
  ({ className, detent = 'large', ...props }, ref) => (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="bus-sheet-backdrop" />
      <BaseDialog.Popup
        ref={ref}
        data-detent={detent}
        className={cn(
          'bus-sheet-popup',
          detent === 'medium' ? cn('bus-glass-medium', className) : className,
        )}
        {...props}
      />
    </BaseDialog.Portal>
  ),
);

// Dragged this far (of its height) or flung this fast (px/ms), it's
// dismissed.
const dismissShare = 1 / 3;
const flingSpeed = 0.5;

/**
 * Its header: its grabber, above the app's content (e.g. a `Toolbar`);
 * dragging it down dismisses the sheet.
 */
const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, onPointerDown, ...props }, ref) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      // Not from its controls.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        (event.target instanceof Element &&
          event.target.closest('button, a, input, [role=button]'))
      ) {
        return;
      }

      const popup = event.currentTarget.closest<HTMLElement>('[data-detent]');
      if (!popup) return;

      const start = event.clientY;
      let last = { time: event.timeStamp, y: start };
      let speed = 0;
      const header = event.currentTarget;
      header.setPointerCapture(event.pointerId);
      popup.toggleAttribute('data-dragging', true);

      const move = (moveEvent: globalThis.PointerEvent) => {
        const distance = Math.max(0, moveEvent.clientY - start);
        const elapsed = moveEvent.timeStamp - last.time;
        if (elapsed > 0) speed = (moveEvent.clientY - last.y) / elapsed;
        last = { time: moveEvent.timeStamp, y: moveEvent.clientY };
        popup.style.setProperty('--styled-sheet-drag', `${String(distance)}px`);
      };
      const end = (endEvent: globalThis.PointerEvent) => {
        header.removeEventListener('pointermove', move);
        header.removeEventListener('pointerup', end);
        header.removeEventListener('pointercancel', end);
        delete popup.dataset.dragging;

        const distance = Math.max(0, endEvent.clientY - start);
        const dismissed =
          endEvent.type === 'pointerup' &&
          (distance > popup.offsetHeight * dismissShare ||
            (speed > flingSpeed && distance > 0));
        // Dismissed, it leaves from where it is; otherwise it springs back.
        if (dismissed) closeRef.current?.click();
        else popup.style.removeProperty('--styled-sheet-drag');
      };
      header.addEventListener('pointermove', move);
      header.addEventListener('pointerup', end);
      header.addEventListener('pointercancel', end);
    };

    return (
      <div
        ref={ref}
        data-sheet-part="header"
        {...props}
        className={cn('bus-sheet-header', props.className)}
        onPointerDown={handlePointerDown}
      >
        {children}
        <BaseDialog.Close
          ref={closeRef}
          hidden
          tabIndex={-1}
        />
      </div>
    );
  },
);

// Its content, scrolling.
const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bus-sheet-content', className)}
      {...props}
    />
  ),
);

/**
 * A sheet (UIKit `UISheetPresentationController`; Base UI's `Dialog`): a
 * modal panel for a scoped task, from the bottom (large or medium), or a
 * form sheet in a regular width.
 */
export const Sheet = {
  ...BaseDialog,
  Popup,
  Header,
  Content,
};
