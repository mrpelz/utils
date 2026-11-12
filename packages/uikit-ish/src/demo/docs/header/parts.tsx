import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Header,
  List,
  Page,
  Segmented,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfChevronBackward } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import {
  headerAccessoryRows,
  headerLargeTitleRows,
  headerRootRows,
} from './docs.js';
import { useHeaderControls } from './props.js';

// Each part's view: a phone's page, its header's bar (the app's toolbar,
// anchored) above its large title and accessory, every part's props, the
// part's own open and outlined.

/** `Header.Root`: its bar, large title and accessory, tied (no element of its own). */
const RootPart: FunctionComponent = () => {
  const id = 'header-parts-root';
  const [log, addLog] = useLog();
  const { controls, propsAccessory, propsBar, propsLargeTitle, state } =
    useHeaderControls(id, { hasAccessory: true });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue'],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Subtitle': [],
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
      title="Header.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Lists"
                  shape="circle"
                  onClick={() => addLog('Lists clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfChevronBackward}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Contacts</span>
              <Toolbar.Subtitle {...partProps['Toolbar.Subtitle']}>
                {names.length} people
              </Toolbar.Subtitle>
            </Header.LargeTitle>
            <Header.Accessory {...propsAccessory}>
              <Segmented.Root
                {...partProps['Segmented.Root']}
                aria-label="Show"
                defaultValue="all"
              >
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="all"
                >
                  All
                </Segmented.Item>
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="favorites"
                >
                  Favorites
                </Segmented.Item>
                <Segmented.Highlight {...partProps['Segmented.Highlight']} />
              </Segmented.Root>
            </Header.Accessory>
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
      </Viewport.Content>
    </Component>
  );
};
/** `Header.LargeTitle`, outlined, with a subtitle. */
const LargeTitlePart: FunctionComponent = () => {
  const id = 'header-parts-large-title';
  const [log, addLog] = useLog();
  const { controls, propsAccessory, propsBar, propsLargeTitle, state } =
    useHeaderControls(id, { featured: 'LargeTitle', hasAccessory: true });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue'],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Subtitle': [],
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
      title="Header.LargeTitle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Lists"
                  shape="circle"
                  onClick={() => addLog('Lists clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfChevronBackward}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Contacts</span>
              <Toolbar.Subtitle {...partProps['Toolbar.Subtitle']}>
                {names.length} people
              </Toolbar.Subtitle>
            </Header.LargeTitle>
            <Header.Accessory {...propsAccessory}>
              <Segmented.Root
                {...partProps['Segmented.Root']}
                aria-label="Show"
                defaultValue="all"
              >
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="all"
                >
                  All
                </Segmented.Item>
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="favorites"
                >
                  Favorites
                </Segmented.Item>
                <Segmented.Highlight {...partProps['Segmented.Highlight']} />
              </Segmented.Root>
            </Header.Accessory>
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
      </Viewport.Content>
    </Component>
  );
};
/** `Header.Accessory`, outlined: a segmented control staying below the bar. */
const AccessoryPart: FunctionComponent = () => {
  const id = 'header-parts-accessory';
  const [log, addLog] = useLog();
  const { controls, propsAccessory, propsBar, propsLargeTitle, state } =
    useHeaderControls(id, { featured: 'Accessory', hasAccessory: true });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue'],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Subtitle': [],
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
      title="Header.Accessory"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Lists"
                  shape="circle"
                  onClick={() => addLog('Lists clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfChevronBackward}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Contacts</span>
              <Toolbar.Subtitle {...partProps['Toolbar.Subtitle']}>
                {names.length} people
              </Toolbar.Subtitle>
            </Header.LargeTitle>
            <Header.Accessory {...propsAccessory}>
              <Segmented.Root
                {...partProps['Segmented.Root']}
                aria-label="Show"
                defaultValue="all"
              >
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="all"
                >
                  All
                </Segmented.Item>
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="favorites"
                >
                  Favorites
                </Segmented.Item>
                <Segmented.Highlight {...partProps['Segmented.Highlight']} />
              </Segmented.Root>
            </Header.Accessory>
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
      </Viewport.Content>
    </Component>
  );
};

/** `/header/parts`: its root, large title and accessory. */
export const HeaderParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root without a box of its own, around the app’s bar (a top{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a>, anchored) and its{' '}
        <a href={publicUrl('page')}>Page</a>. The page can have a large title,
        and an accessory that stays below the bar.
      </li>
      <li>
        The views’ pages scroll under the bar: scroll them to see the titles
        change.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <span>The app’s root, for example </span>
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        <ul>
          <li>
            <PartLink part="Header.Root" />
            <ul>
              <li className="demo-tree-context">
                <PartLink
                  component="viewport"
                  part="Viewport.BlockStart"
                />
                <span> (its child: the bar, staying where it is)</span>
                <ul>
                  <li className="demo-tree-context">
                    <PartLink
                      component="toolbar"
                      part="Toolbar.Root"
                    />
                    <span> (</span>
                    <code>placement=&quot;block-start&quot;</code>
                    <span>: back, the title, the actions)</span>
                  </li>
                </ul>
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="page"
                  part="Page.Root"
                />
                <span> (its content below the bar)</span>
                <ul>
                  <li>
                    <PartLink part="Header.LargeTitle" /> (optional; with a{' '}
                    <PartLink
                      component="toolbar"
                      part="Toolbar.Subtitle"
                    />
                    )
                  </li>
                  <li>
                    <PartLink part="Header.Accessory" /> (optional)
                  </li>
                  <li className="demo-tree-context">
                    <span>the page’s content (for example lists)</span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="header-root"
      level={2}
    >
      <code>Header.Root</code>
    </Heading>
    <ul>
      <li>
        Ties its bar (a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />{' '}
        in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        , its child) to its page. The page’s content starts below the bar (with
        a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at its start, as tall as the bar). The bar’s title fades in as the large
        title scrolls away. What scrolls under the bar blurs beneath it (the
        bar’s anchor’s edge effect, see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ).
      </li>
      <li>
        It can go around the page, or inside it (for example when a tab’s panel
        renders as the page). The bar stays put either way.
      </li>
      <li>
        Renders an element with <code>display: contents</code>, without a box of
        its own.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={headerRootRows} />

    <Heading
      id="header-largetitle"
      level={2}
    >
      <code>Header.LargeTitle</code>
    </Heading>
    <ul>
      <li>
        The page’s large title (Large Title Emphasized), below the bar. It
        scrolls with the page, and fades out as it goes under the bar.
      </li>
      <li>
        A subtitle (
        <PartLink
          component="toolbar"
          part="Toolbar.Subtitle"
        />
        ) can go below it, in 15px.
      </li>
      <li>
        Renders a <code>div</code> as a <code>heading</code> (level 1), or
        another element through <code>render</code>, for example an{' '}
        <code>h1</code>.
      </li>
    </ul>
    <LargeTitlePart />
    <h3>Props</h3>
    <PropsTable rows={headerLargeTitleRows} />

    <Heading
      id="header-accessory"
      level={2}
    >
      <code>Header.Accessory</code>
    </Heading>
    <ul>
      <li>
        What stays with the bar, such as a search field or a segmented control.
        It comes after the large title and scrolls with it, then sticks below
        the bar.
      </li>
      <li>
        It sits 16px from the sides and 8px above the content. While stuck, the
        bar’s edge effect reaches under it too (
        <PartLink
          component="viewport"
          part="useViewportEdgeElement"
        />
        ), so what scrolls under it blurs, as under the bar.
      </li>
      <li>
        It sticks below the bar at the bar’s measured height, which also works
        for a taller bar with a two-line title.
      </li>
      <li>
        Renders a <code>div</code>, or another element through{' '}
        <code>render</code>.
      </li>
    </ul>
    <AccessoryPart />
    <h3>Props</h3>
    <PropsTable rows={headerAccessoryRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const headerPartsDemos = [RootPart, LargeTitlePart, AccessoryPart];
