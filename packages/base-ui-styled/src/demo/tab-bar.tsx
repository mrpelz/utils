import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { TabBar } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';

const primaryValues = ['first', 'second', 'third', 'fourth', 'fifth'] as const;
const secondaryValues = ['secondary-1', 'secondary-2', 'secondary-3'] as const;

const propOptionsContent = {
  tabs: [3, 1, 2, 4, 5] as const,
  icon: ['★', undefined] as const,
  label: ['Label', undefined, 'Long tab label'] as const,
  panels: [false, true] as const,
} as const;

const propOptionsSecondaryContent = {
  tabs: [1, 2, 3] as const,
  icon: ['⌕', '＋', undefined] as const,
  label: [undefined, 'Search'] as const,
} as const;

const propOptionsList = {
  ...commonPropOptions,
  activateOnFocus: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  context: [undefined, 'bright', 'dim'] as const,
};

const propOptionsIndicator = {
  ...commonPropOptions,
  renderBeforeHydration: [undefined, false, true] as const,
};

const propOptionsPanel = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

const getPropOptionsTab = (value: string) => ({
  ...commonPropOptions,
  value: [value, undefined] as const,
  shape: [undefined, 'capsule', 'circle'] as const,
  disabled: [undefined, false, true] as const,
  nativeButton: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
});

const propOptionsGroup = {
  ...commonPropOptions,
  shape: [undefined, 'capsule', 'circle'] as const,
};

const propOptionsSecondaryGroup = {
  ...commonPropOptions,
  shape: ['circle', undefined, 'capsule'] as const,
};

