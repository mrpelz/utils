import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Avatar } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
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
  const [control, content, state] = usePropControl(propOptionsOverview, {
    external,
    isOpen: true,
    title: '[content]',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Avatar.Fallback': [],
          'Avatar.Group': ['aria-label'],
          'Avatar.Image': ['alt', 'src'],
          'Avatar.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="avatar"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Avatar"
    >
      {content.people === 1 ? (
        <Avatar.Root {...partProps['Avatar.Root']}>
          {content.image ? (
            <Avatar.Image
              {...partProps['Avatar.Image']}
              alt="Anna Hall"
              src={photo(200)}
            />
          ) : null}
          <Avatar.Fallback {...partProps['Avatar.Fallback']}>
            AH
          </Avatar.Fallback>
        </Avatar.Root>
      ) : (
        <Avatar.Group
          {...partProps['Avatar.Group']}
          aria-label="Weekend Trip"
        >
          <Avatar.Root {...partProps['Avatar.Root']}>
            {content.image ? (
              <Avatar.Image
                {...partProps['Avatar.Image']}
                alt="Anna Hall"
                src={photo(200)}
              />
            ) : null}
            <Avatar.Fallback {...partProps['Avatar.Fallback']}>
              AH
            </Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root {...partProps['Avatar.Root']}>
            {content.image ? (
              <Avatar.Image
                {...partProps['Avatar.Image']}
                alt="Kate Brown"
                src={photo(290)}
              />
            ) : null}
            <Avatar.Fallback {...partProps['Avatar.Fallback']}>
              KB
            </Avatar.Fallback>
          </Avatar.Root>
          {content.people === 3 ? (
            <Avatar.Root {...partProps['Avatar.Root']}>
              <Avatar.Fallback {...partProps['Avatar.Fallback']}>
                JA
              </Avatar.Fallback>
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
        A person: their photo in a circle, or their initials when there’s no
        photo. It’s Base UI’s <code>Avatar</code>.
      </li>
      <li>Several people can share one circle, as for a conversation.</li>
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
        For showing who: a contact, a message’s sender, a conversation’s people,
        or an account.
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
        A thing, not a person (an app, a setting): use a{' '}
        <a href={publicUrl('symbol')}>Symbol</a> in a row’s image.
      </li>
      <li>A picture of the content: use an image.</li>
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
        All props of all parts are on the{' '}
        <a href={publicUrl('avatar/parts')}>Parts</a> page.
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
        The photo’s <code>alt</code> is the person’s name, or empty when their
        name is right next to it (in a row’s title).
      </li>
      <li>
        The initials are text, and are read as such. Where they stand alone,
        name the avatar with <code>aria-label</code>.
      </li>
      <li>
        A group has the <code>group</code> role. Name it with{' '}
        <code>aria-label</code>, for example after the conversation.
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
        It shows the photo once it has loaded. Until then, or if it fails, it
        shows the fallback (Base UI’s).
      </li>
      <li>
        It’s 70px by default (<code>size</code>), with the initials at 40% of
        that, semibold, white on a gray gradient.
      </li>
      <li>
        In a group, the first person is large at the top start, the second
        smaller at the bottom end, and a third at the top end. More aren’t shown
        (see{' '}
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
