import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { Alert, Button } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
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
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [externalContent, externalRoot, externalActions] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'Alert.Root',
    externalRoot,
  );
  const [controlActions, propsActions, stateActions] = usePropControl(
    propOptionsActions,
    'Alert.Actions',
    externalActions,
  );

  return (
    <Component
      center
      inline
      inputGuards
      baseUiId="alert-dialog"
      controls={[controlContent, controlRoot, controlActions]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, stateActions]}
      title="Alert"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Alert.Root
          key={keyRoot}
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
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup container={screen}>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              {content.description ? (
                <Alert.Description>
                  This note will be deleted from all your devices.
                </Alert.Description>
              ) : null}
            </Alert.Header>
            {content.field ? (
              <Alert.Fields>
                <Alert.Field
                  aria-label="Reason"
                  placeholder="Reason (optional)"
                />
              </Alert.Fields>
            ) : null}
            <Alert.Actions {...propsActions}>
              <Alert.Action onClick={() => addLog('action: cancel')}>
                Cancel
              </Alert.Action>
              <Alert.Action
                variant="destructive"
                onClick={() => addLog('action: delete')}
              >
                Delete
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
        Important information that needs a response now (UIKit{' '}
        <code>UIAlertController</code>, style <code>alert</code>): a title, a
        message, optionally text fields, its actions.
      </li>
      <li>Modal: the app waits, the page dimmed, until an action is chosen.</li>
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
        Confirming an action that can’t be undone (Delete), or telling about a
        problem the person must know about now (a failed save).
      </li>
      <li>
        Sparingly: an alert interrupts; prefer inline feedback, or undo (guide{' '}
        <GuideLink to="rule-a7">A7</GuideLink>).
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
        Choices about an action the person just started (Delete Photo, Save
        Draft, Cancel), from its control: an{' '}
        <a href="action-sheet">Action sheet</a>.
      </li>
      <li>
        A task with more than a field or two (a form): a{' '}
        <a href="sheet">Sheet</a>.
      </li>
      <li>
        Options at a control, dismissed by a press outside: a{' '}
        <a href="popover">Popover</a> or a <a href="menu">Menu</a>.
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
        All parts’ props: <a href="alert/parts">Parts</a>.
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
        Opening moves focus into it (its first field, or its first action),
        trapped there; closing returns it to its trigger. Escape closes it.
      </li>
      <li>
        Its actions are buttons, labeled by what they do (Delete, not Yes); a
        destructive one is red, not only by color: by its label too.
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
        Centered in its container (the window, or <code>container</code>), the
        page dimmed behind it; a press outside does nothing.
      </li>
      <li>
        Each action closes it (after its click handler); two side by side, more
        than two stacked (<code>stacked</code> for two long labels).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const alertOverviewDemos = [LiveView];
