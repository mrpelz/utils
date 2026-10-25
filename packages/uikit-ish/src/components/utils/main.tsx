/* eslint-disable unicorn/prefer-ternary */
import './style.css';

import type { Signalish } from 'preact';
import {
  createContext,
  CSSProperties,
  forwardRef,
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
  RefObject,
  useCallback,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

import type {
  LogicalSide,
  PointerDrag,
  PointerDragHandlers,
  PointerHandler,
  PortalContainer,
  SecondaryClickHandlers,
  SecondaryClickProps,
} from './props.js';

export type {
  ColorScheme,
  LogicalSide,
  PointerDrag,
  PointerDragHandlers,
  PortalContainer,
  SecondaryClickProps,
} from './props.js';

/**
 * Joins CSS class name strings, dropping empty entries and duplicates.
 *
 * @example mergeClassNames('a b', undefined, 'b c') // 'a b c'
 */
export const mergeClassNames = (
  ...classNames: (string | undefined)[]
): string | undefined => {
  const result = new Set<string>();

  for (const className of classNames) {
    if (!className?.length) continue;

    for (const singleCSSClass of className.split(' ')) {
      if (singleCSSClass.length === 0 || result.has(singleCSSClass)) continue;

      result.add(singleCSSClass);
    }
  }

  return result.size > 0 ? Array.from(result).join(' ') : undefined;
};

/**
 * A part's own class name, merged with the `className` it's given: a
 * string, or (a Base UI part's) a function of its state.
 *
 * @example <span className={cn('uikit-menu-icon', className)} />
 */
export const cn: {
  (name: string, className?: Signalish<string | undefined>): string;
  <State>(
    name: string,
    className?: string | ((state: State) => string | undefined),
  ): string | ((state: State) => string);
} = (name: string, className?: unknown) => {
  if (typeof className === 'function') {
    return ((state: unknown) =>
      mergeClassNames(
        name,
        (className as (state: unknown) => string | undefined)(state),
      ) ?? name) as never;
  }

  // (Preact's class names can be signals.)
  const value =
    typeof className === 'object' && className !== null
      ? (className as { value: string | undefined }).value
      : (className as string | undefined);

  return (mergeClassNames(name, value) ?? name) as never;
};

/**
 * Style properties (e.g. custom properties set from props) merged under an
 * element's own `style`: an object, or (Base UI's) a function of its state.
 */
export const withStyle = <Style,>(
  properties: Record<string, string | undefined>,
  style: Style,
): Style extends (state: never) => unknown
  ? (state: unknown) => CSSProperties
  : CSSProperties =>
  (typeof style === 'function'
    ? (state: unknown) => ({
        ...properties,
        ...(style as (state: unknown) => CSSProperties | undefined)(state),
      })
    : { ...properties, ...(style as CSSProperties | undefined) }) as never;

/**
 * A logical side as a Base UI positioner's `side` (which maps inline sides
 * itself, by the direction).
 */
export const positionerSide = (
  side: LogicalSide | undefined,
): 'bottom' | 'inline-end' | 'inline-start' | 'top' | undefined => {
  if (side === 'block-start') return 'top';
  if (side === 'block-end') return 'bottom';
  return side;
};

/**
 * Attribute that forces a color scheme regardless of the browser's
 * preference: on the root element (`<html>`, see `Styles`), or on any
 * element, for what's within it.
 */
export const colorSchemeAttribute = 'data-color-scheme';

/**
 * Where popups given no `container` are portaled into (their portals':
 * the `Alert`'s, `Sheet`'s, `ActionSheet`'s, `Menu`'s, `Popover`'s,
 * `Tooltip`'s, `ContextualMenu`'s), for what's within it; none: Base UI's
 * default, the body. E.g. a device's screen in a page of demos, or an
 * app's layer above its own.
 */
export const PortalContainerContext = createContext<
  PortalContainer | undefined
>(undefined);

/** A portal's container: its own, or else the provided one (see above). */
export const usePortalContainer = (
  container: PortalContainer | null | undefined,
): PortalContainer | null | undefined => {
  const provided = useContext(PortalContainerContext);

  return container === undefined ? provided : container;
};

/** A frame at 60 Hz, in ms: what `edgeScrollDelta`'s speed is per. */
const frameDuration = 1000 / 60;

/**
 * How far to scroll in a frame while a pointer drags near an end of a
 * scrolling area (as text selections scroll): within `edge` of its start
 * (`-`) or end (`+`), faster closer to it, at most `speed` (per 60 Hz frame)
 * at or beyond it; for the frame's `elapsed` ms, so as fast at any frame
 * rate (see `frameElapsed`).
 *
 * @param position the pointer's position along the area
 * @param start the area's start edge, along the same axis
 * @param end the area's end edge
 * @param elapsed the time since the last frame
 */
export const edgeScrollDelta = (
  position: number,
  start: number,
  end: number,
  elapsed = frameDuration,
  edge = 48,
  speed = 16,
): number => {
  const towardsStart = Math.min(1, (start + edge - position) / edge);
  const towardsEnd = Math.min(1, (position - end + edge) / edge);
  // At most a few frames' worth (e.g. after the page was hidden).
  const frames = Math.min(elapsed, 4 * frameDuration) / frameDuration;

  if (towardsStart > 0) return -towardsStart * speed * frames;
  if (towardsEnd > 0) return towardsEnd * speed * frames;
  return 0;
};

/**
 * Measures the time between animation frames (for `edgeScrollDelta`): call
 * with each frame's timestamp.
 */
export const frameElapsed = (): ((time: number) => number) => {
  let last: number | undefined;

  return (time: number) => {
    const elapsed = last === undefined ? frameDuration : time - last;
    last = time;
    return elapsed;
  };
};

/**
 * Renders `children`, but takes up the size of the largest of `children` and
 * `reserve` (e.g. a value's widest formatted values): the reserves are hidden
 * copies in the same grid cell, so the size is found by layout, in the actual
 * font, without measuring. The parent must be a grid (`display: grid`), and
 * places the content with `justify-items`/`align-items`.
 */
export const Reserve: FunctionComponent<{
  children: ReactNode;
  reserve: readonly ReactNode[];
}> = ({ children, reserve }) => (
  <>
    <span
      className="uikit-utils-reserve-layer"
      data-utils-part="reserve-layer"
    >
      {children}
    </span>
    {reserve.map((node, index) => (
      <span
        // Reserves are only ever replaced as a whole.
        key={index}
        aria-hidden="true"
        className="uikit-utils-reserve-layer uikit-utils-reserve-hidden"
        data-utils-part="reserve-layer"
      >
        {node}
      </span>
    ))}
  </>
);

/** How long a touch is held for a secondary click (iOS: a long press). */
const longPressDuration = 500;
/** How far (px) a long press may move (farther, it's a drag or a scroll). */
const longPressSlop = 10;

/**
 * Props with `onSecondaryClick` (see `SecondaryClickProps`) turned into
 * event handlers (chaining the props' own), for a button-like element.
 */
export const useSecondaryClick = <Props extends SecondaryClickProps>(
  props: Props,
): Omit<Props, 'onSecondaryClick'> => {
  const pressRef = useRef<
    | {
        pointerId: number;
        timer: ReturnType<typeof setTimeout>;
        x: number;
        y: number;
      }
    | undefined
  >(undefined);
  // Whether a touch is held (its `contextmenu`, see `onPointerDown`).
  const heldRef = useRef(false);
  // Whether the current press made one (its click, and Android's context
  // menu event, don't follow).
  const firedRef = useRef(false);

  const { onSecondaryClick, ...rest } = props;
  if (!onSecondaryClick) return rest;

  const handlers = rest as SecondaryClickHandlers;
  const cancel = () => {
    clearTimeout(pressRef.current?.timer);
    pressRef.current = undefined;
  };

  return {
    ...rest,
    onClickCapture: (event: ReactMouseEvent<HTMLElement>) => {
      handlers.onClickCapture?.(event);
      if (!firedRef.current) return;
      firedRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
    onContextMenu: (event: ReactMouseEvent<HTMLElement>) => {
      handlers.onContextMenu?.(event);
      if (handlers.disabled) return;
      event.preventDefault();
      if (firedRef.current) return;
      // A touch held (Android's own `contextmenu`: instead of the timer's).
      if (pressRef.current || heldRef.current) {
        cancel();
        firedRef.current = true;
      }
      onSecondaryClick(event);
    },
    // Taken over (e.g. by a drag of its container's).
    onLostPointerCapture: (event: ReactPointerEvent<HTMLElement>) => {
      handlers.onLostPointerCapture?.(event);
      if (event.pointerId === pressRef.current?.pointerId) cancel();
    },
    onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => {
      handlers.onPointerCancel?.(event);
      cancel();
    },
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      handlers.onPointerDown?.(event);
      firedRef.current = false;
      cancel();
      if (
        handlers.disabled ||
        event.pointerType !== 'touch' ||
        !event.isPrimary
      ) {
        return;
      }
      const element = event.currentTarget;
      const { clientX, clientY, pointerId } = event;
      pressRef.current = {
        pointerId,
        // Held: a `contextmenu` of the touch, as a right click's.
        timer: setTimeout(() => {
          pressRef.current = undefined;
          heldRef.current = true;
          try {
            element.dispatchEvent(
              new PointerEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                clientX,
                clientY,
                isPrimary: true,
                pointerId,
                pointerType: 'touch',
                view: element.ownerDocument.defaultView,
              }),
            );
          } finally {
            heldRef.current = false;
          }
        }, longPressDuration),
        x: clientX,
        y: clientY,
      };
    },
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
      handlers.onPointerMove?.(event);
      const { current: press } = pressRef;
      if (press?.pointerId !== event.pointerId) return;
      const moved = Math.hypot(
        event.clientX - press.x,
        event.clientY - press.y,
      );
      if (moved > longPressSlop) cancel();
    },
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
      handlers.onPointerUp?.(event);
      cancel();
    },
  } as Omit<Props, 'onSecondaryClick'>;
};

