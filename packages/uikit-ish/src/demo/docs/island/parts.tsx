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
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfEllipsis, sfSquareAndArrowUp } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
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

  return (
    <Component
      hasWallpaper
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Island.Root"
    >
      <Viewport.Content />
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root
          key={`${elementKey}`}
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

  return (
    <Component
      hasWallpaper
      isInline
      controls={[controlRoot, control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state]}
      title="Island.Header"
    >
      <Viewport.Content />
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
        >
          <Island.Header {...props}>
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

  return (
    <Component
      hasWallpaper
      isInline
      controls={[controlRoot, control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state]}
      title="Island.Grabber"
    >
      <Viewport.Content />
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
        >
          <Island.Header>
            <Island.Grabber {...props} />
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

  return (
    <Component
      hasWallpaper
      isInline
      controls={[controlRoot, control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state]}
      title="Island.Content"
    >
      <Viewport.Content />
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
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
          <Island.Content {...props}>
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

  return (
    <Component
      hasWallpaper
      isInline
      controls={[controlRoot, control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateRoot, state]}
      title="Island.SnapGroup"
    >
      <Viewport.Content />
      <Viewport.Anchor
        edge="block-end"
        edgeEffect="none"
      >
        <Island.Root
          key={`${rootKey}`}
          {...rootProps}
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
            {/* (Its name, by its controls: `peek` at first.) */}
            <Island.SnapGroup {...props}>
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

/** `/island/parts`: its root, header, grabber, content and snap groups. */
export const IslandParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root (its stops), its header (a grabber, a bar) and its content (its
        snap groups), in a bottom{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        .
      </li>
      <li>Swipe each view’s island up and down to see its stops.</li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />{' '}
        (<code>edge=&quot;block-end&quot;</code>)
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
        The island: its capsule (glass), its stops by its snap groups’ names (
        <code>snapPoint</code> or <code>defaultSnapPoint</code>, by default the
        lowest; <code>onSnapPointChange</code>).
      </li>
      <li>
        Its box is what it shows (its stop, or its content): its anchor’s size,
        for the page’s paddings and the content layer’s{' '}
        <code>--uikit-viewport-anchor-block-end</code>, as it comes to rest.
      </li>
      <li>
        Not a dialog, nor Base UI’s: no portal, backdrop, focus trap or open
        state; never closed.
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
        ), staying as its content scrolls below it.
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
        The grabber (36px by 5px, 5px from the top), first in its header:
        showing it can be swiped up.
      </li>
      <li>
        Renders a <code>div</code>, hidden from assistive tech.
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
        What’s below its header, scrolling: with stops, at its top stop only
        (below it, dragging it drags the island; at its start, a pull down, by
        touch or by a wheel or trackpad scroll begun there, hands back to the
        island).
      </li>
      <li>
        A text field typed into in it, scrolled into view above the on-screen
        keyboard (see{' '}
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ); with stops, at its top stop only.
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
        A stop of the island’s: swiped up, it reveals its content group by
        group, snapping to show everything up to a group’s end (its header too),
        measured live as the content changes.
      </li>
      <li>
        Named (<code>value</code>): the root’s stops take and give the names,
        not heights.
      </li>
      <li>
        Empty, first in the content: its header alone, its bar centered in it.
        Empty, in the header right after the grabber: a sliver, the grabber
        alone (see{' '}
        <a href={publicUrl('island/composition#as-a-sliver')}>Composition</a>).
      </li>
      <li>
        The last holds the rest: reaching past the island’s height, its stop is
        the whole island.
      </li>
      <li>
        While its content is scrolled away from its start (only possible fully
        extended), the groups in it aren’t stops: dragging the header down goes
        to the header-only stop or the sliver, or nowhere without one. Back at
        the start, they’re stops again. Asked for while scrolled away (the
        root’s <code>snapPoint</code>), a group’s stop is gone to with the
        content scrolled back to its start.
      </li>
      <li>Optional: without groups, a plain capsule as tall as its content.</li>
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
