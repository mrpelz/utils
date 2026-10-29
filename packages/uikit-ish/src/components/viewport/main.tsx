import './style.css';

import {
  createContext,
  forwardRef,
  FunctionComponent,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { type WheelEventState, WheelGestures } from 'wheel-gestures';

import {
  cn,
  type PortalContainer,
  useForwardedRef,
  usePortalContainer,
  withStyle,
} from '../utils/main.js';
import {
  createAnchorHandle,
  Padding,
  useAnchorRegistration,
  useAnchorSize,
  useOverscrollRoom,
} from './padding.js';
import type {
  ElementGeometry,
  ElementGeometryOptions,
  ElementVisibilityOptions,
  Listener,
  SizeClass,
  ViewportAnchorProps,
  ViewportContentProps,
  ViewportOverscrollProps,
  ViewportProviderProps,
  ViewportScrollEvent,
  ViewportScrollOptions,
  VisualViewportState,
} from './props.js';

export {
  preventFocusShift,
  preventInputZoom,
  useFocusShiftPrevention,
  useInputZoomPrevention,
} from './input.js';
export {
  useAnchorSize,
  useCreateViewportAnchorHandle,
  ViewportAnchorHandle,
  ViewportScopeContext,
} from './padding.js';
export type {
  ElementGeometry,
  ElementGeometryOptions,
  ElementVisibilityOptions,
  ViewportAnchorProps,
  ViewportContentProps,
  ViewportEdge,
  ViewportOverscrollProps,
  ViewportPaddingProps,
  ViewportProviderProps,
  ViewportSafeArea,
  SizeClass,
  ViewportScrollEvent,
  ViewportScrollOptions,
  VisualViewportState,
} from './props.js';

// The viewport, for app logic (the Visual Viewport API):
//
// - The visual viewport (`Provider`, `useVisualViewport`): its size, offset
//   and the keyboard's height (what it covers of the layout viewport), as
//   custom properties on the root element (`--uikit-viewport-height`,
//   `-width`, `-top`, `-left`, `-keyboard-inset`) and a hook.
// - Scroll tracking (`Provider`, `useViewportScroll`, `useScrollDirection`):
//   the direction a scroll container (the document's, by default) is
//   scrolled in (past each hook's threshold, so jitter doesn't flip it),
//   whether it's at its top or bottom, e.g. to collapse a tab bar while
//   scrolling down; and how far it's pulled past an end (overscroll), e.g.
//   to pull to refresh.
// - Anchors (`Anchor`; `Top`, `Bottom`): floating above the content at an
//   edge of the visual viewport: top (e.g. a toolbar), bottom (e.g. a tab
//   bar, or a message field pushed up by the keyboard), leading or trailing
//   (e.g. a compact sidebar swiping in).
// - The content layer (`Content`): the viewport's scroll container,
//   resized by the keyboard (or overlaid).
// - Anchors and content keep the safe area insets clear (as padding): all,
//   by dimension (block, inline), or none.
// - An element's visibility (`useElementVisibility`, an
//   `IntersectionObserver`) and its geometry in the visible area
//   (`useElementGeometry`: its edges' distances, how much of it shows), in
//   the viewport or a scroll container (`scroller`); no `Provider` needed.

/** A scroll, without its direction (each listener's own, see below). */
type Scroll = Omit<ViewportScrollEvent, 'direction'>;

type ScrollListener = (scroll: Scroll) => void;

/** The latest scroll, and its listeners. */
const createScrollStore = () => {
  let latest: Scroll = {
    atBottom: false,
    atTop: true,
    isHeld: false,
    overscroll: 0,
    position: 0,
  };
  const listeners = new Set<ScrollListener>();
  // Bouncing by itself (seen past an end, see `Provider`).
  let isNative = false;
  // Otherwise moved along as it's pulled (not the document's, see
  // `Provider`).
  let isMoved = false;

  return {
    current: () => latest,
    isMoved: () => isMoved && !isNative,
    isNative: () => isNative,
    setMoved: (value: boolean) => {
      isMoved = value;
    },
    setNative: () => {
      isNative = true;
    },
    emit: (event: Scroll) => {
      latest = event;
      for (const listener of listeners) listener(event);
    },
    subscribe: (listener: ScrollListener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

type ViewportContextValue = {
  scroll: ReturnType<typeof createScrollStore>;
  visual: VisualViewportState;
};

const ViewportContext = createContext<ViewportContextValue | undefined>(
  undefined,
);

/**
 * The direction scrolled in, of the scrolls given it (from `start`): it
 * changes once scrolled `threshold` px the other way from where it last
 * turned.
 */
const trackDirection = (threshold: number, start: number) => {
  let turn = start;
  let direction: ViewportScrollEvent['direction'];

  return (scroll: Scroll): ViewportScrollEvent => {
    const { position } = scroll;
    const isOn = direction === 'down' ? position > turn : position < turn;
    if (direction !== undefined && isOn) {
      turn = position;
    } else if (Math.abs(position - turn) >= threshold) {
      direction = position > turn ? 'down' : 'up';
      turn = position;
    }

    return { ...scroll, direction };
  };
};

// A wheel pulling (see `Provider`): held until quiet for this long (its
// gesture's own end, adapting to its events' pace, comes as soon as a
// finger pauses).
const wheelQuiet = 150;

// A fling's start, told apart as inertia after a few deltas (see
// `Provider`): its first delta at least this much of the largest (uneven,
// e.g. interpolated, its largest isn't always its first).
const flingStart = 0.75;

/**
 * Rubber-banding (UIKit's): how far content moves pulled `distance` px past
 * an end, in a scroll container `size` px high (never as far as that).
 */
const rubberBand = (distance: number, size: number) =>
  size > 0 ? (1 - 1 / ((distance * 0.55) / size + 1)) * size : 0;

/**
 * A wheel's rubber-banding (a trackpad's, a wheel's): stiffer, reaching half
 * as far (wheel deltas aren't a finger's distance on the screen, and
 * inertia is told apart only after a few of them, see `Provider`).
 */
const wheelRubberBand = (distance: number, size: number) =>
  size > 0 ? (1 - 1 / ((distance * 0.4) / (size / 2) + 1)) * (size / 2) : 0;

// Released, the pull bounces back this long (ms; see `Provider`).
const bounceDuration = 350;

const clamp = (value: number, max: number) =>
  Math.round(Math.min(Math.max(value, 0), max));

/**
 * The visual viewport: the window's; or, with a `screen` (the app's, when
 * it isn't the window: e.g. a device's frame in a page), within it: what
 * the keyboard covers of its bottom, how far its top is scrolled out of
 * view while the keyboard shows (as the window's offset), what remains.
 */
const readVisual = (screen?: HTMLElement | null): VisualViewportState => {
  if (typeof window === 'undefined') {
    return { height: 0, keyboardInset: 0, left: 0, top: 0, width: 0 };
  }
  const { visualViewport: viewport } = window;
  const height = viewport?.height ?? window.innerHeight;
  const top = viewport?.offsetTop ?? 0;
  const keyboardInset = Math.max(
    0,
    Math.round(window.innerHeight - height - top),
  );
  if (!screen) {
    return {
      height,
      keyboardInset,
      left: viewport?.offsetLeft ?? 0,
      top,
      width: viewport?.width ?? window.innerWidth,
    };
  }

  // Within the screen (its box in the layout viewport): without the
  // keyboard, all of it (its own scrolling out of view is the page's).
  const rect = screen.getBoundingClientRect();
  const screenKeyboard =
    keyboardInset > 0 ? clamp(rect.bottom - (top + height), rect.height) : 0;
  const screenTop = keyboardInset > 0 ? clamp(top - rect.top, rect.height) : 0;

  return {
    height: Math.max(0, Math.round(rect.height) - screenTop - screenKeyboard),
    keyboardInset: screenKeyboard,
    left: 0,
    top: screenTop,
    width: Math.round(rect.width),
  };
};

/** An element, or a ref's (a portal container's, if it's one). */
const elementOf = (
  value: PortalContainer | null | undefined,
): HTMLElement | null => {
  const element = value && 'current' in value ? value.current : value;
  return element instanceof HTMLElement ? element : null;
};

/**
 * The root's markers (see style.css): the window an app's (its layers in
 * it, or a provider tracking it), and an iOS Home Screen app's.
 */
const windowAttribute = 'data-uikit-viewport-window';
const standaloneAttribute = 'data-uikit-viewport-standalone';

/** Holds of the window's markers (see `useWindowHold`). */
let windowHolds = 0;

/**
 * The window held as an app's while mounted, unless in a screen (its
 * portal container, e.g. a device's frame): the root marked (its
 * background beneath the layers, see style.css); in an iOS Home Screen app
 * (`navigator.standalone`; its display mode `browser` without a web app
 * manifest), its document as tall as the screen (WebKit's layout viewport
 * short otherwise). Unmarked with the last hold.
 */
const useWindowHold = (screen: PortalContainer | null | undefined) => {
  useLayoutEffect(() => {
    if (elementOf(screen)) return undefined;
    const root = document.documentElement;
    if (windowHolds === 0) {
      root.setAttribute(windowAttribute, '');
      if ((navigator as { standalone?: boolean }).standalone === true) {
        root.setAttribute(standaloneAttribute, '');
      }
    }
    windowHolds += 1;
    return () => {
      windowHolds -= 1;
      if (windowHolds > 0) return;
      root.removeAttribute(windowAttribute);
      root.removeAttribute(standaloneAttribute);
    };
  }, [screen]);
};

/** Provides the visual viewport and scroll tracking (see above). */
const Provider: FunctionComponent<ViewportProviderProps> = ({
  children,
  screen: ownScreen,
  scroller,
}) => {
  // Its screen: its own, or the provided portal container's (e.g. a
  // device's frame), or none (the window's).
  const screen = usePortalContainer(ownScreen);
  const [visual, setVisual] = useState(() => readVisual());
  const [scroll] = useState(createScrollStore);

  // Tracking the window: it's an app's.
  useWindowHold(screen);

  // The visual viewport (once per frame), as custom properties, too: on
  // the root element, or its screen.
  useLayoutEffect(() => {
    const element = elementOf(screen);
    const root = element ?? document.documentElement;
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = readVisual(element);
        for (const [name, value] of [
          ['height', next.height],
          ['width', next.width],
          ['top', next.top],
          ['left', next.left],
          ['keyboard-inset', next.keyboardInset],
        ] as const) {
          root.style.setProperty(`--uikit-viewport-${name}`, `${value}px`);
        }
        setVisual((current) =>
          (Object.keys(next) as (keyof VisualViewportState)[]).every(
            (key) => current[key] === next[key],
          )
            ? current
            : next,
        );
      });
    };

    update();
    const { visualViewport: viewport } = window;
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    // A screen moves with its page (any scroller's).
    if (element) {
      addEventListener('scroll', update, { capture: true, passive: true });
    }
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (!element) return;
      removeEventListener('scroll', update, { capture: true });
      for (const name of ['height', 'width', 'top', 'left', 'keyboard-inset']) {
        element.style.removeProperty(`--uikit-viewport-${name}`);
      }
    };
  }, [screen]);

  // Scroll tracking: the position (within the scroll range), and how far
  // it's overscrolled: Safari's own bounce (the position past an end), or,
  // where browsers keep it in range, touches and wheels pulling at an end
  // (rubber-banded, as Safari's), moving it along (its
  // `--uikit-viewport-bounce`, see style.css; not the document's).
  useEffect(() => {
    const element = scroller?.current ?? document.scrollingElement;
    if (!element) return undefined;
    const isDocument = element === document.scrollingElement;
    const target: EventTarget = isDocument ? window : element;
    scroll.setMoved(!isDocument);
    // Pulled past an end (px, signed as `overscroll`), from where a touch
    // started pulling (`origin`).
    let pull = 0;
    let origin: number | undefined;
    let isTouching = false;
    // A wheel gesture pulling (fingers on a trackpad, a wheel turning; not
    // its inertia), until it ends (see `onGesture`).
    let isWheeling = false;
    let quiet: ReturnType<typeof setTimeout> | undefined;
    // Pulled by a wheel (see `wheelRubberBand`), not a touch.
    let isWheelPull = false;
    // The held gesture's deltas, and the pull before each (see `onGesture`).
    let history: { delta: number; pull: number }[] = [];

    const range = () =>
      Math.max(0, element.scrollHeight - element.clientHeight);

    // A pull's bounce back (see `release`), and how far it's moved along.
    let bounce = 0;
    let shifted = 0;

    const emit = () => {
      const end = range();
      const raw = element.scrollTop;
      const position = Math.min(Math.max(raw, 0), end);
      if (raw !== position) scroll.setNative();
      // Moved away from the end it's pulled past (e.g. scrolled to the top
      // as the content changes): none left.
      if ((pull < 0 && position > 0) || (pull > 0 && position < end - 1)) {
        cancelAnimationFrame(bounce);
        pull = 0;
        origin = undefined;
      }
      const overscroll = scroll.isNative()
        ? raw - position
        : Math.sign(pull) *
          (isWheelPull ? wheelRubberBand : rubberBand)(
            Math.abs(pull),
            element.clientHeight,
          );
      const by = scroll.isMoved() ? -overscroll : 0;
      if (by !== shifted && element instanceof HTMLElement) {
        shifted = by;
        const { style } = element;
        if (by === 0) {
          style.removeProperty('--uikit-viewport-bounce');
        } else {
          style.setProperty('--uikit-viewport-bounce', `${String(by)}px`);
        }
      }

      scroll.emit({
        atBottom: position >= end - 1,
        atTop: position <= 0,
        isHeld: isTouching || isWheeling,
        overscroll,
        position,
      });
    };

    // Released: bouncing back (easing out, as Safari's), unless caught
    // again (a touch, a wheel: on from where it is).
    const release = () => {
      origin = undefined;
      const from = pull;
      let start: number | undefined;
      const step = (now: number) => {
        start ??= now;
        const progress = Math.min((now - start) / bounceDuration, 1);
        pull = progress < 1 ? from * (1 - progress) ** 3 : 0;
        emit();
        if (progress < 1) bounce = requestAnimationFrame(step);
      };
      cancelAnimationFrame(bounce);
      bounce = requestAnimationFrame(step);
    };

    const onTouchStart = () => {
      cancelAnimationFrame(bounce);
      isTouching = true;
      isWheelPull = false;
      origin = undefined;
    };

    // Pulling down at the start (or up at the end), from where it started
    // to; back the other way, scrolling again.
    const onTouchMove = (event: Event) => {
      const touch = (event as TouchEvent).touches[0];
      if (!touch) return;
      const y = touch.clientY;
      const raw = element.scrollTop;
      const isAtEdge = raw <= 0 || raw >= range();
      // (Caught bouncing back: on from its pull.)
      origin ??= isAtEdge ? y + pull : undefined;
      const moved = origin === undefined ? 0 : y - origin;
      if ((raw <= 0 && moved > 0) || (raw >= range() && moved < 0)) {
        pull = -moved;
      } else {
        pull = 0;
        origin = isAtEdge ? y : undefined;
      }
      emit();
    };

    const onTouchEnd = (event: Event) => {
      if ((event as TouchEvent).touches.length > 0) return;
      isTouching = false;
      release();
    };

    // Wheel gestures (`wheel-gestures`: where they start and end, and when
    // they're inertia, the fingers lifted, e.g. Chrome's interpolated
    // fling): pulling on past an end (or back) while held; inertia never
    // pulls (as no finger does), releasing at once; quiet, released (see
    // `wheelQuiet`).
    // Inertia is told apart only after a few of its deltas: those pulled
    // too, so once it is, the pull goes back to where it was before the
    // fling started (the fingers lifting: see `flingStart`), told while
    // still held (e.g. no longer armed), then released. (Where browsers
    // tell inertia, `WheelEvent.momentum`, e.g. Chrome, from its first.)
    // eslint-disable-next-line new-cap -- the library's factory
    const gestures = WheelGestures({
      preventWheelAction: false,
      reverseSign: false,
    });
    const onGesture = ({
      axisDelta,
      event,
      isEnding,
      isMomentum,
    }: WheelEventState) => {
      if (isEnding) return;
      if (isMomentum) {
        if (!isWheeling) return;
        clearTimeout(quiet);
        // Told apart late (no `momentum`): back to before the fling.
        if (typeof (event as { momentum?: unknown }).momentum !== 'boolean') {
          const largest = Math.max(
            ...history.map(({ delta }) => Math.abs(delta)),
          );
          const start = history.find(
            ({ delta }) => Math.abs(delta) >= largest * flingStart,
          );
          pull = start?.pull ?? pull;
          emit();
        }
        isWheeling = false;
        history = [];
        release();
        return;
      }
      cancelAnimationFrame(bounce);
      if (!isWheeling) history = [];
      isWheeling = true;
      clearTimeout(quiet);
      quiet = setTimeout(() => {
        isWheeling = false;
        history = [];
        release();
      }, wheelQuiet);
      isWheelPull = true;
      const [, delta] = axisDelta;
      history.push({ delta, pull });
      const raw = element.scrollTop;
      const isPast = (raw <= 0 && delta < 0) || (raw >= range() && delta > 0);
      if (isPast || pull !== 0) {
        const next = pull + delta;
        pull = pull !== 0 && Math.sign(next) !== Math.sign(pull) ? 0 : next;
      }
      emit();
    };
    const off = gestures.on('wheel', onGesture);
    const onWheel = (event: Event) => gestures.feedWheel(event as WheelEvent);

    const listeners: [string, (event: Event) => void][] = [
      ['scroll', emit],
      ['touchstart', onTouchStart],
      ['touchmove', onTouchMove],
      ['touchend', onTouchEnd],
      ['touchcancel', onTouchEnd],
      ['wheel', onWheel],
    ];
    for (const [type, listener] of listeners) {
      target.addEventListener(type, listener, { passive: true });
    }
    return () => {
      off();
      gestures.disconnect();
      clearTimeout(quiet);
      cancelAnimationFrame(bounce);
      for (const [type, listener] of listeners) {
        target.removeEventListener(type, listener);
      }
      if (element instanceof HTMLElement) {
        element.style.removeProperty('--uikit-viewport-bounce');
      }
    };
  }, [scroll, scroller]);

  const value = useMemo<ViewportContextValue>(
    () => ({ scroll, visual }),
    [scroll, visual],
  );

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
};

