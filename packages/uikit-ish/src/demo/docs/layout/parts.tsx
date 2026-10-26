import { FunctionComponent } from 'react';

import {
  Header,
  Layout,
  List,
  Page,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { names } from '../viewport/content.js';
import {
  layoutBackgroundRows,
  layoutColumnRows,
  layoutRootRows,
} from './docs.js';
import { LayoutColumn, useLayoutControls } from './props.js';

// Each part's view: a tablet, its columns' pages, every part's props, the
// part's own open and outlined.

/** The views' columns: a list (resizable), its detail (flexible). */
const columns: readonly [LayoutColumn, LayoutColumn] = [
  ['contacts', 320, true],
  ['contact', undefined, false],
];

/** `Layout.Root`, outlined: two columns. */
const RootPart: FunctionComponent = () => {
  const id = 'layout-parts-root';
  const [log, addLog] = useLog();
  const {
    controls,
    keyFirst,
    keySecond,
    propsFirst,
    propsRoot,
    propsSecond,
    state,
  } = useLayoutControls(id, addLog, { columns, featured: 'Root' });

  return (
    <Component
      isExpanded
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="tablet"
      state={state}
      title="Layout.Root"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
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
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Page.Root background="plain" />
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Layout.Background`, outlined: a picture behind a floating column. */
const BackgroundPart: FunctionComponent = () => {
  const id = 'layout-parts-background';
  const [log, addLog] = useLog();
  const {
    controls,
    keyFirst,
    keySecond,
    propsBackground,
    propsFirst,
    propsRoot,
    propsSecond,
    state,
  } = useLayoutControls(id, addLog, {
    columns,
    featured: 'Background',
    hasBackground: true,
  });

  return (
    <Component
      isExpanded
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="tablet"
      state={state}
      title="Layout.Background"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Layout.Background {...propsBackground}>
            <div
              aria-hidden="true"
              className="layout-demo-picture"
            />
          </Layout.Background>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Page.Root className="layout-demo-transparent">
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 8).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding edge="block-end" />
            </Page.Root>
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          />
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Layout.Column`, outlined: the first of two (resizable). */
const ColumnPart: FunctionComponent = () => {
  const id = 'layout-parts-column';
  const [log, addLog] = useLog();
  const {
    controls,
    keyFirst,
    keySecond,
    propsFirst,
    propsRoot,
    propsSecond,
    state,
  } = useLayoutControls(id, addLog, { columns, featured: 'Column' });

  return (
    <Component
      isExpanded
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="tablet"
      state={state}
      title="Layout.Column"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Viewport.Padding edge="block-start" />
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
                <Viewport.Padding edge="block-end" />
              </Page.Root>
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Page.Root background="plain" />
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/layout/parts`: its root, background and columns. */
export const LayoutParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root of columns side by side, and optionally a background behind them.
      </li>
      <li>
        Each column filled by its content: a <a href="page">Page</a>, a{' '}
        <a href="navigation">Navigation</a>, a <a href="sidebar">Sidebar</a>.
      </li>
      <li>
        In a resizable column’s view, drag its divider (or focus it, the arrow
        keys). On a phone, a column can be a <a href="drawer">Drawer</a>{' '}
        instead.
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
            <PartLink part="Layout.Root" />
            <ul>
              <li>
                <PartLink part="Layout.Background" /> (optional)
              </li>
              <li>
                <PartLink part="Layout.Column" /> (several; a divider at a
                resizable one’s end)
                <ul>
                  <li className="demo-tree-context">
                    <span>Its content, e.g. </span>
                    <PartLink
                      component="header"
                      part="Header.Root"
                    />
                    <span>, a </span>
                    <PartLink
                      component="page"
                      part="Page.Root"
                    />
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="layout-root"
      level={2}
    >
      <code>Layout.Root</code>
    </Heading>
    <ul>
      <li>
        Its columns in a row, filling its container (<code>height: 100%</code>
        ); clipping them (a floating column).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={layoutRootRows} />

    <Heading
      id="layout-background"
      level={2}
    >
      <code>Layout.Background</code>
    </Heading>
    <ul>
      <li>
        Behind the columns, filling the layout: its children layered (images and
        videos covering it), showing where columns have no background.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <BackgroundPart />
    <h3>Props</h3>
    <PropsTable rows={layoutBackgroundRows} />

    <Heading
      id="layout-column"
      level={2}
    >
      <code>Layout.Column</code>
    </Heading>
    <ul>
      <li>
        Sized (<code>defaultSize</code>, <code>size</code>), or flexible;
        resizable by a divider at its end.
      </li>
      <li>
        Floating over the others (<code>floating</code>), or clear of one (
        <code>clearFloating</code>).
      </li>
      <li>
        The containing block of its fixed layers: a header’s bar (in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ) spans it, not the screen.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ColumnPart />
    <h3>Props</h3>
    <PropsTable rows={layoutColumnRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const layoutPartsDemos = [RootPart, BackgroundPart, ColumnPart];
