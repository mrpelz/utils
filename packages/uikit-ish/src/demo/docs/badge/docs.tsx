import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const badgeRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'A count or a short text (“New”), in a capsule (a circle for a digit); without any, a dot (e.g. unread).',
  ],
  [
    'placement',
    union('corner', 'inline', 'symbol'),
    code(union('corner')),
    <>
      On its element’s top end corner (24px; its element positioned, e.g. an{' '}
      <a href="avatar">Avatar</a>), inline (e.g. a list row’s detail), or on a
      symbol (a child of a <a href="symbol">Symbol</a>, 16px, its text 10px
      semibold).
    </>,
  ],
  ['tint', 'string (a CSS color)', 'system red', 'Its color.'],
  [
    'textColor',
    'string (a CSS color)',
    'white',
    'Its text color (e.g. over a light tint).',
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];
