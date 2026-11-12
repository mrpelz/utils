import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Avatar, List } from '../../../components/index.js';
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
import { photo } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const inListRowsCode = `const photo = '/people/anna-hall.jpg';

<List.Item>
  <List.Leading>
    <List.Image variant="circular">
      <Avatar.Root size={42}>
        {/* Empty alt: the row's title names the person. */}
        <Avatar.Image
          alt=""
          src={photo}
        />
        <Avatar.Fallback>AH</Avatar.Fallback>
      </Avatar.Root>
    </List.Image>
  </List.Leading>
  <List.Content>
    <List.Title render={<button type="button" />}>Anna Hall</List.Title>
  </List.Content>
</List.Item>`;

const aConversationCode = `const photo = '/people/anna-hall.jpg';

<List.Item>
  <List.Leading>
    <List.Image variant="circular">
      {/* Hidden: the row names the conversation and its people. */}
      <Avatar.Group
        aria-hidden="true"
        size={42}
      >
        <Avatar.Root>
          <Avatar.Image
            alt=""
            src={photo}
          />
          <Avatar.Fallback>AH</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>KB</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>
    </List.Image>
  </List.Leading>
  <List.Content>
    <List.Title>Weekend Trip</List.Title>
    <List.Subtitle>Anna Hall, Kate Brown</List.Subtitle>
  </List.Content>
</List.Item>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Contacts' rows: each person's avatar as the row's image. */
const InListRows: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Avatar.Fallback': [],
            'Avatar.Image': ['alt', 'src'],
            'Avatar.Root': ['size'],
            'List.Content': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('avatar-composition-rows') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="avatar"
      controls={[partControls]}
      id="avatar-composition-rows"
      log={log}
      state={[partState]}
      title="Avatars in list rows"
    >
      <List.Root
        {...partProps['List.Root']}
        className="avatar-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  variant="circular"
                >
                  <Avatar.Root
                    {...partProps['Avatar.Root']}
                    size={42}
                  >
                    <Avatar.Image
                      {...partProps['Avatar.Image']}
                      alt=""
                      src={photo(200)}
                    />
                    <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                      AH
                    </Avatar.Fallback>
                  </Avatar.Root>
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button type="button" />}
                  onClick={() => addLog('Anna Hall clicked')}
                >
                  Anna Hall
                </List.Title>
              </List.Content>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  variant="circular"
                >
                  <Avatar.Root
                    {...partProps['Avatar.Root']}
                    size={42}
                  >
                    <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                      KB
                    </Avatar.Fallback>
                  </Avatar.Root>
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button type="button" />}
                  onClick={() => addLog('Kate Brown clicked')}
                >
                  Kate Brown
                </List.Title>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A group conversation's row: its people in one circle. */
const AConversation: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Avatar.Fallback': [],
          'Avatar.Group': ['aria-hidden', 'size'],
          'Avatar.Image': ['alt', 'src'],
          'Avatar.Root': [],
          'List.Content': [],
          'List.Group': [],
          'List.Image': ['variant'],
          'List.Item': [],
          'List.Leading': [],
          'List.Root': ['className'],
          'List.Section': [],
          'List.Subtitle': [],
          'List.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState('avatar-composition-conversation') },
  );
  return (
    <Component
      isCentered
      isInline
      baseUiId="avatar"
      controls={[partControls]}
      id="avatar-composition-conversation"
      state={[partState]}
      title="Avatar group in a conversation"
    >
      <List.Root
        {...partProps['List.Root']}
        className="avatar-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  variant="circular"
                >
                  <Avatar.Group
                    {...partProps['Avatar.Group']}
                    aria-hidden="true"
                    size={42}
                  >
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Image
                        {...partProps['Avatar.Image']}
                        alt=""
                        src={photo(200)}
                      />
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        AH
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root {...partProps['Avatar.Root']}>
                      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                        KB
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </Avatar.Group>
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Weekend Trip
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Anna Hall, Kate Brown
                </List.Subtitle>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

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
        The avatar is a <a href={publicUrl('list')}>List</a> row’s image (
        <PartLink
          component="list"
          part="List.Image"
        />
        , <code>variant=&quot;circular&quot;</code>), sized to fit (
        <code>size={'{42}'}</code>).
      </li>
      <li>
        The photo’s <code>alt</code> is empty, because the row’s title names the
        person.
      </li>
      <li>
        <strong>Library:</strong> the avatar (
        <PartLink
          component="avatar"
          part="Avatar.Root"
        />
        , with its image or initials) as the row’s image (
        <PartLink
          component="list"
          part="List.Image"
        />{' '}
        <code>variant=&quot;circular&quot;</code>), sized by <code>size</code>.
      </li>
      <li>
        <strong>Demo:</strong> the people, their photos and initials.
      </li>
    </ul>
    <CodeView code={inListRowsCode} />
    <InListRows />

    <Heading
      id="a-conversation"
      level={2}
    >
      A conversation
    </Heading>
    <ul>
      <li>
        A group conversation’s people share one circle (
        <PartLink
          component="avatar"
          part="Avatar.Group"
        />
        ) as the row’s image.
      </li>
      <li>
        Here, it’s hidden from assistive technology (<code>aria-hidden</code>),
        because the row names the conversation and its people.
      </li>
      <li>
        <strong>Library:</strong> several avatars in one circle (
        <PartLink
          component="avatar"
          part="Avatar.Group"
        />
        ) as the row’s image.
      </li>
      <li>
        <strong>Demo:</strong> the conversation and its people.
      </li>
    </ul>
    <CodeView code={aConversationCode} />
    <AConversation />

    <Heading
      id="with-a-badge"
      level={2}
    >
      With a badge
    </Heading>
    <ul>
      <li>
        A <a href={publicUrl('badge')}>Badge</a> can sit in the avatar, on its
        top end corner (its default placement). See{' '}
        <a href={publicUrl('badge/composition#on-an-avatar')}>Badge</a>.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const avatarCompositionDemos = [InListRows, AConversation];
