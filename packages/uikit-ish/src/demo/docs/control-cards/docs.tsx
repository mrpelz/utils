import { code, PropRow } from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

/** What every card takes: its name, its symbol, its extras, its root's. */
const cardRows: readonly PropRow[] = [
  [
    'label',
    'string',
    undefined,
    'What it is, for example a device’s name: its title, and its controls’ accessible name.',
  ],
  [
    'icon',
    'SymbolIcon',
    undefined,
    'Its symbol’s icon. For a card that’s on or off, the outlined one.',
  ],
  [
    'emphasizedIcon',
    'SymbolIcon',
    'its icon',
    'Its symbol’s icon while it’s on, for example the filled one.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What’s added after its parts, for example a{' '}
      <PartLink
        component="card"
        part="Card.ExpandButton"
      />{' '}
      or another{' '}
      <PartLink
        component="card"
        part="Card.CornerButton"
      />
      .
    </>,
  ],
  [
    '…',
    'CardRootProps',
    undefined,
    <>
      Its other props are its{' '}
      <PartLink
        component="card"
        part="Card.Root"
      />
      ’s: <code>context</code>, <code>actionsRef</code>, <code>onClick</code>,{' '}
      <code>className</code>, <code>style</code>, <code>render</code> and its{' '}
      <code>ref</code>.
    </>,
  ],
];

/** A composed card's rows: its parts as its children, then its root's. */
const composedCardRows = (parts: PropRow[3]): readonly PropRow[] => [
  ...cardRows.filter(([name]) => name !== 'children'),
  ['children', 'ReactNode', undefined, parts],
];

/** A number's format and locale. */
const formatRows = (what: string): readonly PropRow[] => [
  [
    'format',
    'Intl.NumberFormatOptions',
    undefined,
    `How ${what} is shown, for example { style: 'percent' }.`,
  ],
  ['locale', 'Intl.LocalesArgument', 'the document’s language', 'Its locale.'],
];

/** Words for on and off. */
const statesRow: PropRow = [
  'states',
  'readonly [on: string, off: string]',
  'On and Off',
  'Its value’s words, on and off, for example [‘Open’, ‘Closed’].',
];

/** Whether it takes input. */
const disabledRow: PropRow = [
  'disabled',
  'boolean',
  code('false'),
  'Whether its controls take no input; a press on the card does nothing either.',
];

/** A switch's state. */
const checkedRows: readonly PropRow[] = [
  ['checked', 'boolean', undefined, 'Whether it’s on (controlled).'],
  [
    'defaultChecked',
    'boolean',
    code('false'),
    'Whether it’s on at first (uncontrolled).',
  ],
  [
    'onCheckedChange',
    '(checked: boolean) => void',
    undefined,
    'As it’s switched.',
  ],
];

export const controlCardsStateRows: readonly PropRow[] = [
  [
    'active',
    'boolean',
    undefined,
    'Whether it’s on: lit, its symbol emphasized, its value the first of its states.',
  ],
  statesRow,
  ...cardRows,
];

export const controlCardsSwitchRows: readonly PropRow[] = [
  ...checkedRows,
  disabledRow,
  statesRow,
  [
    'tint',
    'string (a CSS color)',
    'the switch’s green',
    'Its tint: its symbol’s and its switch’s color while it’s on.',
  ],
  ...cardRows,
];

export const controlCardsValueRows: readonly PropRow[] = [
  [
    'value',
    'number | ReactNode',
    undefined,
    'Its number, formatted by format, or what’s shown instead.',
  ],
  ...formatRows('its number'),
  [
    'trend',
    'number',
    undefined,
    <>
      An arrow after its value (a{' '}
      <PartLink
        component="card"
        part="Card.Trend"
      />
      ), pointing up as steeply as it rises: -90 to 90 degrees, 0 steady.
    </>,
  ],
  ...cardRows,
];

