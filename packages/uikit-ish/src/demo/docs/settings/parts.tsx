import './style.css';

import { FunctionComponent, useState } from 'react';

import { Settings, type SettingsValues } from '../../../components/index.js';
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
      <li>Provider: settings for what’s within it.</li>
      <li>Hooks: the settings resolved (for logic), a portal’s props.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="settings"
          part="Settings.Provider"
        />{' '}
        (optional; nested, each overriding the outer one’s)
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
        Its settings, each optional: given, an override for what’s within it;
        given <code>undefined</code>, reset (the system’s, or the default,
        whatever an outer provider set); left out, the outer provider’s. Here,
        each control’s <code>[inherit]</code> leaves it out.
      </li>
      <li>
        On its element as custom properties (<code>--uikit-settings-*</code>,
        see <a href={publicUrl('tokens')}>Design tokens</a>), the nearest
        provider’s inherited; and its color scheme (<code>color-scheme</code>,{' '}
        <code>data-color-scheme</code>).
      </li>
      <li>
        Renders a <code>div</code> without a box (<code>display: contents</code>
        ), or its <code>render</code>.
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
        The settings where it’s called: each the nearest provider’s override,
        else the system’s (live, as it changes), else its default.
      </li>
      <li>
        For component logic (e.g. animations in script). A component’s own props
        win over them.
      </li>
    </ul>
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
        A portal’s props, spread on it: the overrides where it’s opened, as on a
        provider’s element (a portal is outside it, e.g. in the body).
      </li>
      <li>
        The library’s portals spread it already (
        <PartLink
          component="menu"
          part="Menu.Portal"
        />
        ,{' '}
        <PartLink
          component="popover"
          part="Popover.Portal"
        />
        , …): for a portal of the app’s own.
      </li>
    </ul>
    <h3>Value</h3>
    <PropsTable rows={settingsPortalPropsRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const settingsPartsDemos = [ProviderPart];
