import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  forwardRef,
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import { slop, useEditing } from './edit.js';
import {
  allSizes,
  cellOf,
  createReorderHandle,
  effectiveSize,
  type GridRange,
  type GridReorderHandle,
  handlesOf,
  reorder,
  sortSizes,
  spanOf,
  useCreateReorderHandle,
} from './handle.js';
import { layoutOf, mergedBy, unitOf, useReflow } from './layout.js';
import type {
  GridBreakProps,
  GridBreakRows,
  GridDropGroupProps,
  GridHeaderProps,
  GridItemProps,
  GridItemState,
  GridRemoveButtonProps,
  GridReorderPart,
  GridResizeHandleProps,
  GridRootProps,
  GridSectionProps,
  GridSize,
  GridSizeChangeDetails,
  GridSpacerProps,
  GridSpawnProps,
} from './props.js';

export { type GridReorderCells, GridReorderHandle } from './handle.js';
export type {
  GridBreakProps,
  GridBreakRows,
  GridDropGroupProps,
  GridHeaderProps,
  GridItemProps,
  GridItemState,
  GridReorderChange,
  GridReorderEventDetails,
  GridReorderHandleOptions,
  GridReorderInsert,
  GridReorderItem,
  GridReorderPart,
  GridReorderReason,
  GridReorderTarget,
  GridRemoveButtonProps,
  GridResizeHandleProps,
  GridRootProps,
  GridSectionProps,
  GridSize,
  GridSizeChangeDetails,
  GridSpacerProps,
  GridSpawnProps,
} from './props.js';

// A grid of square units (a home screen's, a control center's): items
// spanning 1 to 3 columns and rows each, in the app's order, never at
// positions of their own. The app stores the order (its children's) and
// each item's requested size, nothing else; where items land follows.
//
// - Units: as many columns as fit the grid's width at `unitSize` (100 to
//   130px, stretched to fill it: a phone's, 3), measured as it resizes, no
//   device classes. Square rows, as tall as a column is wide. The columns
//   are kept while their unit stays within `unitMin` and `unitMax` (the
//   units stretching along), and change as soon as it leaves them, the
//   items gliding to their new places at once. Not shown until measured.
// - Placement: CSS grid's own, in order (`grid-auto-flow: row`): an item that
//   doesn't fit the rest of a row starts the next, leaving a hole; `dense`
//   fills earlier holes with later items (not while editing: what's moved
//   stays where it's put; a section's own `dense` over the root's).
//   `Grid.Break` starts a new row (the next item's column set to the first:
//   CSS places it past the one before, a row down; editing, a cell to the
//   row's end, placed by measuring); `Grid.Spacer` a deliberate hole.
//   `Grid.Section`s are grids of their own on the same columns and unit, a
//   header across them.
// - Sizes: an item's size as requested (`size`, stored), snapped to what it
//   supports (`supportedSizes`: the same shape first, then the closest
//   area), then fitted to the columns: its effective size (`useGridItem`,
//   for what's in it, e.g. a card's level of detail). Width changes only
//   re-derive.
// - Changes glide (the items' positions, before and after, a `translate`
//   between them: FLIP), at rest; with reduced motion, at once.
// - Editing (`editing`, see edit.ts): cells (items, spacers, breaks) with a
//   reorder handle dragged (a touch held a moment first: a flick still
//   scrolls) to where it's a target, as List's rows: among a `Section`'s
//   (the `Root`'s) cells, or a `DropGroup`'s (a part of a section), in any
//   section. A placeholder where it'd land, moving with some inertia.
//   Spacers and breaks outlined. Dropped, the handle's `onReorder`, the app
//   moving it (`Grid.reorder`). By keyboard: Alt and an arrow key on a
//   focused one.
//   What's in them isn't acted on (clicks held back), except their edit
//   controls (`data-grid-edit-control`, e.g. `Grid.ResizeHandle`: an arc
//   in the corner, tapped or dragged).

/** A grid's columns, its unit, whether it's editing, dense. */
type GridContextValue = {
  columns: number;
  dense: boolean;
  editing: boolean;
  gap: number;
  unit: number;
};

const GridContext = createContext<GridContextValue>({
  columns: 3,
  dense: false,
  editing: false,
  gap: 12,
  unit: 110,
});

