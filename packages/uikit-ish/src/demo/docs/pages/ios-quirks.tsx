import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { PageShell } from './shell.js';

// iOS's quirks that shape the library (each found on a device), why they
// happen as far as we know, and what an app and the library do about them.

const sections: readonly Section[] = [
  ['the-status-bar-blur', 'The status bar blur (iOS 27)'],
  ['moving-values-and-memory', 'Moving values and memory'],
  ['app-switcher-snapshots', 'App switcher snapshots (iPadOS)'],
  ['the-short-layout-viewport', 'A short layout viewport in Home Screen apps'],
  ['the-keyboard', 'The keyboard'],
  ['native-scrolling-and-touch', 'Native scrolling and touch'],
  ['mouse-events-after-a-long-press', 'Mouse events after a long press'],
  ['pressed-buttons-and-focus', 'Pressed buttons don’t take focus (Safari)'],
  ['dishonorable-mentions', '(Dis)honorable Mentions'],
];

const headCode = `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<script>
  // Right after the meta tag above, inline (not deferred, not a module):
  // Safari reads the status bar style as the head is parsed.
  (() => {
    const agent = navigator.userAgent;
    // (An iPad's user agent is a Mac's: told apart by touch.)
    const isIos =
      ['iPhone', 'iPad', 'iPod'].some((device) => agent.includes(device)) ||
      (agent.includes('Macintosh') && navigator.maxTouchPoints > 1);
    // (Safari's version, not the OS's: frozen in the user agent since iOS 26.)
    const version = Number(agent.split('Version/')[1]?.split('.')[0]);
    if (isIos && version >= 27) {
      document.documentElement.setAttribute('data-ios27', '');
      document
        .querySelector('meta[name=apple-mobile-web-app-status-bar-style]')
        ?.setAttribute('content', 'default');
    }
  })();
</script>`;

const appCode = `import { isIos27 } from '@mrpelz/uikit-ish';

// The head's finding, for your own logic: e.g. a hard edge where you
// set one yourself.
const edgeEffect = isIos27() ? 'hard' : 'soft';`;

const movingCode = `@property --drawer-progress {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

.drawer {
  transition: --drawer-progress 300ms;
}

/* The two elements that read it… */
.drawer > .handle,
.drawer > .panel {
  translate: 0 calc((1 - var(--drawer-progress)) * 100%);
}

/* …and everything else kept out of it. Below the readers, the value
   never changes, so nothing there is restyled while it moves. */
.drawer > :not(.handle, .panel),
.drawer > .handle > *,
.drawer > .panel > * {
  --drawer-progress: initial;
}`;

