import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactNode } from 'react';

import type { SymbolIcon } from '../symbol/main.js';
import type { GridReorderHandle } from './handle.js';

/**
 * A span: columns by rows (e.g. `'2x1'`: wide, one row); `*` for columns:
 * as wide as the grid, however many columns it has (e.g. `'*x2'`: a full
 * width, two rows). Any numbers: the grid holds them to its own (wider
 * than its columns: the widest supported that fits; taller than its
 * `maxTileRows`: not offered).
 */
export type GridSize = `${number}x${number}` | `*x${number}`;

/**
 * Where a tile sits in its area (see `GridItemProps.area`): in its middle
 * (truly, off the unit lines if need be), or a corner of it on the area's.
 */
export type GridPlacement =
  | 'bottom-leading'
  | 'bottom-trailing'
  | 'center'
  | 'top-leading'
  | 'top-trailing';

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
    /**
     * The most rows a tile has (sizes taller not shown, not offered), and
     * a break keeps empty. Every item must support a size within
     * `minColumns` and this.
     * @default 3
     */
    maxTileRows?: number;
    /**
     * The fewest columns it lays out, however narrow it is (its units
     * shrinking below `unitMin` then). Every item must support a size this
     * narrow or narrower, so a layout never breaks: wider sizes give way to
     * the widest that fits.
     * @default 3
     */
    minColumns?: number;
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
   * inside its new size. Only those named (their `dropName`) and
   * removable (a `Grid.RemoveButton` in them; the others reflow, as
   * items do), marked while it's resized. The app removes them.
   */
  merged: readonly string[];
};

/**
 * Why an item opened above the page closed (see `GridItemProps.open`): a
 * press on the backdrop, Escape, its grid starting edit mode, or the app
 * (`setOpen`, e.g. a close button).
 */
export type GridOpenChangeReason =
  'edit' | 'escape-key' | 'none' | 'outside-press';

/** What an item's open change was (see `GridItemProps.onOpenChange`). */
export type GridOpenChangeDetails = { reason: GridOpenChangeReason };

/**
 * Why an item's expansion changed (see `GridItemProps.expanded`): its grid
 * starting edit mode (made small again), or the app (`setExpanded`, e.g. a
 * card's `Card.ExpandButton`).
 */
export type GridExpandedChangeReason = 'edit' | 'none';

/** What an item's expansion change was (see `onExpandedChange`). */
export type GridExpandedChangeDetails = { reason: GridExpandedChangeReason };

export type GridItemProps = ComponentProps<'div'> &
  GridDraggableProps & {
    /**
     * What it shows, filling its tile (e.g. a card), its tile's controls
     * (a `ResizeHandle`, a `RemoveButton`, an `AreaButton`); a `Grid.Area`
     * for room around its tile, its own controls in it.
     */
    children?: ReactNode;
    /**
     * Whether it's expanded initially (uncontrolled, see `expanded`).
     * @default false
     */
    defaultExpanded?: boolean;
    /** Whether it's open initially (uncontrolled, see `open`). @default false */
    defaultOpen?: boolean;
    /** Its initial size (uncontrolled). @default '1x1' */
    defaultSize?: GridSize;
    /**
     * Whether it's expanded in place (controlled): shown at its
     * `expandedSize` instead of its size, which stays as it is (stored);
     * the grid reflowing around it. Made small again as its grid starts
     * edit mode (sizes are chosen there). Without an `expandedSize`, never.
     */
    expanded?: boolean;
    /**
     * Its size expanded (see `expanded`): snapped and fitted as its size is
     * (smaller than its size too: expanding then makes it smaller).
     */
    expandedSize?: GridSize;
    /**
     * Called as it's expanded or made small again (see `expanded`): by the
     * app (e.g. its card's `Card.ExpandButton`, through `useGridItem`'s
     * `setExpanded`), or made small again by edit mode starting.
     */
    onExpandedChange?: (
      expanded: boolean,
      details: GridExpandedChangeDetails,
    ) => void;
    /**
     * Called as it's opened or closed (see `open`): by the app (e.g. its
     * card's corner button, through `useGridItem`'s `setOpen`), or closed
     * by a press on the backdrop, Escape, or edit mode starting.
     */
    onOpenChange?: (open: boolean, details: GridOpenChangeDetails) => void;
    /**
     * Called as its size is changed (e.g. by its card's resize corner),
     * with what it took in (see `GridSizeChangeDetails`).
     */
    onSizeChange?: (size: GridSize, details: GridSizeChangeDetails) => void;
    /**
     * Whether it's open above the page (controlled): its tile lifted out
     * of the grid (a stand-in keeping its place, nothing reflowing), in
     * the middle of the screen at `openSize`, over a dimmed backdrop; a
     * modal dialog (`openLabel`) until it's closed. Never while editing.
     */
    open?: boolean;
    /** Its name while it's open (a dialog's), e.g. its card's title. */
    openLabel?: string;
    /**
     * Its size open (see `open`): in the grid's units, fitted to the
     * screen.
     * @default '4x3'
     */
    openSize?: GridSize;
    /** Its size (controlled): as the user chose it, stored by the app. */
    size?: GridSize;
    /**
     * The sizes it can be (its content's, declared as a constant: e.g. a
     * card component's `sizes`). Its size snaps to them (the same shape
     * first, then the closest area). If that's wider than the columns, the
     * widest that fits is shown instead (the nearest rows first). One of
     * them must fit the grid's `minColumns`.
     * @default every size
     */
    supportedSizes?: readonly GridSize[];
  };