const GridItemContext = createContext<GridItemState | undefined>(undefined);

/** The range its cells drop among (none: they're no target). */
const GridRangeContext = createContext<GridRange | undefined>(undefined);

/** The grid (or section) its cells are in, for a `DropGroup`. */
const GridContainerContext = createContext<RefObject<HTMLElement | null>>({
  current: null,
});

/**
 * A range of cells (see `GridRange`), its handles' while it has any; its
 * cells registering with it (see `useCellEntry`).
 */
const useRange = (
  part: GridReorderPart,
  reorderHandle: GridReorderHandle | readonly GridReorderHandle[] | undefined,
  dropName: string | undefined,
  container: RefObject<HTMLElement | null>,
) => {
  const latest = useRef({ dropName, reorderHandle });
  useLayoutEffect(() => {
    latest.current = { dropName, reorderHandle };
  });
  const [range] = useState<GridRange>(() => ({
    container: () => container.current,
    handles: () => handlesOf(latest.current.reorderHandle),
    members: new Set(),
    name: () => latest.current.dropName,
    part,
  }));
  useLayoutEffect(() => {
    const handles = handlesOf(reorderHandle);
    for (const handle of handles) handle.ranges.add(range);
    return () => {
      for (const handle of handles) handle.ranges.delete(range);
    };
  }, [range, reorderHandle]);
  return reorderHandle === undefined ? undefined : range;
};

/**
 * A cell (an item, spacer, break) in reordering: its handles, its name, its
 * range; movable while editing, with a handle.
 */
const useCellEntry = (
  ref: RefObject<HTMLElement | null>,
  reorderHandle: GridReorderHandle | readonly GridReorderHandle[] | undefined,
  dropName: string | undefined,
  // (Among its range's cells (what's dropped among); a `Spawn` only with
  // a handle.)
  isMember = true,
) => {
  const { editing } = useContext(GridContext);
  const range = useContext(GridRangeContext);
  const latest = useRef({ dropName, reorderHandle });
  useLayoutEffect(() => {
    latest.current = { dropName, reorderHandle };
  });
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    const handles = handlesOf(reorderHandle);
    cellOf.set(element, {
      handles: () => handlesOf(latest.current.reorderHandle),
      name: () => latest.current.dropName,
      range,
    });
    if (isMember) range?.members.add(element);
    for (const handle of handles) handle.cells.add(element);
    return () => {
      cellOf.delete(element);
      range?.members.delete(element);
      for (const handle of handles) handle.cells.delete(element);
    };
  }, [isMember, range, ref, reorderHandle]);
  const isMovable = editing && handlesOf(reorderHandle).length > 0;
  return {
    'data-grid-movable': isMovable ? '' : undefined,
    'data-grid-name': dropName,
    // (Movable: focusable, moved by keyboard.)
    tabIndex: isMovable ? 0 : undefined,
  };
};

/**
 * The item it's in: its effective size, as requested, supported, whether
 * its grid's editing, and asking for another size. Outside a grid:
 * `undefined`.
 */
export const useGridItem = (): GridItemState | undefined =>
  useContext(GridItemContext);

