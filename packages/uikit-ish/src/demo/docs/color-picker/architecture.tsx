import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/color-picker/architecture` and its sub-page: how ColorPicker is built,
// and what flows into it.

const treeCode = `<div class="uikit-popover-popup">                      <!-- or a sheet's popup -->
  <div class="uikit-popover-header">…</div>              <!-- the app's toolbar -->
  <div class="uikit-popover-body">
    <div class="uikit-color-picker-root"
         style="--uikit-color-picker-color: #FF6A00CC; …">  <!-- its render: the body -->
      <div class="uikit-color-picker-panel">
        <div role="radiogroup" class="uikit-segmented-root">…</div> <!-- Modes -->
        <div class="uikit-color-picker-view" data-color-picker-view="grid">
          <div role="group" class="uikit-color-picker-grid">…</div>
        </div>
        <div class="uikit-color-picker-opacity">…</div>    <!-- a channel's row -->
        <div class="uikit-color-picker-swatches">…</div>   <!-- the color, saved ones -->
      </div>
    </div>
  </div>
</div>`;

const viewCode = `// View, in short: shown while its mode is chosen. One of the grid's
// height among them (a Grid or Spectrum in it), all of them as high, so
// a popover doesn't move as modes are switched.
const isOwnGridHeight = Children.toArray(children).some(
  (child) => isValidElement(child) && (child.type === Grid || child.type === Spectrum),
);
useLayoutEffect(() => (isOwnGridHeight ? registerGridHeight() : undefined), [isOwnGridHeight]);
if (mode !== value) return null;`;

const sections: readonly Section[] = [
  ['one-color-for-its-parts', 'One color for its parts'],
  ['modes-and-views', 'Modes and views'],
  ['grid-and-spectrum', 'Grid and spectrum'],
  ['channel-rows', 'Channel rows'],
  ['the-color-and-saved-colors', 'The color and saved colors'],
  ['the-browser-s-pickers', 'The browser’s pickers'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/color-picker/architecture`: how it's built, and what flows into it. */