/** A slider's range and value (its `Card.Slider`'s). */
const sliderRows: readonly PropRow[] = [
  ['value', 'number', undefined, 'Its value (controlled).'],
  ['defaultValue', 'number', 'its min', 'Its value at first (uncontrolled).'],
  [
    'onValueChange',
    '(value: number) => void',
    undefined,
    'As its value changes, dragged or by keyboard.',
  ],
  ['min', 'number', code('0'), 'Its least value.'],
  ['max', 'number', code('100'), 'Its greatest value.'],
  [
    'step',
    'number',
    'continuous (a hundredth of its range)',
    'Its values’ step. Given, it snaps, and a tick marks each step across the card.',
  ],
  ...formatRows('its value'),
  [
    'tint',
    'string (a CSS color)',
    'the app’s tint',
    'Its fill’s color, opaque. Any color reads: what’s over the fill is drawn again inside it, dark on a bright fill, light on a dim one.',
  ],
  disabledRow,
];

export const controlCardsSliderRows: readonly PropRow[] = [
  ...sliderRows,
  [
    'brightness',
    'boolean',
    code('false'),
    'Whether it controls a brightness, for example a dimmer. Its glass stays dark in both color schemes, so the fill shows how much light there is, and its symbol is on above its minimum while it’s on. Otherwise its glass follows the color scheme, for example for blinds.',
  ],
  [
    'checked',
    'boolean',
    undefined,
    'Whether it’s on (controlled). With this or defaultChecked, it has a switch in its top trailing corner, and a click on the card toggles it while a drag sets its value. Its value is kept while it’s off; while it’s off, its fill isn’t drawn: the card is plain off glass, with a dashed line where the fill would end (none at its minimum or maximum). How the two go together, for example switched on at its minimum, is the app’s.',
  ],
  [
    'defaultChecked',
    'boolean',
    undefined,
    'Whether it’s on at first (uncontrolled; a switch, see checked).',
  ],
  [
    'onCheckedChange',
    '(checked: boolean) => void',
    undefined,
    'As it’s switched.',
  ],
  [
    'states',
    'readonly [on: string, off: string]',
    code('["On", "Off"]'),
    'Its value’s words, on and off, with a switch: its value reads its state’s word and its number, for example “On · 60%” or “Off · 60%”.',
  ],
  [
    'getValueText',
    '(formattedValue: string, value: number, details: { checked, states }) => string',
    'by states (see there)',
    'Its value’s text, shown on the card and read by assistive technology: from its formatted number, its number, and whether it’s on (checked is undefined without a switch). For wording of your own, in any language and order.',
  ],
  ...cardRows,
];

export const controlCardsButtonRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    <>
      As it’s pressed (its{' '}
      <PartLink
        component="card"
        part="Card.Root"
      />
      ’s, momentary). It lights up for a moment and fades back, also when the
      app flashes it through its <code>actionsRef</code>.
    </>,
  ],
  [
    'status',
    'ReactNode',
    undefined,
    'Its value’s words, for example when it last rang.',
  ],
  [
    'badge',
    'ReactNode',
    undefined,
    <>
      A{' '}
      <PartLink
        component="badge"
        part="Badge"
      />{' '}
      on its symbol, for example a count.
    </>,
  ],
  ...cardRows,
];

/** A card's own tint, for its symbol and its parts' fill. */
const partsTintRow = (parts: PropRow[3]): PropRow => [
  'tint',
  'string (a CSS color)',
  'the app’s tint',
  parts,
];

