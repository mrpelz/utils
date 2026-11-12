import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const rollRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its columns (
      <PartLink
        component="roll"
        part="Roll.Column"
      />
      ), side by side, and separators between them (
      <PartLink
        component="roll"
        part="Roll.Separator"
      />
      ).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const rollColumnRows: readonly PropRow[] = [
  [
    'value',
    'number | string',
    undefined,
    <>
      The selected row’s value (controlled). To render an uncontrolled column,
      use the <code>defaultValue</code> prop instead.
    </>,
  ],
  [
    'defaultValue',
    'number | string',
    undefined,
    <>
      The value of the row selected at first (uncontrolled). To render a
      controlled column, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(value: number | string, eventDetails) => void',
    undefined,
    <>
      Called with the newly selected value once the column has settled, and why
      (<code>reason</code>): <code>scroll</code> (touch, wheel, a drag),{' '}
      <code>keyboard</code>, <code>item-press</code>, or <code>input</code> (a
      typed value).
    </>,
  ],
  [
    'onHighlightChange',
    '(value: number | string, eventDetails) => void',
    undefined,
    'Called as rows pass the center while scrolling (for example for haptics), and why.',
  ],
  [
    'align',
    union('start', 'center', 'end'),
    code('center'),
    'The rows’ alignment in the column.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Disables the column: it’s dimmed, and can’t be scrolled or focused.',
  ],
  [
    'editable',
    'boolean',
    code('false'),
    <>
      Pressing the selected row (or typing a digit or Enter while it has focus)
      lets you type a value, with a numeric keyboard. The row with that text (or
      number) gets selected.
    </>,
  ],
  [
    'loop',
    'boolean',
    code('false'),
    'Its rows repeat endlessly (for example a time’s): past the last row, the first follows.',
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name (it’s a listbox), for example “Hours”. Its field for typed values gets it too.',
  ],
  [
    'aria-labelledby',
    'string',
    undefined,
    'The id of an element that names it instead.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its rows (
      <PartLink
        component="roll"
        part="Roll.Item"
      />
      ).
    </>,
  ],
  [
    'ref',
    'Ref<HTMLDivElement>',
    undefined,
    'Its scroller’s ref (the listbox’s), not its frame’s.',
  ],
  ...elementRows('div', 'HTMLDivElement').filter(([name]) => name !== 'ref'),
];

export const rollItemRows: readonly PropRow[] = [
  [
    'value',
    'number | string',
    undefined,
    'The row’s value (required), which is what its column selects.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Shows it, but makes it not selectable. When the column settles on it for a moment, it moves on to the nearest enabled row.',
  ],
  [
    'children',
    'ReactNode',
    <>
      its <code>value</code>, as text
    </>,
    'What the row shows.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const rollSeparatorRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Text between columns, at the band (for example “:”).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
