import '../sheet/style.css';

import { FunctionComponent, useState } from 'react';

import { Alert, Button, List } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { useLabelledRef } from '../frame/render-code.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';

/** A list's folder renamed: its name in the alert's field, saved by Save. */
const WithATextField: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [folder, setFolder] = useState('Recipes');
  const [name, setName] = useState(folder);

  return (
    <Component
      center
      inline
      inputGuards
      baseUiId="alert-dialog"
      id="alert-composition-field"
      log={log}
      title="Alert with a text field"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <List.Root style={{ width: '100%' }}>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Title>{folder}</List.Title>
                <Alert.Root
                  onOpenChange={(open: boolean) => {
                    if (open) setName(folder);
                  }}
                >
                  <Alert.Trigger
                    render={
                      <Button.Root
                        size="small"
                        variant="borderless"
                      />
                    }
                  >
                    <Button.Label>Rename</Button.Label>
                  </Alert.Trigger>
                  <Alert.Popup container={screen}>
                    <Alert.Header>
                      <Alert.Title>Rename Folder</Alert.Title>
                      <Alert.Description>
                        Enter a name for this folder.
                      </Alert.Description>
                    </Alert.Header>
                    <Alert.Fields>
                      <Alert.Field
                        aria-label="Name"
                        placeholder="Name"
                        value={name}
                        onValueChange={(value: string) => setName(value)}
                      />
                    </Alert.Fields>
                    <Alert.Actions>
                      <Alert.Action>Cancel</Alert.Action>
                      <Alert.Action
                        disabled={name.trim() === ''}
                        variant="primary"
                        onClick={() => {
                          addLog(`renamed: ${folder} → ${name}`);
                          setFolder(name);
                        }}
                      >
                        Save
                      </Alert.Action>
                    </Alert.Actions>
                  </Alert.Popup>
                </Alert.Root>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};

/** A save that fails: the app opens the alert (`open`), no trigger. */
const OpenedByTheApp: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [failed, setFailed] = useState(false);

  return (
    <Component
      center
      inline
      baseUiId="alert-dialog"
      id="alert-composition-app"
      log={log}
      title="Alert opened by the app"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Button.Root
          size="large"
          variant="bordered"
          onClick={() => {
            addLog('save failed');
            setFailed(true);
          }}
        >
          <Button.Label>Save</Button.Label>
        </Button.Root>
        <Alert.Root
          open={failed}
          onOpenChange={(open: boolean) => setFailed(open)}
        >
          <Alert.Popup container={screen}>
            <Alert.Header>
              <Alert.Title>Couldn’t Save Note</Alert.Title>
              <Alert.Description>
                The server can’t be reached. Try again later.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action
                variant="primary"
                onClick={() => addLog('action: ok')}
              >
                OK
              </Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </div>
    </Component>
  );
};

/** Three actions: stacked, the default first, Cancel last. */
const ThreeActions: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      baseUiId="alert-dialog"
      id="alert-composition-three"
      log={log}
      title="Alert with three actions"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Alert.Root>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Close Draft</Button.Label>
          </Alert.Trigger>
          <Alert.Popup container={screen}>
            <Alert.Header>
              <Alert.Title>Save Draft?</Alert.Title>
              <Alert.Description>
                Your message hasn’t been sent.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action
                variant="primary"
                onClick={() => addLog('action: save')}
              >
                Save Draft
              </Alert.Action>
              <Alert.Action
                variant="destructive"
                onClick={() => addLog('action: delete')}
              >
                Delete Draft
              </Alert.Action>
              <Alert.Action onClick={() => addLog('action: cancel')}>
                Cancel
              </Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['with-a-text-field', 'With a text field'],
  ['opened-by-the-app', 'Opened by the app'],
  ['three-actions', 'Three actions'],
];

/** `/alert/composition`: alerts with other components. */
export const AlertComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="with-a-text-field"
      level={2}
    >
      With a text field
    </Heading>
    <ul>
      <li>
        A <a href="list">List</a> row’s button opens it; its{' '}
        <PartLink
          component="alert"
          part="Alert.Field"
        />{' '}
        holds the new name (the app’s state, its value reset as it opens).
      </li>
      <li>
        Save, the primary action, renames; disabled while the name is empty.
        Cancel closes it, nothing changed.
      </li>
    </ul>
    <WithATextField />

    <Heading
      id="opened-by-the-app"
      level={2}
    >
      Opened by the app
    </Heading>
    <ul>
      <li>
        No trigger: the app opens it (<code>open</code>, its state), e.g. as a
        save fails; its action closes it (<code>onOpenChange</code>).
      </li>
      <li>
        One action (OK): it tells, it doesn’t ask. A handle (
        <PartLink
          component="alert"
          part="useCreateAlertHandle"
        />
        ) does the same without the state.
      </li>
    </ul>
    <OpenedByTheApp />

    <Heading
      id="three-actions"
      level={2}
    >
      Three actions
    </Heading>
    <ul>
      <li>
        More than two: stacked, as UIKit does (
        <PartLink
          component="alert"
          part="Alert.Actions"
        />
        ); the default first, Cancel last.
      </li>
      <li>
        A choice of what to do with something the person started: often an{' '}
        <a href="action-sheet">Action sheet</a> instead.
      </li>
    </ul>
    <ThreeActions />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const alertCompositionDemos = [
  WithATextField,
  OpenedByTheApp,
  ThreeActions,
];
