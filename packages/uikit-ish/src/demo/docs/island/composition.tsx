import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Island,
  List,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfEllipsis, sfSquareAndArrowUp } from '../../tooling/icons.js';
import { names } from '../viewport/content.js';
import { MapView } from './map.js';
import {
  getPropOptionsOverviewRoot,
  getPropOptionsSliverRoot,
} from './props.js';

const overAMapCode = `<Viewport.Content safeArea="none">
  {/* The map (MapLibre's), filling the content layer. */}
  <MapView />
</Viewport.Content>
<Viewport.Anchor edge="block-end" edgeEffect="none">
  <Island.Root defaultSnapPoint="peek">
    <Island.Header>
      <Island.Grabber />
      <Toolbar.Root placement="block-start">…</Toolbar.Root>
    </Island.Header>
    <Island.Content>
      <Viewport.Padding edge="block-start" />
      <Island.SnapGroup value="header" />
      <Island.SnapGroup value="peek">…</Island.SnapGroup>
      <Island.SnapGroup value="details">…</Island.SnapGroup>
      <Island.SnapGroup value="all">…</Island.SnapGroup>
      <Viewport.Padding edge="block-end" />
    </Island.Content>
  </Island.Root>
</Viewport.Anchor>`;

const asASliverCode = `// In MapView (isFollowing): its camera clear of the island, as it settles.
const bottom = useAnchorSize('block-end');
useEffect(() => {
  map.easeTo({ padding: { bottom } });
}, [bottom]);

<Viewport.Content safeArea="none">
  <MapView isFollowing />
</Viewport.Content>
<Viewport.Anchor edge="block-end" edgeEffect="none">
  <Island.Root defaultSnapPoint="sliver">
    <Island.Header>
      <Island.Grabber />
      {/* Its lowest stop: a sliver, its grabber alone. */}
      <Island.SnapGroup value="sliver" />
      <Toolbar.Root placement="block-start">…</Toolbar.Root>
    </Island.Header>
    <Island.Content>…</Island.Content>
  </Island.Root>
</Viewport.Anchor>`;

const withoutAHeaderStopCode = `<Island.Root defaultSnapPoint="peek">
  <Island.Header>
    <Island.Grabber />
    <Toolbar.Root placement="block-start">…</Toolbar.Root>
  </Island.Header>
  <Island.Content>
    <Viewport.Padding edge="block-start" />
    {/* No empty group first: no stop of its header alone. */}
    <Island.SnapGroup value="peek">…</Island.SnapGroup>
    <Island.SnapGroup value="details">…</Island.SnapGroup>
    <Island.SnapGroup value="all">…</Island.SnapGroup>
    <Viewport.Padding edge="block-end" />
  </Island.Content>
</Island.Root>`;

const withoutStopsCode = `<Viewport.Content safeArea="none">
  <MapView />
</Viewport.Content>
<Viewport.Anchor edge="block-end" edgeEffect="none">
  <Island.Root>
    {/* Not swiped: no grabber. */}
    <Island.Header>
      <Toolbar.Root placement="block-start">…</Toolbar.Root>
    </Island.Header>
    <Island.Content>
      <Viewport.Padding edge="block-start" />
      <List.Root>…</List.Root>
      <Viewport.Padding edge="block-end" />
    </Island.Content>
  </Island.Root>
</Viewport.Anchor>`;

/** Over a map: a place's island, its stops (a peek at first). */
const OverAMap: FunctionComponent = () => {
  const id = 'island-composition-over-a-map';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(() => getPropOptionsOverviewRoot(addLog), [addLog]),
    { external, isOpen: true, title: 'Island.Root' },
  );

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Over a map"
    >
      <Viewport.Content safeArea="none">
        <MapView />
      </Viewport.Content>
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

/** As a sliver: its grabber alone at first (the most map), then its stops. */
const AsASliver: FunctionComponent = () => {
  const id = 'island-composition-as-a-sliver';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(() => getPropOptionsSliverRoot(addLog), [addLog]),
    { external, isOpen: true, title: 'Island.Root' },
  );

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="As a sliver"
    >
      <Viewport.Content safeArea="none">
        <MapView isFollowing />
      </Viewport.Content>
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
            {/* Its lowest stop: a sliver, its grabber alone. */}
            <Island.SnapGroup value="sliver" />
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

