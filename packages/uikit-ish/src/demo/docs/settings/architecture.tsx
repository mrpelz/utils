import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/settings/architecture`: how Settings is built, and what flows into it.

const cssCode = `/* A stylesheet following a setting: a provider's attribute (its own, or
   its portal's), the nearest false within a true winning… */
:where([data-uikit-reduced-motion='true'])
  .uikit-sheet-popup:not(:where([data-uikit-reduced-motion='false']) *) {
  --uikit-sheet-slide: 0s;
}

/* …else the system's, by its media query, inside a provider only (not a
   style query: those don't apply on iOS). */
@media (prefers-reduced-motion: reduce) {
  .uikit-sheet-popup:where([data-uikit-settings] *):not(
      :where([data-uikit-reduced-motion='false']) *
    ) {
    --uikit-sheet-slide: 0s;
  }
}`;

const scriptCode = `// useSettings, in short: each setting from the nearest provider, else the
// system's (media queries, live; outside every provider, only those the
// browser follows anyway), else the default.
const overrides = useContext(SettingsContext);
const isInProvider = useContext(InProviderContext);
const all = useSyncExternalStore(subscribe, getSystem, () => ({}));
const system = isInProvider
  ? all
  : pick(all, ['colorScheme', 'languages', 'locale', 'region']);
return Object.fromEntries(
  keys.map((key) => [key, overrides[key] ?? system[key] ?? defaults[key]]),
);`;

const sections: readonly Section[] = [
  ['script-and-stylesheets', 'Script and stylesheets'],
  ['providers', 'Providers'],
  ['portals', 'Portals'],
  ['color-scheme-scopes', 'Color scheme scopes'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/settings/architecture`: how it's built, and what flows into it. */
