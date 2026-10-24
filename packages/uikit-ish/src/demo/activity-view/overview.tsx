import '../sheet/style.css';
import './style.css';

import { sfDocumentOnDocument } from '@bradleyhodges/sfsymbols/sfDocumentOnDocument';
import { sfEyeglasses } from '@bradleyhodges/sfsymbols/sfEyeglasses';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent } from 'react';

import {
  ActivityView,
  Avatar,
  Button,
  Sheet,
  Symbol,
} from '../../components/index.js';
import { photo } from '../avatar/props.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { useLabelledRef } from '../frame/render-code.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import {
  activityViewActionRows,
  activityViewPeopleRows,
  activityViewPersonRows,
} from './docs.js';

/** A Share button: what's shared, people and actions, in a sheet. */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      id="activity-view-overview"
      log={log}
      title="Activity view"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered"
      >
        <Sheet.Root>
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Share</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
            detent="medium"
          >
            <Sheet.Header>
              <Sheet.Grabber />
            </Sheet.Header>
            <Sheet.Content>
              <ActivityView.Header>
                <ActivityView.Thumbnail>
                  <img
                    alt=""
                    src={photo(30)}
                  />
                </ActivityView.Thumbnail>
                <ActivityView.Heading>
                  <ActivityView.Title>Weekend Photos</ActivityView.Title>
                  <ActivityView.Subtitle>12 Photos</ActivityView.Subtitle>
                </ActivityView.Heading>
                <Sheet.Close
                  render={
                    <Button.Root
                      aria-label="Close"
                      shape="circle"
                      variant="glass"
                    />
                  }
                >
                  <Button.Icon>
                    <Symbol icon={sfXmark} />
                  </Button.Icon>
                </Sheet.Close>
              </ActivityView.Header>
              <ActivityView.Separator />
              <ActivityView.People aria-label="People">
                <ActivityView.Person
                  onClick={() => addLog('person: Kate Bell')}
                >
                  <Avatar.Root>
                    <Avatar.Fallback>KB</Avatar.Fallback>
                  </Avatar.Root>
                  <ActivityView.Name>Kate Bell</ActivityView.Name>
                </ActivityView.Person>
                <ActivityView.Person
                  onClick={() => addLog('person: Gary and Fatima')}
                >
                  <Avatar.Group>
                    <Avatar.Root>
                      <Avatar.Fallback>GF</Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root>
                      <Avatar.Fallback>GF</Avatar.Fallback>
                    </Avatar.Root>
                  </Avatar.Group>
                  <ActivityView.Name>Gary and Fatima</ActivityView.Name>
                  <ActivityView.Count>2 People</ActivityView.Count>
                </ActivityView.Person>
              </ActivityView.People>
              <ActivityView.Separator />
              <ActivityView.Actions aria-label="Actions">
                <ActivityView.Action onClick={() => addLog('action: Copy')}>
                  <ActivityView.Symbol>
                    <Symbol icon={sfDocumentOnDocument} />
                  </ActivityView.Symbol>
                  <ActivityView.Label>Copy</ActivityView.Label>
                </ActivityView.Action>
                <ActivityView.Action
                  onClick={() => addLog('action: Add to Favorites')}
                >
                  <ActivityView.Symbol>
                    <Symbol icon={sfHeart} />
                  </ActivityView.Symbol>
                  <ActivityView.Label>Add to Favorites</ActivityView.Label>
                </ActivityView.Action>
                <ActivityView.Action
                  onClick={() => addLog('action: Add to Reading List')}
                >
                  <ActivityView.Symbol>
                    <Symbol icon={sfEyeglasses} />
                  </ActivityView.Symbol>
                  <ActivityView.Label>Add to Reading List</ActivityView.Label>
                </ActivityView.Action>
              </ActivityView.Actions>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
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

/** `/activity-view`: what an activity view is for, and its props. */
export const ActivityViewOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Sharing something: what’s shared, people to share with, actions on it
        (UIKit <code>UIActivityViewController</code>, the share sheet; Figma
        “Activity Views”).
      </li>
      <li>
        Parts in the app’s <a href="sheet">Sheet</a> (iPhone) or{' '}
        <a href="popover">Popover</a> (iPad).
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
        A Share button’s: sending, copying or saving what the person is looking
        at, with people they share with often.
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
        A few actions on something, without sharing: a <a href="menu">Menu</a>{' '}
        or a <a href="contextual-menu">Contextual menu</a>.
      </li>
      <li>
        Choices about an action just started: an{' '}
        <a href="action-sheet">Action sheet</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most activity views set.</li>
      <li>
        All parts’ props: <a href="activity-view/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['ActivityView.People', pickRows(activityViewPeopleRows, 'aria-label')],
        ['ActivityView.Person', pickRows(activityViewPersonRows, 'onClick')],
        ['ActivityView.Action', pickRows(activityViewActionRows, 'onClick')],
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
        People and actions are lists (name them: <code>aria-label</code>), each
        a button named by its text.
      </li>
      <li>
        The actions’ symbols are hidden; a thumbnail is decorative (empty{' '}
        <code>alt</code>), the title names what’s shared.
      </li>
      <li>The sheet or popover is the dialog: name it by the title.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        People and actions in rows scrolling sideways, 78px each, 14px apart.
      </li>
      <li>
        A group’s name with its count (
        <PartLink
          component="activity-view"
          part="ActivityView.Count"
        />
        ) takes one line, truncated (iOS scales it down instead).
      </li>
      <li>
        An action’s circle darkens while pressed; pressing does the action, the
        app closing the sheet if it’s done.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const activityViewOverviewDemos = [LiveView];
