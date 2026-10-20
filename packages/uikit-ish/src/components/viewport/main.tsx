import './style.css';

import {
  createContext,
  forwardRef,
  FunctionComponent,
  RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '../utils/main.js';
import type {
  ElementGeometry,
  ElementGeometryOptions,
  ElementVisibilityOptions,
  Listener,
  ViewportAnchorProps,
  ViewportContentProps,
  ViewportProviderProps,
  ViewportScrollEvent,
  VisualViewportState,
} from './props.js';

export type {
  ElementGeometry,
  ElementGeometryOptions,
  ElementVisibilityOptions,
  ViewportAnchorProps,
  ViewportContentProps,
  ViewportEdge,
  ViewportProviderProps,
  ViewportSafeArea,
  ViewportScrollEvent,
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
//   scrolled in (past a threshold, so jitter doesn't flip it), and whether
//   it's at its top or bottom; e.g. to collapse a tab bar while scrolling
//   down.
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

/** The latest scroll, and its listeners. */
const createScrollStore = () => {
  let latest: ViewportScrollEvent = {
    atBottom: false,
    atTop: true,
    direction: undefined,
    position: 0,
  };
  const listeners = new Set<Listener>();

  return {
    current: () => latest,
    emit: (event: ViewportScrollEvent) => {
      latest = event;
      for (const listener of listeners) listener(event);
    },
    subscribe: (listener: Listener) => {
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

const readVisual = (): VisualViewportState => {
  if (typeof window === 'undefined') {
    return { height: 0, keyboardInset: 0, left: 0, top: 0, width: 0 };
  }
  const { visualViewport: viewport } = window;
  const height = viewport?.height ?? window.innerHeight;
  const top = viewport?.offsetTop ?? 0;

  return {
    height,
    keyboardInset: Math.max(0, Math.round(window.innerHeight - height - top)),
    left: viewport?.offsetLeft ?? 0,
    top,
    width: viewport?.width ?? window.innerWidth,
  };
};

/** Provides the visual viewport and scroll tracking (see above). */
const Provider: FunctionComponent<ViewportProviderProps> = ({
  children,
  scroller,
  threshold = 8,
}) => {
  const [visual, setVisual] = useState(readVisual);
  const [scroll] = useState(createScrollStore);

  // The visual viewport (once per frame), as custom properties, too.
  useLayoutEffect(() => {
    const { documentElement: root } = document;
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = readVisual();
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
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Scroll tracking: the direction flips once scrolled past the threshold
  // from where it last turned.
  useEffect(() => {
    const element = scroller?.current ?? document.scrollingElement;
    if (!element) return undefined;
    const target: EventTarget =
      element === document.scrollingElement ? window : element;
    let turn = element.scrollTop;

    const onScroll = () => {
      const position = element.scrollTop;
      const end = element.scrollHeight - element.clientHeight;
      let { direction } = scroll.current();

      if (direction === 'down' ? position > turn : position < turn) {
        turn = position;
      } else if (Math.abs(position - turn) >= threshold) {
        direction = position > turn ? 'down' : 'up';
        turn = position;
      }

      const next: ViewportScrollEvent = {
        atBottom: position >= end - 1,
        atTop: position <= 0,
        direction,
        position,
      };
      scroll.emit(next);
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, [scroll, scroller, threshold]);

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

/** The visual viewport and the keyboard's height (needs a `Provider`). */
export const useVisualViewport = (): VisualViewportState => {
  const context = useContext(ViewportContext);
  return context?.visual ?? readVisual();
};

/**
 * Calls `listener` on every scroll of the tracked scroll container (needs a
 * `Provider`); it can change without resubscribing.
 */
export const useViewportScroll = (listener: Listener): void => {
  const context = useContext(ViewportContext);
  const latest = useRef(listener);
  useLayoutEffect(() => {
    latest.current = listener;
  });

  useEffect(
    () => context?.scroll.subscribe((event) => latest.current(event)),
    [context],
  );
};

/**
 * The direction the tracked scroll container is scrolled in, and whether
 * it's at its top or bottom (re-rendering when these change).
 */
export const useScrollDirection = (): Omit<ViewportScrollEvent, 'position'> => {
  const context = useContext(ViewportContext);
  const [state, setState] = useState(() => {
    const { atBottom, atTop, direction } = context?.scroll.current() ?? {
      atBottom: false,
      atTop: true,
      direction: undefined,
    };
    return { atBottom, atTop, direction };
  });

  useViewportScroll(({ atBottom, atTop, direction }) =>
    setState((current) =>
      current.atBottom === atBottom &&
      current.atTop === atTop &&
      current.direction === direction
        ? current
        : { atBottom, atTop, direction },
    ),
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry) return;
        setVisible(
          entry.isIntersecting && entry.intersectionRatio >= threshold,
        );
      },
      { root: scroller?.current ?? null, rootMargin, threshold },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, rootMargin, scroller, threshold]);

  return visible;
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

const sameGeometry = (a: ElementGeometry, b: ElementGeometry) =>
  (Object.keys(a) as (keyof ElementGeometry)[]).every(
    (key) => a[key] === b[key],
  );

/**
 * Where the element (`ref`'s, as first mounted) is in the visible area (the
 * viewport, or `scroller`'s box): its edges' distances to the area's, how
 * much of it shows. Measured once per frame while it scrolls or resizes,
 * and only while it's visible (once more as it leaves); `undefined` until
 * measured, and on the server.
 */
export const useElementGeometry = (
  ref: RefObject<Element | null>,
  { scroller }: ElementGeometryOptions = {},
): ElementGeometry | undefined => {
  const visible = useElementVisibility(ref, { scroller });
  const [geometry, setGeometry] = useState<ElementGeometry>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => {
      const next = readGeometry(element, scroller?.current ?? null);
      setGeometry((current) =>
        current && sameGeometry(current, next) ? current : next,
      );
    };
    // (Visible or not: where it is now, e.g. having just left.)
    update();
    if (!visible) return undefined;

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
  }, [ref, scroller, visible]);

  return geometry;
};

/**
 * Floats above the content (and its scroll container) at an edge of the
 * visual viewport (see the custom properties above): a bar at the top or
 * bottom, a (compact) sidebar at the leading or trailing edge; its safe
 * area insets kept clear (as padding).
 */
const Anchor = forwardRef<HTMLDivElement, ViewportAnchorProps>(
  ({ className, edge, keyboard = 'push', safeArea = 'all', ...props }, ref) => (
    <div
      ref={ref}
      data-edge={edge}
      data-keyboard={keyboard}
      data-safe-area={safeArea}
      {...props}
      className={cn('uikit-viewport-anchor', className)}
      data-viewport-part="anchor"
    />
  ),
);

/**
 * The content layer: filling the viewport, scrolling its content (track it
 * with `Provider`'s `scroller`), below the anchors; its safe area insets
 * kept clear (as padding).
 */
const Content = forwardRef<HTMLDivElement, ViewportContentProps>(
  ({ className, keyboard = 'resize', safeArea = 'all', ...props }, ref) => (
    <div
      ref={ref}
      data-keyboard={keyboard}
      data-safe-area={safeArea}
      {...props}
      className={cn('uikit-viewport-content', className)}
      data-viewport-part="content"
    />
  ),
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
};