/** A grid: its items, in order, placed on square units (see the top). */
const Root = forwardRef<HTMLDivElement, GridRootProps>(
  (
    {
      children,
      className,
      dense = false,
      dropName,
      editing = false,
      gap = 12,
      reorderHandle,
      style,
      unitMax = 130,
      unitMin = 100,
      unitSize = 110,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const dragged = useRef<HTMLElement | null>(null);
    const [layout, setLayout] = useState({
      columns: 3,
      isMeasured: false,
      unit: unitSize,
    });

    useLayoutEffect(() => {
      const { current: root } = ref;
      if (!root) return undefined;
      let current: { columns: number; unit: number } | undefined;
      const apply = (next: { columns: number; unit: number }) => {
        if (current?.columns === next.columns && current.unit === next.unit) {
          return;
        }
        current = next;
        // (On it at once, before it's painted: not a frame of the old
        // columns at the new width; what's in it re-rendered after.)
        root.style.setProperty('--uikit-grid-columns', String(next.columns));
        root.style.setProperty('--uikit-grid-unit', `${String(next.unit)}px`);
        setLayout({ ...next, isMeasured: true });
      };
      // (The columns kept while their unit's in range; else changed at
      // once: see the top.)
      const measure = () => {
        const width = root.clientWidth;
        const next = layoutOf(width, gap, unitMin, unitSize, unitMax);
        if (!current) {
          apply(next);
          return;
        }
        const { columns } = current;
        const unit = unitOf(width, gap, columns);
        apply(unit >= unitMin && unit <= unitMax ? { columns, unit } : next);
      };
      measure();
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(root);
      return () => {
        resizeObserver.disconnect();
      };
    }, [gap, ref, unitMax, unitMin, unitSize]);

    useReflow(ref, dragged, editing);
    useEditing(ref, dragged, editing);
    const range = useRange('Root', reorderHandle, dropName, ref);

    const value = useMemo(
      () => ({
        columns: layout.columns,
        dense,
        editing,
        gap,
        unit: layout.unit,
      }),
      [dense, editing, gap, layout],
    );

    return (
      <GridContext.Provider value={value}>
        <GridContainerContext.Provider value={ref}>
          <GridRangeContext.Provider value={range}>
            <div
              ref={ref}
              data-dense={dense && !editing ? '' : undefined}
              data-editing={editing ? '' : undefined}
              data-grid-drop={range ? '' : undefined}
              data-grid-measured={layout.isMeasured ? '' : undefined}
              data-grid-part="root"
              style={withStyle(
                {
                  '--uikit-grid-columns': String(layout.columns),
                  '--uikit-grid-gap': `${String(gap)}px`,
                  '--uikit-grid-unit': `${String(layout.unit)}px`,
                },
                style,
              )}
              {...props}
              className={cn('uikit-grid-root', className)}
            >
              {children}
            </div>
          </GridRangeContext.Provider>
        </GridContainerContext.Provider>
      </GridContext.Provider>
    );
  },
);

/**
 * A titled run of items, placed on its own (its header across it); with a
 * `reorderHandle`, its cells' gaps a target (see `GridReorderHandle`).
 */
const Section = forwardRef<HTMLElement, GridSectionProps>(
  (
    { children, className, dense, dropName, reorderHandle, ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const grid = useContext(GridContext);
    const isDense = (dense ?? grid.dense) && !grid.editing;
    const range = useRange('Section', reorderHandle, dropName, ref);
    return (
      <GridContainerContext.Provider value={ref}>
        <GridRangeContext.Provider value={range}>
          <section
            ref={ref}
            data-dense={isDense ? '' : undefined}
            data-grid-drop={range ? '' : undefined}
            data-grid-part="section"
            {...props}
            className={cn('uikit-grid-section', className)}
          >
            {children}
          </section>
        </GridRangeContext.Provider>
      </GridContainerContext.Provider>
    );
  },
);

/**
 * A part of a section (no element): its cells' gaps a target for its
 * handles (see `GridReorderHandle`), e.g. a section's pinned cells and the
 * rest.
 */
const DropGroup: FunctionComponent<GridDropGroupProps> = ({
  children,
  dropName,
  reorderHandle,
}) => {
  const container = useContext(GridContainerContext);
  const range = useRange('DropGroup', reorderHandle, dropName, container);
  return (
    <GridRangeContext.Provider value={range}>
      {children}
    </GridRangeContext.Provider>
  );
};

/** A section's header: its title, across its columns. */
const Header = forwardRef<HTMLDivElement, GridHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-grid-part="header"
      {...props}
      className={cn('uikit-grid-header', className)}
    />
  ),
);

/** A size change taking nothing in (see `GridSizeChangeDetails`). */
const noneMerged: GridSizeChangeDetails = { merged: [] };

/**
 * An item's (or spacer's) sizes: requested (its `size`, else its own),
 * effective (see the top), asked to change; for `useGridItem`.
 */
