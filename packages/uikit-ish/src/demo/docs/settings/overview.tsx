import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Menu,
  Settings,
  type SettingsValues,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Settings.Provider': ['render'],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'Menu.Item': ['onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.Root': [],
            'Menu.Trigger': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[controlOuter, controlInner, partControls]}
      id={id}
      log={log}
      state={[stateOuter, stateInner, partState]}
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
        {...partProps['Settings.Provider']}
        {...given(propsOuter)}
        render={<div className="settings-demo-panel" />}
      >
        <SettingsReport onReport={setOuter} />
        <span className="settings-demo-label">Outer</span>
        <Settings.Provider
          {...partProps['Settings.Provider']}
          {...given(propsInner)}
          render={<div className="settings-demo-panel" />}
        >
          <SettingsReport onReport={setInner} />
          <span className="settings-demo-label">Inner</span>
          <Menu.Root {...partProps['Menu.Root']}>
            <Menu.Trigger
              {...partProps['Menu.Trigger']}
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  variant="bordered"
                />
              }
            >
              <Button.Label {...partProps['Button.Label']}>Menu</Button.Label>
            </Menu.Trigger>
            <Menu.Portal {...partProps['Menu.Portal']}>
              <Menu.Positioner {...partProps['Menu.Positioner']}>
                <Menu.Popup {...partProps['Menu.Popup']}>
                  <Menu.Item
                    {...partProps['Menu.Item']}
                    onClick={() => addLog('copy clicked')}
                  >
                    <Menu.Label {...partProps['Menu.Label']}>Copy</Menu.Label>
                  </Menu.Item>
                  <Menu.Item
                    {...partProps['Menu.Item']}
                    onClick={() => addLog('paste clicked')}
                  >
                    <Menu.Label {...partProps['Menu.Label']}>Paste</Menu.Label>
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
        motion, reduced transparency, differentiating without color, and text
        size.
      </li>
      <li>
        By default, each one follows the system through a media query, and
        updates live. A provider overrides some of them for everything inside
        it. A provider inside that one can override them again, or reset them.
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
        Your app has settings of its own that should win over the system’s. For
        example, a dark mode switch, or reduced motion for the whole app.
      </li>
      <li>
        One view needs different settings from the rest. For example, a dark
        media viewer in a light app, or a preview at another text size.
      </li>
      <li>
        A component’s own props still win over a provider. For example, a{' '}
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
      <li>
        Every setting is optional. A setting you leave out is inherited from the
        provider around it.
      </li>
      <li>
        All props, and the hooks, are on the{' '}
        <a href={publicUrl('settings/parts')}>Parts</a> page.
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
        A setting comes from the nearest provider that overrides it. Without
        one, it follows the system. Without a system value, it uses its default.
      </li>
      <li>
        A provider overrides the settings it’s given. A setting given as{' '}
        <code>undefined</code> is reset: it follows the system again, whatever
        an outer provider set. A setting left out comes from the outer provider.
      </li>
      <li>
        For CSS, a provider sets custom properties (
        <code>--uikit-settings-*</code>, see{' '}
        <a href={publicUrl('tokens')}>Design tokens</a>) on its element.
        Elements inside inherit them from the nearest provider. The element has
        no box of its own (<code>display: contents</code>). For logic, use{' '}
        <PartLink
          component="settings"
          part="useSettings"
        />
        .
      </li>
      <li>
        Popups opened inside a provider follow its settings, even though their
        portals render outside its element. That covers a{' '}
        <a href={publicUrl('menu')}>Menu</a>, a{' '}
        <a href={publicUrl('popover')}>Popover</a>, a{' '}
        <a href={publicUrl('sheet')}>Sheet</a> and an{' '}
        <a href={publicUrl('alert')}>Alert</a> (see{' '}
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