/**
 * Room around an item's (or add tile's) tile (see `Grid.Area`): its size,
 * where its tile sits in it, whether the tile moves in it.
 */
export type GridAreaProps = {
  /** Its controls (a `ResizeHandle`, a `RemoveButton`), in its corners. */
  children?: ReactNode;
  /** Its initial placement (uncontrolled, see `placement`). @default 'center' */
  defaultPlacement?: GridPlacement;
  /** Its initial size (uncontrolled, see `size`). */
  defaultSize?: GridSize;
  /**
   * Its tile can be moved within it while editing (crosshairs in the tile's
   * top trailing corner): held and dragged (the hatched room around it
   * moves the whole item), or by the arrow keys while it has focus.
   * @default false
   */
  movable?: boolean;
  /**
   * Called as its placement is changed (its tile dragged in it, or moved
   * by the arrow keys; see `movable`).
   */
  onPlacementChange?: (placement: GridPlacement) => void;
  /**
   * Called as its size is changed (by a `ResizeHandle` in it), with what
   * it took in (see `GridSizeChangeDetails`).
   */
  onSizeChange?: (size: GridSize, details: GridSizeChangeDetails) => void;
  /**
   * Where its tile sits in it (controlled): in its middle (truly, off the
   * unit lines if need be; its size still in units), or a corner of it on
   * the area's.
   */
  placement?: GridPlacement;
  /**
   * Its size (controlled): the room its item takes in the layout, at
   * least its tile's size, the rest hatched while editing.
   */
  size?: GridSize;
  /**
   * The sizes it can be (see `GridItemProps.supportedSizes`): its size
   * snaps to them, then fits the columns; its tile's then fits it (the
   * widest supported that does).
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
    /**
     * Its controls (e.g. a `ResizeHandle`), beside its button, not in it;
     * a `Grid.Area` for room around its tile.
     */
    children?: ReactNode;
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
 * e.g. a card's corner. In a `Grid.Area`, the area.
 */
/** A cell's corner (see `Grid.CornerButton`), as a placement's. */
export type GridCorner =
  'bottom-leading' | 'bottom-trailing' | 'top-leading' | 'top-trailing';

/**
 * A corner button in edit mode (see `GridCornerButtonProps.whileEditing`,
 * as List's rows' `whileEditing`): `hide` (only while not editing), `show`
 * (only while editing, e.g. a card's settings), or `stay` (both).
 */
export type GridWhileEditing = 'hide' | 'show' | 'stay';

export type GridCornerButtonProps = useRender.ComponentProps<'button'> & {
  /**
   * The corner it's in: a 44px target there, its icon 16.5px in from both
   * of the corner's edges.
   * @default 'bottom-trailing'
   */
  corner?: GridCorner;
  /**
   * Its icon: one of `gridIcons`, or the app's own (e.g. an
   * SF Symbol), centered at the same place, at the same size.
   */
  icon: SymbolIcon;
  /**
   * Whether it's flipped in a right-to-left layout: for an icon that
   * points somewhere (e.g. `gridIcons.expand`), not for one that reads as
   * it is.
   * @default false
   */
  mirrored?: boolean;
  /**
   * Whether it's shown: hidden, it fades out (by its color) and can't be
   * pressed or focused. The grid's own show while it's editing; a card's
   * while it isn't, by default (see `whileEditing`, `Card.CornerButton`).
   * @default true
   */
  visible?: boolean;
  /**
   * In edit mode: shown only then (`show`, e.g. a card's settings), hidden
   * then (`hide`), or either way (`stay`). Shown while editing, it's in the
   * grid's controls' color, over a card's veil, and a press on it is its
   * own (a drag from it moves its cell, as from the remove button).
   * @default 'stay'
   */
  whileEditing?: GridWhileEditing;
};

export type GridResizeHandleProps = useRender.ComponentProps<'button'>;

export type GridRemoveButtonProps = useRender.ComponentProps<'button'>;

export type GridAreaButtonProps = useRender.ComponentProps<'button'> & {
  /**
   * Called with the area to add (see `Grid.AreaButton`): the app renders a
   * `Grid.Area` of that size in the item.
   */
  onAdd?: (size: GridSize) => void;
  /**
   * The sizes the area could be, to suggest one of (its `Grid.Area`'s
   * `supportedSizes`, to be).
   * @default every size
   */
  supportedSizes?: readonly GridSize[];
};

/**
 * A break's height: the rows it keeps the rest of empty (1 up to the
 * grid's `maxTileRows`).
 */
export type GridBreakRows = number;

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

/**
 * A size as it would be (see `GridItemState.sizeOf`): effective, and
 * whether it's narrower than snapped, to fit the columns (or its area).
 */
export type GridSizeFit = {
  /** Whether it's narrower than snapped, to fit. */
  isFitted: boolean;
  /** Its effective size. */
  size: GridSize;
};

/** An item's sizes and state (see `useGridItem`). */
export type GridItemState = {
  /**
   * Whether it opens above the page: its `openSize` given (see
   * `GridItemProps.open`).
   */
  canOpen: boolean;
  /** Whether its grid is editing. */
  editing: boolean;
  /** Whether it's expanded in place (see `GridItemProps.expanded`). */
  expanded: boolean;
  /** Its size expanded (its `expandedSize`), if it has one. */
  expandedSize: GridSize | undefined;
  /**
   * Whether it's narrower than snapped, to fit the columns or its area (its
   * area's own fit: `GridAreaState.isFitted`).
   */
  isFitted: boolean;
  /** Whether it's open above the page (see `GridItemProps.open`). */
  open: boolean;
  /**
   * Its size open above the page (its `openSize`; smaller there if the
   * screen is).
   */
  openSize: GridSize;
  /**
   * Asks for another size (its `onSizeChange`, or its own), with what it
   * takes in (none by default).
   */
  requestSize: (size: GridSize, details?: GridSizeChangeDetails) => void;
  /** Its size as the user chose it (expanded or not: its stored size). */
  requested: GridSize;
  /**
   * Expands it or makes it small again (its `onExpandedChange`, reason
   * none).
   */
  setExpanded: (expanded: boolean) => void;
  /** Opens or closes it above the page (its `onOpenChange`, reason none). */
  setOpen: (open: boolean) => void;
  /**
   * Its effective size: requested (expanded, its `expandedSize`), snapped
   * to supported, then the widest supported that fits if that's too wide
   * (or than its area).
   */
  size: GridSize;
  /**
   * What it would be, a size asked for now (e.g. expanded): as its own
   * is (snapped, fitted to the columns and its area), as it is now; its
   * effective size, the same as another's, a change to it that changes
   * nothing (e.g. a button for it hidden).
   */
  sizeOf: (size: GridSize) => GridSizeFit;
  /** The sizes it can be, in order (smallest area first). */
  supportedSizes: readonly GridSize[];
};

/** An item's area and its state (see `useGridArea`). */
export type GridAreaState = {
  /**
   * Whether it's narrower than chosen (`requested`), to fit the columns
   * (its tile's own fit: `GridItemState.isFitted`).
   */
  isFitted: boolean;
  /** Whether its tile can be moved within it. */
  movable: boolean;
  /** Where its tile sits in it. */
  placement: GridPlacement;
  /** Asks for another placement (its `onPlacementChange`, or its own). */
  requestPlacement: (placement: GridPlacement) => void;
  /** Asks for another size (its `onSizeChange`, or its own). */
  requestSize: (size: GridSize, details?: GridSizeChangeDetails) => void;
  /** Its size as the user chose it. */
  requested: GridSize;
  /**
   * Its effective size: the room its item takes in the layout (snapped,
   * fitted to the columns; at least its tile's).
   */
  size: GridSize;
  /**
   * What it would be, a size asked for now: as its own is (snapped,
   * fitted to the columns; at least its tile's), its tile as it is now
   * (see `GridItemState.sizeOf`).
   */
  sizeOf: (size: GridSize) => GridSizeFit;
  /** The sizes it can be, in order (smallest area first). */
  supportedSizes: readonly GridSize[];
};

/**
 * An item's tile changing its box (see `useGridItemLayout`): its size, its
 * place in its area, opened above the page or closed.
 */
export type GridItemLayoutChange = {
  /** How long its tile takes to get there, in milliseconds. */
  duration: number;
  /** Its tile's easing (a CSS easing function). */
  easing: string;
  /**
   * How far its tile has got, in milliseconds (0 until its first frame is
   * drawn, and before the change; `duration` once it's there): what moves
   * with it can follow it, frame by frame, however long a frame takes.
   */
  elapsed: () => number;
  /** Its tile's box on screen before the change. */
  from: DOMRectReadOnly;
  /** Whether it's open above the page, after the change. */
  open: boolean;
  /** Whether it was open above the page, before the change. */
  previousOpen: boolean;
  /** Its effective size before the change. */
  previousSize: GridSize;
  /** Its effective size, after the change. */
  size: GridSize;
  /** Its tile's box on screen once it's there. */
  to: DOMRectReadOnly;
};

/** What to call as an item's tile changes its box (see `useGridItemLayout`). */
export type GridItemLayoutHandlers = {
  /**
   * Called after the change is in the DOM: what's in the tile laid out at
   * its new size already, the tile still drawn at its old box (`from`),
   * about to move and resize to its new one (`to`) over `duration`. E.g.
   * where an animation library moves what's in it from where it was.
   */
  onAfterChange?: (change: GridItemLayoutChange) => void;
  /**
   * Called before the change reaches the DOM: what's in the tile still laid
   * out as it was (`to` is `from` then). E.g. where an animation library
   * records where things are.
   */
  onBeforeChange?: (change: GridItemLayoutChange) => void;
};
