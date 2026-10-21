import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Page,
  Symbol,
  Toolbar,
  useCreateDrawerHandle,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { codeLabel } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from '../viewport/content.js';
import {
  layoutBackgroundRows,
  layoutColumnRows,
  layoutDrawerCloseRows,
  layoutDrawerHandleRows,
  layoutDrawerHandleTypeRows,
  layoutDrawerRows,
  layoutDrawerSwipeAreaRows,
  layoutDrawerTriggerRows,
  layoutRootRows,
} from './docs.js';
import {
  getPropOptionsGuideColumn,
  getPropOptionsGuideDrawer,
  propOptionsGuideBackground,
  propOptionsGuideDrawerClose,
  propOptionsGuideDrawerSwipeArea,
  propOptionsGuideDrawerTrigger,
  propOptionsGuideRoot,
} from './props.js';

/** `Layout.Root`, outlined: two columns. */
const RootPart: FunctionComponent = () => {
  const id = 'layout-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideRoot,
    'Layout.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Layout.Root"
    >
      <div className="layout-demo-tablet">
        <Layout.Root {...props}>
          <Layout.Column defaultSize={320}>
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Page.Root>
          </Layout.Column>
          <Layout.Column>
            <Page.Root background="plain" />
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.Background`, outlined: a picture behind a floating column. */
const BackgroundPart: FunctionComponent = () => {
  const id = 'layout-parts-background';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideBackground,
    'Layout.Background',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Layout.Background"
    >
      <div className="layout-demo-tablet">
        <Layout.Root>
          <Layout.Background {...props}>
            <div
              aria-hidden="true"
              className="layout-demo-picture"
            />
          </Layout.Background>
          <Layout.Column defaultSize={320}>
            <Page.Root className="layout-demo-transparent">
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 8).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Page.Root>
          </Layout.Column>
          <Layout.Column />
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.Column`, outlined: the first of two (resizable). */
const ColumnPart: FunctionComponent = () => {
  const id = 'layout-parts-column';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('column', 320, true, addLog),
      [addLog],
    ),
    'Layout.Column',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Layout.Column"
    >
      <div className="layout-demo-tablet">
        <Layout.Root>
          <Layout.Column
            key={key}
            {...props}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Page.Root>
          </Layout.Column>
          <Layout.Column>
            <Page.Root background="plain" />
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.Drawer`: a phone, the contacts' drawer, opened by the bar's button. */
const DrawerPart: FunctionComponent = () => {
  const id = 'layout-parts-drawer';
  // Its trigger, in the content's bar (outside the drawer).
  const drawerPartDrawer = codeLabel(
    useCreateDrawerHandle(),
    'drawerPartDrawer',
  );
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(() => getPropOptionsGuideDrawer(addLog), [addLog]),
    'Layout.Drawer',
    external,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Layout.Drawer"
    >
      <div className="layout-demo-phone">
        <Layout.Root compact>
          <Layout.Drawer
            key={key}
            handle={drawerPartDrawer}
            {...props}
          >
            <Layout.DrawerSwipeArea />
            <Layout.Column>
              <Page.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Layout.DrawerTrigger
                      handle={drawerPartDrawer}
                      render={
                        <Toolbar.Button
                          aria-label="Contacts"
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
                    <span>Messages</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.DrawerSwipeArea`, outlined: the strip a drawer is swiped in from. */
const DrawerSwipeAreaPart: FunctionComponent = () => {
  const id = 'layout-parts-drawer-swipe-area';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideDrawerSwipeArea,
    'Layout.DrawerSwipeArea',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Layout.DrawerSwipeArea"
    >
      <div className="layout-demo-phone">
        <Layout.Root compact>
          <Layout.Drawer>
            <Layout.DrawerSwipeArea {...props} />
            <Layout.Column>
              <Page.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root background="plain">
              <List.Root listStyle="plain">
                <List.Block>
                  Swipe the contacts in from the left edge.
                </List.Block>
              </List.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.DrawerTrigger`, outlined: the bar's button opening the drawer. */
const DrawerTriggerPart: FunctionComponent = () => {
  const id = 'layout-parts-drawer-trigger';
  // Its trigger, in the content's bar (outside the drawer).
  const triggerPartDrawer = codeLabel(
    useCreateDrawerHandle(),
    'triggerPartDrawer',
  );
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideDrawerTrigger,
    'Layout.DrawerTrigger',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Layout.DrawerTrigger"
    >
      <div className="layout-demo-phone">
        <Layout.Root compact>
          <Layout.Drawer handle={triggerPartDrawer}>
            <Layout.Column>
              <Page.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Layout.DrawerTrigger
                      aria-label="Contacts"
                      handle={triggerPartDrawer}
                      {...props}
                    >
                      <Button.Icon>
                        <Symbol icon={sfListBullet} />
                      </Button.Icon>
                    </Layout.DrawerTrigger>
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>Messages</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.DrawerClose`, outlined: the drawer's Done, open initially. */
const DrawerClosePart: FunctionComponent = () => {
  const id = 'layout-parts-drawer-close';
  // Its trigger, in the content's bar (outside the drawer).
  const closePartDrawer = codeLabel(useCreateDrawerHandle(), 'closePartDrawer');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideDrawerClose,
    'Layout.DrawerClose',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Layout.DrawerClose"
    >
      <div className="layout-demo-phone">
        <Layout.Root compact>
          <Layout.Drawer handle={closePartDrawer}>
            <Layout.DrawerSwipeArea />
            <Layout.Column>
              <Page.Root>
                <Header.Root>
                  <Header.Bar>
                    <Toolbar.Leading />
                    <Toolbar.Title>
                      <span>Contacts</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing>
                      <Layout.DrawerClose {...props}>
                        <Button.Label>Done</Button.Label>
                      </Layout.DrawerClose>
                    </Toolbar.Trailing>
                  </Header.Bar>
                </Header.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Layout.DrawerTrigger
                      handle={closePartDrawer}
                      render={
                        <Toolbar.Button
                          aria-label="Contacts"
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
                    <span>Messages</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

// Its triggers, in the content (outside the drawer): made once, here.
const contactsDrawer = codeLabel(Layout.createDrawerHandle(), 'contactsDrawer');

/** The bar's trigger, and a button opening the drawer imperatively. */
const CreateDrawerHandlePart: FunctionComponent = () => {
  const id = 'layout-parts-create-drawer-handle';
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id={id}
      log={log}
      title="Layout.createDrawerHandle"
    >
      <div className="layout-demo-phone">
        <Layout.Root compact>
          <Layout.Drawer
            handle={contactsDrawer}
            onOpenChange={(next: boolean, { reason }) => {
              addLog(`open: ${String(next)} (${reason})`);
            }}
          >
            <Layout.Column>
              <Page.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Layout.DrawerTrigger
                      handle={contactsDrawer}
                      render={
                        <Toolbar.Button
                          aria-label="Contacts"
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
                    <span>Messages</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
              <List.Root listStyle="plain">
                <List.Block>
                  <Button.Root
                    variant="bordered"
                    onClick={() => contactsDrawer.open(null)}
                  >
                    <Button.Label>Show Contacts</Button.Label>
                  </Button.Root>
                </List.Block>
              </List.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** The contacts' and the favorites' buttons: one drawer, its title theirs. */
const UseCreateDrawerHandlePart: FunctionComponent = () => {
  const id = 'layout-parts-use-create-drawer-handle';
  const [log, addLog] = useLog();
  // Its triggers, in the content's bar (outside the drawer), each with its
  // payload: the drawer's title.
  const peopleDrawer = codeLabel(
    useCreateDrawerHandle<{ title: string }>(),
    'peopleDrawer',
  );

  return (
    <Component
      center
      inline
      id={id}
      log={log}
      title="useCreateDrawerHandle"
    >
      <div className="layout-demo-phone">
        <Layout.Root compact>
          <Layout.Drawer
            handle={peopleDrawer}
            onOpenChange={(next: boolean, { reason }) => {
              addLog(`open: ${String(next)} (${reason})`);
            }}
          >
            {({ payload }) => (
              <Layout.Column>
                <Page.Root>
                  <Header.Root>
                    <Header.Bar>
                      <Toolbar.Leading />
                      <Toolbar.Title>
                        <span>{payload?.title}</span>
                      </Toolbar.Title>
                      <Toolbar.Trailing />
                    </Header.Bar>
                  </Header.Root>
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {names.slice(0, 8).map((name) => (
                          <List.Item key={name}>
                            <List.Title>{name}</List.Title>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  </List.Root>
                </Page.Root>
              </Layout.Column>
            )}
          </Layout.Drawer>
          <Layout.Column>
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Layout.DrawerTrigger
                      handle={peopleDrawer}
                      payload={{ title: 'Contacts' }}
                      render={
                        <Toolbar.Button
                          aria-label="Contacts"
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
                    <span>Messages</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Layout.DrawerTrigger
                      handle={peopleDrawer}
                      payload={{ title: 'Favorites' }}
                      render={
                        <Toolbar.Button
                          aria-label="Favorites"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfHeart} />
                      </Button.Icon>
                    </Layout.DrawerTrigger>
                  </Toolbar.Trailing>
                </Header.Bar>
              </Header.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `/layout/parts`: its root, background and columns. */
export const LayoutParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root of columns side by side, and optionally a background behind them.
      </li>
      <li>
        Each column filled by its content: a <a href="page">Page</a>, a{' '}
        <a href="navigation">Navigation</a>, a <a href="sidebar">Sidebar</a>.
      </li>
      <li>
        In a resizable column’s view, drag its divider (or focus it, the arrow
        keys); set the root <code>compact</code> for drawers.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="layout"
          part="Layout.Root"
        />
        <ul>
          <li>
            <PartLink
              component="layout"
              part="Layout.Background"
            />{' '}
            (optional)
          </li>
          <li>
            <PartLink
              component="layout"
              part="Layout.Column"
            />{' '}
            (several; a divider at a resizable one’s end)
          </li>
          <li>
            <PartLink
              component="layout"
              part="Layout.Drawer"
            />{' '}
            (optional, several)
            <ul>
              <li>
                <PartLink
                  component="layout"
                  part="Layout.DrawerSwipeArea"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="layout"
                  part="Layout.Column"
                />{' '}
                (its column; compact, the drawer, the content dimmed behind it)
                <ul>
                  <li>
                    <PartLink
                      component="layout"
                      part="Layout.DrawerClose"
                    />{' '}
                    (optional, in its content)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="layout"
              part="Layout.DrawerTrigger"
            />{' '}
            (optional, in it, or in another column’s content, linked by a
            handle)
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="layout"
          part="Layout.createDrawerHandle"
        />{' '}
        (a drawer’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="layout"
              part="useCreateDrawerHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="layout-root"
      level={2}
    >
      <code>Layout.Root</code>
    </Heading>
    <ul>
      <li>
        Its columns in a row, filling its container (<code>height: 100%</code>
        ); clipping them (drawers, floating columns).
      </li>
      <li>
        <code>compact</code>: its{' '}
        <PartLink
          component="layout"
          part="Layout.Drawer"
        />
        s’ columns over the others, hidden until opened (see{' '}
        <PartLink
          component="layout"
          part="Layout.Drawer"
        />
        ); otherwise side by side.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={layoutRootRows} />

    <Heading
      id="layout-background"
      level={2}
    >
      <code>Layout.Background</code>
    </Heading>
    <ul>
      <li>
        Behind the columns, filling the layout: its children layered (images and
        videos covering it), showing where columns have no background.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <BackgroundPart />
    <h3>Props</h3>
    <PropsTable rows={layoutBackgroundRows} />

    <Heading
      id="layout-column"
      level={2}
    >
      <code>Layout.Column</code>
    </Heading>
    <ul>
      <li>
        Sized (<code>defaultSize</code>, <code>size</code>), or flexible;
        resizable by a divider at its end.
      </li>
      <li>
        Floating over the others (<code>floating</code>), or clear of one (
        <code>clearFloating</code>); compact, in a{' '}
        <PartLink
          component="layout"
          part="Layout.Drawer"
        />
        , the drawer.
      </li>
      <li>
        Renders a <code>div</code> (compact, in a drawer: Base UI’s{' '}
        <code>Drawer.Popup</code>, in a portal in the layout, the content’s
        dimming before it).
      </li>
    </ul>
    <ColumnPart />
    <h3>Props</h3>
    <PropsTable rows={layoutColumnRows} />

    <Heading
      id="layout-drawer"
      level={2}
    >
      <code>Layout.Drawer</code>
    </Heading>
    <ul>
      <li>
        A drawer (Base UI’s <code>Drawer.Root</code>): its state (controlled,{' '}
        <code>open</code>, or its own) for its parts; compact, its column over
        the others at its <code>side</code>.
      </li>
      <li>
        Closed by swiping it back, a press on the dimmed content (unless{' '}
        <code>disablePointerDismissal</code>), Escape, or a{' '}
        <PartLink
          component="layout"
          part="Layout.DrawerClose"
        />
        .
      </li>
      <li>Doesn’t render an element.</li>
    </ul>
    <DrawerPart />
    <h3>Props</h3>
    <PropsTable rows={layoutDrawerRows} />

    <Heading
      id="layout-drawerswipearea"
      level={2}
    >
      <code>Layout.DrawerSwipeArea</code>
    </Heading>
    <ul>
      <li>
        Compact: a strip at its drawer’s edge (<code>width</code>, 20px) it’s
        swiped in from; without one (or <code>disabled</code>), the drawer isn’t
        swiped in.
      </li>
      <li>
        The drawer follows the swipe; let go past half its width, or while still
        moving (a fling), it opens, otherwise it closes again (Base UI’s rule,
        not configurable).
      </li>
      <li>
        Renders a <code>div</code> (Base UI’s <code>Drawer.SwipeArea</code>);
        regular, nothing.
      </li>
    </ul>
    <DrawerSwipeAreaPart />
    <h3>Props</h3>
    <PropsTable rows={layoutDrawerSwipeAreaRows} />

    <Heading
      id="layout-drawertrigger"
      level={2}
    >
      <code>Layout.DrawerTrigger</code>
    </Heading>
    <ul>
      <li>
        A button opening its drawer: in it, or (as in a bar of the content’s)
        linked to it by a <code>handle</code> (
        <code>useCreateDrawerHandle()</code>).
      </li>
      <li>
        Renders a <code>button</code> (Base UI’s <code>Drawer.Trigger</code>);
        e.g. a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        by its <code>render</code>.
      </li>
    </ul>
    <DrawerTriggerPart />
    <h3>Props</h3>
    <PropsTable rows={layoutDrawerTriggerRows} />

    <Heading
      id="layout-drawerclose"
      level={2}
    >
      <code>Layout.DrawerClose</code>
    </Heading>
    <ul>
      <li>
        A button closing its drawer, in its content (e.g. its bar’s Done).
      </li>
      <li>
        Renders a <code>button</code> (Base UI’s <code>Drawer.Close</code>).
      </li>
    </ul>
    <DrawerClosePart />
    <h3>Props</h3>
    <PropsTable rows={layoutDrawerCloseRows} />

    <Heading
      id="layout-createdrawerhandle"
      level={2}
    >
      <code>Layout.createDrawerHandle</code>
    </Heading>
    <ul>
      <li>
        A handle linking a drawer to its triggers outside it (e.g. in another
        column’s bar; nested drawers would shadow each other’s), and opening or
        closing it imperatively (Base UI’s <code>Drawer.createHandle</code>).
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink
          component="layout"
          part="useCreateDrawerHandle"
        />
        ). Not needed for a trigger in the drawer, nor for a controlled drawer
        (opened by the app’s <code>open</code>).
      </li>
      <li>
        Here: made at the module’s top level; the bar’s button a trigger, the
        page’s button opening it imperatively (its <code>open()</code>).
      </li>
    </ul>
    <CreateDrawerHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={layoutDrawerHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={layoutDrawerHandleRows} />

    <Heading
      id="usecreatedrawerhandle"
      level={2}
    >
      <code>useCreateDrawerHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="layout"
          part="Layout.createDrawerHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here: two triggers, one drawer; each passes its title (its{' '}
        <code>payload</code>), the drawer’s children a function of it.
      </li>
    </ul>
    <UseCreateDrawerHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={layoutDrawerHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={layoutDrawerHandleRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const layoutPartsDemos = [
  RootPart,
  BackgroundPart,
  ColumnPart,
  DrawerPart,
  DrawerSwipeAreaPart,
  DrawerTriggerPart,
  DrawerClosePart,
  CreateDrawerHandlePart,
  UseCreateDrawerHandlePart,
];
