import { FunctionComponent } from 'react';

import {
  Header,
  List,
  Page,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { names } from '../viewport/content.js';
import { pageRootRows } from './docs.js';
import { propOptionsGuideRoot } from './props.js';

/** `Page.Root`, outlined: a header, a list. */
const RootPart: FunctionComponent = () => {
  const id = 'page-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideRoot, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Page.Root',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      stage="phone"
      state={[state]}
      title="Page.Root"
    >
      <Viewport.Content>
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...props}>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  {names.map((name) => (
                    <List.Item key={name}>
                      <List.Content>
                        <List.Title>{name}</List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/page/parts`: its one part. */
export const PageParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>One part: the page, its content’s scroll container.</li>
    </ul>
    <ul>
      <li className="demo-tree-context">
        <PartLink
          component="header"
          part="Header.Root"
        />
        <span> (optional: around it, its bar anchored above it)</span>
        <ul>
          <li>
            <PartLink
              component="page"
              part="Page.Root"
            />
            <ul>
              <li className="demo-tree-context">
                <PartLink
                  component="viewport"
                  part="Viewport.Padding"
                />
                <span>
                  {' '}
                  (at its start and its end: room for the bars there, and the
                  content margin)
                </span>
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="header"
                  part="Header.LargeTitle"
                />
                <span> (optional)</span>
              </li>
              <li className="demo-tree-context">
                <span>its content (e.g. lists)</span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="page-root"
      level={2}
    >
      <code>Page.Root</code>
    </Heading>
    <ul>
      <li>
        Fills its container, scrolling its content, on the page background (
        <code>background</code>).
      </li>
      <li>
        Keeps the safe area insets clear (as padding); the gap to its content,
        and room for bars, are its{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        s’.
      </li>
      <li>
        Inset at its start beside a floating column (
        <code>--uikit-layout-inset-start</code>, see <a href="layout">Layout</a>
        ).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={pageRootRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pagePartsDemos = [RootPart];
