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

const sections: readonly Section[] = [
  ['install', 'Install'],
  ['react-or-preact', 'React or Preact'],
  ['the-globals', 'The globals'],
  ['an-apps-structure', 'An app’s structure'],
  ['as-a-pwa', 'As a PWA'],
];

const installCode = 'npm install @mrpelz/uikit-ish';

const aliasCode = `// webpack.config.js (Vite: resolve.alias, the same three)
export default {
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
};`;

const globalsCode = `import { Settings, Styles, Viewport } from '@mrpelz/uikit-ish';

export const Root = () => (
  <>
    {/* Once, anywhere: pressed states on iOS (and a forced color scheme, if
        you pass one). */}
    <Styles />
    {/* Optional: your own settings over the system's (see Settings). */}
    <Settings.Provider>
      <Viewport.Provider>
        <App />
      </Viewport.Provider>
    </Settings.Provider>
  </>
);`;

const cssCode = `body {
  margin: 0;
  font-family: -apple-system, system-ui, sans-serif;
}

/* An app never scrolls or bounces as a whole: its layers do. iOS only;
   elsewhere this would end a trackpad's glide in the layers' scrollers. */
@supports (-webkit-touch-callout: none) {
  html,
  body {
    overscroll-behavior: none;
  }
}`;

const headCode = `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="My App">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="/icon.svg">
<link rel="apple-touch-icon" href="/apple-icon-180.png">`;

const manifestCode = `{
  "name": "My App",
  "short_name": "My App",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icon-192-maskable.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`;

