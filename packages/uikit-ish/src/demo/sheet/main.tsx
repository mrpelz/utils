import { sfArrowUp } from '@bradleyhodges/sfsymbols/sfArrowUp';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
  Sheet,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useCreateStateUrl, useProvidedState } from '../frame/state.js';
import { getPropOptionsRoot, propOptionsPopup } from './props.js';

/**
 * A sheet (UIKit `UISheetPresentationController`, Figma “Sheets”, Base UI's
 * `Dialog`): a scoped task from the bottom (large or medium), a form sheet
 * in a regular width; dragged down by its header to dismiss it.
 */
export const SheetDemo: FunctionComponent = () => {
  const id = 'sheet';

  const [log, addLog] = useLog();

  const [externalRoot, externalPopup] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    'popup',
    externalPopup,
  );

  return (
    <Component
      center
      baseUiId="dialog"
      controls={[controlRoot, controlPopup]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateRoot, statePopup])}
      title="Sheet"
    >
      <Sheet.Root
        key={`${keyRoot}`}
        {...propsRoot}
      >
        <Sheet.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Show Sheet</Button.Label>
        </Sheet.Trigger>
        <Sheet.Popup {...propsPopup}>
          <Sheet.Header>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Sheet.Close
                  render={
                    <Toolbar.Button
                      aria-label="Close"
                      shape="circle"
                      onClick={() => addLog('close')}
                    />
                  }
                >
                  <Button.Icon>
                    <Symbol icon={sfXmark} />
                  </Button.Icon>
                </Sheet.Close>
              </Toolbar.Leading>
              <Toolbar.Title>
                <Sheet.Title
                  render={<span />}
                  style={{ font: 'inherit', margin: 0 }}
                >
                  Title
                </Sheet.Title>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Sheet.Close
                  render={
                    <Toolbar.Button
                      prominent
                      aria-label="Send"
                      shape="circle"
                      onClick={() => addLog('send')}
                    />
                  }
                >
                  <Button.Icon>
                    <Symbol icon={sfArrowUp} />
                  </Button.Icon>
                </Sheet.Close>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Sheet.Header>
          <Sheet.Content>
            <List.Root>
              <List.Section>
                <List.Group>
                  {Array.from({ length: 6 }, (_, index) => (
                    <List.Item key={index}>
                      <List.Title>Row {index + 1}</List.Title>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
          </Sheet.Content>
        </Sheet.Popup>
      </Sheet.Root>
    </Component>
  );
};
