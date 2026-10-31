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
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfListBullet } from '../../tooling/icons.js';
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

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Drawer"
    >
      <Viewport.Content>
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
        A column over the content from the inline start or end (Base UI’s{' '}
        <code>Drawer</code>; Framework7’s panels), the content dimmed behind it.
      </li>
      <li>
        Swiped in from its edge, or opened by a button; swiped back, the dimmed
        content pressed, or a close to close.
      </li>
      <li>
        E.g. a compact layout’s sidebar or inspector: on a phone, a{' '}
        <a href="layout">Layout</a>’s column as a drawer (the app’s choice).
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
        A phone’s sidebar (mailboxes, folders) or inspector, at hand from the
        edge without leaving the page.
      </li>
      <li>
        A tablet’s columns on a phone: the columns that don’t fit as drawers
        (see <a href="drawer/composition">Composition</a>).
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
        Room for it: a <a href="layout">Layout</a>’s column, side by side.
      </li>
      <li>
        Drilling into a list: a <a href="navigation">Navigation</a> (one column
        at a time).
      </li>
      <li>
        A scoped task over the page: a <a href="sheet">Sheet</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most drawers set, across their parts.</li>
      <li>
        All parts’ props: <a href="drawer/parts">Parts</a>.
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
        Base UI’s <code>Drawer</code> (a dialog): opened, focus moves into it
        and stays there (modal); Escape closes it, focus returning to its
        trigger. A closed one is hidden.
      </li>
      <li>
        Swiping it in is a pointer gesture: a <PartLink part="Drawer.Trigger" />{' '}
        opens it too (as here).
      </li>
      <li>
        Its and the dimming’s transitions (300ms) don’t follow{' '}
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
        Over the content at its <code>side</code> (its size, 320px; at most 44px
        short of its container’s width), hidden until opened: swiped in from its{' '}
        <PartLink part="Drawer.SwipeArea" /> (a strip at its edge, its{' '}
        <code>width</code> 20px; none: not swiped in) or by a{' '}
        <PartLink part="Drawer.Trigger" />.
      </li>
      <li>
        Swiped back, the dimmed content pressed (unless{' '}
        <code>disablePointerDismissal</code>) or a{' '}
        <PartLink part="Drawer.Close" /> to close. Swiped, it follows the
        finger; let go past half its width (or flung), it switches (Base UI’s
        rule).
      </li>
      <li>
        Its popup in a portal (into the provided container, else the body), over
        the page’s layers (as overlays, z-index 100); its swipe area fixed where
        it’s rendered, below them.
      </li>
      <li>Mirrored right to left (its sides, its swipes).</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const drawerOverviewDemos = [LiveView];
