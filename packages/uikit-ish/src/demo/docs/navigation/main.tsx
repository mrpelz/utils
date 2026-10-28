import './style.css';

import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent, useCallback, useState } from 'react';

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
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { pages } from './content.js';
import { useNavigationControls } from './props.js';

type Stack = 'mail' | 'settings';

/**
 * Navigation (UIKit `UINavigationController`): the app's stacks of pages
 * (its state, no router): drilling into a row pushes a page, the back button
 * (or swiping from the leading edge) pops it, each page's header moving
 * with it, the back button staying; switching between the stacks (e.g.
 * tabs) shows the other at once.
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

  const { controls, propsBack, propsRoot, propsStack, propsSwipeArea, state } =
    useNavigationControls(id, addLog, pop);

  return (
    <Component
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
            {keys.map((key) => {
              const page = pages[key] ?? { children: [], title: key };

              return (
                <Header.Root key={key}>
                  <Viewport.BlockStart>
                    <Toolbar.Root placement="block-start">
                      <Toolbar.Title>
                        <span>{page.title}</span>
                      </Toolbar.Title>
                    </Toolbar.Root>
                  </Viewport.BlockStart>
                  <Page.Root>
                    <Viewport.Padding edge="block-start" />
                    <Header.LargeTitle>
                      <span>{page.title}</span>
                    </Header.LargeTitle>

                    <List.Root>
                      <List.Section>
                        <List.Group>
                          {page.children.map((child) => (
                            <List.Item key={child}>
                              <List.Content>
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => push(child)}
                                >
                                  {pages[child]?.title ?? child}
                                </List.Title>
                              </List.Content>
                              <List.Trailing>
                                <List.DrillIn />
                              </List.Trailing>
                            </List.Item>
                          ))}
                          {Array.from({ length: 12 }, (_, index) => (
                            <List.Item key={index}>
                              <List.Content>
                                <List.Title>Row {index + 1}</List.Title>
                              </List.Content>
                            </List.Item>
                          ))}
                        </List.Group>
                      </List.Section>
                    </List.Root>
                    <Viewport.Padding edge="block-end" />
                  </Page.Root>
                </Header.Root>
              );
            })}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
      {/* The stacks, as a tab bar's: switched at once. */}
      <Viewport.BlockEnd>
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
      </Viewport.BlockEnd>
    </Component>
  );
};
