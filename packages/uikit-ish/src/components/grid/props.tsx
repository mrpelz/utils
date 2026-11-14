import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactNode } from 'react';

import type { GridReorderHandle } from './handle.js';

/** A span: columns by rows, 1 to 3 each (e.g. `'2x1'`: wide, one row). */
export type GridSize = `${1 | 2 | 3}x${1 | 2 | 3}`;

/** Where cells drop (see `GridReorderTarget`). */
export type GridReorderPart = 'DropGroup' | 'Root' | 'Section';

/** A moved cell: its `dropName`, its index among the handle's cells. */
export type GridReorderItem = {
  /** Among the handle's cells, in document order (before moving). */
  index: number;
  name?: string;
};

/** Where a cell is dropped: a gap in a range of cells (as List's). */
export type GridReorderTarget = {
  /**
   * Cells to add right after the moved one (see `GridReorderInsert`), so
   * what follows stays where it was (e.g. a break keeping the rest of a
   * shortened break's rows empty).
   */
  addAfter?: readonly GridReorderInsert[];
  /**
   * Cells to add right before the moved one (see `GridReorderInsert`), so
   * it lands where it was dropped (e.g. a break, so it starts a row; spacers
   * left of it).
   */
  addBefore?: readonly GridReorderInsert[];
  /** The `dropName` of the cell before the gap (not the moved one). */
  after?: string;
  /** The `dropName` of the cell after the gap (not the moved one). */
  before?: string;
  /** Among the handle's gaps, in document order. */
  flat: number;
  /** The gap within its `Section`, `Root` or `DropGroup`. */
  index: number;
  /** Its `Section`'s, `Root`'s or `DropGroup`'s `dropName`. */
  name?: string;
  part: GridReorderPart;
  /**
   * A break before the gap to have fewer (or more) rows, by its
   * `dropName`: dropped in the rows it keeps empty, ending above them.
   */
  resize?: { name: string; rows: GridBreakRows };
};

/**
 * A cell to add with a move (its handle's `breaks`, `spacers`): a break of
 * some rows, or a spacer of a size (see `Grid.reorder`).
 */
export type GridReorderInsert =
  { kind: 'break'; rows: GridBreakRows } | { kind: 'spacer'; size: GridSize };

/** A cell moved to a target (see `GridReorderHandle`), as List's rows. */
export type GridReorderChange = {
  /** The cell moved (one: the shape List's several share). */
  items: readonly GridReorderItem[];
  target: GridReorderTarget;
};

/** How a cell was moved: dragged, or by keyboard. */
export type GridReorderReason = 'drag' | 'keyboard';

export type GridReorderEventDetails = {
  event: Event;
  reason: GridReorderReason;
};

export type GridReorderHandleOptions = {
  /**
   * Breaks can be added and changed: a cell dropped where only a break gets
   * it to (the start of a row the rows before would take it back from; in
   * the rows a break keeps empty) asks for one (`target.addBefore`, `addAfter`)
   * or a break's rows changed (`target.resize`). The app does it (e.g. by
   * `Grid.reorder`).
   */
  breaks?: boolean;
  /** Called as a cell is dropped elsewhere: the app moves it in its data. */
  onReorder?: (
    change: GridReorderChange,
    eventDetails: GridReorderEventDetails,
  ) => void;
  /**
   * Spacers can be added: a cell dropped on an empty unit with free ones
   * left of it (or, in a break's rows, right of it up to what's in the way)
   * asks for spacers there (`target.addBefore`, `addAfter`), so it lands there and
   * the rest stays.
   */
  spacers?: boolean;
};

/** A cell's reordering: its handles (by priority), its name. */
type GridDraggableProps = {
  /** Its name in reordering (see `GridReorderItem`, `GridReorderTarget`). */
  dropName?: string;
  /**
   * Handles moving it (see `Grid.createReorderHandle`): editing, dragged
   * (or moved by keyboard) to where any of them is a target. None: it
   * stays.
   */
  reorderHandle?: GridReorderHandle | readonly GridReorderHandle[];
};

/** A range of cells' reordering: what's dropped among them, its name. */
type GridDropProps = {
  /** Its name, the target's (see `GridReorderTarget`). */
  dropName?: string;
  /**
   * Handles whose cells can be dropped before, between and after its
   * cells.
   */
  reorderHandle?: GridReorderHandle | readonly GridReorderHandle[];
};

export type GridRootProps = ComponentProps<'div'> &
  GridDropProps & {
    /**
     * Later items fill earlier holes (CSS grid's `dense` placement), instead
     * of each item after the one before it. Not while editing.
     * @default false
     */
    dense?: boolean;
    /**
     * Edit mode: cells (items, spacers, breaks) with a `reorderHandle`
     * moved by dragging them (or by keyboard: Alt and an arrow key), resized
     * by their `ResizeHandle`s; what's in them not acted on otherwise.
     * Spacers and breaks outlined.
     * @default false
     */
    editing?: boolean;
    /** The gap between items (px). @default 12 */
    gap?: number;
    /** The largest a unit stretches to (px). @default 130 */
    unitMax?: number;
    /** The smallest a unit shrinks to (px). @default 100 */
    unitMin?: number;
    /**
     * A unit's size (px) to aim for: the columns as many as fit, each unit
     * stretched (between `unitMin` and `unitMax`) to fill the width.
     * @default 110
     */
    unitSize?: number;
  };

