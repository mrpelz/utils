import { FunctionComponent, ReactNode, useMemo } from 'react';

import {
  Button,
  ColorPicker,
  Symbol,
  Toolbar,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfEyedropper } from '../../tooling/icons.js';
import {
  colorPickerEyedropperRows,
  colorPickerGridRows,
  colorPickerHeaderRows,
  colorPickerModeRows,
  colorPickerModesRows,
  colorPickerOpacityRows,
  colorPickerPanelRows,
  colorPickerRootRows,
  colorPickerSlidersRows,
  colorPickerSpectrumRows,
  colorPickerSwatchesRows,
  colorPickerViewRows,
  colorPickerWellRows,
  defaultSavedColorsRows,
  formatColorRows,
  parseColorRows,
} from './docs.js';
import { panelParts } from './panel.js';
import {
  getPropOptionsPanel,
  getPropOptionsRoot,
  getPropOptionsSwatches,
  propOptionsEyedropper,
  propOptionsGuideWell,
  propOptionsHeader,
  propOptionsMode,
  propOptionsPart,
  propOptionsSliders,
} from './props.js';

const parseColorCode = `parseColor('#007AFF'); // { r: 0, g: 122, b: 255, a: 1 }
parseColor('#007AFF80'); // { r: 0, g: 122, b: 255, a: 0.502 }`;

const formatColorCode = `formatColor({ r: 0, g: 122, b: 255, a: 1 }); // '#007AFF'
formatColor({ r: 0, g: 122, b: 255, a: 0.5 }); // '#007AFF80'`;

const defaultSavedColorsCode = `// The defaults, and the app's own after them.
<ColorPicker.Swatches defaultSavedColors={[...defaultSavedColors, '#5856D6']} />`;

/** `ColorPicker.Root`, outlined, with its props (its panel inside). */
const RootPart: FunctionComponent = () => {
  const id = 'color-picker-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'ColorPicker.Root' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ColorPicker.Root"
    >
      <ColorPicker.Root
        key={elementKey}
        {...props}
        style={{ width: 'min(402px, 100%)', ...props.style }}
      >
        <ColorPicker.Panel>{panelParts()}</ColorPicker.Panel>
      </ColorPicker.Root>
    </Component>
  );
};

/** `ColorPicker.Header`, outlined, holding a toolbar. */
const HeaderPart: FunctionComponent = () => {
  const id = 'color-picker-parts-header';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsHeader, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ColorPicker.Header',
  });

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      state={[state]}
      title="ColorPicker.Header"
    >
      <ColorPicker.Root
        defaultValue="#AF52DE"
        style={{ width: 'min(402px, 100%)' }}
      >
        <ColorPicker.Header {...props}>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <span>Colors</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </ColorPicker.Header>
        <ColorPicker.Panel>{panelParts()}</ColorPicker.Panel>
      </ColorPicker.Root>
    </Component>
  );
};

/** `ColorPicker.Panel`, outlined, with its props. */
const PanelPart: FunctionComponent = () => {
  const id = 'color-picker-parts-panel';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsPanel(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'ColorPicker.Panel',
    },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ColorPicker.Panel"
    >
      <ColorPicker.Root
        defaultValue="#AF52DE"
        style={{ width: 'min(402px, 100%)' }}
      >
        <ColorPicker.Panel
          key={elementKey}
          {...props}
        >
          {panelParts({ modes: 'all' })}
        </ColorPicker.Panel>
      </ColorPicker.Root>
    </Component>
  );
};

/**
 * A part in a panel (see panel.tsx), outlined, with its props: a demo of
 * its own, in a picker (its color purple).
 */
