import {
  code,
  elementRows,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

/** A reorder handle, or several, as a cell's or a range's. */
const handleType = 'GridReorderHandle | GridReorderHandle[]';

/** The props every cell (an item, spacer, break, spawn) has for moving. */
const cellRows: readonly PropRow[] = [
  [
    'reorderHandle',
    handleType,
    undefined,
    <>
      The handle that moves it in edit mode (see{' '}
      <PartLink part="Grid.createReorderHandle" />
      ). It can be dragged, or moved with Alt and an arrow key, to wherever the
      handle is a target. With several, the first one that’s a target there is
      reported. Without one, it stays where it is.
    </>,
  ],
  [
    'dropName',
    'string',
    undefined,
    'Its name in reordering: the name a change reports it by, and the name of the cell before or after a gap. Use the key you store it under.',
  ],
];

/** The props of a range of cells: what's dropped among them. */
const rangeRows: readonly PropRow[] = [
  [
    'reorderHandle',
    handleType,
    undefined,
    'The handles whose cells can be dropped before, between and after its cells.',
  ],
  [
    'dropName',
    'string',
    undefined,
    'Its name, as the target of a change (the list a dropped cell goes into).',
  ],
];

/** A size change's callback. */
const onSizeChangeRow = (where: string): PropRow => [
  'onSizeChange',
  '(size: GridSize, details: GridSizeChangeDetails) => void',
  undefined,
  <>
    Called when its size is changed {where}. The details list the spacers and
    breaks it grew over (their <code>dropName</code>s), which the app removes.
  </>,
];

export const gridRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its cells in order (
      <PartLink part="Grid.Item" />, <PartLink part="Grid.Spacer" />,{' '}
      <PartLink part="Grid.Break" />, <PartLink part="Grid.Spawn" />
      ), or its sections (<PartLink part="Grid.Section" />
      ). Their order is the only thing that decides where they go.
    </>,
  ],
  [
    'editing',
    'boolean',
    code('false'),
    'Edit mode. Cells with a reorder handle can be dragged (after holding a touch for a moment) and resized by their handles. Taps on what’s in them are held back, except on their edit controls. Spacers and breaks are outlined, each section’s rows are drawn as bands, and a narrow end-of-line column follows the last column (see --uikit-grid-end-width).',
  ],
  [
    'dense',
    'boolean',
    code('false'),
    'Later items fill holes that earlier ones left, instead of each item going after the one before it (CSS grid’s dense placement). Always off in edit mode, so what’s moved stays where it’s put.',
  ],
  ['gap', 'number', code('12'), 'The gap between cells, in px.'],
  [
    'minColumns',
    'number',
    code('3'),
    'The fewest columns it lays out, however narrow it is: its units shrink below unitMin then. Every item must support a size this narrow, so a layout never breaks. Wider sizes give way to the widest that fits.',
  ],
  [
    'maxTileRows',
    'number',
    code('3'),
    'The most rows a tile has: taller sizes aren’t shown or offered, and no break keeps more rows empty. Every item must support a size within minColumns and this.',
  ],
  [
    'unitSize',
    'number',
    code('110'),
    'The size of a unit to aim for, in px. The grid gets the columns whose units come closest to it, and the units stretch to fill the width. Outside unitMin and unitMax, it moves that bound.',
  ],
  [
    'unitMin',
    'number',
    code('100'),
    'The smallest a unit shrinks to, in px. Below it, the grid drops a column.',
  ],
  [
    'unitMax',
    'number',
    code('130'),
    'The largest a unit stretches to, in px. Above it, the grid adds a column. If no column count fits between unitMin and unitMax, the grid takes the one that comes closest.',
  ],
  ...rangeRows,
  ...elementRows('div', 'HTMLDivElement'),
];

export const gridSectionRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      An optional <PartLink part="Grid.Header" /> first, then its cells in
      order.
    </>,
  ],
  [
    'dense',
    'boolean',
    'the root’s',
    <>
      Later items fill earlier holes, for this section only (see the root’s{' '}
      <code>dense</code>). Always off in edit mode.
    </>,
  ],
  ...rangeRows,
  ...elementRows('section', 'HTMLElement'),
];

