import './style.css';

import {
  ComponentProps,
  createContext,
  CSSProperties,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef } from '../utils/main.js';
import type { LayoutColumnProps, LayoutRootProps } from './props.js';

export type { LayoutColumnProps, LayoutRootProps } from './props.js';

// Layouts (UIKit `UISplitViewController`, iPadOS' columns): columns side by
// side, filling their container (e.g. `Viewport.Content`): a sidebar, a
// list, a detail; each its own scroll container (put a `Page` in it). A
// column takes a size (the app's, in px; between `minSize` and `maxSize`),
// or shares the free space with the other flexible ones; a `resizable` one
// is resized by dragging its divider (or arrow keys on it). Columns are
// divided by a hairline in `separator`.
//
// Compact (`compact`, e.g. on an iPhone, the app's choice), a `drawer`
// column (e.g. a sidebar) floats over the others from its side (inline start
// or end), hidden until opened: swiped in from that edge (or `open`), swiped
// back (or the dimmed content pressed) to close.
//
// Floating (a column's `floating`, e.g. for a `Sidebar`, iPadOS 26), a
// column floats over the others at the layout's start, which span the whole layout underneath it; a
// column next to it can keep its content clear of it (`clearFloating`: its
// pages' content inset by the floating column's size, their backgrounds and
// bars' edges running underneath it). Compact, a floating drawer has no
// background or shadow of its own (its content floats itself).
//
// Behind it all, a background of the app's choice (`Background`: any
// content, filling the whole layout), showing where columns have none.
//
// Deviations:
// - Resizable (iPadOS: fixed column widths, chosen by the system).
// - Drawers (iOS: a compact split view shows one column at a time, pushed
//   as a navigation stack; Framework7's panels swipe in).

// Behind its columns, filling it: its children layered, each filling it
// (images and videos covering it).
const Background = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bus-layout-background', className)}
      {...props}
    />
  ),
);

/** Its drawers' state (compact), for its columns. */
const regularContext = { compact: false };
const compactContext = { compact: true };
const LayoutContext = createContext(regularContext);

/** Dragged this far (of its size) or flung this fast (px/ms), it switches. */
const switchShare = 1 / 3;
const flingSpeed = 0.5;

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
 * `--styled-layout-floating-size` on its layout, as it changes (e.g.
 * resized), for the columns clear of it.
 */
const useFloatingSize = (
  columnRef: { current: HTMLDivElement | null },
  floating: boolean,
) => {
  useLayoutEffect(() => {
    const { current: column } = columnRef;
    const root = column?.parentElement;
    if (!column || !root || !floating) return undefined;

    const property = '--styled-layout-floating-size';
    const resizeObserver = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0]?.inlineSize ?? 0;
      root.style.setProperty(property, `${String(size)}px`);
    });
    resizeObserver.observe(column);

    return () => {
      resizeObserver.disconnect();
      root.style.removeProperty(property);
    };
  }, [columnRef, floating]);
};

/** A column side by side: sized (resizable), or sharing the free space. */
const SplitColumn = forwardRef<HTMLDivElement, LayoutColumnProps>(
  (
    {
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
      // (A drawer's only, see `DrawerColumn`.)
      defaultOpen,
      drawer,
      onOpenChange,
      open,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const { compact } = useContext(LayoutContext);
    useFloatingSize(ref, floating && !compact);
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
      '--styled-layout-column-size':
        size === undefined ? undefined : `${String(size)}px`,
      '--styled-layout-column-max': Number.isFinite(maxSize)
        ? `${String(maxSize)}px`
        : undefined,
      '--styled-layout-column-min': `${String(minSize)}px`,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        data-clear-floating={clearFloating ? '' : undefined}
        data-floating={floating ? '' : undefined}
        data-layout-part="column"
        data-resizable={resizable ? '' : undefined}
        style={columnStyle}
        {...props}
        className={cn('bus-layout-column', props.className)}
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
            className="bus-layout-divider"
            data-dragging={dragging ? '' : undefined}
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
      </div>
    );
  },
);

