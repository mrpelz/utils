import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  CheckboxGroup,
  Collapsible,
  Drawer,
  forwardClick,
  Header,
  Layout,
  List,
  Page,
  Sidebar,
  Symbol,
  TextField,
  Toolbar,
  useCreateDrawerHandle,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfFolder,
  sfInsetFilledLeadinghalfArrowLeadingRectangle,
  sfInsetFilledLeadingthirdRectangle,
  sfListBullet,
  sfMagnifyingglass,
  sfTrash,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { rowTitles, sidebarSections } from './content.js';
import { propOptionsAdaptiveContent } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const hierarchyCode = `const [selected, setSelected] = useState('Projects');

{/* The section collapses by its title. */}
<Collapsible.Root defaultOpen render={<List.Section />}>
  <Collapsible.Trigger nativeButton={false} render={<List.Header prominence="nested" />}>
    <List.Title>Folders</List.Title>
    <List.Disclosure />
  </Collapsible.Trigger>
  <Collapsible.Panel render={<List.Group />}>
    {/* A folder: its row, its subfolders opening below it. */}
    <List.CollapsibleRoot defaultOpen>
      <List.Item selected={selected === 'Projects'}>
        <List.Leading>
          <List.Image variant="symbol">
            <Symbol icon={sfFolder} />
          </List.Image>
        </List.Leading>
        <List.Content>
          <List.Title render={<button type="button" />} onClick={() => setSelected('Projects')}>
            Projects
          </List.Title>
        </List.Content>
        <List.Trailing>
          {/* The chevron opens its subfolders; the title selects it. */}
          <List.CollapsibleTrigger
            aria-label="Projects: nested"
            render={<List.Accessory render={<button type="button" />} />}
          >
            <List.Disclosure />
          </List.CollapsibleTrigger>
        </List.Trailing>
      </List.Item>
      <List.CollapsiblePanel>
        {/* One level deeper: indented. */}
        <List.Item level={1} selected={selected === 'Website'}>
          {/* … */}
        </List.Item>
        {/* (App, its subfolders at level 2, the same way) */}
      </List.CollapsiblePanel>
    </List.CollapsibleRoot>
    {/* … (Trash) */}
  </Collapsible.Panel>
</Collapsible.Root>`;

const selectingCode = `const [selected, setSelected] = useState('inbox');

<Layout.Root>
  <Layout.Column floating aria-label="Sidebar" defaultSize={300}>
    <Sidebar.Root aria-label="Mailboxes">
      <List.Root listStyle="sidebar">
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Library</List.Title>
          </List.Header>
          <List.Group>
            <List.Item selected={selected === 'inbox'}>
              <List.Leading>
                <List.Image variant="symbol">
                  <Symbol icon={sfTray} />
                </List.Image>
              </List.Leading>
              <List.Content>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => setSelected('inbox')}
                >
                  Inbox
                </List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>12</List.Detail>
              </List.Trailing>
            </List.Item>
            …
          </List.Group>
        </List.Section>
      </List.Root>
    </Sidebar.Root>
  </Layout.Column>
  <Layout.Column clearFloating>
    {/* The selected row's page. */}
    <Page.Root>…</Page.Root>
  </Layout.Column>
</Layout.Root>`;

const drawerCode = `const [selected, setSelected] = useState('inbox');
// Its trigger, in the content's bar (outside the drawer).
const sidebarDrawer = useCreateDrawerHandle();

<Layout.Root>
  <Drawer.Root handle={sidebarDrawer}>
    <Drawer.SwipeArea />
    <Drawer.Popup floating aria-label="Sidebar">
      <Sidebar.Root aria-label="Mailboxes">
        …
        {/* Chosen: its drawer closes. */}
        <List.Title
          render={<Drawer.Close />}
          onClick={() => setSelected('inbox')}
        >
          Inbox
        </List.Title>
        …
      </Sidebar.Root>
    </Drawer.Popup>
  </Drawer.Root>
  <Layout.Column>
    <Header.Root>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          <Toolbar.Leading>
            <Drawer.Trigger
              handle={sidebarDrawer}
              render={<Toolbar.Button aria-label="Show Sidebar" shape="circle" />}
            >
              …
            </Drawer.Trigger>
          </Toolbar.Leading>
          …
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Page.Root>
        <Viewport.Padding edge="block-start" />
        …
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Header.Root>
  </Layout.Column>
</Layout.Root>`;

