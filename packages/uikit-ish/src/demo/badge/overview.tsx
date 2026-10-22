import './style.css';

import { sfBell } from '@bradleyhodges/sfsymbols/sfBell';
import { FunctionComponent } from 'react';

import { Avatar, Badge, Button, List, Symbol } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { badgeRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** A badge in each of its places: a symbol, a corner, a row. */
const LiveView: FunctionComponent = () => {
  const id = 'badge-overview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsOverview,
    'Badge',
    external,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Badge"
    >
      <div className="badge-demo-stage">
        <div className="badge-demo-row">
          <Button.Root
            shape="circle"
            size="large"
            variant="glass"
            aria-label={
              props.children === undefined
                ? 'Notifications, new'
                : `Notifications, ${String(props.children)} new`
            }
            onClick={() => addLog('notifications clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfBell}>
                <Badge
                  placement="symbol"
                  {...props}
                />
              </Symbol>
            </Button.Icon>
          </Button.Root>
          <Avatar.Root>
            <Avatar.Fallback>JA</Avatar.Fallback>
            <Badge {...props} />
          </Avatar.Root>
        </div>
        <List.Root className="badge-demo-list">
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Title>Inbox</List.Title>
                <List.Detail>
                  <Badge
                    placement="inline"
                    {...props}
                  />
                </List.Detail>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
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

/** `/badge`: what a badge is for, and its props. */
export const BadgeOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A count (or a word) in a red capsule, or a dot: something new to look at
        (UIKit <code>badgeValue</code>, Figma “_Badge”).
      </li>
      <li>
        On a symbol (a tab’s, a button’s), on an element’s corner (an avatar’s),
        or inline (a list row’s).
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
        Things waiting for the person, counted: unread messages, pending
        updates, notifications.
      </li>
      <li>
        Without a count, a dot: there’s something new, how much doesn’t matter.
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
        A count that isn’t waiting for anyone (a folder’s items): a list row’s
        plain{' '}
        <PartLink
          component="list"
          part="List.Detail"
        />{' '}
        text, as Mail’s mailboxes.
      </li>
      <li>
        Work going on: <a href="progress">Progress</a>.
      </li>
      <li>
        Something the person must answer now: an <a href="alert">Alert</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most badges set.</li>
      <li>
        All its props: <a href="badge/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[['Badge', pickRows(badgeRows, 'children', 'placement', 'tint')]]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        Its text is read where it is: in a row, after the row’s title. In a
        control named by <code>aria-label</code> (a symbol-only button), it
        isn’t: say it in the name (“Notifications, 3 new”).
      </li>
      <li>
        A dot has no text: say what it means in its control’s name or its row’s
        text (“Unread”).
      </li>
      <li>
        It ignores the pointer (<code>pointer-events: none</code>): presses go
        to what it’s on.
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
        A digit in a circle; more, a capsule growing towards the end (24px high;
        on a symbol, 16px).
      </li>
      <li>
        Without content, a 10px dot: on a symbol, centered on its corner;
        inline, centered on the text.
      </li>
      <li>
        On a symbol, it’s neither blended nor scaled with it (see{' '}
        <a href="symbol">Symbol</a>): in a glass button, it stays red.
      </li>
      <li>
        On a tab collapsing away, it fades with its tab (see{' '}
        <a href="tab-bar/composition#badges-on-tabs">Tab bar</a>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const badgeOverviewDemos = [LiveView];
