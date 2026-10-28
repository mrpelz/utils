import { FunctionComponent } from 'react';

import { Collapsible, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { collapsibleRootRows } from './docs.js';

/** A list section collapsing by its header (uncontrolled). */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="collapsible"
      id="collapsible-overview"
      log={log}
      title="Collapsible"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <Collapsible.Root
          defaultOpen
          render={<List.Section />}
          onOpenChange={(isOpen: boolean) =>
            addLog(`open change: ${String(isOpen)}`)
          }
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>Advanced</List.Title>
            <List.Disclosure />
          </Collapsible.Trigger>
          <Collapsible.Panel render={<List.Group />}>
            <List.Item>
              <List.Content>
                <List.Title>Proxy</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>Off</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>DNS</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>Automatic</List.Detail>
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
        Content shown or hidden by a trigger, opening and closing in place (Base
        UI’s <code>Collapsible</code>; SwiftUI <code>DisclosureGroup</code>, a
        sidebar’s collapsible sections).
      </li>
      <li>
        Its parts render what they collapse and toggle: here a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        , its{' '}
        <PartLink
          component="list"
          part="List.Header"
        />{' '}
        the trigger (its{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        turning down), its{' '}
        <PartLink
          component="list"
          part="List.Group"
        />{' '}
        the panel.
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
        Sections a person may not need all the time: a sidebar’s Library or
        Collections, a settings page’s advanced options.
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
        Several, one open at a time: an <a href="accordion">Accordion</a>.
      </li>
      <li>
        Rows among a list group’s rows (e.g. a picker below its row): the list’s
        own,{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />{' '}
        (without elements of their own, as a list group needs).
      </li>
      <li>
        A level deeper, with its own title: a page drilled into (
        <a href="navigation">Navigation</a>).
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
        All its props: <a href="collapsible/parts">Parts</a>.
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
        <code>aria-controls</code>): rendering another element (a header), it
        stays one (<code>nativeButton=&#123;false&#125;</code>, Base UI giving
        it the role and keys).
      </li>
      <li>Closed, its panel is hidden (or removed): not read, not focused.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        The panel’s height and opacity transition (300ms), as a list’s
        collapsible rows; without, with reduced motion.
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
