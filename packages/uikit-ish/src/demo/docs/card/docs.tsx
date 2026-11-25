import {
  baseUiRows,
  code,
  elementRows,
  glassSurfaceRow,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const cardRootRows: readonly PropRow[] = [
  [
    'actionsRef',
    'RefObject<CardActions | null>',
    undefined,
    'Its actions, for the app to call from anywhere: flash() lights it up as active does, for a moment, and fades it back, for example as the app’s server says a doorbell rang.',
  ],
  [
    'active',
    'boolean',
    'not switchable (or by its switch)',
    'Whether what it switches is on: true lights it up, false draws it in dark glass, in both color schemes, so what’s on can be told at a glance. For a card without a switch, for example a group of lights with at least one of them on. Left out, it isn’t switchable (a sensor, say), and its glass follows the color scheme. A switch in it makes it switchable, by the switch’s state. A switchable card’s state decides its glass; its context only applies while it isn’t switchable.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its parts (<PartLink part="Card.Symbol" />, <PartLink part="Card.Title" />
      , <PartLink part="Card.Value" />, <PartLink part="Card.Switch" />
      ), and a control filling it: a{' '}
      <PartLink
        component="slider"
        part="Slider.Root"
      />
      , styled by the card; or a{' '}
      <PartLink
        component="list"
        part="List.Root"
      />{' '}
      (inset grouped, its default style), its group in a well at the card’s
      bottom, under its symbol and title.
    </>,
  ],
  glassSurfaceRow('the card'),
  [
    'momentary',
    'boolean',
    code('false'),
    'Whether it’s a momentary button: a press flashes it (see actionsRef), for a press with no state of its own, for example a chime or “all lights off”. Give it an onClick.',
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
      Its icon: one of{' '}
      <PartLink
        component="grid"
        part="gridIcons"
      />
      , or the app’s own (for example an SF Symbol).
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
    'Whether it’s shown. Hidden, it fades out and can’t be pressed or focused.',
  ],
  [
    'whileEditing',
    union('hide', 'show', 'stay'),
    code(union('hide')),
    'In edit mode: hidden then (hide), shown only then (show, for example a button opening the card’s settings), or shown either way (stay). Shown in edit mode, it sits over the card’s veil in the color of the grid’s own buttons. A tap on it is its own, and a drag from it moves the card.',
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

export const cardSymbolRows: readonly PropRow[] = [
  [
    'active',
    'boolean',
    code('false'),
    'Whether it shows what the card stands for as on, in its tint and its Symbol’s emphasizedIcon (for example the filled variant), while the card itself isn’t lit: for example a dimmer’s symbol above its minimum, the slider’s fill telling how much. A lit card’s symbol shows as on anyway.',
  ],
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
  [
    'tint',
    'string (a CSS color)',
    <>
      the switch’s on color (<code>--uikit-switch-on-color</code>)
    </>,
    'Its color while it’s on: active, or its card lit.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
];

export const cardSwitchRows: readonly PropRow[] = [
  [
    'tint',
    'string (a CSS color)',
    <>
      the switch’s green; over a slider’s fill, the app’s tint (
      <code>--color-ui-primary</code>)
    </>,
    'Its color while it’s on: the card’s tint, the same as its symbol’s. Over a slider’s fill, and in a card that’s never lit (active false, such as a dimmer’s) at every size, it’s drawn in a darker shade of that tint, so pass the fill’s tint here too. Off, it has the switch’s own off color.',
  ],
  [
    'checked, defaultChecked, onCheckedChange, …',
    'Switch.Root’s props',
    undefined,
    <>
      The props of a{' '}
      <PartLink
        component="switch"
        part="Switch.Root"
      />
      , except its own <code>tint</code> and its children: it renders its thumb
      itself.
    </>,
  ],
];

export const cardTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What the card is about, for example a device’s name. Two lines at most.',
  ],
  [
    'id',
    'string',
    'a generated one',
    'Its id. The parts named by the card’s title (a progress bar, stages, a choice) are labelled by it.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
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
    'What it shows when there’s no number, for example a state: “Locked”. With a number, what’s shown after it, for example a Card.Trend.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
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
    code('["2x1", "3x1", "4x1", "1x2", "1x3"]'),
    'A slider. Never square, so it always has a direction.',
  ],
  [
    'choiceControl',
    'GridSize[]',
    code(
      '["1x1", "2x1", "3x1", "4x1", "1x2", "2x2", "3x2", "4x2", "1x3", "2x3", "1x4", "2x4"]',
    ),
    'A choice of a few, for example a heat pump’s modes: side by side across a row or taller, stacked when upright (or when the app says so), opening to choose at 1x1.',
  ],
  [
    'progressDisplay',
    'GridSize[]',
    code('["1x1", "2x1", "3x1", "4x1", "2x2"]'),
    'A progress, for example a washer’s run: its bar at the bottom, a pill that fills as it goes.',
  ],
  [
    'stagesDisplay',
    'GridSize[]',
    code('["2x1", "3x1", "4x1", "2x2", "4x2"]'),
    'A run of stages, for example a washer’s program: dots along a line at the bottom, wider for more stages. Never 1x1: too narrow for them.',
  ],
  [
    'summaryDisplay',
    'GridSize[]',
    code('["2x1", "2x2", "3x2", "4x1", "4x2", "3x3", "4x3", "4x4"]'),
    'A summary in rows, for example a room’s. Never 1x1: it shows at least one row.',
  ],
];

export const cardUseCardOrientationRows: readonly PropRow[] = [
  [
    '(returns)',
    union('horizontal', 'vertical'),
    code('"horizontal"'),
    <>
      Its tile’s shape: wider than tall (or square) is horizontal. Outside a
      grid, horizontal. Lay out content of your own by it;{' '}
      <PartLink part="Card.Slider" /> reads it itself.
    </>,
  ],
];

/** A number's format and locale. */
const formatRows = (byDefault?: string): readonly PropRow[] => [
  [
    'format',
    'Intl.NumberFormatOptions',
    byDefault === undefined ? undefined : code(byDefault),
    'How its value is shown, for example { style: "percent" }.',
  ],
  ['locale', 'Intl.LocalesArgument', 'the document’s language', 'Its locale.'],
];

/** A percentage's format, as a share of its range. */
const percentDefault = '{ maximumFractionDigits: 0, style: "percent" }';

/** A Base UI slider's value and range (a slider's, a channel's). */
const sliderValueRows: readonly PropRow[] = [
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
    'getAriaValueText',
    '(formattedValue: string, value: number) => string',
    'its formatted value',
    'What assistive technology reads as its value, as Base UI’s.',
  ],
  ['disabled', 'boolean', code('false'), 'Whether it takes no input.'],
  ['name', 'string', undefined, 'Its input’s name, for a form, as Base UI’s.'],
];

