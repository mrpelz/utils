import '../card/style.css';

import { FunctionComponent, useMemo } from 'react';

import { Card, cardSizes, ControlCards } from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  type PartProps,
  usePartControls,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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
import {
  stageParts,
  type StageTile,
  tileStage,
  useStageOpen,
} from '../card/stage.js';
import { partPropMaps } from '../part-options.js';

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
        label="Floor Lamp"
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
        label="Ceiling Fan"
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
        label="Dimmer"
        max={1}
        min={0}
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
        label="Blinds"
        max={1}
        min={0}
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
        label="Front Door"
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
        label="Humidity"
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
        defaultChecked
        emphasizedIcon={sfLightStrip2Fill}
        icon={sfLightStrip2}
        label="Light Strip"
      >
        <Card.Channels {...partProps['Card.Channels']}>
          <Card.Channel
            {...partProps['Card.Channel']}
            defaultValue={100}
            label="Red"
            tint="#ff3b30"
          />
          <Card.Channel
            {...partProps['Card.Channel']}
            defaultValue={60}
            label="Green"
            tint="#34c759"
          />
          <Card.Channel
            {...partProps['Card.Channel']}
            defaultValue={20}
            label="Blue"
            tint="#0a84ff"
          />
        </Card.Channels>
        <Card.OpenButton
          {...partProps['Card.OpenButton']}
          aria-label="Light Strip details"
        />
        <Card.CloseButton
          {...partProps['Card.CloseButton']}
          aria-label="Close"
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
        label="Doorbell"
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
        label="Washer"
      >
        <Card.Progress
          {...partProps['Card.Progress']}
          value={53}
        >
          <Card.ProgressBar {...partProps['Card.ProgressBar']}>
            <Card.ProgressLabel {...partProps['Card.ProgressLabel']}>
              Rinsing
            </Card.ProgressLabel>
            <Card.ProgressDetail {...partProps['Card.ProgressDetail']}>
              42 min left
            </Card.ProgressDetail>
          </Card.ProgressBar>
        </Card.Progress>
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
        label="Living Room"
      >
        <Card.Rows {...partProps['Card.Rows']}>
          <Card.Row
            {...partProps['Card.Row']}
            icon={sfLightbulbFill}
            value="2 on"
          >
            Lights
          </Card.Row>
          <Card.Row
            {...partProps['Card.Row']}
            icon={sfThermometerMedium}
            value="21.5 °C"
          >
            Temperature
          </Card.Row>
          <Card.Row
            {...partProps['Card.Row']}
            icon={sfHumidityFill}
            value="46 %"
          >
            Humidity
          </Card.Row>
          <Card.Row
            {...partProps['Card.Row']}
            icon={sfWindowShadeClosed}
            value="50 %"
          >
            Blinds
          </Card.Row>
        </Card.Rows>
        <Card.CloseButton
          {...partProps['Card.CloseButton']}
          aria-label="Close"
        />
      </ControlCards.List>
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
        icon={sfPower}
        label="Heat Pump"
        offValue="off"
      >
        <Card.Segmented
          {...partProps['Card.Segmented']}
          defaultValue="heat"
        >
          <Card.SegmentedItem
            {...partProps['Card.SegmentedItem']}
            icon={sfPower}
            value="off"
          >
            Off
          </Card.SegmentedItem>
          <Card.SegmentedItem
            {...partProps['Card.SegmentedItem']}
            icon={sfFlameFill}
            tint={cardTints.heat}
            value="heat"
          >
            Heat
          </Card.SegmentedItem>
          <Card.SegmentedItem
            {...partProps['Card.SegmentedItem']}
            icon={sfSnowflake}
            tint={cardTints.shade}
            value="cool"
          >
            Cool
          </Card.SegmentedItem>
          <Card.SegmentedItem
            {...partProps['Card.SegmentedItem']}
            icon={sfThermometerMedium}
            value="auto"
          >
            Auto
          </Card.SegmentedItem>
        </Card.Segmented>
      </ControlCards.Segmented>
    ),
    name: 'Heat Pump',
    size: '2x1',
    sizes: cardSizes.choiceControl,
  },
];

/** The parts `everyCardOf` renders, and the props it sets on them. */
export const everyCardParts = {
  'Card.Channel': ['defaultValue', 'label', 'tint'],
  'Card.Channels': ['children'],
  'Card.CloseButton': ['aria-label'],
  'Card.OpenButton': ['aria-label'],
  'Card.Progress': ['children', 'value'],
  'Card.ProgressBar': ['children'],
  'Card.ProgressDetail': ['children'],
  'Card.ProgressLabel': ['children'],
  'Card.Row': ['children', 'icon', 'value'],
  'Card.Rows': ['children'],
  'Card.Segmented': ['children', 'defaultValue'],
  'Card.SegmentedItem': ['children', 'icon', 'tint', 'value'],
  'ControlCards.Button': ['emphasizedIcon', 'icon', 'label', 'status'],
  'ControlCards.Light': [
    'children',
    'defaultChecked',
    'emphasizedIcon',
    'icon',
    'label',
  ],
  'ControlCards.List': ['children', 'icon', 'label'],
  'ControlCards.Progress': [
    'active',
    'children',
    'emphasizedIcon',
    'icon',
    'label',
  ],
  'ControlCards.Segmented': ['children', 'icon', 'label', 'offValue'],
  'ControlCards.Slider': [
    'brightness',
    'defaultChecked',
    'defaultValue',
    'emphasizedIcon',
    'format',
    'icon',
    'label',
    'max',
    'min',
    'step',
    'tint',
  ],
  'ControlCards.State': ['active', 'emphasizedIcon', 'icon', 'label', 'states'],
  'ControlCards.Switch': ['defaultChecked', 'emphasizedIcon', 'icon', 'label'],
  'ControlCards.Value': ['format', 'icon', 'label', 'trend', 'value'],
} as const;

/** A phone: one of each control card, in a grid. */
export const ControlCardsDemo: FunctionComponent = () => {
  const id = 'control-cards';
  const [log, addLog] = useLog();
  const open = useStageOpen();
  const [partControls, partProps, partState, partsKey] = usePartControls(
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
      {tileStage(everyCardOf(partProps), partProps, open, partsKey)}
    </Component>
  );
};
