import { FunctionComponent, useMemo } from 'react';

import { Collapsible, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
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
import { collapsibleRootRows } from './docs.js';

/** A list section collapsing by its header (uncontrolled). */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Collapsible.Panel': ['render'],
            'Collapsible.Root': ['defaultOpen', 'onOpenChange', 'render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('collapsible-overview') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="collapsible"
      controls={[partControls]}
      id="collapsible-overview"
      log={log}
      state={[partState]}
      title="Collapsible"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <Collapsible.Root
          {...partProps['Collapsible.Root']}
          defaultOpen
          render={<List.Section {...partProps['List.Section']} />}
          onOpenChange={(isOpen: boolean) =>
            addLog(`open change: ${String(isOpen)}`)
          }
        >
          <Collapsible.Trigger
            {...partProps['Collapsible.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>Advanced</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            {...partProps['Collapsible.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Proxy</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Off</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>DNS</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>
                  Automatic
                </List.Detail>
              </List.Trailing>
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>
      </List.Root>
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

/** `/collapsible`: what it is, when to use it, how it behaves. */
export const CollapsibleOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Content that a trigger shows or hides, opening and closing in place,
        such as a sidebar’s collapsible sections. It’s Base UI’s{' '}
        <code>Collapsible</code>.
      </li>
      <li>
        Its parts render what they collapse and toggle. Here, the root renders a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        , the trigger its{' '}
        <PartLink
          component="list"
          part="List.Header"
        />{' '}
        (with a{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        that turns down), and the panel its{' '}
        <PartLink
          component="list"
          part="List.Group"
        />
        .
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
        For sections people don’t need all the time, such as a sidebar’s Library
        or Collections, or a settings page’s advanced options.
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
        Several sections, with one open at a time: use an{' '}
        <a href={publicUrl('accordion')}>Accordion</a>.
      </li>
      <li>
        Rows among a list group’s rows (for example a picker below its row): use
        the list’s own{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        . It has no elements of its own, as a list group needs.
      </li>
      <li>
        A level deeper, with its own title: use a page you drill into (
        <a href={publicUrl('navigation')}>Navigation</a>).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>
        All its props are on the{' '}
        <a href={publicUrl('collapsible/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Collapsible.Root',
          pickRows(collapsibleRootRows, 'defaultOpen', 'open', 'onOpenChange'),
        ],
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
        Its trigger is a button (<code>aria-expanded</code>,{' '}
        <code>aria-controls</code>). When it renders another element, such as a
        header, it stays a button: with{' '}
        <code>nativeButton=&#123;false&#125;</code>, Base UI gives it the role
        and the keys.
      </li>
      <li>
        While closed, its panel is hidden (or removed), so it’s neither read nor
        focused.
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
        The panel’s height and opacity transition (300ms), like a list’s
        collapsible rows. With reduced motion, they don’t.
      </li>
      <li>
        A{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        in the trigger turns down while open (Base UI’s{' '}
        <code>data-panel-open</code>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const collapsibleOverviewDemos = [LiveView];
