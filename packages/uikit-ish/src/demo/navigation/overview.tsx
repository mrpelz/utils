import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';

import {
  Button,
  Header,
  List,
  Navigation,
  Page,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import { Contents, Heading, type Section } from '../guide/sections.js';
import { pages } from './content.js';
import { navigationRootRows } from './docs.js';
import { getPropOptionsGuideRoot } from './props.js';

/**
 * Settings, drilling in: rows push pages, the back button (or a swipe from
 * the leading edge) pops them; the stack below the screen.
 */
const LiveView: FunctionComponent = () => {
  const id = 'navigation-overview';
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(['settings']);
  const push = (key: string) => {
    addLog(`push: ${key}`);
    setKeys((current) => [...current, key]);
  };
  const pop = useCallback(() => {
    addLog('pop');
    setKeys((current) => current.slice(0, -1));
  }, [addLog]);

  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(pop), [pop]),
    'Navigation.Root',
    external,
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
      title="Navigation"
    >
      <div className="navigation-demo-phone">
        <Navigation.Root {...props}>
          {keys.map((key, depth) => (
            <Page.Root key={key}>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Toolbar.Button
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        shape="circle"
                        onClick={pop}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Toolbar.Button>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{pages[key]?.title}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
                <Header.LargeTitle>
                  <span>{pages[key]?.title}</span>
                </Header.LargeTitle>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {pages[key]?.children.map((child) => (
                      <List.Item key={child}>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => push(child)}
                        >
                          {pages[child]?.title}
                        </List.Title>
                        <List.DrillIn />
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Page.Root>
          ))}
        </Navigation.Root>
      </div>
      <p className="navigation-demo-stack">
        Stack: {keys.map((key) => pages[key]?.title).join(' › ')}
      </p>
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

/** `/navigation`: what a navigation is for, and its props. */
export const NavigationOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A stack of pages (UIKit <code>UINavigationController</code>): drilling
        in pushes a page over the one before, going back pops it.
      </li>
      <li>
        The app’s stack, rendered as keyed children: the navigation transitions
        between them (no router of its own).
      </li>
      <li>
        Swiping from the leading edge goes back, as on iOS; pages under the top
        one stay mounted, their state and scroll positions kept.
      </li>
      <li>
        This library’s own, after Framework7’s views; no Base UI component.
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
        Hierarchical content, one level after another (Settings, Mail’s
        mailboxes): rows drill in (<code>List.DrillIn</code>), a back button
        returns.
      </li>
      <li>
        One stack per section of an app: per tab (a{' '}
        <a href="tab-bar">Tab bar</a>
        ), or per sidebar row in a <a href="layout">Layout</a>’s content column
        (see <a href="navigation/composition">Composition</a>).
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
        Switching between an app’s sections (flat, not deeper): a{' '}
        <a href="tab-bar">Tab bar</a>, or a <a href="sidebar">Sidebar</a>.
      </li>
      <li>
        A self-contained task (compose, edit, add): a modal{' '}
        <a href="sheet">Sheet</a>, not a pushed page.
      </li>
      <li>
        Switching a view’s content in place (Day, Week, Month): a{' '}
        <a href="segmented">Segmented</a> control.
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
        Its one part’s props (all of them: <a href="navigation/parts">Parts</a>
        ).
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Navigation.Root', pickRows(navigationRootRows, 'children', 'onBack')],
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
        Only the top page is exposed: the pages under it (and, while moving,
        both) are <code>inert</code> and <code>aria-hidden</code>.
      </li>
      <li>
        Swiping back is a pointer gesture only: a page that can be popped needs
        a back button (named for the page it returns to, as here).
      </li>
      <li>
        Focus isn’t moved: after a push, the page it was on turns inert and it
        falls back to the document; the app moves it (e.g. to the new page’s
        first control, or its heading).
      </li>
      <li>
        Its transitions (350ms) don’t follow <code>prefers-reduced-motion</code>
        .
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
        By the children’s keys: extended, the new page slides in from the
        trailing edge over the one under it, which moves back 30% of its width
        and dims; cut back (by one or more pages), the reverse; anything else
        (another stack), shown at once.
      </li>
      <li>
        A page’s <a href="header">Header</a> blends over: its bar stays in place
        while its content fades; the large title moves with its page.
      </li>
      <li>
        Swiping back starts within 20px of the leading edge (touch or mouse):
        released past half the width, or flung (0.3px/ms), it pops (calling{' '}
        <code>onBack</code>, the transition done by then); otherwise it settles
        back.
      </li>
      <li>
        The leading edge mirrors right to left (pushed pages from the left).
      </li>
      <li>
        It fills its container (its pages each as high as it): put it in a
        screen, a <a href="viewport">Viewport</a>’s content layer, or a{' '}
        <a href="layout">Layout</a> column.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const navigationOverviewDemos = [LiveView];
