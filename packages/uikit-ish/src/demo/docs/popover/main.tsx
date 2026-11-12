import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
  Popover,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfICircle, sfXmark } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
} from './props.js';

/**
 * A popover (Base UI's `Popover`): a panel at its trigger, its arrow pointing at it; in a
 * list row, aligned with its end.
 */
export const PopoverDemo: FunctionComponent = () => {
  const id = 'popover';

  const [log, addLog] = useLog();

  const [externalRoot, externalPositioner, externalContent] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'root' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    { external: externalPositioner, isOpen: true, title: 'positioner' },
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Popover.Positioner': ['align'],
            'Popover.Root': [],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Accessory': ['render'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Description': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['aria-label', 'render'],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      baseUiId="popover"
      controls={[controlRoot, controlPositioner, controlContent, partControls]}
      id={id}
      log={log}
      state={[stateRoot, statePositioner, stateContent, partState]}
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
            {...partProps['Popover.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Show Popover
            </Button.Label>
          </Popover.Trigger>
          <Popover.Portal {...partProps['Popover.Portal']}>
            <Popover.Positioner {...propsPositioner}>
              <Popover.Popup
                {...partProps['Popover.Popup']}
                className="popover-demo-popup"
              >
                {propsContent.arrow ? (
                  <Popover.Arrow {...partProps['Popover.Arrow']} />
                ) : null}
                <Popover.Header {...partProps['Popover.Header']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <Popover.Title
                        {...partProps['Popover.Title']}
                        render={<span />}
                      >
                        Popover
                      </Popover.Title>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
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
                        <Button.Icon {...partProps['Button.Icon']}>
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfXmark}
                          />
                        </Button.Icon>
                      </Popover.Close>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Popover.Header>
                <Popover.Body {...partProps['Popover.Body']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <List.Root {...partProps['List.Root']}>
                    <List.Section {...partProps['List.Section']}>
                      <List.Footer {...partProps['List.Footer']}>
                        <Popover.Description
                          {...partProps['Popover.Description']}
                        >
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
        <List.Root
          {...partProps['List.Root']}
          style={{ width: '100%' }}
        >
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>In a row</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Popover.Root {...partProps['Popover.Root']}>
                    <Popover.Trigger
                      {...partProps['Popover.Trigger']}
                      aria-label="Info"
                      render={
                        <List.Accessory
                          {...partProps['List.Accessory']}
                          render={<button type="button" />}
                        />
                      }
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfICircle}
                      />
                    </Popover.Trigger>
                    <Popover.Portal {...partProps['Popover.Portal']}>
                      <Popover.Positioner
                        {...partProps['Popover.Positioner']}
                        align="end"
                      >
                        <Popover.Popup
                          {...partProps['Popover.Popup']}
                          className="popover-demo-popup"
                        >
                          {propsContent.arrow ? (
                            <Popover.Arrow {...partProps['Popover.Arrow']} />
                          ) : null}
                          <Popover.Header {...partProps['Popover.Header']}>
                            <Toolbar.Root
                              {...partProps['Toolbar.Root']}
                              placement="block-start"
                            >
                              <Toolbar.Title {...partProps['Toolbar.Title']}>
                                <Popover.Title
                                  {...partProps['Popover.Title']}
                                  render={<span />}
                                >
                                  In a Row
                                </Popover.Title>
                              </Toolbar.Title>
                            </Toolbar.Root>
                          </Popover.Header>
                          <Popover.Body {...partProps['Popover.Body']}>
                            <Viewport.Padding
                              {...partProps['Viewport.Padding']}
                              edge="block-start"
                            />
                            <List.Root {...partProps['List.Root']}>
                              <List.Section {...partProps['List.Section']}>
                                <List.Footer {...partProps['List.Footer']}>
                                  <Popover.Description
                                    {...partProps['Popover.Description']}
                                  >
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
                </List.Trailing>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};
