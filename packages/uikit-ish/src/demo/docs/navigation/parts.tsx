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
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfChevronBackward } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { pages } from './content.js';
import {
  navigationBackRows,
  navigationPageRows,
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
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
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Navigation.Root"
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
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
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Navigation.Stack"
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
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
      setup={setupPushed}
      stage="phone"
      state={[...state, partState]}
      title="Navigation.SwipeArea"
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
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
      setup={setupPushed}
      stage="phone"
      state={[...state, partState]}
      title="Navigation.Back"
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Navigation.Persistent': ['onClick', 'persistentId'],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
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
      controls={[controls, partControls]}
      id={id}
      log={log}
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Navigation.Persistent"
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
                    <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                      {index > 0 ? (
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
                      ) : null}
                    </Toolbar.Leading>
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                      <Navigation.Persistent
                        {...partProps['Navigation.Persistent']}
                        persistentId={
                          typeof persistentId === 'function'
                            ? persistentId(key)
                            : persistentId
                        }
                        {...persistent}
                        onClick={() => addLog(`select: ${key}`)}
                      >
                        <Button.Label {...partProps['Button.Label']}>
                          Select
                        </Button.Label>
                      </Navigation.Persistent>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
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
    </Component>
  );
};

/**
 * `Navigation.Page`, around each of Settings' pages: instant (by default
 * here), pushed and popped at once, not swiped back; or sliding as any.
 */
