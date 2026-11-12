import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Avatar,
  Badge,
  Button,
  List,
  Symbol,
} from '../../../components/index.js';
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
import { sfBell } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { badgeRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** A badge in each of its places: a symbol, a corner, a row. */
const LiveView: FunctionComponent = () => {
  const id = 'badge-overview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverview, {
    external,
    isOpen: true,
    title: 'Badge',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Avatar.Fallback': [],
            'Avatar.Root': [],
            'Button.Icon': [],
            'Button.Root': [
              'aria-label',
              'onClick',
              'shape',
              'size',
              'variant',
            ],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Badge"
    >
      <div className="badge-demo-stage">
        <div className="badge-demo-row">
          <Button.Root
            {...partProps['Button.Root']}
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
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfBell}
              >
                <Badge
                  placement="symbol"
                  {...props}
                />
              </Symbol>
            </Button.Icon>
          </Button.Root>
          <Avatar.Root {...partProps['Avatar.Root']}>
            <Avatar.Fallback {...partProps['Avatar.Fallback']}>
              JA
            </Avatar.Fallback>
            <Badge {...props} />
          </Avatar.Root>
        </div>
        <List.Root
          {...partProps['List.Root']}
          className="badge-demo-list"
        >
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Inbox</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>
                    <Badge
                      placement="inline"
                      {...props}
                    />
                  </List.Detail>
                </List.Trailing>
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
        A count (or a word) in a red capsule, or a dot, for something new to
        look at.
      </li>
      <li>
        It sits on a symbol (a tab’s, a button’s), on an element’s corner (an
        avatar’s), or inline (in a list row).
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
        For things waiting for people, counted: unread messages, pending
        updates, notifications.
      </li>
      <li>
        Without a count, as a dot: there’s something new, and how much doesn’t
        matter.
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
        A count that isn’t waiting for anyone (a folder’s items): use a list
        row’s plain{' '}
        <PartLink
          component="list"
          part="List.Detail"
        />{' '}
        text, as for a mail app’s mailboxes.
      </li>
      <li>
        Work going on: use <a href={publicUrl('progress')}>Progress</a>.
      </li>
      <li>
        Something people must answer now: use an{' '}
        <a href={publicUrl('alert')}>Alert</a>.
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
        All its props are on the <a href={publicUrl('badge/parts')}>Parts</a>{' '}
        page.
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
        isn’t, so say it in the name (“Notifications, 3 new”).
      </li>
      <li>
        A dot has no text. Say what it means in its control’s name or its row’s
        text (“Unread”).
      </li>
      <li>
        It ignores the pointer (<code>pointer-events: none</code>), so presses
        go to what it’s on.
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
        A single digit sits in a circle. More grow it into a capsule toward the
        end (24px tall, or 16px on a symbol).
      </li>
      <li>
        Without content, it’s a 10px dot: centered on the corner on a symbol,
        and centered on the text when inline.
      </li>
      <li>
        On a symbol, it’s neither blended nor scaled with it (see{' '}
        <a href={publicUrl('symbol')}>Symbol</a>), so in a glass button, it
        stays red.
      </li>
      <li>
        On a tab that collapses away, it fades with its tab (see{' '}
        <a href={publicUrl('tab-bar/composition#badges-on-tabs')}>Tab Bar</a>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const badgeOverviewDemos = [LiveView];