export const gridHeaderRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'The section’s title, or anything else that goes across its columns above its cells.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const gridDropGroupRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Some of a section’s cells. It renders no element, so they stay in the section’s grid.',
  ],
  ...rangeRows,
];

export const gridItemRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What it shows, filling its tile, for example a card. Its tile’s controls
      go in here too: a <PartLink part="Grid.ResizeHandle" />, a{' '}
      <PartLink part="Grid.RemoveButton" /> and a{' '}
      <PartLink part="Grid.AreaButton" />. So does a{' '}
      <PartLink part="Grid.Area" />, for room around the tile. What’s in it can
      read its size with <PartLink part="useGridItem" />.
    </>,
  ],
  [
    'defaultSize',
    'GridSize',
    code(union('1x1')),
    'Its initial size (uncontrolled): columns by rows (* for the full width), up to the grid’s columns and maxTileRows.',
  ],
  [
    'size',
    'GridSize',
    undefined,
    'Its size (controlled), as the user chose it. Store it with the item’s place in your data.',
  ],
  [
    'supportedSizes',
    'GridSize[]',
    'every size',
    'The sizes its content can be, usually a constant of the card component. Its size snaps to them (the same shape first, then the closest area). If that’s wider than the columns, the widest that fits is shown, with the nearest rows. One of them must fit the grid’s minColumns.',
  ],
  onSizeChangeRow('by its resize handle'),
  [
    'expanded',
    'boolean',
    undefined,
    'Whether it’s expanded in place (controlled): shown at its expandedSize instead of its size, which stays as it is (stored), the grid reflowing around it. Edit mode makes it small again, as sizes are chosen there. Without an expandedSize, it never is.',
  ],
  [
    'defaultExpanded',
    'boolean',
    code('false'),
    'Whether it’s expanded initially (uncontrolled).',
  ],
  [
    'onExpandedChange',
    '(expanded: boolean, details: GridExpandedChangeDetails) => void',
    undefined,
    <>
      Called as it’s expanded or made small again. The reason (
      <code>details.reason</code>) is <code>edit</code> when edit mode starts,
      or <code>none</code> when the app asked, through{' '}
      <PartLink part="useGridItem" />
      ’s <code>setExpanded</code> (for example a card’s{' '}
      <PartLink
        component="card"
        part="Card.ExpandButton"
      />
      ).
    </>,
  ],
  [
    'expandedSize',
    'GridSize',
    undefined,
    'Its size expanded, snapped and fitted as its size is. It can be smaller than its size; expanding then makes it smaller.',
  ],
  [
    'open',
    'boolean',
    undefined,
    'Whether it’s open above the page (controlled): its tile in the middle of the screen at openSize, over the dimmed page, while a stand-in keeps its place in the grid. It’s a modal dialog until it’s closed, and never open in edit mode.',
  ],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    'Whether it’s open initially (uncontrolled).',
  ],
  [
    'onOpenChange',
    '(open: boolean, details: GridOpenChangeDetails) => void',
    undefined,
    <>
      Called as it’s opened or closed. The reason (<code>details.reason</code>)
      is <code>outside-press</code> for a press beside it,{' '}
      <code>escape-key</code>, <code>edit</code> when edit mode starts, or{' '}
      <code>none</code> when the app asked, through{' '}
      <PartLink part="useGridItem" />
      ’s <code>setOpen</code>.
    </>,
  ],
  [
    'openSize',
    'GridOpenSize',
    code(union('4x3')),
    'Its size while it’s open, columns by rows, fitted to the screen with a margin. Each is a number of the grid’s units, * (the grid’s columns, or its maxTileRows) or + (its content’s own size: as wide as it lays out, as tall as it is at that width, following it while it’s open, and never smaller than the item’s smallest supported size). Given, it opens (see useGridItem’s canOpen), for example from a card’s last row of rows.',
  ],
  [
    'openLabel',
    'string',
    undefined,
    'Its name while it’s open (a dialog’s), for example its card’s title.',
  ],
  ...cellRows,
  ...elementRows('div', 'HTMLDivElement'),
];