const useCell = ({
  defaultSize = '1x1',
  onSizeChange,
  size: controlledSize,
  supportedSizes = allSizes,
}: {
  defaultSize?: GridSize;
  onSizeChange?: (size: GridSize, details: GridSizeChangeDetails) => void;
  size?: GridSize;
  supportedSizes?: readonly GridSize[];
}) => {
  const { columns, editing } = useContext(GridContext);
  const [ownSize, setOwnSize] = useState(defaultSize);
  const requested = controlledSize ?? ownSize;
  const supportedKey = supportedSizes.join(',');
  const sorted = useMemo(
    () => sortSizes(supportedSizes),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- by content
    [supportedKey],
  );
  const { isFitted, size } = effectiveSize(requested, sorted, columns);
  const requestSize = useCallback(
    (next: GridSize, details?: GridSizeChangeDetails) => {
      setOwnSize(next);
      onSizeChange?.(next, details ?? noneMerged);
    },
    [onSizeChange],
  );
  const state = useMemo(
    () => ({
      editing,
      isFitted,
      requested,
      requestSize,
      size,
      supportedSizes: sorted,
    }),
    [editing, isFitted, requestSize, requested, size, sorted],
  );
  const [spanColumns, spanRows] = spanOf(size);
  return {
    spanStyle: {
      '--uikit-grid-item-columns': String(spanColumns),
      '--uikit-grid-item-rows': String(spanRows),
    },
    state,
  };
};

/**
 * An item: a cell spanning its effective size (see the top), what's in it
 * filling it (e.g. a `Card`), its sizes read with `useGridItem`.
 */
const Item = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      className,
      defaultSize,
      dropName,
      onSizeChange,
      reorderHandle,
      size: controlledSize,
      style,
      supportedSizes,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const entry = useCellEntry(ref, reorderHandle, dropName);
    const { spanStyle, state } = useCell({
      defaultSize,
      onSizeChange,
      size: controlledSize,
      supportedSizes,
    });

    return (
      <GridItemContext.Provider value={state}>
        <div
          ref={ref}
          data-grid-part="item"
          data-size={state.size}
          style={withStyle(spanStyle, style)}
          {...entry}
          {...props}
          className={cn('uikit-grid-item', className)}
        />
      </GridItemContext.Provider>
    );
  },
);

/**
 * Where something's added (an item, by the app): a cell of its size,
 * dashed, a sign in its middle (see the CSS), a button (`render`: e.g. a
 * menu's trigger), what it adds and where (e.g. before it, or in its
 * place) up to the app; in and out of editing. Placed as an item is; not
 * moved, unless it has a `reorderHandle` (e.g. placeholders to be filled
 * in); resized by a `ResizeHandle` in it.
 */
