import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  forwardRef,
  type RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn, smoothScrollOf, useForwardedRef } from '../utils/main.js';
import type {
  PagerChangeEventDetails,
  PagerOrientation,
  PagerPageProps,
  PagerRootProps,
} from './props.js';

export type {
  PagerChangeEventDetails,
  PagerOrientation,
  PagerPageProps,
  PagerRootProps,
} from './props.js';

// A pager: full-size pages in a strip, side by side or one below another,
// snapping natively a page at a time (a finger, a trackpad's momentum;
// `scroll-snap-stop`), dragged by the mouse too. Its page is the one mostly
// in view, reported as it's scrolled (a page control following the swipe);
// a page set by the app is scrolled to (at once, motion reduced). As the
// months of a date picker (see date-picker/pager.ts): nothing's written to
// its scroll while it's held or moving (iOS's scrolling fights it), only at
// rest; its pages' sizes fractional (not `clientWidth`'s, rounded); its
// pages out of view inert, changed at rest.

// On a page: this close to it (px; sizes are fractional).
const onPage = 1.5;

// At rest (without `scrollend`, e.g. older Safari): scrolls quiet this
// long (ms).
const restQuiet = 120;

// Scrolled to by the app: settled at the latest after this long (ms).
const settleLatest = 800;

// A key's scroll (see `reason`): within this long of it (ms).
const keyWindow = 1000;

// Dragged by the mouse: flicked this fast at least (px per ms), from this
// far (px).
const dragFlick = 0.4;
const dragSlop = 8;

/** Its axis's scroll position, size and direction (right to left: -1). */
const axisOf = (element: HTMLElement, orientation: PagerOrientation) => {
  const isVertical = orientation === 'vertical';
  const style = getComputedStyle(element);
  const direction = !isVertical && style.direction === 'rtl' ? -1 : 1;
  // (As laid out, fractional; not transformed, e.g. a popover's scaling.)
  const size = Number.parseFloat(isVertical ? style.height : style.width) || 1;
  return {
    direction,
    get scroll() {
      return isVertical ? element.scrollTop : element.scrollLeft;
    },
    set scroll(value: number) {
      if (isVertical) element.scrollTop = value;
      else element.scrollLeft = value;
    },
    size,
    /** Scrolls to a page. */
    to: (page: number, behavior: ScrollBehavior) =>
      element.scrollTo({
        behavior,
        [isVertical ? 'top' : 'left']: page * size * direction,
      }),
  };
};

/** The page at its scroll position, and how far off it (px). */
const pageAt = (element: HTMLElement, orientation: PagerOrientation) => {
  const { scroll, size } = axisOf(element, orientation);
  const offset = Math.abs(scroll) / size;
  const page = Math.min(
    Math.max(Math.round(offset), 0),
    Math.max(element.children.length - 1, 0),
  );
  return { off: Math.abs(offset - page) * size, page };
};

/** What its strip is held by, and what settles it. */
type Strip = { isHeld: boolean; settle: () => void };

/** Not also the click a drag's released with. */
const swallow = (event: Event) => event.stopPropagation();

/**
 * Its strip dragged by the mouse (as by a finger; not snapping meanwhile):
 * released, scrolled to the nearer page, or flicked, on to the next; not
 * also the click it's released with.
 */