const searchCode = `const [query, setQuery] = useState('');
const matches = (title: string) =>
  title.toLowerCase().includes(query.toLowerCase());

<Sidebar.Root aria-label="Mailboxes">
  <TextField.Root>
    <TextField.Frame>
      <Symbol icon={sfMagnifyingglass} />
      <TextField.Control
        aria-label="Search"
        placeholder="Search"
        type="search"
        value={query}
        onValueChange={setQuery}
      />
      <TextField.Clear />
    </TextField.Frame>
  </TextField.Root>
  <List.Root listStyle="sidebar">
    {/* Each section's matching rows; sections without any left out. */}
    …
  </List.Root>
</Sidebar.Root>`;

const editingCode = `const [isEditing, setIsEditing] = useState(false);
const [checked, setChecked] = useState<string[]>([]);

<Sidebar.Root aria-label="Mailboxes">
  <Sidebar.Toolbar>
    <Button.Root
      tint="var(--uikit-glass-content)"
      variant="borderless"
      onClick={() => setIsEditing(!isEditing)}
    >
      <Button.Label>{isEditing ? 'Done' : 'Edit'}</Button.Label>
    </Button.Root>
    {isEditing ? (
      <Button.Root
        aria-label="Delete"
        destructive
        disabled={checked.length === 0}
        shape="circle"
        variant="borderless"
        onClick={…}
      >
        …
      </Button.Root>
    ) : null}
  </Sidebar.Toolbar>
  <List.Root editing={isEditing ? 'leading' : 'none'} listStyle="sidebar">
    <List.Section>
      …
      <CheckboxGroup
        render={<List.Group />}
        value={checked}
        onValueChange={setChecked}
      >
        <List.Item onClick={isEditing ? forwardClick('[role=checkbox]') : undefined}>
          {/* Always there: sliding in and out with edit mode. */}
          <List.Leading whileEditing="show">
            <List.Checkbox aria-label="Inbox" value="inbox" />
          </List.Leading>
          
          …
        </List.Item>
      </CheckboxGroup>
    </List.Section>
  </List.Root>
</Sidebar.Root>`;

const adaptiveCode = `// Compact (a phone) or regular (a tablet), by the window's width.
const isCompact = useSizeClass() === 'compact';
// Its trigger, in the content's bar (outside the drawer).
const sidebarDrawer = useCreateDrawerHandle();

<Layout.Root>
  {/* Regular: floating beside the content; compact: a drawer. */}
  {isCompact ? (
    <Drawer.Root handle={sidebarDrawer}>
      <Drawer.SwipeArea />
      <Drawer.Popup floating aria-label="Sidebar" size={300}>
        <Sidebar.Root aria-label="Mailboxes">…</Sidebar.Root>
      </Drawer.Popup>
    </Drawer.Root>
  ) : (
    <Layout.Column floating aria-label="Sidebar" defaultSize={300}>
      <Sidebar.Root aria-label="Mailboxes">…</Sidebar.Root>
    </Layout.Column>
  )}
  <Layout.Column clearFloating>
    <Header.Root>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          {/* Compact only: the drawer's button. */}
          {isCompact ? <Toolbar.Leading>…</Toolbar.Leading> : null}
          …
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Page.Root>
        <Viewport.Padding edge="block-start" />
        …
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Header.Root>
  </Layout.Column>
</Layout.Root>`;

