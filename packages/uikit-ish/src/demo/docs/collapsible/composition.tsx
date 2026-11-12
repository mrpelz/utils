import { FunctionComponent, useMemo, useState } from 'react';

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
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const sidebarSectionsCode = `<Sidebar.Root aria-label="Music">
  <List.Root listStyle="sidebar">
    <Collapsible.Root
      defaultOpen
      render={<List.Section />}
    >
      <Collapsible.Trigger
        nativeButton={false}
        render={<List.Header prominence="nested" />}
      >
        <List.Title>Library</List.Title>
        <List.Disclosure />
      </Collapsible.Trigger>
      <Collapsible.Panel render={<List.Group />}>
        <List.Item selected>
          <List.Content>
            <List.Title render={<button type="button" />}>
              Recently Added
            </List.Title>
          </List.Content>
        </List.Item>
        …
      </Collapsible.Panel>
    </Collapsible.Root>
    <Collapsible.Root
      defaultOpen
      render={<List.Section />}
    >
      …
    </Collapsible.Root>
  </List.Root>
</Sidebar.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A sidebar's sections (a music app's), each collapsing by its title. */
const SidebarSections: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('Recently Added');
  const select = (title: string) => {
    addLog(`select: ${title}`);
    setSelected(title);
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Collapsible.Panel': ['render'],
            'Collapsible.Root': ['defaultOpen', 'onOpenChange', 'render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'Header.LargeTitle': [],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
            'List.Content': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': ['selected'],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Page.Root': [],
            'Sidebar.Root': ['aria-label'],
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
    { provided: useProvidedState('collapsible-composition-sidebar') },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[partControls]}
      id="collapsible-composition-sidebar"
      log={log}
      stage="tablet"
      state={[partState]}
      title="Collapsible sidebar sections"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...partProps['Layout.Root']}>
          <Layout.Column
            {...partProps['Layout.Column']}
            floating
            aria-label="Sidebar"
            defaultSize={300}
          >
            <Sidebar.Root
              {...partProps['Sidebar.Root']}
              aria-label="Music"
            >
              <List.Root
                {...partProps['List.Root']}
                listStyle="sidebar"
              >
                <Collapsible.Root
                  {...partProps['Collapsible.Root']}
                  defaultOpen
                  render={<List.Section {...partProps['List.Section']} />}
                  onOpenChange={(isOpen: boolean) =>
                    addLog(`library: ${isOpen ? 'open' : 'closed'}`)
                  }
                >
                  <Collapsible.Trigger
                    {...partProps['Collapsible.Trigger']}
                    nativeButton={false}
                    render={
                      <List.Header
                        {...partProps['List.Header']}
                        prominence="nested"
                      />
                    }
                  >
                    <List.Title {...partProps['List.Title']}>
                      Library
                    </List.Title>
                    <List.Disclosure {...partProps['List.Disclosure']} />
                  </Collapsible.Trigger>
                  <Collapsible.Panel
                    {...partProps['Collapsible.Panel']}
                    render={<List.Group {...partProps['List.Group']} />}
                  >
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Recently Added'}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => select('Recently Added')}
                        >
                          Recently Added
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Artists'}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => select('Artists')}
                        >
                          Artists
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Albums'}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
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
                  {...partProps['Collapsible.Root']}
                  defaultOpen
                  render={<List.Section {...partProps['List.Section']} />}
                  onOpenChange={(isOpen: boolean) =>
                    addLog(`playlists: ${isOpen ? 'open' : 'closed'}`)
                  }
                >
                  <Collapsible.Trigger
                    {...partProps['Collapsible.Trigger']}
                    nativeButton={false}
                    render={
                      <List.Header
                        {...partProps['List.Header']}
                        prominence="nested"
                      />
                    }
                  >
                    <List.Title {...partProps['List.Title']}>
                      Playlists
                    </List.Title>
                    <List.Disclosure {...partProps['List.Disclosure']} />
                  </Collapsible.Trigger>
                  <Collapsible.Panel
                    {...partProps['Collapsible.Panel']}
                    render={<List.Group {...partProps['List.Group']} />}
                  >
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Favorites'}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => select('Favorites')}
                        >
                          Favorites
                        </List.Title>
                      </List.Content>
                    </List.Item>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Road Trip'}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
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
          <Layout.Column
            {...partProps['Layout.Column']}
            clearFloating
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{selected}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>{selected}</span>
                </Header.LargeTitle>
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
        A music app’s sidebar (a{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />
        ): each section collapses by its title. Its chevron turns down while
        open, and the sections below move up.
      </li>
      <li>
        Each section is a collapsible. Its root renders a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        , its trigger the section’s{' '}
        <PartLink
          component="list"
          part="List.Header"
        />
        , and its panel the{' '}
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
        , with its list’s <code>listStyle=&quot;sidebar&quot;</code>) and the
        chevrons (
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
    <CodeView code={sidebarSectionsCode} />
    <SidebarSections />

    <Heading
      id="rows-in-a-list-group"
      level={2}
    >
      Rows in a list group
    </Heading>
    <ul>
      <li>
        Rows that open among a group’s rows (for example a picker below its row)
        can’t use a Collapsible. Its parts render elements, while a group’s rows
        must stay the group’s children.
      </li>
      <li>
        The list has its own version without elements:{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        , with its{' '}
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />{' '}
        and{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        , and the same props. See{' '}
        <a href={publicUrl('list/composition#rows-expanding-together')}>
          List: Rows expanding together
        </a>
        .
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const collapsibleCompositionDemos = [SidebarSections];
