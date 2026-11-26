import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  forwardRef,
  FunctionComponent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import type { SymbolIcon } from '../symbol/main.js';
import {
  cn,
  reducedMotionOf,
  useForwardedRef,
  withStyle,
} from '../utils/main.js';
import { dashCountOf, dashRadius } from './dashes.js';
import { slop, touchHold, useEditing } from './edit.js';
import {
  cellOf,
  createReorderHandle,
  effectiveSize,
  type GridRange,
  type GridReorderHandle,
  handlesOf,
  isFull,
  measureOf,
  reorder,
  sizesUpTo,
  sortSizes,
  spanOf,
  useCreateReorderHandle,
} from './handle.js';
import { gridIcons } from './icons.js';
import {
  breakOutlineOf,
  fullOutlineOf,
  layoutOf,
  mergedBy,
  type Metrics,
  metricsOf,
  reflowDuration,
  reflowEasing,
  unitOf,
  unitRangeOf,
  useReflow,
} from './layout.js';
import { useOverlay } from './overlay.js';
import { type At, landingOf, type Unit } from './plan.js';
import type {
  GridAreaButtonProps,
  GridAreaProps,
  GridAreaState,
  GridBreakProps,
  GridBreakRows,
  GridCornerButtonProps,
  GridDropGroupProps,
  GridExpandedChangeReason,
  GridHeaderProps,
  GridItemProps,
  GridItemState,
  GridOpenChangeReason,
  GridPlacement,
  GridRemoveButtonProps,
  GridReorderPart,
  GridResizeHandleProps,
  GridRootProps,
  GridSectionProps,
  GridSize,
  GridSizeChangeDetails,
  GridSizeFit,
  GridSpacerProps,
  GridSpawnProps,
} from './props.js';
import {
  GridItemLayoutProvider,
  ShapeSnapshot,
  useReshape,
} from './reshape.js';

export { type GridReorderCells, GridReorderHandle } from './handle.js';
export { gridIcons } from './icons.js';
// (The reflow's timing: what moves with it, e.g. what's in a tile as it
// changes its box, see reshape.ts.)
export { reflowDuration, reflowEasing } from './layout.js';
export { startWithFrame, useGridItemLayout } from './reshape.js';
export type {
  GridAreaButtonProps,
  GridAreaProps,
  GridAreaState,
  GridCorner,
  GridCornerButtonProps,
  GridWhileEditing,
  GridBreakProps,
  GridBreakRows,
  GridDropGroupProps,
  GridExpandedChangeDetails,
  GridExpandedChangeReason,
  GridHeaderProps,
  GridItemLayoutChange,
  GridItemLayoutHandlers,
  GridItemProps,
  GridItemState,
  GridOpenChangeDetails,
  GridOpenChangeReason,
  GridPlacement,
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
  GridSizeFit,
  GridSpacerProps,
  GridSpawnProps,
} from './props.js';

/** A boolean data attribute's value: present, or not. */
const flagOf = (is: boolean) => (is ? '' : undefined);

// A grid of square units (a home screen's, a control center's): items
// spanning some columns and rows each (up to its columns and its
// `maxTileRows`), in the app's order, never at
// positions of their own. The app stores the order (its children's) and
// each item's requested size, nothing else; where items land follows.
//
// - Units: as many columns as fit the grid's width at `unitSize` (100 to
//   130px, stretched to fill it: a phone's, 3), never fewer than
//   `minColumns` (3), measured as it resizes, no device classes. Square rows, as tall as a column is wide. The columns
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

/** A grid's columns (its fewest), its unit, whether it's editing, dense. */
type GridContextValue = {
  columns: number;
  dense: boolean;
  editing: boolean;
  gap: number;
  maxTileRows: number;
  minColumns: number;
  unit: number;
};

const GridContext = createContext<GridContextValue>({
  columns: 3,
  dense: false,
  editing: false,
  gap: 12,
  maxTileRows: 3,
  minColumns: 3,
  unit: 110,
});

/**
 * A cell's sizes and state (see `useCell`): its item's (see `useGridItem`),
 * and its area's, inside the library (see `useGridArea`).
 */
type CellState = GridItemState & {
  /** Its effective area: the room it takes (its size, without one). */
  area: GridSize;
  /** Whether it has an area (a `Grid.Area` in it). */
  hasArea: boolean;
  /** Whether its area's sizes are free (no list given: any size). */
  isFreeArea: boolean;
  /** Whether its sizes are free (no list given: any size). */
  isFreeSize: boolean;
  movable: boolean;
  placement: GridPlacement;
  requestArea: (area: GridSize, details?: GridSizeChangeDetails) => void;
  requestPlacement: (placement: GridPlacement) => void;
  supportedAreas: readonly GridSize[];
};

const GridItemContext = createContext<CellState | undefined>(undefined);

/** An item's area's state, public (see `useGridArea`); none, none. */
const GridAreaStateContext = createContext<GridAreaState | undefined>(
  undefined,
);

/**
 * An area as its `Grid.Area` has it (see `useCell`): what it asks for, and
 * how it's asked to change.
 */
type AreaSpec = {
  movable: boolean;
  placement: GridPlacement;
  requestPlacement: (placement: GridPlacement) => void;
  requestSize: (size: GridSize, details?: GridSizeChangeDetails) => void;
  requested: GridSize | undefined;
  supported: readonly GridSize[] | undefined;
};

/**
 * An item's (or add tile's) area, from its `Grid.Area` (registering,
 * see `Area`), and where its controls go: in its cell, beside its tile,
 * not in it (not moved as its tile is).
 */
type AreaHost = {
  register: (spec: AreaSpec | undefined) => void;
  slot: HTMLElement | null;
};

const GridAreaHostContext = createContext<AreaHost | undefined>(undefined);

/** Whether what's in it is an area's (see `Area`): its controls act on it. */
const GridAreaScopeContext = createContext(false);

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

/**
 * The area of the item it's in (see `Grid.Area`): its effective size, as
 * requested, supported, its tile's placement in it, and asking for
 * another size or placement. Without an area, or outside a grid:
 * `undefined`.
 */
export const useGridArea = (): GridAreaState | undefined =>
  useContext(GridAreaStateContext);

/**
 * An item's (or add tile's) area, as registered by its `Grid.Area` (see
 * `Area`): its spec, kept until it changes (by value), and the context
 * its `Grid.Area` registers through.
 */
