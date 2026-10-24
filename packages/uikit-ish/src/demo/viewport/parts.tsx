import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  type ElementGeometry,
  List,
  Toolbar,
  useElementGeometry,
  useElementVisibility,
  useFocusShiftPrevention,
  useInputZoomPrevention,
  useScrollDirection,
  useSizeClass,
  useViewportScroll,
  useVisualViewport,
  Viewport,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { AddLog, useLog } from '../frame/log.js';
import { MappedProp, usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from './content.js';
import {
  elementGeometryRows,
  preventFocusShiftReturnRows,
  preventFocusShiftRows,
  preventInputZoomRows,
  useElementGeometryRows,
  useElementVisibilityReturnRows,
  useElementVisibilityRows,
  useFocusShiftPreventionRows,
  useInputZoomPreventionRows,
  useScrollDirectionRows,
  useSizeClassReturnRows,
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
  propOptionsFocusShift,
  propOptionsInputZoom,
  propOptionsProvider,
} from './props.js';

const preventInputZoomCode = `// At the app's start: all its fields, while it runs.
const release = preventInputZoom();`;

const preventFocusShiftCode = `// The app's fields (in its root), until it's torn down.
const remove = preventFocusShift(document.getElementById('app'));`;

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
      <div className="demo-phone">
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
  const contentRef = useLabelledRef<HTMLDivElement>('contentRef');
  const [external] = useProvidedState('viewport-parts-provider');
  const [control, props, state] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsProvider,
        // The screen's content, or (unset) the document's.
        scroller: [
          new MappedProp(contentRef, '[the screen’s content]'),
          undefined,
        ] as const,
      }),
      [contentRef],
    ),
    { external, title: 'Viewport.Provider' },
  );

  return (
    <Viewport.Provider {...props}>
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
  const [control, props, state] = usePropControl(propOptionsContent, {
    external,
    open: true,
    outlined: true,
    title: 'Viewport.Content',
  });

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Viewport.Content"
    >
      <div className="demo-phone">
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
  const [control, props, state] = usePropControl(propOptionsAnchor, {
    external,
    open: true,
    outlined: true,
    title: 'Viewport.Anchor',
  });
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
      <div className="demo-phone">
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
        {/* The anchor is the surface: its background to the screen's edge,
            its content clear of the insets (its padding). */}
        <Viewport.Anchor
          {...props}
          className={props.className ?? 'viewport-demo-surface'}
        >
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
  const [control, props, state] = usePropControl(propOptionsBlockStart, {
    external,
    open: true,
    outlined: true,
    title: 'Viewport.BlockStart',
  });

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Viewport.BlockStart"
    >
      <div className="demo-phone">
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
  const [control, props, state] = usePropControl(propOptionsBlockEnd, {
    external,
    open: true,
    outlined: true,
    title: 'Viewport.BlockEnd',
  });

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Viewport.BlockEnd"
    >
      <div className="demo-phone">
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
  const calls = useRef(0);

  // (Every call logged: once per scroll event.)
  useViewportScroll(({ atBottom, atTop, direction, position }) => {
    calls.current += 1;
    addLog(
      `scroll #${String(calls.current)}: direction: ${String(direction)}, atTop: ${String(atTop)}, atBottom: ${String(atBottom)}, position: ${String(Math.round(position))}`,
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
      <div className="demo-phone">
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
  const contentRef = useLabelledRef<HTMLDivElement>('contentRef');
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
      <div className="demo-phone">
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
  const contentRef = useLabelledRef<HTMLDivElement>('contentRef');

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
    { external, title: 'options' },
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
  const [log, addLog] = useLog();
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [external] = useProvidedState(id);
  const [control, options, state] = usePropControl(propOptionsElementGeometry, {
    external,
    title: 'options',
  });
  const [geometry, setGeometry] = useState<ElementGeometry>();
  const calls = useRef(0);
  useElementGeometry(
    card,
    (next: ElementGeometry) => {
      calls.current += 1;
      addLog(
        `geometry #${String(calls.current)}: top ${px(next.top)}, visible ${percent(next.visibleRatio)}`,
      );
      setGeometry(next);
    },
    { scroller: options.scroller === 'box' ? box : undefined },
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
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

/** The fields of the input guards' views: small fonts, a list, a text area. */
const GuardFields: FunctionComponent = () => (
  <>
    <input
      aria-label="12px"
      className="viewport-demo-field"
      placeholder="12px"
      style={{ fontSize: 12 }}
    />
    <input
      aria-label="15px"
      className="viewport-demo-field"
      placeholder="15px"
      style={{ fontSize: 15 }}
    />
    <input
      aria-label="17px"
      className="viewport-demo-field"
      placeholder="17px"
      style={{ fontSize: 17 }}
    />
    <input
      aria-label="Suggestions, 12px"
      className="viewport-demo-field"
      list="viewport-demo-suggestions"
      placeholder="Suggestions, 12px"
      style={{ fontSize: 12 }}
    />
    <datalist id="viewport-demo-suggestions">
      <option value="Cupertino" />
      <option value="San Francisco" />
      <option value="Zurich" />
    </datalist>
    <textarea
      aria-label="Text area, 12px"
      className="viewport-demo-field"
      placeholder="Text area, 12px"
      style={{ fontSize: 12 }}
    />
  </>
);

/** Logs, once the keyboard is up, the page's zoom and scroll as a field is focused. */
const logGuarded = (addLog: AddLog) => (event: FocusEvent) => {
  const field = event.target;
  if (!(field instanceof HTMLElement)) return;
  setTimeout(() => {
    const { visualViewport: visual } = globalThis;
    const scale = visual ? visual.scale : 1;
    const offsetTop = visual ? visual.offsetTop : 0;
    addLog(
      `${field.getAttribute('aria-label') ?? ''}: zoom ${scale.toFixed(2)}, page scrolled ${String(Math.round(scrollY))}px, visual viewport ${String(Math.round(offsetTop))}px down`,
    );
  }, 800);
};

/**
 * `useInputZoomPrevention`: fields with small fonts (iOS zooms in on them,
 * unguarded), their zoom logged as they're focused.
 */
const UseInputZoomPreventionPart: FunctionComponent = () => {
  const id = 'viewport-parts-use-input-zoom-prevention';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, args, state] = usePropControl(propOptionsInputZoom, {
    external,
    title: 'arguments',
  });
  useInputZoomPrevention(args.enabled);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="useInputZoomPrevention"
    >
      <div
        className="viewport-demo-fields"
        onFocusCapture={logGuarded(addLog)}
      >
        <GuardFields />
      </div>
    </Component>
  );
};

/**
 * `useFocusShiftPrevention`: fields down to the bottom (iOS scrolls the
 * page up to them as the keyboard opens, unguarded), the scroll logged.
 */
const UseFocusShiftPreventionPart: FunctionComponent = () => {
  const id = 'viewport-parts-use-focus-shift-prevention';
  const [log, addLog] = useLog();
  const frame = useRef<HTMLDivElement>(null);
  const [external] = useProvidedState(id);
  const [control, args, state] = usePropControl(propOptionsFocusShift, {
    external,
    title: 'arguments',
  });
  useFocusShiftPrevention(
    args.target === 'frame' ? frame : undefined,
    args.enabled,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="useFocusShiftPrevention"
    >
      <div
        ref={frame}
        className="viewport-demo-fields viewport-demo-fields-tall"
        onFocusCapture={logGuarded(addLog)}
      >
        <GuardFields />
      </div>
    </Component>
  );
};

/** `useSizeClass`: the window's size class, logged as it changes. */
const UseSizeClassPart: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();

  useEffect(() => addLog(`size class: ${sizeClass}`), [addLog, sizeClass]);

  return (
    <Component
      center
      inline
      id="viewport-parts-use-size-class"
      log={log}
      title="useSizeClass"
    >
      <output className="viewport-demo-size-class">{sizeClass}</output>
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
        Anchors: bars floating at an edge (
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        >
          BlockStart
        </PartLink>
        ,{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        >
          BlockEnd
        </PartLink>
        : the top and the bottom).
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
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        (around the app)
        <ul>
          <li>
            <PartLink
              component="viewport"
              part="Viewport.Content"
            />
          </li>
          <li>
            <PartLink
              component="viewport"
              part="Viewport.Anchor"
            />{' '}
            (one per edge, optional), or:
            <ul>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.BlockStart"
                />
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.BlockEnd"
                />
              </li>
            </ul>
          </li>
          <li>
            Hooks (anywhere inside):
            <ul>
              <li>
                <PartLink
                  component="viewport"
                  part="useVisualViewport"
                />
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="useViewportScroll"
                />
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="useScrollDirection"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        Hooks (anywhere, no provider needed):
        <ul>
          <li>
            <PartLink
              component="viewport"
              part="useElementVisibility"
            />
          </li>
          <li>
            <PartLink
              component="viewport"
              part="useElementGeometry"
            />
          </li>
          <li>
            <PartLink
              component="viewport"
              part="useSizeClass"
            />
          </li>
        </ul>
      </li>
      <li>
        Input guards (iOS; anywhere, no provider needed):
        <ul>
          <li>
            <PartLink
              component="viewport"
              part="preventInputZoom"
            />{' '}
            (and{' '}
            <PartLink
              component="viewport"
              part="useInputZoomPrevention"
            />
            )
          </li>
          <li>
            <PartLink
              component="viewport"
              part="preventFocusShift"
            />{' '}
            (and{' '}
            <PartLink
              component="viewport"
              part="useFocusShiftPrevention"
            />
            )
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
        which the layers follow, and for{' '}
        <PartLink
          component="viewport"
          part="useVisualViewport"
        />
        ).
      </li>
      <li>
        Tracks a scroll container’s scrolling (the document’s, or{' '}
        <code>scroller</code>), for{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />{' '}
        and{' '}
        <PartLink
          component="viewport"
          part="useScrollDirection"
        />
        ; its direction changes past <code>threshold</code>.
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
        The anchor is the surface: it has no background of its own, so a bar
        with one (a background, a separator) styles the anchor itself (its{' '}
        <code>className</code>, the app’s class), reaching the screen’s edge
        behind the home indicator, its content clear of it. Space the content
        inside it (its own padding or margin), not by the anchor’s padding
        (that’s the insets’). Here: <code>viewport-demo-surface</code>.
      </li>
      <li>
        A surface inside the anchor instead ends at the insets: a gap below a
        bottom bar. Glass bars (a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />
        , a{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.List"
        />
        ) need none: the content shows through to the edge.
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
        Inside a provider (outside one: never called). Here: each call logged
        (one per scroll event), with the content’s direction and edges.
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
        Calls its listener with where an element is in the visible area: its
        edges’ distances to the area’s, how much of it shows (px, and its
        share). Nothing re-renders unless the listener does (as{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ’s).
      </li>
      <li>
        Measured once a frame while anything scrolls or resizes, and only while
        it’s visible (an{' '}
        <PartLink
          component="viewport"
          part="useElementVisibility"
        />{' '}
        of its own); once more as it leaves.
      </li>
      <li>
        Here: scroll the box both ways, half the card out of it; the card as
        opaque as it’s visible (its listener setting state), each call logged
        (one per frame scrolled).
      </li>
    </ul>
    <UseElementGeometryPart />
    <h3>Arguments</h3>
    <PropsTable rows={useElementGeometryRows} />
    <h3>Its listener’s geometry</h3>
    <PropsTable rows={elementGeometryRows} />

    <Heading
      id="usesizeclass"
      level={2}
    >
      <code>useSizeClass</code>
    </Heading>
    <ul>
      <li>
        The window’s horizontal size class (UIKit’s): <code>regular</code> from
        768px, <code>compact</code> below; re-rendering as it changes.
      </li>
      <li>
        For presentations by size: e.g. a sheet on <code>compact</code> (a
        phone), a popover on <code>regular</code> (an iPad), as{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        decides <code>compact</code> by it.
      </li>
      <li>No provider needed.</li>
    </ul>
    <UseSizeClassPart />
    <h3>Returns</h3>
    <PropsTable rows={useSizeClassReturnRows} />

    <Heading
      id="preventinputzoom"
      level={2}
    >
      <code>preventInputZoom</code>
    </Heading>
    <ul>
      <li>
        iOS zooms the page in as a text field with a font smaller than 16px is
        focused: guarded, it doesn’t (the viewport’s <code>maximum-scale</code>{' '}
        1, while held; iOS still lets the page be pinch-zoomed).
      </li>
      <li>
        Held until its returned function lets go (by all its holders: the
        viewport restored with the last). Elsewhere (no iOS), it does nothing (a{' '}
        <code>maximum-scale</code> would stop pinch zoom there).
      </li>
      <li>
        Once for the app (e.g. at its start), it covers all its fields: also
        those it doesn’t render itself (here, the demos’ own controls).
      </li>
    </ul>
    <CodeView code={preventInputZoomCode} />
    <h3>Returns</h3>
    <PropsTable rows={preventInputZoomRows} />

    <Heading
      id="useinputzoomprevention"
      level={2}
    >
      <code>useInputZoomPrevention</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="viewport"
          part="preventInputZoom"
        />
        , held while the component is mounted (and <code>enabled</code>).
      </li>
      <li>
        Here: fields of 12, 15 and 17px, one with suggestions (a{' '}
        <code>datalist</code>), a text area; each focus logs the page’s zoom.
        Every demo’s prop controls hold it too (while mounted, as their own
        fields’ guard), so on this site the zoom stays off either way.
      </li>
    </ul>
    <UseInputZoomPreventionPart />
    <h3>Arguments</h3>
    <PropsTable rows={useInputZoomPreventionRows} />

    <Heading
      id="preventfocusshift"
      level={2}
    >
      <code>preventFocusShift</code>
    </Heading>
    <ul>
      <li>
        iOS scrolls the page (its layout viewport) to a text field it focuses,
        to keep it clear of the keyboard, shifting a fixed layout (e.g. a{' '}
        <a href="viewport">Viewport</a>’s bars). Guarded, a field touched in its
        target is focused without scrolling (as the touch ends).
      </li>
      <li>
        The touch’s click doesn’t follow, and the caret goes where the field
        puts it (not where it was touched). Elsewhere, it does nothing.
      </li>
      <li>Until its returned function removes it.</li>
    </ul>
    <CodeView code={preventFocusShiftCode} />
    <h3>Arguments</h3>
    <PropsTable rows={preventFocusShiftRows} />
    <h3>Returns</h3>
    <PropsTable rows={preventFocusShiftReturnRows} />

    <Heading
      id="usefocusshiftprevention"
      level={2}
    >
      <code>useFocusShiftPrevention</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="viewport"
          part="preventFocusShift"
        />{' '}
        in its <code>target</code> (or the document), while the component is
        mounted (and <code>enabled</code>).
      </li>
      <li>
        Here: the fields, down to the frame’s bottom; each focus logs how far
        the page (and the visual viewport) scrolled. The only holder on this
        page (other demos with fields hold their own).
      </li>
    </ul>
    <UseFocusShiftPreventionPart />
    <h3>Arguments</h3>
    <PropsTable rows={useFocusShiftPreventionRows} />
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
  UseSizeClassPart,
  UseInputZoomPreventionPart,
  UseFocusShiftPreventionPart,
];
