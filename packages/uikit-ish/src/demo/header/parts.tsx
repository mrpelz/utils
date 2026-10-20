import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent } from 'react';

import {
  Button,
  Header,
  List,
  Page,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from '../viewport/content.js';
import { headerBarRows, headerLargeTitleRows, headerRootRows } from './docs.js';
import { propOptionsBar, propOptionsLargeTitle } from './props.js';

/** `Header.Root`: a bar and a large title (it has no element to outline). */
const RootPart: FunctionComponent = () => (
  <Component
    center
    inline
    id="header-parts-root"
    title="Header.Root"
  >
    <div className="header-demo-phone">
      <Page.Root>
        <Header.Root>
          <Header.Bar>
            <Toolbar.Leading />
            <Toolbar.Title>
              <span>Contacts</span>
            </Toolbar.Title>
            <Toolbar.Trailing />
          </Header.Bar>
          <Header.LargeTitle>
            <span>Contacts</span>
          </Header.LargeTitle>
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

/** `Header.Bar`, outlined: back, the title. */
const BarPart: FunctionComponent = () => {
  const id = 'header-parts-bar';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsBar,
    'Header.Bar',
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
      title="Header.Bar"
    >
      <div className="header-demo-phone">
        <Page.Root>
          <Header.Root>
            <Header.Bar {...props}>
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Lists"
                  shape="circle"
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

/** `Header.LargeTitle`, outlined, with a subtitle. */
const LargeTitlePart: FunctionComponent = () => {
  const id = 'header-parts-large-title';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsLargeTitle,
    'Header.LargeTitle',
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
      title="Header.LargeTitle"
    >
      <div className="header-demo-phone">
        <Page.Root>
          <Header.Root>
            <Header.Bar>
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Header.Bar>
            <Header.LargeTitle {...props}>
              <span>Contacts</span>
              <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
            </Header.LargeTitle>
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

/** `/header/parts`: its root, bar and large title. */
export const HeaderParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root (no box of its own), a bar (a top toolbar), and an optional large
        title.
      </li>
      <li>
        At the start of a scroll container: a <a href="page">Page</a>. The
        views’ pages scroll: scroll them to see the titles change.
      </li>
    </ul>
    <ul>
      <li>
        <code>Page.Root</code>
        <ul>
          <li>
            <PartLink part="Header.Root" />
            <ul>
              <li>
                <PartLink part="Header.Bar" /> (<code>Toolbar.Leading</code>,{' '}
                <code>Toolbar.Title</code>, <code>Toolbar.Trailing</code>)
              </li>
              <li>
                <PartLink part="Header.LargeTitle" /> (optional; with a{' '}
                <code>Toolbar.Subtitle</code>)
              </li>
            </ul>
          </li>
          <li>the page’s content (e.g. lists)</li>
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
        Ties its bar to its large title (the bar’s title fading in as the large
        title scrolls away: a scroll timeline, unique per header).
      </li>
      <li>
        Renders a <code>display: contents</code> element: no box, so the bar
        sticks across the whole scroll container.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={headerRootRows} />

    <Heading
      id="header-bar"
      level={2}
    >
      <code>Header.Bar</code>
    </Heading>
    <ul>
      <li>
        A <a href="toolbar">Toolbar</a> at the top (
        <code>placement=&quot;block-start&quot;</code>, fixed): its props but
        the placement.
      </li>
      <li>
        Sticking to the top of the scroll container, the content beneath it
        blurred once scrolled under it.
      </li>
      <li>
        With a large title in its header, its title hidden until the large title
        scrolls under it.
      </li>
    </ul>
    <BarPart />
    <h3>Props</h3>
    <PropsTable rows={headerBarRows} />

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
        A subtitle (<code>Toolbar.Subtitle</code>) below it in 15px.
      </li>
      <li>
        Renders a <code>div</code> as a <code>heading</code> (level 1;{' '}
        <code>render</code>, e.g. an <code>h1</code>).
      </li>
    </ul>
    <LargeTitlePart />
    <h3>Props</h3>
    <PropsTable rows={headerLargeTitleRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const headerPartsDemos = [RootPart, BarPart, LargeTitlePart];
