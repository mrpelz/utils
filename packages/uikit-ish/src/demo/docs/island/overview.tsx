import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Island,
  List,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfEllipsis, sfSquareAndArrowUp } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { names } from '../viewport/content.js';
import { islandRootRows, islandSnapGroupRows } from './docs.js';
import { getPropOptionsOverviewRoot } from './props.js';

/** A phone's screen: a place's island, starting at its peek. */
const LiveView: FunctionComponent = () => {
  const id = 'island-overview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(() => getPropOptionsOverviewRoot(addLog), [addLog]),
    { external, isOpen: true, title: 'Island.Root' },
  );

  return (
    <Component
      hasWallpaper
      isExpanded
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Island"
    >
      <Viewport.Content />
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root
          key={`${key}`}
          {...props}
        >
          <Island.Header>
            <Island.Grabber />
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Share"
                  shape="circle"
                  onClick={() => addLog('Share clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>Harbor Café</Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="More"
                  shape="circle"
                  onClick={() => addLog('More clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfEllipsis} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Island.Header>
          <Island.Content>
            <Viewport.Padding edge="block-start" />
            {/* Its header alone: an empty group first. */}
            <Island.SnapGroup value="header" />
            <Island.SnapGroup value="peek">
              <List.Root>
                <List.Section>
                  <List.Group>
                    <List.Item>
                      <List.Content>
                        <List.Title>Open until 6 PM</List.Title>
                        <List.Subtitle>Café · 300 m</List.Subtitle>
                      </List.Content>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup value="details">
              <List.Root>
                <List.Section>
                  <List.Group>
                    {['Call', 'Website', 'Directions'].map((name) => (
                      <List.Item key={name}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup value="all">
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                          <List.Subtitle>Review</List.Subtitle>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Viewport.Padding edge="block-end" />
          </Island.Content>
        </Island.Root>
      </Viewport.Anchor>
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

/** `/island`: what an island is for, and its props. */
export const IslandOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A sheet’s glass capsule (dark, edged as a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>’s: a light rim, a glow
        outside) that’s always there, floating over the page’s content (e.g. a
        map that fills the screen), in a bottom{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        .
      </li>
      <li>
        Swiped up, it reveals more, stop by stop (its snap groups); never
        closed.
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
        Complex UI over a canvas that fills the screen and stays put: a map, a
        photo, a drawing; revealed as needed, the canvas kept in view.
      </li>
      <li>
        Progressive detail: a place’s name, then its hours, then everything
        about it (see <a href={publicUrl('island/composition')}>Composition</a>
        ).
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
        A task of its own, over the page, then gone: a{' '}
        <a href={publicUrl('sheet')}>Sheet</a> (modal, dismissed).
      </li>
      <li>
        A few commands for a scrolling page: a{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a> at its bottom.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most islands set, across their parts.</li>
      <li>
        All parts’ props: <a href={publicUrl('island/parts')}>Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Island.Root',
          pickRows(islandRootRows, 'defaultSnapPoint', 'onSnapPointChange'),
        ],
        ['Island.SnapGroup', pickRows(islandSnapGroupRows, 'value')],
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
        Not a dialog: part of the page, in its order, its content reachable as
        any other (its stops a pointer’s and a wheel’s; by keyboard, its content
        scrolls into view as it’s focused).
      </li>
      <li>
        Its grabber is hidden from assistive tech; give the bar a title (its
        content’s name).
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
        Compact: 8px from the screen’s sides and bottom (the home indicator over
        its bottom margin), its corners 42px (as iOS 26’s floating sheets,
        measured). Regular: a floating panel at the inline start, up to 375px
        wide.
      </li>
      <li>
        Its box is what it shows: as tall as its stop (or, without stops, its
        content), so the page’s paddings and the content layer’s{' '}
        <code>--uikit-viewport-anchor-block-end</code> follow it as it settles.
      </li>
      <li>
        Up to 64px below the screen’s top (and clear of the top inset); its
        content scrolls at its top stop only, a pull down from its start (a
        touch, or a wheel or trackpad scroll begun there) handing back to the
        island.
      </li>
      <li>
        With the keyboard (a field in it typed into): pushed up with its anchor
        (a bottom one, <code>keyboard=&quot;push&quot;</code>), up to 64px below
        the screen’s top still, its stops no taller; back at its stop as the
        keyboard hides.
      </li>
      <li>
        Swiped: flung, a stop at a time; otherwise to the nearest stop, let go.
        Never closed: its lowest stop its least (e.g. a sliver, its grabber
        alone).
      </li>
      <li>
        Touches beside it and above it reach the page’s content beneath (e.g.
        the map).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const islandOverviewDemos = [LiveView];
