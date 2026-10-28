import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

// A calendar's months, side by side in a strip scrolling sideways (see
// `useMonthPager`), a window of them: the shown month between a year's on
// either side (`span`), snapping to one each, natively (a finger, a
// trackpad's momentum; `scroll-snap-stop`: one a flick). The strip's only
// changed at rest (nothing scrolling it, nor holding it): settled on
// another month, turned to it, the strip centred on it again; meanwhile,
// the month mostly in view shown (`shown`). Going to a month (`goTo`,
// e.g. the arrows), it stands in for those on its side, scrolled to.

/** A month gone to (see `goTo`): standing in for the neighbour on `side`. */
type Target = { month: Date; side: -1 | 1 };

// On a page: this close to it (px; widths are fractional).
const onPage = 1.5;

// The months on either side of the window's centre, rendered.
const span = 12;

// Re-centred (at rest), the shown month this near its ends.
const recentre = 4;

// At rest (without `scrollend`, e.g. older Safari): scrolls quiet this
// long (ms).
const restQuiet = 120;

/** Scrolled to, programmatically: settled at the latest after this long. */
const settleLatest = 600;

/** The strip's direction: 1, or -1 right to left (`scrollLeft` negative). */
const directionOf = (element: HTMLElement) =>
  getComputedStyle(element).direction === 'rtl' ? -1 : 1;

/** What the strip's held by (see `useMonthPager`). */
type Strip = {
  /** Held (by a finger, the mouse): not settling. */
  isHeld: boolean;
  /** Settles, if on a page. */
  settle: () => void;
};

// A page's width (px): as laid out, fractional (not `clientWidth`'s,
// rounded, off by more each page on), not transformed (not the bounding
// box's, e.g. a popover's scaling in).
const widthOf = (pages: HTMLElement) =>
  Number.parseFloat(getComputedStyle(pages).width) || 1;

/** Not also the click a drag's released with (see `useMonthDrag`). */
const swallow = (event: Event) => event.stopPropagation();

/** Dragged by the mouse: flicked this fast at least (px per ms). */
const dragFlick = 0.4;

/** Dragged by the mouse: from this far (px), sideways. */
const dragSlop = 8;

/**
 * The strip dragged by the mouse (as by a finger; not snapping meanwhile):
 * released, scrolled to the nearer page, or flicked, on to the next; not
 * also the click it's released with.
 */
const useMonthDrag = (
  pagesRef: RefObject<HTMLDivElement | null>,
  strip: RefObject<Strip>,
  isDraggable: boolean,
) => {
  useEffect(() => {
    const { current: pages } = pagesRef;
    if (!pages || !isDraggable) return undefined;
    let drag:
      | {
          isMoved: boolean;
          time: number;
          velocity: number;
          x: number;
          y: number;
        }
      | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Snapping again, settled (see `useMonthPager`).
    const done = () => {
      clearTimeout(timer);
      pages.removeEventListener('scrollend', done);
      pages.style.removeProperty('scroll-snap-type');
      strip.current.isHeld = false;
      strip.current.settle();
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      done();
      drag = {
        isMoved: false,
        time: event.timeStamp,
        velocity: 0,
        x: event.clientX,
        y: event.clientY,
      };
    };
    const onMove = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (!drag.isMoved) {
        if (Math.hypot(dx, event.clientY - drag.y) < dragSlop) return;
        // Scrolled instead (vertically): not a drag.
        if (Math.abs(event.clientY - drag.y) > Math.abs(dx)) {
          drag = undefined;
          return;
        }
        drag.isMoved = true;
        strip.current.isHeld = true;
        pages.style.scrollSnapType = 'none';
        pages.setPointerCapture(event.pointerId);
      }
      const before = pages.scrollLeft;
      pages.scrollLeft -= dx;
      drag.velocity =
        (pages.scrollLeft - before) / Math.max(1, event.timeStamp - drag.time);
      drag.time = event.timeStamp;
      drag.x = event.clientX;
    };
    const onUp = () => {
      const moved = drag;
      drag = undefined;
      if (!moved?.isMoved) return;
      // Not also the click it's released with.
      pages.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => pages.removeEventListener('click', swallow, true));

      const width = widthOf(pages);
      const direction = directionOf(pages);
      const offset = Math.abs(pages.scrollLeft) / width;
      // Flicked on (towards the later pages), or back.
      const towards = moved.velocity * direction;
      const flicked =
        Math.abs(moved.velocity) > dragFlick
          ? (towards > 0 ? Math.ceil : Math.floor)(offset)
          : Math.round(offset);
      const page = Math.min(Math.max(flicked, 0), pages.children.length - 1);
      pages.scrollTo({ behavior: 'smooth', left: page * width * direction });
      pages.addEventListener('scrollend', done);
      timer = setTimeout(done, settleLatest);
    };

    const listeners = [
      ['pointerdown', onDown],
      ['pointermove', onMove],
      ['pointerup', onUp],
      ['pointercancel', onUp],
    ] as const;
    for (const [type, listener] of listeners) {
      pages.addEventListener(type, listener);
    }
    return () => {
      done();
      for (const [type, listener] of listeners) {
        pages.removeEventListener(type, listener);
      }
    };
  }, [isDraggable, pagesRef, strip]);
};

