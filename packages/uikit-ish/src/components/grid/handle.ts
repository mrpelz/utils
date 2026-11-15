import { useLayoutEffect, useState } from 'react';

import { reorder as reorderLists } from '../list/reorder.js';
import type {
  GridBreakRows,
  GridReorderChange,
  GridReorderHandleOptions,
  GridReorderPart,
  GridSize,
} from './props.js';

/**
 * Where cells are dropped: a range of a container's cells (a `Section`'s,
 * the `Root`'s, a `DropGroup`'s; they register with it), its gaps before,
 * between and after them.
 * @internal
 */
export type GridRange = {
  /** The grid (or section) its cells are in. */
  readonly container: () => HTMLElement | null;
  readonly handles: () => readonly GridReorderHandle[];
  readonly members: Set<HTMLElement>;
  readonly name: () => string | undefined;
  readonly part: GridReorderPart;
};

/**
 * A cell (an item, spacer, break): its handles, its name, its range.
 * @internal
 */
export type GridCell = {
  readonly handles: () => readonly GridReorderHandle[];
  readonly name: () => string | undefined;
  readonly range: GridRange | undefined;
};

/** @internal */
export const cellOf = new WeakMap<HTMLElement, GridCell>();

/** A handle, or several (by priority), as an array. */
export const handlesOf = (
  handle: GridReorderHandle | readonly GridReorderHandle[] | undefined,
): readonly GridReorderHandle[] => {
  if (handle === undefined) return [];
  return Array.isArray(handle) ? handle : [handle as GridReorderHandle];
};

/**
 * Cells reordered by a handle (`Grid.createReorderHandle`, in a component
 * `useCreateReorderHandle`), as List's rows are: given to cells (`Item`,
 * `Spacer`, `Break` `reorderHandle`), and to where they can be dropped
 * (`Section`, `Root` `reorderHandle`: among its cells; `DropGroup`: among
 * the cells in it, a part of a section). Its `onReorder` called as a cell is
 * dropped in another place (dragged, or moved by keyboard while editing);
 * the app moves it in its data (e.g. by `Grid.reorder`), its next render
 * what stays. A cell with several handles: dropped where any of them is
 * (the first, by priority, reported).
 */
export class GridReorderHandle {
  /** Breaks can be added, changed (see `GridReorderHandleOptions`). */
  breaks: boolean;
  /** Its cells (see `Item`). @internal */
  readonly cells = new Set<HTMLElement>();
  onReorder: GridReorderHandleOptions['onReorder'];
  /** Where its cells drop (see `GridRange`). @internal */
  readonly ranges = new Set<GridRange>();

  /** Spacers can be added (see `GridReorderHandleOptions`). */
  spacers: boolean;

  constructor({
    breaks = false,
    onReorder,
    spacers = false,
  }: GridReorderHandleOptions = {}) {
    this.breaks = breaks;
    this.onReorder = onReorder;
    this.spacers = spacers;
  }

  /** Its options anew (e.g. a component's latest `onReorder`). */
  setOptions({
    breaks = false,
    onReorder,
    spacers = false,
  }: GridReorderHandleOptions): void {
    this.breaks = breaks;
    this.onReorder = onReorder;
    this.spacers = spacers;
  }
}

/** A reorder handle (see `GridReorderHandle`). */
export const createReorderHandle = (
  options?: GridReorderHandleOptions,
): GridReorderHandle => new GridReorderHandle(options);

/**
 * A reorder handle made once (in a component), its `onReorder` the latest
 * given.
 */
export const useCreateReorderHandle = (
  options?: GridReorderHandleOptions,
): GridReorderHandle => {
  const [handle] = useState(() => new GridReorderHandle(options));
  useLayoutEffect(() => {
    handle.setOptions(options ?? {});
  });
  return handle;
};

/**
 * Making and changing the app's cells for a change's additions (see
 * `Grid.reorder`): none given, those not made (not changed).
 */
export type GridReorderCells<T> = {
  /** A new break of some rows (e.g. with a new `dropName`). */
  breakOf?: (rows: GridBreakRows, change: GridReorderChange) => T;
  /** A new spacer of a size. */
  spacerOf?: (size: GridSize, change: GridReorderChange) => T;
  /** A break (`target.resize`) with other rows. */
  withRows?: (cell: T, rows: GridBreakRows) => T;
};

/**
 * Applies a change (see `GridReorderChange`) to the app's cells, named by
 * `nameOf` (as their `dropName`): a list of them, or lists by name (their
 * `Section`'s or `DropGroup`'s `dropName`), as `List.reorder`. The moved
 * cell is taken out and put after the target's `after` cell (or before its
 * `before` one); in an empty list, by the target's `name`. Its additions
 * (`target.addBefore`, `addAfter`) made by `cells` and put right before and after
 * it, a break's rows changed (`target.resize`). Returns new arrays for
 * those that changed (the input, if a cell isn't found).
 */
