import { FunctionComponent, useMemo } from 'react';

import { Accordion, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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

  return (
    <Component
      isCentered
      baseUiId="accordion"
      controls={[controlRoot, controlItem, controlTrigger, controlPanel]}
      id={id}
      log={log}
      state={[stateRoot, stateItem, stateTrigger, statePanel]}
      title="Accordion"
    >
      <Accordion.Root
        key={keyRoot}
        render={<List.Root style={{ width: 'min(402px, 100%)' }} />}
        {...propsRoot}
      >
        <Accordion.Item
          render={<List.Section />}
          value="icloud"
          {...propsItem}
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
            {...propsTrigger}
          >
            <List.Title>iCloud</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel
            render={<List.Group />}
            {...propsPanel}
          >
            <List.Item>
              <List.Content>
                <List.Title>Inbox</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>12</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>Sent</List.Title>
              </List.Content>
            </List.Item>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          render={<List.Section />}
          value="work"
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>Work</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel render={<List.Group />}>
            <List.Item>
              <List.Content>
                <List.Title>Inbox</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>3</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>Archive</List.Title>
              </List.Content>
            </List.Item>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </Component>
  );
};
