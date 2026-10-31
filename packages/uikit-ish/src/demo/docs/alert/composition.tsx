import '../sheet/style.css';

import { FunctionComponent, useState } from 'react';

import { Alert, Button, List, Viewport } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

/** A list's folder renamed: its name in the alert's field, saved by Save. */
const WithATextField: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [folder, setFolder] = useState('Recipes');
  const [name, setName] = useState(folder);

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      id="alert-composition-field"
      log={log}
      screen="centered"
      stage="phone"
      title="Alert with a text field"
    >
      <Viewport.Content>
        <List.Root style={{ width: '100%' }}>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Content>
                  <List.Title>{folder}</List.Title>
                </List.Content>
                <List.Trailing>
                  <Alert.Root
                    onOpenChange={(isOpen: boolean) => {
                      if (isOpen) setName(folder);
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
                    <Alert.Popup>
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
                </List.Trailing>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A save that fails: the app opens the alert (`open`), no trigger. */
const OpenedByTheApp: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isFailed, setIsFailed] = useState(false);

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      id="alert-composition-app"
      log={log}
      screen="centered"
      stage="phone"
      title="Alert opened by the app"
    >
      <Viewport.Content>
        <Button.Root
          size="large"
          variant="bordered"
          onClick={() => {
            addLog('save failed');
            setIsFailed(true);
          }}
        >
          <Button.Label>Save</Button.Label>
        </Button.Root>
        <Alert.Root
          open={isFailed}
          onOpenChange={(isOpen: boolean) => setIsFailed(isOpen)}
        >
          <Alert.Popup>
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
      </Viewport.Content>
    </Component>
  );
};

/** Three actions: stacked, the default first, Cancel last. */
const ThreeActions: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      id="alert-composition-three"
      log={log}
      screen="centered"
      stage="phone"
      title="Alert with three actions"
    >
      <Viewport.Content>
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
          <Alert.Popup>
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
      </Viewport.Content>
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
      <li>
        <strong>Library:</strong> the alert with its field (
        <PartLink
          component="alert"
          part="Alert.Field"
        />
        ), its primary and cancel actions, and its trigger rendered by the row’s
        button.
      </li>
      <li>
        <strong>Demo:</strong> the folder’s name and the field’s value (the
        app’s state, reset as it opens), disabling Save while it’s empty, and
        renaming the row on Save.
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
      <li>
        <strong>Library:</strong> opening without a trigger (<code>open</code>),
        its one action closing it (<code>onOpenChange</code>), or a handle doing
        the same without the state.
      </li>
      <li>
        <strong>Demo:</strong> the open state and the failed save that sets it.
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
        More than two: stacked (
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
      <li>
        <strong>Library:</strong> stacking more than two actions (
        <PartLink
          component="alert"
          part="Alert.Actions"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the three choices and what each does (logged).
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
