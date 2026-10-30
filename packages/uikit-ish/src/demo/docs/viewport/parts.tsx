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
  ActivityIndicator,
  type ElementGeometry,
  List,
  Toolbar,
  useAnchorSize,
  useElementGeometry,
  useElementVisibility,
  useFocusShiftPrevention,
  useInputZoomPrevention,
  useScrollDirection,
  useSizeClass,
  useTextActionsPrevention,
  useViewportEdgeElement,
  useViewportScroll,
  useVisualViewport,
  Viewport,
  type ViewportAnchorHandle,
  type ViewportScrollEvent,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  MappedProp,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { names } from './content.js';
import {
  elementGeometryRows,
  preventFocusShiftReturnRows,
  preventFocusShiftRows,
  preventInputZoomRows,
  preventTextActionsReturnRows,
  preventTextActionsRows,
  useAnchorSizeReturnRows,
  useAnchorSizeRows,
  useElementGeometryRows,
  useElementVisibilityReturnRows,
  useElementVisibilityRows,
  useFocusShiftPreventionRows,
  useInputZoomPreventionRows,
  useScrollDirectionArgumentRows,
  useScrollDirectionRows,
  useSizeClassReturnRows,
  useTextActionsPreventionRows,
  useViewportEdgeElementRows,
  useViewportScrollRows,
  useVisualViewportRows,
  viewportAnchorRows,
  viewportBlockEndRows,
  viewportBlockStartRows,
  viewportContentRows,
  viewportOverscrollRows,
  viewportPaddingRows,
  viewportProviderRows,
  viewportScrollEventRows,
} from './docs.js';
import {
  barAnchor,
  propOptionsAnchor,
  propOptionsBlockEnd,
  propOptionsBlockStart,
  propOptionsContent,
  propOptionsElementGeometry,
  propOptionsElementVisibility,
  propOptionsFocusShift,
  propOptionsHandlePadding,
  propOptionsInputZoom,
  propOptionsOverscroll,
  propOptionsPaddingContent,
  propOptionsPaddingEnd,
  propOptionsPaddingStart,
  propOptionsProvider,
  propOptionsScrollOptions,
  propOptionsTextActions,
  toastAnchor,
} from './props.js';

const preventInputZoomCode = `// At the app's start: all its fields, while it runs.
const release = preventInputZoom();`;

const preventFocusShiftCode = `// The app's fields (in its root), until it's torn down.
const remove = preventFocusShift(document.getElementById('app'));`;

const preventTextActionsCode = `// A menu's trigger opened by a held press, until it's gone.
const restore = preventTextActions(document.getElementById('back'));`;

/**
 * `Viewport.Provider` (its props controlled around it, see `ProviderPart`):
 * a screen's content layer, what the hooks return below it.
 */
const ProviderPartFrame: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
  control: ReactNode;
  screenRef: RefObject<HTMLDivElement | null>;
  state: object;
}> = ({ contentRef, control, screenRef, state }) => {
  const id = 'viewport-parts-provider';
  const visual = useVisualViewport();
  const { atBottom, atTop, direction = '–' } = useScrollDirection();
  const edge = atBottom ? 'bottom' : '–';

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      screenRef={screenRef}
      stage="phone"
      state={[state]}
      title="Viewport.Provider"
      diagnostics={
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
      }
    >
      <Viewport.Content ref={contentRef}>
        <Viewport.Padding edge="block-start" />
        <List.Root>
          <List.Section>
            <List.Group>
              {names.map((name) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
    </Component>
  );
};

/** `ProviderPartFrame` in its provider, tracking the screen's content. */
const ProviderPart: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );
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
  // (Around the demo, outside its screen: unset, given the screen, as a
  // provider within it would be, see `propOptionsProvider`.)
  const screenRef = useRef<HTMLDivElement>(null);

  return (
    <Viewport.Provider
      {...props}
      screen={props.screen === null ? null : screenRef}
    >
      <ProviderPartFrame
        contentRef={contentRef}
        control={control}
        screenRef={screenRef}
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
    isOpen: true,
    emphasize: 'outline',
    title: 'Viewport.Content',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      stage="phone"
      state={[state]}
      title="Viewport.Content"
    >
      <Viewport.Content {...props}>
        <Viewport.Padding edge="block-start" />
        <List.Root>
          <List.Section>
            <List.Group>
              {names.map((name) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
    </Component>
  );
};

/** `Viewport.Anchor`, outlined, at an edge, with its props. */
const AnchorPart: FunctionComponent = () => {
  const id = 'viewport-parts-anchor';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsAnchor, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Viewport.Anchor',
  });
  const isInlineEdge =
    props.edge === 'inline-start' || props.edge === 'inline-end';

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      stage="phone"
      state={[state]}
      title="Viewport.Anchor"
    >
      <>
        <Viewport.Content>
          {/* Room for it at either end (the margin alone at the other). */}
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        {/* The anchor is the surface: its background to the screen's edge,
            its content clear of the insets (its padding). */}
        <Viewport.Anchor
          {...props}
          className={props.className ?? 'viewport-demo-surface'}
        >
          <div
            className="viewport-demo-sample"
            data-side={isInlineEdge ? '' : undefined}
          >
            {props.edge}
          </div>
        </Viewport.Anchor>
      </>
    </Component>
  );
};

