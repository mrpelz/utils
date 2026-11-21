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

/* …and a provider overriding it on its element (display: contents):
   style="--uikit-settings-reduced-motion: 1"
   or resetting it to the system's:
   style="--uikit-settings-reduced-motion: var(--uikit-settings-reduced-motion-system)" */`;

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
        place, and lets a part of the app override them: in script for
        components that need them in code, and in CSS for stylesheets. For using
        it, see its <a href={publicUrl('settings/parts')}>parts</a>.
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
        setting from the nearest provider’s override, else the system’s, else a
        default. The system’s values come from media queries, read through{' '}
        <code>useSyncExternalStore</code>, so a change in the system re-renders
        what reads them. The snapshot object only changes when a value does.
      </li>
      <li>
        <strong>In CSS,</strong> each setting is a custom property (
        <code>--uikit-settings-reduced-motion</code> and so on), set from a{' '}
        <code>-system</code> variant that the global stylesheet switches by
        media query, and overridden by providers. The library’s own stylesheets
        don’t read these yet: they use the media queries directly, so a
        provider’s override reaches script (useSettings, reducedMotionOf) but
        not their CSS. The color scheme is the exception, below.
      </li>
      <li>
        The color scheme is the exception: it’s <code>color-scheme</code>{' '}
        itself, with <code>data-color-scheme</code> for selectors, so{' '}
        <code>light-dark()</code> in every stylesheet follows it.
      </li>
      <li>
        A text size and differentiating without color have no media query:
        they’re the default until a provider sets them.
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
        ones given count, even when given as <code>undefined</code>, which
        resets a setting to the system’s inside it. An inner provider overrides
        an outer one setting by setting: its context is the outer overrides with
        its own on top.
      </li>
      <li>
        It renders a <code>display: contents</code> element carrying its
        overrides as custom properties, so CSS below inherits them without a box
        changing layout. With <code>render</code>, the element is the app’s own,
        laid out as it is.
      </li>
      <li>
        Its own settings are keyed by their values (a JSON string), so an app
        passing a new object each render doesn’t remake the context.
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
        body, where its CSS overrides don’t reach.{' '}
        <code>useSettingsPortalProps</code> returns the overrides in effect
        where the portal is opened, as a style and a color scheme for the
        portal’s element. Every library portal spreads it: menus, popovers,
        sheets, alerts, tooltips, drawers.
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
        on their element in CSS, and pass it on in script with{' '}
        <code>ColorSchemeScope</code>, an internal provider that overrides only
        the color scheme. So <PartLink part="useSettings" /> and portals opened
        inside a card, a menu or a sidebar see that surface’s scheme, not the
        page’s.
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
        <strong>From the system:</strong> media queries, in script and in the
        global stylesheet.
      </li>
      <li>
        <strong>From the app:</strong> overrides, by providers.
      </li>
      <li>
        <strong>Out:</strong> the color scheme to every stylesheet; the other
        settings to code reading <PartLink part="useSettings" />; portals, by
        their props; and glass surfaces’ scopes.
      </li>
    </ul>
  </>
);
