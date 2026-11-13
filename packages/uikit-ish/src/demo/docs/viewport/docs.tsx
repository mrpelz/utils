import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { glassModeRow } from '../glass-mode.js';

// Every part's props, and the hooks' arguments and return values, for the
// parts page (all) and the overview (its key ones).

const safeAreaRow: PropRow = [
  'safeArea',
  union('all', 'block', 'inline', 'none'),
  code(union('all')),
  <>
    Which safe area insets it keeps clear, as padding (CSS{' '}
    <code>env(safe-area-inset-*)</code>): all of them, only the block ones (top
    and bottom), only the inline ones (left and right), or none. Its own
    background reaches the screen’s edge, while its content stays clear. So the
    anchor is the surface: put a bar’s background on the anchor (with its{' '}
    <code>className</code>), and space its content inside it.
  </>,
];

// The content layer's: also `auto` (its default), by what it holds.
const contentSafeAreaRow: PropRow = [
  'safeArea',
  union('auto', 'all', 'block', 'inline', 'none'),
  code(union('auto')),
  <>
    Which safe area insets it keeps clear, as padding. The values are an
    anchor’s (all, block, inline or none), plus <code>auto</code>, which decides
    by what it holds:
    <ul>
      <li>
        Its content itself (for example a list after a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ): all. Its content starts clear of the status bar and the home
        indicator, and scrolls on under them. Its paddings don’t count them
        again.
      </li>
      <li>
        A direct child that scrolls on its own (a{' '}
        <a href={publicUrl('page')}>Page</a>, a{' '}
        <a href={publicUrl('header')}>Header</a> around one, a{' '}
        <a href={publicUrl('layout')}>Layout</a>, a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>, for example a{' '}
        <a href={publicUrl('tab-bar')}>Tab bar</a>’s panel rendered as one):
        none. That child fills the screen, under the status bar too, and its own
        bars and paddings keep its content clear. Kept clear here, it would stop
        short at the insets instead.
      </li>
    </ul>
    Set it to decide yourself, whatever it holds. For example, <code>none</code>{' '}
    for content behind the status bar.
  </>,
];

const anchorHandleRow: PropRow = [
  'handle',
  'ViewportAnchorHandle',
  undefined,
  <>
    A handle (
    <PartLink
      component="viewport"
      part="Viewport.createAnchorHandle"
    />
    , or{' '}
    <PartLink
      component="viewport"
      part="useCreateViewportAnchorHandle"
    />{' '}
    in a component) that links it to the{' '}
    <PartLink
      component="viewport"
      part="Viewport.Padding"
    />
    s given the same handle (in their <code>anchor</code>, alone or with
    others). Such a padding is as tall as this anchor, or as the tallest of the
    anchors it’s linked to.
  </>,
];

const anchorKeyboardRow: PropRow = [
  'keyboard',
  union('push', 'cover'),
  code(union('push')),
  <>
    At the block end: pushed up by the on-screen keyboard (for example a message
    field), or covered by it (for example a tab bar). It has no effect at the
    other edges: side anchors always end at the keyboard’s top.
  </>,
];

