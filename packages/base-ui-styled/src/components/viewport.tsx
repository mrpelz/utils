import { styled } from 'goober';
import {
  createContext,
  forwardRef,
  FunctionComponent,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// The viewport, for app logic (Source: `viewport-lock`,
// github.com/jmmoser/viewport-lock, and the Visual Viewport API):
//
// - Locking (`useViewportLock`, `createViewportLock`, `Provider` `lock`):
//   on iOS, the on-screen keyboard shrinks the visual viewport, and Safari
//   scrolls the layout viewport to keep a focused field in view, taking
//   fixed bars (e.g. a tab bar) off screen. Locked, the app's container is
//   as high as the visual viewport, focusing fields doesn't scroll
//   (focused on `touchend`, with `preventScroll`), and the page scrolls
//   back if it scrolls anyway. The container needs `touch-action: none`
//   (or the visual viewport can be dragged while the keyboard is open), its
//   scrolling descendants `touch-action: pan-y` (or `pan-x`).
// - The visual viewport (`Provider`, `useVisualViewport`): its size, offset
//   and the keyboard's height (what it covers of the layout viewport), as
//   custom properties on the root element (`--styled-viewport-height`,
//   `-width`, `-top`, `-left`, `-keyboard-inset`) and a hook.
// - Scroll tracking (`Provider`, `useViewportScroll`, `useScrollDirection`):
//   the direction a scroll container (the document's, by default) is
//   scrolled in (past a threshold, so jitter doesn't flip it), and whether
//   it's at its top or bottom; e.g. to collapse a tab bar while scrolling
//   down.
// - Bars (`Top`, `Bottom`): fixed to the visual viewport's top or bottom:
//   above the keyboard (e.g. a message field), also unlocked.

/** The visual viewport, and the keyboard's height (0 without one). */
export type VisualViewportState = {
  height: number;
  /** What the visual viewport doesn't show of the layout viewport's bottom. */
  keyboardInset: number;
  left: number;
  top: number;
  width: number;
};

export type ViewportScrollEvent = {
  /** Scrolled to (or past) the end. */
  atBottom: boolean;
  /** Scrolled to (or past) the start. */
  atTop: boolean;
  /** The direction scrolled in, past the threshold (until then: none). */
  direction: 'down' | 'up' | undefined;
  /** The scroll position. */
  position: number;
};

type Listener = (event: ViewportScrollEvent) => void;

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

const fields = 'input, textarea, select, [contenteditable]';

// Scrolled anyway (e.g. scroll chaining, or back from the background).
const resetScroll = () => {
  if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
};

/**
 * Locks the viewport (see above) to `container`; returns the unlock.
 */
export const createViewportLock = (container: HTMLElement): (() => void) => {
  const { visualViewport: viewport } = window;
  const { ownerDocument: document } = container;
  const height = container.style.height;

  // The container: the visual viewport's height.
  const resize = () => {
    container.style.height = `${viewport?.height ?? window.innerHeight}px`;
  };

  // Fields focused without scrolling (before the browser would focus them).
  const onTouchEnd = (event: TouchEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;
    const field = target.closest<HTMLElement>(fields);
    if (!field || field === document.activeElement) return;
    if (field instanceof HTMLInputElement && field.disabled) return;
    if (field instanceof HTMLTextAreaElement && field.disabled) return;

    event.preventDefault();
    field.focus({ preventScroll: true });
  };

  resize();
  viewport?.addEventListener('resize', resize);
  viewport?.addEventListener('scroll', resetScroll);
  window.addEventListener('scroll', resetScroll, { passive: true });
  container.addEventListener('touchend', onTouchEnd, { passive: false });

  return () => {
    viewport?.removeEventListener('resize', resize);
    viewport?.removeEventListener('scroll', resetScroll);
    window.removeEventListener('scroll', resetScroll);
    container.removeEventListener('touchend', onTouchEnd);
    container.style.height = height;
  };
};

/** Locks the viewport (see above) to the container, while `enabled`. */
export const useViewportLock = (
  containerRef: RefObject<HTMLElement | null>,
  enabled = true,
): void => {
  useEffect(() => {
    const { current: container } = containerRef;
    if (!enabled || !container) return undefined;
    return createViewportLock(container);
  }, [containerRef, enabled]);
};

export type ViewportProviderProps = {
  children?: ReactNode;
  /** The app's container, locked to the viewport (see above). */
  lock?: RefObject<HTMLElement | null>;
  /**
   * The scroll container tracked (default: the document's scrolling
   * element).
   */
  scroller?: RefObject<HTMLElement | null>;
  /** How far to scroll before the direction changes (default: 8px). */
  threshold?: number;
};

/**
 * Provides the visual viewport and scroll tracking (see above), and locks
 * the viewport to `lock`'s container.
 */
const Provider: FunctionComponent<ViewportProviderProps> = ({
  children,
  lock,
  scroller,
  threshold = 8,
}) => {
  const [visual, setVisual] = useState(readVisual);
  const [scroll] = useState(createScrollStore);

  const fallback = useRef<HTMLElement | null>(null);
  useViewportLock(lock ?? fallback, lock !== undefined);

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
          root.style.setProperty(`--styled-viewport-${name}`, `${value}px`);
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

// Fixed to the visual viewport (see the custom properties above), within
// the safe area (unless the keyboard covers it).
const Top = styled('div', forwardRef)`
  position: fixed;
  z-index: 10;
  top: var(--styled-viewport-top, 0);
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top);
  inset-inline: 0;
`;

const Bottom = styled('div', forwardRef)`
  position: fixed;
  z-index: 10;
  bottom: var(--styled-viewport-keyboard-inset, 0);
  box-sizing: border-box;
  padding-bottom: max(
    0px,
    env(safe-area-inset-bottom) - var(--styled-viewport-keyboard-inset, 0px)
  );
  inset-inline: 0;
`;

export const Viewport = {
  Provider,
  Top,
  Bottom,
};
