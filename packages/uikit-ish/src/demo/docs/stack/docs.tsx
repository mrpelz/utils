import {
  code,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const stackRows: readonly PropRow[] = [
  [
    'axis',
    union('vertical', 'horizontal'),
    code('vertical'),
    'Its direction: its children one below another, or side by side.',
  ],
  [
    'spacing',
    union('small', 'medium', 'large', 'xLarge'),
    code('large'),
    <>
      The space between its children: 8px, 12px, 16px or 32px. Each step is a
      token (<code>--uikit-spacing-small</code>,{' '}
      <code>--uikit-spacing-medium</code>, <code>--uikit-spacing-large</code>,{' '}
      <code>--uikit-spacing-x-large</code>), so an app can change the scale.
    </>,
  ],
  [
    'align',
    union('stretch', 'start', 'center', 'end', 'baseline'),
    code('stretch'),
    'Its children across its axis: stretched, at its start, center or end, or (in a row) lined up on their text’s baseline.',
  ],
  [
    'justify',
    union('start', 'center', 'end', 'spaceBetween'),
    code('start'),
    'Its children along its axis: at its start, center or end, or spread out with the space between them.',
  ],
  [
    'wrap',
    'boolean',
    code('false'),
    'Lets its children wrap onto more lines when they don’t fit (for a row).',
  ],
  [
    'inset',
    'boolean',
    code('false'),
    <>
      Adds the content margin at its sides (
      <code>--uikit-content-margin-inline</code>, 16px), the same inset a list’s
      groups have. Use it for a page’s content that isn’t a list.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What it lays out: any components, each one a child.',
  ],
  ...renderRows('div', 'HTMLDivElement'),
];
