import { checkboxRootRows, radioRootRows } from '../checkbox/docs.js';
import {
  code,
  PropRow,
  renderRows,
  secondaryClickRow,
  union,
} from '../utils/props-table.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

const cursorRow = (defaultValue: PropRow[2]): PropRow => [
  'cursor',
  'string (a CSS cursor)',
  defaultValue,
  'The cursor (where the pointer hovers).',
];

const childrenRow = (
  defaultValue: PropRow[2],
  description: string,
): PropRow => ['children', 'ReactNode', defaultValue, description];

export const listRootRows: readonly PropRow[] = [
  [
    'editing',
    'boolean',
    'always shown',
    <>
      In edit mode (UIKit <code>isEditing</code>): its rows’ edit controls (
      <code>Checkbox</code>, <code>Radio</code>, <code>EditButton</code>) and
      grabbers are shown, sliding in from the rows’ edges as it changes; out of
      it (<code>false</code>), they’re collapsed and hidden.
    </>,
  ],
  [
    'listStyle',
    union('insetGrouped', 'grouped', 'plain', 'sidebar'),
    code(union('insetGrouped')),
    <>
      UIKit <code>UITableView.Style</code>: groups inset 16px with 24px corners
      (<code>insetGrouped</code>), full width (<code>grouped</code>), plain rows
      with sticky section titles (<code>plain</code>), or a sidebar’s capsule
      rows (<code>sidebar</code>).
    </>,
  ],
  [
    'outline',
    'boolean',
    code('false'),
    'Outlines its groups: hairlines above and below, or a border around inset ones.',
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const listSectionRows: readonly PropRow[] = renderRows(
  'section',
  'HTMLElement',
);

export const listHeaderRows: readonly PropRow[] = [
  [
    'prominence',
    union('prominent', 'nested', 'extraProminent'),
    code(union('prominent')),
    'The header’s type (Figma “Header”): nested headers of plain lists are section titles (sticky).',
  ],
  cursorRow(
    <>
      <code>pointer</code> (when it’s a button, e.g. a Base UI{' '}
      <code>Collapsible.Trigger</code>)
    </>,
  ),
  ...renderRows('div', 'HTMLElement'),
];

export const listGroupRows: readonly PropRow[] = [
  [
    'onReorder',
    '(from: number, to: number) => void',
    undefined,
    <>
      Called when a row is moved by its <code>Grabber</code> from one index to
      another (among the group’s rows); the app reorders them.
    </>,
  ],
  ...renderRows('ul', 'HTMLElement'),
];

export const listItemRows: readonly PropRow[] = [
  [
    'selected',
    'boolean',
    code('false'),
    <>
      Selected (e.g. a sidebar’s current section): on a fill, with{' '}
      <code>aria-current</code>.
    </>,
  ],
  [
    'level',
    'number',
    undefined,
    'Its level in a hierarchy (indented 20px per level; e.g. a sidebar).',
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      A click on the row: e.g. <code>forwardClick(selector)</code>, passing it
      on to a control in the row (a switch, a checkbox), as iOS rows do.
    </>,
  ],
  secondaryClickRow,
  cursorRow(
    <>
      <code>pointer</code> with a click handler
    </>,
  ),
  childrenRow(
    undefined,
    'The row’s parts: an edit control, an image, a title (and a subtitle, text), trailing parts (details, accessories, controls), swipe actions.',
  ),
  ...renderRows('li', 'HTMLElement'),
];

export const listExpandableRows: readonly PropRow[] = [
  [
    'open',
    'boolean',
    <>
      its <code>ExpandableRoot</code>’s state, or <code>false</code>
    </>,
    'Shown; changing, its height and padding transition (300ms). Closed, it’s inert.',
  ],
  [
    'id',
    'string',
    <>
      its <code>ExpandableRoot</code>’s (its trigger’s{' '}
      <code>aria-controls</code>)
    </>,
    'The row’s id.',
  ],
  ...listItemRows,
];

export const listExpandableRootRows: readonly PropRow[] = [
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Initially open (uncontrolled: its <code>ExpandableTrigger</code> toggles
      it).
    </>,
  ],
  [
    'open',
    'boolean',
    undefined,
    <>
      Open (controlled, with <code>onOpenChange</code>).
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, event: MouseEvent<HTMLElement>) => void',
    undefined,
    'Called when its trigger opens or closes it.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The row with its trigger, and the <code>Expandable</code>. It renders no
      element, so they stay its group’s children.
    </>,
  ],
];