const useAreaHost = () => {
  const [spec, setSpec] = useState<AreaSpec | undefined>(undefined);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const host = useMemo(() => ({ register: setSpec, slot }), [slot]);
  return { host, setSlot, spec };
};

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
      maxTileRows = 3,
      minColumns = 3,
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
      columns: minColumns,
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
      // (Editing: its columns narrower, beside its end-of-line column (see
      // the CSS), as wide as its room at its end as it is (opening or
      // closing), less a gap: their width, that column's, that room, for
      // what's placed and drawn by them.)
      const padded =
        root.querySelector<HTMLElement>(
          ':scope > [data-grid-part="section"]',
        ) ?? root;
      const narrow = (width: number) => {
        if (!current) return;
        const strip =
          Number.parseFloat(getComputedStyle(padded).paddingInlineEnd) || 0;
        const end = Math.max(0, strip - gap);
        const column =
          (width - strip - (current.columns - 1) * gap) / current.columns;
        root.style.setProperty('--uikit-grid-column', `${String(column)}px`);
        root.style.setProperty('--uikit-grid-end', `${String(end)}px`);
        root.style.setProperty('--uikit-grid-strip', `${String(strip)}px`);
      };
      // (The columns kept while their unit's in range; else changed at
      // once: see the top.)
      const measure = () => {
        const width = root.clientWidth;
        const next = layoutOf(
          width,
          gap,
          unitMin,
          unitSize,
          unitMax,
          minColumns,
        );
        if (!current) {
          apply(next);
          return;
        }
        const { columns } = current;
        const unit = unitOf(width, gap, columns);
        // (At its fewest columns, its units shrinking below `unitMin`: kept
        // all the same.)
        const [low, high] = unitRangeOf(unitMin, unitSize, unitMax);
        const isKept =
          columns >= minColumns &&
          unit <= high &&
          (unit >= low || columns === minColumns);
        apply(isKept ? { columns, unit } : next);
      };
      const remeasure = () => {
        measure();
        narrow(root.clientWidth);
      };
      remeasure();
      const resizeObserver = new ResizeObserver(remeasure);
      resizeObserver.observe(root);
      // (Its room at its end opening or closing (see the CSS): each frame
      // while it does, before it's laid out.)
      let frame = 0;
      const follow = () => {
        remeasure();
        frame = requestAnimationFrame(follow);
      };
      const onRun = (event: TransitionEvent) => {
        if (
          event.target !== padded ||
          !event.propertyName.startsWith('padding')
        ) {
          return;
        }
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(follow);
      };
      const onEnd = (event: TransitionEvent) => {
        if (event.target !== padded) return;
        cancelAnimationFrame(frame);
        remeasure();
      };
      padded.addEventListener('transitionrun', onRun);
      padded.addEventListener('transitionend', onEnd);
      padded.addEventListener('transitioncancel', onEnd);
      return () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(frame);
        padded.removeEventListener('transitionrun', onRun);
        padded.removeEventListener('transitionend', onEnd);
        padded.removeEventListener('transitioncancel', onEnd);
      };
    }, [editing, gap, minColumns, ref, unitMax, unitMin, unitSize]);

    useReflow(ref, dragged, editing);
    useEditing(ref, dragged, editing);
    const range = useRange('Root', reorderHandle, dropName, ref);

    const value = useMemo(
      () => ({
        columns: layout.columns,
        dense,
        editing,
        gap,
        maxTileRows,
        minColumns,
        unit: layout.unit,
      }),
      [dense, editing, gap, layout, maxTileRows, minColumns],
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
                  '--uikit-grid-max-rows': String(maxTileRows),
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

/** A placement change for what has none (a break, see `Break`). */
const noPlacement = (): undefined => undefined;

/** A size change taking nothing in (see `GridSizeChangeDetails`). */
const noneMerged: GridSizeChangeDetails = { merged: [] };

/**
 * A cell's supported sizes, in order: those given no taller than the
 * grid's `maxTileRows` (none of them: all given); none given, every size
 * up to the grid's columns and rows.
 */
const supportedOf = (
  given: readonly GridSize[] | undefined,
  columns: number,
  maxTileRows: number,
) => {
  if (given === undefined) return sizesUpTo(columns, maxTileRows);
  const held = given.filter((size) => spanOf(size, columns)[1] <= maxTileRows);
  return sortSizes(held.length > 0 ? held : given, columns);
};

/**
 * Where a tile of a size sits in its area (see `GridPlacement`), in units
 * from the area's top leading corner (halves, truly centered).
 */
const placementOffset = (
  placement: GridPlacement,
  [areaColumns, areaRows]: readonly [number, number],
  [columns, rows]: readonly [number, number],
): [number, number] => {
  const across = Math.max(0, areaColumns - columns);
  const down = Math.max(0, areaRows - rows);
  return {
    'bottom-leading': [0, down],
    'bottom-trailing': [across, down],
    center: [across / 2, down / 2],
    'top-leading': [0, 0],
    'top-trailing': [across, 0],
  }[placement] as [number, number];
};

/**
 * Which way a tile in its area's corner is inset from it, editing (see the
 * CSS, `--uikit-grid-corner-inset`): off its corner's controls, in from
 * each side it's on (towards the inline end, down: positive), only along
 * an axis with room; truly centered, not at all.
 */
const insetOf = (
  placement: GridPlacement,
  [areaColumns, areaRows]: readonly [number, number],
  [columns, rows]: readonly [number, number],
): [number, number] => {
  if (placement === 'center') return [0, 0];
  const across = areaColumns > columns ? 1 : 0;
  const down = areaRows > rows ? 1 : 0;
  return [
    placement.endsWith('leading') ? across : -across,
    placement.startsWith('top') ? down : -down,
  ];
};

/** A cell's corner inset (px, see `insetOf`). */
const cornerInsetOf = (cell: HTMLElement) =>
  Number.parseFloat(
    getComputedStyle(cell).getPropertyValue('--uikit-grid-corner-inset'),
  ) || 24;

/**
 * How much of its end-of-line column (and a gap) a tile in a full-width
 * area moves on by, editing (its area running through it, see the CSS):
 * truly centered with a column's room across, half (clear of the column's
 * cut-away part, see layout.ts); elsewhere none (a trailing one inset off
 * its last column, where its area's shape is cut; a full width's own
 * tile kept to its columns too).
 */
const stripShareOf = (
  placement: GridPlacement,
  {
    across,
    isFullArea,
    isFullBody,
  }: { across: number; isFullArea: boolean; isFullBody: boolean },
) => {
  if (!isFullArea || isFullBody) return 0;
  return placement === 'center' && across >= 1 ? 0.5 : 0;
};

/**
 * An inset's offset (px, see `insetOf`; from its place on the units),
 * with its share of the end-of-line column (see `stripShareOf`).
 */
const insetPxOf = (
  cell: HTMLElement,
  [ix, iy]: readonly [number, number],
  share: number,
) => {
  const metrics = metricsOf(cell);
  const strip = metrics.end > 0 ? metrics.end + metrics.gap : 0;
  const inset = cornerInsetOf(cell);
  return [ix * inset + share * strip, iy * inset] as const;
};

/** Whether a cell's area is a full width's, with room in it. */
const isFullAreaOf = (cell: HTMLElement) =>
  Object.hasOwn(cell.dataset, 'gridFull') &&
  Object.hasOwn(cell.dataset, 'gridRoom');

/** No area (see `useCell`): none asked for, its tile centered. */
const noArea: AreaSpec = {
  movable: false,
  placement: 'center',
  requestPlacement: noPlacement,
  requestSize: noPlacement,
  requested: undefined,
  supported: undefined,
};

/** Supported sizes told about (see `useCell`), once each. */
const toldSizes = new Set<string>();

/**
 * An item's (or spacer's, spawn's) sizes: requested (its `size`, else its
 * own), effective (see the top); its area (`area`, else its own; none:
 * its size), effective, its size fitting in it, centered (on whole units,
 * the leading side winning the rounding); asked to change; for
 * `useGridItem`.
 */
/** Never open (a spacer, a break; an item's own, see `Item`). */
const noOpen = () => undefined;

/**
 * A cell's sizes, effective (see `useCell`), as requested: its area first,
 * fitted to the columns; then its size, fitted to the area; the area at
 * least as big as what it shows. No sizes given (`isFreeSize`,
 * `isFreeArea`): any supported, fitted as it is, not snapped. Its own, and
 * what another would be (see `GridItemState.sizeOf`).
 */
const fitOf = (
  requested: GridSize,
  requestedArea: GridSize | undefined,
  {
    columns,
    isFreeArea,
    isFreeSize,
    maxTileRows,
    sorted,
    sortedAreas,
  }: {
    columns: number;
    isFreeArea: boolean;
    isFreeSize: boolean;
    maxTileRows: number;
    sorted: readonly GridSize[];
    sortedAreas: readonly GridSize[];
  },
) => {
  const free = effectiveSize(requested, sorted, columns, {
    isOpen: isFreeSize,
    rows: maxTileRows,
  });
  const areaFit =
    requestedArea === undefined
      ? undefined
      : effectiveSize(requestedArea, sortedAreas, columns, {
          isOpen: isFreeArea,
          rows: maxTileRows,
        });
  const area = areaFit?.size;
  const [areaColumns, areaRows] = area ? spanOf(area, columns) : [0, 0];
  // (A full width in an area that isn't one: as wide as the area.)
  const sizeGrid = area && !isFull(area) ? areaColumns : columns;
  const { isFitted, size } = area
    ? effectiveSize(free.size, sorted, areaColumns, {
        gridColumns: sizeGrid,
        isOpen: isFreeSize,
        rows: areaRows,
      })
    : free;
  const [sizeColumns, sizeRows] = spanOf(size, sizeGrid);
  const layoutColumns = Math.max(areaColumns, sizeColumns);
  const layoutRows = Math.max(areaRows, sizeRows);
  const isFullWidth = isFull(area ?? size);
  const layout: GridSize = area
    ? (`${isFullWidth ? '*' : String(layoutColumns)}x${String(layoutRows)}` as GridSize)
    : size;
  return {
    isAreaFitted: areaFit?.isFitted ?? false,
    isFitted: isFitted || free.isFitted,
    isFullWidth,
    layout,
    layoutColumns,
    layoutRows,
    size,
    sizeColumns,
    sizeRows,
  };
};

const useCell = ({
  area: spec,
  defaultSize = '1x1',
  expandedSize,
  onSizeChange,
  size: controlledSize,
  supportedSizes,
}: {
  area?: AreaSpec;
  defaultSize?: GridSize;
  /** Its size shown while it's expanded (see `Item`); none, its own. */
  expandedSize?: GridSize;
  onSizeChange?: (size: GridSize, details: GridSizeChangeDetails) => void;
  size?: GridSize;
  supportedSizes?: readonly GridSize[];
}) => {
  const { columns, editing, maxTileRows, minColumns } = useContext(GridContext);
  const [ownSize, setOwnSize] = useState(defaultSize);
  const requested = controlledSize ?? ownSize;
  // (Expanded: shown at that size, its own kept, see `Item`.)
  const shown = expandedSize ?? requested;
  // (Its area's, from its `Grid.Area`; none: none, its tile centered.)
  const {
    movable,
    placement,
    requestPlacement,
    requested: requestedArea,
    supported: supportedAreas,
  } = spec ?? noArea;
  const supportedKey = supportedSizes?.join(',');
  const sorted = useMemo(
    () => supportedOf(supportedSizes, columns, maxTileRows),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- by content
    [columns, maxTileRows, supportedKey],
  );
  const areasKey = supportedAreas?.join(',');
  const sortedAreas = useMemo(
    () => supportedOf(supportedAreas, columns, maxTileRows),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- by content
    [areasKey, columns, maxTileRows],
  );
  // (None within the grid's fewest columns and most rows: a layout that
  // can break, told to the developer.)
  useEffect(() => {
    if (supportedKey === undefined) return;
    const key = `${supportedKey}/${String(minColumns)}/${String(maxTileRows)}`;
    const fits = (supportedSizes ?? []).some((each) => {
      const [c, r] = spanOf(each, minColumns);
      return c <= minColumns && r <= maxTileRows;
    });
    if (fits || toldSizes.has(key)) return;
    toldSizes.add(key);
    // eslint-disable-next-line no-console -- a misuse, told to the developer
    console.warn(
      `Grid.Item: none of its supportedSizes (${supportedKey}) fits ${String(minColumns)} columns and ${String(maxTileRows)} rows (the grid's minColumns and maxTileRows); it can't fit every grid.`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- by content
  }, [maxTileRows, minColumns, supportedKey]);

  // (Its sizes, effective (see `fitOf`); and what others would be.)
  const isFreeArea = supportedAreas === undefined;
  const isFreeSize = supportedSizes === undefined;
  const fitting = useMemo(
    () => ({
      columns,
      isFreeArea,
      isFreeSize,
      maxTileRows,
      sorted,
      sortedAreas,
    }),
    [columns, isFreeArea, isFreeSize, maxTileRows, sorted, sortedAreas],
  );
  const {
    isAreaFitted,
    isFitted,
    isFullWidth,
    layout,
    layoutColumns,
    layoutRows,
    size,
    sizeColumns,
    sizeRows,
  } = fitOf(shown, requestedArea, fitting);
  const sizeOf = useCallback(
    (next: GridSize): GridSizeFit => {
      const fit = fitOf(next, requestedArea, fitting);
      return { isFitted: fit.isFitted, size: fit.size };
    },
    [fitting, requestedArea],
  );
  const areaSizeOf = useCallback(
    (next: GridSize): GridSizeFit => {
      const fit = fitOf(shown, next, fitting);
      return { isFitted: fit.isAreaFitted, size: fit.layout };
    },
    [fitting, shown],
  );
  const [x, y] = placementOffset(
    placement,
    [layoutColumns, layoutRows],
    [sizeColumns, sizeRows],
  );

  const [insetX, insetY] = insetOf(
    placement,
    [layoutColumns, layoutRows],
    [sizeColumns, sizeRows],
  );
  const stripShare = stripShareOf(placement, {
    across: layoutColumns - sizeColumns,
    isFullArea: isFullWidth && layout !== size,
    isFullBody: isFull(size),
  });
  const requestSize = useCallback(
    (next: GridSize, details?: GridSizeChangeDetails) => {
      setOwnSize(next);
      onSizeChange?.(next, details ?? noneMerged);
    },
    [onSizeChange],
  );
  const requestArea = spec?.requestSize ?? requestSize;
  const hasArea = spec !== undefined;
  const state = useMemo(
    (): CellState => ({
      area: layout,
      canOpen: false,
      editing,
      // (Not expanded: an item's own, see `Item`.)
      expanded: false,
      expandedSize: undefined,
      hasArea,
      isFitted,
      isFreeArea,
      isFreeSize,
      movable,
      // (Closed: an item's own, see `Item`.)
      open: false,
      openSize: size,
      placement,
      requestArea,
      requested,
      requestPlacement,
      requestSize,
      setExpanded: noOpen,
      setOpen: noOpen,
      size,
      sizeOf,
      supportedAreas: sortedAreas,
      supportedSizes: sorted,
    }),
    [
      editing,
      hasArea,
      isFitted,
      isFreeArea,
      isFreeSize,
      layout,
      movable,
      placement,
      requestArea,
      requestPlacement,
      requestSize,
      requested,
      size,
      sizeOf,
      sorted,
      sortedAreas,
    ],
  );
  // (Its area's, public, see `useGridArea`.)
  const areaState = useMemo(
    (): GridAreaState | undefined =>
      spec && {
        isFitted: isAreaFitted,
        movable,
        placement,
        requested: requestedArea ?? size,
        requestPlacement,
        requestSize: requestArea,
        size: layout,
        sizeOf: areaSizeOf,
        supportedSizes: sortedAreas,
      },
    [
      areaSizeOf,
      isAreaFitted,
      layout,
      movable,
      placement,
      requestArea,
      requestPlacement,
      requestedArea,
      size,
      sortedAreas,
      spec,
    ],
  );
  return {
    areaState,
    // (A full width: from the first column to the last, see the CSS.)
    isFull: isFullWidth,
    // (Its tile in its area: a sub-grid of the area's units, see the CSS;
    // where it is in units from its top leading corner (truly centered:
    // halves, too); on the cell, for its hatching too.)
    bodyStyle: {
      '--uikit-grid-body-column': String(Math.floor(x) + 1),
      '--uikit-grid-body-columns': String(sizeColumns),
      '--uikit-grid-body-row': String(Math.floor(y) + 1),
      '--uikit-grid-body-rows': String(sizeRows),
      '--uikit-grid-body-x': String(x),
      '--uikit-grid-body-y': String(y),
      '--uikit-grid-inset-x': String(insetX),
      // (Trailing in a full-width area: off its end-of-line column's end.)
      '--uikit-grid-inset-strip': String(stripShare),
      '--uikit-grid-inset-y': String(insetY),
    },
    // (Hatched while editing: room around its tile.)
    hasRoom: layout !== size,
    spanStyle: {
      '--uikit-grid-item-columns': String(layoutColumns),
      '--uikit-grid-item-rows': String(layoutRows),
    },
    state,
  };
};

/**
 * A resize handle's icon, by where its tile can go (see `ResizeHandle`):
 * the arc, a chevron inside it; free (any size), the arc alone.
 */
type ResizeDirection = 'both' | 'fixed' | 'free' | 'grow' | 'shrink';
const resizeIcons: Readonly<Record<ResizeDirection, SymbolIcon>> = {
  both: gridIcons.resizeBoth,
  fixed: gridIcons.resize,
  free: gridIcons.resize,
  grow: gridIcons.resizeGrow,
  shrink: gridIcons.resizeShrink,
};

/**
 * A corner icon (see `CornerButton`): its outlines, filled, at its size
 * (its view box in its units, by the button's font size); each with a
 * stroke under it, its backing (shown where there's no fill under it,
 * see the CSS).
 */
const CornerIcon = ({ icon }: { icon: SymbolIcon }) => {
  const [width = 0, height = 0] = icon.viewBox.split(' ').slice(2).map(Number);
  const units = icon.unitsPerEm ?? 20;
  const opacity = Math.max(
    ...icon.svgPathData.map(({ fillOpacity = 1 }) => fillOpacity),
  );
  return (
    <svg
      aria-hidden
      className="uikit-grid-corner-icon"
      data-symbol={icon.sourceName}
      height={`${String(height / units)}em`}
      viewBox={icon.viewBox}
      width={`${String(width / units)}em`}
    >
      {icon.svgPathData.map(({ d, fillOpacity = 1 }, index) => (
        <path
          key={index}
          d={d}
          fillOpacity={
            fillOpacity === opacity ? undefined : fillOpacity / opacity
          }
        />
      ))}
    </svg>
  );
};

/**
 * A button in its cell's corner (see the CSS): a 44px target there, its
 * icon 16.5px in from both of the corner's edges (`gridIcons`,
 * or the app's). Hidden (`visible` false): faded out by its
 * color, inert. The grid's own controls are ones (shown while editing); a
 * card's (`Card.CornerButton`) shown while it isn't.
 */
const CornerButton = forwardRef<HTMLButtonElement, GridCornerButtonProps>(
  (
    {
      className,
      corner = 'bottom-trailing',
      icon,
      mirrored = false,
      render,
      visible = true,
      whileEditing = 'stay',
      ...props
    },
    ref,
  ) => {
    const editing = useGridItem()?.editing === true;
    const isShown =
      visible &&
      (whileEditing === 'stay' || (whileEditing === 'show') === editing);
    // (The app's, shown while editing: an edit control there (a press its
    // own, a drag from it its cell's, as from the remove button), in the
    // grid's controls' color (see the CSS). The grid's own mark
    // themselves.)
    const isOwn = Object.hasOwn(props, 'data-grid-edit-control');
    const isEditControl = editing && isShown && !isOwn;
    return useRender({
      defaultTagName: 'button',
      props: {
        className: cn('uikit-grid-corner-button', className),
        'data-grid-corner': corner,
        'data-grid-drag-through': isEditControl ? '' : undefined,
        'data-grid-edit-control': isEditControl ? '' : undefined,
        'data-grid-editing': editing && isShown ? '' : undefined,
        'data-grid-hidden': isShown ? undefined : '',
        'data-grid-mirrored': mirrored ? '' : undefined,
        inert: !isShown,
        type: 'button',
        ...props,
        children: <CornerIcon icon={icon} />,
      },
      ref,
      render,
    });
  },
);

/** A movable tile's mark (see `moveSignOf`: its sign on it). */
const movableMark = { 'data-grid-movable': '' };

/**
 * A movable cell's sign, editing (see the CSS): by its entry's mark; on
 * its cell (an area's corner, not its tile's: the area is what's moved).
 */
const moveSignOf = (entry: { 'data-grid-movable'?: string }) =>
  entry['data-grid-movable'] === undefined ? null : (
    <span
      aria-hidden
      className="uikit-grid-move-sign"
      data-grid-corner="top-trailing"
      data-grid-mirrored=""
    >
      <CornerIcon icon={gridIcons.move} />
    </span>
  );

/** A tile's dashed outline (see dashes.ts), by its size. */
const dashesFor = (size: GridSize, columns: number) => {
  const [c, r] = spanOf(size, columns);
  return (
    <svg
      aria-hidden
      className="uikit-grid-dashes"
    >
      <rect
        height="100%"
        pathLength={dashCountOf(c, r)}
        rx={dashRadius}
        width="100%"
      />
    </svg>
  );
};

/**
 * Where something's added (an item, by the app): a cell of its size (or
 * area, see `Grid.Area`), its tile dashed, a button filling its tile, a
 * sign in its middle (see the CSS; `render`: e.g. a menu's trigger), what
 * it adds and where (e.g. before it, or in its place) up to the app; in
 * and out of editing. Its controls (`children`, e.g. a `ResizeHandle`)
 * beside the button, not in it. Placed as an item is; not moved, unless
 * it has a `reorderHandle` (e.g. placeholders to be filled in).
 */
const Spawn = forwardRef<HTMLButtonElement, GridSpawnProps>(
  (
    {
      children,
      defaultSize,
      dropName,
      onSizeChange,
      render,
      reorderHandle,
      size: controlledSize,
      ...props
    },
    ref,
  ) => {
    const cell = useRef<HTMLDivElement>(null);
    const { columns } = useContext(GridContext);
    const entry = useCellEntry(
      cell,
      reorderHandle,
      dropName,
      handlesOf(reorderHandle).length > 0,
    );
    const { host, setSlot, spec } = useAreaHost();
    const {
      areaState,
      bodyStyle,
      hasRoom,
      isFull: isFullWidth,
      spanStyle,
      state,
    } = useCell({
      area: spec,
      defaultSize,
      onSizeChange,
      size: controlledSize,
    });
    const button = useRender({
      defaultTagName: 'button',
      props: {
        'aria-label': 'Add',
        // (Pressed while editing too (an edit control); dragged from, as
        // its cell (moved, if it's movable).)
        'data-grid-drag-through': '',
        'data-grid-edit-control': '',
        type: 'button',
        ...props,
        className: cn('uikit-grid-spawn-button', props.className),
      },
      ref,
      render,
    });
    return (
      <GridItemContext.Provider value={state}>
        <GridAreaStateContext.Provider value={areaState}>
          <GridAreaHostContext.Provider value={host}>
            <div
              ref={cell}
              className="uikit-grid-item uikit-grid-spawn"
              data-grid-full={flagOf(isFullWidth)}
              data-grid-part="item"
              data-grid-placement={state.placement}
              data-grid-room={flagOf(hasRoom)}
              data-size={state.area}
              style={{ ...spanStyle, ...bodyStyle }}
              {...entry}
            >
              <div
                className="uikit-grid-item-body"
                data-grid-part="body"
                data-size={state.size}
              >
                {dashesFor(state.size, columns)}
                {button}
                {children}
              </div>
              <div
                ref={setSlot}
                className="uikit-grid-item-slot"
              />
              {moveSignOf(entry)}
            </div>
          </GridAreaHostContext.Provider>
        </GridAreaStateContext.Provider>
      </GridItemContext.Provider>
    );
  },
);

/**
 * Room around its item's (or add tile's) tile: the room it takes in the
 * layout, at least its tile's size (`size`, its own, see `Grid.Item`), its
 * tile placed in it (`placement`), moved in it (`movable`), the rest
 * hatched while editing; its controls (`children`: a `ResizeHandle`
 * resizing it, a `RemoveButton`) in its corners. Rendering no element of
 * its own: registering with its item before it's painted, its controls in
 * the item's cell. Its presence is its item's having one.
 */
const Area: FunctionComponent<GridAreaProps> = ({
  children,
  defaultPlacement = 'center',
  defaultSize,
  movable = false,
  onPlacementChange,
  onSizeChange,
  placement: controlledPlacement,
  size: controlledSize,
  supportedSizes,
}) => {
  const host = useContext(GridAreaHostContext);
  const [ownSize, setOwnSize] = useState(defaultSize);
  const [ownPlacement, setOwnPlacement] = useState(defaultPlacement);
  const requested = controlledSize ?? ownSize;
  const placement = controlledPlacement ?? ownPlacement;
  const latest = useRef({ onPlacementChange, onSizeChange });
  useLayoutEffect(() => {
    latest.current = { onPlacementChange, onSizeChange };
  });
  const requestSize = useCallback(
    (next: GridSize, details?: GridSizeChangeDetails) => {
      setOwnSize(next);
      latest.current.onSizeChange?.(next, details ?? noneMerged);
    },
    [],
  );
  const requestPlacement = useCallback((next: GridPlacement) => {
    setOwnPlacement(next);
    latest.current.onPlacementChange?.(next);
  }, []);
  const supportedKey = supportedSizes?.join(',');
  // (Registered as it changes, before it's painted; gone, gone.)
  useLayoutEffect(() => {
    host?.register({
      movable,
      placement,
      requested,
      requestPlacement,
      requestSize,
      supported: supportedSizes,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- by content
  }, [host?.register, movable, placement, requested, supportedKey]);
  const register = host?.register;
  useLayoutEffect(() => () => register?.(undefined), [register]);
  return host?.slot
    ? createPortal(
        <GridAreaScopeContext.Provider value>
          {children}
        </GridAreaScopeContext.Provider>,
        host.slot,
      )
    : null;
};

/** The places a tile takes in its area, in order (see `usePlacing`). */
const placements: readonly GridPlacement[] = [
  'top-leading',
  'top-trailing',
  'center',
  'bottom-leading',
  'bottom-trailing',
];

/**
 * Its tile's places in its area (px from the cell's inline start and top,
 * see `placementOffset`), and the one nearest a place (`at`).
 */
const nearestPlacement = (cell: HTMLElement, at: readonly [number, number]) => {
  const metrics = metricsOf(cell);
  const styles = getComputedStyle(cell);
  const value = (name: string) =>
    Number.parseFloat(styles.getPropertyValue(name)) || 1;
  const area = [
    value('--uikit-grid-item-columns'),
    value('--uikit-grid-item-rows'),
  ] as const;
  const size = [
    value('--uikit-grid-body-columns'),
    value('--uikit-grid-body-rows'),
  ] as const;
  const fulls = {
    across: area[0] - size[0],
    isFullArea: isFullAreaOf(cell),
    isFullBody:
      cell
        .querySelector<HTMLElement>(':scope > [data-grid-part="body"]')
        ?.dataset.size?.startsWith('*') === true,
  };
  let best:
    | { distance: number; placement: GridPlacement; px: [number, number] }
    | undefined;
  for (const placement of placements) {
    const [x, y] = placementOffset(placement, area, size);
    // (Inset off its corner there, as it'd be, see `insetOf`.)
    const inset = insetOf(placement, area, size);
    const [ex, ey] = insetPxOf(cell, inset, stripShareOf(placement, fulls));
    const px: [number, number] = [
      x * (metrics.column + metrics.gap) + ex,
      y * (metrics.unit + metrics.gap) + ey,
    ];
    const distance = Math.hypot(px[0] - at[0], px[1] - at[1]);
    if (!best || distance < best.distance) best = { distance, placement, px };
  }
  return best;
};

/**
 * A movable tile in its area (see `movable`), editing: held (a touch a
 * moment first), dragged, following the pointer, the place it'd land
 * outlined on its cell (the nearest; see the CSS); let go, it glides there
 * from where it was let go (the reflow's glide not for it). Its hatched
 * room isn't it: held there, the item moves (see edit.ts).
 */
const usePlacing = (
  cellRef: RefObject<HTMLElement | null>,
  bodyRef: RefObject<HTMLElement | null>,
  isOn: boolean,
  {
    placement,
    request,
  }: { placement: GridPlacement; request: (placement: GridPlacement) => void },
) => {
  const latest = useRef({ placement, request });
  useLayoutEffect(() => {
    latest.current = { placement, request };
  });
  // (Let go somewhere else: where it was then, to glide from.)
  const letGo = useRef<DOMRect | undefined>(undefined);

  useLayoutEffect(() => {
    const cell = cellRef.current;
    const body = bodyRef.current;
    if (!isOn || !cell || !body) return undefined;
    let pending:
      | {
          id: number;
          ready: boolean;
          start: readonly [number, number];
          timer: number;
        }
      | undefined;
    let drag:
      | {
          id: number;
          next: GridPlacement;
          origin: readonly [number, number];
          start: readonly [number, number];
        }
      | undefined;
    const reduce = reducedMotionOf(cell);
    const isRtl = () => getComputedStyle(cell).direction === 'rtl';
    // (Where it is in its cell: px from the inline start and top.)
    const originOf = () => {
      const box = cell.getBoundingClientRect();
      const own = body.getBoundingClientRect();
      return [
        isRtl() ? box.right - own.right : own.left - box.left,
        own.top - box.top,
      ] as const;
    };
    const stop = () => {
      if (pending) clearTimeout(pending.timer);
      pending = undefined;
    };
    const finish = (isCancelled: boolean) => {
      if (!drag) return;
      const { next } = drag;
      drag = undefined;
      delete cell.dataset.gridPlacing;
      cell.style.removeProperty('--uikit-grid-landing-x');
      cell.style.removeProperty('--uikit-grid-landing-y');
      const at = body.getBoundingClientRect();
      body.style.removeProperty('translate');
      if (!isCancelled && next !== latest.current.placement) {
        letGo.current = at;
        body.dataset.gridPlaced = '';
        latest.current.request(next);
        return;
      }
      // (Back where it was.)
      const home = body.getBoundingClientRect();
      if (reduce.matches) return;
      body.animate(
        [
          {
            translate: `${String(at.left - home.left)}px ${String(at.top - home.top)}px`,
          },
          { translate: '0 0' },
        ],
        { duration: reflowDuration, easing: reflowEasing },
      );
    };
    const onDown = (event: PointerEvent) => {
      if (
        !event.isPrimary ||
        event.button !== 0 ||
        (event.target as Element | null)?.closest('[data-grid-edit-control]')
      ) {
        return;
      }
      const isTouch = event.pointerType === 'touch';
      stop();
      pending = {
        id: event.pointerId,
        ready: !isTouch,
        start: [event.clientX, event.clientY],
        timer: isTouch
          ? window.setTimeout(() => {
              if (pending) pending.ready = true;
            }, touchHold)
          : 0,
      };
    };
    const onMove = (event: PointerEvent) => {
      const at = [event.clientX, event.clientY] as const;
      if (!drag) {
        if (
          pending?.id !== event.pointerId ||
          Math.hypot(at[0] - pending.start[0], at[1] - pending.start[1]) < slop
        ) {
          return;
        }
        // (A touch moving before its hold: a scroll.)
        if (!pending.ready) {
          stop();
          return;
        }
        drag = {
          id: pending.id,
          next: latest.current.placement,
          origin: originOf(),
          start: pending.start,
        };
        stop();
        cell.dataset.gridPlacing = '';
      }
      if (drag.id !== event.pointerId) return;
      const dx = at[0] - drag.start[0];
      const dy = at[1] - drag.start[1];
      body.style.setProperty('translate', `${String(dx)}px ${String(dy)}px`);
      const nearest = nearestPlacement(cell, [
        drag.origin[0] + (isRtl() ? -dx : dx),
        drag.origin[1] + dy,
      ]);
      if (!nearest) return;
      drag.next = nearest.placement;
      cell.style.setProperty(
        '--uikit-grid-landing-x',
        `${String(nearest.px[0])}px`,
      );
      cell.style.setProperty(
        '--uikit-grid-landing-y',
        `${String(nearest.px[1])}px`,
      );
    };
    const onUp = (event: PointerEvent) => {
      if (pending?.id === event.pointerId) stop();
      if (drag?.id === event.pointerId) finish(event.type === 'pointercancel');
    };
    // (Dragging, or held long enough to: the page not scrolled by it.)
    const onTouchMove = (event: TouchEvent) => {
      if (drag || pending?.ready) event.preventDefault();
    };
    body.addEventListener('pointerdown', onDown);
    body.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      stop();
      finish(true);
      body.removeEventListener('pointerdown', onDown);
      body.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [bodyRef, cellRef, isOn]);

  // (Placed: from where it was let go, gliding there.)
  useLayoutEffect(() => {
    const body = bodyRef.current;
    const from = letGo.current;
    letGo.current = undefined;
    if (!body || !from) return;
    const to = body.getBoundingClientRect();
    if (!reducedMotionOf(body).matches) {
      body.animate(
        [
          {
            translate: `${String(from.left - to.left)}px ${String(from.top - to.top)}px`,
          },
          { translate: '0 0' },
        ],
        { duration: reflowDuration, easing: reflowEasing },
      );
    }
    requestAnimationFrame(() => {
      delete body.dataset.gridPlaced;
    });
  }, [bodyRef, placement]);

  // (By keys: the arrow keys stepping through its places, in order.)
  return useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (!isOn || event.altKey || event.target !== event.currentTarget) return;
      const by = { ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1 }[
        event.key
      ];
      if (by === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      const at = placements.indexOf(latest.current.placement);
      const next =
        placements[Math.min(placements.length - 1, Math.max(0, at + by))];
      if (next && next !== latest.current.placement) {
        latest.current.request(next);
      }
    },
    [isOn],
  );
};

/**
 * An item's expansion (see `GridItemProps.expanded`): controlled or its
 * own; never while editing, which makes it small again (its own state too,
 * as it renders; told, as any other change); without an expanded size,
 * never.
 */
const useExpansion = ({
  controlled,
  defaultExpanded,
  editing,
  expandedSize,
  onExpandedChange,
}: {
  controlled: boolean | undefined;
  defaultExpanded: boolean;
  editing: boolean;
  expandedSize: GridSize | undefined;
  onExpandedChange: GridItemProps['onExpandedChange'];
}) => {
  const [own, setOwn] = useState(defaultExpanded);
  const [wasEditing, setWasEditing] = useState(editing);
  if (wasEditing !== editing) {
    setWasEditing(editing);
    if (editing) setOwn(false);
  }
  const isExpanded =
    (controlled ?? own) && !editing && expandedSize !== undefined;
  const latest = useRef(onExpandedChange);
  const wasExpanded = useRef(isExpanded);
  useLayoutEffect(() => {
    latest.current = onExpandedChange;
    // (Made small again by editing: told, as any other way.)
    if (wasExpanded.current && !isExpanded && editing) {
      onExpandedChange?.(false, { reason: 'edit' });
    }
    wasExpanded.current = isExpanded;
  });
  const changeExpanded = useCallback(
    (next: boolean, reason: GridExpandedChangeReason) => {
      setOwn(next);
      latest.current?.(next, { reason });
    },
    [],
  );
  return { changeExpanded, isExpanded };
};

/**
 * An item: a cell spanning its area (its effective size without one, see
 * the top), its tile (its body) in it, what's in it filling that (e.g. a
 * `Card`, a `ResizeHandle`), its sizes read with `useGridItem`; room
 * around its tile with a `Grid.Area` in it.
 */
const Item = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      children,
      className,
      defaultExpanded = false,
      defaultOpen = false,
      defaultSize,
      dropName,
      expanded: controlledExpanded,
      expandedSize,
      onExpandedChange,
      onOpenChange,
      onSizeChange,
      open: controlledOpen,
      openLabel,
      openSize: openSizeGiven,
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
    const { host, setSlot, spec } = useAreaHost();
    const { editing } = useContext(GridContext);
    // (Expanded in place: shown at its expanded size, its own kept; never
    // while editing, which makes it small again, see `useExpansion`.)
    const { changeExpanded, isExpanded } = useExpansion({
      controlled: controlledExpanded,
      defaultExpanded,
      editing,
      expandedSize,
      onExpandedChange,
    });
    const {
      areaState,
      bodyStyle,
      hasRoom,
      isFull: isFullWidth,
      spanStyle,
      state: cellState,
    } = useCell({
      area: spec,
      defaultSize,
      expandedSize: isExpanded ? expandedSize : undefined,
      onSizeChange,
      size: controlledSize,
      supportedSizes,
    });

    const openSize = openSizeGiven ?? '4x3';
    const body = useRef<HTMLDivElement>(null);
    // (Open above the page (see overlay.tsx): never while editing, which
    // closes it.)
    const { columns, gap, unit } = useContext(GridContext);
    const [ownOpen, setOwnOpen] = useState(defaultOpen);
    // (Editing started: closed (its own state too, as it renders).)
    const [wasEditing, setWasEditing] = useState(cellState.editing);
    if (wasEditing !== cellState.editing) {
      setWasEditing(cellState.editing);
      if (cellState.editing) setOwnOpen(false);
    }
    const isOpen = (controlledOpen ?? ownOpen) && !cellState.editing;
    const latestOpen = useRef(onOpenChange);
    const wasOpen = useRef(isOpen);
    useLayoutEffect(() => {
      latestOpen.current = onOpenChange;
      // (Closed by editing: told, as any other way.)
      if (wasOpen.current && !isOpen && cellState.editing) {
        onOpenChange?.(false, { reason: 'edit' });
      }
      wasOpen.current = isOpen;
    });
    const changeOpen = useCallback(
      (next: boolean, reason: GridOpenChangeReason) => {
        setOwnOpen(next);
        latestOpen.current?.(next, { reason });
      },
      [],
    );
    const standIn = useRef<HTMLSpanElement>(null);
    const [openColumns, openRows] = spanOf(openSize, columns);
    const { backdrop, phase, settle, underlay } = useOverlay({
      body,
      isOpen,
      onClose: (reason) => changeOpen(false, reason),
      size: [
        openColumns * unit + (openColumns - 1) * gap,
        openRows * unit + (openRows - 1) * gap,
      ],
      standIn,
    });
    // (Its tile getting to a new box, what's in it told: after its overlay
    // placed it, see reshape.ts.)
    const [onShapeChange, layoutRegistry] = useReshape({
      body,
      cell: ref,
      onSettled: settle,
    });
    const state = useMemo(
      (): CellState => ({
        ...cellState,
        canOpen: openSizeGiven !== undefined,
        expanded: isExpanded,
        expandedSize,
        open: isOpen,
        openSize,
        setExpanded: (next: boolean) => changeExpanded(next, 'none'),
        setOpen: (next: boolean) => changeOpen(next, 'none'),
      }),
      [
        cellState,
        changeExpanded,
        changeOpen,
        expandedSize,
        isExpanded,
        isOpen,
        openSize,
        openSizeGiven,
      ],
    );
    // (Filling its area: nowhere to go in it; held, its area moves (the
    // item, its cell), its crosshairs the area's, see the CSS.)
    const isPlaceable = cellState.editing && cellState.movable && hasRoom;
    // (Focused: moved in its area by keys; open, as a dialog.)
    let bodyTabIndex: number | undefined;
    if (isPlaceable) bodyTabIndex = 0;
    else if (isOpen) bodyTabIndex = -1;
    const onBodyKeyDown = usePlacing(ref, body, isPlaceable, {
      placement: cellState.placement,
      request: cellState.requestPlacement,
    });

    return (
      <ShapeSnapshot
        shape={{
          area: cellState.area,
          editing: cellState.editing,
          open: isOpen,
          placement: cellState.placement,
          size: cellState.size,
        }}
        onChange={onShapeChange}
      >
        <GridItemLayoutProvider value={layoutRegistry}>
          <GridItemContext.Provider value={state}>
            <GridAreaStateContext.Provider value={areaState}>
              <GridAreaHostContext.Provider value={host}>
                <div
                  ref={ref}
                  data-grid-full={flagOf(isFullWidth)}
                  data-grid-part="item"
                  data-grid-placement={cellState.placement}
                  data-grid-room={flagOf(hasRoom)}
                  data-size={cellState.area}
                  style={withStyle({ ...spanStyle, ...bodyStyle }, style)}
                  {...entry}
                  {...props}
                  className={cn('uikit-grid-item', className)}
                >
                  {/* (Its room's edge, editing: the area told from the rows
                  around it, see the CSS.) */}
                  {hasRoom ? (
                    <span
                      aria-hidden="true"
                      className="uikit-grid-room-edge"
                      data-grid-part="room-edge"
                    />
                  ) : null}
                  <div
                    ref={body}
                    aria-label={isOpen ? openLabel : undefined}
                    aria-modal={isOpen ? true : undefined}
                    className="uikit-grid-item-body"
                    data-grid-movable-body={flagOf(isPlaceable)}
                    data-grid-open={phase}
                    data-grid-part="body"
                    data-size={cellState.size}
                    role={isOpen ? 'dialog' : undefined}
                    tabIndex={bodyTabIndex}
                    onKeyDown={onBodyKeyDown}
                  >
                    {children}
                    {/* (Movable in its area: its own sign, on it.) */}
                    {isPlaceable ? moveSignOf(movableMark) : null}
                  </div>
                  {/* (Open above the page: its place kept, see overlay.tsx.) */}
                  {phase ? (
                    <span
                      ref={standIn}
                      aria-hidden="true"
                      className="uikit-grid-stand-in"
                      data-grid-part="stand-in"
                      data-size={cellState.size}
                    />
                  ) : null}
                  {backdrop}
                  {underlay}
                  <div
                    ref={setSlot}
                    className="uikit-grid-item-slot"
                  />
                  {/* (Its area's, in its corner.) */}
                  {moveSignOf(entry)}
                </div>
              </GridAreaHostContext.Provider>
            </GridAreaStateContext.Provider>
          </GridItemContext.Provider>
        </GridItemLayoutProvider>
      </ShapeSnapshot>
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
      children,
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
    const { columns } = useContext(GridContext);
    const entry = useCellEntry(ref, reorderHandle, dropName);
    const {
      isFull: isFullWidth,
      spanStyle,
      state,
    } = useCell({
      defaultSize,
      onSizeChange,
      size: controlledSize,
    });
    return (
      <GridItemContext.Provider value={state}>
        <div
          ref={ref}
          aria-hidden={state.editing ? undefined : true}
          data-grid-full={isFullWidth ? '' : undefined}
          data-grid-part="spacer"
          data-size={state.size}
          style={withStyle(spanStyle, style)}
          {...entry}
          {...props}
          className={cn('uikit-grid-spacer', className)}
        >
          {dashesFor(state.size, columns)}
          {children}
          {moveSignOf(entry)}
        </div>
      </GridItemContext.Provider>
    );
  },
);

/**
 * The supported size closest to a span (ties: the smaller), on a grid of
 * `gridColumns` (a full width's).
 */
const closestSize = (
  supported: readonly GridSize[],
  columns: number,
  rows: number,
  gridColumns: number,
) => {
  let best: GridSize | undefined;
  let distance = Number.POSITIVE_INFINITY;
  for (const size of supported) {
    const [c, r] = spanOf(size, gridColumns);
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
 * The most columns a resize reaches (see `Reach`): into the end-of-line
 * column for a full width, from a row's start; past its row's end, if a
 * column wider is supported; else to its row's end. Within an area (no
 * reach): its.
 */
const limitOf = (reach: Reach | undefined, most: number, columns: number) => {
  if (!reach) return most;
  if (reach.canFull) return columns + 1;
  return reach.canWrap ? most : Math.min(most, reach.fit);
};

/** How long a press may last to be a tap, not held (ms). */
const tapTime = 350;

/**
 * A resize's row change shown in its row's end-of-line column (see
 * `showWrap`): grown into the next row, an outline from the tile to that
 * column, as tall as it, a return sign in it (a break's); shrunk back into
 * the row before, the opposite sign there, as tall as it'll be (px, from
 * the cell's top leading corner).
 */
type Wrap = {
  box: readonly [x: number, y: number, width: number, height: number];
  direction: 'next' | 'previous';
  /** Shrunk back: the same again at the start of its own row, over it. */
  echo?: readonly [x: number, y: number, width: number, height: number];
  from?: readonly [x: number, y: number, width: number, height: number];
};

const wrapOf = (
  cell: HTMLElement,
  { metrics, own }: Reach,
  [, rows]: readonly [number, number],
  [, dy]: readonly [number, number],
): Wrap | undefined => {
  if (dy === 0 || metrics.end <= 0) return undefined;
  const x = (metrics.columns - own.column) * (metrics.column + metrics.gap);
  if (dy > 0) {
    return {
      box: [x, 0, metrics.end, cell.offsetHeight],
      direction: 'next',
      from: [0, 0, cell.offsetWidth, cell.offsetHeight],
    };
  }
  const height = rows * (metrics.unit + metrics.gap) - metrics.gap;
  return {
    box: [x, dy, metrics.end, height],
    direction: 'previous',
    // (The second as tall as the tile is now, before the resize: what it
    // leaves, however its new size grows or shrinks.)
    echo: [0, 0, metrics.end, cell.offsetHeight],
  };
};

/** Cells' row-change outlines (see `showWrap`). */
const wraps = new WeakMap<HTMLElement, HTMLElement[]>();

/**
 * A resize's row change shown (see `Wrap`), or not: elements of their own
 * in the cell, beside its resize outline; animated there from the tile
 * (growing), faded in (shrinking: also at the start of its own row), see
 * the CSS.
 */
const showWrap = (cell: HTMLElement, wrap: Wrap | undefined) => {
  const elements = wraps.get(cell) ?? [];
  const boxes = wrap ? [wrap.box, ...(wrap.echo ? [wrap.echo] : [])] : [];
  while (elements.length > boxes.length) elements.pop()?.remove();
  for (const [index, box] of boxes.entries()) {
    let element = elements[index];
    const isNew = !element || element.dataset.direction !== wrap?.direction;
    if (!element) {
      element = document.createElement('div');
      element.className = 'uikit-grid-resize-wrap';
      element.dataset.gridPart = 'resize-wrap';
      element.setAttribute('aria-hidden', 'true');
      cell.append(element);
      elements.push(element);
    }
    const target = element;
    const place = ([x, y, width, height]: Wrap['box']) => {
      target.style.setProperty('inset-inline-start', `${String(x)}px`);
      target.style.setProperty('inset-block-start', `${String(y)}px`);
      target.style.setProperty('width', `${String(width)}px`);
      target.style.setProperty('height', `${String(height)}px`);
    };
    target.dataset.direction = wrap?.direction;
    if (isNew) {
      delete target.dataset.shown;
      place((index === 0 && wrap?.from) || box);
      // (Laid out where it starts, then on: its transition, see the CSS.)
      target.getBoundingClientRect();
    }
    place(box);
    target.dataset.shown = '';
  }
  if (elements.length > 0) wraps.set(cell, elements);
  else wraps.delete(cell);
};

/**
 * A cell's size to be while its handle's held (see `ResizeHandle`):
 * outlined over it (see the CSS), nothing moving yet; none, none.
 */
const showResize = (
  cell: HTMLElement,
  size: GridSize | undefined,
  gridColumns = 6,
  offset?: readonly [number, number],
) => {
  if (!size) {
    showWrap(cell, undefined);
    delete cell.dataset.gridResizing;
    delete cell.dataset.gridResizeFull;
    delete cell.dataset.gridResizeShaped;
    cell.style.removeProperty('--uikit-grid-resize-columns');
    cell.style.removeProperty('--uikit-grid-resize-rows');
    cell.style.removeProperty('--uikit-grid-resize-x');
    cell.style.removeProperty('--uikit-grid-resize-y');
    for (const name of ['height', 'shape', 'start', 'top', 'width']) {
      cell.style.removeProperty(`--uikit-grid-resize-${name}`);
    }
    return;
  }
  const [columns, rows] = spanOf(size, gridColumns);
  cell.dataset.gridResizing = '';
  cell.toggleAttribute('data-grid-resize-full', isFull(size));
  // (A break's: its shape as it'd be, through the end-of-line column.)
  if (cell.dataset.gridPart === 'break') {
    const outline = breakOutlineOf(cell, rows);
    cell.style.setProperty(
      '--uikit-grid-resize-height',
      `${String(outline.height)}px`,
    );
    cell.style.setProperty(
      '--uikit-grid-resize-start',
      `${String(outline.start)}px`,
    );
    cell.style.setProperty('--uikit-grid-resize-shape', outline.mask);
    cell.style.setProperty(
      '--uikit-grid-resize-top',
      `${String(outline.top)}px`,
    );
    cell.style.setProperty(
      '--uikit-grid-resize-width',
      `${String(outline.width)}px`,
    );
    return;
  }
  // (A full width's, still one: its shape as it'd be (see layout.ts).)
  const full =
    cell.dataset.gridPart === 'item' &&
    Object.hasOwn(cell.dataset, 'gridFull') &&
    isFull(size)
      ? fullOutlineOf(cell, rows)
      : undefined;
  cell.toggleAttribute('data-grid-resize-shaped', full !== undefined);
  if (full) {
    cell.style.setProperty(
      '--uikit-grid-resize-height',
      `${String(full.height)}px`,
    );
    cell.style.setProperty('--uikit-grid-resize-shape', full.mask);
    cell.style.setProperty(
      '--uikit-grid-resize-width',
      `${String(full.width)}px`,
    );
    return;
  }
  cell.style.setProperty('--uikit-grid-resize-columns', String(columns));
  cell.style.setProperty('--uikit-grid-resize-rows', String(rows));
  if (offset) {
    cell.style.setProperty('--uikit-grid-resize-x', `${String(offset[0])}px`);
    cell.style.setProperty('--uikit-grid-resize-y', `${String(offset[1])}px`);
  } else {
    cell.style.removeProperty('--uikit-grid-resize-x');
    cell.style.removeProperty('--uikit-grid-resize-y');
  }
};

/** Whether a container's laid out right to left. */
const isRtlIn = (container: HTMLElement) =>
  getComputedStyle(container).direction === 'rtl';

/**
 * Where a cell is in its container, in units: columns from its inline
 * start, rows from its first (below its header).
 */
const placeOf = (element: HTMLElement, metrics: Metrics): Unit => {
  const container = element.parentElement;
  const across = metrics.column + metrics.gap;
  const pitch = metrics.unit + metrics.gap;
  const header = container?.querySelector<HTMLElement>(
    ':scope > [data-grid-part="header"]',
  );
  const origin = header
    ? header.offsetTop + header.offsetHeight + metrics.gap
    : 0;
  const start =
    container && isRtlIn(container)
      ? container.clientWidth - element.offsetLeft - element.offsetWidth
      : element.offsetLeft;
  return {
    column: Math.round(start / across),
    columns: Math.max(
      1,
      Math.round((element.offsetWidth + metrics.gap) / across),
    ),
    row: Math.round((element.offsetTop - origin) / pitch),
    rows: Math.max(1, Math.round((element.offsetHeight + metrics.gap) / pitch)),
  };
};

/**
 * What's placed before a cell in its container (in units, in order), and
 * where it'd go on from (after the last of them; none: the start).
 */
const placedBefore = (
  cell: HTMLElement,
  metrics: Metrics,
): { cursor: At; placed: Unit[] } => {
  const placed: Unit[] = [];
  let cursor: At = { column: 0, row: 0 };
  for (const child of cell.parentElement?.children ?? []) {
    if (child === cell) break;
    if (
      !(child instanceof HTMLElement) ||
      child.offsetParent === null ||
      Object.hasOwn(child.dataset, 'gridBreakNone') ||
      !['break', 'break-fill', 'item', 'spacer'].includes(
        child.dataset.gridPart ?? '',
      )
    ) {
      continue;
    }
    const unit = placeOf(child, metrics);
    placed.push(unit);
    if (child.dataset.gridPart !== 'break-fill') {
      cursor = { column: unit.column + unit.columns, row: unit.row };
    }
  }
  return { cursor, placed };
};

/** A pointer's place along a row (its container's, from its start; px). */
const alongRow = (x: number, container: HTMLElement) => {
  const box = container.getBoundingClientRect();
  return isRtlIn(container) ? box.right - x : x - box.left;
};

/**
 * A place along a row (see `alongRow`), in columns: past its columns, its
 * end-of-line column counted as one, then as many more.
 */
const columnAt = (at: number, metrics: Metrics) => {
  const across = metrics.column + metrics.gap;
  const edge = metrics.columns * across;
  const strip = metrics.end > 0 ? metrics.end + metrics.gap : 0;
  if (at <= edge || strip === 0) return at / across;
  return at <= edge + strip
    ? metrics.columns + (at - edge) / strip
    : metrics.columns + 1 + (at - edge - strip) / across;
};

/**
 * A resize's reach past its row's end (see `ResizeHandle`): where it is,
 * what's before it, how many columns it has to the row's end (`fit`),
 * whether it may grow past it (a size a column wider, as tall, supported),
 * where its trailing end (and a gap) and the pointer started along its row
 * (px; the pointer moving it).
 */
type Reach = {
  before: readonly Unit[];
  canFull: boolean;
  canWrap: boolean;
  container: HTMLElement;
  cursor: At;
  fit: number;
  metrics: Metrics;
  own: Unit;
  start: { corner: number; pointer: number };
};

const reachOf = (
  cell: HTMLElement,
  size: GridSize,
  sizes: readonly GridSize[],
  x: number,
): Reach | undefined => {
  const container = cell.parentElement;
  if (!container) return undefined;
  const metrics = metricsOf(cell);
  const own = placeOf(cell, metrics);
  const fit = metrics.columns - own.column;
  const rows = spanOf(size, metrics.columns)[1];
  const { cursor, placed } = placedBefore(cell, metrics);
  const across = metrics.column + metrics.gap;
  const strip = metrics.end > 0 ? metrics.end + metrics.gap : 0;
  return {
    before: placed,
    // (Starting its row: into the end-of-line column, a full width, if
    // supported. Elsewhere: a column wider, into the next row, if that's.)
    canFull: own.column === 0 && sizes.some((each) => isFull(each)),
    canWrap:
      own.column > 0 &&
      fit < metrics.columns &&
      sizes.some((each) => {
        const [c, r] = spanOf(each, metrics.columns);
        return c === fit + 1 && r === rows;
      }),
    container,
    cursor,
    fit,
    metrics,
    own,
    start: {
      corner: isFull(size)
        ? metrics.columns * across + strip
        : (own.column + own.columns) * across,
      pointer: alongRow(x, container),
    },
  };
};

/**
 * A size as dragged (see `draggedSpan`): a full width's, a column past the
 * grid's (its end-of-line column), with a reach (see `Reach`).
 */
const spanDragged = (
  size: GridSize,
  reach: Reach | undefined,
  columns: number,
  canFull = false,
): [number, number] => {
  const [c, r] = spanOf(size, columns);
  return [(reach || canFull) && isFull(size) ? columns + 1 : c, r];
};

/**
 * Where a span grown past its row's end lands, from where it is (px; see
 * the CSS), as placed after what's before it (none: as it is).
 */
const landingOffset = (
  { before, cursor, metrics, own }: Reach,
  [columns, rows]: readonly [number, number],
): readonly [number, number] | undefined => {
  const at = landingOf(before, cursor, { columns, rows }, metrics.columns);
  return at && (at.column !== own.column || at.row !== own.row)
    ? [
        (at.column - own.column) * (metrics.column + metrics.gap),
        (at.row - own.row) * (metrics.unit + metrics.gap),
      ]
    : undefined;
};

/**
 * A tile's area, resizing it (see `ResizeHandle`): its row's container,
 * its trailing edge along it (no further than the columns: a full width's
 * end-of-line column past it) and its bottom (px).
 */
type Bounds = { bottom: number; container: HTMLElement; edge: number };

const boundsOf = (body: HTMLElement): Bounds | undefined => {
  const cell = body.parentElement;
  const container = cell?.parentElement;
  if (!cell || !container) return undefined;
  const metrics = metricsOf(cell);
  const box = cell.getBoundingClientRect();
  const trailing = alongRow(
    isRtlIn(container) ? box.left : box.right,
    container,
  );
  return {
    bottom: box.bottom,
    container,
    edge: Math.min(
      trailing,
      metrics.columns * (metrics.column + metrics.gap) - metrics.gap,
    ),
  };
};

/**
 * Whether a pointer's past its area's edges (see `Bounds`): its trailing
 * one (a full width's: into its end-of-line column), or its bottom.
 */
const isPastBounds = (
  { bottom, container, edge }: Bounds,
  at: readonly [number, number],
) => alongRow(at[0], container) > edge || at[1] > bottom;

/**
 * A span dragged in its area (see `draggedSpan`): by how far along its row
 * (its end-of-line column one column, see `columnAt`), down by rows.
 */
const boundedSpan = (
  { container }: Bounds,
  from: readonly [number, number],
  start: readonly [number, number],
  at: readonly [number, number],
  metrics: Metrics,
): readonly [number, number] => {
  const columns =
    from[0] +
    columnAt(alongRow(at[0], container), metrics) -
    columnAt(alongRow(start[0], container), metrics);
  const rows = from[1] + (at[1] - start[1]) / (metrics.unit + metrics.gap);
  return [columns, rows];
};

/**
 * A resize's span as dragged (see `ResizeHandle`): by how far, wherever on
 * its cell it is; along its row, its end-of-line column one column (see
 * `columnAt`); within `limit` (columns up to the grid's, past its row's
 * end only if it may; rows up to the grid's `maxTileRows`; within an area,
 * its), changing only
 * once it's dragged a little past half a unit.
 */
const draggedSpan = (
  {
    bounds,
    from,
    reach,
    span,
    start,
  }: {
    bounds?: Bounds;
    from: readonly [number, number];
    reach?: Reach;
    span: readonly [number, number];
    start: readonly [number, number];
  },
  at: readonly [number, number],
  metrics: Metrics,
  limit: readonly [number, number],
): [number, number] => {
  let raw = [
    from[0] +
      (reach
        ? columnAt(
            reach.start.corner +
              alongRow(at[0], reach.container) -
              reach.start.pointer,
            metrics,
          ) -
          reach.own.column -
          from[0]
        : (at[0] - start[0]) / (metrics.column + metrics.gap)),
    from[1] + (at[1] - start[1]) / (metrics.unit + metrics.gap),
  ] as const;
  if (bounds) raw = boundedSpan(bounds, from, start, at, metrics);
  return [0, 1].map((axis) => {
    const was = span[axis] ?? 1;
    const wanted = raw[axis] ?? was;
    return Math.abs(wanted - was) < 0.5 + resizeHysteresis
      ? was
      : Math.min(limit[axis] ?? 3, Math.max(1, Math.round(wanted)));
  }) as [number, number];
};

/**
 * The size a resize is dragged to (see `ResizeHandle`): the supported one
 * closest to its span (into the end-of-line column: a full width; else a
 * fixed one, even as wide as the grid); past its area's edge, at least the
 * next one up from where it was (see `isPastBounds`), dragged further, as
 * far as it's dragged.
 */
const draggedSize = (
  sizes: readonly GridSize[],
  resized: GridSize,
  span: readonly [number, number],
  {
    canFull = false,
    columns,
    isPast,
    reach,
  }: { canFull?: boolean; columns: number; isPast: boolean; reach?: Reach },
) => {
  // (Past its row's end, or into a full-width area's end-of-line column
  // (`canFull`): a full width; else as wide as the columns at most.)
  const isFullSpan = (reach !== undefined || canFull) && span[0] > columns;
  const pool =
    reach || canFull
      ? sizes.filter((each) => isFull(each) === isFullSpan)
      : sizes;
  const closest = closestSize(
    pool.length > 0 ? pool : [resized],
    isFullSpan ? columns : span[0],
    span[1],
    columns,
  );
  const was = sizes.indexOf(resized);
  return isPast && closest && was !== -1 && sizes.indexOf(closest) <= was
    ? (sizes[was + 1] ?? closest)
    : closest;
};

/**
 * Its grid's root marked while a cell's resized by a drag (see the CSS;
 * e.g. a card's content unveiled, see Card).
 */
const markResizing = (cell: HTMLElement | null, isResizing: boolean) => {
  const root = cell?.closest<HTMLElement>('[data-grid-part="root"]');
  if (isResizing) root?.setAttribute('data-grid-drag', 'resize');
  else root?.removeAttribute('data-grid-drag');
};

/**
 * Whether a tile resized in its area is dragged past it (see
 * `isPastBounds`): in a full-width area that may be a full width
 * (`canFull`), only past its bottom (its end-of-line column a full width).
 */
const pastOf = (
  { bounds, canFull }: { bounds?: Bounds; canFull: boolean },
  at: readonly [number, number],
) => {
  if (!bounds) return false;
  return canFull ? at[1] > bounds.bottom : isPastBounds(bounds, at);
};

/** Cells to be taken in by a resize (see `mergedBy`), marked (see the CSS). */
const markMerged = (cells: readonly HTMLElement[], isMerging: boolean) => {
  for (const cell of cells) {
    cell.toggleAttribute('data-grid-merging', isMerging);
  }
};

/**
 * A tile resized in its area (see `ResizeHandle`): where it'd sit at a
 * size, by its placement, from where it is (px; none: not in an area, or
 * no move).
 */
const placedOffset = (
  body: HTMLElement,
  [columns, rows]: readonly [number, number],
  isFullBody: boolean,
): readonly [number, number] | undefined => {
  const cell = body.parentElement;
  if (body.dataset.gridPart !== 'body' || !cell) return undefined;
  const styles = getComputedStyle(cell);
  const value = (name: string) =>
    Number.parseFloat(styles.getPropertyValue(name)) || 0;
  const placement = (cell.dataset.gridPlacement ?? 'center') as GridPlacement;
  const area = [
    value('--uikit-grid-item-columns'),
    value('--uikit-grid-item-rows'),
  ] as const;
  const [x, y] = placementOffset(placement, area, [columns, rows]);
  // (Its inset off its corner at that size, see `insetOf`.)
  const inset = insetOf(placement, area, [columns, rows]);
  const to = insetPxOf(
    cell,
    inset,
    stripShareOf(placement, {
      across: area[0] - columns,
      isFullArea: isFullAreaOf(cell),
      isFullBody,
    }),
  );
  const from = insetPxOf(
    cell,
    [value('--uikit-grid-inset-x'), value('--uikit-grid-inset-y')],
    value('--uikit-grid-inset-strip'),
  );
  const dx = x - value('--uikit-grid-body-x');
  const dy = y - value('--uikit-grid-body-y');
  const ex = to[0] - from[0];
  const ey = to[1] - from[1];
  if (dx === 0 && dy === 0 && ex === 0 && ey === 0) return undefined;
  const metrics = metricsOf(cell);
  return [
    dx * (metrics.column + metrics.gap) + ex,
    dy * (metrics.unit + metrics.gap) + ey,
  ];
};

/**
 * A resize's outline at a size (see the CSS), past its row's end where it
 * lands, nothing taken in then; else what it takes in marked.
 */
const outlineResize = (
  current: { cell: HTMLElement | null; merged: HTMLElement[]; reach?: Reach },
  next: GridSize,
  { columns, isTaking }: { columns: number; isTaking: boolean },
) => {
  const { cell, reach } = current;
  if (!cell) return;
  const grown = spanOf(next, columns);
  // (Where it'll land: elsewhere (past its row's end, or back up into the
  // row before), outlined there, nothing taken in; a tile in its area,
  // where its placement puts it at that size.)
  const offset = reach
    ? landingOffset(reach, grown)
    : placedOffset(cell, grown, isFull(next));
  showResize(cell, next, columns, offset);
  showWrap(
    cell,
    reach && offset ? wrapOf(cell, reach, grown, offset) : undefined,
  );
  markMerged(current.merged, false);
  current.merged =
    isTaking && !offset ? mergedBy(cell, grown[0], grown[1]) : [];
  markMerged(current.merged, true);
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

/**
 * A tile filling its area resized (see `resizeTarget`): to a size, and
 * its area grown along if the size's past it (the smallest supported area
 * it fits).
 */
const growingArea =
  (
    item: CellState,
    columns: number,
    [areaColumns, areaRows]: readonly [number, number],
  ) =>
  (next: GridSize, details?: GridSizeChangeDetails) => {
    item.requestSize(next, details);
    const [c, r] = spanOf(next, columns);
    if (c <= areaColumns && r <= areaRows) return;
    const grown = item.supportedAreas.find((each) => {
      const [ac, ar] = spanOf(each, columns);
      return ac >= c && ar >= r;
    });
    if (grown) item.requestArea(grown, details);
  };

/**
 * What a resize handle resizes (see `ResizeHandle`): its item's area, or
 * its size; within an area of its own, bounded by it (outlined on its
 * tile, changing no layout). Its sizes to go to: those within its bounds
 * (the columns, the grid's `maxTileRows`; an area's). A tile filling its
 * area (its handle the one shown there, see the CSS): the tile resized
 * first, grown past the area with it (the smallest supported area its
 * size fits), shrunk alone (room opening around it, the area's handle
 * shown again).
 */
const resizeTarget = (
  item: CellState | undefined,
  isAreaHandle: boolean,
  { columns, maxTileRows }: { columns: number; maxTileRows: number },
) => {
  if (!item) {
    return {
      isBounded: false,
      isFree: false,
      most: [columns, maxTileRows] as const,
      request: undefined,
      resized: undefined,
      sizes: [],
    };
  }
  const isBounded = !isAreaHandle && item.hasArea;
  const [areaColumns, areaRows] = spanOf(item.area, columns);
  const [sizeColumns, sizeRows] = spanOf(item.size, columns);
  const isFilling =
    isBounded && sizeColumns === areaColumns && sizeRows === areaRows;
  const most: readonly [number, number] =
    isBounded && !isFilling ? [areaColumns, areaRows] : [columns, maxTileRows];
  const sizes = (
    isAreaHandle ? item.supportedAreas : item.supportedSizes
  ).filter((size) => {
    const [c, r] = spanOf(size, columns);
    return c <= most[0] && r <= most[1];
  });
  let request = isAreaHandle ? item.requestArea : item.requestSize;
  if (isFilling) request = growingArea(item, columns, [areaColumns, areaRows]);
  return {
    isBounded,
    isFree: isAreaHandle ? item.isFreeArea : item.isFreeSize,
    most,
    request,
    resized: isAreaHandle ? item.area : item.size,
    sizes,
  };
};

/**
 * Resizing its item (or spacer, break), editing (an edit control): its
 * size (within its area, if it has one: nothing reflowing, nothing taken
 * in; dragged out of the area, its next size up at least), or in a
 * `Grid.Area` the area (in the area's corner); pressed by a key or tapped, its
 * next supported size fitting the columns (after the largest, the
 * smallest; a key's, unless its `onClick` prevents it), held without
 * moving, nothing; dragged, grown or shrunk by as many units as it's
 * dragged (the supported size closest, fitted to the columns), a span
 * changing once it's dragged a little past halfway. Outlined while
 * held (its size as it is first), the grid reflowing once it's released
 * (cancelled: not at all); grown over spacers and breaks, taking them in
 * (see `mergedBy`; marked while held; the app's to remove, see
 * `GridSizeChangeDetails`). E.g. a card's corner (`render`).
 */
const ResizeHandle = forwardRef<HTMLButtonElement, GridResizeHandleProps>(
  ({ className, onClick, render, ...props }, ref) => {
    const { columns, maxTileRows } = useContext(GridContext);
    const item = useContext(GridItemContext);
    // (In a `Grid.Area`: the area's, in its cell (see `Area`).)
    const isAreaHandle = useContext(GridAreaScopeContext);
    const { isBounded, isFree, most, request, resized, sizes } = resizeTarget(
      item,
      isAreaHandle,
      { columns, maxTileRows },
    );
    const drag = useRef<
      | {
          /** Its area's edges (a tile in its area, see `Bounds`). */
          bounds?: Bounds;
          /** A full width reached in its full-width area's end-of-line column. */
          canFull: boolean;
          cell: HTMLElement | null;
          from: readonly [number, number];
          id: number;
          isDragging: boolean;
          /** Past its area's edges (see `isPastBounds`). */
          isPast?: boolean;
          /** What it'd take in at `next` (marked, see the CSS). */
          merged: HTMLElement[];
          next?: GridSize;
          /** Past its row's end (an item's or a spacer's, see `Reach`). */
          reach?: Reach;
          span: [number, number];
          start: readonly [number, number];
          /** When it was pressed (a tap, or held: see `onPointerEnd`). */
          time: number;
        }
      | undefined
    >(undefined);
    // (A tile resized in its area by a drag: where its outline showed it,
    // at once, not gliding there (see layout.ts); once it's laid out.)
    const placed = useRef<HTMLElement | undefined>(undefined);
    useLayoutEffect(() => {
      const body = placed.current;
      placed.current = undefined;
      if (!body) return;
      requestAnimationFrame(() => {
        delete body.dataset.gridPlaced;
      });
    }, [resized]);
    const sizeIndex = resized ? sizes.indexOf(resized) : -1;
    // (The next size, round to the first.)
    const following =
      resized && (sizes[(sizeIndex + 1) % sizes.length] ?? resized);
    // (Only larger: grows; only smaller: shrinks; by their measures, a full
    // width larger than as wide as the columns, see `measureOf`.)
    const own = resized ? measureOf(resized, columns) : 0;
    const canGrow = sizes.some((each) => measureOf(each, columns) > own);
    const canShrink = sizes.some((each) => measureOf(each, columns) < own);
    // (No list given, either way to go: free, the arc alone; at an end of
    // what it can be (e.g. a full width, its most rows), one way only.)
    let direction: ResizeDirection = isFree ? 'free' : 'both';
    if (!canGrow && !canShrink) direction = 'fixed';
    else if (!canShrink) direction = 'grow';
    else if (!canGrow) direction = 'shrink';

    const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!item?.editing || !resized || !event.isPrimary) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      // (A resize before not taken: gliding again.)
      if (placed.current) delete placed.current.dataset.gridPlaced;
      placed.current = undefined;
      const cell = event.currentTarget.closest<HTMLElement>(
        isBounded
          ? '[data-grid-part="body"]'
          : '[data-grid-part="item"], [data-grid-part="spacer"], [data-grid-part="break"]',
      );
      const reach =
        cell && !isBounded && cell.dataset.gridPart !== 'break'
          ? reachOf(cell, resized, sizes, event.clientX)
          : undefined;
      // (A tile in a full-width area that may be a full width: its area's
      // end-of-line column one column more, a full width; see
      // `onPointerMove`.)
      const canFull =
        isBounded &&
        Object.hasOwn(cell?.parentElement?.dataset ?? {}, 'gridFull') &&
        sizes.some((each) => isFull(each));
      drag.current = {
        bounds: cell && isBounded ? boundsOf(cell) : undefined,
        canFull,
        cell,
        from: spanDragged(resized, reach, columns, canFull),
        id: event.pointerId,
        isDragging: false,
        merged: [],
        reach,
        span: spanDragged(resized, reach, columns, canFull),
        start: [event.clientX, event.clientY],
        time: event.timeStamp,
      };
      // (Outlined from the touch on: its size, as it is.)
      if (drag.current.cell) {
        showResize(drag.current.cell, resized, columns);
      }
    };

    const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
      const { current } = drag;
      if (!current || current.id !== event.pointerId || !item || !resized) {
        return;
      }
      const at = [event.clientX, event.clientY] as const;
      if (
        !current.isDragging &&
        Math.hypot(at[0] - current.start[0], at[1] - current.start[1]) < slop
      ) {
        return;
      }
      // (Its root too, once it's dragged (not at the touch's start): what's
      // in the grid may show itself while one's resized, see Card.)
      if (!current.isDragging) markResizing(current.cell, true);
      current.isDragging = true;
      // (Its area's end-of-line column a full width (see `onPointerDown`);
      // past its bottom only, its next size up.)
      const { canFull, reach } = current;
      const span = draggedSpan(
        current,
        at,
        reach?.metrics ?? metricsOf(event.currentTarget),
        [
          canFull ? columns + 1 : limitOf(reach, most[0] ?? columns, columns),
          most[1] ?? maxTileRows,
        ],
      );
      const isPast = pastOf(current, at);
      if (
        span[0] === current.span[0] &&
        span[1] === current.span[1] &&
        isPast === current.isPast
      ) {
        return;
      }
      current.span = span;
      current.isPast = isPast;
      const next = draggedSize(sizes, resized, span, {
        canFull,
        columns,
        isPast,
        reach,
      });
      current.next = next;
      if (next) {
        outlineResize(current, next, {
          columns,
          isTaking: next !== resized && !isBounded,
        });
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
      if (current.isDragging) markResizing(current.cell, false);
      markMerged(current.merged, false);
      // (Tapped, not dragged: the next size, as by a key; also where
      // there's no room to drag it. Held, not dragged: nothing.)
      if (event.type === 'pointerup' && !current.isDragging) {
        if (following && event.timeStamp - current.time < tapTime) {
          request?.(following);
        }
        return;
      }
      if (
        event.type === 'pointerup' &&
        current.next &&
        current.next !== resized
      ) {
        if (isBounded && current.cell) {
          current.cell.dataset.gridPlaced = '';
          placed.current = current.cell;
        }
        request?.(current.next, {
          merged: current.merged
            .map(({ dataset }) => dataset.gridName)
            .filter((name): name is string => name !== undefined),
        });
      }
    };

    // (Only with another size to be; shown while editing.)
    if (sizes.length < 2) return null;
    return (
      <CornerButton
        ref={ref}
        mirrored
        aria-label="Resize"
        className={cn('uikit-grid-resize-handle', className)}
        corner="bottom-trailing"
        data-direction={direction}
        data-grid-area-handle={isAreaHandle ? '' : undefined}
        data-grid-edit-control=""
        data-grid-part="resize-handle"
        icon={resizeIcons[direction]}
        render={render}
        visible={item?.editing ?? false}
        {...props}
        onLostPointerCapture={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          // (Pressed by a key: the next size fitting the columns. By a
          // pointer: see `onPointerEnd`.)
          if (event.defaultPrevented || !following || event.detail !== 0) {
            return;
          }
          request?.(following);
        }}
      />
    );
  },
);

/**
 * Removing its item (or spacer, break), editing (an edit control): an x
 * in its top leading corner, drawn as a `ResizeHandle` is, a 44px target;
 * what it removes is up to its `onClick` (the app's data: in a
 * `Grid.Area`, the area, in the area's corner). Dragged from (held first,
 * by touch), its cell's moved instead, not removed. E.g. a card's corner
 * (`render`).
 */
const RemoveButton = forwardRef<HTMLButtonElement, GridRemoveButtonProps>(
  ({ className, render, ...props }, ref) => {
    const item = useContext(GridItemContext);
    const isArea = useContext(GridAreaScopeContext);
    return (
      <CornerButton
        ref={ref}
        aria-label="Remove"
        className={cn('uikit-grid-remove-button', className)}
        corner="top-leading"
        data-grid-area-button={isArea ? '' : undefined}
        // (Dragged from, as its cell: a finger meant for the cell; see
        // edit.ts. Tapped, its `onClick`.)
        data-grid-drag-through=""
        data-grid-edit-control=""
        data-grid-part="remove-button"
        icon={gridIcons.remove}
        render={render}
        visible={item?.editing ?? false}
        {...props}
      />
    );
  },
);

/**
 * The area a tile gets added (see `AreaButton`): a column wider, as tall;
 * a full width's (or one as wide as the columns), a row taller; the
 * nearest larger supported area holding it if that's not supported (the
 * smallest); none, none.
 */
const addedAreaOf = (
  size: GridSize,
  supported: readonly GridSize[],
  { columns, maxTileRows }: { columns: number; maxTileRows: number },
) => {
  const [c, r] = spanOf(size, columns);
  const isWide = isFull(size) || c >= columns;
  if (isWide && r >= maxTileRows) return undefined;
  const wanted: GridSize = isWide
    ? (`${isFull(size) ? '*' : String(c)}x${String(r + 1)}` as GridSize)
    : (`${String(c + 1)}x${String(r)}` as GridSize);
  if (supported.includes(wanted)) return wanted;
  return supported.find((each) => {
    const [ac, ar] = spanOf(each, columns);
    return (
      ac >= c &&
      ar >= r &&
      ac <= columns &&
      ar <= maxTileRows &&
      (ac > c || ar > r) &&
      (!isFull(size) || isFull(each))
    );
  });
};

/**
 * Adding an area to its item, editing (an edit control): three diagonal
 * strokes (the hatching's) in its tile's bottom leading corner, drawn as
 * a `RemoveButton` is; only without an area (a `Grid.Area`), and with one
 * to add (see `addedAreaOf`, of its `supportedSizes`): pressed, its
 * `onAdd` given that size (the app's to render a `Grid.Area` of it; unless
 * its `onClick` prevents it).
 */
const AreaButton = forwardRef<HTMLButtonElement, GridAreaButtonProps>(
  ({ className, onAdd, onClick, render, supportedSizes, ...props }, ref) => {
    const { columns, maxTileRows } = useContext(GridContext);
    const item = useContext(GridItemContext);
    const supported = useMemo(
      () => supportedOf(supportedSizes, columns, maxTileRows),
      [columns, maxTileRows, supportedSizes],
    );
    const added =
      item && !item.hasArea
        ? addedAreaOf(item.size, supported, { columns, maxTileRows })
        : undefined;
    // (Only with an area to add; shown while editing.)
    if (!added) return null;
    return (
      <CornerButton
        ref={ref}
        mirrored
        aria-label="Add area"
        className={cn('uikit-grid-area-button', className)}
        corner="bottom-leading"
        data-grid-drag-through=""
        data-grid-edit-control=""
        data-grid-part="area-button"
        icon={gridIcons.addArea}
        render={render}
        visible={item?.editing ?? false}
        {...props}
        onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          onAdd?.(added);
        }}
      />
    );
  },
);