export type GridSectionProps = ComponentProps<'section'> &
  GridDropProps & {
    /**
     * Later items fill earlier holes (see the root's `dense`), for this
     * section. Not while editing.
     * @default the root's
     */
    dense?: boolean;
  };

export type GridHeaderProps = ComponentProps<'div'>;

/** A part of a section (no element): what's dropped among its cells. */
export type GridDropGroupProps = GridDropProps & {
  children?: ReactNode;
};

/** How a size changed (see `onSizeChange`, `onRowsChange`). */
export type GridSizeChangeDetails = {
  /**
   * What it took in (their `dropName`s), growing over them: an item or a
   * spacer, the spacers it reached; a break, the breaks right before and
   * after it; either, the breaks (a break: also the spacers) wholly
   * inside its new size. The app removes them.
   */
  merged: readonly string[];
};

export type GridItemProps = ComponentProps<'div'> &
  GridDraggableProps & {
    /** Its initial size (uncontrolled). @default '1x1' */
    defaultSize?: GridSize;
    /**
     * Called as its size is changed (e.g. by its card's resize corner),
     * with what it took in (see `GridSizeChangeDetails`).
     */
    onSizeChange?: (size: GridSize, details: GridSizeChangeDetails) => void;
    /** Its size (controlled): as the user chose it, stored by the app. */
    size?: GridSize;
    /**
     * The sizes it can be (its content's, declared as a constant: e.g. a
     * card component's `sizes`). Its size snaps to them (the same shape
     * first, then the closest area), then fits the columns.
     * @default every size
     */
    supportedSizes?: readonly GridSize[];
  };

export type GridSpacerProps = ComponentProps<'div'> &
  GridDraggableProps & {
    /** Its initial size (uncontrolled). @default '1x1' */
    defaultSize?: GridSize;
    /**
     * Called as its size is changed (e.g. by a `ResizeHandle` in it),
     * with what it took in (see `GridSizeChangeDetails`).
     */
    onSizeChange?: (size: GridSize, details: GridSizeChangeDetails) => void;
    /** Its size (controlled): a hole that big, fitted to the columns. */
    size?: GridSize;
  };

export type GridSpawnProps = useRender.ComponentProps<'button'> &
  GridDraggableProps & {
    /** Its initial size (uncontrolled). @default '1x1' */
    defaultSize?: GridSize;
    /**
     * Called as its size is changed (e.g. by a `ResizeHandle` in it), with
     * what it took in (see `GridSizeChangeDetails`).
     */
    onSizeChange?: (size: GridSize, details: GridSizeChangeDetails) => void;
    /** Its size (controlled), fitted to the columns. */
    size?: GridSize;
  };

/**
 * Resizing its item (see `Grid.ResizeHandle`): an arc by default; `render`,
 * e.g. a card's corner.
 */
export type GridResizeHandleProps = useRender.ComponentProps<'button'>;

export type GridRemoveButtonProps = useRender.ComponentProps<'button'>;

/** A break's height: the rows it keeps the rest of empty. */
export type GridBreakRows = 1 | 2 | 3;

export type GridBreakProps = ComponentProps<'div'> &
  GridDraggableProps & {
    /** Its initial rows (uncontrolled). @default 1 */
    defaultRows?: GridBreakRows;
    /**
     * Called as its rows are changed (e.g. by a `ResizeHandle` in it),
     * with what it took in (see `GridSizeChangeDetails`).
     */
    onRowsChange?: (
      rows: GridBreakRows,
      details: GridSizeChangeDetails,
    ) => void;
    /**
     * Its rows (controlled): the rest of its row and the rows below it
     * kept empty, as many in all; what follows starts below them.
     */
    rows?: GridBreakRows;
  };

/** An item's sizes and state (see `useGridItem`). */
export type GridItemState = {
  /** Whether its grid is editing. */
  editing: boolean;
  /** Whether it's smaller than snapped, to fit the columns. */
  isFitted: boolean;
  /**
   * Asks for another size (its `onSizeChange`, or its own), with what it
   * takes in (none by default).
   */
  requestSize: (size: GridSize, details?: GridSizeChangeDetails) => void;
  /** Its size as the user chose it. */
  requested: GridSize;
  /** Its effective size: requested, snapped to supported, fitted. */
  size: GridSize;
  /** The sizes it can be, in order (smallest area first). */
  supportedSizes: readonly GridSize[];
};