export const cardSubtitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its words, for example a program’s name or when it ends.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
];

export const cardTrendRows: readonly PropRow[] = [
  [
    'angle',
    'number',
    undefined,
    'How steeply its value changes: -90 (falling) to 90 (rising) degrees, 0 steady. Assistive technology reads rising, falling or steady.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
];

export const cardSliderRows: readonly PropRow[] = [
  [
    'label',
    'string',
    undefined,
    'Its label at the card’s bottom, and its accessible name, for example the card’s name.',
  ],
  ...sliderValueRows,
  [
    'step',
    'number',
    'continuous (a hundredth of its range)',
    'Its values’ step. Given, it snaps, and a tick marks each step across the card.',
  ],
  ...formatRows(),
  [
    'tint',
    'string (a CSS color)',
    'the app’s tint',
    'Its fill’s color, opaque. Any color reads: what’s over the fill is drawn again inside it, dark on a bright fill, light on a dim one.',
  ],
  [
    'children',
    '(formattedValue: string, value: number) => ReactNode',
    'its formatted value',
    'Its value’s words at the card’s bottom, for example its card’s state with it (“On · 60%”).',
  ],
  [
    'onPress',
    '() => void',
    undefined,
    'Given, a press on it (released before it moves) calls this instead of setting a value, for example to toggle its card’s switch; a drag sets its value. Without it, a tap sets its value where it lands. Either way, a touch moving across the card scrolls the page instead.',
  ],
  [
    '…',
    'Slider.Root’s props',
    undefined,
    <>
      Its other props are its{' '}
      <PartLink
        component="slider"
        part="Slider.Root"
      />
      ’s, except its orientation (by its tile, see{' '}
      <PartLink part="useCardOrientation" />
      ).
    </>,
  ],
];

export const cardProgressRows: readonly PropRow[] = [
  [
    'value',
    'number | null',
    undefined,
    'Its value, min to max. null: nothing under way (its bar empty, no value shown).',
  ],
  ['min', 'number', code('0'), 'Its least value.'],
  ['max', 'number', code('100'), 'Its greatest value.'],
  ...formatRows(percentDefault),
  [
    'getAriaValueText',
    '(formattedValue: string, value: number | null) => string',
    'its formatted value',
    'What assistive technology reads as its value, as Base UI’s.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its parts: a <PartLink part="Card.ProgressValue" />, a{' '}
      <PartLink part="Card.ProgressBar" />, and anything else of the card’s. It
      renders no element of its own.
    </>,
  ],
];

export const cardProgressValueRows: readonly PropRow[] = [
  [
    'children',
    '(formattedValue: string, value: number) => ReactNode',
    'its formatted value',
    'Its words, from its progress’s value formatted and the value itself, as Base UI’s Progress.Value.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
];

export const cardProgressBarRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What’s on it: a <PartLink part="Card.ProgressLabel" /> and a{' '}
      <PartLink part="Card.ProgressDetail" />, drawn on the well and again on
      the fill.
    </>,
  ],
  [
    'tint',
    'string (a CSS color)',
    'the app’s tint',
    'Its fill’s color. What’s drawn on the fill is dark or light, whichever reads better on it.',
  ],
  [
    'aria-label',
    'string',
    'its card’s title',
    'Its accessible name. Without it, it’s named by its card’s Card.Title.',
  ],
  ...renderRows('div', 'HTMLDivElement'),
];

