import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  CheckboxGroup,
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
  useVisualViewport,
  Viewport,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { codeLabel } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { rowTitles, sidebarSections } from './content.js';
import { propOptionsAdaptiveContent } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

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
              <List.Image variant="symbol">
                <Symbol icon={sfTray} />
              </List.Image>
              <List.Title
                render={<button type="button" />}
                onClick={() => setSelected('inbox')}
              >
                Inbox
              </List.Title>
              <List.Detail>12</List.Detail>
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

const drawerCode = `// Its trigger, in the content's bar (outside the drawer).
const sidebarDrawer = useCreateDrawerHandle();

<Layout.Root compact>
  <Layout.Drawer handle={sidebarDrawer}>
    <Layout.DrawerSwipeArea />
    <Layout.Column floating aria-label="Sidebar">
      <Sidebar.Root aria-label="Mailboxes">
        …
        {/* Chosen: its drawer closes. */}
        <List.Title
          render={<Layout.DrawerClose />}
          onClick={() => setSelected('inbox')}
        >
          Inbox
        </List.Title>
        …
      </Sidebar.Root>
    </Layout.Column>
  </Layout.Drawer>
  <Layout.Column>
    <Page.Root>
      <Header.Root>
        <Header.Bar>
          <Toolbar.Leading>
            <Layout.DrawerTrigger
              handle={sidebarDrawer}
              render={<Toolbar.Button aria-label="Show Sidebar" shape="circle" />}
            >
              …
            </Layout.DrawerTrigger>
          </Toolbar.Leading>
          …
        </Header.Bar>
      </Header.Root>
      …
    </Page.Root>
  </Layout.Column>
</Layout.Root>`;

const searchCode = `const [query, setQuery] = useState('');
const matches = (title: string) =>
  title.toLowerCase().includes(query.toLowerCase());

<Sidebar.Root aria-label="Mailboxes">
  <TextField.Root>
    <TextField.Search>
      <Symbol icon={sfMagnifyingglass} />
      <TextField.Control
        aria-label="Search"
        placeholder="Search"
        type="search"
        value={query}
        onValueChange={setQuery}
      />
      <TextField.Clear />
    </TextField.Search>
  </TextField.Root>
  <List.Root listStyle="sidebar">
    {/* Each section's matching rows; sections without any left out. */}
    …
  </List.Root>
</Sidebar.Root>`;

const editingCode = `const [editing, setEditing] = useState(false);
const [checked, setChecked] = useState<string[]>([]);

<Sidebar.Root aria-label="Mailboxes">
  <Sidebar.Toolbar>
    <Button.Root
      tint="var(--uikit-glass-content)"
      variant="borderless"
      onClick={() => setEditing(!editing)}
    >
      <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
    </Button.Root>
    {editing ? (
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
  <List.Root editing={editing} listStyle="sidebar">
    <List.Section>
      …
      <CheckboxGroup
        render={<List.Group />}
        value={checked}
        onValueChange={setChecked}
      >
        <List.Item onClick={editing ? forwardClick('[role=checkbox]') : undefined}>
          {editing ? <List.Checkbox aria-label="Inbox" value="inbox" /> : null}
          …
        </List.Item>
      </CheckboxGroup>
    </List.Section>
  </List.Root>
</Sidebar.Root>`;

