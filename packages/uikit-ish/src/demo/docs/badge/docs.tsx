import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { publicUrl } from '../../tooling/public-url.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const badgeRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'A count or a short text (“New”), in a capsule (or a circle, for a single digit). Without any, it’s a dot (for example for unread).',
  ],
  [
    'placement',
    union('corner', 'inline', 'symbol'),
    code(union('corner')),
    <>
      On its element’s top end corner (24px, with the element positioned, for
      example an <a href={publicUrl('avatar')}>Avatar</a>), inline (for example
      in a list row’s detail), or on a symbol (as a child of a{' '}
      <a href={publicUrl('symbol')}>Symbol</a>, 16px, with 10px semibold text).
    </>,
  ],
  ['tint', 'string (a CSS color)', 'system red', 'Its color.'],
  [
    'textColor',
    'string (a CSS color)',
    'white',
    'Its text color (for example over a light tint).',
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];
