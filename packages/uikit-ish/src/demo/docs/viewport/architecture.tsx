import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/viewport/architecture` and its sub-pages: how Viewport is built, and
// what flows into it.

const treeCode = `<html data-uikit-viewport-window
      style="--uikit-viewport-height: 874px; --uikit-viewport-keyboard-inset: 0px; …">
  <body>
    <div class="uikit-viewport-background">…</div>      <!-- behind everything -->
    <div class="uikit-viewport-content" data-keyboard="resize"
         data-viewport-scroller>                         <!-- the content layer -->
      <!-- a page (Page.Root), or the content itself -->
    </div>
    <div class="uikit-viewport-anchor" data-edge="block-start">…</div> <!-- a bar -->
    <div class="uikit-viewport-anchor" data-edge="block-end" data-keyboard="push">…</div>
  </body>
</html>`;

const visualCode = `// readVisual, in short: the keyboard's inset is what it covers of the
// fixed layers' box (not innerHeight, which iOS may shrink), and only
// while something it's for has focus.
const height = visualViewport.height;
const top = visualViewport.offsetTop;
const keyboardInset = hasKeyboardFocus()
  ? Math.max(0, Math.round(fixedBottom() - height - top))
  : 0;
// Within a screen (e.g. a device's frame): what it covers of that screen.`;

