import {
  code,
  PropRow,
  renderRows,
  secondaryClickRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { checkboxRootRows, radioRootRows } from '../checkbox/docs.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

const cursorRow = (defaultValue: PropRow[2]): PropRow => [
  'cursor',
  'string (a CSS cursor)',
  defaultValue,
  'The cursor shown while the pointer hovers it.',
];

const childrenRow = (
  defaultValue: PropRow[2],
  description: string,
): PropRow => ['children', 'ReactNode', defaultValue, description];

const editingType = union('both', 'leading', 'trailing', 'none', 'ignore');

/** An edit mode's description (Root's, Section's, Item's). */
const editingDescription = (scope: string, inherited: string | undefined) => (
  <>
    {scope} edit mode, by side. <code>leading</code> slides in the rows’ leading
    edit controls (
    <PartLink
      component="list"
      part="List.Checkbox"
    />
    ,{' '}
    <PartLink
      component="list"
      part="List.Radio"
    />
    ,{' '}
    <PartLink
      component="list"
      part="List.EditButton"
    />
    ), and <code>trailing</code> their trailing ones (
    <PartLink
      component="list"
      part="List.Grabber"
    />
    ). <code>both</code> does both. <code>none</code> means not editing, with
    everything slid out and hidden. <code>ignore</code> means not managed, with
    everything shown as it is. Rows’ slots follow by their{' '}
    <code>whileEditing</code> (for example a{' '}
    <PartLink
      component="list"
      part="List.DrillIn"
    />
    ’s slides out as a grabber’s slides in).
    {inherited ? <> {inherited}</> : null}
  </>
);

/** A row slot's `whileEditing`. */
const whileEditingRow = (): PropRow => [
  'whileEditing',
  union('show', 'hide', 'stay'),
  code(union('stay')),
  <>
    What it does in its side’s edit mode (see{' '}
    <PartLink
      component="list"
      part="List.Section"
    />{' '}
    <code>editing</code>). <code>show</code>: shown only then, sliding in (as
    for edit controls, or a{' '}
    <PartLink
      component="list"
      part="List.Grabber"
    />
    ). <code>hide</code>: sliding out then (as for a{' '}
    <PartLink
      component="list"
      part="List.DrillIn"
    />
    , making way for a grabber). <code>stay</code>: shown either way, whatever
    it holds. Parts that slide separately go in slots of their own.
  </>,
];

export const listRootRows: readonly PropRow[] = [
  [
    'editing',
    editingType,
    code(union('ignore')),
    editingDescription('Its sections’', 'Each section’s own overrides it.'),
  ],
  [
    'listStyle',
    union('insetGrouped', 'grouped', 'plain', 'sidebar'),
    code(union('insetGrouped')),
    <>
      The list’s style: groups inset 16px with 24px corners (
      <code>insetGrouped</code>), full-width groups (<code>grouped</code>),
      plain rows with sticky section titles (<code>plain</code>), or a sidebar’s
      capsule rows (<code>sidebar</code>).
    </>,
  ],
  [
    'outline',
    'boolean',
    code('false'),
    'Outlines its groups, with hairlines above and below, or a border around inset ones.',
  ],
  [
    'dragToSelect',
    'boolean',
    code('true'),
    <>
      Its checkboxes (
      <PartLink
        component="list"
        part="List.Checkbox"
      />
      ) can be pressed and dragged along the rows, setting each to what the
      first one flipped to (on or off). Rows dragged back over return to what
      they were. Near the scroll container’s ends, it scrolls along. While
      dragging from a checkbox, the page doesn’t scroll, and a sheet doesn’t
      swipe away.
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const listSectionRows: readonly PropRow[] = [
  [
    'editing',
    editingType,
    'its list’s',
    editingDescription(
      'Its groups’',
      'Each group’s own overrides it: sections edit separately.',
    ),
  ],
  [
    'indexValue',
    'string',
    undefined,
    <>
      Its value in its list’s{' '}
      <PartLink
        component="list"
        part="List.Index"
      />
      : an item of that <code>value</code> jumps to it. A letter, a group of
      letters (for example a language’s “Sch”), or any key of the app’s.
    </>,
  ],
  ...renderRows('section', 'HTMLElement'),
];

export const listHeaderRows: readonly PropRow[] = [
  [
    'prominence',
    union('prominent', 'nested', 'extraProminent'),
    code(union('prominent')),
    'The header’s type. Nested headers of plain lists are sticky section titles.',
  ],
  cursorRow(
    <>
      <code>pointer</code> (when it’s a button, for example a Base UI{' '}
      <code>Collapsible.Trigger</code>)
    </>,
  ),
  ...renderRows('div', 'HTMLElement'),
];

const reorderTargetHandleRow = (description: PropRow[3]): PropRow => [
  'reorderHandle',
  'ListReorderHandle | ListReorderHandle[]',
  undefined,
  <>
    {description} See{' '}
    <PartLink
      component="list"
      part="List.createReorderHandle"
    />
    .
  </>,
];

const dropNameRow = (description: PropRow[3]): PropRow => [
  'dropName',
  'string',
  undefined,
  description,
];

export const listGroupRows: readonly PropRow[] = [
  [
    'editing',
    editingType,
    'its section’s',
    editingDescription('Its rows’', 'Each row’s own overrides it.'),
  ],
  reorderTargetHandleRow(
    <>
      Rows of these handles can be dropped before, between and after its rows
      (like a{' '}
      <PartLink
        component="list"
        part="List.DropGroup"
      />{' '}
      around them), and into it once it’s empty.
    </>,
  ),
  dropNameRow(
    <>
      Its name, which its gaps share (the change’s <code>target.name</code>,
      with <code>part</code> set to <code>Group</code>), for example the name of
      the app’s list of its rows.
    </>,
  ),
  ...renderRows('ul', 'HTMLElement'),
];

export const listDropGroupRows: readonly PropRow[] = [
  reorderTargetHandleRow(
    'Rows of these handles can be dropped before, between and after its rows (required).',
  ),
  dropNameRow(
    <>
      Its name, which its gaps share (the change’s <code>target.name</code>,
      with <code>part</code> set to <code>DropGroup</code>), for example the
      name of the app’s list of its rows.
    </>,
  ),
  childrenRow(
    undefined,
    'Its rows. It has no element of its own, so they stay its group’s. Only an empty, hidden element marks where it is, and stays as its gap once it’s emptied.',
  ),
];

export const listDropTargetRows: readonly PropRow[] = [
  reorderTargetHandleRow(
    'Rows of these handles can be dropped where it’s placed (required).',
  ),
  dropNameRow(
    <>
      Its name (the change’s <code>target.name</code>, with <code>part</code>{' '}
      set to <code>DropTarget</code>).
    </>,
  ),
  ...renderRows('li', 'HTMLElement'),
];

export const listItemRows: readonly PropRow[] = [
  [
    'editing',
    editingType,
    'its group’s',
    editingDescription(
      'Its own',
      'For example none or ignore, to exempt it from its group’s.',
    ),
  ],
  [
    'selected',
    'boolean',
    code('false'),
    <>
      Marks it as selected (for example a sidebar’s current section): it gets a
      fill, and <code>aria-current</code>.
    </>,
  ],
  [
    'level',
    'number',
    undefined,
    'Its level in a hierarchy, indented 20px per level (for example in a sidebar).',
  ],
  [
    'indexValue',
    'string',
    undefined,
    <>
      Its value in its list’s{' '}
      <PartLink
        component="list"
        part="List.Index"
      />
      , when the index jumps to rows rather than sections (for example the first
      row of each letter, all in one group). The first row of a value wins.
    </>,
  ],
  [
    'reorderHandle',
    'ListReorderHandle | ListReorderHandle[]',
    undefined,
    <>
      The reorder handles that move it (
      <PartLink
        component="list"
        part="List.createReorderHandle"
      />
      ), by its{' '}
      <PartLink
        component="list"
        part="List.Grabber"
      />{' '}
      or the handle’s <code>grab</code>. They’re in order of priority: when it’s
      dropped where several are targets, the first of them is called. When it’s
      grabbed with other rows, only the handles they all have count, in the
      first row’s order.
    </>,
  ],
  dropNameRow(
    <>
      Its name in reordering. It names the moved rows (the change’s{' '}
      <code>items[].name</code>) and a gap’s neighbors (
      <code>target.after</code>, <code>target.before</code>), even for a row
      that isn’t reordered itself, such as a pinned one. The handle’s{' '}
      <code>grab</code> takes rows by it.
    </>,
  ),
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      A click on the row, for example{' '}
      <PartLink part="forwardClick">forwardClick(selector)</PartLink>, which
      passes it on to a control in the row (a switch, a checkbox).
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
    'The row’s parts: an edit control, an image, a title (with a subtitle and text), trailing parts (details, accessories, controls) and swipe actions.',
  ),
  ...renderRows('li', 'HTMLElement'),
];

const changeDetails = `{ event: Event, reason: ${union('trigger-press', 'none')} }`;

export const listCollapsibleRootRows: readonly PropRow[] = [
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Open at first (uncontrolled: its{' '}
      <PartLink
        component="list"
        part="List.CollapsibleTrigger"
      />{' '}
      toggles it).
    </>,
  ],
  [
    'open',
    'boolean',
    undefined,
    <>
      Whether it’s open (controlled, with <code>onOpenChange</code>).
    </>,
  ],
  [
    'onOpenChange',
    `(open: boolean, eventDetails: ${changeDetails}) => void`,
    undefined,
    'Called when its trigger opens or closes it, and why (Base UI’s reasons).',
  ],
  ['disabled', 'boolean', code('false'), 'Its trigger ignores presses.'],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The row with its trigger, and the{' '}
      <PartLink
        component="list"
        part="List.CollapsiblePanel"
      />
      . It renders no element, so they stay its group’s children.
    </>,
  ],
];

