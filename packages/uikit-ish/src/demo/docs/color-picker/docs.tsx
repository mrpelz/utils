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
      The color, as a hex string (<code>#rrggbb</code>, or{' '}
      <code>#rrggbbaa</code> with opacity; controlled). To render an
      uncontrolled picker, use the <code>defaultValue</code> prop instead.
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
      Called with the picked color (in uppercase hex), and why (
      <code>reason</code>): <code>grid</code>, <code>spectrum</code>,{' '}
      <code>sliders</code>, <code>opacity</code>, <code>saved</code> (a saved
      color pressed), <code>eyedropper</code>, <code>system-colors</code> (the
      system’s color picker), <code>code</code> (its hex code typed),{' '}
      <code>named</code> (a named color picked), or <code>flatten</code> (made
      opaque through the swatches’ color, see <code>flattenOnPress</code>).
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
    'Called with the chosen mode (with its segmented control’s details).',
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
      (the eyedropper goes in the header, and the modes’{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Modes"
      />{' '}
      in the panel, or anywhere in the picker, for example a sheet’s header).
      With an{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Opacity"
      />{' '}
      inside, the color has an opacity. Without one, it’s always opaque (
      <code>#rrggbb</code>), and a value’s alpha is dropped as it changes.
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
      , unless it sits elsewhere in its picker, with a{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.View"
      />{' '}
      for each), the{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Opacity"
      />
      , the{' '}
      <PartLink
        component="color-picker"
        part="ColorPicker.Swatches"
      />
      . Any of them can be left out.
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
      s, in their order (with its own highlight after them).
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
      ’s props, except its value (which is the panel’s <code>mode</code>). It’s
      named “Mode” by default (<code>aria-label</code>).
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
      ’s <code>value</code>, which is the panel’s <code>mode</code> while it’s
      chosen.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its label, for example “Grid” or “RGB”.',
  ],
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
      ’s props (for example <code>disabled</code>).
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
      ’s <code>value</code>. It shows while that mode is chosen.
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
      Its color model, which sets its channels’ sliders: red, green and blue
      (0–255, or 0–100% with <code>range</code>); hue (0–360°), saturation and
      lightness (0–100%); or cyan, magenta, yellow and black (0–100%, a naive
      conversion from sRGB, without an ink profile).
    </>,
  ],
  [
    'range',
    union('byte', 'percentage'),
    code('byte'),
    <>
      The range of red, green and blue (for <code>model</code> <code>rgb</code>;
      the others’ ranges are fixed): in bytes (0–255), or in percent (0–100%).
      Percent is coarser: a channel that’s set is rounded to it, while the
      others (and a color picked elsewhere, such as a swatch) stay exact.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What goes after its channels, spaced like them, for example the code (
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
      Whether pressing the color while it’s translucent offers to make it
      opaque: an <a href={publicUrl('action-sheet')}>Action Sheet</a>, “Flatten
      Color?”, with Remove Transparency, Flatten on White and Flatten on Black
      (the change’s reason is <code>flatten</code>).
    </>,
  ],
  [
    'onSavedColorsChange',
    '(colors: string[], eventDetails) => void',
    undefined,
    <>
      Called with the saved colors when one is added (with the add button) or
      deleted (from its menu), and why (<code>add</code>, <code>delete</code>).
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
      What it renders, for example a{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Button"
      />{' '}
      in a toolbar, sized like its other buttons.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its content, for example an eyedropper symbol.',
  ],
  [
    '…',
    'ButtonRootProps',
    undefined,
    'A button’s props, except onClick (it picks a color off the screen).',
  ],
];

export const colorPickerCodeRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What goes before its field, for example its copy button (
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
    'What it renders, for example a button sized like the code’s field.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its content, for example a copy symbol (replaced by a checkmark for a moment after copying).',
  ],
  [
    'onCodeCopy',
    '(code: string, event: Event) => void',
    undefined,
    'Called with the code copied to the clipboard, and the event.',
  ],
  [
    '…',
    'ButtonRootProps',
    undefined,
    'A button’s props, except onClick (it opens the menu of codes).',
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
      What it renders, for example a{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Button"
      />{' '}
      in a toolbar, sized like its other buttons.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its content, for example a palette symbol.',
  ],
  [
    '…',
    'ButtonRootProps',
    undefined,
    'A button’s props, except onClick (it opens the system’s color picker).',
  ],
];

export const colorPickerWellRows: readonly PropRow[] = [
  [
    'color',
    'string',
    undefined,
    'Its color (a hex string). Without one, it shows only the hues.',
  ],
  ['size', union('small', 'large'), code('small'), 'Its size: 28px or 36px.'],
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
      Its channels: <code>r</code>, <code>g</code> and <code>b</code> (0–255),
      and <code>a</code> (0–1, or 1 without alpha).
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
      Channels: <code>r</code>, <code>g</code> and <code>b</code> (0–255,
      rounded and clamped), and <code>a</code> (0–1).
    </>,
  ],
  [
    '(return)',
    'string',
    undefined,
    'A hex color in capitals: #RRGGBB, or #RRGGBBAA if it isn’t opaque.',
  ],
];

/** `defaultSavedColors`: what it is. */
export const defaultSavedColorsRows: readonly PropRow[] = [
  [
    '(value)',
    'string[]',
    undefined,
    <>
      The default saved colors (hex strings), used as the swatches’{' '}
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
      s (for example the app’s), and{' '}
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
      Its color (required): any CSS color (for example a name, a hex code or{' '}
      <code>oklch()</code>).
    </>,
  ],
  [
    'children',
    'ReactNode',
    <>
      its <code>color</code>
    </>,
    'Its label (for example its name).',
  ],
  ...elementRows('li', 'HTMLLIElement'),
];
