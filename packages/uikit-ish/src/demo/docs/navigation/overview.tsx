import { FunctionComponent, useCallback, useMemo, useState } from 'react';

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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfChevronBackward } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Header.LargeTitle': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': [],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
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
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[...state, partState]}
      title="Navigation"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Navigation.Stack {...propsStack}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    {index > 0 ? (
                      <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                        <Navigation.Back
                          aria-label={pages[keys[index - 1] ?? '']?.title}
                          {...propsBack}
                        >
                          <Button.Icon {...partProps['Button.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfChevronBackward}
                            />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                    <span>{pages[key]?.title}</span>
                  </Header.LargeTitle>

                  <List.Root {...partProps['List.Root']}>
                    <List.Section {...partProps['List.Section']}>
                      <List.Group {...partProps['List.Group']}>
                        {pages[key]?.children.map((child) => (
                          <List.Item
                            key={child}
                            {...partProps['List.Item']}
                          >
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.DrillIn {...partProps['List.DrillIn']} />
                            </List.Trailing>
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
        A stack of pages. Drilling in pushes a page on top of the one before,
        and going back pops it.
      </li>
      <li>
        The app owns the stack and renders it as the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ’s keyed children. The navigation animates between them; it has no
        router of its own.
      </li>
      <li>
        Swiping from the leading edge goes back. Pages under the top one stay
        mounted, keeping their state and scroll positions.
      </li>
      <li>
        It’s the library’s own component, modeled on Framework7’s views, and not
        built on Base UI.
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
        For hierarchical content, one level after another, as in a settings app
        or a mail app’s mailboxes. Rows drill in (
        <PartLink
          component="list"
          part="List.DrillIn"
        />
        ), and a back button returns.
      </li>
      <li>
        For one stack per section of an app: per tab (a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a>), or per sidebar row in a{' '}
        <a href={publicUrl('layout')}>Layout</a>’s content column (see{' '}
        <a href={publicUrl('navigation/composition')}>Composition</a>).
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
        Switching between an app’s sections, flat rather than deeper: use a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a> or a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>.
      </li>
      <li>
        A self-contained task (compose, edit, add): use a modal{' '}
        <a href={publicUrl('sheet')}>Sheet</a>, not a pushed page.
      </li>
      <li>
        Switching a view’s content in place (Day, Week, Month): use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
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
        The root’s and the stack’s props. All props of all parts are on the{' '}
        <a href={publicUrl('navigation/parts')}>Parts</a> page.
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
        Only the top page is exposed. The pages under it (and both pages while
        one moves) are <code>inert</code>, which also hides them from assistive
        technology. They aren’t <code>aria-hidden</code> as well, because
        browsers refuse that while the pressed button still has focus.
      </li>
      <li>
        Swiping back is a pointer gesture only, so a page that can be popped
        needs a back button, named for the page it returns to, as here.
      </li>
      <li>
        Focus isn’t moved. After a push, the page that had focus turns inert,
        and focus falls back to the document. The app moves it, for example to
        the new page’s first control or its heading.
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
        It goes by the children’s keys. When the stack is extended, the new page
        slides in from the trailing edge, above the one under it, which moves
        back by 30% of its width and dims. When the stack is cut back, by one
        page or more, the reverse happens. Anything else (a different stack)
        shows at once.
      </li>
      <li>
        An instant page (in a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Page"
        />{' '}
        with <code>instant</code>) shows at once when pushed or popped, and
        can’t be swiped back while it’s on top.
      </li>
      <li>
        A page that’s gone (popped or replaced) stays mounted, unpainted and
        inert, until the browser is idle and the stack is at rest (in Safari,
        shortly after). That way, unmounting a large page doesn’t stall the
        stack as it comes to rest. If it’s pushed again meanwhile, it’s mounted
        afresh.
      </li>
      <li>
        A page’s <a href={publicUrl('header')}>Header</a> moves with its page,
        bar and title included. The back button sits in each pushed page’s bar,
        but stays put between pushed pages (it’s a persistent item, see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ). It slides in and out with the first pushed page.
      </li>
      <li>
        A swipe back starts within 20px of the leading edge, by touch or mouse.
        Released past half the width, or flung (0.3px/ms), it pops:{' '}
        <code>onBack</code> is called as it’s let go, and the pop continues from
        there. Otherwise, it settles back.
      </li>
      <li>
        When going back quickly, each pop runs its own transition. Pressed or
        swiped again while a page is still leaving, that page leaves on its own
        and the next one follows, as a cascade. It can’t be swiped while
        pushing.
      </li>
      <li>
        The leading edge mirrors in right-to-left languages, so pushed pages
        come from the left.
      </li>
      <li>
        It fills its container, and each page is as tall as it. Put it in a
        screen: a <a href={publicUrl('viewport')}>Viewport</a>’s content layer,
        or a <a href={publicUrl('layout')}>Layout</a> column.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const navigationOverviewDemos = [LiveView];
