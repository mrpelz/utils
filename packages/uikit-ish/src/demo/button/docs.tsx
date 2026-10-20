import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  secondaryClickRow,
  union,
} from '../guide/props-table.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const buttonRootRows: readonly PropRow[] = [
  [
    'variant',
    union(
      'borderless',
      'bordered',
      'bordered-secondary',
      'bordered-prominent',
      'glass',
      'glass-prominent',
    ),
    code(union('borderless')),
    <>
      Figma “Style”: a label alone (<code>borderless</code>), on a gray fill (
      <code>bordered</code>; <code>-secondary</code>, its label in the label
      color), on the tint (<code>bordered-prominent</code>); Liquid Glass (
      <code>glass</code>; <code>glass-prominent</code>, tinted).
    </>,
  ],
  [
    'size',
    union('large', 'medium', 'small'),
    <>
      medium (<code>borderless</code>: its context’s text style)
    </>,
    'Figma “Size”: 28px, 34px or 50px high (Subheadline; large: Body). Not for glass variants, 48px high.',
  ],
  [
    'shape',
    union('capsule', 'circle', 'roundedRectangle'),
    code(union('capsule')),
    <>
      <code>circle</code>: square and round, for a symbol alone;{' '}
      <code>roundedRectangle</code>: 6px corners (large: 12px).
    </>,
  ],
  [
    'tint',
    'string',
    'the primary color',
    <>
      Its color (labels, fills, tinted glass; UIKit <code>tintColor</code>).{' '}
      <code>destructive</code> wins.
    </>,
  ],
  [
    'textColor',
    'string',
    'its variant’s',
    <>
      Its label’s and symbols’ color, over its variant’s (e.g. for a light{' '}
      <code>tint</code> behind them; unblended on glass).
    </>,
  ],
  [
    'destructive',
    'boolean',
    code('false'),
    'Figma “Destructive”: tints the button red.',
  ],
  [
    'fill',
    'boolean',
    code('false'),
    'Grows to fill the available width (a block, or a flex item sharing a row’s free space), its content centered.',
  ],
  [
    'context',
    union('bright', 'dim', 'background-bright', 'background-dim', 'adaptive'),
    <>
      <code>bright</code>, or <code>dim</code> in dark mode
    </>,
    <>
      Glass variants: the brightness behind the glass (a plain page, or a
      background of the app’s); <code>adaptive</code>: by what’s behind it
      (sampled as it scrolls or resizes).
    </>,
  ],
  [
    'cursor',
    'string',
    <>
      <code>pointer</code> (disabled: <code>not-allowed</code>)
    </>,
    'The cursor (where the pointer hovers).',
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Its action. Without one (nor <code>onSecondaryClick</code>), a button is
      disabled, unless its <code>type</code> is <code>submit</code> or{' '}
      <code>reset</code> (<code>disabled={'{false}'}</code> keeps it enabled).
    </>,
  ],
  secondaryClickRow,
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the button should ignore user interaction (dimmed: its variant’s disabled colors).',
  ],
  [
    'focusableWhenDisabled',
    'boolean',
    code('false'),
    'Whether the button should be focusable when disabled.',
  ],
  nativeButtonRow(true),
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content: a <code>Button.Icon</code>, a <code>Button.Label</code>, or
      both (in their order).
    </>,
  ],
  ...baseUiRows('button', 'HTMLButtonElement'),
];

export const buttonIconRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The glyph: a <a href="symbol">Symbol</a> (with its badge).
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const buttonLabelRows: readonly PropRow[] = [
  ['children', 'ReactNode', undefined, 'The label’s text, truncated.'],
  ...elementRows('span', 'HTMLSpanElement'),
];