export const gridSpacerRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its edit controls, shown only in edit mode, for example a{' '}
      <PartLink part="Grid.ResizeHandle" /> and a{' '}
      <PartLink part="Grid.RemoveButton" />.
    </>,
  ],
  [
    'defaultSize',
    'GridSize',
    code(union('1x1')),
    'Its initial size (uncontrolled).',
  ],
  [
    'size',
    'GridSize',
    undefined,
    'Its size (controlled): a hole that big, fitted to the columns.',
  ],
  onSizeChangeRow('by a resize handle in it'),
  ...cellRows,
  ...elementRows('div', 'HTMLDivElement'),
];

export const gridBreakRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its edit controls, shown only in edit mode, for example a{' '}
      <PartLink part="Grid.ResizeHandle" /> (for its rows) and a{' '}
      <PartLink part="Grid.RemoveButton" />.
    </>,
  ],
  ['defaultRows', 'number', code('1'), 'Its initial rows (uncontrolled).'],
  [
    'rows',
    'number',
    undefined,
    'Its rows (controlled): the rest of its row and the rows below it are kept empty, as many rows in all. What follows starts below them.',
  ],
  [
    'onRowsChange',
    '(rows: number, details: GridSizeChangeDetails) => void',
    undefined,
    'Called when its rows are changed by a resize handle in it. The details list the breaks next to it and anything it grew over, which the app removes.',
  ],
  ...cellRows,
  ...elementRows('div', 'HTMLDivElement'),
];

export const gridSpawnRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its controls, for example a <PartLink part="Grid.ResizeHandle" />, and a{' '}
      <PartLink part="Grid.Area" />. They go beside its button, not in it. The
      sign in its middle comes from the <code>--uikit-grid-spawn-sign</code>{' '}
      mask.
    </>,
  ],
  [
    'defaultSize',
    'GridSize',
    code(union('1x1')),
    'Its initial size (uncontrolled).',
  ],
  [
    'size',
    'GridSize',
    undefined,
    'Its size (controlled), fitted to the columns.',
  ],
  onSizeChangeRow('by a resize handle in it'),
  [
    'reorderHandle',
    handleType,
    undefined,
    'Makes it movable in edit mode, like an item. Without one it stays where it is, and isn’t counted among its section’s cells when something is dropped.',
  ],
  cellRows[1] as PropRow,
  [
    'aria-label',
    'string',
    code(union('Add')),
    'Its accessible name. Name what it adds, for example “Add a device”.',
  ],
  ['onClick', '(event) => void', undefined, 'What adding does: the app’s.'],
  ...renderRows('button', 'HTMLButtonElement'),
];

export const gridAreaRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its controls, in its corners: a <PartLink part="Grid.ResizeHandle" />{' '}
      resizes the area, a <PartLink part="Grid.RemoveButton" /> removes it (the
      app stops rendering the area).
    </>,
  ],
  ['defaultSize', 'GridSize', undefined, 'Its initial size (uncontrolled).'],
  [
    'size',
    'GridSize',
    undefined,
    'Its size (controlled): the room its item takes in the layout, at least its tile’s size. The rest is hatched in edit mode.',
  ],
  [
    'supportedSizes',
    'GridSize[]',
    'every size',
    'The sizes it can be. Its size snaps to them and fits the columns first. Then its tile fits in it: the widest of the tile’s supported sizes that does.',
  ],
  onSizeChangeRow('by a resize handle in it'),
  [
    'defaultPlacement',
    'GridPlacement',
    code(union('center')),
    'Its tile’s initial placement (uncontrolled).',
  ],
  [
    'placement',
    union(
      'center',
      'top-leading',
      'top-trailing',
      'bottom-leading',
      'bottom-trailing',
    ),
    undefined,
    'Where its tile sits in it (controlled). In the middle, truly centered even off the unit lines, its size still in whole units. Or in a corner, the tile’s corner on the area’s; in edit mode, 24px in from it (--uikit-grid-corner-inset).',
  ],
  [
    'onPlacementChange',
    '(placement: GridPlacement) => void',
    undefined,
    'Called when its tile’s placement is changed: dragged in it, or moved with the arrow keys (see movable).',
  ],
  [
    'movable',
    'boolean',
    code('false'),
    'Its tile can be moved within it in edit mode, shown by crosshairs in the tile’s top trailing corner: held and dragged to the middle or a corner, or stepped there with the arrow keys while it has focus. A hold on the hatched room around it moves the whole item instead.',
  ],
];

