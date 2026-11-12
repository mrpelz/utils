import { FunctionComponent, RefObject, useMemo, useRef } from 'react';

import {
  List,
  Toolbar,
  useScrollDirection,
  useVisualViewport,
  Viewport,
} from '../../../components/index.js';
import { CodeAroundContext, Component } from '../../tooling/frame/component.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from './content.js';
import {
  viewportAnchorRows,
  viewportContentRows,
  viewportProviderRows,
} from './docs.js';
import {
  propOptionsOverviewBlockEnd,
  propOptionsOverviewBlockStart,
  propOptionsOverviewContent,
} from './props.js';

/**
 * A phone's screen: the content layer, bars at the top and bottom; below
 * it, what the hooks return (inside the provider, see `LiveView`).
 */
const LiveViewFrame: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
  screenRef: RefObject<HTMLDivElement | null>;
}> = ({ screenRef, contentRef }) => {
  const id = 'viewport-overview';
  const [externalContent, externalStart, externalEnd] = useProvidedState(id);
  const [controlContent, propsContent, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: 'Viewport.Content' },
  );
  const [controlStart, { shown: isStartShown, ...propsStart }, stateStart] =
    usePropControl(propOptionsOverviewBlockStart, {
      external: externalStart,
      title: 'Viewport.BlockStart',
    });
  const [controlEnd, { shown: isEndShown, ...propsEnd }, stateEnd] =
    usePropControl(propOptionsOverviewBlockEnd, {
      external: externalEnd,
      title: 'Viewport.BlockEnd',
    });
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
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.Padding': ['edge'],
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
      screenRef={screenRef}
      stage="phone"
      state={[stateContent, stateStart, stateEnd, partState]}
      title="Viewport"
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
      <>
        <Viewport.Content
          ref={contentRef}
          {...propsContent}
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
        {isStartShown ? (
          <Viewport.BlockStart {...propsStart}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Contacts</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
        ) : null}
        {isEndShown ? (
          <Viewport.BlockEnd {...propsEnd}>
            <Toolbar.Root {...partProps['Toolbar.Root']}>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>{names.length} Contacts</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        ) : null}
      </>
    </Component>
  );
};

