import type {
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';

import type { CardOrientation } from './props.js';

// Presses on what a card's parts drag (a slider filling it, a channel, a
// segmented card's options): held back until they're a drag along it, a
// touch across it the page's scroll.

// How far a press moves before it's a drag (px; the grid's resize
// handle's, see Grid's edit.ts); a touch's (or a pen's), before it's told
// a drag (along the slider) from a scroll (across it), as a browser tells
// a pan.
export const pressSlop = 4;
export const touchSlop = 8;

// (A press handed on to the slider (see `pressProps`): let through; one
// held back, not yet a drag or a click: its touch held back too.)
let isHandingOn = false;
let isHolding = false;

/**
 * A slider's press (its `Slider.Root`'s props), held back at first (the
 * slider would set its value as it's pressed, and, a touch, follow it
 * even as the page scrolls, see Base UI's SliderControl):
 * - Moved (`pressSlop`; a touch, `touchSlop`) along it (a mouse, any
 *   way): a drag, handed on to the slider (the press again, where it
 *   started).
 * - A touch moved across it, or the browser panning (it's cancelled): a
 *   scroll, the page's, the slider never told.
 * - Released before: `onClick`'s, the slider never told (its value
 *   kept); its click, if the browser moves it to a control near it (e.g.
 *   the card's switch, a tap's target adjusted, as WebKit's on iOS), not
 *   that control's too (toggled back): swallowed (not the click deciding:
 *   on iOS, none may come to it). No `onClick`: handed on to the slider as
 *   it's released (its value set where it was pressed).
 */
export const pressProps = (
  onClick: (() => void) | undefined,
  orientation: CardOrientation,
): {
  onPointerDownCapture: (event: ReactPointerEvent<HTMLElement>) => void;
  onTouchStartCapture: (event: ReactTouchEvent<HTMLElement>) => void;
} => ({
  onPointerDownCapture: (event) => {
    if (isHandingOn || event.button !== 0) return;
    event.stopPropagation();
    // (The DOM's event: React's wraps it, Preact's is it.)
    const pressed =
      (event as { nativeEvent?: PointerEvent }).nativeEvent ??
      (event as unknown as PointerEvent);
    const { clientX, clientY, pointerId, pointerType, target } = pressed;
    const isMouse = pointerType === 'mouse';
    const slop = isMouse ? pressSlop : touchSlop;
    const root = event.currentTarget;
    const handOn = () => {
      isHandingOn = true;
      try {
        target?.dispatchEvent(new PointerEvent('pointerdown', pressed));
      } finally {
        isHandingOn = false;
      }
    };
    const listening = new AbortController();
    const options = { capture: true, signal: listening.signal };
    isHolding = true;
    listening.signal.addEventListener('abort', () => {
      isHolding = false;
    });
    addEventListener(
      'pointermove',
      (move) => {
        if (move.pointerId !== pointerId) return;
        const across = Math.abs(move.clientX - clientX);
        const upright = Math.abs(move.clientY - clientY);
        if (Math.hypot(across, upright) < slop) return;
        listening.abort();
        // (A touch across it: a scroll, let go.)
        const along = orientation === 'vertical' ? upright : across;
        const crossing = orientation === 'vertical' ? across : upright;
        if (!isMouse && crossing > along) return;
        handOn();
      },
      options,
    );
    addEventListener(
      'pointerup',
      (up) => {
        if (up.pointerId !== pointerId) return;
        listening.abort();
        // (No click of its own: the slider's, its value set there; this
        // release ending it, as it goes on.)
        if (onClick === undefined) {
          handOn();
          return;
        }
        onClick();
        // (Its click next, if any, elsewhere: swallowed; none before
        // another press or key, nothing.)
        const clicking = new AbortController();
        const once = { capture: true, signal: clicking.signal };
        addEventListener(
          'click',
          (clicked) => {
            clicking.abort();
            if (root.contains(clicked.target as Node | null)) return;
            clicked.preventDefault();
            clicked.stopPropagation();
          },
          once,
        );
        for (const type of ['pointerdown', 'keydown']) {
          addEventListener(type, () => clicking.abort(), once);
        }
      },
      options,
    );
    addEventListener(
      'pointercancel',
      (cancel) => {
        if (cancel.pointerId === pointerId) listening.abort();
      },
      options,
    );
  },
  // (The slider takes a touch's start too, unless its pointer's started
  // it (see Base UI's SliderControl), following it past a pan: held back
  // with it.)
  onTouchStartCapture: (event) => {
    if (isHolding) event.stopPropagation();
  },
});
