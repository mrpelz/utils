import { FunctionComponent, useMemo, useState } from 'react';

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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Checkmark': [],
            'List.Content': [],
            'List.Group': [],
            'List.Header': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[...state, partState]}
      title="Layout"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Mailboxes</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <List.Root {...partProps['List.Root']}>
                  {sidebarSections.map(([title, rows]) => (
                    <List.Section
                      key={title}
                      {...partProps['List.Section']}
                    >
                      <List.Header {...partProps['List.Header']}>
                        <List.Title {...partProps['List.Title']}>
                          {title}
                        </List.Title>
                      </List.Header>
                      <List.Group {...partProps['List.Group']}>
                        {rows.map(([value, rowTitle, icon]) => (
                          <List.Item
                            key={value}
                            {...partProps['List.Item']}
                          >
                            <List.Leading {...partProps['List.Leading']}>
                              <List.Image
                                {...partProps['List.Image']}
                                variant="symbol"
                              >
                                <Symbol
                                  {...partProps.Symbol}
                                  icon={icon}
                                />
                              </List.Image>
                            </List.Leading>
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
                                render={<button type="button" />}
                                onClick={() => {
                                  addLog(`select: ${value}`);
                                  setSelected(value);
                                }}
                              >
                                {rowTitle}
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              {selected === value ? (
                                <List.Checkmark
                                  {...partProps['List.Checkmark']}
                                />
                              ) : null}
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  ))}
                </List.Root>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-end"
                />
              </Page.Root>
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {names.map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-end"
                />
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
        Columns side by side, such as a sidebar, a list and a detail view. Each
        one is its own scroll container (put a{' '}
        <a href={publicUrl('page')}>Page</a> in it).
      </li>
      <li>
        A column can have a size, be resizable, or share the free space. One can
        float above the others (a <a href={publicUrl('sidebar')}>Sidebar</a>).
      </li>
      <li>
        On a phone, it’s up to the app: a column can become a{' '}
        <a href={publicUrl('drawer')}>Drawer</a> instead, swiped in from its
        edge.
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
        For a tablet app with a sidebar of sections, a list, and the selected
        item’s detail, as in a mail or notes app.
      </li>
      <li>
        For a list and its detail side by side, with the list resizable or
        fixed.
      </li>
      <li>
        For the same columns on a phone, with the list (or an inspector) as a{' '}
        <a href={publicUrl('drawer')}>Drawer</a> (see{' '}
        <a href={publicUrl('drawer/composition')}>its Composition</a>).
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
        One page at a time, drilled into: use a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>. On a phone, a split’s
        columns become levels of the stack.
      </li>
      <li>
        Something above the page for a moment: use a{' '}
        <a href={publicUrl('sheet')}>Sheet</a> or a{' '}
        <a href={publicUrl('popover')}>Popover</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most layouts set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('layout/parts')}>Parts</a> page.
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
        Its parts are <code>div</code>s without roles. A column gets a landmark
        from its content (a <a href={publicUrl('sidebar')}>Sidebar</a> is a{' '}
        <code>navigation</code>), or from attributes you add.
      </li>
      <li>
        A resizable column’s divider is a focusable <code>separator</code>. It’s
        vertical, and while the column is sized, its value is the column’s size.
        The arrow keys resize it (10px, or 50px with Shift), and Home and End
        jump to its smallest and largest size.
      </li>
      <li>A divider’s focus ring is its 2px line in the tint.</li>
      <li>
        A closed column is <code>inert</code>: out of the tab order, and not
        announced. Its content stays mounted, so its scroll position and state
        survive. The buttons that open and close it are the app’s; give them an{' '}
        <code>aria-label</code> and <code>aria-expanded</code>.
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
        A row of columns that fills its container. Sized columns keep their size
        (between <code>minSize</code>, 240px, and <code>maxSize</code>). The
        others share the free space. A hairline separates them.
      </li>
      <li>
        A resizable column gets a 10px divider over the hairline at its end. It
        shows a 2px line in the tint while dragged or focused.
      </li>
      <li>
        A floating column (on regular widths) sits above the others at the
        start, at its size or 320px. The others span the layout beneath it, and
        the column next to it insets its page’s content by its size.
      </li>
      <li>
        A column can be closed (<code>open</code>, the app’s state): it slides
        out of the layout in 350ms, a floating column off its edge, others at
        their size (their content never squeezed) while the columns beside them
        take their place. A page’s inset glides with it. Closed, it keeps its
        size for when it opens again, and it’s inert and hidden. With reduced
        motion, it happens at once.
      </li>
      <li>
        There’s no handle or trigger part for this. An app has a sidebar or two
        at most, and the button that opens a closed column has to know the
        column is closed, to show only then. So the state belongs to the app: it
        passes <code>open</code> and wires its own buttons, for example one in
        the{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Toolbar"
        />{' '}
        to close it, and one in the content’s bar to open it again (a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />{' '}
        stays put as pages change).
      </li>
      <li>
        Each column is the containing block for its fixed layers. A header’s bar
        (in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ) spans its column, not the screen.
      </li>
      <li>
        Where columns have no background, what’s behind the layout shows, for
        example a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Background"
        />
        .
      </li>
      <li>
        It mirrors in right-to-left languages, including floating columns’ sides
        and the dividers’ keys.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const layoutOverviewDemos = [LiveView];
