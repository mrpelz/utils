import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { ActionSheet, Button, Viewport } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { getPropOptionsRoot } from './props.js';

/**
 * An action sheet (UIKit `UIAlertController`, style `actionSheet`, Figma
 * “Action Sheets”): choices for an action, at the control that presented
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

  return (
    <Component
      baseUiId="popover"
      controls={[controlRoot]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot]}
      title="Action Sheet"
    >
      <Viewport.Content>
        <ActionSheet.Root
          key={keyRoot}
          {...propsRoot}
        >
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Show Action Sheet</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>A Short Title Is Best</ActionSheet.Title>
              <ActionSheet.Description>
                A description should be a short, complete sentence.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action
                variant="destructive"
                onClick={() => addLog('action: Action 1')}
              >
                Action 1
              </ActionSheet.Action>
              <ActionSheet.Action onClick={() => addLog('action: Action 2')}>
                Action 2
              </ActionSheet.Action>
              <ActionSheet.Action onClick={() => addLog('action: Action 3')}>
                Action 3
              </ActionSheet.Action>
              <ActionSheet.Action onClick={() => addLog('action: Action 4')}>
                Action 4
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};