export const gridCornerButtonRows: readonly PropRow[] = [
  [
    'icon',
    'SymbolIcon',
    undefined,
    <>
      Its icon: one of <PartLink part="gridIcons" />, or the app’s own (for
      example an SF Symbol), drawn at the same place and size.
    </>,
  ],
  [
    'corner',
    'GridCorner',
    code(union('bottom-trailing')),
    'The corner it’s in: top-leading, top-trailing, bottom-leading or bottom-trailing. Its icon sits 16.5px in from both of that corner’s edges.',
  ],
  [
    'visible',
    'boolean',
    code('true'),
    'Whether it’s shown. Hidden, it fades out and can’t be pressed or focused.',
  ],
  [
    'whileEditing',
    union('hide', 'show', 'stay'),
    code(union('stay')),
    'In edit mode: hidden then (hide), shown only then (show, for example a card’s settings), or shown either way (stay). Shown in edit mode, it’s in the color of the grid’s own buttons. A tap on it is its own, and a drag from it moves its cell, as from the remove button.',
  ],
  [
    'mirrored',
    'boolean',
    code('false'),
    'Whether its icon is flipped in a right-to-left layout. Set it for an icon that points somewhere, such as the expand triangle.',
  ],
  ['onClick', '(event) => void', undefined, 'What a press does.'],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example “Show details”. It has no default.',
  ],
  ...renderRows('button', 'HTMLButtonElement'),
];

export const gridIconsRows: readonly PropRow[] = [
  [
    'remove',
    'SymbolIcon',
    undefined,
    <>
      An x. <PartLink part="Grid.RemoveButton" />
      ’s.
    </>,
  ],
  [
    'move',
    'SymbolIcon',
    undefined,
    'Crosshairs: four short lines around an empty middle, on a tile that can be moved.',
  ],
  [
    'addArea',
    'SymbolIcon',
    undefined,
    <>
      Three diagonal lines, the hatching in small.{' '}
      <PartLink part="Grid.AreaButton" />
      ’s.
    </>,
  ],
  [
    'resize',
    'SymbolIcon',
    undefined,
    <>
      The arc alone, for any size. <PartLink part="Grid.ResizeHandle" />
      ’s, as are the next three. Drawn for the bottom trailing corner.
    </>,
  ],
  [
    'resizeGrow',
    'SymbolIcon',
    undefined,
    'The arc with a chevron pointing to the bottom trailing corner: it can only grow.',
  ],
  [
    'resizeShrink',
    'SymbolIcon',
    undefined,
    'The arc with a chevron pointing to the top leading corner: it can only shrink.',
  ],
  [
    'resizeBoth',
    'SymbolIcon',
    undefined,
    'The arc with chevrons both ways: it has sizes either side.',
  ],
  [
    'expand',
    'SymbolIcon',
    undefined,
    'A filled triangle pointing to the bottom trailing corner: a press makes the tile larger in place.',
  ],
  [
    'collapse',
    'SymbolIcon',
    undefined,
    'The same triangle pointing to the top leading corner: on an expanded tile, a press makes it small again.',
  ],
  [
    'open',
    'SymbolIcon',
    undefined,
    'A filled rounded square: a press opens the tile above the page.',
  ],
  [
    'close',
    'SymbolIcon',
    undefined,
    'An x, as remove’s: a press closes the tile opened above the page.',
  ],
  [
    'drillIn',
    'SymbolIcon',
    undefined,
    'A ring: a press goes to a page of its own.',
  ],
];

export const gridResizeHandleRows: readonly PropRow[] = [
  [
    'onClick',
    '(event) => void',
    undefined,
    <>
      Called when it’s pressed. Pressed with a key, it steps to the next size
      that fits the columns, unless this calls{' '}
      <code>event.preventDefault()</code>. A quick tap steps to the next size
      too. Held and released without dragging, nothing changes.
    </>,
  ],
  ['aria-label', 'string', code(union('Resize')), 'Its accessible name.'],
  ...renderRows('button', 'HTMLButtonElement'),
];

