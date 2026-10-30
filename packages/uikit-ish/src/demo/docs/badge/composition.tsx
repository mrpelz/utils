import '../toolbar/style.css';
import './style.css';

import { FunctionComponent } from 'react';

import {
  Avatar,
  Badge,
  Button,
  List,
  Symbol,
  Toolbar,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfBellFill,
  sfEnvelopeFill,
  sfGearshapeFill,
} from '../../tooling/icons.js';
import { GuideLink } from '../hig-guide/link.js';

/** Settings' rows: a pending update counted in its row. */
const InAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="badge-composition-row"
      log={log}
      title="Badge in a list row"
    >
      <List.Root className="badge-demo-list">
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Leading>
                <List.Image
                  style={{ backgroundColor: 'var(--color-ui-system-gray)' }}
                  variant="rounded"
                >
                  <Symbol icon={sfGearshapeFill} />
                </List.Image>
              </List.Leading>
              <List.Content>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => addLog('general clicked')}
                >
                  General
                </List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>
                  <Badge placement="inline">1</Badge>
                </List.Detail>
              </List.Trailing>
              <List.Trailing>
                <List.DrillIn />
              </List.Trailing>
            </List.Item>
            <List.Item>
              <List.Leading>
                <List.Image
                  style={{ backgroundColor: 'var(--color-ui-system-red)' }}
                  variant="rounded"
                >
                  <Symbol icon={sfBellFill} />
                </List.Image>
              </List.Leading>
              <List.Content>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => addLog('notifications clicked')}
                >
                  Notifications
                </List.Title>
              </List.Content>
              <List.Trailing>
                <List.DrillIn />
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** People with unread messages: a count, or a dot, on their avatars. */
const OnAnAvatar: FunctionComponent = () => (
  <Component
    isCentered
    isInline
    id="badge-composition-avatar"
    title="Badge on an avatar"
  >
    <div className="badge-demo-row">
      <Avatar.Root aria-label="Jane Doe, 3 unread">
        <Avatar.Fallback>JA</Avatar.Fallback>
        <Badge>3</Badge>
      </Avatar.Root>
      <Avatar.Root aria-label="Kate Brown, unread">
        <Avatar.Fallback>KB</Avatar.Fallback>
        <Badge tint="var(--color-ui-system-blue)" />
      </Avatar.Root>
    </div>
  </Component>
);

/** A toolbar's symbol button, new mail told on it (and in its name). */
const OnAToolbarButton: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="badge-composition-toolbar"
      log={log}
      title="Badge on a toolbar button"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root placement="block-start">
          <Toolbar.Title>
            <span>Home</span>
          </Toolbar.Title>
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="Mail, 12 unread"
              shape="circle"
              onClick={() => addLog('mail clicked')}
            >
              <Button.Icon>
                <Symbol icon={sfEnvelopeFill}>
                  <Badge placement="symbol">12</Badge>
                </Symbol>
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-a-list-row', 'In a list row'],
  ['on-an-avatar', 'On an avatar'],
  ['on-a-toolbar-button', 'On a toolbar button'],
  ['on-tabs', 'On tabs'],
];

/** `/badge/composition`: badges on other components. */
export const BadgeComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="in-a-list-row"
      level={2}
    >
      In a list row
    </Heading>
    <ul>
      <li>
        Inline (<code>placement=&quot;inline&quot;</code>), in a{' '}
        <a href="list">List</a> row’s detail, before its chevron: Settings’
        pending update.
      </li>
      <li>Read with the row: “General, 1”.</li>
      <li>
        <strong>Library:</strong> the inline badge (
        <PartLink
          component="badge"
          part="Badge"
        />{' '}
        <code>placement=&quot;inline&quot;</code>) in the row’s detail, before
        its chevron (
        <PartLink
          component="list"
          part="List.DrillIn"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the count, and the row it’s on (Settings’
        General).
      </li>
    </ul>
    <InAListRow />

    <Heading
      id="on-an-avatar"
      level={2}
    >
      On an avatar
    </Heading>
    <ul>
      <li>
        On its corner (the default, <code>corner</code>): an{' '}
        <a href="avatar">Avatar</a> is positioned, and doesn’t clip it.
      </li>
      <li>
        Without a count, a dot inside the corner; here tinted (<code>tint</code>
        ).
      </li>
      <li>The avatar named with it (“Jane Doe, 3 unread”).</li>
      <li>
        <strong>Library:</strong> the badge on the avatar’s corner, its count or
        dot and its <code>tint</code>.
      </li>
      <li>
        <strong>Demo:</strong> the count and the person; naming the avatar with
        it (<code>aria-label</code>).
      </li>
    </ul>
    <OnAnAvatar />

    <Heading
      id="on-a-toolbar-button"
      level={2}
    >
      On a toolbar button
    </Heading>
    <ul>
      <li>
        On the button’s <a href="symbol">Symbol</a> (
        <code>placement=&quot;symbol&quot;</code>, its child): smaller, and not
        blended with the glass as the symbol is.
      </li>
      <li>
        The button named by <code>aria-label</code>: the count said in it too
        (“Mail, 12 unread”).
      </li>
      <li>
        <strong>Library:</strong> the badge on the button’s symbol (
        <code>placement=&quot;symbol&quot;</code>), not blended with the glass
        as the symbol is.
      </li>
      <li>
        <strong>Demo:</strong> the count, and naming the button with it (
        <code>aria-label</code>).
      </li>
    </ul>
    <OnAToolbarButton />

    <Heading
      id="on-tabs"
      level={2}
    >
      On tabs
    </Heading>
    <ul>
      <li>
        On a tab’s symbol, as on a button’s: see{' '}
        <a href="tab-bar/composition#badges-on-tabs">Tab bar</a> (collapsed, a
        tab’s badge goes with it).
      </li>
      <li>
        Guide <GuideLink to="section-7-5">§7.5</GuideLink>: an activity badge on
        a tab, not a destination of its own.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const badgeCompositionDemos = [InAListRow, OnAnAvatar, OnAToolbarButton];
