import { FunctionComponent, useMemo } from 'react';

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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import { layoutColumnRows, layoutRootRows } from './docs.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
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
      isExpanded
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[...state, partState]}
      title="Layout.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Contacts</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
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
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Page.Root
              {...partProps['Page.Root']}
              background="plain"
            />
          </Layout.Column>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': ['background'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
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
      isExpanded
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[...state, partState]}
      title="Layout.Column"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Contacts</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
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
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Page.Root
              {...partProps['Page.Root']}
              background="plain"
            />
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
        A root holding columns side by side, optionally with a background behind
        them.
      </li>
      <li>
        Each column is filled by its content: a{' '}
        <a href={publicUrl('page')}>Page</a>, a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>, or a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>.
      </li>
      <li>
        In the resizable column’s view, drag its divider, or focus it and use
        the arrow keys. On a phone, a column can be a{' '}
        <a href={publicUrl('drawer')}>Drawer</a> instead.
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
            <PartLink part="Layout.Root" />
            <ul>
              <li>
                <PartLink part="Layout.Column" /> (several; a divider at a
                resizable one’s end)
                <ul>
                  <li className="demo-tree-context">
                    <span>Its content, for example </span>
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
        Lays its columns out in a row that fills its container (
        <code>height: 100%</code>). It clips them, which matters for a floating
        column.
      </li>
      <li>
        Draws a hairline between columns, except after a floating one.{' '}
        <code>hideSeparators</code> removes it, for example over a picture
        behind them (a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Background"
        />
        ).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={layoutRootRows} />

    <Heading
      id="layout-column"
      level={2}
    >
      <code>Layout.Column</code>
    </Heading>
    <ul>
      <li>
        Has a size (<code>defaultSize</code>, <code>size</code>), or is
        flexible. A divider at its end can make it resizable.
      </li>
      <li>
        Can float above the others (<code>floating</code>), or stay clear of a
        floating one (<code>clearFloating</code>).
      </li>
      <li>
        It’s the containing block for its fixed layers, so a header’s bar (in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ) spans the column, not the screen.
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
export const layoutPartsDemos = [RootPart, ColumnPart];