/** `/ios-quirks`: iOS's quirks that shape the library, and what to do. */
export const IosQuirksPage: FunctionComponent = () => (
  <PageShell
    path="ios-quirks"
    title="iOS Quirks"
  >
    <p className="demo-lead">
      A few things about iOS Safari aren’t written down anywhere and only show
      on a real device. Each one here shaped how the library is built. If you
      maintain the library, or build an app on it, this is what you need to know
      so you don’t undo the workaround by accident. Most were found on iOS 26;
      unless a section names a version, assume it still applies.
    </p>
    <Contents sections={sections} />

    <Heading
      id="the-status-bar-blur"
      level={2}
    >
      The status bar blur (iOS 27)
    </Heading>
    <p>
      On iOS 27, a Home Screen app whose page reaches under the status bar gets
      a blur over its top bar, and nothing in the page can prevent it. The way
      out is to start the app below the status bar, decided in the page’s head.
      The library follows that decision.
    </p>

    <Heading
      id="the-blur"
      level={3}
    >
      What you see
    </Heading>
    <p>
      With the status bar style <code>black-translucent</code>, where the page
      sits under the status bar as{' '}
      <a href={publicUrl('getting-started#as-a-pwa')}>Getting Started</a>{' '}
      recommends, iOS 27 draws a translucent white blur at the top of a Home
      Screen app. It reaches down past the status bar, over the top bar’s
      buttons and title, whatever the page’s colors are. In Safari itself, it’s
      only as tall as the status bar.
    </p>
    <p>
      The workarounds people report don’t help here. We tried a{' '}
      <code>position: fixed</code> element at the top with a background color:
      opaque and half transparent, as tall as the safe area and only a few
      pixels tall, narrower and wider, at the very top and a few pixels below.
      We also tried one painting nothing (<code>background-clip: text</code>),
      one fading into the bar’s edge effect, and one fading in as content
      scrolls under the bar. The blur stayed every time. The other status bar
      styles avoid it: with <code>default</code> and <code>black</code>, the
      system draws its own opaque bar above the page, so nothing of the page is
      under the status bar.
    </p>

    <Heading
      id="in-your-head"
      level={3}
    >
      In your head
    </Heading>
    <p>
      So on iOS 27, switch the status bar style to <code>default</code>, which
      follows light and dark mode (<code>black</code> doesn’t), and mark the
      document with <code>data-ios27</code> for the library. Everywhere else,
      keep <code>black-translucent</code>. This has to happen in the head, in an
      inline script right after the meta tag, before Safari reads it. Your app’s
      bundle runs too late.
    </p>
    <p>
      The script recognizes iOS 27 by Safari’s version (<code>Version/27</code>
      ), because since iOS 26 the OS version in the user agent is frozen (it
      reads <code>iPhone OS 18_7</code>). An iPad presents itself as a Mac, so
      the script tells it apart by its touch points.
    </p>
    <CodeView code={headCode} />
    <p>
      Your app can read the same finding with <code>isIos27()</code>, which
      checks the document’s mark (the attribute’s name is exported as{' '}
      <code>ios27Attribute</code>). For example, for an edge effect you set
      yourself:
    </p>
    <CodeView code={appCode} />

    <Heading
      id="the-status-bar"
      level={3}
    >
      The status bar’s color
    </Heading>
    <p>
      With <code>default</code>, the system draws an opaque status bar and the
      page starts below it. iOS takes the bar’s color from the page once, as the
      app loads: the background of the element at the top, not the document
      root’s. If the background changes later, or another page shows with a
      different one, the status bar keeps its first color until the app is
      loaded again.
    </p>

    <Heading
      id="blur-what-the-library-does"
      level={3}
    >
      What the library does
    </Heading>
    <p>
      When the document is marked, a top bar at the screen’s top (a{' '}
      <PartLink
        component="viewport"
        part="Viewport.BlockStart"
      />
      , or a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Anchor"
      />{' '}
      at the block start) gets a <code>hard</code> edge effect, unless you set
      its <code>edgeEffect</code> yourself. That gives a solid bar right below
      the system’s, not a blur fading into it. Bars in a{' '}
      <a href={publicUrl('sheet')}>Sheet</a>, a{' '}
      <a href={publicUrl('popover')}>Popover</a> or an{' '}
      <a href={publicUrl('island')}>Island</a> aren’t at the screen’s top and
      keep their own, as does anything in a portal container (like a device
      frame on this site). An <code>edgeEffect</code> you set always wins.
    </p>
    <p>
      The bar’s backing, when it isn’t tinted, uses the status bar’s color: the
      background behind the first page as it loaded (its own, or the nearest
      ancestor’s that paints one), so the two bars meet as one. While the page’s
      background still matches, the bar appears as content scrolls under it,
      with its line. Once the page’s background differs (it changed, another
      page is shown, or the color scheme switched), the bar stays solid at rest
      too, with its line dividing the bars from the page, the way a tinted bar
      does (<code>edgeTint</code>, see{' '}
      <a href={publicUrl('viewport')}>Viewport</a>).
    </p>

    <Heading
      id="testing"
      level={3}
    >
      Testing it
    </Heading>
    <p>
      iOS reads the status bar style when the app is added to the Home Screen.
      An app added before the update to iOS 27, or before your head changed,
      keeps its old style. Remove it and add it again.
    </p>

    <Heading
      id="moving-values-and-memory"
      level={2}
    >
      Moving values and memory
    </Heading>
    <p>
      If a custom property that many elements inherit changes on every frame of
      an animation, iOS’s WebKit holds on to memory from each of those restyles.
      Do that on every navigation and the tab gets killed after a few dozen
      visits. The library keeps its moving values on the few elements that read
      them. If you animate custom properties yourself, do the same.
    </p>

    <Heading
      id="what-you-see"
      level={3}
    >
      What you see
    </Heading>
    <p>
      Go back and forth between two pages of a{' '}
      <a href={publicUrl('navigation')}>Navigation</a> stack often enough, and
      the app reloads, or Safari shows its start page instead of the tab.
      There’s no error in the console. The device’s log (Console.app on a Mac,
      with the phone attached) shows a <code>JetsamEvent</code>: iOS killed the
      tab’s WebContent process for going over its memory limit
      (&ldquo;per-process-limit&rdquo;), at about 1.6 GB on an iPhone 15 Pro.
    </p>
    <p>
      Almost all of that memory is WebKit’s own native heap (the{' '}
      <code>bmalloc</code> tag in the log). The JavaScript heap stays small, the
      number of DOM nodes stays the same after each visit, and heap snapshots
      show that the pages are released. So nothing in the app’s code is holding
      on to them, and the usual leak hunt (heap snapshots, detached nodes,
      forgotten observers) finds nothing. On a Mac, Safari releases the memory,
      so it only shows on iOS.
    </p>

    <Heading
      id="why-it-happens"
      level={3}
    >
      Why it happens
    </Heading>
    <p>
      Navigation used to slide its pages by transitioning one registered
      property, <code>--uikit-navigation-progress</code>, on its root.
      Registered with <code>inherits: true</code>, every element on both moving
      pages got a new value on every frame of the slide, so each of them got a
      new computed style, about twenty times per push and again per pop. That’s
      a lot of work, but it should be thrown away right after. iOS’s WebKit
      keeps a good part of it.
    </p>
    <p>
      The cost grows with the number of elements, not with how big they are.
      Measured with Web Inspector’s Memory timeline (its “Page” category), per
      visit to one page and back:
    </p>
    <ul>
      <li>An empty page: about 17&nbsp;MB.</li>
      <li>The same empty page, three screens tall: the same.</li>
      <li>
        A page without a header or bar, only a back button: about 8&nbsp;MB.
      </li>
      <li>The kitchen sink’s Badge page: about 37&nbsp;MB.</li>
    </ul>
    <p>
      Values that change only once per navigation cost too, if they’re custom
      properties. The width and start position Navigation sets as a slide begins
      and removes as it ends still added about 5&nbsp;MB per visit to the Badge
      page. Inherited properties that aren’t custom properties didn’t seem to
      matter: toggling <code>visibility</code>, <code>pointer-events</code> or{' '}
      <code>inert</code> on whole pages made no measurable difference.
    </p>

    <Heading
      id="what-doesnt-work"
      level={3}
    >
      What doesn’t work: <code>inherits: false</code>
    </Heading>
    <p>
      The obvious fix is to register the property with{' '}
      <code>inherits: false</code>, so it stays on the element that animates it.
      On iOS that breaks the animation instead. The property still animates, but
      whatever reads it with <code>var()</code> stops following it. We tried it
      for the <a href={publicUrl('sheet')}>Sheet</a>’s and the{' '}
      <a href={publicUrl('island')}>Island</a>’s scroll-linked corners: the
      sheet’s corners stopped changing at all, and the Island’s jumped from one
      radius to the other. So animated properties that are read through{' '}
      <code>var()</code> stay inherited, and the inheritance is cut off further
      down instead.
    </p>

    <Heading
      id="moving-what-the-library-does"
      level={3}
    >
      What the library does
    </Heading>
    <p>
      Every value that moves is reset to <code>initial</code> right below the
      elements that read it. Below that point it never changes, so none of the
      content is restyled while something moves. Where the library does this:
    </p>
    <ul>
      <li>
        <a href={publicUrl('navigation')}>Navigation</a>: each page’s frame
        reads the progress (and the width, start position and offsets derived
        from it), and the frame’s children reset all of them. A{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />{' '}
        item shared by both moving pages (a back button that stays put) needs
        the offset deep inside its page, so during a transition the stack marks
        the item’s ancestors with <code>data-navigation-path</code> and lets the
        values through along that path only. After the fix, an empty page costs
        about 0.5&nbsp;MB per visit, and the Badge page about 5&nbsp;MB.
      </li>
      <li>
        <a href={publicUrl('sheet')}>Sheet</a> and{' '}
        <a href={publicUrl('island')}>Island</a>: their corner radius follows
        their scroll while they snap. The popup (or the Island), its panel, its
        rim and the content’s clip read it. The panel’s other children and the
        children of{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        />{' '}
        and{' '}
        <PartLink
          component="island"
          part="Island.Content"
        />{' '}
        reset it.
      </li>
      <li>
        <a href={publicUrl('viewport')}>Viewport</a>: the bounce offset, set on
        every frame while the content is pulled past its end, is reset by the
        content layer’s children.
      </li>
    </ul>
    <p>
      If you change one of these components, keep it that way. A new custom
      property that moves needs the same reset, and a <code>transition</code> or
      scroll-driven <code>animation</code> on a property that reaches a whole
      page is the thing to look out for in review.
    </p>

    <Heading
      id="in-your-own-code"
      level={3}
    >
      In your own code
    </Heading>
    <p>
      The same applies to custom properties you animate yourself: keep them
      inherited, so <code>var()</code> follows them on iOS, and reset them right
      below the elements that read them.
    </p>
    <CodeView code={movingCode} />

    <Heading
      id="measuring-it"
      level={3}
    >
      Measuring it
    </Heading>
    <p>
      Attach Safari’s Web Inspector from a Mac to the app on the phone, record a
      timeline with the Memory instrument on, and go to a page and back fifteen
      times or so. Watch the “Page” category: it should settle where it started,
      give or take a few MB, a few seconds after the last tap. A step up with
      every visit is this problem. A run with WebDriver (
      <code>safaridriver</code>) shows the same, but don’t trust the JavaScript
      heap or the DOM node count to find it: both stay flat.
    </p>
    <Heading
      id="app-switcher-snapshots"
      level={2}
    >
      App switcher snapshots (iPadOS)
    </Heading>
    <p>
      When you open the app switcher on an iPad, or go to the Home Screen,
      iPadOS resizes the app’s window a few times to take its snapshots, while
      the page is still on screen. An app that lays itself out by width sees
      those sizes as real, switches its layout and back, and loses its state.{' '}
      <PartLink
        component="viewport"
        part="useSizeClass"
      />{' '}
      ignores them.
    </p>

    <Heading
      id="snapshots-what-you-see"
      level={3}
    >
      What you see
    </Heading>
    <p>
      You leave a Home Screen app on an iPad and come back. A sidebar layout has
      turned into a stack and back again in the meantime: every page is mounted
      anew, scroll positions are gone, and anything held in component state is
      reset. Nothing in the app asked for that.
    </p>

    <Heading
      id="snapshots-why-it-happens"
      level={3}
    >
      Why it happens
    </Heading>
    <p>
      Measured on an iPad Air with iPadOS 26: about half a second before the
      page is hidden, a landscape window (1180×820) is turned portrait
      (820×1180), then shrunk to the size of a half-width Split View (585×820).
      That last size is <code>compact</code>, so a size class read from the
      window’s width flips to <code>compact</code> and, once the app is back, to{' '}
      <code>regular</code> again. Neither the screen’s size (always the portrait
      one) nor the page’s visibility (shown throughout) tells these resizes from
      real ones. While the app is hidden, the window still reads as the last
      snapshot’s size, even though its media queries already match the real one.
    </p>
    <p>
      What does give them away is the <code>orientationchange</code> event. Each
      snapshot resize is announced by one, before the resize, whose orientation
      contradicts the window’s current shape: portrait while the window is still
      landscape, and the other way round. A real rotation’s event comes after
      its resize (about 0.4 seconds later) and matches the window’s shape. A
      resize by the user (Split View, Slide Over, Stage Manager) has no such
      event at all.
    </p>

    <Heading
      id="snapshots-what-the-library-does"
      level={3}
    >
      What the library does
    </Heading>
    <p>
      From an <code>orientationchange</code> that contradicts the window’s
      shape,{' '}
      <PartLink
        component="viewport"
        part="useSizeClass"
      />{' '}
      holds the size class it had. It lets go when an orientation matches the
      window’s shape again, or when the page is shown again, and reads the size
      class anew. There’s no timer: the events alone decide. The details, with
      the measurements, are under “iPadOS’ snapshots” in{' '}
      <PartLink
        component="viewport"
        part="useSizeClass"
      />
      ’s section of the Viewport parts. If you lay out an app by width, use the
      hook rather than your own media query, or you’ll get the remounts back.
    </p>
    <p>
      An earlier attempt wrapped the app’s tree so it wouldn’t remount. That
      only moved the problem and needed styling workarounds of its own; don’t go
      back there.
    </p>

    <Heading
      id="the-short-layout-viewport"
      level={2}
    >
      A short layout viewport in Home Screen apps
    </Heading>
    <p>
      In a Home Screen app under a translucent status bar, iOS gives a document
      that’s no taller than its window a layout viewport that’s short by the
      status bar’s height (
      <a href="https://bugs.webkit.org/show_bug.cgi?id=301108">
        WebKit bug 301108
      </a>
      ). Nothing is painted below it, so a strip at the bottom of the screen
      stays empty, the app’s own layers included.
    </p>
    <p>
      While a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Provider"
      />{' '}
      tracks the window in a Home Screen app (<code>navigator.standalone</code>
      ), it marks the document with <code>data-uikit-viewport-standalone</code>,
      and the library makes the document as tall as the screen. Then the layout
      viewport is the full one, and there’s still nothing to scroll. A Home
      Screen app without a web app manifest reports the display mode{' '}
      <code>browser</code>, which is why the check uses{' '}
      <code>navigator.standalone</code>, not the media query.
    </p>

    <Heading
      id="the-keyboard"
      level={2}
    >
      The keyboard
    </Heading>
    <p>
      iOS’s software keyboard doesn’t resize the layout viewport, and it comes
      with habits of its own: it scrolls the page to the focused field, zooms
      into small text, and on an iPad it can hide while the field keeps its
      focus. The library handles each of these, so bars and accessories sit on
      the keyboard and the page stays where it was.
    </p>

    <Heading
      id="keyboard-measuring"
      level={3}
    >
      Measuring what it covers
    </Heading>
    <p>
      The keyboard shows only in the visual viewport, which shrinks as it
      appears. What it covers has to be measured against the box the layers are
      actually fixed to, not against the screen: a screen inside an app’s
      content layer, or inside a{' '}
      <PartLink
        component="layout"
        part="Layout.Column"
      />
      , may already be resized above the keyboard, and then nothing of it is
      covered. So{' '}
      <PartLink
        component="viewport"
        part="Viewport.Provider"
      />{' '}
      adds a hidden fixed box filling the layers’ containing block (
      <code>.uikit-viewport-box</code>) and watches it. When that box shrinks,
      the layers follow it directly, without their keyboard transition, and{' '}
      <PartLink
        component="viewport"
        part="Viewport.KeyboardAccessory"
      />{' '}
      lifts on whichever keyboard reaches it, the window’s or the screen’s.
    </p>

    <Heading
      id="keyboard-zoom"
      level={3}
    >
      Zooming into fields
    </Heading>
    <p>
      iOS zooms the page in when you focus a field whose text is smaller than
      16px, and leaves it zoomed.{' '}
      <PartLink
        component="viewport"
        part="preventInputZoom"
      />{' '}
      (or{' '}
      <PartLink
        component="viewport"
        part="useInputZoomPrevention"
      />
      ) sets the viewport’s <code>maximum-scale</code> to 1 while it’s held,
      which stops that zoom; you can still pinch to zoom.
    </p>

    <Heading
      id="keyboard-focus-shift"
      level={3}
    >
      Scrolling to the focused field
    </Heading>
    <p>
      When a field is focused, iOS scrolls the layout viewport to bring it into
      view, even in an app whose bars and content layer already keep it clear of
      the keyboard. The whole app jumps up.{' '}
      <PartLink
        component="viewport"
        part="preventFocusShift"
      />{' '}
      (or{' '}
      <PartLink
        component="viewport"
        part="useFocusShiftPrevention"
      />
      ) focuses a touched field itself with <code>preventScroll</code> at the
      end of the touch, instead of letting the browser do it. The caret then
      goes where the field puts it, not exactly where you tapped. A field
      focused without a touch (a popup’s initial focus, say) is focused again
      the same way, and an app left and reopened with a field focused gets it
      back without the jump.
    </p>
    <p>
      On an iPad, the keyboard’s hide key hides the keyboard but keeps the field
      focused. Tapping the field again shows the keyboard, and iOS scrolls
      again. So the guard forgets its field as soon as the keyboard hides, and
      treats the next tap as a fresh focus.
    </p>

    <Heading
      id="native-scrolling-and-touch"
      level={2}
    >
      Native scrolling and touch
    </Heading>
    <p>
      iOS scrolls in a separate process, and it doesn’t like being interfered
      with while it does. Most of what the library learned here comes down to
      one rule: change nothing that creates or moves a layer while a finger is
      down or a scroll is running, and change sizes rather than structure.
    </p>
    <ul>
      <li>
        <strong>Nothing changes at touch start.</strong> Toggling{' '}
        <code>overflow: clip</code> on a scroller’s ancestor at{' '}
        <code>touchstart</code> or <code>pointerdown</code> rebuilds the layers,
        and the pan that just started stops after a few points. The{' '}
        <a href={publicUrl('island')}>Island</a> keeps its clip permanently and
        only grows the clipped box when touched (a negative top margin with as
        much top padding).
      </li>
      <li>
        <strong>Snap areas need a height.</strong> iOS ignores a{' '}
        <code>scroll-snap-align</code> on an element with no height, and the
        scroller then rests anywhere. The stop markers of a snapping{' '}
        <a href={publicUrl('sheet')}>Sheet</a> and{' '}
        <a href={publicUrl('island')}>Island</a> are 1px tall for that reason.
        Safari also snaps to a marker past the end of the scroll range and holds
        it there, so every marker is kept within the range.
      </li>
      <li>
        <strong>A scroller has to take pointer events.</strong> With{' '}
        <code>pointer-events: none</code>, a scroller doesn’t scroll on iOS,
        even where its children take events again (Chrome scrolls it). The
        Island’s root lets touches through, but its scroller doesn’t.
      </li>
      <li>
        <strong>No handing over midway.</strong> iOS doesn’t pass a gesture from
        an inner scroller to the outer one in the middle of it. A snapping
        sheet’s content, pulled down past its start, bounces on its own, which
        Safari reports as a negative <code>scrollTop</code>. The sheet reads
        that when the touch ends and steps down a stop then.
      </li>
      <li>
        <strong>Leave a running scroll alone.</strong> Writing{' '}
        <code>scrollLeft</code>, swapping pages or trimming them while a scroll
        or its momentum is running makes iOS fight back: flicker, glitches, the
        wrong page. The{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Calendar"
        />
        ’s months are a plain scroll-snap strip with stable pages, changed only
        once the scroll has come to rest, and its height changes only after that
        too.
      </li>
    </ul>

    <Heading
      id="mouse-events-after-a-long-press"
      level={2}
    >
      Mouse events after a long press
    </Heading>
    <p>
      After a touch ends, iOS emulates a mouse for it: <code>mouseover</code>,{' '}
      <code>mouseenter</code>, <code>mousedown</code>, <code>focus</code> and{' '}
      <code>click</code>, all at once. For a tap that’s what you want. After a
      long press that opened a tooltip, it isn’t: Base UI took the emulated{' '}
      <code>mouseenter</code> for a hover and opened the tooltip again right
      after it had closed (with no delay at all while a provider’s instant phase
      was on).
    </p>
    <p>
      So when a long press opens it,{' '}
      <PartLink
        component="tooltip"
        part="Tooltip.Trigger"
      />{' '}
      cancels that touch’s <code>touchend</code> (with a non-passive listener on
      the trigger), and iOS emulates nothing. On Android, the long press’s{' '}
      <code>contextmenu</code> is prevented as well.
    </p>

    <Heading
      id="pressed-buttons-and-focus"
      level={2}
    >
      Pressed buttons don’t take focus (Safari)
    </Heading>
    <p>
      This one isn’t limited to iOS: Safari doesn’t focus a button when it’s
      pressed, with a mouse, a trackpad or a finger. Focus goes nowhere, and the{' '}
      <code>blur</code> on whatever had it has a <code>relatedTarget</code> of{' '}
      <code>null</code>. Chrome focuses the button.
    </p>
    <p>
      Code that reads “focus went to nothing” as “the user left the component”
      breaks only in Safari. A swipe row (
      <PartLink
        component="list"
        part="List.SwipeActions"
      />
      ) once closed on blur: pressing its Delete action blurred the row, its
      actions went inert, and Delete never received the click. The library only
      treats a blur as leaving when its <code>relatedTarget</code> is an element
      outside, and handles presses outside with their own{' '}
      <code>pointerdown</code> listener. Tests in Chrome won’t catch this, so
      when you change focus, blur or <code>inert</code> handling, check it in
      Safari.
    </p>

    <Heading
      id="dishonorable-mentions"
      level={2}
    >
      (Dis)honorable Mentions
    </Heading>
    <ul>
      <li>
        <strong>Scrollers draw past rounded clips.</strong> WebKit paints a
        composited scroller outside its parent’s rounded corners. The content of
        a <a href={publicUrl('sheet')}>Sheet</a> and an{' '}
        <a href={publicUrl('island')}>Island</a> clips itself with a{' '}
        <code>clip-path</code> of the same radius.
      </li>
    </ul>
    <ul>
      <li>
        <strong>No borders on a sheet’s scroller.</strong> A border on a
        snapping sheet’s scroller made its glass jump on iOS. The rim is drawn
        by separate layers instead.
      </li>
    </ul>
    <ul>
      <li>
        <strong>The text selection menu stays.</strong> iOS shows its menu for
        any native text selection, and selecting again by script doesn’t hide
        it. Only removing the native selection would, which is why a synthetic
        selection is planned.
      </li>
    </ul>
    <ul>
      <li>
        <strong>Document overscroll on iOS only.</strong> Not an iOS quirk, but
        the reason for an iOS-only rule: in Chrome on macOS,{' '}
        <code>overscroll-behavior: none</code> on the document ends a trackpad’s
        glide in nested scrollers. So the library’s advice and demos apply it
        only where <code>-webkit-touch-callout</code> is supported (see{' '}
        <a href={publicUrl('viewport')}>Viewport</a>).
      </li>
    </ul>
  </PageShell>
);