export const listCollapsiblePanelRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its rows (
      <PartLink
        component="list"
        part="List.Item"
      />
      s) among the group’s, shown while its collapsible is open. Their height
      and padding transition together (300ms), and they’re inert while closed.
      It renders no element, so they stay its group’s children. Each is a row of
      its own (with its separator, and first or last as the group’s), and each
      is controlled by its{' '}
      <PartLink
        component="list"
        part="List.CollapsibleTrigger"
      />{' '}
      (<code>aria-controls</code>, with their ids, given or their own).
    </>,
  ],
];

export const listAccordionRootRows: readonly PropRow[] = [
  [
    'defaultValue',
    'Value[]',
    code('[]'),
    <>
      The items open at first (uncontrolled), by their <code>value</code>.
    </>,
  ],
  [
    'value',
    'Value[]',
    undefined,
    <>
      The items that are open (controlled, with <code>onValueChange</code>).
    </>,
  ],
  [
    'onValueChange',
    `(value: Value[], eventDetails: ${changeDetails}) => void`,
    undefined,
    'Called when an item opens or closes, with the open items, and why.',
  ],
  [
    'multiple',
    'boolean',
    code('false'),
    'Lets several items be open at once. Otherwise, opening one closes the others.',
  ],
  ['disabled', 'boolean', code('false'), 'Its items’ triggers ignore presses.'],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="list"
        part="List.AccordionItem"
      />
      s, among the group’s rows. It renders no element.
    </>,
  ],
];

