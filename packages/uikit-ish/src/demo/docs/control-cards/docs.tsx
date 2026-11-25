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

/** A composed card's rows: its parts as its children, then its root's. */
const composedCardRows = (parts: PropRow[3]): readonly PropRow[] => [
  ...cardRows.filter(([name]) => name !== 'children'),
  ['children', 'ReactNode', undefined, parts],
];

/** A plain part's class and element. */
const plainRows = (element: string): readonly PropRow[] => [
  ['className', 'string', undefined, 'Its class, beside its own.'],
  ['ref', `Ref<${element}>`, undefined, 'Its element.'],
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
    'Given, a click on it (released before it moves) calls this instead of setting a value, for example to toggle its card’s switch; a drag sets its value. Without it, a tap sets its value where it lands. Either way, a touch moving across the card scrolls the page instead.',
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
    'Its progress, 0 to max. Without it, nothing is under way: its bar is empty, and it has no value.',
  ],
  ['max', 'number', code('100'), 'Its progress’s greatest value.'],
  [
    'active',
    'boolean',
    undefined,
    'Whether it’s on: lit, its symbol emphasized.',
  ],
  [
    'tint',
    'string (a CSS color)',
    'the app’s tint',
    'The color its bar fills in, and its symbol’s while it’s on, as a stages card’s.',
  ],
  [
    'format',
    'Intl.NumberFormatOptions',
    code('{ maximumFractionDigits: 0, style: "percent" }'),
    'How its value is shown: as a percentage, its share of max.',
  ],
  ['locale', 'Intl.LocalesArgument', 'the document’s language', 'Its locale.'],
  ...composedCardRows(
    <>
      Its parts, as the app shows them: a{' '}
      <PartLink part="ControlCards.Subtitle" />, a{' '}
      <PartLink part="ControlCards.ProgressValue" />, a{' '}
      <PartLink part="ControlCards.ProgressBar" />; and what’s added, for
      example a corner button.
    </>,
  ),
];

export const controlCardsProgressBarRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What’s on it: a <PartLink part="ControlCards.ProgressLabel" /> and a{' '}
      <PartLink part="ControlCards.ProgressDetail" />.
    </>,
  ],
  ...plainRows('HTMLDivElement'),
];

export const controlCardsProgressLabelRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its words at the bar’s start, for example its phase.',
  ],
  ...plainRows('HTMLSpanElement'),
];

export const controlCardsProgressDetailRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its words at the bar’s end, quieter, for example how long it has left.',
  ],
  ...plainRows('HTMLSpanElement'),
];

export const controlCardsProgressValueRows: readonly PropRow[] = [
  [
    'children',
    '(formattedValue: string, value: number) => ReactNode',
    'its formatted value',
    'Its words, from its card’s value formatted and the value itself.',
  ],
  ...plainRows('HTMLSpanElement'),
];

export const controlCardsSubtitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its words, for example a program’s name or when it ends.',
  ],
  ...plainRows('HTMLSpanElement'),
];

export const controlCardsStagesRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    'Its current stage’s value. Those before it are done, those after it to come. Without it, all are to come.',
  ],
  [
    'active',
    'boolean',
    undefined,
    'Whether it’s on: lit, its symbol emphasized. For example while a program runs.',
  ],
  [
    'tint',
    'string (a CSS color)',
    'the app’s tint',
    'The color of its current stage, of those done and of its symbol.',
  ],
  ...composedCardRows(
    <>
      Its parts: a <PartLink part="ControlCards.Subtitle" /> and a{' '}
      <PartLink part="ControlCards.StageList" />; and what’s added, for example
      a corner button.
    </>,
  ),
];

export const controlCardsStageListRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its stages, each a <PartLink part="ControlCards.Stage" />, in order.
    </>,
  ],
  [
    '…',
    'ComponentProps<"ol">',
    undefined,
    'Its other props are its list element’s.',
  ],
  ...plainRows('HTMLOListElement'),
];

