import '../contextual-menu/style.css';

import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cutOut, fillIn, usePortalContainer } from '../utils/main.js';
import type { PortalContainer } from '../utils/props.js';
import type { GridOpenChangeReason } from './props.js';

// An item opened above the page (see `Grid.Item`'s `open`): its tile's
// body lifted out of the grid (its stand-in keeping its place, nothing
// below reflowing), in the middle of the screen (its portal container's:
// a device's screen in a page of demos, else the window; beside a sidebar,
// see `roomOf`) at its open size, above the page dimmed (a contextual
// menu's backdrop, the same); the live body, never remounted (what's in
// it keeps its state). Placed as it opens, again as the screen or its
// place changes; getting there (and back, still lifted, closing) as any
// change of its tile's box (see reshape.ts).
//
// As a contextual menu's trigger is lifted (see ContextualMenu), above
// the backdrop cut out where it is (a mask, as the menu's; and a clip
// path: what's lifted takes presses there, even where its ancestors'
// stacking contexts keep it below the backdrop; what covers it in its
// page too, e.g. a sidebar floating over its column, where it overlaps
// it): where it's drawn, each frame as it moves. Under it, in its grid
// (its stacking context), an underlay: opaque (nothing bright beside it
// showing through its glass), its glass again only as it's nearly back.
//
// Also:
// - Modal: focus moved onto it (back where it was, closed), Tab kept in
//   it; Escape, a press on the backdrop close it (`onOpenChange`'s
//   reason). A dialog, labeled (`openLabel`).
// - Its backdrop fading in and out as the menu's (its starting and ending
//   styles, as Base UI's).

/** Its margin from the screen's edges, open. */
const margin = 16;

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

/**
 * What covers it in its page, above its stacking contexts (which keep it
 * below): a floating layout column beside its own (e.g. a sidebar over
 * the content), cut out where it is too, as the backdrop.
 */
const coversOf = (element: HTMLElement) =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-layout-part="column"][data-floating]',
    ),
  ).filter(
    (column) =>
      !column.contains(element) && !Object.hasOwn(column.dataset, 'closed'),
  );

/**
 * The room it's centered in: its screen, less what covers it at either
 * side (see `coversOf`, e.g. a sidebar): opened beside it, not under it
 * (its cutout there would make it its glass's backdrop root, its blur
 * seeing nothing behind it); all of the screen, if that's too narrow.
 */
const roomOf = (screen: DOMRect, covers: readonly HTMLElement[]): Box => {
  let { left, right } = screen;
  for (const cover of covers) {
    const rect = cover.getBoundingClientRect();
    if (rect.right <= left || rect.left >= right) continue;
    if (rect.left <= left + 1) left = Math.max(left, rect.right);
    else if (rect.right >= right - 1) right = Math.min(right, rect.left);
  }
  return right - left < screen.width / 2
    ? screen
    : { height: screen.height, left, top: screen.top, width: right - left };
};

/** Whether two boxes overlap. */
const isOverlapping = (a: Box, b: DOMRect) =>
  a.left < b.right &&
  b.left < a.left + a.width &&
  a.top < b.bottom &&
  b.top < a.top + a.height;

/**
 * Where it's lifted to: its open size (fitted to the screen, less its
 * margins), in the screen's middle.
 */
const targetOf = (
  screen: Box,
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

/** A rect as a box. */
const boxOf = ({ height, left, top, width }: DOMRectReadOnly): Box => ({
  height,
  left,
  top,
  width,
});

/**
 * An item's overlay (see the top): its phase (open, or closing back to its
 * place, still lifted; none: in the grid), its backdrop (a portal) and its
 * underlay, both rendered by the item while it's shown; `settle`, for the
 * item to call once it's back (closing ends); its stand-in, the item's.
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
  /** Its stand-in (see `Item`): rendered while it's shown. */
  standIn: RefObject<HTMLSpanElement | null>;
}): {
  backdrop: ReactNode;
  phase: 'closing' | 'open' | undefined;
  settle: () => void;
  underlay: ReactNode;
} => {
  // (Closed: closing at once, in the same render (still lifted, getting
  // back to its place), then in the grid, settled.)
  const [isClosing, setIsClosing] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    setIsClosing(!isOpen);
  }
  const isShown = isOpen || isClosing;
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const underlayRef = useRef<HTMLDivElement | null>(null);
  const container = elementOf(usePortalContainer(undefined));
  const latest = useRef({ onClose, size });
  useLayoutEffect(() => {
    latest.current = { onClose, size };
  });

  // (Placed: open, its room's middle (see `roomOf`); closing, its place
  // (its stand-in's); again as the screen or its place changes. The
  // backdrop's cutout, the underlay's clip where it's drawn, each frame
  // while it's moving.)
  useLayoutEffect(() => {
    const element = body.current;
    const place = standIn.current;
    const backdrop = backdropRef.current;
    const underlay = underlayRef.current;
    if (!isShown || !element || !place || !backdrop || !underlay) {
      return undefined;
    }
    const { style } = element;
    const set = (name: string, value: number) =>
      style.setProperty(`--uikit-grid-open-${name}`, `${String(value)}px`);
    const covers = coversOf(element);
    const cut = () => {
      const box = boxOf(element.getBoundingClientRect());
      const radius = radiusOf(element);
      underlay.style.clipPath = clipOf(underlay, box, radius, false);
      // (What covers it cut out only where it overlaps it: too wide for the
      // room beside it.)
      for (const layer of [backdrop, ...covers]) {
        if (
          layer === backdrop ||
          isOverlapping(box, layer.getBoundingClientRect())
        ) {
          cutOut(layer, box, radius);
          layer.style.clipPath = clipOf(layer, box, radius, true);
        } else {
          fillIn(layer);
          layer.style.removeProperty('clip-path');
        }
      }
    };
    const locate = () => {
      const home = place.getBoundingClientRect();
      const box = isOpen
        ? targetOf(
            roomOf(backdrop.getBoundingClientRect(), covers),
            latest.current.size,
          )
        : boxOf(home);
      set('left', place.offsetLeft);
      set('top', place.offsetTop);
      set('width', box.width);
      set('height', box.height);
      set('x', box.left - home.left);
      set('y', box.top - home.top);
    };
    locate();
    cut();
    // (Moving (see reshape.ts): cut where it's drawn, each frame, until
    // it's there.)
    let frame = requestAnimationFrame(function follow() {
      cut();
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
      frame = Object.hasOwn(element.dataset, 'gridReshaping')
        ? requestAnimationFrame(follow)
        : 0;
    });
    const draw = () => {
      locate();
      cut();
    };
    const observer = new ResizeObserver(draw);
    observer.observe(backdrop);
    // (Its place scrolled (it's in the page, lifted): placed anew.)

    addEventListener('scroll', draw, { capture: true, passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener('scroll', draw, { capture: true });
      for (const layer of [backdrop, ...covers]) {
        fillIn(layer);
        layer.style.removeProperty('clip-path');
      }
    };
  }, [body, isOpen, isShown, standIn]);

  // (Back in the grid: its values gone.)
  useLayoutEffect(() => {
    const element = body.current;
    if (isShown || !element) return;
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
  const settle = useCallback(() => setIsClosing(false), []);
  return {
    backdrop:
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
    phase,
    settle,
    underlay: isShown ? (
      <div
        ref={underlayRef}
        aria-hidden="true"
        className="uikit-grid-underlay"
        data-grid-part="underlay"
      />
    ) : null,
  };
};
