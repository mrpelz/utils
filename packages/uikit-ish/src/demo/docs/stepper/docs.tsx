import {
  baseUiRows,
  code,
  nativeButtonRow,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const stepperRootRows: readonly PropRow[] = [
  [
    'value',
    'number | null',
    undefined,
    <>
      The raw numeric value of the field. To render an uncontrolled stepper, use
      the <code>defaultValue</code> prop instead.
    </>,
  ],
  [
    'defaultValue',
    'number',
    undefined,
    <>
      The uncontrolled value of the field when it’s initially rendered. To
      render a controlled stepper, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(value: number | null, eventDetails) => void',
    undefined,
    <>
      Callback fired when the number value changes; its{' '}
      <code>eventDetails.reason</code> what triggered it, e.g.{' '}
      <code>increment-press</code>, <code>decrement-press</code> (a half),{' '}
      <code>keyboard</code> (arrow keys, Home, End), <code>wheel</code>.
    </>,
  ],
  [
    'onValueCommitted',
    '(value: number | null, eventDetails) => void',
    undefined,
    <>
      Callback fired when the value is committed: after{' '}
      <code>onValueChange</code>, when the pointer is released after pressing a
      half (with keys or the wheel, at the same time).
    </>,
  ],
  [
    'min',
    'number',
    undefined,
    'The minimum value: its decrement half disables there.',
  ],
  [
    'max',
    'number',
    undefined,
    'The maximum value: its increment half disables there.',
  ],
  [
    'step',
    union('number', 'any'),
    code('1'),
    <>
      Amount to increment and decrement with the halves and arrow keys.{' '}
      <code>any</code> disables step validation (stepping by 1).
    </>,
  ],
  [
    'smallStep',
    'number',
    code('0.1'),
    'The step while the alt key is held (arrow keys).',
  ],
  [
    'largeStep',
    'number',
    code('10'),
    'The step while the shift key is held (arrow keys).',
  ],
  [
    'snapOnStep',
    'boolean',
    code('false'),
    'Whether the value should snap to the nearest step when incrementing or decrementing.',
  ],
  [
    'allowOutOfRange',
    'boolean',
    code('false'),
    <>
      Whether a value set otherwise than by stepping (e.g. by the app) may be
      outside <code>min</code> and <code>max</code> without clamping; stepping
      still clamps.
    </>,
  ],
  [
    'allowWheelScrub',
    'boolean',
    code('false'),
    'Whether the mouse wheel steps the value while the stepper is focused and hovered.',
  ],
  [
    'format',
    'Intl.NumberFormatOptions',
    undefined,
    'Options to format the value: the input’s text, which assistive tech reads (e.g. a percentage).',
  ],
  [
    'locale',
    'Intl.LocalesArgument',
    'the user’s runtime locale',
    'The locale of the formatted value.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction; both halves dimmed.',
  ],
  [
    'readOnly',
    'boolean',
    code('false'),
    'Whether the user should be unable to change the value.',
  ],
  [
    'required',
    'boolean',
    code('false'),
    'Whether the user must enter a value before submitting a form.',
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
    'Identifies the form that owns the input. Useful when the stepper is rendered outside the form.',
  ],
  ['id', 'string', undefined, 'The id of the input element.'],
  [
    'inputRef',
    'Ref<HTMLInputElement>',
    undefined,
    'A ref to access the input element.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const stepperGroupRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The input and the halves:{' '}
      <PartLink
        component="stepper"
        part="Stepper.Input"
      />
      ,{' '}
      <PartLink
        component="stepper"
        part="Stepper.Decrement"
      />
      ,{' '}
      <PartLink
        component="stepper"
        part="Stepper.Increment"
      />
      .
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const stepperInputRows: readonly PropRow[] = [
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name (it has no visible label): what it counts, e.g. “Quantity”.',
  ],
  [
    'aria-roledescription',
    'string',
    code('Number field'),
    <>
      A user-friendly description of the input’s role for assistive tech: a role
      description, not an accessible name (use <code>aria-label</code>).
    </>,
  ],
  ...baseUiRows('input', 'HTMLInputElement'),
];

/** `Stepper.Decrement`, `Stepper.Increment`: a half of the capsule. */
export const stepperHalfRows = (sign: '−' | '+'): readonly PropRow[] => [
  ['children', 'ReactNode', <>“{sign}”</>, 'Its symbol.'],
  [
    'disabled',
    'boolean',
    code('false'),
    <>
      Whether the half ignores presses (dimmed); it also disables at{' '}
      <code>{sign === '−' ? 'min' : 'max'}</code>.
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
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLButtonElement'),
];
