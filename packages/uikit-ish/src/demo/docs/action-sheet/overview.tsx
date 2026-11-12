import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import { ActionSheet, Button, Viewport } from '../../../components/index.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'ActionSheet.Action': ['onClick', 'variant'],
            'ActionSheet.Actions': [],
            'ActionSheet.Description': [],
            'ActionSheet.Header': [],
            'ActionSheet.Popup': ['aria-label'],
            'ActionSheet.Trigger': ['render'],
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
      isInline
      baseUiId="popover"
      controls={[controlContent, controlRoot, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateContent, stateRoot, partState]}
      title="Action sheet"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          key={keyRoot}
          {...propsRoot}
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup
            {...partProps['ActionSheet.Popup']}
            aria-label="Delete Photo"
          >
            {content.header ? (
              <ActionSheet.Header {...partProps['ActionSheet.Header']}>
                <ActionSheet.Description
                  {...partProps['ActionSheet.Description']}
                >
                  This photo will be deleted from all your devices.
                </ActionSheet.Description>
              </ActionSheet.Header>
            ) : null}
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
                onClick={() => addLog('action: delete photo')}
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
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
        Choices about an action someone just started, shown at the control that
        started it.
      </li>
      <li>
        It’s modal, with the page dimmed, and a press outside cancels it. On a
        regular width, the same choices go in a{' '}
        <a href={publicUrl('popover')}>Popover</a> (see{' '}
        <a
          href={publicUrl(
            'action-sheet/composition#a-popover-in-a-regular-width',
          )}
        >
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
        For confirming, or choosing how to do, something someone started: Delete
        Photo or Remove from Album, or Discard Changes.
      </li>
      <li>
        For a set of commands at their control: two to a few actions, with a
        destructive one first.
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
        Commands that aren’t about confirming (Share, Duplicate, Rename): use a{' '}
        <a href={publicUrl('menu')}>Menu</a>.
      </li>
      <li>
        Information the app must give, or a question not tied to a control: use
        an <a href={publicUrl('alert')}>Alert</a>.
      </li>
      <li>Actions that can be undone: just do them, and offer undo.</li>
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
        All props of all parts are on the{' '}
        <a href={publicUrl('action-sheet/parts')}>Parts</a> page.
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
        (or, without one, by <code>aria-label</code>, as here) and described by
        its{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Description"
        />
        .
      </li>
      <li>
        Opening moves focus into it and traps it there (it’s modal). Closing
        returns focus to its trigger. Escape closes it.
      </li>
      <li>
        Its actions are buttons, labeled by what they do. A destructive one is
        red, and its label says so (Delete).
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
        It sits below its trigger, 8px away (or above it, without room), and
        scales in from it. When the app opens it without a trigger, it sits at
        the bottom of its container.
      </li>
      <li>
        Each action closes it, after its click handler. A press outside, or
        Escape, cancels it.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const actionSheetOverviewDemos = [LiveView];