export const controlCardsProgressRows: readonly PropRow[] = [
  [
    'active',
    'boolean',
    undefined,
    'Whether it’s on: lit, its symbol emphasized. Left out, its glass follows the color scheme.',
  ],
  partsTintRow(
    <>
      Its symbol’s color while it’s on, and its{' '}
      <PartLink
        component="card"
        part="Card.ProgressBar"
      />
      ’s fill, unless the bar has a tint of its own.
    </>,
  ),
  ...composedCardRows(
    <>
      Its parts, as the app shows them: a{' '}
      <PartLink
        component="card"
        part="Card.Progress"
      />{' '}
      (its value) holding a{' '}
      <PartLink
        component="card"
        part="Card.Subtitle"
      />
      , a{' '}
      <PartLink
        component="card"
        part="Card.ProgressValue"
      />
      , a{' '}
      <PartLink
        component="card"
        part="Card.ProgressBar"
      />
      ; and what’s added, for example a corner button.
    </>,
  ),
];

export const controlCardsStagesRows: readonly PropRow[] = [
  [
    'active',
    'boolean',
    undefined,
    'Whether it’s on: lit, its symbol emphasized. For example while a program runs.',
  ],
  partsTintRow(
    <>
      Its symbol’s color while it’s on, and its{' '}
      <PartLink
        component="card"
        part="Card.StageList"
      />
      ’s, unless the list has a tint of its own.
    </>,
  ),
  ...composedCardRows(
    <>
      Its parts: a{' '}
      <PartLink
        component="card"
        part="Card.Subtitle"
      />{' '}
      and a{' '}
      <PartLink
        component="card"
        part="Card.StageList"
      />{' '}
      (its current stage its value); and what’s added, for example a corner
      button.
    </>,
  ),
];

export const controlCardsLightRows: readonly PropRow[] = [
  ...checkedRows,
  disabledRow,
  [
    'getValueText',
    '(formattedValue: string, value: number, details: { checked, states }) => string',
    'on, its brightness; off, its off word',
    'Its value’s text: the app’s wording, from its brightness formatted (its strongest amount channel’s share), the brightness itself, and whether it’s on. For example “On · 60%” and “Off · 60%”, as a slider card says by default.',
  ],
  [
    'states',
    'readonly [on: string, off: string]',
    code('["On", "Off"]'),
    'Its value’s words, on and off, for getValueText; by default, its off word shows while it’s off.',
  ],
  ...formatRows('its brightness'),
  ...composedCardRows(
    <>
      Its parts: its{' '}
      <PartLink
        component="card"
        part="Card.Channels"
      />
      , shown while it’s large; and what’s added, for example a corner button.
    </>,
  ),
];

export const controlCardsListRows: readonly PropRow[] = [
  [
    'status',
    'ReactNode',
    undefined,
    'Its value’s words, small under its title.',
  ],
  ...composedCardRows(
    <>
      Its parts: its{' '}
      <PartLink
        component="card"
        part="Card.Rows"
      />
      , as many as fit (rows left out, its last row expands or opens its tile);
      and what’s added, for example a{' '}
      <PartLink
        component="card"
        part="Card.CloseButton"
      />{' '}
      for its tile opened above the page, or a{' '}
      <PartLink
        component="card"
        part="Card.ExpandButton"
      />{' '}
      for its tile without rows.
    </>,
  ),
];

export const controlCardsSegmentedRows: readonly PropRow[] = [
  [
    'offValue',
    'string | readonly string[]',
    undefined,
    'The option, or options, that mean off, for example [“off”, “away”]. While one of them is chosen, the card is dark glass; any other, it’s lit. Without it, the card follows its glass and is never lit.',
  ],
  [
    'tint',
    'string',
    undefined,
    'Its symbol’s tint, unless the chosen option has its own.',
  ],
  ...composedCardRows(
    <>
      Its parts: its{' '}
      <PartLink
        component="card"
        part="Card.Segmented"
      />{' '}
      of options (its value, its layout), the chosen option’s symbol, tint and
      words the card’s; and what’s added, for example a{' '}
      <PartLink
        component="card"
        part="Card.OpenButton"
      />{' '}
      (shown only at 1x1, where its options are hidden) and a{' '}
      <PartLink
        component="card"
        part="Card.CloseButton"
      />
      .
    </>,
  ),
];
