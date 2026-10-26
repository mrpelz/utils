import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent, useCallback, useState } from 'react';

import {
  Button,
  Header,
  List,
  Navigation,
  type NavigationBackEventDetails,
  Page,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { pages } from './content.js';
import { navigationRootRows, navigationStackRows } from './docs.js';
import { useNavigationControls } from './props.js';

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
  const pop = useCallback(
    ({ reason }: NavigationBackEventDetails) => {
      addLog(`pop (${reason})`);
      setKeys((current) => current.slice(0, -1));
    },
    [addLog],
  );

  const { controls, propsBack, propsRoot, propsStack, propsSwipeArea, state } =
    useNavigationControls(id, addLog, pop);

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="phone"
      state={state}
      title="Navigation"
    >
      <Viewport.Content safeArea="none">
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                {keys.length > 1 ? (
                  <Navigation.Back
                    aria-label={pages[keys.at(-2) ?? '']?.title}
                    {...propsBack}
                  >
                    <Button.Icon>
                      <Symbol icon={sfChevronBackward} />
                    </Button.Icon>
                  </Navigation.Back>
                ) : null}
              </Toolbar.Leading>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Navigation.Stack {...propsStack}>
            {keys.map((key) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <Header.LargeTitle>
                    <span>{pages[key]?.title}</span>
                  </Header.LargeTitle>

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
                  <Viewport.Padding edge="block-end" />
                </Page.Root>
              </Header.Root>
            ))}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
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
        The app’s stack, rendered as its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ’s keyed children: the navigation transitions between them (no router of
        its own).
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
        mailboxes): rows drill in (
        <PartLink
          component="list"
          part="List.DrillIn"
        />
        ), a back button returns.
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
        Its root’s and its stack’s props (all of them, every part’s:{' '}
        <a href="navigation/parts">Parts</a>).
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Navigation.Root', pickRows(navigationRootRows, 'onBack')],
        ['Navigation.Stack', pickRows(navigationStackRows, 'children')],
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
        A page’s <a href="header">Header</a> moves with its page, its bar and
        title too; the back button stays (a <a href="toolbar">Toolbar</a> in a{' '}
        <a href="viewport">Viewport</a>’s{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        >
          BlockStart
        </PartLink>{' '}
        in the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        , outside its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ), over the pages’ bars.
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
