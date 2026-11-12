import { FunctionComponent, useMemo } from 'react';

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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfHeart, sfListBullet } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Block': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
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
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Drawer.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
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
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root
              {...partProps['List.Root']}
              listStyle="plain"
            >
              <List.Block {...partProps['List.Block']}>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Drawer.Close {...propsClose}>
                      <Button.Label {...partProps['Button.Label']}>
                        Done
                      </Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
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
                      {names.slice(0, 8).map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Block': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
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
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Drawer.SwipeArea"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
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
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root
              {...partProps['List.Root']}
              listStyle="plain"
            >
              <List.Block {...partProps['List.Block']}>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Drawer.Close {...propsClose}>
                      <Button.Label {...partProps['Button.Label']}>
                        Done
                      </Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
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
                      {names.slice(0, 8).map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Block': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
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
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Drawer.Popup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
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
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root
              {...partProps['List.Root']}
              listStyle="plain"
            >
              <List.Block {...partProps['List.Block']}>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Drawer.Close {...propsClose}>
                      <Button.Label {...partProps['Button.Label']}>
                        Done
                      </Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
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
                      {names.slice(0, 8).map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Block': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
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
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Drawer.Trigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
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
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root
              {...partProps['List.Root']}
              listStyle="plain"
            >
              <List.Block {...partProps['List.Block']}>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Drawer.Close {...propsClose}>
                      <Button.Label {...partProps['Button.Label']}>
                        Done
                      </Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
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
                      {names.slice(0, 8).map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Block': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
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
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Drawer.Close"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={contactsDrawer}
                  {...propsTrigger}
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
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root
              {...partProps['List.Root']}
              listStyle="plain"
            >
              <List.Block {...partProps['List.Block']}>
                Swipe the contacts in from the leading edge, or press the
                button.
              </List.Block>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Drawer.Close {...propsClose}>
                      <Button.Label {...partProps['Button.Label']}>
                        Done
                      </Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
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
                      {names.slice(0, 8).map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'List.Block': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
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
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[...state, partState]}
      title="Drawer.createHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Drawer.Trigger
                  aria-label="Favorites"
                  handle={favoritesDrawer}
                  {...propsTrigger}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfHeart}
                    />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root
              {...partProps['List.Root']}
              listStyle="plain"
            >
              <List.Block {...partProps['List.Block']}>
                <Button.Root
                  {...partProps['Button.Root']}
                  variant="bordered"
                  onClick={() => favoritesDrawer.open(null)}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Show Favorites
                  </Button.Label>
                </Button.Root>
              </List.Block>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
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
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Favorites</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Drawer.Close {...propsClose}>
                      <Button.Label {...partProps['Button.Label']}>
                        Done
                      </Button.Label>
                    </Drawer.Close>
                  </Toolbar.Trailing>
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
                      {names.slice(0, 4).map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              {name}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
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
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      setup="const peopleDrawer = useCreateDrawerHandle<{ title: string }>();"
      stage="phone"
      state={[...state, partState]}
      title="useCreateDrawerHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Drawer.Trigger
                  aria-label="Contacts"
                  handle={peopleDrawer}
                  payload={{ title: 'Contacts' }}
                  {...propsTrigger}
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
                <span>Messages</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Drawer.Trigger
                  aria-label="Favorites"
                  handle={peopleDrawer}
                  payload={{ title: 'Favorites' }}
                  {...propsTrigger}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfHeart}
                    />
                  </Button.Icon>
                </Drawer.Trigger>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          />
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
                  <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                    <Toolbar.Root
                      {...partProps['Toolbar.Root']}
                      placement="block-start"
                    >
                      <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                      <Toolbar.Title {...partProps['Toolbar.Title']}>
                        <span>{payload?.title}</span>
                      </Toolbar.Title>
                      <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                        <Drawer.Close {...propsClose}>
                          <Button.Label {...partProps['Button.Label']}>
                            Done
                          </Button.Label>
                        </Drawer.Close>
                      </Toolbar.Trailing>
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
                          {names.slice(0, 8).map((name) => (
                            <List.Item
                              key={name}
                              {...partProps['List.Item']}
                            >
                              <List.Content {...partProps['List.Content']}>
                                <List.Title {...partProps['List.Title']}>
                                  {name}
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
        A root holding the drawer’s state, its swipe area, its popup (the column
        above the content), and its triggers and close buttons.
      </li>
      <li>
        Swipe it in from the leading edge, or press the bar’s button. Swipe it
        back, or press the dimmed page or Done, to close it.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <span>The app’s root, for example</span>{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        <ul>
          <li className="demo-tree-context">
            <span>Its content, for example a</span>{' '}
            <PartLink
              component="header"
              part="Header.Root"
            />{' '}
            <span>(a bar and a page)</span>
            <ul>
              <li>
                <PartLink
                  component="drawer"
                  part="Drawer.Trigger"
                />{' '}
                (optional, in its bar, linked by a handle)
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="drawer"
              part="Drawer.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="drawer"
                  part="Drawer.SwipeArea"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="drawer"
                  part="Drawer.Popup"
                />{' '}
                (its column, in a portal, with the content dimmed behind it)
                <ul>
                  <li className="demo-tree-context">
                    <span>Its content, for example a</span>{' '}
                    <PartLink
                      component="header"
                      part="Header.Root"
                    />{' '}
                    <span>with a bar and a</span>{' '}
                    <PartLink
                      component="page"
                      part="Page.Root"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="drawer"
                          part="Drawer.Close"
                        />{' '}
                        (optional, in the bar)
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="drawer"
                  part="Drawer.Trigger"
                />{' '}
                (optional, inside the root)
              </li>
            </ul>
          </li>
        </ul>
      </li>
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
        A drawer (Base UI’s <code>Drawer.Root</code>). It holds the state for
        its parts, either controlled (<code>open</code>) or its own, and its{' '}
        <code>side</code> (the inline start or end).
      </li>
      <li>
        It closes when swiped back, on a press on the dimmed content (unless{' '}
        <code>disablePointerDismissal</code> is set), on Escape, or through a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />
        .
      </li>
      <li>It doesn’t render an element.</li>
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
        A strip at the drawer’s edge that it’s swiped in from (
        <code>width</code>, 20px by default). It’s fixed where it’s rendered: at
        the screen’s edge, or a layout column’s. Without one, or when{' '}
        <code>disabled</code>, the drawer can’t be swiped in.
      </li>
      <li>
        The drawer follows the swipe. Let go past half its width, or while still
        moving (a fling), and it opens. Otherwise it closes again. That’s Base
        UI’s rule, and it can’t be configured.
      </li>
      <li>
        A touch that moves sideways first is the swipe, and nothing scrolls
        until it ends. A touch that moves vertically first scrolls the page, as
        anywhere.
      </li>
      <li>
        Renders a <code>div</code> (Base UI’s <code>Drawer.SwipeArea</code>).
        There’s nothing of it to see, so it’s overlaid here.
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
        The drawer’s column, above the content at its side, with the content
        dimmed behind it. It’s as wide as its <code>size</code> (320px), and at
        most the container’s width minus 44px. It stays mounted while closed, so
        its pages keep their state.
      </li>
      <li>
        It renders in a portal (its <code>container</code>, else the provided
        one, else the body), with a backdrop and a viewport around it. With{' '}
        <code>floating</code>, it has no background or shadow of its own.
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
        A button that opens its drawer. It sits inside the drawer, or is linked
        to it by a <code>handle</code> when it’s elsewhere, like the page’s bar
        here (
        <PartLink
          component="drawer"
          part="useCreateDrawerHandle"
        >
          useCreateDrawerHandle()
        </PartLink>
        ).
      </li>
      <li>
        Renders a <code>button</code> (Base UI’s <code>Drawer.Trigger</code>),
        or another element through its <code>render</code>, for example a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />
        .
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
        A button inside the drawer’s content that closes it, for example its
        bar’s Done.
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
        A handle that links a drawer to triggers outside it (for example in the
        content’s bar; nested drawers would otherwise shadow each other’s). It
        also opens or closes the drawer from code. It’s Base UI’s{' '}
        <code>Drawer.createHandle</code>.
      </li>
      <li>
        Make it once, for example at a module’s top level (inside a component,
        use{' '}
        <PartLink
          component="drawer"
          part="useCreateDrawerHandle"
        />
        ). A trigger inside the drawer doesn’t need one, and neither does a
        controlled drawer (opened by the app’s <code>open</code>).
      </li>
      <li>
        Here, it’s made at the module’s top level. The bar’s button is a
        trigger, and the page’s button opens the drawer from code (its{' '}
        <code>open()</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
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
        <PartLink
          component="drawer"
          part="Drawer.createHandle"
        />{' '}
        inside a component. The same handle is kept for the component’s
        lifetime.
      </li>
      <li>
        Here, two triggers open one drawer. Each passes its title (its{' '}
        <code>payload</code>), and the drawer’s children are a function of it.
      </li>
    </ul>
    <UseCreateDrawerHandlePart />
    <h3>Type Parameters</h3>
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
