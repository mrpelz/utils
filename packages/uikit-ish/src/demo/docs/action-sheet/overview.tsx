import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { ActionSheet, Button, Viewport } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import {
  actionSheetActionRows,
  actionSheetPopupRows,
  actionSheetRootRows,
} from './docs.js';
import { getPropOptionsRoot, propOptionsOverviewContent } from './props.js';

/** Deleting a photo: at its button, what to do with it. */
const LiveView: FunctionComponent = () => {
  const id = 'action-sheet-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'ActionSheet.Root' },
  );

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateContent, stateRoot]}
      title="Action sheet"
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
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup aria-label="Delete Photo">
            {content.header ? (
              <ActionSheet.Header>
                <ActionSheet.Description>
                  This photo will be deleted from all your devices.
                </ActionSheet.Description>
              </ActionSheet.Header>
            ) : null}
            <ActionSheet.Actions>
              <ActionSheet.Action
                variant="destructive"
                onClick={() => addLog('action: delete photo')}
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action
                onClick={() => addLog('action: remove from album')}
              >
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
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

/** `/action-sheet`: what an action sheet is for, and its props. */
export const ActionSheetOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Choices about an action the person just started: at the control that
        started it.
      </li>
      <li>
        Modal: the page dimmed; a press outside cancels. In a regular width, the
        same choices in a <a href="popover">Popover</a> (see{' '}
        <a href="action-sheet/composition#a-popover-in-a-regular-width">
          A popover in a regular width
        </a>
        ).
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
        Confirming or choosing how to do something the person started: Delete
        Photo or Remove from Album, Discard Changes.
      </li>
      <li>
        A Command set at its control (guide{' '}
        <GuideLink to="primitive-command-set">§5</GuideLink>): two to a few
        actions, a destructive one first.
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
        Commands that aren’t about confirming (Share, Duplicate, Rename): a{' '}
        <a href="menu">Menu</a>.
      </li>
      <li>
        Information the app must tell, or a question not tied to a control: an{' '}
        <a href="alert">Alert</a>.
      </li>
      <li>Undoable actions: just do them, offer undo.</li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most action sheets set.</li>
      <li>
        All parts’ props: <a href="action-sheet/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'ActionSheet.Root',
          pickRows(actionSheetRootRows, 'open', 'defaultOpen', 'onOpenChange'),
        ],
        ['ActionSheet.Popup', pickRows(actionSheetPopupRows, 'container')],
        ['ActionSheet.Action', pickRows(actionSheetActionRows, 'variant')],
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
        The popup is a <code>dialog</code>, named by its{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Title"
        />{' '}
        (without one, by <code>aria-label</code>, as here) and described by its{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Description"
        />
        .
      </li>
      <li>
        Opening moves focus into it, trapped there (modal); closing returns it
        to its trigger. Escape closes it.
      </li>
      <li>
        Its actions are buttons, labeled by what they do; a destructive one is
        red, and says so (Delete).
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
        Below its trigger, 8px from it (above it, if there’s no room), scaling
        in from it; opened by the app without a trigger, at the bottom of its
        container.
      </li>
      <li>
        Each action closes it (after its click handler); a press outside, or
        Escape, cancels.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const actionSheetOverviewDemos = [LiveView];
