import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Page,
  Symbol,
  Toolbar,
  useCreateDrawerHandle,
  useSizeClass,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { codeLabel } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { rowTitles, sidebarSections } from '../sidebar/content.js';
import { names } from '../viewport/content.js';
import {
  layoutColumnRows,
  layoutDrawerRows,
  layoutDrawerSwipeAreaRows,
  layoutRootRows,
} from './docs.js';
import { getPropOptionsGuideColumn, propOptionsGuideRoot } from './props.js';

/**
 * A tablet: a list column (resizable) beside the selected row's page;
 * compact (a phone), the list a drawer's; unset, by the window's size class.
 */
const LiveView: FunctionComponent = () => {
  const id = 'layout-overview';
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  // Its trigger, in the content's bar (outside the drawer).
  const listDrawer = codeLabel(useCreateDrawerHandle(), 'listDrawer');
  const [externalRoot, externalColumn] = useProvidedState(id);
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsGuideRoot,
    'Layout.Root',
    externalRoot,
    true,
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('list', 320, true, addLog),
      [addLog],
    ),
    'Layout.Column (list)',
    externalColumn,
  );
  const sizeClass = useSizeClass();
  // (Unset, by the window's size class.)
  const compact = propsRoot.compact ?? sizeClass === 'compact';

  return (
    <Component
      center
      inline
      controls={[controlRoot, controlColumn]}
      id={id}
      log={log}
      state={[stateRoot, stateColumn]}
      title="Layout"
    >
      <div className={compact ? 'layout-demo-phone' : 'layout-demo-tablet'}>
        <Layout.Root
          {...propsRoot}
          compact={compact}
        >
          <Layout.Drawer
            handle={listDrawer}
            onOpenChange={(next: boolean, { reason }) => {
              addLog(`open: ${String(next)} (${reason})`);
            }}
          >
            <Layout.DrawerSwipeArea />
            <Layout.Column
              key={keyColumn}
              {...propsColumn}
            >
              <Page.Root>
                <Header.Root>
                  <Header.Bar>
                    <Toolbar.Leading />
                    <Toolbar.Title>
                      <span>Mailboxes</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing />
                  </Header.Bar>
                </Header.Root>
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
                            {/* (Chosen: its drawer closes.) */}
                            <List.Title
                              render={<Layout.DrawerClose />}
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
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    {compact ? (
                      <Layout.DrawerTrigger
                        handle={listDrawer}
                        render={
                          <Toolbar.Button
                            aria-label="Mailboxes"
                            shape="circle"
                          />
                        }
                      >
                        <Button.Icon>
                          <Symbol icon={sfListBullet} />
                        </Button.Icon>
                      </Layout.DrawerTrigger>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
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
          </Layout.Column>
        </Layout.Root>
      </div>
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
        Compact (a phone, the app’s choice): drawers swiped in from the edges
        (Base UI’s <code>Drawer</code>).
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
        The same columns on a phone: the list (or an inspector) as a drawer (see{' '}
        <a href="layout/composition">Composition</a>).
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
        ['Layout.Root', pickRows(layoutRootRows, 'compact')],
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
        [
          'Layout.Drawer',
          pickRows(
            layoutDrawerRows,
            'side',
            'defaultOpen',
            'open',
            'onOpenChange',
            'handle',
            'disablePointerDismissal',
          ),
        ],
        [
          'Layout.DrawerSwipeArea',
          pickRows(layoutDrawerSwipeAreaRows, 'width', 'disabled'),
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
      <li>
        A drawer is Base UI’s <code>Drawer</code> (a dialog): opened, focus
        moves into it and stays there (modal); Escape closes it, focus returning
        to its trigger. A closed one is hidden.
      </li>
      <li>
        Swiping a drawer in is a pointer gesture: a{' '}
        <PartLink
          component="layout"
          part="Layout.DrawerTrigger"
        />{' '}
        opens it too (as here, compact).
      </li>
      <li>
        Its drawers’ and dimming’s transitions (300ms) don’t follow{' '}
        <code>prefers-reduced-motion</code>.
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
        Compact: a{' '}
        <PartLink
          component="layout"
          part="Layout.Drawer"
        />
        ’s column over the others at its <code>side</code> (at most 44px short
        of the layout’s width), hidden until opened: swiped in from its{' '}
        <PartLink
          component="layout"
          part="Layout.DrawerSwipeArea"
        />{' '}
        (a strip at its edge, its <code>width</code> 20px; none: not swiped in)
        or by a{' '}
        <PartLink
          component="layout"
          part="Layout.DrawerTrigger"
        />
        ; swiped back, the dimmed content pressed (unless{' '}
        <code>disablePointerDismissal</code>) or a{' '}
        <PartLink
          component="layout"
          part="Layout.DrawerClose"
        />{' '}
        to close. Swiped, it follows the finger; let go past half its width (or
        flung), it switches (Base UI’s rule).
      </li>
      <li>
        Behind it all, a{' '}
        <PartLink
          component="layout"
          part="Layout.Background"
        />{' '}
        of the app’s, where columns have none.
      </li>
      <li>Mirrored right to left (drawers’ sides, dividers’ keys).</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const layoutOverviewDemos = [LiveView];