export const SettingsArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Settings keeps every component’s view of the system’s settings in one
        place. It also lets a part of your app override them. Components that
        need the settings in code read them in script. Stylesheets read them in
        CSS. To learn how to use it, see its{' '}
        <a href={publicUrl('settings/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="script-and-stylesheets"
      level={2}
    >
      Script and stylesheets
    </Heading>
    <ul>
      <li>
        <strong>In script,</strong> <PartLink part="useSettings" /> returns each
        setting from the nearest provider’s override. Without one, it returns
        the system’s value, and without that, a default. Outside every provider,
        it returns the defaults, except for the color scheme, locale and region,
        which the browser follows on its own anyway.
      </li>
      <li>
        The system’s values come from media queries, read through{' '}
        <code>useSyncExternalStore</code>. So a change in the system re-renders
        whatever reads them. The snapshot object only changes when a value does.
      </li>
      <li>
        <strong>In stylesheets,</strong> each setting a provider sets is an
        attribute on its element and on its portals’ (
        <code>data-uikit-contrast</code>, <code>data-uikit-reduced-motion</code>
        , <code>data-uikit-reduced-transparency</code>,{' '}
        <code>data-uikit-differentiate-without-color</code>,{' '}
        <code>data-uikit-text-size</code>, <code>data-uikit-bold-text</code>).
        The system’s settings that have media queries come from those, scoped to
        what’s inside a provider (<code>[data-uikit-settings]</code>), so
        nothing applies outside one. Not style queries: they don’t apply on iOS
        (see{' '}
        <a href={publicUrl('ios-quirks#style-queries-dont-apply')}>
          iOS Quirks
        </a>
        ).
      </li>
      <li>
        The colors that change with contrast (the system colors, the labels,
        separators, fills and grouped backgrounds) are set on the root, and set
        again on whatever sits directly inside a provider or a portal, which is
        marked <code>data-uikit-settings</code>. Inherited from there, the
        nearest provider’s contrast wins, however deeply they’re nested.
      </li>
      <li>
        Rules that switch something on or off by an attribute, such as opaque
        glass or no transitions, can’t tell which provider is nearest. A
        provider that turns a setting off inside one that turns it on wins, but
        one that turns it on again inside that doesn’t.
      </li>
      <li>
        The app tint is set again there too, from your <code>--uikit-tint</code>{' '}
        and <code>--uikit-tint-more-contrast</code>. So it follows a provider’s
        contrast (see{' '}
        <a href={publicUrl('settings#your-apps-tint')}>Your app’s tint</a>).
        Glass’s opaque materials are set on the glass elements themselves.
      </li>
      <li>
        The color scheme is the exception. It’s <code>color-scheme</code>{' '}
        itself, with <code>data-color-scheme</code> for selectors. So{' '}
        <code>light-dark()</code> in every stylesheet follows it.
      </li>
      <li>
        Text size has no media query: the outermost provider writes the
        system’s, detected where the browser reports it (Safari, through{' '}
        <code>-apple-system-body</code>), and portals carry it. Bold text and
        differentiating without color have no system signal at all, so they’re
        off until a provider sets them.
      </li>
      <li>
        Motion in script follows the same attributes and media query from the
        element it moves (<code>reducedMotionOf</code>). So a provider’s
        override also stops animations and smooth scrolls started in script. In
        CSS, one rule in the global stylesheet turns off every transition while
        motion is reduced.
      </li>
      <li>
        The languages, locale and region are for script only. The languages come
        from the browser, followed live (Safari reports only the first). The
        region is guessed from the time zone, using a small built-in table of
        zones. The time zone and the text size send no event, so they’re read
        the first time they’re needed, and again when your app calls{' '}
        <PartLink part="refreshSettings" />. Components with a{' '}
        <code>locale</code> prop use the resolved locale unless you give them
        one.
      </li>
    </ul>
    <CodeView code={scriptCode} />
    <CodeView code={cssCode} />

    <Heading
      id="providers"
      level={2}
    >
      Providers
    </Heading>
    <ul>
      <li>
        <PartLink part="Settings.Provider" /> takes settings as props. Only the
        ones you give count, even when you give them as <code>undefined</code>.
        An <code>undefined</code> setting resets to the system’s value inside
        the provider.
      </li>
      <li>
        An inner provider overrides an outer one, setting by setting. Its
        context is the outer provider’s overrides with its own on top.
      </li>
      <li>
        The provider renders a <code>display: contents</code> element that
        carries its overrides as attributes, without a box that changes the
        layout. With <code>render</code>, the element is your app’s own, laid
        out as it is.
      </li>
      <li>
        Its own settings are keyed by their values as a JSON string. So an app
        that passes a new object on every render doesn’t remake the context.
      </li>
    </ul>

    <Heading
      id="portals"
      level={2}
    >
      Portals
    </Heading>
    <ul>
      <li>
        A popup’s portal renders outside the provider’s element, often in the
        body. The provider’s CSS overrides don’t reach it there.
      </li>
      <li>
        <code>useSettingsPortalProps</code> returns the overrides in effect
        where the portal was opened, as attributes (and its <code>lang</code>)
        for the portal’s element, the text size and bold text always. Every
        portal in the library spreads them: menus, popovers, sheets, alerts,
        tooltips and drawers.
      </li>
      <li>
        Without any overrides, a portal opened inside a provider still gets its
        marker (<code>data-uikit-settings</code>), so the system’s settings
        apply in it as they do inside the provider. A portal opened outside
        every provider gets nothing.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        paints the window’s background on the root element, outside every
        provider. While it holds the window, it marks the root with its
        provider’s contrast (<code>data-uikit-root-contrast</code>), so the
        background matches the content with more contrast.
      </li>
    </ul>

    <Heading
      id="color-scheme-scopes"
      level={2}
    >
      Color scheme scopes
    </Heading>
    <ul>
      <li>
        Glass surfaces pick a color scheme from what’s behind them. They set it
        on their element in CSS.
      </li>
      <li>
        In script, they pass it on with <code>ColorSchemeScope</code>, an
        internal provider that only overrides the color scheme. So{' '}
        <PartLink part="useSettings" />, and the portals opened inside a card, a
        menu or a sidebar, see that surface’s scheme instead of the page’s.
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
        <strong>From the system:</strong> media queries, read in script and in
        the stylesheets, and applied inside providers only. The color scheme is
        the exception: <code>color-scheme: light dark</code> on the root lets
        the browser follow the system everywhere.
      </li>
      <li>
        <strong>From the app:</strong> overrides, through providers.
      </li>
      <li>
        <strong>Out:</strong> the settings, to the stylesheets. The color scheme
        reaches them as itself, and the others as attributes. The settings also
        go to code that reads <PartLink part="useSettings" /> or{' '}
        <code>reducedMotionOf</code>, to portals through their props, and to
        glass surfaces’ scopes.
      </li>
    </ul>
  </>
);
