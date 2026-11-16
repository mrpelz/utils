import '../contextual-menu/style.css';

import {
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import { cutOut, fillIn, usePortalContainer } from '../utils/main.js';
import type { PortalContainer } from '../utils/props.js';
import type { GridOpenChangeReason } from './props.js';
import { whenGridTransitioned } from './transition.js';

// An item opened above the page (see `Grid.Item`'s `open`): its tile's
// body lifted out of the grid (its stand-in keeping its place, nothing
// below reflowing), in the middle of the screen (its portal container's:
// a device's screen in a page of demos, else the window) at its open size,
// above the page dimmed (a contextual menu's backdrop, the same); the
// live body, never remounted (what's in it keeps its state). Placed once
// as it opens, again as the screen or its place changes; getting there
// (and back) is a view transition's (see transition.ts).
//
// As a contextual menu's trigger is lifted (see ContextualMenu), above
// the backdrop cut out where it is (a mask, as the menu's;
// and a clip path: what's lifted takes presses there, even where its
// ancestors' stacking contexts keep it below the backdrop; what covers it
// in its page too, e.g. a sidebar floating over its column): cut out once
// it's there (not in the transition's snapshots: a hole in the dim
// as the tile moves; nor as it closes, see transition.ts). Under it, in
// its grid (its stacking context), an underlay: opaque (nothing bright
// beside it showing through its glass).
//
// Also:
// - Modal: focus moved onto it (back where it was, closed), Tab kept in
//   it; Escape, a press on the backdrop close it (`onOpenChange`'s
//   reason). A dialog, labeled (`openLabel`).
// - Its backdrop fading in as the menu's (its starting style, as Base
//   UI's).

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
  ).filter((column) => !column.contains(element));

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
 * An item's overlay (see the top): its backdrop (a portal) and its
 * underlay, both rendered by the item while it's open; its stand-in, the
 * item's, given once it's rendered.
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
}): readonly [backdrop: ReactNode, underlay: ReactNode] => {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const underlayRef = useRef<HTMLDivElement | null>(null);
  const container = elementOf(usePortalContainer(undefined));
  const latest = useRef({ onClose, size });
  useLayoutEffect(() => {
    latest.current = { onClose, size };
  });

  // (Placed: the screen's middle, from its place (its stand-in's), as the
  // screen or its place changes; the underlay's clip there, the backdrop's
  // cutout once the transition's done.)
  useLayoutEffect(() => {
    const element = body.current;
    const place = standIn;
    const backdrop = backdropRef.current;
    const underlay = underlayRef.current;
    if (!isOpen || !element || !place || !backdrop || !underlay) {
      return undefined;
    }
    const { style } = element;
    const set = (name: string, value: number) =>
      style.setProperty(`--uikit-grid-open-${name}`, `${String(value)}px`);
    let isCut = false;
    const covers = coversOf(element);
    const draw = () => {
      const home = place.getBoundingClientRect();
      const box = targetOf(
        backdrop.getBoundingClientRect(),
        latest.current.size,
      );
      set('left', place.offsetLeft);
      set('top', place.offsetTop);
      set('width', box.width);
      set('height', box.height);
      set('x', box.left - home.left);
      set('y', box.top - home.top);
      const radius = radiusOf(element);
      underlay.style.clipPath = clipOf(underlay, box, radius, false);
      if (!isCut) return;
      for (const layer of [backdrop, ...covers]) {
        cutOut(layer, box, radius);
        layer.style.clipPath = clipOf(layer, box, radius, true);
      }
    };
    draw();
    let isGone = false;
    whenGridTransitioned()
      .then(() => {
        if (isGone) return;
        isCut = true;
        draw();
      })
      .catch(() => undefined);
    // (Faded in once it's shown: as Base UI's.)
    const frame = requestAnimationFrame(() => {
      delete backdrop.dataset.startingStyle;
    });
    const observer = new ResizeObserver(draw);
    observer.observe(backdrop);
    // (Its place scrolled (it's in the page, lifted): placed anew.)
    // eslint-disable-next-line unicorn/prefer-observer-apis -- following its place as the page scrolls, not its visibility
    addEventListener('scroll', draw, { capture: true, passive: true });
    return () => {
      isGone = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener('scroll', draw, { capture: true });
      for (const layer of [backdrop, ...covers]) {
        fillIn(layer);
        layer.style.removeProperty('clip-path');
      }
      for (const name of ['left', 'top', 'width', 'height', 'x', 'y']) {
        style.removeProperty(`--uikit-grid-open-${name}`);
      }
    };
  }, [body, isOpen, standIn]);

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

  return [
    isOpen && container
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
    isOpen ? (
      <div
        ref={underlayRef}
        aria-hidden="true"
        className="uikit-grid-underlay"
        data-grid-part="underlay"
      />
    ) : null,
  ] as const;
};
