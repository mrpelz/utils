import { styled } from 'goober';
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

import { useForwardedRef } from './utils.js';

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
// Floating (`floating`, e.g. for a `Sidebar`, iPadOS 26), the first column
// floats over the others, which span the whole layout underneath it; a
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

const part = 'data-layout-part';

const StyledRoot = styled('div', forwardRef)`
  /* Which way a drawer at its inline start or end hides (left to right:
     the start to the left). */
  --styled-layout-start-sign: -1;
  --styled-layout-end-sign: 1;

  position: relative;
  display: flex;

  &:dir(rtl) {
    --styled-layout-start-sign: 1;
    --styled-layout-end-sign: -1;
  }

  overflow: hidden;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;

  /* (For its background, behind its columns.) */
  isolation: isolate;

  /* Floating (regular): its first column over the others (sized as it's
     given, or 320px), the hairline after it hidden. (Nested: goober
     mangles selectors continuing after parentheses.) */
  &[data-floating]:not([data-compact]) {
    & > [${part}='column']:not([${part}='column'] ~ *) {
      position: absolute;
      z-index: 3;
      width: var(--styled-layout-column-size, 320px);
      inset-block: 0;
      inset-inline-start: 0;

      & + [${part}='column']::before {
        content: none;
      }
    }
  }
`;

// Behind its columns, filling it: its children layered, each filling it
// (images and videos covering it).
const Background = styled('div', forwardRef)`
  position: absolute;
  z-index: -1;
  display: grid;
  overflow: hidden;
  inset: 0;

  & > * {
    width: 100%;
    min-width: 0;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
    grid-area: 1 / 1;
  }

  & > :is(img, video) {
    object-fit: cover;
  }
`;

export type LayoutColumnProps = ComponentProps<'div'> & {
  /**
   * Next to a floating column (see `Root`): its pages' content inset by the
   * floating column's size (`--styled-layout-inset-start`), their
   * backgrounds running underneath it.
   */
  clearFloating?: boolean;
  /** As a drawer: initially open (uncontrolled). */
  defaultOpen?: boolean;
  /** Its initial size (px, uncontrolled); without a size, it's flexible. */
  defaultSize?: number;
  /**
   * In a compact layout: floating over the others from this side, hidden
   * until opened (swiped in from that edge, or `open`).
   */
  drawer?: 'inline-end' | 'inline-start';
  /** Its largest size (px) when resized (default: none). */
  maxSize?: number;
  /** Its smallest size (px; default: 240, as a list's). */
  minSize?: number;
  /** As a drawer: called as it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Called while it's resized (by its divider). */
  onSizeChange?: (size: number) => void;
  /** As a drawer: open (controlled). */
  open?: boolean;
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

  /* Its content's layers (e.g. a page's sticky bar) kept inside it: below
     a floating column, drawers and the hairline before it. A resizable
     one above the next (its divider overhangs it). */
  isolation: isolate;

  &[data-resizable] {
    z-index: 1;
  }

  /* (Over a later resizable one too: its divider over that one's.) */
  &[data-resizable]:has(~ [data-resizable]) {
    z-index: 2;
  }

  & > * {
    flex: 1 1 auto;
  }

  /* Next to a floating column (see Root): its content clear of it. */
  &[data-clear-floating] {
    --styled-layout-inset-start: var(--styled-layout-floating-size, 0px);
  }

  /* A drawer (compact): over the others at its side, moved in by its
     progress (0: closed, 1: open), its sign the side it hides at. */
  &[data-drawer] {
    position: absolute;
    z-index: 5;
    width: var(--styled-layout-drawer-size);
    max-width: calc(100% - 44px);
    background-color: var(--color-ios-system-background);
    box-shadow: 0 0 30px
      rgb(0 0 0 / calc(var(--styled-layout-drawer-progress) * 20%));
    inset-block: 0;
    transition: translate 300ms cubic-bezier(0.2, 0.9, 0.3, 1);
    translate: calc(
        (1 - var(--styled-layout-drawer-progress)) * 100% *
          var(--styled-layout-drawer-sign)
      )
      0;
  }

  &[data-drawer='inline-start'] {
    inset-inline-start: 0;
  }

  &[data-drawer='inline-end'] {
    inset-inline-end: 0;
  }

  &[data-drawer][data-dragging] {
    transition: none;
  }

  /* Floating (see Root): its content floats itself. */
  [data-floating] > &[data-drawer] {
    background-color: transparent;
    box-shadow: none;
  }

  /* The hairline between columns. */
  & + &::before {
    position: absolute;
    z-index: 20;
    width: 0.33px;
    background-color: var(--color-ios-separator);
    content: '';
    inset-block: 0;
    inset-inline-start: 0;
    pointer-events: none;
  }

  /* (None after a drawer, compact: it's over the others.) */
  [data-compact] > &[data-drawer] + &::before {
    content: none;
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

// The content dimmed behind an open drawer (pressed: closing it).
// (Over the columns, resizable ones raised too; below the drawer.)
const Scrim = styled('div', forwardRef)`
  position: absolute;
  z-index: 4;
  background-color: rgb(0 0 0 / 20%);
  inset: 0;
  opacity: var(--styled-layout-drawer-progress);
  transition: opacity 300ms;

  &[data-dragging] {
    transition: none;
  }

  &:not([data-open]) {
    pointer-events: none;
  }
`;

// Where a closed drawer is swiped in from: a strip at its edge.
const Edge = styled('div', forwardRef)`
  position: absolute;
  z-index: 4;
  width: 20px;
  inset-block: 0;
  touch-action: pan-y;

  &[data-side='inline-start'] {
    inset-inline-start: 0;
  }

  &[data-side='inline-end'] {
    inset-inline-end: 0;
  }
`;

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

/** A column side by side: sized (resizable), or sharing the free space. */
const SplitColumn = forwardRef<HTMLDivElement, LayoutColumnProps>(
  (
    {
      children,
      clearFloating = false,
      defaultSize,
      maxSize = Infinity,
      minSize = 240,
      onSizeChange,
      resizable = false,
      size: controlledSize,
      style,
      // (A drawer's only, see `DrawerColumn`.)
      defaultOpen: _defaultOpen,
      drawer: _drawer,
      onOpenChange: _onOpenChange,
      open: _open,
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
      '--styled-layout-column-size':
        size === undefined ? undefined : `${String(size)}px`,
      '--styled-layout-column-max': Number.isFinite(maxSize)
        ? `${String(maxSize)}px`
        : undefined,
      '--styled-layout-column-min': `${String(minSize)}px`,
    } as CSSProperties;

    return (
      <StyledColumn
        ref={ref}
        data-clear-floating={clearFloating ? '' : undefined}
        data-resizable={resizable ? '' : undefined}
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
        `:scope > [${CSS.escape(part)}=column][data-drawer]`,
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
          <Edge
            data-side={drawer}
            {...{ [part]: 'drawer-edge' }}
            onPointerDown={(event: PointerEvent<HTMLDivElement>) =>
              startDrag(event, 'closed')
            }
          />
        )}
        <Scrim
          data-dragging={dragProgress === undefined ? undefined : ''}
          data-open={open ? '' : undefined}
          style={drawerStyle}
          {...{ [part]: 'scrim' }}
          onClick={() => changeOpen(false)}
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            if (open) startDrag(event, 'open');
          }}
        />
        <StyledColumn
          ref={ref}
          aria-hidden={open || dragProgress !== undefined ? undefined : true}
          data-dragging={dragProgress === undefined ? undefined : ''}
          data-drawer={drawer}
          data-open={open ? '' : undefined}
          inert={!open && dragProgress === undefined}
          {...{ [part]: 'column' }}
          style={drawerStyle}
          {...props}
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            if (open) startDrag(event, 'open');
          }}
        >
          {children}
        </StyledColumn>
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

