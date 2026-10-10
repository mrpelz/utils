import { styled } from 'goober';
import {
  ComponentProps,
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

import { css } from './utils.js';

// The viewport, for app logic (the Visual Viewport API):
//
// - The visual viewport (`Provider`, `useVisualViewport`): its size, offset
//   and the keyboard's height (what it covers of the layout viewport), as
//   custom properties on the root element (`--styled-viewport-height`,
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

export type ViewportProviderProps = {
  children?: ReactNode;
  /**
   * The scroll container tracked (default: the document's scrolling
   * element).
   */
  scroller?: RefObject<HTMLElement | null>;
  /** How far to scroll before the direction changes (default: 8px). */
  threshold?: number;
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

/** The edge of the viewport an anchor floats at. */
export type ViewportEdge =
  'block-end' | 'block-start' | 'inline-end' | 'inline-start';

/**
 * The safe area insets kept clear (as padding): all, those of the block
 * (top, bottom) or inline (left, right) dimension only, or none.
 */
export type ViewportSafeArea = 'all' | 'block' | 'inline' | 'none';

export type ViewportAnchorProps = ComponentProps<'div'> & {
  /**
   * The edge it floats at (e.g. `block-start`: a toolbar; `block-end`: a tab
   * bar).
   */
  edge: ViewportEdge;
  /**
   * At the block end: pushed up by the on-screen keyboard (default, e.g.
   * a message field), or covered by it (e.g. a tab bar).
   */
  keyboard?: 'cover' | 'push';
  /** The safe area insets kept clear (default: `all`). */
  safeArea?: ViewportSafeArea;
};

export type ViewportContentProps = ComponentProps<'div'> & {
  /**
   * With the on-screen keyboard: resized to what's above it (default, so
   * its end scrolls into view), or overlaid by it.
   */
  keyboard?: 'overlay' | 'resize';
  /** The safe area insets kept clear (default: `all`). */
  safeArea?: ViewportSafeArea;
};

const keyboardInset = 'var(--styled-viewport-keyboard-inset, 0px)';

// A safe area inset (`side`), as padding, if its dimension is kept clear;
// at the bottom, less what the keyboard covers (`keyboard`).
const inset = (
  side: 'bottom' | 'left' | 'right' | 'top',
  safeArea: ViewportSafeArea,
  keyboard = false,
) => {
  const dimension = side === 'top' || side === 'bottom' ? 'block' : 'inline';
  if (safeArea !== 'all' && safeArea !== dimension) return '0px';
  const env = `env(safe-area-inset-${side}, 0px)`;
  return keyboard ? `max(0px, ${env} - ${keyboardInset})` : env;
};

// Insets of a box filling the visual viewport (anchors at the sides, the
// content layer): with the keyboard, down to its top (`resize`), or to the
// layout viewport's bottom.
const fill = (resize: boolean) => css`
  top: ${resize ? 'var(--styled-viewport-top, 0px)' : '0px'};
  bottom: ${resize ? keyboardInset : '0px'};
`;

const paddings = (
  safeArea: ViewportSafeArea,
  sides: readonly ('bottom' | 'left' | 'right' | 'top')[],
  keyboard = false,
) =>
  sides
    .map(
      (side) =>
        `padding-${side}: ${inset(side, safeArea, keyboard && side === 'bottom')};`,
    )
    .join('\n');

const anchorStyles = (
  edge: ViewportEdge,
  keyboard: 'cover' | 'push',
  safeArea: ViewportSafeArea,
) => {
  switch (edge) {
    case 'block-start': {
      return css`
        top: var(--styled-viewport-top, 0);
        inset-inline: 0;
        ${paddings(safeArea, ['top', 'left', 'right'])}
      `;
    }
    case 'block-end': {
      const push = keyboard === 'push';
      return css`
        bottom: ${push ? keyboardInset : '0px'};
        inset-inline: 0;
        ${paddings(safeArea, ['bottom', 'left', 'right'], push)}
      `;
    }
    default: {
      // The inline start: the left in left-to-right, the right in
      // right-to-left.
      const [start, end] =
        edge === 'inline-start' ? ['left', 'right'] : ['right', 'left'];
      return css`
        ${fill(true)}
        ${start}: 0;
        ${paddings(safeArea, ['top', 'bottom', start as 'left'], true)}

        &:dir(rtl) {
          ${start}: auto;
          ${end}: 0;

          padding-${start}: 0;
          ${paddings(safeArea, [end as 'left'])}
        }
      `;
    }
  }
};

type StyledAnchorProps = {
  anchorEdge: ViewportEdge;
  anchorKeyboard: 'cover' | 'push';
  anchorSafeArea: ViewportSafeArea;
};

const StyledAnchor = styled('div', forwardRef)<StyledAnchorProps>`
  position: fixed;
  z-index: 10;
  box-sizing: border-box;
  ${({ anchorEdge, anchorKeyboard, anchorSafeArea }) =>
    anchorStyles(anchorEdge, anchorKeyboard, anchorSafeArea)}
`;

/**
 * Floats above the content (and its scroll container) at an edge of the
 * visual viewport (see the custom properties above): a bar at the top or
 * bottom, a (compact) sidebar at the leading or trailing edge; its safe
 * area insets kept clear (as padding).
 */
const Anchor = forwardRef<HTMLDivElement, ViewportAnchorProps>(
  ({ edge, keyboard = 'push', safeArea = 'all', ...props }, ref) => (
    <StyledAnchor
      ref={ref}
      anchorEdge={edge}
      anchorKeyboard={keyboard}
      anchorSafeArea={safeArea}
      {...props}
    />
  ),
);

type StyledContentProps = {
  contentKeyboard: 'overlay' | 'resize';
  contentSafeArea: ViewportSafeArea;
};

const StyledContent = styled('div', forwardRef)<StyledContentProps>`
  position: fixed;
  overflow: auto;
  box-sizing: border-box;
  inset-inline: 0;
  overscroll-behavior: contain;
  ${({ contentKeyboard }) => fill(contentKeyboard === 'resize')}
  ${({ contentKeyboard, contentSafeArea }) =>
    paddings(
      contentSafeArea,
      ['top', 'right', 'bottom', 'left'],
      contentKeyboard === 'resize',
    )}
`;

/**
 * The content layer: filling the viewport, scrolling its content (track it
 * with `Provider`'s `scroller`), below the anchors; its safe area insets
 * kept clear (as padding).
 */
const Content = forwardRef<HTMLDivElement, ViewportContentProps>(
  ({ keyboard = 'resize', safeArea = 'all', ...props }, ref) => (
    <StyledContent
      ref={ref}
      contentKeyboard={keyboard}
      contentSafeArea={safeArea}
      {...props}
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
