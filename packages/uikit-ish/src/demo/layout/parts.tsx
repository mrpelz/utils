import { FunctionComponent, useMemo } from 'react';

import { Header, Layout, List, Page, Toolbar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from '../viewport/content.js';
import {
  layoutBackgroundRows,
  layoutColumnRows,
  layoutRootRows,
} from './docs.js';
import {
  getPropOptionsGuideColumn,
  propOptionsGuideBackground,
  propOptionsGuideRoot,
} from './props.js';

/** `Layout.Root`, outlined: two columns. */
const RootPart: FunctionComponent = () => {
  const id = 'layout-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideRoot,
    'Layout.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Layout.Root"
    >
      <div className="layout-demo-tablet">
        <Layout.Root {...props}>
          <Layout.Column
            defaultSize={320}
            drawer="inline-start"
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
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
          </Layout.Column>
          <Layout.Column>
            <Page.Root background="plain" />
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.Background`, outlined: a picture behind a floating column. */
const BackgroundPart: FunctionComponent = () => {
  const id = 'layout-parts-background';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideBackground,
    'Layout.Background',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Layout.Background"
    >
      <div className="layout-demo-tablet">
        <Layout.Root>
          <Layout.Background {...props}>
            <div
              aria-hidden="true"
              className="layout-demo-picture"
            />
          </Layout.Background>
          <Layout.Column defaultSize={320}>
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
            </Page.Root>
          </Layout.Column>
          <Layout.Column />
        </Layout.Root>
      </div>
    </Component>
  );
};

/** `Layout.Column`, outlined: the first of two (resizable). */
const ColumnPart: FunctionComponent = () => {
  const id = 'layout-parts-column';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('column', 320, true, addLog),
      [addLog],
    ),
    'Layout.Column',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Layout.Column"
    >
      <div className="layout-demo-tablet">
        <Layout.Root>
          <Layout.Column
            key={key}
            {...props}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
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
          </Layout.Column>
          <Layout.Column>
            <Page.Root background="plain" />
          </Layout.Column>
        </Layout.Root>
      </div>
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
        keys); set the root <code>compact</code> for drawers.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="Layout.Root" />
        <ul>
          <li>
            <PartLink part="Layout.Background" /> (optional)
          </li>
          <li>
            <PartLink part="Layout.Column" /> (several; a divider at a resizable
            one’s end; compact, a drawer’s dimming and edge strip)
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
        ); clipping them (drawers, floating columns).
      </li>
      <li>
        <code>compact</code>: its <code>drawer</code> columns over the others,
        hidden until opened (here, the first: swipe it in from the left edge).
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
        <code>clearFloating</code>); compact, a drawer (<code>drawer</code>).
      </li>
      <li>
        Renders a <code>div</code> (and, compact, a drawer’s dimming and edge
        strip beside it).
      </li>
    </ul>
    <ColumnPart />
    <h3>Props</h3>
    <PropsTable rows={layoutColumnRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const layoutPartsDemos = [RootPart, BackgroundPart, ColumnPart];
