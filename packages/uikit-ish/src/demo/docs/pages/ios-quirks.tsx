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
  ['moving-values-and-memory', 'Moving values and memory (iOS 26)'],
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
      so you don’t undo the workaround by accident.
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
      Moving values and memory (iOS 26)
    </Heading>
    <p>
      If a custom property that many elements inherit changes on every frame of
      an animation, iOS 26’s WebKit holds on to memory from each of those
      restyles. Do that on every navigation and the tab gets killed after a few
      dozen visits. The library keeps its moving values on the few elements that
      read them. If you animate custom properties yourself, do the same.
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
      a lot of work, but it should be thrown away right after. iOS 26’s WebKit
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
      On iOS 26 that breaks the animation instead. The property still animates,
      but whatever reads it with <code>var()</code> stops following it. We tried
      it for the <a href={publicUrl('sheet')}>Sheet</a>’s and the{' '}
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
  </PageShell>
);