const useMouseDrag = (
  ref: RefObject<HTMLDivElement | null>,
  orientation: PagerOrientation,
  strip: RefObject<Strip>,
) => {
  useEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    const isVertical = orientation === 'vertical';
    let drag:
      | { at: number; isMoved: boolean; time: number; velocity: number }
      | undefined;
    let start = { x: 0, y: 0 };
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Snapping again, settled.
    const done = () => {
      clearTimeout(timer);
      element.removeEventListener('scrollend', done);
      element.style.removeProperty('scroll-snap-type');
      strip.current.isHeld = false;
      strip.current.settle();
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      done();
      start = { x: event.clientX, y: event.clientY };
      drag = {
        at: isVertical ? event.clientY : event.clientX,
        isMoved: false,
        time: event.timeStamp,
        velocity: 0,
      };
    };
    const onMove = (event: PointerEvent) => {
      if (!drag) return;
      const along = isVertical ? event.clientY : event.clientX;
      if (!drag.isMoved) {
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.hypot(dx, dy) < dragSlop) return;
        // Across its axis first (e.g. selecting text, a page scrolled): not
        // a drag.
        if (Math.abs(isVertical ? dx : dy) > Math.abs(isVertical ? dy : dx)) {
          drag = undefined;
          return;
        }
        drag.isMoved = true;
        strip.current.isHeld = true;
        element.style.scrollSnapType = 'none';
        element.setPointerCapture(event.pointerId);
      }
      const axis = axisOf(element, orientation);
      const before = axis.scroll;
      axis.scroll = before - (along - drag.at);
      drag.velocity =
        (axis.scroll - before) / Math.max(1, event.timeStamp - drag.time);
      drag.time = event.timeStamp;
      drag.at = along;
    };
    const onUp = () => {
      const moved = drag;
      drag = undefined;
      if (!moved?.isMoved) return;
      element.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => element.removeEventListener('click', swallow, true));
      const axis = axisOf(element, orientation);
      const offset = Math.abs(axis.scroll) / axis.size;
      const towards = moved.velocity * axis.direction;
      const flicked =
        Math.abs(moved.velocity) > dragFlick
          ? (towards > 0 ? Math.ceil : Math.floor)(offset)
          : Math.round(offset);
      const page = Math.min(Math.max(flicked, 0), element.children.length - 1);
      axis.to(page, smoothScrollOf(element));
      element.addEventListener('scrollend', done);
      timer = setTimeout(done, settleLatest);
    };

    const listeners = [
      ['pointerdown', onDown],
      ['pointermove', onMove],
      ['pointerup', onUp],
      ['pointercancel', onUp],
    ] as const;
    for (const [type, listener] of listeners) {
      element.addEventListener(type, listener);
    }
    return () => {
      done();
      for (const [type, listener] of listeners) {
        element.removeEventListener(type, listener);
      }
    };
  }, [orientation, ref, strip]);
};

/** Its pages' shared state: the page at rest (the others inert). */
const SettledContext = createContext<number | undefined>(undefined);