export function reorder<T>(
  data: readonly T[],
  change: GridReorderChange,
  nameOf: (cell: T) => string,
  cells?: GridReorderCells<T>,
): readonly T[];
export function reorder<T, Key extends string>(
  data: Readonly<Record<Key, readonly T[]>>,
  change: GridReorderChange,
  nameOf: (cell: T) => string,
  cells?: GridReorderCells<T>,
): Readonly<Record<Key, readonly T[]>>;
export function reorder<T>(
  data: readonly T[] | Readonly<Record<string, readonly T[]>>,
  change: GridReorderChange,
  nameOf: (cell: T) => string,
  { breakOf, spacerOf, withRows }: GridReorderCells<T> = {},
): readonly T[] | Readonly<Record<string, readonly T[]>> {
  const moved = reorderLists(
    data as Readonly<Record<string, readonly T[]>>,
    change,
    nameOf,
  );
  const {
    addAfter: after = [],
    addBefore: before = [],
    resize,
  } = change.target;
  const name = change.items[0]?.name;
  if (name === undefined) return moved;
  const make = (inserts: typeof after) =>
    inserts.flatMap((insert) => {
      const made =
        insert.kind === 'break'
          ? breakOf?.(insert.rows, change)
          : spacerOf?.(insert.size, change);
      return made === undefined ? [] : [made];
    });
  // (Its additions around it, a break's rows changed, in its list.)
  const amend = (list: readonly T[]) => {
    const at = list.findIndex((cell) => nameOf(cell) === name);
    if (at === -1) return list;
    const resized =
      resize && withRows
        ? list.map((cell) =>
            nameOf(cell) === resize.name ? withRows(cell, resize.rows) : cell,
          )
        : list;
    if (before.length === 0 && after.length === 0 && resized === list) {
      return list;
    }
    return [
      ...resized.slice(0, at),
      ...make(before),
      resized[at] as T,
      ...make(after),
      ...resized.slice(at + 1),
    ];
  };
  return Array.isArray(moved)
    ? amend(moved as readonly T[])
    : Object.fromEntries(
        Object.entries(moved).map(([key, list]) => [key, amend(list)]),
      );
}

/** Whether a size spans the grid's width (`*`, see `GridSize`). */
export const isFull = (size: GridSize): boolean => size.startsWith('*');

/**
 * A size's columns and rows; a full width's (`*`) the grid's `columns`
 * (unknown: the most a size has otherwise, 6).
 */
export const spanOf = (size: GridSize, columns = 6): [number, number] => {
  const [width = '1', height = '1'] = size.split('x');
  return [isFull(size) ? columns : Number(width), Number(height)];
};

const area = (size: GridSize, columns?: number) => {
  const [width, rows] = spanOf(size, columns);
  return width * rows;
};

/** Sizes in order: smallest area first, then the narrower. */
export const sortSizes = (sizes: readonly GridSize[]): GridSize[] =>
  [...new Set(sizes)].toSorted(
    (a, b) => area(a) - area(b) || spanOf(a)[0] - spanOf(b)[0],
  );

/**
 * Every size up to a grid's columns and rows (a full width too), in order
 * (see `sortSizes`): what's supported, none given.
 */
export const sizesUpTo = (columns: number, rows: number): GridSize[] =>
  sortSizes(
    [
      ...Array.from({ length: Math.max(1, columns) }, (_, index) =>
        String(index + 1),
      ),
      '*',
    ].flatMap((width) =>
      Array.from(
        { length: Math.max(1, rows) },
        (_, index) => `${width}x${String(index + 1)}` as GridSize,
      ),
    ),
  );

/**
 * A requested size snapped to supported ones: the same shape first, then
 * the closest area (ties: the smaller).
 */
const snapped = (
  requested: GridSize,
  sorted: readonly GridSize[],
  columns: number,
) => {
  // (A full width snapping to a full width first, as a shape of its own.)
  const isFullWanted = isFull(requested);
  const full = sorted.filter((size) => isFull(size) === isFullWanted);
  const [columnsWanted, rowsWanted] = spanOf(requested, columns);
  const shape = columnsWanted / rowsWanted;
  const base = full.length > 0 ? full : sorted;
  const sameShape = base.filter((size) => {
    const [c, r] = spanOf(size, columns);
    return c / r === shape;
  });
  const pool = sameShape.length > 0 ? sameShape : base;
  const wanted = area(requested, columns);
  let best = pool[0] ?? '1x1';
  for (const size of pool) {
    const distance = Math.abs(area(size, columns) - wanted);
    if (distance < Math.abs(area(best, columns) - wanted)) best = size;
  }
  return best;
};

/**
 * A requested size, effective: snapped to the supported ones (see
 * `snapped`); wider than the columns (or taller than `rows`, within an
 * area), the widest supported that fits (the nearest rows first, then the
 * smaller), fitted; none fitting, the narrowest. A full width's: the
 * grid's `columns`.
 */
export const effectiveSize = (
  requested: GridSize,
  supported: readonly GridSize[],
  columns: number,
  {
    gridColumns = columns,
    rows: rowsMost = Number.POSITIVE_INFINITY,
  }: { gridColumns?: number; rows?: number } = {},
): { isFitted: boolean; size: GridSize } => {
  const sorted = sortSizes(
    supported.length > 0
      ? supported
      : sizesUpTo(gridColumns, Number.isFinite(rowsMost) ? rowsMost : 3),
  );
  const size = snapped(requested, sorted, gridColumns);
  const fits = (each: GridSize) => {
    const [c, r] = spanOf(each, gridColumns);
    return c <= columns && r <= rowsMost;
  };
  if (fits(size)) return { isFitted: false, size };
  const [, rows] = spanOf(size, gridColumns);
  let best: GridSize | undefined;
  for (const each of sorted) {
    const [c, r] = spanOf(each, gridColumns);
    if (!fits(each)) continue;
    const [bestColumns = 0, bestRows = 0] = best
      ? spanOf(best, gridColumns)
      : [];
    const isBetter =
      !best ||
      c > bestColumns ||
      (c === bestColumns && Math.abs(r - rows) < Math.abs(bestRows - rows));
    if (isBetter) best = each;
  }
  return {
    isFitted: true,
    size:
      best ??
      sorted.toSorted(
        (a, b) => spanOf(a, gridColumns)[0] - spanOf(b, gridColumns)[0],
      )[0] ??
      size,
  };
};
