import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
} from 'react';

import {
  List,
  Toolbar,
  useElementGeometry,
  useElementVisibility,
  useScrollDirection,
  useViewportScroll,
  useVisualViewport,
  Viewport,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { AddLog, useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from './content.js';
import {
  elementGeometryRows,
  useElementGeometryRows,
  useElementVisibilityReturnRows,
  useElementVisibilityRows,
  useScrollDirectionRows,
  useViewportScrollRows,
  useVisualViewportRows,
  viewportAnchorRows,
  viewportBlockEndRows,
  viewportBlockStartRows,
  viewportContentRows,
  viewportProviderRows,
  viewportScrollEventRows,
} from './docs.js';
import {
  propOptionsAnchor,
  propOptionsBlockEnd,
  propOptionsBlockStart,
  propOptionsContent,
  propOptionsElementGeometry,
  propOptionsElementVisibility,
  propOptionsProvider,
} from './props.js';

/**
 * `Viewport.Provider` (its props controlled around it, see `ProviderPart`):
 * a screen's content layer, what the hooks return below it.
 */
const ProviderPartFrame: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
  control: ReactNode;
  state: object;
}> = ({ contentRef, control, state }) => {
  const id = 'viewport-parts-provider';
  const visual = useVisualViewport();
  const { atBottom, atTop, direction = '–' } = useScrollDirection();
  const edge = atBottom ? 'bottom' : '–';

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Viewport.Provider"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content ref={contentRef}>
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
      </div>
      <dl className="viewport-demo-metrics">
        <dt>Visual viewport</dt>
        <dd>
          {Math.round(visual.width)} × {Math.round(visual.height)}
        </dd>
        <dt>Keyboard</dt>
        <dd>{visual.keyboardInset}px</dd>
        <dt>Scrolling</dt>
        <dd>{direction}</dd>
        <dt>At</dt>
        <dd>{atTop ? 'top' : edge}</dd>
      </dl>
    </Component>
  );
};

/** `ProviderPartFrame` in its provider, tracking the screen's content. */
const ProviderPart: FunctionComponent = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [external] = useProvidedState('viewport-parts-provider');
  const [control, props, state] = usePropControl(
    propOptionsProvider,
    'Viewport.Provider',
    external,
    true,
  );

  return (
    <Viewport.Provider
      scroller={contentRef}
      {...props}
    >
      <ProviderPartFrame
        contentRef={contentRef}
        control={control}
        state={state}
      />
    </Viewport.Provider>
  );
};

/** `Viewport.Content`, outlined, with its props. */
const ContentPart: FunctionComponent = () => {
  const id = 'viewport-parts-content';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsContent,
    'Viewport.Content',
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
      state={[state]}
      title="Viewport.Content"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content {...props}>
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
      </div>
    </Component>
  );
};

/** `Viewport.Anchor`, outlined, at an edge, with its props. */
const AnchorPart: FunctionComponent = () => {
  const id = 'viewport-parts-anchor';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsAnchor,
    'Viewport.Anchor',
    external,
    true,
    true,
  );
  const side = props.edge === 'inline-start' || props.edge === 'inline-end';

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Viewport.Anchor"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content>
          <List.Root className="viewport-demo-list">
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.Anchor {...props}>
          <div
            className="viewport-demo-sample"
            data-side={side ? '' : undefined}
          >
            {props.edge}
          </div>
        </Viewport.Anchor>
      </div>
    </Component>
  );
};

/** `Viewport.BlockStart`, outlined, with its props. */
const BlockStartPart: FunctionComponent = () => {
  const id = 'viewport-parts-block-start';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsBlockStart,
    'Viewport.BlockStart',
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
      state={[state]}
      title="Viewport.BlockStart"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content>
          <List.Root className="viewport-demo-list">
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.BlockStart {...props}>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
      </div>
    </Component>
  );
};