export const gridRemoveButtonRows: readonly PropRow[] = [
  [
    'onClick',
    '(event) => void',
    undefined,
    <>
      What removing does: the app takes the cell out of its data. In a{' '}
      <PartLink part="Grid.Area" />, the area: the app stops rendering it.
    </>,
  ],
  [
    'aria-label',
    'string',
    code(union('Remove')),
    'Its accessible name. Name what it removes, for example “Remove Lamp”.',
  ],
  ...renderRows('button', 'HTMLButtonElement'),
];

export const gridAreaButtonRows: readonly PropRow[] = [
  [
    'onAdd',
    '(size: GridSize) => void',
    undefined,
    <>
      Called with the area to add: one column wider than the tile, as tall. The
      app renders a <PartLink part="Grid.Area" /> of that size in the item.
    </>,
  ],
  [
    'supportedSizes',
    'GridSize[]',
    'every size',
    'The sizes the area could be: if the one column wider isn’t among them, the nearest larger one is suggested, and with none, the button doesn’t show.',
  ],
  [
    'onClick',
    '(event) => void',
    undefined,
    <>
      Called when it’s pressed, before <code>onAdd</code>, which isn’t called if
      this calls <code>event.preventDefault()</code>.
    </>,
  ],
  ['aria-label', 'string', code(union('Add area')), 'Its accessible name.'],
  ...renderRows('button', 'HTMLButtonElement'),
];

export const gridCreateReorderHandleRows: readonly PropRow[] = [
  [
    'onReorder',
    '(change: GridReorderChange, details: GridReorderEventDetails) => void',
    undefined,
    <>
      Called when a cell is dropped somewhere else, or moved by keyboard. The
      app moves it in its data, for example with{' '}
      <PartLink part="Grid.reorder" />. The details say whether it was{' '}
      <code>drag</code> or <code>keyboard</code>.
    </>,
  ],
  [
    'spacers',
    'boolean',
    code('false'),
    'A cell dropped on an empty unit asks for spacers in front of it (the change’s target.addBefore, or addAfter), so it lands right there and nothing else moves.',
  ],
  [
    'breaks',
    'boolean',
    code('false'),
    'A cell dropped where only a break gets it to asks for one (target.addBefore, addAfter), or for a break’s rows to change (target.resize).',
  ],
];

export const gridReorderRows: readonly PropRow[] = [
  [
    'data',
    'T[] | Record<string, T[]>',
    undefined,
    'The app’s cells: one list, or lists by their section’s (or drop group’s) dropName.',
  ],
  ['change', 'GridReorderChange', undefined, 'The change onReorder got.'],
  [
    'nameOf',
    '(cell: T) => string',
    undefined,
    'A cell’s name, as its dropName.',
  ],
  [
    'cells',
    'GridReorderCells<T>',
    undefined,
    'How to make the cells a change asks for: breakOf(rows), spacerOf(size), and withRows(cell, rows) for a break with other rows. Without them, those additions are left out.',
  ],
];

export const gridUseGridItemLayoutRows: readonly PropRow[] = [
  [
    'onBeforeChange',
    '(change: GridItemLayoutChange) => void',
    undefined,
    'Called before the change reaches the page: what’s in the tile is still laid out as it was. The place to record where things are. Its change’s to is its from.',
  ],
  [
    'onAfterChange',
    '(change: GridItemLayoutChange) => void',
    undefined,
    'Called once the change is in the page: what’s in the tile is laid out at its new size, and the tile is still drawn at its old box. The place to move things from where they were.',
  ],
];

export const gridItemLayoutChangeRows: readonly PropRow[] = [
  ['from', 'DOMRectReadOnly', undefined, 'The tile’s box before the change.'],
  ['to', 'DOMRectReadOnly', undefined, 'The tile’s box once it’s there.'],
  [
    'duration',
    'number',
    undefined,
    'How long the tile takes to get there, in milliseconds.',
  ],
  ['easing', 'string', undefined, 'The tile’s easing, a CSS easing function.'],
  [
    'elapsed',
    '() => number',
    undefined,
    'How far the tile has got, in milliseconds: 0 until its first frame is drawn. Read it each frame to keep what moves in step with the tile, however long the first frame takes.',
  ],
  ['size', 'GridSize', undefined, 'The item’s size after the change.'],
  ['previousSize', 'GridSize', undefined, 'Its size before the change.'],
  [
    'open',
    'boolean',
    undefined,
    'Whether it’s open above the page after the change.',
  ],
  ['previousOpen', 'boolean', undefined, 'Whether it was open before.'],
];