/**
 * Without a header stop: its groups alone (scrolled away, none below its
 * top stop: it stays put).
 */
const WithoutAHeaderStop: FunctionComponent = () => {
  const id = 'island-composition-without-a-header-stop';
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="Without a header stop"
    >
      <Viewport.Content safeArea="none">
        <MapView />
      </Viewport.Content>
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root defaultSnapPoint="peek">
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

/** Without stops: a plain capsule, as tall as its content. */
const WithoutStops: FunctionComponent = () => {
  const id = 'island-composition-without-stops';
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="Without stops"
    >
      <Viewport.Content safeArea="none">
        <MapView />
      </Viewport.Content>
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root>
          <Island.Header>
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
            <Viewport.Padding edge="block-end" />
          </Island.Content>
        </Island.Root>
      </Viewport.Anchor>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['over-a-map', 'Over a map'],
  ['as-a-sliver', 'As a sliver'],
  ['without-a-header-stop', 'Without a header stop'],
  ['without-stops', 'Without stops'],
];

/** `/island/composition`: an island over a map. */
export const IslandComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="over-a-map"
      level={2}
    >
      Over a map
    </Heading>
    <ul>
      <li>
        The map is the page: it fills the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />{' '}
        (<code>safeArea=&quot;none&quot;</code>: under the bars and the safe
        areas), and fits, so nothing scrolls. No anchor of its own.
      </li>
      <li>
        The island floats over it, in a bottom{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />{' '}
        (<code>edgeEffect=&quot;none&quot;</code>: nothing scrolls under it);
        touches beside it and above it reach the map.
      </li>
      <li>
        The map stays where it is as the island moves: its camera isn’t moved
        (unexpected, that would irritate; see the sliver below for the
        opposite). Its credits stay above the island and clear of the safe areas
        (the content layer’s <code>--uikit-viewport-anchor-block-end</code>).
      </li>
      <li>
        The map: MapLibre, OpenStreetMap’s tiles (credited), loaded as it’s
        shown.
      </li>
    </ul>
    <CodeView code={overAMapCode} />
    <OverAMap />

    <Heading
      id="as-a-sliver"
      level={2}
    >
      As a sliver
    </Heading>
    <ul>
      <li>
        Its lowest stop its grabber alone: the most room for the map, still
        clearly something to grab and swipe up.
      </li>
      <li>
        An empty{' '}
        <PartLink
          component="island"
          part="Island.SnapGroup"
        />{' '}
        in its header, right after its{' '}
        <PartLink
          component="island"
          part="Island.Grabber"
        />
        ; its other stops as before.
      </li>
      <li>
        Here the map follows the island: as it settles at a stop, the map’s
        camera eases so its center stays in view above it (its padding, from{' '}
        <PartLink
          component="viewport"
          part="useAnchorSize"
        />
        ). Useful with a sliver, the island covering more of the map as it’s
        swiped up; done where the user expects it.
      </li>
    </ul>
    <CodeView code={asASliverCode} />
    <AsASliver />

    <Heading
      id="without-a-header-stop"
      level={2}
    >
      Without a header stop
    </Heading>
    <ul>
      <li>
        Its groups alone: no empty{' '}
        <PartLink
          component="island"
          part="Island.SnapGroup"
        />{' '}
        first, so its lowest stop is its peek.
      </li>
      <li>
        Fully extended, with its reviews scrolled, no stop below the top one
        counts (the groups scrolled away aren’t stops): dragging its header
        down, it stays put, as an island without stops does. Scrolled back to
        the start, its stops count again.
      </li>
    </ul>
    <CodeView code={withoutAHeaderStopCode} />
    <WithoutAHeaderStop />

    <Heading
      id="without-stops"
      level={2}
    >
      Without stops
    </Heading>
    <ul>
      <li>
        No snap groups: a plain capsule as tall as its content (up to as tall as
        it may be, its content scrolling), not swiped: no grabber.
      </li>
    </ul>
    <CodeView code={withoutStopsCode} />
    <WithoutStops />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const islandCompositionDemos = [
  OverAMap,
  AsASliver,
  WithoutAHeaderStop,
  WithoutStops,
];