// A regular width: the window's, from 768px.
const regularQuery = '(width >= 768px)';

const subscribeRegular = (onChange: () => void) => {
  const query = matchMedia(regularQuery);
  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
};

/**
 * The window's horizontal size class (no `Provider` needed): e.g. a sheet
 * on `compact` (a phone), a popover on `regular` (an iPad); `compact` before
 * hydration (server rendering).
 */
export const useSizeClass = (): SizeClass =>
  useSyncExternalStore(
    subscribeRegular,
    () => (matchMedia(regularQuery).matches ? 'regular' : 'compact'),
    () => 'compact',
  );

/** The visual viewport and the keyboard's height (needs a `Provider`). */
export const useVisualViewport = (): VisualViewportState => {
  const context = useContext(ViewportContext);
  return context?.visual ?? readVisual();
};

/**
 * Calls `listener` on every scroll of the tracked scroll container, and as
 * it's overscrolled (needs a `Provider`); the direction past its own
 * `threshold`. It can change without resubscribing.
 */
export const useViewportScroll = (
  listener: Listener,
  { threshold = 8 }: ViewportScrollOptions = {},
): void => {
  const context = useContext(ViewportContext);
  const latest = useRef(listener);
  useLayoutEffect(() => {
    latest.current = listener;
  });

  useEffect(() => {
    if (!context) return undefined;
    const track = trackDirection(threshold, context.scroll.current().position);
    return context.scroll.subscribe((scroll) => latest.current(track(scroll)));
  }, [context, threshold]);
};

