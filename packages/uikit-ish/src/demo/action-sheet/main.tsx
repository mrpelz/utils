import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { ActionSheet, Button } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { getPropOptionsRoot } from './props.js';

/**
 * An action sheet (UIKit `UIAlertController`, style `actionSheet`, Figma
 * “Action Sheets”): choices for an action, at the control that presented
 * it, in a phone's screen.
 */
export const ActionSheetDemo: FunctionComponent = () => {
  const id = 'action-sheet';

  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  const [externalRoot] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );

  return (
    <Component
      center
      baseUiId="popover"
      controls={[controlRoot]}
      id={id}
      log={log}
      state={[stateRoot]}
      title="Action Sheet"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
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
          <ActionSheet.Popup container={screen}>
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
      </div>
    </Component>
  );
};
