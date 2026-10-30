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
  'The cursor (where the pointer hovers).',
];

const childrenRow = (
  defaultValue: PropRow[2],
  description: string,
): PropRow => ['children', 'ReactNode', defaultValue, description];

const editingType = union('both', 'leading', 'trailing', 'none', 'ignore');

/** An edit mode's description (Root's, Section's, Item's). */
const editingDescription = (scope: string, inherited: string | undefined) => (
  <>
    {scope} edit mode, by side: <code>leading</code> slides in the rows’ leading
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
    ), <code>trailing</code> their trailing ones (
    <PartLink
      component="list"
      part="List.Grabber"
    />
    ), <code>both</code> both; <code>none</code>: not editing, all slid out and
    hidden; <code>ignore</code>: not managed, shown as they are. Rows’ slots
    follow by their <code>whileEditing</code> (e.g. a{' '}
    <PartLink
      component="list"
      part="List.DrillIn"
    />
    ’s sliding out as a grabber’s slides in).
    {inherited ? <> {inherited}</> : null}
  </>
);

/** A row slot's `whileEditing`. */
const whileEditingRow = (): PropRow => [
  'whileEditing',
  union('show', 'hide', 'stay'),
  code(union('stay')),
  <>
    In edit mode, its side’s (see{' '}
    <PartLink
      component="list"
      part="List.Section"
    />{' '}
    <code>editing</code>): <code>show</code>, only then (sliding in: e.g. edit
    controls’, a{' '}
    <PartLink
      component="list"
      part="List.Grabber"
    />
    ’s); <code>hide</code>, sliding out then (e.g. a{' '}
    <PartLink
      component="list"
      part="List.DrillIn"
    />
    ’s, making way for a grabber); <code>stay</code>, either way, whatever it
    holds. Parts sliding separately: in slots of their own.
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
      <code>insetGrouped</code>), full width (<code>grouped</code>), plain rows
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
  ...renderRows('section', 'HTMLElement'),
];

export const listHeaderRows: readonly PropRow[] = [
  [
    'prominence',
    union('prominent', 'nested', 'extraProminent'),
    code(union('prominent')),
    'The header’s type: nested headers of plain lists are section titles (sticky).',
  ],
  cursorRow(
    <>
      <code>pointer</code> (when it’s a button, e.g. a Base UI{' '}
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
      (as a{' '}
      <PartLink
        component="list"
        part="List.DropGroup"
      />{' '}
      around them); emptied, into it.
    </>,
  ),
  dropNameRow(
    <>
      Its name, its gaps’ (the change’s <code>target.name</code>, its{' '}
      <code>part</code>: <code>Group</code>), e.g. the app’s list of its rows.
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
      Its name, its gaps’ (the change’s <code>target.name</code>, its{' '}
      <code>part</code>: <code>DropGroup</code>), e.g. the app’s list of its
      rows.
    </>,
  ),
  childrenRow(
    undefined,
    'Its rows (no element of its own: they stay its group’s; only an empty, hidden one marks where it is, its gap once emptied).',
  ),
];

export const listDropTargetRows: readonly PropRow[] = [
  reorderTargetHandleRow(
    'Rows of these handles can be dropped where it’s placed (required).',
  ),
  dropNameRow(
    <>
      Its name (the change’s <code>target.name</code>, its <code>part</code>:{' '}
      <code>DropTarget</code>).
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
      'E.g. none or ignore exempting it from its group’s.',
    ),
  ],
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
    'reorderHandle',
    'ListReorderHandle | ListReorderHandle[]',
    undefined,
    <>
      The reorder handles it’s moved by (
      <PartLink
        component="list"
        part="List.createReorderHandle"
      />
      ), by its{' '}
      <PartLink
        component="list"
        part="List.Grabber"
      />{' '}
      or the handle’s <code>grab</code>. By priority: dropped where several are
      targets, the first of them is called. Grabbed with other rows, only the
      handles all of them have count, in the first row’s order.
    </>,
  ],
  dropNameRow(
    <>
      Its name in reordering: the moved rows’ (the change’s{' '}
      <code>items[].name</code>), and a gap’s neighbours’ (
      <code>target.after</code>, <code>target.before</code>, even if it isn’t
      reordered itself, e.g. a pinned row); the handle’s <code>grab</code> takes
      rows by it.
    </>,
  ),
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      A click on the row: e.g.{' '}
      <PartLink part="forwardClick">forwardClick(selector)</PartLink>, passing
      it on to a control in the row (a switch, a checkbox).
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

