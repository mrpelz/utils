import { styled } from 'goober';
import {
  forwardRef,
  FunctionComponent,
  PointerEventHandler,
  ReactNode,
  Ref,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

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
      if (singleCSSClass.length === 0) continue;
      if (result.has(singleCSSClass)) continue;

      result.add(singleCSSClass);
    }
  }

  return result.size > 0 ? Array.from(result).join(' ') : undefined;
};

/**
 * Shallowly merges two props objects (`b` wins), joining their `className`s
 * via `mergeClassNames`.
 */
export const mergeProps = <T extends object, P extends object>(
  a: T,
  b: P,
): T & P => {
  const aClassName =
    ('className' in a && typeof a.className === 'string' && a.className) ||
    undefined;

  const bClassName =
    ('className' in b && typeof b.className === 'string' && b.className) ||
    undefined;

  const className = mergeClassNames(aClassName, bClassName);

  return { ...a, ...b, className };
};

/**
 * Creates a props mapper (for `wrap`) that merges fixed `additionalProps`
 * into the incoming props via `mergeProps`.
 */
export const addProps =
  <UpstreamProps extends object, AdditionalProps extends object>(
    additionalProps: AdditionalProps,
  ): ((props: UpstreamProps) => UpstreamProps & AdditionalProps) =>
  (props) =>
    mergeProps(props, additionalProps);

/** Maps the props of a wrapping component to those of the wrapped one. */
export type GetAdditionalProps<
  UpstreamProps extends object,
  DownstreamProps extends object,
> = (props: DownstreamProps) => UpstreamProps;

/**
 * Wraps a component, mapping its props through `getAdditionalProps` (e.g. to
 * set defaults, or to derive props the wrapped component understands). Refs
 * are forwarded to the wrapped component.
 *
 * @example
 * const Root = wrap(StyledRoot, (props: RootProps) => ({
 *   ...props,
 *   thumbAlignment: props.thumbAlignment ?? 'edge',
 * }));
 */
export const wrap = <
  UpstreamProps extends object,
  DownstreamProps extends object,
>(
  UpstreamComponent: FunctionComponent<UpstreamProps>,
  getAdditionalProps: GetAdditionalProps<UpstreamProps, DownstreamProps>,
): FunctionComponent<DownstreamProps> =>
  forwardRef<unknown, DownstreamProps>((props, ref) => {
    const upstreamProps = useMemo(() => getAdditionalProps(props), [props]);

    return (
      <UpstreamComponent
        ref={ref}
        {...upstreamProps}
      />
    );
  }) as FunctionComponent<DownstreamProps>;

/**
 * Tag for CSS template strings: returns the raw string, but lets stylelint's
 * styled syntax (`postcss-styled-syntax`) lint it, and interpolates plain
 * values. Use for CSS fragments shared between goober `styled` templates.
 */
export const css = String.raw;

/** Color schemes that `colorSchemeAttribute` on the root element forces. */
export type ColorScheme = 'dark' | 'light';

/**
 * Attribute on the root element (`<html>`) that forces a color scheme
 * regardless of the browser's preference (see `Styles`).
 */
export const colorSchemeAttribute = 'data-color-scheme';

/**
 * Declarations by color scheme, inside a rule: the dark ones in dark mode
 * (`prefers-color-scheme: dark`), or where `colorSchemeAttribute` forces
 * either scheme. The forcing rules keep the rule's specificity (`:where()`)
 * and follow the media query, so they win over it.
 */
export const colorScheme = (light: string, dark: string): string => css`
  ${light}

  @media (prefers-color-scheme: dark) {
    ${dark}
  }

  &:where(:root[${colorSchemeAttribute}='light'] *) {
    ${light}
  }

  &:where(:root[${colorSchemeAttribute}='dark'] *) {
    ${dark}
  }
`;