const Spawn = forwardRef<HTMLButtonElement, GridSpawnProps>(
  (
    {
      className,
      defaultSize,
      dropName,
      onSizeChange,
      render,
      reorderHandle,
      size: controlledSize,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const entry = useCellEntry(
      ref,
      reorderHandle,
      dropName,
      handlesOf(reorderHandle).length > 0,
    );
    const { spanStyle, state } = useCell({
      defaultSize,
      onSizeChange,
      size: controlledSize,
    });
    const element = useRender({
      defaultTagName: 'button',
      props: {
        'aria-label': 'Add',
        // (An item to the grid; pressed while editing too (an edit
        // control), dragged from (moved, if it's movable).)
        'data-grid-drag-through': '',
        'data-grid-edit-control': '',
        'data-grid-part': 'item',
        'data-size': state.size,
        style: withStyle(spanStyle, style),
        type: 'button',
        ...entry,
        ...props,
        className: cn('uikit-grid-item uikit-grid-spawn', className),
      },
      ref,
      render,
    });
    return (
      <GridItemContext.Provider value={state}>
        {element}
      </GridItemContext.Provider>
    );
  },
);

/**
 * A deliberate hole, as big as an item of its size (any: fitted to the
 * columns); editing, outlined, what's in it shown (e.g. a control removing
 * it, a `ResizeHandle`), moved as items are (named).
 */
const Spacer = forwardRef<HTMLDivElement, GridSpacerProps>(
  (
    {
      className,
      defaultSize,
      dropName,
      onSizeChange,
      reorderHandle,
      size: controlledSize,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const entry = useCellEntry(ref, reorderHandle, dropName);
    const { spanStyle, state } = useCell({
      defaultSize,
      onSizeChange,
      size: controlledSize,
    });
    return (
      <GridItemContext.Provider value={state}>
        <div
          ref={ref}
          aria-hidden={state.editing ? undefined : true}
          data-grid-part="spacer"
          data-size={state.size}
          style={withStyle(spanStyle, style)}
          {...entry}
          {...props}
          className={cn('uikit-grid-spacer', className)}
        />
      </GridItemContext.Provider>
    );
  },
);

/** The supported size closest to a span (ties: the smaller). */
const closestSize = (
  supported: readonly GridSize[],
  columns: number,
  rows: number,
) => {
  let best: GridSize | undefined;
  let distance = Number.POSITIVE_INFINITY;
  for (const size of supported) {
    const [c, r] = spanOf(size);
    const next = Math.abs(c - columns) + Math.abs(r - rows);
    if (!(next < distance)) {
      continue;
    }

    best = size;
    distance = next;
  }
  return best;
};

/** How far past halfway a resize drag goes before a span changes (units). */
const resizeHysteresis = 0.2;

/**
 * A cell's size to be while its handle's held (see `ResizeHandle`):
 * outlined over it (see the CSS), nothing moving yet; none, none.
 */
const showResize = (cell: HTMLElement, size: GridSize | undefined) => {
  if (!size) {
    delete cell.dataset.gridResizing;
    cell.style.removeProperty('--uikit-grid-resize-columns');
    cell.style.removeProperty('--uikit-grid-resize-rows');
    return;
  }
  const [columns, rows] = spanOf(size);
  cell.dataset.gridResizing = '';
  cell.style.setProperty('--uikit-grid-resize-columns', String(columns));
  cell.style.setProperty('--uikit-grid-resize-rows', String(rows));
};

/**
 * A press's own mouse events (after it's released: a touch's, then a
 * click) swallowed, wherever they land (a touch's aimed at what's nearest,
 * e.g. a neighboring spawn opening its menu on its mouse down); only the
 * next of each, soon after.
 */
const swallow = (event: MouseEvent) => {
  event.preventDefault();
  event.stopImmediatePropagation();
};

const swallowClick = (pointerType: string) => {
  // (A mouse's own mouse down came before it was released.)
  const swallowed =
    pointerType === 'mouse'
      ? (['mouseup', 'click'] as const)
      : (['mousedown', 'mouseup', 'click'] as const);
  for (const type of swallowed) {
    window.addEventListener(type, swallow, { capture: true, once: true });
  }
  window.setTimeout(() => {
    for (const type of swallowed) {
      window.removeEventListener(type, swallow, { capture: true });
    }
  }, 400);
};

/** Cells to be taken in by a resize (see `mergedBy`), marked (see the CSS). */
const markMerged = (cells: readonly HTMLElement[], isMerging: boolean) => {
  for (const cell of cells) {
    cell.toggleAttribute('data-grid-merging', isMerging);
  }
};

/**
 * Resizing its item (or spacer, break), editing (an edit control): pressed
 * by a key, its next supported size fitting the columns (after the
 * largest, the smallest; unless its `onClick` prevents it), a pointer's
 * press alone changing nothing; dragged, grown or shrunk by as many units
 * as it's dragged (the supported size closest, fitted to the columns), a
 * span changing once it's dragged a little past halfway. Outlined while
 * held (its size as it is first), the grid reflowing once it's released
 * (cancelled: not at all); grown over spacers and breaks, taking them in
 * (see `mergedBy`; marked while held; the app's to remove, see
 * `GridSizeChangeDetails`). E.g. a card's corner (`render`).
 */
const ResizeHandle = forwardRef<HTMLButtonElement, GridResizeHandleProps>(
  ({ className, onClick, render, ...props }, ref) => {
    const { columns, gap, unit } = useContext(GridContext);
    const item = useContext(GridItemContext);
    const drag = useRef<
      | {
          cell: HTMLElement | null;
          from: readonly [number, number];
          id: number;
          isDragging: boolean;
          /** What it'd take in at `next` (marked, see the CSS). */
          merged: HTMLElement[];
          next?: GridSize;
          span: [number, number];
          start: readonly [number, number];
        }
      | undefined
    >(undefined);
    const sizes =
      item?.supportedSizes.filter((size) => spanOf(size)[0] <= columns) ?? [];
    const sizeIndex = item ? sizes.indexOf(item.size) : -1;
    // (Only larger: grows; only smaller: shrinks.)
    let direction: 'both' | 'grow' | 'shrink' = 'both';
    if (sizeIndex <= 0) direction = 'grow';
    else if (sizeIndex >= sizes.length - 1) direction = 'shrink';
    const sign = {
      both: undefined,
      grow: 'M24 26h4M26 24v4',
      shrink: 'M24 26h4',
    }[direction];

    const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!item?.editing || !event.isPrimary) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = {
        cell: event.currentTarget.closest<HTMLElement>(
          '[data-grid-part="item"], [data-grid-part="spacer"], [data-grid-part="break"]',
        ),
        from: spanOf(item.size),
        id: event.pointerId,
        isDragging: false,
        merged: [],
        span: spanOf(item.size),
        start: [event.clientX, event.clientY],
      };
      // (Outlined from the touch on: its size, as it is.)
      if (drag.current.cell) showResize(drag.current.cell, item.size);
    };

    const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
      const { current } = drag;
      if (!current || current.id !== event.pointerId || !item) return;
      const at = [event.clientX, event.clientY] as const;
      if (
        !current.isDragging &&
        Math.hypot(at[0] - current.start[0], at[1] - current.start[1]) < slop
      ) {
        return;
      }
      current.isDragging = true;
      const step = unit + gap;
      // (By how far it's dragged: wherever on its cell it is.)
      const raw = [
        current.from[0] + (at[0] - current.start[0]) / step,
        current.from[1] + (at[1] - current.start[1]) / step,
      ];
      const span = current.span.map((was, axis) => {
        const wanted = raw[axis] ?? was;
        return Math.abs(wanted - was) < 0.5 + resizeHysteresis
          ? was
          : Math.min(3, Math.max(1, Math.round(wanted)));
      }) as [number, number];
      if (span[0] === current.span[0] && span[1] === current.span[1]) return;
      current.span = span;
      const next = closestSize(
        sizes.length > 0 ? sizes : item.supportedSizes,
        span[0],
        span[1],
      );
      current.next = next;
      if (current.cell && next) {
        showResize(current.cell, next);
        markMerged(current.merged, false);
        const [nextColumns, nextRows] = spanOf(next);
        current.merged =
          next === item.size
            ? []
            : mergedBy(current.cell, nextColumns, nextRows);
        markMerged(current.merged, true);
      }
    };

    // (Released: its size to be, requested; cancelled, none.)
    const onPointerEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
      const { current } = drag;
      if (current?.id !== event.pointerId) return;
      drag.current = undefined;
      // (Its own mouse events too, dragged or not: a pointer's press alone
      // changes nothing, see `onClick`.)
      swallowClick(event.pointerType);
      if (current.cell) showResize(current.cell, undefined);
      markMerged(current.merged, false);
      if (
        event.type === 'pointerup' &&
        current.next &&
        current.next !== item?.size
      ) {
        item?.requestSize(current.next, {
          merged: current.merged
            .map(({ dataset }) => dataset.gridName)
            .filter((name): name is string => name !== undefined),
        });
      }
    };

    const element = useRender({
      defaultTagName: 'button',
      props: {
        'aria-label': 'Resize',
        children: (
          <svg
            aria-hidden
            className="uikit-grid-resize-handle-arc"
            viewBox="0 0 44 44"
          >
            {/* (Concentric with a 24px corner, 8px in; its middle only.
                Backings first, under every line.) */}
            <path
              className="uikit-grid-resize-handle-backing"
              d="M34.8 26.1A16 16 0 0 1 26.1 34.8"
            />
            {sign ? (
              <path
                className="uikit-grid-resize-handle-backing uikit-grid-resize-handle-sign-backing"
                d={sign}
              />
            ) : null}
            <path d="M34.8 26.1A16 16 0 0 1 26.1 34.8" />
            {sign ? (
              <path
                className="uikit-grid-resize-handle-sign"
                d={sign}
              />
            ) : null}
          </svg>
        ),
        className: cn('uikit-grid-resize-handle', className),
        'data-direction': direction,
        'data-grid-edit-control': '',
        'data-grid-part': 'resize-handle',
        type: 'button',
        ...props,
        onClick: (event: ReactMouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          // (Pressed by a pointer: not without a drag (a touch let go where
          // it started changes nothing); by a key, the next size fitting
          // the columns.)
          if (event.defaultPrevented || !item || event.detail !== 0) return;
          const { requestSize, size } = item;
          requestSize(sizes[(sizes.indexOf(size) + 1) % sizes.length] ?? size);
        },
        onLostPointerCapture: onPointerEnd,
        onPointerCancel: onPointerEnd,
        onPointerDown,
        onPointerMove,
        onPointerUp: onPointerEnd,
      },
      ref,
      render,
    });
    // (Editing only, and only with another size to be.)
    return item?.editing && sizes.length > 1 ? element : null;
  },
);

