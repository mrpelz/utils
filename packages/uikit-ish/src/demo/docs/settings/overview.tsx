import './style.css';

import { CSSProperties, FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Checkbox,
  Menu,
  Settings,
  type SettingsValues,
  Slider,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
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
import { given, propOptionsProvider, propOptionsTint, tints } from './props.js';
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

const tintCode = `:root {
  /* Your app's tint (without one, the system blue). */
  --uikit-tint: light-dark(rgb(0 128 128), rgb(64 200 200));
  /* Optional: the same with more contrast (without it, the tint above). */
  --uikit-tint-more-contrast: light-dark(rgb(0 92 92), rgb(140 230 230));
}`;

/**
 * An app's tint (around a provider, as an app's root would have it): the
 * controls that follow it, with a provider's contrast and color scheme.
 */
const TintView: FunctionComponent = () => {
  const id = 'settings-overview-tint';
  const [log, addLog] = useLog();
  const [externalTint, externalProvider] = useProvidedState(id);
  const [controlTint, tint, stateTint] = usePropControl(propOptionsTint, {
    external: externalTint,
    isOpen: true,
    title: '[tint]',
  });
  const [controlProvider, propsProvider, stateProvider] = usePropControl(
    propOptionsProvider,
    {
      external: externalProvider,
      isOpen: true,
      title: 'Settings.Provider',
    },
  );
  const [settings, setSettings] = useState<SettingsValues>();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'Checkbox.Root': ['aria-label', 'defaultChecked'],
            'Settings.Provider': ['render'],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Root': ['defaultValue'],
            'Slider.Thumb': ['aria-label'],
            'Slider.Track': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [standard, moreContrast] =
    tint.tint === undefined ? [] : (tints[tint.tint] ?? []);
  const style = {
    ...(standard !== undefined && { '--uikit-tint': standard }),
    ...(moreContrast !== undefined &&
      tint.moreContrastVariant && {
        '--uikit-tint-more-contrast': moreContrast,
      }),
  } as CSSProperties;

  return (
    <Component
      isCentered
      isInline
      controls={[controlTint, controlProvider, partControls]}
      diagnostics={<SettingsTable columns={[['Provider', settings]]} />}
      id={id}
      log={log}
      state={[stateTint, stateProvider, partState]}
      title="An app’s tint"
    >
      {/* (The tint set around the provider, as an app sets it on :root.) */}
      <div style={style}>
        <Settings.Provider
          {...partProps['Settings.Provider']}
          {...given(propsProvider)}
          render={<div className="settings-demo-panel" />}
        >
          <SettingsReport onReport={setSettings} />
          <Button.Root
            {...partProps['Button.Root']}
            variant="bordered-prominent"
            onClick={() => addLog('continue clicked')}
          >
            <Button.Label {...partProps['Button.Label']}>Continue</Button.Label>
          </Button.Root>
          <Button.Root
            {...partProps['Button.Root']}
            variant="borderless"
            onClick={() => addLog('edit clicked')}
          >
            <Button.Label {...partProps['Button.Label']}>Edit</Button.Label>
          </Button.Root>
          <Checkbox.Root
            {...partProps['Checkbox.Root']}
            defaultChecked
            aria-label="Selected"
          />
          <Slider.Root
            {...partProps['Slider.Root']}
            defaultValue={60}
          >
            <Slider.Control {...partProps['Slider.Control']}>
              <Slider.Track {...partProps['Slider.Track']}>
                <Slider.Indicator {...partProps['Slider.Indicator']} />
                <Slider.Thumb
                  {...partProps['Slider.Thumb']}
                  aria-label="Volume"
                />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </Settings.Provider>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['key-props', 'Key props'],
  ['behavior', 'Behavior'],
  ['your-apps-tint', 'Your app’s tint'],
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

    <Heading
      id="your-apps-tint"
      level={2}
    >
      Your app’s tint
    </Heading>
    <ul>
      <li>
        A <a href={publicUrl('button')}>Button</a>, a{' '}
        <a href={publicUrl('checkbox')}>Checkbox</a>, a{' '}
        <a href={publicUrl('slider')}>Slider</a> and other controls are drawn in
        the app’s tint. Without one, it’s the system blue.
      </li>
      <li>
        Set <code>--uikit-tint</code> to your tint, for example on{' '}
        <code>:root</code>. If you have a version with more contrast, set{' '}
        <code>--uikit-tint-more-contrast</code> too. With more contrast, the
        library uses that one, and without it, your tint as it is.
      </li>
      <li>
        Give both as colors. <code>light-dark()</code> works, so one value can
        cover both color schemes. A palette color such as{' '}
        <code>var(--color-ui-system-pink)</code> resolves where you set it, so
        inside a provider it won’t switch to the provider’s contrast. Give the
        contrast version as a color of its own instead.
      </li>
      <li>
        Don’t set <code>--color-ui-primary</code> yourself. The library derives
        it from your tint, again inside every provider, so it follows that
        provider’s contrast.
      </li>
    </ul>
    <CodeView code={tintCode} />
    <TintView />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const settingsOverviewDemos = [LiveView, TintView];
