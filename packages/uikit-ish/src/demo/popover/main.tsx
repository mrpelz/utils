import './style.css';

import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
  Popover,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
} from './props.js';

/**
 * A popover (UIKit `UIPopoverPresentationController`, Figma “Popovers”, Base
 * UI's `Popover`): a panel at its trigger, its arrow pointing at it; in a
 * list row, aligned with its end.
 */
export const PopoverDemo: FunctionComponent = () => {
  const id = 'popover';

  const [log, addLog] = useLog();

  const [externalRoot, externalPositioner, externalContent] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
    externalPositioner,
    true,
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  return (
    <Component
      center
      baseUiId="popover"
      controls={[controlRoot, controlPositioner, controlContent]}
      id={id}
      log={log}
      state={[stateRoot, statePositioner, stateContent]}
      title="Popover"
    >
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          gap: 32,
          justifyItems: 'center',
          paddingBlock: 16,
          width: 'min(402px, 100%)',
        }}
      >
        <Popover.Root
          key={keyRoot}
          {...propsRoot}
        >
          <Popover.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Show Popover</Button.Label>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner {...propsPositioner}>
              <Popover.Popup className="popover-demo-popup">
                {propsContent.arrow ? <Popover.Arrow /> : null}
                <Popover.Header>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <Popover.Title render={<span />}>Popover</Popover.Title>
                    </Toolbar.Title>
                    <Toolbar.Trailing>
                      <Popover.Close
                        render={
                          <Toolbar.Button
                            aria-label="Close"
                            shape="circle"
                          />
                        }
                      >
                        <Button.Icon>
                          <Symbol icon={sfXmark} />
                        </Button.Icon>
                      </Popover.Close>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Popover.Header>
                <Popover.Body>
                  <List.Root>
                    <List.Section>
                      <List.Footer>
                        <Popover.Description>
                          A transient view above other content, at the control
                          that showed it.
                        </Popover.Description>
                      </List.Footer>
                    </List.Section>
                  </List.Root>
                </Popover.Body>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <List.Root style={{ width: '100%' }}>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Title>In a row</List.Title>
                <Popover.Root>
                  <Popover.Trigger
                    aria-label="Info"
                    render={
                      <Button.Root
                        shape="circle"
                        variant="borderless"
                      />
                    }
                  >
                    <Button.Icon>
                      <Symbol icon={sfICircle} />
                    </Button.Icon>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner align="end">
                      <Popover.Popup className="popover-demo-popup">
                        {propsContent.arrow ? <Popover.Arrow /> : null}
                        <Popover.Header>
                          <Toolbar.Root placement="block-start">
                            <Toolbar.Title>
                              <Popover.Title render={<span />}>
                                In a Row
                              </Popover.Title>
                            </Toolbar.Title>
                          </Toolbar.Root>
                        </Popover.Header>
                        <Popover.Body>
                          <List.Root>
                            <List.Section>
                              <List.Footer>
                                <Popover.Description>
                                  Aligned with the row’s end.
                                </Popover.Description>
                              </List.Footer>
                            </List.Section>
                          </List.Root>
                        </Popover.Body>
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};
