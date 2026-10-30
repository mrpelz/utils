import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Collapsible,
  Drawer,
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
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfCalendar,
  sfClock,
  sfDocument,
  sfEye,
  sfFolder,
  sfFolderBadgePlus,
  sfHeart,
  sfICircle,
  sfListBullet,
  sfMagnifyingglass,
  sfPerson2,
  sfPhoto,
  sfSquareAndPencil,
  sfTextformat,
  sfTrash,
  sfTray,
} from '../../tooling/icons.js';
import { propOptionsPopup } from '../drawer/props.js';
import {
  getPropOptionsSidebarColumn,
  propOptionsContent,
  propOptionsContentColumn,
  propOptionsDrawer,
  propOptionsRoot,
  propOptionsSidebar,
} from './props.js';

/**
 * A sidebar: a floating glass panel (a
 * `Sidebar`, its list of style `sidebar`) in a `Layout`'s first column,
 * regular (a tablet): the layout's `floating` column over the others, the
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
  const [isHiddenShown, setIsHiddenShown] = useState(false);
  const [sortBy, setSortBy] = useState('Name');

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsRoot,
    { external: externalRoot, title: 'root' },
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    propOptionsPopup,
    { external: externalColumn, title: 'Drawer.Popup' },
  );
  const [controlSidebar, propsSidebar, stateSidebar, keySidebar] =
    usePropControl(propOptionsSidebar, {
      external: externalSidebar,
      title: 'sidebar',
    });
  const [
    controlContentColumn,
    propsContentColumn,
    stateContentColumn,
    keyContentColumn,
  ] = usePropControl(propOptionsContentColumn, {
    external: externalContentColumn,
    title: 'column (content)',
  });

  return (
    <Component
      hasInputGuards
      id={id}
      log={log}
      stage="tablet"
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
      <Viewport.Content safeArea="none">
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
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTray} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Inbox');
                            setSelected('Inbox');
                          }}
                        >
                          Inbox
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        <List.Detail>12</List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item selected={selected === 'Favorites'}>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfHeart} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Favorites');
                            setSelected('Favorites');
                          }}
                        >
                          Favorites
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        <List.Detail>3</List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item selected={selected === 'Recents'}>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfClock} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Recents');
                            setSelected('Recents');
                          }}
                        >
                          Recents
                        </List.Title>
                      </List.Content>
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
                    <List.CollapsibleRoot defaultOpen>
                      <List.Item selected={selected === 'Projects'}>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfFolder} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Projects');
                              setSelected('Projects');
                            }}
                          >
                            Projects
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.Detail>8</List.Detail>
                          <List.CollapsibleTrigger
                            aria-label="Projects: nested"
                            render={
                              <List.Accessory
                                render={<button type="button" />}
                              />
                            }
                          >
                            <List.Disclosure />
                          </List.CollapsibleTrigger>
                        </List.Trailing>
                      </List.Item>
                      <List.CollapsiblePanel>
                        <List.CollapsibleRoot defaultOpen>
                          <List.Item
                            level={1}
                            selected={selected === 'Design'}
                          >
                            <List.Leading>
                              <List.Image variant="symbol">
                                <Symbol icon={sfFolder} />
                              </List.Image>
                            </List.Leading>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => {
                                  addLog('select: Design');
                                  setSelected('Design');
                                }}
                              >
                                Design
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.CollapsibleTrigger
                                aria-label="Design: nested"
                                render={
                                  <List.Accessory
                                    render={<button type="button" />}
                                  />
                                }
                              >
                                <List.Disclosure />
                              </List.CollapsibleTrigger>
                            </List.Trailing>
                          </List.Item>
                          <List.CollapsiblePanel>
                            <List.Item
                              level={2}
                              selected={selected === 'Drafts'}
                            >
                              <List.Leading>
                                <List.Image variant="symbol">
                                  <Symbol icon={sfDocument} />
                                </List.Image>
                              </List.Leading>
                              <List.Content>
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => {
                                    addLog('select: Drafts');
                                    setSelected('Drafts');
                                  }}
                                >
                                  Drafts
                                </List.Title>
                              </List.Content>
                              <List.Trailing>
                                <List.Detail>2</List.Detail>
                              </List.Trailing>
                            </List.Item>
                          </List.CollapsiblePanel>
                        </List.CollapsibleRoot>
                        <List.Item
                          level={1}
                          selected={selected === 'Photos'}
                        >
                          <List.Leading>
                            <List.Image variant="symbol">
                              <Symbol icon={sfPhoto} />
                            </List.Image>
                          </List.Leading>
                          <List.Content>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => {
                                addLog('select: Photos');
                                setSelected('Photos');
                              }}
                            >
                              Photos
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      </List.CollapsiblePanel>
                    </List.CollapsibleRoot>
                    <List.Item selected={selected === 'Trash'}>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTrash} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Trash');
                            setSelected('Trash');
                          }}
                        >
                          Trash
                        </List.Title>
                      </List.Content>
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
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfEye} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title>Show Hidden</List.Title>
                      </List.Content>
                      <List.Trailing>
                        <Switch.Root
                          aria-label="Show Hidden"
                          checked={isHiddenShown}
                          onCheckedChange={(isChecked) => {
                            addLog(`show hidden: ${String(isChecked)}`);
                            setIsHiddenShown(isChecked);
                          }}
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Trailing>
                    </List.Item>
                    <List.Item>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTextformat} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Name');
                            setSortBy('Name');
                          }}
                        >
                          Sort by Name
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        {sortBy === 'Name' ? <List.Checkmark /> : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfCalendar} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Date');
                            setSortBy('Date');
                          }}
                        >
                          Sort by Date
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        {sortBy === 'Date' ? <List.Checkmark /> : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfPerson2} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('select: Shared')}
                        >
                          Shared
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        <List.Accessory
                          aria-label="Info"
                          render={<button type="button" />}
                          onClick={() => addLog('shared info')}
                        >
                          <Symbol icon={sfICircle} />
                        </List.Accessory>
                      </List.Trailing>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
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
                    <span>{selected}</span>
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
                {/* (Its glass by what's behind it: e.g. the picture.) */}

                <Header.LargeTitle>
                  <span>{selected}</span>
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
                          <List.Trailing>
                            <List.Detail>{selected}</List.Detail>
                          </List.Trailing>
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

