import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const colorPickerRootRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    <>
      The color, a hex string (<code>#rrggbb</code>, or <code>#rrggbbaa</code>{' '}
      with opacity; controlled). To render an uncontrolled picker, use the{' '}
      <code>defaultValue</code> prop instead.
    </>,
  ],
  [
    'defaultValue',
    'string',
    code('#000000'),
    <>
      The initial color (uncontrolled). To render a controlled picker, use the{' '}
      <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(value: string, eventDetails) => void',
    undefined,
    <>
      Called with the picked color (uppercase hex), and why (<code>reason</code>
      ): <code>grid</code>, <code>spectrum</code>, <code>sliders</code>,{' '}
      <code>opacity</code>, <code>saved</code> (a saved color pressed), or{' '}
      <code>eyedropper</code>.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its parts:{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Header"
      />
      ,{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Panel"
      />{' '}
      (the eyedropper in the header). With an{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Opacity"
      />{' '}
      in it, the color has an opacity; without one, it’s always opaque (
      <code>#rrggbb</code>, a value’s alpha dropped as it changes).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerHeaderRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The app’s header: e.g. a <a href="toolbar">Toolbar</a> with the
      eyedropper, “Colors” and a close button (in a sheet: its{' '}
      <PartLink
        component="sheet"
        part="Sheet.Header"
      />{' '}
      instead).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerPanelRows: readonly PropRow[] = [
  [
    'mode',
    'string',
    undefined,
    <>
      The mode shown (controlled): its{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Mode"
      />
      ’s and{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.View"
      />
      ’s <code>value</code>. To render it uncontrolled, use the{' '}
      <code>defaultMode</code> prop instead.
    </>,
  ],
  [
    'defaultMode',
    'string',
    'the first mode',
    'The initial mode (uncontrolled).',
  ],
  [
    'onModeChange',
    '(mode: string, eventDetails) => void',
    undefined,
    'Called with the mode chosen (its segmented control’s details).',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its parts, as composed: its modes (
      <PartLink
        component="color-picker"
        part="ColorPicker.Modes"
      />
      , a{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.View"
      />{' '}
      each), the{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Opacity"
      />
      , the{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Swatches"
      />
      ; any of them left out.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerModesRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its modes:{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Mode"
      />
      s, in their order (its highlight after them, its own).
    </>,
  ],
  [
    '…',
    'SegmentedRootProps',
    undefined,
    <>
      A{' '}
      <PartLink
        component="segmented"
        part="Segmented.Root"
      />
      ’s props, but its value (the panel’s <code>mode</code>); named “Mode” by
      default (<code>aria-label</code>).
    </>,
  ],
];

export const colorPickerModeRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    <>
      Its mode (required): its{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.View"
      />
      ’s <code>value</code>, and the panel’s <code>mode</code> while it’s
      chosen.
    </>,
  ],
  ['children', 'ReactNode', undefined, 'Its label: e.g. “Grid”, “RGB”.'],
  [
    '…',
    'SegmentedItemProps',
    undefined,
    <>
      A{' '}
      <PartLink
        component="segmented"
        part="Segmented.Item"
      />
      ’s props (e.g. <code>disabled</code>).
    </>,
  ],
];

export const colorPickerViewRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    <>
      Its mode (required): its{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Mode"
      />
      ’s <code>value</code>; shown while it’s chosen.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What it shows: a{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Grid"
      />
      , a{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Spectrum"
      />
      , a{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Sliders"
      />
      .
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerGridRows: readonly PropRow[] = [
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerSpectrumRows: readonly PropRow[] = [
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerSlidersRows: readonly PropRow[] = [
  [
    'model',
    union('rgb', 'hsl', 'cmyk'),
    code('rgb'),
    <>
      Its color model, its channels’ sliders: red, green and blue (0–255); hue
      (0–360°), saturation and lightness (0–100%); cyan, magenta, yellow and
      black (0–100%; naive, from sRGB, no ink’s profile).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerOpacityRows: readonly PropRow[] = [
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerSwatchesRows: readonly PropRow[] = [
  [
    'savedColors',
    'string[]',
    undefined,
    <>
      The saved colors (controlled). To render them uncontrolled, use the{' '}
      <code>defaultSavedColors</code> prop instead.
    </>,
  ],
  [
    'defaultSavedColors',
    'string[]',
    'ten colors',
    'The initial saved colors (uncontrolled).',
  ],
  [
    'onSavedColorsChange',
    '(colors: string[], eventDetails) => void',
    undefined,
    <>
      Called with the saved colors as one is added (the add button) or deleted
      (its menu), and why (<code>add</code>, <code>delete</code>).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerEyedropperRows: readonly PropRow[] = [
  [
    'render',
    'ReactElement',
    <>
      a{' '}
      <PartLink
        component="button"
        part="Button.Root"
      />
    </>,
    <>
      What it renders: e.g. a{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Button"
      />{' '}
      in a toolbar, sized as its other buttons.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its content: e.g. an eyedropper symbol.',
  ],
  [
    '…',
    'ButtonRootProps',
    undefined,
    'A button’s props (not onClick: it picks a color off the screen).',
  ],
];

export const colorPickerWellRows: readonly PropRow[] = [
  [
    'color',
    'string',
    undefined,
    'Its color (a hex string); without one, the hues only.',
  ],
  ['size', union('small', 'large'), code('small'), 'Its sizes: 28px, or 36px.'],
  ...elementRows('button', 'HTMLButtonElement'),
];

/** `parseColor(hex)`: its argument, what it returns. */
export const parseColorRows: readonly PropRow[] = [
  ['hex', 'string', undefined, 'A hex color: #rgb, #rrggbb or #rrggbbaa.'],
  [
    '(return)',
    'Rgba',
    undefined,
    <>
      Its channels: <code>r</code>, <code>g</code>, <code>b</code> (0–255),{' '}
      <code>a</code> (0–1; 1 without alpha).
    </>,
  ],
];

/** `formatColor(rgba)`: its argument, what it returns. */
export const formatColorRows: readonly PropRow[] = [
  [
    'rgba',
    'Rgba',
    undefined,
    <>
      Channels: <code>r</code>, <code>g</code>, <code>b</code> (0–255, rounded
      and clamped), <code>a</code> (0–1).
    </>,
  ],
  [
    '(return)',
    'string',
    undefined,
    'A hex color in capitals: #RRGGBB, or #RRGGBBAA if not opaque.',
  ],
];

/** `defaultSavedColors`: what it is. */
export const defaultSavedColorsRows: readonly PropRow[] = [
  [
    '(value)',
    'string[]',
    undefined,
    <>
      The default saved colors (hex strings), the swatches’{' '}
      <code>defaultSavedColors</code> by default.
    </>,
  ],
];
