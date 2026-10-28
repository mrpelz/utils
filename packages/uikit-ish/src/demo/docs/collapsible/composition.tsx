import { FunctionComponent } from 'react';

import { Collapsible, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

/** A sidebar's sections, each collapsing by its title. */
const SidebarSections: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="collapsible-composition-sidebar"
      log={log}
      title="Collapsible sidebar sections"
    >
      <List.Root
        listStyle="sidebar"
        style={{ width: 'min(320px, 100%)' }}
      >
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
            <List.Item>
              <List.Content>
                <List.Title>Recently Added</List.Title>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>Artists</List.Title>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>Albums</List.Title>
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
            <List.Item>
              <List.Content>
                <List.Title>Favorites</List.Title>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>Road Trip</List.Title>
              </List.Content>
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>
      </List.Root>
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
        As Music’s sidebar: each section collapses by its title, its chevron
        turning down while open, the sections below moving up.
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
        ), the sidebar list (<a href="list">List</a>{' '}
        <code>listStyle=&quot;sidebar&quot;</code>) and the chevrons (
        <PartLink
          component="list"
          part="List.Disclosure"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the sections and their rows.
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
