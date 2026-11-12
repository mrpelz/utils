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

export const collapsibleRootRows: readonly PropRow[] = [
  [
    'defaultOpen',
    'boolean',
    code('false'),
    'Open at first (uncontrolled: its trigger toggles it).',
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
      Whether it renders a <code>button</code>. Set it to <code>false</code>{' '}
      when it renders another element (for example a{' '}
      <a href={publicUrl('list/parts#list-header')}>List.Header</a>
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
