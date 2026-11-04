import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';

// Snapping by its snap groups' stops (see `SnapGroup`), natively: the
// popup a scroller (`scroll-snap-type: y mandatory`), a spacer as high as
// it, then its panel (the sheet's look: glass, or opaque), as high too, and
// a zero-height marker per stop (and at 0: closed) its snap positions
// (see style.css). Scrolled by `h`, `h` of the panel shows, from its top to
// the popup's bottom (a capsule's: above the bottom inset, its corners
// clipped round). Its content scrolls at its top stop only (handing back to
// the popup at its start, natively). Nothing moves its scroll while it's
// scrolled: its stop read as it comes to rest, a stop set by the app
// scrolled to (smoothly; as it opens, or its stops re-measured, at once).
// Only the user's scrolls (touched, wheeled, keyed) choose a stop: any
// other (the browser's, re-snapping as its stops move) is brought back.
// Its stops within its scroll's range (Safari, a marker past its end,
// snaps to that and holds it), see style.css.

export type SnapOptions = {
  /** Its stop now (an index of `stops`). */
  active: number;
  /** Closed by scrolling it away (below its lowest stop), or not. */
  canClose: boolean;
  onClose: (event: Event) => void;
  onSelect: (index: number, event: Event) => void;
  /** Its stops' heights (px from its panel's top, ascending). */
  stops: readonly number[];
};

/** How long (ms) without a scroll it's at rest (without `scrollend`). */
const restDelay = 150;

/** How long (ms) after a wheel or key a scroll is still the user's. */
const inputDelay = 300;

/** The stop nearest `position`, or `-1`: nearer closed (0). */
const nearestStop = (stops: readonly number[], position: number) => {
  let nearest = -1;
  let distance = position;
  for (const [index, stop] of stops.entries()) {
    if (!(Math.abs(stop - position) < distance)) {
      continue;
    }

    distance = Math.abs(stop - position);
    nearest = index;
  }
  return nearest;
};

/** How far it scrolls (a stop: no further). */
const range = (element: HTMLElement) =>
  element.scrollHeight - element.clientHeight;

/**
 * Snaps `ref`'s element (the popup, see above) to its stops, natively;
 * `options` undefined: not snapping.
 */
export const useSnap = (
  ref: RefObject<HTMLElement | null>,
  options: SnapOptions | undefined,
): void => {
  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  });
  // Scrolled by the user (until it rests).
  const isScrolling = useRef(false);
  // Shown at a stop yet (until then, scrolled to at once), and which.
  const shown = useRef<number | undefined>(undefined);

  const isSnapping = options !== undefined;
  const stopsKey = options?.stops.join(',');
  const active = options?.active;

  // At its stop (as it opens, as the app or its stops change it), unless
  // it's scrolling.
  useLayoutEffect(() => {
    const { current: element } = ref;
    const { current } = optionsRef;
    if (!element || !current || active === undefined) {
      shown.current = undefined;
      return;
    }
    element.toggleAttribute(
      'data-snap-top',
      active === current.stops.length - 1,
    );
    if (isScrolling.current) return;
    const top = Math.min(current.stops[active] ?? 0, range(element));
    if (Math.abs(element.scrollTop - top) >= 1) {
      element.scrollTo({
        // (Another stop: moved there; the same, re-measured: kept.)
        behavior:
          shown.current === undefined || shown.current === active
            ? 'instant'
            : 'smooth',
        top,
      });
    }
    shown.current = active;
  }, [active, isSnapping, ref, stopsKey]);

  useEffect(() => {
    const { current: element } = ref;
    if (!element || !isSnapping) return undefined;
    let rest: ReturnType<typeof setTimeout> | undefined;
    const hasScrollEnd = 'onscrollend' in element;
    let isTouching = false;
    let input = Number.NEGATIVE_INFINITY;

    // At rest: its stop, or (scrolled away) closed; not the user's scroll:
    // back at its stop.
    const settle = (event: Event) => {
      clearTimeout(rest);
      const isUsers = isScrolling.current;
      isScrolling.current = false;
      const { current } = optionsRef;
      if (!current) return;
      const stops = current.stops.map((stop) => Math.min(stop, range(element)));
      if (!isUsers) {
        const top = stops[current.active] ?? 0;
        if (Math.abs(element.scrollTop - top) >= 1) {
          element.scrollTo({ behavior: 'instant', top });
        }
        return;
      }
      const index = nearestStop(stops, element.scrollTop);
      if (index === -1) {
        if (current.canClose) current.onClose(event);
        else element.scrollTo({ behavior: 'smooth', top: stops[0] ?? 0 });
        return;
      }
      element.toggleAttribute('data-snap-top', index === stops.length - 1);
      if (index !== current.active) current.onSelect(index, event);
    };

    const onScroll = (event: Event) => {
      if (isTouching || performance.now() - input < inputDelay) {
        isScrolling.current = true;
      }
      if (hasScrollEnd) return;
      clearTimeout(rest);
      rest = setTimeout(() => settle(event), restDelay);
    };

    const onPress = () => {
      isTouching = true;
    };
    const onRelease = () => {
      isTouching = false;
      input = performance.now();
    };
    const onInput = () => {
      input = performance.now();
    };
    const pressEvents = ['pointerdown', 'touchstart'] as const;
    const releaseEvents = [
      'pointerup',
      'pointercancel',
      'touchend',
      'touchcancel',
    ] as const;
    const inputEvents = ['keydown', 'wheel'] as const;
    const listening = { capture: true, passive: true };

    element.addEventListener('scroll', onScroll, { passive: true });
    if (hasScrollEnd) element.addEventListener('scrollend', settle);
    for (const type of pressEvents) {
      element.addEventListener(type, onPress, listening);
    }
    for (const type of releaseEvents) {
      element.addEventListener(type, onRelease, listening);
    }
    for (const type of inputEvents) {
      element.addEventListener(type, onInput, listening);
    }
    return () => {
      clearTimeout(rest);
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('scrollend', settle);
      for (const type of pressEvents) {
        element.removeEventListener(type, onPress, listening);
      }
      for (const type of releaseEvents) {
        element.removeEventListener(type, onRelease, listening);
      }
      for (const type of inputEvents) {
        element.removeEventListener(type, onInput, listening);
      }
      delete element.dataset.snapTop;
    };
  }, [isSnapping, ref]);
};