/**
 * `Component`, taking `onSecondaryClick` (see `useSecondaryClick`). (Typed
 * loosely inside: Base UI's `ref` types, unions with their own callbacks,
 * take no forwarded ref.)
 */
export const withSecondaryClick = <Props extends SecondaryClickProps>(
  Component: FunctionComponent<Props>,
): FunctionComponent<Props> => {
  const Loose = Component as FunctionComponent<Record<string, unknown>>;

  return forwardRef<unknown, Omit<Props, 'ref'>>((props, ref) => (
    <Loose
      ref={ref}
      {...useSecondaryClick(props)}
    />
  )) as FunctionComponent<Props>;
};

// What a popup's first tabbable element can be (roughly: enabled, in the
// tab order).
const tabbable = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * A Base UI popup's `initialFocus` as its default (its first tabbable
 * element; opened by touch, or without one, the popup itself), but not
 * scrolling: Base UI focuses the element scrolling it into view, which
 * Safari does before the popup is in place, scrolling its content down.
 */
export const useInitialFocus = (
  popup: RefObject<HTMLElement | null>,
): ((openType: string) => boolean) =>
  useCallback(
    (openType: string) => {
      if (openType === 'touch') return true;
      const first = popup.current?.querySelector<HTMLElement>(tabbable);
      if (!first) return true;
      first.focus({ preventScroll: true });
      return false;
    },
    [popup],
  );