/**
 * Removing its item (or spacer, break), editing (an edit control): an x
 * in its top leading corner, drawn as a `ResizeHandle` is, a 44px target;
 * what it removes is up to its `onClick` (the app's data). Dragged from
 * (held first, by touch), its cell's moved instead, not removed. E.g. a
 * card's corner (`render`).
 */
const RemoveButton = forwardRef<HTMLButtonElement, GridRemoveButtonProps>(
  ({ className, render, ...props }, ref) => {
    const item = useContext(GridItemContext);
    const element = useRender({
      defaultTagName: 'button',
      props: {
        'aria-label': 'Remove',
        children: (
          <svg
            aria-hidden
            className="uikit-grid-remove-button-x"
            viewBox="0 0 44 44"
          >
            {/* (In its corner as the arc is in its own.) */}
            <path
              className="uikit-grid-remove-button-backing"
              d="M13 13l7 7M20 13l-7 7"
            />
            <path d="M13 13l7 7M20 13l-7 7" />
          </svg>
        ),
        className: cn('uikit-grid-remove-button', className),
        // (Dragged from, as its cell: a finger meant for the cell; see
        // edit.ts. Tapped, its `onClick`.)
        'data-grid-drag-through': '',
        'data-grid-edit-control': '',
        'data-grid-part': 'remove-button',
        type: 'button',
        ...props,
      },
      ref,
      render,
    });
    return item?.editing ? element : null;
  },
);

