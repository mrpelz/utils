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

// iOS 27's quirks for a Home Screen app (found on a device: see the
// library's viewport/ios27.ts), and what an app and the library do about
// them.

const sections: readonly Section[] = [
  ['the-blur', 'The blur'],
  ['in-your-head', 'In your head'],
  ['the-status-bar', 'The status bar'],
  ['what-the-library-does', 'What the library does'],
  ['testing', 'Testing'],
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

/** `/ios27`: iOS 27's quirks for a Home Screen app, and what to do. */
export const Ios27Page: FunctionComponent = () => (
  <PageShell title="iOS 27">
    <p className="demo-lead">
      On iOS 27, a Home Screen app whose page reaches under the status bar gets
      a blur over its top bar that nothing in the page can prevent. The way out
      is to start the app below the status bar, decided in the page’s head; the
      library follows that decision.
    </p>
    <Contents sections={sections} />

    <Heading
      id="the-blur"
      level={2}
    >
      The blur
    </Heading>
    <p>
      With the status bar style <code>black-translucent</code> (the page under
      the status bar, as{' '}
      <a href={publicUrl('getting-started#as-a-pwa')}>Getting Started</a>{' '}
      recommends), iOS 27 draws a translucent white blur at the top of a Home
      Screen app. It reaches down past the status bar, over the top bar’s
      buttons and title, whatever the page’s colors. In Safari itself, it’s only
      as tall as the status bar.
    </p>
    <p>
      Reported workarounds don’t help here: a <code>position: fixed</code>{' '}
      element at the top with a background color (opaque or half transparent, as
      tall as the safe area or only a few pixels, narrower or wider, at the very
      top or a few pixels below), one painting nothing (
      <code>background-clip: text</code>), one fading into the bar’s edge
      effect, or one fading in as content scrolls under the bar. With each, the
      blur stayed. The other status bar styles avoid it: <code>default</code>{' '}
      and <code>black</code> put the system’s own opaque bar above the page, so
      nothing of the page is under the status bar.
    </p>

    <Heading
      id="in-your-head"
      level={2}
    >
      In your head
    </Heading>
    <p>
      So on iOS 27, switch the status bar style to <code>default</code> (it
      follows light and dark mode; <code>black</code> doesn’t), and mark the
      document with <code>data-ios27</code> for the library. Elsewhere keep{' '}
      <code>black-translucent</code>. This has to happen in the head, in an
      inline script right after the meta tag, before Safari reads it; your app’s
      bundle runs too late.
    </p>
    <p>
      The script tells iOS 27 by Safari’s version (<code>Version/27</code>):
      since iOS 26 the OS version in the user agent is frozen (it reads{' '}
      <code>iPhone OS 18_7</code>). An iPad presents itself as a Mac, so it’s
      told apart by its touch points.
    </p>
    <CodeView code={headCode} />
    <p>
      Your app can read the same finding with <code>isIos27()</code> (the
      document’s mark: the attribute’s name is <code>ios27Attribute</code>),
      e.g. for an edge effect you set yourself:
    </p>
    <CodeView code={appCode} />

    <Heading
      id="the-status-bar"
      level={2}
    >
      The status bar
    </Heading>
    <p>
      With <code>default</code>, the system draws an opaque status bar and the
      page starts below it. Its color is taken from the page as the app loads:
      the page’s own background (the element at the top, not the document
      root’s), read once. A background changed later, or another page shown with
      a different one, leaves the status bar as it was until the app is loaded
      again.
    </p>

    <Heading
      id="what-the-library-does"
      level={2}
    >
      What the library does
    </Heading>
    <p>
      With the document marked, a top bar (
      <PartLink
        component="viewport"
        part="Viewport.BlockStart"
      />
      , or an{' '}
      <PartLink
        component="viewport"
        part="Viewport.Anchor"
      />{' '}
      at the block start) at the screen’s top gets a <code>hard</code> edge
      effect when its <code>edgeEffect</code> isn’t set: a solid bar beneath the
      system’s, not a blur fading into it. Bars in a{' '}
      <a href={publicUrl('sheet')}>Sheet</a>, a{' '}
      <a href={publicUrl('popover')}>Popover</a> or an{' '}
      <a href={publicUrl('island')}>Island</a> aren’t at the screen’s top and
      keep theirs, as does anything in a portal container (a device’s frame on
      this site). An <code>edgeEffect</code> you set always wins.
    </p>
    <p>
      Its backing, untinted, is the status bar’s color: the background shown
      behind the first page as it loaded (its own, or the nearest ancestor’s
      painting one), so the two bars meet as one. While the page’s background
      matches it, the bar shows as content scrolls under it, its line too. Once
      the page’s background is another (changed, another page shown, the color
      scheme switched), the bar stays solid at rest too, its line dividing the
      bars from the page, as a tinted bar does (<code>edgeTint</code>, see{' '}
      <a href={publicUrl('viewport')}>Viewport</a>).
    </p>

    <Heading
      id="testing"
      level={2}
    >
      Testing
    </Heading>
    <p>
      iOS reads the status bar style when the app is added to the Home Screen:
      an app added before updating to iOS 27, or before your head changed, keeps
      its old style. Remove it and add it again.
    </p>
  </PageShell>
);
