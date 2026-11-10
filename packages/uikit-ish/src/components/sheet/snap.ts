import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

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
  /**
   * Its stops not snapped to (by index; its content scrolled from its
   * start, see below): never chosen.
   */
  ignored?: readonly boolean[];
  /**
   * Its stops of its content's groups (by index; not pinned, nor its top
   * one): asked for while its content's scrolled, its content scrolled
   * back to its start too.
   */
  ofContent?: readonly boolean[];
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
 * Its snapping off (`data-snap-off` too, see `useContentScrolled`): while
 * it's moved there itself (a stop asked for, a pull's step), until at rest
 * (see `settle`); its stops' marks changed meanwhile, nothing snapped anew
 * (WebKit, by their places among those snapped to: another stop's).
 */
const snapOff = (element: HTMLElement) => {
  element.style.scrollSnapType = 'none';
  element.dataset.snapOff = '';
};

/** Its snapping back (see `snapOff`). */
const snapOn = (element: HTMLElement) => {
  element.style.removeProperty('scroll-snap-type');
  delete element.dataset.snapOff;
};

/**
 * Its stops as scroll positions (within its range); those not snapped to
 * (`ignored`) not a number: never nearest, nor a drag's target.
 */
const positionsOf = (element: HTMLElement, options: SnapOptions) =>
  options.stops.map((stop, index) =>
    options.ignored?.[index] === true
      ? Number.NaN
      : Math.min(stop, range(element)),
  );

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
    // Another stop (asked for, e.g. by the app): moved there smoothly, not
    // snapping meanwhile (before anything's measured: its marks may have
    // changed with it, see `snapOff`). The same, re-measured: kept, at once.
    const isAnother = shown.current !== undefined && shown.current !== active;
    if (isAnother) snapOff(element);
    const top = Math.min(current.stops[active] ?? 0, range(element));
    if (Math.abs(element.scrollTop - top) >= 1) {
      // One of its content's groups, its content scrolled (those not
      // stops meanwhile, see `stopsOf`): its content back at its start too
      // (its own scroll only, not its popup's: no `scrollIntoView`).
      const content =
        isAnother && current.ofContent?.[active] === true && current.content
          ? element.querySelector<HTMLElement>(current.content)
          : null;
      if (content && content.scrollTop > 0) {
        content.scrollTo({ behavior: 'smooth', top: 0 });
      }
      element.scrollTo({ behavior: isAnother ? 'smooth' : 'instant', top });
    } else if (isAnother) {
      snapOn(element);
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
      snapOn(element);
      const isUsers = isScrolling.current;
      isScrolling.current = false;
      const { current } = optionsRef;
      if (!current) return;
      const stops = positionsOf(element, current);
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
      else {
        // Not snapping until it's there (see `snapOff`).
        snapOff(element);
        current.onSelect(current.active - 1, event);
      }
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
        event.target.closest(interactive) ||
        // (No stop to go to but its own, and not closing: not dragged, see
        // `stopsOf`.)
        (!current.canClose &&
          current.stops.filter((_, index) => current.ignored?.[index] !== true)
            .length < 2)
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
        snapOff(element);
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
      const stops = positionsOf(element, current);
      // Pressed: the next stop up (from its top, its lowest; those not
      // snapped to passed over).
      if (!isDragged) {
        const counted = stops
          .keys()
          .filter((index) => !Number.isNaN(stops[index]))
          .toArray();
        if (event.type !== 'pointerup' || counted.length < 2) return;
        current.onSelect(
          counted.find((index) => index > current.active) ?? counted[0] ?? 0,
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
        (stop): stop is number => stop !== undefined && !Number.isNaN(stop),
      );
      const top = dragTarget(positions, position, speed);
      if (Math.abs(top - position) < 1) {
        snapOn(element);
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
      snapOn(element);
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

// Its content scrolled from its start (at its top stop: fully extended),
// its groups in it not snapped to meanwhile (see style.css:
// `data-ignored`): only its top stop and pinned ones (e.g. its header's, a
// sliver's: not scrolled out with it), a drag down then to those (or
// closed). Nothing else changes: its markers kept as they are. (The one
// it's at never ignored. A mouse's drag, choosing in script, skips them
// too.) Back at its start, all of them again. None below its top stop
// counting: a sheet swiped out from its top stop (its lowest that counts,
// see Sheet), an island not moved at all (see Island: no drag of its own,
// nor a mouse's).

/** A group's stop (see `SnapGroup`): its end; pinned, or of the content. */
export type GroupStop = readonly [height: number, isPinned: boolean];

/**
 * Its groups' stops by name (see `SnapGroup`), as they report them: a
 * group's end, or `undefined` (gone); pinned (`isPinned`, see above).
 */
export const useGroupStops = (): readonly [
  stops: ReadonlyMap<string, GroupStop>,
  report: (
    value: string,
    height: number | undefined,
    isPinned?: boolean,
  ) => void,
] => {
  const [stops, setStops] = useState<ReadonlyMap<string, GroupStop>>(
    () => new Map(),
  );
  const report = useCallback(
    (value: string, height: number | undefined, isPinned = false) => {
      setStops((previous) => {
        const known = previous.get(value);
        if (known?.[0] === height && known?.[1] === isPinned) return previous;
        const next = new Map(previous);
        if (height === undefined) next.delete(value);
        else next.set(value, [height, isPinned]);
        return next;
      });
    },
    [],
  );
  return [stops, report];
};

/**
 * Its stops by name, ascending; those not snapped to (`ignored`, its
 * content scrolled: see above); its stop now (`index`, of `active`);
 * whether none below its top one counts (`isStranded`); its content's
 * groups' (`ofContent`: not pinned, nor its top one).
 */
export const stopsOf = (
  all: ReadonlyMap<string, GroupStop>,
  isContentScrolled: boolean,
  active: unknown,
): {
  ignored: readonly boolean[];
  index: number;
  isStranded: boolean;
  ofContent: readonly boolean[];
  stops: readonly (readonly [name: string, height: number])[];
} => {
  const sorted = [...all].toSorted(([, [a]], [, [b]]) => a - b);
  const top = sorted.length - 1;
  const index = sorted.findIndex(([name]) => name === active);
  const ignored = sorted.map(
    ([, [, isPinned]], at) =>
      isContentScrolled && !isPinned && at !== top && at !== index,
  );
  return {
    ignored,
    index,
    ofContent: sorted.map(([, [, isPinned]], at) => !isPinned && at !== top),
    isStranded:
      sorted.length > 1 && ignored.every((is, at) => is || at === top),
    stops: sorted.map(([name, [height]]) => [name, height] as const),
  };
};

/** How long (ms) without a scroll its content's at rest (no `scrollend`). */
const contentRestDelay = 150;

/**
 * Tells `setScrolled` whether the content (`content`, a selector) in
 * `ref`'s element is scrolled from its start (see above), while
 * `isEnabled`; back at its start as the element goes (or it's disabled).
 * Not as its scroll crosses its start (iOS: a snap area changed during a
 * scroll trips its snapping): scrolled, once its scroll has come to rest,
 * or as soon as the scroller around it moves (whichever's first); back at
 * its start, only as the scroller around it moves. (WebKit keeps the snap
 * area it's at by its place among those snapped to: groups snapped to
 * again at rest, below the top stop it's at, moved it to another, e.g.
 * from the top stop to the third, until brought back; flickering.)
 */
export const useContentScrolled = (
  ref: RefObject<HTMLElement | null>,
  content: string,
  setScrolled: (isScrolled: boolean) => void,
  isEnabled: boolean,
): void => {
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element || !isEnabled) return undefined;
    // Told, and to be told (its last scroll's; `undefined`: nothing new).
    let told = false;
    let pending: boolean | undefined;
    let scroller: Element | undefined;
    let rest: ReturnType<typeof setTimeout> | undefined;
    const tell = (isOuterMoving: boolean) => {
      clearTimeout(rest);
      if (pending === undefined) return;
      // (Back at its start: not at rest, only as the scroller around it
      // moves, see above; or while it isn't snapping, see `snapOff`.)
      if (
        !pending &&
        told &&
        !isOuterMoving &&
        !scroller?.closest('[data-snap-off]')
      ) {
        return;
      }
      if (pending !== told) {
        told = pending;
        setScrolled(told);
      }
      pending = undefined;
    };
    const onScroll = (event: Event) => {
      const { target } = event;
      if (!(target instanceof Element)) return;
      if (target.matches(content)) {
        scroller = target;
        // (Bounced past its start, negative: at it.)
        pending = target.scrollTop > 0;
        clearTimeout(rest);
        rest = setTimeout(() => tell(false), contentRestDelay);
        return;
      }
      // The scroller around it moving: told at once.
      if (scroller && target.contains(scroller)) tell(true);
    };
    const onScrollEnd = (event: Event) => {
      const { target } = event;
      if (target instanceof Element && target.matches(content)) {
        tell(false);
      }
    };
    element.addEventListener('scroll', onScroll, { capture: true });
    element.addEventListener('scrollend', onScrollEnd, { capture: true });
    return () => {
      clearTimeout(rest);
      element.removeEventListener('scroll', onScroll, { capture: true });
      element.removeEventListener('scrollend', onScrollEnd, {
        capture: true,
      });
      setScrolled(false);
    };
  }, [content, isEnabled, ref, setScrolled]);
};