const hidingCode = `// Whether the sidebar shows: the app's state.
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

<Layout.Root>
  {/* Closed, it slides out; the content's inset glides with it. */}
  <Layout.Column floating aria-label="Sidebar" defaultSize={300} open={isSidebarOpen}>
    <Sidebar.Root aria-label="Mailboxes">
      {/* Its toolbar in a bar (staying at its top), its list in a page. */}
      <Header.Root>
        <Viewport.BlockStart>
          <Sidebar.Toolbar>
            <Button.Root
              aria-expanded={isSidebarOpen}
              aria-label="Hide Sidebar"
              shape="circle"
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Button.Icon>
                <Symbol icon={sfInsetFilledLeadinghalfArrowLeadingRectangle} />
              </Button.Icon>
            </Button.Root>
          </Sidebar.Toolbar>
        </Viewport.BlockStart>
        <Page.Root>
          <Viewport.Padding edge="block-start" />
          <List.Root listStyle="sidebar">…</List.Root>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    </Sidebar.Root>
  </Layout.Column>
  <Layout.Column clearFloating>
    <Header.Root>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          {/* Closed: a button showing it again. */}
          {isSidebarOpen ? null : (
            <Toolbar.Leading>
              <Toolbar.Button
                aria-expanded={false}
                aria-label="Show Sidebar"
                shape="circle"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Button.Icon>
                  <Symbol icon={sfInsetFilledLeadingthirdRectangle} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Leading>
          )}
          <Toolbar.Title><span>Inbox</span></Toolbar.Title>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Page.Root>…</Page.Root>
    </Header.Root>
  </Layout.Column>
</Layout.Root>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A tablet: the selected row picks the content column's page. */
const Selecting: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Header.LargeTitle': [],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
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
    { provided: useProvidedState('sidebar-composition-selecting') },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[partControls]}
      id="sidebar-composition-selecting"
      log={log}
      stage="tablet"
      state={[partState]}
      title="Sidebar selecting content"
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
              aria-label="Mailboxes"
            >
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
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
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
                        { length: 8 },
                        (_, index) => `${rowTitles[selected]} ${index + 1}`,
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

/**
 * A sidebar's folders in a hierarchy (`level`), subfolders opening below
 * their folder (`List.CollapsibleRoot`); its section collapsing by its
 * title (`Collapsible`).
 */
const Hierarchy: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('Projects');
  const select = (value: string) => {
    addLog(`select: ${value}`);
    setSelected(value);
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Collapsible.Panel': ['render'],
            'Collapsible.Root': ['defaultOpen', 'render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'Header.LargeTitle': [],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
            'List.Accessory': ['render'],
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': [],
            'List.CollapsibleTrigger': ['aria-label', 'render'],
            'List.Content': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['level', 'selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
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
    { provided: useProvidedState('sidebar-composition-hierarchy') },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[partControls]}
      id="sidebar-composition-hierarchy"
      log={log}
      stage="tablet"
      state={[partState]}
      title="Sidebar with folders in a hierarchy"
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
              aria-label="Folders"
            >
              <List.Root
                {...partProps['List.Root']}
                listStyle="sidebar"
              >
                <Collapsible.Root
                  {...partProps['Collapsible.Root']}
                  defaultOpen
                  render={<List.Section {...partProps['List.Section']} />}
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
                      Folders
                    </List.Title>
                    <List.Disclosure {...partProps['List.Disclosure']} />
                  </Collapsible.Trigger>
                  <Collapsible.Panel
                    {...partProps['Collapsible.Panel']}
                    render={<List.Group {...partProps['List.Group']} />}
                  >
                    <List.CollapsibleRoot
                      {...partProps['List.CollapsibleRoot']}
                      defaultOpen
                    >
                      <List.Item
                        {...partProps['List.Item']}
                        selected={selected === 'Projects'}
                      >
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfFolder}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => select('Projects')}
                          >
                            Projects
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <List.CollapsibleTrigger
                            {...partProps['List.CollapsibleTrigger']}
                            aria-label="Projects: nested"
                            render={
                              <List.Accessory
                                {...partProps['List.Accessory']}
                                render={<button type="button" />}
                              />
                            }
                          >
                            <List.Disclosure
                              {...partProps['List.Disclosure']}
                            />
                          </List.CollapsibleTrigger>
                        </List.Trailing>
                      </List.Item>
                      <List.CollapsiblePanel
                        {...partProps['List.CollapsiblePanel']}
                      >
                        <List.Item
                          {...partProps['List.Item']}
                          level={1}
                          selected={selected === 'Website'}
                        >
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfFolder}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
                              render={<button type="button" />}
                              onClick={() => select('Website')}
                            >
                              Website
                            </List.Title>
                          </List.Content>
                        </List.Item>
                        <List.CollapsibleRoot
                          {...partProps['List.CollapsibleRoot']}
                          defaultOpen
                        >
                          <List.Item
                            {...partProps['List.Item']}
                            level={1}
                            selected={selected === 'App'}
                          >
                            <List.Leading {...partProps['List.Leading']}>
                              <List.Image
                                {...partProps['List.Image']}
                                variant="symbol"
                              >
                                <Symbol
                                  {...partProps.Symbol}
                                  icon={sfFolder}
                                />
                              </List.Image>
                            </List.Leading>
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
                                render={<button type="button" />}
                                onClick={() => select('App')}
                              >
                                App
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.CollapsibleTrigger
                                {...partProps['List.CollapsibleTrigger']}
                                aria-label="App: nested"
                                render={
                                  <List.Accessory
                                    {...partProps['List.Accessory']}
                                    render={<button type="button" />}
                                  />
                                }
                              >
                                <List.Disclosure
                                  {...partProps['List.Disclosure']}
                                />
                              </List.CollapsibleTrigger>
                            </List.Trailing>
                          </List.Item>
                          <List.CollapsiblePanel
                            {...partProps['List.CollapsiblePanel']}
                          >
                            <List.Item
                              {...partProps['List.Item']}
                              level={2}
                              selected={selected === 'Designs'}
                            >
                              <List.Leading {...partProps['List.Leading']}>
                                <List.Image
                                  {...partProps['List.Image']}
                                  variant="symbol"
                                >
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={sfFolder}
                                  />
                                </List.Image>
                              </List.Leading>
                              <List.Content {...partProps['List.Content']}>
                                <List.Title
                                  {...partProps['List.Title']}
                                  render={<button type="button" />}
                                  onClick={() => select('Designs')}
                                >
                                  Designs
                                </List.Title>
                              </List.Content>
                            </List.Item>
                            <List.Item
                              {...partProps['List.Item']}
                              level={2}
                              selected={selected === 'Builds'}
                            >
                              <List.Leading {...partProps['List.Leading']}>
                                <List.Image
                                  {...partProps['List.Image']}
                                  variant="symbol"
                                >
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={sfFolder}
                                  />
                                </List.Image>
                              </List.Leading>
                              <List.Content {...partProps['List.Content']}>
                                <List.Title
                                  {...partProps['List.Title']}
                                  render={<button type="button" />}
                                  onClick={() => select('Builds')}
                                >
                                  Builds
                                </List.Title>
                              </List.Content>
                            </List.Item>
                          </List.CollapsiblePanel>
                        </List.CollapsibleRoot>
                      </List.CollapsiblePanel>
                    </List.CollapsibleRoot>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Trash'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfTrash}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => select('Trash')}
                        >
                          Trash
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

/** A phone: the sidebar as a drawer, closing as a row is chosen. */
const InADrawer: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  // Its trigger, in the content's bar (outside the drawer).
  const sidebarDrawer = codeLabel(
    useCreateDrawerHandle(),
    'sidebarDrawer',
    'const sidebarDrawer = useCreateDrawerHandle();',
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Drawer.Close': [],
            'Drawer.Popup': ['aria-label', 'floating'],
            'Drawer.Root': ['handle', 'onOpenChange'],
            'Drawer.SwipeArea': [],
            'Drawer.Trigger': ['handle', 'render'],
            'Layout.Column': [],
            'Layout.Root': [],
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
            'Page.Root': [],
            'Sidebar.Root': ['aria-label'],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sidebar-composition-drawer') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="sidebar-composition-drawer"
      log={log}
      stage="phone"
      state={[partState]}
      title="Sidebar as a drawer"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...partProps['Layout.Root']}>
          <Drawer.Root
            {...partProps['Drawer.Root']}
            handle={sidebarDrawer}
            onOpenChange={(isOpen: boolean, { reason }) => {
              addLog(`open: ${String(isOpen)} (${reason})`);
            }}
          >
            <Drawer.SwipeArea {...partProps['Drawer.SwipeArea']} />
            <Drawer.Popup
              {...partProps['Drawer.Popup']}
              floating
              aria-label="Sidebar"
            >
              <Sidebar.Root
                {...partProps['Sidebar.Root']}
                aria-label="Mailboxes"
              >
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
                              {/* (Chosen: its drawer closes.) */}
                              <List.Title
                                {...partProps['List.Title']}
                                render={
                                  <Drawer.Close
                                    {...partProps['Drawer.Close']}
                                  />
                                }
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
            </Drawer.Popup>
          </Drawer.Root>
          <Layout.Column {...partProps['Layout.Column']}>
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                    <Drawer.Trigger
                      {...partProps['Drawer.Trigger']}
                      handle={sidebarDrawer}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          aria-label="Show Sidebar"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfListBullet}
                        />
                      </Button.Icon>
                    </Drawer.Trigger>
                  </Toolbar.Leading>
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  {/* (Balancing it: the title centered.) */}
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
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
                      {Array.from(
                        { length: 8 },
                        (_, index) => `${rowTitles[selected]} ${index + 1}`,
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

/** The search field filtering the sidebar's rows. */
const Search: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  const [query, setQuery] = useState('');
  const matches = (title: string) =>
    title.toLowerCase().includes(query.toLowerCase());
  const shown = sidebarSections
    .map(
      ([title, rows]) =>
        [title, rows.filter(([, row]) => matches(row))] as const,
    )
    .filter(([, rows]) => rows.length > 0);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Block': [],
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
            'Sidebar.Root': ['aria-label'],
            'TextField.Clear': [],
            'TextField.Control': [
              'aria-label',
              'onValueChange',
              'placeholder',
              'type',
              'value',
            ],
            'TextField.Frame': [],
            'TextField.Root': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sidebar-composition-search') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="sidebar-composition-search"
      log={log}
      state={[partState]}
      title="Sidebar with search"
    >
      <div className="sidebar-demo-panel demo-picture">
        <Sidebar.Root
          {...partProps['Sidebar.Root']}
          aria-label="Mailboxes"
        >
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
                value={query}
                onValueChange={(value: string) => setQuery(value)}
              />
              <TextField.Clear {...partProps['TextField.Clear']} />
            </TextField.Frame>
          </TextField.Root>
          <List.Root
            {...partProps['List.Root']}
            listStyle="sidebar"
          >
            {shown.map(([title, rows]) => (
              <List.Section
                key={title}
                {...partProps['List.Section']}
              >
                <List.Header
                  {...partProps['List.Header']}
                  prominence="nested"
                >
                  <List.Title {...partProps['List.Title']}>{title}</List.Title>
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
            {shown.length === 0 ? (
              <List.Section {...partProps['List.Section']}>
                <List.Block {...partProps['List.Block']}>No Results</List.Block>
              </List.Section>
            ) : null}
          </List.Root>
        </Sidebar.Root>
      </div>
    </Component>
  );
};

/** Edit and Done: selection circles on the rows, Delete for the checked. */
const Editing: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  const [isEditing, setIsEditing] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            CheckboxGroup: ['onValueChange', 'render', 'value'],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': [
              'aria-label',
              'destructive',
              'disabled',
              'onClick',
              'shape',
              'tint',
              'variant',
            ],
            'List.Checkbox': ['aria-label', 'value'],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['onClick', 'selected'],
            'List.Leading': ['whileEditing'],
            'List.Root': ['editing', 'listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Sidebar.Root': ['aria-label'],
            'Sidebar.Toolbar': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sidebar-composition-editing') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="sidebar-composition-editing"
      log={log}
      state={[partState]}
      title="Sidebar while editing"
    >
      <div className="sidebar-demo-panel demo-picture">
        <Sidebar.Root
          {...partProps['Sidebar.Root']}
          aria-label="Mailboxes"
        >
          <Sidebar.Toolbar {...partProps['Sidebar.Toolbar']}>
            <Button.Root
              {...partProps['Button.Root']}
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => {
                addLog(isEditing ? 'done' : 'edit');
                setIsEditing(!isEditing);
                setChecked([]);
              }}
            >
              <Button.Label {...partProps['Button.Label']}>
                {isEditing ? 'Done' : 'Edit'}
              </Button.Label>
            </Button.Root>
            {isEditing ? (
              <Button.Root
                {...partProps['Button.Root']}
                destructive
                aria-label="Delete"
                disabled={checked.length === 0}
                shape="circle"
                variant="borderless"
                onClick={() => {
                  addLog(`delete: ${checked.join(', ')}`);
                  setDeleted([...deleted, ...checked]);
                  setChecked([]);
                }}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrash}
                  />
                </Button.Icon>
              </Button.Root>
            ) : null}
          </Sidebar.Toolbar>
          <List.Root
            {...partProps['List.Root']}
            editing={isEditing ? 'leading' : 'none'}
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
                  <List.Title {...partProps['List.Title']}>{title}</List.Title>
                </List.Header>
                <CheckboxGroup
                  {...partProps.CheckboxGroup}
                  render={<List.Group {...partProps['List.Group']} />}
                  value={checked}
                  onValueChange={(value: string[]) => setChecked(value)}
                >
                  {rows
                    .filter(([value]) => !deleted.includes(value))
                    .map(([value, rowTitle, icon, count]) => (
                      <List.Item
                        key={value}
                        {...partProps['List.Item']}
                        selected={!isEditing && selected === value}
                        onClick={
                          isEditing
                            ? forwardClick('[role=checkbox]')
                            : undefined
                        }
                      >
                        {/* Always there: sliding in and out with edit mode. */}
                        <List.Leading
                          {...partProps['List.Leading']}
                          whileEditing="show"
                        >
                          <List.Checkbox
                            {...partProps['List.Checkbox']}
                            aria-label={rowTitle}
                            value={value}
                          />
                        </List.Leading>
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
                          {isEditing ? (
                            <List.Title {...partProps['List.Title']}>
                              {rowTitle}
                            </List.Title>
                          ) : (
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
                          )}
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
                </CheckboxGroup>
              </List.Section>
            ))}
          </List.Root>
        </Sidebar.Root>
      </div>
    </Component>
  );
};

/**
 * By the window's width: compact (a phone), a drawer; regular (a tablet),
 * floating beside the content (inside a provider tracking the visual
 * viewport, see `Adaptive`).
 */
const Adaptive: FunctionComponent = () => {
  const id = 'sidebar-composition-adaptive';
  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsAdaptiveContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const sizeClass = useSizeClass();
  // (Unset, by the window's width; or as a phone's, or a tablet's.)
  const isCompact =
    content.layout === undefined
      ? sizeClass === 'compact'
      : content.layout === 'phone';
  const [selected, setSelected] = useState('inbox');
  // Its trigger, in the content's bar (outside the drawer).
  const adaptiveDrawer = codeLabel(
    useCreateDrawerHandle(),
    'adaptiveDrawer',
    'const adaptiveDrawer = useCreateDrawerHandle();',
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Drawer.Close': [],
            'Drawer.Popup': ['aria-label', 'floating', 'size'],
            'Drawer.Root': ['handle', 'onOpenChange'],
            'Drawer.SwipeArea': [],
            'Drawer.Trigger': ['handle', 'render'],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
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
            'Page.Root': [],
            'Sidebar.Root': ['aria-label'],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
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
      controls={[controlContent, partControls]}
      id={id}
      log={log}
      stage={isCompact ? 'phone' : 'tablet'}
      state={[stateContent, partState]}
      title="Sidebar, floating or a drawer"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...partProps['Layout.Root']}>
          {isCompact ? (
            <Drawer.Root
              {...partProps['Drawer.Root']}
              handle={adaptiveDrawer}
              onOpenChange={(isOpen: boolean, { reason }) => {
                addLog(`open: ${String(isOpen)} (${reason})`);
              }}
            >
              <Drawer.SwipeArea {...partProps['Drawer.SwipeArea']} />
              <Drawer.Popup
                {...partProps['Drawer.Popup']}
                floating
                aria-label="Sidebar"
                size={300}
              >
                <Sidebar.Root
                  {...partProps['Sidebar.Root']}
                  aria-label="Mailboxes"
                >
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
                                {/* (Chosen: its drawer closes.) */}
                                <List.Title
                                  {...partProps['List.Title']}
                                  render={
                                    <Drawer.Close
                                      {...partProps['Drawer.Close']}
                                    />
                                  }
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
              </Drawer.Popup>
            </Drawer.Root>
          ) : (
            <Layout.Column
              {...partProps['Layout.Column']}
              floating
              aria-label="Sidebar"
              defaultSize={300}
            >
              <Sidebar.Root
                {...partProps['Sidebar.Root']}
                aria-label="Mailboxes"
              >
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
          )}
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
                  {isCompact ? (
                    <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                      <Drawer.Trigger
                        {...partProps['Drawer.Trigger']}
                        handle={adaptiveDrawer}
                        render={
                          <Toolbar.Button
                            {...partProps['Toolbar.Button']}
                            aria-label="Show Sidebar"
                            shape="circle"
                          />
                        }
                      >
                        <Button.Icon {...partProps['Button.Icon']}>
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfListBullet}
                          />
                        </Button.Icon>
                      </Drawer.Trigger>
                    </Toolbar.Leading>
                  ) : null}
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  {isCompact ? (
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
                  ) : null}
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
                      {Array.from(
                        { length: 8 },
                        (_, index) => `${rowTitles[selected]} ${index + 1}`,
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

/**
 * A tablet: the sidebar hidden by its toolbar's button (in its bar,
 * staying at its top as its list scrolls), shown again by one in the
 * content's bar (the app's state, the column's `open`).
 */
const Hiding: FunctionComponent = () => {
  const id = 'sidebar-composition-hiding';
  const [log, addLog] = useLog();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const setOpen = (isOpen: boolean) => {
    addLog(`sidebar: ${isOpen ? 'shown' : 'hidden'}`);
    setIsSidebarOpen(isOpen);
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Root': [
              'aria-expanded',
              'aria-label',
              'onClick',
              'shape',
              'tint',
              'variant',
            ],
            'Header.LargeTitle': [],
            'Layout.Column': [
              'aria-label',
              'clearFloating',
              'defaultSize',
              'floating',
              'open',
            ],
            'Layout.Root': [],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'Sidebar.Root': ['aria-label'],
            'Sidebar.Toolbar': [],
            'Toolbar.Button': [
              'aria-expanded',
              'aria-label',
              'onClick',
              'shape',
            ],
            'Toolbar.Leading': [],
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
      controls={[partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[partState]}
      title="Hiding the sidebar"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...partProps['Layout.Root']}>
          <Layout.Column
            {...partProps['Layout.Column']}
            floating
            aria-label="Sidebar"
            defaultSize={300}
            open={isSidebarOpen}
          >
            <Sidebar.Root
              {...partProps['Sidebar.Root']}
              aria-label="Mailboxes"
            >
              <Header.Root>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Sidebar.Toolbar {...partProps['Sidebar.Toolbar']}>
                    <Button.Root
                      {...partProps['Button.Root']}
                      aria-expanded={isSidebarOpen}
                      aria-label="Hide Sidebar"
                      shape="circle"
                      tint="var(--uikit-glass-content)"
                      variant="borderless"
                      onClick={() => setOpen(false)}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfInsetFilledLeadinghalfArrowLeadingRectangle}
                        />
                      </Button.Icon>
                    </Button.Root>
                  </Sidebar.Toolbar>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
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
                                <List.Title {...partProps['List.Title']}>
                                  {rowTitle}
                                </List.Title>
                              </List.Content>
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
                  {isSidebarOpen ? null : (
                    <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        aria-expanded={false}
                        aria-label="Show Sidebar"
                        shape="circle"
                        onClick={() => setOpen(true)}
                      >
                        <Button.Icon {...partProps['Button.Icon']}>
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfInsetFilledLeadingthirdRectangle}
                          />
                        </Button.Icon>
                      </Toolbar.Button>
                    </Toolbar.Leading>
                  )}
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Inbox</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>Inbox</span>
                </Header.LargeTitle>
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {Array.from(
                        { length: 8 },
                        (_, index) => `Message ${index + 1}`,
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
  ['selecting-content', 'Selecting content'],
  ['hiding-the-sidebar', 'Hiding the sidebar'],
  ['folders-in-a-hierarchy', 'Folders in a hierarchy'],
  ['a-drawer', 'A drawer'],
  ['search', 'Search'],
  ['editing', 'Editing'],
  ['floating-or-a-drawer', 'Floating or a drawer'],
];

/** `/sidebar/composition`: sidebars in layouts, with search and editing. */
export const SidebarComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A sidebar holds a toolbar, a search field (
        <a href={publicUrl('text-field')}>Text Field</a>) and a list (a{' '}
        <a href={publicUrl('list')}>List</a> with the <code>sidebar</code>{' '}
        style). A <a href={publicUrl('layout')}>Layout</a> column holds the
        sidebar, next to the content it selects.
      </li>
      <li>
        A section’s content can be a stack of its own (see{' '}
        <a href={publicUrl('navigation/composition#beside-a-sidebar')}>
          Navigation
        </a>
        ).
      </li>
    </ul>

    <Heading
      id="selecting-content"
      level={2}
    >
      Selecting content
    </Heading>
    <ul>
      <li>
        The selected row (
        <PartLink
          component="list"
          part="List.Item"
        >
          List.Item selected
        </PartLink>
        ) picks the page in the content column. The app holds the selection: the
        list sets it, and the content reads it.
      </li>
      <li>
        The sidebar floats (<code>floating</code>), and the content column stays
        clear of it (<code>clearFloating</code>). Its page’s content is inset,
        while its background runs underneath.
      </li>
      <li>
        <strong>Library:</strong> the selected row (
        <PartLink
          component="list"
          part="List.Item"
        />{' '}
        <code>selected</code>), the floating{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />
        , and the content column clear of it (<code>clearFloating</code>).
      </li>
      <li>
        <strong>Demo:</strong> the selection (the app’s state) and the page it
        picks.
      </li>
    </ul>
    <CodeView code={selectingCode} />
    <Selecting />

    <Heading
      id="hiding-the-sidebar"
      level={2}
    >
      Hiding the sidebar
    </Heading>
    <ul>
      <li>
        A button in the sidebar’s toolbar hides it, and one in the content’s bar
        shows it again, only while it’s hidden. The sidebar slides out, and the
        content’s inset glides with it (its column’s <code>open</code>, see{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        ).
      </li>
      <li>
        It’s the app’s state, passed as the column’s <code>open</code>, and the
        buttons are the app’s own. There’s no handle for it: an app has a
        sidebar or two at most, and the button that shows it has to know it’s
        hidden, so the state has to reach both buttons anyway.
      </li>
      <li>
        In a stack of pages, put the button that shows it in a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        , so it stays put as pages are pushed and popped.
      </li>
      <li>
        The sidebar’s toolbar stays at its top while its list scrolls: the
        sidebar holds a{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />{' '}
        with the toolbar in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        and the list in a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        , as a screen does. Its list fades out under the toolbar.
      </li>
      <li>
        <strong>Library:</strong> the column sliding out and in, keeping its
        size, inert while closed, and the content’s inset following. The sidebar
        as its bar’s screen: where its toolbar sits, the page’s insets, the
        fade.
      </li>
      <li>
        <strong>Demo:</strong> the open state and the two buttons.
      </li>
    </ul>
    <CodeView code={hidingCode} />
    <Hiding />

    <Heading
      id="folders-in-a-hierarchy"
      level={2}
    >
      Folders in a hierarchy
    </Heading>
    <ul>
      <li>
        Folders inside folders, as in a file manager or a mail app. Each level
        is indented by 20px (
        <PartLink
          component="list"
          part="List.Item"
        />{' '}
        <code>level</code>).
      </li>
      <li>
        A folder’s chevron opens its subfolders below it. It’s a{' '}
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />{' '}
        that renders a{' '}
        <PartLink
          component="list"
          part="List.Accessory"
        />{' '}
        button at its row’s end. The folder’s title selects it. Closing a folder
        also closes the folders inside it.
      </li>
      <li>
        Its subfolders are rows of the same group. The{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />{' '}
        renders no element, so the group’s rows stay its direct children.
      </li>
      <li>
        The section collapses by its title, as a{' '}
        <a href={publicUrl('collapsible')}>Collapsible</a>: its{' '}
        <PartLink
          component="list"
          part="List.Header"
        />{' '}
        is the trigger, and its{' '}
        <PartLink
          component="list"
          part="List.Group"
        />{' '}
        is the panel.
      </li>
      <li>
        <strong>Library:</strong> the collapsible section (
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
        ), the levels (
        <PartLink
          component="list"
          part="List.Item"
        />{' '}
        <code>level</code>), the collapsible rows (
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ) and their chevrons (
        <PartLink
          component="list"
          part="List.Disclosure"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the folders, their levels, and the selection.
      </li>
    </ul>
    <CodeView code={hierarchyCode} />
    <Hierarchy />

    <Heading
      id="a-drawer"
      level={2}
    >
      A drawer
    </Heading>
    <ul>
      <li>
        On a phone, the sidebar sits in a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Popup"
        />{' '}
        (<code>floating</code>) at its side. It’s swiped in from that edge (
        <PartLink
          component="drawer"
          part="Drawer.SwipeArea"
        />
        ), or opened by the page’s button (
        <PartLink
          component="drawer"
          part="Drawer.Trigger"
        />
        , linked by a handle). Swipe it back, or press the dimmed content, to
        close it.
      </li>
      <li>
        It closes when a row is chosen (its title is a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />
        ), and that row’s page shows.
      </li>
      <li>
        <strong>Library:</strong> the sidebar in a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Root"
        />
        , its swipe area and trigger linked by a handle, and closing when a row
        is chosen (
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the selection and the pages.
      </li>
    </ul>
    <CodeView code={drawerCode} />
    <InADrawer />

    <Heading
      id="search"
      level={2}
    >
      Search
    </Heading>
    <ul>
      <li>
        Its search field (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />
        , styled by the panel) filters its rows. Sections without matches are
        left out.
      </li>
      <li>
        <strong>Library:</strong> the search field (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />
        ), styled by the sidebar.
      </li>
      <li>
        <strong>Demo:</strong> the query (the app’s state), filtering the rows,
        and leaving out empty sections.
      </li>
    </ul>
    <CodeView code={searchCode} />
    <Search />

    <Heading
      id="editing"
      level={2}
    >
      Editing
    </Heading>
    <ul>
      <li>
        Edit and Done sit in its toolbar. While editing, selection circles
        appear before the rows’ symbols (
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        in a{' '}
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />
        ). Pressing a row anywhere toggles its circle.
      </li>
      <li>
        Delete removes the checked rows. It’s disabled while none are checked.
      </li>
      <li>
        <strong>Library:</strong> the sidebar’s toolbar (
        <PartLink
          component="sidebar"
          part="Sidebar.Toolbar"
        />
        ) and the rows’ checkboxes (
        <PartLink
          component="list"
          part="List.Checkbox"
        />
        ) in a{' '}
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />
        .
      </li>
      <li>
        <strong>Demo:</strong> the edit state, the checked rows, deleting them,
        and the selection.
      </li>
    </ul>
    <CodeView code={editingCode} />
    <Editing />

    <Heading
      id="floating-or-a-drawer"
      level={2}
    >
      Floating or a drawer
    </Heading>
    <ul>
      <li>
        It follows the window’s size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ; compact below 768px). On compact widths, it’s a drawer, with a button
        on the page to open it. On regular widths, it floats next to the
        content.
      </li>
      <li>
        It’s the same sidebar either way (<code>floating</code>). The app
        renders a{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />{' '}
        or a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Root"
        />{' '}
        by the size class. Resize the window (or open this page on a phone) to
        switch, or choose a layout with the <code>layout</code> control.
      </li>
      <li>
        On compact widths, the sections can also be a stack’s root page (see{' '}
        <a href={publicUrl('navigation/composition#compact-or-regular')}>
          Navigation
        </a>
        ).
      </li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />
        , floating or in a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Root"
        />
        , and the window’s size class (<code>useSizeClass</code>).
      </li>
      <li>
        <strong>Demo:</strong> choosing either by the size class, and the
        selection.
      </li>
    </ul>
    <CodeView code={adaptiveCode} />
    <Adaptive />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sidebarCompositionDemos = [
  Selecting,
  Hiding,
  Hierarchy,
  InADrawer,
  Search,
  Editing,
  Adaptive,
];