/**
 * The direction the tracked scroll container is scrolled in (past
 * `threshold`), and whether it's at its top or bottom (re-rendering when
 * these change).
 */
export const useScrollDirection = (
  options?: ViewportScrollOptions,
): Pick<ViewportScrollEvent, 'atBottom' | 'atTop' | 'direction'> => {
  const context = useContext(ViewportContext);
  const [state, setState] = useState<
    Pick<ViewportScrollEvent, 'atBottom' | 'atTop' | 'direction'>
  >(() => {
    const { atBottom, atTop } = context?.scroll.current() ?? {
      atBottom: false,
      atTop: true,
    };
    return { atBottom, atTop, direction: undefined };
  });

  useViewportScroll(
    ({ atBottom, atTop, direction }) =>
      setState((current) =>
        current.atBottom === atBottom &&
        current.atTop === atTop &&
        current.direction === direction
          ? current
          : { atBottom, atTop, direction },
      ),
    options,
  );

  return state;
};

/**
 * Whether the element (`ref`'s, as first mounted) is in the visible area:
 * the viewport, or `scroller`'s box (an `IntersectionObserver`; `false`
 * until it reports, and on the server).
 */
export const useElementVisibility = (
  ref: RefObject<Element | null>,
  {
    rootMargin = '0px',
    scroller,
    threshold = 0,
  }: ElementVisibilityOptions = {},
): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry) return;
        setIsVisible(
          entry.isIntersecting && entry.intersectionRatio >= threshold,
        );
      },
      { root: scroller?.current ?? null, rootMargin, threshold },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, rootMargin, scroller, threshold]);

  return isVisible;
};

