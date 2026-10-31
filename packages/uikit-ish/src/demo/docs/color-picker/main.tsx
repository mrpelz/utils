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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfEyedropper, sfXmark } from '../../tooling/icons.js';
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
 * (compact), its header the app's (eyedropper, title, close).
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

  // (Its modes' control in it, or elsewhere: a sheet's header.)
  const panel = (isModesElsewhere = false) => (
    <ColorPicker.Panel
      key={`${keyPanel}-${keySwatches}`}
      {...propsPanel}
    >
      {panelParts({
        ...composition,
        isModesElsewhere,
        swatchesProps: propsSwatches,
      })}
    </ColorPicker.Panel>
  );

  // The well shows the picked color.
  const [color, setColor] = useState<string>(propsRoot.defaultValue);

  const header = (close: ReactNode) => (
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading>
        <ColorPicker.Eyedropper render={<Toolbar.Button shape="circle" />}>
          <Button.Icon>
            <Symbol icon={sfEyedropper} />
          </Button.Icon>
        </ColorPicker.Eyedropper>
      </Toolbar.Leading>
      <Toolbar.Title>
        <span>Colors</span>
      </Toolbar.Title>
      <Toolbar.Trailing>{close}</Toolbar.Trailing>
    </Toolbar.Root>
  );
  const closeSymbol = (
    <Button.Icon>
      <Symbol icon={sfXmark} />
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
      ]}
    >
      {(content.container ??
        (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet' ? (
        <Viewport.Provider>
          {/* Tracking the keyboard over its screen (its fields kept above
             it, see Viewport.KeyboardAccessory). */}
          <Viewport.Content>
            <Sheet.Root defaultOpen={content.defaultOpen}>
              <Sheet.Trigger render={well} />
              {/* The picker the sheet's popup: its header and modes in the
                 sheet's header (not scrolling), its panel in its content. */}
              <ColorPicker.Root
                key={keyRoot}
                {...rootProps}
                render={
                  <Sheet.Popup
                    compact
                    detent="medium"
                  />
                }
              >
                <Sheet.Header>
                  <Sheet.Grabber />
                  <ColorPicker.Header>
                    {header(
                      <Sheet.Close
                        render={
                          <Toolbar.Button
                            aria-label="Close"
                            shape="circle"
                          />
                        }
                      >
                        {closeSymbol}
                      </Sheet.Close>,
                    )}
                  </ColorPicker.Header>
                  {modesControl(composition.modes)}
                </Sheet.Header>
                <Sheet.Content>
                  {panel(true)}
                  <Viewport.Padding edge="block-end" />
                </Sheet.Content>
              </ColorPicker.Root>
            </Sheet.Root>
          </Viewport.Content>
        </Viewport.Provider>
      ) : (
        <Popover.Root defaultOpen={content.defaultOpen}>
          <Popover.Trigger render={well} />
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup style={{ width: 402 }}>
                <Popover.Arrow />
                <ColorPicker.Root
                  key={keyRoot}
                  {...rootProps}
                >
                  <ColorPicker.Header>
                    {header(
                      <Popover.Close
                        render={
                          <Toolbar.Button
                            aria-label="Close"
                            shape="circle"
                          />
                        }
                      >
                        {closeSymbol}
                      </Popover.Close>,
                    )}
                  </ColorPicker.Header>
                  {panel()}
                </ColorPicker.Root>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Component>
  );
};
