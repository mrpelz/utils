import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, and the hooks' arguments and return values, for the
// parts page (all) and the overview (its key ones).

const safeAreaRow: PropRow = [
  'safeArea',
  union('all', 'block', 'inline', 'none'),
  code(union('all')),
  <>
    The safe area insets kept clear (as padding): all, those of the block
    dimension (top, bottom) or the inline one (left, right) only, or none (CSS{' '}
    <code>env(safe-area-inset-*)</code>). Its own background reaches the
    screen’s edge, its content clear of them: the anchor is the surface (a bar’s
    background goes on the anchor, by its <code>className</code>; its content
    spaced inside it).
  </>,
];

const anchorHandleRow: PropRow = [
  'handle',
  'ViewportAnchorHandle',
  undefined,
  <>
    Its handle (
    <PartLink
      component="viewport"
      part="Viewport.createAnchorHandle"
    />
    , in a component{' '}
    <PartLink
      component="viewport"
      part="useCreateViewportAnchorHandle"
    />
    ), linking it to the{' '}
    <PartLink
      component="viewport"
      part="Viewport.Padding"
    />
    s given it (their <code>anchor</code>, alone or among others’): as high as
    it, or as the tallest of the anchors they’re linked to.
  </>,
];

const anchorKeyboardRow: PropRow = [
  'keyboard',
  union('push', 'cover'),
  code(union('push')),
  <>
    At the block end: pushed up by the on-screen keyboard (e.g. a message
    field), or covered by it (e.g. a tab bar). At the other edges: none (side
    anchors always end at the keyboard’s top).
  </>,
];

const edgeEffectRow: PropRow = [
  'edgeEffect',
  union('soft', 'hard', 'none'),
  code(union('soft')),
  <>
    At the block start or end: its scroll edge effect, as content scrolls under
    it: <code>soft</code>, a blur fading out away from the edge;{' '}
    <code>hard</code>, a solid backing with a dividing line. Drawn by the
    scroller beneath (a <a href="page">Page</a>, a sheet’s content, the{' '}
    <PartLink
      component="viewport"
      part="Viewport.Content"
    />
    ): one per edge, as tall as the tallest anchor there, also under what’s
    stuck to it (
    <PartLink
      component="viewport"
      part="useViewportEdgeElement"
    />
    ).
  </>,
];

const edgeTintRow: PropRow = [
  'edgeTint',
  'string',
  undefined,
  <>
    At the block start or end: a CSS color for its edge effect (e.g. to tell a
    state for a while: recording), shown at rest too; <code>soft</code>, under
    its fade; <code>hard</code>, as its backing. Changes crossfade. Not the only
    sign of the state: pair it with a label or a symbol.
  </>,
];

export const viewportProviderRows: readonly PropRow[] = [
  [
    'scroller',
    'RefObject<HTMLElement | null>',
    'the page filling its screen, or the document’s scrolling element',
    <>
      The scroll container tracked. Unset: the scroller filling its screen (a{' '}
      <a href="page">Page</a>, a sheet’s content, a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Content"
      />
      : registered as they mount; the innermost, as pages show and hide, e.g. a
      tab’s), or the document’s. Its direction and edges, for{' '}
      <PartLink
        component="viewport"
        part="useViewportScroll"
      />{' '}
      and{' '}
      <PartLink
        component="viewport"
        part="useScrollDirection"
      />
      . Pulled past an end where it doesn’t bounce by itself (not Safari), it’s
      moved along only while a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Overscroll"
      />{' '}
      is shown; otherwise, the browser’s own scrolling is left as it is.
    </>,
  ],
  [
    'screen',
    'HTMLElement | RefObject<HTMLElement | null> | null',
    'the provided portal container, or the window',
    <>
      The app’s screen, when it isn’t the window (e.g. a device’s frame in a
      page, as here): the visual viewport within it (what the keyboard covers of
      its bottom, how far its top is scrolled away while the keyboard shows),
      its custom properties set on it, not the root element. By default, the
      portal container provided by <code>PortalContainerContext</code> (the
      app’s screen for its popups, too); <code>null</code>: the window.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'The app (or the part of it) using the hooks. It renders no element of its own.',
  ],
];