const edgeEffectRow: PropRow = [
  'edgeEffect',
  union('soft', 'hard', 'none'),
  code(union('soft')),
  <>
    At the block start or end: what shows where content scrolls under it.{' '}
    <code>soft</code> is a blur that fades out away from the edge.{' '}
    <code>hard</code> is a solid backing with a dividing line. The backing isn’t
    tinted: it takes the scroller’s own background color, following it as it
    changes, so it matches the page (the system background if the scroller has
    none).
    <br />
    The effect is drawn by the scroller beneath (a{' '}
    <a href={publicUrl('page')}>Page</a>, a sheet’s content, the{' '}
    <PartLink
      component="viewport"
      part="Viewport.Content"
    />
    ), one per edge. It’s as tall as the tallest anchor at that edge, and also
    reaches under what’s stuck to it (
    <PartLink
      component="viewport"
      part="useViewportEdgeElement"
    />
    ).
    <br />
    On iOS 27, a bar at the screen’s top defaults to <code>hard</code>. That
    applies when <code>isIos27</code> is set (the app’s head starts the page
    below the status bar, see{' '}
    <a href={publicUrl('ios-quirks#the-status-bar-blur')}>iOS Quirks</a>), and
    not inside a sheet, popover, island or portal container. Its untinted
    backing then has the status bar’s color, which iOS reads once from the page
    as the app loads. If the page’s background changes later, the backing stays
    solid even at rest.
    <br />
    How much content shows through: a <code>soft</code> effect is solid under
    half of it and fades out past that. A veil (
    <code>--uikit-viewport-edge-veil</code>, 0 to 1, set on the scroller or
    above) makes it solid under that share of the anchor instead. The heavier
    the veil, the less shows. A sheet’s veil is <code>0.75</code>.
  </>,
];

const edgeTintRow: PropRow = [
  'edgeTint',
  'string',
  undefined,
  <>
    At the block start or end: a CSS color for its edge effect, shown at rest
    too. Use it to signal a temporary state, such as recording. A{' '}
    <code>soft</code> effect shows it under its fade, a <code>hard</code> one as
    its backing. Changes crossfade. Don’t make it the only sign of the state:
    pair it with a label or a symbol.
  </>,
];

export const viewportProviderRows: readonly PropRow[] = [
  [
    'scroller',
    'RefObject<HTMLElement | null>',
    'the page filling its screen, or the document’s scrolling element',
    <>
      The scroll container to track. Unset, it tracks the scroller that fills
      its screen, or else the document. That’s a{' '}
      <a href={publicUrl('page')}>Page</a> or a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Content"
      />
      , registered as they mount. When several fill it, the innermost wins,
      updated as pages show and hide (a tab’s, for example). An overlay’s
      content never counts: not a popover’s, a sheet’s or an island’s, nor
      anything inside them. Its direction and edges feed{' '}
      <PartLink
        component="viewport"
        part="useViewportScroll"
      />{' '}
      and{' '}
      <PartLink
        component="viewport"
        part="useScrollDirection"
      />
      . In browsers where it doesn’t bounce by itself (anything but Safari), a
      pull past an end moves it along only while a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Overscroll"
      />{' '}
      is shown. Otherwise, the browser’s own scrolling is left alone.
    </>,
  ],
  [
    'scrollsToTop',
    'boolean',
    code('true'),
    <>
      When the status bar is tapped, the current scroller (
      <PartLink
        component="viewport"
        part="useCurrentScroller"
      />
      ) scrolls smoothly to its top, as in native iOS apps. This works only on
      iOS, in a Home Screen app, for a provider of the window (no{' '}
      <code>screen</code>), and while the app’s document doesn’t scroll itself
      (see{' '}
      <PartLink
        component="viewport"
        part="trackStatusBarTaps"
      />
      ).
    </>,
  ],
  [
    'screen',
    'HTMLElement | RefObject<HTMLElement | null> | null',
    'the provided portal container, or the window',
    <>
      The app’s screen, when it isn’t the window (for example a device frame on
      a page, as here). The provider then tracks the visual viewport within it:
      how much of its bottom the keyboard covers, and how far its top is
      scrolled away while the keyboard shows. The custom properties are set on
      it instead of the root element.
      <br />
      It’s measured against its layers’ containing block. That’s the window,
      unless the screen or an ancestor contains them (for example a{' '}
      <PartLink
        component="layout"
        part="Layout.Column"
      />
      ). It’s measured again when that block resizes. For example, inside an
      app’s content layer that shrinks above the keyboard, nothing is covered.
      <br />
      The screen gets an app’s background beneath its layers, as the window
      does. In a <a href={publicUrl('navigation')}>Navigation</a> stack, for
      example, the page below doesn’t show through as a new one slides in. A
      background of its own is kept.
      <br />
      By default, it’s the portal container from{' '}
      <code>PortalContainerContext</code>, which also holds the app’s popups.{' '}
      <code>null</code> means the window.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'The app, or the part of it that uses the hooks. It renders no element of its own.',
  ],
];

