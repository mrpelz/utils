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
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { names } from '../viewport/content.js';
import { headerBarRows, headerLargeTitleRows } from './docs.js';
import {
  propOptionsBar,
  propOptionsLargeTitle,
  propOptionsOverviewContent,
} from './props.js';

/**
 * A page on a phone: its header's bar, its large title scrolling away
 * (the bar's title fading in), rows below.
 */
const LiveView: FunctionComponent = () => {
  const id = 'header-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalBar, externalLargeTitle] =
    useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, open: true, title: '[content]' },
  );
  const [controlBar, propsBar, stateBar] = usePropControl(propOptionsBar, {
    external: externalBar,
    title: 'Header.Bar',
  });
  const [controlLargeTitle, propsLargeTitle, stateLargeTitle] = usePropControl(
    propOptionsLargeTitle,
    { external: externalLargeTitle, title: 'Header.LargeTitle' },
  );

  return (
    <Component
      center
      inline
      controls={[controlContent, controlBar, controlLargeTitle]}
      id={id}
      log={log}
      state={[stateContent, stateBar, stateLargeTitle]}
      title="Header"
    >
      <div className="demo-phone">
        <Page.Root>
          <Header.Root>
            <Header.Bar {...propsBar}>
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
            </Header.Bar>
            {content.largeTitle ? (
              <Header.LargeTitle {...propsLargeTitle}>
                <span>Contacts</span>
                {content.subtitle ? (
                  <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
                ) : null}
              </Header.LargeTitle>
            ) : null}
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
        the top of the page, sticking as it scrolls, and a large title below it,
        scrolling with the page.
      </li>
      <li>
        As the large title scrolls under the bar, it fades out and the bar’s own
        title fades in; content scrolled under the bar blurs beneath it.
      </li>
      <li>
        Its bar is a <a href="toolbar">Toolbar</a> at the top: back, the title,
        the page’s actions.
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
        A bar that doesn’t belong to a page (fixed to the window, over several
        pages): a <a href="toolbar">Toolbar</a> in a{' '}
        <a href="viewport">Viewport</a>’s{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        >
          BlockStart
        </PartLink>
        .
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
        ['Header.Bar', pickRows(headerBarRows, 'children', 'context')],
        ['Header.LargeTitle', pickRows(headerLargeTitleRows, 'children')],
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
        The bar sticks to the top of the page’s scroll container (54px high);
        the header itself has no box, so it sticks across the whole page.
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
        effect, approximated: a backdrop blur fading out downwards), once
        scrolled 16px; under a floating column too.
      </li>
      <li>Pulled down, the large title doesn’t grow (iOS: it scales up).</li>
      <li>
        In a <a href="navigation">Navigation</a>’s transition: moving with its
        page, its bar too (a bar that stays: a <a href="toolbar">Toolbar</a> in
        a <a href="viewport">Viewport</a>’s{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        >
          BlockStart
        </PartLink>
        ).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const headerOverviewDemos = [LiveView];