const changeDetails = `{ event: Event, reason: ${union('trigger-press', 'none')} }`;

export const listCollapsibleRootRows: readonly PropRow[] = [
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Initially open (uncontrolled: its{' '}
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
      Open (controlled, with <code>onOpenChange</code>).
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
      s), among the group’s, shown while its collapsible is open (their height
      and padding transitioning, 300ms, together; closed, inert). It renders no
      element, so they stay its group’s children; each a row of its own (its
      separator, first and last as the group’s), and each controlled by its{' '}
      <PartLink
        component="list"
        part="List.CollapsibleTrigger"
      />{' '}
      (<code>aria-controls</code>, their ids, given or their own).
    </>,
  ],
];

export const listAccordionRootRows: readonly PropRow[] = [
  [
    'defaultValue',
    'Value[]',
    code('[]'),
    <>
      Its items open initially (uncontrolled), by their <code>value</code>.
    </>,
  ],
  [
    'value',
    'Value[]',
    undefined,
    <>
      Its items open (controlled, with <code>onValueChange</code>).
    </>,
  ],
  [
    'onValueChange',
    `(value: Value[], eventDetails: ${changeDetails}) => void`,
    undefined,
    'Called when an item opens or closes, with the items open, and why.',
  ],
  [
    'multiple',
    'boolean',
    code('false'),
    'Several items open at once; otherwise, opening one closes the others.',
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
  ['value', 'Value', 'its own', 'Its value, among its root’s.'],
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
      As a{' '}
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
      ); or a{' '}
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
      ), the whole row toggles it.
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
      Collapsed: growing and shrinking as it’s shown and hidden (kept rendered;
      e.g. a status appearing under a row), out of the accessibility tree once
      collapsed.
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

export const listDetailRows: readonly PropRow[] = [
  ...renderRows('span', 'HTMLElement'),
];

