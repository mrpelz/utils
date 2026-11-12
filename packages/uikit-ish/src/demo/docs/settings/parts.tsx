import './style.css';

import { FunctionComponent, useState } from 'react';

import { Settings, type SettingsValues } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import {
  settingsPortalPropsRows,
  settingsProviderRows,
  settingsValuesRows,
} from './docs.js';
import { given, propOptionsProviderPart } from './props.js';
import { SettingsReport, SettingsTable } from './report.js';

const useSettingsCode = `import { useSettings } from '@mrpelz/uikit-ish';

export const Spinner = () => {
  const { reducedMotion } = useSettings();

  // Moved from script: no movement with reduced motion.
  return <div data-spinning={reducedMotion ? undefined : ''} />;
};`;

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
        Hooks: the resolved settings for your own logic, and the props a portal
        needs to follow them.
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
        The settings are set on its element as custom properties (
        <code>--uikit-settings-*</code>, see{' '}
        <a href={publicUrl('tokens')}>Design tokens</a>), inherited from the
        nearest provider. The color scheme is also set as{' '}
        <code>color-scheme</code> and <code>data-color-scheme</code>.
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
        from its default.
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
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const settingsPartsDemos = [ProviderPart];
