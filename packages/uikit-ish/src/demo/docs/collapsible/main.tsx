import { FunctionComponent, useMemo } from 'react';

import { Collapsible, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  getPropOptionsRoot,
  propOptionsPanel,
  propOptionsTrigger,
} from './props.js';

/**
 * A collapsible (Base UI's `Collapsible`): a list section collapsing, its
 * header the trigger, its group the panel.
 */
export const CollapsibleDemo: FunctionComponent = () => {
  const id = 'collapsible';
  const [log, addLog] = useLog();
  const [externalRoot, externalTrigger, externalPanel] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'Collapsible.Root' },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsTrigger,
    { external: externalTrigger, title: 'Collapsible.Trigger' },
  );
  const [controlPanel, propsPanel, statePanel] = usePropControl(
    propOptionsPanel,
    { external: externalPanel, title: 'Collapsible.Panel' },
  );

  return (
    <Component
      isCentered
      baseUiId="collapsible"
      controls={[controlRoot, controlTrigger, controlPanel]}
      id={id}
      log={log}
      state={[stateRoot, stateTrigger, statePanel]}
      title="Collapsible"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <Collapsible.Root
          key={keyRoot}
          render={<List.Section />}
          {...propsRoot}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header />}
            {...propsTrigger}
          >
            <List.Title>Advanced</List.Title>
            <List.Disclosure />
          </Collapsible.Trigger>
          <Collapsible.Panel
            render={<List.Group />}
            {...propsPanel}
          >
            <List.Item>
              <List.Content>
                <List.Title>Proxy</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>Off</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>DNS</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>Automatic</List.Detail>
              </List.Trailing>
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Content>
                <List.Title>Forget This Network</List.Title>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};
