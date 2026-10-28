import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  CheckboxGroup,
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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
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
          <List.Leading whileEditing="show">
            {isEditing ? <List.Checkbox aria-label="Inbox" value="inbox" /> : null}
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

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A tablet: the selected row picks the content column's page. */
const Selecting: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');

  return (
    <Component
      isExpanded
      isInline
      id="sidebar-composition-selecting"
      log={log}
      stage="tablet"
      title="Sidebar selecting content"
    >
      <Viewport.Content safeArea="none">
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
          <Layout.Column clearFloating>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <Header.LargeTitle>
                  <span>{rowTitles[selected]}</span>
                </Header.LargeTitle>

                <List.Root>
                  <List.Section>
                    <List.Group>
                      {Array.from(
                        { length: 8 },
                        (_, index) => `${rowTitles[selected]} ${index + 1}`,
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

  return (
    <Component
      isInline
      id="sidebar-composition-drawer"
      log={log}
      stage="phone"
      title="Sidebar as a drawer"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root>
          <Drawer.Root
            handle={sidebarDrawer}
            onOpenChange={(isOpen: boolean, { reason }) => {
              addLog(`open: ${String(isOpen)} (${reason})`);
            }}
          >
            <Drawer.SwipeArea />
            <Drawer.Popup
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
                            <List.Leading>
                              <List.Image variant="symbol">
                                <Symbol icon={icon} />
                              </List.Image>
                            </List.Leading>
                            <List.Content>
                              {/* (Chosen: its drawer closes.) */}
                              <List.Title
                                render={<Drawer.Close />}
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
            </Drawer.Popup>
          </Drawer.Root>
          <Layout.Column>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading>
                    <Drawer.Trigger
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
                    </Drawer.Trigger>
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  {/* (Balancing it: the title centered.) */}
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {Array.from(
                        { length: 8 },
                        (_, index) => `${rowTitles[selected]} ${index + 1}`,
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
      hasInputGuards
      isCentered
      isInline
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
  const [isEditing, setIsEditing] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);

  return (
    <Component
      isCentered
      isInline
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
                addLog(isEditing ? 'done' : 'edit');
                setIsEditing(!isEditing);
                setChecked([]);
              }}
            >
              <Button.Label>{isEditing ? 'Done' : 'Edit'}</Button.Label>
            </Button.Root>
            {isEditing ? (
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
            editing={isEditing ? 'leading' : 'none'}
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
                        selected={!isEditing && selected === value}
                        onClick={
                          isEditing
                            ? forwardClick('[role=checkbox]')
                            : undefined
                        }
                      >
                        <List.Leading whileEditing="show">
                          {isEditing ? (
                            <List.Checkbox
                              aria-label={rowTitle}
                              value={value}
                            />
                          ) : null}
                        </List.Leading>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={icon} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          {isEditing ? (
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
                        </List.Content>
                        <List.Trailing>
                          {count === undefined ? null : (
                            <List.Detail>{count}</List.Detail>
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

  return (
    <Component
      isExpanded
      isInline
      controls={[controlContent]}
      id={id}
      log={log}
      stage={isCompact ? 'phone' : 'tablet'}
      state={[stateContent]}
      title="Sidebar, floating or a drawer"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root>
          {isCompact ? (
            <Drawer.Root
              handle={adaptiveDrawer}
              onOpenChange={(isOpen: boolean, { reason }) => {
                addLog(`open: ${String(isOpen)} (${reason})`);
              }}
            >
              <Drawer.SwipeArea />
              <Drawer.Popup
                floating
                aria-label="Sidebar"
                size={300}
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
                              <List.Leading>
                                <List.Image variant="symbol">
                                  <Symbol icon={icon} />
                                </List.Image>
                              </List.Leading>
                              <List.Content>
                                {/* (Chosen: its drawer closes.) */}
                                <List.Title
                                  render={<Drawer.Close />}
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
              </Drawer.Popup>
            </Drawer.Root>
          ) : (
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
          )}
          <Layout.Column clearFloating>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  {isCompact ? (
                    <Toolbar.Leading>
                      <Drawer.Trigger
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
                      </Drawer.Trigger>
                    </Toolbar.Leading>
                  ) : null}
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  {isCompact ? <Toolbar.Trailing /> : null}
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {Array.from(
                        { length: 8 },
                        (_, index) => `${rowTitles[selected]} ${index + 1}`,
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
        The selected row (
        <PartLink
          component="list"
          part="List.Item"
        >
          List.Item selected
        </PartLink>
        ) picks the content column’s page; the app holds the selection (guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>: the list owns it, the content
        reads it).
      </li>
      <li>
        Floating (<code>floating</code>), the content column clear of it (
        <code>clearFloating</code>): its page’s content inset, its background
        running underneath.
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
        />{' '}
        and the content column clear of it (<code>clearFloating</code>).
      </li>
      <li>
        <strong>Demo:</strong> the selection (the app’s state) and the page it
        picks.
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
        On a phone: the sidebar in a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Popup"
        />{' '}
        (<code>floating</code>), from its side; swiped in from that edge (
        <PartLink
          component="drawer"
          part="Drawer.SwipeArea"
        />
        ) or opened by the page’s button (
        <PartLink
          component="drawer"
          part="Drawer.Trigger"
        />
        , linked by a handle); swiped back, or the dimmed content pressed, to
        close.
      </li>
      <li>
        Closing as a row is chosen (its title a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />
        ), its page shown.
      </li>
      <li>
        <strong>Library:</strong> the sidebar in a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Root"
        />
        , its swipe area and trigger linked by a handle, and closing as a row is
        chosen (
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
          part="TextField.Search"
        />
        , styled by the panel) filtering its rows; sections without matches left
        out.
      </li>
      <li>
        <strong>Library:</strong> the search field (
        <PartLink
          component="text-field"
          part="TextField.Search"
        />
        ) styled by the sidebar.
      </li>
      <li>
        <strong>Demo:</strong> the query (the app’s state), filtering the rows
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
        By the window’s size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        : compact below 768px): compact, a drawer with the page’s button to open
        it; regular, floating beside the content.
      </li>
      <li>
        The same sidebar either way (<code>floating</code>): the app renders a{' '}
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
        switch, or choose a layout (its content’s <code>layout</code>).
      </li>
      <li>
        Compact, the sections as a stack’s root page instead: see{' '}
        <a href="navigation/composition#compact-or-regular">Navigation</a>.
      </li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        floating or in a{' '}
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
  InADrawer,
  Search,
  Editing,
  Adaptive,
];