/** `Viewport.BlockStart`, outlined, with its props. */
const BlockStartPart: FunctionComponent = () => {
  const id = 'viewport-parts-block-start';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsBlockStart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Viewport.BlockStart',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      stage="phone"
      state={[state]}
      title="Viewport.BlockStart"
    >
      <>
        <Viewport.Content>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <Viewport.BlockStart {...props}>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
      </>
    </Component>
  );
};

/** `Viewport.BlockEnd`, outlined, with its props. */
const BlockEndPart: FunctionComponent = () => {
  const id = 'viewport-parts-block-end';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsBlockEnd, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Viewport.BlockEnd',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      stage="phone"
      state={[state]}
      title="Viewport.BlockEnd"
    >
      <>
        <Viewport.Content>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <Viewport.BlockEnd {...props}>
          <Toolbar.Root>
            <Toolbar.Title>
              <span>{names.length} Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </>
    </Component>
  );
};

/** A length, rounded (or none yet). */
const px = (value?: number) =>
  value === undefined ? '—' : `${String(Math.round(value))}px`;

/** A share, as a percentage (or none yet). */
const percent = (value?: number) =>
  value === undefined ? '—' : `${String(Math.round(value * 100))}%`;

/**
 * `Viewport.Padding`, overlaid: room at the content's ends for its bars,
 * the bottom one one row or two (its padding following it, live).
 */
const PaddingPart: FunctionComponent = () => {
  const id = 'viewport-parts-padding';
  const [externalContent, externalStart, externalEnd] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsPaddingContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlStart, propsStart, stateStart] = usePropControl(
    propOptionsPaddingStart,
    {
      emphasize: 'overlay',
      external: externalStart,
      title: 'Viewport.Padding (start)',
    },
  );
  const [controlEnd, propsEnd, stateEnd] = usePropControl(
    propOptionsPaddingEnd,
    {
      emphasize: 'overlay',
      external: externalEnd,
      isOpen: true,
      title: 'Viewport.Padding (end)',
    },
  );

  return (
    <Component
      isInline
      controls={[controlContent, controlStart, controlEnd]}
      id={id}
      stage="phone"
      state={[stateContent, stateStart, stateEnd]}
      title="Viewport.Padding"
    >
      <>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Viewport.Content>
          <Viewport.Padding {...propsStart} />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding {...propsEnd} />
        </Viewport.Content>
        <Viewport.BlockEnd className="viewport-demo-surface">
          {content.rows === 2 ? (
            <Toolbar.Root>
              <Toolbar.Title>
                <span>Updated Just Now</span>
              </Toolbar.Title>
            </Toolbar.Root>
          ) : null}
          <Toolbar.Root>
            <Toolbar.Title>
              <span>{names.length} Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </>
    </Component>
  );
};

/**
 * `Viewport.Overscroll`, outlined: past the content's start (coming out
 * from under the bar) or its end, as it's pulled there; open, kept shown,
 * the padding making room (inside a provider tracking the content, see
 * `OverscrollPart`).
 */
const OverscrollView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
  screenRef: RefObject<HTMLDivElement | null>;
}> = ({ screenRef, contentRef }) => {
  const id = 'viewport-parts-overscroll';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverscroll, {
    emphasize: 'outline',
    external,
    isOpen: true,
    title: 'Viewport.Overscroll',
  });
  const [scroll, setScroll] = useState({ isHeld: false, overscroll: 0 });

  useViewportScroll(({ isHeld, overscroll }) =>
    setScroll({ isHeld, overscroll }),
  );

  return (
    <Component
      containsOverscroll
      isInline
      controls={[control]}
      id={id}
      screenRef={screenRef}
      stage="phone"
      state={[state]}
      title="Viewport.Overscroll"
      diagnostics={
        <dl className="viewport-demo-metrics">
          <dt>overscroll</dt>
          <dd>{px(scroll.overscroll)}</dd>
          <dt>isHeld</dt>
          <dd>{String(scroll.isHeld)}</dd>
        </dl>
      }
    >
      <>
        {/* Beneath the content layer (before it). */}
        <Viewport.Overscroll {...props}>
          <div className="viewport-demo-pull">
            <ActivityIndicator
              className="viewport-demo-pull-spinner"
              display="reset"
            />
          </div>
        </Viewport.Overscroll>
        <Viewport.Content ref={contentRef}>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
      </>
    </Component>
  );
};

