import { RefObject, useLayoutEffect } from 'react';

import { isKeyboardShown, tapSlop, textField } from './input.js';

// A text field typed into, scrolled into view above the keyboard: by its
// scroller, once the keyboard has shown and everything has settled (e.g.
// the content layer resized above it, an island pushed up with its
// anchor), not as it's focused (iOS' own scroll is kept off: it moves the
// layout viewport, see `preventFocusShift`). Again as focus moves to
// another field (e.g. the keyboard's ▲▼ buttons) and as it's typed into
// (e.g. a textarea growing); not once the user has scrolled it away since,
// until then. Its scroller: the nearest marked one around it
// (`data-viewport-focus-scroll`, see `useFocusScroll`): `target`, scrolled
// (e.g. the content layer, a page, a sheet's or an island's content);
// `none`, nothing (e.g. a keyboard accessory, lifting it instead); none
// marked, nothing. Never another scroller (`scrollIntoView` would scroll
// all of them, the layout viewport too).

export const focusScrollAttribute = 'data-viewport-focus-scroll';

/** What a marked element is to the fields in it (see above). */
export type FocusScrollMode = 'none' | 'target';

/**
 * Marks `ref`'s element (while mounted, and `mode` isn't `false`): as the
 * scroller that keeps the text fields in it in view above the keyboard
 * (`target`), or as keeping those in it as they are (`none`: e.g. a
 * component placing them itself). The nearest marked element around a
 * field decides (see `Viewport`).
 */
export const useFocusScroll = (
  ref: RefObject<HTMLElement | null>,
  mode: FocusScrollMode | false = 'target',
): void => {
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element || mode === false) return undefined;
    element.setAttribute(focusScrollAttribute, mode);
    return () => {
      element.removeAttribute(focusScrollAttribute);
    };
  }, [mode, ref]);
};

/** Kept between a field's end (or start) and the visible area's edge (px). */
const gap = 8;

/** Frames waited at most for everything to settle (see `settle`). */
const maxFrames = 60;

/** A scroll padding's length (px; `auto`, none). */
const lengthOf = (value: string) => Number.parseFloat(value) || 0;

/**
 * What shows of `scroller` (top and bottom, in the layout viewport): its
 * box, less its scroll padding (the bars over it, see `Padding`), above the
 * keyboard, and above the bars the keyboard pushes up outside it (bottom
 * anchors of `keyboard` `push`, on the keyboard: e.g. a message field's).
 */
const visibleOf = (scroller: HTMLElement) => {
  const box = scroller.getBoundingClientRect();
  const style = getComputedStyle(scroller);
  let top = box.top + lengthOf(style.scrollPaddingTop);
  let bottom = box.bottom - lengthOf(style.scrollPaddingBottom);
  const { visualViewport: viewport } = window;
  if (!viewport) return { bottom, top };
  const keyboardTop = viewport.offsetTop + viewport.height;
  top = Math.max(top, viewport.offsetTop);
  bottom = Math.min(bottom, keyboardTop);
  for (const anchor of document.querySelectorAll<HTMLElement>(
    '[data-viewport-part=anchor][data-edge=block-end][data-keyboard=push]',
  )) {
    if (anchor.contains(scroller) || !anchor.checkVisibility()) continue;
    const rect = anchor.getBoundingClientRect();
    const isOver =
      rect.height > 0 &&
      rect.left < box.right &&
      rect.right > box.left &&
      rect.bottom >= keyboardTop - 1;
    if (isOver) bottom = Math.min(bottom, rect.top);
  }
  return { bottom, top };
};

/**
 * How far `scroller` scrolls to show `field`: its whole, `gap` from the
 * visible area's edges; taller than that area, its end (where its caret
 * usually is). In view already: 0.
 */
const distanceTo = (field: HTMLElement, scroller: HTMLElement) => {
  const { bottom, top } = visibleOf(scroller);
  if (bottom <= top) return 0;
  const rect = field.getBoundingClientRect();
  const isTall = rect.height + gap * 2 > bottom - top;
  const toEnd = rect.bottom + gap - bottom;
  if (toEnd > 0) return toEnd;
  if (isTall) return rect.bottom - gap < top ? toEnd : 0;
  return rect.top - gap < top ? rect.top - gap - top : 0;
};

/**
 * Keeps the text fields focused in `owns` scrolled into view above the
 * keyboard (see above), until the returned function stops it.
 */
