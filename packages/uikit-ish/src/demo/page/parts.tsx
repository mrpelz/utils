import { FunctionComponent } from 'react';

import { Header, List, Page, Toolbar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from '../viewport/content.js';
import { pageRootRows } from './docs.js';
import { propOptionsGuideRoot } from './props.js';

/** `Page.Root`, outlined: a header, a list. */
const RootPart: FunctionComponent = () => {
  const id = 'page-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideRoot, {
    external,
    open: true,
    outlined: true,
    title: 'Page.Root',
  });

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Page.Root"
    >
      <div className="demo-phone">
        <Page.Root {...props}>
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
      </div>
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
      <li>
        <PartLink
          component="page"
          part="Page.Root"
        />
        <ul>
          <li>
            a <a href="header">Header</a> (optional)
          </li>
          <li>its content (e.g. lists)</li>
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
