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
      The initially selected row’s value (uncontrolled). To render a controlled
      column, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(value: number | string, eventDetails) => void',
    undefined,
    <>
      Called with the newly selected value once the column settled, and why (
      <code>reason</code>): <code>scroll</code> (touch, wheel, a drag),{' '}
      <code>keyboard</code>, <code>item-press</code>, or <code>input</code> (a
      typed value).
    </>,
  ],
  [
    'onHighlightChange',
    '(value: number | string, eventDetails) => void',
    undefined,
    'Called as rows pass the center while scrolling (e.g. for haptics), and why.',
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
    'Disables the column: it can’t be scrolled or focused.',
  ],
  [
    'editable',
    'boolean',
    code('false'),
    <>
      Pressing the selected row (or typing a digit, or Enter, while focused)
      enters a value as text, with a numeric keyboard: the row whose text (or
      number) it is gets selected.
    </>,
  ],
  [
    'loop',
    'boolean',
    code('false'),
    'Its rows repeat endlessly (e.g. a time’s): scrolled past the last row, the first follows.',
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name (a listbox), e.g. “Hours”; also its typed value’s field’s.',
  ],
  [
    'aria-labelledby',
    'string',
    undefined,
    'The id of an element naming it, instead.',
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
    'Its scroller’s (the listbox), not its frame’s.',
  ],
  ...elementRows('div', 'HTMLDivElement').filter(([name]) => name !== 'ref'),
];

export const rollItemRows: readonly PropRow[] = [
  [
    'value',
    'number | string',
    undefined,
    'The row’s value (required): what its column selects.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Shown, but not selectable: settled on it a moment, the column moves on to the nearest enabled row.',
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
    'Text between columns, at the band (e.g. “:”).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