/** `Viewport.BlockEnd`, outlined, with its props. */
const BlockEndPart: FunctionComponent = () => {
  const id = 'viewport-parts-block-end';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsBlockEnd,
    'Viewport.BlockEnd',
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
      state={[state]}
      title="Viewport.BlockEnd"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content>
          <List.Root className="viewport-demo-list">
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.BlockEnd {...props}>
          <Toolbar.Root>
            <Toolbar.Title>
              <span>{names.length} Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </div>
    </Component>
  );
};

/** `useVisualViewport`'s readout (inside a provider, see below). */
const UseVisualViewportView: FunctionComponent = () => {
  const visual = useVisualViewport();

  return (
    <Component
      center
      inline
      id="viewport-parts-use-visual-viewport"
      title="useVisualViewport"
    >
      <dl className="viewport-demo-metrics">
        <dt>width × height</dt>
        <dd>
          {Math.round(visual.width)} × {Math.round(visual.height)}
        </dd>
        <dt>left, top</dt>
        <dd>
          {Math.round(visual.left)}, {Math.round(visual.top)}
        </dd>
        <dt>keyboardInset</dt>
        <dd>{visual.keyboardInset}</dd>
      </dl>
    </Component>
  );
};

/** `UseVisualViewportView`, in its provider. */
const UseVisualViewportPart: FunctionComponent = () => (
  <Viewport.Provider>
    <UseVisualViewportView />
  </Viewport.Provider>
);

/**
 * `useViewportScroll`, logging the screen's content's scrolling (its turns
 * and edges; inside a provider tracking it, see below).
 */
const UseViewportScrollView: FunctionComponent<{
  addLog: AddLog;
  contentRef: RefObject<HTMLDivElement | null>;
  log: ReactNode;
}> = ({ addLog, contentRef, log }) => {
  const last = useRef('');

  useViewportScroll(({ atBottom, atTop, direction, position }) => {
    const changed = `${String(direction)} ${String(atTop)} ${String(atBottom)}`;
    if (changed === last.current) return;
    last.current = changed;
    addLog(
      `direction: ${String(direction)}, atTop: ${String(atTop)}, atBottom: ${String(atBottom)}, position: ${String(Math.round(position))}`,
    );
  });

  return (
    <Component
      center
      inline
      id="viewport-parts-use-viewport-scroll"
      log={log}
      title="useViewportScroll"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content ref={contentRef}>
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
      </div>
    </Component>
  );
};

/** `UseViewportScrollView`, in a provider tracking its screen's content. */
const UseViewportScrollPart: FunctionComponent = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [log, addLog] = useLog();

  return (
    <Viewport.Provider scroller={contentRef}>
      <UseViewportScrollView
        addLog={addLog}
        contentRef={contentRef}
        log={log}
      />
    </Viewport.Provider>
  );
};

/** `useScrollDirection`'s readout (inside a provider, see below). */
const UseScrollDirectionView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
}> = ({ contentRef }) => {
  const { atBottom, atTop, direction = 'undefined' } = useScrollDirection();

  return (
    <Component
      center
      inline
      id="viewport-parts-use-scroll-direction"
      title="useScrollDirection"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content ref={contentRef}>
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
      </div>
      <dl className="viewport-demo-metrics">
        <dt>direction</dt>
        <dd>{direction}</dd>
        <dt>atTop</dt>
        <dd>{String(atTop)}</dd>
        <dt>atBottom</dt>
        <dd>{String(atBottom)}</dd>
      </dl>
    </Component>
  );
};

/** `UseScrollDirectionView`, in a provider tracking its screen's content. */
const UseScrollDirectionPart: FunctionComponent = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Viewport.Provider scroller={contentRef}>
      <UseScrollDirectionView contentRef={contentRef} />
    </Viewport.Provider>
  );
};

/** A length, rounded (or none yet). */
const px = (value?: number) =>
  value === undefined ? '—' : `${String(Math.round(value))}px`;