/** `OverscrollView`, in a provider tracking its screen's content. */
const OverscrollPart: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );
  const screenRef = useRef<HTMLDivElement>(null);

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <OverscrollView
        contentRef={contentRef}
        screenRef={screenRef}
      />
    </Viewport.Provider>
  );
};

/**
 * The end padding's height, and the anchors it may follow (the handle
 * view's diagnostics, read as in its screen).
 */
const HandleSizes: FunctionComponent<{
  anchor:
    ViewportAnchorHandle | readonly ViewportAnchorHandle[] | null | undefined;
  margin: number | string | undefined;
}> = ({ anchor, margin }) => {
  const bar = useAnchorSize('block-end', barAnchor);
  const toast = useAnchorSize('block-end', toastAnchor);
  const padding = useAnchorSize('block-end', anchor);

  return (
    <dl className="viewport-demo-metrics">
      <dt>barAnchor (toolbar)</dt>
      <dd>{bar}px</dd>
      <dt>toastAnchor (toast)</dt>
      <dd>{toast}px</dd>
      <dt>Padding (end): anchors</dt>
      <dd>{padding}px</dd>
      <dt>Padding (end): + margin</dt>
      <dd>
        {typeof margin === 'number'
          ? `${String(margin)}px`
          : (margin ?? '16px')}
      </dd>
    </dl>
  );
};

/**
 * `Viewport.createAnchorHandle`: the end padding by the toolbar alone (its
 * handle), or by the toolbar and the toast floating above it (both handles;
 * by edge: the same, the tallest at the bottom).
 */
const CreateAnchorHandlePart: FunctionComponent = () => {
  const id = 'viewport-parts-create-anchor-handle';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsHandlePadding, {
    emphasize: 'overlay',
    external,
    isOpen: true,
    title: 'Viewport.Padding (end)',
  });

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      stage="phone"
      state={[state]}
      title="Viewport.createAnchorHandle"
      diagnostics={
        <HandleSizes
          anchor={props.anchor}
          margin={props.margin}
        />
      }
    >
      <>
        <Viewport.Content>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding {...props} />
        </Viewport.Content>
        <Viewport.BlockEnd
          className="viewport-demo-surface"
          handle={barAnchor}
        >
          <Toolbar.Root>
            <Toolbar.Title>
              <span>{names.length} Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockEnd>
        {/* A toast over the content: room made for it only if linked. */}
        <Viewport.BlockEnd
          className="viewport-demo-toast-anchor"
          handle={toastAnchor}
        >
          <div
            className="viewport-demo-toast"
            role="status"
          >
            Contact deleted.
          </div>
        </Viewport.BlockEnd>
      </>
    </Component>
  );
};

/**
 * The anchors' sizes (`useAnchorSize`'s view's diagnostics, read as in its
 * screen).
 */
const AnchorSizes: FunctionComponent = () => {
  const top = useAnchorSize('block-start');
  const bottom = useAnchorSize('block-end');

  return (
    <dl className="viewport-demo-metrics">
      <dt>block-start</dt>
      <dd>{top}px</dd>
      <dt>block-end</dt>
      <dd>{bottom}px</dd>
    </dl>
  );
};