/** A break's sizes (see `Break`): a unit wide, its rows tall. */
const breakSizes: readonly GridSize[] = ['1x1', '1x2', '1x3'];

/**
 * The next item starts a new row (see the top); of more rows, the rows
 * below it kept empty too, the next item starting below them (see
 * layout.ts). Editing: a cell from where it is to its row's end (a whole
 * row after a full one), as tall as its rows, outlined as a spacer, what's
 * in it shown (e.g. a control removing it, a `ResizeHandle`: its rows),
 * moved as items are (named).
 */
const Break = forwardRef<HTMLDivElement, GridBreakProps>(
  (
    {
      children,
      className,
      defaultRows = 1,
      dropName,
      onRowsChange,
      reorderHandle,
      rows: controlledRows,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const { editing } = useContext(GridContext);
    const entry = useCellEntry(ref, reorderHandle, dropName);
    const [ownRows, setOwnRows] = useState(defaultRows);
    const rows = controlledRows ?? ownRows;
    // (Its rows as a size, for a `ResizeHandle`: a unit wide.)
    const requestSize = useCallback(
      (size: GridSize, details?: GridSizeChangeDetails) => {
        const next = spanOf(size)[1] as GridBreakRows;
        setOwnRows(next);
        onRowsChange?.(next, details ?? noneMerged);
      },
      [onRowsChange],
    );
    const state = useMemo((): GridItemState => {
      const size: GridSize = `1x${rows}`;
      return {
        editing,
        isFitted: false,
        requested: size,
        requestSize,
        size,
        supportedSizes: breakSizes,
      };
    }, [editing, requestSize, rows]);
    return (
      <GridItemContext.Provider value={state}>
        <div
          ref={ref}
          aria-hidden={editing ? undefined : true}
          data-grid-part="break"
          data-grid-rows={rows}
          style={withStyle({ '--uikit-grid-break-rows': String(rows) }, style)}
          {...entry}
          {...props}
          className={cn('uikit-grid-break', className)}
        >
          {children}
          {/* (Where it's anchored: its first row's end, see the CSS.) */}
          <span
            aria-hidden
            className="uikit-grid-break-sign"
          />
        </div>
      </GridItemContext.Provider>
    );
  },
);

export const Grid = {
  Root,
  Section,
  DropGroup,
  Header,
  Item,
  Spacer,
  Spawn,
  Break,
  ResizeHandle,
  RemoveButton,
  createReorderHandle,
  reorder,
  useCreateReorderHandle,
};
