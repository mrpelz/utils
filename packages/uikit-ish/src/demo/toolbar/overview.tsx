import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { FunctionComponent } from 'react';

import {
  Button,
  List,
  Symbol,
  Toolbar,
  Viewport,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { names } from '../viewport/content.js';
import {
  toolbarButtonRows,
  toolbarGroupRows,
  toolbarRootRows,
  toolbarTitleRows,
} from './docs.js';
import {
  propOptionsOverviewBottom,
  propOptionsOverviewRoot,
  propOptionsOverviewTop,
} from './props.js';

/**
 * A phone's screen: a list beneath a bar at the top (a navigation bar) and
 * one at the bottom, both with the root's props.
 */
const LiveView: FunctionComponent = () => {
  const id = 'toolbar-overview';
  const [log, addLog] = useLog();
  const [externalRoot, externalTop, externalBottom] = useProvidedState(id);
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsOverviewRoot,
    'Toolbar.Root',
    externalRoot,
    true,
  );
  const [controlTop, top, stateTop] = usePropControl(
    propOptionsOverviewTop,
    '[top bar]',
    externalTop,
    true,
  );
  const [controlBottom, bottom, stateBottom] = usePropControl(
    propOptionsOverviewBottom,
    '[bottom bar]',
    externalBottom,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[controlRoot, controlTop, controlBottom]}
      id={id}
      log={log}
      state={[stateRoot, stateTop, stateBottom]}
      title="Toolbar"
    >
      <div
        key={elementKey}
        className="toolbar-demo-screen"
      >
        <Viewport.Content>
          <List.Root className="toolbar-demo-list">
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
        </Viewport.Content>
        {top.shown ? (
          <Viewport.BlockStart>
            <Toolbar.Root
              placement="block-start"
              {...propsRoot}
            >
              {top.leading ? (
                <Toolbar.Leading>
                  <Toolbar.Button
                    aria-label="Back"
                    shape="circle"
                    onClick={() => addLog('Back clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfChevronBackward} />
                    </Button.Icon>
                  </Toolbar.Button>
                </Toolbar.Leading>
              ) : null}
              <Toolbar.Title alignStart={top.alignStart}>
                <span>Contacts</span>
                {top.subtitle ? (
                  <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
                ) : null}
              </Toolbar.Title>
              {top.trailing ? (
                <Toolbar.Trailing>
                  <Toolbar.Group>
                    <Toolbar.Button
                      aria-label="Share"
                      shape="circle"
                      onClick={() => addLog('Share clicked')}
                    >
                      <Button.Icon>
                        <Symbol icon={sfSquareAndArrowUp} />
                      </Button.Icon>
                    </Toolbar.Button>
                    <Toolbar.Button
                      aria-label="More"
                      shape="circle"
                      onClick={() => addLog('More clicked')}
                    >
                      <Button.Icon>
                        <Symbol icon={sfEllipsis} />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Group>
                </Toolbar.Trailing>
              ) : null}
            </Toolbar.Root>
          </Viewport.BlockStart>
        ) : null}
        {bottom.shown ? (
          <Viewport.BlockEnd>
            <Toolbar.Root {...propsRoot}>
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Folders"
                  shape="circle"
                  onClick={() => addLog('Folders clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfFolder} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              {bottom.title ? (
                <Toolbar.Title>
                  <span>{names.length} Contacts</span>
                </Toolbar.Title>
              ) : null}
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="New contact"
                  prominent={bottom.prominent}
                  shape="circle"
                  onClick={() => addLog('New contact clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfSquareAndPencil} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        ) : null}
      </div>
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

/** `/toolbar`: what toolbars are for, and their props. */
export const ToolbarOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A bar of commands for the current view: glass capsules of buttons at its
        start and end, a title (or a control) between them.
      </li>
      <li>
        At the bottom of a screen (UIKit <code>UIToolbar</code>), or at its top
        (a navigation bar: <code>placement=&quot;block-start&quot;</code>, as a{' '}
        <a href="header">Header</a>’s bar).
      </li>
      <li>
        Built on Base UI’s Toolbar: one stop in the tab order, arrow keys
        between its buttons.
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
        Frequent commands for what a screen shows (compose, share, delete), at
        the bottom: in{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        (see <a href="viewport">Viewport</a>).
      </li>
      <li>
        A navigation bar at the top: back, the title, a page’s actions (in a
        page: <a href="header">Header</a>’s{' '}
        <PartLink
          component="header"
          part="Header.Bar"
        />
        , a toolbar at the top that sticks while the page scrolls).
      </li>
      <li>
        Acting on a selection in edit mode (Select All, Move, Delete), or
        hosting a control between the capsules (a search field, page dots, a
        segmented control; see <a href="toolbar/composition">Composition</a>).
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
        Moving between an app’s sections: a <a href="tab-bar">Tab bar</a> (a
        toolbar’s buttons act on the current view; tabs switch views).
      </li>
      <li>
        Many commands, or rarely used ones: a <a href="menu">Menu</a> behind one
        button (e.g. More, <code>ellipsis</code>).
      </li>
      <li>
        Commands on one item (a row): its swipe actions or a{' '}
        <a href="contextual-menu">Contextual menu</a>; a single action in the
        content: a <a href="button">Button</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most toolbars set, across their parts.</li>
      <li>
        All parts’ props: <a href="toolbar/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Toolbar.Root', pickRows(toolbarRootRows, 'placement', 'context')],
        ['Toolbar.Group', pickRows(toolbarGroupRows, 'prominent', 'tint')],
        [
          'Toolbar.Button',
          pickRows(toolbarButtonRows, 'prominent', 'shape', 'destructive'),
        ],
        ['Toolbar.Title', pickRows(toolbarTitleRows, 'alignStart')],
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
        The bar is a <code>toolbar</code> (Base UI): one stop in the tab order,
        the arrow keys move focus between its buttons (also across capsules),
        wrapping at its ends (<code>loopFocus</code>).
      </li>
      <li>
        Disabled buttons stay focusable (<code>focusableWhenDisabled</code>),
        announced as disabled, so the bar’s commands can still be found.
      </li>
      <li>
        A button with a symbol only needs a name (<code>aria-label</code>, e.g.
        Share).
      </li>
      <li>
        The title is text, not a heading: a page’s heading is its large title
        (see <a href="header">Header</a>), or render one (
        <code>render=&#123;&lt;h1 /&gt;&#125;</code>).
      </li>
      <li>
        Pressed capsules scale (a glass lens) without a reduced-motion
        alternative.
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
        At the bottom (default): 48px capsules, their buttons 36px, 12px apart;
        padded 4px 16px 36px (Figma’s, the home indicator’s 34px included, not
        the safe area’s). At the top: 44px capsules, 10px apart, 54px high.
      </li>
      <li>
        <code>Leading</code> and <code>Trailing</code> share the free space
        equally, so what’s between them (a title) is centered in the bar while
        they fit; a title aligned to the start takes the free space instead.
      </li>
      <li>
        A button of its own is a glass <a href="button">Button</a> (a circle for
        a symbol); several share a capsule (<code>Group</code>), their content
        blended with its glass.
      </li>
      <li>
        Pressed, a capsule of several buttons turns into a glass lens (scaled by
        1.05), the pressed button on the selection.
      </li>
      <li>
        Tinted (<code>prominent</code>, <code>tint</code>): the glass in the
        tint, its content white.
      </li>
      <li>
        Titles in Body Emphasized, truncated; with a subtitle (12px, the
        secondary label color) below, the title stays 17px.
      </li>
      <li>
        The bar has no position of its own: it’s placed by what it’s in (a
        viewport’s anchor, a header).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const toolbarOverviewDemos = [LiveView];
