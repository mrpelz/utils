import {
  baseUiRows,
  code,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';

// Its parts' props (Base UI's), for the parts page (all) and the overview
// (its key ones).

const changeDetails = `{ event: Event, reason: ${union('trigger-press', 'none')}, … }`;

export const collapsibleRootRows: readonly PropRow[] = [
  [
    'defaultOpen',
    'boolean',
    code('false'),
    'Initially open (uncontrolled: its trigger toggles it).',
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
    'Called when its trigger opens or closes it, and why.',
  ],
  ['disabled', 'boolean', code('false'), 'Its trigger ignores presses.'],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const collapsibleTriggerRows: readonly PropRow[] = [
  [
    'nativeButton',
    'boolean',
    code('true'),
    <>
      Renders a <code>button</code>; <code>false</code> when it renders another
      element (e.g. a <a href="list/parts#list-header">List.Header</a>
      ).
    </>,
  ],
  ...baseUiRows('button', 'HTMLButtonElement'),
];

export const collapsiblePanelRows: readonly PropRow[] = [
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Kept in the document while closed (hidden).',
  ],
  [
    'hiddenUntilFound',
    'boolean',
    code('false'),
    <>
      Closed, found by the browser’s page search, opening (
      <code>hidden=&quot;until-found&quot;</code>; overrides{' '}
      <code>keepMounted</code>).
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];