/**
 * Returns an internal ref object for a `forwardRef` component's element that
 * is also exposed through the forwarded ref.
 */
export const useForwardedRef = <T,>(
  forwardedRef: Ref<T> | undefined = null,
): { current: T | null } => {
  const ref = useRef<T | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as T, []);

  return ref;
};

/**
 * Tracks a drag gesture of a single pointer on an element: captures the
 * pointer on `start`, throttles `move` to animation frames and calls `end`
 * once. Returns pointer event handler props for the element, which also call
 * the given `handlers` (e.g. the component's own props) first.
 */
export const usePointerDrag = <T extends HTMLElement, State>(
  drag: PointerDrag<T, State>,
  handlers: { [K in keyof PointerDragHandlers<T>]?: unknown } = {},
): PointerDragHandlers<T> => {
  const dragRef = useRef(drag);
  const handlersRef = useRef(handlers);

  useLayoutEffect(() => {
    dragRef.current = drag;
    handlersRef.current = handlers;
  });

  const activeRef = useRef<{
    event?: PointerEvent;
    frame?: number;
    pointerId: number;
    state: State;
  } | null>(null);

  const call = useCallback(
    (
      name: keyof PointerDragHandlers<T>,
      event: Parameters<PointerHandler<T>>[0],
    ) => (handlersRef.current[name] as PointerHandler<T> | undefined)?.(event),
    [],
  );

  const flush = useCallback((element: T) => {
    const { current: active } = activeRef;
    if (!active) return;

    if (active.frame !== undefined) cancelAnimationFrame(active.frame);
    active.frame = undefined;

    if (!active.event) return;
    const { event } = active;
    active.event = undefined;

    dragRef.current.move?.(element, active.state, event);
  }, []);

  const finish = useCallback(
    (element: T, pointerId: number, isCancelled: boolean) => {
      const { current: active } = activeRef;
      if (active?.pointerId !== pointerId) return;

      if (isCancelled) {
        if (active.frame !== undefined) cancelAnimationFrame(active.frame);
      } else {
        flush(element);
      }

      activeRef.current = null;
      dragRef.current.end(element, active.state, isCancelled);
    },
    [flush],
  );

  const onPointerDown = useCallback<PointerHandler<T>>(
    (event) => {
      call('onPointerDown', event);
      if (event.button !== 0 || activeRef.current) return;

      const element = event.currentTarget;
      const state = dragRef.current.start(element, event);
      if (state === undefined) return;

      element.setPointerCapture(event.pointerId);
      activeRef.current = { pointerId: event.pointerId, state };
    },
    [call],
  );

  const onPointerMove = useCallback<PointerHandler<T>>(
    (event) => {
      call('onPointerMove', event);

      const { current: active } = activeRef;
      if (active?.pointerId !== event.pointerId) return;

      const element = event.currentTarget;
      active.event = event;
      active.frame ??= requestAnimationFrame(() => flush(element));
    },
    [call, flush],
  );

  const onPointerUp = useCallback<PointerHandler<T>>(
    (event) => {
      call('onPointerUp', event);
      finish(event.currentTarget, event.pointerId, false);
    },
    [call, finish],
  );

  const onPointerCancel = useCallback<PointerHandler<T>>(
    (event) => {
      call('onPointerCancel', event);
      finish(event.currentTarget, event.pointerId, true);
    },
    [call, finish],
  );

  const onLostPointerCapture = useCallback<PointerHandler<T>>(
    (event) => {
      call('onLostPointerCapture', event);
      finish(event.currentTarget, event.pointerId, true);
    },
    [call, finish],
  );

  return {
    onLostPointerCapture,
    onPointerCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
};

/**
 * SF Symbols' `chevron.up.chevron.down` (􀆏), as SVG strokes at the current
 * font size (pop-up buttons).
 */
export const UpDownChevrons: FunctionComponent = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.94em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.6"
    viewBox="0 0 10 16"
    width="0.59em"
  >
    <path d="M2 6l3-3.5L8 6M2 10l3 3.5L8 10" />
  </svg>
);