export const ColorPickerArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A color picker is a set of parts around one color, in your app’s popover
        or sheet. It has modes and their views, channel sliders, opacity, saved
        colors, codes, and the browser’s own pickers. It has no Base UI root of
        its own. Its controls are Base UI’s and the library’s. How colors are
        represented, converted and named has a page of its own:{' '}
        <a href={publicUrl('color-picker/architecture/colors')}>Colors</a>. To
        learn how to use it, see its{' '}
        <a href={publicUrl('color-picker/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="one-color-for-its-parts"
      level={2}
    >
      One color for its parts
    </Heading>
    <ul>
      <li>
        <PartLink part="ColorPicker.Root" /> holds the color, controlled or not,
        and the mode. It shares them with every part inside it through contexts,
        wherever those parts are.
      </li>
      <li>
        The root’s element can be a popover’s or a sheet’s popup (
        <code>render</code>). Then the toolbar can sit in the popup’s header,
        and in a sheet the modes can too, while the panel scrolls under it.
      </li>
      <li>
        Each change reports its reason, such as grid, spectrum, sliders, code,
        saved or eyedropper, together with its event.
      </li>
      <li>
        The color is also set as custom properties on the root, with and without
        its opacity, for the parts’ stylesheets.
      </li>
      <li>
        <PartLink part="ColorPicker.Opacity" /> registers with the root while
        it’s rendered. Without it, the color is opaque, and an alpha you give is
        dropped.
      </li>
      <li>
        <PartLink part="ColorPicker.Panel" /> lays out and spaces what you
        compose in it.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="modes-and-views"
      level={2}
    >
      Modes and views
    </Heading>
    <ul>
      <li>
        <PartLink part="ColorPicker.Modes" /> is a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control that scrolls when
        its modes don’t fit. Each <PartLink part="ColorPicker.Mode" /> is one of
        its items. The modes are your app’s: any number, with any content.
      </li>
      <li>
        <PartLink part="ColorPicker.View" /> renders its content while its value
        is the current mode. Without a default mode, the first mode rendered is
        chosen. So a picker without <code>Modes</code> shows its only view.
      </li>
      <li>
        If any view holds a grid or a spectrum, every view takes the grid’s
        height. That way, the popover doesn’t move when you switch modes.
        Otherwise, each view is as tall as its content.
      </li>
    </ul>
    <CodeView code={viewCode} />

    <Heading
      id="grid-and-spectrum"
      level={2}
    >
      Grid and spectrum
    </Heading>
    <ul>
      <li>
        <PartLink part="ColorPicker.Grid" /> is a group of buttons: a gray row,
        then hues by lightness. A swatch is pressed while it’s the current
        color. Picking a swatch keeps the color’s opacity.
      </li>
      <li>
        <PartLink part="ColorPicker.Spectrum" /> is a single element with the
        slider role. Hue runs across, and lightness down. While the pointer is
        captured, the color under it is picked. The arrow keys step it.
      </li>
      <li>
        The spectrum’s ring sits at the color’s hue and lightness. It carries
        Base UI’s swipe ignore, so dragging on it doesn’t swipe a sheet away.
      </li>
    </ul>

    <Heading
      id="channel-rows"
      level={2}
    >
      Channel rows
    </Heading>
    <ul>
      <li>
        <PartLink part="ColorPicker.Sliders" /> and the opacity are built from
        the same channel row. A row has a title, a Base UI slider, and a field
        to type the value.
      </li>
      <li>
        The slider’s knob is centered on its value without measuring, because a
        popover that scales in would throw a measurement off.
      </li>
      <li>
        A track is a gradient of the color, with the channel running across its
        range, and a hole at the knob. A touch held on it doesn’t scroll, and
        dragging it doesn’t swipe a sheet away.
      </li>
      <li>
        Each row is a{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        . So the whole row stays above the keyboard while you type into its
        field.
      </li>
      <li>
        Typed digits apply at once, clamped to the range. When you focus the
        field, it selects all of its text. When you leave it, its value shows
        again.
      </li>
      <li>
        <PartLink part="ColorPicker.Code" /> is a row like a channel’s, for the
        hex code. The code applies once its digits make one.
      </li>
      <li>
        <PartLink part="ColorPicker.CodeCopy" /> is a{' '}
        <a href={publicUrl('menu')}>Menu</a> of the color’s codes, with a
        submenu per group. Picking one copies it to the clipboard. A checkmark
        shows for a moment afterwards.
      </li>
    </ul>

    <Heading
      id="the-color-and-saved-colors"
      level={2}
    >
      The color and saved colors
    </Heading>
    <ul>
      <li>
        <PartLink part="ColorPicker.Swatches" /> shows the current color next to
        the saved colors. A translucent color is shown over black and white.
      </li>
      <li>
        A translucent color is also a button. It opens an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a> that makes the
        color opaque: you can remove its transparency, or flatten it on white or
        on black.
      </li>
      <li>
        Saved colors, controlled or not, are shown in pages of ten. You swipe
        between pages, and they snap. With more than one page, a{' '}
        <PartLink
          component="page-control"
          part="PageControl"
        />{' '}
        shows. Only the page in view can be reached.
      </li>
      <li>
        The add button follows the saved colors, unless the color is saved
        already. Adding a color goes to the page it lands on.
      </li>
      <li>
        Each saved color has a menu, opened by a secondary click, a right click
        or a held touch. The menu deletes it.
      </li>
      <li>
        <PartLink part="ColorPicker.Well" /> is a plain button for opening the
        picker. It’s a disk of hues, with a ring around the color when it has
        one.
      </li>
    </ul>

    <Heading
      id="the-browser-s-pickers"
      level={2}
    >
      The browser’s pickers
    </Heading>
    <ul>
      <li>
        <PartLink part="ColorPicker.Eyedropper" /> is a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />{' '}
        that uses the browser’s <code>EyeDropper</code>. Where the browser has
        none, it renders nothing. A picked color keeps the current opacity.
      </li>
      <li>
        <PartLink part="ColorPicker.SystemColors" /> lays a transparent color
        input over its button. On iOS, only a press on the input itself opens
        the system’s picker. The button shows the press, and clicks the input
        from the keyboard.
      </li>
      <li>
        With the opacity rendered, the input’s <code>alpha</code> is set where
        the input supports it. It’s set as a property after rendering, and the
        value is given again, because a value set before it loses its alpha.
        Elsewhere, the input’s colors are opaque, and the opacity is kept.
      </li>
    </ul>

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From the app:</strong> the color, the mode, the saved colors,
        and the popover or sheet the picker sits in.
      </li>
      <li>
        <strong>From the library:</strong> Segmented, Menu, Action Sheet, Page
        Control, Button, List, and Viewport’s keyboard accessory.
      </li>
      <li>
        <strong>From Base UI:</strong> the channel sliders.
      </li>
      <li>
        <strong>From the browser:</strong> the eyedropper, the color input and
        the clipboard.
      </li>
    </ul>
  </>
);

const modelCode = `// A model, in short: its channels, the color's values (rounded, as
// shown), and back to red, green and blue.
const hsl: Model = {
  channels: [
    { label: 'Hue', max: 360, unit: '°' },
    { label: 'Saturation', max: 100, unit: '%' },
    { label: 'Lightness', max: 100, unit: '%' },
  ],
  from: (color) => roundedHsl(color),
  to: ([h, s, l]) => fromHsl(h % 360, s / 100, l / 100),
};`;

const colorSections: readonly Section[] = [
  ['a-color-is-a-hex-string', 'A color is a hex string'],
  ['slider-models', 'Slider models'],
  ['css-colors-in-and-out', 'CSS colors in and out'],
  ['named-colors', 'Named colors'],
];

/** `/color-picker/architecture/colors`: how its colors are represented. */
export const ColorPickerColorsArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={colorSections} />
    <ul className="demo-lead">
      <li>
        The picker’s colors are sRGB. Its sliders convert to and from a few
        models with plain arithmetic. Color.js reads and writes the other CSS
        color syntaxes. For the rest of the picker, see its{' '}
        <a href={publicUrl('color-picker/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="a-color-is-a-hex-string"
      level={2}
    >
      A color is a hex string
    </Heading>
    <ul>
      <li>
        Your app’s value is a hex string: <code>#rrggbb</code>, or{' '}
        <code>#rrggbbaa</code> when it isn’t opaque.
      </li>
      <li>
        Inside the picker, it’s parsed into red, green and blue from 0 to 255,
        and an alpha from 0 to 1. It’s written back the same way, in upper case.
      </li>
      <li>
        Two colors count as the same when their channels round to the same
        bytes. The alpha is compared separately where it matters, for saved
        colors.
      </li>
      <li>
        The spectrum and the HSL model use their own small HSL conversion, since
        every value stays in sRGB.
      </li>
    </ul>

    <Heading
      id="slider-models"
      level={2}
    >
      Slider models
    </Heading>
    <ul>
      <li>
        Each model has its channels, the color’s values rounded as shown, and a
        way back to red, green and blue. The models are red, green and blue in
        bytes or in percent, hue, saturation and lightness, and cyan, magenta,
        yellow and black.
      </li>
      <li>
        The last one is naive. It’s computed from sRGB, with no ink profile.
      </li>
      <li>
        The sliders remember the values they last set, as long as those still
        describe the color. So a hue isn’t lost when the saturation reaches
        zero, and the inks aren’t lost when black is full.
      </li>
      <li>
        Percentages are coarser than bytes. So setting one channel leaves the
        others as they are, not as they’re rounded.
      </li>
      <li>
        A track’s gradient has just enough stops to be exact: a hue every 60°, a
        lightness through the pure hue halfway, and only the two ends for the
        rest.
      </li>
    </ul>
    <CodeView code={modelCode} />

    <Heading
      id="css-colors-in-and-out"
      level={2}
    >
      CSS colors in and out
    </Heading>
    <ul>
      <li>
        The picker uses Color.js’s functional API, with only the color spaces it
        needs bundled: sRGB, HSL, HWB, Lab, LCH, OKLab, OKLCH and Display P3.
      </li>
      <li>
        When a color comes in, such as a color input’s value or a named color,
        the picker parses any CSS syntax of those spaces. It converts the color
        to sRGB, and maps it into the sRGB gamut if it falls outside.
      </li>
      <li>
        When a color goes out, it’s as codes to copy. They’re grouped as hex,
        with and without alpha, then sRGB’s functions, the perceptual ones, and
        the wide gamut’s.
      </li>
      <li>
        Coordinates have up to three decimals, and sRGB’s are whole bytes. A
        gray’s hue is written as 0 instead of <code>none</code>.
      </li>
      <li>
        Since the picker works in sRGB, a wide-gamut code always describes an
        sRGB color. Nothing outside sRGB can be picked.
      </li>
    </ul>

    <Heading
      id="named-colors"
      level={2}
    >
      Named colors
    </Heading>
    <ul>
      <li>
        <PartLink part="ColorPicker.Named" /> is one inset grouped{' '}
        <a href={publicUrl('list')}>List</a> of rows.
      </li>
      <li>
        Each <PartLink part="ColorPicker.NamedColor" /> takes any CSS color,
        parsed as above, and registers the first letter of its label. The list
        keeps the letters in document order, for a{' '}
        <PartLink
          component="list"
          part="List.Index"
        />{' '}
        at its end.
      </li>
      <li>
        A row shows a checkmark while it’s the current color, ignoring opacity.
        Pressing a row keeps the color’s opacity.
      </li>
      <li>
        When the list is shown, it scrolls the current color’s row into view at
        once, centered, within its scroller’s scroll padding.
      </li>
      <li>
        <PartLink part="ColorPicker.CssNamedColors" /> is CSS’s 148 named colors
        as rows, synonyms included, in the order CSS lists them.
      </li>
    </ul>
  </>
);
