import '../sheet/style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import { Alert, Button, List, Viewport } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const withATextFieldCode = `const [folder, setFolder] = useState('Recipes');
const [name, setName] = useState(folder);

<Alert.Root
  onOpenChange={(isOpen) => {
    // Reset the field as it opens.
    if (isOpen) setName(folder);
  }}
>
  <Alert.Trigger render={<Button.Root size="small" variant="borderless" />}>
    <Button.Label>Rename</Button.Label>
  </Alert.Trigger>
  <Alert.Popup>
    <Alert.Header>
      <Alert.Title>Rename Folder</Alert.Title>
      <Alert.Description>Enter a name for this folder.</Alert.Description>
    </Alert.Header>
    <Alert.Fields>
      <Alert.Field
        aria-label="Name"
        placeholder="Name"
        value={name}
        onValueChange={setName}
      />
    </Alert.Fields>
    <Alert.Actions>
      <Alert.Action>Cancel</Alert.Action>
      <Alert.Action
        disabled={name.trim() === ''}
        variant="primary"
        onClick={() => setFolder(name)}
      >
        Save
      </Alert.Action>
    </Alert.Actions>
  </Alert.Popup>
</Alert.Root>`;

const openedByTheAppCode = `const [isFailed, setIsFailed] = useState(false);

// No trigger: the app opens it, for example as a save fails.
<Alert.Root
  open={isFailed}
  onOpenChange={setIsFailed}
>
  <Alert.Popup>
    <Alert.Header>
      <Alert.Title>Couldn’t Save Note</Alert.Title>
      <Alert.Description>
        The server can’t be reached. Try again later.
      </Alert.Description>
    </Alert.Header>
    <Alert.Actions>
      <Alert.Action variant="primary">OK</Alert.Action>
    </Alert.Actions>
  </Alert.Popup>
</Alert.Root>`;

const threeActionsCode = `<Alert.Popup>
  <Alert.Header>
    <Alert.Title>Save Draft?</Alert.Title>
    <Alert.Description>Your message hasn’t been sent.</Alert.Description>
  </Alert.Header>
  {/* More than two: stacked, the default first, Cancel last. */}
  <Alert.Actions>
    <Alert.Action variant="primary">Save Draft</Alert.Action>
    <Alert.Action variant="destructive">Delete Draft</Alert.Action>
    <Alert.Action>Cancel</Alert.Action>
  </Alert.Actions>
