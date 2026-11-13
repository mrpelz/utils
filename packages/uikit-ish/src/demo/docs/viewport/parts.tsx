import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Button,
  type ElementGeometry,
  List,
  Symbol,
  type SymbolIcon,
  TextField,
  Toolbar,
  useAnchorSize,
  useElementGeometry,
  useElementVisibility,
  useFocusScroll,
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
import { CodeAroundContext, Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  MappedProp,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import {
  hideFromCode,
  useLabelledRef,
} from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfEllipsis,
  sfHeart,
  sfPencil,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from './content.js';
import {
  elementGeometryRows,
  preventFocusShiftReturnRows,
  preventFocusShiftRows,
  preventInputZoomRows,
  preventTextActionsReturnRows,
  preventTextActionsRows,
  trackStatusBarTapsArgumentRows,
  trackStatusBarTapsRows,
  useAnchorSizeReturnRows,
  useAnchorSizeRows,
  useCurrentScrollerRows,
  useElementGeometryRows,
  useElementVisibilityReturnRows,
  useElementVisibilityRows,
  useFocusScrollRows,
  useFocusShiftPreventionRows,
  useInputZoomPreventionRows,
  useScrollDirectionArgumentRows,
  useScrollDirectionRows,
  useSizeClassReturnRows,
  useStatusBarTapsRows,
  useTextActionsPreventionRows,
  useViewportEdgeElementRows,
  useViewportScrollRows,
  useVisualViewportRows,
  viewportAnchorRows,
  viewportBackgroundRows,
  viewportBlockEndRows,
  viewportBlockStartRows,
  viewportContentRows,
  viewportKeyboardAccessoryRows,
  viewportOverscrollRows,
  viewportPaddingRows,
  viewportProviderRows,
  viewportScrollEventRows,
} from './docs.js';
import {
  barAnchor,
  propOptionsAnchor,
  propOptionsBackground,
  propOptionsBlockEnd,
  propOptionsBlockStart,
  propOptionsContent,
  propOptionsElementGeometry,
  propOptionsElementVisibility,
  propOptionsFocusScroll,
  propOptionsFocusShift,
  propOptionsHandlePadding,
  propOptionsInputZoom,
  propOptionsKeyboardAccessory,
  propOptionsOverscroll,
  propOptionsPaddingContent,
  propOptionsPaddingEnd,
  propOptionsPaddingStart,
  propOptionsProvider,
  propOptionsScrollOptions,
  propOptionsTextActions,
  toastAnchor,
} from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const trackStatusBarTapsCode = `import { trackStatusBarTaps } from '@mrpelz/uikit-ish';

// At the app's start: a status bar tap scrolls the chat to its newest
// message, not to its top (the provider's scrollsToTop off).
const stop = trackStatusBarTaps(() => {
  document
    .getElementById('newest-message')
    ?.scrollIntoView({ behavior: 'smooth' });
});`;

const useCurrentScrollerCode = `import { Button, Toolbar, useCurrentScroller } from '@mrpelz/uikit-ish';

// A bar's button scrolling what the user is looking at back to its top:
// a sheet's content while one is open, else the current page.
export const ToTop = () => {
  const scroller = useCurrentScroller();

  return (
    <Toolbar.Button
      disabled={!scroller}
      onClick={() => scroller?.scrollTo({ behavior: 'smooth', top: 0 })}
    >
      <Button.Label>Top</Button.Label>
    </Toolbar.Button>
  );
};`;

const useCreateViewportAnchorHandleCode = `import {
  Toolbar,
  useCreateViewportAnchorHandle,
  Viewport,
} from '@mrpelz/uikit-ish';

export const Screen = () => {
  // Made once, kept for the component's lifetime.
  const barAnchor = useCreateViewportAnchorHandle();

  return (
    <>
      <Viewport.Content>
        <Viewport.Padding edge="block-start" />
        {/* … */}
        {/* Room for the toolbar only, not for other anchors at the bottom. */}
        <Viewport.Padding
          anchor={barAnchor}
          edge="block-end"
        />
      </Viewport.Content>
      <Viewport.BlockEnd handle={barAnchor}>
        <Toolbar.Root placement="block-end">{/* … */}</Toolbar.Root>
      </Viewport.BlockEnd>
    </>
  );
};`;

const viewportScopeContextCode = `import { useState } from 'react';
import { ViewportScopeContext } from '@mrpelz/uikit-ish';

// A panel of the app's own that contains fixed layers (its transform):
// the anchors inside it, and the paddings making room for them, share
// its scope, not the screen's.
export const Panel = ({ children }) => {
  const [scope] = useState(() => ({}));

  return (
    <ViewportScopeContext.Provider value={scope}>
      <div style={{ transform: 'translateZ(0)' }}>{children}</div>
    </ViewportScopeContext.Provider>
  );
};`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Viewport.Content': ['ref'],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      screenRef={screenRef}
      stage="phone"
      state={[state, partState]}
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
      <Viewport.Content
        {...partProps['Viewport.Content']}
        ref={contentRef}
      >
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {names.map((name) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
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
  // (In the code: the provider as the app writes it, its props the
  // controls', around the stage's; not the demo's screen.)
  const around = useMemo(
    () => (
      <Viewport.Provider
        {...props}
        screen={undefined}
      />
    ),
    [props],
  );

  return (
    <Viewport.Provider
      {...props}
      screen={props.screen === null ? null : screenRef}
    >
      <CodeAroundContext.Provider value={around}>
        <ProviderPartFrame
          contentRef={contentRef}
          control={control}
          screenRef={screenRef}
          state={state}
        />
      </CodeAroundContext.Provider>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="Viewport.Content"
    >
      <Viewport.Content {...props}>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {names.map((name) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
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
      </Viewport.Content>
    </Component>
  );
};

/**
 * `Viewport.Background`, outlined: a picture behind the layers, under a
 * top bar and a bottom toolbar (their buttons on it); nothing else in
 * front of it.
 */
const BackgroundPart: FunctionComponent = () => {
  const id = 'viewport-parts-background';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsBackground, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Viewport.Background',
  });
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': ['edgeEffect'],
            'Viewport.BlockStart': ['edgeEffect'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const button = (label: string, icon: SymbolIcon) => (
    <Toolbar.Button
      {...partProps['Toolbar.Button']}
      aria-label={label}
      shape="circle"
      onClick={() => addLog(`${label} clicked`)}
    >
      <Button.Icon {...partProps['Button.Icon']}>
        <Symbol
          {...partProps.Symbol}
          icon={icon}
        />
      </Button.Icon>
    </Toolbar.Button>
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[state, partState]}
      title="Viewport.Background"
    >
      <Viewport.Background {...props}>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Viewport.BlockStart
        {...partProps['Viewport.BlockStart']}
        edgeEffect="none"
      >
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            {button('Share', sfSquareAndArrowUp)}
          </Toolbar.Leading>
          <Toolbar.Title {...partProps['Toolbar.Title']}>
            <span>Wallpaper</span>
          </Toolbar.Title>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            {button('More', sfEllipsis)}
          </Toolbar.Trailing>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Viewport.BlockEnd
        {...partProps['Viewport.BlockEnd']}
        edgeEffect="none"
      >
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            {button('Favorite', sfHeart)}
          </Toolbar.Leading>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            {button('Edit', sfPencil)}
            {button('Delete', sfTrash)}
          </Toolbar.Trailing>
        </Toolbar.Root>
      </Viewport.BlockEnd>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="Viewport.Anchor"
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          {/* Room for it at either end (the margin alone at the other). */}
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="Viewport.BlockStart"
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
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
        </Viewport.Content>
        <Viewport.BlockStart {...props}>
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            placement="block-start"
          >
            <Toolbar.Title {...partProps['Toolbar.Title']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': [],
          'Toolbar.Title': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="Viewport.BlockEnd"
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
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
        </Viewport.Content>
        <Viewport.BlockEnd {...props}>
          <Toolbar.Root {...partProps['Toolbar.Root']}>
            <Toolbar.Title {...partProps['Toolbar.Title']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.BlockEnd': ['className'],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[controlContent, controlStart, controlEnd, partControls]}
      id={id}
      stage="phone"
      state={[stateContent, stateStart, stateEnd, partState]}
      title="Viewport.Padding"
    >
      <>
        <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            placement="block-start"
          >
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Viewport.Padding {...propsStart} />
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
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding {...propsEnd} />
        </Viewport.Content>
        <Viewport.BlockEnd
          {...partProps['Viewport.BlockEnd']}
          className="viewport-demo-surface"
        >
          {content.rows === 2 ? (
            <Toolbar.Root {...partProps['Toolbar.Root']}>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Updated Just Now</span>
              </Toolbar.Title>
            </Toolbar.Root>
          ) : null}
          <Toolbar.Root {...partProps['Toolbar.Root']}>
            <Toolbar.Title {...partProps['Toolbar.Title']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          ActivityIndicator: ['className', 'display'],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': ['ref'],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      containsOverscroll
      isInline
      controls={[control, partControls]}
      id={id}
      screenRef={screenRef}
      stage="phone"
      state={[state, partState]}
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
              {...partProps.ActivityIndicator}
              className="viewport-demo-pull-spinner"
              display="reset"
            />
          </div>
        </Viewport.Overscroll>
        <Viewport.Content
          {...partProps['Viewport.Content']}
          ref={contentRef}
        >
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
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
        </Viewport.Content>
        <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            placement="block-start"
          >
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
      </>
    </Component>
  );
};

/** `OverscrollView`, in a provider tracking its screen's content. */
/**
 * `Viewport.KeyboardAccessory`, outlined: a note's field at the screen's
 * bottom, lifted above the keyboard while it's typed into.
 */
const KeyboardAccessoryPart: FunctionComponent = () => {
  const id = 'viewport-parts-keyboard-accessory';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsKeyboardAccessory, {
    emphasize: 'outline',
    external,
    isOpen: true,
    title: 'Viewport.KeyboardAccessory',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': ['render'],
          'List.Title': [],
          'List.Trailing': [],
          'TextField.Control': ['above', 'placeholder', 'the'],
          'TextField.Label': [],
          'TextField.Root': ['render'],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
          'Viewport.Provider': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="Viewport.KeyboardAccessory"
    >
      {/* Tracking the keyboard over its screen. */}
      <Viewport.Provider {...partProps['Viewport.Provider']}>
        <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            placement="block-start"
          >
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <List.Root {...partProps['List.Root']}>
            <List.Section {...partProps['List.Section']}>
              <List.Group {...partProps['List.Group']}>
                {names.slice(0, 10).map((name) => (
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
            {/* (Its section, as the accessory: spaced as sections are.) */}
            <List.Section
              {...partProps['List.Section']}
              render={<Viewport.KeyboardAccessory {...props} />}
            >
              <List.Group {...partProps['List.Group']}>
                <TextField.Root
                  {...partProps['TextField.Root']}
                  render={<List.Item {...partProps['List.Item']} />}
                >
                  <List.Content {...partProps['List.Content']}>
                    <TextField.Label {...partProps['TextField.Label']}>
                      Note
                    </TextField.Label>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <TextField.Control
                      {...partProps['TextField.Control']}
                      placeholder="Typed above the keyboard"
                    />
                  </List.Trailing>
                </TextField.Root>
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Viewport.Content>
      </Viewport.Provider>
    </Component>
  );
};

/** The focus scroll view's fields: down past the keyboard. */
const focusScrollFields = [
  'First Name',
  'Last Name',
  'Company',
  'Phone',
  'Email',
  'Street',
  'City',
  'Postal Code',
  'Country',
  'Birthday',
  'Website',
  'Nickname',
  'Job Title',
  'Notes',
] as const;

/**
 * `useFocusScroll`: an app's own scroller, filling the content layer, its
 * fields down past the keyboard; marked (`mode`), a field typed into is
 * scrolled above it.
 */
const UseFocusScrollPart: FunctionComponent = () => {
  const id = 'viewport-parts-use-focus-scroll';
  const scroller = useLabelledRef<HTMLDivElement>('scroller', 'HTMLDivElement');
  const [external] = useProvidedState(id);
  const [control, args, state] = usePropControl(propOptionsFocusScroll, {
    external,
    title: 'arguments',
  });
  useFocusScroll(scroller, args.mode);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Trailing': [],
          'TextField.Control': ['above', 'placeholder', 'the'],
          'TextField.Label': [],
          'TextField.Root': ['render'],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
          'Viewport.Provider': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="useFocusScroll"
    >
      {/* Tracking the keyboard over its screen. */}
      <Viewport.Provider {...partProps['Viewport.Provider']}>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <div
            ref={scroller}
            className="viewport-demo-scroller"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {focusScrollFields.map((label) => (
                    <TextField.Root
                      key={label}
                      {...partProps['TextField.Root']}
                      render={<List.Item {...partProps['List.Item']} />}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <TextField.Label {...partProps['TextField.Label']}>
                          {label}
                        </TextField.Label>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <TextField.Control
                          {...partProps['TextField.Control']}
                          placeholder="Typed above the keyboard"
                        />
                      </List.Trailing>
                    </TextField.Root>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </div>
        </Viewport.Content>
      </Viewport.Provider>
    </Component>
  );
};

const OverscrollPart: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );
  const screenRef = useRef<HTMLDivElement>(null);

  // (In the code: the provider as the app writes it, around the stage's.)
  const around = useMemo(
    () => <Viewport.Provider scroller={contentRef} />,
    [contentRef],
  );

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <CodeAroundContext.Provider value={around}>
        <OverscrollView
          contentRef={contentRef}
          screenRef={screenRef}
        />
      </CodeAroundContext.Provider>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Viewport.Padding': ['edge'],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': [],
          'Toolbar.Title': [],
          'Viewport.BlockEnd': ['className', 'handle'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="Viewport.createAnchorHandle"
      diagnostics={
        <HandleSizes
          anchor={props.anchor}
          margin={props.margin}
        />
      }
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
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
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding {...props} />
        </Viewport.Content>
        <Viewport.BlockEnd
          {...partProps['Viewport.BlockEnd']}
          className="viewport-demo-surface"
          handle={barAnchor}
        >
          <Toolbar.Root {...partProps['Toolbar.Root']}>
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>{names.length} Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockEnd>
        {/* A toast over the content: room made for it only if linked. */}
        <Viewport.BlockEnd
          {...partProps['Viewport.BlockEnd']}
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
const UseAnchorSizePart: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.BlockEnd': ['className'],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState('viewport-parts-use-anchor-size') },
  );
  return (
    <Component
      isInline
      controls={[partControls]}
      diagnostics={<AnchorSizes />}
      id="viewport-parts-use-anchor-size"
      stage="phone"
      state={[partState]}
      title="useAnchorSize"
      setup={`// In the anchors' scope (here: the screen):
const top = useAnchorSize('block-start');
const bottom = useAnchorSize('block-end');`}
    >
      <>
        <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            placement="block-start"
          >
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
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
        </Viewport.Content>
        <Viewport.BlockEnd
          {...partProps['Viewport.BlockEnd']}
          className="viewport-demo-surface"
        >
          <Toolbar.Root {...partProps['Toolbar.Root']}>
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>{names.length} Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </>
    </Component>
  );
};

/**
 * `useViewportEdgeElement`'s content (in the anchors' scope): a filter
 * sticking below the bar, the bar's edge effect reaching under it.
 */
/**
 * The hooks of `useViewportEdgeElement`'s view, inside its screen (their
 * scope, the anchors'): the filter registered below the bar, the bar's
 * height told (a part of the demo's tooling: no part of the code shown,
 * which its setup has).
 */
const EdgeElementHooks: FunctionComponent<{
  readonly filter: RefObject<HTMLDivElement | null>;
  readonly onTop: (top: number) => void;
}> = ({ filter, onTop }) => {
  const top = useAnchorSize('block-start');
  useViewportEdgeElement(filter, 'block-start');
  useLayoutEffect(() => onTop(top), [onTop, top]);

  return null;
};
hideFromCode(EdgeElementHooks);

/** `useViewportEdgeElement`: a filter sticking below the bar. */
const UseViewportEdgeElementPart: FunctionComponent = () => {
  const id = 'viewport-parts-use-viewport-edge-element';
  const filter = useLabelledRef<HTMLDivElement>('filter', 'HTMLDivElement');
  const [top, setTop] = useState(0);
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id={id}
      stage="phone"
      state={[partState]}
      title="useViewportEdgeElement"
      setup={`// Sticking below the bar (its height, in the anchors' scope):
const top = useAnchorSize('block-start');
useViewportEdgeElement(filter, 'block-start');`}
    >
      <EdgeElementHooks
        filter={filter}
        onTop={setTop}
      />
      <>
        <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            placement="block-start"
          >
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>Contacts</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div
            ref={filter}
            className="viewport-demo-sticky"
            style={{ top }}
          >
            <span className="viewport-demo-filter">Favorites only</span>
          </div>
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
        </Viewport.Content>
      </>
    </Component>
  );
};

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
// (In the code: the provider around the stage's.)
const plainProvider = <Viewport.Provider />;

const UseVisualViewportPart: FunctionComponent = () => (
  <Viewport.Provider>
    <CodeAroundContext.Provider value={plainProvider}>
      <UseVisualViewportView />
    </CodeAroundContext.Provider>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Viewport.Content': ['ref'],
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
      containsOverscroll
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screenRef={screenRef}
      stage="phone"
      state={[state, partState]}
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
      <Viewport.Content
        {...partProps['Viewport.Content']}
        ref={contentRef}
      >
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {names.map((name) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
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

  // (In the code: the provider as the app writes it, around the stage's.)
  const around = useMemo(
    () => <Viewport.Provider scroller={contentRef} />,
    [contentRef],
  );

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <CodeAroundContext.Provider value={around}>
        <UseViewportScrollView
          addLog={addLog}
          contentRef={contentRef}
          log={log}
          screenRef={screenRef}
        />
      </CodeAroundContext.Provider>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Viewport.Content': ['ref'],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      containsOverscroll
      isInline
      controls={[control, partControls]}
      id={id}
      screenRef={screenRef}
      stage="phone"
      state={[state, partState]}
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
      <Viewport.Content
        {...partProps['Viewport.Content']}
        ref={contentRef}
      >
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {names.map((name) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
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

  // (In the code: the provider as the app writes it, around the stage's.)
  const around = useMemo(
    () => <Viewport.Provider scroller={contentRef} />,
    [contentRef],
  );

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <CodeAroundContext.Provider value={around}>
        <UseScrollDirectionView
          contentRef={contentRef}
          screenRef={screenRef}
        />
      </CodeAroundContext.Provider>
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
// (An element, not a component: the code shown has its fields, not a tag.)
const guardFields = (
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
        {guardFields}
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
        {guardFields}
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
        Provider: goes around the app. It tracks the visual viewport and
        scrolling, for the layers and the hooks.
      </li>
      <li>Content: the content layer, which scrolls.</li>
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
        for the top and the bottom).
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        >
          Padding
        </PartLink>
        : room at a scroll container’s start or end, for the anchors there (by
        their scope, or by their handles) plus the content margin.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        >
          Overscroll
        </PartLink>
        : what shows past the content’s start or end as it’s pulled there, such
        as a refresh indicator.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        >
          KeyboardAccessory
        </PartLink>
        : what’s typed into, kept above the keyboard.
      </li>
      <li>
        Hooks: inside the provider, what it tracks. Anywhere, an element’s
        visibility and geometry.
      </li>
      <li>
        On this page, each phone screen contains its fixed layers (it has a{' '}
        <code>transform</code>). In an app, they’re fixed to the window.
      </li>
    </ul>
    <ul className="demo-tree">
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
              part="Viewport.Background"
            />{' '}
            (optional; behind the other layers)
          </li>
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
                (at the start and the end, in it or in a page inside it)
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.KeyboardAccessory"
                />{' '}
                (optional, anywhere inside, around what’s typed into)
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="viewport"
              part="Viewport.Overscroll"
            />{' '}
            (optional, one per end; rendered before the content layer, beneath
            it)
          </li>
          <li>
            <PartLink
              component="viewport"
              part="Viewport.Anchor"
            />{' '}
            (optional, at an edge; several can stack there), or its shorthands:
            <ul>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.BlockStart"
                />{' '}
                (<code>edge=&quot;block-start&quot;</code>)
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.BlockEnd"
                />{' '}
                (<code>edge=&quot;block-end&quot;</code>)
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
              <li>
                <PartLink
                  component="viewport"
                  part="useCurrentScroller"
                />
              </li>
              <li>
                <PartLink
                  component="viewport"
                  part="useFocusScroll"
                />{' '}
                (on a scroller, or around fields)
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
            (optional, around an element that contains fixed layers; set by a{' '}
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
      <li>
        Status bar taps (iOS, in a Home Screen app; a provider’s{' '}
        <code>scrollsToTop</code> uses them):{' '}
        <PartLink
          component="viewport"
          part="trackStatusBarTaps"
        />{' '}
        (and{' '}
        <PartLink
          component="viewport"
          part="useStatusBarTaps"
        />
        )
      </li>
    </ul>

    <Heading
      id="viewport-provider"
      level={2}
    >
      <code>Viewport.Provider</code>
    </Heading>
    <ul>
      <li>Renders no element. It’s a context that goes around the app.</li>
      <li>
        Tracks the visual viewport, as custom properties on the root element
        that the layers follow, and for{' '}
        <PartLink
          component="viewport"
          part="useVisualViewport"
        />
        .
      </li>
      <li>
        Tracks a scroll container’s scrolling (its <code>scroller</code>).
        Unset, that’s the one filling its screen, a{' '}
        <a href={publicUrl('page')}>Page</a> or a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        , updated as pages show and hide, or else the document. An overlay’s
        content never counts: not a popover’s, a sheet’s or an island’s, nor
        anything inside them. The scrolling feeds{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />{' '}
        and{' '}
        <PartLink
          component="viewport"
          part="useScrollDirection"
        />
        . Each takes its own <code>threshold</code>.
      </li>
      <li>
        When it tracks the window (as the layers do, outside a device’s screen),
        it marks the root as an app’s (<code>data-uikit-viewport-window</code>),
        so the app’s background shows beneath the layers. In an iOS Home Screen
        app, it also makes the document as tall as the screen (
        <code>data-uikit-viewport-standalone</code>). Otherwise iOS gives a
        document no taller than its window a layout viewport that’s short by the
        status bar’s height, and paints nothing below it (WebKit bug 301108).
      </li>
      <li>
        Here, it tracks the screen’s content layer. The readout is below it.
      </li>
    </ul>
    <ProviderPart />
    <h3>Props</h3>
    <PropsTable rows={viewportProviderRows} />

    <Heading
      id="viewport-background"
      level={2}
    >
      <code>Viewport.Background</code>
    </Heading>
    <ul>
      <li>
        The screen’s background: a layer behind the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />{' '}
        and every other layer, wherever you place it among them. It fills its
        provider’s screen (the window, or a screen such as a device frame). It
        doesn’t scroll, and the keyboard doesn’t move it.
      </li>
      <li>
        Its children are layered, each filling it (images and videos cover it).
        For example a picture, a map or a video. It shows wherever nothing in
        front of it paints: between a list’s groups, beside a{' '}
        <a href={publicUrl('layout')}>Layout</a>’s floating{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>, through transparent pages.
      </li>
      <li>
        Place it next to the content layer, not inside it. The content layer
        moves as it bounces, and would carry it along. For a layout that doesn’t
        fill the screen, give the layout’s box its own background instead.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <BackgroundPart />
    <h3>Props</h3>
    <PropsTable rows={viewportBackgroundRows} />

    <Heading
      id="viewport-content"
      level={2}
    >
      <code>Viewport.Content</code>
    </Heading>
    <ul>
      <li>
        The content layer. It fills the viewport and scrolls its content,
        beneath the anchors.
      </li>
      <li>
        With the keyboard up, it’s resized to the space above it (
        <code>keyboard</code> <code>resize</code>), or overlaid. A text field
        typed into inside it is scrolled into view above the keyboard, by the
        layer or by a page inside it (see{' '}
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ).
      </li>
      <li>
        Keeps the safe area insets clear as padding (<code>safeArea</code>). By
        default (<code>auto</code>), it doesn’t while its direct child scrolls
        on its own (a <a href={publicUrl('page')}>Page</a>, a{' '}
        <a href={publicUrl('header')}>Header</a>, a{' '}
        <a href={publicUrl('layout')}>Layout</a>, a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>). That child fills the
        screen and keeps its content clear itself.
      </li>
      <li>
        For content that isn’t padded, such as a map’s controls that must stay
        clear of a bar or an island: it publishes the anchors’ sizes at its top
        and bottom, as a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        makes room for them (beyond the safe area inset). They’re{' '}
        <code>--uikit-viewport-anchor-block-start</code> and{' '}
        <code>--uikit-viewport-anchor-block-end</code>. In a script, use{' '}
        <PartLink
          component="viewport"
          part="useAnchorSize"
        />
        .
      </li>
      <li>
        Renders a <code>div</code>. Pass its ref to a provider’s{' '}
        <code>scroller</code> to track it.
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
        Floats above the content layer at an <code>edge</code>. At the top or
        bottom, it spans the screen as a bar. At the leading or trailing side,
        it’s a sidebar running from the top down to the keyboard.
      </li>
      <li>
        At the bottom, the keyboard either pushes it up (<code>keyboard</code>{' '}
        <code>push</code>, the default) or covers it.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        and{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        are shorthands for an anchor with its <code>edge</code> set. Either
        spelling gives the same part.
      </li>
      <li>
        Keeps the safe area insets clear as padding (<code>safeArea</code>). It
        doesn’t inset the content.
      </li>
      <li>
        At the top or bottom, it has an edge effect (<code>edgeEffect</code>:{' '}
        <code>soft</code> by default, <code>hard</code> or <code>none</code>).
        The scroller beneath draws it as content scrolls under the bar (a{' '}
        <a href={publicUrl('page')}>Page</a>, a sheet’s content, the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        ). There’s one per edge, however many anchors stack there, as tall as
        the tallest. It also reaches under what’s stuck to them (
        <PartLink
          component="viewport"
          part="useViewportEdgeElement"
        />
        ). It can be tinted, even at rest (<code>edgeTint</code>, see{' '}
        <a href={publicUrl('viewport/composition#a-tinted-edge')}>
          a tinted edge
        </a>
        ).
      </li>
      <li>
        The anchor is the surface, and it has no background of its own. For a
        bar with a background or a separator, style the anchor itself, with your
        own class in its <code>className</code>. It then reaches the screen’s
        edge behind the home indicator, while its content stays clear. Space the
        content inside with its own padding or margin. The anchor’s padding
        belongs to the insets. Here, the class is{' '}
        <code>viewport-demo-surface</code>.
      </li>
      <li>
        A surface inside the anchor ends at the insets instead, leaving a gap
        below a bottom bar. Glass bars need no surface (a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />
        , a{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.List"
        />
        ): the content shows through to the edge.
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
        Shorthand for a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />{' '}
        at the top (<code>edge=&quot;block-start&quot;</code>), with all of its
        other props. The two are interchangeable; use whichever reads better.
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
        Shorthand for a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />{' '}
        at the bottom (<code>edge=&quot;block-end&quot;</code>), with all of its
        other props. The two are interchangeable; use whichever reads better.
      </li>
      <li>
        Like any anchor at the bottom, it’s pushed up by the keyboard by
        default.
      </li>
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
        Room at a scroll container’s start (under a bar) or end (above a tab bar
        or toolbar). It makes room for the anchors there, so the content scrolls
        out from under them, plus the content margin.
      </li>
      <li>
        The content margin is the library’s gap between content and its
        container’s edge: 16px, set by its tokens (
        <code>--uikit-content-margin-block-start</code>, <code>-end</code>).
        There’s none before a{' '}
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />{' '}
        , which sits right under the bar. <code>margin</code> overrides it for
        one padding. Without anchors in its scope (for example in a sheet’s
        content, or without a bar), it’s just the margin. Components never space
        themselves; the padding does it.
      </li>
      <li>
        With <code>anchor=&#123;null&#125;</code>, it follows no anchors, even
        with some in its scope, and is just the margin. That suits content meant
        to scroll under a bar while still keeping a gap to the edge. Rendering
        no padding leaves no gap at all.
      </li>
      <li>
        It’s as tall as the tallest anchor at its <code>edge</code> in its
        scope. Linked to anchors by their handles (<code>anchor</code>, one or
        several), it’s as tall as the tallest of those (see{' '}
        <PartLink
          component="viewport"
          part="Viewport.createAnchorHandle"
        />
        ). It updates live as an anchor changes, for example as a tab bar
        collapses. Here, try the bottom bar’s rows.
      </li>
      <li>
        It counts an anchor’s size without the safe area insets the anchor keeps
        clear. The scroll container keeps those clear itself (for example a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        ’s padding), so the two add up.
      </li>
      <li>
        Its scope is what the anchors are fixed to: the screen (the window, or a
        frame like this page’s), or an element that contains fixed layers (a{' '}
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
        While mounted, it sets its scroll container’s scroll padding at its edge
        (<code>scroll-padding-block-start</code> or <code>-end</code>): the
        container’s own padding there, plus its height. So moving focus and{' '}
        <code>scrollIntoView</code> stop clear of the anchors. Its scroll
        container is its nearest scrolling ancestor, or the document.
      </li>
      <li>
        Use one per end of a scroll container. Leave it out where nothing should
        make room, for example for a picture under the bar, or a bar with
        nothing in it.
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
        there. For example, a refresh indicator, or a hint to the next page (see
        the{' '}
        <a href={publicUrl('viewport/composition#pulling-to-refresh')}>
          composition
        </a>
        ).
      </li>
      <li>
        It’s a layer beneath the content layer, so render it before that. It
        comes out from under the bars at its edge (chosen as with a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ’s <code>anchor</code>), and the pull moves it along with the content’s
        end, as if it were part of the content.
      </li>
      <li>
        Safari bounces the content past its ends by itself, and the layer shows
        through the gap. Other browsers don’t. While it’s shown there, the pull
        moves the tracked scroll container along, as Safari would. When none is
        shown, nothing moves. Where the content stays put (the document’s), the
        layer slides in over it with the pull (
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ’s <code>overscroll</code>, rubber-banded), and bounces back once
        released.
      </li>
      <li>
        Its pull is available to its content’s styles as custom properties, for
        example to fade in or turn: <code>--uikit-viewport-overscroll</code>{' '}
        (px) and <code>--uikit-viewport-overscroll-progress</code> (0 to 1,
        relative to its own size). To act on release, use{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ’s <code>isHeld</code>.
      </li>
      <li>
        <code>open</code> keeps it shown at rest, for example while refreshing,
        with its progress at 1. The padding at its edge makes room for it beyond
        the bars, and the content moves there. Once closed, it moves back.
      </li>
      <li>
        It must be inside a provider that tracks the scroll container (its{' '}
        <code>scroller</code>). Here, pull the list past either end (
        <code>edge</code>), or open it.
      </li>
      <li>
        Renders a <code>div</code> (its area) inside a clipping layer.
      </li>
    </ul>
    <OverscrollPart />
    <h3>Props</h3>
    <PropsTable rows={viewportOverscrollRows} />

    <Heading
      id="viewport-keyboardaccessory"
      level={2}
    >
      <code>Viewport.KeyboardAccessory</code>
    </Heading>
    <ul>
      <li>
        Keeps what’s typed into above the on-screen keyboard. While focus is
        inside it and the keyboard covers it, it’s lifted: moved up, with its
        place in the layout kept, until its end is <code>gap</code> above the
        keyboard. It goes back down as focus leaves or the keyboard hides.
      </li>
      <li>
        For fields the browser can’t scroll into view, together with what
        belongs to them (for example a color picker’s channel row, slider
        included). In an app, the document doesn’t scroll, and{' '}
        <PartLink
          component="viewport"
          part="useFocusShiftPrevention"
        />{' '}
        keeps the browser from trying. Its fields aren’t scrolled into view by
        their scroller (see{' '}
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ).
      </li>
      <li>
        Built into an{' '}
        <PartLink
          component="alert"
          part="Alert.Popup"
        />{' '}
        and a{' '}
        <PartLink
          component="popover"
          part="Popover.Positioner"
        />{' '}
        , which lift as a whole. When accessories are nested, only the innermost
        one around the focused element lifts. For example, a color picker’s
        channel row in a popover lifts within it, and the popover stays.
      </li>
      <li>
        It lifts once what’s around it has stopped moving. A sheet that the
        keyboard lifts itself carries it along, so it isn’t lifted twice. It
        goes back down at once.
      </li>
      <li>
        While lifted (<code>data-lifted</code>), it sits above what’s around it,
        on <code>--uikit-viewport-keyboard-accessory-background</code> (none by
        default). It moves by <code>--uikit-viewport-keyboard-lift</code> (px),
        following the keyboard (250ms, none with reduced motion). A{' '}
        <a href={publicUrl('list')}>List</a>’s groups inside it are outlined and
        raised while lifted, like a row being reordered, so they don’t blend
        into the rows below.
      </li>
      <li>
        Needs a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        for the keyboard’s height. Without one, it stays where it is.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <KeyboardAccessoryPart />
    <h3>Props</h3>
    <PropsTable rows={viewportKeyboardAccessoryRows} />

    <Heading
      id="viewport-createanchorhandle"
      level={2}
    >
      <code>Viewport.createAnchorHandle</code>
    </Heading>
    <ul>
      <li>
        A handle that names an anchor, so paddings can link to it. Give it to
        the anchor (<code>handle</code>) and to the paddings (
        <code>anchor</code>, one handle or several; the padding is then as tall
        as the tallest). Make it once, for example at a module’s top level.
      </li>
      <li>
        For a padding that should follow some anchors, not all at its edge. For
        example, a toolbar, but not a toast floating above it.
      </li>
      <li>
        Here, the control sets the end padding’s <code>anchor</code>. The
        diagnostics show the room it makes for anchors, plus its 16px margin.
        Scroll the content to its end to see the effect on the last rows:
        <ul>
          <li>
            <code>barAnchor</code>: as tall as the toolbar. The toast floats
            over the last row, as a brief toast should.
          </li>
          <li>
            <code>[barAnchor, toastAnchor]</code>: as tall as the taller of the
            two, the toast. The last rows stay clear of it too while it shows.
          </li>
          <li>
            Unset: as tall as the tallest anchor at its <code>edge</code> (
            <code>block-end</code>), toast included. Here that’s the same as
            linking both, but it would also follow any anchor added at the
            bottom.
          </li>
          <li>
            <code>null</code>: no anchors, just the margin (16px). The last rows
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
        inside a component. The handle is made once and kept for the component’s
        lifetime.
      </li>
    </ul>
    <CodeView code={useCreateViewportAnchorHandleCode} />

    <Heading
      id="useanchorsize"
      level={2}
    >
      <code>useAnchorSize</code>
    </Heading>
    <ul>
      <li>
        Returns the size of the tallest anchor at an edge in its scope, or of
        the tallest of those linked by their handles. It re-renders as that
        changes. Use it, for example, to offset what sticks below a bar (as a{' '}
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
        Registers something that sticks to an edge’s bars (for example a{' '}
        <PartLink
          component="header"
          part="Header.Accessory"
        />
        , which uses it). While it’s stuck, the edge effect (an anchor’s{' '}
        <code>edgeEffect</code>, see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ) reaches beyond the bars to cover it too.
      </li>
      <li>
        Give it a <code>z-index</code> above the effect’s (9), so the effect
        blurs what’s beneath it, not the element itself.
      </li>
      <li>Here, a filter sticks below the bar. Scroll the list to see it.</li>
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
        Sets the anchors’ scope for everything inside: a key for the element
        that contains fixed layers (its value can be any object). The library’s
        containers provide it (
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        , and sheets’ and drawers’ popups). Provide it yourself for an element
        of your own that contains fixed layers (one with a{' '}
        <code>transform</code>, or <code>contain: layout</code>).
      </li>
      <li>
        Unset, the scope is the provided portal container (a device frame, see{' '}
        <code>PortalContainerContext</code>), or else the window.
      </li>
    </ul>
    <CodeView code={viewportScopeContextCode} />

    <Heading
      id="usevisualviewport"
      level={2}
    >
      <code>useVisualViewport</code>
    </Heading>
    <ul>
      <li>
        Returns the visual viewport: its size, its offset and the keyboard’s
        height. It re-renders as they change.
      </li>
      <li>
        Use it inside a provider. Outside one, it’s read once and never updated.
        Resize the window to see it change.
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
        while it’s pulled past an end. It doesn’t re-render.
      </li>
      <li>
        The direction changes past its own <code>threshold</code>.{' '}
        <code>overscroll</code> tells how far it’s pulled past an end, and{' '}
        <code>isHeld</code> whether that pull is still held. Use them to pull to
        refresh, or to turn pages (see the{' '}
        <a href={publicUrl('viewport/composition#pulling-to-refresh')}>
          composition
        </a>
        ).
      </li>
      <li>
        Use it inside a provider. Outside one, the listener is never called.
        Here, each call is logged (one per scroll event or pull), with the
        content’s direction, edges and overscroll.
      </li>
    </ul>
    <UseViewportScrollPart />
    <h3>Arguments</h3>
    <PropsTable rows={useViewportScrollRows} />
    <h3>The Listener’s Event</h3>
    <PropsTable rows={viewportScrollEventRows} />

    <Heading
      id="usecurrentscroller"
      level={2}
    >
      <code>useCurrentScroller</code>
    </Heading>
    <ul>
      <li>
        Returns the scroller the user is looking at, so the app can scroll it
        for them. For example, back to its top from a button in a bar.
      </li>
      <li>
        It goes by layers: first the most recently opened{' '}
        <PartLink
          component="popover"
          part="Popover.Popup"
        />
        ’s body or{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        />{' '}
        . Otherwise an{' '}
        <PartLink
          component="island"
          part="Island.Content"
        />{' '}
        while it’s scrolled away from its start (scrolled back, it’s the page
        again). Otherwise the scroller its provider tracks (see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        ; for example the page of the tab that’s shown).
      </li>
      <li>
        It re-renders as that changes. Use it inside a provider; outside one, it
        returns <code>undefined</code>. It only considers what’s within its
        provider’s screen.
      </li>
    </ul>
    <CodeView code={useCurrentScrollerCode} />
    <h3>Returns</h3>
    <PropsTable rows={useCurrentScrollerRows} />

    <Heading
      id="usescrolldirection"
      level={2}
    >
      <code>useScrollDirection</code>
    </Heading>
    <ul>
      <li>
        Returns the direction scrolled in and whether an edge is reached. It
        re-renders as they change, not with every scroll. A larger{' '}
        <code>threshold</code> gives a steadier direction.
      </li>
      <li>
        Bouncing past an end, for example back from the bottom, doesn’t change
        the direction.
      </li>
      <li>
        Use it inside a provider. Outside one, it stays at the top, with no
        direction.
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
        Returns whether an element is in the visible area, using an{' '}
        <code>IntersectionObserver</code>. The area is the viewport, or a scroll
        container (<code>scroller</code>). It re-renders only when that changes.
      </li>
      <li>
        <code>threshold</code> sets how much of it must show.{' '}
        <code>rootMargin</code> grows or shrinks the area, for example to mount
        what’s about to scroll in.
      </li>
      <li>
        Here, the card starts visible in the box. Scroll the box to hide it.
        With the viewport as the area (<code>scroller</code> unset), also scroll
        the page until the box leaves the window. With the box as the area, the
        page’s scrolling doesn’t matter. The card is colored while visible, and
        each change is logged.
      </li>
      <li>
        In either area, the scroll containers around it clip it, as they do for
        any <code>IntersectionObserver</code>.
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
        edges’ distances to the area’s, and how much of it shows (in px, and as
        a share). Nothing re-renders unless the listener causes it, as with{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        .
      </li>
      <li>
        It’s measured once per frame while anything scrolls or resizes, but only
        while the element is visible (it uses an{' '}
        <PartLink
          component="viewport"
          part="useElementVisibility"
        />{' '}
        of its own), plus once more as it leaves.
      </li>
      <li>
        Here, scroll the box both ways, with half the card out of it. The card
        is as opaque as it’s visible (its listener sets state), and each call is
        logged (one per frame scrolled).
      </li>
    </ul>
    <UseElementGeometryPart />
    <h3>Arguments</h3>
    <PropsTable rows={useElementGeometryRows} />
    <h3>Its Listener’s Geometry</h3>
    <PropsTable rows={elementGeometryRows} />

    <Heading
      id="usesizeclass"
      level={2}
    >
      <code>useSizeClass</code>
    </Heading>
    <ul>
      <li>
        Returns the window’s horizontal size class: <code>regular</code> from
        768px, <code>compact</code> below. It re-renders as it changes.
      </li>
      <li>
        Use it to choose a presentation by size, for example a sheet on{' '}
        <code>compact</code> (a phone) and a popover on <code>regular</code> (a
        tablet).{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        decides its own <code>compact</code> by it.
      </li>
      <li>No provider needed.</li>
    </ul>
    <UseSizeClassPart />
    <h3>iPadOS’ snapshots</h3>
    <ul>
      <li>
        As the app switcher opens (also on the way to the Home Screen), iPadOS
        resizes the app’s window for its snapshots while the page is still
        showing. For example, a landscape window (1180×820) turns portrait
        (820×1180), then a half-width Split View size (585×820,{' '}
        <code>compact</code>), about half a second before the page is hidden.
        Read naively, the size class switches to <code>compact</code> and back.
        An app laid out by it (a sidebar on <code>regular</code>, a stack on{' '}
        <code>compact</code>) then remounts and loses its scroll positions and
        state.
      </li>
      <li>
        Before each of these resizes, iPadOS fires an{' '}
        <code>orientationchange</code> whose orientation (
        <code>screen.orientation</code>) contradicts the window’s shape:
        portrait while the window is still landscape, or the other way round.
        From then on, the size class is held, until the screen turns to an
        orientation that matches the window’s shape, the window is back at its
        size from before, or the page is shown again. Then the size class is
        read anew.
      </li>
      <li>
        In a browser tab, the second snapshot’s <code>orientationchange</code>{' '}
        reports the first one’s orientation again, and its window (585px wide,
        the tab’s height) has that shape too. It looks like a match, but the
        screen hasn’t turned, so the size class stays held. The window is then
        resized back before the page is hidden.
      </li>
      <li>
        Real changes aren’t held. A rotation’s <code>orientationchange</code>{' '}
        comes after its resize (about 0.4s later) and matches the window’s shape
        (for example a small tablet turned portrait, 744px wide, becomes{' '}
        <code>compact</code>). A resize by the user (Split View, Slide Over,
        Stage Manager) fires none.
      </li>
      <li>
        While the page is hidden, the window’s size still reads as the last
        snapshot’s, while its media queries already match the real one. Shown
        again, it’s resized back a moment later, and the size class is read
        anew. There’s no timer involved; these events alone decide.
      </li>
      <li>
        Neither the screen’s size (<code>screen.width</code> and{' '}
        <code>screen.height</code>, always the portrait one) nor the page’s
        visibility (it stays shown) tells these resizes apart from real ones.
      </li>
    </ul>
    <h3>Returns</h3>
    <PropsTable rows={useSizeClassReturnRows} />

    <Heading
      id="usefocusscroll"
      level={2}
    >
      <code>useFocusScroll</code>
    </Heading>
    <ul>
      <li>
        Scrolls a text field that’s being typed into above the on-screen
        keyboard. A provider does this, using the field’s scroller. It waits
        until the keyboard is up and everything has settled (for example the
        content layer shrinking above it, or an{' '}
        <a href={publicUrl('island')}>Island</a> pushed up with its anchor),
        then scrolls smoothly. It doesn’t scroll as the field is focused: the
        browser’s own scroll on iOS is kept off, because it moves the whole page
        (see{' '}
        <PartLink
          component="viewport"
          part="useFocusShiftPrevention"
        />
        ).
      </li>
      <li>
        It scrolls again when focus moves to another field (for example with the
        keyboard’s ▲▼ buttons), and as the field is typed into (for example a
        growing text area). Once the user scrolls it away, it waits for the next
        focus or input. It shows the whole field, 8px from the visible area’s
        edges. The visible area leaves out the scroll padding (see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ) and any bars the keyboard pushes up. A field taller than that area
        shows its end.
      </li>
      <li>
        The field’s nearest marked element decides (
        <code>data-viewport-focus-scroll</code>). With <code>target</code>, that
        scroller scrolls, and no other, not even the page. With{' '}
        <code>none</code>, nothing scrolls (for example when a component places
        its fields itself). Without a mark, nothing scrolls either. This hook
        marks <code>ref</code>’s element while mounted. You can also set the
        attribute as a prop, for example{' '}
        <code>data-viewport-focus-scroll=&quot;none&quot;</code> on a field’s
        root.
      </li>
      <li>
        Already marked as <code>target</code>: a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        , a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        , a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        />{' '}
        and an{' '}
        <PartLink
          component="island"
          part="Island.Content"
        />
        . A snapping one below its top stop doesn’t scroll, so it stays. A{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />{' '}
        is marked <code>none</code>, because it lifts its fields instead.
      </li>
      <li>
        Here, an app’s own scroller fills the content layer, and its fields
        reach down past the keyboard. Unmarked (<code>false</code>), the content
        layer is the nearest mark. It doesn’t scroll, so nothing moves.
      </li>
    </ul>
    <UseFocusScrollPart />
    <h3>Arguments</h3>
    <PropsTable rows={useFocusScrollRows} />

    <Heading
      id="preventinputzoom"
      level={2}
    >
      <code>preventInputZoom</code>
    </Heading>
    <ul>
      <li>
        iOS Safari zooms the page in when a text field with a font smaller than
        16px gets focus. While this guard is held, it doesn’t. It sets the
        viewport’s <code>maximum-scale</code> to 1, and iOS still lets the page
        be pinch-zoomed.
      </li>
      <li>
        It’s held until its returned function lets go. With several holders, the
        viewport is restored when the last one lets go. Outside iOS it does
        nothing, because a <code>maximum-scale</code> would stop pinch zoom
        there.
      </li>
      <li>
        Call it once for the app, for example at its start. It covers all
        fields, even those the app doesn’t render itself (here, the demos’ own
        controls).
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
        Here, there are fields of 12, 15 and 17px, one with suggestions (a{' '}
        <code>datalist</code>), and a text area. Each focus logs the page’s
        zoom. Every demo’s prop controls hold the guard too, for their own
        fields, so on this site the zoom stays off either way.
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
        When iOS focuses a text field, it scrolls the page (its layout viewport)
        to keep the field clear of the keyboard. That shifts a fixed layout,
        such as a <a href={publicUrl('viewport')}>Viewport</a>’s bars. With this
        guard, a field touched inside its target is focused without scrolling,
        as the tap ends.
      </li>
      <li>
        The same goes for a tap just beside a field (within about a finger’s
        width, touching no other control) or on its label. iOS focuses the field
        then, too, because it adjusts the touch to the nearest control.
      </li>
      <li>
        The touch’s click doesn’t follow, and the caret goes where the field
        puts it, not where it was touched. Outside iOS, the guard does nothing.
      </li>
      <li>
        If the keyboard still covers the field as it shows (for example at the
        bottom of a <a href={publicUrl('layout')}>Layout</a> column, on iPadOS),
        iOS scrolls the page to reveal it anyway, also when it’s focused again
        later. That scroll is put back while the field’s keyboard shows, until
        the keyboard hides, focus leaves, or the user touches the screen.
      </li>
      <li>
        If the user hides the keyboard with iPadOS’s hide key, the field stays
        focused. iOS then shows the keyboard again only for a tap it handles
        itself, not for a focus from code, until a tap moves focus elsewhere. So
        a tap on that field is left to iOS, and its scroll is put back the same
        way. You see a brief jump while iOS’s visual viewport catches up.
      </li>
      <li>
        A field that’s already focused without its keyboard, not by a touch, is
        focused anew without scrolling when touched. That’s a popup’s initial
        focus, for example, as when an <a href={publicUrl('alert')}>Alert</a>{' '}
        focuses its field. With the keyboard shown, a touch places the caret as
        usual.
      </li>
      <li>
        If the page is hidden while a field inside the target is focused (in
        another tab, or a Home Screen app left with the keyboard up), the field
        is focused again without scrolling when the page shows, with its
        selection as it was. The page’s scroll is put back, so the keyboard
        returns with the bars where they were (the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        keeps their push meanwhile).
      </li>
      <li>
        If the page is hidden without a focused field (for example on a tablet
        with a hardware keyboard), the page’s scroll is still put back when it
        shows, so it isn’t left shifted up.
      </li>
      <li>It works until its returned function removes it.</li>
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
        Here, the fields reach down to the frame’s bottom. Each focus logs how
        far the page and the visual viewport scrolled. This is the only holder
        on this page; other demos with fields hold their own.
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
        A held press selects text and shows the browser’s text menu (the
        callout, on iOS). On a menu trigger opened by a held press (
        <PartLink
          component="menu"
          part="Menu.Trigger"
        />
        ’s <code>openOn=&quot;secondaryClick&quot;</code>), or on an edit menu’s
        anchor (
        <PartLink
          component="edit-menu"
          part="EditMenu.Positioner"
        />
        ), that menu would show over yours. With this guard, its target selects
        nothing: its <code>user-select</code> and{' '}
        <code>-webkit-touch-callout</code> are set to <code>none</code>.
      </li>
      <li>
        It’s the app’s choice: text may well stay selectable. The guard holds
        until its returned function restores the target’s own values.
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
      <li>Here, hold the message (by touch).</li>
    </ul>
    <UseTextActionsPreventionPart />
    <h3>Arguments</h3>
    <PropsTable rows={useTextActionsPreventionRows} />

    <Heading
      id="trackstatusbartaps"
      level={2}
    >
      <code>trackStatusBarTaps</code>
    </Heading>
    <ul>
      <li>
        Calls <code>onTap</code> whenever the status bar is tapped, until its
        returned function stops it. iOS gives a page no touch event in the
        status bar. Tapped, it only scrolls the document to its top. So while
        taps are tracked, the document is kept 1px taller than the screen and
        scrolled down by 1px. A scroll to the top with no finger down is a tap,
        and the document is scrolled back to 1px.
      </li>
      <li>
        It works only on iOS, in a Home Screen app, and does nothing elsewhere.
        It’s meant for an app whose document doesn’t scroll, with its content
        scrolling in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />{' '}
        or in <a href={publicUrl('page')}>Page</a>s. It holds the document at
        its 1px, so don’t use it if your document scrolls (a provider’s{' '}
        <code>scrollsToTop</code> doesn’t then, since it tracks the document). A
        modal’s scroll lock on the document is undone meanwhile; the document
        never scrolls more than its 1px anyway.
      </li>
      <li>
        Several callers share it, and each one is called. A provider’s{' '}
        <code>scrollsToTop</code> (on by default) already scrolls the{' '}
        <PartLink
          component="viewport"
          part="useCurrentScroller"
        >
          current scroller
        </PartLink>{' '}
        to its top. Track taps yourself for anything else, for example with that
        turned off. See also{' '}
        <a href={publicUrl('ios-quirks#status-bar-taps')}>iOS Quirks</a>.
      </li>
    </ul>
    <CodeView code={trackStatusBarTapsCode} />
    <h3>Arguments</h3>
    <PropsTable rows={trackStatusBarTapsArgumentRows} />
    <h3>Returns</h3>
    <PropsTable rows={trackStatusBarTapsRows} />

    <Heading
      id="usestatusbartaps"
      level={2}
    >
      <code>useStatusBarTaps</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="viewport"
          part="trackStatusBarTaps"
        />
        , while the component is mounted (and <code>enabled</code>), with its
        latest <code>onTap</code>.
      </li>
    </ul>
    <h3>Arguments</h3>
    <PropsTable rows={useStatusBarTapsRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const viewportPartsDemos = [
  BackgroundPart,
  ProviderPart,
  ContentPart,
  AnchorPart,
  BlockStartPart,
  BlockEndPart,
  PaddingPart,
  OverscrollPart,
  KeyboardAccessoryPart,
  CreateAnchorHandlePart,
  UseAnchorSizePart,
  UseViewportEdgeElementPart,
  UseVisualViewportPart,
  UseViewportScrollPart,
  UseScrollDirectionPart,
  UseElementVisibilityPart,
  UseElementGeometryPart,
  UseSizeClassPart,
  UseFocusScrollPart,
  UseInputZoomPreventionPart,
  UseFocusShiftPreventionPart,
  UseTextActionsPreventionPart,
];