/** A drawer column (compact): over the others at its side, swiped in. */
const DrawerColumn = forwardRef<HTMLDivElement, LayoutColumnProps>(
  (
    {
      children,
      // (Beside a floating column only, see `SplitColumn`.)
      clearFloating: _clearFloating,
      defaultOpen = false,
      defaultSize,
      drawer,
      floating,
      maxSize = Infinity,
      minSize = 240,
      onOpenChange,
      // (Resizing: a split column's only.)
      onSizeChange: _onSizeChange,
      open: openProp,
      resizable: _resizable,
      size,
      style,
      ...props
    },
    ref,
  ) => {
    const [ownOpen, setOwnOpen] = useState(defaultOpen);
    const open = openProp ?? ownOpen;
    // While dragged: its progress (0: closed, 1: open).
    const [dragProgress, setDragProgress] = useState<number | undefined>(
      undefined,
    );
    const changeOpen = (next: boolean) => {
      setOwnOpen(next);
      if (next !== open) onOpenChange?.(next);
    };
    const columnStyle = {
      ...(style as CSSProperties | undefined),
      '--styled-layout-column-max': Number.isFinite(maxSize)
        ? `${String(maxSize)}px`
        : undefined,
      '--styled-layout-column-min': `${String(minSize)}px`,
    } as CSSProperties;

    // Dragging it (from its edge, itself, or the scrim): the pointer's
    // way along its side's direction moves it, once clearly sideways.
    const startDrag = (
      event: PointerEvent<HTMLElement>,
      from: 'closed' | 'open',
    ) => {
      if (event.button !== 0) return;
      const element = event.currentTarget;
      const root = element.parentElement;
      const column = root?.querySelector<HTMLElement>(
        ':scope > [data-layout-part=column][data-drawer]',
      );
      if (!root || !column) return;

      // Towards opening: away from its side.
      const rtl = getComputedStyle(root).direction === 'rtl';
      const opening = (drawer === 'inline-start') === rtl ? -1 : 1;
      const width = column.offsetWidth;
      const start = { x: event.clientX, y: event.clientY };
      let engaged = from === 'closed';
      let last = { time: event.timeStamp, x: event.clientX };
      let speed = 0;
      let progress = from === 'open' ? 1 : 0;
      if (engaged) element.setPointerCapture(event.pointerId);

      const move = (moveEvent: globalThis.PointerEvent) => {
        const dx = moveEvent.clientX - start.x;
        if (!engaged) {
          const dy = moveEvent.clientY - start.y;
          if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
          engaged = true;
          element.setPointerCapture(moveEvent.pointerId);
        }
        const elapsed = moveEvent.timeStamp - last.time;
        if (elapsed > 0) {
          speed = ((moveEvent.clientX - last.x) * opening) / elapsed;
        }
        last = { time: moveEvent.timeStamp, x: moveEvent.clientX };
        progress = Math.min(
          1,
          Math.max(0, (from === 'open' ? 1 : 0) + (dx * opening) / width),
        );
        setDragProgress(progress);
      };
      const end = () => {
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerup', end);
        element.removeEventListener('pointercancel', end);
        setDragProgress(undefined);
        if (!engaged) return;
        const next =
          from === 'closed'
            ? progress > switchShare || speed > flingSpeed
            : !(progress < 1 - switchShare || speed < -flingSpeed);
        changeOpen(next);
      };
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerup', end);
      element.addEventListener('pointercancel', end);
    };

    const progress = dragProgress ?? (open ? 1 : 0);
    const drawerStyle = {
      ...columnStyle,
      '--styled-layout-drawer-progress': String(progress),
      '--styled-layout-drawer-sign':
        drawer === 'inline-start'
          ? 'var(--styled-layout-start-sign)'
          : 'var(--styled-layout-end-sign)',
      '--styled-layout-drawer-size': `${String(size ?? defaultSize ?? 320)}px`,
    } as CSSProperties;

    return (
      <>
        {open ? null : (
          // Where a closed drawer is swiped in from: a strip at its edge.
          <div
            className="bus-layout-edge"
            data-layout-part="drawer-edge"
            data-side={drawer}
            onPointerDown={(event: PointerEvent<HTMLDivElement>) =>
              startDrag(event, 'closed')
            }
          />
        )}
        {/* The content dimmed behind an open drawer (pressed: closing it).
            (Over the columns, resizable ones raised too; below the drawer.) */}
        <div
          className="bus-layout-scrim"
          data-dragging={dragProgress === undefined ? undefined : ''}
          data-layout-part="scrim"
          data-open={open ? '' : undefined}
          style={drawerStyle}
          onClick={() => changeOpen(false)}
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            if (open) startDrag(event, 'open');
          }}
        />
        <div
          ref={ref}
          aria-hidden={open || dragProgress !== undefined ? undefined : true}
          data-dragging={dragProgress === undefined ? undefined : ''}
          data-drawer={drawer}
          data-floating={floating ? '' : undefined}
          data-layout-part="column"
          data-open={open ? '' : undefined}
          inert={!open && dragProgress === undefined}
          style={drawerStyle}
          {...props}
          className={cn('bus-layout-column', props.className)}
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            if (open) startDrag(event, 'open');
          }}
        >
          {children}
        </div>
      </>
    );
  },
);

/** A column: side by side (see `SplitColumn`), or (compact) a drawer. */
const Column = forwardRef<HTMLDivElement, LayoutColumnProps>((props, ref) => {
  const { compact } = useContext(LayoutContext);
  return compact && props.drawer !== undefined ? (
    <DrawerColumn
      ref={ref}
      {...props}
    />
  ) : (
    <SplitColumn
      ref={ref}
      {...props}
    />
  );
});

/**
 * A layout: its columns side by side (compact: drawers over them; floating
 * ones over the others), optionally on a `Background`.
 */
const Root = forwardRef<HTMLDivElement, LayoutRootProps>(
  ({ compact = false, ...props }, ref) => (
    <LayoutContext.Provider value={compact ? compactContext : regularContext}>
      <div
        ref={ref}
        data-compact={compact ? '' : undefined}
        data-layout-part="root"
        {...props}
        className={cn('bus-layout-root', props.className)}
      />
    </LayoutContext.Provider>
  ),
);

export const Layout = {
  Root,
  Background,
  Column,
};