export const gridUseGridItemRows: readonly PropRow[] = [
  [
    'size',
    'GridSize',
    undefined,
    'Its size as shown: as requested, snapped to what it supports, and fitted to the columns (and its area). Use it to pick a level of detail.',
  ],
  ['requested', 'GridSize', undefined, 'Its size as the user chose it.'],
  [
    'isFitted',
    'boolean',
    undefined,
    'Whether it’s shown smaller than requested, to fit the columns or its area. Whether the area itself was narrowed is useGridArea’s isFitted.',
  ],
  [
    'supportedSizes',
    'GridSize[]',
    undefined,
    'The sizes it can be, smallest area first.',
  ],
  ['editing', 'boolean', undefined, 'Whether its grid is in edit mode.'],
  [
    'expanded',
    'boolean',
    undefined,
    'Whether it’s expanded in place (its item’s expanded).',
  ],
  [
    'expandedSize',
    'GridSize | undefined',
    undefined,
    'Its size expanded (its item’s expandedSize), if it has one.',
  ],
  [
    'setExpanded',
    '(expanded: boolean) => void',
    undefined,
    'Expands it or makes it small again, for example from its card’s corner button.',
  ],
  [
    'canOpen',
    'boolean',
    undefined,
    'Whether it opens above the page: its item’s openSize is given.',
  ],
  [
    'open',
    'boolean',
    undefined,
    'Whether it’s open above the page (its item’s open). Use it to show more, and a button that closes it.',
  ],
  [
    'openSize',
    'GridOpenSize',
    undefined,
    'Its size open above the page (its item’s openSize). On a screen too small for it, it’s shown smaller.',
  ],
  [
    'setOpen',
    '(open: boolean) => void',
    undefined,
    'Opens or closes it above the page, for example from its card’s corner button.',
  ],
  [
    'requestSize',
    '(size: GridSize, details?: GridSizeChangeDetails) => void',
    undefined,
    'Asks for another size, as its resize handle does (for example from a menu).',
  ],
  [
    'sizeOf',
    '(size: GridSize) => GridSizeFit',
    undefined,
    'What it would be if that size were asked for now: snapped, fitted to the columns and its area, as its own size is, with isFitted. When two sizes come out the same, switching between them changes nothing, so a button for it can hide, for example an expand button with too few columns. It updates as the columns change.',
  ],
];

export const gridUseGridAreaRows: readonly PropRow[] = [
  [
    'size',
    'GridSize',
    undefined,
    'Its size as laid out: the room its item takes, snapped, fitted to the columns, at least its tile’s.',
  ],
  ['requested', 'GridSize', undefined, 'Its size as the user chose it.'],
  [
    'isFitted',
    'boolean',
    undefined,
    'Whether it’s narrower than requested, to fit the columns. Whether its tile was narrowed within it is the item’s isFitted.',
  ],
  [
    'supportedSizes',
    'GridSize[]',
    undefined,
    'The sizes it can be, smallest first.',
  ],
  ['placement', 'GridPlacement', undefined, 'Where its tile sits in it.'],
  ['movable', 'boolean', undefined, 'Whether its tile can be moved within it.'],
  [
    'requestSize',
    '(size: GridSize, details?: GridSizeChangeDetails) => void',
    undefined,
    'Asks for another size, as its resize handle does.',
  ],
  [
    'requestPlacement',
    '(placement: GridPlacement) => void',
    undefined,
    'Asks for another placement, as dragging the tile does.',
  ],
  [
    'sizeOf',
    '(size: GridSize) => GridSizeFit',
    undefined,
    'What it would be if that size were asked for now: snapped, fitted to the columns, at least its tile’s, with isFitted. As the item’s sizeOf, for the room around it.',
  ],
];