const sections: readonly Section[] = [
  ['a-provider-and-its-screen', 'A provider and its screen'],
  ['layers', 'Layers'],
  ['the-tracked-scroller', 'The tracked scroller'],
  ['scroll-tracking-and-overscroll', 'Scroll tracking and overscroll'],
  ['the-size-class', 'The size class'],
  ['elements-in-view', 'Elements in view'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/viewport/architecture`: how it's built, and what flows into it. */
export const ViewportArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Viewport lays an app out in fixed layers over the visual viewport.
        There’s a content layer that scrolls, bars anchored to its edges, and a
        background. Viewport measures the visual viewport and the keyboard,
        tracks the scroller in front, and exposes all of that as custom
        properties and hooks. Its sub-systems have pages of their own:{' '}
        <a href={publicUrl('viewport/architecture/padding')}>Padding</a>,{' '}
        <a href={publicUrl('viewport/architecture/edge-effects')}>
          Edge effects
        </a>
        , <a href={publicUrl('viewport/architecture/keyboard')}>Keyboard</a> and{' '}
        <a href={publicUrl('viewport/architecture/status-bar')}>Status bar</a>.
        To learn how to use it, see its{' '}
        <a href={publicUrl('viewport/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-provider-and-its-screen"
      level={2}
    >
      A provider and its screen
    </Heading>
    <ul>
      <li>
        <PartLink part="Viewport.Provider" /> measures the visual viewport
        whenever it changes, at most once a frame. It measures its size and
        offset, the keyboard’s inset, and whether the page is hidden. These are
        set as custom properties on the root element, and returned by{' '}
        <PartLink part="useVisualViewport" />.
      </li>
      <li>
        The provider’s screen is the window, or an element of your app’s, such
        as a device’s frame on a page of demos. That element is the provider’s
        own <code>screen</code>, or the provided portal container.
      </li>
      <li>
        In a screen, the measures are the screen’s own, such as what the
        keyboard covers of it. They’re taken against a hidden box that fills the
        containing block of the screen’s fixed layers.
      </li>
      <li>
        That box can resize, for example inside a content layer that’s resized
        above the keyboard. Then the layers follow the box, without their own
        keyboard transition.
      </li>
      <li>
        While it’s mounted, the provider marks the window or the screen as an
        app’s, for its background beneath the layers. In a Home Screen app, it
        makes the document as tall as the screen.
      </li>
      <li>
        While the page is hidden, the measures are kept as they were. They’re
        read again once the page has been shown for a moment.
      </li>
    </ul>
    <CodeView code={visualCode} />

    <Heading
      id="layers"
      level={2}
    >
      Layers
    </Heading>
    <ul>
      <li>
        <PartLink part="Viewport.Content" /> fills the screen and scrolls the
        content, below the anchors. By default, the keyboard resizes it so it
        ends above the keyboard. It can also let the keyboard cover it.
      </li>
      <li>
        The content layer keeps the safe area clear as padding: on all sides,
        along one axis, or not at all. With <code>auto</code>, what it holds
        decides.
      </li>
      <li>
        It publishes the sizes of its scope’s bars at its top and bottom as
        custom properties. Content inside it can use them, such as a map’s
        controls.
      </li>
      <li>
        <PartLink part="Viewport.Anchor" /> floats above the content at an edge.
        It can be a bar at the top or the bottom, or a compact sidebar at the
        side. <PartLink part="Viewport.BlockStart" /> and{' '}
        <PartLink part="Viewport.BlockEnd" /> are anchors at the top and the
        bottom.
      </li>
      <li>
        Each anchor registers its size and its edge effect in its scope (see{' '}
        <a href={publicUrl('viewport/architecture/padding')}>Padding</a>). By
        default, the keyboard pushes a bottom anchor up onto itself.
      </li>
      <li>
        <PartLink part="Viewport.Background" /> sits behind everything and fills
        the screen. It doesn’t scroll, and the keyboard doesn’t move it. It can
        hold a picture, a map or a video, which shows wherever nothing in front
        paints.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="the-tracked-scroller"
      level={2}
    >
      The tracked scroller
    </Heading>
    <ul>
      <li>
        Pages scroll on their own. The content layer, a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        , and a sheet’s or an island’s content each register as scrollers.
      </li>
      <li>
        Without a <code>scroller</code> from your app, the provider tracks the
        shown scroller that fills its screen. Of nested scrollers, it tracks the
        innermost. It checks again whenever scrollers are registered, resized,
        shown or hidden, for example when a tab’s page shows.
      </li>
      <li>
        An overlay’s scroller, such as a popover’s body or a sheet’s content,
        never fills a provider’s screen.
      </li>
      <li>
        <PartLink part="useCurrentScroller" /> returns what the user is looking
        at, by layers, not by size. That’s the last overlay opened, or else an
        island’s content scrolled away from its start, or else the tracked page.
        A tap on the status bar scrolls it to its top (see{' '}
        <a href={publicUrl('viewport/architecture/status-bar')}>Status bar</a>).
      </li>
    </ul>

    <Heading
      id="scroll-tracking-and-overscroll"
      level={2}
    >
      Scroll tracking and overscroll
    </Heading>
    <ul>
      <li>
        The provider emits the tracked scroller’s position, whether it’s at its
        top or bottom, and how far it’s pulled past an end.{' '}
        <PartLink part="useViewportScroll" /> listeners receive these.
      </li>
      <li>
        Each listener works out its own direction, past its own threshold, so
        jitter doesn’t flip it. When another scroller is tracked, every
        direction starts again. <PartLink part="useScrollDirection" />{' '}
        re-renders when these values change.
      </li>
      <li>
        Overscroll is Safari’s own bounce, where the position goes past an end.
      </li>
      <li>
        Where browsers keep the position in range, touches and wheels pulling at
        an end are rubber-banded in script instead. A wheel is stiffer than a
        finger. When you release, the pull bounces back over 350ms.
      </li>
      <li>
        A wheel’s inertia never pulls. The wheel-gestures library tells inertia
        apart. If it only does that after a few deltas, the pull goes back to
        where the fling began.
      </li>
      <li>
        <PartLink part="Viewport.Overscroll" /> shows past an end as you pull.
        The pull and its progress are custom properties.
      </li>
      <li>
        While an overscroll area is mounted, a scroller other than the document
        is moved along by the pull, because otherwise nothing would move. Over
        the document, the area slides in over the content instead. When it’s
        open, it stays shown, and the padding makes room for it.
      </li>
    </ul>

    <Heading
      id="the-size-class"
      level={2}
    >
      The size class
    </Heading>
    <ul>
      <li>
        <PartLink part="useSizeClass" /> is the window’s size class. It’s
        regular from 768px wide, and compact below that, and before hydration.
        It needs no provider.
      </li>
      <li>
        iPadOS resizes the window for its app switcher’s snapshots while the
        page is still shown. That would remount layouts.
      </li>
      <li>
        So an <code>orientationchange</code> that contradicts the window’s shape
        holds the size class. It holds until a real rotation, until the window
        is back at its size, or until the page is shown again. There’s no timer.
      </li>
      <li>
        This only happens on iPadOS. Elsewhere, such a contradiction would hold
        the size class for good (see{' '}
        <a href={publicUrl('ios-quirks#app-switcher-snapshots')}>iOS Quirks</a>
        ).
      </li>
    </ul>

    <Heading
      id="elements-in-view"
      level={2}
    >
      Elements in view
    </Heading>
    <ul>
      <li>
        <PartLink part="useElementVisibility" /> is an intersection observer
        against the viewport or a scroller.
      </li>
      <li>
        <PartLink part="useElementGeometry" /> reports the distances of an
        element’s edges, and how much of it shows. It reports once a frame while
        anything scrolls or resizes, but only while the element is visible, plus
        once more as it leaves. It doesn’t re-render by itself.
      </li>
    </ul>

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From the browser:</strong> the Visual Viewport and Page
        Visibility APIs, wheel gestures, and the safe area insets.
      </li>
      <li>
        <strong>From the app:</strong> its screen, its scroller and its layers.
      </li>
      <li>
        <strong>Out:</strong> almost every component uses it. Bars and sheets
        anchor to it. Pages scroll and register with it. Popups take the
        keyboard’s inset and its keyboard accessory. Layouts and navigations
        make scopes. Tab bars collapse by the scroll direction.
      </li>
    </ul>
  </>
);

const storeCode = `// A scope's store, in short: its anchors' sizes, measured by one
// observer all at once, so one bar shown as another hides never leaves
// none in between; a child scope counts its parent's too.
size: (edge, handles) => {
  const matching = entries().filter(
    (entry) => entry.kind === 'anchor' &&
      (handles ? handles.includes(entry.handle) : entry.edge === edge),
  );
  return Math.max(0, ...matching.map((entry) => entry.size));
},`;

const paddingSections: readonly Section[] = [
  ['room-for-the-bars', 'Room for the bars'],
  ['scopes', 'Scopes'],
  ['anchors-by-handle', 'Anchors by handle'],
  ['scroll-padding', 'Scroll padding'],
];

/** `/viewport/architecture/padding`: room for the bars. */
export const ViewportPaddingArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={paddingSections} />
    <ul className="demo-lead">
      <li>
        Content scrolls under the bars that float over it. So it needs room at
        its ends to scroll out from under them. Beyond that, it needs the
        content margin, which is the library’s gap, so components never space
        themselves (<code>padding.tsx</code>). For the rest of Viewport, see its{' '}
        <a href={publicUrl('viewport/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="room-for-the-bars"
      level={2}
    >
      Room for the bars
    </Heading>
    <ul>
      <li>
        A <PartLink part="Viewport.Padding" /> at a scroller’s edge is as tall
        as the tallest anchor at that edge in its scope. It follows that height
        as it changes, for example as a tab bar collapses.
      </li>
      <li>
        It adds the open overscroll areas at that edge, and the content margin,
        unless <code>margin</code> overrides it. With <code>anchor</code> set to{' '}
        <code>null</code>, it’s only the margin.
      </li>
      <li>
        An anchor measures its content box along its edge’s axis. That leaves
        out the safe area inset it keeps clear, because scrollers keep that
        clear themselves.
      </li>
      <li>
        An anchor is measured at once when it’s added, not only by the resize
        observer. On iOS, the observer’s first report only comes after the first
        paint.
      </li>
      <li>
        <PartLink part="useAnchorSize" /> reads the same size, for things that
        aren’t a padding.
      </li>
    </ul>

    <Heading
      id="scopes"
      level={2}
    >
      Scopes
    </Heading>
    <ul>
      <li>
        Anchors register where they’re fixed to. That’s the screen, meaning the
        window or a provided portal container. Or it’s an element that contains
        fixed layers, such as a{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        , or a sheet’s, popover’s or island’s popup. Each of those provides a
        scope of its own.
      </li>
      <li>
        One observer measures all the sizes in a scope at once. So when one bar
        shows as another hides, such as a tab’s panel’s bar, there’s never a
        moment without either.
      </li>
      <li>
        A navigation’s page has a child scope. It holds the page’s own anchors,
        not those of its hidden siblings. The outer scope’s anchors count too,
        such as a tab bar around the navigation.
      </li>
    </ul>
    <CodeView code={storeCode} />

    <Heading
      id="anchors-by-handle"
      level={2}
    >
      Anchors by handle
    </Heading>
    <ul>
      <li>
        <PartLink part="Viewport.createAnchorHandle" /> links paddings to
        particular anchors. You give the handle to an anchor, and to the
        paddings that should follow it, alone or along with others.
      </li>
      <li>
        A padding with handles is as tall as the tallest of the linked anchors,
        whatever else is at its edge.
      </li>
    </ul>

    <Heading
      id="scroll-padding"
      level={2}
    >
      Scroll padding
    </Heading>
    <ul>
      <li>
        While it’s mounted, a padding sets its scroll container’s scroll padding
        at its edge: its own padding plus its height. So moving focus and{' '}
        <code>scrollIntoView</code> stop clear of the bars, not behind them.
      </li>
      <li>
        The same length is a custom property, for example for a sheet’s mask
        that fades content out under its header.
      </li>
      <li>
        The bottom anchor that the keyboard pushes up is tracked separately,
        because it sits on the keyboard while the keyboard shows (see{' '}
        <a href={publicUrl('viewport/architecture/keyboard')}>Keyboard</a>).
      </li>
    </ul>
  </>
);

const edgeSections: readonly Section[] = [
  ['drawn-by-the-scroller', 'Drawn by the scroller'],
  ['soft-and-hard', 'Soft and hard'],
  ['beyond-the-bars', 'Beyond the bars'],
];

/** `/viewport/architecture/edge-effects`: scroll edge effects. */
export const ViewportEdgeEffectsArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={edgeSections} />
    <ul className="demo-lead">
      <li>
        A scroll edge effect shows under a bar as content scrolls beneath it.
        The bars ask for it, and the scroller draws it (
        <code>edge-effect.tsx</code>, <code>edge.ts</code>). For the rest of
        Viewport, see its{' '}
        <a href={publicUrl('viewport/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="drawn-by-the-scroller"
      level={2}
    >
      Drawn by the scroller
    </Heading>
    <ul>
      <li>
        Each scroller renders its own edge effects: the content layer, a page,
        or a sheet’s or popover’s content. There’s one at each end where its
        scope’s anchors have an effect. It’s fixed at that edge beneath them,
        and as tall as the tallest.
      </li>
      <li>
        Only one effect shows at an edge, however many anchors stack there. None
        shows while the scroller holds another scroller that draws its own, such
        as the content layer holding a page.
      </li>
      <li>
        The effect shows as content scrolls under the bars. Its progress runs
        from 0 to 1 over the first stretch past the start, or the last stretch
        before the end.
      </li>
      <li>
        A scroll listener measures that progress. A scroll-driven animation
        there would end the scroller’s fling in Chrome.
      </li>
      <li>
        An anchor’s <code>edgeTint</code> shows at rest too.
      </li>
    </ul>

    <Heading
      id="soft-and-hard"
      level={2}
    >
      Soft and hard
    </Heading>
    <ul>
      <li>
        An anchor’s <code>edgeEffect</code> is soft by default, which is a blur
        that fades out. It can also be hard, which is a solid backing with a
        dividing line.
      </li>
      <li>
        An edge is hard if any anchor there is hard. It’s tinted by the first
        tinted anchor.
      </li>
      <li>
        A hard backing is the scroller’s own background, read from it whenever
        it changes, so it matches the page. When the scroller has none, it’s the
        system background.
      </li>
      <li>
        On iOS 27, a bar at the top of the screen defaults to a hard effect,
        with the status bar’s color as its backing (see{' '}
        <a href={publicUrl('viewport/architecture/status-bar')}>Status bar</a>).
      </li>
    </ul>

    <Heading
      id="beyond-the-bars"
      level={2}
    >
      Beyond the bars
    </Heading>
    <ul>
      <li>
        Something stuck to a bar can register with{' '}
        <PartLink part="useViewportEdgeElement" />, such as a header’s accessory
        stuck below it.
      </li>
      <li>
        While it’s stuck, the edge effect reaches beyond the bar to cover it
        too. That length is a custom property, measured as the scroller scrolls.
      </li>
    </ul>
  </>
);

const accessoryCode = `// KeyboardAccessory, in short: while focus is its own and the keyboard
// covers it, lifted until its end is \`gap\` above the keyboard and any bar
// pushed onto it; once what's around it has settled (two frames unmoved).
const keyboardTop = visualViewport.offsetTop + visualViewport.height - pushed;
const lift = Math.max(0, Math.round(unlifted(element) + gap - keyboardTop));
element.style.setProperty('--uikit-viewport-keyboard-lift', \`\${lift}px\`);`;

const keyboardSections: readonly Section[] = [
  ['measuring-the-keyboard', 'Measuring the keyboard'],
  ['pushed-resized-or-overlaid', 'Pushed, resized or overlaid'],
  ['keyboard-accessories', 'Keyboard accessories'],
  ['fields-kept-in-view', 'Fields kept in view'],
  ['ios-guards', 'iOS guards'],
];

/** `/viewport/architecture/keyboard`: the keyboard and text fields. */
export const ViewportKeyboardArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={keyboardSections} />
    <ul className="demo-lead">
      <li>
        The on-screen keyboard is measured from the visual viewport, and each
        layer decides how it meets the keyboard. Fields are kept in view by
        their own scroller, never by the browser moving the layout viewport. For
        the rest of Viewport, see its{' '}
        <a href={publicUrl('viewport/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="measuring-the-keyboard"
      level={2}
    >
      Measuring the keyboard
    </Heading>
    <ul>
      <li>
        The keyboard’s inset is how much of the window’s fixed layers it covers.
        Those layers are measured by a hidden box, made once on the root, that’s
        fixed and fills the screen.
      </li>
      <li>
        <code>innerHeight</code> isn’t used, because iOS may shrink it to the
        visual viewport while the fixed layers stay as tall.
      </li>
      <li>
        The inset only counts while something the keyboard is for has focus: a
        text field, or a select, also in shadow roots. A Home Screen app that’s
        resumed reads its visual viewport as shrunk for a while, even with no
        keyboard.
      </li>
    </ul>

    <Heading
      id="pushed-resized-or-overlaid"
      level={2}
    >
      Pushed, resized or overlaid
    </Heading>
    <ul>
      <li>
        A bottom anchor with <code>keyboard</code> set to <code>push</code>, the
        default, sits on the keyboard. It follows the keyboard by a transition,
        or with none under reduced motion. Its safe area inset shrinks by what
        the keyboard covers.
      </li>
      <li>
        The content layer with <code>resize</code>, the default, ends above the
        keyboard. With <code>overlay</code>, the keyboard covers it.
      </li>
      <li>
        A <a href={publicUrl('sheet/architecture#the-keyboard')}>Sheet</a> and
        an <a href={publicUrl('island/architecture#the-keyboard')}>Island</a>{' '}
        lift themselves with the keyboard, in step with the anchors.
      </li>
    </ul>

    <Heading
      id="keyboard-accessories"
      level={2}
    >
      Keyboard accessories
    </Heading>
    <ul>
      <li>
        <PartLink part="Viewport.KeyboardAccessory" /> keeps what you’re typing
        into above the keyboard, such as a field’s row with its slider, or a
        whole popover.
      </li>
      <li>
        While focus is inside it and the keyboard covers it, it’s lifted by a
        translation. It moves up until its end is <code>gap</code> above the
        keyboard, and above any bar pushed onto the keyboard. When focus leaves,
        it goes back down.
      </li>
      <li>
        It only lifts once what’s around it has settled, meaning it hasn’t moved
        for two frames. So a sheet that the keyboard lifts itself doesn’t lift
        it twice.
      </li>
      <li>
        Its own translation is left out of the measurement, even in the middle
        of a transition.
      </li>
      <li>
        When accessories are nested, the innermost one around the focused
        element lifts. Fields inside an accessory aren’t scrolled into view,
        because the accessory places them itself.
      </li>
    </ul>
    <CodeView code={accessoryCode} />

    <Heading
      id="fields-kept-in-view"
      level={2}
    >
      Fields kept in view
    </Heading>
    <ul>
      <li>
        A field you type into is scrolled into view above the keyboard by its
        scroller. That happens once the keyboard has shown and everything has
        settled, not as the field is focused.
      </li>
      <li>
        It happens again when focus moves to another field, and as you type,
        until you scroll the field away yourself.
      </li>
      <li>
        The scroller is the nearest marked one around the field (
        <PartLink part="useFocusScroll" />
        ). The content layer, a page, and a sheet’s or an island’s content
        scroll their fields. A keyboard accessory marks its fields as placed
        instead.
      </li>
      <li>
        No other scroller is ever used, because <code>scrollIntoView</code>{' '}
        would scroll all of them, and the layout viewport too.
      </li>
      <li>
        The visible part of the scroller is its box, less its scroll padding,
        above the keyboard and above any bar pushed onto the keyboard.
      </li>
    </ul>

    <Heading
      id="ios-guards"
      level={2}
    >
      iOS guards
    </Heading>
    <ul>
      <li>
        <PartLink part="useFocusShiftPrevention" /> focuses a field you touch
        without scrolling. That includes a field touched just beside it, since
        iOS adjusts a touch to the nearest control. While the field’s keyboard
        shows, it also undoes iOS’s scroll that reveals the field.
      </li>
      <li>
        After the iPadOS hide key, a tap on the field is left to iOS, because no
        focus from code shows the keyboard again (see{' '}
        <a href={publicUrl('ios-quirks#keyboard-focus-shift')}>iOS Quirks</a>).
      </li>
      <li>
        <PartLink part="useInputZoomPrevention" /> sets the viewport’s largest
        scale to 1 while it’s held. So focusing a field with a font smaller than
        16px doesn’t zoom in. Pinch zoom still works.
      </li>
      <li>
        <PartLink part="useTextActionsPrevention" /> keeps a held press from
        selecting text and showing the text menu.
      </li>
      <li>On other platforms, these guards do nothing.</li>
    </ul>
  </>
);

const statusCode = `// The status bar, in short: in a Home Screen app, the document is 1px
// taller than the screen and parked at 1px. Scrolled to its top with no
// finger down, at the size it was parked at, that's a tap.
const onScroll = (event) => {
  if (touches > 0) return;
  if (scrollY < 0.5) {
    if (sizeOf() === parked) for (const listener of listeners) listener(event);
    park();                                  // scrollTo({ top: 1 })
  } else if (scrollY > 1.5) {
    park();
  }
};`;

const statusSections: readonly Section[] = [
  ['taps-on-the-status-bar', 'Taps on the status bar'],
  ['below-the-status-bar', 'Below the status bar'],
];

/** `/viewport/architecture/status-bar`: the status bar. */
export const ViewportStatusBarArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={statusSections} />
    <ul className="demo-lead">
      <li>
        In a Home Screen app, the status bar belongs to the system, and the page
        gets no touch there. Viewport catches a tap on it to scroll the current
        scroller to its top. On iOS 27, it also starts the app below the status
        bar (<code>status-bar.ts</code>, <code>ios27.ts</code>). For the rest of
        Viewport, see its{' '}
        <a href={publicUrl('viewport/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="taps-on-the-status-bar"
      level={2}
    >
      Taps on the status bar
    </Heading>
    <ul>
      <li>
        When you tap the status bar, iOS scrolls the document to its top, and
        does nothing else. An app built in layers doesn’t scroll its document,
        so there’s nothing to scroll.
      </li>
      <li>
        So while a provider tracks taps, the document is made 1px taller than
        the screen, and parked at a scroll of 1px.
      </li>
      <li>
        When it’s scrolled to its top with no finger down, that’s a tap. The tap
        is passed on, and the document is parked again.
      </li>
      <li>
        Any other scroll of the document, such as a drag that reaches it, is
        parked again at rest. When it’s scrolled to its top at a different size
        than when it was parked, as when the screen turns, that’s not a tap.
      </li>
      <li>
        A touch’s end is also caught on the element it touched. A removed
        element’s touch end doesn’t reach the window. Without this, a finger
        would count as down for good.
      </li>
      <li>
        The provider then scrolls the current scroller to its top, smoothly.
      </li>
      <li>
        This doesn’t happen outside a Home Screen app, where scrolling the
        document moves Safari’s toolbars. It also doesn’t happen for an app
        whose document scrolls, where iOS’s own tap works.
      </li>
      <li>
        A modal’s scroll lock on the document is undone meanwhile. Otherwise
        there’s no 1px to scroll.
      </li>
    </ul>
    <CodeView code={statusCode} />

    <Heading
      id="below-the-status-bar"
      level={2}
    >
      Below the status bar
    </Heading>
    <ul>
      <li>
        On iOS 27, a Home Screen app under a translucent status bar gets a blur
        over its top bar’s buttons and title. No element of the page can prevent
        it.
      </li>
      <li>
        So the app’s head decides first, by Safari’s version in the user agent,
        before Safari reads the status bar style. It uses the opaque default
        bar, and marks the document.
      </li>
      <li>
        When the document is marked, a bar at the top of the screen defaults to
        a hard edge effect. Its backing is the status bar’s color, which is the
        page’s background as it loaded, since iOS reads it once. That way, the
        two bars meet.
      </li>
      <li>
        Bars in a popup inset from the top, or in a portal container, aren’t at
        the top of the screen (see{' '}
        <a href={publicUrl('ios-quirks#the-status-bar')}>iOS Quirks</a>).
      </li>
    </ul>
  </>
);
