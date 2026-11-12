import { FunctionComponent, useMemo } from 'react';

import { Accordion, List } from '../../../components/index.js';
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
import { accordionItemRows, accordionRootRows } from './docs.js';

/** Mail's accounts, one open at a time (uncontrolled). */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Accordion.Item': ['render', 'value'],
            'Accordion.Panel': ['render'],
            'Accordion.Root': ['defaultValue', 'onValueChange', 'render'],
            'Accordion.Trigger': ['nativeButton', 'render'],
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
    { provided: useProvidedState('accordion-overview') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="accordion"
      controls={[partControls]}
      id="accordion-overview"
      log={log}
      state={[partState]}
      title="Accordion"
    >
      <Accordion.Root
        {...partProps['Accordion.Root']}
        defaultValue={['icloud']}
        render={
          <List.Root
            {...partProps['List.Root']}
            style={{ width: 'min(402px, 100%)' }}
          />
        }
        onValueChange={(value: unknown[]) =>
          addLog(`open: ${JSON.stringify(value)}`)
        }
      >
        <Accordion.Item
          {...partProps['Accordion.Item']}
          render={<List.Section {...partProps['List.Section']} />}
          value="icloud"
        >
          <Accordion.Trigger
            {...partProps['Accordion.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>iCloud</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            {...partProps['Accordion.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Inbox</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>12</List.Detail>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Sent</List.Title>
              </List.Content>
            </List.Item>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          {...partProps['Accordion.Item']}
          render={<List.Section {...partProps['List.Section']} />}
          value="work"
        >
          <Accordion.Trigger
            {...partProps['Accordion.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>Work</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            {...partProps['Accordion.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Inbox</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>3</List.Detail>
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
        Collapsibles of which one is open at a time, unless{' '}
        <code>multiple</code> is set. It’s Base UI’s <code>Accordion</code>.
      </li>
      <li>
        Its parts render what they collapse and toggle. Here, that’s the{' '}
        <a href={publicUrl('list')}>List</a>: its sections are the items, their
        headers the triggers, and their groups the panels.
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
        For sections of which only one matters at a time, such as accounts,
        categories or steps, with the others out of the way.
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
        Sections that collapse independently, as in a sidebar: use a{' '}
        <a href={publicUrl('collapsible')}>Collapsible</a>.
      </li>
      <li>
        Rows among a list group’s rows (for example pickers below their rows,
        one open at a time): use the list’s own{' '}
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />
        . It has no elements of its own, as a list group needs.
      </li>
      <li>
        One of a few views of the same content: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
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
        <a href={publicUrl('accordion/parts')}>Parts</a> page.
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
        <code>aria-controls</code>). When it renders another element, such as a
        header, it stays a button (<code>nativeButton=&#123;false&#125;</code>).
      </li>
      <li>
        Base UI’s{' '}
        <PartLink
          component="accordion"
          part="Accordion.Header"
        />{' '}
        wraps a trigger in a heading (<code>h3</code>). In a list, the header is
        the trigger itself.
      </li>
      <li>
        While closed, a panel is hidden (or removed), so it’s neither read nor
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
        Opening one item closes the other (unless <code>multiple</code> is set),
        and their panels’ height and opacity transition together (300ms). With
        reduced motion, they don’t.
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
