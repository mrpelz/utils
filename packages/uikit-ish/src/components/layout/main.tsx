import './style.css';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import {
  ComponentProps,
  createContext,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  RefObject,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import type {
  LayoutColumnProps,
  LayoutDrawerProps,
  LayoutDrawerSide,
  LayoutDrawerSwipeAreaProps,
  LayoutRootProps,
} from './props.js';

export type {
  LayoutColumnProps,
  LayoutDrawerProps,
  LayoutDrawerSide,
  LayoutDrawerSwipeAreaProps,
  LayoutRootProps,
} from './props.js';

// Layouts (UIKit `UISplitViewController`, iPadOS' columns): columns side by
// side, filling their container (e.g. `Viewport.Content`): a sidebar, a list, a
// detail; each its own scroll container (put a `Page` in it). A column takes a
// size (the app's, in px; between `minSize` and `maxSize`), or shares the free
// space with the other flexible ones; a `resizable` one is resized by dragging
// its divider (or arrow keys on it). Columns are divided by a hairline in
// `separator`.
//
// Compact (`compact`, e.g. on an iPhone, the app's choice), a column in a
// `Drawer` (e.g. a sidebar) floats over the others from its side (inline start
// or end), hidden until opened: swiped in from that edge (its `SwipeArea`) or
// by a `Trigger`, swiped back (or the dimmed content pressed, or a `Close`) to
// close. A drawer is Base UI's `Drawer` (its state the app's, or its own; a
// trigger outside it linked by a handle, `createDrawerHandle` or, in a
// component, `useCreateDrawerHandle`); regular, its column is side by side.
//
// Floating (a column's `floating`, e.g. for a `Sidebar`, iPadOS 26), a column
// floats over the others at the layout's start, which span the whole layout
// underneath it; a column next to it can keep its content clear of it
// (`clearFloating`: its pages' content inset by the floating column's size,
// their backgrounds and bars' edges running underneath it). Compact, a floating
// drawer has no background or shadow of its own (its content floats itself).
//
// Behind it all, a background of the app's choice (`Background`: any content,
// filling the whole layout), showing where columns have none.
//
// Deviations:
// - Resizable (iPadOS: fixed column widths, chosen by the system).
// - Drawers (iOS: a compact split view shows one column at a time, pushed as a
//   navigation stack; Framework7's panels swipe in).

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

/**
 * Whether it's compact (its drawers' columns over the others), its element
 * (their portals' container) and its direction (their sides' swipes).
 */
const LayoutContext = createContext<{
  compact: boolean;
  root: RefObject<HTMLDivElement | null>;
  rtl: boolean;
}>({ compact: false, root: { current: null }, rtl: false });

/** A drawer's side, for its parts (none: a column outside a drawer). */
const DrawerContext = createContext<LayoutDrawerSide | undefined>(undefined);

/** The physical direction a drawer at a side is swiped towards to close. */
const closingDirection = (side: LayoutDrawerSide, rtl: boolean) =>
  (side === 'inline-start') === rtl ? 'right' : 'left';

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
  floating: boolean,
) => {
  useLayoutEffect(() => {
    const { current: column } = columnRef;
    const root = column?.parentElement;
    if (!column || !root || !floating) return undefined;

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
  }, [columnRef, floating]);
};