export const listImageRows: readonly PropRow[] = [
  [
    'variant',
    union('symbol', 'rounded', 'circular', 'fill'),
    code(union('symbol')),
    <>
      The image’s frame: a symbol alone, a rounded or circular frame (e.g. a
      symbol on a <code>backgroundColor</code>), or a square filled by an{' '}
      <code>img</code>, <code>video</code> or <code>canvas</code>.
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
    <>
      Focusable: arrow keys move its row to the previous or next gap at once;
      grabbed by the app (the handle’s <code>grab</code>), from gap to gap,
      Enter or Space dropping it, Escape putting it back.
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
  ['destructive', 'boolean', code('false'), 'In the destructive color (red).'],
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
      Its circle’s color: e.g. <code>systemRed</code> deleting,{' '}
      <code>systemGreen</code> inserting.
    </>,
  ],
  [
    'textColor',
    'string',
    'white',
    'Its symbol’s color, e.g. for a light tint.',
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      What it does: the app’s, nothing of its own. Deleting, e.g. rendered by a{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />
      , opening the row’s trailing swipe actions.
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, e.g. “Delete Mercury”.',
  ],
  secondaryClickRow,
  childrenRow(
    undefined,
    'What it shows: a symbol (e.g. a minus deleting, a plus inserting).',
  ),
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
    'handle',
    'ListSwipeActionsHandle',
    undefined,
    <>
      Their handle (
      <PartLink
        component="list"
        part="List.createSwipeActionsHandle"
      />
      ): opened and closed by it, from anywhere (e.g. a{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />{' '}
      outside the row, or imperatively).
    </>,
  ],
  [
    'overswipe',
    'boolean',
    code('false'),
    'Swiping on past the actions stretches the outermost one up to the others (following the row), and, past 304px, triggers it on release.',
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
  [
    'allowSwipe',
    union('all', 'conceal', 'none', 'reveal'),
    code(union('all')),
    <>
      What the user does to them, swiping (or by keyboard): opens and closes
      them (<code>all</code>), only opens (<code>reveal</code>) or only closes
      them (<code>conceal</code>, e.g. in edit mode, opened by a{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />
      ), or neither (<code>none</code>: only their trigger or handle does).
      Keyboards too: not revealed by swiping, closed, they can’t be focused; not
      concealed by swiping, open, neither focus leaving the row nor a press
      outside it closes them.
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
      ): from anywhere. Unset: its row’s, on its <code>side</code>.
    </>,
  ],
  [
    'side',
    union('inline-end', 'inline-start'),
    code(union('inline-end')),
    <>
      In its row, without a <code>handle</code>: the side whose actions it
      opens.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Called first; preventing it (<code>event.preventDefault()</code>) keeps
      the actions closed.
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
      A handle: passed to a row’s{' '}
      <PartLink
        component="list"
        part="List.SwipeActions"
      />{' '}
      and to the{' '}
      <PartLink
        component="list"
        part="List.SwipeActionsTrigger"
      />
      s opening them (their <code>handle</code>); from the hook, the same for
      the component’s lifetime.
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
    'Opens them: swipes the row to show them, closing another row’s (in an event handler or an effect).',
  ],
  ['.close()', '() => void', undefined, 'Closes them: swipes the row back.'],
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
    'A size class: compact (a phone) or regular (a tablet).',
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

/** `forwardClick(selector)`: its argument, what it returns. */
export const forwardClickRows: readonly PropRow[] = [
  [
    'selector',
    'string',
    undefined,
    <>
      The control in the row to pass the click on to (e.g.{' '}
      <code>[role=switch]</code>, <code>[role=checkbox]</code>).
    </>,
  ],
  [
    '(return)',
    '(event: MouseEvent<HTMLElement>) => void',
    undefined,
    <>
      The row’s <code>onClick</code>: clicks the control as the click it is (a
      pointer’s or a keyboard’s), unless the click was the control’s own.
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
      Called when rows are dropped (or moved by keyboard) somewhere new; the app
      reorders them (e.g. by{' '}
      <PartLink
        component="list"
        part="List.reorder"
      />
      ). <code>change.items</code>: the rows moved, in the order grabbed (
      <code>name</code>, their <code>dropName</code>; <code>index</code>, among
      the handle’s rows). <code>change.target</code>: where (<code>part</code>:{' '}
      <code>Group</code>, <code>DropGroup</code> or <code>DropTarget</code>;{' '}
      <code>name</code>, its <code>dropName</code>; <code>index</code>, the gap
      within it; <code>flat</code>, among the handle’s targets;{' '}
      <code>after</code>, <code>before</code>: the rows around the gap, not
      moved ones). <code>eventDetails.reason</code>: <code>drag</code>,{' '}
      <code>keyboard</code> or <code>imperative</code>. Not called when nothing
      changes.
    </>,
  ],
  [
    '(return)',
    'ListReorderHandle',
    undefined,
    <>
      A handle: given to the rows moved by it (
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
      ’s); from the hook, the same for the component’s lifetime, its options the
      latest.
    </>,
  ],
  [
    '.grab(names)',
    '(names: string[]) => void',
    undefined,
    <>
      Grabs rows by their <code>dropName</code> (in that order: the first leads
      the stack), lifting them where the first is. Pressing one of their
      grabbers then drags them all; or <code>move</code>, <code>drop</code>,{' '}
      <code>cancel</code> (and a grabber’s keys) move them.
    </>,
  ],
  [
    '.move(direction)',
    `(direction: ${union('next', 'previous')}) => void`,
    undefined,
    'Moves the grabbed rows to the next or previous gap (announced).',
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
    'Rows of it are grabbed (by the app, or dragged), not yet dropped.',
  ],
];

/** `List.reorder(data, change, nameOf)`. */
export const listReorderRows: readonly PropRow[] = [
  [
    'data',
    'T[] | Record<string, T[]>',
    undefined,
    <>
      The app’s rows: a list, or lists by name (their group’s or drop group’s{' '}
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
      The rows reordered: the moved ones taken out, put after the target’s{' '}
      <code>after</code> row (or before its <code>before</code> row; rows not in
      the data, e.g. a pinned one, taken as those before or after them); in an
      empty list, by the target’s <code>name</code>. New arrays for the lists
      that changed; the data itself if a row isn’t found.
    </>,
  ],
];