const PagePart: FunctionComponent = () => {
  const id = 'navigation-parts-page';
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
    propsPage,
    propsRoot,
    propsStack,
    propsSwipeArea,
    state,
  } = useNavigationControls(id, addLog, pop, { featured: 'Page' });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
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
      setup={setup}
      stage="phone"
      state={[...state, partState]}
      title="Navigation.Page"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root {...propsRoot}>
          <Navigation.SwipeArea {...propsSwipeArea} />
          <Navigation.Stack {...propsStack}>
            {keys.map((key, index) => (
              <Navigation.Page
                key={key}
                {...propsPage}
              >
                <Header.Root>
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
              </Navigation.Page>
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
        The root holds the stack’s state. Inside it are the stack (the app’s
        keyed pages, each with its bar, and a back button from the first pushed
        page on) and the swipe area.
      </li>
      <li>
        Each page gets a frame of its own, which moves during transitions. The
        swipe area sits at the leading edge, where a swipe back starts.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <span>The app’s root, for example </span>
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
                  back buttons), for example a{' '}
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
                    <span>), for example </span>
                    <PartLink
                      component="header"
                      part="Header.Root"
                    />
                    <span>s around </span>
                    <PartLink
                      component="page"
                      part="Page.Root"
                    />
                    <span>
                      s, their bars moving with them; each optionally in a{' '}
                    </span>
                    <PartLink part="Navigation.Page" />
                    <span> (keyed instead: instant, or not)</span>
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
        The navigation. It holds its stack’s state (the keys its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />{' '}
        holds, and the current transition) for its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />
        , its{' '}
        <PartLink
          component="navigation"
          part="Navigation.SwipeArea"
        />{' '}
        and its stack.
      </li>
      <li>
        What should stay still while pages move can go inside it, outside the
        stack. For example, a bar of its own (a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />{' '}
        in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        ) above the pages’ own bars. Only that bar’s items take the pointer.
      </li>
      <li>
        Renders a <code>div</code>, as tall as its container (
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
        The stack. Its children’s keys decide what moves: pushed, popped, or
        shown at once.
      </li>
      <li>
        Each page sits in a frame that fills the stack (absolutely positioned).
        The top page shows. Those under it are hidden and inert, but stay
        mounted. Each page’s <a href={publicUrl('header')}>Header</a> moves with
        it, bar and title included.
      </li>
      <li>
        Renders a <code>div</code> that fills its root and clips the pages as
        they move.
      </li>
    </ul>
    <StackPart />
    <h3>Props</h3>
    <PropsTable rows={navigationStackRows} />

    <Heading
      id="navigation-page"
      level={2}
    >
      <code>Navigation.Page</code>
    </Heading>
    <ul>
      <li>
        An optional wrapper around one page of the stack, keyed in the page’s
        place as the stack’s child. It sets how that page comes and goes.
      </li>
      <li>
        An <code>instant</code> page shows at once when pushed or popped,
        without sliding. While on top, it can’t be swiped back, though its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />{' '}
        still goes back, at once. The page that’s coming or going decides: when
        a page is pushed onto an instant page, or popped off one back to it, the
        other page slides as usual.
      </li>
      <li>
        Use it for a page whose own scrolling a slide would disturb, such as a
        page pulled past its ends (a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        />
        ’s refresh, or turning pages).
      </li>
      <li>
        Here, the control makes every page instant. Drilling in and going back
        then show the pages at once; otherwise, they slide.
      </li>
      <li>
        Renders no element. Its page sits in the stack’s frame as it would
        without it.
      </li>
    </ul>
    <PagePart />
    <h3>Props</h3>
    <PropsTable rows={navigationPageRows} />

    <Heading
      id="navigation-swipearea"
      level={2}
    >
      <code>Navigation.SwipeArea</code>
    </Heading>
    <ul>
      <li>
        Where a swipe back starts, by touch or mouse: a strip at the leading
        edge (<code>width</code>, 20px), above the pages. Without one, pages
        can’t be swiped back.
      </li>
      <li>
        It renders while a page can be popped (the root has <code>onBack</code>,
        and there’s more than one page, at rest or while popping), or while a
        swipe is going on. Otherwise, it renders nothing.
      </li>
      <li>
        While swiped, the top page follows the finger. Let go past half the
        width, or flung, and <code>onBack</code> is called with the reason{' '}
        <code>swipe</code>, as it’s let go, and the pop continues from there.
        Otherwise, it settles back.
      </li>
      <li>
        It also works while a page is being popped and is still leaving: swiping
        again then cascades, as when going back quickly (see{' '}
        <a href={publicUrl('navigation/composition#going-back-quickly')}>
          Composition
        </a>
        ). It doesn’t work while a page is being pushed.
      </li>
      <li>
        Its swipes are its own. Nothing scrolls meanwhile, and a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />{' '}
        around it isn’t swiped down along with it (Base UI’s{' '}
        <code>data-base-ui-swipe-ignore</code>).
      </li>
      <li>
        Renders a <code>div</code>. There’s nothing of it to see, so it’s
        overlaid here.
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
        A button that takes its navigation back. It calls the root’s{' '}
        <code>onBack</code> with the reason <code>back-press</code>, and the app
        pops its stack, like any change to it.
      </li>
      <li>
        It can sit in each pushed page’s bar, as here. Then it’s a persistent
        item (<code>persistentId</code>, <code>back</code> by default, see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ): it slides in with the first pushed page, stays put on deeper pages
        and on the way back, and slides out with the first page again.
      </li>
      <li>
        Or it can sit anywhere inside its root, for example in a bar of its own
        outside the stack. There it stays still while the pages move, and
        renders while there’s a page to go back to.
      </li>
      <li>
        It’s disabled on the root page (with nothing to go back to), or without{' '}
        <code>onBack</code>.
      </li>
      <li>
        Renders a <code>button</code>, or another element through its{' '}
        <code>render</code>, for example a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />
        , labelled with the title of the page below.
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
        An item of a page’s bar (for example a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />
        , through its <code>render</code>) that stays put through a transition
        (a push, a pop, a swipe back), as long as both moving pages have an item
        with its <code>persistentId</code>. The upper page’s item shows, and
        doesn’t move.
      </li>
      <li>
        If only one of the pages has it, it moves with its page. A back button
        works this way (a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />{' '}
        is persistent by default): it slides in with the first page that has
        one, and out with it.
      </li>
      <li>
        Here, Select is on every page and stays put throughout. Give each page
        its own <code>persistentId</code>, and it moves with its page instead.
      </li>
      <li>
        Renders a <code>div</code> (its item’s box), or the item itself through
        its <code>render</code>.
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
  PagePart,
  SwipeAreaPart,
  BackPart,
  PersistentPart,
];
