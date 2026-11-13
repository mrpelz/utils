import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Page,
  Sidebar,
  Symbol,
  TextField,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
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
import {
  sfFolderBadgePlus,
  sfMagnifyingglass,
  sfSquareAndPencil,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { rowTitles, sidebarSections } from './content.js';
import { sidebarRootRows, sidebarToolbarRows } from './docs.js';
import {
  getPropOptionsSidebarColumn,
  propOptionsContent,
  propOptionsContentColumn,
} from './props.js';

/**
 * A tablet: the sidebar floating in a layout's first column, its selected
 * row's page beside it.
 */
const LiveView: FunctionComponent = () => {
  const id = 'sidebar-overview';
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  const [externalContent, externalColumn, externalContentColumn] =
    useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(() => getPropOptionsSidebarColumn(addLog), [addLog]),
    { external: externalColumn, title: 'Layout.Column (sidebar)' },
  );
  const [
    controlContentColumn,
    propsContentColumn,
    stateContentColumn,
    keyContentColumn,
  ] = usePropControl(propOptionsContentColumn, {
    external: externalContentColumn,
    title: 'Layout.Column (content)',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': [
              'aria-label',
              'onClick',
              'shape',
              'tint',
              'variant',
            ],
            'Header.LargeTitle': [],
            'Layout.Root': ['between', 'hideSeparators', 'line', 'no', 'the'],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': ['background', 'className'],
            'Sidebar.Root': ['aria-label'],
            'Sidebar.Toolbar': [],
            'Sidebar.ToolbarGroup': [],
            'TextField.Clear': [],
            'TextField.Control': ['aria-label', 'placeholder', 'type'],
            'TextField.Frame': [],
            'TextField.Root': [],
            'Toolbar.Root': ['context', 'placement'],
            'Toolbar.Title': [],
            'Viewport.Background': [],
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
      hasInputGuards
      isExpanded
      isInline
      id={id}
      log={log}
      stage="tablet"
      state={[stateContent, stateColumn, stateContentColumn, partState]}
      title="Sidebar"
      controls={[
        controlContent,
        controlColumn,
        controlContentColumn,
        partControls,
      ]}
    >
      {content.background === 'picture' ? (
        <Viewport.Background {...partProps['Viewport.Background']}>
          <div
            aria-hidden="true"
            className="demo-picture"
          />
        </Viewport.Background>
      ) : null}
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root
          key={`${keyColumn}-${keyContentColumn}`}
          {...partProps['Layout.Root']}
          // (On the picture: no line between the columns.)
          hideSeparators={content.background === 'picture'}
        >
          <Layout.Column
            aria-label="Sidebar"
            {...propsColumn}
          >
            <Sidebar.Root
              {...partProps['Sidebar.Root']}
              aria-label="Mailboxes"
            >
              <Sidebar.Toolbar {...partProps['Sidebar.Toolbar']}>
                <Button.Root
                  {...partProps['Button.Root']}
                  tint="var(--uikit-glass-content)"
                  variant="borderless"
                  onClick={() => addLog('edit')}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Edit
                  </Button.Label>
                </Button.Root>
                <Sidebar.ToolbarGroup {...partProps['Sidebar.ToolbarGroup']}>
                  <Button.Root
                    {...partProps['Button.Root']}
                    aria-label="New Folder"
                    shape="circle"
                    tint="var(--uikit-glass-content)"
                    variant="borderless"
                    onClick={() => addLog('new folder')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolderBadgePlus}
                      />
                    </Button.Icon>
                  </Button.Root>
                  <Button.Root
                    {...partProps['Button.Root']}
                    aria-label="Compose"
                    shape="circle"
                    tint="var(--uikit-glass-content)"
                    variant="borderless"
                    onClick={() => addLog('compose')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndPencil}
                      />
                    </Button.Icon>
                  </Button.Root>
                </Sidebar.ToolbarGroup>
              </Sidebar.Toolbar>
              <TextField.Root {...partProps['TextField.Root']}>
                <TextField.Frame {...partProps['TextField.Frame']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfMagnifyingglass}
                  />
                  <TextField.Control
                    {...partProps['TextField.Control']}
                    aria-label="Search"
                    placeholder="Search"
                    type="search"
                  />
                  <TextField.Clear {...partProps['TextField.Clear']} />
                </TextField.Frame>
              </TextField.Root>
              <List.Root
                {...partProps['List.Root']}
                listStyle="sidebar"
              >
                {sidebarSections.map(([title, rows]) => (
                  <List.Section
                    key={title}
                    {...partProps['List.Section']}
                  >
                    <List.Header
                      {...partProps['List.Header']}
                      prominence="nested"
                    >
                      <List.Title {...partProps['List.Title']}>
                        {title}
                      </List.Title>
                    </List.Header>
                    <List.Group {...partProps['List.Group']}>
                      {rows.map(([value, rowTitle, icon, count]) => (
                        <List.Item
                          key={value}
                          {...partProps['List.Item']}
                          selected={selected === value}
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
                            {count === undefined ? null : (
                              <List.Detail {...partProps['List.Detail']}>
                                {count}
                              </List.Detail>
                            )}
                          </List.Trailing>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                ))}
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column {...propsContentColumn}>
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root
                {...partProps['Page.Root']}
                background={
                  content.pageBackground === 'grouped' ? 'grouped' : 'plain'
                }
                className={
                  content.pageBackground === 'transparent'
                    ? 'sidebar-demo-transparent'
                    : undefined
                }
              >
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>{rowTitles[selected]}</span>
                </Header.LargeTitle>

                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {Array.from(
                        { length: 12 },
                        (_, index) => `Item ${index + 1}`,
                      ).map((item) => (
                        <List.Item
                          key={item}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {item}
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

/** `/sidebar`: what a sidebar is for, and its props. */
export const SidebarOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        An app’s sections in a floating glass panel at its leading edge: a
        toolbar, a search field and a list, scrolling inside the panel.
      </li>
      <li>
        A <a href={publicUrl('layout')}>Layout</a> places it, as its floating
        first column on regular widths, or as a drawer swiped in on compact
        ones.
      </li>
      <li>
        It’s only the panel. Its content is a{' '}
        <a href={publicUrl('list')}>List</a> with the <code>sidebar</code> style
        (capsule rows, the selection) and a{' '}
        <a href={publicUrl('text-field')}>Text Field</a>’s search field. It’s
        the library’s own component, not built on Base UI.
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
        For an app’s top-level sections on a tablet, when there are more than a
        tab bar holds, or when the user defines them (mailboxes, folders,
        playlists).
      </li>
      <li>
        For a hierarchy shown at a glance (nested rows, collapsible sections),
        next to the content it selects.
      </li>
      <li>
        On a phone, the same sidebar can be a drawer, or its sections can be a
        stack’s root page (see{' '}
        <a href={publicUrl('sidebar/composition')}>Composition</a>).
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
        A few stable sections on a phone: use a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a>.
      </li>
      <li>
        Drilling into a hierarchy one level at a time: use a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>, with lists on its
        pages.
      </li>
      <li>
        Commands rather than places: use a{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a> or a{' '}
        <a href={publicUrl('menu')}>Menu</a>.
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
        Its parts are plain elements, so their props are their attributes. All
        props of all parts are on the{' '}
        <a href={publicUrl('sidebar/parts')}>Parts</a> page.
      </li>
      <li>
        Its place and width come from the{' '}
        <a href={publicUrl('layout')}>Layout</a> column (<code>floating</code>,{' '}
        <code>defaultSize</code>, <code>resizable</code>, <code>drawer</code>).
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Sidebar.Root', pickRows(sidebarRootRows, 'children', 'aria-label')],
        ['Sidebar.Toolbar', pickRows(sidebarToolbarRows, 'children')],
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
        The panel is a <code>navigation</code> landmark (<code>{'<nav>'}</code>
        ). Give it a name with <code>aria-label</code>, for example Mailboxes.
      </li>
      <li>
        The selected row is marked as the current one (<code>aria-current</code>
        , from the list’s <code>selected</code>). Rows are pressed through their
        title’s button.
      </li>
      <li>
        Toolbar buttons with only a symbol need a name (<code>aria-label</code>,
        for example Compose).
      </li>
      <li>
        As a closed drawer (compact), it’s hidden and <code>inert</code>. When
        opened, focus doesn’t move into it, and Escape doesn’t close it. The app
        moves focus, and offers a way to close it, such as choosing a row or
        pressing the dimmed content.
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
        A glass panel (the same glass as menus) with 20px corners, 10px from its
        column’s sides. Its top sits at the top inset, level with the top of a
        page’s back button. At a regular width, its bottom is 8px from the
        screen’s edge, level with an <a href={publicUrl('island')}>Island</a>’s,
        and its sides are 8px in as well. Otherwise, it reaches 5px into the
        bottom inset. Its content sits 11px from its top and 16px from its
        sides, and scrolls inside it without a scrollbar.
      </li>
      <li>
        Its toolbar has buttons at both ends, with 54px from the panel’s top to
        what follows. A group’s symbols are 18px apart.
      </li>
      <li>
        Holding a{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />{' '}
        and a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        , it stops scrolling itself: its toolbar stays at its top in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        , exactly where it was, and its page scrolls beneath it to the panel’s
        edges. The panel is the bar’s screen, and its padding becomes the page’s
        insets. Content fades out under the toolbar, as in a{' '}
        <a href={publicUrl('popover')}>Popover</a>, instead of a blur over the
        glass. See{' '}
        <a href={publicUrl('sidebar/composition#hiding-the-sidebar')}>
          Hiding the sidebar
        </a>
        .
      </li>
      <li>
        Its search field is 44px high, on the panel’s selection fill. Its list’s
        selected and pressed rows use the same fill.
      </li>
      <li>
        In dark mode, it has a light rim and a glow outside it, like an{' '}
        <a href={publicUrl('island')}>Island</a> and a medium{' '}
        <a href={publicUrl('sheet')}>Sheet</a>. The glass’s usual inner shadow
        would make such a large panel look inset.
      </li>
      <li>
        Its column sizes and places it: floating above the others on regular
        widths, with the content beside it inset (<code>clearFloating</code>),
        or as a drawer swiped in from its edge on compact widths.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sidebarOverviewDemos = [LiveView];
