import './style.css';

import { FunctionComponent, useState } from 'react';

import { Settings, type SettingsValues } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  settingsPortalPropsRows,
  settingsProviderRows,
  settingsValuesRows,
} from './docs.js';
import { given, propOptionsProviderPart } from './props.js';
import { SettingsReport, SettingsTable } from './report.js';

const useLanguageCode = `const translations = { 'en-US': enUS, 'en-GB': enGB, de } as const;

const App = () => {
  // ['en-GB', 'de'] gives 'en-GB'; ['en-US'] (Safari) gives 'en-US'.
  const language = useLanguage(['en-US', 'en-GB', 'de']);
  return <Strings.Provider value={translations[language ?? 'en-US']}>…</Strings.Provider>;
};`;

const matchLanguageCode = `matchLanguage(['en-US', 'en-GB', 'de'], ['en-GB', 'de']); // 'en-GB'
matchLanguage(['en-US', 'en-GB', 'de'], ['de-AT']); // 'de'
matchLanguage(['en-US', 'en-GB', 'de'], ['fr']); // undefined`;

const useSettingsCode = `import { useSettings } from '@mrpelz/uikit-ish';

export const Spinner = () => {
  const { reducedMotion } = useSettings();

  // Moved from script: no movement with reduced motion.
  return <div data-spinning={reducedMotion ? undefined : ''} />;
};`;

const refreshSettingsCode = `import { refreshSettings } from '@mrpelz/uikit-ish';

// Back in the app after a while: maybe in another time zone.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') refreshSettings();
});`;

const useSettingsPortalPropsCode = `import { createPortal } from 'react-dom';
import { useSettingsPortalProps } from '@mrpelz/uikit-ish';

export const Banner = () => {
  const portalProps = useSettingsPortalProps();

  // Rendered at the end of the body, with the settings of where it opened.
  return createPortal(
    <div {...portalProps}>Saved</div>,
    document.body,
  );
};`;

/** `Settings.Provider`, outlined, with its props; its settings resolved. */
const ProviderPart: FunctionComponent = () => {
  const id = 'settings-parts-provider';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsProviderPart,
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'Settings.Provider',
    },
  );
  const [values, setValues] = useState<SettingsValues>();

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      diagnostics={<SettingsTable columns={[['Within it', values]]} />}
      id={id}
      state={[state]}
      title="Settings.Provider"
    >
      <Settings.Provider
        key={elementKey}
        {...given(props)}
      >
        <SettingsReport onReport={setValues} />
        <div className="settings-demo-panel">
          <span className="settings-demo-label">Within it</span>
        </div>
      </Settings.Provider>
    </Component>
  );
};