// How long the moving highlight stays between items (see `MovingHighlight`).
const hideDelay = 100;

/**
 * On the root element while a touch drags over menus' items (hovering them,
 * see `dragOverItems`): the moving highlight follows it as it does a
 * hovering pointer.
 */
export const draggingAttribute = 'data-dragging-items';

/**
 * The selection of a popup's highlighted item (the first of `selectors`
 * found, in order, e.g. `[data-highlighted]`), as one pill moving from item
 * to item (iOS) instead of each item showing its own. Rendered last in the
 * items' container (in a stacking context), it takes the item's place, size
 * and corners (those of its `::before`, where the items draw their selection
 * otherwise); it fades out in place when none is highlighted, and in where
 * one is.
 */
export const MovingHighlight: FunctionComponent<{
  selectors: readonly string[];
}> = ({ selectors }) => {
  const key = selectors.join('\n');
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const { current: highlight } = ref;
    const container = highlight?.parentElement;
    if (!highlight || !container) return undefined;
    let isShown = false;
    // Between items (e.g. over a separator), it stays a moment: the next
    // highlighted item moves it there.
    let hiding: ReturnType<typeof setTimeout> | undefined;

    // Instantly while its items scroll (it scrolls with them).
    const update = (isInstant = false) => {
      const item = key
        .split('\n')
        .map((selector) => container.querySelector<HTMLElement>(selector))
        .find(Boolean);
      if (!item) {
        if (!isShown || hiding !== undefined) return;
        hiding = setTimeout(() => {
          hiding = undefined;
          isShown = false;
          highlight.style.opacity = '0';
        }, hideDelay);
        return;
      }
      clearTimeout(hiding);
      hiding = undefined;

      // Relative to its containing block: the container (scrolled), or the
      // nearest positioned ancestor (its place following the scroll). In
      // layout px: popups scale while they open (or a submenu over them).
      const parent =
        highlight.offsetParent instanceof HTMLElement
          ? highlight.offsetParent
          : container;
      const scrolled = parent === container ? container : undefined;
      const box = parent.getBoundingClientRect();
      const rect = item.getBoundingClientRect();
      const scaleX = parent.offsetWidth ? box.width / parent.offsetWidth : 1;
      const scaleY = parent.offsetHeight ? box.height / parent.offsetHeight : 1;
      const x = (rect.left - box.left) / scaleX - parent.clientLeft;
      const y = (rect.top - box.top) / scaleY - parent.clientTop;
      const place = {
        borderRadius: getComputedStyle(item, '::before').borderRadius,
        height: `${String(rect.height / scaleY)}px`,
        translate: `${String(x + (scrolled?.scrollLeft ?? 0))}px ${String(y + (scrolled?.scrollTop ?? 0))}px`,
        width: `${String(rect.width / scaleX)}px`,
      };
      // Appearing (or scrolling): in place, not moving there.
      if (isShown && !isInstant) {
        Object.assign(highlight.style, place);
      } else {
        highlight.style.transitionProperty = 'opacity';
        Object.assign(highlight.style, place);
        highlight.getBoundingClientRect();
        highlight.style.removeProperty('transition-property');
      }
      isShown = true;
      highlight.style.opacity = '1';
    };

    update();
    const observer = new MutationObserver(() => update());
    observer.observe(container, {
      attributeFilter: ['data-highlighted', 'data-popup-open'],
      attributes: true,
      childList: true,
      subtree: true,
    });
    const resizeObserver = new ResizeObserver(() => update());
    resizeObserver.observe(container);
    const onScroll = () => update(true);
    container.addEventListener('scroll', onScroll, { passive: true });
    // Measured again once the popup (or its items) stopped moving.
    const onSettle = () => update();
    const popup = container.closest<HTMLElement>('[role=menu]') ?? container;
    popup.addEventListener('transitionend', onSettle);
    popup.addEventListener('animationend', onSettle);
    return () => {
      clearTimeout(hiding);
      container.removeEventListener('scroll', onScroll);
      popup.removeEventListener('transitionend', onSettle);
      popup.removeEventListener('animationend', onSettle);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [key]);

  return (
    // The pill: absolutely positioned in its parent (scrolling with its
    // content), behind the items (below them, in the popup's stacking
    // context: glass makes one), its place and size set above (see
    // style.css).
    <span
      ref={ref}
      aria-hidden="true"
      className="uikit-utils-highlight"
      data-moving-highlight=""
      data-utils-part="highlight"
    />
  );
};
