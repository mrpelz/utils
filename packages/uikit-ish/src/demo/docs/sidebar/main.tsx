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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
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
import { partPropMaps } from '../part-options.js';
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
    useMemo(() => getPropOptionsSidebarColumn(addLog), [addLog]),
    { external: externalColumn, title: 'column (sidebar)' },
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
            'Collapsible.Panel': ['render'],
            'Collapsible.Root': ['defaultOpen', 'render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'Header.LargeTitle': [],
            'List.Accessory': ['aria-label', 'onClick', 'render'],
            'List.Checkmark': [],
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': [],
            'List.CollapsibleTrigger': ['aria-label', 'render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['level', 'onClick', 'selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': ['background', 'className'],
            'Sidebar.Toolbar': [],
            'Sidebar.ToolbarGroup': [],
            'Switch.Root': ['aria-label', 'checked', 'onCheckedChange'],
            'Switch.Thumb': [],
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
        partControls,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateColumn,
        stateSidebar,
        stateContentColumn,
        partState,
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
          key={`${keyRoot}-${keyColumn}-${keySidebar}-${keyContentColumn}`}
          {...propsRoot}
          // (On the picture: no line between the columns.)
          hideSeparators={content.background === 'picture'}
        >
          <Layout.Column
            aria-label="Sidebar"
            {...propsColumn}
          >
            <Sidebar.Root {...propsSidebar}>
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
                      selected={selected === 'Inbox'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfTray}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Inbox');
                            setSelected('Inbox');
                          }}
                        >
                          Inbox
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Detail {...partProps['List.Detail']}>
                          12
                        </List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Favorites'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfHeart}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Favorites');
                            setSelected('Favorites');
                          }}
                        >
                          Favorites
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Detail {...partProps['List.Detail']}>
                          3
                        </List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Recents'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfClock}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
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
                            onClick={() => {
                              addLog('select: Projects');
                              setSelected('Projects');
                            }}
                          >
                            Projects
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <List.Detail {...partProps['List.Detail']}>
                            8
                          </List.Detail>
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
                        <List.CollapsibleRoot
                          {...partProps['List.CollapsibleRoot']}
                          defaultOpen
                        >
                          <List.Item
                            {...partProps['List.Item']}
                            level={1}
                            selected={selected === 'Design'}
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
                                onClick={() => {
                                  addLog('select: Design');
                                  setSelected('Design');
                                }}
                              >
                                Design
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.CollapsibleTrigger
                                {...partProps['List.CollapsibleTrigger']}
                                aria-label="Design: nested"
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
                              selected={selected === 'Drafts'}
                            >
                              <List.Leading {...partProps['List.Leading']}>
                                <List.Image
                                  {...partProps['List.Image']}
                                  variant="symbol"
                                >
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={sfDocument}
                                  />
                                </List.Image>
                              </List.Leading>
                              <List.Content {...partProps['List.Content']}>
                                <List.Title
                                  {...partProps['List.Title']}
                                  render={<button type="button" />}
                                  onClick={() => {
                                    addLog('select: Drafts');
                                    setSelected('Drafts');
                                  }}
                                >
                                  Drafts
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                <List.Detail {...partProps['List.Detail']}>
                                  2
                                </List.Detail>
                              </List.Trailing>
                            </List.Item>
                          </List.CollapsiblePanel>
                        </List.CollapsibleRoot>
                        <List.Item
                          {...partProps['List.Item']}
                          level={1}
                          selected={selected === 'Photos'}
                        >
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfPhoto}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
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
                      Options
                    </List.Title>
                    <List.Disclosure {...partProps['List.Disclosure']} />
                  </Collapsible.Trigger>
                  <Collapsible.Panel
                    {...partProps['Collapsible.Panel']}
                    render={<List.Group {...partProps['List.Group']} />}
                  >
                    <List.Item
                      {...partProps['List.Item']}
                      onClick={forwardClick('[role=switch]')}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfEye}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Show Hidden
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <Switch.Root
                          {...partProps['Switch.Root']}
                          aria-label="Show Hidden"
                          checked={isHiddenShown}
                          onCheckedChange={(isChecked) => {
                            addLog(`show hidden: ${String(isChecked)}`);
                            setIsHiddenShown(isChecked);
                          }}
                        >
                          <Switch.Thumb {...partProps['Switch.Thumb']} />
                        </Switch.Root>
                      </List.Trailing>
                    </List.Item>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfTextformat}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Name');
                            setSortBy('Name');
                          }}
                        >
                          Sort by Name
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        {sortBy === 'Name' ? (
                          <List.Checkmark {...partProps['List.Checkmark']} />
                        ) : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfCalendar}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Date');
                            setSortBy('Date');
                          }}
                        >
                          Sort by Date
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        {sortBy === 'Date' ? (
                          <List.Checkmark {...partProps['List.Checkmark']} />
                        ) : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfPerson2}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('select: Shared')}
                        >
                          Shared
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Accessory
                          {...partProps['List.Accessory']}
                          aria-label="Info"
                          render={<button type="button" />}
                          onClick={() => addLog('shared info')}
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfICircle}
                          />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{selected}</span>
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
                {/* (Its glass by what's behind it: e.g. the picture.) */}

                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>{selected}</span>
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
                          <List.Trailing {...partProps['List.Trailing']}>
                            <List.Detail {...partProps['List.Detail']}>
                              {selected}
                            </List.Detail>
                          </List.Trailing>
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
            'Collapsible.Panel': ['render'],
            'Collapsible.Root': ['defaultOpen', 'render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'Drawer.SwipeArea': [],
            'Header.LargeTitle': [],
            'List.Accessory': ['aria-label', 'onClick', 'render'],
            'List.Checkmark': [],
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': [],
            'List.CollapsibleTrigger': ['aria-label', 'render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['level', 'onClick', 'selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': ['background', 'className'],
            'Sidebar.Toolbar': [],
            'Sidebar.ToolbarGroup': [],
            'Switch.Root': ['aria-label', 'checked', 'onCheckedChange'],
            'Switch.Thumb': [],
            'TextField.Clear': [],
            'TextField.Control': ['aria-label', 'placeholder', 'type'],
            'TextField.Frame': [],
            'TextField.Root': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['context', 'placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
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
        partControls,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateColumn,
        stateDrawer,
        stateSidebar,
        stateContentColumn,
        partState,
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
          key={`${keyRoot}-${keyColumn}-${keyDrawer}-${keySidebar}-${keyContentColumn}`}
          {...propsRoot}
          // (On the picture: no line between the columns.)
          hideSeparators={content.background === 'picture'}
        >
          <Drawer.Root
            {...propsDrawer}
            open={isOpen}
            onOpenChange={(isNextOpen: boolean, { reason }) => {
              addLog(`sidebar open: ${String(isNextOpen)} (${reason})`);
              setIsOpen(isNextOpen);
            }}
          >
            <Drawer.SwipeArea {...partProps['Drawer.SwipeArea']} />
            <Drawer.Popup
              key={keyColumn}
              aria-label="Sidebar"
              {...propsColumn}
            >
              <Sidebar.Root {...propsSidebar}>
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
                        selected={selected === 'Inbox'}
                      >
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfTray}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
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
                        <List.Trailing {...partProps['List.Trailing']}>
                          <List.Detail {...partProps['List.Detail']}>
                            12
                          </List.Detail>
                        </List.Trailing>
                      </List.Item>
                      <List.Item
                        {...partProps['List.Item']}
                        selected={selected === 'Favorites'}
                      >
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfHeart}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
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
                        <List.Trailing {...partProps['List.Trailing']}>
                          <List.Detail {...partProps['List.Detail']}>
                            3
                          </List.Detail>
                        </List.Trailing>
                      </List.Item>
                      <List.Item
                        {...partProps['List.Item']}
                        selected={selected === 'Recents'}
                      >
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfClock}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
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
                          <List.Trailing {...partProps['List.Trailing']}>
                            <List.Detail {...partProps['List.Detail']}>
                              8
                            </List.Detail>
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
                          <List.CollapsibleRoot
                            {...partProps['List.CollapsibleRoot']}
                            defaultOpen
                          >
                            <List.Item
                              {...partProps['List.Item']}
                              level={1}
                              selected={selected === 'Design'}
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
                              <List.Trailing {...partProps['List.Trailing']}>
                                <List.CollapsibleTrigger
                                  {...partProps['List.CollapsibleTrigger']}
                                  aria-label="Design: nested"
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
                                selected={selected === 'Drafts'}
                              >
                                <List.Leading {...partProps['List.Leading']}>
                                  <List.Image
                                    {...partProps['List.Image']}
                                    variant="symbol"
                                  >
                                    <Symbol
                                      {...partProps.Symbol}
                                      icon={sfDocument}
                                    />
                                  </List.Image>
                                </List.Leading>
                                <List.Content {...partProps['List.Content']}>
                                  <List.Title
                                    {...partProps['List.Title']}
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
                                <List.Trailing {...partProps['List.Trailing']}>
                                  <List.Detail {...partProps['List.Detail']}>
                                    2
                                  </List.Detail>
                                </List.Trailing>
                              </List.Item>
                            </List.CollapsiblePanel>
                          </List.CollapsibleRoot>
                          <List.Item
                            {...partProps['List.Item']}
                            level={1}
                            selected={selected === 'Photos'}
                          >
                            <List.Leading {...partProps['List.Leading']}>
                              <List.Image
                                {...partProps['List.Image']}
                                variant="symbol"
                              >
                                <Symbol
                                  {...partProps.Symbol}
                                  icon={sfPhoto}
                                />
                              </List.Image>
                            </List.Leading>
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
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
                        Options
                      </List.Title>
                      <List.Disclosure {...partProps['List.Disclosure']} />
                    </Collapsible.Trigger>
                    <Collapsible.Panel
                      {...partProps['Collapsible.Panel']}
                      render={<List.Group {...partProps['List.Group']} />}
                    >
                      <List.Item
                        {...partProps['List.Item']}
                        onClick={forwardClick('[role=switch]')}
                      >
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfEye}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Show Hidden
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <Switch.Root
                            {...partProps['Switch.Root']}
                            aria-label="Show Hidden"
                            checked={isHiddenShown}
                            onCheckedChange={(isChecked) => {
                              addLog(`show hidden: ${String(isChecked)}`);
                              setIsHiddenShown(isChecked);
                            }}
                          >
                            <Switch.Thumb {...partProps['Switch.Thumb']} />
                          </Switch.Root>
                        </List.Trailing>
                      </List.Item>
                      <List.Item {...partProps['List.Item']}>
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfTextformat}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('sort by: Name');
                              setSortBy('Name');
                            }}
                          >
                            Sort by Name
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          {sortBy === 'Name' ? (
                            <List.Checkmark {...partProps['List.Checkmark']} />
                          ) : null}
                        </List.Trailing>
                      </List.Item>
                      <List.Item {...partProps['List.Item']}>
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfCalendar}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => {
                              addLog('sort by: Date');
                              setSortBy('Date');
                            }}
                          >
                            Sort by Date
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          {sortBy === 'Date' ? (
                            <List.Checkmark {...partProps['List.Checkmark']} />
                          ) : null}
                        </List.Trailing>
                      </List.Item>
                      <List.Item {...partProps['List.Item']}>
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfPerson2}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => addLog('select: Shared')}
                          >
                            Shared
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <List.Accessory
                            {...partProps['List.Accessory']}
                            aria-label="Info"
                            render={<button type="button" />}
                            onClick={() => addLog('shared info')}
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfICircle}
                            />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                    <Toolbar.Button
                      {...partProps['Toolbar.Button']}
                      aria-label="Show Sidebar"
                      shape="circle"
                      onClick={() => {
                        addLog('show sidebar');
                        setIsOpen(true);
                      }}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfListBullet}
                        />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Leading>
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{selected}</span>
                  </Toolbar.Title>
                  {/* (Balancing it: the title centered.) */}
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
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
                {/* (Its glass by what's behind it: e.g. the picture.) */}

                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>{selected}</span>
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
                          <List.Trailing {...partProps['List.Trailing']}>
                            <List.Detail {...partProps['List.Detail']}>
                              {selected}
                            </List.Detail>
                          </List.Trailing>
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
 * The sidebar while editing: its rows selected by
 * selection circles before their symbols.
 */
