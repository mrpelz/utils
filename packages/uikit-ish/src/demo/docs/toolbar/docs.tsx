import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  renderRows,
  secondaryClickRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

const glassContexts = union(
  'bright',
  'dim',
  'background-bright',
  'background-dim',
  'adaptive',
);

const disabledRow = (what: string): PropRow => [
  'disabled',
  'boolean',
  code('false'),
  <>
    When <code>true</code> {what} disabled.
  </>,
];

const focusableWhenDisabledRow: PropRow = [
  'focusableWhenDisabled',
  'boolean',
  code('true'),
  <>
    When <code>true</code> the item remains focusable when disabled.
  </>,
];

export const toolbarRootRows: readonly PropRow[] = [
  [
    'placement',
    union('block-end', 'block-start'),
    code(union('block-end')),
    <>
      Where the bar sits: at the bottom (48px capsules, with room for the home
      indicator below), or at the top as a navigation bar (44px capsules; see{' '}
      <a href={publicUrl('header')}>Header</a>).
    </>,
  ],
  [
    'context',
    glassContexts,
    <>
      <code>bright</code>, or <code>dim</code> in dark mode
    </>,
    <>
      How bright the content behind the bar’s glass is: a plain page, or a
      background of the app’s own (for example a picture). <code>adaptive</code>{' '}
      follows what’s behind it, sampled as it scrolls or resizes.
    </>,
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    <>
      When <code>true</code> all toolbar items are disabled.
    </>,
  ],
  [
    'loopFocus',
    'boolean',
    code('true'),
    <>
      If <code>true</code>, using keyboard navigation will wrap focus to the
      other end of the toolbar once the end is reached.
    </>,
  ],
  [
    'orientation',
    union('horizontal', 'vertical'),
    code(union('horizontal')),
    'The orientation of the toolbar. It sets the arrow keys; the bar is laid out in a row either way.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

const sideRows = (side: string): readonly PropRow[] => [
  [
    'children',
    'ReactNode',
    undefined,
    `The bar’s ${side} capsules: buttons on their own, or groups.`,
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const toolbarLeadingRows: readonly PropRow[] = sideRows('leading');

export const toolbarTrailingRows: readonly PropRow[] = sideRows('trailing');

export const toolbarSpacerRows: readonly PropRow[] = elementRows(
  'div',
  'HTMLDivElement',
);

export const toolbarGroupRows: readonly PropRow[] = [
  [
    'gap',
    'number | string',
    code('12'),
    <>
      The space between its buttons, not at its ends (a length, or a number in
      px; also <code>--uikit-toolbar-group-gap</code>).
    </>,
  ],
  [
    'prominent',
    'boolean',
    code('false'),
    'Tints the capsule, and turns its content white.',
  ],
  [
    'tint',
    'string',
    'the app’s tint',
    'The tinted capsule’s color. Setting it tints the capsule.',
  ],
  [
    'textColor',
    'string',
    'the glass’ (tinted: white)',
    <>
      Its content’s color, not blended (for example for a light{' '}
      <code>tint</code>).
    </>,
  ],
  disabledRow('all toolbar items in the group are'),
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const toolbarButtonRows: readonly PropRow[] = [
  [
    'prominent',
    'boolean',
    code('false'),
    <>
      On its own (not in a{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Group"
      >
        Group
      </PartLink>
      ), it gets tinted glass (<code>variant=&quot;glass-prominent&quot;</code>
      ).
    </>,
  ],
  [
    'variant',
    union(
      'glass',
      'glass-prominent',
      'borderless',
      'bordered',
      'bordered-secondary',
      'bordered-prominent',
    ),
    <>
      <code>glass</code> (in a group: the capsule’s)
    </>,
    <>
      A <a href={publicUrl('button')}>Button</a>’s variant. On its own, any of
      them. In a group, only the classic ones, because the glass is the
      capsule’s.
    </>,
  ],
  [
    'shape',
    union('capsule', 'circle', 'roundedRectangle'),
    code(union('capsule')),
    <>
      <code>circle</code> suits a symbol (36px in a group, 48px on its own, 44px
      at the top).
    </>,
  ],
  [
    'size',
    union('large', 'medium', 'small'),
    undefined,
    'Its size, on its own in a classic variant. Glass buttons take the bar’s size, and buttons in a group the capsule’s.',
  ],
  [
    'context',
    glassContexts,
    'the bar’s',
    'On its own, how bright it is behind its glass. In a group, the capsule’s applies.',
  ],
  [
    'tint',
    'string',
    'the primary color',
    <>
      Its color: its label or symbol, or its glass when tinted.{' '}
      <code>destructive</code> wins over it.
    </>,
  ],
  ['destructive', 'boolean', code('false'), 'Tints the button red.'],
  [
    'fill',
    'boolean',
    code('false'),
    'Grows to fill the free space, for example of its capsule or of the bar.',
  ],
  [
    'cursor',
    'string',
    <>
      <code>pointer</code> (disabled: <code>not-allowed</code>)
    </>,
    'The cursor shown while the pointer hovers it.',
  ],
  secondaryClickRow,
  disabledRow('the item is'),
  focusableWhenDisabledRow,
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLButtonElement'),
];

export const toolbarTitleRows: readonly PropRow[] = [
  [
    'alignStart',
    'boolean',
    code('false'),
    'Aligns it to the bar’s start, taking the free space. Otherwise, it’s centered in the bar.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The title (for example a <code>{'<span>'}</code>, truncated), and an
      optional{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Subtitle"
      />
      .
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const toolbarSubtitleRows: readonly PropRow[] = [
  ['children', 'ReactNode', undefined, 'The subtitle, below the title.'],
  ...renderRows('span', 'HTMLElement'),
];

export const toolbarSeparatorRows: readonly PropRow[] = [
  [
    'orientation',
    union('horizontal', 'vertical'),
    'the opposite of the toolbar’s',
    'The orientation of the separator. Defaults to the opposite of the toolbar’s orientation, so a horizontal toolbar renders vertical separators.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const toolbarLinkRows: readonly PropRow[] = [
  ['href', 'string', undefined, 'The link’s destination.'],
  ...baseUiRows('a', 'HTMLAnchorElement'),
];

export const toolbarInputRows: readonly PropRow[] = [
  [
    'defaultValue',
    'string | number | readonly string[]',
    undefined,
    'The uncontrolled value.',
  ],
  disabledRow('the item is'),
  focusableWhenDisabledRow,
  ...baseUiRows('input', 'HTMLInputElement'),
];
