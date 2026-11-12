import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  secondaryClickRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

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
      Its style: a label on its own (<code>borderless</code>), on a gray fill (
      <code>bordered</code>, or <code>-secondary</code> with its label in the
      label color), on the tint (<code>bordered-prominent</code>), or glass (
      <code>glass</code>, or <code>glass-prominent</code>, tinted).
    </>,
  ],
  [
    'size',
    union('large', 'medium', 'small'),
    <>
      medium (<code>borderless</code>: its context’s text style)
    </>,
    'Its size: 28px, 34px or 50px tall (in Subheadline, or Body when large). It doesn’t apply to glass variants, which are 48px tall.',
  ],
  [
    'shape',
    union('capsule', 'circle', 'roundedRectangle'),
    code(union('capsule')),
    <>
      <code>circle</code>: square and round, for a symbol on its own.{' '}
      <code>roundedRectangle</code>: 6px corners (12px when large).
    </>,
  ],
  [
    'tint',
    'string',
    'the primary color',
    <>
      Its color, for labels, fills and tinted glass. <code>destructive</code>{' '}
      wins over it.
    </>,
  ],
  [
    'textColor',
    'string',
    'its variant’s',
    <>
      Its label’s and symbols’ color, over its variant’s (for example for a
      light <code>tint</code> behind them). On glass, it isn’t blended.
    </>,
  ],
  ['destructive', 'boolean', code('false'), 'Tints the button red.'],
  [
    'fill',
    'boolean',
    code('false'),
    'Grows to fill the available width (as a block, or as a flex item sharing a row’s free space), with its content centered.',
  ],
  [
    'context',
    union('bright', 'dim', 'background-bright', 'background-dim', 'adaptive'),
    <>
      <code>bright</code>, or <code>dim</code> in dark mode
    </>,
    <>
      For glass variants, how bright it is behind the glass (a plain page, or a
      background of the app’s own). <code>adaptive</code> follows what’s behind
      it, sampled as it scrolls or resizes.
    </>,
  ],
  [
    'cursor',
    'string',
    <>
      <code>pointer</code> (disabled: <code>not-allowed</code>)
    </>,
    'The cursor shown while the pointer hovers it.',
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLElement>',
    undefined,
    <>
      Its action. Without one (and without <code>onSecondaryClick</code>), a
      button is disabled, unless its <code>type</code> is <code>submit</code> or{' '}
      <code>reset</code>. <code>disabled={'{false}'}</code> keeps it enabled.
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
      Its content: a{' '}
      <PartLink
        component="button"
        part="Button.Icon"
      />
      , a{' '}
      <PartLink
        component="button"
        part="Button.Label"
      />
      , or both (in their order).
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
      The glyph: a <a href={publicUrl('symbol')}>Symbol</a>, with its badge if
      it has one.
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const buttonLabelRows: readonly PropRow[] = [
  ['children', 'ReactNode', undefined, 'The label’s text, which truncates.'],
  ...elementRows('span', 'HTMLSpanElement'),
];
