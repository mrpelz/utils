import { FunctionComponent, useMemo } from 'react';

import { Collapsible, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
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
      baseUiId="collapsible"
      controls={[controlRoot, controlTrigger, controlPanel, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateTrigger, statePanel, partState]}
      title="Collapsible"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <Collapsible.Root
          key={keyRoot}
          render={<List.Section {...partProps['List.Section']} />}
          {...propsRoot}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
            {...propsTrigger}
          >
            <List.Title {...partProps['List.Title']}>Advanced</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            render={<List.Group {...partProps['List.Group']} />}
            {...propsPanel}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Proxy</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Off</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>DNS</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>
                  Automatic
                </List.Detail>
              </List.Trailing>
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Forget This Network
                </List.Title>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};
