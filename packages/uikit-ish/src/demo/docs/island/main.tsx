import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Island,
  List,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfEllipsis, sfSquareAndArrowUp } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import { getPropOptionsRoot } from './props.js';

/**
 * An island: a place's, over the screen's wallpaper (as over a map),
 * revealed stop by stop as it's swiped up.
 */
export const IslandDemo: FunctionComponent = () => {
  const id = 'island';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external, isOpen: true, title: 'Island.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Island.Content': [],
            'Island.Grabber': [],
            'Island.Header': [],
            'Island.SnapGroup': ['value'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': ['edgeEffect'],
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
      hasWallpaper
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Island"
    >
      <Viewport.Content {...partProps['Viewport.Content']} />
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${key}`}
          {...props}
        >
          <Island.Header {...partProps['Island.Header']}>
            <Island.Grabber {...partProps['Island.Grabber']} />
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
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
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                Harbor Café
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
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
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Island.Header>
          <Island.Content {...partProps['Island.Content']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            {/* Its header alone: an empty group first. */}
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="header"
            />
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="peek"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    <List.Item {...partProps['List.Item']}>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Open until 6 PM
                        </List.Title>
                        <List.Subtitle {...partProps['List.Subtitle']}>
                          Café · 300 m
                        </List.Subtitle>
                      </List.Content>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="details"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {['Call', 'Website', 'Directions'].map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup
              {...partProps['Island.SnapGroup']}
              value="all"
            >
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                          <List.Subtitle {...partProps['List.Subtitle']}>
                            Review
                          </List.Subtitle>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Island.Content>
        </Island.Root>
      </Viewport.BlockEnd>
    </Component>
  );
};
