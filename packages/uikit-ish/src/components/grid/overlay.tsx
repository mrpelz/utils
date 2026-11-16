import '../contextual-menu/style.css';

import {
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cutOut, fillIn, usePortalContainer } from '../utils/main.js';
import type { PortalContainer } from '../utils/props.js';
import type { GridOpenChangeReason } from './props.js';

/**
 * An item's body resized by its grid (lifted above the page, each frame):
 * dispatched on it, for what's in it (e.g. a card) to lay out anew then.
 */
export const gridResizeEvent = 'uikit-grid-resize';

// An item opened above the page (see `Grid.Item`'s `open`): its tile's
// body lifted out of the grid (its stand-in keeping its place, nothing
// below reflowing), moved to the middle of the screen (its portal
// container's: a device's screen in a page of demos, else the window) and
// grown to its open size, above the page blurred (a contextual menu's
// backdrop, the same); the live body, never remounted (what's in it keeps
// its state).
//
// As a contextual menu's trigger is lifted (see ContextualMenu), above
// the backdrop cut out where it is (a mask, as the menu's, its blur too;
// and a clip path: what's lifted takes presses there, even where its
// ancestors' stacking contexts keep it below the backdrop); moved and
// resized each frame by a script (not a transition: its cutout moving
// with it), what's in it laid out anew at each size and told so
// (`gridResizeEvent`, e.g. a card's parts gliding, see Card). Under it, in
// its grid (its stacking context), an underlay: opaque at once as it
// opens (nothing bright beside it showing through), its glass again only
// as it's nearly back; its stand-in faded as long.
//
// Also:
// - Modal: focus moved onto it (back where it was, closed), Tab kept in
//   it; Escape, a press on the backdrop close it (`onOpenChange`'s
//   reason). A dialog, labeled (`openLabel`).
// - Closing: back to its stand-in's place, then in the grid again.
// - Its backdrop fading in and out as the menu's (its starting and ending
//   styles, as Base UI's); itself by its position and size only (opened
//   by a click, nothing at a touch's start). Its corner buttons: one going
//   at the start of the move, one coming at its end (see the CSS).

/** Its margin from the screen's edges, open. */
const margin = 16;

/**
 * How long it takes to open or close (its move, see `useOverlay`); closed,
 * how long it stays lifted after it (its underlay fading back, see the
 * CSS).
 */
const duration = 350;
const settling = 250;

/** A portal's container, resolved (a ref's element; none: the body). */
const elementOf = (container: PortalContainer | null | undefined) => {
  const resolved =
    container && 'current' in container ? container.current : container;
  return resolved ?? (typeof document === 'undefined' ? null : document.body);
};

