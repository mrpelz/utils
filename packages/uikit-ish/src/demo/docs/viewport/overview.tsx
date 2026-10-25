import { FunctionComponent, RefObject } from 'react';

import {
  List,
  Toolbar,
  useScrollDirection,
  useVisualViewport,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
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
}> = ({ contentRef }) => {
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

  return (
    <Component
      isInline
      controls={[controlContent, controlStart, controlEnd]}
      id={id}
      stage="phone"
      state={[stateContent, stateStart, stateEnd]}
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
        {isStartShown ? (
          <Viewport.BlockStart {...propsStart}>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
        ) : null}
        {isEndShown ? (
          <Viewport.BlockEnd {...propsEnd}>
            <Toolbar.Root>
              <Toolbar.Title>
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
  const contentRef = useLabelledRef<HTMLDivElement>('contentRef');

  return (
    <Viewport.Provider scroller={contentRef}>
      <LiveViewFrame contentRef={contentRef} />
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
        The app’s window, as layers: a content layer scrolling beneath bars
        floating at its edges (anchors).
      </li>
      <li>
        Kept clear of the safe area insets (the notch, the home indicator) and
        of the on-screen keyboard: bars move up with it, the content shrinks.
      </li>
      <li>
        Hooks for the visual viewport (its size, the keyboard’s height) and for
        scrolling (its direction, its edges), e.g. to collapse a tab bar while
        scrolling down.
      </li>
      <li>
        Hooks for an element in the visible area (the viewport, or a scroll
        container): whether it’s visible, and where (its edges’ distances, how
        much of it shows); see{' '}
        <a href="viewport/parts#useelementvisibility">Parts</a>.
      </li>
      <li>
        This library’s own; no Base UI component, no UIKit counterpart (UIKit: a
        window’s safe area and keyboard layout guides).
      </li>
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
        An app’s shell: its pages in{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        , its bars (a tab bar, a toolbar) in{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        or{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        (see <a href="viewport/composition">Composition</a>).
      </li>
      <li>
        A field that stays above the on-screen keyboard (a message field):{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        , pushed up by it.
      </li>
      <li>
        Reacting to scrolling (collapsing a tab bar, hiding a toolbar):{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        , with{' '}
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
        A page’s own bars, scrolling with it (a navigation bar with a large
        title): a <a href="header">Header</a> in a <a href="page">Page</a>.
      </li>
      <li>
        Columns side by side (a sidebar beside the content, on iPad): a{' '}
        <a href="layout">Layout</a> (in{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        ).
      </li>
      <li>
        Something over the content, for a moment (a sheet, a menu): an overlay (
        <a href="sheet">Sheet</a>, <a href="popover">Popover</a>,{' '}
        <a href="menu">Menu</a>), not an anchor.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most viewports set, across their parts.</li>
      <li>
        All parts’ props, and the hooks: <a href="viewport/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Viewport.Provider',
          pickRows(viewportProviderRows, 'scroller', 'threshold'),
        ],
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
        Its parts are <code>div</code>s without roles: what’s in them brings its
        own (a <a href="toolbar">Toolbar</a> is a <code>toolbar</code>, a tab
        bar’s list a <code>tablist</code>). A landmark, if wanted, by the
        anchor’s attributes (e.g. <code>role=&quot;navigation&quot;</code>).
      </li>
      <li>
        The content layer is a scroll container: in Chrome, keyboard focusable
        while nothing in it is (arrow keys, Page Up/Down scroll it).
      </li>
      <li>
        Anchors cover the content beneath them: keep it clear (e.g. padding), so
        nothing focusable hides behind a bar.
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
        (measured once a frame while it scrolls or resizes, only while visible)
        need no provider: their area is the layout viewport, or their{' '}
        <code>scroller</code>’s box.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        tracks the visual viewport (once per frame, as it resizes or scrolls):
        as custom properties on the root element (
        <code>--uikit-viewport-width</code>, <code>-height</code>,{' '}
        <code>-top</code>, <code>-left</code>, <code>-keyboard-inset</code>),
        which the anchors and the content layer follow, and for{' '}
        <PartLink
          component="viewport"
          part="useVisualViewport"
        />
        . Without a provider, they stay at the layout viewport’s edges, ignoring
        the keyboard.
      </li>
      <li>
        The keyboard’s height: what the visual viewport doesn’t show of the
        layout viewport’s bottom.
      </li>
      <li>
        Anchors and the content layer are <code>position: fixed</code>: to the
        window, or to an ancestor with a <code>transform</code> (as this page’s
        phone screens). Anchors (<code>z-index</code> 10) float above the
        content layer; they don’t inset it. Anchors are layers of their own (
        <code>transform</code>, so Safari paints them above the scrolling
        content layer): within one, fixed elements are placed relative to it
        (overlays are portaled out).
      </li>
      <li>
        At the bottom, an anchor moves up with the keyboard (
        <code>keyboard=&quot;push&quot;</code>), its safe area padding shrinking
        by the keyboard’s height; or stays, covered (
        <code>&quot;cover&quot;</code>). Side anchors span from the visual
        viewport’s top to the keyboard’s.
      </li>
      <li>
        The content layer fills the visual viewport down to the keyboard (
        <code>keyboard=&quot;resize&quot;</code>), or the layout viewport,
        beneath it (<code>&quot;overlay&quot;</code>).
      </li>
      <li>
        Scroll tracking (the document’s, or <code>scroller</code>’s): the
        direction changes once scrolled <code>threshold</code> px (8) from where
        it last turned; at the top within 0px, at the bottom within 1px. Before
        the first scroll: at the top, no direction.
      </li>
      <li>
        Inline anchors mirror right to left (<code>inline-start</code>: the
        right).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const viewportOverviewDemos = [LiveView];
