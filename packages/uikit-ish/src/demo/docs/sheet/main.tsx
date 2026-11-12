import './style.css';

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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfArrowUp, sfXmark } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { getPropOptionsRoot, propOptionsPopup } from './props.js';

/**
 * A sheet (Base UI's `Drawer`): a scoped task from the bottom (large or medium), a form sheet
 * (or a card at the leading edge) in a regular width; swiped down to dismiss it.
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Title': ['render', 'style'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['aria-label', 'onClick', 'prominent', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
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
      baseUiId="drawer"
      controls={[controlRoot, controlPopup, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, statePopup, partState]}
      title="Sheet"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          key={`${keyRoot}`}
          {...propsRoot}
        >
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Show Sheet
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            {...propsPopup}
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        aria-label="Close"
                        shape="circle"
                        onClick={() => addLog('close')}
                      />
                    }
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfXmark}
                      />
                    </Button.Icon>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                    style={{ font: 'inherit', margin: 0 }}
                  >
                    Title
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                        aria-label="Send"
                        shape="circle"
                        onClick={() => addLog('send')}
                      />
                    }
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfArrowUp}
                      />
                    </Button.Icon>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {Array.from({ length: 6 }, (_, index) => (
                      <List.Item
                        key={index}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Row {index + 1}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};