/** `/settings/parts`: the provider, and the hooks reading it. */
export const SettingsParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Provider: settings for everything inside it.</li>
      <li>
        Helpers: the resolved settings for your own logic, the props a portal
        needs to follow them, and a way to read the time zone again.
      </li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="settings"
          part="Settings.Provider"
        />{' '}
        (optional; nested ones override the outer one)
        <ul>
          <li className="demo-tree-context">
            <span>your app, or one view of it</span>
          </li>
        </ul>
      </li>
      <li>
        Helpers (anywhere):
        <ul>
          <li>
            <PartLink
              component="settings"
              part="useSettings"
            />
          </li>
          <li>
            <PartLink
              component="settings"
              part="useSettingsPortalProps"
            />
          </li>
          <li>
            <PartLink
              component="settings"
              part="refreshSettings"
            />
          </li>
          <li>
            <PartLink
              component="settings"
              part="useLanguage"
            />{' '}
            and{' '}
            <PartLink
              component="settings"
              part="matchLanguage"
            />{' '}
            (your app’s translation)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="settings-provider"
      level={2}
    >
      <code>Settings.Provider</code>
    </Heading>
    <ul>
      <li>
        Every setting is optional. A setting you give overrides it for
        everything inside. A setting given as <code>undefined</code> is reset to
        the system’s value or the default, whatever an outer provider set. A
        setting you leave out comes from the outer provider. Here, a control’s{' '}
        <code>[inherit]</code> leaves its setting out.
      </li>
      <li>
        The settings are set on its element as attributes, which the stylesheets
        follow: <code>data-uikit-contrast</code>,{' '}
        <code>data-uikit-reduced-motion</code>,{' '}
        <code>data-uikit-reduced-transparency</code>,{' '}
        <code>data-uikit-differentiate-without-color</code>,{' '}
        <code>data-uikit-text-size</code> and <code>data-uikit-bold-text</code>.
        The color scheme is set as <code>data-color-scheme</code>, and the first
        of its <code>languages</code> as <code>lang</code>.
      </li>
      <li>
        A glass surface given a <code>context</code> (a{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />
        , a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />
        , a{' '}
        <PartLink
          component="menu"
          part="Menu.Popup"
        />
        ) acts as a provider of the color scheme alone: light on bright glass,
        dark on dim glass. What’s inside it, <code>useSettings</code> there, and
        the menus and popovers opened from it follow.
      </li>
      <li>
        Renders a <code>div</code> without a box of its own (
        <code>display: contents</code>). With <code>render</code>, it renders
        that element instead, laid out as usual (for example an app’s root, or a
        demo’s stage).
      </li>
    </ul>
    <ProviderPart />
    <h3>Props</h3>
    <PropsTable rows={settingsProviderRows} />

    <Heading
      id="usesettings"
      level={2}
    >
      <code>useSettings</code>
    </Heading>
    <ul>
      <li>
        Returns the settings where it’s called. Each comes from the nearest
        provider that overrides it, else from the system (updated live), else
        from its default. Outside every provider, it returns the defaults,
        except for the color scheme, languages, locale and region, which follow
        the system.
      </li>
      <li>
        For component logic, such as animations run from script. A component’s
        own props still win over these settings.
      </li>
    </ul>
    <CodeView code={useSettingsCode} />
    <h3>Values</h3>
    <PropsTable rows={settingsValuesRows} />

    <Heading
      id="usesettingsportalprops"
      level={2}
    >
      <code>useSettingsPortalProps</code>
    </Heading>
    <ul>
      <li>
        Props to spread on a portal. A portal renders outside the provider’s
        element (for example at the end of the body), so it doesn’t inherit the
        settings. These props carry the overrides from where the portal is
        opened.
      </li>
      <li>
        The library’s portals already use it (
        <PartLink
          component="menu"
          part="Menu.Portal"
        />
        ,{' '}
        <PartLink
          component="popover"
          part="Popover.Portal"
        />
        , and others). Use it for a portal of your own.
      </li>
    </ul>
    <CodeView code={useSettingsPortalPropsCode} />
    <h3>Value</h3>
    <PropsTable rows={settingsPortalPropsRows} />

    <Heading
      id="refreshsettings"
      level={2}
    >
      <code>refreshSettings</code>
    </Heading>
    <ul>
      <li>
        Reads the system settings that send no event when they change again: the
        time zone, which the guessed <code>region</code> comes from, and the
        text size. They’re read the first time they’re needed, and again each
        time you call this.
      </li>
      <li>
        Call it when your app knows they may have changed, for example when it
        comes back to the foreground (a text size is usually changed while the
        app is in the background). Everything that reads the settings updates.
      </li>
    </ul>
    <CodeView code={refreshSettingsCode} />

    <Heading
      id="uselanguage"
      level={2}
    >
      <code>useLanguage</code>
    </Heading>
    <ul>
      <li>
        Returns the best of your app’s translations (language tags) for the
        preferred languages where it’s called, from the nearest provider’s{' '}
        <code>languages</code>, else the browser’s. Without a match, it returns
        your first one.
      </li>
      <li>
        It matches by the languages, not by the formatting <code>locale</code>:
        a British person in Germany gets <code>en-GB</code>, not a guess from{' '}
        <code>en-DE</code>.
      </li>
    </ul>
    <CodeView code={useLanguageCode} />

    <Heading
      id="matchlanguage"
      level={2}
    >
      <code>matchLanguage</code>
    </Heading>
    <ul>
      <li>
        The matching behind{' '}
        <PartLink
          component="settings"
          part="useLanguage"
        />
        , for use outside components: your app’s translations and a ranked list
        of preferred languages in, the best translation out (or{' '}
        <code>undefined</code>).
      </li>
      <li>
        For each preferred language in order, it takes the same tag, else that
        tag shortened (<code>en-GB</code> to <code>en</code>), else the same
        language with another region (<code>en-GB</code> for a preferred{' '}
        <code>en-US</code>), before moving on to the next preferred language.
      </li>
    </ul>
    <CodeView code={matchLanguageCode} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const settingsPartsDemos = [ProviderPart];