/** `LiveViewFrame`, tracking its screen's content layer. */
const LiveView: FunctionComponent = () => {
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
        <LiveViewFrame
          contentRef={contentRef}
          screenRef={screenRef}
        />
      </CodeAroundContext.Provider>
    </Viewport.Provider>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/viewport`: what the viewport's parts and hooks are for. */
export const ViewportOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        The app’s window as layers: a content layer that scrolls, with bars
        floating above it at the screen’s edges (anchors).
      </li>
      <li>
        Keeps clear of the safe area insets (the camera cutout, the home
        indicator) and of the on-screen keyboard. Bars move up with the
        keyboard, and the content shrinks above it.
      </li>
      <li>
        Hooks for the visual viewport (its size, the keyboard’s height) and for
        scrolling (its direction, whether an end is reached). For example, to
        collapse a tab bar while scrolling down.
      </li>
      <li>
        Hooks for an element in the visible area, either the window or a scroll
        container: whether it’s visible, how far it is from the edges, and how
        much of it shows (see{' '}
        <a href={publicUrl('viewport/parts#useelementvisibility')}>Parts</a>
        ).
      </li>
      <li>The library’s own component. It isn’t built on Base UI.</li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For an app’s shell. Its pages go in{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        . Its bars, such as a tab bar or a toolbar, go in{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        or{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        (see <a href={publicUrl('viewport/composition')}>Composition</a>).
      </li>
      <li>
        For a field that stays above the on-screen keyboard, such as a message
        field. Put it in{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        , and the keyboard pushes it up.
      </li>
      <li>
        For reacting to scrolling, such as collapsing a tab bar or hiding a
        toolbar. Use{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        with{' '}
        <PartLink
          component="viewport"
          part="useScrollDirection"
        />{' '}
        or{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        .
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A page’s own bars that scroll with it, such as a navigation bar with a
        large title: use a <a href={publicUrl('header')}>Header</a> in a{' '}
        <a href={publicUrl('page')}>Page</a>.
      </li>
      <li>
        Columns side by side, such as a sidebar beside the content on a tablet:
        use a <a href={publicUrl('layout')}>Layout</a> inside{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        .
      </li>
      <li>
        Something above the content for a moment, such as a sheet or a menu: use
        an overlay (<a href={publicUrl('sheet')}>Sheet</a>,{' '}
        <a href={publicUrl('popover')}>Popover</a>,{' '}
        <a href={publicUrl('menu')}>Menu</a>), not an anchor.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most apps set, across the parts.</li>
      <li>
        All props of all parts, and the hooks, are on the{' '}
        <a href={publicUrl('viewport/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Viewport.Provider', pickRows(viewportProviderRows, 'scroller')],
        [
          'Viewport.Content',
          pickRows(viewportContentRows, 'keyboard', 'safeArea'),
        ],
        [
          'Viewport.Anchor',
          pickRows(viewportAnchorRows, 'edge', 'keyboard', 'safeArea'),
        ],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        Its parts are <code>div</code>s without roles. What you put in them
        brings its own: a <a href={publicUrl('toolbar')}>Toolbar</a> is a{' '}
        <code>toolbar</code>, a tab bar’s list is a <code>tablist</code>. For a
        landmark, add the attributes to the anchor (for example{' '}
        <code>role=&quot;navigation&quot;</code>).
      </li>
      <li>
        The content layer is a scroll container. In Chrome, it can take keyboard
        focus while nothing inside it can, so arrow keys and Page Up/Down scroll
        it.
      </li>
      <li>
        Anchors cover the content beneath them. Keep content clear of them with{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        . It also sets its scroll container’s scroll padding, so moving focus
        and <code>scrollIntoView</code> stop clear of a bar, not behind it.
      </li>
      <li>It has no animations of its own.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        <PartLink
          component="viewport"
          part="useElementVisibility"
        />{' '}
        (an <code>IntersectionObserver</code>) and{' '}
        <PartLink
          component="viewport"
          part="useElementGeometry"
        />{' '}
        need no provider. Their area is the layout viewport, or the box of their{' '}
        <code>scroller</code>. Geometry is measured once per frame while things
        scroll or resize, and only while the element is visible.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        tracks the visual viewport once per frame as it resizes or scrolls. It
        publishes it as custom properties (<code>--uikit-viewport-width</code>,{' '}
        <code>-height</code>, <code>-top</code>, <code>-left</code>,{' '}
        <code>-keyboard-inset</code>), which the anchors and the content layer
        follow, and through{' '}
        <PartLink
          component="viewport"
          part="useVisualViewport"
        />
        . They’re set on the root element, or on the app’s screen when that
        isn’t the window (its <code>screen</code> prop; this page’s device
        frames each track their own). Without a provider, the layers stay at the
        layout viewport’s edges and ignore the keyboard.
      </li>
      <li>
        The keyboard’s height is the part of the fixed layers’ box that the
        visual viewport doesn’t show at the bottom. With a <code>screen</code>,
        it’s the part of that screen the keyboard covers.
      </li>
      <li>
        A bar pushed up by the keyboard, and a content layer resized by it,
        follow it with a transition (250ms, none with reduced motion). Their
        bottom safe area inset padding shrinks by what the keyboard covers, to
        none while it shows.
      </li>
      <li>
        An app that reaches under the device’s safe area insets needs{' '}
        <code>viewport-fit=cover</code> in its viewport meta tag. Without it,
        the browser keeps them clear itself, and their insets (
        <code>env(safe-area-inset-*)</code>) are 0.
      </li>
      <li>
        An app’s document doesn’t scroll (its content layer or its pages do), so
        it shouldn’t bounce either: set <code>overscroll-behavior: none</code>{' '}
        on <code>html</code> and <code>body</code>. Otherwise, on iOS, a drag
        that no scroll container takes rubber-bands the document and moves the
        whole app, bars included. That happens on a bar, for example, or on
        content too short to scroll, and especially in a Home Screen app. Set it
        only on iOS (for example in{' '}
        <code>@supports (-webkit-touch-callout: none)</code>). Elsewhere, such
        as Chrome on macOS, it also ends a trackpad’s inertia in the scroll
        containers inside.
      </li>
      <li>
        Anchors and the content layer are <code>position: fixed</code>, relative
        to the window, or to an ancestor with a <code>transform</code> (like
        this page’s phone screens). Anchors (<code>z-index</code> 10) float
        above the content layer without insetting it. The room for them is made
        inside the content, by{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at its start and end. A padding is as tall as the anchors at its edge,
        updated live, plus the library’s content margin, and its scroll padding
        follows.
      </li>
      <li>
        Each anchor is a layer of its own (it has a <code>transform</code>, so
        Safari paints it above the scrolling content layer). Fixed elements
        inside an anchor are placed relative to it, so overlays are portaled out
        of it.
      </li>
      <li>
        At the bottom, an anchor either moves up with the keyboard (
        <code>keyboard=&quot;push&quot;</code>), its safe area inset padding
        shrinking by the keyboard’s height, or stays put and gets covered (
        <code>&quot;cover&quot;</code>). Side anchors span from the top of the
        visual viewport down to the keyboard.
      </li>
      <li>
        The content layer either fills the visual viewport down to the keyboard
        (<code>keyboard=&quot;resize&quot;</code>), or fills the layout viewport
        and lies beneath the keyboard (<code>&quot;overlay&quot;</code>
        ).
      </li>
      <li>
        Scroll tracking follows the document, or the <code>scroller</code>. The
        direction changes once it has scrolled a hook’s <code>threshold</code>{' '}
        (8px) away from where it last turned, and never from bouncing past an
        end. It counts as at the top within 0px, and at the bottom within 1px.
        Before the first scroll, it’s at the top with no direction. Pulled past
        an end, it reports its <code>overscroll</code>.
      </li>
      <li>
        Inline anchors mirror in right-to-left languages (
        <code>inline-start</code> is the right).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const viewportOverviewDemos = [LiveView];
