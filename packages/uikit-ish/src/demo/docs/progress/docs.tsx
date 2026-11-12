import {
  baseUiRows,
  code,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

/** A bar's root's: Base UI's formatting. */
const formatRows: readonly PropRow[] = [
  [
    'format',
    'Intl.NumberFormatOptions',
    undefined,
    <>
      Options to format the value (for its{' '}
      <PartLink
        component="progress"
        part="Progress.Value"
      />{' '}
      and <code>aria-valuetext</code>). By default, it’s a percentage.
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
      <code>null</code>, and its fill then slides along the track (prefer an{' '}
      <PartLink
        component="progress"
        part="ActivityIndicator"
      />
      instead).
    </>,
  ],
  ['min', 'number', code('0'), 'The minimum value.'],
  ['max', 'number', code('100'), 'The maximum value.'],
  ...formatRows,
  ['tint', 'string (a CSS color)', 'system blue', 'The fill’s color.'],
  [
    'synchronized',
    'boolean',
    code('true'),
    'While indeterminate, whether its fill slides in sync with every other indeterminate bar on the page (wherever each one is, whenever it started), or on its own.',
  ],
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
    'Where it sits: above the track (at the line’s start), below it, or before or after it.',
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
      Where it sits: above the track (at the line’s end), below it, before or
      after it, or in a tooltip at the fill’s end. The tooltip shows always, or
      only momentarily (while the bar is hovered or focused by keyboard; the bar
      can take focus then).
    </>,
  ],
  [
    'children',
    '(formattedValue: string | null, value: number | null) => ReactNode',
    undefined,
    'A function of the value (formatted by the root’s format), to render it differently. By default, it shows the formatted value.',
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const activityIndicatorRows: readonly PropRow[] = [
  [
    'progress',
    'number',
    code('0'),
    <>
      How far along a turn it is, in turns (0 to 1; below 0 turns back, past 1
      turns further). At rest, it’s set by hand (for example following a pull).
      While spinning, it’s where the spin starts from, and later changes don’t
      restart it. With <code>rotate</code>, the spinner turns that far;
      otherwise, its brightest spoke moves on.
    </>,
  ],
  [
    'display',
    union('animate', 'freeze', 'reset', 'finish', 'finish-and-hide', 'none'),
    code('animate'),
    <>
      How it shows. <code>animate</code> spins it. When stopped, it rests at
      once (<code>reset</code>), freezes where it is (<code>freeze</code>), or
      finishes its turn first and then rests at the top, without a jump (
      <code>finish</code>), whatever its <code>movement</code>. It can also
      finish and then hide (<code>finish-and-hide</code>), or hide at once (
      <code>none</code>). Hidden, it takes no room.
    </>,
  ],
  [
    'size',
    union('regular', 'small'),
    code(union('regular')),
    'Its size: 30px or 22px.',
  ],
  [
    'movement',
    union('stepped', 'rotate', 'fade'),
    code(union('stepped')),
    'How it spins: one spoke at a time, smoothly, or with its spokes staying in place and fading in turn.',
  ],
  [
    'duration',
    'number',
    code('1'),
    'How many seconds a turn takes (its speed).',
  ],
  [
    'synchronized',
    'boolean',
    code('true'),
    <>
      Whether it spins in sync with every other activity indicator on the page
      (all alike, whenever each one started), or on its own. With its own{' '}
      <code>progress</code> or <code>duration</code>, it always spins on its
      own.
    </>,
  ],
  [
    'color',
    'string (a CSS color)',
    'the secondary label color',
    <>The spokes’ color.</>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'A label after it, which names it (like Base UI’s Progress.Label).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];
