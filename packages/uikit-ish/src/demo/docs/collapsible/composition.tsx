import { FunctionComponent, useState } from 'react';

import {
  Collapsible,
  Header,
  Layout,
  List,
  Page,
  Sidebar,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

/** A sidebar's sections (Music's), each collapsing by its title. */
const SidebarSections: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('Recently Added');
  const select = (title: string) => {
    addLog(`select: ${title}`);
    setSelected(title);
  };

  return (
    <Component
      isExpanded
      isInline
      id="collapsible-composition-sidebar"
      log={log}
      stage="tablet"
      title="Collapsible sidebar sections"
    >
      <Viewport.Content>
        <Layout.Root>
          <Layout.Column
            floating
            aria-label="Sidebar"
            defaultSize={300}
          >
            <Sidebar.Root aria-label="Music">
              <List.Root listStyle="sidebar">
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                  onOpenChange={(isOpen: boolean) =>
                    addLog(`library: ${isOpen ? 'open' : 'closed'}`)
                  }
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Library</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    <List.Item selected={selected === 'Recently Added'}>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => select('Recently Added')}
                        >
                          Recently Added
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item selected={selected === 'Artists'}>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => select('Artists')}
                        >
                          Artists
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item selected={selected === 'Albums'}>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => select('Albums')}
                        >
                          Albums
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                  onOpenChange={(isOpen: boolean) =>
                    addLog(`playlists: ${isOpen ? 'open' : 'closed'}`)
                  }
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Playlists</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    <List.Item selected={selected === 'Favorites'}>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => select('Favorites')}
                        >
                          Favorites
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item selected={selected === 'Road Trip'}>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => select('Road Trip')}
                        >
                          Road Trip
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>{selected}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <Header.LargeTitle>
                  <span>{selected}</span>
                </Header.LargeTitle>
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
  ['sidebar-sections', 'Sidebar sections'],
  ['rows-in-a-list-group', 'Rows in a list group'],
];

/** `/collapsible/composition`: collapsibles in lists. */
export const CollapsibleComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="sidebar-sections"
      level={2}
    >
      Sidebar sections
    </Heading>
    <ul>
      <li>
        As Music’s sidebar (a{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />
        ): each section collapses by its title, its chevron turning down while
        open, the sections below moving up.
      </li>
      <li>
        Each section is a collapsible: its root a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        , its trigger the section’s{' '}
        <PartLink
          component="list"
          part="List.Header"
        />
        , its panel the{' '}
        <PartLink
          component="list"
          part="List.Group"
        />
        .
      </li>
      <li>
        <strong>Library:</strong> the collapsibles (
        <PartLink
          component="collapsible"
          part="Collapsible.Root"
        />
        ,{' '}
        <PartLink
          component="collapsible"
          part="Collapsible.Trigger"
        />
        ,{' '}
        <PartLink
          component="collapsible"
          part="Collapsible.Panel"
        />
        ), the sidebar (
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />
        , its list <code>listStyle=&quot;sidebar&quot;</code>) and the chevrons
        (
        <PartLink
          component="list"
          part="List.Disclosure"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the sections, their rows, the selection and the
        page it picks.
      </li>
    </ul>
    <SidebarSections />

    <Heading
      id="rows-in-a-list-group"
      level={2}
    >
      Rows in a list group
    </Heading>
    <ul>
      <li>
        Rows opening among a group’s rows (e.g. a picker below its row) can’t be
        a Collapsible: its parts render elements, a group’s rows must stay its
        children.
      </li>
      <li>
        The list’s own, without elements:{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />{' '}
        (its{' '}
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ), the same props; see{' '}
        <a href="list/composition#rows-expanding-together">
          List: Rows expanding together
        </a>
        .
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const collapsibleCompositionDemos = [SidebarSections];
