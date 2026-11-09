import {
  code,
  elementRows,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

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
      <code>opacity</code>, <code>saved</code> (a saved color pressed),{' '}
      <code>eyedropper</code>, <code>system-colors</code> (the system’s color
      picker), <code>code</code> (its hex code typed), <code>named</code> (a
      named color picked), or <code>flatten</code> (made opaque by the swatches’
      color, see <code>flattenOnPress</code>).
    </>,
  ],
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
      Its parts: its header (in a popover, its{' '}
      <PartLink
        component="popover"
        part="Popover.Header"
      />
      ; in a sheet, its{' '}
      <PartLink
        component="sheet"
        part="Sheet.Header"
      />
      ) and its{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Panel"
      />{' '}
      (the eyedropper in the header; the modes’{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Modes"
      />{' '}
      in the panel, or anywhere in the picker, e.g. a sheet’s header). With an{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Opacity"
      />{' '}
      in it, the color has an opacity; without one, it’s always opaque (
      <code>#rrggbb</code>, a value’s alpha dropped as it changes).
    </>,
  ],
  ...renderRows('div', 'HTMLDivElement'),
];

export const colorPickerPanelRows: readonly PropRow[] = [
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
      , unless elsewhere in its picker; a{' '}
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
      , a{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Named"
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
      Its color model, its channels’ sliders: red, green and blue (0–255, or
      0–100%: its <code>range</code>); hue (0–360°), saturation and lightness
      (0–100%); cyan, magenta, yellow and black (0–100%; naive, from sRGB, no
      ink’s profile).
    </>,
  ],
  [
    'range',
    union('byte', 'percentage'),
    code('byte'),
    <>
      Red, green and blue’s range (<code>model</code> <code>rgb</code>; the
      others’ are fixed): in bytes (0–255), or in percent (0–100%). Percent is
      coarser: a channel set is rounded to it, the others (and a color picked
      elsewhere, e.g. a swatch) kept exact.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      After its channels, spaced as they are: e.g. the code (
      <PartLink
        component="color-picker"
        part="ColorPicker.Code"
      />
      ).
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
    'flattenOnPress',
    'boolean',
    'true',
    <>
      Whether pressing the color, while it’s translucent, offers to make it
      opaque: an <a href={publicUrl('action-sheet')}>Action sheet</a>, “Flatten
      Color?”, with Remove Transparency, Flatten on White and Flatten on Black
      (the change’s reason: <code>flatten</code>).
    </>,
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

export const colorPickerCodeRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Before its field: e.g. its copy button (
      <PartLink
        component="color-picker"
        part="ColorPicker.CodeCopy"
      />
      ).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerCodeCopyRows: readonly PropRow[] = [
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
    'What it renders: e.g. a button sized as the code’s field.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its content: e.g. a copy symbol (copied, a checkmark for a moment).',
  ],
  [
    'onCodeCopy',
    '(code: string, event: Event) => void',
    undefined,
    'Called with a code copied (to the clipboard), and the event.',
  ],
  [
    '…',
    'ButtonRootProps',
    undefined,
    'A button’s props (not onClick: it opens the menu of codes).',
  ],
];

export const colorPickerSystemColorsRows: readonly PropRow[] = [
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
  ['children', 'ReactNode', undefined, 'Its content: e.g. a palette symbol.'],
  [
    '…',
    'ButtonRootProps',
    undefined,
    'A button’s props (not onClick: it opens the system’s color picker).',
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

export const colorPickerNamedRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its rows:{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.NamedColor"
      />
      s (e.g. the app’s), and{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.CssNamedColors"
      />
      ’.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const colorPickerNamedColorRows: readonly PropRow[] = [
  [
    'color',
    'string',
    undefined,
    <>
      Its color (required): any CSS color (e.g. a name, a hex code,{' '}
      <code>oklch()</code>).
    </>,
  ],
  [
    'children',
    'ReactNode',
    <>
      its <code>color</code>
    </>,
    'Its label (e.g. its name).',
  ],
  ...elementRows('li', 'HTMLLIElement'),
];
