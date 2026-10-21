import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
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
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { pages } from './content.js';
import { navigationBackRows, navigationRootRows } from './docs.js';
import { getPropOptionsGuideBack, getPropOptionsGuideRoot } from './props.js';

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

  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(pop), [pop]),
    'Navigation.Root',
    external,
    true,
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
      title="Navigation.Root"
    >
      <div className="navigation-demo-phone">
        <Navigation.Root {...props}>
          {keys.map((key, depth) => (
            <Page.Root key={key}>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Navigation.Back
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        render={<Toolbar.Button shape="circle" />}
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
                </Header.Bar>
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
  const pop = ({ reason }: NavigationBackEventDetails) => {
    addLog(`pop (${reason})`);
    setKeys((current) => current.slice(0, -1));
  };

  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideBack(addLog), [addLog]),
    'Navigation.Back',
    external,
    true,
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
      title="Navigation.Back"
    >
      <div className="navigation-demo-phone">
        <Navigation.Root onBack={pop}>
          {keys.map((key, depth) => (
            <Page.Root key={key}>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Navigation.Back
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        {...props}
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
                </Header.Bar>
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
    </Component>
  );
};

/** `/navigation/parts`: its root, and what it renders around the pages. */
export const NavigationParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        The root, its children the stack’s pages (the app’s, keyed); a back
        button in them.
      </li>
      <li>
        Around each page, a frame of its own (moved in transitions); at the
        leading edge, where a swipe back starts.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        <ul>
          <li>
            the pages (keyed children, e.g. <a href="page">Page</a>s with a{' '}
            <a href="header">Header</a>), each in a frame (
            <code>data-navigation-part=&quot;page&quot;</code>)
          </li>
          <li>
            the swipe edge (<code>data-navigation-part=&quot;edge&quot;</code>,
            with <code>onBack</code>, while a page can be popped)
          </li>
          <li>
            <PartLink
              component="navigation"
              part="Navigation.Back"
            />{' '}
            (optional, in a page, e.g. its bar)
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
        A 20px strip at the leading edge, over the pages, where swiping back
        starts (with <code>onBack</code>, more than one page, no transition
        running).
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
export const navigationPartsDemos = [RootPart, BackPart];
