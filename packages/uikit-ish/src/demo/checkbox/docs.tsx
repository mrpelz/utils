import {
  baseUiRows,
  code,
  nativeButtonRow,
  PropRow,
} from '../guide/props-table.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

const cursorRow: PropRow = [
  'cursor',
  'string (a CSS cursor)',
  <>
    <code>pointer</code> (disabled: <code>not-allowed</code>)
  </>,
  'The cursor (where the pointer hovers).',
];

const inputRefRow: PropRow = [
  'inputRef',
  'Ref<HTMLInputElement>',
  undefined,
  <>
    A ref to access the hidden <code>{'<input>'}</code> element.
  </>,
];

export const checkboxRootRows: readonly PropRow[] = [
  [
    'checked',
    'boolean',
    undefined,
    <>
      Whether the checkbox is currently ticked. To render an uncontrolled
      checkbox, use the <code>defaultChecked</code> prop instead.
    </>,
  ],
  [
    'defaultChecked',
    'boolean',
    code('false'),
    <>
      Whether the checkbox is initially ticked. To render a controlled checkbox,
      use the <code>checked</code> prop instead.
    </>,
  ],
  [
    'onCheckedChange',
    '(checked: boolean, eventDetails) => void',
    undefined,
    'Event handler called when the checkbox is ticked or unticked.',
  ],
  [
    'indeterminate',
    'boolean',
    code('false'),
    'Whether the checkbox is in a mixed state: neither ticked, nor unticked. Shown as a dash.',
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
    'Whether the user should be unable to tick or untick the checkbox.',
  ],
  [
    'required',
    'boolean',
    code('false'),
    'Whether the user must tick the checkbox before submitting a form.',
  ],
  [
    'name',
    'string',
    undefined,
    'Identifies the field when a form is submitted.',
  ],
  [
    'value',
    'string',
    undefined,
    <>
      The checkbox’s value. Identifies it within a <code>CheckboxGroup</code>,
      falling back to <code>name</code> when omitted. When submitting a form, a
      checked box submits <code>value</code>; with no <code>value</code>, it
      submits the native <code>on</code>.
    </>,
  ],
  [
    'uncheckedValue',
    'string',
    undefined,
    'The value submitted with the form when the checkbox is unchecked. By default, unchecked checkboxes do not submit any value, matching native checkbox behavior.',
  ],
  [
    'form',
    'string',
    undefined,
    'Identifies the form that owns the hidden input. Useful when the checkbox is rendered outside the form.',
  ],
  [
    'parent',
    'boolean',
    code('false'),
    <>
      Whether the checkbox controls a group of child checkboxes. Must be used in
      a <code>CheckboxGroup</code>.
    </>,
  ],
  ['id', 'string', undefined, 'The id of the input element.'],
  inputRefRow,
  cursorRow,
  [
    'children',
    'ReactNode',
    'a checkmark (mixed: a dash) in a Checkbox.Indicator',
    'What the circle shows while ticked (or mixed): by default, the checkmark and the dash.',
  ],
  nativeButtonRow(false),
  ...baseUiRows('span', 'HTMLElement'),
];

export const checkboxIndicatorRows: readonly PropRow[] = [
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Whether to keep the element in the DOM when the checkbox is not checked.',
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const radioRootRows: readonly PropRow[] = [
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
  inputRefRow,
  cursorRow,
  [
    'children',
    'ReactNode',
    'a checkmark in a Radio.Indicator',
    'What the circle shows while chosen: by default, the checkmark.',
  ],
  nativeButtonRow(false),
  ...baseUiRows('span', 'HTMLElement'),
];

export const radioIndicatorRows: readonly PropRow[] = [
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Whether to keep the HTML element in the DOM when the radio button is inactive.',
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const checkboxGroupRows: readonly PropRow[] = [
  [
    'value',
    'string[]',
    undefined,
    <>
      Names of the checkboxes in the group that should be ticked. To render an
      uncontrolled checkbox group, use the <code>defaultValue</code> prop
      instead.
    </>,
  ],
  [
    'defaultValue',
    'string[]',
    undefined,
    <>
      Names of the checkboxes in the group that should be initially ticked. To
      render a controlled checkbox group, use the <code>value</code> prop
      instead.
    </>,
  ],
  [
    'onValueChange',
    '(value: string[], eventDetails) => void',
    undefined,
    'Event handler called when a checkbox in the group is ticked or unticked. Provides the new value as an argument.',
  ],
  [
    'allValues',
    'string[]',
    undefined,
    'Names of all checkboxes in the group. Use this when creating a parent checkbox.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const radioGroupRows: readonly PropRow[] = [
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
      prop instead.
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
  inputRefRow,
  ...baseUiRows('div', 'HTMLDivElement'),
];
