import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  ColorPicker,
  Symbol,
  Toolbar,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfEyedropper } from '../../tooling/icons.js';
import {
  colorPickerEyedropperRows,
  colorPickerHeaderRows,
  colorPickerPanelRows,
  colorPickerRootRows,
  colorPickerWellRows,
  defaultSavedColorsRows,
  formatColorRows,
  parseColorRows,
} from './docs.js';
import {
  getPropOptionsPanel,
  getPropOptionsRoot,
  propOptionsEyedropper,
  propOptionsGuideWell,
  propOptionsHeader,
} from './props.js';

const parseColorCode = `parseColor('#007AFF'); // { r: 0, g: 122, b: 255, a: 1 }
parseColor('#007AFF80'); // { r: 0, g: 122, b: 255, a: 0.502 }`;

const formatColorCode = `formatColor({ r: 0, g: 122, b: 255, a: 1 }); // '#007AFF'
formatColor({ r: 0, g: 122, b: 255, a: 0.5 }); // '#007AFF80'`;

const defaultSavedColorsCode = `// The defaults, and the app's own after them.
<ColorPicker.Panel defaultSavedColors={[...defaultSavedColors, '#5856D6']} />`;

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
        The default saved colors: the <PartLink part="ColorPicker.Panel" />
        ’s by default; to start from them, adding the app’s.
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
  EyedropperPart,
  WellPart,
];
