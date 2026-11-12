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
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfListBullet } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import {
  drawerPopupRows,
  drawerRootRows,
  drawerSwipeAreaRows,
  drawerTriggerRows,
} from './docs.js';
import { useDrawerControls } from './props.js';

/** The view's code's start: the handle linking the bar's button. */
const setup = 'const contactsDrawer = useCreateDrawerHandle();';

/**
 * A phone's page: its bar's button opening the contacts' drawer, swiped in
 * from the leading edge too.
 */
const LiveView: FunctionComponent = () => {
  const id = 'drawer-overview';
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
  } = useDrawerControls(id, addLog);

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
      title="Drawer"
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/drawer`: what a drawer is for, and its props. */
export const DrawerOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A column that slides over the content from the inline start or end, with
        the content dimmed behind it. It’s built on Base UI’s{' '}
        <code>Drawer</code>, and modeled on Framework7’s panels.
      </li>
      <li>
        It’s swiped in from its edge, or opened by a button. Swipe it back,
        press the dimmed content, or use a close button to close it.
      </li>
      <li>
        For example, a compact layout’s sidebar or inspector: on a phone, an app
        can show a <a href={publicUrl('layout')}>Layout</a>’s column as a
        drawer.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For a sidebar (mailboxes, folders) or an inspector on a phone, at hand
        from the edge without leaving the page.
      </li>
      <li>
        For a tablet’s columns on a phone: the columns that don’t fit become
        drawers (see <a href={publicUrl('drawer/composition')}>Composition</a>).
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        There’s room for it: use a <a href={publicUrl('layout')}>Layout</a>{' '}
        column, side by side.
      </li>
      <li>
        Drilling into a list: use a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>, one column at a time.
      </li>
      <li>
        A self-contained task above the page: use a{' '}
        <a href={publicUrl('sheet')}>Sheet</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most drawers set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('drawer/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Drawer.Root',
          pickRows(
            drawerRootRows,
            'side',
            'defaultOpen',
            'open',
            'onOpenChange',
            'handle',
            'disablePointerDismissal',
          ),
        ],
        [
          'Drawer.SwipeArea',
          pickRows(drawerSwipeAreaRows, 'width', 'disabled'),
        ],
        ['Drawer.Popup', pickRows(drawerPopupRows, 'size', 'floating')],
        ['Drawer.Trigger', pickRows(drawerTriggerRows, 'handle', 'payload')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        It’s Base UI’s <code>Drawer</code>, a dialog. When it opens, focus moves
        into it and stays there (it’s modal). Escape closes it, and focus
        returns to its trigger. A closed drawer is hidden.
      </li>
      <li>
        Swiping it in is a pointer gesture, so a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Trigger"
        />{' '}
        should open it too, as here.
      </li>
      <li>
        Its transitions and the dimming’s (300ms) don’t follow{' '}
        <code>prefers-reduced-motion</code>.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        It sits above the content at its <code>side</code>, at its size (320px),
        and at most 44px short of its container’s width. It’s hidden until
        opened, either by a swipe from its{' '}
        <PartLink
          component="drawer"
          part="Drawer.SwipeArea"
        />{' '}
        (a strip at its edge, 20px wide by default; without one, it can’t be
        swiped in) or by a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Trigger"
        />
        .
      </li>
      <li>
        Swipe it back, press the dimmed content (unless{' '}
        <code>disablePointerDismissal</code> is set), or use a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />{' '}
        to close it. While swiped, it follows the finger. Let go past half its
        width, or flick it, and it switches state (Base UI’s rule).
      </li>
      <li>
        Its popup renders in a portal (into the provided container, else the
        body), above the page’s layers like other overlays (z-index 100). Its
        swipe area stays fixed where it’s rendered, below them.
      </li>
      <li>
        It mirrors in right-to-left languages, both its sides and its swipes.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const drawerOverviewDemos = [LiveView];
