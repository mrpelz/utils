import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { Alert, Button } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { getPropOptionsRoot, propOptionsContent } from './props.js';

/**
 * An alert (UIKit `UIAlertController`, Figma “Alerts”, Base UI's
 * `AlertDialog`): a title and description, optionally text fields, and its
 * buttons, side by side or stacked.
 */
export const AlertDemo: FunctionComponent = () => {
  const id = 'alert';

  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  const [externalRoot, externalContent] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const { actions, fields, stacked } = propsContent;

  return (
    <Component
      center
      inputGuards
      baseUiId="alert-dialog"
      controls={[controlRoot, controlContent]}
      id={id}
      log={log}
      state={[stateRoot, stateContent]}
      title="Alert"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
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
          <Alert.Popup container={screen}>
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
      </div>
    </Component>
  );
};
