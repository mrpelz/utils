import {
  baseUiRows,
  code,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';

// Its parts' props (Base UI's), for the parts page (all) and the overview
// (its key ones).

const changeDetails = `{ event: Event, reason: ${union('trigger-press', 'none')}, … }`;

export const accordionRootRows: readonly PropRow[] = [
  [
    'defaultValue',
    'Value[]',
    undefined,
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
  ['disabled', 'boolean', code('false'), 'Its items ignore presses.'],
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Its closed panels kept in the document (hidden).',
  ],
  [
    'hiddenUntilFound',
    'boolean',
    code('false'),
    <>
      Its closed panels found by the browser’s page search, opening (
      <code>hidden=&quot;until-found&quot;</code>).
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const accordionItemRows: readonly PropRow[] = [
  [
    'value',
    'Value',
    'its own',
    'Its value, among its root’s (`value`, `defaultValue`).',
  ],
  [
    'onOpenChange',
    `(open: boolean, eventDetails: ${changeDetails}) => void`,
    undefined,
    'Called when it opens or closes, and why.',
  ],
  ['disabled', 'boolean', code('false'), 'It ignores presses.'],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const accordionHeaderRows: readonly PropRow[] = baseUiRows(
  'h3',
  'HTMLHeadingElement',
);

export const accordionTriggerRows: readonly PropRow[] = [
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

export const accordionPanelRows: readonly PropRow[] = [
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