/** The visible area's edges (client coordinates): the scroller's box, inside its borders and scroll bars, or the layout viewport's. */
const readArea = (scroller: HTMLElement | null) => {
  if (!scroller) {
    const { clientHeight, clientWidth } = document.documentElement;
    return { bottom: clientHeight, left: 0, right: clientWidth, top: 0 };
  }
  const box = scroller.getBoundingClientRect();
  const left = box.left + scroller.clientLeft;
  const top = box.top + scroller.clientTop;
  return {
    bottom: top + scroller.clientHeight,
    left,
    right: left + scroller.clientWidth,
    top,
  };
};

const share = (part: number, whole: number) => (whole > 0 ? part / whole : 0);

const readGeometry = (
  element: Element,
  scroller: HTMLElement | null,
): ElementGeometry => {
  const box = element.getBoundingClientRect();
  const area = readArea(scroller);
  const visibleWidth = Math.max(
    0,
    Math.min(box.right, area.right) - Math.max(box.left, area.left),
  );
  const visibleHeight = Math.max(
    0,
    Math.min(box.bottom, area.bottom) - Math.max(box.top, area.top),
  );

  return {
    bottom: area.bottom - box.bottom,
    height: box.height,
    left: box.left - area.left,
    right: area.right - box.right,
    top: box.top - area.top,
    visibleHeight,
    visibleHeightRatio: share(visibleHeight, box.height),
    visibleRatio: share(visibleWidth * visibleHeight, box.width * box.height),
    visibleWidth,
    visibleWidthRatio: share(visibleWidth, box.width),
    width: box.width,
  };
};

