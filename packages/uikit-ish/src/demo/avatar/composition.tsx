import './style.css';

import { FunctionComponent } from 'react';

import { Avatar, List } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { Contents, Heading, type Section } from '../guide/sections.js';
import { photo } from './props.js';

/** Contacts' rows: each person's avatar as the row's image. */
const InListRows: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      baseUiId="avatar"
      id="avatar-composition-rows"
      log={log}
      title="Avatars in list rows"
    >
      <List.Root className="avatar-demo-list">
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Image variant="circular">
                <Avatar.Root size={42}>
                  <Avatar.Image
                    alt=""
                    src={photo(200)}
                  />
                  <Avatar.Fallback>AH</Avatar.Fallback>
                </Avatar.Root>
              </List.Image>
              <List.Title
                render={<button type="button" />}
                onClick={() => addLog('Anna Haro clicked')}
              >
                Anna Haro
              </List.Title>
            </List.Item>
            <List.Item>
              <List.Image variant="circular">
                <Avatar.Root size={42}>
                  <Avatar.Fallback>KB</Avatar.Fallback>
                </Avatar.Root>
              </List.Image>
              <List.Title
                render={<button type="button" />}
                onClick={() => addLog('Kate Bell clicked')}
              >
                Kate Bell
              </List.Title>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A group conversation's row: its people in one circle. */
const AConversation: FunctionComponent = () => (
  <Component
    center
    inline
    baseUiId="avatar"
    id="avatar-composition-conversation"
    title="Avatar group in a conversation"
  >
    <List.Root className="avatar-demo-list">
      <List.Section>
        <List.Group>
          <List.Item>
            <List.Image variant="circular">
              <Avatar.Group
                aria-hidden="true"
                size={42}
              >
                <Avatar.Root>
                  <Avatar.Image
                    alt=""
                    src={photo(200)}
                  />
                  <Avatar.Fallback>AH</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root>
                  <Avatar.Fallback>KB</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Group>
            </List.Image>
            <List.Title>Weekend Trip</List.Title>
            <List.Subtitle>Anna Haro, Kate Bell</List.Subtitle>
          </List.Item>
        </List.Group>
      </List.Section>
    </List.Root>
  </Component>
);

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-list-rows', 'In list rows'],
  ['a-conversation', 'A conversation'],
  ['with-a-badge', 'With a badge'],
];

/** `/avatar/composition`: avatars with other components. */
export const AvatarComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="in-list-rows"
      level={2}
    >
      In list rows
    </Heading>
    <ul>
      <li>
        A <a href="list">List</a> row’s image (<code>List.Image</code>,{' '}
        <code>variant=&quot;circular&quot;</code>), the avatar its size (
        <code>size={'{42}'}</code>).
      </li>
      <li>
        The photo’s <code>alt</code> empty: the row’s title names the person.
      </li>
    </ul>
    <InListRows />

    <Heading
      id="a-conversation"
      level={2}
    >
      A conversation
    </Heading>
    <ul>
      <li>
        A group conversation’s people in one circle (<code>Avatar.Group</code>),
        as the row’s image.
      </li>
      <li>
        Hidden from assistive technology here (<code>aria-hidden</code>): the
        row names the conversation and its people.
      </li>
    </ul>
    <AConversation />

    <Heading
      id="with-a-badge"
      level={2}
    >
      With a badge
    </Heading>
    <ul>
      <li>
        A <a href="badge">Badge</a> in the avatar, on its top end corner (its
        default placement): see{' '}
        <a href="badge/composition#on-an-avatar">Badge</a>.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const avatarCompositionDemos = [InListRows, AConversation];
