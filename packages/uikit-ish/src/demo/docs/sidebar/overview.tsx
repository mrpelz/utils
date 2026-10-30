import { sfFolderBadgePlus } from '@bradleyhodges/sfsymbols/sfFolderBadgePlus';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
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

  return (
    <Component
      hasInputGuards
      isExpanded
      isInline
      controls={[controlContent, controlColumn, controlContentColumn]}
      id={id}
      log={log}
      stage="tablet"
      state={[stateContent, stateColumn, stateContentColumn]}
      title="Sidebar"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root key={`${keyColumn}-${keyContentColumn}`}>
          {content.background === 'picture' ? (
            <Layout.Background>
              <div
                aria-hidden="true"
                className="sidebar-demo-picture"
              />
            </Layout.Background>
          ) : null}
          <Layout.Column
            aria-label="Sidebar"
            {...propsColumn}
          >
            <Sidebar.Root aria-label="Mailboxes">
              <Sidebar.Toolbar>
                <Button.Root
                  tint="var(--uikit-glass-content)"
                  variant="borderless"
                  onClick={() => addLog('edit')}
                >
                  <Button.Label>Edit</Button.Label>
                </Button.Root>
                <Sidebar.ToolbarGroup>
                  <Button.Root
                    aria-label="New Folder"
                    shape="circle"
                    tint="var(--uikit-glass-content)"
                    variant="borderless"
                    onClick={() => addLog('new folder')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfFolderBadgePlus} />
                    </Button.Icon>
                  </Button.Root>
                  <Button.Root
                    aria-label="Compose"
                    shape="circle"
                    tint="var(--uikit-glass-content)"
                    variant="borderless"
                    onClick={() => addLog('compose')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfSquareAndPencil} />
                    </Button.Icon>
                  </Button.Root>
                </Sidebar.ToolbarGroup>
              </Sidebar.Toolbar>
              <TextField.Root>
                <TextField.Search>
                  <Symbol icon={sfMagnifyingglass} />
                  <TextField.Control
                    aria-label="Search"
                    placeholder="Search"
                    type="search"
                  />
                  <TextField.Clear />
                </TextField.Search>
              </TextField.Root>
              <List.Root listStyle="sidebar">
                {sidebarSections.map(([title, rows]) => (
                  <List.Section key={title}>
                    <List.Header prominence="nested">
                      <List.Title>{title}</List.Title>
                    </List.Header>
                    <List.Group>
                      {rows.map(([value, rowTitle, icon, count]) => (
                        <List.Item
                          key={value}
                          selected={selected === value}
                        >
                          <List.Leading>
                            <List.Image variant="symbol">
                              <Symbol icon={icon} />
                            </List.Image>
                          </List.Leading>
                          <List.Content>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => {
                                addLog(`select: ${value}`);
                                setSelected(value);
                              }}
                            >
                              {rowTitle}
                            </List.Title>
                          </List.Content>
                          <List.Trailing>
                            {count === undefined ? null : (
                              <List.Detail>{count}</List.Detail>
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
              <Viewport.BlockStart>
                <Toolbar.Root
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root
                background={
                  content.pageBackground === 'grouped' ? 'grouped' : 'plain'
                }
                className={
                  content.pageBackground === 'transparent'
                    ? 'sidebar-demo-transparent'
                    : undefined
                }
              >
                <Viewport.Padding edge="block-start" />
                <Header.LargeTitle>
                  <span>{rowTitles[selected]}</span>
                </Header.LargeTitle>

                <List.Root>
                  <List.Section>
                    <List.Group>
                      {Array.from(
                        { length: 12 },
                        (_, index) => `Item ${index + 1}`,
                      ).map((item) => (
                        <List.Item key={item}>
                          <List.Content>
                            <List.Title>{item}</List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding edge="block-end" />
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
        toolbar, a search field and a list, scrolling inside it.
      </li>
      <li>
        Placed by a <a href="layout">Layout</a>: its floating first column
        (regular), or a drawer swiped in (compact).
      </li>
      <li>
        The panel only: its content is a <a href="list">List</a> of style{' '}
        <code>sidebar</code> (capsule rows, the selection) and a{' '}
        <a href="text-field">Text field</a>’s search field. This library’s own;
        no Base UI component.
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
        An app’s top-level sections on a tablet, more of them than a tab bar
        holds, or user-defined (mailboxes, folders, playlists).
      </li>
      <li>
        A hierarchy shown at a glance (nested rows, collapsible sections),
        beside the content it selects.
      </li>
      <li>
        On a phone, the same sidebar as a drawer, or its sections as a stack’s
        root page (see <a href="sidebar/composition">Composition</a>).
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
        A few stable sections, on a phone: a <a href="tab-bar">Tab bar</a>.
      </li>
      <li>
        Drilling into a hierarchy, one level at a time: a{' '}
        <a href="navigation">Navigation</a> (its pages’ lists).
      </li>
      <li>
        Commands rather than places: a <a href="toolbar">Toolbar</a>, a{' '}
        <a href="menu">Menu</a>.
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
        Its parts are plain elements: its props are their attributes (all parts’
        props: <a href="sidebar/parts">Parts</a>).
      </li>
      <li>
        Where it is and how wide: the <a href="layout">Layout</a> column’s (
        <code>floating</code>, <code>defaultSize</code>, <code>resizable</code>,{' '}
        <code>drawer</code>).
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
        ): name it (<code>aria-label</code>), e.g. Mailboxes.
      </li>
      <li>
        The selected row is the current one (<code>aria-current</code>, from the
        list’s <code>selected</code>); rows are pressed by their title’s button.
      </li>
      <li>
        Symbol-only toolbar buttons need a name (<code>aria-label</code>, e.g.
        Compose).
      </li>
      <li>
        As a drawer (compact), closed: hidden and <code>inert</code>. Opened,
        focus isn’t moved into it, and Escape doesn’t close it: the app moves
        focus, and offers a way to close it (a row chosen, or the dimmed content
        pressed).
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
        A glass panel (the menus’ glass), corners 20px, 8px from its column’s
        edges; its content 11px from its top, 16px from its sides, scrolling
        inside it (without a scrollbar).
      </li>
      <li>
        Its toolbar: buttons at its two ends, 54px from the panel’s top to what
        follows; a group’s symbols 18px apart.
      </li>
      <li>
        Its search field 44px high, on the panel’s selection fill; its list’s
        selected and pressed rows on the same fill.
      </li>
      <li>
        Dark: a light rim and a glow outside it (the glass’ inner shadow would
        make the large panel look inset).
      </li>
      <li>
        Sized and placed by its column: floating over the others (regular), the
        content beside it inset (<code>clearFloating</code>); a drawer
        (compact), swiped in from its edge.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sidebarOverviewDemos = [LiveView];
