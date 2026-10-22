import './style.css';

import { FunctionComponent } from 'react';

import { Avatar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import {
  avatarFallbackRows,
  avatarGroupRows,
  avatarImageRows,
  avatarRootRows,
} from './docs.js';
import { photo, propOptionsOverview } from './props.js';

/** A person (a photo, or initials), or several in one circle. */
const LiveView: FunctionComponent = () => {
  const id = 'avatar-overview';
  const [external] = useProvidedState(id);
  const [control, content, state] = usePropControl(
    propOptionsOverview,
    '[content]',
    external,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="avatar"
      controls={[control]}
      id={id}
      state={[state]}
      title="Avatar"
    >
      {content.people === 1 ? (
        <Avatar.Root>
          {content.image ? (
            <Avatar.Image
              alt="Anna Haro"
              src={photo(200)}
            />
          ) : null}
          <Avatar.Fallback>AH</Avatar.Fallback>
        </Avatar.Root>
      ) : (
        <Avatar.Group aria-label="Weekend Trip">
          <Avatar.Root>
            {content.image ? (
              <Avatar.Image
                alt="Anna Haro"
                src={photo(200)}
              />
            ) : null}
            <Avatar.Fallback>AH</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root>
            {content.image ? (
              <Avatar.Image
                alt="Kate Bell"
                src={photo(290)}
              />
            ) : null}
            <Avatar.Fallback>KB</Avatar.Fallback>
          </Avatar.Root>
          {content.people === 3 ? (
            <Avatar.Root>
              <Avatar.Fallback>JA</Avatar.Fallback>
            </Avatar.Root>
          ) : null}
        </Avatar.Group>
      )}
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

/** `/avatar`: what an avatar is for, and its props. */
export const AvatarOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A person: their photo in a circle, or, without one, their initials (Base
        UI’s <code>Avatar</code>; Figma “Contact”).
      </li>
      <li>Several people in one circle (Figma “Group”): a conversation’s.</li>
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
        Showing who: a contact, a message’s sender, a conversation’s people, an
        account.
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
        A thing, not a person (an app, a setting): a <a href="symbol">Symbol</a>{' '}
        in a row’s image.
      </li>
      <li>A picture of the content: an image.</li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most avatars set.</li>
      <li>
        All parts’ props: <a href="avatar/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Avatar.Root', pickRows(avatarRootRows, 'size')],
        ['Avatar.Image', pickRows(avatarImageRows, 'src', 'alt')],
        ['Avatar.Fallback', pickRows(avatarFallbackRows, 'children')],
        ['Avatar.Group', pickRows(avatarGroupRows, 'aria-label')],
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
        The photo’s <code>alt</code>: the person’s name, or empty beside their
        name (a row’s title).
      </li>
      <li>
        The initials are text, read as such: name the avatar (
        <code>aria-label</code>) where its initials stand alone.
      </li>
      <li>
        A group has the <code>group</code> role: name it (
        <code>aria-label</code>, e.g. the conversation).
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
        The photo once it has loaded; until then, or if it fails, the fallback
        (Base UI’s).
      </li>
      <li>
        70px by default (<code>size</code>), the initials 40% of it, semibold,
        white on iOS contacts’ gray.
      </li>
      <li>
        In a group: the first person large at the top start, the second smaller
        at the bottom end, a third at the top end; more aren’t shown (see{' '}
        <PartLink
          component="avatar"
          part="Avatar.Group"
        />
        ).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const avatarOverviewDemos = [LiveView];
