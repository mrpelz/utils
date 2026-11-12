import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Header,
  List,
  Page,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfCheckmark,
  sfChevronBackward,
  sfEllipsis,
  sfSquareAndArrowUp,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  propOptionsBar,
  propOptionsLargeTitle,
  propOptionsTitle,
} from './props.js';

/**
 * A page's header: its top toolbar anchored above the page; the large
 * title sits below its buttons and scrolls away under it, the bar's title
 * fading in between them.
 */
export const HeaderDemo: FunctionComponent = () => {
  const id = 'header';

  const [log, addLog] = useLog();
  const [externalBar, externalTitle, externalLargeTitle] = useProvidedState(id);

  const [controlBar, propsBar, stateBar] = usePropControl(propOptionsBar, {
    external: externalBar,
    isOpen: true,
    title: 'Toolbar.Root (bar)',
  });
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    propOptionsTitle,
    { external: externalTitle, title: 'Toolbar.Title' },
  );
  const [controlLargeTitle, propsLargeTitle, stateLargeTitle] = usePropControl(
    propOptionsLargeTitle,
    { external: externalLargeTitle, title: 'Header.LargeTitle' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'prominent', 'shape'],
            'Toolbar.Group': [],
            'Toolbar.Leading': [],
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
      controls={[controlBar, controlTitle, controlLargeTitle, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[stateBar, stateTitle, stateLargeTitle, partState]}
      title="Header"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Back"
                  shape="circle"
                  onClick={() => addLog('Back clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfChevronBackward}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...propsTitle}>
                <span>Inbox</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Group {...partProps['Toolbar.Group']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    aria-label="Share"
                    shape="circle"
                    onClick={() => addLog('Share clicked')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Button.Icon>
                  </Toolbar.Button>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    aria-label="More"
                    shape="circle"
                    onClick={() => addLog('More clicked')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfEllipsis}
                      />
                    </Button.Icon>
                  </Toolbar.Button>
                </Toolbar.Group>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  prominent
                  aria-label="Done"
                  shape="circle"
                  onClick={() => addLog('Done clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfCheckmark}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Inbox</span>
            </Header.LargeTitle>

            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {Array.from({ length: 30 }, (_, index) => (
                    <List.Item
                      key={index}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Message {index + 1}
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
      </Viewport.Content>
    </Component>
  );
};

/**
 * A page's header without a large title: the bar's title shows, with a
 * subtitle; centered, or at its start.
 */
export const HeaderTitleDemo: FunctionComponent = () => {
  const id = 'header-title';

  const [log, addLog] = useLog();
  const [externalBar, externalTitle, externalSubtitle] = useProvidedState(id);

  const [controlBar, propsBar, stateBar] = usePropControl(propOptionsBar, {
    external: externalBar,
    isOpen: true,
    title: 'Toolbar.Root (bar)',
  });
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    propOptionsTitle,
    { external: externalTitle, isOpen: true, title: 'Toolbar.Title' },
  );
  const [controlSubtitle, propsSubtitle, stateSubtitle] = usePropControl(
    commonPropOptions,
    { external: externalSubtitle, title: 'Toolbar.Subtitle' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'prominent', 'shape'],
            'Toolbar.Group': [],
            'Toolbar.Leading': [],
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
      controls={[controlBar, controlTitle, controlSubtitle, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[stateBar, stateTitle, stateSubtitle, partState]}
      title="Header (Title)"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Back"
                  shape="circle"
                  onClick={() => addLog('Back clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfChevronBackward}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...propsTitle}>
                <span>Inbox</span>
                <Toolbar.Subtitle {...propsSubtitle}>Subtitle</Toolbar.Subtitle>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Group {...partProps['Toolbar.Group']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    aria-label="Share"
                    shape="circle"
                    onClick={() => addLog('Share clicked')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Button.Icon>
                  </Toolbar.Button>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    aria-label="More"
                    shape="circle"
                    onClick={() => addLog('More clicked')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfEllipsis}
                      />
                    </Button.Icon>
                  </Toolbar.Button>
                </Toolbar.Group>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  prominent
                  aria-label="Done"
                  shape="circle"
                  onClick={() => addLog('Done clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfCheckmark}
                    />
                  </Button.Icon>
                </Toolbar.Button>
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
                  {Array.from({ length: 30 }, (_, index) => (
                    <List.Item
                      key={index}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Message {index + 1}
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
      </Viewport.Content>
    </Component>
  );
};
