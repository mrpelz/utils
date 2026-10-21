import './style.css';

import { Collapsible } from '@base-ui/react/collapsible';
import { sfCalendar } from '@bradleyhodges/sfsymbols/sfCalendar';
import { sfClock } from '@bradleyhodges/sfsymbols/sfClock';
import { sfDocument } from '@bradleyhodges/sfsymbols/sfDocument';
import { sfEye } from '@bradleyhodges/sfsymbols/sfEye';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfFolderBadgePlus } from '@bradleyhodges/sfsymbols/sfFolderBadgePlus';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPerson2 } from '@bradleyhodges/sfsymbols/sfPerson2';
import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTextformat } from '@bradleyhodges/sfsymbols/sfTextformat';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { sfTray } from '@bradleyhodges/sfsymbols/sfTray';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  forwardClick,
  Header,
  Layout,
  List,
  Page,
  Sidebar,
  Switch,
  Symbol,
  TextField,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsSidebarColumn,
  propOptionsContent,
  propOptionsContentColumn,
  propOptionsDrawer,
  propOptionsRoot,
  propOptionsSidebar,
} from './props.js';

/**
 * A sidebar (Figma “Sidebars”, iPadOS 26): a floating glass panel (a
 * `Sidebar`, its list of style `sidebar`) in a `Layout`'s first column,
 * regular (an iPad): the layout's `floating` column over the others, the
 * content's column clear of it (`clearFloating`: its page's content inset,
 * its background running underneath).
 */