/**
 * The sidebar, compact (a phone): a drawer, swiped in from its edge (the
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
  const [isHiddenShown, setIsHiddenShown] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  // The drawer (controlled: opened by the content's button, closing as a row
  // is chosen).
  const [isOpen, setIsOpen] = useState(false);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsRoot,
    { external: externalRoot, title: 'root' },
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(() => getPropOptionsSidebarColumn(addLog), [addLog]),
    { external: externalColumn, title: 'column (sidebar)' },
  );
  const [controlDrawer, propsDrawer, stateDrawer, keyDrawer] = usePropControl(
    propOptionsDrawer,
    { external: externalDrawer, isOpen: true, title: 'drawer' },
  );
  const [controlSidebar, propsSidebar, stateSidebar, keySidebar] =
    usePropControl(propOptionsSidebar, {
      external: externalSidebar,
      title: 'sidebar',
    });
  const [
    controlContentColumn,
    propsContentColumn,
    stateContentColumn,
    keyContentColumn,
  ] = usePropControl(propOptionsContentColumn, {
    external: externalContentColumn,
    title: 'column (content)',
  });

  return (
    <Component
      hasInputGuards
      id={id}
      log={log}
      stage="tablet"
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
      <Viewport.Content safeArea="none">
        <Layout.Root
          key={`${keyRoot}-${keyColumn}-${keyDrawer}-${keySidebar}-${keyContentColumn}`}
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
          <Drawer.Root
            {...propsDrawer}
            open={isOpen}
            onOpenChange={(isNextOpen: boolean, { reason }) => {
              addLog(`sidebar open: ${String(isNextOpen)} (${reason})`);
              setIsOpen(isNextOpen);
            }}
          >
            <Drawer.SwipeArea />
            <Drawer.Popup
              key={keyColumn}
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
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfTray} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Inbox');
                              setSelected('Inbox');
                              // (The drawer closes.)
                              setIsOpen(false);
                            }}
                          >
                            Inbox
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.Detail>12</List.Detail>
                        </List.Trailing>
                      </List.Item>
                      <List.Item selected={selected === 'Favorites'}>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfHeart} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Favorites');
                              setSelected('Favorites');
                              // (The drawer closes.)
                              setIsOpen(false);
                            }}
                          >
                            Favorites
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.Detail>3</List.Detail>
                        </List.Trailing>
                      </List.Item>
                      <List.Item selected={selected === 'Recents'}>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfClock} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Recents');
                              setSelected('Recents');
                              // (The drawer closes.)
                              setIsOpen(false);
                            }}
                          >
                            Recents
                          </List.Title>
                        </List.Content>
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
                      <List.CollapsibleRoot defaultOpen>
                        <List.Item selected={selected === 'Projects'}>
                          <List.Leading>
                            <List.Image variant="symbol">
                              <Symbol icon={sfFolder} />
                            </List.Image>
                          </List.Leading>
                          <List.Content>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => {
                                addLog('select: Projects');
                                setSelected('Projects');
                                // (The drawer closes.)
                                setIsOpen(false);
                              }}
                            >
                              Projects
                            </List.Title>
                          </List.Content>
                          <List.Trailing>
                            <List.Detail>8</List.Detail>
                            <List.CollapsibleTrigger
                              aria-label="Projects: nested"
                              render={
                                <List.Accessory
                                  render={<button type="button" />}
                                />
                              }
                            >
                              <List.Disclosure />
                            </List.CollapsibleTrigger>
                          </List.Trailing>
                        </List.Item>
                        <List.CollapsiblePanel>
                          <List.CollapsibleRoot defaultOpen>
                            <List.Item
                              level={1}
                              selected={selected === 'Design'}
                            >
                              <List.Leading>
                                <List.Image variant="symbol">
                                  <Symbol icon={sfFolder} />
                                </List.Image>
                              </List.Leading>
                              <List.Content>
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => {
                                    addLog('select: Design');
                                    setSelected('Design');
                                    // (The drawer closes.)
                                    setIsOpen(false);
                                  }}
                                >
                                  Design
                                </List.Title>
                              </List.Content>
                              <List.Trailing>
                                <List.CollapsibleTrigger
                                  aria-label="Design: nested"
                                  render={
                                    <List.Accessory
                                      render={<button type="button" />}
                                    />
                                  }
                                >
                                  <List.Disclosure />
                                </List.CollapsibleTrigger>
                              </List.Trailing>
                            </List.Item>
                            <List.CollapsiblePanel>
                              <List.Item
                                level={2}
                                selected={selected === 'Drafts'}
                              >
                                <List.Leading>
                                  <List.Image variant="symbol">
                                    <Symbol icon={sfDocument} />
                                  </List.Image>
                                </List.Leading>
                                <List.Content>
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => {
                                      addLog('select: Drafts');
                                      setSelected('Drafts');
                                      // (The drawer closes.)
                                      setIsOpen(false);
                                    }}
                                  >
                                    Drafts
                                  </List.Title>
                                </List.Content>
                                <List.Trailing>
                                  <List.Detail>2</List.Detail>
                                </List.Trailing>
                              </List.Item>
                            </List.CollapsiblePanel>
                          </List.CollapsibleRoot>
                          <List.Item
                            level={1}
                            selected={selected === 'Photos'}
                          >
                            <List.Leading>
                              <List.Image variant="symbol">
                                <Symbol icon={sfPhoto} />
                              </List.Image>
                            </List.Leading>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => {
                                  addLog('select: Photos');
                                  setSelected('Photos');
                                  // (The drawer closes.)
                                  setIsOpen(false);
                                }}
                              >
                                Photos
                              </List.Title>
                            </List.Content>
                          </List.Item>
                        </List.CollapsiblePanel>
                      </List.CollapsibleRoot>
                      <List.Item selected={selected === 'Trash'}>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfTrash} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Trash');
                              setSelected('Trash');
                              // (The drawer closes.)
                              setIsOpen(false);
                            }}
                          >
                            Trash
                          </List.Title>
                        </List.Content>
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
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfEye} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title>Show Hidden</List.Title>
                        </List.Content>
                        <List.Trailing>
                          <Switch.Root
                            aria-label="Show Hidden"
                            checked={isHiddenShown}
                            onCheckedChange={(isChecked) => {
                              addLog(`show hidden: ${String(isChecked)}`);
                              setIsHiddenShown(isChecked);
                            }}
                          >
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Trailing>
                      </List.Item>
                      <List.Item>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfTextformat} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('sort by: Name');
                              setSortBy('Name');
                            }}
                          >
                            Sort by Name
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          {sortBy === 'Name' ? <List.Checkmark /> : null}
                        </List.Trailing>
                      </List.Item>
                      <List.Item>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfCalendar} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('sort by: Date');
                              setSortBy('Date');
                            }}
                          >
                            Sort by Date
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          {sortBy === 'Date' ? <List.Checkmark /> : null}
                        </List.Trailing>
                      </List.Item>
                      <List.Item>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfPerson2} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => addLog('select: Shared')}
                          >
                            Shared
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.Accessory
                            aria-label="Info"
                            render={<button type="button" />}
                            onClick={() => addLog('shared info')}
                          >
                            <Symbol icon={sfICircle} />
                          </List.Accessory>
                        </List.Trailing>
                      </List.Item>
                    </Collapsible.Panel>
                  </Collapsible.Root>
                </List.Root>
              </Sidebar.Root>
            </Drawer.Popup>
          </Drawer.Root>
          <Layout.Column {...propsContentColumn}>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Leading>
                    <Toolbar.Button
                      aria-label="Show Sidebar"
                      shape="circle"
                      onClick={() => {
                        addLog('show sidebar');
                        setIsOpen(true);
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
                {/* (Its glass by what's behind it: e.g. the picture.) */}

                <Header.LargeTitle>
                  <span>{selected}</span>
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
                          <List.Trailing>
                            <List.Detail>{selected}</List.Detail>
                          </List.Trailing>
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

