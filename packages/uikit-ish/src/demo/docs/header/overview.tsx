import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { FunctionComponent } from 'react';

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

  return (
    <Component
      isInline
      controls={[controlContent, ...controls]}
      id={id}
      log={log}
      stage="phone"
      state={[stateContent, ...state]}
      title="Header"
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
                  onClick={() => addLog('Back clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Contacts</span>
                {content.subtitle ? (
                  <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
                ) : null}
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="New contact"
                  shape="circle"
                  onClick={() => addLog('New contact clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfSquareAndPencil} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            {content.largeTitle ? (
              <Header.LargeTitle {...propsLargeTitle}>
                <span>Contacts</span>
                {content.subtitle ? (
                  <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
                ) : null}
              </Header.LargeTitle>
            ) : null}

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
        A page’s header (UIKit’s navigation bar, with large titles): a bar at
        the top, staying where it is as the page scrolls under it, and a large
        title below it, scrolling with the page.
      </li>
      <li>
        As the large title scrolls under the bar, it fades out and the bar’s own
        title fades in; content scrolled under the bar blurs beneath it.
      </li>
      <li>
        Its bar is the app’s <a href="toolbar">Toolbar</a>, anchored at the top
        (a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ): back, the title, the page’s actions; the header ties it to the page.
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
        Every <a href="page">Page</a> of an app’s navigation: its title, its way
        back, its actions (in a <a href="navigation">Navigation</a>, each page
        its own header, moving with it in transitions).
      </li>
      <li>
        A large title on a stack’s root page (and top-level pages), the bar’s
        title alone on pages pushed on it.
      </li>
      <li>
        What scrolls with the title: a search field, a control (see{' '}
        <a href="header/composition">Composition</a>).
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
        A bar that doesn’t belong to a page (over several pages, no large
        title): a <a href="toolbar">Toolbar</a> in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        alone, outside a header.
      </li>
      <li>
        Commands at the bottom: a bottom <a href="toolbar">Toolbar</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most headers set, across their parts.</li>
      <li>
        All parts’ props: <a href="header/parts">Parts</a>.
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
        <code>aria-level</code> to change it).
      </li>
      <li>
        The bar is a <code>toolbar</code> (see <a href="toolbar">Toolbar</a>):
        one tab stop, the arrow keys between its buttons.
      </li>
      <li>
        With a large title, the bar’s title is only faded out (its opacity), so
        the title is read twice: once in the bar, once as the heading.
      </li>
      <li>
        Its fades follow the scroll position, not time;{' '}
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
        The bar stays where it is (fixed, in its anchor: 54px high below the
        safe area), as the page scrolls under it or bounces; the page’s content
        starts below it by a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at its start (the app’s: none where the bar is empty, or a picture goes
        under it). The header itself has no box.
      </li>
      <li>
        The large title (Large Title Emphasized, 16px from the sides, 10px above
        what follows): fading out over the first half of its way under the bar,
        the bar’s title fading in over the second (scroll-driven animations, no
        scroll listeners).
      </li>
      <li>Without a large title, the bar’s title shows at once.</li>
      <li>
        Content scrolled under the bar blurs beneath it (iOS 26’s scroll edge
        effect, approximated: the bar’s anchor’s, see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ), once scrolled 16px; under its accessory too, as it’s stuck.
      </li>
      <li>Pulled down, the large title doesn’t grow (iOS: it scales up).</li>
      <li>
        In a <a href="navigation">Navigation</a>’s transition: moving with its
        page, its bar too (its anchor within the page’s frame); in a{' '}
        <a href="layout">Layout</a>’s column, its bar spans the column.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const headerOverviewDemos = [LiveView];
