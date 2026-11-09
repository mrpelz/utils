import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';

// Snapping by its snap groups' stops (see `SnapGroup`), natively: the
// popup a scroller (`scroll-snap-type: y mandatory`), a spacer as high as
// it, then its panel (the sheet's look: glass, or opaque), as high too, and
// a 1px marker per stop (and at 0: closed; iOS snaps to none at 0px) its
// snap positions (see style.css). Scrolled by `h`, `h` of the panel shows,
// from its top to the popup's bottom (a capsule's: above the bottom inset,
// its corners clipped round). Its content scrolls at its top stop only
// (handing back to the popup at its start, natively). Nothing moves its
// scroll while it's scrolled: its stop read as it comes to rest, a stop
// set by the app scrolled to (smoothly; as it opens, or its stops
// re-measured, at once). Only the user's scrolls (touched, wheeled, keyed)
// choose a stop: any other (the browser's, re-snapping as its stops move)
// is brought back.
// Its stops within its scroll's range (Safari, a marker past its end,
// snaps to that and holds it), the top one at its end exactly (its range
// whole pixels), see style.css. A mouse (no native scroll
// of its own) drags it by its handle (`handle`: its grabber, its bar but its
// buttons), its snapping off as it's dragged; let go, to the nearest stop
// (flung, the next one its way); pressed, not dragged, to the next stop up
// (from its top, its lowest). At its top stop, its content (`content`)
// pulled down past its start (Safari's bounce: its position negative; iOS
// hands no gesture on from it midway) and let go: a stop down (from its
// lowest, closed, if it closes); its content kept scrolling until it's
// bounced back (`data-pulled`, see style.css: hidden at once, it'd jump).
// Wheeled (a trackpad) up at its content's start, the same: WebKit (iPadOS)
// neither hands a wheel on from it nor bounces it, so a wheel's gesture
// begun there (after a pause), up by as much with nothing scrolled, steps
// down (handed on natively, e.g. Chrome: its popup scrolled, not stepped).

export type SnapOptions = {
  /** Its stop now (an index of `stops`). */
  active: number;
  /** Closed by scrolling it away (below its lowest stop), or not. */
  canClose: boolean;
  /** Its content's scroller (a selector), pulled down a stop at its start. */
  content?: string;
  /** What a mouse drags it by (a selector: e.g. its header). */
  handle?: string;
  onClose: (event: Event) => void;
  onSelect: (index: number, event: Event) => void;
  /** Its stops' heights (px from its panel's top, ascending). */
  stops: readonly number[];
};

/** How long (ms) without a scroll it's at rest (without `scrollend`). */
const restDelay = 150;

/** How long (ms) after a wheel or key a scroll is still the user's. */
const inputDelay = 300;

/** How far (px) a mouse moves before it drags (else it presses). */
const dragSlop = 4;

/** How fast (px/ms) a mouse lets go for a fling (to the next stop). */
const flingSpeed = 0.4;

/** How far (px) its content is pulled past its start to step down. */
const pullDistance = 50;

/** How long (ms) its content may bounce back, at most (see above). */
const pullHold = 1000;

/** How long (ms) without a wheel event a wheel's next one begins anew. */
const wheelGap = 100;

/** What a press on a handle is for itself, not a drag (its buttons…). */
const interactive =
  'a, button, input, label, select, textarea, [contenteditable], [role=button], [role=link]';

/**
 * Where a mouse's drag lets go to (see above): flung (`speed`, px/ms, down
 * positive), the next of `positions` its way; else the nearest.
 */
const dragTarget = (
  positions: readonly number[],
  position: number,
  speed: number,
) => {
  if (speed > flingSpeed) {
    return (
      positions.findLast((stop) => stop < position - 1) ?? positions[0] ?? 0
    );
  }
  if (speed < -flingSpeed) {
    return (
      positions.find((stop) => stop > position + 1) ?? positions.at(-1) ?? 0
    );
  }
  let nearest = positions[0] ?? 0;
  for (const stop of positions) {
    if (Math.abs(stop - position) < Math.abs(nearest - position)) {
      nearest = stop;
    }
  }
  return nearest;
};

/**
 * The stop nearest `position`, or `-1`: nearer closed (0); as near, the
 * stop (e.g. one at 0: an island's lowest, see Island).
 */
