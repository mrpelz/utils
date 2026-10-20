import {
  baseUiRows,
  code,
  nativeButtonRow,
  PropRow,
} from '../guide/props-table.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const switchRootRows: readonly PropRow[] = [
  [
    'checked',
    'boolean',
    undefined,
    <>
      Whether the switch is currently active. To render an uncontrolled switch,
      use the <code>defaultChecked</code> prop instead.
    </>,
  ],
  [
    'defaultChecked',
    'boolean',
    code('false'),
    <>
      Whether the switch is initially active. To render a controlled switch, use
      the <code>checked</code> prop instead.
    </>,
  ],
  [
    'onCheckedChange',
    '(checked: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the switch is activated or deactivated (with
      Base UI’s event details, e.g. the <code>reason</code>).
    </>,
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    <>
      Whether the component should ignore user interaction. Dimmed (55%
      opacity), its cursor <code>not-allowed</code>.
    </>,
  ],
  [
    'readOnly',
    'boolean',
    code('false'),
    'Whether the user should be unable to activate or deactivate the switch. It looks as usual.',
  ],
  [
    'required',
    'boolean',
    code('false'),
    'Whether the user must activate the switch before submitting a form.',
  ],
  [
    'indeterminate',
    'boolean',
    code('false'),
    <>
      Neither on nor off: the knob in the middle, the track off; its hidden
      input is indeterminate too. Toggling still flips <code>checked</code>.
      E.g. while a change is being saved.
    </>,
  ],
  [
    'onOffLabels',
    'boolean',
    code('false'),
    'Shows “I” and “O” on the track, beside the knob (UIKit’s accessibility setting “On/Off Labels”).',
  ],
  [
    'tint',
    'string (a CSS color)',
    'system green',
    <>
      The track’s color while on, and the pressed knob’s glow (UIKit{' '}
      <code>onTintColor</code>).
    </>,
  ],
  [
    'cursor',
    'string (a CSS cursor)',
    <>
      <code>pointer</code> (disabled: <code>not-allowed</code>)
    </>,
    'The cursor (where the pointer hovers).',
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
    code('on'),
    <>
      The value submitted with the form when the switch is on. By default,
      switch submits the <code>on</code> value, matching native checkbox
      behavior.
    </>,
  ],
  [
    'uncheckedValue',
    'string',
    undefined,
    'The value submitted with the form when the switch is off. By default, unchecked switches do not submit any value, matching native checkbox behavior.',
  ],
  [
    'form',
    'string',
    undefined,
    'Identifies the form that owns the hidden input. Useful when the switch is rendered outside the form.',
  ],
  [
    'id',
    'string',
    undefined,
    <>
      The id of the hidden input element. When <code>nativeButton</code> is{' '}
      <code>true</code>, the id is applied to the root element.
    </>,
  ],
  [
    'inputRef',
    'Ref<HTMLInputElement>',
    undefined,
    <>
      A ref to access the hidden <code>{'<input>'}</code> element.
    </>,
  ],
  nativeButtonRow(false),
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const switchThumbRows: readonly PropRow[] = baseUiRows(
  'span',
  'HTMLElement',
);
