import '../sheet/style.css';

import { sfEyedropper } from '@bradleyhodges/sfsymbols/sfEyedropper';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  Button,
  ColorPicker,
  Popover,
  Sheet,
  Symbol,
  Toolbar,
  useSizeClass,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsPanel,
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsWell,
} from './props.js';

/**
 * A color picker (UIKit `UIColorPickerViewController`, `UIColorWell`, Figma
 * “Color Pickers”): from a color well, in a popover (iPad) or a sheet
 * (iPhone), its header the app's (eyedropper, title, close).
 */
export const ColorPickerDemo: FunctionComponent = () => {
  const id = 'color-picker';

  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const sizeClass = useSizeClass();

  const [externalContent, externalRoot, externalPanel, externalWell] =
    useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, open: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, open: true, title: 'root' },
  );
  const [controlPanel, propsPanel, statePanel, keyPanel] = usePropControl(
    useMemo(() => getPropOptionsPanel(addLog), [addLog]),
    { external: externalPanel, title: 'panel' },
  );
  const [controlWell, propsWell, stateWell] = usePropControl(propOptionsWell, {
    external: externalWell,
    title: 'well',
  });

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

  const picker = (close: ReactNode) => (
    <ColorPicker.Root
      key={keyRoot}
      {...propsRoot}
      onValueChange={(value, details) => {
        setColor(value);
        propsRoot.onValueChange?.(value, details);
      }}
    >
      <ColorPicker.Header>{header(close)}</ColorPicker.Header>
      <ColorPicker.Panel
        key={keyPanel}
        {...propsPanel}
      />
    </ColorPicker.Root>
  );

  const well = (
    <ColorPicker.Well
      color={color}
      {...propsWell}
    />
  );

  return (
    <Component
      center
      inputGuards
      controls={[controlContent, controlRoot, controlPanel, controlWell]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, statePanel, stateWell]}
      title="Color Picker"
    >
      {(content.container ??
        (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet' ? (
        <div
          ref={screen}
          className="demo-phone demo-centered"
        >
          <Sheet.Root defaultOpen={content.defaultOpen}>
            <Sheet.Trigger render={well} />
            <Sheet.Popup
              compact
              container={screen}
              detent="medium"
            >
              <Sheet.Header>
                <Sheet.Grabber />
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
              </Sheet.Header>
              <Sheet.Content>
                <ColorPicker.Root
                  key={keyRoot}
                  {...propsRoot}
                  onValueChange={(value, details) => {
                    setColor(value);
                    propsRoot.onValueChange?.(value, details);
                  }}
                >
                  <ColorPicker.Panel
                    key={keyPanel}
                    {...propsPanel}
                  />
                </ColorPicker.Root>
              </Sheet.Content>
            </Sheet.Popup>
          </Sheet.Root>
        </div>
      ) : (
        <Popover.Root defaultOpen={content.defaultOpen}>
          <Popover.Trigger render={well} />
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup style={{ width: 402 }}>
                <Popover.Arrow />
                {picker(
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
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Component>
  );
};