/** Full-size pages, snapping a page at a time. */
const Root = forwardRef<HTMLDivElement, PagerRootProps>(
  (
    {
      className,
      defaultValue = 0,
      onValueChange,
      orientation = 'horizontal',
      render,
      value: valueProp,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [state, setState] = useState(defaultValue);
    const value = valueProp ?? state;
    // The page at rest (its pages not inert, see `Page`).
    const [settled, setSettled] = useState(value);

    // The page it's at, or going to, as last reported or set (a `value`
    // the same: its own report, nothing to scroll to); a page the app set,
    // being scrolled to (not reported on the way); one set while it's held
    // or moving, scrolled to at rest.
    const reported = useRef(value);
    const target = useRef<number | undefined>(undefined);
    const pending = useRef<number | undefined>(undefined);
    const strip = useRef<Strip>({ isHeld: false, settle: () => undefined });
    const moving = useRef(false);
    const keyAt = useRef(-Infinity);
    const latest = useRef({ onValueChange, valueProp });
    useLayoutEffect(() => {
      latest.current = { onValueChange, valueProp };
    });

    const goTo = (page: number, isInstant: boolean) => {
      const { current: element } = ref;
      if (!element) return;
      const at = pageAt(element, orientation);
      if (at.page === page && at.off <= onPage) {
        target.current = undefined;
        return;
      }
      target.current = isInstant ? undefined : page;
      axisOf(element, orientation).to(
        page,
        isInstant ? 'instant' : smoothScrollOf(element),
      );
    };

    // Shown on its page (at once) as it's laid out.
    useLayoutEffect(() => {
      goTo(reported.current, true);
      // (Once: then by `value`, below.)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orientation]);

    // A page set by the app: scrolled to (at rest; held or moving, then).
    useLayoutEffect(() => {
      if (value === reported.current) return;
      reported.current = value;
      if (strip.current.isHeld || moving.current) {
        pending.current = value;
        return;
      }
      goTo(value, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
      const { current: element } = ref;
      if (!element) return undefined;
      let rest: ReturnType<typeof setTimeout> | undefined;
      let targetLatest: ReturnType<typeof setTimeout> | undefined;

      const report = (page: number, event: Event) => {
        if (page === reported.current) return;
        reported.current = page;
        if (latest.current.valueProp === undefined) setState(page);
        const reason: PagerChangeEventDetails['reason'] =
          event.timeStamp - keyAt.current < keyWindow ? 'keyboard' : 'swipe';
        latest.current.onValueChange?.(page, { event, reason });
      };

      // At rest (not held, on a page): its pages' inert ones changed, a
      // page set meanwhile scrolled to.
      const settle = () => {
        clearTimeout(rest);
        if (strip.current.isHeld) return;
        moving.current = false;
        const at = pageAt(element, orientation);
        if (at.off > onPage) return;
        target.current = undefined;
        clearTimeout(targetLatest);
        setSettled(at.page);
        const { current: next } = pending;
        pending.current = undefined;
        if (next !== undefined && next !== at.page) goTo(next, false);
      };
      strip.current.settle = settle;

      const onScroll = (event: Event) => {
        moving.current = true;
        clearTimeout(rest);
        rest = setTimeout(settle, restQuiet);
        // Scrolled to by the app: not reported on the way (unless held:
        // taken over by a finger).
        if (target.current !== undefined && !strip.current.isHeld) {
          clearTimeout(targetLatest);
          targetLatest = setTimeout(() => {
            target.current = undefined;
          }, settleLatest);
          return;
        }
        report(pageAt(element, orientation).page, event);
      };
      const onTouchStart = () => {
        strip.current.isHeld = true;
        target.current = undefined;
      };
      const onTouchEnd = (event: TouchEvent) => {
        strip.current.isHeld = event.touches.length > 0;
        clearTimeout(rest);
        rest = setTimeout(settle, restQuiet);
      };
      const onKeyDown = (event: KeyboardEvent) => {
        keyAt.current = event.timeStamp;
      };

      // Resized (e.g. rotated, laid out once shown): on its page again
      // (not while held).
      let laidOut = 0;
      const resizes = new ResizeObserver(() => {
        const { size } = axisOf(element, orientation);
        if (size === laidOut || strip.current.isHeld) return;
        laidOut = size;
        goTo(reported.current, true);
      });
      resizes.observe(element);

      const listeners = [
        ['scroll', onScroll],
        ['scrollend', settle],
        ['touchstart', onTouchStart],
        ['touchend', onTouchEnd],
        ['touchcancel', onTouchEnd],
        ['keydown', onKeyDown],
      ] as const;
      for (const [type, listener] of listeners) {
        element.addEventListener(type, listener as EventListener, {
          passive: true,
        });
      }
      return () => {
        clearTimeout(rest);
        clearTimeout(targetLatest);
        resizes.disconnect();
        for (const [type, listener] of listeners) {
          element.removeEventListener(type, listener as EventListener);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orientation, ref]);

    useMouseDrag(ref, orientation, strip);

    const element = useRender({
      defaultTagName: 'div',
      props: {
        'aria-roledescription': 'carousel',
        role: 'region',
        ...props,
        className: cn('uikit-pager-root', className),
        'data-orientation': orientation,
        'data-pager-part': 'root',
      },
      ref,
      render,
    });

    return (
      <SettledContext.Provider value={settled}>
        {element}
      </SettledContext.Provider>
    );
  },
);

/**
 * A page: as large as its pager, snapping; out of view at rest, inert.
 * Named by its place ('2 of 5') unless named otherwise.
 */
const Page = forwardRef<HTMLDivElement, PagerPageProps>(
  ({ 'aria-label': ariaLabel, className, render, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const settled = useContext(SettledContext);
    // Its place among its pager's pages (by the DOM: pages may come from
    // any components), as rendered: read each render (its siblings may
    // have changed), set only as it changed.
    const [place, setPlace] = useState({ count: 0, index: -1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const { current: element } = ref;
      const parent = element?.parentElement;
      if (!element || !parent) return;
      const index = [...parent.children].indexOf(element);
      const { length: count } = parent.children;
      if (index !== place.index || count !== place.count) {
        setPlace({ count, index });
      }
    });

    return useRender({
      defaultTagName: 'div',
      props: {
        'aria-label':
          ariaLabel ??
          (place.index === -1
            ? undefined
            : `${String(place.index + 1)} of ${String(place.count)}`),
        'aria-roledescription': 'slide',
        inert:
          settled !== undefined &&
          place.index !== -1 &&
          place.index !== settled,
        role: 'group',
        ...props,
        className: cn('uikit-pager-page', className),
        'data-pager-part': 'page',
      },
      ref,
      render,
    });
  },
);

export const Pager = { Page, Root };
