import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { FunctionComponent } from 'react';

import {
  Button,
  Drawer,
  Header,
  List,
  Page,
  Symbol,
  Toolbar,
  useCreateDrawerHandle,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { names } from '../viewport/content.js';
import {
  drawerCloseRows,
  drawerHandleRows,
  drawerHandleTypeRows,
  drawerPopupRows,
  drawerRootRows,
  drawerSwipeAreaRows,
  drawerTriggerRows,
} from './docs.js';
import { useDrawerControls } from './props.js';

// Each part's view: a phone's page, its bar's button opening the contacts'
// drawer (linked by a handle, as the button is outside it), every part's
// props, the part's own open and emphasized.

/** The views' code's start: the handle linking the bar's button. */
const setup = 'const contactsDrawer = useCreateDrawerHandle();';

/** `Drawer.Root`, its options: the contacts, from the leading edge (or the bar’s button). */
const RootPart: FunctionComponent = () => {
  const id = 'drawer-parts-root';
  const [log, addLog] = useLog();
  // Its trigger, in the page's bar (outside the drawer).
  const contactsDrawer = codeLabel(
    useCreateDrawerHandle(),
    'contactsDrawer',
    'const contactsDrawer = useCreateDrawerHandle();',
  );
  const {
    controls,
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state,
  } = useDrawerControls(id, addLog, { featured: 'Root' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Drawer.Root"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfListBullet} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain">
            <Viewport.Padding edge="block-start" />
            <List.Root listStyle="plain">
              <List.Block>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
        <Drawer.Root
          key={keyRoot}
          handle={contactsDrawer}
          {...propsRoot}
        >
          <Drawer.SwipeArea {...propsSwipeArea} />
          <Drawer.Popup {...propsPopup}>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Drawer.Close {...propsClose}>
                      <Button.Label>Done</Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Content>
                            <List.Title>{name}</List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Drawer.Popup>
        </Drawer.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Drawer.SwipeArea`, overlaid: the strip at the leading edge the drawer is swiped in from. */
const SwipeAreaPart: FunctionComponent = () => {
  const id = 'drawer-parts-swipe-area';
  const [log, addLog] = useLog();
  // Its trigger, in the page's bar (outside the drawer).
  const contactsDrawer = codeLabel(
    useCreateDrawerHandle(),
    'contactsDrawer',
    'const contactsDrawer = useCreateDrawerHandle();',
  );
  const {
    controls,
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state,
  } = useDrawerControls(id, addLog, { featured: 'SwipeArea' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Drawer.SwipeArea"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfListBullet} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain">
            <Viewport.Padding edge="block-start" />
            <List.Root listStyle="plain">
              <List.Block>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
        <Drawer.Root
          key={keyRoot}
          handle={contactsDrawer}
          {...propsRoot}
        >
          <Drawer.SwipeArea {...propsSwipeArea} />
          <Drawer.Popup {...propsPopup}>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Drawer.Close {...propsClose}>
                      <Button.Label>Done</Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Content>
                            <List.Title>{name}</List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Drawer.Popup>
        </Drawer.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Drawer.Popup`, outlined: the contacts’ column, over the page dimmed. */
const PopupPart: FunctionComponent = () => {
  const id = 'drawer-parts-popup';
  const [log, addLog] = useLog();
  // Its trigger, in the page's bar (outside the drawer).
  const contactsDrawer = codeLabel(
    useCreateDrawerHandle(),
    'contactsDrawer',
    'const contactsDrawer = useCreateDrawerHandle();',
  );
  const {
    controls,
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state,
  } = useDrawerControls(id, addLog, { featured: 'Popup' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Drawer.Popup"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfListBullet} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain">
            <Viewport.Padding edge="block-start" />
            <List.Root listStyle="plain">
              <List.Block>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
        <Drawer.Root
          key={keyRoot}
          handle={contactsDrawer}
          {...propsRoot}
        >
          <Drawer.SwipeArea {...propsSwipeArea} />
          <Drawer.Popup {...propsPopup}>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Drawer.Close {...propsClose}>
                      <Button.Label>Done</Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Content>
                            <List.Title>{name}</List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Drawer.Popup>
        </Drawer.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Drawer.Trigger`, outlined: the bar’s button opening the drawer. */
const TriggerPart: FunctionComponent = () => {
  const id = 'drawer-parts-trigger';
  const [log, addLog] = useLog();
  // Its trigger, in the page's bar (outside the drawer).
  const contactsDrawer = codeLabel(
    useCreateDrawerHandle(),
    'contactsDrawer',
    'const contactsDrawer = useCreateDrawerHandle();',
  );
  const {
    controls,
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state,
  } = useDrawerControls(id, addLog, { featured: 'Trigger' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Drawer.Trigger"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfListBullet} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain">
            <Viewport.Padding edge="block-start" />
            <List.Root listStyle="plain">
              <List.Block>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
        <Drawer.Root
          key={keyRoot}
          handle={contactsDrawer}
          {...propsRoot}
        >
          <Drawer.SwipeArea {...propsSwipeArea} />
          <Drawer.Popup {...propsPopup}>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Drawer.Close {...propsClose}>
                      <Button.Label>Done</Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Content>
                            <List.Title>{name}</List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Drawer.Popup>
        </Drawer.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Drawer.Close`, outlined: the drawer’s Done. */
const ClosePart: FunctionComponent = () => {
  const id = 'drawer-parts-close';
  const [log, addLog] = useLog();
  // Its trigger, in the page's bar (outside the drawer).
  const contactsDrawer = codeLabel(
    useCreateDrawerHandle(),
    'contactsDrawer',
    'const contactsDrawer = useCreateDrawerHandle();',
  );
  const {
    controls,
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state,
  } = useDrawerControls(id, addLog, { featured: 'Close' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Drawer.Close"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfListBullet} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain">
            <Viewport.Padding edge="block-start" />
            <List.Root listStyle="plain">
              <List.Block>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
        <Drawer.Root
          key={keyRoot}
          handle={contactsDrawer}
          {...propsRoot}
        >
          <Drawer.SwipeArea {...propsSwipeArea} />
          <Drawer.Popup {...propsPopup}>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Drawer.Close {...propsClose}>
                      <Button.Label>Done</Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 8).map((name) => (
                        <List.Item key={name}>
                          <List.Content>
                            <List.Title>{name}</List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Drawer.Popup>
        </Drawer.Root>
      </Viewport.Content>
    </Component>
  );
};

// Its triggers, in the content (outside the drawer): made once, here.
const favoritesDrawer = codeLabel(
  Drawer.createHandle(),
  'favoritesDrawer',
  'const favoritesDrawer = Drawer.createHandle(); // (at module level)',
);

/** The bar's trigger, and a button opening the drawer imperatively. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'drawer-parts-create-handle';
  const [log, addLog] = useLog();
  const {
    controls,
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state,
  } = useDrawerControls(id, addLog);

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="phone"
      state={state}
      title="Drawer.createHandle"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Drawer.Trigger
                  aria-label="Favorites"
                  handle={favoritesDrawer}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfHeart} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain">
            <Viewport.Padding edge="block-start" />
            <List.Root listStyle="plain">
              <List.Block>
                <Button.Root
                  variant="bordered"
                  onClick={() => favoritesDrawer.open(null)}
                >
                  <Button.Label>Show Favorites</Button.Label>
                </Button.Root>
              </List.Block>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
        <Drawer.Root
          key={keyRoot}
          handle={favoritesDrawer}
          {...propsRoot}
        >
          <Drawer.SwipeArea {...propsSwipeArea} />
          <Drawer.Popup {...propsPopup}>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Favorites</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Drawer.Close {...propsClose}>
                      <Button.Label>Done</Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 4).map((name) => (
                        <List.Item key={name}>
                          <List.Content>
                            <List.Title>{name}</List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Drawer.Popup>
        </Drawer.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The contacts' and the favorites' buttons: one drawer, its title theirs. */
const UseCreateDrawerHandlePart: FunctionComponent = () => {
  const id = 'drawer-parts-use-create-drawer-handle';
  const [log, addLog] = useLog();
  // Its triggers, in the page's bar (outside the drawer), each with its
  // payload: the drawer's title.
  const peopleDrawer = codeLabel(
    useCreateDrawerHandle<{ title: string }>(),
    'peopleDrawer',
    'const peopleDrawer = useCreateDrawerHandle<{ title: string }>();',
  );
  const {
    controls,
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state,
  } = useDrawerControls(id, addLog);

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup="const peopleDrawer = useCreateDrawerHandle<{ title: string }>();"
      stage="phone"
      state={state}
      title="useCreateDrawerHandle"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={peopleDrawer}
                  payload={{ title: 'Contacts' }}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfListBullet} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Drawer.Trigger
                  aria-label="Favorites"
                  handle={peopleDrawer}
                  payload={{ title: 'Favorites' }}
                  {...propsTrigger}
                >
                  <Button.Icon>
                    <Symbol icon={sfHeart} />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain" />
        </Header.Root>
        <Drawer.Root
          key={keyRoot}
          handle={peopleDrawer}
          {...propsRoot}
        >
          {({ payload }) => (
            <>
              <Drawer.SwipeArea {...propsSwipeArea} />
              <Drawer.Popup {...propsPopup}>
                <Header.Root>
                  <Viewport.BlockStart>
                    <Toolbar.Root placement="block-start">
                      <Toolbar.Leading />
                      <Toolbar.Title>
                        <span>{payload?.title}</span>
                      </Toolbar.Title>
                      <Toolbar.Trailing>
                        <Drawer.Close {...propsClose}>
                          <Button.Label>Done</Button.Label>
                        </Drawer.Close>
                      </Toolbar.Trailing>
                    </Toolbar.Root>
                  </Viewport.BlockStart>
                  <Page.Root>
                    <Viewport.Padding edge="block-start" />
                    <List.Root>
                      <List.Section>
                        <List.Group>
                          {names.slice(0, 8).map((name) => (
                            <List.Item key={name}>
                              <List.Content>
                                <List.Title>{name}</List.Title>
                              </List.Content>
                            </List.Item>
                          ))}
                        </List.Group>
                      </List.Section>
                    </List.Root>
                    <Viewport.Padding edge="block-end" />
                  </Page.Root>
                </Header.Root>
              </Drawer.Popup>
            </>
          )}
        </Drawer.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/drawer/parts`: its root, swipe area, popup, trigger, close, handles. */
export const DrawerParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root of the drawer’s state, its swipe area and its popup (the column
        over the content), and its triggers and closes.
      </li>
      <li>
        Swipe it in from the leading edge, or press the bar’s button; swipe it
        back, press the dimmed page or Done to close it.
      </li>
    </ul>
    <ul>
      <li className="demo-tree-context">
        <span>The app’s root, e.g. </span>
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        <ul>
          <li className="demo-tree-context">
            <span>Its content, e.g. </span>
            <PartLink
              component="header"
              part="Header.Root"
            />
            <span> (a bar and a page)</span>
            <ul>
              <li>
                <PartLink part="Drawer.Trigger" /> (optional, in its bar, linked
                by a handle)
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="Drawer.Root" />
            <ul>
              <li>
                <PartLink part="Drawer.SwipeArea" /> (optional)
              </li>
              <li>
                <PartLink part="Drawer.Popup" /> (its column, in a portal; the
                content dimmed behind it)
                <ul>
                  <li className="demo-tree-context">
                    <span>Its content, e.g. </span>
                    <PartLink
                      component="page"
                      part="Page.Root"
                    />
                    <ul>
                      <li>
                        <PartLink part="Drawer.Close" /> (optional)
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <PartLink part="Drawer.Trigger" /> (optional, in it)
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="Drawer.createHandle" /> (a drawer’s handle, for its
        triggers outside it)
        <ul>
          <li>
            <PartLink part="useCreateDrawerHandle" /> (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="drawer-root"
      level={2}
    >
      <code>Drawer.Root</code>
    </Heading>
    <ul>
      <li>
        A drawer (Base UI’s <code>Drawer.Root</code>): its state (controlled,{' '}
        <code>open</code>, or its own) for its parts, its <code>side</code> (the
        inline start or end).
      </li>
      <li>
        Closed by swiping it back, a press on the dimmed content (unless{' '}
        <code>disablePointerDismissal</code>), Escape, or a{' '}
        <PartLink part="Drawer.Close" />.
      </li>
      <li>Doesn’t render an element.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={drawerRootRows} />

    <Heading
      id="drawer-swipearea"
      level={2}
    >
      <code>Drawer.SwipeArea</code>
    </Heading>
    <ul>
      <li>
        A strip at its drawer’s edge (<code>width</code>, 20px) it’s swiped in
        from, where it’s rendered (fixed: the screen’s edge, or a layout
        column’s); without one (or <code>disabled</code>), the drawer isn’t
        swiped in.
      </li>
      <li>
        The drawer follows the swipe; let go past half its width, or while still
        moving (a fling), it opens, otherwise it closes again (Base UI’s rule,
        not configurable).
      </li>
      <li>
        Renders a <code>div</code> (Base UI’s <code>Drawer.SwipeArea</code>):
        nothing of its own to see, so overlaid here.
      </li>
    </ul>
    <SwipeAreaPart />
    <h3>Props</h3>
    <PropsTable rows={drawerSwipeAreaRows} />

    <Heading
      id="drawer-popup"
      level={2}
    >
      <code>Drawer.Popup</code>
    </Heading>
    <ul>
      <li>
        Its column, over the content at its side (its <code>size</code>, 320px,
        at most the container’s less 44px), the content dimmed behind it; kept
        mounted while closed (its pages keep their state).
      </li>
      <li>
        In a portal (its <code>container</code>, else the provided one, else the
        body), a backdrop and a viewport around it; <code>floating</code>: no
        background or shadow of its own.
      </li>
      <li>
        Renders a <code>div</code> (Base UI’s <code>Drawer.Popup</code>).
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={drawerPopupRows} />

    <Heading
      id="drawer-trigger"
      level={2}
    >
      <code>Drawer.Trigger</code>
    </Heading>
    <ul>
      <li>
        A button opening its drawer: in it, or (as in the page’s bar) linked to
        it by a <code>handle</code> (
        <PartLink part="useCreateDrawerHandle">
          useCreateDrawerHandle()
        </PartLink>
        ).
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
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={drawerTriggerRows} />

    <Heading
      id="drawer-close"
      level={2}
    >
      <code>Drawer.Close</code>
    </Heading>
    <ul>
      <li>
        A button closing its drawer, in its content (e.g. its bar’s Done).
      </li>
      <li>
        Renders a <code>button</code> (Base UI’s <code>Drawer.Close</code>).
      </li>
    </ul>
    <ClosePart />
    <h3>Props</h3>
    <PropsTable rows={drawerCloseRows} />

    <Heading
      id="drawer-createhandle"
      level={2}
    >
      <code>Drawer.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle linking a drawer to its triggers outside it (e.g. in the
        content’s bar; nested drawers would shadow each other’s), and opening or
        closing it imperatively (Base UI’s <code>Drawer.createHandle</code>).
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink part="useCreateDrawerHandle" />
        ). Not needed for a trigger in the drawer, nor for a controlled drawer
        (opened by the app’s <code>open</code>).
      </li>
      <li>
        Here: made at the module’s top level; the bar’s button a trigger, the
        page’s button opening it imperatively (its <code>open()</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={drawerHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={drawerHandleRows} />

    <Heading
      id="usecreatedrawerhandle"
      level={2}
    >
      <code>useCreateDrawerHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink part="Drawer.createHandle" /> in a component: the same handle
        for the component’s lifetime.
      </li>
      <li>
        Here: two triggers, one drawer; each passes its title (its{' '}
        <code>payload</code>), the drawer’s children a function of it.
      </li>
    </ul>
    <UseCreateDrawerHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={drawerHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={drawerHandleRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const drawerPartsDemos = [
  RootPart,
  SwipeAreaPart,
  PopupPart,
  TriggerPart,
  ClosePart,
  CreateHandlePart,
  UseCreateDrawerHandlePart,
];
