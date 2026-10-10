import { sfEyedropper } from '@bradleyhodges/sfsymbols/sfEyedropper';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  Button,
  ColorPicker,
  Popover,
  Sheet,
  Toolbar,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, Remounters, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
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

  const [externalContent, externalRoot, externalPanel, externalWell] =
    useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );
  const [controlPanel, propsPanel, statePanel, RemounterPanel] = usePropControl(
    useMemo(() => getPropOptionsPanel(addLog), [addLog]),
    'panel',
    externalPanel,
  );
  const [controlWell, propsWell, stateWell] = usePropControl(
    propOptionsWell,
    'well',
    externalWell,
  );

  // The well shows the picked color.
  const [color, setColor] = useState<string>(propsRoot.defaultValue);

  const header = (close: ReactNode) => (
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading>
        <ColorPicker.Eyedropper
          shape="circle"
          variant="glass"
        >
          <Button.Symbol>
            <SFSymbol icon={sfEyedropper} />
          </Button.Symbol>
        </ColorPicker.Eyedropper>
      </Toolbar.Leading>
      <Toolbar.Title>
        <span>Colors</span>
      </Toolbar.Title>
      <Toolbar.Trailing>{close}</Toolbar.Trailing>
    </Toolbar.Root>
  );
  const closeSymbol = (
    <Button.Symbol>
      <SFSymbol icon={sfXmark} />
    </Button.Symbol>
  );

  const picker = (close: ReactNode) => (
    <ColorPicker.Root
      {...propsRoot}
      onValueChange={(value) => {
        setColor(value);
        propsRoot.onValueChange?.(value);
      }}
    >
      <ColorPicker.Header>{header(close)}</ColorPicker.Header>
      <RemounterPanel>
        <ColorPicker.Panel {...propsPanel} />
      </RemounterPanel>
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
      controls={[controlContent, controlRoot, controlPanel, controlWell]}
      id={id}
      log={log}
      title="Color Picker"
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        statePanel,
        stateWell,
      ])}
    >
      <Remounters remounters={[RemounterRoot]}>
        {content.container === 'sheet' ? (
          <Sheet.Root defaultOpen={content.defaultOpen}>
            <Sheet.Trigger render={well} />
            <Sheet.Popup detent="medium">
              <Sheet.Header>
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
                  {...propsRoot}
                  onValueChange={(value) => {
                    setColor(value);
                    propsRoot.onValueChange?.(value);
                  }}
                >
                  <RemounterPanel>
                    <ColorPicker.Panel {...propsPanel} />
                  </RemounterPanel>
                </ColorPicker.Root>
              </Sheet.Content>
            </Sheet.Popup>
          </Sheet.Root>
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
      </Remounters>
    </Component>
  );
};
