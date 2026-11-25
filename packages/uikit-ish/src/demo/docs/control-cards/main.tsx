import '../card/style.css';

import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  cardSizes,
  ControlCards,
  Grid,
  type GridSize,
  Page,
  Viewport,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  type PartProps,
  usePartControls,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { gridSigns } from '../../tooling/grid-signs.js';
import {
  sfBell,
  sfBellFill,
  sfFan,
  sfFanFill,
  sfFlameFill,
  sfHouseFill,
  sfHumidityFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLightStrip2,
  sfLightStrip2Fill,
  sfLockFill,
  sfLockOpen,
  sfPower,
  sfSnowflake,
  sfThermometerMedium,
  sfWasher,
  sfWasherFill,
  sfWindowShadeClosed,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';

/** A tile on the stage (see `controlCardsStage`): its card and sizes. */
export type StageTile = {
  card: ReactNode;
  name: string;
  /** Its size opened above the page (none: it doesn't open). */
  openSize?: GridSize;
  size: GridSize;
  sizes: readonly GridSize[];
};

/** Which tile is open above the page (the app's state; see the stage). */
export const useStageOpen = (): readonly [
  string | undefined,
  (name: string, open: boolean) => void,
] => {
  const [opened, setOpened] = useState<string | undefined>(undefined);
  return [opened, (name, open) => setOpened(open ? name : undefined)] as const;
};

/**
 * A phone's page of control cards on a picture, in a grid: each tile its
 * card, its size, its supported sizes, opening above the page where it has
 * a size for that. Its parts' props from `partProps`. A function returning
 * its JSX, called in the demo (not a component): the demo's code shows the
 * parts as written.
 */
export const controlCardsStage = (
  tiles: readonly StageTile[],
  partProps: PartProps,
  [opened, setOpen]: ReturnType<typeof useStageOpen>,
): ReactNode => (
  <>
    <Viewport.Background>
      <div
        aria-hidden="true"
        className="demo-picture"
      />
    </Viewport.Background>
    <Viewport.Content {...partProps['Viewport.Content']}>
      <Page.Root
        {...partProps['Page.Root']}
        className={['card-demo-page', partProps['Page.Root']?.className]
          .filter(Boolean)
          .join(' ')}
      >
        <Viewport.Padding edge="block-start" />
        <div className="card-demo-content">
          <Grid.Root
            {...partProps['Grid.Root']}
            style={gridSigns(partProps['Grid.Root']?.style)}
          >
            {tiles.map(({ card, name, openSize, size, sizes }) => (
              <Grid.Item
                key={name}
                {...partProps['Grid.Item']}
                dropName={name}
                size={size}
                supportedSizes={sizes}
                {...(openSize && {
                  open: opened === name,
                  openLabel: name,
                  openSize,
                })}
                onOpenChange={(open) => setOpen(name, open)}
              >
                {card}
              </Grid.Item>
            ))}
          </Grid.Root>
        </div>
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Viewport.Content>
  </>
);

/** The parts the stage shows (see `controlCardsStage`), the props it sets. */
export const stageParts = {
  'Grid.Item': [
    'dropName',
    'onOpenChange',
    'open',
    'openLabel',
    'openSize',
    'size',
    'supportedSizes',
  ],
  'Grid.Root': [],
  'Page.Root': [],
  'Viewport.Content': [],
} as const;

const percent = { maximumFractionDigits: 0, style: 'percent' } as const;

/**
 * One of each control card, as an app shows its home's devices; their
 * props from `partProps` too (see `everyCardParts`).
 */
export const everyCardOf = (partProps: PartProps): readonly StageTile[] => [
  {
    card: (
      <ControlCards.Switch
        {...partProps['ControlCards.Switch']}
        defaultChecked
        emphasizedIcon={sfLightbulbFill}
        icon={sfLightbulb}
        name="Floor Lamp"
      />
    ),
    name: 'Floor Lamp',
    size: '2x1',
    sizes: cardSizes.binaryControl,
  },
  {
    card: (
      <ControlCards.Switch
        {...partProps['ControlCards.Switch']}
        emphasizedIcon={sfFanFill}
        icon={sfFan}
        name="Ceiling Fan"
      />
    ),
    name: 'Ceiling Fan',
    size: '1x1',
    sizes: cardSizes.binaryControl,
  },
  {
    card: (
      <ControlCards.Slider
        {...partProps['ControlCards.Slider']}
        brightness
        defaultChecked
        defaultValue={0.6}
        emphasizedIcon={sfLightbulbFill}
        format={percent}
        icon={sfLightbulb}
        max={1}
        min={0}
        name="Dimmer"
        tint={cardTints.light}
      />
    ),
    name: 'Dimmer',
    size: '2x1',
    sizes: cardSizes.numericalControl,
  },
  {
    card: (
      <ControlCards.Slider
        {...partProps['ControlCards.Slider']}
        defaultValue={0.5}
        format={percent}
        icon={sfWindowShadeClosed}
        max={1}
        min={0}
        name="Blinds"
        step={0.25}
        tint={cardTints.shade}
      />
    ),
    name: 'Blinds',
    size: '1x2',
    sizes: cardSizes.numericalControl,
  },
  {
    card: (
      <ControlCards.State
        {...partProps['ControlCards.State']}
        active
        emphasizedIcon={sfLockFill}
        icon={sfLockOpen}
        name="Front Door"
        states={['Locked', 'Unlocked']}
      />
    ),
    name: 'Front Door',
    size: '1x1',
    sizes: cardSizes.binaryDisplay,
  },
  {
    card: (
      <ControlCards.Value
        {...partProps['ControlCards.Value']}
        format={percent}
        icon={sfHumidityFill}
        name="Humidity"
        trend={-20}
        value={0.46}
      />
    ),
    name: 'Humidity',
    size: '1x1',
    sizes: cardSizes.numericalDisplay,
  },
  {
    card: (
      <ControlCards.Light
        {...partProps['ControlCards.Light']}
        emphasizedIcon={sfLightStrip2Fill}
        icon={sfLightStrip2}
        name="Light Strip"
      >
        <ControlCards.Channels {...partProps['ControlCards.Channels']}>
          <ControlCards.Channel
            {...partProps['ControlCards.Channel']}
            defaultValue={1}
            name="Red"
            tint="#ff3b30"
          />
          <ControlCards.Channel
            {...partProps['ControlCards.Channel']}
            defaultValue={0.6}
            name="Green"
            tint="#34c759"
          />
          <ControlCards.Channel
            {...partProps['ControlCards.Channel']}
            defaultValue={0.2}
            name="Blue"
            tint="#0a84ff"
          />
        </ControlCards.Channels>
        <ControlCards.OpenButtons
          {...partProps['ControlCards.OpenButtons']}
          closeLabel="Close"
          label="Light Strip details"
        />
      </ControlCards.Light>
    ),
    name: 'Light Strip',
    openSize: '4x3',
    size: '2x1',
    sizes: cardSizes.binaryControl,
  },
  {
    card: (
      <ControlCards.Button
        {...partProps['ControlCards.Button']}
        emphasizedIcon={sfBellFill}
        icon={sfBell}
        name="Doorbell"
        status="Quiet"
      />
    ),
    name: 'Doorbell',
    size: '1x1',
    sizes: cardSizes.binaryControl,
  },
  {
    card: (
      <ControlCards.Progress
        {...partProps['ControlCards.Progress']}
        active
        emphasizedIcon={sfWasherFill}
        icon={sfWasher}
        name="Washer"
        value={53}
      >
        <ControlCards.ProgressBar {...partProps['ControlCards.ProgressBar']}>
          <ControlCards.ProgressLabel
            {...partProps['ControlCards.ProgressLabel']}
          >
            Rinsing
          </ControlCards.ProgressLabel>
          <ControlCards.ProgressDetail
            {...partProps['ControlCards.ProgressDetail']}
          >
            42 min left
          </ControlCards.ProgressDetail>
        </ControlCards.ProgressBar>
      </ControlCards.Progress>
    ),
    name: 'Washer',
    size: '2x1',
    sizes: cardSizes.progressDisplay,
  },
  {
    card: (
      <ControlCards.List
        {...partProps['ControlCards.List']}
        icon={sfHouseFill}
        name="Living Room"
        opening={{ closeLabel: 'Close', label: 'Living Room details' }}
        rows={[
          { icon: sfLightbulbFill, label: 'Lights', value: '2 on' },
          { icon: sfThermometerMedium, label: 'Temperature', value: '21.5 °C' },
          { icon: sfHumidityFill, label: 'Humidity', value: '46 %' },
          { icon: sfWindowShadeClosed, label: 'Blinds', value: '50 %' },
        ]}
      />
    ),
    name: 'Living Room',
    openSize: '4x3',
    size: '2x2',
    sizes: cardSizes.summaryDisplay,
  },
  {
    card: (
      <ControlCards.Segmented
        {...partProps['ControlCards.Segmented']}
        defaultValue="heat"
        icon={sfPower}
        name="Heat Pump"
        offValue="off"
      >
        <ControlCards.SegmentedItem
          {...partProps['ControlCards.SegmentedItem']}
          icon={sfPower}
          value="off"
        >
          Off
        </ControlCards.SegmentedItem>
        <ControlCards.SegmentedItem
          {...partProps['ControlCards.SegmentedItem']}
          icon={sfFlameFill}
          tint={cardTints.heat}
          value="heat"
        >
          Heat
        </ControlCards.SegmentedItem>
        <ControlCards.SegmentedItem
          {...partProps['ControlCards.SegmentedItem']}
          icon={sfSnowflake}
          tint={cardTints.shade}
          value="cool"
        >
          Cool
        </ControlCards.SegmentedItem>
        <ControlCards.SegmentedItem
          {...partProps['ControlCards.SegmentedItem']}
          icon={sfThermometerMedium}
          value="auto"
        >
          Auto
        </ControlCards.SegmentedItem>
      </ControlCards.Segmented>
    ),
    name: 'Heat Pump',
    size: '2x1',
    sizes: cardSizes.choiceControl,
  },
];

/** The parts `everyCardOf` renders, and the props it sets on them. */
export const everyCardParts = {
  'ControlCards.Button': ['emphasizedIcon', 'icon', 'name', 'status'],
  'ControlCards.Channel': ['defaultValue', 'name', 'tint'],
  'ControlCards.Channels': ['children'],
  'ControlCards.Light': ['children', 'emphasizedIcon', 'icon', 'name'],
  'ControlCards.List': ['icon', 'name', 'opening', 'rows'],
  'ControlCards.Segmented': [
    'children',
    'defaultValue',
    'icon',
    'name',
    'offValue',
  ],
  'ControlCards.SegmentedItem': ['children', 'icon', 'tint', 'value'],
  'ControlCards.Progress': [
    'active',
    'children',
    'emphasizedIcon',
    'icon',
    'name',
    'value',
  ],
  'ControlCards.ProgressBar': ['children'],
  'ControlCards.ProgressDetail': ['children'],
  'ControlCards.ProgressLabel': ['children'],
  'ControlCards.Slider': [
    'brightness',
    'defaultChecked',
    'defaultValue',
    'emphasizedIcon',
    'format',
    'icon',
    'max',
    'min',
    'name',
    'step',
    'tint',
  ],
  'ControlCards.State': ['active', 'emphasizedIcon', 'icon', 'name', 'states'],
  'ControlCards.Switch': ['defaultChecked', 'emphasizedIcon', 'icon', 'name'],
  'ControlCards.Value': ['format', 'icon', 'name', 'trend', 'value'],
} as const;

/** A phone: one of each control card, in a grid. */
export const ControlCardsDemo: FunctionComponent = () => {
  const id = 'control-cards';
  const [log, addLog] = useLog();
  const open = useStageOpen();
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () => partPropMaps({ ...stageParts, ...everyCardParts }, addLog),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="ControlCards"
    >
      {controlCardsStage(everyCardOf(partProps), partProps, open)}
    </Component>
  );
};
