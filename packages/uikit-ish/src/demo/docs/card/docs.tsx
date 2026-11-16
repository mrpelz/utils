import {
  code,
  elementRows,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const cardRootRows: readonly PropRow[] = [
  [
    'active',
    'boolean',
    code('false'),
    'Whether it’s bright, as a card whose switch is on. For a card without a switch, for example a group of lights with at least one of them on. A switch in it that’s on makes it bright too.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its parts (<PartLink part="Card.Symbol" />, <PartLink part="Card.Title" />
      , <PartLink part="Card.Value" />
      ), and a control filling it: a{' '}
      <PartLink
        component="switch"
        part="Switch.Root"
      />{' '}
      or a{' '}
      <PartLink
        component="slider"
        part="Slider.Root"
      />
      , styled by the card.
    </>,
  ],
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    <>
      With a switch in it, pass its clicks on to it with{' '}
      <PartLink
        component="list"
        part="forwardClick"
      />{' '}
      (its selector <code>[role=switch]</code>), so a press anywhere on the card
      toggles it. With it, the card is pressable as a whole: a faint tint while
      it’s hovered, a stronger one while it’s pressed.
    </>,
  ],
  ...renderRows('div', 'HTMLDivElement'),
];

export const cardCornerButtonRows: readonly PropRow[] = [
  [
    'icon',
    'SymbolIcon',
    undefined,
    <>
      Its icon: one of <PartLink part="cardIcons" />, or the app’s own (for
      example an SF Symbol).
    </>,
  ],
  [
    'corner',
    'GridCorner',
    code('"bottom-trailing"'),
    'The corner it’s in: top-leading, top-trailing, bottom-leading or bottom-trailing.',
  ],
  [
    'visible',
    'boolean',
    code('true'),
    'Whether it’s shown, outside edit mode. In edit mode it’s always hidden: faded out, it can’t be pressed or focused.',
  ],
  [
    'mirrored',
    'boolean',
    code('false'),
    'Whether its icon is flipped in a right-to-left layout. Set it for an icon that points somewhere, such as the expand triangle.',
  ],
  [
    'onClick',
    '(event) => void',
    undefined,
    'What a press does: going to a page, expanding the card, opening it above the page. The press stays its own: it doesn’t reach the card’s onClick.',
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example “Living Room details”. It has no default.',
  ],
  ...renderRows('button', 'HTMLButtonElement'),
];

export const cardIconsRows: readonly PropRow[] = [
  [
    'drillIn',
    'SymbolIcon',
    undefined,
    'A ring: a press goes to a page of its own.',
  ],
  [
    'expand',
    'SymbolIcon',
    undefined,
    'A filled triangle pointing to the bottom trailing corner: a press makes the card larger in place.',
  ],
  [
    'collapse',
    'SymbolIcon',
    undefined,
    'The same triangle pointing to the top leading corner: on an expanded card, a press makes it small again.',
  ],
  [
    'overlay',
    'SymbolIcon',
    undefined,
    'A filled rounded square: a press opens the card above the page.',
  ],
  [
    'close',
    'SymbolIcon',
    undefined,
    <>
      An x, the grid’s (
      <PartLink
        component="grid"
        part="gridIcons"
      />
      ’s <code>remove</code>): a press closes the card opened above the page.
    </>,
  ],
];

export const cardSymbolRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The symbol, for example a{' '}
      <PartLink
        component="symbol"
        part="Symbol"
      />
      .
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const cardTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What the card is about, for example a device’s name. Two lines at most.',
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const cardValueRows: readonly PropRow[] = [
  [
    'value',
    'number',
    undefined,
    <>
      A number, formatted by <code>Intl.NumberFormat</code> with{' '}
      <code>format</code> and <code>locale</code>. Without it, the children are
      shown.
    </>,
  ],
  [
    'format',
    'Intl.NumberFormatOptions',
    undefined,
    <>
      How the number is formatted. The unit (for example{' '}
      <code>{'{ style: "unit", unit: "celsius" }'}</code>, or{' '}
      <code>{'{ style: "percent" }'}</code>), the decimal places and the
      notation are the app’s to choose.
    </>,
  ],
  [
    'locale',
    'Intl.LocalesArgument',
    'the document’s language',
    'The locale the number is formatted for.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What it shows when there’s no number, for example a state: “Locked”.',
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const cardSizesRows: readonly PropRow[] = [
  [
    'binaryDisplay',
    'GridSize[]',
    code('["1x1", "2x1"]'),
    'A state shown, for example a lock.',
  ],
  ['binaryControl', 'GridSize[]', code('["1x1", "2x1"]'), 'A switch.'],
  [
    'numericalDisplay',
    'GridSize[]',
    code('["1x1", "2x1", "2x2"]'),
    'A number shown, for example a temperature. At 2x2, it’s large.',
  ],
  [
    'numericalControl',
    'GridSize[]',
    code('["2x1", "3x1", "1x2", "1x3"]'),
    'A slider. Never square, so it always has a direction.',
  ],
];

export const cardUseCardOrientationRows: readonly PropRow[] = [
  [
    '(returns)',
    union('horizontal', 'vertical'),
    code('"horizontal"'),
    <>
      Its tile’s shape: wider than tall (or square) is horizontal. Outside a
      grid, horizontal. Pass it to a slider’s <code>orientation</code>.
    </>,
  ],
];