export const viewportBackgroundRows: readonly PropRow[] = [
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportContentRows: readonly PropRow[] = [
  [
    'keyboard',
    union('resize', 'overlay'),
    code(union('resize')),
    <>
      With the on-screen keyboard: resized to the space above it, so its end can
      scroll into view, or overlaid by it, still filling the layout viewport
      from its top.
    </>,
  ],
  contentSafeAreaRow,
  [
    'alwaysBounce',
    'boolean',
    'while it holds its content itself',
    <>
      Bounces even when its content fits: it always has at least 1px to scroll.
      A drag on it then rubber-bands the content layer while the bars stay put,
      instead of moving the document (on iOS, the whole app). <code>false</code>
      : only content taller than it scrolls. Unset, it bounces, except while a
      child scrolls on its own (a <a href={publicUrl('page')}>Page</a>, a{' '}
      <a href={publicUrl('header')}>Header</a> around one, a{' '}
      <a href={publicUrl('layout')}>Layout</a>, a{' '}
      <a href={publicUrl('navigation')}>Navigation</a>). Bouncing would move
      that child as a whole.
    </>,
  ],
  glassModeRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportAnchorRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    undefined,
    <>
      The edge it floats at (required): <code>block-start</code> (the top, for
      example a toolbar), <code>block-end</code> (the bottom, for example a tab
      bar), or an inline edge (the leading or trailing side, for example a
      compact sidebar; mirrored in right-to-left languages).
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
    'No effect at the top. It’s an anchor prop that only works at the block end.',
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
      Where it sits in its scroll container: at the start (
      <code>block-start</code>, for example under a header’s bar) or at the end
      (<code>block-end</code>, for example above a tab bar). It sets the scroll
      padding at that edge. Without an <code>anchor</code>, it makes room for
      the anchors at that edge in its scope, as tall as the tallest of them.
    </>,
  ],
  [
    'anchor',
    'ViewportAnchorHandle | ViewportAnchorHandle[] | null',
    <>all at its edge (in its scope)</>,
    <>
      The anchors it makes room for, by their handles (each anchor’s{' '}
      <code>handle</code>), instead of all anchors at its edge. Give one, or
      several (it’s then as tall as the tallest). For example, a toolbar but not
      a toast floating above it, or both, so the last rows stay clear of the
      toast. <code>null</code> makes room for no anchor at all, whatever is in
      its scope. Only its <code>margin</code> is left, for example for content
      meant to scroll under a bar while still keeping a gap to the edge.
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
      The gap between the content and its container’s edge, in addition to the
      anchors (px, or a CSS length). By default, it’s the library’s content
      margin, set by its tokens. Set it to override it for one padding (for
      example <code>0</code>).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportKeyboardAccessoryRows: readonly PropRow[] = [
  [
    'gap',
    'number',
    code('8'),
    <>
      How far above the keyboard it’s kept while lifted (px). Use more for a
      card that draws past its box while lifted, for example.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What’s typed into, with what belongs to it. For example, a field’s row.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportOverscrollRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end'),
    code(union('block-start')),
    <>
      Which end it appears past: the content’s start (<code>block-start</code>,
      for example to pull to refresh) or its end (<code>block-end</code>, for
      example to pull on to the next page).
    </>,
  ],
  [
    'anchor',
    'ViewportAnchorHandle | ViewportAnchorHandle[] | null',
    <>all at its edge (in its scope)</>,
    <>
      The bars it comes out from under, by their handles, instead of all bars at
      its edge. Give one, or several (it then starts at the tallest). This works
      like a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Padding"
      />
      ’s <code>anchor</code>. <code>null</code>: under no bar, starting at the
      screen’s edge (inside the safe area).
    </>,
  ],
  [
    'open',
    'boolean',
    code('false'),
    <>
      Keeps it shown at rest, for example while refreshing. The{' '}
      <PartLink
        component="viewport"
        part="Viewport.Padding"
      />{' '}
      at its edge makes room for it beyond the bars, and the content moves there
      (300ms). Once closed, the content moves back.
    </>,
  ],
  [
    'safeArea',
    union('all', 'block', 'inline', 'none'),
    code(union('all')),
    <>
      Which safe area insets it stays clear of while it’s pulled in: all, only
      the block ones (top and bottom), only the inline ones (left and right), or
      none. Where it isn’t kept clear, it also shows inside the inset (for
      example behind the status bar, like a refresh control). There it shows
      even at rest, just past the content’s end, so fade it by its progress (
      <code>--uikit-viewport-overscroll-progress</code>). When open, it rests
      clear of the inset all the same.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What shows past the end, for example an activity indicator or a hint. It inherits two custom properties: --uikit-viewport-overscroll (how far it’s pulled at its edge, px) and --uikit-viewport-overscroll-progress (0 to 1, relative to its own size; 1 when open).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

/** `useAnchorSize(edge, handle)`: its arguments. */
export const useAnchorSizeRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    undefined,
    'The edge whose tallest anchor it reads (in its scope).',
  ],
  [
    'handle',
    'ViewportAnchorHandle | ViewportAnchorHandle[] | null',
    undefined,
    'The anchors to read instead, by their handles: one, or several (it reads the tallest). null reads none, and returns 0.',
  ],
];

/** `useAnchorSize`: what it returns. */
export const useAnchorSizeReturnRows: readonly PropRow[] = [
  [
    '(return)',
    'number',
    undefined,
    'The tallest anchor’s size along its edge’s axis (px), without the safe area insets it keeps clear. It updates live, for example as a tab bar collapses. 0 without an anchor.',
  ],
];

/** `useVisualViewport()`: what it returns (`VisualViewportState`). */
export const useVisualViewportRows: readonly PropRow[] = [
  ['width', 'number', undefined, 'The visual viewport’s width (px).'],
  [
    'height',
    'number',
    undefined,
    'The visual viewport’s height (px). While the on-screen keyboard shows, it’s without the keyboard.',
  ],
  [
    'left',
    'number',
    undefined,
    'The visual viewport’s offset from the layout viewport’s left edge (px), for example while zoomed in.',
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
    'The on-screen keyboard’s height (px, rounded): the part of the fixed layers’ box the visual viewport doesn’t show at the bottom. 0 without a keyboard.',
  ],
  [
    'isHidden',
    'boolean',
    undefined,
    'Whether the page is hidden (the Page Visibility API): in another tab, or the app left, a Home Screen app’s too. Meanwhile, the other values are kept as they were, such as the keyboard’s height (the focus-shift guard focuses its field again when the page shows). Once the page is shown and the keyboard has settled, they’re read again.',
  ],
];

const thresholdRow: PropRow = [
  'options.threshold',
  'number',
  code('8'),
  'How far to scroll from where the direction last turned before it changes (px), so jitter doesn’t flip it. More gives a steadier direction. Overscrolling, such as bouncing back from an end, never changes it.',
];

/** `useViewportScroll(listener, options)`: its arguments. */
export const useViewportScrollRows: readonly PropRow[] = [
  [
    'listener',
    '(event: ViewportScrollEvent) => void',
    undefined,
    'Called on every scroll of the tracked scroll container, and while it’s overscrolled. It can change between renders without resubscribing.',
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
    'The direction scrolled in, once past the threshold (none until then). Overscrolling doesn’t change it.',
  ],
  ['atTop', 'boolean', undefined, 'Scrolled to the start, or past it.'],
  [
    'atBottom',
    'boolean',
    undefined,
    'Scrolled to the end, or past it (within 1px).',
  ],
  [
    'position',
    'number',
    undefined,
    'The scroll position (px), within the scroll range. While overscrolled, it’s the end it’s past.',
  ],
  [
    'overscroll',
    'number',
    undefined,
    'How far it’s pulled past an end (px), rubber-banded: negative past the start (for example to pull to refresh), positive past the end, 0 in between. In Safari, that’s its own bounce. Elsewhere, it’s a touch or a wheel pulling at an end, damped (a wheel more stiffly, to at most half the container’s height). There the content only moves along while a Viewport.Overscroll is shown. A wheel’s inertia never pulls: once the fingers lift (as the browser reports it, or as the deceleration shows), the pull goes back to where it was before the fling.',
  ],
  [
    'isHeld',
    'boolean',
    undefined,
    'Whether the overscroll is still held: by a touch, or by a wheel’s fingers until it goes quiet (150ms) or its inertia starts. Once released, it bounces back. That’s the moment to act, for example to start refreshing.',
  ],
];

/** `useCurrentScroller()`: what it returns. */
export const useCurrentScrollerRows: readonly PropRow[] = [
  [
    '(return value)',
    'Element | undefined',
    undefined,
    'The current scroller: the newest open popover’s body or sheet’s content, else an island’s content scrolled from its start, else the scroller the provider tracks. Outside a provider, undefined.',
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
  'The element, as it was first mounted. A later element in the ref isn’t observed.',
];

const scrollerRow: PropRow = [
  'options.scroller',
  'RefObject<HTMLElement | null>',
  'the viewport',
  'The scroll container whose box (inside its borders and scroll bars) is the visible area. Otherwise it’s the layout viewport. No provider needed.',
];

/** `useElementVisibility(ref, options)`: its arguments. */
export const useElementVisibilityRows: readonly PropRow[] = [
  elementRefRow,
  [
    'options.threshold',
    'number',
    code('0'),
    'How much of the element must be visible to count (0–1). 0 counts any of it, even an edge.',
  ],
  [
    'options.rootMargin',
    'string',
    code(union('0px')),
    <>
      Grows the visible area, or shrinks it with negative values, as CSS
      margins. For example, <code>&apos;100% 0px&apos;</code> adds a screen
      above and below, to prepare what’s about to scroll in.
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
      Whether the element is visible, as an <code>IntersectionObserver</code>{' '}
      reports it. It re-renders only when that changes. <code>false</code> until
      the first report, and on the server.
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
    'Called with the element’s geometry (below) each time it’s measured: when it mounts, and once per frame while anything scrolls or resizes. That happens only while it’s visible, plus once as it leaves. The listener can change without resubscribing. Nothing re-renders unless the listener causes it (for example by setting state).',
  ],
  scrollerRow,
];

/** `useElementGeometry()`'s listener: what it's called with (`ElementGeometry`). */
export const elementGeometryRows: readonly PropRow[] = [
  [
    'top',
    'number',
    undefined,
    'The distance from the visible area’s top edge to the element’s (px). Positive while the element’s edge is inside the area, negative once it’s past.',
  ],
  ['right', 'number', undefined, 'The same, from the right edge (px).'],
  ['bottom', 'number', undefined, 'The same, from the bottom edge (px).'],
  ['left', 'number', undefined, 'The same, from the left edge (px).'],
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
      Measured once per frame while it, or anything around it, scrolls or
      resizes. That happens only while it’s visible, plus once as it leaves.{' '}
      <code>undefined</code> until it’s measured, and on the server.
    </>,
  ],
];

/** `preventInputZoom()`, `preventFocusShift()`: what they return. */
const releaseRow: PropRow = [
  '(return)',
  '() => void',
  undefined,
  'Removes the guard. Only the first call counts.',
];

export const preventInputZoomRows: readonly PropRow[] = [releaseRow];

/** `trackStatusBarTaps(onTap)`: its argument. */
export const trackStatusBarTapsArgumentRows: readonly PropRow[] = [
  [
    'onTap',
    '(event: Event) => void',
    undefined,
    'Called when the status bar is tapped, with the document’s scroll event.',
  ],
];

/** `trackStatusBarTaps(onTap)`: what it returns. */
export const trackStatusBarTapsRows: readonly PropRow[] = [
  [
    '(return)',
    '() => void',
    undefined,
    'Stops calling it. When the last caller stops, the document is restored.',
  ],
];

export const useStatusBarTapsRows: readonly PropRow[] = [
  ...trackStatusBarTapsArgumentRows,
  [
    'enabled',
    'boolean',
    code('true'),
    'Whether it’s called while the component is mounted. The latest `onTap` is used.',
  ],
];

export const useInputZoomPreventionRows: readonly PropRow[] = [
  [
    'enabled',
    'boolean',
    code('true'),
    'Whether the guard is active while the component is mounted.',
  ],
];

export const useFocusScrollRows: readonly PropRow[] = [
  [
    'ref',
    'RefObject<HTMLElement | null>',
    undefined,
    'The element to mark (with data-viewport-focus-scroll): a scroller, or something around text fields.',
  ],
  [
    'mode',
    `${union('target', 'none')} | false`,
    code(union('target')),
    'What it means for the text fields inside it. The nearest marked element around a field decides. target: this scroller keeps them in view above the keyboard. none: they’re left as they are (for example when a component places them itself). false: no mark.',
  ],
];

export const preventFocusShiftRows: readonly PropRow[] = [
  [
    'target',
    'Document | HTMLElement',
    code('document'),
    'Where it works: text fields inside it are focused without scrolling when touched. A field focused as the page hides is focused again when it shows.',
  ],
];

export const preventFocusShiftReturnRows: readonly PropRow[] = [releaseRow];

export const useFocusShiftPreventionRows: readonly PropRow[] = [
  [
    'target',
    'RefObject<HTMLElement | null>',
    'the document',
    'Where it works: text fields inside it are focused without scrolling when touched. A field focused as the page hides is focused again when it shows.',
  ],
  [
    'enabled',
    'boolean',
    code('true'),
    'Whether the guard is active while the component is mounted.',
  ],
];

export const preventTextActionsRows: readonly PropRow[] = [
  [
    'target',
    'HTMLElement',
    undefined,
    'Where a held press selects no text and shows no browser text menu. It sets user-select and -webkit-touch-callout to none.',
  ],
];

export const preventTextActionsReturnRows: readonly PropRow[] = [
  [
    '(return)',
    '() => void',
    undefined,
    'Restores the element’s own values. Only the first call counts.',
  ],
];

export const useTextActionsPreventionRows: readonly PropRow[] = [
  [
    'target',
    'RefObject<HTMLElement | null>',
    undefined,
    'Where a held press selects no text and shows no browser text menu.',
  ],
  [
    'enabled',
    'boolean',
    code('true'),
    'Whether it applies while the component is mounted.',
  ],
];

export const useSizeClassReturnRows: readonly PropRow[] = [
  [
    '(returns)',
    union('compact', 'regular'),
    undefined,
    <>
      The window’s horizontal size class: <code>regular</code> from 768px (a
      tablet’s window), <code>compact</code> below (a phone’s). Before
      hydration, during server rendering, it’s <code>compact</code>.
      <br />
      It holds its value while iPadOS resizes the window for the app switcher’s
      snapshots. The page is still showing then, and switching its layout would
      remount it. iPadOS announces each such resize with an orientation change
      that contradicts the window’s shape. The value is held until the screen
      turns to match the window, the window is back at its size, or the page is
      shown anew. A real rotation or resize (for example Split View) changes it.
    </>,
  ],
];

export const useViewportEdgeElementRows: readonly PropRow[] = [
  [
    'ref',
    'RefObject<HTMLElement | null>',
    undefined,
    'What sticks to the edge’s bars, for example a sticky search field below the top bar.',
  ],
  [
    'edge',
    union('block-start', 'block-end'),
    undefined,
    'The edge whose bars it sticks to.',
  ],
];
