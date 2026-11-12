import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { ActionSheet, Button, Viewport } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { partPropMaps } from '../part-options.js';
import { getPropOptionsRoot } from './props.js';

/**
 * An action sheet: choices for an action, at the control that presented
 * it, in a phone's screen.
 */
export const ActionSheetDemo: FunctionComponent = () => {
  const id = 'action-sheet';

  const [log, addLog] = useLog();

  const [externalRoot] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'ActionSheet.Action': ['onClick', 'variant'],
            'ActionSheet.Actions': [],
            'ActionSheet.Description': [],
            'ActionSheet.Header': [],
            'ActionSheet.Popup': [],
            'ActionSheet.Title': [],
            'ActionSheet.Trigger': ['render'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      baseUiId="popover"
      controls={[controlRoot, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, partState]}
      title="Action Sheet"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          key={keyRoot}
          {...propsRoot}
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Show Action Sheet
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                A Short Title Is Best
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                A description should be a short, complete sentence.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
                onClick={() => addLog('action: Action 1')}
              >
                Action 1
              </ActionSheet.Action>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                onClick={() => addLog('action: Action 2')}
              >
                Action 2
              </ActionSheet.Action>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                onClick={() => addLog('action: Action 3')}
              >
                Action 3
              </ActionSheet.Action>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                onClick={() => addLog('action: Action 4')}
              >
                Action 4
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};