/**
 * Calls `listener` with where the element (`ref`'s, as first mounted) is in
 * the visible area (the viewport, or `scroller`'s box): its edges'
 * distances to the area's, how much of it shows. Measured once per frame
 * while anything scrolls or resizes, and only while it's visible (once
 * more as it leaves), and once as it mounts; the listener can change
 * without resubscribing (as `useViewportScroll`'s), and nothing re-renders
 * unless it does (e.g. setting state).
 */
export const useElementGeometry = (
  ref: RefObject<Element | null>,
  listener: (geometry: ElementGeometry) => void,
  { scroller }: ElementGeometryOptions = {},
): void => {
  const isVisible = useElementVisibility(ref, { scroller });
  const latest = useRef(listener);
  useLayoutEffect(() => {
    latest.current = listener;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () =>
      latest.current(readGeometry(element, scroller?.current ?? null));
    // (Visible or not: where it is now, e.g. having just left.)
    update();
    if (!isVisible) return undefined;

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    // (Scrolls of any container moving it: they don't bubble, so captured.)
    addEventListener('scroll', schedule, { capture: true, passive: true });
    addEventListener('resize', schedule, { passive: true });
    const resizes = new ResizeObserver(schedule);
    resizes.observe(element);
    if (scroller?.current) resizes.observe(scroller.current);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule, { capture: true });
      removeEventListener('resize', schedule);
      resizes.disconnect();
    };
  }, [ref, scroller, isVisible]);
};

