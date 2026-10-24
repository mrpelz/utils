import './style.css';

import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';

import {
  Button,
  Header,
  List,
  Navigation,
  type NavigationBackEventDetails,
  Page,
  Segmented,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { pages } from './content.js';
import { getPropOptionsRoot } from './props.js';

type Stack = 'mail' | 'settings';

/**
 * Navigation (UIKit `UINavigationController`): the app's stacks of pages
 * (its state, no router): drilling into a row pushes a page, the back button
 * (or swiping from the leading edge) pops it, each page's header blending
 * over; switching between the stacks (e.g. tabs) shows the other at once.
 */
export const NavigationDemo: FunctionComponent = () => {
  const id = 'navigation';
  const [log, addLog] = useLog();
  const [stack, setStack] = useState<Stack>('settings');
  const [stacks, setStacks] = useState<Record<Stack, string[]>>({
    mail: ['mail'],
    settings: ['settings'],
  });

  const keys = stacks[stack];

  const push = (page: string) => {
    addLog(`push: ${page}`);
    setStacks((current) => ({
      ...current,
      [stack]: [...current[stack], page],
    }));
  };
  const pop = useCallback(
    ({ reason }: NavigationBackEventDetails) => {
      addLog(`pop (${reason})`);
      setStacks((current) => ({
        ...current,
        [stack]: current[stack].slice(0, -1),
      }));
    },
    [addLog, stack],
  );

  const [externalRoot] = useProvidedState(id);
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(pop), [pop]),
    { external: externalRoot, open: true, title: 'root' },
  );

  return (
    <Component
      stretch
      controls={[controlRoot]}
      id={id}
      log={log}
      state={[stateRoot]}
      title="Navigation"
    >
      {/* The stacks, as a tab bar's: switched at once. */}
      <Segmented.Root
        aria-label="Stack"
        className="navigation-demo-stacks"
        value={stack}
        onValueChange={(value) => {
          addLog(`stack: ${String(value)}`);
          setStack(value as Stack);
        }}
      >
        <Segmented.Item value="settings">Settings</Segmented.Item>
        <Segmented.Item value="mail">Mail</Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
      <div className="demo-phone demo-fill">
        <Navigation.Root {...propsRoot}>
          {keys.map((key, depth) => {
            const page = pages[key] ?? { children: [], title: key };
            const back = depth > 0 ? pages[keys[depth - 1] ?? '']?.title : null;

            return (
              <Page.Root key={key}>
                <Header.Root>
                  <Header.Bar>
                    {back ? (
                      <Toolbar.Leading>
                        <Navigation.Back
                          aria-label={back}
                          render={<Toolbar.Button shape="circle" />}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>{page.title}</span>
                    </Toolbar.Title>
                  </Header.Bar>
                  <Header.LargeTitle>
                    <span>{page.title}</span>
                  </Header.LargeTitle>
                </Header.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {page.children.map((child) => (
                        <List.Item key={child}>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => push(child)}
                          >
                            {pages[child]?.title ?? child}
                          </List.Title>
                          <List.DrillIn />
                        </List.Item>
                      ))}
                      {Array.from({ length: 12 }, (_, index) => (
                        <List.Item key={index}>
                          <List.Title>Row {index + 1}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            );
          })}
        </Navigation.Root>
      </div>
    </Component>
  );
};
