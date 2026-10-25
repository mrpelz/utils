import { FunctionComponent, useState } from 'react';

import {
  Header,
  Layout,
  List,
  Page,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { rowTitles, sidebarSections } from '../sidebar/content.js';
import { names } from '../viewport/content.js';
import { layoutColumnRows, layoutRootRows } from './docs.js';
import { useLayoutControls } from './props.js';

/** A tablet: the mailboxes (resizable) beside the selected mailbox's page. */
const LiveView: FunctionComponent = () => {
  const id = 'layout-overview';
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  const {
    controls,
    keyFirst,
    keySecond,
    propsFirst,
    propsRoot,
    propsSecond,
    state,
  } = useLayoutControls(id, addLog, {
    columns: [
      ['mailboxes', 320, true],
      ['mailbox', undefined, false],
    ],
  });

  return (
    <Component
      isExpanded
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="tablet"
      state={state}
      title="Layout"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>Mailboxes</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <List.Root>
                  {sidebarSections.map(([title, rows]) => (
                    <List.Section key={title}>
                      <List.Header>
                        <List.Title>{title}</List.Title>
                      </List.Header>
                      <List.Group>
                        {rows.map(([value, rowTitle, icon]) => (
                          <List.Item key={value}>
                            <List.Image variant="symbol">
                              <Symbol icon={icon} />
                            </List.Image>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => {
                                addLog(`select: ${value}`);
                                setSelected(value);
                              }}
                            >
                              {rowTitle}
                            </List.Title>
                            {selected === value ? <List.Checkmark /> : null}
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  ))}
                </List.Root>
              </Page.Root>
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Header.Root>
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
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

/** `/layout`: what a layout is for, and its props. */
export const LayoutOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Columns side by side (UIKit <code>UISplitViewController</code>, iPadOS’
        columns): a sidebar, a list, a detail; each its own scroll container (a{' '}
        <a href="page">Page</a> in it).
      </li>
      <li>
        Sized, resizable, or sharing the free space; one may float over the
        others (a <a href="sidebar">Sidebar</a>).
      </li>
      <li>
        On a phone, the app’s choice: a column as a <a href="drawer">Drawer</a>{' '}
        instead, swiped in from its edge.
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
        A tablet’s app: a sidebar of sections, a list, the selected item’s
        detail (Mail, Notes, Files).
      </li>
      <li>
        A list and its detail side by side, the list resizable (or fixed, as
        iPadOS’).
      </li>
      <li>
        The same columns on a phone: the list (or an inspector) as a{' '}
        <a href="drawer">Drawer</a> (see{' '}
        <a href="drawer/composition">its Composition</a>).
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
        One page at a time, drilled into: a <a href="navigation">Navigation</a>{' '}
        (on a phone, a split’s columns as stack levels).
      </li>
      <li>
        Something over the page for a moment: a <a href="sheet">Sheet</a>, a{' '}
        <a href="popover">Popover</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most layouts set, across their parts.</li>
      <li>
        All parts’ props: <a href="layout/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Layout.Root', pickRows(layoutRootRows, 'children')],
        [
          'Layout.Column',
          pickRows(
            layoutColumnRows,
            'defaultSize',
            'resizable',
            'floating',
            'clearFloating',
          ),
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
        Its parts are <code>div</code>s without roles: a column’s landmark, if
        wanted, by its content (a <a href="sidebar">Sidebar</a> is a{' '}
        <code>navigation</code>) or its attributes.
      </li>
      <li>
        A resizable column’s divider is a focusable <code>separator</code>{' '}
        (vertical, its value the column’s size while sized): the arrow keys
        resize it (10px; Shift: 50px), Home and End to its smallest and largest.
      </li>
      <li>A divider’s focus ring is its 2px line in the tint.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        A row of columns filling its container: sized ones at their size
        (between <code>minSize</code>, 240px, and <code>maxSize</code>), the
        others sharing the free space; a hairline between them.
      </li>
      <li>
        Resizable: a 10px divider over the hairline at its end, a 2px line in
        the tint while dragged or focused.
      </li>
      <li>
        Floating (regular): over the others at the start (its size, or 320px),
        which span the layout beneath it; the column clear of it insets its
        page’s content by its size.
      </li>
      <li>
        Each column the containing block of its fixed layers: a header’s bar (in
        a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ) spans its column.
      </li>
      <li>
        Behind it all, a{' '}
        <PartLink
          component="layout"
          part="Layout.Background"
        />{' '}
        of the app’s, where columns have none.
      </li>
      <li>Mirrored right to left (floating columns’ sides, dividers’ keys).</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const layoutOverviewDemos = [LiveView];
