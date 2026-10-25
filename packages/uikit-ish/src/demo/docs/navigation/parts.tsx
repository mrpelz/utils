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
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { pages } from './content.js';
import {
  navigationBackRows,
  navigationRootRows,
  navigationSwipeAreaRows,
} from './docs.js';
import { useNavigationControls } from './props.js';

// Each part's view: a phone's stack of Settings' pages (a pushed one, for
// the swipe area's and the back button's), every part's props, the part's
// own open and emphasized.

/** The views' code's start: the stack (the app's), pushed and popped. */
const setup = `const [keys, setKeys] = useState(['settings']);
const push = (key) => setKeys((current) => [...current, key]);
const pop = () => setKeys((current) => current.slice(0, -1));`;

/** The same, two pages deep. */
const setupPushed = `const [keys, setKeys] = useState(['settings', 'general']);
const push = (key) => setKeys((current) => [...current, key]);
const pop = () => setKeys((current) => current.slice(0, -1));`;

/** `Navigation.Root`, outlined: Settings' stack. */
const RootPart: FunctionComponent = () => {
  const id = 'navigation-parts-root';
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
  const { controls, propsBack, propsRoot, propsSwipeArea, state } =
    useNavigationControls(id, addLog, pop, { featured: 'Root' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Navigation.Root"
    >
      <Viewport.Content safeArea="none">
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          {keys.map((key, depth) => (
            <Header.Root key={key}>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Navigation.Back
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        {...propsBack}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Navigation.Back>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{pages[key]?.title}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
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
            </Header.Root>
          ))}
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};
/** `Navigation.SwipeArea`, overlaid: a pushed page, swiped back from its leading edge. */
const SwipeAreaPart: FunctionComponent = () => {
  const id = 'navigation-parts-swipe-area';
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(['settings', 'general']);
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
  const { controls, propsBack, propsRoot, propsSwipeArea, state } =
    useNavigationControls(id, addLog, pop, { featured: 'SwipeArea' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setupPushed}
      stage="phone"
      state={state}
      title="Navigation.SwipeArea"
    >
      <Viewport.Content safeArea="none">
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          {keys.map((key, depth) => (
            <Header.Root key={key}>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Navigation.Back
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        {...propsBack}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Navigation.Back>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{pages[key]?.title}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
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
            </Header.Root>
          ))}
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};
/** `Navigation.Back`, outlined: a pushed page's back button. */
const BackPart: FunctionComponent = () => {
  const id = 'navigation-parts-back';
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(['settings', 'general']);
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
  const { controls, propsBack, propsRoot, propsSwipeArea, state } =
    useNavigationControls(id, addLog, pop, { featured: 'Back' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setupPushed}
      stage="phone"
      state={state}
      title="Navigation.Back"
    >
      <Viewport.Content safeArea="none">
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          {keys.map((key, depth) => (
            <Header.Root key={key}>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Navigation.Back
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        {...propsBack}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Navigation.Back>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{pages[key]?.title}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
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
            </Header.Root>
          ))}
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/navigation/parts`: its root, swipe area and back button. */
export const NavigationParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        The root, its children the stack’s pages (the app’s, keyed); a back
        button in them.
      </li>
      <li>
        Around each page, a frame of its own (moved in transitions); at the
        leading edge, its swipe area, where a swipe back starts.
      </li>
    </ul>
    <ul>
      <li className="demo-tree-context">
        <span>The app’s root, e.g. </span>
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        <ul>
          <li>
            <PartLink part="Navigation.Root" />
            <ul>
              <li>
                <PartLink part="Navigation.SwipeArea" /> (optional; while a page
                can be popped)
              </li>
              <li className="demo-tree-context">
                <span>the pages (keyed children, each in a frame: </span>
                <code>data-navigation-part=&quot;page&quot;</code>
                <span>), e.g. </span>
                <PartLink
                  component="header"
                  part="Header.Root"
                />
                <span>s around </span>
                <PartLink
                  component="page"
                  part="Page.Root"
                />
                <span>s</span>
                <ul>
                  <li>
                    <PartLink part="Navigation.Back" /> (optional, in a page,
                    e.g. its bar)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="navigation-root"
      level={2}
    >
      <code>Navigation.Root</code>
    </Heading>
    <ul>
      <li>
        The stack: its children’s keys decide what moves (pushed, popped, or
        shown at once).
      </li>
      <li>
        Each page in a frame filling it (absolutely placed): the top one shown,
        those under it hidden and inert, kept mounted.
      </li>
      <li>
        Its <PartLink part="Navigation.SwipeArea" /> among its children (set
        apart from the pages).
      </li>
      <li>
        Renders a <code>div</code>, as high as its container (
        <code>height: 100%</code>), clipping the pages as they move.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={navigationRootRows} />

    <Heading
      id="navigation-swipearea"
      level={2}
    >
      <code>Navigation.SwipeArea</code>
    </Heading>
    <ul>
      <li>
        Where a swipe back starts (touch, or a mouse): a strip at the leading
        edge (<code>width</code>, 20px), over the pages; without one, pages
        aren’t swiped back.
      </li>
      <li>
        Rendered while a page can be popped (the root’s <code>onBack</code>,
        more than one page) or a swipe goes on; nothing otherwise.
      </li>
      <li>
        Swiped, the top page follows the finger; let go past half the width (or
        flung), <code>onBack</code> is called (reason <code>swipe</code>, the
        transition done); otherwise it settles back.
      </li>
      <li>
        Renders a <code>div</code>: nothing of its own to see, so overlaid here.
      </li>
    </ul>
    <SwipeAreaPart />
    <h3>Props</h3>
    <PropsTable rows={navigationSwipeAreaRows} />

    <Heading
      id="navigation-back"
      level={2}
    >
      <code>Navigation.Back</code>
    </Heading>
    <ul>
      <li>
        A button taking its navigation back: the root’s <code>onBack</code>{' '}
        (reason <code>back-press</code>), the app popping its stack (pushed and
        popped as any change of it).
      </li>
      <li>
        On the root page (nothing to go back to), or without <code>onBack</code>
        , disabled.
      </li>
      <li>
        Renders a <code>button</code>; e.g. a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        by its <code>render</code>, labelled by the page below’s title.
      </li>
    </ul>
    <BackPart />
    <h3>Props</h3>
    <PropsTable rows={navigationBackRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const navigationPartsDemos = [RootPart, SwipeAreaPart, BackPart];