/** `/getting-started`: using the library in an app of your own. */
export const GettingStartedPage: FunctionComponent = () => (
  <PageShell
    path="getting-started"
    title="Getting Started"
  >
    <p className="demo-lead">
      How to use the library in an app of your own: installing it, choosing
      React or Preact, the few things it needs once at the top, how an app’s
      components nest, and what it takes to run that app as a PWA.
    </p>
    <Contents sections={sections} />

    <Heading
      id="install"
      level={2}
    >
      Install
    </Heading>
    <CodeView code={installCode} />
    <ul>
      <li>
        It ships as ES modules. Each component imports its own stylesheet, so
        your bundler needs to handle CSS imports: Vite does out of the box; with
        webpack, add <code>css-loader</code> and a style or extract loader.
      </li>
      <li>
        It’s built on <a href="https://base-ui.com">Base UI</a>, which comes
        along as a dependency.
      </li>
    </ul>

    <Heading
      id="react-or-preact"
      level={2}
    >
      React or Preact
    </Heading>
    <ul>
      <li>
        The library is written against React’s API (it imports{' '}
        <code>react</code>), so it runs on React itself: version 19 or later, as
        some components rely on React 19’s boolean <code>inert</code>.
      </li>
      <li>
        It runs just as well on Preact 10, through <code>preact/compat</code>.
        This site does exactly that. Point the three React imports at Preact in
        your bundler:
      </li>
    </ul>
    <CodeView code={aliasCode} />
    <ul>
      <li>
        Under Preact, the components work around what Preact does differently:
        its portals don’t pass events up to the components that opened them, so
        menus and popovers check for themselves whether a press was inside (see{' '}
        <PartLink
          component="settings"
          part="useSettingsPortalProps"
        />{' '}
        for the same idea with settings); and DOM properties that React and
        Preact spell differently are set on the element directly.
      </li>
    </ul>

    <Heading
      id="the-globals"
      level={2}
    >
      The globals
    </Heading>
    <p>A handful of things go in once, at the top of your app:</p>
    <CodeView code={globalsCode} />
    <ul>
      <li>
        <code>Styles</code> loads the global stylesheet (the{' '}
        <a href={publicUrl('tokens')}>design tokens</a>) and makes pressed
        states work on iOS, which only shows <code>:active</code> where a touch
        listener exists.
      </li>
      <li>
        <PartLink
          component="settings"
          part="Settings.Provider"
        />{' '}
        is optional: without one, everything follows the system’s settings
        (color scheme, contrast, reduced motion and transparency).
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        tracks the window: its safe areas, the on-screen keyboard, scrolling.
        Bars and sheets read it.
      </li>
    </ul>
    <p>And a little CSS of your own, as the library leaves the page to you:</p>
    <CodeView code={cssCode} />

    <Heading
      id="an-apps-structure"
      level={2}
    >
      An app’s structure
    </Heading>
    <p>
      From your render root (the body, or any element below it) down to a switch
      at the end of a list row, in a tab with a large title:
    </p>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        Your render root (e.g. <code>body</code>)
        <ul>
          <li>
            <code>Styles</code>
          </li>
          <li>
            <PartLink
              component="settings"
              part="Settings.Provider"
            />{' '}
            (optional)
            <ul>
              <li>
                <PartLink
                  component="viewport"
                  part="Viewport.Provider"
                />
                <ul>
                  <li>
                    <PartLink
                      component="tab-bar"
                      part="TabBar.Root"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="viewport"
                          part="Viewport.Content"
                        />{' '}
                        (the scrolling layer)
                        <ul>
                          <li>
                            <PartLink
                              component="tab-bar"
                              part="TabBar.Panel"
                            />{' '}
                            (one per tab, rendered as a{' '}
                            <PartLink
                              component="navigation"
                              part="Navigation.Root"
                            />
                            )
                            <ul>
                              <li>
                                <PartLink
                                  component="navigation"
                                  part="Navigation.Stack"
                                />{' '}
                                (one page per level)
                                <ul>
                                  <li>
                                    <PartLink
                                      component="header"
                                      part="Header.Root"
                                    />
                                    <ul>
                                      <li>
                                        <PartLink
                                          component="viewport"
                                          part="Viewport.BlockStart"
                                        />{' '}
                                        with a{' '}
                                        <PartLink
                                          component="toolbar"
                                          part="Toolbar.Root"
                                        />{' '}
                                        (the title once scrolled)
                                      </li>
                                      <li>
                                        <PartLink
                                          component="page"
                                          part="Page.Root"
                                        />
                                        <ul>
                                          <li>
                                            <PartLink
                                              component="viewport"
                                              part="Viewport.Padding"
                                            />{' '}
                                            (top: room for the bar)
                                          </li>
                                          <li>
                                            <PartLink
                                              component="header"
                                              part="Header.LargeTitle"
                                            />
                                          </li>
                                          <li>
                                            <PartLink
                                              component="list"
                                              part="List.Root"
                                            />{' '}
                                            ›{' '}
                                            <PartLink
                                              component="list"
                                              part="List.Section"
                                            />{' '}
                                            ›{' '}
                                            <PartLink
                                              component="list"
                                              part="List.Group"
                                            />{' '}
                                            ›{' '}
                                            <PartLink
                                              component="list"
                                              part="List.Item"
                                            />
                                            <ul>
                                              <li>
                                                <PartLink
                                                  component="list"
                                                  part="List.Content"
                                                />{' '}
                                                (its title)
                                              </li>
                                              <li>
                                                <PartLink
                                                  component="list"
                                                  part="List.Trailing"
                                                />{' '}
                                                › a{' '}
                                                <a href={publicUrl('switch')}>
                                                  Switch
                                                </a>
                                              </li>
                                            </ul>
                                          </li>
                                          <li>
                                            <PartLink
                                              component="viewport"
                                              part="Viewport.Padding"
                                            />{' '}
                                            (bottom: room for the tab bar)
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink
                          component="viewport"
                          part="Viewport.BlockEnd"
                        />{' '}
                        with the{' '}
                        <PartLink
                          component="tab-bar"
                          part="TabBar.List"
                        />{' '}
                        (floating over the content)
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        Sheets, menus and popovers don’t need a place in this tree: they open in
        portals, wherever you render their roots.
      </li>
      <li>
        Each component’s parts page starts its tree at this level, greyed, so
        you can see where it fits.
      </li>
    </ul>

    <Heading
      id="as-a-pwa"
      level={2}
    >
      As a PWA
    </Heading>
    <p>
      To install your app on a phone’s home screen and have it start without the
      browser around it:
    </p>
    <ol>
      <li>
        Serve it over HTTPS (or <code>localhost</code> while developing).
      </li>
      <li>
        Let the page reach under the status bar and the home indicator:{' '}
        <code>viewport-fit=cover</code> in the viewport meta tag, and a
        translucent status bar on iOS. The library keeps its bars clear of the
        safe areas for you.
      </li>
      <li>
        On iOS 27, a translucent status bar blurs your top bar: add the inline
        script from{' '}
        <a href={publicUrl('ios-quirks#in-your-head')}>iOS Quirks</a> to your
        head, right after the status bar’s meta tag. It starts the app below the
        status bar there, and the library’s top bars follow.
      </li>
      <li>
        Add a web app manifest with <code>display: standalone</code>, a name, a
        start URL and a scope, a theme and background color, and icons: 192 and
        512 pixels, each also as a maskable version.
      </li>
      <li>
        Add the icons iOS reads from the page itself: an{' '}
        <code>apple-touch-icon</code> (180 pixels) and, for a launch screen
        instead of white, <code>apple-touch-startup-image</code> links per
        device size.
      </li>
      <li>
        Keep the document itself from scrolling or bouncing (the CSS above): in
        a standalone app, a drag that reaches the document would move
        everything, the fixed bars too.
      </li>
      <li>
        For working offline, register a service worker that caches your app’s
        files. The library doesn’t need one, and this site doesn’t ship one.
      </li>
    </ol>
    <CodeView code={headCode} />
    <CodeView code={manifestCode} />
  </PageShell>
);
