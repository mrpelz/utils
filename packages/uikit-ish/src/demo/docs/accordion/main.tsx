import { FunctionComponent, useMemo } from 'react';

import { Accordion, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { partPropMaps } from '../part-options.js';
import {
  getPropOptionsItem,
  getPropOptionsRoot,
  propOptionsPanel,
  propOptionsTrigger,
} from './props.js';

/**
 * An accordion (Base UI's `Accordion`): a list's sections (Mail's
 * accounts), one open at a time, each collapsing by its header.
 */
export const AccordionDemo: FunctionComponent = () => {
  const id = 'accordion';
  const [log, addLog] = useLog();
  const [externalRoot, externalItem, externalTrigger, externalPanel] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'Accordion.Root' },
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItem(addLog), [addLog]),
    { external: externalItem, title: 'Accordion.Item (iCloud)' },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsTrigger,
    { external: externalTrigger, title: 'Accordion.Trigger (iCloud)' },
  );
  const [controlPanel, propsPanel, statePanel] = usePropControl(
    propOptionsPanel,
    { external: externalPanel, title: 'Accordion.Panel (iCloud)' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Accordion.Item': ['render', 'value'],
            'Accordion.Panel': ['render'],
            'Accordion.Trigger': ['nativeButton', 'render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
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
      baseUiId="accordion"
      id={id}
      log={log}
      state={[stateRoot, stateItem, stateTrigger, statePanel, partState]}
      title="Accordion"
      controls={[
        controlRoot,
        controlItem,
        controlTrigger,
        controlPanel,
        partControls,
      ]}
    >
      <Accordion.Root
        key={keyRoot}
        render={
          <List.Root
            {...partProps['List.Root']}
            style={{ width: 'min(402px, 100%)' }}
          />
        }
        {...propsRoot}
      >
        <Accordion.Item
          render={<List.Section {...partProps['List.Section']} />}
          value="icloud"
          {...propsItem}
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
            {...propsTrigger}
          >
            <List.Title {...partProps['List.Title']}>iCloud</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            render={<List.Group {...partProps['List.Group']} />}
            {...propsPanel}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Inbox</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>12</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Sent</List.Title>
              </List.Content>
            </List.Item>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          {...partProps['Accordion.Item']}
          render={<List.Section {...partProps['List.Section']} />}
          value="work"
        >
          <Accordion.Trigger
            {...partProps['Accordion.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>Work</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            {...partProps['Accordion.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Inbox</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>3</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Archive</List.Title>
              </List.Content>
            </List.Item>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </Component>
  );
};