export const controlCardsStageRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    'What it is. Its card’s value names the current stage.',
  ],
  ['children', 'ReactNode', undefined, 'Its words, under its dot.'],
  ['className', 'string', undefined, 'Classes added to its element.'],
];

export const controlCardsLightRows: readonly PropRow[] = [
  ...checkedRows('true'),
  [
    'getValueText',
    '(formattedValue: string, value: number, details: { checked, states }) => string',
    'on, its brightness; off, its off word',
    'Its value’s text: the app’s wording, from its brightness formatted (its strongest amount channel’s share), the brightness itself, and whether it’s on. For example “On · 60%” and “Off · 60%”, as a slider card says by default.',
  ],
  [
    'states',
    'readonly [on: string, off: string]',
    'On and Off',
    'Its value’s words, on and off, for getValueText; by default, its off word shows while it’s off.',
  ],
  ...formatRows('its brightness'),
  ...composedCardRows(
    <>
      Its parts: its <PartLink part="ControlCards.Channels" />, shown while it’s
      large; and what’s added, for example a corner button.
    </>,
  ),
];

export const controlCardsListRows: readonly PropRow[] = [
  [
    'rows',
    'readonly { icon?: SymbolIcon; label: string; onPress?: () => void; value: ReactNode }[]',
    undefined,
    'Its rows, as many as fit whole, in order. When some are left out, the last one counts them instead. Each label is also its key. A row with onPress is pressed anywhere on it, for example to go to a page of its own, and shows a chevron after its value. With none, there’s no list.',
  ],
  [
    'status',
    'ReactNode',
    undefined,
    'Its value’s words, small under its title.',
  ],
  [
    'opening',
    '{ closeLabel: string; label: string }',
    undefined,
    <>
      Opens it above the page through its{' '}
      <PartLink
        component="grid"
        part="Grid.Item"
      />
      , taking what <PartLink part="ControlCards.OpenButtons" /> takes. While
      rows are left out, its last row opens it. With no list, a corner button
      does. Open, an × in its top trailing corner closes it.
    </>,
  ],
  [
    'expansion',
    '{ collapsedSize: GridSize; expanded: boolean; expandedSize: GridSize; label: string; onExpandedChange: (expanded: boolean) => void }',
    undefined,
    <>
      Expands it in place, taking what{' '}
      <PartLink part="ControlCards.ExpandButton" /> takes. While rows are left
      out, its last row expands it; expanded, its last row makes it small again.
      With no list, a corner button does. It comes before opening.
    </>,
  ],
  [
    'getMoreLabel',
    '(count: number) => string',
    // eslint-disable-next-line no-template-curly-in-string -- the default's code, shown
    code('`${count} more`'),
    'The last row’s words while rows are left out, given how many.',
  ],
  [
    'lessLabel',
    'string',
    code('"Less"'),
    'The last row’s words while it’s expanded.',
  ],
  ...cardRows,
];

export const controlCardsSegmentedRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its options, each a <PartLink part="ControlCards.SegmentedItem" />, in
      order, as segments in a well at its bottom, dragged between or pressed.
      Across a row and in a taller tile they sit side by side; upright, they
      stack. The chosen option’s words are the card’s value, and its symbol and
      tint are the card’s symbol’s.
    </>,
  ],
  [
    'optionContent',
    '"both" | "icon" | "label"',
    code('"both"'),
    'What each segment shows: its symbol and label (an option without a symbol shows its label), its symbol only (the label becomes its accessible name), or its label only. Across a row the symbol sits beside the label, in a taller tile above it.',
  ],
  [
    'orientation',
    '"horizontal" | "vertical"',
    undefined,
    'Its options side by side or stacked, in a tile at least two rows tall. In a one-row tile they’re side by side; vertical then shows only the chosen option, as at 1x1. Without it, the tile’s size decides: one wide and taller, stacked; otherwise side by side.',
  ],
  ['value', 'string', undefined, 'The chosen option (controlled).'],
  [
    'defaultValue',
    'string',
    'its first option’s',
    'The option chosen at first (uncontrolled).',
  ],
  [
    'onValueChange',
    '(value: string) => void',
    undefined,
    'As an option is chosen, by a press, a drag or the arrow keys.',
  ],
  [
    'offValue',
    'string',
    undefined,
    'The option that means off. While it’s chosen, the card is dark glass; any other, it’s lit. Without it, the card follows its glass and is never lit.',
  ],
  [
    'tint',
    'string',
    undefined,
    'Its symbol’s tint, unless the chosen option has its own.',
  ],
  [
    'opening',
    '{ closeLabel: string; label: string }',
    undefined,
    <>
      For a 1x1 tile, too small for its options: a corner button (or a press on
      the card) opens it above the page through its{' '}
      <PartLink
        component="grid"
        part="Grid.Item"
      />
      , where it shows them. Open, an × in its top trailing corner closes it. It
      takes what <PartLink part="ControlCards.OpenButtons" /> takes.
    </>,
  ],
  ...cardRows,
];

