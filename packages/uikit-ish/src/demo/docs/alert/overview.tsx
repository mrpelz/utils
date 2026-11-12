import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { Alert, Button, Viewport } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  alertActionRows,
  alertActionsRows,
  alertPopupRows,
  alertRootRows,
} from './docs.js';
import {
  getPropOptionsRoot,
  propOptionsActions,
  propOptionsOverviewContent,
} from './props.js';

/** Deleting a note: its title, its message, Cancel and Delete. */
const LiveView: FunctionComponent = () => {
  const id = 'alert-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalActions] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Alert.Root' },
  );
  const [controlActions, propsActions, stateActions] = usePropControl(
    propOptionsActions,
    { external: externalActions, title: 'Alert.Actions' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['onClick', 'variant'],
            'Alert.Description': [],
            'Alert.Field': ['aria-label', 'placeholder'],
            'Alert.Fields': [],
            'Alert.Header': [],
            'Alert.Popup': [],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[controlContent, controlRoot, controlActions, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateContent, stateRoot, stateActions, partState]}
      title="Alert"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          key={keyRoot}
          {...propsRoot}
        >
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
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              {content.description ? (
                <Alert.Description {...partProps['Alert.Description']}>
                  This note will be deleted from all your devices.
                </Alert.Description>
              ) : null}
            </Alert.Header>
            {content.field ? (
              <Alert.Fields {...partProps['Alert.Fields']}>
                <Alert.Field
                  {...partProps['Alert.Field']}
                  aria-label="Reason"
                  placeholder="Reason (optional)"
                />
              </Alert.Fields>
            ) : null}
            <Alert.Actions {...propsActions}>
              <Alert.Action
                {...partProps['Alert.Action']}
                onClick={() => addLog('action: cancel')}
              >
                Cancel
              </Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
                onClick={() => addLog('action: delete')}
              >
                Delete
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
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/alert`: what an alert is for, and its props. */
export const AlertOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Important information that needs a response now: a title, a message,
        optional text fields, and its actions.
      </li>
      <li>
        It’s modal. The app waits, with the page dimmed, until an action is
        chosen.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For confirming an action that can’t be undone (Delete), or for a problem
        people must know about now (a failed save).
      </li>
      <li>
        Use it sparingly, because an alert interrupts. Prefer inline feedback,
        or undo.
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Choices about an action someone just started (Delete Photo, Save Draft,
        Cancel), from its control: use an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a>.
      </li>
      <li>
        A task with more than a field or two (a form): use a{' '}
        <a href={publicUrl('sheet')}>Sheet</a>.
      </li>
      <li>
        Options at a control, dismissed by a press outside: use a{' '}
        <a href={publicUrl('popover')}>Popover</a> or a{' '}
        <a href={publicUrl('menu')}>Menu</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most alerts set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('alert/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Alert.Root',
          pickRows(alertRootRows, 'open', 'defaultOpen', 'onOpenChange'),
        ],
        ['Alert.Popup', pickRows(alertPopupRows, 'container')],
        ['Alert.Actions', pickRows(alertActionsRows, 'stacked')],
        ['Alert.Action', pickRows(alertActionRows, 'variant')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        The popup is an <code>alertdialog</code>, named by its{' '}
        <PartLink
          component="alert"
          part="Alert.Title"
        />{' '}
        and described by its{' '}
        <PartLink
          component="alert"
          part="Alert.Description"
        />
        .
      </li>
      <li>
        Opening moves focus into it (to its first field, or its first action)
        and traps it there. Closing returns focus to its trigger. Escape closes
        it.
      </li>
      <li>
        Its actions are buttons, labeled by what they do (Delete, not Yes). A
        destructive one is red, but its label says it too, not only its color.
      </li>
      <li>
        Its scale-in doesn’t follow <code>prefers-reduced-motion</code>.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        It’s centered in its container (the window, or <code>container</code>),
        with the page dimmed behind it. A press outside does nothing.
      </li>
      <li>
        When a text field inside it is typed into, it’s lifted as a whole, clear
        of the keyboard and 8px above it (like a{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        ). It goes back as the keyboard hides.
      </li>
      <li>
        Each action closes it, after its click handler. Two actions sit side by
        side, and more than two are stacked (use <code>stacked</code> for two
        long labels).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const alertOverviewDemos = [LiveView];