export const cardProgressLabelRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its words at the bar’s start, for example its phase.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
];

export const cardProgressDetailRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its words at the bar’s end, quieter, for example how long it has left.',
  ],
  ...renderRows('span', 'HTMLSpanElement'),
];

export const cardStageListRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    'Its current stage’s value. Those before it are done, those after it to come. Without it, all are to come.',
  ],
  [
    'tint',
    'string (a CSS color)',
    'the app’s tint',
    'The color of its current stage and of those done.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its stages, each a <PartLink part="Card.Stage" />, in order.
    </>,
  ],
  [
    'aria-label',
    'string',
    'its card’s title',
    'Its accessible name. Without it, it’s named by its card’s Card.Title.',
  ],
  ...elementRows('ol', 'HTMLOListElement'),
];

export const cardStageRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    'What it is. Its list’s value names the current stage.',
  ],
  ['children', 'ReactNode', undefined, 'Its words, under its dot.'],
  ...elementRows('li', 'HTMLLIElement'),
];

export const cardChannelsRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its channels, each a <PartLink part="Card.Channel" />, in order.
    </>,
  ],
  [
    'onLightChange',
    '(light: { brightness: number; color: string | undefined }) => void',
    undefined,
    'As the light its channels make together changes: its color at full strength (the amounts added up, tinted by the scales) and its brightness (its strongest amount’s share).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const cardChannelRows: readonly PropRow[] = [
  [
    'label',
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
  ...sliderValueRows,
  ['step', 'number', 'a hundredth of its range', 'How far a step goes.'],
  ...formatRows(percentDefault),
  [
    'children',
    '(formattedValue: string, value: number) => ReactNode',
    'its formatted value',
    'Its value’s words on its well, for example “3800 K”.',
  ],
  ...baseUiRows('div', 'HTMLDivElement').filter(([name]) => name !== 'render'),
];

export const cardSegmentedRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its options, each a <PartLink part="Card.SegmentedItem" />, in order, as
      segments in a well at its card’s bottom, dragged between or pressed.
      Across a row and in a taller tile they sit side by side; upright, they
      stack; at 1x1 they’re hidden.
    </>,
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
    'optionContent',
    union('both', 'icon', 'label'),
    code(union('both')),
    'What each segment shows: its symbol and label (an option without a symbol shows its label), its symbol only (the label becomes its accessible name), or its label only.',
  ],
  [
    'orientation',
    union('horizontal', 'vertical'),
    undefined,
    'Its options side by side or stacked, in a tile at least two rows tall. In a one-row tile they’re side by side; vertical then hides them, as at 1x1. Without it, the tile’s size decides: one wide and taller, stacked; otherwise side by side.',
  ],
  ['disabled', 'boolean', code('false'), 'Whether none can be chosen.'],
  [
    'aria-label',
    'string',
    'its card’s title',
    'Its accessible name. Without it, it’s named by its card’s Card.Title.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const cardSegmentedItemRows: readonly PropRow[] = [
  ['value', 'string', undefined, 'What it stands for, unique in its choice.'],
  [
    'children',
    'ReactNode',
    undefined,
    'Its words: its segment’s (with symbols only, its unseen name), and a ready-made card’s value while it’s chosen.',
  ],
  [
    'icon',
    'SymbolIcon',
    undefined,
    'Its symbol, in its segment (and a ready-made card’s while it’s chosen).',
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
    'A ready-made card’s symbol’s tint while it’s chosen.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether it can’t be chosen now: dimmed, not pressed, dragged past and skipped by the arrow keys, as in Segmented.',
  ],
  ...baseUiRows('span', 'HTMLElement'),
];

