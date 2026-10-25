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
      (the eyedropper in the header).
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
    union('grid', 'spectrum', 'sliders'),
    undefined,
    <>
      The view (controlled). To render it uncontrolled, use the{' '}
      <code>defaultMode</code> prop instead.
    </>,
  ],
  [
    'defaultMode',
    union('grid', 'spectrum', 'sliders'),
    code('grid'),
    'The initial view (uncontrolled).',
  ],
  [
    'onModeChange',
    '(mode, eventDetails) => void',
    undefined,
    'Called with the view chosen (its segmented control’s details).',
  ],
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
    'Figma’s',
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
  [
    'size',
    union('small', 'large'),
    code('small'),
    'Figma’s sizes: 28px, or 36px.',
  ],
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
      Figma’s saved colors (hex strings), the panel’s{' '}
      <code>defaultSavedColors</code> by default.
    </>,
  ],
];