const nearestStop = (stops: readonly number[], position: number) => {
  let nearest = -1;
  let distance = position;
  for (const [index, stop] of stops.entries()) {
    if (!(Math.abs(stop - position) <= distance)) {
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

    // A mouse's drag (see above): where it started, its last moves (for
    // its speed as it lets go), dragged yet.
    let drag:
      | {
          id: number;
          isDragged: boolean;
          moves: [time: number, y: number][];
          startTop: number;
          startY: number;
        }
      | undefined;

    // At rest: its stop, or (scrolled away) closed; not the user's scroll:
    // back at its stop.
    const settle = (event: Event) => {
      clearTimeout(rest);
      // (Dragged by a mouse: at rest once let go; its snapping back.)
      if (drag?.isDragged) return;
      element.style.removeProperty('scroll-snap-type');
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

    // Its content, held scrolling until it's bounced back (see above).
    let held:
      | {
          content: HTMLElement;
          onBack: () => void;
          timer: ReturnType<typeof setTimeout>;
        }
      | undefined;

    const release = () => {
      if (!held) return;
      clearTimeout(held.timer);
      held.content.removeEventListener('scroll', held.onBack);
      delete held.content.dataset.pulled;
      held = undefined;
    };

    // Its content, if it may be pulled down a stop (at its top stop).
    const pullable = () => {
      const { current } = optionsRef;
      return !current?.content ||
        current.active !== current.stops.length - 1 ||
        (current.active === 0 && !current.canClose)
        ? undefined
        : (element.querySelector<HTMLElement>(current.content) ?? undefined);
    };

    // Pulled down a stop (its content held scrolling while it bounces back).
    const stepDown = (event: Event, content: HTMLElement) => {
      const { current } = optionsRef;
      if (!current) return;
      release();
      if (content.scrollTop < 0) {
        content.dataset.pulled = '';
        const onBack = () => {
          if (content.scrollTop >= 0) release();
        };
        held = { content, onBack, timer: setTimeout(release, pullHold) };
        content.addEventListener('scroll', onBack, { passive: true });
      }
      if (current.active === 0) current.onClose(event);
      else current.onSelect(current.active - 1, event);
    };

    const onPull = (event: TouchEvent) => {
      const content = pullable();
      if (!content || content.scrollTop > -pullDistance) return;
      stepDown(event, content);
    };

    // A wheel's gesture begun at its content's start (see above): how far
    // it's gone up, its popup's scroll as it began; else none.
    let lastWheel = Number.NEGATIVE_INFINITY;
    let wheelPull: { distance: number; top: number } | undefined;

    const onWheel = (event: WheelEvent) => {
      const isNew = event.timeStamp - lastWheel > wheelGap;
      lastWheel = event.timeStamp;
      const content = pullable();
      if (
        !content ||
        !(event.target instanceof Node) ||
        !content.contains(event.target)
      ) {
        wheelPull = undefined;
        return;
      }
      if (isNew) {
        wheelPull =
          content.scrollTop <= 0
            ? { distance: 0, top: element.scrollTop }
            : undefined;
      }
      if (!wheelPull) return;
      // (Its content scrolled, or handed on: not pulled.)
      if (
        content.scrollTop > 0 ||
        Math.abs(element.scrollTop - wheelPull.top) >= 1
      ) {
        wheelPull = undefined;
        return;
      }
      // (In pixels: lines as 16px, pages as its content's height.)
      let scale = 1;
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) scale = 16;
      else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        scale = content.clientHeight;
      }
      wheelPull.distance -= event.deltaY * scale;
      if (wheelPull.distance < pullDistance) return;
      wheelPull = undefined;
      stepDown(event, content);
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

    const onDragStart = (event: PointerEvent) => {
      const { current } = optionsRef;
      if (
        event.pointerType !== 'mouse' ||
        event.button !== 0 ||
        !current?.handle ||
        !(event.target instanceof Element) ||
        !event.target.closest(current.handle) ||
        event.target.closest(interactive)
      ) {
        return;
      }
      drag = {
        id: event.pointerId,
        isDragged: false,
        moves: [[event.timeStamp, event.clientY]],
        startTop: element.scrollTop,
        startY: event.clientY,
      };
      element.setPointerCapture(event.pointerId);
    };

    const onDragMove = (event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      const distance = event.clientY - drag.startY;
      if (!drag.isDragged && Math.abs(distance) < dragSlop) return;
      if (!drag.isDragged) {
        drag.isDragged = true;
        isScrolling.current = true;
        element.style.scrollSnapType = 'none';
      }
      drag.moves = [
        ...drag.moves.filter(([time]) => event.timeStamp - time < 100),
        [event.timeStamp, event.clientY],
      ];
      element.scrollTop = drag.startTop - distance;
    };

    const onDragEnd = (event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      const { isDragged, moves } = drag;
      drag = undefined;
      const { current } = optionsRef;
      if (!current) return;
      const stops = current.stops.map((stop) => Math.min(stop, range(element)));
      // Pressed: the next stop up (from its top, its lowest).
      if (!isDragged) {
        if (event.type !== 'pointerup' || stops.length < 2) return;
        current.onSelect(
          current.active >= stops.length - 1 ? 0 : current.active + 1,
          event,
        );
        return;
      }
      // Let go: flung, the next stop its way; else the nearest.
      const [first] = moves;
      const speed =
        first && event.timeStamp > first[0]
          ? (event.clientY - first[1]) / (event.timeStamp - first[0])
          : 0;
      const position = element.scrollTop;
      const positions = [current.canClose ? 0 : undefined, ...stops].filter(
        (stop) => stop !== undefined,
      );
      const top = dragTarget(positions, position, speed);
      if (Math.abs(top - position) < 1) {
        element.style.removeProperty('scroll-snap-type');
        settle(event);
        return;
      }
      element.scrollTo({ behavior: 'smooth', top });
    };

    element.addEventListener('scroll', onScroll, { passive: true });
    if (hasScrollEnd) element.addEventListener('scrollend', settle);
    element.addEventListener('touchend', onPull, { passive: true });
    element.addEventListener('wheel', onWheel, { passive: true });
    element.addEventListener('pointerdown', onDragStart);
    element.addEventListener('pointermove', onDragMove);
    element.addEventListener('pointerup', onDragEnd);
    element.addEventListener('pointercancel', onDragEnd);
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
      element.removeEventListener('touchend', onPull);
      element.removeEventListener('wheel', onWheel);
      release();
      element.removeEventListener('pointerdown', onDragStart);
      element.removeEventListener('pointermove', onDragMove);
      element.removeEventListener('pointerup', onDragEnd);
      element.removeEventListener('pointercancel', onDragEnd);
      element.style.removeProperty('scroll-snap-type');
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
