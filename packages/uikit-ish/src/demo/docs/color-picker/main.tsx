import '../sheet/style.css';

import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  Button,
  ColorPicker,
  type ColorPickerChangeEventDetails,
  Popover,
  Sheet,
  Symbol,
  Toolbar,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfEyedropper, sfPaintpalette, sfXmark } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { modesControl, panelParts, propOptionsComposition } from './panel.js';
import {
  getPropOptionsRoot,
  getPropOptionsSwatches,
  propOptionsContent,
  propOptionsPanel,
  propOptionsWell,
} from './props.js';

/**
 * A color picker: from a color well, in a popover (regular) or a sheet
 * (compact), its header the app's (eyedropper, system colors, title,
 * close).
 */
export const ColorPickerDemo: FunctionComponent = () => {
  const id = 'color-picker';

  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();

  const [
    externalContent,
    externalRoot,
    externalPanel,
    externalWell,
    externalComposition,
    externalSwatches,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlPanel, propsPanel, statePanel, keyPanel] = usePropControl(
    propOptionsPanel,
    { external: externalPanel, title: 'panel' },
  );
  const [controlWell, propsWell, stateWell] = usePropControl(propOptionsWell, {
    external: externalWell,
    title: 'well',
  });
  // The panel's parts: which modes, with the opacity and the swatches.
  const [controlComposition, composition, stateComposition] = usePropControl(
    propOptionsComposition,
    { external: externalComposition, title: '[panel parts]' },
  );
  const [controlSwatches, propsSwatches, stateSwatches, keySwatches] =
    usePropControl(
      useMemo(() => getPropOptionsSwatches(addLog), [addLog]),
      { external: externalSwatches, title: 'swatches' },
    );

  // (Its modes' control elsewhere: the popover's or the sheet's header.)
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'ColorPicker.Code': [],
            'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
            'ColorPicker.Eyedropper': ['render'],
            'ColorPicker.Grid': [],
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Named': [],
            'ColorPicker.Opacity': [],
            'ColorPicker.Sliders': ['model', 'range'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.SystemColors': ['render'],
            'ColorPicker.View': ['value'],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Header': [],
            'Popover.Popup': ['style'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': ['defaultOpen'],
            'Popover.Trigger': ['render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': ['defaultOpen'],
            'Sheet.Trigger': ['render'],
            Symbol: ['icon'],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
            'Viewport.Provider': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const panel = () => (
    <ColorPicker.Panel
      key={`${keyPanel}-${keySwatches}`}
      {...propsPanel}
    >
      {panelParts({
        partProps,
        ...composition,
        isModesElsewhere: true,
        swatchesProps: propsSwatches,
      })}
    </ColorPicker.Panel>
  );

  // The well shows the picked color.
  const [color, setColor] = useState<string>(propsRoot.defaultValue);

  const header = (close: ReactNode) => (
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
        <ColorPicker.SystemColors
          {...partProps['ColorPicker.SystemColors']}
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
              icon={sfPaintpalette}
            />
          </Button.Icon>
        </ColorPicker.SystemColors>
      </Toolbar.Leading>
      <Toolbar.Title {...partProps['Toolbar.Title']}>
        <span>Colors</span>
      </Toolbar.Title>
      <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
        {close}
      </Toolbar.Trailing>
    </Toolbar.Root>
  );
  const closeSymbol = (
    <Button.Icon {...partProps['Button.Icon']}>
      <Symbol
        {...partProps.Symbol}
        icon={sfXmark}
      />
    </Button.Icon>
  );

  const rootProps = {
    ...propsRoot,
    onValueChange: (value: string, details: ColorPickerChangeEventDetails) => {
      setColor(value);
      propsRoot.onValueChange?.(value, details);
    },
  };

  const well = (
    <ColorPicker.Well
      color={color}
      {...propsWell}
    />
  );

  return (
    <Component
      hasInputGuards
      isCentered
      id={id}
      log={log}
      title="Color Picker"
      controls={[
        controlContent,
        controlRoot,
        controlComposition,
        controlPanel,
        controlSwatches,
        controlWell,
        partControls,
      ]}
      screen={
        (content.container ??
          (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet'
          ? 'centered'
          : undefined
      }
      stage={
        (content.container ??
          (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet'
          ? 'phone'
          : undefined
      }
      state={[
        stateContent,
        stateRoot,
        statePanel,
        stateWell,
        stateComposition,
        stateSwatches,
        partState,
      ]}
    >
      {(content.container ??
        (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet' ? (
        <Viewport.Provider {...partProps['Viewport.Provider']}>
          {/* Tracking the keyboard over its screen (its fields kept above
             it, see Viewport.KeyboardAccessory). */}
          <Viewport.Content {...partProps['Viewport.Content']}>
            <Sheet.Root
              {...partProps['Sheet.Root']}
              defaultOpen={content.defaultOpen}
            >
              <Sheet.Trigger
                {...partProps['Sheet.Trigger']}
                render={well}
              />
              {/* The picker the sheet's popup: its header and modes in the
                 sheet's header (not scrolling), its panel in its content. */}
              <ColorPicker.Root
                key={keyRoot}
                {...rootProps}
                render={
                  <Sheet.Popup
                    {...partProps['Sheet.Popup']}
                    compact
                    detent="medium"
                  />
                }
              >
                <Sheet.Header {...partProps['Sheet.Header']}>
                  <Sheet.Grabber {...partProps['Sheet.Grabber']} />
                  {header(
                    <Sheet.Close
                      {...partProps['Sheet.Close']}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      {closeSymbol}
                    </Sheet.Close>,
                  )}
                  {modesControl(composition.modes, partProps)}
                </Sheet.Header>
                <Sheet.Content {...partProps['Sheet.Content']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  {panel()}
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-end"
                  />
                </Sheet.Content>
              </ColorPicker.Root>
            </Sheet.Root>
          </Viewport.Content>
        </Viewport.Provider>
      ) : (
        <Popover.Root
          {...partProps['Popover.Root']}
          defaultOpen={content.defaultOpen}
        >
          <Popover.Trigger
            {...partProps['Popover.Trigger']}
            render={well}
          />
          <Popover.Portal {...partProps['Popover.Portal']}>
            <Popover.Positioner {...partProps['Popover.Positioner']}>
              <ColorPicker.Root
                key={keyRoot}
                {...rootProps}
                render={
                  <Popover.Popup
                    {...partProps['Popover.Popup']}
                    style={{ width: 402 }}
                  />
                }
              >
                <Popover.Arrow {...partProps['Popover.Arrow']} />
                <Popover.Header {...partProps['Popover.Header']}>
                  {header(
                    <Popover.Close
                      {...partProps['Popover.Close']}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      {closeSymbol}
                    </Popover.Close>,
                  )}
                  {modesControl(composition.modes, partProps)}
                </Popover.Header>
                <Popover.Body {...partProps['Popover.Body']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  {panel()}
                </Popover.Body>
              </ColorPicker.Root>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Component>
  );
};
