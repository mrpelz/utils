import { FunctionComponent } from 'react';

import {
  Button,
  List,
  Sidebar,
  Symbol,
  TextField,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfFolderBadgePlus,
  sfMagnifyingglass,
  sfSquareAndPencil,
} from '../../tooling/icons.js';
import { sidebarSections } from './content.js';
import {
  sidebarRootRows,
  sidebarToolbarGroupRows,
  sidebarToolbarRows,
} from './docs.js';
import { propOptionsGuideRoot, propOptionsPart } from './props.js';

/** `Sidebar.Root`, outlined: a toolbar, a search field, a list. */
const RootPart: FunctionComponent = () => {
  const id = 'sidebar-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideRoot, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sidebar.Root',
  });

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sidebar.Root"
    >
      <div className="sidebar-demo-panel sidebar-demo-picture">
        <Sidebar.Root {...props}>
          <Sidebar.Toolbar>
            <Button.Root
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => addLog('edit')}
            >
              <Button.Label>Edit</Button.Label>
            </Button.Root>
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
                  {rows.map(([value, rowTitle, icon]) => (
                    <List.Item
                      key={value}
                      selected={value === 'inbox'}
                    >
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={icon} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title render={<button type="button" />}>
                          {rowTitle}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
          </List.Root>
        </Sidebar.Root>
      </div>
    </Component>
  );
};

/** `Sidebar.Toolbar`, outlined: a button at each end. */
const ToolbarPart: FunctionComponent = () => {
  const id = 'sidebar-parts-toolbar';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sidebar.Toolbar',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sidebar.Toolbar"
    >
      <div className="sidebar-demo-panel sidebar-demo-picture">
        <Sidebar.Root aria-label="Mailboxes">
          <Sidebar.Toolbar {...props}>
            <Button.Root
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => addLog('edit')}
            >
              <Button.Label>Edit</Button.Label>
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
          </Sidebar.Toolbar>
          <List.Root listStyle="sidebar">
            {sidebarSections.map(([title, rows]) => (
              <List.Section key={title}>
                <List.Header prominence="nested">
                  <List.Title>{title}</List.Title>
                </List.Header>
                <List.Group>
                  {rows.map(([value, rowTitle, icon]) => (
                    <List.Item key={value}>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={icon} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title render={<button type="button" />}>
                          {rowTitle}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
          </List.Root>
        </Sidebar.Root>
      </div>
    </Component>
  );
};

/** `Sidebar.ToolbarGroup`, outlined: two symbols at the toolbar's end. */
const ToolbarGroupPart: FunctionComponent = () => {
  const id = 'sidebar-parts-toolbar-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Sidebar.ToolbarGroup',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sidebar.ToolbarGroup"
    >
      <div className="sidebar-demo-panel sidebar-demo-picture">
        <Sidebar.Root aria-label="Mailboxes">
          <Sidebar.Toolbar>
            <Button.Root
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => addLog('edit')}
            >
              <Button.Label>Edit</Button.Label>
            </Button.Root>
            <Sidebar.ToolbarGroup {...props}>
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
          <List.Root listStyle="sidebar">
            {sidebarSections.map(([title, rows]) => (
              <List.Section key={title}>
                <List.Header prominence="nested">
                  <List.Title>{title}</List.Title>
                </List.Header>
                <List.Group>
                  {rows.map(([value, rowTitle, icon]) => (
                    <List.Item key={value}>
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={icon} />
                        </List.Image>
                      </List.Leading>
                      <List.Content>
                        <List.Title render={<button type="button" />}>
                          {rowTitle}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
          </List.Root>
        </Sidebar.Root>
      </div>
    </Component>
  );
};

/** `/sidebar/parts`: the panel and its toolbar. */
export const SidebarParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>The panel, and a toolbar at its top with buttons at its ends.</li>
      <li>
        Its search field and list are other components’ (
        <a href="text-field">Text field</a>, <a href="list">List</a>); its place
        and size, its <a href="layout">Layout</a> column’s.
      </li>
      <li>The views show the panel on a picture, as behind its glass.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="layout"
          part="Layout.Column"
        />{' '}
        (floating), or a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Popup"
        />{' '}
        (a phone’s)
        <ul>
          <li>
            <PartLink
              component="sidebar"
              part="Sidebar.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="sidebar"
                  part="Sidebar.Toolbar"
                />
                <ul>
                  <li>
                    <PartLink
                      component="button"
                      part="Button.Root"
                    />{' '}
                    (borderless, at each end), or
                  </li>
                  <li>
                    <PartLink
                      component="sidebar"
                      part="Sidebar.ToolbarGroup"
                    />{' '}
                    (several)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="text-field"
                  part="TextField.Root"
                />{' '}
                →{' '}
                <PartLink
                  component="text-field"
                  part="TextField.Search"
                />
              </li>
              <li>
                <PartLink
                  component="list"
                  part="List.Root"
                />{' '}
                (<code>listStyle=&quot;sidebar&quot;</code>)
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="sidebar-root"
      level={2}
    >
      <code>Sidebar.Root</code>
    </Heading>
    <ul>
      <li>
        The glass panel (corners 20px, 8px from its column’s edges), its content
        scrolling inside it.
      </li>
      <li>
        Sets the search field’s look (44px, the selection fill) and the list’s
        selection fill.
      </li>
      <li>
        Renders a <code>nav</code> (a landmark: name it).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={sidebarRootRows} />

    <Heading
      id="sidebar-toolbar"
      level={2}
    >
      <code>Sidebar.Toolbar</code>
    </Heading>
    <ul>
      <li>
        Its toolbar: its buttons at its two ends, in Body, their highlights 8px
        from the panel’s top and sides; 54px from the panel’s top to what
        follows.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ToolbarPart />
    <h3>Props</h3>
    <PropsTable rows={sidebarToolbarRows} />

    <Heading
      id="sidebar-toolbargroup"
      level={2}
    >
      <code>Sidebar.ToolbarGroup</code>
    </Heading>
    <ul>
      <li>Several buttons at one end, side by side, 18px apart.</li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ToolbarGroupPart />
    <h3>Props</h3>
    <PropsTable rows={sidebarToolbarGroupRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sidebarPartsDemos = [RootPart, ToolbarPart, ToolbarGroupPart];
