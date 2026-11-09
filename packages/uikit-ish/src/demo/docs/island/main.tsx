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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfEllipsis, sfSquareAndArrowUp } from '../../tooling/icons.js';
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

  return (
    <Component
      hasWallpaper
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Island"
    >
      <Viewport.Content />
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root
          key={`${key}`}
          {...props}
        >
          <Island.Header>
            <Island.Grabber />
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Share"
                  shape="circle"
                  onClick={() => addLog('Share clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>Harbor Café</Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="More"
                  shape="circle"
                  onClick={() => addLog('More clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfEllipsis} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Island.Header>
          <Island.Content>
            <Viewport.Padding edge="block-start" />
            {/* Its header alone: an empty group first. */}
            <Island.SnapGroup value="header" />
            <Island.SnapGroup value="peek">
              <List.Root>
                <List.Section>
                  <List.Group>
                    <List.Item>
                      <List.Content>
                        <List.Title>Open until 6 PM</List.Title>
                        <List.Subtitle>Café · 300 m</List.Subtitle>
                      </List.Content>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup value="details">
              <List.Root>
                <List.Section>
                  <List.Group>
                    {['Call', 'Website', 'Directions'].map((name) => (
                      <List.Item key={name}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Island.SnapGroup value="all">
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                          <List.Subtitle>Review</List.Subtitle>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Island.SnapGroup>
            <Viewport.Padding edge="block-end" />
          </Island.Content>
        </Island.Root>
      </Viewport.Anchor>
    </Component>
  );
};