export const controlCardsSegmentedItemRows: readonly PropRow[] = [
  ['value', 'string', undefined, 'What it stands for, unique in its card.'],
  [
    'children',
    'ReactNode',
    undefined,
    'Its words: its segment’s, and the card’s value while it’s chosen. With symbols only (the card’s optionContent), they’re its name, unseen.',
  ],
  [
    'icon',
    'SymbolIcon',
    undefined,
    'Its symbol, in its segment and as the card’s while it’s chosen (else the card’s icon).',
  ],
  [
    'subtitle',
    'ReactNode',
    undefined,
    'More words under its words, in the card’s value color, where there’s room: in a tile taller than a row, not with symbols only, and when stacked only once it’s tall enough.',
  ],
  [
    'tint',
    'string',
    undefined,
    'The card’s symbol’s tint while it’s chosen (else the card’s tint).',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether it can’t be chosen now: dimmed, not pressed, dragged past and skipped by the arrow keys, as in Segmented.',
  ],
  ['className', 'string', undefined, 'Its class, beside its own.'],
  ['ref', 'Ref<HTMLElement>', undefined, 'Its element.'],
];

export const controlCardsChannelsRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its channels, each a <PartLink part="ControlCards.Channel" />, in order.
    </>,
  ],
  ...plainRows('HTMLDivElement'),
];

export const controlCardsChannelRows: readonly PropRow[] = [
  [
    'name',
    'string',
    undefined,
    'Its name: on its well, and its slider’s accessible name.',
  ],
  [
    'tint',
    'string (a CSS color)',
    'the app’s tint',
    'An amount’s color at its greatest value. Its fill is this color, its thumb this color mixed on black by its share.',
  ],
  [
    'colors',
    'readonly string[]',
    undefined,
    'A scale instead of an amount: its colors from its least value to its greatest, evenly spread, two or more. Its well shows them, its thumb the color at its value. For example a color temperature, warm to cool.',
  ],
  ['value', 'number', undefined, 'Its value (controlled).'],
  ['defaultValue', 'number', 'its min', 'Its value at first (uncontrolled).'],
  [
    'onValueChange',
    '(value: number) => void',
    undefined,
    'As its value changes.',
  ],
  ['min', 'number', code('0'), 'Its least value.'],
  ['max', 'number', code('1'), 'Its greatest value.'],
  ['step', 'number', 'a hundredth of its range', 'How far a step goes.'],
  [
    'getValueText',
    '(formattedValue: string, value: number) => string',
    undefined,
    'Its value’s words, on its well and for assistive technology, for example “3800 K”.',
  ],
  [
    'format',
    'Intl.NumberFormatOptions',
    code('{ maximumFractionDigits: 0, style: "percent" }'),
    'How its value is shown: as a percentage, its share of its range.',
  ],
  ['locale', 'Intl.LocalesArgument', 'the document’s language', 'Its locale.'],
  ['disabled', 'boolean', undefined, 'Whether it takes no input.'],
  ...plainRows('HTMLDivElement'),
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
