import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

const collapsedContents = union('symbol', 'label', 'symbolAndLabel');
const collapsedPositions = union('inline-start', 'center', 'inline-end');
const shapes = union('capsule', 'circle');
const glassContexts = union(
  'bright',
  'dim',
  'background-bright',
  'background-dim',
);

const glassContext = (of: string): PropRow => [
  'context',
  glassContexts,
  <>
    <code>bright</code>, or <code>dim</code> in dark mode
  </>,
  `How bright the content behind the glass${of} is: a plain page, or a background of the app’s own (for example a picture).`,
];

export const tabBarRootRows: readonly PropRow[] = [
  [
    'value',
    'any',
    undefined,
    <>
      The value of the currently active{' '}
      <PartLink
        component="tab-bar"
        part="TabBar.Tab"
      >
        Tab
      </PartLink>
      . Use when the component is controlled. When the value is{' '}
      <code>null</code>, no Tab will be active.
    </>,
  ],
  [
    'defaultValue',
    'any',
    code('0'),
    <>
      The default value. Use when the component is not controlled. When the
      value is <code>null</code>, no Tab will be active.
    </>,
  ],
  [
    'onValueChange',
    '(value, eventDetails) => void',
    undefined,
    <>
      Callback invoked when new value is being set. The event{' '}
      <code>reason</code> is <code>none</code> for user-initiated changes, such
      as a click or keyboard navigation; <code>initial</code>,{' '}
      <code>disabled</code> or <code>missing</code> for automatic fallbacks in
      uncontrolled roots.
    </>,
  ],
  [
    'orientation',
    union('horizontal', 'vertical'),
    code('horizontal'),
    'The component orientation (layout flow direction).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const tabBarListRows: readonly PropRow[] = [
  [
    'collapsed',
    'boolean',
    code('false'),
    <>
      Minimizes the bar: only the groups and tabs marked{' '}
      <code>visibleWhenCollapsed</code> remain, by default as symbols in
      circles. The bar keeps its width.
    </>,
  ],
  [
    'collapsedContent',
    collapsedContents,
    'its symbol, or, without one, its label',
    'What a tab of the collapsed bar shows: its symbol in a circle, its label, or both side by side in a capsule.',
  ],
  [
    'collapsedPosition',
    collapsedPositions,
    code('inline-start'),
    'Where a tab of the collapsed bar sits, along the bar.',
  ],
  [
    'size',
    union('compact', 'regular'),
    code('compact'),
    <>
      A size class: <code>compact</code> is a phone’s tab bar (symbol above
      label), <code>regular</code> a tablet’s (symbol and label in a row).
    </>,
  ],
  glassContext(''),
  [
    'activateOnFocus',
    'boolean',
    code('false'),
    <>
      Whether to automatically change the active tab on arrow key focus.
      Otherwise, tabs will be activated using <kbd>Enter</kbd> or{' '}
      <kbd>Space</kbd> key press.
    </>,
  ],
  [
    'loopFocus',
    'boolean',
    code('true'),
    'Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const tabBarGroupRows: readonly PropRow[] = [
  [
    'visibleWhenCollapsed',
    'boolean',
    code('false'),
    <>
      Keeps the group while the bar is collapsed, together with its tabs that
      are marked too. Groups that aren’t marked collapse away. Use{' '}
      <PartLink part="collapsedSelection" /> to pick them: the active tab and
      its group.
    </>,
  ],
  [
    'collapsedContent',
    collapsedContents,
    <>
      the list’s <code>collapsedContent</code>
    </>,
    'What the group’s tabs show while the bar is collapsed.',
  ],
  [
    'collapsedPosition',
    collapsedPositions,
    <>
      the list’s <code>collapsedPosition</code>
    </>,
    'Where the group sits, along the collapsed bar.',
  ],
  [
    'shape',
    shapes,
    'by their content',
    'The default shape of the group’s tabs.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const tabBarIndicatorRows: readonly PropRow[] = [
  [
    'renderBeforeHydration',
    'boolean',
    code('false'),
    'Whether to render itself before React hydrates. This minimizes the time that the indicator isn’t visible after server-side rendering.',
  ],
  ...baseUiRows('span', 'HTMLElement'),
];

export const tabBarTabRows: readonly PropRow[] = [
  ['value', 'any', undefined, 'The value of the Tab.'],
  [
    'disabled',
    'boolean',
    code('false'),
    <>
      Whether the Tab is disabled. If a first Tab on a list is disabled, it
      won’t initially be selected; the next enabled Tab will be (except while
      rendering on the server: set the root’s <code>defaultValue</code> or{' '}
      <code>value</code> to an enabled Tab’s).
    </>,
  ],
  [
    'visibleWhenCollapsed',
    'boolean',
    code('false'),
    'Keeps the tab while the bar is collapsed, if its group remains too. Tabs that aren’t marked collapse away. With several remaining tabs, the selection shows on the active one.',
  ],
  [
    'collapsedContent',
    collapsedContents,
    'the group’s, or the list’s',
    'What the tab shows while its bar is collapsed. It never shows nothing: a tab with only a label shows its label, and one with only a symbol shows its symbol.',
  ],
  [
    'shape',
    shapes,
    'the group’s, or by its content',
    <>
      <code>circle</code> sizes it like a tab with only a symbol.{' '}
      <code>capsule</code> sizes it like a stacked tab.
    </>,
  ],
  [
    'onSecondaryClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Called on a secondary click: a right click or Control-click (the{' '}
      <code>contextmenu</code> event, whose menu it replaces), or a touch held
      for 500ms (a long press), after which no click follows. Not called while
      disabled.
    </>,
  ],
  [
    'cursor',
    'string (a CSS cursor)',
    <>
      <code>pointer</code> (disabled: <code>not-allowed</code>)
    </>,
    'The cursor shown while the pointer hovers it.',
  ],
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLElement'),
];

export const tabBarIconRows: readonly PropRow[] = elementRows(
  'span',
  'HTMLSpanElement',
);

export const tabBarLabelRows: readonly PropRow[] = elementRows(
  'span',
  'HTMLSpanElement',
);

export const tabBarPanelRows: readonly PropRow[] = [
  [
    'value',
    'any',
    undefined,
    'The value of the TabPanel. It will be shown when the Tab with the corresponding value is active.',
  ],
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Whether to keep the HTML element in the DOM while the panel is hidden.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const tabBarAccessoryRows: readonly PropRow[] = [
  [
    'visibleIn',
    union('both', 'expanded', 'collapsed'),
    code('both'),
    <>
      Which of the bar’s states it shows in. With <code>both</code>, it morphs
      between its two places. Otherwise, it fades out and in as the bar
      collapses and expands.
    </>,
  ],
  glassContext(' (as the list’s)'),
  ...elementRows('div', 'HTMLDivElement'),
];

/** `collapsedSelection(groups, value)`: its arguments, what it returns. */
export const collapsedSelectionRows: readonly PropRow[] = [
  [
    'groups',
    'readonly (readonly Value[])[]',
    undefined,
    'The groups’ tab values, in order.',
  ],
  ['value', 'Value | undefined', undefined, 'The active tab’s value.'],
  [
    '(return)',
    '{ remains: boolean; tab: number }[]',
    undefined,
    <>
      For each group: whether it remains (the active tab’s group, or the first
      one without an active tab), and which tab remains, by index (the active
      one, or the first). Use it for <code>visibleWhenCollapsed</code>.
    </>,
  ],
];