export const viewportContentRows: readonly PropRow[] = [
  [
    'keyboard',
    union('resize', 'overlay'),
    code(union('resize')),
    <>
      With the on-screen keyboard: resized to what’s above it (its end scrolls
      into view), or overlaid by it (filling the layout viewport, from its top).
    </>,
  ],
  safeAreaRow,
  [
    'alwaysBounce',
    'boolean',
    'while it holds its content itself',
    <>
      Bouncing even when its content fits: it has at least 1px to scroll, so a
      drag on it is its own (rubber-banding the content layer, the bars
      staying), not the document’s (on iOS, moving the whole app).{' '}
      <code>false</code>: only content taller than it scrolls. Unset: not while
      its child scrolls on its own (a <a href="page">Page</a>, a{' '}
      <a href="header">Header</a> around one, a <a href="layout">Layout</a>, a{' '}
      <a href="navigation">Navigation</a>), which bouncing it would move whole.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportAnchorRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    undefined,
    <>
      The edge it floats at (required): <code>block-start</code> (the top, e.g.
      a toolbar), <code>block-end</code> (the bottom, e.g. a tab bar), or the
      inline ones (the leading and trailing sides, e.g. a compact sidebar;
      mirrored right to left).
    </>,
  ],
  edgeEffectRow,
  edgeTintRow,
  anchorHandleRow,
  anchorKeyboardRow,
  safeAreaRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportBlockStartRows: readonly PropRow[] = [
  [
    'keyboard',
    union('push', 'cover'),
    code(union('push')),
    'None at the top (an anchor’s prop, effective at the block end).',
  ],
  edgeEffectRow,
  edgeTintRow,
  anchorHandleRow,
  safeAreaRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportBlockEndRows: readonly PropRow[] = [
  edgeEffectRow,
  edgeTintRow,
  anchorHandleRow,
  anchorKeyboardRow,
  safeAreaRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportPaddingRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end'),
    code(union('block-start')),
    <>
      Where it is in its scroll container: at its start (
      <code>block-start</code>, e.g. under a header’s bar) or its end (
      <code>block-end</code>, e.g. above a tab bar); its scroll padding set
      there. Without an <code>anchor</code>, it makes room for the anchors at
      that edge: as high as the tallest of them in its scope.
    </>,
  ],
  [
    'anchor',
    'ViewportAnchorHandle | ViewportAnchorHandle[] | null',
    <>all at its edge (in its scope)</>,
    <>
      The anchors it makes room for, by their handles (each anchor’s{' '}
      <code>handle</code>): one, or several (as high as the tallest of them),
      instead of all at its edge. E.g. a toolbar, not a toast floating over the
      content above it; or both, for the last rows to stay clear of the toast.{' '}
      <code>null</code>: none, whatever anchors are in its scope: its{' '}
      <code>margin</code> alone, a gap of the app’s (e.g. content meant to
      scroll under a bar, still spaced from the edge).
    </>,
  ],
  [
    'margin',
    'number | string',
    <>
      <code>16px</code> (<code>--uikit-content-margin-block-start</code>/
      <code>-end</code>); none before a large title
    </>,
    <>
      The gap between the content and its container’s edge, beyond the anchors
      (px, or a CSS length): the library’s content margin by default, themed by
      its tokens. Set it to override one padding (e.g. <code>0</code>).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportOverscrollRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end'),
    code(union('block-start')),
    <>
      The end it’s past: the content’s start (<code>block-start</code>, e.g.
      pulling to refresh) or its end (<code>block-end</code>, e.g. pulling on to
      the next page).
    </>,
  ],
  [
    'anchor',
    'ViewportAnchorHandle | ViewportAnchorHandle[] | null',
    <>all at its edge (in its scope)</>,
    <>
      The bars it comes out from under, by their handles (one, or several: the
      tallest of them), instead of all at its edge, as a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Padding"
      />
      ’s. <code>null</code>: none, from the screen’s edge (inside the safe
      area).
    </>,
  ],
  [
    'open',
    'boolean',
    code('false'),
    <>
      Kept shown at rest, e.g. while refreshing: the{' '}
      <PartLink
        component="viewport"
        part="Viewport.Padding"
      />{' '}
      at its edge makes room for it beyond the bars, the content settling there
      (300ms), and back once closed.
    </>,
  ],
  [
    'safeArea',
    union('all', 'block', 'inline', 'none'),
    code(union('all')),
    <>
      The safe area insets it shows only clear of while pulled in: all, those of
      the block dimension (top, bottom) or the inline one (left, right) only, or
      none. Not kept clear, it shows in the inset too (e.g. behind the status
      bar, as a refresh control), there even at rest, just past the content’s
      end (e.g. faded by its progress,{' '}
      <code>--uikit-viewport-overscroll-progress</code>); open, it rests clear
      of it all the same.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What shows past the end (e.g. an activity indicator, a hint). Its custom properties, inherited: --uikit-viewport-overscroll (the pull at its edge, px) and --uikit-viewport-overscroll-progress (0 to 1, of its own size; open, 1).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

/** `useAnchorSize(edge, handle)`: its arguments. */
export const useAnchorSizeRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    undefined,
    'The edge whose tallest anchor (in its scope) it reads.',
  ],
  [
    'handle',
    'ViewportAnchorHandle | ViewportAnchorHandle[] | null',
    undefined,
    'The anchors it reads instead, by their handles: one, or several (the tallest of them); null: none (0).',
  ],
];

/** `useAnchorSize`: what it returns. */
export const useAnchorSizeReturnRows: readonly PropRow[] = [
  [
    '(return)',
    'number',
    undefined,
    'The tallest anchor’s size (px) along its edge’s axis, without the safe area insets it keeps clear; live (e.g. a tab bar collapsing); 0 without one.',
  ],
];

/** `useVisualViewport()`: what it returns (`VisualViewportState`). */
export const useVisualViewportRows: readonly PropRow[] = [
  ['width', 'number', undefined, 'The visual viewport’s width (px).'],
  [
    'height',
    'number',
    undefined,
    'The visual viewport’s height (px): less the on-screen keyboard, while it’s shown.',
  ],
  [
    'left',
    'number',
    undefined,
    'The visual viewport’s offset from the layout viewport’s left edge (px), e.g. while zoomed in.',
  ],
  [
    'top',
    'number',
    undefined,
    'The visual viewport’s offset from the layout viewport’s top edge (px).',
  ],
  [
    'keyboardInset',
    'number',
    undefined,
    'What the visual viewport doesn’t show of the layout viewport’s bottom (px, rounded): the on-screen keyboard’s height (0 without one).',
  ],
];

const thresholdRow: PropRow = [
  'options.threshold',
  'number',
  code('8'),
  'How far (px) to scroll from where the direction last turned before it changes, so jitter doesn’t flip it (more: a steadier direction). Overscrolling (e.g. bouncing back from the end) never changes it.',
];

/** `useViewportScroll(listener, options)`: its arguments. */
export const useViewportScrollRows: readonly PropRow[] = [
  [
    'listener',
    '(event: ViewportScrollEvent) => void',
    undefined,
    'Called on every scroll of the tracked scroll container, and as it’s overscrolled; it can change between renders without resubscribing.',
  ],
  thresholdRow,
];

/** `useScrollDirection(options)`: its argument. */
export const useScrollDirectionArgumentRows: readonly PropRow[] = [
  thresholdRow,
];

/** A scroll's event (`ViewportScrollEvent`), the listener's argument. */
export const viewportScrollEventRows: readonly PropRow[] = [
  [
    'direction',
    `${union('down', 'up')} | undefined`,
    undefined,
    'The direction scrolled in, once past the threshold (until then: none); not changed by overscrolling.',
  ],
  ['atTop', 'boolean', undefined, 'Scrolled to (or past) the start.'],
  [
    'atBottom',
    'boolean',
    undefined,
    'Scrolled to (or past) the end (within 1px).',
  ],
  [
    'position',
    'number',
    undefined,
    'The scroll position (px), within the scroll range: overscrolled, its end.',
  ],
  [
    'overscroll',
    'number',
    undefined,
    'How far it’s pulled past an end (px), rubber-banded: negative past the start (e.g. pulling to refresh), positive past the end; 0 within. Safari’s own bounce; elsewhere, a touch or a wheel pulling at an end (damped; a wheel’s stiffer, at most half the container’s height): the content moved along only while a Viewport.Overscroll is shown, else staying. A wheel’s inertia (its fingers lifted: told by the browser, WheelEvent momentum, or by its deceleration, then back to before the fling) never pulls.',
  ],
  [
    'isHeld',
    'boolean',
    undefined,
    'Overscrolling held: a touch, or a wheel’s fingers until quiet (150ms) or until its inertia starts, still pulling. Once not, it’s released (e.g. to act then), bouncing back.',
  ],
];

/** `useScrollDirection(options)`: what it returns. */
export const useScrollDirectionRows: readonly PropRow[] =
  viewportScrollEventRows.filter(([name]) =>
    ['atBottom', 'atTop', 'direction'].includes(name),
  );

const elementRefRow: PropRow = [
  'ref',
  'RefObject<Element | null>',
  undefined,
  'The element (as first mounted: a later element in the ref isn’t observed).',
];

const scrollerRow: PropRow = [
  'options.scroller',
  'RefObject<HTMLElement | null>',
  'the viewport',
  'The scroll container whose box (inside its borders and scroll bars) is the visible area; otherwise the layout viewport. No provider needed.',
];

/** `useElementVisibility(ref, options)`: its arguments. */
export const useElementVisibilityRows: readonly PropRow[] = [
  elementRefRow,
  [
    'options.threshold',
    'number',
    code('0'),
    'How much of the element (0–1) must be visible to count; 0: any of it, even an edge.',
  ],
  [
    'options.rootMargin',
    'string',
    code(union('0px')),
    <>
      Grows (or, negative, shrinks) the visible area, as CSS margins (e.g.{' '}
      <code>&apos;100% 0px&apos;</code>: a screen above and below, to prepare
      what’s about to scroll in).
    </>,
  ],
  scrollerRow,
];

/** `useElementVisibility()`: what it returns. */
export const useElementVisibilityReturnRows: readonly PropRow[] = [
  [
    '(return)',
    'boolean',
    code('false'),
    <>
      Whether the element is visible (an <code>IntersectionObserver</code>’s
      report: re-rendering only as it changes); <code>false</code> until it
      reports, and on the server.
    </>,
  ],
];

/** `useElementGeometry(ref, listener, options)`: its arguments. */
export const useElementGeometryRows: readonly PropRow[] = [
  elementRefRow,
  [
    'listener',
    '(geometry: ElementGeometry) => void',
    undefined,
    'Called with the element’s geometry (below) as it’s measured: once per frame while anything scrolls or resizes (while it’s visible; once more as it leaves), and as it mounts. It can change without resubscribing; nothing re-renders unless it does (e.g. setting state).',
  ],
  scrollerRow,
];

/** `useElementGeometry()`'s listener: what it's called with (`ElementGeometry`). */
export const elementGeometryRows: readonly PropRow[] = [
  [
    'top',
    'number',
    undefined,
    'From the visible area’s top edge to the element’s (px): positive while the element’s edge is inside the area, negative once past it.',
  ],
  [
    'right',
    'number',
    undefined,
    'From the visible area’s right edge to the element’s (px), as top.',
  ],
  [
    'bottom',
    'number',
    undefined,
    'From the visible area’s bottom edge to the element’s (px), as top.',
  ],
  [
    'left',
    'number',
    undefined,
    'From the visible area’s left edge to the element’s (px), as top.',
  ],
  ['width', 'number', undefined, 'The element’s width (px, its border box).'],
  ['height', 'number', undefined, 'The element’s height (px, its border box).'],
  [
    'visibleWidth',
    'number',
    undefined,
    'How much of its width is visible (px).',
  ],
  [
    'visibleHeight',
    'number',
    undefined,
    'How much of its height is visible (px).',
  ],
  [
    'visibleWidthRatio',
    'number',
    undefined,
    'How much of its width is visible (0–1).',
  ],
  [
    'visibleHeightRatio',
    'number',
    undefined,
    'How much of its height is visible (0–1).',
  ],
  [
    'visibleRatio',
    'number',
    undefined,
    'How much of its area is visible (0–1).',
  ],
  [
    '(return)',
    'ElementGeometry | undefined',
    undefined,
    <>
      Measured once a frame while it (or anything around it) scrolls or resizes,
      only while it’s visible, once more as it leaves; <code>undefined</code>{' '}
      until measured, and on the server.
    </>,
  ],
];

/** `preventInputZoom()`, `preventFocusShift()`: what they return. */
const releaseRow: PropRow = [
  '(return)',
  '() => void',
  undefined,
  'Lets go of it (once; more calls do nothing).',
];

export const preventInputZoomRows: readonly PropRow[] = [releaseRow];

export const useInputZoomPreventionRows: readonly PropRow[] = [
  [
    'enabled',
    'boolean',
    code('true'),
    'Whether it holds the guard (while mounted).',
  ],
];

export const preventFocusShiftRows: readonly PropRow[] = [
  [
    'target',
    'Document | HTMLElement',
    code('document'),
    'Where touched text fields are focused without scrolling (its descendants).',
  ],
];

export const preventFocusShiftReturnRows: readonly PropRow[] = [releaseRow];

export const useFocusShiftPreventionRows: readonly PropRow[] = [
  [
    'target',
    'RefObject<HTMLElement | null>',
    'the document',
    'Where touched text fields are focused without scrolling.',
  ],
  ['enabled', 'boolean', code('true'), 'Whether it guards (while mounted).'],
];

export const preventTextActionsRows: readonly PropRow[] = [
  [
    'target',
    'HTMLElement',
    undefined,
    'Where a held press selects no text and shows no browser text menu (its user-select and -webkit-touch-callout, none).',
  ],
];

export const preventTextActionsReturnRows: readonly PropRow[] = [
  [
    '(return)',
    '() => void',
    undefined,
    'Restores its own values (once; more calls do nothing).',
  ],
];

export const useTextActionsPreventionRows: readonly PropRow[] = [
  [
    'target',
    'RefObject<HTMLElement | null>',
    undefined,
    'Where a held press selects no text and shows no browser text menu.',
  ],
  ['enabled', 'boolean', code('true'), 'Whether it applies (while mounted).'],
];

export const useSizeClassReturnRows: readonly PropRow[] = [
  [
    '(returns)',
    union('compact', 'regular'),
    undefined,
    <>
      The window’s horizontal size class: <code>regular</code> from 768px (a
      tablet’s window), <code>compact</code> below (a phone’s); before hydration
      (server rendering), <code>compact</code>.
    </>,
  ],
];

export const useViewportEdgeElementRows: readonly PropRow[] = [
  [
    'ref',
    'RefObject<HTMLElement | null>',
    undefined,
    'What sticks to the edge’s bars (e.g. a sticky search field below the top bar).',
  ],
  [
    'edge',
    union('block-start', 'block-end'),
    undefined,
    'The edge whose bars it sticks to.',
  ],
];