const TabBarDemoBase: FunctionComponent<{
  secondary: boolean;
  title: string;
}> = ({ secondary, title }) => {
  const [log, addLog] = useLog();

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlSecondaryContent, secondaryContent] = usePropControl(
    propOptionsSecondaryContent,
    '[secondary content]',
    true,
  );

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        defaultValue: [
          'first',
          'second',
          ...(secondary ? (['secondary-1'] as const) : []),
          undefined,
        ] as const,
        value: [
          undefined,
          'first',
          ...(secondary ? (['secondary-1'] as const) : []),
        ] as const,
        orientation: [undefined, 'horizontal', 'vertical'] as const,
        onValueChange: [
          new MappedProp(
            (value: unknown, { reason }: BaseTabs.Root.ChangeEventDetails) =>
              addLog(`value change: ${String(value)}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog, secondary],
    ),
    'root',
    true,
  );

  const [controlList, propsList] = usePropControl(
    propOptionsList,
    'list',
    true,
  );

  const [controlGroup, propsGroup] = usePropControl(propOptionsGroup, 'group');

  const [controlIndicator, propsIndicator] = usePropControl(
    propOptionsIndicator,
    'indicator',
  );

  const [controlTabFirst, propsTabFirst] = usePropControl(
    useMemo(() => getPropOptionsTab('first'), []),
    '1st tab',
  );

  const [controlTabSecond, propsTabSecond] = usePropControl(
    useMemo(() => getPropOptionsTab('second'), []),
    '2nd tab',
  );

  const [controlTabThird, propsTabThird] = usePropControl(
    useMemo(() => getPropOptionsTab('third'), []),
    '3rd tab',
  );

  const [controlTabFourth, propsTabFourth] = usePropControl(
    useMemo(() => getPropOptionsTab('fourth'), []),
    '4th tab',
  );

  const [controlTabFifth, propsTabFifth] = usePropControl(
    useMemo(() => getPropOptionsTab('fifth'), []),
    '5th tab',
  );

  const [controlSecondaryGroup, propsSecondaryGroup] = usePropControl(
    propOptionsSecondaryGroup,
    'secondary group',
  );

  const [controlSecondaryIndicator, propsSecondaryIndicator] = usePropControl(
    propOptionsIndicator,
    'secondary indicator',
  );

  const [controlSecondaryTabFirst, propsSecondaryTabFirst] = usePropControl(
    useMemo(() => getPropOptionsTab('secondary-1'), []),
    '1st secondary tab',
  );

  const [controlSecondaryTabSecond, propsSecondaryTabSecond] = usePropControl(
    useMemo(() => getPropOptionsTab('secondary-2'), []),
    '2nd secondary tab',
  );

  const [controlSecondaryTabThird, propsSecondaryTabThird] = usePropControl(
    useMemo(() => getPropOptionsTab('secondary-3'), []),
    '3rd secondary tab',
  );

  const [controlIcon, propsIcon] = usePropControl(commonPropOptions, 'icons');

  const [controlLabel, propsLabel] = usePropControl(
    commonPropOptions,
    'labels',
  );

  const [controlPanel, propsPanel] = usePropControl(propOptionsPanel, 'panels');

  const primaryTabs = [
    propsTabFirst,
    propsTabSecond,
    propsTabThird,
    propsTabFourth,
    propsTabFifth,
  ].slice(0, content.tabs);

  const secondaryTabs = [
    propsSecondaryTabFirst,
    propsSecondaryTabSecond,
    propsSecondaryTabThird,
  ].slice(0, secondaryContent.tabs);

  const panelValues = [
    ...primaryValues.slice(0, content.tabs),
    ...(secondary ? secondaryValues.slice(0, secondaryContent.tabs) : []),
  ];

  return (
    <Component
      backdrop
      center
      stretch
      id="tabs"
      log={log}
      title={title}
      controls={[
        controlContent,
        ...(secondary ? [controlSecondaryContent] : []),
        controlRoot,
        controlList,
        controlGroup,
        controlIndicator,
        controlTabFirst,
        controlTabSecond,
        controlTabThird,
        controlTabFourth,
        controlTabFifth,
        ...(secondary
          ? [
              controlSecondaryGroup,
              controlSecondaryIndicator,
              controlSecondaryTabFirst,
              controlSecondaryTabSecond,
              controlSecondaryTabThird,
            ]
          : []),
        controlIcon,
        controlLabel,
        controlPanel,
      ]}
    >
      <RemounterRoot>
        <TabBar.Root {...propsRoot}>
          {content.panels
            ? panelValues.map((value) => (
                <TabBar.Panel
                  key={value}
                  {...propsPanel}
                  value={value}
                >
                  Panel: {value}
                </TabBar.Panel>
              ))
            : null}
          <TabBar.List {...propsList}>
            <TabBar.Group {...propsGroup}>
              <TabBar.Indicator {...propsIndicator} />
              {primaryTabs.map((propsTab, index) => (
                <TabBar.Tab
                  key={primaryValues[index]}
                  {...propsTab}
                >
                  {content.icon === undefined ? null : (
                    <TabBar.Icon {...propsIcon}>{content.icon}</TabBar.Icon>
                  )}
                  {content.label === undefined ? null : (
                    <TabBar.Label {...propsLabel}>{content.label}</TabBar.Label>
                  )}
                </TabBar.Tab>
              ))}
            </TabBar.Group>
            {secondary ? (
              <TabBar.Group {...propsSecondaryGroup}>
                <TabBar.Indicator {...propsSecondaryIndicator} />
                {secondaryTabs.map((propsTab, index) => (
                  <TabBar.Tab
                    key={secondaryValues[index]}
                    {...propsTab}
                  >
                    {secondaryContent.icon === undefined ? null : (
                      <TabBar.Icon {...propsIcon}>
                        {secondaryContent.icon}
                      </TabBar.Icon>
                    )}
                    {secondaryContent.label === undefined ? null : (
                      <TabBar.Label {...propsLabel}>
                        {secondaryContent.label}
                      </TabBar.Label>
                    )}
                  </TabBar.Tab>
                ))}
              </TabBar.Group>
            ) : null}
          </TabBar.List>
        </TabBar.Root>
      </RemounterRoot>
    </Component>
  );
};

export const TabBarDemo: FunctionComponent = () => (
  <TabBarDemoBase
    secondary={false}
    title="Tab Bar"
  />
);

export const TabBarSecondaryDemo: FunctionComponent = () => (
  <TabBarDemoBase
    secondary
    title="Tab Bar (Secondary Group)"
  />
);