/**
 * Floats above the content (and its scroll container) at an edge of the
 * visual viewport (see the custom properties above): a bar at the top or
 * bottom, a (compact) sidebar at the leading or trailing edge; its safe
 * area insets kept clear (as padding).
 */
const Anchor = forwardRef<HTMLDivElement, ViewportAnchorProps>(
  (
    { className, edge, handle, keyboard = 'push', safeArea = 'all', ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    // Its size, for the paddings making room for it (see `Padding`).
    useAnchorRegistration(ref, edge, handle);
    useWindowHold(usePortalContainer(undefined));

    return (
      <div
        ref={ref}
        data-edge={edge}
        data-keyboard={keyboard}
        data-safe-area={safeArea}
        {...props}
        className={cn('uikit-viewport-anchor', className)}
        data-viewport-part="anchor"
      />
    );
  },
);

// A content layer's `alwaysBounce`, as its attribute: on, off (none), or
// unset (`auto`, see style.css).
const bounceAttribute = (alwaysBounce: boolean | undefined) => {
  if (alwaysBounce === undefined) return 'auto';
  return alwaysBounce ? '' : undefined;
};

/**
 * The content layer: filling the viewport, scrolling its content (track it
 * with `Provider`'s `scroller`), below the anchors; its safe area insets
 * kept clear (as padding).
 */
const Content = forwardRef<HTMLDivElement, ViewportContentProps>(
  (
    {
      alwaysBounce,
      className,
      keyboard = 'resize',
      safeArea = 'all',
      ...props
    },
    ref,
  ) => {
    useWindowHold(usePortalContainer(undefined));

    return (
      <div
        ref={ref}
        data-always-bounce={bounceAttribute(alwaysBounce)}
        data-keyboard={keyboard}
        data-safe-area={safeArea}
        {...props}
        className={cn('uikit-viewport-content', className)}
        data-viewport-part="content"
      />
    );
  },
);

/**
 * What shows past an end of the tracked scroll container as it's pulled
 * there (needs a `Provider`): e.g. a refresh indicator. A layer beneath the
 * content layer (rendered before it), from its edge's bars (`anchor`), the
 * content's end moving it along as it bounces (Safari's own bounce; other
 * browsers', the scroll container moved along as it's pulled); where the
 * content stays (the document's, there), sliding in over it. Its pull, as
 * custom properties: `--uikit-viewport-overscroll` (px), and
 * `--uikit-viewport-overscroll-progress` (0 to 1, of its own size; open, 1).
 * Open, it's kept shown at rest, the padding at its edge making room for it
 * (see `useOverscrollRoom`).
 */
const Overscroll = forwardRef<HTMLDivElement, ViewportOverscrollProps>(
  (
    {
      anchor,
      className,
      edge = 'block-start',
      open = false,
      safeArea = 'all',
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const context = useContext(ViewportContext);
    const ref = useForwardedRef(forwardedRef);
    const layer = useRef<HTMLDivElement>(null);
    const inset = useAnchorSize(edge, anchor);
    const [size, setSize] = useState(0);
    const isOpen = useRef(open);
    const pull = useRef(0);
    useOverscrollRoom(edge, open ? size : 0);
    useWindowHold(usePortalContainer(undefined));

    // Its pull, and how far along (of its size; open, all the way).
    const update = useCallback(() => {
      const { current: element } = layer;
      if (!element) return;
      const height = ref.current?.offsetHeight ?? 0;
      const progress = height > 0 ? Math.min(pull.current / height, 1) : 0;
      element.style.setProperty(
        '--uikit-viewport-overscroll',
        `${String(pull.current)}px`,
      );
      element.style.setProperty(
        '--uikit-viewport-overscroll-progress',
        String(isOpen.current ? 1 : progress),
      );
      // Where the content stays (a document's, not bouncing): over it.
      const scroll = context?.scroll;
      element.toggleAttribute(
        'data-overlay',
        !(scroll?.isNative() ?? false) && !(scroll?.isMoved() ?? false),
      );
    }, [context, ref]);

    useLayoutEffect(() => {
      isOpen.current = open;
      update();
    }, [open, update]);

    useViewportScroll(({ overscroll }) => {
      pull.current = Math.max(
        0,
        edge === 'block-start' ? -overscroll : overscroll,
      );
      update();
    });

    // Its size (the room made for it, open).
    useLayoutEffect(() => {
      const { current: element } = ref;
      if (!element) return undefined;
      const observer = new ResizeObserver(([record]) => {
        setSize(Math.round(record?.borderBoxSize[0]?.blockSize ?? 0));
      });
      observer.observe(element);
      return () => observer.disconnect();
    }, [ref]);

    return (
      <div
        ref={layer}
        className="uikit-viewport-overscroll"
        data-edge={edge}
        data-safe-area={safeArea}
        data-viewport-part="overscroll"
        style={{ '--uikit-viewport-overscroll-inset': `${String(inset)}px` }}
      >
        <div
          ref={ref}
          data-open={open ? '' : undefined}
          style={withStyle(
            {
              '--uikit-viewport-overscroll-room': `${String(open ? size : 0)}px`,
            },
            style,
          )}
          {...props}
          className={cn('uikit-viewport-overscroll-area', className)}
          data-viewport-part="overscroll-area"
        />
      </div>
    );
  },
);

/** A bar at the block start (the top; an `Anchor`). */
const BlockStart = forwardRef<
  HTMLDivElement,
  Omit<ViewportAnchorProps, 'edge'>
>((props, ref) => (
  <Anchor
    ref={ref}
    edge="block-start"
    {...props}
  />
));

/** A bar at the block end (the bottom), above the keyboard (an `Anchor`). */
const BlockEnd = forwardRef<HTMLDivElement, Omit<ViewportAnchorProps, 'edge'>>(
  (props, ref) => (
    <Anchor
      ref={ref}
      edge="block-end"
      {...props}
    />
  ),
);

export const Viewport = {
  Provider,
  Anchor,
  Content,
  BlockStart,
  BlockEnd,
  Overscroll,
  Padding,
  createAnchorHandle,
};