/** A share, as a percentage (or none yet). */
const percent = (value?: number) =>
  value === undefined ? '—' : `${String(Math.round(value * 100))}%`;

/**
 * `useElementVisibility`: a card in a box scrolling both ways, colored
 * while visible (by its options: the box, or the window).
 */
const UseElementVisibilityPart: FunctionComponent = () => {
  const id = 'viewport-parts-use-element-visibility';
  const [log, addLog] = useLog();
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [external] = useProvidedState(id);
  const [control, options, state] = usePropControl(
    propOptionsElementVisibility,
    'options',
    external,
    true,
  );
  const visible = useElementVisibility(card, {
    rootMargin: options.rootMargin,
    scroller: options.scroller === 'box' ? box : undefined,
    threshold: options.threshold,
  });

  useEffect(() => addLog(`visible: ${String(visible)}`), [addLog, visible]);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="useElementVisibility"
    >
      <div
        ref={box}
        className="viewport-demo-box"
      >
        <div className="viewport-demo-area">
          <div
            ref={card}
            className="viewport-demo-card viewport-demo-card-start"
            data-visible={visible ? '' : undefined}
          >
            {visible ? 'Visible' : 'Hidden'}
          </div>
        </div>
      </div>
    </Component>
  );
};

/**
 * `useElementGeometry`: a card in a box scrolling both ways, its distances
 * to the visible area's edges and how much of it shows.
 */
const UseElementGeometryPart: FunctionComponent = () => {
  const id = 'viewport-parts-use-element-geometry';
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [external] = useProvidedState(id);
  const [control, options, state] = usePropControl(
    propOptionsElementGeometry,
    'options',
    external,
    true,
  );
  const geometry = useElementGeometry(card, {
    scroller: options.scroller === 'box' ? box : undefined,
  });

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="useElementGeometry"
    >
      <div
        ref={box}
        className="viewport-demo-box"
      >
        <div className="viewport-demo-area">
          <div
            ref={card}
            className="viewport-demo-card"
            style={{ opacity: 0.25 + 0.75 * (geometry?.visibleRatio ?? 0) }}
          >
            {percent(geometry?.visibleRatio)}
          </div>
        </div>
      </div>
      <dl className="viewport-demo-metrics">
        <dt>top, bottom</dt>
        <dd>
          {px(geometry?.top)}, {px(geometry?.bottom)}
        </dd>
        <dt>left, right</dt>
        <dd>
          {px(geometry?.left)}, {px(geometry?.right)}
        </dd>
        <dt>visible width × height</dt>
        <dd>
          {px(geometry?.visibleWidth)} × {px(geometry?.visibleHeight)}
        </dd>
        <dt>visible width, height ratio</dt>
        <dd>
          {percent(geometry?.visibleWidthRatio)},{' '}
          {percent(geometry?.visibleHeightRatio)}
        </dd>
        <dt>visibleRatio</dt>
        <dd>{percent(geometry?.visibleRatio)}</dd>
      </dl>
    </Component>
  );
};

