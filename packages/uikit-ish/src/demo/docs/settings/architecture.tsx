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

const cssCode = `/* styles.css: each setting's system value, from a media query… */
:root {
  --uikit-settings-reduced-motion-system: 0;
  --uikit-settings-reduced-motion: var(--uikit-settings-reduced-motion-system);
}
@media (prefers-reduced-motion: reduce) {
  :root { --uikit-settings-reduced-motion-system: 1; }
}

/* …a provider overriding it on its element (display: contents):
   style="--uikit-settings-reduced-motion: 1"
   or resetting it to the system's:
   style="--uikit-settings-reduced-motion: var(--uikit-settings-reduced-motion-system)" */

/* …and a component's stylesheet asking for it (collapsible/style.css). */
.uikit-collapsible-panel {
  transition:
    height 300ms ease,
    opacity 300ms ease;
  @container style(--uikit-settings-reduced-motion: 1) {
    transition: none;
  }
}`;

const scriptCode = `// useSettings, in short: each setting from the nearest provider, else the
// system's (media queries, live), else the default.
const overrides = useContext(SettingsContext);
const system = useSyncExternalStore(subscribe, getSystem, () => ({}));
return Object.fromEntries(
  keys.map((key) => [key, overrides[key] ?? system[key] ?? defaults[key]]),
);`;

const sections: readonly Section[] = [
  ['two-channels-one-value', 'Two channels, one value'],
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
      id="two-channels-one-value"
      level={2}
    >
      Two channels, one value
    </Heading>
    <ul>
      <li>
        <strong>In script,</strong> <PartLink part="useSettings" /> returns each
        setting from the nearest provider’s override. Without one, it returns
        the system’s value, and without that, a default.
      </li>
      <li>
        The system’s values come from media queries, read through{' '}
        <code>useSyncExternalStore</code>. So a change in the system re-renders
        whatever reads them. The snapshot object only changes when a value does.
      </li>
      <li>
        <strong>In CSS,</strong> each setting is a custom property, such as{' '}
        <code>--uikit-settings-reduced-motion</code>. It’s set from a{' '}
        <code>-system</code> variant, which the global stylesheet switches by
        media query. Providers override it.
      </li>
      <li>
        The components’ stylesheets read these properties with style queries,
        such as{' '}
        <code>@container style(--uikit-settings-reduced-motion: 1)</code>. They
        don’t use the media queries. So a provider’s override reaches them, just
        as it reaches script.
      </li>
      <li>
        A style query asks an element’s parent. Some tokens are set once on the
        root by the global stylesheet, such as the system colors with more
        contrast. Those are set again on whatever sits directly inside a
        provider or a portal, which is marked <code>data-uikit-settings</code>.
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
        Text size and differentiating without color have no media query. They
        stay at their defaults until a provider sets them.
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
        carries its overrides as custom properties. CSS below it inherits them,
        without a box that changes the layout. With <code>render</code>, the
        element is your app’s own, laid out as it is.
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
        where the portal was opened, as a style and a color scheme for the
        portal’s element. Every portal in the library spreads them: menus,
        popovers, sheets, alerts, tooltips and drawers.
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
        <strong>From the system:</strong> media queries, read only in script and
        in the global stylesheet.
      </li>
      <li>
        <strong>From the app:</strong> overrides, through providers.
      </li>
      <li>
        <strong>Out:</strong> the settings, to the stylesheets. The color scheme
        reaches them as itself, and the others through style queries. The
        settings also go to code that reads <PartLink part="useSettings" /> or{' '}
        <code>reducedMotionOf</code>, to portals through their props, and to
        glass surfaces’ scopes.
      </li>
    </ul>
  </>
);
