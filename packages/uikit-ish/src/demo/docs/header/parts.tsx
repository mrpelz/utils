import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent } from 'react';

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
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
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

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="phone"
      state={state}
      title="Header.Root"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Lists"
                  shape="circle"
                  onClick={() => addLog('Lists clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Contacts</span>
              <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
            </Header.LargeTitle>
            <Header.Accessory {...propsAccessory}>
              <Segmented.Root
                aria-label="Show"
                defaultValue="all"
              >
                <Segmented.Item value="all">All</Segmented.Item>
                <Segmented.Item value="favorites">Favorites</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </Header.Accessory>
            <List.Root>
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

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="phone"
      state={state}
      title="Header.LargeTitle"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Lists"
                  shape="circle"
                  onClick={() => addLog('Lists clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Contacts</span>
              <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
            </Header.LargeTitle>
            <Header.Accessory {...propsAccessory}>
              <Segmented.Root
                aria-label="Show"
                defaultValue="all"
              >
                <Segmented.Item value="all">All</Segmented.Item>
                <Segmented.Item value="favorites">Favorites</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </Header.Accessory>
            <List.Root>
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

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="phone"
      state={state}
      title="Header.Accessory"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Lists"
                  shape="circle"
                  onClick={() => addLog('Lists clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Contacts</span>
              <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
            </Header.LargeTitle>
            <Header.Accessory {...propsAccessory}>
              <Segmented.Root
                aria-label="Show"
                defaultValue="all"
              >
                <Segmented.Item value="all">All</Segmented.Item>
                <Segmented.Item value="favorites">Favorites</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </Header.Accessory>
            <List.Root>
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
        A root (no box of its own) around the app’s bar (a top{' '}
        <a href="toolbar">Toolbar</a>, anchored) and its <a href="page">Page</a>
        : an optional large title, and an optional accessory staying below the
        bar.
      </li>
      <li>
        The views’ pages scroll under the bar: scroll them to see the titles
        change.
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
                    <span>the page’s content (e.g. lists)</span>
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
        , its child) to its page: the page’s content starts below the bar
        (54px), the bar’s title fades in as the large title scrolls away, and
        what scrolls under the bar blurs beneath it (scroll-driven, unique per
        header).
      </li>
      <li>
        Around the page, or within it (e.g. a tab’s panel rendered as the page):
        the bar stays where it is either way.
      </li>
      <li>
        Renders a <code>display: contents</code> element: no box of its own.
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
        The page’s title, large (Large Title Emphasized), below the bar,
        scrolling with the page; fading out as it goes under the bar.
      </li>
      <li>
        A subtitle (
        <PartLink
          component="toolbar"
          part="Toolbar.Subtitle"
        />
        ) below it in 15px.
      </li>
      <li>
        Renders a <code>div</code> as a <code>heading</code> (level 1;{' '}
        <code>render</code>, e.g. an <code>h1</code>).
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
        What stays with the bar (a search field, a segmented control): after the
        large title, scrolling with it, then sticking below the bar (UIKit: a
        search bar with <code>hidesSearchBarWhenScrolling</code> false).
      </li>
      <li>
        16px from the sides, 8px above the content; what scrolls under it
        blurred, as under the bar.
      </li>
      <li>
        It sticks 54px below the safe area (the bar’s height in Figma): a taller
        bar (a two-line title) would overlap it.
      </li>
      <li>
        Renders a <code>div</code> (<code>render</code>).
      </li>
    </ul>
    <AccessoryPart />
    <h3>Props</h3>
    <PropsTable rows={headerAccessoryRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const headerPartsDemos = [RootPart, LargeTitlePart, AccessoryPart];