export const SidebarEditingDemo: FunctionComponent = () => {
  const id = 'sidebar-editing';

  const [log, addLog] = useLog();

  const [selected, setSelected] = useState('Inbox');
  const [isHiddenShown, setIsHiddenShown] = useState(false);
  const [sortBy, setSortBy] = useState('Name');

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
            'Collapsible.Panel': ['render'],
            'Collapsible.Root': ['defaultOpen', 'render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'Header.LargeTitle': [],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
            'List.Accessory': ['aria-label', 'onClick', 'render'],
            'List.Checkbox': ['aria-label', 'by'],
            'List.Checkmark': [],
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': [],
            'List.CollapsibleTrigger': ['aria-label', 'render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['level', 'onClick', 'selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': ['className'],
            'Sidebar.Root': [],
            'Sidebar.Toolbar': [],
            'Sidebar.ToolbarGroup': [],
            'Switch.Root': ['aria-label', 'checked', 'onCheckedChange'],
            'Switch.Thumb': [],
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
      controls={[partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[partState]}
      title="Sidebar (Editing)"
    >
      <Viewport.Background {...partProps['Viewport.Background']}>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Viewport.Content {...partProps['Viewport.Content']}>
        {/* (On the picture: no line between the columns.) */}
        <Layout.Root
          {...partProps['Layout.Root']}
          hideSeparators
        >
          <Layout.Column
            {...partProps['Layout.Column']}
            floating
            aria-label="Sidebar"
            defaultSize={336}
          >
            <Sidebar.Root {...partProps['Sidebar.Root']}>
              <Sidebar.Toolbar {...partProps['Sidebar.Toolbar']}>
                <Button.Root
                  {...partProps['Button.Root']}
                  tint="var(--uikit-glass-content)"
                  variant="borderless"
                  onClick={() => addLog('edit')}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Done
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
                      selected={selected === 'Inbox'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Inbox"
                        />
                      </List.Leading>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfTray}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Inbox');
                            setSelected('Inbox');
                          }}
                        >
                          Inbox
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Detail {...partProps['List.Detail']}>
                          12
                        </List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Favorites'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Favorites"
                        />
                      </List.Leading>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfHeart}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('select: Favorites');
                            setSelected('Favorites');
                          }}
                        >
                          Favorites
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Detail {...partProps['List.Detail']}>
                          3
                        </List.Detail>
                      </List.Trailing>
                    </List.Item>
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Recents'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Recents"
                        />
                      </List.Leading>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfClock}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
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
                          <List.Checkbox
                            {...partProps['List.Checkbox']}
                            aria-label="Projects"
                          />
                        </List.Leading>
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
                            onClick={() => {
                              addLog('select: Projects');
                              setSelected('Projects');
                            }}
                          >
                            Projects
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <List.Detail {...partProps['List.Detail']}>
                            8
                          </List.Detail>
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
                        <List.CollapsibleRoot
                          {...partProps['List.CollapsibleRoot']}
                          defaultOpen
                        >
                          <List.Item
                            {...partProps['List.Item']}
                            level={1}
                            selected={selected === 'Design'}
                          >
                            <List.Leading {...partProps['List.Leading']}>
                              <List.Checkbox
                                {...partProps['List.Checkbox']}
                                aria-label="Design"
                              />
                            </List.Leading>
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
                                onClick={() => {
                                  addLog('select: Design');
                                  setSelected('Design');
                                }}
                              >
                                Design
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.CollapsibleTrigger
                                {...partProps['List.CollapsibleTrigger']}
                                aria-label="Design: nested"
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
                              selected={selected === 'Drafts'}
                            >
                              <List.Leading {...partProps['List.Leading']}>
                                <List.Checkbox
                                  {...partProps['List.Checkbox']}
                                  aria-label="Drafts"
                                />
                              </List.Leading>
                              <List.Leading {...partProps['List.Leading']}>
                                <List.Image
                                  {...partProps['List.Image']}
                                  variant="symbol"
                                >
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={sfDocument}
                                  />
                                </List.Image>
                              </List.Leading>
                              <List.Content {...partProps['List.Content']}>
                                <List.Title
                                  {...partProps['List.Title']}
                                  render={<button type="button" />}
                                  onClick={() => {
                                    addLog('select: Drafts');
                                    setSelected('Drafts');
                                  }}
                                >
                                  Drafts
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                <List.Detail {...partProps['List.Detail']}>
                                  2
                                </List.Detail>
                              </List.Trailing>
                            </List.Item>
                          </List.CollapsiblePanel>
                        </List.CollapsibleRoot>
                        <List.Item
                          {...partProps['List.Item']}
                          level={1}
                          selected={selected === 'Photos'}
                        >
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Checkbox
                              {...partProps['List.Checkbox']}
                              aria-label="Photos"
                            />
                          </List.Leading>
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfPhoto}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
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
                    <List.Item
                      {...partProps['List.Item']}
                      selected={selected === 'Trash'}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Trash"
                        />
                      </List.Leading>
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
                      Options
                    </List.Title>
                    <List.Disclosure {...partProps['List.Disclosure']} />
                  </Collapsible.Trigger>
                  <Collapsible.Panel
                    {...partProps['Collapsible.Panel']}
                    render={<List.Group {...partProps['List.Group']} />}
                  >
                    <List.Item
                      {...partProps['List.Item']}
                      onClick={forwardClick('[role=switch]')}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Show Hidden"
                        />
                      </List.Leading>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfEye}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Show Hidden
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <Switch.Root
                          {...partProps['Switch.Root']}
                          aria-label="Show Hidden"
                          checked={isHiddenShown}
                          onCheckedChange={(isChecked) => {
                            addLog(`show hidden: ${String(isChecked)}`);
                            setIsHiddenShown(isChecked);
                          }}
                        >
                          <Switch.Thumb {...partProps['Switch.Thumb']} />
                        </Switch.Root>
                      </List.Trailing>
                    </List.Item>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Sort by Name"
                        />
                      </List.Leading>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfTextformat}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Name');
                            setSortBy('Name');
                          }}
                        >
                          Sort by Name
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        {sortBy === 'Name' ? (
                          <List.Checkmark {...partProps['List.Checkmark']} />
                        ) : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Sort by Date"
                        />
                      </List.Leading>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfCalendar}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('sort by: Date');
                            setSortBy('Date');
                          }}
                        >
                          Sort by Date
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        {sortBy === 'Date' ? (
                          <List.Checkmark {...partProps['List.Checkmark']} />
                        ) : null}
                      </List.Trailing>
                    </List.Item>
                    <List.Item {...partProps['List.Item']}>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Checkbox
                          {...partProps['List.Checkbox']}
                          aria-label="Shared"
                        />
                      </List.Leading>
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          variant="symbol"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfPerson2}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog('select: Shared')}
                        >
                          Shared
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Accessory
                          {...partProps['List.Accessory']}
                          aria-label="Info"
                          render={<button type="button" />}
                          onClick={() => addLog('shared info')}
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfICircle}
                          />
                        </List.Accessory>
                      </List.Trailing>
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
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{selected}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root
                {...partProps['Page.Root']}
                className="sidebar-demo-transparent"
              >
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                {/* (Its glass by what's behind it: e.g. the picture.) */}

                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>{selected}</span>
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
                          <List.Trailing {...partProps['List.Trailing']}>
                            <List.Detail {...partProps['List.Detail']}>
                              {selected}
                            </List.Detail>
                          </List.Trailing>
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
