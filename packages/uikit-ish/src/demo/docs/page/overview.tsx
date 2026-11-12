import { FunctionComponent, useMemo } from 'react';

import {
  Header,
  List,
  Page,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
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
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Header.LargeTitle': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['listStyle'],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[controlContent, controlRoot, partControls]}
      id={id}
      stage="phone"
      state={[stateContent, stateRoot, partState]}
      title="Page"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']} />
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...props}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Header.LargeTitle {...partProps['Header.LargeTitle']}>
              <span>Contacts</span>
            </Header.LargeTitle>

            <List.Root
              {...partProps['List.Root']}
              listStyle={content.listStyle}
            >
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
        What a screen shows: the scroll container for its content. It fills its
        place, on the page background.
      </li>
      <li>
        It usually sits under a <a href={publicUrl('header')}>Header</a>’s bar,
        with the large title at its start, followed by lists or other content.
        Use <code>grouped</code> (the grouped background) for grouped lists, and{' '}
        <code>plain</code> for plain ones.
      </li>
      <li>It’s modeled on Framework7’s pages, and not built on Base UI.</li>
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
        For every screen’s content: in a{' '}
        <a href={publicUrl('navigation')}>Navigation</a> (one per pushed page),
        a <a href={publicUrl('layout')}>Layout</a> column, a tab bar’s panel, or
        a <a href={publicUrl('viewport')}>Viewport</a>’s content layer.
      </li>
      <li>
        Under a <a href={publicUrl('header')}>Header</a>’s bar, the page’s
        content starts below the bar. That takes a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at its start, and another at its end, above a bottom bar or the screen’s
        edge. The page is a scroller, so the bar’s edge effect follows its
        scrolling (see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ).
      </li>
      <li>
        Those paddings space its content’s ends (with the library’s content
        margin, 16px). The page itself only keeps the safe area insets clear.
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
        Content above a page for a moment: use a{' '}
        <a href={publicUrl('sheet')}>Sheet</a> or a{' '}
        <a href={publicUrl('popover')}>Popover</a>.
      </li>
      <li>
        Columns side by side, each a page: put a{' '}
        <a href={publicUrl('layout')}>Layout</a> around them.
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
        The props of its one part. All of them are on the{' '}
        <a href={publicUrl('page/parts')}>Parts</a> page.
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
        A <code>div</code> without a role. Its header’s large title is the
        page’s heading. For a landmark, add the attributes yourself (for example{' '}
        <code>role=&quot;main&quot;</code> and a name).
      </li>
      <li>
        It’s a scroll container. In Chrome, it can take keyboard focus while
        nothing inside it can, so the arrow keys and Page Up/Down scroll it.
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
        It’s as tall as its container (<code>height: 100%</code>) and scrolls
        its content. Its overscroll is contained, so it doesn’t scroll what’s
        around it. It has a thin scrollbar.
      </li>
      <li>
        In a column next to a floating one (<code>clearFloating</code>, see{' '}
        <a href={publicUrl('layout')}>Layout</a>), its content is inset by that
        column’s size, while its background runs beneath it.
      </li>
      <li>
        To track its scrolling, pass its ref as a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        ’s <code>scroller</code> (see{' '}
        <a href={publicUrl('viewport')}>Viewport</a>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pageOverviewDemos = [LiveView];