/**
 * Declarations for a font weight, also between the static weights of the
 * system font (SF Pro 510, 590 in Figma): the exact weight is set on the
 * variable weight axis, and `font-weight` is rounded down to a static weight
 * (fonts without the axis use that). Chrome would otherwise match e.g. 510 to
 * the next heavier static face (Semibold), which the axis can't undo.
 *
 * SVG symbols inside (fill-only paths at SF Symbols' export scale of 20 units
 * per em, with visible overflow) are stroked to match: the strokes of SF Pro
 * glyphs thicken by 1 unit per 326 weight above Regular (`circle`'s ring:
 * 1.66 units at 400, 2.24 at 600, 2.58 at 700; heavier weights are thinner).
 *
 * @param weight a number, or a CSS expression evaluating to one
 */
export const fontWeight = (weight: number | string): string => css`
  font-variation-settings: 'wght' ${weight};
  font-weight: round(down, ${weight}, 100);
  stroke: currentcolor;
  stroke-linejoin: round;
  stroke-width: max(0, (${weight} - 400) / 326);
`;

/**
 * How far to scroll in a frame while a pointer drags near an end of a
 * scrolling area (as text selections scroll): within `edge` of its start
 * (`-`) or end (`+`), faster closer to it, at most `speed` at or beyond it.
 *
 * @param position the pointer's position along the area
 * @param start the area's start edge, along the same axis
 * @param end the area's end edge
 */
export const edgeScrollDelta = (
  position: number,
  start: number,
  end: number,
  edge = 48,
  speed = 16,
): number => {
  const towardsStart = Math.min(1, (start + edge - position) / edge);
  const towardsEnd = Math.min(1, (position - end + edge) / edge);

  if (towardsStart > 0) return -towardsStart * speed;
  if (towardsEnd > 0) return towardsEnd * speed;
  return 0;
};

const ReserveLayer = styled('span')`
  grid-area: 1 / 1;
  white-space: nowrap;
`;

const ReserveHidden = styled(ReserveLayer)`
  visibility: hidden;
`;

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
    <ReserveLayer>{children}</ReserveLayer>
    {reserve.map((node, index) => (
      <ReserveHidden
        // Reserves are only ever replaced as a whole.
        key={index}
        aria-hidden="true"
      >
        {node}
      </ReserveHidden>
    ))}
  </>
);

/**
 * Returns an internal ref object for a `forwardRef` component's element that
 * is also exposed through the forwarded ref.
 */
export const useForwardedRef = <T,>(
  forwardedRef: Ref<T> | undefined,
): { current: T | null } => {
  const ref = useRef<T | null>(null);

  useImperativeHandle(forwardedRef ?? null, () => ref.current as T, []);

  return ref;
};

type PointerHandler<T extends EventTarget> = PointerEventHandler<T>;

/** Pointer event handler props returned by `usePointerDrag`. */
export type PointerDragHandlers<T extends EventTarget> = {
  onLostPointerCapture: PointerHandler<T>;
  onPointerCancel: PointerHandler<T>;
  onPointerDown: PointerHandler<T>;
  onPointerMove: PointerHandler<T>;
  onPointerUp: PointerHandler<T>;
};

/** Callbacks of a drag gesture tracked by `usePointerDrag`. */
export type PointerDrag<T extends HTMLElement, State> = {
  /**
   * Called on `pointerup` (`cancelled: false`), or on `pointercancel` and
   * `lostpointercapture` (`cancelled: true`).
   */
  end: (element: T, state: State, cancelled: boolean) => void;
  /**
   * Called with the element and the latest pointer event of the drag, at
   * most once per animation frame, and once more before `end`.
   */
  move?: (element: T, state: State, event: PointerEvent) => void;
  /**
   * Called on a primary button `pointerdown`; returns the drag's state, or
   * `undefined` to not start a drag.
   */
  start: (element: T, event: PointerEvent) => State | undefined;
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
    (element: T, pointerId: number, cancelled: boolean) => {
      const { current: active } = activeRef;
      if (active?.pointerId !== pointerId) return;

      if (cancelled) {
        if (active.frame !== undefined) cancelAnimationFrame(active.frame);
      } else {
        flush(element);
      }

      activeRef.current = null;
      dragRef.current.end(element, active.state, cancelled);
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
