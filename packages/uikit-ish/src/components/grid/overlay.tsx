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
import { withoutAnimations } from './reshape.js';

// An item opened above the page (see `Grid.Item`'s `open`): its tile's
// body lifted out of the grid (its stand-in keeping its place, nothing
// below reflowing), in the middle of the screen (its portal container's:
// a device's screen in a page of demos, else the window; over a sidebar
// too, see `coversOf`) at its open size, above the page dimmed (a contextual
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

/** The size a reshape's getting to, on its tile (see reshape.ts). */
const tileVariables = ['--uikit-grid-tile-width', '--uikit-grid-tile-height'];

/**
 * A body's size, its reshape set aside meanwhile, not given up: the
 * animations in it, and the size it's getting to, what's in it laid out
 * at (see reshape.ts): its content's own, as it'll be.
 */
const measureAside = (element: HTMLElement): readonly [number, number] => {
  const { style } = element;
  const tile = tileVariables.map(
    (name) => [name, style.getPropertyValue(name)] as const,
  );
  for (const [name] of tile) style.removeProperty(name);
  const size = withoutAnimations(
    element,
    () => [element.offsetWidth, element.offsetHeight] as const,
  );
  for (const [name, value] of tile) {
    if (value !== '') style.setProperty(name, value);
  }
  return size;
};

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
  retarget,
  size,
  standIn,
}: {
  body: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: (reason: GridOpenChangeReason) => void;
  /**
   * Its reshape drawn to the box it has now (see reshape.ts): its content's
   * size measured again (see `sizeOf`).
   */
  retarget: RefObject<(() => void) | undefined>;
  /**
   * Its open size, in pixels, or its content's (`content`, see
   * `GridOpenSize`); `floor`, the least a content's is (px).
   */
  size: {
    floor: readonly [number, number];
    height: number | 'content';
    width: number | 'content';
  };
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

  // (Placed: open, its screen's middle; closing, its place
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
    const set = (name: string, value: number | string) =>
      style.setProperty(
        `--uikit-grid-open-${name}`,
        typeof value === 'number' ? `${String(value)}px` : value,
      );
    const unset = (name: string) =>
      style.removeProperty(`--uikit-grid-open-${name}`);
    // (Its content's size, last measured (see `locate`).)
    let measured: readonly [number, number] | undefined;
    const covers = coversOf(element);
    // (Open: where it's going, see `locate`.)
    let target: Box | undefined;
    const cut = () => {
      const box = boxOf(element.getBoundingClientRect());
      const radius = radiusOf(element);
      underlay.style.clipPath = clipOf(underlay, box, radius, false);
      // (What covers it cut out only where it overlaps it; marked
      // overlaid (`data-overlaid`) already as it opens, where it's going
      // overlapping it, until it's no longer cut out closing: its glass's
      // shadows outside, clipped at its edge, faded beforehand, see Glass.)
      for (const layer of [backdrop, ...covers]) {
        const rect = layer.getBoundingClientRect();
        const isCut = layer === backdrop || isOverlapping(box, rect);
        if (isCut) {
          cutOut(layer, box, radius);
          layer.style.clipPath = clipOf(layer, box, radius, true);
        } else {
          fillIn(layer);
          layer.style.removeProperty('clip-path');
        }
        if (layer === backdrop) continue;
        const isOverlaid =
          isCut || (target !== undefined && isOverlapping(target, rect));
        layer.toggleAttribute('data-overlaid', isOverlaid);
      }
    };
    // (Its content's size, open (`+`, see `GridOpenSize`): left to its
    // CSS (`max-content`, `auto`; at least its floor, at most the screen,
    // less its margins), read off it, so it's centered: as it opens (its
    // animations from before given up, as its reshape does next), and as
    // it changes, not while it's reshaping (drawn at its animated size,
    // as last measured).)
    const sizeOf = (screen: Box, mode: 'again' | 'opening' | 'placed') => {
      const { floor, height, width } = latest.current.size;
      const most = [screen.width - 2 * margin, screen.height - 2 * margin];
      const dimensions = [
        ['width', width, 'max-content'],
        ['height', height, 'auto'],
      ] as const;
      for (const [index, [name, value, content]] of dimensions.entries()) {
        const limit = most[index] ?? 0;
        if (value === 'content') {
          set(name, content);
          set(`min-${name}`, Math.min(floor[index] ?? 0, limit));
          set(`max-${name}`, limit);
        } else {
          set(name, Math.min(value, limit));
          unset(`min-${name}`);
          unset(`max-${name}`);
        }
      }
      if (width !== 'content' && height !== 'content') {
        return [
          Math.min(width, most[0] ?? 0),
          Math.min(height, most[1] ?? 0),
        ] as const;
      }
      const isReshaping = Object.hasOwn(element.dataset, 'gridReshaping');
      if (mode === 'opening') {
        for (const animation of element.getAnimations()) animation.cancel();
      } else if (mode === 'placed' && isReshaping && measured) {
        return measured;
      }
      measured = measureAside(element);
      return measured;
    };
    const locate = (mode: 'again' | 'opening' | 'placed' = 'placed') => {
      const home = place.getBoundingClientRect();
      if (isOpen) {
        const screen = boxOf(backdrop.getBoundingClientRect());
        target = targetOf(screen, sizeOf(screen, mode));
      } else {
        target = undefined;
        set('width', home.width);
        set('height', home.height);
        for (const name of ['width', 'height']) {
          unset(`min-${name}`);
          unset(`max-${name}`);
        }
      }
      const box = target ?? boxOf(home);
      set('left', place.offsetLeft);
      set('top', place.offsetTop);
      set('x', box.left - home.left);
      set('y', box.top - home.top);
    };
    locate('opening');
    cut();
    // (Its content's size, open: measured again a frame on, before its
    // reshape's drawn (see reshape.ts): what's in it may render again
    // after it opened (Preact renders a context's consumers later, e.g. a
    // card's rows, all of them open); drawn there instead, if it's
    // another.)
    const isContentSized =
      latest.current.size.width === 'content' ||
      latest.current.size.height === 'content';
    let again = 0;
    if (isOpen && isContentSized) {
      again = requestAnimationFrame(() => {
        const before = measured;
        locate('again');
        if (before?.[0] === measured?.[0] && before?.[1] === measured?.[1]) {
          return;
        }
        retarget.current?.();
        cut();
      });
    }
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
    // (Its content's size, open: as it changes, see `sizeOf`.)
    if (isOpen && isContentSized) observer.observe(element);
    // (Its place scrolled (it's in the page, lifted): placed anew.)

    addEventListener('scroll', draw, { capture: true, passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(again);
      observer.disconnect();
      removeEventListener('scroll', draw, { capture: true });
      for (const layer of [backdrop, ...covers]) {
        fillIn(layer);
        layer.style.removeProperty('clip-path');
        delete layer.dataset.overlaid;
      }
    };
  }, [body, isOpen, isShown, retarget, standIn]);

  // (Back in the grid: its values gone.)
  useLayoutEffect(() => {
    const element = body.current;
    if (isShown || !element) return;
    for (const name of [
      'left',
      'top',
      'width',
      'height',
      'min-width',
      'min-height',
      'max-width',
      'max-height',
      'x',
      'y',
    ]) {
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