/** A column side by side: sized (resizable), or sharing the free space. */
const SplitColumn = forwardRef<HTMLDivElement, LayoutColumnProps>(
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

    return (
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

/**
 * A drawer's column (compact): over the others at its side (Base UI's
 * `Drawer.Popup`), the content dimmed behind it; kept mounted while closed
 * (its pages keep their state).
 */
const DrawerColumn = forwardRef<HTMLDivElement, LayoutColumnProps>(
  (
    {
      className,
      // (Beside a floating column only, see `SplitColumn`.)
      clearFloating: _clearFloating,
      defaultSize,
      floating = false,
      maxSize = Infinity,
      minSize = 240,
      // (Resizing: a split column's only.)
      onSizeChange: _onSizeChange,
      resizable: _resizable,
      size: sizeProp,
      style,
      ...props
    },
    ref,
  ) => {
    const size = sizeProp ?? defaultSize ?? 320;
    const { root } = useContext(LayoutContext);
    const side = useContext(DrawerContext);

    return (
      <BaseDrawer.Portal
        keepMounted
        className="uikit-layout-drawer-portal"
        container={root}
      >
        <BaseDrawer.Backdrop
          className="uikit-layout-backdrop"
          data-layout-part="backdrop"
        />
        <BaseDrawer.Viewport
          className="uikit-layout-drawer-viewport"
          data-layout-part="drawer-viewport"
        >
          <BaseDrawer.Popup
            ref={ref}
            data-floating={floating ? '' : undefined}
            data-layout-part="column"
            data-side={side}
            style={withStyle(
              {
                '--uikit-layout-column-max': Number.isFinite(maxSize)
                  ? `${String(maxSize)}px`
                  : undefined,
                '--uikit-layout-column-min': `${String(minSize)}px`,
                '--uikit-layout-drawer-size': `${String(size)}px`,
              },
              style,
            )}
            {...props}
            className={cn('uikit-layout-column', className)}
          />
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    );
  },
);

/**
 * A column: side by side (see `SplitColumn`), or (compact, in a `Drawer`) a
 * drawer's.
 */
const Column = forwardRef<HTMLDivElement, LayoutColumnProps>((props, ref) => {
  const { compact } = useContext(LayoutContext);
  const side = useContext(DrawerContext);

  return compact && side !== undefined ? (
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
 * A drawer (Base UI's `Drawer.Root`): compact, its column (a `Column` in it)
 * over the others from its side, opened by its `SwipeArea` or a `Trigger`
 * (in it, or linked by its `handle`), closed by swiping it back, a press on
 * the dimmed content (unless `disablePointerDismissal`) or a `Close`.
 * Regular, its column is side by side (its state unused).
 */
const Drawer = <Payload,>({
  side = 'inline-start',
  ...props
}: LayoutDrawerProps<Payload>): ReactElement => {
  const { rtl } = useContext(LayoutContext);

  return (
    <DrawerContext.Provider value={side}>
      <BaseDrawer.Root
        swipeDirection={closingDirection(side, rtl)}
        {...props}
      />
    </DrawerContext.Provider>
  );
};

/**
 * Compact: a strip at its drawer's edge (`width`, 20px) it's swiped in from;
 * without one, a drawer isn't swiped in.
 */
const DrawerSwipeArea = forwardRef<HTMLDivElement, LayoutDrawerSwipeAreaProps>(
  ({ className, style, width = 20, ...props }, ref) => {
    const { compact } = useContext(LayoutContext);
    const side = useContext(DrawerContext);
    if (!compact || side === undefined) return null;

    return (
      <BaseDrawer.SwipeArea
        ref={ref}
        data-layout-part="drawer-swipe-area"
        data-side={side}
        style={withStyle(
          { '--uikit-layout-swipe-area-width': `${String(width)}px` },
          style,
        )}
        {...props}
        className={cn('uikit-layout-swipe-area', className)}
      />
    );
  },
);

/** A handle linking a drawer to its triggers outside it. */
export type LayoutDrawerHandle<Payload = unknown> = BaseDrawer.Handle<Payload>;

/**
 * A handle linking a drawer (its `handle`) to its triggers outside it (e.g.
 * in another column's bar, their `handle`), and opening or closing it
 * imperatively (Base UI's `Drawer.createHandle`): made once, e.g. at a
 * module's top level (in a component: `useCreateDrawerHandle`).
 */
const createDrawerHandle = <
  Payload = unknown,
>(): LayoutDrawerHandle<Payload> => BaseDrawer.createHandle<Payload>();

/**
 * `Layout.createDrawerHandle`, in a component: made once, for the
 * component's lifetime.
 */
export const useCreateDrawerHandle = <
  Payload = unknown,
>(): LayoutDrawerHandle<Payload> => {
  const [handle] = useState(() => createDrawerHandle<Payload>());

  return handle;
};

/**
 * A layout: its columns side by side (compact: its drawers' over them;
 * floating ones over the others), optionally on a `Background`.
 */
const Root = forwardRef<HTMLDivElement, LayoutRootProps>(
  ({ className, compact = false, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const [rtl, setRtl] = useState(false);

    // Its direction (inherited, or its own `dir`), for its drawers' swipes.
    useLayoutEffect(() => {
      if (!ref.current) return;
      setRtl(getComputedStyle(ref.current).direction === 'rtl');
    }, [ref, props.dir]);

    return (
      <LayoutContext.Provider value={{ compact, root: ref, rtl }}>
        <div
          ref={ref}
          data-compact={compact ? '' : undefined}
          data-layout-part="root"
          {...props}
          className={cn('uikit-layout-root', className)}
        />
      </LayoutContext.Provider>
    );
  },
);

export const Layout = {
  Root,
  Background,
  Column,
  Drawer,
  DrawerSwipeArea,
  DrawerTrigger: BaseDrawer.Trigger,
  DrawerClose: BaseDrawer.Close,
  createDrawerHandle,
};
