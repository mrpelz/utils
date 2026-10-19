import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
} from '../utils/props-table.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const segmentedRootRows: readonly PropRow[] = [
  [
    'value',
    'any',
    undefined,
    <>
      The controlled value of the radio item that should be currently selected.
      To render an uncontrolled radio group, use the <code>defaultValue</code>{' '}
      prop instead.
    </>,
  ],
  [
    'defaultValue',
    'any',
    undefined,
    <>
      The uncontrolled value of the radio button that should be initially
      selected. To render a controlled radio group, use the <code>value</code>{' '}
      prop instead. Without either, no item is chosen, and the highlight is
      hidden.
    </>,
  ],
  [
    'onValueChange',
    '(value, eventDetails) => void',
    undefined,
    'Callback fired when the value changes.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  [
    'readOnly',
    'boolean',
    code('false'),
    'Whether the user should be unable to select a different radio button in the group.',
  ],
  [
    'required',
    'boolean',
    code('false'),
    'Whether the user must choose a value before submitting a form.',
  ],
  [
    'name',
    'string',
    undefined,
    'Identifies the field when a form is submitted.',
  ],
  [
    'form',
    'string',
    undefined,
    'Identifies the form that owns the radio inputs. Useful when the radio group is rendered outside the form.',
  ],
  [
    'inputRef',
    'Ref<HTMLInputElement>',
    undefined,
    'A ref to access the hidden input element.',
  ],
  [
    'hideSeparators',
    'boolean',
    code('false'),
    'Hides the separators between unselected items.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const segmentedItemRows: readonly PropRow[] = [
  [
    'value',
    'any',
    undefined,
    'The unique identifying value of the radio in a group.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  [
    'readOnly',
    'boolean',
    code('false'),
    'Whether the user should be unable to select the radio button.',
  ],
  [
    'required',
    'boolean',
    code('false'),
    'Whether the user must choose a value before submitting a form.',
  ],
  [
    'inputRef',
    'Ref<HTMLInputElement>',
    undefined,
    'A ref to access the hidden input element.',
  ],
  [
    'onSecondaryClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      A secondary click: a right click (or Control-click: the{' '}
      <code>contextmenu</code> event, whose menu it replaces), or a touch held
      for 500ms (iOS: a long press), whose click then doesn’t follow. Not while
      disabled.
    </>,
  ],
  [
    'cursor',
    'string (a CSS cursor)',
    code('pointer'),
    'The cursor (where the pointer hovers).',
  ],
  nativeButtonRow(false),
  ...baseUiRows('span', 'HTMLElement'),
];

export const segmentedHighlightRows: readonly PropRow[] = elementRows(
  'div',
  'HTMLDivElement',
);

export const segmentedIndicatorRows: readonly PropRow[] = [
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Whether to keep the HTML element in the DOM when the radio button is inactive.',
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];