const adaptiveCode = `// Inside a <Viewport.Provider> (the visual viewport, tracked).
const { width } = useVisualViewport();
const compact = width < 768;
// Its trigger, in the content's bar (outside the drawer).
const sidebarDrawer = useCreateDrawerHandle();

<Layout.Root compact={compact}>
  {/* Regular: floating beside the content; compact: a drawer. */}
  <Layout.Drawer handle={sidebarDrawer}>
    <Layout.DrawerSwipeArea />
    <Layout.Column floating aria-label="Sidebar" defaultSize={300}>
      <Sidebar.Root aria-label="Mailboxes">…</Sidebar.Root>
    </Layout.Column>
  </Layout.Drawer>
  <Layout.Column clearFloating>
    <Page.Root>
      <Header.Root>
        <Header.Bar>
          {/* Compact only: the drawer's button. */}
          {compact ? <Toolbar.Leading>…</Toolbar.Leading> : null}
          …
        </Header.Bar>
      </Header.Root>
      …
    </Page.Root>
  </Layout.Column>
</Layout.Root>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A tablet: the selected row picks the content column's page. */
const Selecting: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');

  return (
    <Component
      center
      inline
      id="sidebar-composition-selecting"
      log={log}
      title="Sidebar selecting content"
    >
      <div className="sidebar-demo-tablet">
        <Layout.Root>
          <Layout.Column
            floating
            aria-label="Sidebar"
            defaultSize={300}
          >
            <Sidebar.Root aria-label="Mailboxes">
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
                          {count === undefined ? null : (
                            <List.Detail>{count}</List.Detail>
                          )}
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                ))}
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                </Header.Bar>
                <Header.LargeTitle>
                  <span>{rowTitles[selected]}</span>
                </Header.LargeTitle>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 8 },
                      (_, index) => `${rowTitles[selected]} ${index + 1}`,
                    ).map((item) => (
                      <List.Item key={item}>
                        <List.Title>{item}</List.Title>
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

/** A phone: the sidebar as a drawer, closing as a row is chosen. */
const Drawer: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  // Its trigger, in the content's bar (outside the drawer).
  const sidebarDrawer = codeLabel(useCreateDrawerHandle(), 'sidebarDrawer');

  return (
    <Component
      center
      inline
      id="sidebar-composition-drawer"
      log={log}
      title="Sidebar as a drawer"
    >
      <div className="sidebar-demo-phone">
        <Layout.Root compact>
          <Layout.Drawer
            handle={sidebarDrawer}
            onOpenChange={(next: boolean, { reason }) => {
              addLog(`open: ${String(next)} (${reason})`);
            }}
          >
            <Layout.DrawerSwipeArea />
            <Layout.Column
              floating
              aria-label="Sidebar"
            >
              <Sidebar.Root aria-label="Mailboxes">
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
                            {count === undefined ? null : (
                              <List.Detail>{count}</List.Detail>
                            )}
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  ))}
                </List.Root>
              </Sidebar.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Layout.DrawerTrigger
                      handle={sidebarDrawer}
                      render={
                        <Toolbar.Button
                          aria-label="Show Sidebar"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfListBullet} />
                      </Button.Icon>
                    </Layout.DrawerTrigger>
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  {/* (Balancing it: the title centered.) */}
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 8 },
                      (_, index) => `${rowTitles[selected]} ${index + 1}`,
                    ).map((item) => (
                      <List.Item key={item}>
                        <List.Title>{item}</List.Title>
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

  return (
    <Component
      center
      inline
      inputGuards
      id="sidebar-composition-search"
      log={log}
      title="Sidebar with search"
    >
      <div className="sidebar-demo-panel sidebar-demo-picture">
        <Sidebar.Root aria-label="Mailboxes">
          <TextField.Root>
            <TextField.Search>
              <Symbol icon={sfMagnifyingglass} />
              <TextField.Control
                aria-label="Search"
                placeholder="Search"
                type="search"
                value={query}
                onValueChange={(value: string) => setQuery(value)}
              />
              <TextField.Clear />
            </TextField.Search>
          </TextField.Root>
          <List.Root listStyle="sidebar">
            {shown.map(([title, rows]) => (
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
                      {count === undefined ? null : (
                        <List.Detail>{count}</List.Detail>
                      )}
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
            {shown.length === 0 ? (
              <List.Section>
                <List.Block>No Results</List.Block>
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
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);

  return (
    <Component
      center
      inline
      id="sidebar-composition-editing"
      log={log}
      title="Sidebar while editing"
    >
      <div className="sidebar-demo-panel sidebar-demo-picture">
        <Sidebar.Root aria-label="Mailboxes">
          <Sidebar.Toolbar>
            <Button.Root
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => {
                addLog(editing ? 'done' : 'edit');
                setEditing(!editing);
                setChecked([]);
              }}
            >
              <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
            </Button.Root>
            {editing ? (
              <Button.Root
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
                <Button.Icon>
                  <Symbol icon={sfTrash} />
                </Button.Icon>
              </Button.Root>
            ) : null}
          </Sidebar.Toolbar>
          <List.Root
            editing={editing}
            listStyle="sidebar"
          >
            {sidebarSections.map(([title, rows]) => (
              <List.Section key={title}>
                <List.Header prominence="nested">
                  <List.Title>{title}</List.Title>
                </List.Header>
                <CheckboxGroup
                  render={<List.Group />}
                  value={checked}
                  onValueChange={(value: string[]) => setChecked(value)}
                >
                  {rows
                    .filter(([value]) => !deleted.includes(value))
                    .map(([value, rowTitle, icon, count]) => (
                      <List.Item
                        key={value}
                        selected={!editing && selected === value}
                        onClick={
                          editing ? forwardClick('[role=checkbox]') : undefined
                        }
                      >
                        {editing ? (
                          <List.Checkbox
                            aria-label={rowTitle}
                            value={value}
                          />
                        ) : null}
                        <List.Image variant="symbol">
                          <Symbol icon={icon} />
                        </List.Image>
                        {editing ? (
                          <List.Title>{rowTitle}</List.Title>
                        ) : (
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog(`select: ${value}`);
                              setSelected(value);
                            }}
                          >
                            {rowTitle}
                          </List.Title>
                        )}
                        {count === undefined ? null : (
                          <List.Detail>{count}</List.Detail>
                        )}
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
const AdaptiveView: FunctionComponent = () => {
  const id = 'sidebar-composition-adaptive';
  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsAdaptiveContent,
    '[content]',
    externalContent,
    true,
  );
  const { width } = useVisualViewport();
  // (Unset, by the window's width; or as a phone's, or a tablet's.)
  const compact =
    content.layout === undefined ? width < 768 : content.layout === 'phone';
  const [selected, setSelected] = useState('inbox');
  // Its trigger, in the content's bar (outside the drawer).
  const adaptiveDrawer = codeLabel(useCreateDrawerHandle(), 'adaptiveDrawer');

  return (
    <Component
      center
      inline
      controls={[controlContent]}
      id={id}
      log={log}
      state={[stateContent]}
      title="Sidebar, floating or a drawer"
    >
      <div className={compact ? 'sidebar-demo-phone' : 'sidebar-demo-tablet'}>
        <Layout.Root compact={compact}>
          <Layout.Drawer
            handle={adaptiveDrawer}
            onOpenChange={(next: boolean, { reason }) => {
              addLog(`open: ${String(next)} (${reason})`);
            }}
          >
            <Layout.DrawerSwipeArea />
            <Layout.Column
              floating
              aria-label="Sidebar"
              defaultSize={300}
            >
              <Sidebar.Root aria-label="Mailboxes">
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
                            {count === undefined ? null : (
                              <List.Detail>{count}</List.Detail>
                            )}
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  ))}
                </List.Root>
              </Sidebar.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column clearFloating>
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  {compact ? (
                    <Toolbar.Leading>
                      <Layout.DrawerTrigger
                        handle={adaptiveDrawer}
                        render={
                          <Toolbar.Button
                            aria-label="Show Sidebar"
                            shape="circle"
                          />
                        }
                      >
                        <Button.Icon>
                          <Symbol icon={sfListBullet} />
                        </Button.Icon>
                      </Layout.DrawerTrigger>
                    </Toolbar.Leading>
                  ) : null}
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  {compact ? <Toolbar.Trailing /> : null}
                </Header.Bar>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 8 },
                      (_, index) => `${rowTitles[selected]} ${index + 1}`,
                    ).map((item) => (
                      <List.Item key={item}>
                        <List.Title>{item}</List.Title>
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

/** `AdaptiveView`, in a provider tracking the visual viewport. */
const Adaptive: FunctionComponent = () => (
  <Viewport.Provider>
    <AdaptiveView />
  </Viewport.Provider>
);

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['selecting-content', 'Selecting content'],
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
        <a href="text-field">Text field</a>) and a list (<a href="list">List</a>{' '}
        of style <code>sidebar</code>); it’s held by a{' '}
        <a href="layout">Layout</a> column, beside the content it selects.
      </li>
      <li>
        A section’s content may be a stack of its own: see{' '}
        <a href="navigation/composition#beside-a-sidebar">Navigation</a>.
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
        The selected row (<code>List.Item selected</code>) picks the content
        column’s page; the app holds the selection (guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>: the list owns it, the content
        reads it).
      </li>
      <li>
        Floating (<code>floating</code>), the content column clear of it (
        <code>clearFloating</code>): its page’s content inset, its background
        running underneath.
      </li>
    </ul>
    <CodeView code={selectingCode} />
    <Selecting />

    <Heading
      id="a-drawer"
      level={2}
    >
      A drawer
    </Heading>
    <ul>
      <li>
        Compact (<code>Layout.Root compact</code>): the column in a{' '}
        <PartLink
          component="layout"
          part="Layout.Drawer"
        />
        , from its side; swiped in from that edge (
        <PartLink
          component="layout"
          part="Layout.DrawerSwipeArea"
        />
        ) or opened by the page’s button (
        <PartLink
          component="layout"
          part="Layout.DrawerTrigger"
        />
        , linked by a handle); swiped back, or the dimmed content pressed, to
        close.
      </li>
      <li>
        Closing as a row is chosen (its title a{' '}
        <PartLink
          component="layout"
          part="Layout.DrawerClose"
        />
        ), its page shown.
      </li>
    </ul>
    <CodeView code={drawerCode} />
    <Drawer />

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
          part="TextField.Search"
        />
        , styled by the panel) filtering its rows; sections without matches left
        out.
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
        Edit and Done in its toolbar; while editing, selection circles before
        the rows’ symbols (
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        in a{' '}
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />
        ), a row pressed anywhere toggling its circle.
      </li>
      <li>Delete for the checked rows, disabled while none are checked.</li>
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
        By the window’s width (
        <PartLink
          component="viewport"
          part="useVisualViewport"
        />
        , in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        ; here below 768px): compact, a drawer with the page’s button to open
        it; regular, floating beside the content.
      </li>
      <li>
        The same column either way (<code>floating</code>, in a{' '}
        <PartLink
          component="layout"
          part="Layout.Drawer"
        />
        , the layout’s <code>compact</code> deciding): resize the window (or
        open this page on a phone) to switch, or choose a layout (its content’s{' '}
        <code>layout</code>).
      </li>
      <li>
        Compact, the sections as a stack’s root page instead: see{' '}
        <a href="navigation/composition#compact-or-regular">Navigation</a>.
      </li>
    </ul>
    <CodeView code={adaptiveCode} />
    <Adaptive />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sidebarCompositionDemos = [
  Selecting,
  Drawer,
  Search,
  Editing,
  Adaptive,
];
