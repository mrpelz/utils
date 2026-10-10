import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { styled } from 'goober';
import { ComponentProps, forwardRef, PointerEvent, useRef } from 'react';

import { glassMedium } from './glass.js';
import { colorScheme, css } from './utils.js';

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

const part = 'data-sheet-part';

export type SheetDetent = 'large' | 'medium';

const Backdrop = styled(BaseDialog.Backdrop, forwardRef)`
  ${colorScheme(
    '--styled-sheet-dim: rgb(0 0 0 / 20%);',
    '--styled-sheet-dim: rgb(0 0 0 / 48%);',
  )}

  position: fixed;
  background-color: var(--styled-sheet-dim);
  inset: 0;
  transition: opacity 350ms;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const opaque = css`
  ${colorScheme(
    'background-color: var(--color-ios-system-background);',
    'background-color: var(--color-ios-secondary-system-background);',
  )}

  box-shadow: 0 15px 75px rgb(0 0 0 / 18%);
`;

const StyledPopup = styled(BaseDialog.Popup, forwardRef)`
  position: fixed;
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
  flex-direction: column;
  color: var(--color-ios-label);
  outline: none;
  transition: translate 350ms cubic-bezier(0.2, 0.9, 0.3, 1);
  translate: 0 var(--styled-sheet-drag, 0);

  &[data-starting-style],
  &[data-ending-style] {
    translate: 0 100%;
  }

  &[data-dragging] {
    transition: none;
  }

  &[data-detent='large'] {
    ${opaque}
    border-radius: 38px 38px 0 0;
    inset: calc(10px + env(safe-area-inset-top)) 0 0;
  }

  &[data-detent='medium'] {
    ${glassMedium()}
    right: 6px;
    bottom: calc(6px + env(safe-area-inset-bottom));
    left: 6px;
    max-height: calc(100% - 64px);
    border-radius: 34px;
    color: var(--styled-glass-content);
  }

  /* A form sheet (regular width). */
  @media (width >= 768px) {
    &&[data-detent] {
      ${opaque}
      width: min(936px, calc(100% - 64px));
      height: min(852px, calc(100% - 64px));
      border-radius: 38px;
      color: var(--color-ios-label);
      inset: 50% auto auto 50%;
      translate: -50% calc(-50% + var(--styled-sheet-drag, 0px));
    }

    &&[data-starting-style],
    &&[data-ending-style] {
      translate: -50% 100vh;
    }
  }
`;

export type SheetPopupProps = Omit<BaseDialog.Popup.Props, 'ref'> & {
  /**
   * Its height on an iPhone (compact width): the whole screen, or its
   * content's (a floating glass panel).
   * @default 'large'
   */
  detent?: SheetDetent;
};

/** The sheet, the page dimmed behind it. */
const Popup = forwardRef<HTMLDivElement, SheetPopupProps>(
  ({ detent = 'large', ...props }, ref) => (
    <BaseDialog.Portal>
      <Backdrop />
      <StyledPopup
        ref={ref}
        data-detent={detent}
        {...props}
      />
    </BaseDialog.Portal>
  ),
);

const StyledHeader = styled('div', forwardRef)`
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: stretch;
  cursor: grab;
  padding-block-end: 10px;
  touch-action: none;
  user-select: none;

  &::before {
    width: 36px;
    height: 5px;
    flex: none;
    align-self: center;
    border-radius: 100px;
    background-color: #cfcfcf;
    content: '';
    margin-block: 5px 6px;
  }
`;

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
      <StyledHeader
        ref={ref}
        {...{ [part]: 'header' }}
        {...props}
        onPointerDown={handlePointerDown}
      >
        {children}
        <BaseDialog.Close
          ref={closeRef}
          hidden
          tabIndex={-1}
        />
      </StyledHeader>
    );
  },
);

// Its content, scrolling.
const Content = styled('div', forwardRef)`
  overflow: auto;
  min-height: 0;
  flex: 1 1 auto;
  overscroll-behavior: contain;
`;

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
