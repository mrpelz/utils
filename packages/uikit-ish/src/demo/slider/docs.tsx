import {
  baseUiRows,
  code,
  elementRows,
  PropRow,
  union,
} from '../guide/props-table.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

const placements = [
  'inline-start',
  'inline-end',
  'block-start',
  'block-end',
] as const;

const placementRow = (
  more: readonly string[],
  description: string,
): PropRow => [
  'placement',
  union(...placements, ...more),
  'where it is among the parts',
  description,
];

export const sliderRootRows: readonly PropRow[] = [
  [
    'value',
    'number | number[]',
    undefined,
    'The value of the slider. For range sliders, provide an array with one value per thumb.',
  ],
  [
    'defaultValue',
    'number | number[]',
    undefined,
    <>
      The uncontrolled value of the slider when it’s initially rendered. To
      render a controlled slider, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(value, eventDetails) => void',
    undefined,
    <>
      Callback function that is fired when the slider’s value changed. Its{' '}
      <code>eventDetails.reason</code> is <code>drag</code> while dragging a
      thumb, <code>track-press</code> when the track is pressed,{' '}
      <code>keyboard</code> for keyboard input, <code>input-change</code> when
      the hidden range input emits a change event, or <code>none</code>.
    </>,
  ],
  [
    'onValueCommitted',
    '(value, eventDetails) => void',
    undefined,
    'Callback function that is fired when a value change is committed (as a drag ends, a track press or a key press). Does not fire if the value did not change, or if the change was canceled.',
  ],
  [
    'min',
    'number',
    code('0'),
    'The minimum allowed value of the slider. Should not be equal to max.',
  ],
  [
    'max',
    'number',
    code('100'),
    'The maximum allowed value of the slider. Should not be equal to min.',
  ],
  [
    'step',
    'number',
    code('1'),
    <>
      The granularity with which the slider can step through values (a
      “discrete” slider). The <code>min</code> prop serves as the origin for the
      valid values. We recommend (max − min) to be evenly divisible by the step.
    </>,
  ],
  [
    'largeStep',
    'number',
    code('10'),
    'The granularity with which the slider can step through values when using Page Up/Page Down or Shift + Arrow Up/Arrow Down.',
  ],
  [
    'minStepsBetweenValues',
    'number',
    code('0'),
    'The minimum steps between values in a range slider.',
  ],
  [
    'thumbCollisionBehavior',
    union('push', 'swap', 'none'),
    code(union('push')),
    <>
      Controls how thumbs behave when they collide during pointer interactions:{' '}
      <code>push</code>, they push each other without restoring their previous
      positions when dragged back; <code>swap</code>, they swap places when
      dragged past each other; <code>none</code>, they cannot move past each
      other.
    </>,
  ],
  [
    'thumbAlignment',
    union('center', 'edge', 'edge-client-only'),
    code(union('edge')),
    <>
      How the thumbs are aligned relative to <code>Slider.Control</code> when
      the value is at <code>min</code> or <code>max</code>: <code>center</code>,
      the thumb’s center at the control’s edge; <code>edge</code>, inset so its
      edge is at the control’s edge; <code>edge-client-only</code>, as{' '}
      <code>edge</code>, but rendered after hydration. (Base UI’s default is{' '}
      <code>center</code>; iOS’s knob is inset.)
    </>,
  ],
  [
    'orientation',
    union('horizontal', 'vertical'),
    code(union('horizontal')),
    'The component orientation. Vertical, the minimum is at the bottom.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the slider should ignore user interaction.',
  ],
  [
    'format',
    'Intl.NumberFormatOptions',
    undefined,
    <>
      Options to format the value (for <code>Slider.Value</code> and the thumbs’{' '}
      <code>aria-valuetext</code>).
    </>,
  ],
  [
    'locale',
    'Intl.LocalesArgument',
    'the user’s runtime locale',
    <>
      The locale used by <code>Intl.NumberFormat</code> when formatting the
      value.
    </>,
  ],
  [
    'name',
    'string',
    undefined,
    'Identifies the field when a form is submitted.',
  ],
  [
    'form',
    'string',
    undefined,
    'Identifies the form that owns the slider inputs. Useful when the slider is rendered outside the form.',
  ],
  [
    'aria-labelledby',
    'string',
    <>
      a <code>Slider.Label</code>’s id
    </>,
    'The ids of the elements labelling the slider: set on the root (a group) and on every thumb’s input.',
  ],
  [
    'tint',
    'string (a CSS color)',
    <>
      the app’s tint (<code>--color-ios-primary</code>)
    </>,
    <>
      The fill’s color, and the pressed knob’s glow (UIKit{' '}
      <code>minimumTrackTintColor</code>).
    </>,
  ],
  [
    'cursor',
    'string (a CSS cursor)',
    <>
      <code>pointer</code> (disabled: <code>not-allowed</code>)
    </>,
    'The cursor (where the pointer hovers).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const sliderLabelRows: readonly PropRow[] = [
  placementRow(
    [],
    'Placed before or after the other parts, or on a line above or below them (at its start).',
  ),
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const sliderValueRows: readonly PropRow[] = [
  placementRow(
    ['tooltip', 'momentary-tooltip'],
    'Placed before or after the other parts, or on a line above or below them (at its end); or in a tooltip on each thumb (its own value): always, or momentary (while hovered, or a knob dragged or focused by keyboard). In tooltips, the value itself is only for assistive technology.',
  ),
  [
    'children',
    '(formattedValues: readonly string[], values: readonly number[]) => ReactNode',
    <>
      the formatted values, joined with <code>–</code>
    </>,
    'What it shows, from the formatted values (and the values). It takes up the width of the widest value between min and max, so the slider doesn’t shift while it changes.',
  ],
  ...baseUiRows('output', 'HTMLOutputElement'),
];

export const sliderControlRows: readonly PropRow[] = baseUiRows(
  'div',
  'HTMLDivElement',
);

export const sliderTrackRows: readonly PropRow[] = baseUiRows(
  'div',
  'HTMLDivElement',
);

export const sliderIndicatorRows: readonly PropRow[] = baseUiRows(
  'div',
  'HTMLDivElement',
);

export const sliderThumbRows: readonly PropRow[] = [
  [
    'index',
    'number',
    undefined,
    <>
      The index of the thumb which corresponds to the index of its value in the{' '}
      <code>value</code> or <code>defaultValue</code> array. This prop is
      required to support server-side rendering for range sliders with multiple
      thumbs.
    </>,
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the thumb should ignore user interaction.',
  ],
  [
    'aria-label',
    'string',
    undefined,
    <>
      The accessible name of the thumb’s <code>input</code>. Ignored when{' '}
      <code>getAriaLabel</code> is provided.
    </>,
  ],
  [
    'getAriaLabel',
    '(index: number) => string',
    undefined,
    <>
      A function which returns a string value for the <code>aria-label</code>{' '}
      attribute of the <code>input</code>.
    </>,
  ],
  [
    'aria-labelledby',
    'string',
    <>
      the root’s (without an <code>aria-label</code>)
    </>,
    <>
      The ids of the elements labelling the thumb’s <code>input</code>.
    </>,
  ],
  [
    'aria-valuetext',
    'string',
    <>
      with a <code>format</code>, the formatted value; a range’s:{' '}
      <code>€40 start range</code>, <code>€120 end range</code>
    </>,
    <>
      A string value forwarded to the <code>aria-valuetext</code> attribute of
      the <code>input</code>. Ignored when <code>getAriaValueText</code> is
      provided.
    </>,
  ],
  [
    'getAriaValueText',
    '(formattedValue: string, value: number, index: number) => string',
    undefined,
    <>
      A function which returns a string value for the{' '}
      <code>aria-valuetext</code> attribute of the <code>input</code>. This is
      important for screen reader users.
    </>,
  ],
  [
    'inputRef',
    'Ref<HTMLInputElement>',
    undefined,
    'A ref to access the nested input element.',
  ],
  [
    'onFocus',
    'FocusEventHandler<HTMLInputElement>',
    undefined,
    <>
      A focus handler forwarded to the <code>input</code>.
    </>,
  ],
  [
    'onBlur',
    'FocusEventHandler<HTMLInputElement>',
    undefined,
    <>
      A blur handler forwarded to the <code>input</code>.
    </>,
  ],
  [
    'onKeyDown',
    'KeyboardEventHandler<HTMLInputElement>',
    undefined,
    <>
      A keydown handler forwarded to the <code>input</code>.
    </>,
  ],
  [
    'tabIndex',
    'number',
    undefined,
    <>
      Optional tab index attribute forwarded to the <code>input</code>.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Content inside the thumb, before its value tooltip.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const sliderTicksRows: readonly PropRow[] = [
  [
    'count',
    'number',
    undefined,
    <>
      The values across the slider (required; usually{' '}
      <code>(max − min) / step + 1</code>): ticks mark those between its ends,
      not the ends themselves.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const sliderSymbolRows: readonly PropRow[] = [
  [
    'edge',
    union('min', 'max'),
    undefined,
    <>
      The end of the slider the symbol stands for (required). Clicking it moves
      the first thumb to the minimum (<code>min</code>), or the last thumb to
      the maximum (<code>max</code>), as the Home/End keys do; with a range, the
      other end stays.
    </>,
  ],
  [
    'onClick',
    'MouseEventHandler<HTMLSpanElement>',
    undefined,
    'Replaces moving the thumb to the end.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The symbol (UIKit <code>minimumValueImage</code>,{' '}
      <code>maximumValueImage</code>), e.g. a <code>Symbol</code>, or text.
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];