const track = (owns: (field: Element) => boolean): (() => void) => {
  // The focused field, and its scroller (none: nothing to do).
  let field: HTMLElement | undefined;
  let scroller: HTMLElement | undefined;
  // Scrolled away by the user since it was focused (or last typed into).
  let isAway = false;
  // A touch on the screen (scrolling maybe: nothing scrolled meanwhile), and
  // where it started.
  let touch: { x: number; y: number } | undefined;
  let frame = 0;

  const reveal = () => {
    if (
      !field ||
      !scroller ||
      isAway ||
      touch ||
      document.activeElement !== field ||
      !isKeyboardShown()
    ) {
      return;
    }
    // (Scrolling now: e.g. not an island's content below its top stop.)
    const { overflowY } = getComputedStyle(scroller);
    if (overflowY !== 'auto' && overflowY !== 'scroll') return;
    const distance = distanceTo(field, scroller);
    if (Math.abs(distance) < 1) return;
    scroller.scrollBy({ behavior: 'smooth', top: distance });
  };

  // Once everything has settled (the field and its scroller unmoved for two
  // frames, the visual viewport too: e.g. the keyboard shown, the content
  // layer resized, an island pushed up, each transitioning), revealed.
  const settle = () => {
    cancelAnimationFrame(frame);
    if (!field || !scroller) return;
    let last = '';
    let frames = 0;
    let stable = 0;
    const step = () => {
      if (!field || !scroller) return;
      const a = field.getBoundingClientRect();
      const b = scroller.getBoundingClientRect();
      const { visualViewport: viewport } = window;
      const key = [
        a.top,
        a.bottom,
        b.top,
        b.bottom,
        viewport?.height,
        viewport?.offsetTop,
      ].join(',');
      frames += 1;
      stable = key === last ? stable + 1 : 0;
      if (stable >= 2 || frames >= maxFrames) {
        reveal();
        return;
      }
      last = key;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  };

  // (The field or its scroller resized: e.g. a textarea growing, the
  // content layer resized above the keyboard.)
  const resizes = new ResizeObserver(settle);

  const leave = () => {
    cancelAnimationFrame(frame);
    resizes.disconnect();
    field = undefined;
    scroller = undefined;
  };

  const onFocusIn = ({ target }: FocusEvent) => {
    leave();
    if (
      !(target instanceof HTMLElement) ||
      !target.matches(textField) ||
      !owns(target)
    ) {
      return;
    }
    const marked = target.closest<HTMLElement>('[data-viewport-focus-scroll]');
    if (marked?.getAttribute(focusScrollAttribute) !== 'target') return;
    field = target;
    scroller = marked;
    isAway = false;
    resizes.observe(scroller);
    resizes.observe(field);
    settle();
  };
  const onFocusOut = ({ target }: FocusEvent) => {
    if (target === field) leave();
  };
  const onInput = ({ target }: Event) => {
    if (target !== field) return;
    isAway = false;
    settle();
  };
  const onTouchStart = (event: TouchEvent) => {
    const [first] = event.touches;
    touch = first ? { x: first.clientX, y: first.clientY } : undefined;
  };
  const onTouchMove = (event: TouchEvent) => {
    const [first] = event.touches;
    if (!touch || !first || !scroller?.contains(event.target as Node)) return;
    const moved = Math.hypot(first.clientX - touch.x, first.clientY - touch.y);
    if (moved > tapSlop) isAway = true;
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length > 0) return;
    touch = undefined;
    settle();
  };
  const onWheel = ({ target }: WheelEvent) => {
    if (scroller?.contains(target as Node)) isAway = true;
  };

  const options = { capture: true, passive: true };
  const listeners = [
    ['focusin', onFocusIn],
    ['focusout', onFocusOut],
    ['input', onInput],
    ['touchstart', onTouchStart],
    ['touchmove', onTouchMove],
    ['touchend', onTouchEnd],
    ['touchcancel', onTouchEnd],
    ['wheel', onWheel],
  ] as [string, (event: Event) => void][];
  for (const [type, listener] of listeners) {
    document.addEventListener(type, listener, options);
  }
  const { visualViewport: viewport } = window;
  viewport?.addEventListener('resize', settle);

  // (Focused already: e.g. a popup's initial focus, before this.)
  const { activeElement } = document;
  if (activeElement instanceof HTMLElement) {
    onFocusIn({ target: activeElement } as unknown as FocusEvent);
  }

  return () => {
    leave();
    for (const [type, listener] of listeners) {
      document.removeEventListener(type, listener, options);
    }
    viewport?.removeEventListener('resize', settle);
  };
};

/** Each scope's tracking, and its holds (see `trackFocusScroll`). */
type Hold = { count: number; stop: () => void };
const holds = new Map<Element | null, Hold>();

/**
 * Keeps the text fields focused in `screen` (a provider's, not the window)
 * scrolled into view above the keyboard (see above); without one, those in
 * no screen (`screenSelector`), until the returned function lets go of it.
 * Held by each provider: once per screen (or the window), not again by
 * another (e.g. nested), each scrolling it anew.
 */
export const trackFocusScroll = (
  screen: Element | null,
  screenSelector: string,
): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const held = holds.get(screen) ?? {
    count: 0,
    stop: track((field) =>
      screen ? screen.contains(field) : field.closest(screenSelector) === null,
    ),
  };
  held.count += 1;
  holds.set(screen, held);
  let isHeld = true;
  return () => {
    if (!isHeld) return;
    isHeld = false;
    held.count -= 1;
    if (held.count > 0) return;
    held.stop();
    holds.delete(screen);
  };
};
