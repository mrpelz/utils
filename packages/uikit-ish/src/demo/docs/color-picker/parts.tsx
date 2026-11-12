import { FunctionComponent, ReactNode, useMemo } from 'react';

import {
  Button,
  ColorPicker,
  type ColorPickerNamedColorProps,
  type ColorPickerNamedProps,
  Symbol,
  Toolbar,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  type PartProps,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfDocumentOnDocument,
  sfEyedropper,
  sfPaintpalette,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  colorPickerCodeCopyRows,
  colorPickerCodeRows,
  colorPickerEyedropperRows,
  colorPickerGridRows,
  colorPickerModeRows,
  colorPickerModesRows,
  colorPickerNamedColorRows,
  colorPickerNamedRows,
  colorPickerOpacityRows,
  colorPickerPanelRows,
  colorPickerRootRows,
  colorPickerSlidersRows,
  colorPickerSpectrumRows,
  colorPickerSwatchesRows,
  colorPickerSystemColorsRows,
  colorPickerViewRows,
  colorPickerWellRows,
  defaultSavedColorsRows,
  formatColorRows,
  parseColorRows,
} from './docs.js';
import { panelParts } from './panel.js';
import {
  getPropOptionsCodeCopy,
  getPropOptionsRoot,
  getPropOptionsSwatches,
  propOptionsCode,
  propOptionsEyedropper,
  propOptionsGuideWell,
  propOptionsMode,
  propOptionsNamed,
  propOptionsNamedColor,
  propOptionsPanel,
  propOptionsPart,
  propOptionsSliders,
  propOptionsSystemColors,
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'ColorPicker.Code': [],
            'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
            'ColorPicker.Grid': [],
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Named': [],
            'ColorPicker.Opacity': [],
            'ColorPicker.Panel': [],
            'ColorPicker.Sliders': ['model', 'range'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.Swatches': [],
            'ColorPicker.View': ['value'],
            Symbol: ['icon'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="ColorPicker.Root"
    >
      <ColorPicker.Root
        key={elementKey}
        {...props}
        style={{ width: 'min(402px, 100%)', ...props.style }}
      >
        {/* (All modes: its mode props' values.) */}
        <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
          {panelParts({ partProps, modes: 'all' })}
        </ColorPicker.Panel>
      </ColorPicker.Root>
    </Component>
  );
};

/** `ColorPicker.Panel`, outlined, with its props. */
const PanelPart: FunctionComponent = () => {
  const id = 'color-picker-parts-panel';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsPanel, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ColorPicker.Panel',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Button.Icon': [],
          'ColorPicker.Code': [],
          'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
          'ColorPicker.Grid': [],
          'ColorPicker.Mode': ['value'],
          'ColorPicker.Modes': [],
          'ColorPicker.Named': [],
          'ColorPicker.Opacity': [],
          'ColorPicker.Root': ['defaultValue', 'style'],
          'ColorPicker.Sliders': ['model', 'range'],
          'ColorPicker.Spectrum': [],
          'ColorPicker.Swatches': [],
          'ColorPicker.View': ['value'],
          Symbol: ['icon'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="ColorPicker.Panel"
    >
      <ColorPicker.Root
        {...partProps['ColorPicker.Root']}
        defaultValue="#AF52DE"
        style={{ width: 'min(402px, 100%)' }}
      >
        <ColorPicker.Panel
          key={elementKey}
          {...props}
        >
          {panelParts({ partProps, modes: 'all' })}
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
  render: (
    props: ReturnType<typeof usePropControl<T>>[1],
    partProps: PartProps,
  ) => ReactNode,
  // Its other parts (see `usePartControls`), by the props it sets.
  parts: Record<string, readonly string[]> = {},
): FunctionComponent => {
  const PartDemo: FunctionComponent = () => {
    const [log, addLog] = useLog();
    const [external] = useProvidedState(id);
    const [control, props, state, elementKey] = usePropControl(
      useMemo(() => getOptions(addLog), [addLog]),
      { external, isOpen: true, emphasize: 'outline', title },
    );
    const [partControls, partProps, partState] = usePartControls(
      useMemo(
        () =>
          partPropMaps(
            { 'ColorPicker.Root': ['defaultValue', 'style'], ...parts },
            addLog,
          ),
        [addLog],
      ),
      { provided: useProvidedState(id) },
    );

    return (
      <Component
        hasInputGuards
        isCentered
        isInline
        isStretched
        controls={[control, partControls]}
        id={id}
        log={log}
        state={[state, partState]}
        title={title}
      >
        <ColorPicker.Root
          key={elementKey}
          {...partProps['ColorPicker.Root']}
          defaultValue="#AF52DE"
          style={{ width: 'min(402px, 100%)' }}
        >
          {render(props, partProps)}
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
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.Modes {...props}>
        <ColorPicker.Mode
          {...partProps['ColorPicker.Mode']}
          value="grid"
        >
          Grid
        </ColorPicker.Mode>
        <ColorPicker.Mode
          {...partProps['ColorPicker.Mode']}
          value="spectrum"
        >
          Spectrum
        </ColorPicker.Mode>
        <ColorPicker.Mode
          {...partProps['ColorPicker.Mode']}
          value="rgb"
        >
          Sliders
        </ColorPicker.Mode>
      </ColorPicker.Modes>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="grid"
      >
        <ColorPicker.Grid {...partProps['ColorPicker.Grid']} />
      </ColorPicker.View>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="spectrum"
      >
        <ColorPicker.Spectrum {...partProps['ColorPicker.Spectrum']} />
      </ColorPicker.View>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="rgb"
      >
        <ColorPicker.Sliders {...partProps['ColorPicker.Sliders']} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Grid': [],
    'ColorPicker.Mode': ['value'],
    'ColorPicker.Panel': [],
    'ColorPicker.Sliders': [],
    'ColorPicker.Spectrum': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.Mode`: one of them (Spectrum), with its props. */
const ModePart = panelPartDemo(
  'color-picker-parts-mode',
  'ColorPicker.Mode',
  () => propOptionsMode,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.Modes {...partProps['ColorPicker.Modes']}>
        <ColorPicker.Mode value="grid">Grid</ColorPicker.Mode>
        <ColorPicker.Mode
          value="spectrum"
          {...props}
        />
      </ColorPicker.Modes>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="grid"
      >
        <ColorPicker.Grid {...partProps['ColorPicker.Grid']} />
      </ColorPicker.View>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="spectrum"
      >
        <ColorPicker.Spectrum {...partProps['ColorPicker.Spectrum']} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Grid': [],
    'ColorPicker.Modes': [],
    'ColorPicker.Panel': [],
    'ColorPicker.Spectrum': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.View`: the grid's, shown while its mode is chosen. */
const ViewPart = panelPartDemo(
  'color-picker-parts-view',
  'ColorPicker.View',
  () => propOptionsPart,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.Modes {...partProps['ColorPicker.Modes']}>
        <ColorPicker.Mode
          {...partProps['ColorPicker.Mode']}
          value="grid"
        >
          Grid
        </ColorPicker.Mode>
        <ColorPicker.Mode
          {...partProps['ColorPicker.Mode']}
          value="spectrum"
        >
          Spectrum
        </ColorPicker.Mode>
      </ColorPicker.Modes>
      <ColorPicker.View
        value="grid"
        {...props}
      >
        <ColorPicker.Grid {...partProps['ColorPicker.Grid']} />
      </ColorPicker.View>
      <ColorPicker.View value="spectrum">
        <ColorPicker.Spectrum {...partProps['ColorPicker.Spectrum']} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Grid': [],
    'ColorPicker.Mode': ['value'],
    'ColorPicker.Modes': [],
    'ColorPicker.Panel': [],
    'ColorPicker.Spectrum': [],
  },
);

/** `ColorPicker.Grid`: its only view (no modes' control). */
const GridPart = panelPartDemo(
  'color-picker-parts-grid',
  'ColorPicker.Grid',
  () => propOptionsPart,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="grid"
      >
        <ColorPicker.Grid {...props} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Panel': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.Spectrum`: its only view. */
const SpectrumPart = panelPartDemo(
  'color-picker-parts-spectrum',
  'ColorPicker.Spectrum',
  () => propOptionsPart,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="spectrum"
      >
        <ColorPicker.Spectrum {...props} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Panel': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.Sliders`: its only view, by its model. */
const SlidersPart = panelPartDemo(
  'color-picker-parts-sliders',
  'ColorPicker.Sliders',
  () => propOptionsSliders,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="sliders"
      >
        <ColorPicker.Sliders {...props} />
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Panel': [],
    'ColorPicker.View': ['value'],
  },
);

// The code's copy button's content (its symbol).
const copySymbol = (partProps: PartProps) => (
  <Button.Icon {...partProps['Button.Icon']}>
    <Symbol
      {...partProps.Symbol}
      icon={sfDocumentOnDocument}
    />
  </Button.Icon>
);

/** `ColorPicker.Code`: under the sliders (their child), its copy button in it. */
const CodePart = panelPartDemo(
  'color-picker-parts-code',
  'ColorPicker.Code',
  () => propOptionsCode,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="sliders"
      >
        <ColorPicker.Sliders {...partProps['ColorPicker.Sliders']}>
          <ColorPicker.Code {...props}>
            <ColorPicker.CodeCopy
              {...partProps['ColorPicker.CodeCopy']}
              shape="circle"
              size="small"
              variant="bordered-secondary"
            >
              {copySymbol(partProps)}
            </ColorPicker.CodeCopy>
          </ColorPicker.Code>
        </ColorPicker.Sliders>
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'Button.Icon': [],
    'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
    'ColorPicker.Panel': [],
    'ColorPicker.Sliders': [],
    'ColorPicker.View': ['value'],
    Symbol: ['icon'],
  },
);

/** `ColorPicker.CodeCopy`: in the code, under the sliders. */
const CodeCopyPart = panelPartDemo(
  'color-picker-parts-code-copy',
  'ColorPicker.CodeCopy',
  getPropOptionsCodeCopy,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="sliders"
      >
        <ColorPicker.Sliders {...partProps['ColorPicker.Sliders']}>
          <ColorPicker.Code {...partProps['ColorPicker.Code']}>
            <ColorPicker.CodeCopy
              shape="circle"
              size="small"
              variant="bordered-secondary"
              {...props}
            >
              {copySymbol(partProps)}
            </ColorPicker.CodeCopy>
          </ColorPicker.Code>
        </ColorPicker.Sliders>
      </ColorPicker.View>
    </ColorPicker.Panel>
  ),
  {
    'Button.Icon': [],
    'ColorPicker.Code': [],
    'ColorPicker.Panel': [],
    'ColorPicker.Sliders': [],
    'ColorPicker.View': ['value'],
    Symbol: ['icon'],
  },
);

/**
 * The named colors' parts (see the `Named…` demos), scrolling in a box: the
 * app's rows (two), then the CSS named colors; each part's props given.
 */
const namedColors = ({
  color = {},
  named = {},
  partProps = {},
}: {
  color?: Partial<ColorPickerNamedColorProps>;
  named?: ColorPickerNamedProps;
  partProps?: PartProps;
}) => (
  <div style={{ maxHeight: 480, overflowY: 'auto' }}>
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="named"
      >
        <ColorPicker.Named {...named}>
          <ColorPicker.NamedColor
            color="#AF52DE"
            {...{ children: 'Brand purple', ...color }}
          />
          <ColorPicker.NamedColor color="oklch(62% 0.19 260)">
            Brand blue
          </ColorPicker.NamedColor>
          <ColorPicker.CssNamedColors />
        </ColorPicker.Named>
      </ColorPicker.View>
    </ColorPicker.Panel>
  </div>
);

/** `ColorPicker.Named`: the app's rows, then the CSS named colors. */
const NamedPart = panelPartDemo(
  'color-picker-parts-named',
  'ColorPicker.Named',
  () => propOptionsNamed,
  (props, partProps) => namedColors({ named: props, partProps }),
  {
    'ColorPicker.Panel': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.NamedColor`: the app's first row. */
const NamedColorPart = panelPartDemo(
  'color-picker-parts-named-color',
  'ColorPicker.NamedColor',
  () => propOptionsNamedColor,
  (props, partProps) => namedColors({ color: props, partProps }),
  {
    'ColorPicker.Panel': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.CssNamedColors`: after the app's rows. */
const CssNamedColorsPart = panelPartDemo(
  'color-picker-parts-css-named-colors',
  'ColorPicker.CssNamedColors',
  () => ({}),
  (_props, partProps) => namedColors({ partProps }),
  {
    'ColorPicker.Panel': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.Opacity`: under the spectrum, the color translucent. */
const OpacityPart = panelPartDemo(
  'color-picker-parts-opacity',
  'ColorPicker.Opacity',
  () => propOptionsPart,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="spectrum"
      >
        <ColorPicker.Spectrum {...partProps['ColorPicker.Spectrum']} />
      </ColorPicker.View>
      <ColorPicker.Opacity {...props} />
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Panel': [],
    'ColorPicker.Spectrum': [],
    'ColorPicker.View': ['value'],
  },
);

/** `ColorPicker.Swatches`: under the grid, with their props. */
const SwatchesPart = panelPartDemo(
  'color-picker-parts-swatches',
  'ColorPicker.Swatches',
  getPropOptionsSwatches,
  (props, partProps) => (
    <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
      <ColorPicker.View
        {...partProps['ColorPicker.View']}
        value="grid"
      >
        <ColorPicker.Grid {...partProps['ColorPicker.Grid']} />
      </ColorPicker.View>
      <ColorPicker.Swatches {...props} />
    </ColorPicker.Panel>
  ),
  {
    'ColorPicker.Grid': [],
    'ColorPicker.Panel': [],
    'ColorPicker.View': ['value'],
  },
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Button.Icon': [],
          'ColorPicker.Code': [],
          'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
          'ColorPicker.Grid': [],
          'ColorPicker.Mode': ['value'],
          'ColorPicker.Modes': [],
          'ColorPicker.Named': [],
          'ColorPicker.Opacity': [],
          'ColorPicker.Panel': [],
          'ColorPicker.Root': ['defaultValue', 'style'],
          'ColorPicker.Sliders': ['model', 'range'],
          'ColorPicker.Spectrum': [],
          'ColorPicker.Swatches': [],
          'ColorPicker.View': ['value'],
          Symbol: ['icon'],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="ColorPicker.Eyedropper"
    >
      <ColorPicker.Root
        {...partProps['ColorPicker.Root']}
        defaultValue="#AF52DE"
        style={{ width: 'min(402px, 100%)' }}
      >
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <ColorPicker.Eyedropper {...props}>
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfEyedropper}
                />
              </Button.Icon>
            </ColorPicker.Eyedropper>
          </Toolbar.Leading>
          <Toolbar.Title {...partProps['Toolbar.Title']}>
            <span>Colors</span>
          </Toolbar.Title>
        </Toolbar.Root>
        <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
          {panelParts({ partProps })}
        </ColorPicker.Panel>
      </ColorPicker.Root>
    </Component>
  );
};

/**
 * `ColorPicker.SystemColors`, outlined, in the header's toolbar (after the
 * eyedropper).
 */
const SystemColorsPart: FunctionComponent = () => {
  const id = 'color-picker-parts-system-colors';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsSystemColors, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ColorPicker.SystemColors',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Button.Icon': [],
          'ColorPicker.Code': [],
          'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
          'ColorPicker.Eyedropper': ['render'],
          'ColorPicker.Grid': [],
          'ColorPicker.Mode': ['value'],
          'ColorPicker.Modes': [],
          'ColorPicker.Named': [],
          'ColorPicker.Opacity': [],
          'ColorPicker.Panel': [],
          'ColorPicker.Root': ['defaultValue', 'style'],
          'ColorPicker.Sliders': ['model', 'range'],
          'ColorPicker.Spectrum': [],
          'ColorPicker.Swatches': [],
          'ColorPicker.View': ['value'],
          Symbol: ['icon'],
          'Toolbar.Button': ['shape'],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="ColorPicker.SystemColors"
    >
      <ColorPicker.Root
        {...partProps['ColorPicker.Root']}
        defaultValue="#AF52DE"
        style={{ width: 'min(402px, 100%)' }}
      >
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <ColorPicker.Eyedropper
              {...partProps['ColorPicker.Eyedropper']}
              render={
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  shape="circle"
                />
              }
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfEyedropper}
                />
              </Button.Icon>
            </ColorPicker.Eyedropper>
            <ColorPicker.SystemColors {...props}>
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfPaintpalette}
                />
              </Button.Icon>
            </ColorPicker.SystemColors>
          </Toolbar.Leading>
          <Toolbar.Title {...partProps['Toolbar.Title']}>
            <span>Colors</span>
          </Toolbar.Title>
        </Toolbar.Root>
        <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
          {panelParts({ partProps })}
        </ColorPicker.Panel>
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

/** `/color-picker/parts`: the picker, its panel, the well. */
export const ColorPickerParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: holds the color for its parts.</li>
      <li>
        Header: the app’s, in its popover’s or sheet’s header (a toolbar with
        the eyedropper, the system colors, a title and close). The panel scrolls
        under it.
      </li>
      <li>
        Panel: its parts, as composed. Its modes (a segmented control, and a
        view for each: the grid, the spectrum, the sliders), the opacity, and
        the swatches (the color and the saved colors).
      </li>
      <li>Eyedropper: picks a color off the screen.</li>
      <li>System colors: opens the system’s color picker.</li>
      <li>
        Code: the color’s hex code, which can be typed. Its menu copies it, in
        other formats too.
      </li>
      <li>
        Named: a mode’s list of named colors (the app’s, and the CSS named
        colors), with an index.
      </li>
      <li>Well: shows a color and opens the picker, from outside it.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="color-picker"
          part="ColorPicker.Root"
        />{' '}
        (rendering a{' '}
        <PartLink
          component="popover"
          part="Popover.Popup"
        />{' '}
        or a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />
        )
        <ul>
          <li className="demo-tree-context">
            <PartLink
              component="popover"
              part="Popover.Header"
            />{' '}
            <span>or</span>{' '}
            <PartLink
              component="sheet"
              part="Sheet.Header"
            />{' '}
            <span>(optional, the app’s), with a</span>{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.Eyedropper"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="color-picker"
                  part="ColorPicker.SystemColors"
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
                    <ul>
                      <li>
                        <PartLink
                          component="color-picker"
                          part="ColorPicker.Code"
                        />{' '}
                        (optional; anywhere in the picker, for example here)
                        <ul>
                          <li>
                            <PartLink
                              component="color-picker"
                              part="ColorPicker.CodeCopy"
                            />{' '}
                            (optional)
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    or{' '}
                    <PartLink
                      component="color-picker"
                      part="ColorPicker.Named"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="color-picker"
                          part="ColorPicker.NamedColor"
                        />{' '}
                        (one per color)
                      </li>
                      <li>
                        <PartLink
                          component="color-picker"
                          part="ColorPicker.CssNamedColors"
                        />{' '}
                        (optional: the CSS named colors’ rows)
                      </li>
                    </ul>
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
        (optional, outside the picker; or any trigger)
      </li>
      <li>
        Helpers, usable anywhere:{' '}
        <PartLink
          component="color-picker"
          part="parseColor"
        />
        ,{' '}
        <PartLink
          component="color-picker"
          part="formatColor"
        />{' '}
        and{' '}
        <PartLink
          component="color-picker"
          part="defaultSavedColors"
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
        Holds the color, as a hex string (<code>#rrggbbaa</code> with opacity),
        for its parts. It goes in the app’s popover (regular) or sheet
        (compact).
      </li>
      <li>
        Its panel’s parts decide its opacity. With an{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Opacity"
        />
        , the color can be translucent. Without one, it’s always opaque.
      </li>
      <li>
        Its state: <code>value</code> or <code>defaultValue</code>, and{' '}
        <code>onValueChange</code> (with the reason). For the mode shown:{' '}
        <code>mode</code> or <code>defaultMode</code> (the first, by default),
        and <code>onModeChange</code>.
      </li>
      <li>
        Renders a <code>div</code>, or, through <code>render</code>, the sheet’s{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />
        . Its header and modes then go in the sheet’s{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />
        , which doesn’t scroll, and its panel in the{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        />{' '}
        (see{' '}
        <a href={publicUrl('color-picker/composition#in-a-sheet')}>
          In a sheet
        </a>
        ).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerRootRows} />

    <Heading
      id="colorpicker-panel"
      level={2}
    >
      <code>ColorPicker.Panel</code>
    </Heading>
    <ul>
      <li>
        Its parts, as composed, spaced inside its padding: its modes (
        <PartLink
          component="color-picker"
          part="ColorPicker.Modes"
        />
        , with a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.View"
        />{' '}
        for each, paired by their <code>value</code>s), the{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Opacity"
        />{' '}
        and the{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Swatches"
        />
        . Any of them can be left out, and they can go in any order. Its modes’
        control can sit elsewhere in its picker (for example in a sheet’s
        header), since the picker holds the mode (see{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Root"
        />
        ).
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
        Its modes’ control: a <a href={publicUrl('segmented')}>Segmented</a>{' '}
        control (with its own highlight) that chooses the picker’s mode. It sits
        24px above the view, in the panel or anywhere in its picker (for example
        in a sheet’s header, inset like the panel’s content).
      </li>
      <li>
        Its{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Mode"
        />
        s, in their order, set which modes there are and how they’re labeled
        (for example “Sliders” for one sliders view, or “RGB” and “HSL” for
        several).
      </li>
      <li>
        It’s optional. With one mode, leave it out: the panel’s only{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.View"
        />{' '}
        shows, with no control to choose.
      </li>
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
        A mode: its label, which chooses its{' '}
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
        A mode’s view, shown while its{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Mode"
        />{' '}
        is chosen (by <code>value</code>). Without{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Modes"
        />
        , it’s the panel’s only one.
      </li>
      <li>
        With a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Grid"
        />{' '}
        or a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Spectrum"
        />{' '}
        among the views, they’re all as tall as the grid, with their content
        centered, so switching doesn’t move a popover. Without them (for example
        with{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Sliders"
        />{' '}
        alone), a view is as tall as its content.
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
        Swatches, 12 by 10: a gray row, then hues by lightness, with the color
        outlined. Each is a toggle button, named by its color.
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
        Hues across, and white to black down, with the color ringed. It can be
        dragged (without swiping a sheet away), or moved by the arrow keys (5°
        of hue across, 5% of lightness down).
      </li>
      <li>
        Renders a <code>div</code> (a slider, named “Spectrum”, with the color
        as its value).
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
        saturation and lightness; or cyan, magenta, yellow and black.
      </li>
      <li>
        Each is a row: its title (in capitals), a slider that mixes from the
        color (its track shows the color with the channel along its range), and
        its value, which can be typed. A typed value applies as it’s typed,
        within its range (for example 0–255, 0–360° or 0–100%; more counts as
        the most).
      </li>
      <li>
        Its values are kept while they still describe the color, so a hue isn’t
        lost to a gray, and inks aren’t lost to black.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <SlidersPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerSlidersRows} />

    <Heading
      id="colorpicker-code"
      level={2}
    >
      <code>ColorPicker.Code</code>
    </Heading>
    <ul>
      <li>
        The color’s hex code: “Hex” above (like a channel’s title), then its
        field (with a <code>#</code> before it that isn’t typed) at the row’s
        end, where a channel’s value sits. Its digits apply as soon as they make
        a code: 3 or 6, or 4 or 8 with an alpha (without one, the color’s
        opacity is kept). When the field is left (for example emptied), it shows
        the code again.
      </li>
      <li>
        The app decides where it goes: anywhere in the picker, for example under
        the channels of{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Sliders"
        />{' '}
        (as its child), as in the demos. It’s kept above the keyboard while it’s
        typed into, like a channel’s row.
      </li>
      <li>
        Its children go before its field, for example its copy button (
        <PartLink
          component="color-picker"
          part="ColorPicker.CodeCopy"
        />
        ).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <CodePart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerCodeRows} />

    <Heading
      id="colorpicker-codecopy"
      level={2}
    >
      <code>ColorPicker.CodeCopy</code>
    </Heading>
    <ul>
      <li>
        A button that opens a{' '}
        <PartLink
          component="menu"
          part="Menu.Root"
        />{' '}
        of the color’s codes: hex (without and with its alpha), then a submenu
        for each group. sRGB’s <code>rgb()</code>, <code>hsl()</code> and{' '}
        <code>hwb()</code>; the perceptual <code>oklch()</code>,{' '}
        <code>oklab()</code>, <code>lab()</code> and <code>lch()</code>; and the
        wide gamut’s <code>color(display-p3)</code>. Each code shows its format,
        with its values below (for example “r: 175 / g: 82 / b: 222”).
      </li>
      <li>
        Once one is picked, it’s copied to the clipboard (
        <code>onCodeCopy</code>), and a checkmark replaces the button’s content
        for a moment (<code>data-copied</code>).
      </li>
      <li>
        The app decides where it goes: in{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Code"
        />{' '}
        (before its field), or anywhere in the picker, for example in the
        toolbar of its popover’s{' '}
        <PartLink
          component="popover"
          part="Popover.Header"
        />
        .
      </li>
      <li>
        Renders a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />
        , or its <code>render</code>.
      </li>
    </ul>
    <CodeCopyPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerCodeCopyRows} />

    <Heading
      id="colorpicker-named"
      level={2}
    >
      <code>ColorPicker.Named</code>
    </Heading>
    <ul>
      <li>
        A mode’s named colors (in its{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.View"
        />
        , for example “Named”), as one list of their rows (
        <PartLink
          component="color-picker"
          part="ColorPicker.NamedColor"
        />
        s: the app’s, and the{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.CssNamedColors"
        />
        ).
      </li>
      <li>
        It’s as tall as its rows, and its container scrolls it (for example a
        sheet’s content or a popover’s body; here, a box). Among a grid’s or a
        spectrum’s views, its view is at least as tall as the grid’s.
      </li>
      <li>
        At its end, within the panel’s inset, an index of its rows’ first
        letters stays centered in view as it scrolls (below a sheet’s header).
        Pressing a letter (or scrubbing over it) scrolls the first row with it
        to the top.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <NamedPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerNamedRows} />

    <Heading
      id="colorpicker-namedcolor"
      level={2}
    >
      <code>ColorPicker.NamedColor</code>
    </Heading>
    <ul>
      <li>
        A named color’s row: its color (any CSS color) in an inert{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />
        , its label (or its color), and a checkmark while it’s the current color
        (ignoring opacity). Its label’s first letter goes in the index.
      </li>
      <li>
        Pressing it makes it the color (<code>named</code>), keeping the
        opacity, like a grid swatch.
      </li>
      <li>
        Renders a{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        .
      </li>
    </ul>
    <NamedColorPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerNamedColorRows} />

    <Heading
      id="colorpicker-cssnamedcolors"
      level={2}
    >
      <code>ColorPicker.CssNamedColors</code>
    </Heading>
    <ul>
      <li>
        The CSS named colors (148, synonyms included, such as <code>gray</code>{' '}
        and <code>grey</code>, but not <code>transparent</code>), as{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.NamedColor"
        />
        s labeled by their names.
      </li>
      <li>
        Renders a fragment (it takes no props), inside a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Named"
        />{' '}
        (for example after the app’s rows).
      </li>
    </ul>
    <CssNamedColorsPart />

    <Heading
      id="colorpicker-opacity"
      level={2}
    >
      <code>ColorPicker.Opacity</code>
    </Heading>
    <ul>
      <li>
        The opacity: a slider (the color fading in over a checkerboard, with a
        translucent knob in the color) and its percentage, which can be typed.
      </li>
      <li>
        When it’s rendered, the color has an opacity (<code>#rrggbbaa</code>).
        Without it, the color is opaque, and a value’s alpha is dropped as it
        changes (for example when a translucent saved color is picked).
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
        The color (over black and white, when translucent) next to the saved
        colors, in pages of ten (with a{' '}
        <a href={publicUrl('page-control')}>Page Control</a>).
      </li>
      <li>
        Its state: <code>savedColors</code> or <code>defaultSavedColors</code>,
        and <code>onSavedColorsChange</code>.
      </li>
      <li>
        The add button saves the color. A saved color’s menu (on a secondary
        click: a right click or a long press) deletes it.
      </li>
      <li>
        While the color is translucent, pressing it opens an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a>, “Flatten Color?”,
        with Remove Transparency (opacity back to 100%), Flatten on White and
        Flatten on Black (the opaque color as it shows over white or black).
        Turn it off with <code>flattenOnPress={'{false}'}</code>.
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
        A button that picks a color off the screen with the browser’s{' '}
        <code>EyeDropper</code>. Where there’s none (for example in Safari), it
        renders nothing.
      </li>
      <li>
        Renders a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />
        , or its <code>render</code> (for example a toolbar’s button).
      </li>
    </ul>
    <EyedropperPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerEyedropperRows} />

    <Heading
      id="colorpicker-systemcolors"
      level={2}
    >
      <code>ColorPicker.SystemColors</code>
    </Heading>
    <ul>
      <li>
        A button that opens the system’s color picker. A transparent color input
        lies over the button and is pressed itself (on iOS, nothing else opens
        it). On a desktop, that opens its panel; on iOS, a sheet. From the
        keyboard, the button opens it. Its colors apply as they’re picked. With
        the{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Opacity"
        />{' '}
        rendered, its alpha applies too, where the browser’s picker has one (the
        input’s <code>alpha</code>, for example in Safari). Otherwise, its
        colors are opaque, and the color’s opacity is kept. Where a browser
        can’t open it, it renders nothing.
      </li>
      <li>
        It goes in the header’s toolbar, on the leading side, after the{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Eyedropper"
        />
        .
      </li>
      <li>
        Renders a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />
        , or its <code>render</code> (for example a toolbar’s button).
      </li>
    </ul>
    <SystemColorsPart />
    <h3>Props</h3>
    <PropsTable rows={colorPickerSystemColorsRows} />

    <Heading
      id="colorpicker-well"
      level={2}
    >
      <code>ColorPicker.Well</code>
    </Heading>
    <ul>
      <li>
        A color well: a disk of hues around its color. It’s the trigger that
        opens the picker (for example{' '}
        <code>{'<Popover.Trigger render={<ColorPicker.Well />} />'}</code>).
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
        Turns a hex color (the picker’s values) into its channels, for example
        to blend it or to check its contrast.
      </li>
    </ul>
    <CodeView code={parseColorCode} />
    <h3>Arguments and Return</h3>
    <PropsTable rows={parseColorRows} />

    <Heading
      id="formatcolor"
      level={2}
    >
      <code>formatColor</code>
    </Heading>
    <ul>
      <li>
        Turns channels into a hex color, like the picker’s values (the reverse
        of <PartLink part="parseColor" />
        ).
      </li>
    </ul>
    <CodeView code={formatColorCode} />
    <h3>Arguments and Return</h3>
    <PropsTable rows={formatColorRows} />

    <Heading
      id="defaultsavedcolors"
      level={2}
    >
      <code>defaultSavedColors</code>
    </Heading>
    <ul>
      <li>
        The default saved colors, which <PartLink part="ColorPicker.Swatches" />{' '}
        uses by default. Start from them to add the app’s own.
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
  PanelPart,
  ModesPart,
  ModePart,
  ViewPart,
  GridPart,
  SpectrumPart,
  SlidersPart,
  CodePart,
  CodeCopyPart,
  NamedPart,
  NamedColorPart,
  CssNamedColorsPart,
  OpacityPart,
  SwatchesPart,
  EyedropperPart,
  SystemColorsPart,
  WellPart,
];