/** `useAnchorSize`: the bars' sizes, in their screen. */
const UseAnchorSizePart: FunctionComponent = () => (
  <Component
    isInline
    diagnostics={<AnchorSizes />}
    id="viewport-parts-use-anchor-size"
    stage="phone"
    title="useAnchorSize"
    setup={`// In the anchors' scope (here: the screen):
const top = useAnchorSize('block-start');
const bottom = useAnchorSize('block-end');`}
  >
    <>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          <Toolbar.Title>
            <span>Contacts</span>
          </Toolbar.Title>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Viewport.Content>
        <Viewport.Padding edge="block-start" />
        <List.Root>
          <List.Section>
            <List.Group>
              {names.map((name) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
      <Viewport.BlockEnd className="viewport-demo-surface">
        <Toolbar.Root>
          <Toolbar.Title>
            <span>{names.length} Contacts</span>
          </Toolbar.Title>
        </Toolbar.Root>
      </Viewport.BlockEnd>
    </>
  </Component>
);

/**
 * `useViewportEdgeElement`'s content (in the anchors' scope): a filter
 * sticking below the bar, the bar's edge effect reaching under it.
 */
const EdgeElementContent: FunctionComponent = () => {
  const filter = useLabelledRef<HTMLDivElement>('filter', 'HTMLDivElement');
  const top = useAnchorSize('block-start');
  useViewportEdgeElement(filter, 'block-start');

  return (
    <>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          <Toolbar.Title>
            <span>Contacts</span>
          </Toolbar.Title>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Viewport.Content>
        <Viewport.Padding edge="block-start" />
        <div
          ref={filter}
          className="viewport-demo-sticky"
          style={{ top }}
        >
          <span className="viewport-demo-filter">Favorites only</span>
        </div>
        <List.Root>
          <List.Section>
            <List.Group>
              {names.map((name) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
    </>
  );
};

/** `useViewportEdgeElement`: a filter sticking below the bar. */
const UseViewportEdgeElementPart: FunctionComponent = () => (
  <Component
    isInline
    id="viewport-parts-use-viewport-edge-element"
    stage="phone"
    title="useViewportEdgeElement"
    setup={`// Sticking below the bar (its height, in the anchors' scope):
const top = useAnchorSize('block-start');
useViewportEdgeElement(filter, 'block-start');`}
  >
    <EdgeElementContent />
  </Component>
);

/** `useVisualViewport`'s readout (inside a provider, see below). */
const UseVisualViewportView: FunctionComponent = () => {
  const visual = useVisualViewport();

  return (
    <Component
      isCentered
      isInline
      id="viewport-parts-use-visual-viewport"
      title="useVisualViewport"
      diagnostics={
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
          <dt>isHidden</dt>
          <dd>{String(visual.isHidden)}</dd>
        </dl>
      }
    ></Component>
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
  screenRef: RefObject<HTMLDivElement | null>;
}> = ({ screenRef, addLog, contentRef, log }) => {
  const id = 'viewport-parts-use-viewport-scroll';
  const calls = useRef(0);
  const [external] = useProvidedState(id);
  const [control, options, state] = usePropControl(propOptionsScrollOptions, {
    external,
    title: 'options',
  });

  const [event, setEvent] = useState<ViewportScrollEvent>();

  // (Every call logged: once per scroll event, or overscrolling input.)
  useViewportScroll((scroll) => {
    const { atBottom, atTop, direction, isHeld, overscroll, position } = scroll;
    setEvent(scroll);
    calls.current += 1;
    addLog(
      `scroll #${String(calls.current)}: direction: ${String(direction)}, atTop: ${String(atTop)}, atBottom: ${String(atBottom)}, position: ${String(Math.round(position))}, overscroll: ${String(Math.round(overscroll))}, isHeld: ${String(isHeld)}`,
    );
  }, options);

  return (
    <Component
      containsOverscroll
      isInline
      controls={[control]}
      id={id}
      log={log}
      screenRef={screenRef}
      stage="phone"
      state={[state]}
      title="useViewportScroll"
      diagnostics={
        <dl className="viewport-demo-metrics">
          <dt>direction</dt>
          <dd>{String(event?.direction)}</dd>
          <dt>atTop</dt>
          <dd>{String(event?.atTop ?? '—')}</dd>
          <dt>atBottom</dt>
          <dd>{String(event?.atBottom ?? '—')}</dd>
          <dt>position</dt>
          <dd>{px(event?.position)}</dd>
          <dt>overscroll</dt>
          <dd>{px(event?.overscroll)}</dd>
          <dt>isHeld</dt>
          <dd>{String(event?.isHeld ?? '—')}</dd>
        </dl>
      }
    >
      <Viewport.Content ref={contentRef}>
        <Viewport.Padding edge="block-start" />
        <List.Root>
          <List.Section>
            <List.Group>
              {names.map((name) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
    </Component>
  );
};

/** `UseViewportScrollView`, in a provider tracking its screen's content. */
const UseViewportScrollPart: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );
  const [log, addLog] = useLog();
  const screenRef = useRef<HTMLDivElement>(null);

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <UseViewportScrollView
        addLog={addLog}
        contentRef={contentRef}
        log={log}
        screenRef={screenRef}
      />
    </Viewport.Provider>
  );
};

/** `useScrollDirection`'s readout (inside a provider, see below). */
const UseScrollDirectionView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
  screenRef: RefObject<HTMLDivElement | null>;
}> = ({ screenRef, contentRef }) => {
  const id = 'viewport-parts-use-scroll-direction';
  const [external] = useProvidedState(id);
  const [control, options, state] = usePropControl(propOptionsScrollOptions, {
    external,
    title: 'options',
  });
  const {
    atBottom,
    atTop,
    direction = 'undefined',
  } = useScrollDirection(options);

  return (
    <Component
      containsOverscroll
      isInline
      controls={[control]}
      id={id}
      screenRef={screenRef}
      stage="phone"
      state={[state]}
      title="useScrollDirection"
      diagnostics={
        <dl className="viewport-demo-metrics">
          <dt>direction</dt>
          <dd>{direction}</dd>
          <dt>atTop</dt>
          <dd>{String(atTop)}</dd>
          <dt>atBottom</dt>
          <dd>{String(atBottom)}</dd>
        </dl>
      }
    >
      <Viewport.Content ref={contentRef}>
        <Viewport.Padding edge="block-start" />
        <List.Root>
          <List.Section>
            <List.Group>
              {names.map((name) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
    </Component>
  );
};

/** `UseScrollDirectionView`, in a provider tracking its screen's content. */
const UseScrollDirectionPart: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );
  const screenRef = useRef<HTMLDivElement>(null);

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <UseScrollDirectionView
        contentRef={contentRef}
        screenRef={screenRef}
      />
    </Viewport.Provider>
  );
};

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
  const isVisible = useElementVisibility(card, {
    rootMargin: options.rootMargin,
    scroller: options.scroller === 'box' ? box : undefined,
    threshold: options.threshold,
  });

  useEffect(() => addLog(`visible: ${String(isVisible)}`), [addLog, isVisible]);

  return (
    <Component
      isCentered
      isInline
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
            data-visible={isVisible ? '' : undefined}
          >
            {isVisible ? 'Visible' : 'Hidden'}
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
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="useElementGeometry"
      diagnostics={
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
      }
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
      <option value="Portland" />
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
      isCentered
      isInline
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
      isCentered
      isInline
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

/**
 * `useTextActionsPrevention`: a message to hold (its text selected, the
 * browser's text menu shown, unless prevented).
 */
const UseTextActionsPreventionPart: FunctionComponent = () => {
  const id = 'viewport-parts-use-text-actions-prevention';
  const message = useLabelledRef<HTMLParagraphElement>(
    'message',
    'HTMLParagraphElement',
  );
  const [external] = useProvidedState(id);
  const [control, args, state] = usePropControl(propOptionsTextActions, {
    external,
    title: 'arguments',
  });
  useTextActionsPrevention(message, args.enabled);

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="useTextActionsPrevention"
    >
      <p
        ref={message}
        className="viewport-demo-message"
      >
        Hold this message: its text isn’t selected while prevented.
      </p>
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
      isCentered
      isInline
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
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        >
          Padding
        </PartLink>
        : a scroll container’s content edge, room for the anchors there (by
        their scope, or by their handles) and the content margin.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        >
          Overscroll
        </PartLink>
        : what shows past the content’s start or end as it’s pulled there (e.g.
        a refresh indicator).
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
            <ul>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.Padding"
                />{' '}
                (at its start and its end: in it, or in a page in it)
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="viewport"
              part="Viewport.Overscroll"
            />{' '}
            (optional, one per end: before the content layer, beneath it)
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
            Anchor handles (optional: an anchor’s <code>handle</code>; one or
            several in a padding’s <code>anchor</code>):
            <ul>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.createAnchorHandle"
                />{' '}
                (at module level), or
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="useCreateViewportAnchorHandle"
                />{' '}
                (in a component)
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
        Anchor sizes (by scope, no provider needed):
        <ul>
          <li>
            <PartLink
              component="viewport"
              part="ViewportScopeContext"
            />{' '}
            (optional: around an element containing fixed layers; set by a{' '}
            <PartLink
              component="layout"
              part="Layout.Column"
            />
            , a sheet’s or drawer’s popup)
            <ul>
              <li>
                <PartLink
                  component="viewport"
                  part="useAnchorSize"
                />{' '}
                (anywhere inside)
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="useViewportEdgeElement"
                />{' '}
                (what sticks to their bars)
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
          <li>
            <PartLink
              component="viewport"
              part="preventTextActions"
            />{' '}
            (and{' '}
            <PartLink
              component="viewport"
              part="useTextActionsPrevention"
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
        Tracks a scroll container’s scrolling (<code>scroller</code>; unset, the
        one filling its screen: a <a href="page">Page</a>, a sheet’s content, a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        , following as pages show and hide; or the document’s), for{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />{' '}
        and{' '}
        <PartLink
          component="viewport"
          part="useScrollDirection"
        />
        : each takes its own <code>threshold</code>.
      </li>
      <li>
        Tracking the window (as do the layers in it, outside a device’s screen):
        marks the root as an app’s (<code>data-uikit-viewport-window</code>),
        its background the app’s beneath the layers. In an iOS Home Screen app,
        also makes the document as tall as the screen (
        <code>data-uikit-viewport-standalone</code>): iOS 26 otherwise gives a
        document no taller than its window a layout viewport short by the status
        bar’s height, painting nothing below it (WebKit bug 301108).
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
        At the top or bottom, its scroll edge effect (<code>edgeEffect</code>,{' '}
        <code>soft</code> by default; <code>hard</code>; <code>none</code>):
        drawn by the scroller beneath (a <a href="page">Page</a>, a sheet’s
        content, the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        ) as content scrolls under it, one per edge however many anchors stack
        there (as tall as the tallest), also under what’s stuck to them (
        <PartLink
          component="viewport"
          part="useViewportEdgeElement"
        />
        ). Tinted (<code>edgeTint</code>), at rest too: see{' '}
        <a href="viewport/composition#a-tinted-edge">a tinted edge</a>.
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
      id="viewport-padding"
      level={2}
    >
      <code>Viewport.Padding</code>
    </Heading>
    <ul>
      <li>
        A scroll container’s content edge, at its start (under a bar) or its end
        (above a tab bar or toolbar): room for the anchors there, so the content
        scrolls out from under them, and the content margin beyond.
      </li>
      <li>
        The content margin: the library’s gap between content and its
        container’s edge, 16px by its tokens (
        <code>--uikit-content-margin-block-start</code>, <code>-end</code>);
        none before a{' '}
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />{' '}
        (it sits right under the bar). <code>margin</code> overrides it per
        padding. Without anchors in its scope (e.g. a sheet’s content, or no
        bar), it’s the margin alone: components never space themselves, the
        padding does.
      </li>
      <li>
        Following no anchors, even with some in its scope:{' '}
        <code>anchor=&#123;null&#125;</code>, the margin alone (e.g. content
        meant to scroll under a bar, still spaced from the edge). Not rendering
        a padding leaves no gap at all.
      </li>
      <li>
        As high as the tallest anchor at its <code>edge</code> in its scope; or,
        linked to anchors by their handles (<code>anchor</code>: one, or
        several), as the tallest of those (see{' '}
        <PartLink
          component="viewport"
          part="Viewport.createAnchorHandle"
        />
        ). Live, as an anchor changes (e.g. a tab bar collapsing; here, the
        bottom bar’s rows).
      </li>
      <li>
        An anchor’s size without the safe area insets it keeps clear: the scroll
        container keeps them clear itself (e.g. a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        ’s padding), so the two add up.
      </li>
      <li>
        Its scope: where the anchors are fixed to, the screen (the window, or a
        frame like these views’), or an element containing fixed layers (a{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        , a sheet’s or drawer’s popup; see{' '}
        <PartLink
          component="viewport"
          part="ViewportScopeContext"
        />
        ).
      </li>
      <li>
        Sets its scroll container’s scroll padding at its edge (
        <code>scroll-padding-block-start</code> or <code>-end</code>): the
        container’s own padding there and its height, so focus moving and{' '}
        <code>scrollIntoView</code> stop clear of the anchors; while mounted.
        Its scroll container is its nearest ancestor scrolling (or the
        document).
      </li>
      <li>
        One per end of a scroll container. Leave it out where nothing should
        make room (e.g. a picture under the bar, or a bar with nothing in it).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <PaddingPart />
    <h3>Props</h3>
    <PropsTable rows={viewportPaddingRows} />

    <Heading
      id="viewport-overscroll"
      level={2}
    >
      <code>Viewport.Overscroll</code>
    </Heading>
    <ul>
      <li>
        What shows past the tracked scroll container’s start (<code>edge</code>{' '}
        <code>block-start</code>) or end (<code>block-end</code>) as it’s pulled
        there: e.g. a refresh indicator, a hint to the next page (see the{' '}
        <a href="viewport/composition#pulling-to-refresh">composition</a>).
      </li>
      <li>
        A layer beneath the content layer (render it before it), from the bars
        at its edge (as a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ’s <code>anchor</code>): coming out from under them, moved along by the
        pull as the content’s end, as if in it.
      </li>
      <li>
        Safari bounces the content past its ends itself: the layer shows through
        the gap. Other browsers don’t: while it’s shown, the tracked scroll
        container is moved along by the pull (as Safari’s; without one shown,
        nothing is). Where the content stays (the document’s), it slides in over
        it, by the pull (
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ’s <code>overscroll</code>, rubber-banded; bouncing back once released).
      </li>
      <li>
        Its pull, as custom properties for its content’s styles:{' '}
        <code>--uikit-viewport-overscroll</code> (px) and{' '}
        <code>--uikit-viewport-overscroll-progress</code> (0 to 1, of its own
        size), e.g. fading in, turning. Acting on release:{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ’s <code>isHeld</code>.
      </li>
      <li>
        <code>open</code>: kept shown at rest (e.g. while refreshing), its
        progress 1; the padding at its edge makes room for it beyond the bars,
        the content settling there (and back once closed).
      </li>
      <li>
        Inside a provider tracking the scroll container (its{' '}
        <code>scroller</code>). Here: pull the list past either end (
        <code>edge</code>), or open it.
      </li>
      <li>
        Renders a <code>div</code> (its area) in a clipping layer.
      </li>
    </ul>
    <OverscrollPart />
    <h3>Props</h3>
    <PropsTable rows={viewportOverscrollRows} />

    <Heading
      id="viewport-createanchorhandle"
      level={2}
    >
      <code>Viewport.createAnchorHandle</code>
    </Heading>
    <ul>
      <li>
        A handle naming an anchor, to link paddings to it: given to the anchor (
        <code>handle</code>) and to the paddings (<code>anchor</code>: one
        handle, or several, the padding as high as the tallest of them). Made
        once, e.g. at a module’s top level.
      </li>
      <li>
        For a padding that should follow some anchors, not all at its edge: e.g.
        a toolbar, not a toast floating above it.
      </li>
      <li>
        Here, the end padding’s <code>anchor</code> (the room it makes for
        anchors in the diagnostics, its 16px margin beyond; the content’s last
        rows, scrolled to the end, show it):
        <ul>
          <li>
            <code>barAnchor</code>: as high as the toolbar. The toast floats
            over the last row, as a toast should (it’s brief).
          </li>
          <li>
            <code>[barAnchor, toastAnchor]</code>: as high as the taller of the
            two, the toast. The last rows stay clear of it too, while it’s
            shown.
          </li>
          <li>
            Unset: the tallest anchor at its <code>edge</code> (
            <code>block-end</code>), the toast too: here the same as both
            linked, but following any anchor added at the bottom.
          </li>
          <li>
            <code>null</code>: none, the margin alone (16px). The last rows
            scroll under the toolbar and the toast, 16px from the screen’s edge.
          </li>
        </ul>
      </li>
    </ul>
    <CreateAnchorHandlePart />

    <Heading
      id="usecreateviewportanchorhandle"
      level={2}
    >
      <code>useCreateViewportAnchorHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.createAnchorHandle"
        />{' '}
        in a component: made once, for its lifetime.
      </li>
    </ul>

    <Heading
      id="useanchorsize"
      level={2}
    >
      <code>useAnchorSize</code>
    </Heading>
    <ul>
      <li>
        The size of the tallest anchor at an edge in its scope (or of the
        tallest of those linked by their handles: one, or several), re-rendering
        as it changes: e.g. to offset what sticks below a bar (a{' '}
        <PartLink
          component="header"
          part="Header.Accessory"
        />{' '}
        does).
      </li>
    </ul>
    <UseAnchorSizePart />
    <h3>Arguments</h3>
    <PropsTable rows={useAnchorSizeRows} />
    <h3>Returns</h3>
    <PropsTable rows={useAnchorSizeReturnRows} />

    <Heading
      id="useviewportedgeelement"
      level={2}
    >
      <code>useViewportEdgeElement</code>
    </Heading>
    <ul>
      <li>
        Something sticking to an edge’s bars (e.g. a{' '}
        <PartLink
          component="header"
          part="Header.Accessory"
        />
        , which uses it): while it’s stuck, the edge effect (an anchor’s{' '}
        <code>edgeEffect</code>, see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ) reaches beyond the bars to cover it too.
      </li>
      <li>
        Above the effect (a <code>z-index</code> over 9, the effect’s), so
        what’s beneath it blurs, not it.
      </li>
      <li>Here: a filter sticking below the bar; scroll the list.</li>
    </ul>
    <UseViewportEdgeElementPart />
    <h3>Arguments</h3>
    <PropsTable rows={useViewportEdgeElementRows} />

    <Heading
      id="viewportscopecontext"
      level={2}
    >
      <code>ViewportScopeContext</code>
    </Heading>
    <ul>
      <li>
        The anchors’ scope for what’s within: an element’s key that fixed layers
        are contained by (its value, any object). The library’s containers
        provide it (
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        , sheets’ and drawers’ popups); provide it for an element of the app’s
        that contains fixed layers (a <code>transform</code>,{' '}
        <code>contain: layout</code>).
      </li>
      <li>
        Unset: the provided portal container (a device’s frame, see{' '}
        <code>PortalContainerContext</code>), or the window.
      </li>
    </ul>

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
        Calls its listener on every scroll of the tracked scroll container, and
        as it’s pulled past an end, without re-rendering.
      </li>
      <li>
        The direction changes past <code>threshold</code> (its own);{' '}
        <code>overscroll</code>, how far it’s pulled past an end, and{' '}
        <code>isHeld</code>: e.g. pulling to refresh, or to turn pages (see the{' '}
        <a href="viewport/composition#pulling-to-refresh">composition</a>).
      </li>
      <li>
        Inside a provider (outside one: never called). Here: each call logged
        (one per scroll event, or pull), with the content’s direction, edges and
        overscroll.
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
        The direction scrolled in (past <code>threshold</code>: more, a steadier
        direction) and the edges; re-rendering as they change (not with every
        scroll).
      </li>
      <li>
        Bouncing past an end (e.g. back from the bottom) doesn’t change the
        direction.
      </li>
      <li>
        Inside a provider (outside one: at the top, no direction, unchanging).
      </li>
    </ul>
    <UseScrollDirectionPart />
    <h3>Arguments</h3>
    <PropsTable rows={useScrollDirectionArgumentRows} />
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
        The window’s horizontal size class: <code>regular</code> from 768px,{' '}
        <code>compact</code> below; re-rendering as it changes.
      </li>
      <li>
        For presentations by size: e.g. a sheet on <code>compact</code> (a
        phone), a popover on <code>regular</code> (a tablet), as{' '}
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
        target is focused without scrolling (as the tap ends).
      </li>
      <li>
        Also tapped just beside it (within about a finger’s width, touching no
        other control) or on its label: iOS focuses it then, too (adjusting the
        touch to the nearest control).
      </li>
      <li>
        The touch’s click doesn’t follow, and the caret goes where the field
        puts it (not where it was touched). Elsewhere, it does nothing.
      </li>
      <li>
        The page hidden with a field focused in its target (another tab, a Home
        Screen app left with the keyboard shown) and shown again: the field is
        focused again without scrolling (its selection as it was), the page’s
        scroll put back, so the keyboard returns with the bars where they were
        (the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        keeps their push meanwhile).
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

    <Heading
      id="preventtextactions"
      level={2}
    >
      <code>preventTextActions</code>
    </Heading>
    <ul>
      <li>
        A held press selects text (and shows the browser’s text menu, iOS’
        callout): on a menu’s trigger opened by a held press (
        <PartLink
          component="menu"
          part="Menu.Trigger"
        />
        ’s <code>openOn=&quot;secondaryClick&quot;</code>), or an edit menu’s
        anchor (
        <PartLink
          component="edit-menu"
          part="EditMenu.Positioner"
        />
        ), it shows over the menu. Guarded, its target selects none (its{' '}
        <code>user-select</code> and <code>-webkit-touch-callout</code>,{' '}
        <code>none</code>).
      </li>
      <li>
        An app’s choice: text may well stay selectable. Until its returned
        function restores the target’s own values.
      </li>
    </ul>
    <CodeView code={preventTextActionsCode} />
    <h3>Arguments</h3>
    <PropsTable rows={preventTextActionsRows} />
    <h3>Returns</h3>
    <PropsTable rows={preventTextActionsReturnRows} />

    <Heading
      id="usetextactionsprevention"
      level={2}
    >
      <code>useTextActionsPrevention</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="viewport"
          part="preventTextActions"
        />{' '}
        on its <code>target</code>, while the component is mounted (and{' '}
        <code>enabled</code>).
      </li>
      <li>Here: a message to hold (by touch).</li>
    </ul>
    <UseTextActionsPreventionPart />
    <h3>Arguments</h3>
    <PropsTable rows={useTextActionsPreventionRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const viewportPartsDemos = [
  ProviderPart,
  ContentPart,
  AnchorPart,
  BlockStartPart,
  BlockEndPart,
  PaddingPart,
  OverscrollPart,
  CreateAnchorHandlePart,
  UseAnchorSizePart,
  UseViewportEdgeElementPart,
  UseVisualViewportPart,
  UseViewportScrollPart,
  UseScrollDirectionPart,
  UseElementVisibilityPart,
  UseElementGeometryPart,
  UseSizeClassPart,
  UseInputZoomPreventionPart,
  UseFocusShiftPreventionPart,
  UseTextActionsPreventionPart,
];