export const cardRowsRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its rows, each a <PartLink part="Card.Row" />, in order: as many as fit
      whole. When some are left out, the last one counts them instead, expanding
      its tile (its{' '}
      <PartLink
        component="grid"
        part="Grid.Item"
      />
      ’s expandedSize) or opening it (an item with an openSize); expanded, it
      makes it small again.
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
    'The last row’s words while its tile is expanded.',
  ],
  [
    '…',
    'List.Root’s props',
    undefined,
    <>
      Its other props are its{' '}
      <PartLink
        component="list"
        part="List.Root"
      />
      ’s (its class, its style, render…).
    </>,
  ],
];

export const cardRowRows: readonly PropRow[] = [
  ['children', 'ReactNode', undefined, 'Its label.'],
  ['icon', 'SymbolIcon', undefined, 'Its symbol, before its label.'],
  ['value', 'ReactNode', undefined, 'Its value, at its end.'],
  [
    'onClick',
    '() => void',
    undefined,
    'Given, it’s pressed anywhere on it, for example to go to a page of its own, and shows a chevron after its value.',
  ],
  [
    '…',
    'List.Item’s props',
    undefined,
    <>
      Its other props are its{' '}
      <PartLink
        component="list"
        part="List.Item"
      />
      ’s (its class, its style, render…), but its onClick and value (its own,
      above).
    </>,
  ],
];

/** A corner button's props (theirs, but its icon, corner, visibility). */
const cornerButtonRestRow: PropRow = [
  '…',
  'Card.CornerButton’s props',
  undefined,
  <>
    Its other props are a <PartLink part="Card.CornerButton" />
    ’s, except its icon, its corner and its visibility (its own). Its onClick
    runs after its own action.
  </>,
];

export const cardExpandButtonRows: readonly PropRow[] = [
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example “Heating details”.',
  ],
  cornerButtonRestRow,
];

export const cardOpenButtonRows: readonly PropRow[] = [
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example “Speaker details”.',
  ],
  cornerButtonRestRow,
];

export const cardCloseButtonRows: readonly PropRow[] = [
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example “Close”.',
  ],
  cornerButtonRestRow,
];
