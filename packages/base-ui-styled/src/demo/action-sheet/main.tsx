import { FunctionComponent, useMemo } from 'react';

import { ActionSheet, Button } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, Remounters, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { getPropOptionsRoot } from './props.js';

const actions = ['Action 2', 'Action 3', 'Action 4'];

/**
 * An action sheet (UIKit `UIAlertController`, style `actionSheet`, Figma
 * “Action Sheets”): choices for an action, as a modal panel.
 */
export const ActionSheetDemo: FunctionComponent = () => {
  const id = 'action-sheet';

  const [log, addLog] = useLog();

  const [externalRoot] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );

  return (
    <Component
      center
      baseUiId="dialog"
      controls={[controlRoot]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateRoot])}
      title="Action Sheet"
    >
      <Remounters remounters={[RemounterRoot]}>
        <ActionSheet.Root {...propsRoot}>
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
              {actions.map((action) => (
                <ActionSheet.Action
                  key={action}
                  onClick={() => addLog(`action: ${action}`)}
                >
                  {action}
                </ActionSheet.Action>
              ))}
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Remounters>
    </Component>
  );
};