// A break's sizes (see `Break`): a unit wide, its rows tall (up to the
// grid's `maxTileRows`).
const breakSizesOf = (rows: number): GridSize[] =>
  Array.from(
    { length: Math.max(1, rows) },
    (_, index) => `1x${String(index + 1)}` as GridSize,
  );

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
    const { editing, maxTileRows } = useContext(GridContext);
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
    const state = useMemo((): CellState => {
      const size: GridSize = `1x${rows}`;
      const breakSizes = breakSizesOf(maxTileRows);
      // (Its rows as a size; no area of its own.)
      return {
        area: size,
        canOpen: false,
        editing,
        expanded: false,
        expandedSize: undefined,
        hasArea: false,
        isFitted: false,
        // (Any of its rows: free.)
        isFreeArea: true,
        isFreeSize: true,
        movable: false,
        open: false,
        openSize: size,
        placement: 'center',
        requestArea: requestSize,
        requested: size,
        requestPlacement: noPlacement,
        requestSize,
        setExpanded: noOpen,
        setOpen: noOpen,
        size,
        // (Its rows, as asked: a unit wide, never fitted.)
        sizeOf: (next: GridSize) => ({
          isFitted: false,
          size: `1x${String(spanOf(next)[1])}` as GridSize,
        }),
        supportedAreas: breakSizes,
        supportedSizes: breakSizes,
      };
    }, [editing, maxTileRows, requestSize, rows]);
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
          {moveSignOf(entry)}
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
  CornerButton,
  ResizeHandle,
  RemoveButton,
  Area,
  AreaButton,
  createReorderHandle,
  reorder,
  useCreateReorderHandle,
};
