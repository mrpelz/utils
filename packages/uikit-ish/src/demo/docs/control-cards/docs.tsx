import { code, PropRow } from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

/** What every card takes: its name, its symbol, its extras, its root's. */
const cardRows: readonly PropRow[] = [
  [
    'name',
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
      What’s added after its parts, for example an{' '}
      <PartLink part="ControlCards.ExpandButton" /> or another{' '}
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
  'readonly [on: ReactNode, off: ReactNode]',
  'On and Off',
  'Its value’s words, on and off, for example [‘Open’, ‘Closed’].',
];

/** A switch's state. */
const checkedRows = (defaultValue: string): readonly PropRow[] => [
  ['checked', 'boolean', undefined, 'Whether it’s on (controlled).'],
  [
    'defaultChecked',
    'boolean',
    code(defaultValue),
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
  ...checkedRows('false'),
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
      An arrow after its value (<PartLink part="ControlCards.Trend" />
      ), pointing up as steeply as it rises: -90 to 90 degrees, 0 steady.
    </>,
  ],
  ...cardRows,
];

/** A slider's range and value (see `ControlCards.SliderFill`). */
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

export const controlCardsSliderFillRows: readonly PropRow[] = [
  [
    'name',
    'string',
    undefined,
    'Its label, and its accessible name, for example the card’s name.',
  ],
  ...sliderRows,
  [
    'onPress',
    '() => void',
    undefined,
    'Given, a click on it (released before it moves) calls this instead of setting a value, for example to toggle its card’s switch; a drag sets its value. Without it, a press sets its value.',
  ],
  [
    'getValueText',
    '(formattedValue: string, value: number) => string',
    'its formatted number',
    'Its value’s text, shown and read by assistive technology. It doesn’t know a card’s switch: to show a state with the value, as a slider card does, write it here.',
  ],
  ['className', 'string', undefined, 'Its class, beside its own.'],
  ['ref', 'Ref<HTMLDivElement>', undefined, 'Its slider’s root element.'],
];

export const controlCardsButtonRows: readonly PropRow[] = [
  [
    'onPress',
    '() => void',
    undefined,
    <>
      As it’s pressed. It lights up for a moment and fades back, also when the
      app flashes it through its{' '}
      <PartLink
        component="card"
        part="Card.Root"
      />
      ’s <code>actionsRef</code>.
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

export const controlCardsProgressRows: readonly PropRow[] = [
  [
    'value',
    'number',
    undefined,
    'Its progress, 0 to max. Without it, there’s no bar: for example a garage door at rest.',
  ],
  ['max', 'number', code('100'), 'Its progress’s greatest value.'],
  [
    'active',
    'boolean',
    undefined,
    'Whether it’s on: lit, its symbol emphasized.',
  ],
  [
    'status',
    'ReactNode',
    undefined,
    'Its value’s words, for example how long it has left.',
  ],
  ['tint', 'string (a CSS color)', 'the app’s tint', 'Its bar’s color.'],
  ...cardRows,
];

/** A channel's shape (see `ControlCards.Channels`). */
const channelsRow: PropRow = [
  'channels',
  'readonly { label: string; name: string; tint: string }[]',
  undefined,
  'Its channels: each a short label shown on its bar, an accessible name and its bar’s color.',
];

export const controlCardsLightRows: readonly PropRow[] = [
  channelsRow,
  [
    'value',
    'readonly number[]',
    undefined,
    'Its channels’ values, 0 to 1 each (controlled).',
  ],
  [
    'defaultValue',
    'readonly number[]',
    'all at 1',
    'Its channels’ values at first (uncontrolled).',
  ],
  [
    'onValueChange',
    '(value: readonly number[]) => void',
    undefined,
    'As a channel changes: all of them.',
  ],
  ...checkedRows('true'),
  [
    'offLabel',
    'ReactNode',
    'Off',
    'Its value’s words while it’s off. On, its value is its brightness: its strongest channel, formatted.',
  ],
  ...formatRows('its brightness'),
  ...cardRows,
];

export const controlCardsListRows: readonly PropRow[] = [
  [
    'rows',
    'readonly { icon?: SymbolIcon; label: string; value: ReactNode }[]',
    undefined,
    'Its rows, as many as fit whole, in order. Each label is also its key. With none, there’s no list.',
  ],
  ['status', 'ReactNode', undefined, 'Its value’s words, under its title.'],
  ...cardRows,
];

export const controlCardsChannelsRows: readonly PropRow[] = [
  channelsRow,
  [
    'value',
    'readonly number[]',
    undefined,
    'Each bar’s value, 0 to 1, by index.',
  ],
  [
    'onValueChange',
    '(index: number, value: number) => void',
    undefined,
    'As a bar’s value changes: its index and its value.',
  ],
  ['className', 'string', undefined, 'Its class, beside its own.'],
  ['ref', 'Ref<HTMLDivElement>', undefined, 'Its element.'],
];

export const controlCardsTrendRows: readonly PropRow[] = [
  [
    'angle',
    'number',
    undefined,
    'How steeply its value changes: -90 (falling) to 90 (rising) degrees, 0 steady. It’s named rising, falling or steady.',
  ],
];

export const controlCardsExpandButtonRows: readonly PropRow[] = [
  ['expanded', 'boolean', undefined, 'Whether its card is expanded.'],
  [
    'collapsedSize',
    'GridSize',
    undefined,
    <>
      Its card’s size when not expanded. The button hides while expanding would
      change nothing: both sizes come out the same in its{' '}
      <PartLink
        component="grid"
        part="Grid.Item"
      />{' '}
      as it is now, for example with too few columns (see{' '}
      <PartLink
        component="grid"
        part="useGridItem"
      />
      ’s sizeOf).
    </>,
  ],
  [
    'expandedSize',
    'GridSize',
    undefined,
    'Its card’s size when expanded. It can be smaller than collapsedSize; the icon then shows that it shrinks.',
  ],
  [
    'onExpandedChange',
    '(expanded: boolean) => void',
    undefined,
    <>
      As it’s pressed. The expanded size is the app’s, given to its{' '}
      <PartLink
        component="grid"
        part="Grid.Item"
      />
      .
    </>,
  ],
  [
    'label',
    'string',
    undefined,
    'Its accessible name, for example “Heating details”.',
  ],
];

export const controlCardsOpenButtonsRows: readonly PropRow[] = [
  [
    'label',
    'string',
    undefined,
    'Its open button’s accessible name, for example “Speaker details”.',
  ],
  [
    'closeLabel',
    'string',
    undefined,
    'Its close button’s accessible name, for example “Close”.',
  ],
];
