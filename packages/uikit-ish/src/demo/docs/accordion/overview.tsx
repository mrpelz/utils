import { FunctionComponent } from 'react';

import { Accordion, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { accordionItemRows, accordionRootRows } from './docs.js';

/** Mail's accounts, one open at a time (uncontrolled). */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="accordion"
      id="accordion-overview"
      log={log}
      title="Accordion"
    >
      <Accordion.Root
        defaultValue={['icloud']}
        render={<List.Root style={{ width: 'min(402px, 100%)' }} />}
        onValueChange={(value: unknown[]) =>
          addLog(`open: ${JSON.stringify(value)}`)
        }
      >
        <Accordion.Item
          render={<List.Section />}
          value="icloud"
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>iCloud</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel render={<List.Group />}>
            <List.Item>
              <List.Content>
                <List.Title>Inbox</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>12</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>Sent</List.Title>
              </List.Content>
            </List.Item>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          render={<List.Section />}
          value="work"
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>Work</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel render={<List.Group />}>
            <List.Item>
              <List.Content>
                <List.Title>Inbox</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>3</List.Detail>
              </List.Trailing>
            </List.Item>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
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

/** `/accordion`: what it is, when to use it, how it behaves. */
export const AccordionOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Collapsibles, one open at a time (unless <code>multiple</code>): Base
        UI’s <code>Accordion</code>.
      </li>
      <li>
        Its parts render what they collapse and toggle: here the{' '}
        <a href="list">List</a>, its sections (items), their headers (triggers),
        their groups (panels).
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
        Sections of which one matters at a time: accounts, categories, steps;
        the others out of the way.
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
        Sections collapsing on their own: <a href="collapsible">Collapsible</a>{' '}
        (a sidebar’s).
      </li>
      <li>
        Rows among a list group’s rows (e.g. pickers below their rows, one open
        at a time): the list’s own,{' '}
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />{' '}
        (without elements of their own, as a list group needs).
      </li>
      <li>
        One of a few views of the same content:{' '}
        <a href="segmented">Segmented</a>.
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
        All its props: <a href="accordion/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Accordion.Root',
          pickRows(
            accordionRootRows,
            'defaultValue',
            'value',
            'onValueChange',
            'multiple',
          ),
        ],
        ['Accordion.Item', pickRows(accordionItemRows, 'value')],
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
        Each trigger is a button (<code>aria-expanded</code>,{' '}
        <code>aria-controls</code>): rendering another element (a header), it
        stays one (<code>nativeButton=&#123;false&#125;</code>).
      </li>
      <li>
        Base UI’s{' '}
        <PartLink
          component="accordion"
          part="Accordion.Header"
        />{' '}
        wraps a trigger in a heading (<code>h3</code>); in a list, the header is
        the trigger itself.
      </li>
      <li>Closed, a panel is hidden (or removed): not read, not focused.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        Opening one closes the other (unless <code>multiple</code>), their
        panels’ height and opacity transitioning together (300ms); without, with
        reduced motion.
      </li>
      <li>
        A{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        in a trigger turns down while open.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const accordionOverviewDemos = [LiveView];
