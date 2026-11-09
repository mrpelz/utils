import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  Button,
  Menu,
  Settings,
  type SettingsValues,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { settingsProviderRows } from './docs.js';
import { given, propOptionsProvider } from './props.js';
import { SettingsReport, SettingsTable } from './report.js';

/**
 * Two providers, one in the other: each a panel (its color scheme shown),
 * the inner one's menu opening in a portal, following its settings. Their
 * settings, resolved, in its diagnostics.
 */
const LiveView: FunctionComponent = () => {
  const id = 'settings-overview';
  const [log, addLog] = useLog();
  const [externalOuter, externalInner] = useProvidedState(id);
  const [controlOuter, propsOuter, stateOuter] = usePropControl(
    propOptionsProvider,
    {
      external: externalOuter,
      isOpen: true,
      title: 'Settings.Provider (outer)',
    },
  );
  const [controlInner, propsInner, stateInner] = usePropControl(
    propOptionsProvider,
    {
      external: externalInner,
      isOpen: true,
      title: 'Settings.Provider (inner)',
    },
  );
  const [outer, setOuter] = useState<SettingsValues>();
  const [inner, setInner] = useState<SettingsValues>();

  return (
    <Component
      isCentered
      isInline
      controls={[controlOuter, controlInner]}
      id={id}
      log={log}
      state={[stateOuter, stateInner]}
      title="Settings"
      diagnostics={
        <SettingsTable
          columns={[
            ['Outer', outer],
            ['Inner', inner],
          ]}
        />
      }
    >
      <Settings.Provider
        {...given(propsOuter)}
        render={<div className="settings-demo-panel" />}
      >
        <SettingsReport onReport={setOuter} />
        <span className="settings-demo-label">Outer</span>
        <Settings.Provider
          {...given(propsInner)}
          render={<div className="settings-demo-panel" />}
        >
          <SettingsReport onReport={setInner} />
          <span className="settings-demo-label">Inner</span>
          <Menu.Root>
            <Menu.Trigger render={<Button.Root variant="bordered" />}>
              <Button.Label>Menu</Button.Label>
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup>
                  <Menu.Item onClick={() => addLog('copy clicked')}>
                    <Menu.Label>Copy</Menu.Label>
                  </Menu.Item>
                  <Menu.Item onClick={() => addLog('paste clicked')}>
                    <Menu.Label>Paste</Menu.Label>
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </Settings.Provider>
      </Settings.Provider>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['key-props', 'Key props'],
  ['behavior', 'Behavior'],
];

/** `/settings`: what the settings are, how providers nest. */
export const SettingsOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        The settings the components follow: color scheme, contrast, reduced
        motion and transparency, differentiating without color, text size.
      </li>
      <li>
        Each the system’s (a media query’s, live) by default; a provider
        overrides some for what’s within it, a provider in it some of those
        again, or resets them.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        An app’s own settings over the system’s: e.g. a dark mode switch, or
        motion reduced for the whole app.
      </li>
      <li>
        A view of its own: e.g. a dark media viewer in a light app, or a preview
        at another text size.
      </li>
      <li>
        A component’s own props still win: e.g. a{' '}
        <a href={publicUrl('switch')}>Switch</a>’s <code>onOffLabels</code>, a{' '}
        <a href={publicUrl('date-picker')}>Date picker</a>’s <code>locale</code>
        .
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>Its settings, each optional: left out, inherited.</li>
      <li>
        All its props, and the hooks:{' '}
        <a href={publicUrl('settings/parts')}>Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Settings.Provider',
          pickRows(
            settingsProviderRows,
            'colorScheme',
            'contrast',
            'reducedMotion',
          ),
        ],
      ]}
    />

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        A setting is the nearest provider’s override, else the system’s, else
        its default. A provider overrides those it’s given; given{' '}
        <code>undefined</code>, it resets them (the system’s again, whatever an
        outer provider set); left out, they’re its outer provider’s.
      </li>
      <li>
        For CSS: custom properties (<code>--uikit-settings-*</code>, see{' '}
        <a href={publicUrl('tokens')}>Design tokens</a>), set by a provider on
        its element (no box of its own: <code>display: contents</code>), the
        nearest one’s inherited. For logic:{' '}
        <PartLink
          component="settings"
          part="useSettings"
        />
        .
      </li>
      <li>
        Popups opened within a provider (a <a href={publicUrl('menu')}>Menu</a>
        ’s, a <a href={publicUrl('popover')}>Popover</a>’s, a{' '}
        <a href={publicUrl('sheet')}>Sheet</a>’s, an{' '}
        <a href={publicUrl('alert')}>Alert</a>) follow it, though their portals
        are outside its element (see{' '}
        <PartLink
          component="settings"
          part="useSettingsPortalProps"
        />
        ).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const settingsOverviewDemos = [LiveView];
