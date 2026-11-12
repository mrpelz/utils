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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfEllipsis, sfSquareAndArrowUp } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
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
<Viewport.BlockEnd edgeEffect="none">
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
</Viewport.BlockEnd>`;

const asASliverCode = `// In MapView (isFollowing): its camera clear of the island, as it settles.
const bottom = useAnchorSize('block-end');
useEffect(() => {
  map.easeTo({ padding: { bottom } });
}, [bottom]);

<Viewport.Content safeArea="none">
  <MapView isFollowing />
</Viewport.Content>
<Viewport.BlockEnd edgeEffect="none">
  <Island.Root defaultSnapPoint="sliver">
    <Island.Header>
      <Island.Grabber />
      {/* Its lowest stop: a sliver, its grabber alone. */}
      <Island.SnapGroup value="sliver" />
      <Toolbar.Root placement="block-start">…</Toolbar.Root>
    </Island.Header>
    <Island.Content>…</Island.Content>
  </Island.Root>
</Viewport.BlockEnd>`;

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
<Viewport.BlockEnd edgeEffect="none">
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
</Viewport.BlockEnd>`;

/** Over a map: a place's island, its stops (a peek at first). */
const OverAMap: FunctionComponent = () => {
  const id = 'island-composition-over-a-map';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(() => getPropOptionsOverviewRoot(addLog), [addLog]),
    { external, isOpen: true, title: 'Island.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Island.Content': [],
            'Island.Grabber': [],
            'Island.Header': [],
            'Island.SnapGroup': ['value'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': ['edgeEffect'],
            'Viewport.Content': ['safeArea'],
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
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Over a map"
    >
      <Viewport.Content
        {...partProps['Viewport.Content']}
        safeArea="none"
      >
        <MapView />
      </Viewport.Content>
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${key}`}
          {...props}
        >
          <Island.Header {...partProps['Island.Header']}>
            <Island.Grabber {...partProps['Island.Grabber']} />
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Share"
                  shape="circle"
                  onClick={() => addLog('Share clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                Harbor Café
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="More"
                  shape="circle"
                  onClick={() => addLog('More clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfEllipsis}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Island.Header>
          <Island.Content {...partProps['Island.Content']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            {/* Its header alone: an empty group first. */}
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="header"
            />
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="peek"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    <List.Item {...partProps['List.Item']}>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Open until 6 PM
                        </List.Title>
                        <List.Subtitle {...partProps['List.Subtitle']}>
                          Café · 300 m
                        </List.Subtitle>
                      </List.Content>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="details"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {['Call', 'Website', 'Directions'].map((name) => (
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
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="all"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                          <List.Subtitle {...partProps['List.Subtitle']}>
                            Review
                          </List.Subtitle>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Island.Content>
        </Island.Root>
      </Viewport.BlockEnd>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Island.Content': [],
            'Island.Grabber': [],
            'Island.Header': [],
            'Island.SnapGroup': ['value'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': ['edgeEffect'],
            'Viewport.Content': ['safeArea'],
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
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="As a sliver"
    >
      <Viewport.Content
        {...partProps['Viewport.Content']}
        safeArea="none"
      >
        <MapView isFollowing />
      </Viewport.Content>
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${key}`}
          {...props}
        >
          <Island.Header {...partProps['Island.Header']}>
            <Island.Grabber {...partProps['Island.Grabber']} />
            {/* Its lowest stop: a sliver, its grabber alone. */}
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="sliver"
            />
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Share"
                  shape="circle"
                  onClick={() => addLog('Share clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                Harbor Café
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="More"
                  shape="circle"
                  onClick={() => addLog('More clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfEllipsis}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Island.Header>
          <Island.Content {...partProps['Island.Content']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            {/* Its header alone: an empty group first. */}
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="header"
            />
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="peek"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    <List.Item {...partProps['List.Item']}>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Open until 6 PM
                        </List.Title>
                        <List.Subtitle {...partProps['List.Subtitle']}>
                          Café · 300 m
                        </List.Subtitle>
                      </List.Content>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="details"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {['Call', 'Website', 'Directions'].map((name) => (
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
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="all"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                          <List.Subtitle {...partProps['List.Subtitle']}>
                            Review
                          </List.Subtitle>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Island.Content>
        </Island.Root>
      </Viewport.BlockEnd>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Island.Content': [],
            'Island.Grabber': [],
            'Island.Header': [],
            'Island.Root': ['defaultSnapPoint'],
            'Island.SnapGroup': ['value'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': ['edgeEffect'],
            'Viewport.Content': ['safeArea'],
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
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Without a header stop"
    >
      <Viewport.Content
        {...partProps['Viewport.Content']}
        safeArea="none"
      >
        <MapView />
      </Viewport.Content>
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          {...partProps['Island.Root']}
          defaultSnapPoint="peek"
        >
          <Island.Header {...partProps['Island.Header']}>
            <Island.Grabber {...partProps['Island.Grabber']} />
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Share"
                  shape="circle"
                  onClick={() => addLog('Share clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                Harbor Café
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="More"
                  shape="circle"
                  onClick={() => addLog('More clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfEllipsis}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Island.Header>
          <Island.Content {...partProps['Island.Content']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="peek"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    <List.Item {...partProps['List.Item']}>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Open until 6 PM
                        </List.Title>
                        <List.Subtitle {...partProps['List.Subtitle']}>
                          Café · 300 m
                        </List.Subtitle>
                      </List.Content>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="details"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {['Call', 'Website', 'Directions'].map((name) => (
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
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="all"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                          <List.Subtitle {...partProps['List.Subtitle']}>
                            Review
                          </List.Subtitle>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Island.Content>
        </Island.Root>
      </Viewport.BlockEnd>
    </Component>
  );
};

/** Without stops: a plain capsule, as tall as its content. */
const WithoutStops: FunctionComponent = () => {
  const id = 'island-composition-without-stops';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Island.Content': [],
            'Island.Header': [],
            'Island.Root': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': ['edgeEffect'],
            'Viewport.Content': ['safeArea'],
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
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Without stops"
    >
      <Viewport.Content
        {...partProps['Viewport.Content']}
        safeArea="none"
      >
        <MapView />
      </Viewport.Content>
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root {...partProps['Island.Root']}>
          <Island.Header {...partProps['Island.Header']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Share"
                  shape="circle"
                  onClick={() => addLog('Share clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                Harbor Café
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="More"
                  shape="circle"
                  onClick={() => addLog('More clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfEllipsis}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Island.Header>
          <Island.Content {...partProps['Island.Content']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  <List.Item {...partProps['List.Item']}>
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>
                        Open until 6 PM
                      </List.Title>
                      <List.Subtitle {...partProps['List.Subtitle']}>
                        Café · 300 m
                      </List.Subtitle>
                    </List.Content>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Island.Content>
        </Island.Root>
      </Viewport.BlockEnd>
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
        The map is the page. It fills the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />{' '}
        (<code>safeArea=&quot;none&quot;</code>, so it runs under the bars and
        the safe area insets) and fits, so nothing scrolls. It has no anchor of
        its own.
      </li>
      <li>
        The island floats above it in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        (<code>edgeEffect=&quot;none&quot;</code>, since nothing scrolls under
        it). Touches next to it and above it reach the map.
      </li>
      <li>
        The map stays put as the island moves, and its camera doesn’t move. A
        camera moving unexpectedly would irritate (the sliver below shows the
        opposite). The map’s credits stay above the island and clear of the safe
        areas (using the content layer’s{' '}
        <code>--uikit-viewport-anchor-block-end</code>).
      </li>
      <li>
        The map is MapLibre with OpenStreetMap’s tiles (credited), loaded when
        it’s shown.
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
        Its lowest stop shows only its grabber. That leaves the most room for
        the map, while still clearly being something to grab and swipe up.
      </li>
      <li>
        It takes an empty{' '}
        <PartLink
          component="island"
          part="Island.SnapGroup"
        />{' '}
        in its header, right after its{' '}
        <PartLink
          component="island"
          part="Island.Grabber"
        />
        . Its other stops stay as before.
      </li>
      <li>
        Here, the map follows the island. As the island settles at a stop, the
        map’s camera eases so its center stays in view above it (with padding
        from{' '}
        <PartLink
          component="viewport"
          part="useAnchorSize"
        />
        ). That helps with a sliver, since the island covers more of the map as
        it’s swiped up. Do it only where people expect it.
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
        Only its groups, without an empty{' '}
        <PartLink
          component="island"
          part="Island.SnapGroup"
        />{' '}
        first, so its lowest stop is its peek.
      </li>
      <li>
        Once it’s fully extended with its reviews scrolled, no stop below the
        top one counts, because the groups scrolled away aren’t stops. Dragging
        its header down then leaves it where it is, like an island without
        stops. Scrolled back to the start, its stops count again.
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
        Without snap groups, it’s a plain capsule as tall as its content (up to
        the most it may be, with its content scrolling). It can’t be swiped, so
        it has no grabber.
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
