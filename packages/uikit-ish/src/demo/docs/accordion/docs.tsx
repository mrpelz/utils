import {
  baseUiRows,
  code,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { publicUrl } from '../../tooling/public-url.js';

// Its parts' props (Base UI's), for the parts page (all) and the overview
// (its key ones).

const changeDetails = `{ event: Event, reason: ${union('trigger-press', 'none')}, … }`;

export const accordionRootRows: readonly PropRow[] = [
  [
    'defaultValue',
    'Value[]',
    undefined,
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
  ['disabled', 'boolean', code('false'), 'Its items ignore presses.'],
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Keeps its closed panels in the document, hidden.',
  ],
  [
    'hiddenUntilFound',
    'boolean',
    code('false'),
    <>
      Lets the browser’s page search find its closed panels, and opens them when
      found (<code>hidden=&quot;until-found&quot;</code>).
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const accordionItemRows: readonly PropRow[] = [
  [
    'value',
    'Value',
    'its own',
    'Its value, as listed in its root’s value or defaultValue.',
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
      Whether it renders a <code>button</code>. Set it to <code>false</code>{' '}
      when it renders another element (for example a{' '}
      <a href={publicUrl('list/parts#list-header')}>List.Header</a>
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
    'Keeps it in the document while closed, hidden.',
  ],
  [
    'hiddenUntilFound',
    'boolean',
    code('false'),
    <>
      Lets the browser’s page search find it while closed, and opens it when
      found (<code>hidden=&quot;until-found&quot;</code>; overrides{' '}
      <code>keepMounted</code>).
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];