export const listExpandableTriggerRows: readonly PropRow[] = [
  [
    'render',
    'ReactElement | ((props) => ReactElement)',
    undefined,
    <>
      Rendered by a row’s title (
      <code>{'<List.Title render={<List.ExpandableTrigger />}>'}</code>), the
      whole row toggles it.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Called before it toggles its row (<code>event.preventDefault()</code>{' '}
      keeps it as it is).
    </>,
  ],
  secondaryClickRow,
  ...renderRows('button', 'HTMLElement').filter(([name]) => name !== 'render'),
];

export const listFooterRows: readonly PropRow[] = renderRows(
  'div',
  'HTMLElement',
);

export const listBlockRows: readonly PropRow[] = [
  ['strong', 'boolean', code('false'), 'On the rows’ background (as a group).'],
  ...renderRows('div', 'HTMLElement'),
];

export const listTitleRows: readonly PropRow[] = [
  [
    'render',
    'ReactElement | ((props) => ReactElement)',
    undefined,
    <>
      As a link or button (e.g. <code>{'<button />'}</code>), the title makes
      the row pressable: its hit area covers the row, beneath its trailing
      controls. In a header, a heading (e.g. <code>{'<h3 />'}</code>).
    </>,
  ],
  ...renderRows('span', 'HTMLElement').filter(([name]) => name !== 'render'),
];

export const listSubtitleRows: readonly PropRow[] = renderRows(
  'span',
  'HTMLElement',
);

export const listSupertitleRows: readonly PropRow[] = renderRows(
  'span',
  'HTMLElement',
);

export const listTextRows: readonly PropRow[] = [
  ['lines', 'number', code('2'), 'Lines shown at most, ellipsized.'],
  ...renderRows('span', 'HTMLElement'),
];

export const listDetailRows: readonly PropRow[] = renderRows(
  'span',
  'HTMLElement',
);

export const listImageRows: readonly PropRow[] = [
  [
    'variant',
    union('symbol', 'rounded', 'circular', 'fill'),
    code(union('symbol')),
    <>
      The image’s frame (Figma “_Images” Type): a symbol alone, a rounded or
      circular frame (e.g. a symbol on a <code>backgroundColor</code>), or a
      square filled by an <code>img</code>, <code>video</code> or{' '}
      <code>canvas</code>.
    </>,
  ],
  ...renderRows('span', 'HTMLElement'),
];

export const listAccessoryRows: readonly PropRow[] = [
  [
    'render',
    'ReactElement | ((props) => ReactElement)',
    undefined,
    <>
      As a button (<code>{'<button type="button" />'}</code>), the symbol is
      pressable on its own (e.g. an info button); name it (
      <code>aria-label</code>).
    </>,
  ],
  ...renderRows('span', 'HTMLElement').filter(([name]) => name !== 'render'),
];

export const listCheckmarkRows: readonly PropRow[] = [
  childrenRow('a checkmark', 'What it shows: by default, the checkmark.'),
  ...renderRows('span', 'HTMLElement'),
];

export const listDrillInRows: readonly PropRow[] = [
  childrenRow(
    'a chevron',
    'What it shows: by default, the chevron. Hidden from assistive technology.',
  ),
  ...renderRows('span', 'HTMLElement'),
];

export const listDisclosureRows: readonly PropRow[] = [
  childrenRow(
    'a chevron',
    'What it shows: by default, the chevron, turned down while open (in an open Base UI Collapsible’s trigger). Hidden from assistive technology.',
  ),
  ...renderRows('span', 'HTMLElement'),
];

