import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Avatar,
  Badge,
  Button,
  List,
  Symbol,
  Toolbar,
} from '../../../components/index.js';
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
import {
  sfBellFill,
  sfEnvelopeFill,
  sfGearshapeFill,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const listRowCode = `<List.Item>
  <List.Leading>…</List.Leading>
  <List.Content>
    <List.Title render={<button type="button" />}>General</List.Title>
  </List.Content>
  <List.Trailing>
    {/* Inline, in the detail, before the chevron. */}
    <List.Detail>
      <Badge placement="inline">1</Badge>
    </List.Detail>
  </List.Trailing>
  <List.Trailing>
    <List.DrillIn />
  </List.Trailing>
</List.Item>`;

const avatarCode = `{/* On its corner (the default), the avatar named with it. */}
<Avatar.Root aria-label="Jane Doe, 3 unread">
  <Avatar.Fallback>JA</Avatar.Fallback>
  <Badge>3</Badge>
</Avatar.Root>
{/* Without a count: a dot, here tinted. */}
<Avatar.Root aria-label="Kate Brown, unread">
  <Avatar.Fallback>KB</Avatar.Fallback>
  <Badge tint="var(--color-ui-system-blue)" />
</Avatar.Root>`;

const toolbarButtonCode = `<Toolbar.Button
  aria-label="Mail, 12 unread"
  shape="circle"
>
  <Button.Icon>
    {/* On the symbol, its child: not blended with the glass. */}
    <Symbol icon={sfEnvelopeFill}>
      <Badge placement="symbol">12</Badge>
    </Symbol>
  </Button.Icon>
</Toolbar.Button>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Settings' rows: a pending update counted in its row. */
const InAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Badge: ['placement'],
            Symbol: ['icon'],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Image': ['style', 'variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('badge-composition-row') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="badge-composition-row"
      log={log}
      state={[partState]}
      title="Badge in a list row"
    >
      <List.Root
        {...partProps['List.Root']}
        className="badge-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-gray)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfGearshapeFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button type="button" />}
                  onClick={() => addLog('general clicked')}
                >
                  General
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>
                  <Badge
                    {...partProps.Badge}
                    placement="inline"
                  >
                    1
                  </Badge>
                </List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-red)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button type="button" />}
                  onClick={() => addLog('notifications clicked')}
                >
                  Notifications
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** People with unread messages: a count, or a dot, on their avatars. */
const OnAnAvatar: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Badge: ['tint'],
          'Avatar.Fallback': [],
          'Avatar.Root': ['aria-label'],
        }),
      [],
    ),
    { provided: useProvidedState('badge-composition-avatar') },
  );
  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="badge-composition-avatar"
      state={[partState]}
      title="Badge on an avatar"
    >
      <div className="badge-demo-row">
        <Avatar.Root
          {...partProps['Avatar.Root']}
          aria-label="Jane Doe, 3 unread"
        >
          <Avatar.Fallback {...partProps['Avatar.Fallback']}>
            JA
          </Avatar.Fallback>
          <Badge {...partProps.Badge}>3</Badge>
        </Avatar.Root>
        <Avatar.Root
          {...partProps['Avatar.Root']}
          aria-label="Kate Brown, unread"
        >
          <Avatar.Fallback {...partProps['Avatar.Fallback']}>
            KB
          </Avatar.Fallback>
          <Badge
            {...partProps.Badge}
            tint="var(--color-ui-system-blue)"
          />
        </Avatar.Root>
      </div>
    </Component>
  );
};

/** A toolbar's symbol button, new mail told on it (and in its name). */
const OnAToolbarButton: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Badge: ['placement'],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('badge-composition-toolbar') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="badge-composition-toolbar"
      log={log}
      state={[partState]}
      title="Badge on a toolbar button"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Toolbar.Title {...partProps['Toolbar.Title']}>
            <span>Home</span>
          </Toolbar.Title>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Mail, 12 unread"
              shape="circle"
              onClick={() => addLog('mail clicked')}
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfEnvelopeFill}
                >
                  <Badge
                    {...partProps.Badge}
                    placement="symbol"
                  >
                    12
                  </Badge>
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
        <a href={publicUrl('list')}>List</a> row’s detail, before its chevron,
        as for a settings app’s pending update.
      </li>
      <li>It’s read with the row: “General, 1”.</li>
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
        <strong>Demo:</strong> the count, and the row it’s on (General).
      </li>
    </ul>
    <CodeView code={listRowCode} />
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
        <a href={publicUrl('avatar')}>Avatar</a> is positioned, and doesn’t clip
        it.
      </li>
      <li>
        Without a count, it’s a dot inside the corner, here tinted (
        <code>tint</code>).
      </li>
      <li>The avatar’s name includes it (“Jane Doe, 3 unread”).</li>
      <li>
        <strong>Library:</strong> the badge on the avatar’s corner, its count or
        dot, and its <code>tint</code>.
      </li>
      <li>
        <strong>Demo:</strong> the count and the person, and naming the avatar
        with it (<code>aria-label</code>).
      </li>
    </ul>
    <CodeView code={avatarCode} />
    <OnAnAvatar />

    <Heading
      id="on-a-toolbar-button"
      level={2}
    >
      On a toolbar button
    </Heading>
    <ul>
      <li>
        On the button’s <a href={publicUrl('symbol')}>Symbol</a> (
        <code>placement=&quot;symbol&quot;</code>, as its child), it’s smaller,
        and isn’t blended with the glass the way the symbol is.
      </li>
      <li>
        The button is named by <code>aria-label</code>, so the name says the
        count too (“Mail, 12 unread”).
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
    <CodeView code={toolbarButtonCode} />
    <OnAToolbarButton />

    <Heading
      id="on-tabs"
      level={2}
    >
      On tabs
    </Heading>
    <ul>
      <li>
        On a tab’s symbol, it works as on a button’s (see{' '}
        <a href={publicUrl('tab-bar/composition#badges-on-tabs')}>Tab Bar</a>).
        When the bar collapses, a tab’s badge goes with its tab.
      </li>
      <li>
        On a tab, a badge shows that there’s activity there. It isn’t a
        destination of its own.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const badgeCompositionDemos = [InAListRow, OnAnAvatar, OnAToolbarButton];
