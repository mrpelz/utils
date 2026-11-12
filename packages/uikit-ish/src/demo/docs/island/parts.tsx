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
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfEllipsis, sfSquareAndArrowUp } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import {
  islandContentRows,
  islandGrabberRows,
  islandHeaderRows,
  islandRootRows,
  islandSnapGroupRows,
} from './docs.js';
import {
  getPropOptionsRoot,
  propOptionsGrabber,
  propOptionsPart,
  propOptionsSnapGroup,
} from './props.js';

// Each view: a phone's screen, a place's island over its wallpaper (as over
// a map), the part outlined (see its controls).

/** `Island.Root`: a place's island, its stops (its controls'). */
const RootPart: FunctionComponent = () => {
  const id = 'island-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Island.Root' },
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
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Island.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']} />
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${elementKey}`}
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

/** `Island.Header`: a place's island, its header outlined (its controls'). */
const HeaderPart: FunctionComponent = () => {
  const id = 'island-parts-header';
  const [log, addLog] = useLog();
  const [externalRoot, external] = useProvidedState(id);
  const [controlRoot, rootProps, stateRoot, rootKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Island.Root' },
  );
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Island.Header',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Island.Content': [],
            'Island.Grabber': [],
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
      isInline
      controls={[controlRoot, control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state, partState]}
      title="Island.Header"
    >
      <Viewport.Content {...partProps['Viewport.Content']} />
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
        >
          <Island.Header {...props}>
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

/** `Island.Grabber`: a place's island, its grabber outlined (its controls'). */
const GrabberPart: FunctionComponent = () => {
  const id = 'island-parts-grabber';
  const [log, addLog] = useLog();
  const [externalRoot, external] = useProvidedState(id);
  const [controlRoot, rootProps, stateRoot, rootKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Island.Root' },
  );
  const [control, props, state] = usePropControl(propOptionsGrabber, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Island.Grabber',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Island.Content': [],
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
      isInline
      controls={[controlRoot, control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state, partState]}
      title="Island.Grabber"
    >
      <Viewport.Content {...partProps['Viewport.Content']} />
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
        >
          <Island.Header {...partProps['Island.Header']}>
            <Island.Grabber {...props} />
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

/** `Island.Content`: a place's island, its content outlined (its controls'). */
const ContentPart: FunctionComponent = () => {
  const id = 'island-parts-content';
  const [log, addLog] = useLog();
  const [externalRoot, external] = useProvidedState(id);
  const [controlRoot, rootProps, stateRoot, rootKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Island.Root' },
  );
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Island.Content',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
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
      isInline
      controls={[controlRoot, control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state, partState]}
      title="Island.Content"
    >
      <Viewport.Content {...partProps['Viewport.Content']} />
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
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
          <Island.Content {...props}>
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

/** `Island.SnapGroup`: a place's island, its snapgroup outlined (its controls'). */
const SnapGroupPart: FunctionComponent = () => {
  const id = 'island-parts-snap-group';
  const [log, addLog] = useLog();
  const [externalRoot, external] = useProvidedState(id);
  const [controlRoot, rootProps, stateRoot, rootKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Island.Root' },
  );
  const [control, props, state] = usePropControl(propOptionsSnapGroup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Island.SnapGroup',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Island.SnapGroup (others)': ['value'],
            'Button.Icon': [],
            'Island.Content': [],
            'Island.Grabber': [],
            'Island.Header': [],
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
      isInline
      controls={[controlRoot, control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state, partState]}
      title="Island.SnapGroup"
    >
      <Viewport.Content {...partProps['Viewport.Content']} />
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
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
              {...partProps['Island.SnapGroup (others)']}
              value="header"
            />
            {/* (Its name, by its controls: `peek` at first.) */}
            <Island.SnapGroup {...props}>
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
              {...partProps['Island.SnapGroup (others)']}
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
              {...partProps['Island.SnapGroup (others)']}
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

/** `/island/parts`: its root, header, grabber, content and snap groups. */
export const IslandParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root (with its stops), its header (a grabber and a bar), and its
        content (with its snap groups), in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        .
      </li>
      <li>Swipe each view’s island up and down to see its stops.</li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        <ul>
          <li>
            <PartLink
              component="island"
              part="Island.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="island"
                  part="Island.Header"
                />
                <ul>
                  <li>
                    <PartLink
                      component="island"
                      part="Island.Grabber"
                    />
                  </li>
                  <li>
                    <PartLink
                      component="island"
                      part="Island.SnapGroup"
                    />{' '}
                    (optional, empty: a sliver, its grabber alone)
                  </li>
                  <li className="demo-tree-context">
                    <PartLink
                      component="toolbar"
                      part="Toolbar.Root"
                    />{' '}
                    (<code>placement=&quot;block-start&quot;</code>)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="island"
                  part="Island.Content"
                />
                <ul>
                  <li>
                    <PartLink
                      component="island"
                      part="Island.SnapGroup"
                    />{' '}
                    (one per stop, optional)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="island-root"
      level={2}
    >
      <code>Island.Root</code>
    </Heading>
    <ul>
      <li>
        The island: its glass capsule, with its stops named by its snap groups (
        <code>snapPoint</code> or <code>defaultSnapPoint</code>, the lowest by
        default, and <code>onSnapPointChange</code>).
      </li>
      <li>
        Its box is what it shows (its stop, or its content). That’s its anchor’s
        size, which the page’s paddings and the content layer’s{' '}
        <code>--uikit-viewport-anchor-block-end</code> follow as it comes to
        rest.
      </li>
      <li>
        It’s neither a dialog nor Base UI’s. It has no portal, backdrop, focus
        trap or open state, and never closes.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={islandRootRows} />

    <Heading
      id="island-header"
      level={2}
    >
      <code>Island.Header</code>
    </Heading>
    <ul>
      <li>
        Its grabber above its bar (a <a href={publicUrl('toolbar')}>Toolbar</a>
        ). It stays put as its content scrolls below it.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={islandHeaderRows} />

    <Heading
      id="island-grabber"
      level={2}
    >
      <code>Island.Grabber</code>
    </Heading>
    <ul>
      <li>
        The grabber (36px by 5px, 5px from the top), first in its header. It
        shows that the island can be swiped up.
      </li>
      <li>
        Renders a <code>div</code>, hidden from assistive technology.
      </li>
    </ul>
    <GrabberPart />
    <h3>Props</h3>
    <PropsTable rows={islandGrabberRows} />

    <Heading
      id="island-content"
      level={2}
    >
      <code>Island.Content</code>
    </Heading>
    <ul>
      <li>
        What’s below its header, and scrolls. With stops, it only scrolls at the
        top stop. Below that, dragging it drags the island. At its start, a pull
        down (by touch, or by a wheel or trackpad scroll that started there)
        hands back to the island.
      </li>
      <li>
        A text field typed into inside it is scrolled into view above the
        on-screen keyboard (see{' '}
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ). With stops, that happens at its top stop only.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ContentPart />
    <h3>Props</h3>
    <PropsTable rows={islandContentRows} />

    <Heading
      id="island-snapgroup"
      level={2}
    >
      <code>Island.SnapGroup</code>
    </Heading>
    <ul>
      <li>
        One of the island’s stops. Swiped up, the island reveals its content
        group by group, snapping to show everything up to a group’s end (its
        header too). It’s measured live as the content changes.
      </li>
      <li>
        Each stop is named (<code>value</code>). The root’s stop props take and
        give those names, not heights.
      </li>
      <li>
        An empty group first in the content makes a stop with only the header,
        its bar centered in it. An empty group in the header, right after the
        grabber, makes a sliver with only the grabber (see{' '}
        <a href={publicUrl('island/composition#as-a-sliver')}>Composition</a>).
      </li>
      <li>
        The last group holds the rest. When it reaches past the island’s height,
        its stop is the whole island.
      </li>
      <li>
        While its content is scrolled away from its start (only possible when
        fully extended), the groups in it aren’t stops. Dragging the header down
        then goes to the header-only stop or the sliver, or nowhere if there’s
        neither. Back at the start, they’re stops again. When a group’s stop is
        asked for while scrolled away (the root’s <code>snapPoint</code>), the
        island goes there and scrolls the content back to its start.
      </li>
      <li>
        It’s optional. Without groups, the island is a plain capsule as tall as
        its content.
      </li>
    </ul>
    <SnapGroupPart />
    <h3>Props</h3>
    <PropsTable rows={islandSnapGroupRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const islandPartsDemos = [
  RootPart,
  HeaderPart,
  GrabberPart,
  ContentPart,
  SnapGroupPart,
];