export const listGrabberRows: readonly PropRow[] = [
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, e.g. “Reorder Mercury”.',
  ],
  [
    'tabIndex',
    'number',
    code('0'),
    'Focusable: arrow keys move its row by one.',
  ],
  childrenRow('three lines', 'What it shows: by default, three lines.'),
  ...renderRows('span', 'HTMLElement'),
];

export const listActionRows: readonly PropRow[] = [
  secondaryClickRow,
  ...renderRows('button', 'HTMLElement'),
];

export const listButtonRows: readonly PropRow[] = [
  ['destructive', 'boolean', code('false'), 'In the destructive color (red).'],
  secondaryClickRow,
  ...renderRows('button', 'HTMLElement'),
];

export const listCheckboxRows: readonly PropRow[] = checkboxRootRows;

export const listRadioRows: readonly PropRow[] = radioRootRows;

export const listEditButtonRows: readonly PropRow[] = [
  [
    'editingStyle',
    union('delete', 'insert'),
    code(union('delete')),
    <>
      UIKit <code>UITableViewCell.EditingStyle</code>: a red minus or a green
      plus.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Deleting, a click opens the row’s trailing swipe actions, unless the
      handler prevents it (<code>event.preventDefault()</code>).
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, e.g. “Delete Mercury”.',
  ],
  secondaryClickRow,
  childrenRow('a minus (insert: a plus)', 'What it shows.'),
  ...renderRows('button', 'HTMLElement'),
];

export const listSwipeActionsRows: readonly PropRow[] = [
  [
    'side',
    union('inline-end', 'inline-start'),
    code(union('inline-end')),
    'The row’s side the actions are revealed on.',
  ],
  [
    'overswipe',
    'boolean',
    code('false'),
    'Swiping on past the actions stretches the outermost one up to the others (following the row), and, past 304px, triggers it on release (UIKit performsFirstActionWithFullSwipe).',
  ],
  [
    'onOverswipe',
    '() => void',
    undefined,
    <>
      Called when released swiped on past the actions (overswiped), instead of
      triggering the outermost action; enables <code>overswipe</code>.
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const listSwipeActionRows: readonly PropRow[] = [
  [
    'label',
    'string',
    undefined,
    <>
      The action’s name (required): its accessible name (see{' '}
      <code>showLabel</code>).
    </>,
  ],
  [
    'showLabel',
    'boolean',
    code('false'),
    <>
      Shows the label below the shape. It needs room: for multi-line rows (
      <code>Text</code>).
    </>,
  ],
  [
    'shape',
    union('circle', 'roundedRectangle'),
    'a 44px circle, or a capsule around wider content',
    'The action’s shape; or a rounded rectangle (12px corners) as high as the row, at least 60px wide.',
  ],
  [
    'tint',
    'string (a CSS color)',
    <>
      <code>systemGray</code>
    </>,
    'Background color.',
  ],
  [
    'textColor',
    'string (a CSS color)',
    'white',
    <>
      Text color, e.g. for a light <code>tint</code>.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    'Its action; the actions close after it.',
  ],
  secondaryClickRow,
  childrenRow(undefined, 'A symbol, or short text (in capitals).'),
  ...renderRows('button', 'HTMLElement'),
];

export const listIndexRows: readonly PropRow[] = [
  [
    'size',
    union('compact', 'regular'),
    code(union('compact')),
    'UIKit size class: compact (iPhone) or regular (iPad).',
  ],
  [
    'aria-label',
    'string',
    undefined,
    <>
      Its accessible name (it’s a <code>nav</code>), e.g. “Index”.
    </>,
  ],
  ...renderRows('nav', 'HTMLElement'),
];

export const listIndexItemRows: readonly PropRow[] = [
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    'Its letter chosen, by a press or by scrubbing over the index: the app scrolls to the section.',
  ],
  secondaryClickRow,
  ...renderRows('button', 'HTMLElement'),
];
