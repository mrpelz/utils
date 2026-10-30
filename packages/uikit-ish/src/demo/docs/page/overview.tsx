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
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { names } from '../viewport/content.js';
import { pageRootRows } from './docs.js';
import { propOptionsGuideRoot, propOptionsOverviewContent } from './props.js';

/** A page on a phone: its header, a list (of a style), its background. */
const LiveView: FunctionComponent = () => {
  const id = 'page-overview';
  const [externalContent, externalRoot] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, props, stateRoot] = usePropControl(propOptionsGuideRoot, {
    external: externalRoot,
    title: 'Page.Root',
  });

  return (
    <Component
      isInline
      controls={[controlContent, controlRoot]}
      id={id}
      stage="phone"
      state={[stateContent, stateRoot]}
      title="Page"
    >
      <Viewport.Content safeArea="none">
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
            <Header.LargeTitle>
              <span>Contacts</span>
            </Header.LargeTitle>

            <List.Root listStyle={content.listStyle}>
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/page`: what a page is for, and its props. */
export const PageOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        What a screen shows: its content’s scroll container, filling its place,
        on the page background.
      </li>
      <li>
        Under a <a href="header">Header</a>’s bar (its large title at its
        start), then lists or other content; <code>grouped</code> (the grouped
        background) for grouped lists, <code>plain</code> for plain ones.
      </li>
      <li>After Framework7’s pages; no Base UI component.</li>
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
        Every screen’s content: in a <a href="navigation">Navigation</a> (one
        per pushed page), a <a href="layout">Layout</a> column, a tab bar’s
        panel, a <a href="viewport">Viewport</a>’s content layer.
      </li>
      <li>
        Under a <a href="header">Header</a>’s bar: the page’s content starts
        below it (a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at its start; one at its end, above a bottom bar or the screen’s edge),
        its scroll followed by the bar’s edge effect (a scroller, see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ).
      </li>
      <li>
        Its content’s ends spaced by those paddings (the library’s content
        margin, 16px), not by the page: it keeps only the safe area clear.
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
        Content over a page, for a moment: a <a href="sheet">Sheet</a>, a{' '}
        <a href="popover">Popover</a>.
      </li>
      <li>
        Columns side by side, each a page: a <a href="layout">Layout</a> around
        them.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>
        Its one part’s props (all of them: <a href="page/parts">Parts</a>).
      </li>
    </ul>
    <KeyPropsTable
      parts={[['Page.Root', pickRows(pageRootRows, 'background', 'children')]]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        A <code>div</code> without a role: its header’s large title is the
        page’s heading; a landmark, if wanted, by its attributes (e.g.{' '}
        <code>role=&quot;main&quot;</code> and a name).
      </li>
      <li>
        A scroll container: in Chrome, keyboard focusable while nothing in it is
        (the arrow keys, Page Up and Down scroll it).
      </li>
      <li>It has no animations of its own.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        As high as its container (<code>height: 100%</code>), scrolling its
        content; its overscroll contained (not scrolling what’s around it), a
        thin scrollbar.
      </li>
      <li>
        In a column clear of a floating one (<code>clearFloating</code>, see{' '}
        <a href="layout">Layout</a>): its content inset by that column’s size,
        its background running beneath it.
      </li>
      <li>
        Its scrolling, tracked: a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        ’s <code>scroller</code> (its ref; see <a href="viewport">Viewport</a>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pageOverviewDemos = [LiveView];
