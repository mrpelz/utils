import {
  baseUiRows,
  code,
  elementRows,
  PropRow,
  union,
} from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

const disabledRow: PropRow = [
  'disabled',
  'boolean',
  code('false'),
  <>
    Whether the component should ignore user interaction. Takes precedence over
    the <code>disabled</code> prop on the{' '}
    <PartLink
      component="text-field"
      part="TextField.Control"
    />{' '}
    component (its parts dimmed, 55%).
  </>,
];

export const textFieldRootRows: readonly PropRow[] = [
  disabledRow,
  [
    'name',
    'string',
    undefined,
    <>
      Identifies the field when a form is submitted. Takes precedence over the{' '}
      <code>name</code> prop on the{' '}
      <PartLink
        component="text-field"
        part="TextField.Control"
      />{' '}
      component.
    </>,
  ],
  [
    'validate',
    '(value, formValues) => string | string[] | null | void | Promise<…>',
    undefined,
    <>
      A function for custom validation. Return a string or an array of strings
      with the error message(s) if the value is invalid. Returning nothing,{' '}
      <code>null</code>, an empty string, or an empty array means the value is
      valid. Asynchronous functions are supported, but they do not prevent form
      submission when using <code>validationMode=&quot;onSubmit&quot;</code>.
    </>,
  ],
  [
    'validationMode',
    union('onSubmit', 'onBlur', 'onChange'),
    code(union('onSubmit')),
    <>
      Determines when the field should be validated: when the form is submitted
      (and on change after it), when the control loses focus, or on every
      change. Takes precedence over the <code>validationMode</code> prop on{' '}
      <PartLink
        component="form"
        part="Form"
      />
      .
    </>,
  ],
  [
    'validationDebounceTime',
    'number',
    code('0'),
    <>
      How long to wait between <code>validate</code> callbacks if{' '}
      <code>validationMode=&quot;onChange&quot;</code> is used. Specified in
      milliseconds.
    </>,
  ],
  [
    'invalid',
    'boolean',
    undefined,
    'Whether the field is invalid. Useful when the field state is controlled by an external library.',
  ],
  [
    'dirty',
    'boolean',
    undefined,
    'Whether the field’s value has been changed from its initial value. Useful when the field state is controlled by an external library.',
  ],
  [
    'touched',
    'boolean',
    undefined,
    'Whether the field has been touched. Useful when the field state is controlled by an external library.',
  ],
  [
    'actionsRef',
    'RefObject<{ validate: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>validate</code> validates the field
      when called.
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} A{' '}
            <PartLink
              component="list"
              part="List.Item"
            >
              {'<List.Item />'}
            </PartLink>
            : the field as a list row (its label the row’s title).
          </>,
        ]
      : row,
  ),
];

export const textFieldLabelRows: readonly PropRow[] = [
  [
    'nativeLabel',
    'boolean',
    code('true'),
    <>
      Whether the component renders a native <code>{'<label>'}</code> element
      when replacing it via the <code>render</code> prop. Set to{' '}
      <code>false</code> if the rendered element is not a label (for example,{' '}
      <code>{'<div>'}</code>).
    </>,
  ],
  ['children', 'ReactNode', undefined, 'The label’s text.'],
  ...baseUiRows('label', 'HTMLLabelElement'),
];

export const textFieldControlRows: readonly PropRow[] = [
  [
    'value',
    'string | number | readonly string[]',
    undefined,
    <>
      The controlled value (with <code>onValueChange</code>).
    </>,
  ],
  [
    'defaultValue',
    'string | number | readonly string[]',
    undefined,
    'The uncontrolled value.',
  ],
  [
    'onValueChange',
    '(value: string, eventDetails) => void',
    undefined,
    <>
      Callback fired when the <code>value</code> changes. Use when controlled.
    </>,
  ],
  [
    'placeholder',
    'string',
    undefined,
    'Shown while empty (in the placeholder color); in a row without a label, its only name: give it an aria-label too.',
  ],
  [
    'type',
    'string',
    code(union('text')),
    <>
      The input’s type: its keyboard (<code>email</code>, <code>tel</code>,{' '}
      <code>url</code>, <code>number</code>), its validation, a native picker (
      dates and times).
    </>,
  ],
  [
    'list',
    'string',
    undefined,
    <>
      The id of a <code>{'<datalist>'}</code>: its options as suggestions.
    </>,
  ],
  ...baseUiRows('input', 'HTMLInputElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} A <code>{'<textarea />'}</code>: several lines (three,
            growing with its text where supported).
          </>,
        ]
      : row,
  ),
];

export const textFieldDescriptionRows: readonly PropRow[] = [
  ['children', 'ReactNode', undefined, 'The description, below the control.'],
  ...baseUiRows('p', 'HTMLParagraphElement'),
];

export const textFieldErrorRows: readonly PropRow[] = [
  [
    'match',
    'boolean | keyof ValidityState',
    undefined,
    <>
      Determines whether to show the error message according to the field’s{' '}
      <code>ValidityState</code> (e.g. <code>valueMissing</code>,{' '}
      <code>typeMismatch</code>, <code>customError</code>). Specifying{' '}
      <code>true</code> will always show the error message, and lets external
      libraries control the visibility. Without it: whenever the field is
      invalid (or has a{' '}
      <PartLink
        component="form"
        part="Form"
      />
      ’s error).
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'The error message, below the control (and its description). Without it: the field’s message (validate’s, the browser’s, or the form’s errors).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const textFieldClearRows: readonly PropRow[] = [
  [
    'mode',
    union('always', 'unlessEditing', 'whileEditing'),
    code(union('whileEditing')),
    'When it’s shown (UIKit clearButtonMode), only ever while the field is filled: while the field is focused, while it isn’t, or either way.',
  ],
  [
    'children',
    'ReactNode',
    'a circled cross',
    'Its glyph (17px, in the tertiary label color).',
  ],
  ['aria-label', 'string', code('Clear text'), 'Its accessible name.'],
  [
    'onClick',
    'MouseEventHandler<HTMLButtonElement>',
    undefined,
    <>
      Called before it empties the control; <code>preventDefault()</code> keeps
      the value.
    </>,
  ],
  ...elementRows('button', 'HTMLButtonElement'),
];

export const textFieldSearchRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content: a <a href="symbol">Symbol</a> (a magnifier), a{' '}
      <PartLink
        component="text-field"
        part="TextField.Control"
      />
      , a{' '}
      <PartLink
        component="text-field"
        part="TextField.Clear"
      />{' '}
      (and e.g. a dictation button).
    </>,
  ],
  ...elementRows('label', 'HTMLLabelElement'),
];

export const textFieldValidityRows: readonly PropRow[] = [
  [
    'children',
    '(state: { validity, errors, error, value, initialValue, transitionStatus }) => ReactNode',
    undefined,
    'A function that accepts the field validity state as an argument.',
  ],
];

export const textFieldItemRows: readonly PropRow[] = [
  [
    'disabled',
    'boolean',
    code('false'),
    <>
      Whether the wrapped control should ignore user interaction. The{' '}
      <code>disabled</code> prop on{' '}
      <PartLink
        component="text-field"
        part="TextField.Root"
      />{' '}
      takes precedence over this.
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];
