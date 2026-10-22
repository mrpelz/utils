import { baseUiRows, code, PropRow, union } from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

/** A bar's root's: Base UI's formatting. */
const formatRows: readonly PropRow[] = [
  [
    'format',
    'Intl.NumberFormatOptions',
    undefined,
    <>
      Options to format the value (its{' '}
      <PartLink
        component="progress"
        part="Progress.Value"
      />{' '}
      and <code>aria-valuetext</code>; by default, a percentage).
    </>,
  ],
  [
    'locale',
    'Intl.LocalesArgument',
    'the runtime’s',
    <>
      The locale used by <code>Intl.NumberFormat</code> when formatting the
      value.
    </>,
  ],
  [
    'getAriaValueText',
    '(formattedValue: string, value: number | null) => string',
    undefined,
    'Accepts a function which returns a string value that provides a human-readable text alternative for the current value of the progress bar.',
  ],
];

export const progressRootRows: readonly PropRow[] = [
  [
    'value',
    'number | null',
    undefined,
    <>
      The current value (required). The component is indeterminate when value is{' '}
      <code>null</code>: its fill slides along the track (UIKit has none: prefer
      an{' '}
      <PartLink
        component="progress"
        part="ActivityIndicator"
      />
      ).
    </>,
  ],
  ['min', 'number', code('0'), 'The minimum value.'],
  ['max', 'number', code('100'), 'The maximum value.'],
  ...formatRows,
  ['tint', 'string (a CSS color)', 'system blue', 'The fill’s color.'],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="progress"
        part="Progress.Track"
      />{' '}
      (required), and optionally its{' '}
      <PartLink
        component="progress"
        part="Progress.Label"
      />{' '}
      and{' '}
      <PartLink
        component="progress"
        part="Progress.Value"
      />
      .
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const progressTrackRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="progress"
        part="Progress.Indicator"
      />
      .
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const progressIndicatorRows: readonly PropRow[] = baseUiRows(
  'div',
  'HTMLDivElement',
);

/** `Progress.Label`'s and `Progress.Value`'s places. */
const placements = ['block-start', 'block-end', 'inline-start', 'inline-end'];

export const progressLabelRows: readonly PropRow[] = [
  [
    'placement',
    union(...placements),
    code(union('block-start')),
    'Above the track (at the line’s start), below it, before or after it.',
  ],
  ['children', 'ReactNode', undefined, 'What’s in progress (“Downloading”).'],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const progressValueRows: readonly PropRow[] = [
  [
    'placement',
    union(...placements, 'tooltip', 'momentary-tooltip'),
    code(union('block-start')),
    <>
      Above the track (at the line’s end), below it, before or after it; or in a
      tooltip at the fill’s end: always, or momentary (while the bar is hovered
      or focused by keyboard: the bar is focusable then).
    </>,
  ],
  [
    'children',
    '(formattedValue: string | null, value: number | null) => ReactNode',
    undefined,
    'A function of the value (formatted by the root’s format), to render it otherwise; by default, the formatted value.',
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const activityIndicatorRows: readonly PropRow[] = [
  [
    'animating',
    'boolean',
    code('true'),
    <>
      Spinning (UIKit <code>startAnimating</code>, <code>stopAnimating</code>);
      stopped, it rests.
    </>,
  ],
  [
    'stopBehavior',
    union('reset', 'freeze', 'finish'),
    code(union('reset')),
    <>
      Stopping (<code>animating</code> false): at rest at once (as UIKit’s),
      frozen where it is, or finishing its turn first, then resting at the top
      (no jump), whatever its <code>movement</code>.
    </>,
  ],
  [
    'size',
    union('regular', 'small'),
    code(union('regular')),
    'Figma’s “Size”: 30px, or 22px.',
  ],
  [
    'movement',
    union('stepped', 'rotate', 'fade'),
    code(union('stepped')),
    'How it spins: a spoke at a time (as UIKit), smoothly, or its spokes staying in place, fading in turn.',
  ],
  ['duration', 'number', code('1'), 'Seconds a turn takes (its speed).'],
  [
    'color',
    'string (a CSS color)',
    'the secondary label color',
    <>
      The spokes’ color (UIKit <code>color</code>).
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'A label after it (Figma “Label”), naming it (as Base UI’s Progress.Label).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];
