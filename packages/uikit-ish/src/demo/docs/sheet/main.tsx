import './style.css';

import { sfArrowUp } from '@bradleyhodges/sfsymbols/sfArrowUp';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
  Sheet,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { getPropOptionsRoot, propOptionsPopup } from './props.js';

/**
 * A sheet (UIKit `UISheetPresentationController`, Figma “Sheets”, Base UI's
 * `Drawer`): a scoped task from the bottom (large or medium), a form sheet
 * in a regular width; swiped down to dismiss it.
 */
export const SheetDemo: FunctionComponent = () => {
  const id = 'sheet';

  const [log, addLog] = useLog();

  const [externalRoot, externalPopup] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    { external: externalPopup, title: 'popup' },
  );

  return (
    <Component
      baseUiId="drawer"
      controls={[controlRoot, controlPopup]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, statePopup]}
      title="Sheet"
    >
      <Viewport.Content>
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
          <Sheet.Popup
            compact
            {...propsPopup}
          >
            <Sheet.Header>
              <Sheet.Grabber />
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
              <Viewport.Padding edge="block-end" />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};
