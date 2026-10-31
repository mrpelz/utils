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
import { sfChevronBackward } from '../../tooling/icons.js';
import { pages } from './content.js';
import {
  navigationBackRows,
  navigationPersistentRows,
  navigationRootRows,
  navigationStackRows,
  navigationSwipeAreaRows,
} from './docs.js';
import { useNavigationControls } from './props.js';

// Each part's view: a phone's stack of Settings' pages (a pushed one, for
// the swipe area's and the back button's), the back button in each pushed
// page's bar (staying put between them), every part's props, the part's own
// open and emphasized.

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
  const { controls, propsBack, propsRoot, propsStack, propsSwipeArea, state } =
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
      <Viewport.Content>
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Navigation.Stack {...propsStack}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    {index > 0 ? (
                      <Toolbar.Leading>
                        <Navigation.Back
                          aria-label={pages[keys[index - 1] ?? '']?.title}
                          {...propsBack}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
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
    </Component>
  );
};

/** `Navigation.Stack`, outlined: Settings' pages. */
const StackPart: FunctionComponent = () => {
  const id = 'navigation-parts-stack';
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
    useNavigationControls(id, addLog, pop, { featured: 'Stack' });

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Navigation.Stack"
    >
      <Viewport.Content>
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Navigation.Stack {...propsStack}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    {index > 0 ? (
                      <Toolbar.Leading>
                        <Navigation.Back
                          aria-label={pages[keys[index - 1] ?? '']?.title}
                          {...propsBack}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
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
    </Component>
  );
};

/**
 * `Navigation.SwipeArea`, overlaid: a pushed page, swiped back from its
 * leading edge.
 */
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
  const { controls, propsBack, propsRoot, propsStack, propsSwipeArea, state } =
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
      <Viewport.Content>
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Navigation.Stack {...propsStack}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    {index > 0 ? (
                      <Toolbar.Leading>
                        <Navigation.Back
                          aria-label={pages[keys[index - 1] ?? '']?.title}
                          {...propsBack}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
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
    </Component>
  );
};

/** `Navigation.Back`, outlined: the back button, in each pushed page's bar. */
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
  const { controls, propsBack, propsRoot, propsStack, propsSwipeArea, state } =
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
      <Viewport.Content>
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Navigation.Stack {...propsStack}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    {index > 0 ? (
                      <Toolbar.Leading>
                        <Navigation.Back
                          aria-label={pages[keys[index - 1] ?? '']?.title}
                          {...propsBack}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
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
    </Component>
  );
};

/**
 * `Navigation.Persistent`, outlined: each page's bar with a back button
 * (from the second page) and a Select button (on every page), staying put
 * between pages sharing them.
 */
const PersistentPart: FunctionComponent = () => {
  const id = 'navigation-parts-persistent';
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
  const {
    controls,
    propsBack,
    propsPersistent,
    propsRoot,
    propsStack,
    propsSwipeArea,
    state,
  } = useNavigationControls(id, addLog, pop, { featured: 'Persistent' });
  const { persistentId, ...persistent } = propsPersistent;

  return (
    <Component
      isInline
      controls={controls}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={state}
      title="Navigation.Persistent"
    >
      <Viewport.Content>
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Navigation.Stack {...propsStack}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Leading>
                      {index > 0 ? (
                        <Navigation.Back
                          aria-label={pages[keys[index - 1] ?? '']?.title}
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
                    <Toolbar.Trailing>
                      <Navigation.Persistent
                        persistentId={
                          typeof persistentId === 'function'
                            ? persistentId(key)
                            : persistentId
                        }
                        {...persistent}
                        onClick={() => addLog(`select: ${key}`)}
                      >
                        <Button.Label>Select</Button.Label>
                      </Navigation.Persistent>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
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
    </Component>
  );
};

/** `/navigation/parts`: its root, stack, swipe area and back button. */
export const NavigationParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        The root, holding the stack’s state; in it, the stack (the app’s pages,
        keyed, each with its bar: from the first pushed page, the back button)
        and the swipe area.
      </li>
      <li>
        Around each page, a frame of its own (moved in transitions); at the
        leading edge, the swipe area, where a swipe back starts.
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
                <span>
                  A bar outside the stack (optional, instead of the pages’ own
                  back buttons), e.g. a{' '}
                </span>
                <PartLink
                  component="viewport"
                  part="Viewport.BlockStart"
                />
                <span> around a </span>
                <PartLink
                  component="toolbar"
                  part="Toolbar.Root"
                />
                <ul>
                  <li>
                    <PartLink part="Navigation.Back" /> (optional, while a page
                    can be popped)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink part="Navigation.Stack" />
                <ul>
                  <li className="demo-tree-context">
                    <span>The pages (keyed children, each in a frame: </span>
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
                    <span>s, their bars moving with them</span>
                    <ul>
                      <li>
                        <PartLink part="Navigation.Back" />,{' '}
                        <PartLink part="Navigation.Persistent" /> (optional, in
                        a page’s bar: staying put between pages sharing them)
                      </li>
                    </ul>
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
        The navigation: its stack’s state (the keys its{' '}
        <PartLink part="Navigation.Stack" /> holds, a transition), for its{' '}
        <PartLink part="Navigation.Back" />, its{' '}
        <PartLink part="Navigation.SwipeArea" />, and its stack.
      </li>
      <li>
        What stays while pages move can go in it, outside the stack: e.g. a bar
        of its own (a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />{' '}
        in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ), over the pages’ own bars; only its items take the pointer.
      </li>
      <li>
        Renders a <code>div</code>, as high as its container (
        <code>height: 100%</code>).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={navigationRootRows} />

    <Heading
      id="navigation-stack"
      level={2}
    >
      <code>Navigation.Stack</code>
    </Heading>
    <ul>
      <li>
        The stack: its children’s keys decide what moves (pushed, popped, or
        shown at once).
      </li>
      <li>
        Each page in a frame filling it (absolutely placed): the top one shown,
        those under it hidden and inert, kept mounted; each page’s{' '}
        <a href="header">Header</a> moving with it, its bar and title too.
      </li>
      <li>
        Renders a <code>div</code>, filling its root, clipping the pages as they
        move.
      </li>
    </ul>
    <StackPart />
    <h3>Props</h3>
    <PropsTable rows={navigationStackRows} />

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
        more than one page; at rest, or while popping) or a swipe goes on;
        nothing otherwise.
      </li>
      <li>
        Swiped, the top page follows the finger; let go past half the width (or
        flung), <code>onBack</code> is called (reason <code>swipe</code>, as
        it’s let go: the pop on from there); otherwise it settles back.
      </li>
      <li>
        Also while a page is popped (still leaving: a swipe again, the cascade
        of going back quickly, see{' '}
        <a href="navigation/composition#going-back-quickly">Composition</a>);
        not while one is pushed.
      </li>
      <li>
        Its swipes are its own: nothing scrolls meanwhile, and a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />{' '}
        around it isn’t swiped down along (Base UI’s{' '}
        <code>data-base-ui-swipe-ignore</code>).
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
        In each pushed page’s bar (as here): a persistent item (
        <code>persistentId</code>, <code>back</code> by default, see{' '}
        <PartLink part="Navigation.Persistent" />
        ), sliding in with the first pushed page, staying put on deeper ones and
        back, sliding out with the first again.
      </li>
      <li>
        Or anywhere in its root: e.g. in a bar of its own outside the stack,
        still while the pages move (rendered while there’s a page to go back
        to).
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

    <Heading
      id="navigation-persistent"
      level={2}
    >
      <code>Navigation.Persistent</code>
    </Heading>
    <ul>
      <li>
        An item of a page’s bar (e.g. a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        by its <code>render</code>) that stays put through a transition (pushed,
        popped, swiped back) while both moving pages have an item of its{' '}
        <code>persistentId</code>: the upper page’s shown, unmoved.
      </li>
      <li>
        Only one of them having it, it moves with its page: e.g. a back button
        (a <PartLink part="Navigation.Back" /> is one, by default) slides in
        with the first page to have one, and out with it.
      </li>
      <li>
        Here, Select (on every page) stays put throughout; each page’s own id (
        <code>persistentId</code>), it moves with its page.
      </li>
      <li>
        Renders a <code>div</code> (its item’s box), or its item itself by its{' '}
        <code>render</code>.
      </li>
    </ul>
    <PersistentPart />
    <h3>Props</h3>
    <PropsTable rows={navigationPersistentRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const navigationPartsDemos = [
  RootPart,
  StackPart,
  SwipeAreaPart,
  BackPart,
  PersistentPart,
];
