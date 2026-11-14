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
    'Edit mode. Cells with a reorder handle can be dragged (after holding a touch for a moment) and resized by their handles. Taps on what’s in them are held back, except on their edit controls. Spacers and breaks are outlined, and each section’s rows are drawn as bands.',
  ],
  [
    'dense',
    'boolean',
    code('false'),
    'Later items fill holes that earlier ones left, instead of each item going after the one before it (CSS grid’s dense placement). Always off in edit mode, so what’s moved stays where it’s put.',
  ],
  ['gap', 'number', code('12'), 'The gap between cells, in px.'],
  [
    'unitSize',
    'number',
    code('110'),
    'The size of a unit to aim for, in px. The grid gets as many columns as fit its width, and the units stretch to fill it.',
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
    'The largest a unit stretches to, in px. Above it, the grid adds a column.',
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
      What it shows, filling it, for example a card. A{' '}
      <PartLink part="Grid.ResizeHandle" /> and a{' '}
      <PartLink part="Grid.RemoveButton" /> go in here too. What’s in it can
      read its size with <PartLink part="useGridItem" />.
    </>,
  ],
  [
    'defaultSize',
    'GridSize',
    code(union('1x1')),
    'Its initial size (uncontrolled): columns by rows, each 1 to 3.',
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
    'The sizes its content can be, usually a constant of the card component. Its size snaps to them (the same shape first, then the closest area), and then to what fits the columns.',
  ],
  onSizeChangeRow('by its resize handle'),
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
  ['defaultRows', '1 | 2 | 3', code('1'), 'Its initial rows (uncontrolled).'],
  [
    'rows',
    '1 | 2 | 3',
    undefined,
    'Its rows (controlled): the rest of its row and the rows below it are kept empty, as many rows in all. What follows starts below them.',
  ],
  [
    'onRowsChange',
    '(rows: 1 | 2 | 3, details: GridSizeChangeDetails) => void',
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
      Usually nothing: the sign in its middle comes from the{' '}
      <code>--uikit-grid-spawn-sign</code> mask. A{' '}
      <PartLink part="Grid.ResizeHandle" /> can go in here.
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

export const gridResizeHandleRows: readonly PropRow[] = [
  [
    'onClick',
    '(event) => void',
    undefined,
    <>
      Called when it’s pressed. Pressed with a key, it steps to the next size
      that fits the columns, unless this calls{' '}
      <code>event.preventDefault()</code>. Pressed with a pointer and released
      without dragging, nothing changes.
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
    'What removing does: the app takes the cell out of its data.',
  ],
  [
    'aria-label',
    'string',
    code(union('Remove')),
    'Its accessible name. Name what it removes, for example “Remove Lamp”.',
  ],
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

export const gridUseGridItemRows: readonly PropRow[] = [
  [
    'size',
    'GridSize',
    undefined,
    'Its size as shown: as requested, snapped to what it supports, and fitted to the columns. Use it to pick a level of detail.',
  ],
  ['requested', 'GridSize', undefined, 'Its size as the user chose it.'],
  [
    'isFitted',
    'boolean',
    undefined,
    'Whether it’s shown smaller than requested, to fit the columns.',
  ],
  [
    'supportedSizes',
    'GridSize[]',
    undefined,
    'The sizes it can be, smallest area first.',
  ],
  ['editing', 'boolean', undefined, 'Whether its grid is in edit mode.'],
  [
    'requestSize',
    '(size: GridSize, details?: GridSizeChangeDetails) => void',
    undefined,
    'Asks for another size, as its resize handle does (for example from a menu).',
  ],
];