export type MonthPager = {
  /** Shows a month, scrolling to it (`isInstant`: at once). */
  goTo: (month: Date) => void;
  /** The months rendered, in order (the shown one among them). */
  months: Date[];
  /** The month in view (mostly; as it's scrolled), or being gone to. */
  shown: Date;
};

/** The months on either side of `centre`, not beyond the limits. */
const windowOf = (
  centre: Date,
  beside: (month: Date, side: -1 | 1) => Date | undefined,
) => {
  const side = (step: -1 | 1) => {
    const months: Date[] = [];
    for (let at = beside(centre, step); at && months.length < span;) {
      months.push(at);
      at = beside(at, step);
    }
    return months;
  };
  return [...side(-1).toReversed(), centre, ...side(1)];
};

/** A month's page in the window (-1: not in it). */
const pageIn = (months: readonly Date[], month: Date) =>
  months.findIndex((at) => at.getTime() === month.getTime());

/**
 * The months' strip (see above): `beside`, a month's neighbour on a side
 * (`undefined` beyond the limits); `onTurn`, turned to a month
 * (`isScrolled`: by scrolling, not `goTo`); `pagesRef`, the strip;
 * `isDraggable`, dragged by the mouse too (see `useMonthDrag`).
 */
export const useMonthPager = ({
  beside,
  isDraggable,
  isInstant,
  month,
  onTurn,
  pagesRef,
}: {
  beside: (month: Date, side: -1 | 1) => Date | undefined;
  isDraggable: boolean;
  isInstant: boolean;
  month: Date;
  onTurn: (month: Date, isScrolled: boolean) => void;
  pagesRef: RefObject<HTMLDivElement | null>;
}): MonthPager => {
  const [target, setTarget] = useState<Target | undefined>(undefined);
  // The window's centre: kept (the pages staying put, settling on another
  // changing nothing but which is live), until the shown month's near its
  // ends (`recentre`), or out of it.
  const [anchor, setAnchor] = useState(month);
  const anchored = windowOf(anchor, beside);
  const centre = pageIn(anchored, month) === -1 ? month : anchor;
  // (Re-anchored then, as it renders.)
  if (centre !== anchor) setAnchor(centre);
  const months = centre === anchor ? anchored : windowOf(centre, beside);
  // A month gone to, out of the window: standing in for the one beside the
  // shown month, on its side.
  const standIn = pageIn(months, month) + (target?.side ?? 0);
  if (target && pageIn(months, target.month) === -1 && months[standIn]) {
    months[standIn] = target.month;
  }
  // The month mostly in view, as it's scrolled (see below).
  const [inView, setInView] = useState<Date | undefined>(undefined);

  const latest = useRef({ month, months, onTurn, target });
  useLayoutEffect(() => {
    latest.current = { month, months, onTurn, target };
  });

  // On the shown month's page (only if not already: at rest on it, no
  // scroll written), then on to a month gone to.
  const page = pageIn(months, month);
  const goneTo = target ? pageIn(months, target.month) : -1;
  useLayoutEffect(() => {
    const { current: pages } = pagesRef;
    if (!pages || page === -1) return;
    const width = widthOf(pages);
    const direction = directionOf(pages);
    if (Math.abs(Math.abs(pages.scrollLeft) - page * width) > onPage) {
      pages.scrollTo({ behavior: 'instant', left: page * width * direction });
    }
    if (goneTo !== -1) {
      pages.scrollTo({ behavior: 'smooth', left: goneTo * width * direction });
    }
  }, [goneTo, page, pagesRef]);

  // What the strip's held by (see `useMonthDrag`).
  const strip = useRef<Strip>({ isHeld: false, settle: () => undefined });

  // At rest on another month's page: turned to it (see above), the window
  // re-centred on it if near its ends. The month mostly in view,
  // meanwhile.
  useEffect(() => {
    const { current: pages } = pagesRef;
    if (!pages) return undefined;
    let rest: ReturnType<typeof setTimeout> | undefined;

    const settle = () => {
      clearTimeout(rest);
      if (strip.current.isHeld) return;
      const width = widthOf(pages);
      const offset = Math.abs(pages.scrollLeft) / width;
      const at = Math.round(offset);
      if (Math.abs(offset - at) * width > onPage) return;
      const { current } = latest;
      const to = current.months[at];
      if (!to) return;
      const from = pageIn(current.months, current.month);
      // (Not yet scrolled on to a month gone to: see below.)
      if (at === from) return;
      const isGoneTo = current.target?.month.getTime() === to.getTime();
      setTarget(undefined);
      setInView(undefined);
      if (at < recentre || at > current.months.length - 1 - recentre) {
        setAnchor(to);
      }
      current.onTurn(to, !isGoneTo);
    };
    strip.current.settle = settle;

    // At rest: on scrolls ending (or quiet), touches ending.
    const onScroll = () => {
      clearTimeout(rest);
      rest = setTimeout(settle, restQuiet);
    };
    const onTouchStart = () => {
      strip.current.isHeld = true;
    };
    const onTouchEnd = (event: TouchEvent) => {
      strip.current.isHeld = event.touches.length > 0;
      onScroll();
    };
    // (Its page by the scroll position: not the entries' boxes,
    // transformed, e.g. a popover's scaling in.)
    const observer = new IntersectionObserver(
      () => {
        const at = Math.round(Math.abs(pages.scrollLeft) / widthOf(pages));
        setInView(latest.current.months[at]);
      },
      { root: pages, threshold: 0.5 },
    );
    const observe = () => {
      observer.disconnect();
      for (const child of pages.children) observer.observe(child);
    };
    observe();
    const children = new MutationObserver(observe);
    children.observe(pages, { childList: true });

    // Its width changed (e.g. laid out once shown, in a popover; not its
    // height's, see `DatePicker`): on the shown month's page again.
    let laidOut = 0;
    const resizes = new ResizeObserver(() => {
      const width = widthOf(pages);
      if (width === laidOut || strip.current.isHeld) return;
      laidOut = width;
      const { current } = latest;
      const at = pageIn(current.months, current.month);
      if (at === -1) return;
      const left = at * width * directionOf(pages);
      if (Math.abs(pages.scrollLeft - left) > onPage) {
        pages.scrollTo({ behavior: 'instant', left });
      }
    });
    resizes.observe(pages);

    const listeners = [
      ['scroll', onScroll],
      ['scrollend', settle],
      ['touchstart', onTouchStart],
      ['touchend', onTouchEnd],
      ['touchcancel', onTouchEnd],
    ] as const;
    for (const [type, listener] of listeners) {
      pages.addEventListener(type, listener as EventListener, {
        passive: true,
      });
    }
    return () => {
      clearTimeout(rest);
      observer.disconnect();
      children.disconnect();
      resizes.disconnect();
      for (const [type, listener] of listeners) {
        pages.removeEventListener(type, listener as EventListener);
      }
    };
  }, [pagesRef]);

  useMonthDrag(pagesRef, strip, isDraggable);

  // Gone to, but not scrolled (e.g. hidden, no width): turned to anyway.
  useEffect(() => {
    if (!target) return undefined;
    const timer = setTimeout(() => {
      setTarget(undefined);
      latest.current.onTurn(target.month, false);
    }, settleLatest);
    return () => clearTimeout(timer);
  }, [target]);

  const goTo = (to: Date) => {
    const from = target?.month ?? month;
    const step = Math.sign(to.getTime() - month.getTime());
    if (to.getTime() === from.getTime()) return;
    if (step === 0 || isInstant) {
      setTarget(undefined);
      onTurn(to, false);
      return;
    }
    setTarget({ month: to, side: step < 0 ? -1 : 1 });
  };

  return { goTo, months, shown: target?.month ?? inView ?? month };
};