const panelPartDemo = <T extends Parameters<typeof usePropControl>[0]>(
  id: string,
  title: string,
  getOptions: (addLog: AddLog) => T,
  render: (props: ReturnType<typeof usePropControl<T>>[1]) => ReactNode,
): FunctionComponent => {
  const PartDemo: FunctionComponent = () => {
    const [log, addLog] = useLog();
    const [external] = useProvidedState(id);
    const [control, props, state, elementKey] = usePropControl(
      useMemo(() => getOptions(addLog), [addLog]),
      { external, isOpen: true, emphasize: 'outline', title },
    );

    return (
      <Component
        hasInputGuards
        isCentered
        isInline
        isStretched
        controls={[control]}
        id={id}
        log={log}
        state={[state]}
        title={title}
      >
        <ColorPicker.Root
          key={elementKey}
          defaultValue="#AF52DE"
          style={{ width: 'min(402px, 100%)' }}
        >
          {render(props)}
        </ColorPicker.Root>
      </Component>
    );
  };
  PartDemo.displayName = title;
  return PartDemo;
};

/** `ColorPicker.Modes`: the segmented control, its modes in it. */
const ModesPart = panelPartDemo(
  'color-picker-parts-modes',
  'ColorPicker.Modes',
  () => propOptionsPart,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.Modes {...props}>
        <ColorPicker.Mode value="grid">Grid</ColorPicker.Mode>
        <ColorPicker.Mode value="spectrum">Spectrum</ColorPicker.Mode>
        <ColorPicker.Mode value="rgb">Sliders</ColorPicker.Mode>
      </ColorPicker.Modes>
      <ColorPicker.View value="grid">
        <ColorPicker.Grid />
      </ColorPicker.View>
      <ColorPicker.View value="spectrum">
        <ColorPicker.Spectrum />
      </ColorPicker.View>
      <ColorPicker.View value="rgb">
        <ColorPicker.Sliders />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.Mode`: one of them (Spectrum), with its props. */
const ModePart = panelPartDemo(
  'color-picker-parts-mode',
  'ColorPicker.Mode',
  () => propOptionsMode,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.Modes>
        <ColorPicker.Mode value="grid">Grid</ColorPicker.Mode>
        <ColorPicker.Mode
          value="spectrum"
          {...props}
        />
      </ColorPicker.Modes>
      <ColorPicker.View value="grid">
        <ColorPicker.Grid />
      </ColorPicker.View>
      <ColorPicker.View value="spectrum">
        <ColorPicker.Spectrum />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.View`: the grid's, shown while its mode is chosen. */
const ViewPart = panelPartDemo(
  'color-picker-parts-view',
  'ColorPicker.View',
  () => propOptionsPart,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.Modes>
        <ColorPicker.Mode value="grid">Grid</ColorPicker.Mode>
        <ColorPicker.Mode value="spectrum">Spectrum</ColorPicker.Mode>
      </ColorPicker.Modes>
      <ColorPicker.View
        value="grid"
        {...props}
      >
        <ColorPicker.Grid />
      </ColorPicker.View>
      <ColorPicker.View value="spectrum">
        <ColorPicker.Spectrum />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.Grid`: its only view (no modes' control). */
const GridPart = panelPartDemo(
  'color-picker-parts-grid',
  'ColorPicker.Grid',
  () => propOptionsPart,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.View value="grid">
        <ColorPicker.Grid {...props} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.Spectrum`: its only view. */
const SpectrumPart = panelPartDemo(
  'color-picker-parts-spectrum',
  'ColorPicker.Spectrum',
  () => propOptionsPart,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.View value="spectrum">
        <ColorPicker.Spectrum {...props} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.Sliders`: its only view, by its model. */
const SlidersPart = panelPartDemo(
  'color-picker-parts-sliders',
  'ColorPicker.Sliders',
  () => propOptionsSliders,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.View value="sliders">
        <ColorPicker.Sliders {...props} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.Opacity`: under the spectrum, the color translucent. */
const OpacityPart = panelPartDemo(
  'color-picker-parts-opacity',
  'ColorPicker.Opacity',
  () => propOptionsPart,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.View value="spectrum">
        <ColorPicker.Spectrum />
      </ColorPicker.View>
      <ColorPicker.Opacity {...props} />
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.Swatches`: under the grid, with their props. */
const SwatchesPart = panelPartDemo(
  'color-picker-parts-swatches',
  'ColorPicker.Swatches',
  getPropOptionsSwatches,
  (props) => (
    <ColorPicker.Panel>
      <ColorPicker.View value="grid">
        <ColorPicker.Grid />
      </ColorPicker.View>
      <ColorPicker.Swatches {...props} />
    </ColorPicker.Panel>
  ),
);

/** `ColorPicker.Eyedropper`, outlined, in the header's toolbar. */
const EyedropperPart: FunctionComponent = () => {
  const id = 'color-picker-parts-eyedropper';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsEyedropper, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ColorPicker.Eyedropper',
  });

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      state={[state]}
      title="ColorPicker.Eyedropper"
    >
      <ColorPicker.Root
        defaultValue="#AF52DE"
        style={{ width: 'min(402px, 100%)' }}
      >
        <ColorPicker.Header>
          <Toolbar.Root placement="block-start">
            <Toolbar.Leading>
              <ColorPicker.Eyedropper {...props}>
                <Button.Icon>
                  <Symbol icon={sfEyedropper} />
                </Button.Icon>
              </ColorPicker.Eyedropper>
            </Toolbar.Leading>
            <Toolbar.Title>
              <span>Colors</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </ColorPicker.Header>
        <ColorPicker.Panel>{panelParts()}</ColorPicker.Panel>
      </ColorPicker.Root>
    </Component>
  );
};

/** `ColorPicker.Well`, outlined, with its props. */
const WellPart: FunctionComponent = () => {
  const id = 'color-picker-parts-well';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideWell, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ColorPicker.Well',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ColorPicker.Well"
    >
      <ColorPicker.Well
        {...props}
        onClick={() => addLog('well clicked')}
      />
    </Component>
  );
};

/** `/color-picker/parts`: the picker, its header and panel, the well. */
export const ColorPickerParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the color, for its parts.</li>
      <li>Header: the app’s (a toolbar: the eyedropper, a title, close).</li>
      <li>
        Panel: its parts as composed: its modes (a segmented control, a view
        each: the grid, the spectrum, sliders), the opacity, the swatches (the
        color, the saved colors).
      </li>
      <li>Eyedropper: picks a color off the screen.</li>
      <li>Well: shows a color, opening the picker (outside it).</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="color-picker"
          part="ColorPicker.Root"
        />
        <ul>
          <li>
            <PartLink
              component="color-picker"
              part="ColorPicker.Header"
            />{' '}
            (optional)
            <ul>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.Eyedropper"
                />{' '}
                (optional)
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="color-picker"
              part="ColorPicker.Panel"
            />
            <ul>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.Modes"
                />{' '}
                (optional)
                <ul>
                  <li>
                    <PartLink
                      component="color-picker"
                      part="ColorPicker.Mode"
                    />{' '}
                    (one per mode)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.View"
                />{' '}
                (one per mode)
                <ul>
                  <li>
                    <PartLink
                      component="color-picker"
                      part="ColorPicker.Grid"
                    />
                    ,{' '}
                    <PartLink
                      component="color-picker"
                      part="ColorPicker.Spectrum"
                    />{' '}
                    or{' '}
                    <PartLink
                      component="color-picker"
                      part="ColorPicker.Sliders"
                    />
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.Opacity"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.Swatches"
                />{' '}
                (optional)
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />{' '}
        (optional; or any trigger)
      </li>
      <li>
        Helpers (anywhere):
        <ul>
          <li>
            <PartLink
              component="color-picker"
              part="parseColor"
            />
          </li>
          <li>
            <PartLink
              component="color-picker"
              part="formatColor"
            />
          </li>
          <li>
            <PartLink
              component="color-picker"
              part="defaultSavedColors"
            />
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="colorpicker-root"
      level={2}
    >
      <code>ColorPicker.Root</code>
    </Heading>
    <ul>
      <li>
        The color, a hex string (<code>#rrggbbaa</code> with opacity), for its
        parts; in the app’s popover (regular) or sheet (compact).
      </li>
      <li>
        Its opacity by its panel’s parts: with an{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Opacity"
        />
        , the color translucent; without one, always opaque.
      </li>
      <li>
        State: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code> (with why).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerRootRows} />

    <Heading
      id="colorpicker-header"
      level={2}
    >
      <code>ColorPicker.Header</code>
    </Heading>
    <ul>
      <li>
        The app’s header above the panel (16px from the popover’s top, 10px
        above the panel): e.g. a <a href="toolbar">Toolbar</a>.
      </li>
      <li>
        In a sheet, its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />{' '}
        instead.
      </li>
      <li>
        Optional: without it (e.g. a popover from a list row,{' '}
        <a href="color-picker/composition#in-a-list-row">In a list row</a>), the
        panel starts 16px from the top.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerHeaderRows} />

    <Heading
      id="colorpicker-panel"
      level={2}
    >
      <code>ColorPicker.Panel</code>
    </Heading>
    <ul>
      <li>
        Its parts, as composed (in its padding, spaced): its modes (
        <PartLink
          component="color-picker"
          part="ColorPicker.Modes"
        />
        , a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.View"
        />{' '}
        each, paired by their <code>value</code>s), the{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Opacity"
        />
        , the{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Swatches"
        />
        ; any of them left out, in any order.
      </li>
      <li>
        State: the mode shown, <code>mode</code> or <code>defaultMode</code> (by
        default, the first), <code>onModeChange</code>.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <PanelPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerPanelRows} />

    <Heading
      id="colorpicker-modes"
      level={2}
    >
      <code>ColorPicker.Modes</code>
    </Heading>
    <ul>
      <li>
        Its modes’ control: a <a href="segmented">Segmented</a> control (its
        highlight its own), choosing the panel’s mode; 24px above the view.
      </li>
      <li>
        Its{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Mode"
        />
        s, in their order: which modes, and how they’re labeled (e.g. “Sliders”
        for one sliders view, “RGB”, “HSL” for several).
      </li>
      <li>Optional: a panel with one view needs none.</li>
      <li>
        Renders a{' '}
        <PartLink
          component="segmented"
          part="Segmented.Root"
        />
        , named “Mode”.
      </li>
    </ul>
    <ModesPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerModesRows} />

    <Heading
      id="colorpicker-mode"
      level={2}
    >
      <code>ColorPicker.Mode</code>
    </Heading>
    <ul>
      <li>
        A mode: its label, choosing its{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.View"
        />{' '}
        (the one with its <code>value</code>).
      </li>
      <li>
        Renders a{' '}
        <PartLink
          component="segmented"
          part="Segmented.Item"
        />
        .
      </li>
    </ul>
    <ModePart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerModeRows} />

    <Heading
      id="colorpicker-view"
      level={2}
    >
      <code>ColorPicker.View</code>
    </Heading>
    <ul>
      <li>
        A mode’s view: shown while its{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Mode"
        />{' '}
        is chosen (by <code>value</code>); without{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Modes"
        />
        , the panel’s only one.
      </li>
      <li>
        As high as the grid, its content centered: switching doesn’t move a
        popover.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ViewPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerViewRows} />

    <Heading
      id="colorpicker-grid"
      level={2}
    >
      <code>ColorPicker.Grid</code>
    </Heading>
    <ul>
      <li>
        Swatches, 12 by 10: a gray row, then hues by lightness; the color’s
        outlined. Each a toggle button, named by its color.
      </li>
      <li>
        Renders a <code>div</code> (a group, named “Grid”).
      </li>
    </ul>
    <GridPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerGridRows} />

    <Heading
      id="colorpicker-spectrum"
      level={2}
    >
      <code>ColorPicker.Spectrum</code>
    </Heading>
    <ul>
      <li>
        Hues across, white to black down; the color ringed. Dragged (it doesn’t
        swipe a sheet away), or by arrow keys (the hue across, 5°; the lightness
        down, 5%).
      </li>
      <li>
        Renders a <code>div</code> (a slider, named “Spectrum”, its value the
        color).
      </li>
    </ul>
    <SpectrumPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerSpectrumRows} />

    <Heading
      id="colorpicker-sliders"
      level={2}
    >
      <code>ColorPicker.Sliders</code>
    </Heading>
    <ul>
      <li>
        A color model’s channels (<code>model</code>): red, green and blue; hue,
        saturation and lightness; cyan, magenta, yellow and black.
      </li>
      <li>
        Each a row: its title (all caps), a slider mixing from the color (its
        track the color with the channel along its range), and its value, typed
        too (committed on Enter, or as it’s left).
      </li>
      <li>
        Its values kept while they’re the color’s: a hue isn’t lost to a gray,
        nor inks to black.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <SlidersPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerSlidersRows} />

    <Heading
      id="colorpicker-opacity"
      level={2}
    >
      <code>ColorPicker.Opacity</code>
    </Heading>
    <ul>
      <li>
        The opacity: a slider (the color fading in over a checkerboard, its knob
        the color, translucent) and its percentage, typed too.
      </li>
      <li>
        Rendered, the color has an opacity (<code>#rrggbbaa</code>); without
        one, it’s opaque, a value’s alpha dropped as it changes (e.g. a
        translucent saved color picked opaque).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <OpacityPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerOpacityRows} />

    <Heading
      id="colorpicker-swatches"
      level={2}
    >
      <code>ColorPicker.Swatches</code>
    </Heading>
    <ul>
      <li>
        The color (over black and white, translucent) beside the saved colors,
        in pages of ten (with a <a href="page-control">Page control</a>).
      </li>
      <li>
        State: <code>savedColors</code> or <code>defaultSavedColors</code>,{' '}
        <code>onSavedColorsChange</code>.
      </li>
      <li>
        The add button saves the color; a saved color’s menu (a secondary click:
        right click, long press) deletes it.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <SwatchesPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerSwatchesRows} />

    <Heading
      id="colorpicker-eyedropper"
      level={2}
    >
      <code>ColorPicker.Eyedropper</code>
    </Heading>
    <ul>
      <li>
        A button picking a color off the screen: the browser’s{' '}
        <code>EyeDropper</code>; where there’s none (e.g. Safari), it renders
        nothing.
      </li>
      <li>
        Renders a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />
        , or its <code>render</code> (e.g. a toolbar’s button).
      </li>
    </ul>
    <EyedropperPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerEyedropperRows} />

    <Heading
      id="colorpicker-well"
      level={2}
    >
      <code>ColorPicker.Well</code>
    </Heading>
    <ul>
      <li>
        A color well: a disk of hues around its color; the trigger opening the
        picker (e.g. a{' '}
        <code>{'<Popover.Trigger render={<ColorPicker.Well />} />'}</code>
        ).
      </li>
      <li>
        Renders a <code>button</code>, named “Color”.
      </li>
    </ul>
    <WellPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerWellRows} />

    <Heading
      id="parsecolor"
      level={2}
    >
      <code>parseColor</code>
    </Heading>
    <ul>
      <li>
        A hex color (the picker’s values) as its channels, e.g. to blend it or
        to check its contrast.
      </li>
    </ul>
    <CodeView code={parseColorCode} />
    <h3>Arguments and return</h3>
    <PropsTable rows={parseColorRows} />

    <Heading
      id="formatcolor"
      level={2}
    >
      <code>formatColor</code>
    </Heading>
    <ul>
      <li>
        Channels as a hex color, as the picker’s values are (
        <PartLink part="parseColor" />
        ’s reverse).
      </li>
    </ul>
    <CodeView code={formatColorCode} />
    <h3>Arguments and return</h3>
    <PropsTable rows={formatColorRows} />

    <Heading
      id="defaultsavedcolors"
      level={2}
    >
      <code>defaultSavedColors</code>
    </Heading>
    <ul>
      <li>
        The default saved colors: the <PartLink part="ColorPicker.Swatches" />’
        by default; to start from them, adding the app’s.
      </li>
    </ul>
    <CodeView code={defaultSavedColorsCode} />
    <h3>Value</h3>
    <PropsTable rows={defaultSavedColorsRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const colorPickerPartsDemos = [
  RootPart,
  HeaderPart,
  PanelPart,
  ModesPart,
  ModePart,
  ViewPart,
  GridPart,
  SpectrumPart,
  SlidersPart,
  OpacityPart,
  SwatchesPart,
  EyedropperPart,
  WellPart,
];
