import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
  Sidebar,
  Symbol,
  TextField,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfFolderBadgePlus,
  sfMagnifyingglass,
  sfSquareAndPencil,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['onClick', 'tint', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['render'],
            'Sidebar.Toolbar': [],
            'TextField.Clear': [],
            'TextField.Control': ['aria-label', 'placeholder', 'type'],
            'TextField.Frame': [],
            'TextField.Root': [],
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
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Sidebar.Root"
    >
      <div className="sidebar-demo-panel demo-picture">
        <Sidebar.Root {...props}>
          <Sidebar.Toolbar {...partProps['Sidebar.Toolbar']}>
            <Button.Root
              {...partProps['Button.Root']}
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => addLog('edit')}
            >
              <Button.Label {...partProps['Button.Label']}>Edit</Button.Label>
            </Button.Root>
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
                <List.Group {...partProps['List.Group']}>
                  {rows.map(([value, rowTitle, icon]) => (
                    <List.Item
                      key={value}
                      {...partProps['List.Item']}
                      selected={value === 'inbox'}
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
                        >
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
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['render'],
            'Sidebar.Root': ['aria-label'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Sidebar.Toolbar"
    >
      <div className="sidebar-demo-panel demo-picture">
        <Sidebar.Root
          {...partProps['Sidebar.Root']}
          aria-label="Mailboxes"
        >
          <Sidebar.Toolbar {...props}>
            <Button.Root
              {...partProps['Button.Root']}
              tint="var(--uikit-glass-content)"
              variant="borderless"
              onClick={() => addLog('edit')}
            >
              <Button.Label {...partProps['Button.Label']}>Edit</Button.Label>
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
          </Sidebar.Toolbar>
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
                  <List.Title {...partProps['List.Title']}>{title}</List.Title>
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
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                        >
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
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['render'],
            'Sidebar.Root': ['aria-label'],
            'Sidebar.Toolbar': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Sidebar.ToolbarGroup"
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
              onClick={() => addLog('edit')}
            >
              <Button.Label {...partProps['Button.Label']}>Edit</Button.Label>
            </Button.Root>
            <Sidebar.ToolbarGroup {...props}>
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
                  <List.Title {...partProps['List.Title']}>{title}</List.Title>
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
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                        >
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
        Its search field and list come from other components (
        <a href={publicUrl('text-field')}>Text Field</a>,{' '}
        <a href={publicUrl('list')}>List</a>). Its place and size come from its{' '}
        <a href={publicUrl('layout')}>Layout</a> column.
      </li>
      <li>
        The views show the panel over a picture, so you can see its glass.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="layout"
          part="Layout.Column"
        />{' '}
        <span>(floating), or a</span>{' '}
        <PartLink
          component="drawer"
          part="Drawer.Popup"
        />{' '}
        <span>(on a phone)</span>
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
                  <li className="demo-tree-context">
                    <PartLink
                      component="button"
                      part="Button.Root"
                    />{' '}
                    <span>(borderless, at each end), or</span>
                  </li>
                  <li>
                    <PartLink
                      component="sidebar"
                      part="Sidebar.ToolbarGroup"
                    />{' '}
                    (several)
                    <ul>
                      <li className="demo-tree-context">
                        <PartLink
                          component="button"
                          part="Button.Root"
                        />
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="text-field"
                  part="TextField.Root"
                />{' '}
                <span>→</span>{' '}
                <PartLink
                  component="text-field"
                  part="TextField.Frame"
                />
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="list"
                  part="List.Root"
                />{' '}
                <span>(</span>
                <code>listStyle=&quot;sidebar&quot;</code>
                <span>)</span>
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
        The glass panel, with 20px corners, 10px from its column’s sides. Its
        content scrolls inside it.
      </li>
      <li>
        Sets the search field’s look (44px high, on the selection fill) and the
        list’s selection fill.
      </li>
      <li>
        Renders a <code>nav</code>, a landmark that needs a name.
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
        The panel’s toolbar, with its buttons at both ends, in Body. Their
        highlights sit 8px from the panel’s top and sides, and there’s 54px from
        the panel’s top to what follows.
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
