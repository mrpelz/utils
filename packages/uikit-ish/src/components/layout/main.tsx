import './style.css';

import {
  ComponentProps,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import { ViewportScopeContext } from '../viewport/main.js';
import type { LayoutColumnProps, LayoutRootProps } from './props.js';

export type { LayoutColumnProps, LayoutRootProps } from './props.js';

// Layouts (UIKit `UISplitViewController`, iPadOS' columns): columns side by
// side, filling their container (e.g. `Viewport.Content`): a sidebar, a list, a
// detail; each its own scroll container (put a `Page` in it). A column takes a
// size (the app's, in px; between `minSize` and `maxSize`), or shares the free
// space with the other flexible ones; a `resizable` one is resized by dragging
// its divider (or arrow keys on it). Columns are divided by a hairline in
// `separator`.
//
// Compact (e.g. on an iPhone, by the size class, `useSizeClass`: the app's
// choice), a column can be a `Drawer` instead (e.g. a sidebar), over the
// others from its side, hidden until opened: the app renders one or the
// other.
//
// Floating (a column's `floating`, e.g. for a `Sidebar`, iPadOS 26), a column
// floats over the others at the layout's start, which span the whole layout
// underneath it; a column next to it can keep its content clear of it
// (`clearFloating`: its pages' content and its bars' inset by the floating
// column's size, their backgrounds running underneath it).
//
// Behind it all, a background of the app's choice (`Background`: any content,
// filling the whole layout), showing where columns have none.
//
// Each column is the containing block of its fixed layers (e.g. a header's
// bar, in a `Viewport.BlockStart`): they span it, not the screen.
//
// Deviations:
// - Resizable (iPadOS: fixed column widths, chosen by the system).

// Behind its columns, filling it: its children layered, each filling it
// (images and videos covering it).
const Background = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-layout-background', className)}
      data-layout-part="background"
      {...props}
    />
  ),
);

/** How far an arrow key resizes (Shift: further). */
const keyStep = 10;
const keyStepLarge = 50;

// Leading to trailing: wider towards the end (right to left: the left).
const towardsEnd = (element: HTMLElement) =>
  getComputedStyle(element).direction === 'rtl' ? -1 : 1;

const clamp = (size: number, min: number, max: number) =>
  Math.min(Math.max(size, min), max);

/**
 * Publishes a floating column's size (regular) as
 * `--uikit-layout-floating-size` on its layout, as it changes (e.g.
 * resized), for the columns clear of it.
 */
const useFloatingSize = (
  columnRef: { current: HTMLDivElement | null },
  isFloating: boolean,
) => {
  useLayoutEffect(() => {
    const { current: column } = columnRef;
    const root = column?.parentElement;
    if (!column || !root || !isFloating) return undefined;

    const property = '--uikit-layout-floating-size';
    const resizeObserver = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0]?.inlineSize ?? 0;
      root.style.setProperty(property, `${String(size)}px`);
    });
    resizeObserver.observe(column);

    return () => {
      resizeObserver.disconnect();
      root.style.removeProperty(property);
    };
  }, [columnRef, isFloating]);
};

/** A column side by side: sized (resizable), or sharing the free space. */
const Column = forwardRef<HTMLDivElement, LayoutColumnProps>(
  (
    {
      className,
      children,
      clearFloating = false,
      defaultSize,
      floating = false,
      maxSize = Infinity,
      minSize = 240,
      onSizeChange,
      resizable = false,
      size: controlledSize,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    useFloatingSize(ref, floating);
    const [ownSize, setOwnSize] = useState(defaultSize);
    const size = controlledSize ?? ownSize;
    const dragRef = useRef<
      { pointerId: number; size: number; x: number } | undefined
    >(undefined);
    const [isDragging, setIsDragging] = useState(false);

    const resize = (next: number) => {
      const clamped = clamp(Math.round(next), minSize, maxSize);
      setOwnSize(clamped);
      onSizeChange?.(clamped);
    };

    // Its current size: the given one, or (flexible) as laid out.
    const sizeOf = (divider: HTMLElement) =>
      size ?? divider.parentElement?.getBoundingClientRect().width ?? minSize;

    const columnStyle = withStyle(
      {
        '--uikit-layout-column-flex':
          size === undefined ? undefined : `0 0 ${String(size)}px`,
        '--uikit-layout-column-size':
          size === undefined ? undefined : `${String(size)}px`,
        '--uikit-layout-column-max': Number.isFinite(maxSize)
          ? `${String(maxSize)}px`
          : undefined,
        '--uikit-layout-column-min': `${String(minSize)}px`,
      },
      style,
    );

    // Its anchors' scope: fixed to it (`contain: layout`, see Viewport.Padding).
    const [scope] = useState(() => ({}));

    return (
      <ViewportScopeContext.Provider value={scope}>
        <div
          ref={ref}
          data-clear-floating={clearFloating ? '' : undefined}
          data-floating={floating ? '' : undefined}
          data-layout-part="column"
          data-resizable={resizable ? '' : undefined}
          style={columnStyle}
          {...props}
          className={cn('uikit-layout-column', className)}
        >
          {children}
          {resizable ? (
            // The divider at a resizable column's end: a 10px hit area over the
            // hairline (a keyboard-focusable separator).
            <div
              aria-orientation="vertical"
              aria-valuemax={Number.isFinite(maxSize) ? maxSize : undefined}
              aria-valuemin={minSize}
              aria-valuenow={size}
              className="uikit-layout-divider"
              data-dragging={isDragging ? '' : undefined}
              data-layout-part="divider"
              role="separator"
              tabIndex={0}
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
                setIsDragging(false);
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
                setIsDragging(true);
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
        </div>
      </ViewportScopeContext.Provider>
    );
  },
);

/**
 * A layout: its columns side by side (floating ones over the others),
 * optionally on a `Background`.
 */
const Root = forwardRef<HTMLDivElement, LayoutRootProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-layout-part="root"
      {...props}
      className={cn('uikit-layout-root', className)}
    />
  ),
);

export const Layout = {
  Root,
  Background,
  Column,
};