/** `/viewport/parts`: the provider, the layers, and the hooks. */
export const ViewportParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Provider: tracks the visual viewport and scrolling, for the layers and
        the hooks; around the app.
      </li>
      <li>Content: the content layer, scrolling.</li>
      <li>
        Anchors: bars floating at an edge (<code>BlockStart</code>,{' '}
        <code>BlockEnd</code>: the top and the bottom).
      </li>
      <li>
        Hooks: what the provider tracks, inside it; and an element’s visibility
        and geometry, anywhere.
      </li>
      <li>
        The views’ phone screens contain the fixed layers (a{' '}
        <code>transform</code>); in an app, they’re the window’s.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="Viewport.Provider" /> (around the app)
        <ul>
          <li>
            <PartLink part="Viewport.Content" />
          </li>
          <li>
            <PartLink part="Viewport.Anchor" /> (one per edge, optional), or:
            <ul>
              <li>
                <PartLink part="Viewport.BlockStart" />
              </li>
              <li>
                <PartLink part="Viewport.BlockEnd" />
              </li>
            </ul>
          </li>
          <li>
            Hooks (anywhere inside):
            <ul>
              <li>
                <PartLink part="useVisualViewport" />
              </li>
              <li>
                <PartLink part="useViewportScroll" />
              </li>
              <li>
                <PartLink part="useScrollDirection" />
              </li>
            </ul>
          </li>
          <li>
            Hooks (anywhere, no provider needed):
            <ul>
              <li>
                <PartLink part="useElementVisibility" />
              </li>
              <li>
                <PartLink part="useElementGeometry" />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="viewport-provider"
      level={2}
    >
      <code>Viewport.Provider</code>
    </Heading>
    <ul>
      <li>Renders no element: a context, around the app.</li>
      <li>
        Tracks the visual viewport (as custom properties on the root element,
        which the layers follow, and for <code>useVisualViewport</code>).
      </li>
      <li>
        Tracks a scroll container’s scrolling (the document’s, or{' '}
        <code>scroller</code>), for <code>useViewportScroll</code> and{' '}
        <code>useScrollDirection</code>; its direction changes past{' '}
        <code>threshold</code>.
      </li>
      <li>Here: tracking the screen’s content layer, the readout below it.</li>
    </ul>
    <ProviderPart />
    <h3>Props</h3>
    <PropsTable rows={viewportProviderRows} />

    <Heading
      id="viewport-content"
      level={2}
    >
      <code>Viewport.Content</code>
    </Heading>
    <ul>
      <li>
        The content layer: filling the viewport, scrolling its content, beneath
        the anchors.
      </li>
      <li>
        With the keyboard: resized to what’s above it (<code>keyboard</code>{' '}
        <code>resize</code>), or overlaid.
      </li>
      <li>
        Keeps the safe area insets clear (<code>safeArea</code>), as padding.
      </li>
      <li>
        Renders a <code>div</code>; its ref is what a provider’s{' '}
        <code>scroller</code> tracks.
      </li>
    </ul>
    <ContentPart />
    <h3>Props</h3>
    <PropsTable rows={viewportContentRows} />

    <Heading
      id="viewport-anchor"
      level={2}
    >
      <code>Viewport.Anchor</code>
    </Heading>
    <ul>
      <li>
        Floats above the content layer at an <code>edge</code>: the top or
        bottom (a bar, across), the leading or trailing side (a sidebar, from
        the top to the keyboard).
      </li>
      <li>
        At the bottom, pushed up by the keyboard (<code>keyboard</code>{' '}
        <code>push</code>) or covered by it.
      </li>
      <li>
        Keeps the safe area insets clear (<code>safeArea</code>), as padding;
        doesn’t inset the content.
      </li>
      <li>
        Renders a <code>div</code> (<code>z-index</code> 10).
      </li>
    </ul>
    <AnchorPart />
    <h3>Props</h3>
    <PropsTable rows={viewportAnchorRows} />

    <Heading
      id="viewport-blockstart"
      level={2}
    >
      <code>Viewport.BlockStart</code>
    </Heading>
    <ul>
      <li>
        An anchor at the top (<code>edge</code> <code>block-start</code>), e.g.
        a toolbar.
      </li>
    </ul>
    <BlockStartPart />
    <h3>Props</h3>
    <PropsTable rows={viewportBlockStartRows} />

    <Heading
      id="viewport-blockend"
      level={2}
    >
      <code>Viewport.BlockEnd</code>
    </Heading>
    <ul>
      <li>
        An anchor at the bottom (<code>edge</code> <code>block-end</code>), e.g.
        a tab bar, a toolbar, a message field.
      </li>
      <li>Pushed up by the keyboard by default.</li>
    </ul>
    <BlockEndPart />
    <h3>Props</h3>
    <PropsTable rows={viewportBlockEndRows} />

    <Heading
      id="usevisualviewport"
      level={2}
    >
      <code>useVisualViewport</code>
    </Heading>
    <ul>
      <li>
        The visual viewport: its size, its offset, the keyboard’s height;
        re-rendering as they change.
      </li>
      <li>
        Inside a provider (outside one: read once, not updated). Resize the
        window to see it change.
      </li>
    </ul>
    <UseVisualViewportPart />
    <h3>Returns</h3>
    <PropsTable rows={useVisualViewportRows} />

    <Heading
      id="useviewportscroll"
      level={2}
    >
      <code>useViewportScroll</code>
    </Heading>
    <ul>
      <li>
        Calls its listener on every scroll of the tracked scroll container,
        without re-rendering.
      </li>
      <li>
        Inside a provider (outside one: never called). Here: logging the
        screen’s content’s turns and edges.
      </li>
    </ul>
    <UseViewportScrollPart />
    <h3>Arguments</h3>
    <PropsTable rows={useViewportScrollRows} />
    <h3>The listener’s event</h3>
    <PropsTable rows={viewportScrollEventRows} />

    <Heading
      id="usescrolldirection"
      level={2}
    >
      <code>useScrollDirection</code>
    </Heading>
    <ul>
      <li>
        The direction scrolled in and the edges; re-rendering as they change
        (not with every scroll).
      </li>
      <li>
        Inside a provider (outside one: at the top, no direction, unchanging).
      </li>
    </ul>
    <UseScrollDirectionPart />
    <h3>Returns</h3>
    <PropsTable rows={useScrollDirectionRows} />

    <Heading
      id="useelementvisibility"
      level={2}
    >
      <code>useElementVisibility</code>
    </Heading>
    <ul>
      <li>
        Whether an element is in the visible area (an{' '}
        <code>IntersectionObserver</code>): the viewport, or a scroll container
        (<code>scroller</code>); re-rendering only as it changes.
      </li>
      <li>
        <code>threshold</code>: how much of it must show;{' '}
        <code>rootMargin</code>: the area grown or shrunk (e.g. to mount what’s
        about to scroll in).
      </li>
      <li>
        Here: the card starts visible in the box. Scroll the box to hide it;
        with the viewport as the area (<code>scroller</code> unset), also scroll
        the page until the box leaves the window (with the box as the area, the
        page’s scrolling doesn’t matter). Colored while visible, each change
        logged.
      </li>
      <li>
        Clipped by the scroll containers around it, in either area (as an{' '}
        <code>IntersectionObserver</code>).
      </li>
    </ul>
    <UseElementVisibilityPart />
    <h3>Arguments</h3>
    <PropsTable rows={useElementVisibilityRows} />
    <h3>Returns</h3>
    <PropsTable rows={useElementVisibilityReturnRows} />

    <Heading
      id="useelementgeometry"
      level={2}
    >
      <code>useElementGeometry</code>
    </Heading>
    <ul>
      <li>
        Where an element is in the visible area: its edges’ distances to the
        area’s, how much of it shows (px, and its share).
      </li>
      <li>
        Measured once a frame while anything scrolls or resizes, and only while
        it’s visible (an <code>useElementVisibility</code> of its own); once
        more as it leaves.
      </li>
      <li>
        Here: scroll the box both ways, half the card out of it; the card as
        opaque as it’s visible.
      </li>
    </ul>
    <UseElementGeometryPart />
    <h3>Arguments</h3>
    <PropsTable rows={useElementGeometryRows} />
    <h3>Returns</h3>
    <PropsTable rows={elementGeometryRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const viewportPartsDemos = [
  ProviderPart,
  ContentPart,
  AnchorPart,
  BlockStartPart,
  BlockEndPart,
  UseVisualViewportPart,
  UseViewportScrollPart,
  UseScrollDirectionPart,
  UseElementVisibilityPart,
  UseElementGeometryPart,
];
