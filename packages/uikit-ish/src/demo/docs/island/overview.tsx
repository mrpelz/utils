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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
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
import { partPropMaps } from '../part-options.js';
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
      hasWallpaper
      isExpanded
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Island"
    >
      <Viewport.Content {...partProps['Viewport.Content']} />
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
        A sheet’s glass capsule that’s always there, floating above the page’s
        content (for example a map that fills the screen), in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        . In dark mode, its glass has an edge like a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>’s: a light rim with a glow
        outside.
      </li>
      <li>
        Swiped up, it reveals more, stop by stop (its snap groups). It never
        closes.
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
        For complex UI above a canvas that fills the screen and stays put, such
        as a map, a photo or a drawing. It reveals what’s needed and keeps the
        canvas in view.
      </li>
      <li>
        For progressive detail: a place’s name, then its hours, then everything
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
        A task of its own that sits above the page and then goes away: use a{' '}
        <a href={publicUrl('sheet')}>Sheet</a> (modal, and dismissed when done).
      </li>
      <li>
        A few commands for a scrolling page: use a{' '}
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
      <li>The props most islands set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('island/parts')}>Parts</a> page.
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
        It’s not a dialog. It’s part of the page, in the page’s order, and its
        content is reachable like any other. Its stops are for pointers and
        wheels; with the keyboard, its content scrolls into view as it gets
        focus.
      </li>
      <li>
        Its grabber is hidden from assistive technology. Give the bar a title
        that names its content.
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
        Compact: 8px from the screen’s sides and bottom (the home indicator sits
        over its bottom margin), with 42px corners. Regular: a floating panel at
        the inline start, up to 375px wide.
      </li>
      <li>
        Its box is what it shows: as tall as its stop (or, without stops, its
        content). So the page’s paddings and the content layer’s{' '}
        <code>--uikit-viewport-anchor-block-end</code> follow it as it settles.
      </li>
      <li>
        It reaches up to 64px below the screen’s top, and stays clear of the top
        inset and the bars there (for example a page’s navigation bar, so its
        back button can still be reached). Its content only scrolls at its top
        stop. A pull down from the content’s start (a touch, or a wheel or
        trackpad scroll that started there) hands back to the island.
      </li>
      <li>
        When a field inside it is typed into, the keyboard pushes it up with its
        anchor (at the bottom, the keyboard pushes an anchor up by default). The
        room above it stays as before, and its stops get no taller. Fully
        extended, its top stays put while its bottom follows the keyboard. It
        goes back to its stop as the keyboard hides.
      </li>
      <li>
        When swiped and flung, it moves one stop at a time. Otherwise, it goes
        to the nearest stop when let go. It never closes: its lowest stop is the
        least it shows (for example a sliver with only its grabber).
      </li>
      <li>
        Touches next to it and above it reach the page’s content beneath, such
        as the map.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const islandOverviewDemos = [LiveView];
