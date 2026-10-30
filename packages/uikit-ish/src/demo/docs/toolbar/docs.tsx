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
      Where the bar is: at the bottom (48px capsules, the home indicator’s space
      below), or at the top (a navigation bar: 44px capsules; see{' '}
      <a href="header">Header</a>).
    </>,
  ],
  [
    'context',
    glassContexts,
    <>
      <code>bright</code>, or <code>dim</code> in dark mode
    </>,
    <>
      Brightness of the content behind the bar’s glass: a plain page, or a
      background of the app’s (e.g. a picture); <code>adaptive</code>: by what’s
      behind it (sampled as it scrolls or resizes).
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
    'The orientation of the toolbar (its arrow keys; laid out in a row either way).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

const sideRows = (side: string): readonly PropRow[] => [
  [
    'children',
    'ReactNode',
    undefined,
    `The bar’s ${side} capsules: buttons of their own, groups.`,
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
      The space between its buttons (a length; a number: px), not at its ends
      (also <code>--uikit-toolbar-group-gap</code>).
    </>,
  ],
  [
    'prominent',
    'boolean',
    code('false'),
    'A tinted capsule, its content white.',
  ],
  [
    'tint',
    'string',
    'the app’s tint',
    'The tinted capsule’s color (given, the capsule is tinted).',
  ],
  [
    'textColor',
    'string',
    'the glass’ (tinted: white)',
    <>
      Its content’s color (e.g. for a light <code>tint</code>; unblended).
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
      Of its own (not in a{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Group"
      >
        Group
      </PartLink>
      ): tinted glass (<code>variant=&quot;glass-prominent&quot;</code>).
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
      A <a href="button">Button</a>’s variant. Of its own, any; in a group, the
      classic ones only (the glass is the capsule’s).
    </>,
  ],
  [
    'shape',
    union('capsule', 'circle', 'roundedRectangle'),
    code(union('capsule')),
    <>
      <code>circle</code>: for a symbol (36px in a group, 48px of its own; top:
      44px).
    </>,
  ],
  [
    'size',
    union('large', 'medium', 'small'),
    undefined,
    'Of its own, in a classic variant: its size (glass ones are the bar’s; in a group: the capsule’s).',
  ],
  [
    'context',
    glassContexts,
    'the bar’s',
    'Of its own: the brightness behind its glass (in a group: the capsule’s).',
  ],
  [
    'tint',
    'string',
    'the primary color',
    <>
      Its color (its label or symbol; tinted glass). <code>destructive</code>{' '}
      wins.
    </>,
  ],
  ['destructive', 'boolean', code('false'), 'Tints the button red.'],
  [
    'fill',
    'boolean',
    code('false'),
    'Grows to fill the free space (e.g. of its capsule, or of the bar).',
  ],
  [
    'cursor',
    'string',
    <>
      <code>pointer</code> (disabled: <code>not-allowed</code>)
    </>,
    'The cursor (where the pointer hovers).',
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
    'Aligned to the bar’s start, taking its free space; otherwise centered in the bar.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The title (e.g. a <code>{'<span>'}</code>, truncated), and an optional{' '}
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