export type LayoutRootProps = ComponentProps<'div'> & {
  /**
   * Compact (e.g. on an iPhone, by its width): `drawer` columns float over
   * the others, hidden until opened.
   */
  compact?: boolean;
  /**
   * Its first column floating over the others (e.g. a `Sidebar`), which
   * span it underneath (see `Column`'s `clearFloating`); compact, as a
   * drawer without a background or shadow of its own.
   */
  floating?: boolean;
};

/**
 * Publishes the floating column's size (regular) as
 * `--styled-layout-floating-size` on the layout, as it changes (e.g.
 * resized).
 */
const useFloatingSize = (
  rootRef: { current: HTMLDivElement | null },
  floating: boolean,
) => {
  useLayoutEffect(() => {
    const { current: root } = rootRef;
    if (!root || !floating) return undefined;

    const property = '--styled-layout-floating-size';
    let observed: Element | undefined;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0]?.inlineSize ?? 0;
      root.style.setProperty(property, `${String(size)}px`);
    });
    // Its first column (also once columns change).
    const observe = () => {
      const column =
        root.querySelector(`:scope > [${CSS.escape(part)}='column']`) ??
        undefined;
      if (column === observed) return;
      if (observed) resizeObserver.unobserve(observed);
      observed = column;
      if (column) resizeObserver.observe(column);
      else root.style.removeProperty(property);
    };
    observe();
    const mutationObserver = new MutationObserver(observe);
    mutationObserver.observe(root, { childList: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      root.style.removeProperty(property);
    };
  }, [floating, rootRef]);
};

/**
 * A layout: its columns side by side (compact: drawers over them; floating:
 * its first over the others), optionally on a `Background`.
 */
const Root = forwardRef<HTMLDivElement, LayoutRootProps>(
  ({ compact = false, floating = false, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    useFloatingSize(ref, floating && !compact);

    return (
      <LayoutContext.Provider value={compact ? compactContext : regularContext}>
        <StyledRoot
          ref={ref}
          data-compact={compact ? '' : undefined}
          data-floating={floating ? '' : undefined}
          {...{ [part]: 'root' }}
          {...props}
        />
      </LayoutContext.Provider>
    );
  },
);

export const Layout = {
  Root,
  Background,
  Column,
};
