import {
  code,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const typographyRows: readonly PropRow[] = [
  [
    'textStyle',
    union(
      'largeTitle',
      'title1',
      'title2',
      'title3',
      'headline',
      'body',
      'callout',
      'subheadline',
      'footnote',
      'caption1',
      'caption2',
    ),
    code(union('body')),
    <>The text style: its size, line height, weight and tracking.</>,
  ],
  ['emphasized', 'boolean', code('false'), 'The style’s bold weight.'],
  ['italic', 'boolean', code('false'), 'Italic.'],
  [
    'color',
    union('primary', 'secondary', 'tertiary', 'quaternary'),
    'inherited',
    'A label color (label, secondary label, …).',
  ],
  [
    'textSize',
    union(
      'xSmall',
      'small',
      'medium',
      'large',
      'xLarge',
      'xxLarge',
      'xxxLarge',
      'ax1',
      'ax2',
      'ax3',
      'ax4',
      'ax5',
    ),
    'inherited (large)',
    <>
      The text size: of its text and of everything in it (the text styles’
      tokens, e.g. a list’s rows).
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its text (and anything sized with it, e.g. a Symbol).',
  ],
  ...renderRows('span', 'HTMLElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} E.g. a heading (<code>{'<h1 />'}</code>), a paragraph (
            <code>{'<p />'}</code>).
          </>,
        ]
      : row,
  ),
];