/**
 * The sidebar while editing: its rows selected by
 * selection circles before their symbols.
 */
export const SidebarEditingDemo: FunctionComponent = () => {
  const id = 'sidebar-editing';

  const [log, addLog] = useLog();

  const [selected, setSelected] = useState('Inbox');
  const [isHiddenShown, setIsHiddenShown] = useState(false);
  const [sortBy, setSortBy] = useState('Name');

  return (
    <Component
      hasInputGuards
      id={id}
      log={log}
      stage="tablet"
      title="Sidebar (Editing)"
    >
      <Viewport.Content safeArea="none">
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
                      <List.Leading>
                        <List.Checkbox aria-label="Inbox" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTray} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Inbox');
                            setSelected('Inbox');
                          }}
                        >
                          Inbox
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        <List.Detail>12</List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item selected={selected === 'Favorites'}>
                      <List.Leading>
                        <List.Checkbox aria-label="Favorites" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfHeart} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Favorites');
                            setSelected('Favorites');
                          }}
                        >
                          Favorites
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        <List.Detail>3</List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item selected={selected === 'Recents'}>
                      <List.Leading>
                        <List.Checkbox aria-label="Recents" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfClock} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Recents');
                            setSelected('Recents');
                          }}
                        >
                          Recents
                        </List.Title>
                      </List.Content>
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
                    <List.CollapsibleRoot defaultOpen>
                      <List.Item selected={selected === 'Projects'}>
                        <List.Leading>
                          <List.Checkbox aria-label="Projects" />
                        </List.Leading>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfFolder} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('select: Projects');
                              setSelected('Projects');
                            }}
                          >
                            Projects
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.Detail>8</List.Detail>
                          <List.CollapsibleTrigger
                            aria-label="Projects: nested"
                            render={
                              <List.Accessory
                                render={<button type="button" />}
                              />
                            }
                          >
                            <List.Disclosure />
                          </List.CollapsibleTrigger>
                        </List.Trailing>
                      </List.Item>
                      <List.CollapsiblePanel>
                        <List.CollapsibleRoot defaultOpen>
                          <List.Item
                            level={1}
                            selected={selected === 'Design'}
                          >
                            <List.Leading>
                              <List.Checkbox aria-label="Design" />
                            </List.Leading>
                            <List.Leading>
                              <List.Image variant="symbol">
                                <Symbol icon={sfFolder} />
                              </List.Image>
                            </List.Leading>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => {
                                  addLog('select: Design');
                                  setSelected('Design');
                                }}
                              >
                                Design
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.CollapsibleTrigger
                                aria-label="Design: nested"
                                render={
                                  <List.Accessory
                                    render={<button type="button" />}
                                  />
                                }
                              >
                                <List.Disclosure />
                              </List.CollapsibleTrigger>
                            </List.Trailing>
                          </List.Item>
                          <List.CollapsiblePanel>
                            <List.Item
                              level={2}
                              selected={selected === 'Drafts'}
                            >
                              <List.Leading>
                                <List.Checkbox aria-label="Drafts" />
                              </List.Leading>
                              <List.Leading>
                                <List.Image variant="symbol">
                                  <Symbol icon={sfDocument} />
                                </List.Image>
                              </List.Leading>
                              <List.Content>
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => {
                                    addLog('select: Drafts');
                                    setSelected('Drafts');
                                  }}
                                >
                                  Drafts
                                </List.Title>
                              </List.Content>
                              <List.Trailing>
                                <List.Detail>2</List.Detail>
                              </List.Trailing>
                            </List.Item>
                          </List.CollapsiblePanel>
                        </List.CollapsibleRoot>
                        <List.Item
                          level={1}
                          selected={selected === 'Photos'}
                        >
                          <List.Leading>
                            <List.Checkbox aria-label="Photos" />
                          </List.Leading>
                          <List.Leading>
                            <List.Image variant="symbol">
                              <Symbol icon={sfPhoto} />
                            </List.Image>
                          </List.Leading>
                          <List.Content>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => {
                                addLog('select: Photos');
                                setSelected('Photos');
                              }}
                            >
                              Photos
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      </List.CollapsiblePanel>
                    </List.CollapsibleRoot>
                    <List.Item selected={selected === 'Trash'}>
                      <List.Leading>
                        <List.Checkbox aria-label="Trash" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTrash} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Trash');
                            setSelected('Trash');
                          }}
                        >
                          Trash
                        </List.Title>
                      </List.Content>
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
                      <List.Leading>
                        <List.Checkbox aria-label="Show Hidden" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfEye} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title>Show Hidden</List.Title>
                      </List.Content>
                      <List.Trailing>
                        <Switch.Root
                          aria-label="Show Hidden"
                          checked={isHiddenShown}
                          onCheckedChange={(isChecked) => {
                            addLog(`show hidden: ${String(isChecked)}`);
                            setIsHiddenShown(isChecked);
                          }}
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Trailing>
                    </List.Item>
                    <List.Item>
                      <List.Leading>
                        <List.Checkbox aria-label="Sort by Name" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfTextformat} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Name');
                            setSortBy('Name');
                          }}
                        >
                          Sort by Name
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        {sortBy === 'Name' ? <List.Checkmark /> : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item>
                      <List.Leading>
                        <List.Checkbox aria-label="Sort by Date" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfCalendar} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Date');
                            setSortBy('Date');
                          }}
                        >
                          Sort by Date
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        {sortBy === 'Date' ? <List.Checkmark /> : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item>
                      <List.Leading>
                        <List.Checkbox aria-label="Shared" />
                      </List.Leading>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={sfPerson2} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog('select: Shared')}
                        >
                          Shared
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        <List.Accessory
                          aria-label="Info"
                          render={<button type="button" />}
                          onClick={() => addLog('shared info')}
                        >
                          <Symbol icon={sfICircle} />
                        </List.Accessory>
                      </List.Trailing>
                    </List.Item>
                  </Collapsible.Panel>
                </Collapsible.Root>
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Title>
                    <span>{selected}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root className="sidebar-demo-transparent">
                <Viewport.Padding edge="block-start" />
                {/* (Its glass by what's behind it: e.g. the picture.) */}

                <Header.LargeTitle>
                  <span>{selected}</span>
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
                          <List.Trailing>
                            <List.Detail>{selected}</List.Detail>
                          </List.Trailing>
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
