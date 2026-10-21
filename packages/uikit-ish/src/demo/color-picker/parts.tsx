import { sfEyedropper } from '@bradleyhodges/sfsymbols/sfEyedropper';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  ColorPicker,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  colorPickerEyedropperRows,
  colorPickerHeaderRows,
  colorPickerPanelRows,
  colorPickerRootRows,
  colorPickerWellRows,
} from './docs.js';
import {
  getPropOptionsPanel,
  getPropOptionsRoot,
  propOptionsEyedropper,
  propOptionsGuideWell,
  propOptionsHeader,
} from './props.js';

/** `ColorPicker.Root`, outlined, with its props (its panel inside). */
const RootPart: FunctionComponent = () => {
  const id = 'color-picker-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'ColorPicker.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
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
        <ColorPicker.Panel />
      </ColorPicker.Root>
    </Component>
  );
};

/** `ColorPicker.Header`, outlined, holding a toolbar. */
const HeaderPart: FunctionComponent = () => {
  const id = 'color-picker-parts-header';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsHeader,
    'ColorPicker.Header',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
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
        <ColorPicker.Panel />
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
    'ColorPicker.Panel',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
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
        />
      </ColorPicker.Root>
    </Component>
  );
};

/** `ColorPicker.Eyedropper`, outlined, in the header's toolbar. */
const EyedropperPart: FunctionComponent = () => {
  const id = 'color-picker-parts-eyedropper';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsEyedropper,
    'ColorPicker.Eyedropper',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
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
        <ColorPicker.Panel />
      </ColorPicker.Root>
    </Component>
  );
};

/** `ColorPicker.Well`, outlined, with its props. */
const WellPart: FunctionComponent = () => {
  const id = 'color-picker-parts-well';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideWell,
    'ColorPicker.Well',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
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
        Panel: the views (grid, spectrum, sliders), the opacity, the saved
        colors.
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
            />
            <ul>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.Eyedropper"
                />
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="color-picker"
              part="ColorPicker.Panel"
            />
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />
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
        parts; in the app’s popover (iPad) or sheet (iPhone).
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
        The app’s header above the panel (Figma: 16px from the popover’s top,
        10px above the panel): e.g. a <a href="toolbar">Toolbar</a>.
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
        Its views (a <a href="segmented">Segmented</a> control: Grid, Spectrum,
        Sliders), the opacity (a slider and its percentage), the color and the
        saved colors (in pages, with a <a href="page-control">Page control</a>).
      </li>
      <li>
        State: <code>mode</code> or <code>defaultMode</code>,{' '}
        <code>savedColors</code> or <code>defaultSavedColors</code>, their
        changes.
      </li>
      <li>
        The add button saves the color; a saved color’s menu (a secondary click:
        right click, long press) deletes it.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <PanelPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerPanelRows} />

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
        A color well (UIKit <code>UIColorWell</code>): a disk of hues around its
        color; the trigger opening the picker (e.g. a{' '}
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
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const colorPickerPartsDemos = [
  RootPart,
  HeaderPart,
  PanelPart,
  EyedropperPart,
  WellPart,
];
