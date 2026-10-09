import { styled } from 'goober';
import {
  ComponentProps,
  CSSProperties,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  useRef,
  useState,
} from 'react';

// Layouts (UIKit `UISplitViewController`, iPadOS' columns): columns side by
// side, filling their container (e.g. `Viewport.Content`): a sidebar, a
// list, a detail; each its own scroll container (put a `Page` in it). A
// column takes a size (the app's, in px; between `minSize` and `maxSize`),
// or shares the free space with the other flexible ones; a `resizable` one
// is resized by dragging its divider (or arrow keys on it). Columns are
// divided by a hairline in `separator`.
//
// Deviations:
// - Resizable (iPadOS: fixed column widths, chosen by the system).

const part = 'data-layout-part';

const StyledRoot = styled('div', forwardRef)`
  display: flex;
  overflow: hidden;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
`;

export type LayoutColumnProps = ComponentProps<'div'> & {
  /** Its initial size (px, uncontrolled); without a size, it's flexible. */
  defaultSize?: number;
  /** Its largest size (px) when resized (default: none). */
  maxSize?: number;
  /** Its smallest size (px; default: 240, as a list's). */
  minSize?: number;
  /** Called while it's resized (by its divider). */
  onSizeChange?: (size: number) => void;
  /** Resized by dragging its divider (at its end), or by keys on it. */
  resizable?: boolean;
  /** Its size (px, controlled). */
  size?: number;
};

const StyledColumn = styled('div', forwardRef)`
  position: relative;
  display: flex;
  min-width: var(--styled-layout-column-min, 0);
  max-width: var(--styled-layout-column-max, none);
  min-height: 0;
  box-sizing: border-box;
  flex: var(--styled-layout-column-flex, 1 1 0);
  flex-direction: column;

  & > * {
    flex: 1 1 auto;
  }

  /* The hairline between columns. */
  & + &::before {
    position: absolute;
    z-index: 1;
    width: 0.33px;
    background-color: var(--color-ios-separator);
    content: '';
    inset-block: 0;
    inset-inline-start: 0;
    pointer-events: none;
  }
`;

// The divider at a resizable column's end: a 10px hit area over the
// hairline (a keyboard-focusable separator).
const Divider = styled('div', forwardRef)`
  position: absolute;
  z-index: 2;
  width: 10px;
  cursor: col-resize;
  inset-block: 0;
  inset-inline-end: -5px;
  outline: none;
  touch-action: none;

  &::after {
    position: absolute;
    width: 2px;
    background-color: var(--color-ios-primary);
    content: '';
    inset-block: 0;
    inset-inline-start: 4px;
    opacity: 0;
    transition: opacity 150ms;
  }

  &:focus-visible::after,
  &[data-dragging]::after {
    opacity: 1;
  }
`;

/** How far an arrow key resizes (Shift: further). */
const keyStep = 10;
const keyStepLarge = 50;

// Leading to trailing: wider towards the end (right to left: the left).
const towardsEnd = (element: HTMLElement) =>
  getComputedStyle(element).direction === 'rtl' ? -1 : 1;

const clamp = (size: number, min: number, max: number) =>
  Math.min(Math.max(size, min), max);

/** A column: sized (resizable), or sharing the free space. */
const Column = forwardRef<HTMLDivElement, LayoutColumnProps>(
  (
    {
      children,
      defaultSize,
      maxSize = Infinity,
      minSize = 240,
      onSizeChange,
      resizable = false,
      size: controlledSize,
      style,
      ...props
    },
    ref,
  ) => {
    const [ownSize, setOwnSize] = useState(defaultSize);
    const size = controlledSize ?? ownSize;
    const dragRef = useRef<
      { pointerId: number; size: number; x: number } | undefined
    >(undefined);
    const [dragging, setDragging] = useState(false);

    const resize = (next: number) => {
      const clamped = clamp(Math.round(next), minSize, maxSize);
      setOwnSize(clamped);
      onSizeChange?.(clamped);
    };

    // Its current size: the given one, or (flexible) as laid out.
    const sizeOf = (divider: HTMLElement) =>
      size ?? divider.parentElement?.getBoundingClientRect().width ?? minSize;

    const columnStyle = {
      ...(style as CSSProperties | undefined),
      '--styled-layout-column-flex':
        size === undefined ? undefined : `0 0 ${String(size)}px`,
      '--styled-layout-column-max': Number.isFinite(maxSize)
        ? `${String(maxSize)}px`
        : undefined,
      '--styled-layout-column-min': `${String(minSize)}px`,
    } as CSSProperties;

    return (
      <StyledColumn
        ref={ref}
        {...{ [part]: 'column' }}
        style={columnStyle}
        {...props}
      >
        {children}
        {resizable ? (
          <Divider
            aria-orientation="vertical"
            aria-valuemax={Number.isFinite(maxSize) ? maxSize : undefined}
            aria-valuemin={minSize}
            aria-valuenow={size}
            data-dragging={dragging ? '' : undefined}
            role="separator"
            tabIndex={0}
            {...{ [part]: 'divider' }}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              const step = event.shiftKey ? keyStepLarge : keyStep;
              const direction = towardsEnd(event.currentTarget);
              const current = sizeOf(event.currentTarget);
              const sizes: Record<string, number> = {
                ArrowLeft: current - step * direction,
                ArrowRight: current + step * direction,
                End: maxSize,
                Home: minSize,
              };
              const next = sizes[event.key];
              if (next === undefined || !Number.isFinite(next)) return;
              event.preventDefault();
              resize(next);
            }}
            onLostPointerCapture={() => {
              dragRef.current = undefined;
              setDragging(false);
            }}
            onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
              if (event.button !== 0) return;
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = {
                pointerId: event.pointerId,
                size: sizeOf(event.currentTarget),
                x: event.clientX,
              };
              setDragging(true);
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              const { current: drag } = dragRef;
              if (drag?.pointerId !== event.pointerId) return;
              const moved =
                (event.clientX - drag.x) * towardsEnd(event.currentTarget);
              resize(drag.size + moved);
            }}
          />
        ) : null}
      </StyledColumn>
    );
  },
);

/** A layout: its columns side by side. */
const Root = forwardRef<HTMLDivElement, ComponentProps<'div'>>((props, ref) => (
  <StyledRoot
    ref={ref}
    {...{ [part]: 'root' }}
    {...props}
  />
));

export const Layout = {
  Root,
  Column,
};
