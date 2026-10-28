import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { Alert, Button, Viewport } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { getPropOptionsRoot, propOptionsContent } from './props.js';

/**
 * An alert (UIKit `UIAlertController`, Figma “Alerts”, Base UI's
 * `AlertDialog`): a title and description, optionally text fields, and its
 * buttons, side by side or stacked.
 */
export const AlertDemo: FunctionComponent = () => {
  const id = 'alert';

  const [log, addLog] = useLog();

  const [externalRoot, externalContent] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const { actions, fields, stacked } = propsContent;

  return (
    <Component
      hasInputGuards
      baseUiId="alert-dialog"
      controls={[controlRoot, controlContent]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, stateContent]}
      title="Alert"
    >
      <Viewport.Content>
        <Alert.Root
          key={`${keyRoot}`}
          {...propsRoot}
        >
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Show Alert</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>A Short Title Is Best</Alert.Title>
              <Alert.Description>
                A description should be a short, complete sentence.
              </Alert.Description>
            </Alert.Header>
            {fields ? (
              <Alert.Fields>
                <Alert.Field
                  aria-label="Name"
                  placeholder="Name"
                />
                <Alert.Field
                  aria-label="Password"
                  placeholder="Password"
                  type="password"
                />
              </Alert.Fields>
            ) : null}
            <Alert.Actions stacked={stacked}>
              {actions === 'three' ? (
                <>
                  <Alert.Action
                    variant="primary"
                    onClick={() => addLog('action: primary')}
                  >
                    Primary
                  </Alert.Action>
                  <Alert.Action
                    variant="destructive"
                    onClick={() => addLog('action: destructive')}
                  >
                    Destructive
                  </Alert.Action>
                  <Alert.Action onClick={() => addLog('action: secondary')}>
                    Secondary
                  </Alert.Action>
                </>
              ) : (
                <>
                  <Alert.Action onClick={() => addLog('action: cancel')}>
                    Cancel
                  </Alert.Action>
                  <Alert.Action
                    variant="primary"
                    onClick={() => addLog('action: ok')}
                  >
                    OK
                  </Alert.Action>
                </>
              )}
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};