export const SidebarDemo: FunctionComponent = () => {
  const id = 'sidebar';

  const [log, addLog] = useLog();
  const [
    externalContent,
    externalRoot,
    externalColumn,
    externalSidebar,
    externalContentColumn,
  ] = useProvidedState(id);

  const [selected, setSelected] = useState('Inbox');
  const [showHidden, setShowHidden] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  // Rows with nested ones, collapsed (by their disclosure).
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(() => getPropOptionsSidebarColumn(addLog), [addLog]),
    'column (sidebar)',
    externalColumn,
  );
  const [controlSidebar, propsSidebar, stateSidebar, keySidebar] =
    usePropControl(propOptionsSidebar, 'sidebar', externalSidebar);
  const [
    controlContentColumn,
    propsContentColumn,
    stateContentColumn,
    keyContentColumn,
  ] = usePropControl(
    propOptionsContentColumn,
    'column (content)',
    externalContentColumn,
  );

  return (
    <Component
      inputGuards
      stretch
      id={id}
      log={log}
      title="Sidebar"
      controls={[
        controlContent,
        controlRoot,
        controlColumn,
        controlSidebar,
        controlContentColumn,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateColumn,
        stateSidebar,
        stateContentColumn,
      ]}
    >
      <div className="sidebar-demo-screen">
        <Layout.Root
          key={`${keyRoot}-${keyColumn}-${keySidebar}-${keyContentColumn}`}
          {...propsRoot}
        >
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
            <Sidebar.Root {...propsSidebar}>
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
                    <List.Item selected={selected === 'Inbox'}>
                      <List.Image variant="symbol">
                        <Symbol icon={sfTray} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Inbox');
                          setSelected('Inbox');
                        }}
                      >
                        Inbox
                      </List.Title>
                      <List.Detail>12</List.Detail>
                    </List.Item>
                    <List.Item selected={selected === 'Favorites'}>
                      <List.Image variant="symbol">
                        <Symbol icon={sfHeart} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Favorites');
                          setSelected('Favorites');
                        }}
                      >
                        Favorites
                      </List.Title>
                      <List.Detail>3</List.Detail>
                    </List.Item>
                    <List.Item selected={selected === 'Recents'}>
                      <List.Image variant="symbol">
                        <Symbol icon={sfClock} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Recents');
                          setSelected('Recents');
                        }}
                      >
                        Recents
                      </List.Title>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Folders</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    <List.Item selected={selected === 'Projects'}>
                      <List.Image variant="symbol">
                        <Symbol icon={sfFolder} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Projects');
                          setSelected('Projects');
                        }}
                      >
                        Projects
                      </List.Title>
                      <List.Detail>8</List.Detail>
                      {/* (Its nested rows: shown, or collapsed.) */}
                      <List.Accessory
                        aria-expanded={!collapsed.has('Projects')}
                        aria-label="Projects: nested"
                        render={<button type="button" />}
                        onClick={() => {
                          const next = new Set(collapsed);
                          if (!next.delete('Projects')) next.add('Projects');
                          addLog(
                            `Projects ${next.has('Projects') ? 'collapsed' : 'expanded'}`,
                          );
                          setCollapsed(next);
                        }}
                      >
                        <List.Disclosure
                          data-panel-open={
                            collapsed.has('Projects') ? undefined : ''
                          }
                        />
                      </List.Accessory>
                    </List.Item>
                    {collapsed.has('Projects') ? null : (
                      <List.Item
                        level={1}
                        selected={selected === 'Design'}
                      >
                        <List.Image variant="symbol">
                          <Symbol icon={sfFolder} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Design');
                            setSelected('Design');
                          }}
                        >
                          Design
                        </List.Title>
                        {/* (Its nested rows: shown, or collapsed.) */}
                        <List.Accessory
                          aria-expanded={!collapsed.has('Design')}
                          aria-label="Design: nested"
                          render={<button type="button" />}
                          onClick={() => {
                            const next = new Set(collapsed);
                            if (!next.delete('Design')) next.add('Design');
                            addLog(
                              `Design ${next.has('Design') ? 'collapsed' : 'expanded'}`,
                            );
                            setCollapsed(next);
                          }}
                        >
                          <List.Disclosure
                            data-panel-open={
                              collapsed.has('Design') ? undefined : ''
                            }
                          />
                        </List.Accessory>
                      </List.Item>
                    )}
                    {collapsed.has('Projects') ||
                    collapsed.has('Design') ? null : (
                      <List.Item
                        level={2}
                        selected={selected === 'Drafts'}
                      >
                        <List.Image variant="symbol">
                          <Symbol icon={sfDocument} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Drafts');
                            setSelected('Drafts');
                          }}
                        >
                          Drafts
                        </List.Title>
                        <List.Detail>2</List.Detail>
                      </List.Item>
                    )}
                    {collapsed.has('Projects') ? null : (
                      <List.Item
                        level={1}
                        selected={selected === 'Photos'}
                      >
                        <List.Image variant="symbol">
                          <Symbol icon={sfPhoto} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Photos');
                            setSelected('Photos');
                          }}
                        >
                          Photos
                        </List.Title>
                      </List.Item>
                    )}
                    <List.Item selected={selected === 'Trash'}>
                      <List.Image variant="symbol">
                        <Symbol icon={sfTrash} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Trash');
                          setSelected('Trash');
                        }}
                      >
                        Trash
                      </List.Title>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
                {/* Rows with trailing controls: a switch, a checkmark
                   (choosing), an info button. */}
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Options</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    <List.Item onClick={forwardClick('[role=switch]')}>
                      <List.Image variant="symbol">
                        <Symbol icon={sfEye} />
                      </List.Image>
                      <List.Title>Show Hidden</List.Title>
                      <Switch.Root
                        aria-label="Show Hidden"
                        checked={showHidden}
                        onCheckedChange={(next) => {
                          addLog(`show hidden: ${String(next)}`);
                          setShowHidden(next);
                        }}
                      >
                        <Switch.Thumb />
                      </Switch.Root>
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfTextformat} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('sort by: Name');
                          setSortBy('Name');
                        }}
                      >
                        Sort by Name
                      </List.Title>
                      {sortBy === 'Name' ? <List.Checkmark /> : null}
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfCalendar} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('sort by: Date');
                          setSortBy('Date');
                        }}
                      >
                        Sort by Date
                      </List.Title>
                      {sortBy === 'Date' ? <List.Checkmark /> : null}
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfPerson2} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('select: Shared')}
                      >
                        Shared
                      </List.Title>
                      <List.Accessory
                        aria-label="Info"
                        render={<button type="button" />}
                        onClick={() => addLog('shared info')}
                      >
                        <Symbol icon={sfICircle} />
                      </List.Accessory>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column {...propsContentColumn}>
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
              <Header.Root>
                {/* (Its glass by what's behind it: e.g. the picture.) */}
                <Header.Bar context="adaptive">
                  <Toolbar.Title>
                    <span>{selected}</span>
                  </Toolbar.Title>
                </Header.Bar>
                <Header.LargeTitle>
                  <span>{selected}</span>
                </Header.LargeTitle>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 12 },
                      (_, index) => `Item ${index + 1}`,
                    ).map((item) => (
                      <List.Item key={item}>
                        <List.Title>{item}</List.Title>
                        <List.Detail>{selected}</List.Detail>
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

/**
 * The sidebar, compact (an iPhone): a drawer, swiped in from its edge (the
 * layout's), or opened by the content's button.
 */
export const SidebarCompactDemo: FunctionComponent = () => {
  const id = 'sidebar-compact';

  const [log, addLog] = useLog();
  const [
    externalContent,
    externalRoot,
    externalColumn,
    externalDrawer,
    externalSidebar,
    externalContentColumn,
  ] = useProvidedState(id);

  const [selected, setSelected] = useState('Inbox');
  const [showHidden, setShowHidden] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  // Rows with nested ones, collapsed (by their disclosure).
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  // The drawer (controlled: opened by the content's button, closing as a row
  // is chosen).
  const [open, setOpen] = useState(false);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(() => getPropOptionsSidebarColumn(addLog), [addLog]),
    'column (sidebar)',
    externalColumn,
  );
  const [controlDrawer, propsDrawer, stateDrawer, keyDrawer] = usePropControl(
    propOptionsDrawer,
    'drawer',
    externalDrawer,
    true,
  );
  const [controlSidebar, propsSidebar, stateSidebar, keySidebar] =
    usePropControl(propOptionsSidebar, 'sidebar', externalSidebar);
  const [
    controlContentColumn,
    propsContentColumn,
    stateContentColumn,
    keyContentColumn,
  ] = usePropControl(
    propOptionsContentColumn,
    'column (content)',
    externalContentColumn,
  );

  return (
    <Component
      inputGuards
      stretch
      id={id}
      log={log}
      title="Sidebar (compact)"
      controls={[
        controlContent,
        controlRoot,
        controlColumn,
        controlDrawer,
        controlSidebar,
        controlContentColumn,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateColumn,
        stateDrawer,
        stateSidebar,
        stateContentColumn,
      ]}
    >
      <div className="sidebar-demo-screen">
        <Layout.Root
          key={`${keyRoot}-${keyColumn}-${keyDrawer}-${keySidebar}-${keyContentColumn}`}
          {...propsRoot}
          compact
        >
          {content.background === 'picture' ? (
            <Layout.Background>
              <div
                aria-hidden="true"
                className="sidebar-demo-picture"
              />
            </Layout.Background>
          ) : null}
          <Layout.Drawer
            {...propsDrawer}
            open={open}
            onOpenChange={(next: boolean, { reason }) => {
              addLog(`sidebar open: ${String(next)} (${reason})`);
              setOpen(next);
            }}
          >
            <Layout.DrawerSwipeArea />
            <Layout.Column
              aria-label="Sidebar"
              {...propsColumn}
            >
              <Sidebar.Root {...propsSidebar}>
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
                      <List.Item selected={selected === 'Inbox'}>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTray} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Inbox');
                            setSelected('Inbox');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Inbox
                        </List.Title>
                        <List.Detail>12</List.Detail>
                      </List.Item>
                      <List.Item selected={selected === 'Favorites'}>
                        <List.Image variant="symbol">
                          <Symbol icon={sfHeart} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Favorites');
                            setSelected('Favorites');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Favorites
                        </List.Title>
                        <List.Detail>3</List.Detail>
                      </List.Item>
                      <List.Item selected={selected === 'Recents'}>
                        <List.Image variant="symbol">
                          <Symbol icon={sfClock} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Recents');
                            setSelected('Recents');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Recents
                        </List.Title>
                      </List.Item>
                    </Collapsible.Panel>
                  </Collapsible.Root>
                  <Collapsible.Root
                    defaultOpen
                    render={<List.Section />}
                  >
                    <Collapsible.Trigger
                      nativeButton={false}
                      render={<List.Header prominence="nested" />}
                    >
                      <List.Title>Folders</List.Title>
                      <List.Disclosure />
                    </Collapsible.Trigger>
                    <Collapsible.Panel render={<List.Group />}>
                      <List.Item selected={selected === 'Projects'}>
                        <List.Image variant="symbol">
                          <Symbol icon={sfFolder} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Projects');
                            setSelected('Projects');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Projects
                        </List.Title>
                        <List.Detail>8</List.Detail>
                        {/* (Its nested rows: shown, or collapsed.) */}
                        <List.Accessory
                          aria-expanded={!collapsed.has('Projects')}
                          aria-label="Projects: nested"
                          render={<button type="button" />}
                          onClick={() => {
                            const next = new Set(collapsed);
                            if (!next.delete('Projects')) next.add('Projects');
                            addLog(
                              `Projects ${next.has('Projects') ? 'collapsed' : 'expanded'}`,
                            );
                            setCollapsed(next);
                          }}
                        >
                          <List.Disclosure
                            data-panel-open={
                              collapsed.has('Projects') ? undefined : ''
                            }
                          />
                        </List.Accessory>
                      </List.Item>
                      {collapsed.has('Projects') ? null : (
                        <List.Item
                          level={1}
                          selected={selected === 'Design'}
                        >
                          <List.Image variant="symbol">
                            <Symbol icon={sfFolder} />
                          </List.Image>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Design');
                              setSelected('Design');
                              // (The drawer closes.)
                              setOpen(false);
                            }}
                          >
                            Design
                          </List.Title>
                          {/* (Its nested rows: shown, or collapsed.) */}
                          <List.Accessory
                            aria-expanded={!collapsed.has('Design')}
                            aria-label="Design: nested"
                            render={<button type="button" />}
                            onClick={() => {
                              const next = new Set(collapsed);
                              if (!next.delete('Design')) next.add('Design');
                              addLog(
                                `Design ${next.has('Design') ? 'collapsed' : 'expanded'}`,
                              );
                              setCollapsed(next);
                            }}
                          >
                            <List.Disclosure
                              data-panel-open={
                                collapsed.has('Design') ? undefined : ''
                              }
                            />
                          </List.Accessory>
                        </List.Item>
                      )}
                      {collapsed.has('Projects') ||
                      collapsed.has('Design') ? null : (
                        <List.Item
                          level={2}
                          selected={selected === 'Drafts'}
                        >
                          <List.Image variant="symbol">
                            <Symbol icon={sfDocument} />
                          </List.Image>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Drafts');
                              setSelected('Drafts');
                              // (The drawer closes.)
                              setOpen(false);
                            }}
                          >
                            Drafts
                          </List.Title>
                          <List.Detail>2</List.Detail>
                        </List.Item>
                      )}
                      {collapsed.has('Projects') ? null : (
                        <List.Item
                          level={1}
                          selected={selected === 'Photos'}
                        >
                          <List.Image variant="symbol">
                            <Symbol icon={sfPhoto} />
                          </List.Image>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Photos');
                              setSelected('Photos');
                              // (The drawer closes.)
                              setOpen(false);
                            }}
                          >
                            Photos
                          </List.Title>
                        </List.Item>
                      )}
                      <List.Item selected={selected === 'Trash'}>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTrash} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Trash');
                            setSelected('Trash');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Trash
                        </List.Title>
                      </List.Item>
                    </Collapsible.Panel>
                  </Collapsible.Root>
                  {/* Rows with trailing controls: a switch, a checkmark
                   (choosing), an info button. */}
                  <Collapsible.Root
                    defaultOpen
                    render={<List.Section />}
                  >
                    <Collapsible.Trigger
                      nativeButton={false}
                      render={<List.Header prominence="nested" />}
                    >
                      <List.Title>Options</List.Title>
                      <List.Disclosure />
                    </Collapsible.Trigger>
                    <Collapsible.Panel render={<List.Group />}>
                      <List.Item onClick={forwardClick('[role=switch]')}>
                        <List.Image variant="symbol">
                          <Symbol icon={sfEye} />
                        </List.Image>
                        <List.Title>Show Hidden</List.Title>
                        <Switch.Root
                          aria-label="Show Hidden"
                          checked={showHidden}
                          onCheckedChange={(next) => {
                            addLog(`show hidden: ${String(next)}`);
                            setShowHidden(next);
                          }}
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTextformat} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Name');
                            setSortBy('Name');
                          }}
                        >
                          Sort by Name
                        </List.Title>
                        {sortBy === 'Name' ? <List.Checkmark /> : null}
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfCalendar} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Date');
                            setSortBy('Date');
                          }}
                        >
                          Sort by Date
                        </List.Title>
                        {sortBy === 'Date' ? <List.Checkmark /> : null}
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfPerson2} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('select: Shared')}
                        >
                          Shared
                        </List.Title>
                        <List.Accessory
                          aria-label="Info"
                          render={<button type="button" />}
                          onClick={() => addLog('shared info')}
                        >
                          <Symbol icon={sfICircle} />
                        </List.Accessory>
                      </List.Item>
                    </Collapsible.Panel>
                  </Collapsible.Root>
                </List.Root>
              </Sidebar.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column {...propsContentColumn}>
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
              <Header.Root>
                {/* (Its glass by what's behind it: e.g. the picture.) */}
                <Header.Bar context="adaptive">
                  <Toolbar.Leading>
                    <Toolbar.Button
                      aria-label="Show Sidebar"
                      shape="circle"
                      onClick={() => {
                        addLog('show sidebar');
                        setOpen(true);
                      }}
                    >
                      <Button.Icon>
                        <Symbol icon={sfListBullet} />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{selected}</span>
                  </Toolbar.Title>
                  {/* (Balancing it: the title centered.) */}
                  <Toolbar.Trailing />
                </Header.Bar>
                <Header.LargeTitle>
                  <span>{selected}</span>
                </Header.LargeTitle>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 12 },
                      (_, index) => `Item ${index + 1}`,
                    ).map((item) => (
                      <List.Item key={item}>
                        <List.Title>{item}</List.Title>
                        <List.Detail>{selected}</List.Detail>
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

/**
 * The sidebar while editing (Figma “Edit Button”): its rows selected by
 * selection circles before their symbols.
 */
export const SidebarEditingDemo: FunctionComponent = () => {
  const id = 'sidebar-editing';

  const [log, addLog] = useLog();

  const [selected, setSelected] = useState('Inbox');
  const [showHidden, setShowHidden] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  // Rows with nested ones, collapsed (by their disclosure).
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());

  return (
    <Component
      inputGuards
      stretch
      id={id}
      log={log}
      title="Sidebar (Editing)"
    >
      <div className="sidebar-demo-screen">
        <Layout.Root>
          <Layout.Background>
            <div
              aria-hidden="true"
              className="sidebar-demo-picture"
            />
          </Layout.Background>
          <Layout.Column
            floating
            aria-label="Sidebar"
            defaultSize={336}
          >
            <Sidebar.Root>
              <Sidebar.Toolbar>
                <Button.Root
                  tint="var(--uikit-glass-content)"
                  variant="borderless"
                  onClick={() => addLog('edit')}
                >
                  <Button.Label>Done</Button.Label>
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
                    <List.Item selected={selected === 'Inbox'}>
                      <List.Checkbox aria-label="Inbox" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfTray} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Inbox');
                          setSelected('Inbox');
                        }}
                      >
                        Inbox
                      </List.Title>
                      <List.Detail>12</List.Detail>
                    </List.Item>
                    <List.Item selected={selected === 'Favorites'}>
                      <List.Checkbox aria-label="Favorites" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfHeart} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Favorites');
                          setSelected('Favorites');
                        }}
                      >
                        Favorites
                      </List.Title>
                      <List.Detail>3</List.Detail>
                    </List.Item>
                    <List.Item selected={selected === 'Recents'}>
                      <List.Checkbox aria-label="Recents" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfClock} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Recents');
                          setSelected('Recents');
                        }}
                      >
                        Recents
                      </List.Title>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Folders</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    <List.Item selected={selected === 'Projects'}>
                      <List.Checkbox aria-label="Projects" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfFolder} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Projects');
                          setSelected('Projects');
                        }}
                      >
                        Projects
                      </List.Title>
                      <List.Detail>8</List.Detail>
                      {/* (Its nested rows: shown, or collapsed.) */}
                      <List.Accessory
                        aria-expanded={!collapsed.has('Projects')}
                        aria-label="Projects: nested"
                        render={<button type="button" />}
                        onClick={() => {
                          const next = new Set(collapsed);
                          if (!next.delete('Projects')) next.add('Projects');
                          addLog(
                            `Projects ${next.has('Projects') ? 'collapsed' : 'expanded'}`,
                          );
                          setCollapsed(next);
                        }}
                      >
                        <List.Disclosure
                          data-panel-open={
                            collapsed.has('Projects') ? undefined : ''
                          }
                        />
                      </List.Accessory>
                    </List.Item>
                    {collapsed.has('Projects') ? null : (
                      <List.Item
                        level={1}
                        selected={selected === 'Design'}
                      >
                        <List.Checkbox aria-label="Design" />
                        <List.Image variant="symbol">
                          <Symbol icon={sfFolder} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Design');
                            setSelected('Design');
                          }}
                        >
                          Design
                        </List.Title>
                        {/* (Its nested rows: shown, or collapsed.) */}
                        <List.Accessory
                          aria-expanded={!collapsed.has('Design')}
                          aria-label="Design: nested"
                          render={<button type="button" />}
                          onClick={() => {
                            const next = new Set(collapsed);
                            if (!next.delete('Design')) next.add('Design');
                            addLog(
                              `Design ${next.has('Design') ? 'collapsed' : 'expanded'}`,
                            );
                            setCollapsed(next);
                          }}
                        >
                          <List.Disclosure
                            data-panel-open={
                              collapsed.has('Design') ? undefined : ''
                            }
                          />
                        </List.Accessory>
                      </List.Item>
                    )}
                    {collapsed.has('Projects') ||
                    collapsed.has('Design') ? null : (
                      <List.Item
                        level={2}
                        selected={selected === 'Drafts'}
                      >
                        <List.Checkbox aria-label="Drafts" />
                        <List.Image variant="symbol">
                          <Symbol icon={sfDocument} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Drafts');
                            setSelected('Drafts');
                          }}
                        >
                          Drafts
                        </List.Title>
                        <List.Detail>2</List.Detail>
                      </List.Item>
                    )}
                    {collapsed.has('Projects') ? null : (
                      <List.Item
                        level={1}
                        selected={selected === 'Photos'}
                      >
                        <List.Checkbox aria-label="Photos" />
                        <List.Image variant="symbol">
                          <Symbol icon={sfPhoto} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Photos');
                            setSelected('Photos');
                          }}
                        >
                          Photos
                        </List.Title>
                      </List.Item>
                    )}
                    <List.Item selected={selected === 'Trash'}>
                      <List.Checkbox aria-label="Trash" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfTrash} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('select: Trash');
                          setSelected('Trash');
                        }}
                      >
                        Trash
                      </List.Title>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
                {/* Rows with trailing controls: a switch, a checkmark
                   (choosing), an info button. */}
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Options</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    <List.Item onClick={forwardClick('[role=switch]')}>
                      <List.Checkbox aria-label="Show Hidden" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfEye} />
                      </List.Image>
                      <List.Title>Show Hidden</List.Title>
                      <Switch.Root
                        aria-label="Show Hidden"
                        checked={showHidden}
                        onCheckedChange={(next) => {
                          addLog(`show hidden: ${String(next)}`);
                          setShowHidden(next);
                        }}
                      >
                        <Switch.Thumb />
                      </Switch.Root>
                    </List.Item>
                    <List.Item>
                      <List.Checkbox aria-label="Sort by Name" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfTextformat} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('sort by: Name');
                          setSortBy('Name');
                        }}
                      >
                        Sort by Name
                      </List.Title>
                      {sortBy === 'Name' ? <List.Checkmark /> : null}
                    </List.Item>
                    <List.Item>
                      <List.Checkbox aria-label="Sort by Date" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfCalendar} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('sort by: Date');
                          setSortBy('Date');
                        }}
                      >
                        Sort by Date
                      </List.Title>
                      {sortBy === 'Date' ? <List.Checkmark /> : null}
                    </List.Item>
                    <List.Item>
                      <List.Checkbox aria-label="Shared" />
                      <List.Image variant="symbol">
                        <Symbol icon={sfPerson2} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog('select: Shared')}
                      >
                        Shared
                      </List.Title>
                      <List.Accessory
                        aria-label="Info"
                        render={<button type="button" />}
                        onClick={() => addLog('shared info')}
                      >
                        <Symbol icon={sfICircle} />
                      </List.Accessory>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <Page.Root className="sidebar-demo-transparent">
              <Header.Root>
                {/* (Its glass by what's behind it: e.g. the picture.) */}
                <Header.Bar context="adaptive">
                  <Toolbar.Title>
                    <span>{selected}</span>
                  </Toolbar.Title>
                </Header.Bar>
                <Header.LargeTitle>
                  <span>{selected}</span>
                </Header.LargeTitle>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 12 },
                      (_, index) => `Item ${index + 1}`,
                    ).map((item) => (
                      <List.Item key={item}>
                        <List.Title>{item}</List.Title>
                        <List.Detail>{selected}</List.Detail>
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