export const listAccordionItemRows: readonly PropRow[] = [
  ['value', 'Value', 'its own', 'Its value, as listed in its root’s.'],
  [
    'onOpenChange',
    `(open: boolean, eventDetails: ${changeDetails}) => void`,
    undefined,
    'Called when it opens or closes, and why.',
  ],
  [
    'disabled',
    'boolean',
    <>
      its root’s <code>disabled</code>
    </>,
    'Its trigger ignores presses.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Like a{' '}
      <PartLink
        component="list"
        part="List.CollapsibleRoot"
      />
      ’s: the row with its trigger (
      <PartLink
        component="list"
        part="List.AccordionTrigger"
      />
      ), and its panel (
      <PartLink
        component="list"
        part="List.AccordionPanel"
      />
      ). Or a{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Root"
      />
      ’s row with a <code>handle</code>, and its{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Expandable"
      />
      . It renders no element.
    </>,
  ],
];

export const listCollapsibleTriggerRows: readonly PropRow[] = [
  [
    'render',
    'ReactElement | ((props) => ReactElement)',
    undefined,
    <>
      Rendered by a row’s title (
      <PartLink
        component="list"
        part="List.CollapsibleTrigger"
      >
        {'<List.Title render={<List.CollapsibleTrigger />}>'}
      </PartLink>
      ), so the whole row toggles it.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Called before it toggles its row. <code>event.preventDefault()</code>{' '}
      keeps it as it is.
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
  [
    'strong',
    'boolean',
    code('false'),
    'Puts it on the rows’ background, inset and outlined like the list’s groups (by its style and its root’s outline).',
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const listLeadingRows: readonly PropRow[] = [
  whileEditingRow(),
  ...renderRows('span', 'HTMLElement'),
];

export const listContentRows: readonly PropRow[] = renderRows(
  'span',
  'HTMLElement',
);

export const listTrailingRows: readonly PropRow[] = [
  whileEditingRow(),
  ...renderRows('span', 'HTMLElement'),
];

export const listSpanRows: readonly PropRow[] = renderRows(
  'span',
  'HTMLElement',
);

export const listBelowRows: readonly PropRow[] = [
  [
    'hidden',
    'boolean',
    code('false'),
    <>
      Collapses it, growing and shrinking as it’s shown and hidden, while it
      stays rendered (for example a status that appears under a row). Once
      collapsed, it leaves the accessibility tree.
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const listTitleRows: readonly PropRow[] = [
  [
    'render',
    'ReactElement | ((props) => ReactElement)',
    undefined,
    <>
      Rendered as a link or button (for example <code>{'<button />'}</code>),
      the title makes the row pressable, with a hit area that covers the row
      beneath its trailing controls. In a header, render a heading (for example{' '}
      <code>{'<h3 />'}</code>).
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
  [
    'lines',
    'number',
    code('2'),
    'How many lines it shows at most, before it truncates.',
  ],
  ...renderRows('span', 'HTMLElement'),
];

export const listDetailRows: readonly PropRow[] = [
  ...renderRows('span', 'HTMLElement'),
];

export const listImageRows: readonly PropRow[] = [
  [
    'variant',
    union('symbol', 'rounded', 'circular', 'fill'),
    code(union('symbol')),
    <>
      The image’s frame: a symbol on its own, a rounded or circular frame (for
      example a symbol on a <code>backgroundColor</code>), or a square filled by
      an <code>img</code>, <code>video</code> or <code>canvas</code>.
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
      Rendered as a button (<code>{'<button type="button" />'}</code>), the
      symbol is pressable on its own, for example as an info button. Name it
      with <code>aria-label</code>.
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
    'What it shows: by default, the chevron. It’s hidden from assistive technology.',
  ),
  ...renderRows('span', 'HTMLElement'),
];

export const listDisclosureRows: readonly PropRow[] = [
  childrenRow(
    'a chevron',
    'What it shows: by default, the chevron, turned down while open (in an open Base UI Collapsible’s trigger). It’s hidden from assistive technology.',
  ),
  ...renderRows('span', 'HTMLElement'),
];

export const listGrabberRows: readonly PropRow[] = [
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example “Reorder Mercury”.',
  ],
  [
    'tabIndex',
    'number',
    code('0'),
    <>
      It can take focus. The arrow keys then move its row to the previous or
      next gap at once. When the app has grabbed it (the handle’s{' '}
      <code>grab</code>), they move it from gap to gap, Enter or Space drops it,
      and Escape puts it back.
    </>,
  ],
  childrenRow('three lines', 'What it shows: by default, three lines.'),
  ...renderRows('span', 'HTMLElement'),
];

export const listActionRows: readonly PropRow[] = [
  secondaryClickRow,
  ...renderRows('button', 'HTMLElement'),
];

export const listButtonRows: readonly PropRow[] = [
  [
    'destructive',
    'boolean',
    code('false'),
    'Uses the destructive color (red).',
  ],
  secondaryClickRow,
  ...renderRows('button', 'HTMLElement'),
];

export const listCheckboxRows: readonly PropRow[] = [...checkboxRootRows];

export const listRadioRows: readonly PropRow[] = [...radioRootRows];

export const listEditButtonRows: readonly PropRow[] = [
  [
    'tint',
    'string',
    code('systemGray'),
    <>
      Its circle’s color, for example <code>systemRed</code> for deleting and{' '}
      <code>systemGreen</code> for inserting.
    </>,
  ],
  [
    'textColor',
    'string',
    'white',
    'Its symbol’s color, for example for a light tint.',
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      What it does. The app decides; it does nothing of its own. For deleting,
      it can be rendered by a{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />
      , which opens the row’s trailing swipe actions.
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example “Delete Mercury”.',
  ],
  secondaryClickRow,
  childrenRow(
    undefined,
    'What it shows: a symbol (for example a minus for deleting, or a plus for inserting).',
  ),
  ...renderRows('button', 'HTMLElement'),
];

export const listSwipeActionsRows: readonly PropRow[] = [
  [
    'side',
    union('inline-end', 'inline-start'),
    code(union('inline-end')),
    'The side of the row the actions are revealed on.',
  ],
  [
    'handle',
    'ListSwipeActionsHandle',
    undefined,
    <>
      Their handle (
      <PartLink
        component="list"
        part="List.createSwipeActionsHandle"
      />
      ), which opens and closes them from anywhere (for example a{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />{' '}
      outside the row, or code).
    </>,
  ],
  [
    'overswipe',
    'boolean',
    code('false'),
    'Dragging on past the actions stretches the outermost one over the others, following the row. Past 304px, it triggers on release. A flick stops at the actions.',
  ],
  [
    'onOverswipe',
    '() => void',
    undefined,
    <>
      Called when it’s released after a swipe past the actions (an overswipe),
      instead of triggering the outermost action. It enables{' '}
      <code>overswipe</code>.
    </>,
  ],
  [
    'allowSwipe',
    union('all', 'conceal', 'none', 'reveal'),
    code(union('all')),
    <>
      What people can do to them by swiping (or by keyboard): open and close
      them (<code>all</code>), only open them (<code>reveal</code>), only close
      them (<code>conceal</code>, for example in edit mode, opened by a{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />
      ), or neither (<code>none</code>: only their trigger or handle does). It
      applies to keyboards too. When swiping can’t reveal them, they can’t be
      focused while closed. When swiping can’t conceal them, neither focus
      leaving the row nor a press outside it closes them while open.
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const listSwipeActionsTriggerRows: readonly PropRow[] = [
  [
    'handle',
    'ListSwipeActionsHandle',
    undefined,
    <>
      The actions it opens, by their handle (
      <PartLink
        component="list"
        part="List.createSwipeActionsHandle"
      />
      ), from anywhere. Unset, it opens its row’s, on its <code>side</code>.
    </>,
  ],
  [
    'side',
    union('inline-end', 'inline-start'),
    code(union('inline-end')),
    <>
      In its row, without a <code>handle</code>, the side whose actions it
      opens.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Called first. <code>event.preventDefault()</code> keeps the actions
      closed.
    </>,
  ],
  ...renderRows('button', 'HTMLElement'),
];

/**
 * `List.createSwipeActionsHandle()`, `useCreateSwipeActionsHandle()`: what
 * they return.
 */
export const listSwipeActionsHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'ListSwipeActionsHandle',
    undefined,
    <>
      A handle. Pass it to a row’s{' '}
      <PartLink
        component="list"
        part="List.SwipeActions"
      />{' '}
      and to the{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />
      s that open them (their <code>handle</code>). The hook returns the same
      one for the component’s lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the actions are open (false while none are attached to the handle).',
  ],
  [
    '.open()',
    '() => void',
    undefined,
    'Opens them by swiping the row to show them, and closes another row’s (in an event handler or an effect).',
  ],
  ['.close()', '() => void', undefined, 'Closes them by swiping the row back.'],
];

export const listSwipeActionRows: readonly PropRow[] = [
  [
    'label',
    'string',
    undefined,
    <>
      The action’s name (required), which is its accessible name (see{' '}
      <code>showLabel</code>).
    </>,
  ],
  [
    'showLabel',
    'boolean',
    code('false'),
    <>
      Shows the label below the shape. It needs room, so it suits multi-line
      rows (
      <PartLink
        component="list"
        part="List.Text"
      >
        Text
      </PartLink>
      ).
    </>,
  ],
  [
    'shape',
    union('circle', 'roundedRectangle'),
    'a 44px circle, or a capsule around wider content',
    'The action’s shape, or a rounded rectangle (12px corners) as tall as the row and at least 60px wide.',
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
      Text color, for example for a light <code>tint</code>.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    'Its action. The actions close after it.',
  ],
  secondaryClickRow,
  childrenRow(undefined, 'A symbol, or short text in capitals.'),
  ...renderRows('button', 'HTMLElement'),
];

export const listIndexRows: readonly PropRow[] = [
  [
    'size',
    union('compact', 'regular'),
    code(union('compact')),
    'A size class: compact (a phone) or regular (a tablet).',
  ],
  [
    'aria-label',
    'string',
    undefined,
    <>
      Its accessible name (it’s a <code>nav</code>), for example “Index”.
    </>,
  ],
  [
    'style',
    'CSSProperties',
    undefined,
    <>
      In its list’s root, it’s placed by the list. To move it sideways (for
      example into a container’s inset), set{' '}
      <code>--uikit-list-index-offset</code> on the root: a negative length
      moves it outwards.
    </>,
  ],
  ...renderRows('nav', 'HTMLElement'),
];

export const listIndexItemRows: readonly PropRow[] = [
  [
    'value',
    'string',
    'its text',
    <>
      The section it jumps to (its{' '}
      <PartLink
        component="list"
        part="List.Section"
      />
      ’s <code>indexValue</code>, or a row’s). Without one, it jumps to the
      section of the next item after it that has one.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Called when it’s chosen, by a press or by scrubbing over the index, before
      it jumps. <code>event.preventDefault()</code> keeps it from jumping.
    </>,
  ],
  secondaryClickRow,
  ...renderRows('button', 'HTMLElement'),
];

/** `forwardClick(selector)`: its argument, what it returns. */
export const forwardClickRows: readonly PropRow[] = [
  [
    'selector',
    'string',
    undefined,
    <>
      The control in the row to pass the click on to (for example{' '}
      <code>[role=switch]</code>, <code>[role=checkbox]</code>).
    </>,
  ],
  [
    '(return)',
    '(event: MouseEvent<HTMLElement>) => void',
    undefined,
    <>
      The row’s <code>onClick</code>. It clicks the control as the kind of click
      it is (a pointer’s or a keyboard’s), unless the click was the control’s
      own.
    </>,
  ],
];

/** `List.createReorderHandle(options)`, `useCreateReorderHandle(options)`. */
export const listReorderHandleRows: readonly PropRow[] = [
  [
    'options.onReorder',
    '(change: ListReorderChange, eventDetails) => void',
    undefined,
    <>
      Called when rows are dropped (or moved by keyboard) somewhere new. The app
      reorders them (for example with{' '}
      <PartLink
        component="list"
        part="List.reorder"
      />
      ). <code>change.items</code> holds the moved rows, in the order grabbed (
      <code>name</code> is their <code>dropName</code>, and <code>index</code>{' '}
      their position among the handle’s rows). <code>change.target</code> says
      where: <code>part</code> is <code>Group</code>, <code>DropGroup</code> or{' '}
      <code>DropTarget</code>, <code>name</code> its <code>dropName</code>,{' '}
      <code>index</code> the gap within it, <code>flat</code> the gap among the
      handle’s targets, and <code>after</code> and <code>before</code> the rows
      around the gap (not moved ones). <code>eventDetails.reason</code> is{' '}
      <code>drag</code>, <code>keyboard</code> or <code>imperative</code>. It
      isn’t called when nothing changes.
    </>,
  ],
  [
    '(return)',
    'ListReorderHandle',
    undefined,
    <>
      A handle. Give it to the rows it moves (
      <PartLink
        component="list"
        part="List.Item"
      />
      ’s <code>reorderHandle</code>) and to where they can be dropped (
      <PartLink
        component="list"
        part="List.DropGroup"
      />
      ,{' '}
      <PartLink
        component="list"
        part="List.DropTarget"
      />
      ,{' '}
      <PartLink
        component="list"
        part="List.Group"
      />
      ’s). The hook returns the same one for the component’s lifetime, always
      with the latest options.
    </>,
  ],
  [
    '.grab(names)',
    '(names: string[]) => void',
    undefined,
    <>
      Grabs rows by their <code>dropName</code>, in that order (the first leads
      the stack), and lifts them where the first one is. Pressing one of their
      grabbers then drags them all. Or <code>move</code>, <code>drop</code> and{' '}
      <code>cancel</code> (and a grabber’s keys) move them.
    </>,
  ],
  [
    '.move(direction)',
    `(direction: ${union('next', 'previous')}) => void`,
    undefined,
    'Moves the grabbed rows to the next or previous gap, and announces it.',
  ],
  [
    '.drop()',
    '() => void',
    undefined,
    <>
      Drops the grabbed rows at their gap (calling <code>onReorder</code>).
    </>,
  ],
  ['.cancel()', '() => void', undefined, 'Puts the grabbed rows back.'],
  [
    '.isGrabbed',
    'boolean',
    undefined,
    'Whether rows of it are grabbed (by the app, or dragged) and not yet dropped.',
  ],
];

/** `List.reorder(data, change, nameOf)`. */
export const listReorderRows: readonly PropRow[] = [
  [
    'data',
    'T[] | Record<string, T[]>',
    undefined,
    <>
      The app’s rows: one list, or lists by name (their group’s or drop group’s{' '}
      <code>dropName</code>).
    </>,
  ],
  [
    'change',
    'ListReorderChange',
    undefined,
    <>
      The handle’s <code>onReorder</code> argument.
    </>,
  ],
  [
    'nameOf',
    '(row: T) => string',
    undefined,
    <>
      A row’s name, as its <code>dropName</code>.
    </>,
  ],
  [
    '(return)',
    'T[] | Record<string, T[]>',
    undefined,
    <>
      The reordered rows. The moved ones are taken out and put after the
      target’s <code>after</code> row (or before its <code>before</code> row;
      rows not in the data, such as a pinned one, count as the rows before or
      after them). In an empty list, they go by the target’s <code>name</code>.
      It returns new arrays for the lists that changed, or the data itself if a
      row isn’t found.
    </>,
  ],
];
