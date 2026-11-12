import './style.css';

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
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfChevronBackward } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { pages } from './content.js';
import { useNavigationControls } from './props.js';

type Stack = 'mail' | 'settings';

/**
 * Navigation: the app's stacks of pages
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
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': [
              'aria-label',
              'className',
              'onValueChange',
              'value',
            ],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockEnd': [],
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
            {keys.map((key, depth) => {
              const page = pages[key] ?? { children: [], title: key };

              return (
                <Header.Root key={key}>
                  <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                    <Toolbar.Root
                      {...partProps['Toolbar.Root']}
                      placement="block-start"
                    >
                      {depth > 0 ? (
                        <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                          <Navigation.Back
                            aria-label={pages[keys[depth - 1] ?? '']?.title}
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
                        <span>{page.title}</span>
                      </Toolbar.Title>
                    </Toolbar.Root>
                  </Viewport.BlockStart>
                  <Page.Root {...partProps['Page.Root']}>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-start"
                    />
                    <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                      <span>{page.title}</span>
                    </Header.LargeTitle>

                    <List.Root {...partProps['List.Root']}>
                      <List.Section {...partProps['List.Section']}>
                        <List.Group {...partProps['List.Group']}>
                          {page.children.map((child) => (
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
                                  {pages[child]?.title ?? child}
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                <List.DrillIn {...partProps['List.DrillIn']} />
                              </List.Trailing>
                            </List.Item>
                          ))}
                          {Array.from({ length: 12 }, (_, index) => (
                            <List.Item
                              key={index}
                              {...partProps['List.Item']}
                            >
                              <List.Content {...partProps['List.Content']}>
                                <List.Title {...partProps['List.Title']}>
                                  Row {index + 1}
                                </List.Title>
                              </List.Content>
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
              );
            })}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
      {/* The stacks, as a tab bar's: switched at once. */}
      <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
        <Segmented.Root
          {...partProps['Segmented.Root']}
          aria-label="Stack"
          className="navigation-demo-stacks"
          value={stack}
          onValueChange={(value) => {
            addLog(`stack: ${String(value)}`);
            setStack(value as Stack);
          }}
        >
          <Segmented.Item
            {...partProps['Segmented.Item']}
            value="settings"
          >
            Settings
          </Segmented.Item>
          <Segmented.Item
            {...partProps['Segmented.Item']}
            value="mail"
          >
            Mail
          </Segmented.Item>
          <Segmented.Highlight {...partProps['Segmented.Highlight']} />
        </Segmented.Root>
      </Viewport.BlockEnd>
    </Component>
  );
};