/** Focusable elements in an element, in order (for keeping Tab in it). */
const focusablesIn = (element: HTMLElement) =>
  [
    ...element.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter(
    (each) =>
      !each.closest('[inert]') &&
      !(each as HTMLButtonElement).disabled &&
      each.getClientRects().length > 0,
  );

/** A box on screen (where it's drawn in a frame, see `useOverlay`). */
type Box = { height: number; left: number; top: number; width: number };

/** A rounded rect's outline (a hole in a clip path, see `clipOf`). */
const roundedRect = (
  { height, left, top, width }: Box,
  radius: number,
  [dx, dy]: readonly [number, number],
) => {
  const n = (value: number) => String(Math.round(value * 100) / 100);
  const r = Math.min(radius, width / 2, height / 2);
  const x = left - dx;
  const y = top - dy;
  return [
    `M${n(x + r)} ${n(y)}H${n(x + width - r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${n(x + width)} ${n(y + r)}`,
    `V${n(y + height - r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${n(x + width - r)} ${n(y + height)}`,
    `H${n(x + r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${n(x)} ${n(y + height - r)}`,
    `V${n(y + r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${n(x + r)} ${n(y)}Z`,
  ].join('');
};

/**
 * Its corners' radius: what's in it's (e.g. a card's: what shows), else
 * its own, else an item's.
 */
const radiusOf = (body: HTMLElement) =>
  Number.parseFloat(
    getComputedStyle(body.firstElementChild ?? body).borderTopLeftRadius,
  ) ||
  Number.parseFloat(getComputedStyle(body).borderTopLeftRadius) ||
  Number.parseFloat(
    getComputedStyle(body).getPropertyValue('--uikit-grid-item-radius'),
  ) ||
  24;

/**
 * A layer's clip path by where the body is: the backdrop's, a hole there
 * (even-odd, its box first); the underlay's, only there (see `useOverlay`).
 */
const clipOf = (
  layer: HTMLElement,
  box: Box,
  radius: number,
  isHole: boolean,
) => {
  const outer = layer.getBoundingClientRect();
  const shape = roundedRect(box, radius, [outer.left, outer.top]);
  if (!isHole) return `path("${shape}")`;
  const whole = `M0 0H${String(outer.width)}V${String(outer.height)}H0Z`;
  return `path(evenodd, "${whole}${shape}")`;
};

/** Its move's easing (decelerating). */
const ease = (t: number) => 1 - (1 - t) ** 3;

/** A box between two (`t`, 0 to 1). */
const between = (from: Box, to: Box, t: number): Box => ({
  height: from.height + (to.height - from.height) * t,
  left: from.left + (to.left - from.left) * t,
  top: from.top + (to.top - from.top) * t,
  width: from.width + (to.width - from.width) * t,
});

/**
 * Where it's lifted to: its open size (fitted to the screen, less its
 * margins), in the screen's middle.
 */
const targetOf = (
  screen: DOMRect,
  [width, height]: readonly [number, number],
): Box => {
  const w = Math.min(width, screen.width - 2 * margin);
  const h = Math.min(height, screen.height - 2 * margin);
  return {
    height: h,
    left: screen.left + (screen.width - w) / 2,
    top: screen.top + (screen.height - h) / 2,
    width: w,
  };
};

/**
 * An item's overlay (see the top): its phase (open, or closing back to its
 * place; none: in the grid), its backdrop (a portal) and its underlay,
 * both rendered by the item; its stand-in, the item's, given once it's
 * rendered.
 */
export const useOverlay = ({
  body,
  isOpen,
  onClose,
  size,
  standIn,
}: {
  body: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: (reason: GridOpenChangeReason) => void;
  /** Its open size, in pixels. */
  size: readonly [number, number];
  /** Its stand-in, once it's rendered (see `Item`). */
  standIn: HTMLSpanElement | null;
}): readonly [
  phase: 'closing' | 'open' | undefined,
  backdrop: ReactNode,
  underlay: ReactNode,
] => {
  // (Closed: closing at once, in the same render (back to its place,
  // moving there), then in the grid.)
  const [isClosing, setIsClosing] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    setIsClosing(!isOpen);
  }
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const underlayRef = useRef<HTMLDivElement | null>(null);
  const container = elementOf(usePortalContainer(undefined));
  const latest = useRef({ onClose, size });
  useLayoutEffect(() => {
    latest.current = { onClose, size };
  });

  useEffect(() => {
    if (!isClosing) return undefined;
    const timer = setTimeout(() => setIsClosing(false), duration + settling);
    return () => clearTimeout(timer);
  }, [isClosing]);

  const isShown = isOpen || isClosing;

  // (Where it was drawn last: closing, it moves back from there.)
  const drawn = useRef<Box | undefined>(undefined);

  // (Moved each frame, by its own clock (not a transition): from where it
  // is (its place, or where it was drawn last) to where it goes (the
  // screen's middle, or its place again), its place (its stand-in's) and
  // the screen followed; the backdrop's cutout, its clip, the underlay's
  // from the same box, in the same frame. What's in it laid out at its
  // size as it goes (a card's parts gliding where its layout changes, see
  // Card).)
  useLayoutEffect(() => {
    const element = body.current;
    const place = standIn;
    const backdrop = backdropRef.current;
    const underlay = underlayRef.current;
    if (!isShown || !element || !place || !backdrop || !underlay) {
      return undefined;
    }
    const { style } = element;
    const set = (name: string, value: number) =>
      style.setProperty(`--uikit-grid-open-${name}`, `${String(value)}px`);
    const from = drawn.current ?? place.getBoundingClientRect();
    const start = performance.now();
    const draw = () => {
      const home = place.getBoundingClientRect();
      const to = isOpen
        ? targetOf(backdrop.getBoundingClientRect(), latest.current.size)
        : home;
      const t = Math.min(1, (performance.now() - start) / duration);
      const box = between(from, to, ease(t));
      drawn.current = box;
      set('left', place.offsetLeft);
      set('top', place.offsetTop);
      set('width', box.width);
      set('height', box.height);
      set('x', box.left - home.left);
      set('y', box.top - home.top);
      // (Told, as it's resized (what's in it laying out anew in the same
      // frame, see Card: not a resize observer's, a frame late in WebKit).)
      element.dispatchEvent(new Event(gridResizeEvent));
      const radius = radiusOf(element);
      cutOut(backdrop, box, radius);
      backdrop.style.clipPath = clipOf(backdrop, box, radius, true);
      underlay.style.clipPath = clipOf(underlay, box, radius, false);
    };
    draw();
    let frame = requestAnimationFrame(function follow() {
      draw();
      // (Faded in once it's shown, out as it closes: as Base UI's.)
      delete backdrop.dataset.startingStyle;
      if (isOpen) {
        delete backdrop.dataset.endingStyle;
        underlay.dataset.gridOpen = '';
        delete place.dataset.gridClosing;
      } else {
        backdrop.dataset.endingStyle = '';
        delete underlay.dataset.gridOpen;
        place.dataset.gridClosing = '';
      }
      frame = requestAnimationFrame(follow);
    });
    return () => {
      cancelAnimationFrame(frame);
      fillIn(backdrop);
    };
  }, [body, isOpen, isShown, standIn]);

  // (Gone: its values too.)
  useLayoutEffect(() => {
    if (isShown) return;
    const element = body.current;
    if (!element) return;
    drawn.current = undefined;
    for (const name of ['left', 'top', 'width', 'height', 'x', 'y']) {
      element.style.removeProperty(`--uikit-grid-open-${name}`);
    }
  }, [body, isShown]);

  // (Modal: focus onto it, back where it was once closed; Tab kept in it,
  // Escape closing it.)
  useEffect(() => {
    const element = body.current;
    if (!isOpen || !element) return undefined;
    const before =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : undefined;
    element.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        latest.current.onClose('escape-key');
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = focusablesIn(element);
      const first = focusables[0];
      const last = focusables.at(-1);
      const active = document.activeElement;
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      if (!element.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === element)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, { capture: true });
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      if (before?.isConnected) before.focus({ preventScroll: true });
    };
  }, [body, isOpen]);

  let phase: 'closing' | 'open' | undefined;
  if (isOpen) phase = 'open';
  else if (isClosing) phase = 'closing';
  return [
    phase,
    isShown && container
      ? createPortal(
          <div
            ref={backdropRef}
            aria-hidden="true"
            className="uikit-contextual-menu-backdrop uikit-grid-backdrop"
            data-grid-part="backdrop"
            data-starting-style=""
            onClick={() => latest.current.onClose('outside-press')}
          />,
          container,
        )
      : null,
    isShown ? (
      <div
        ref={underlayRef}
        aria-hidden="true"
        className="uikit-grid-underlay"
        data-grid-part="underlay"
      />
    ) : null,
  ] as const;
};
