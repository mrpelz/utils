import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Header,
  List,
  Page,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
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
import { sfChevronBackward, sfSquareAndPencil } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import {
  headerAccessoryRows,
  headerLargeTitleRows,
  headerRootRows,
} from './docs.js';
import { propOptionsOverviewContent, useHeaderControls } from './props.js';

/**
 * A page on a phone: its header's bar, its large title scrolling away
 * (the bar's title fading in), rows below.
 */
const LiveView: FunctionComponent = () => {
  const id = 'header-overview';
  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const { controls, propsBar, propsLargeTitle, state } = useHeaderControls(id, {
    offset: 1,
  });

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
      controls={[controlContent, ...controls, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[stateContent, ...state, partState]}
      title="Header"
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
                  onClick={() => addLog('Back clicked')}
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
                {content.subtitle ? (
                  <Toolbar.Subtitle {...partProps['Toolbar.Subtitle']}>
                    {names.length} people
                  </Toolbar.Subtitle>
                ) : null}
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="New contact"
                  shape="circle"
                  onClick={() => addLog('New contact clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndPencil}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            {content.largeTitle ? (
              <Header.LargeTitle {...propsLargeTitle}>
                <span>Contacts</span>
                {content.subtitle ? (
                  <Toolbar.Subtitle {...partProps['Toolbar.Subtitle']}>
                    {names.length} people
                  </Toolbar.Subtitle>
                ) : null}
              </Header.LargeTitle>
            ) : null}

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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/header`: what a page's header is for, and its props. */
export const HeaderOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A page’s header, the navigation bar with large titles: a bar at the top
        that stays put as the page scrolls under it, and a large title below it
        that scrolls with the page.
      </li>
      <li>
        As the large title scrolls under the bar, it fades out and the bar’s own
        title fades in. Content scrolled under the bar blurs beneath it.
      </li>
      <li>
        Its bar is the app’s <a href={publicUrl('toolbar')}>Toolbar</a>,
        anchored at the top (in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ), with back, the title and the page’s actions. The header ties that bar
        to the page.
      </li>
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
        For every <a href={publicUrl('page')}>Page</a> in an app’s navigation:
        its title, its way back and its actions. In a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>, each page has its own
        header, which moves with it during transitions.
      </li>
      <li>
        With a large title on a stack’s root page and on top-level pages, and
        with only the bar’s title on pages pushed on top.
      </li>
      <li>
        For what should scroll with the title, such as a search field or a
        control (see <a href={publicUrl('header/composition')}>Composition</a>).
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
        A bar that doesn’t belong to one page (it spans several, without a large
        title): use a <a href={publicUrl('toolbar')}>Toolbar</a> in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        on its own, outside a header.
      </li>
      <li>
        Commands at the bottom: use a bottom{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most headers set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('header/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Header.Root', pickRows(headerRootRows, 'children')],
        ['Header.LargeTitle', pickRows(headerLargeTitleRows, 'children')],
        ['Header.Accessory', pickRows(headerAccessoryRows, 'children')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        The large title is the page’s heading (<code>heading</code>, level 1;
        change it with <code>aria-level</code>).
      </li>
      <li>
        The bar is a <code>toolbar</code> (see{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a>): one tab stop, with the
        arrow keys moving between its buttons.
      </li>
      <li>
        With a large title, the bar’s title is only faded out (by its opacity),
        so the title is read twice: once in the bar, and once as the heading.
      </li>
      <li>
        Its fades follow the scroll position, not time, so{' '}
        <code>prefers-reduced-motion</code> doesn’t change them.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        The bar stays put (fixed, in its anchor, 54px tall below the top safe
        area inset) as the page scrolls under it or bounces. The page’s content
        starts below it thanks to a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at its start, which the app adds (and leaves out where the bar is empty,
        or a picture goes under it). The header itself has no box.
      </li>
      <li>
        The large title (Large Title Emphasized, 16px from the sides, 10px above
        what follows) fades out over the first half of its way under the bar,
        while the bar’s title fades in over the second half. It uses
        scroll-driven animations, without scroll listeners.
      </li>
      <li>Without a large title, the bar’s title shows at once.</li>
      <li>
        Content scrolled under the bar blurs beneath it, once scrolled 16px: the
        bar’s anchor draws an edge effect (see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ). That also covers the accessory while it’s stuck.
      </li>
      <li>Pulled down, the large title doesn’t grow.</li>
      <li>
        During a <a href={publicUrl('navigation')}>Navigation</a>’s transition,
        it moves with its page, bar included (its anchor sits in the page’s
        frame). In a <a href={publicUrl('layout')}>Layout</a> column, its bar
        spans the column.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const headerOverviewDemos = [LiveView];