</Alert.Popup>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A list's folder renamed: its name in the alert's field, saved by Save. */
const WithATextField: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [folder, setFolder] = useState('Recipes');
  const [name, setName] = useState(folder);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['disabled', 'onClick', 'variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Field': [
              'aria-label',
              'onValueChange',
              'placeholder',
              'value',
            ],
            'Alert.Fields': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Root': ['onOpenChange'],
            'Alert.Title': [],
            'Alert.Trigger': ['render'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('alert-composition-field') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[partControls]}
      id="alert-composition-field"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Alert with a text field"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <List.Root
          {...partProps['List.Root']}
          style={{ width: '100%' }}
        >
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{folder}</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Alert.Root
                    {...partProps['Alert.Root']}
                    onOpenChange={(isOpen: boolean) => {
                      if (isOpen) setName(folder);
                    }}
                  >
                    <Alert.Trigger
                      {...partProps['Alert.Trigger']}
                      render={
                        <Button.Root
                          {...partProps['Button.Root']}
                          size="small"
                          variant="borderless"
                        />
                      }
                    >
                      <Button.Label {...partProps['Button.Label']}>
                        Rename
                      </Button.Label>
                    </Alert.Trigger>
                    <Alert.Popup {...partProps['Alert.Popup']}>
                      <Alert.Header {...partProps['Alert.Header']}>
                        <Alert.Title {...partProps['Alert.Title']}>
                          Rename Folder
                        </Alert.Title>
                        <Alert.Description {...partProps['Alert.Description']}>
                          Enter a name for this folder.
                        </Alert.Description>
                      </Alert.Header>
                      <Alert.Fields {...partProps['Alert.Fields']}>
                        <Alert.Field
                          {...partProps['Alert.Field']}
                          aria-label="Name"
                          placeholder="Name"
                          value={name}
                          onValueChange={(value: string) => setName(value)}
                        />
                      </Alert.Fields>
                      <Alert.Actions {...partProps['Alert.Actions']}>
                        <Alert.Action {...partProps['Alert.Action']}>
                          Cancel
                        </Alert.Action>
                        <Alert.Action
                          {...partProps['Alert.Action']}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['onClick', 'variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Root': ['onOpenChange', 'open'],
            'Alert.Title': [],
            'Button.Label': [],
            'Button.Root': ['onClick', 'size', 'variant'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('alert-composition-app') },
  );

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      controls={[partControls]}
      id="alert-composition-app"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Alert opened by the app"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Button.Root
          {...partProps['Button.Root']}
          size="large"
          variant="bordered"
          onClick={() => {
            addLog('save failed');
            setIsFailed(true);
          }}
        >
          <Button.Label {...partProps['Button.Label']}>Save</Button.Label>
        </Button.Root>
        <Alert.Root
          {...partProps['Alert.Root']}
          open={isFailed}
          onOpenChange={(isOpen: boolean) => setIsFailed(isOpen)}
        >
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Couldn’t Save Note
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                The server can’t be reached. Try again later.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action
                {...partProps['Alert.Action']}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['onClick', 'variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Root': [],
            'Alert.Title': [],
            'Alert.Trigger': ['render'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('alert-composition-three') },
  );

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      controls={[partControls]}
      id="alert-composition-three"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Alert with three actions"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root {...partProps['Alert.Root']}>
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Close Draft
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Save Draft?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                Your message hasn’t been sent.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="primary"
                onClick={() => addLog('action: save')}
              >
                Save Draft
              </Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
                onClick={() => addLog('action: delete')}
              >
                Delete Draft
              </Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                onClick={() => addLog('action: cancel')}
              >
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
        A <a href={publicUrl('list')}>List</a> row’s button opens it. Its{' '}
        <PartLink
          component="alert"
          part="Alert.Field"
        />{' '}
        holds the new name, which is the app’s state, reset as the alert opens.
      </li>
      <li>
        Save, the primary action, renames the folder, and is disabled while the
        name is empty. Cancel closes the alert without changing anything.
      </li>
      <li>
        <strong>Library:</strong> the alert with its field (
        <PartLink
          component="alert"
          part="Alert.Field"
        />
        ), its primary and cancel actions, and its trigger rendered as the row’s
        button.
      </li>
      <li>
        <strong>Demo:</strong> the folder’s name and the field’s value (the
        app’s state, reset as it opens), disabling Save while it’s empty, and
        renaming the row on Save.
      </li>
    </ul>
    <CodeView code={withATextFieldCode} />
    <WithATextField />

    <Heading
      id="opened-by-the-app"
      level={2}
    >
      Opened by the app
    </Heading>
    <ul>
      <li>
        There’s no trigger: the app opens it with its state (<code>open</code>),
        for example when a save fails. Its action closes it (
        <code>onOpenChange</code>).
      </li>
      <li>
        It has one action (OK), because it informs rather than asks. A handle (
        <PartLink
          component="alert"
          part="useCreateAlertHandle"
        />
        ) does the same without the state.
      </li>
      <li>
        <strong>Library:</strong> opening without a trigger (<code>open</code>),
        its one action closing it (<code>onOpenChange</code>), or a handle that
        does the same without the state.
      </li>
      <li>
        <strong>Demo:</strong> the open state, and the failed save that sets it.
      </li>
    </ul>
    <CodeView code={openedByTheAppCode} />
    <OpenedByTheApp />

    <Heading
      id="three-actions"
      level={2}
    >
      Three actions
    </Heading>
    <ul>
      <li>
        More than two actions are stacked (
        <PartLink
          component="alert"
          part="Alert.Actions"
        />
        ), with the default first and Cancel last.
      </li>
      <li>
        For a choice about what to do with something someone started, an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a> is often the better
        fit.
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
        <strong>Demo:</strong> the three choices, and what each does (logged).
      </li>
    </ul>
    <CodeView code={threeActionsCode} />
    <ThreeActions />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const alertCompositionDemos = [
  WithATextField,
  OpenedByTheApp,
  ThreeActions,
];
