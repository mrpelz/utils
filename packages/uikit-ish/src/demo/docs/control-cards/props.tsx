/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type {
  ControlCardRow,
  ControlCardStates,
  ControlCardValueTextDetails,
  SymbolIcon,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  glassSurfacePropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import {
  sfAirplane,
  sfAntennaRadiowavesLeftAndRight,
  sfBell,
  sfBellFill,
  sfDoorGarageClosed,
  sfDoorGarageOpen,
  sfEnvelope,
  sfEnvelopeFill,
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

// Every part's options (its parts page's; see part-options.ts for the
// other demos). Each card's own first, then its `Card.Root`'s.

/** A card's `Card.Root` props (its other props). */
const rootOptions = {
  ...glassSurfacePropOptions,
  ...commonPropOptions,
};

/** Logs a callback's call, its arguments shown. */
const logged = (addLog: AddLog, name: string) =>
  new MappedProp(
    (...args: unknown[]) =>
      addLog(`${name}: ${args.map((each) => JSON.stringify(each)).join(', ')}`),
    `[log ${name}]`,
  );

const percent = new MappedProp<Intl.NumberFormatOptions>(
  { maximumFractionDigits: 0, style: 'percent' },
  '[percent]',
);
const celsius = new MappedProp<Intl.NumberFormatOptions>(
  {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    style: 'unit',
    unit: 'celsius',
  },
  '[°C, one decimal]',
);

const states = (on: string, off: string) =>
  new MappedProp<ControlCardStates>([on, off], `[${on}, ${off}]`);

export const propOptionsState = {
  name: ['Front Door', 'Back Door'] as const,
  active: [true, false] as const,
  icon: [
    new MappedProp(sfLockOpen, '[lock.open]'),
    new MappedProp(sfLightbulb, '[lightbulb]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfLockFill, '[lock.fill]'),
    undefined,
    new MappedProp(sfLightbulbFill, '[lightbulb.fill]'),
  ] as const,
  states: [states('Locked', 'Unlocked'), undefined] as const,
  ...rootOptions,
};

export const getPropOptionsSwitch = (addLog: AddLog) => ({
  name: ['Ceiling Fan', 'Floor Lamp'] as const,
  icon: [
    new MappedProp(sfFan, '[fan]'),
    new MappedProp(sfLightbulb, '[lightbulb]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfFanFill, '[fan.fill]'),
    undefined,
    new MappedProp(sfLightbulbFill, '[lightbulb.fill]'),
  ] as const,
  defaultChecked: [undefined, true, false] as const,
  checked: [undefined, true, false] as const,
  onCheckedChange: [logged(addLog, 'checked'), undefined] as const,
  states: [undefined, states('Running', 'Stopped')] as const,
  ...rootOptions,
});

export const propOptionsValue = {
  name: ['Living Room', 'Humidity'] as const,
  icon: [
    new MappedProp(sfThermometerMedium, '[thermometer.medium]'),
    new MappedProp(sfHumidityFill, '[humidity.fill]'),
  ] as const,
  emphasizedIcon: [undefined] as const,
  value: [21.5, 0.46, -3.25, 'Unknown'] as const,
  format: [celsius, undefined, percent] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  trend: [undefined, 30, 0, -45, 90] as const,
  ...rootOptions,
};

/** A slider's range, value and look (see `ControlCards.SliderFill`). */
const sliderOptions = (addLog: AddLog) => ({
  name: ['Dimmer', 'Blinds'] as const,
  min: [0, undefined] as const,
  max: [1, undefined, 100] as const,
  step: [undefined, 0.25, 0.1] as const,
  defaultValue: [0.6, undefined, 0.25] as const,
  value: [undefined, 0, 0.5, 1] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  format: [percent, undefined] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  tint: [
    cardTints.light,
    undefined,
    cardTints.shade,
    cardTints.heat,
    '#1c3f94',
  ] as const,
});

export const getPropOptionsSlider = (addLog: AddLog) => ({
  ...sliderOptions(addLog),
  icon: [
    new MappedProp(sfLightbulb, '[lightbulb]'),
    new MappedProp(sfWindowShadeClosed, '[window.shade.closed]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfLightbulbFill, '[lightbulb.fill]'),
    undefined,
  ] as const,
  brightness: [true, undefined] as const,
  defaultChecked: [undefined, true, false] as const,
  checked: [undefined, true, false] as const,
  onCheckedChange: [logged(addLog, 'checked'), undefined] as const,
  states: [
    undefined,
    new MappedProp(['Running', 'Stopped'] as const, '["Running", "Stopped"]'),
  ] as const,
  getValueText: [
    undefined,
    new MappedProp(
      (
        formattedValue: string,
        _value: number,
        { checked }: ControlCardValueTextDetails,
      ) => (checked === false ? `${formattedValue} (off)` : formattedValue),
      '[value, “(off)” after it]',
    ),
  ] as const,
  ...rootOptions,
});

export const getPropOptionsSliderFill = (addLog: AddLog) => ({
  ...sliderOptions(addLog),
  name: ['Heat to', 'Dimmer'] as const,
  onPress: [undefined, logged(addLog, 'press')] as const,
  getValueText: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `Set to ${formattedValue}`,
      '[“Set to …”]',
    ),
  ] as const,
  className: commonPropOptions.className,
});

export const getPropOptionsButton = (addLog: AddLog) => ({
  name: ['Doorbell', 'All Lights Off', 'Mailbox'] as const,
  icon: [
    new MappedProp(sfBell, '[bell]'),
    new MappedProp(sfPower, '[power]'),
    new MappedProp(sfEnvelope, '[envelope]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfBellFill, '[bell.fill]'),
    undefined,
    new MappedProp(sfEnvelopeFill, '[envelope.fill]'),
  ] as const,
  status: ['Quiet', undefined, 'Rang 2:34 PM'] as const,
  badge: [undefined, 3, 'New'] as const,
  onPress: [logged(addLog, 'press'), undefined] as const,
  ...rootOptions,
});

/** Which of a progress card's parts its view composes (see parts.tsx). */
export type ProgressPartData = 'bar' | 'subtitle' | 'value';

export const propOptionsProgress = {
  name: ['Washer', 'Garage Door'] as const,
  icon: [
    new MappedProp(sfWasher, '[washer]'),
    new MappedProp(sfDoorGarageClosed, '[door.garage.closed]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfWasherFill, '[washer.fill]'),
    undefined,
    new MappedProp(sfDoorGarageOpen, '[door.garage.open]'),
  ] as const,
  active: [true, undefined, false] as const,
  value: [53, undefined, 0, 100] as const,
  max: [undefined, 90] as const,
  tint: [undefined, 'var(--color-ui-system-orange)', '#ffd60a'] as const,
  format: [undefined, percent] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  // (Its parts: the view composes them, see parts.tsx.)
  children: [
    new MappedProp<readonly ProgressPartData[]>(['bar'], '[ProgressBar]'),
    new MappedProp<readonly ProgressPartData[]>(
      ['subtitle', 'value', 'bar'],
      '[Subtitle, ProgressValue, ProgressBar]',
    ),
    new MappedProp<readonly ProgressPartData[]>(['subtitle'], '[Subtitle]'),
  ] as const,
  ...rootOptions,
};

export const propOptionsProgressBar = {
  className: commonPropOptions.className,
};

export const propOptionsProgressLabel = {
  children: ['Rinsing', 'Layer 184 of 256'] as const,
  className: commonPropOptions.className,
};

export const propOptionsProgressDetail = {
  children: ['40 min left', '2 h 10 min'] as const,
  className: commonPropOptions.className,
};

export const propOptionsProgressValue = {
  children: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `${formattedValue} done`,
      '[(formattedValue) => formattedValue + " done"]',
    ),
  ] as const,
  className: commonPropOptions.className,
};

export const propOptionsSubtitle = {
  children: ['Cotton, 40°', 'Ends at 14:30'] as const,
  className: commonPropOptions.className,
};

/** A washer's program's stages (see `ControlCards.StageList`'s view). */
export type StageData = { label: string; value: string };
export const washerStages: readonly StageData[] = [
  { label: 'Wash', value: 'wash' },
  { label: 'Rinse', value: 'rinse' },
  { label: 'Spin', value: 'spin' },
  { label: 'Done', value: 'done' },
];
export const longStages: readonly StageData[] = [
  { label: 'Soak', value: 'soak' },
  { label: 'Prewash', value: 'prewash' },
  { label: 'Wash', value: 'wash' },
  { label: 'Rinse', value: 'rinse' },
  { label: 'Spin', value: 'spin' },
  { label: 'Done', value: 'done' },
];
const dishwasherStages: readonly StageData[] = [
  { label: 'Prewash', value: 'prewash' },
  { label: 'Main wash', value: 'main' },
  { label: 'Dry', value: 'dry' },
];

/** Which of a stages card's parts its view composes (see parts.tsx). */
export type StagesPartData = 'list' | 'subtitle';

export const propOptionsStages = {
  name: ['Washer Program', 'Dishwasher'] as const,
  icon: [new MappedProp(sfWasher, '[washer]')] as const,
  emphasizedIcon: [
    new MappedProp(sfWasherFill, '[washer.fill]'),
    undefined,
  ] as const,
  // (Its parts: the view composes them, see parts.tsx.)
  children: [
    new MappedProp<readonly StagesPartData[]>(['list'], '[StageList]'),
    new MappedProp<readonly StagesPartData[]>(
      ['subtitle', 'list'],
      '[Subtitle, StageList]',
    ),
  ] as const,
  value: ['rinse', undefined, 'wash', 'done', 'main'] as const,
  active: [true, undefined, false] as const,
  tint: [
    'var(--color-ui-system-teal)',
    undefined,
    'var(--color-ui-system-orange)',
  ] as const,
  ...rootOptions,
};

export const propOptionsStageList = {
  // (Its stages' data: the part's view composes them, see parts.tsx.)
  children: [
    new MappedProp(washerStages, '[Wash, Rinse, Spin, Done]'),
    new MappedProp(dishwasherStages, '[Prewash, Main wash, Dry]'),
    new MappedProp(longStages, '[Soak, Prewash, Wash, Rinse, Spin, Done]'),
  ] as const,
  className: commonPropOptions.className,
};

export const propOptionsStage = {
  children: ['Rinse', 'Rinse and hold'] as const,
  value: ['rinse', 'hold'] as const,
  className: commonPropOptions.className,
};

/** A channel the views compose (see `ControlCards.Channel`). */
export type ChannelData = {
  colors?: readonly string[];
  defaultValue: number;
  name: string;
  tint?: string;
};

/** A color temperature's colors, warm to cool (an app's). */
export const kelvinColors = [
  '#ff8b27',
  '#ffb46b',
  '#ffd1a3',
  '#ffe7d2',
  '#fff6ef',
  '#f1f2ff',
] as const;

const rgb: readonly ChannelData[] = [
  { defaultValue: 1, name: 'Red', tint: '#ff3b30' },
  { defaultValue: 0.6, name: 'Green', tint: '#34c759' },
  { defaultValue: 0.2, name: 'Blue', tint: '#0a84ff' },
];
const rgbw: readonly ChannelData[] = [
  ...rgb,
  { defaultValue: 0.8, name: 'White', tint: '#fff4e0' },
];
const deep: readonly ChannelData[] = [
  { defaultValue: 0.04, name: 'Royal Blue', tint: '#1a2a8c' },
  { defaultValue: 0.6, name: 'Violet', tint: '#5b1f9e' },
  { defaultValue: 0.85, name: 'Deep Red', tint: '#7a0d12' },
];
export const fiveChannels: readonly ChannelData[] = [
  ...rgb,
  { defaultValue: 0.3, name: 'Cool white', tint: '#cfdcff' },
  { defaultValue: 0.8, name: 'Warm white', tint: '#ffd9a0' },
];
const tunable: readonly ChannelData[] = [
  { defaultValue: 0.7, name: 'Brightness', tint: '#ffd1a3' },
  { colors: kelvinColors, defaultValue: 0.3, name: 'Temperature' },
];

/** A light's or channels' channels (their view composes them). */
const channelsOptions = [
  new MappedProp(rgb, '[red, green, blue]'),
  new MappedProp(rgbw, '[red, green, blue, white]'),
  new MappedProp(deep, '[royal blue, violet, deep red]'),
  new MappedProp(tunable, '[brightness, temperature (a scale)]'),
] as const;

export const getPropOptionsLight = (addLog: AddLog) => ({
  name: ['Light Strip', 'Ceiling Light'] as const,
  icon: [
    new MappedProp(sfLightStrip2, '[light.strip.2]'),
    new MappedProp(sfLightbulb, '[lightbulb]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfLightStrip2Fill, '[light.strip.2.fill]'),
    undefined,
    new MappedProp(sfLightbulbFill, '[lightbulb.fill]'),
  ] as const,
  // (Its channels' data: the view composes them in its Channels.)
  children: channelsOptions,
  defaultChecked: [undefined, true, false] as const,
  checked: [undefined, true, false] as const,
  onCheckedChange: [logged(addLog, 'checked'), undefined] as const,
  states: [
    undefined,
    new MappedProp(['An', 'Aus'] as const, '["An", "Aus"]'),
  ] as const,
  getValueText: [
    undefined,
    new MappedProp(
      (
        formattedValue: string,
        _value: number,
        { checked, states: [on, off] }: ControlCardValueTextDetails,
      ) => `${checked ? on : off} · ${formattedValue}`,
      '[state · value, on and off]',
    ),
  ] as const,
  format: [undefined, percent] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  ...rootOptions,
});

const roomRows: readonly ControlCardRow[] = [
  { icon: sfLightbulbFill, label: 'Lights', value: '2 on' },
  { icon: sfThermometerMedium, label: 'Temperature', value: '21.5 °C' },
  { icon: sfHumidityFill, label: 'Humidity', value: '46 %' },
  { icon: sfWindowShadeClosed, label: 'Blinds', value: '50 %' },
  { icon: sfFanFill, label: 'Ceiling Fan', value: 'Off' },
];
const detailRows: readonly ControlCardRow[] = [
  { label: 'Connection', value: 'Zigbee' },
  { label: 'Battery', value: '80 %' },
  { label: 'Signal', value: '−62 dBm' },
];

/** A list card's ways to show more (see `getPropOptionsList`). */
const expansionOf = (addLog: AddLog, expanded: boolean) =>
  new MappedProp(
    {
      collapsedSize: '2x2' as const,
      expanded,
      expandedSize: '3x3' as const,
      label: 'Living Room details',
      onExpandedChange: (next: boolean) =>
        addLog(`expansion.onExpandedChange: ${String(next)}`),
    },
    `{ collapsedSize: "2x2", expanded: ${String(expanded)}, expandedSize: "3x3", … }`,
  );

export const getPropOptionsList = (addLog: AddLog) => ({
  name: ['Living Room', 'Hallway Sensor'] as const,
  icon: [
    new MappedProp(sfHouseFill, '[house.fill]'),
    new MappedProp(sfAntennaRadiowavesLeftAndRight, '[antenna]'),
  ] as const,
  emphasizedIcon: [undefined] as const,
  rows: [
    new MappedProp(roomRows, '[a room’s, with symbols]'),
    new MappedProp(detailRows, '[a device’s details]'),
    new MappedProp(
      roomRows.map((row, index) =>
        index < 2
          ? { ...row, onPress: () => addLog(`${row.label}: pressed`) }
          : row,
      ),
      '[a room’s, two going on (onPress)]',
    ),
    new MappedProp([], '[none]'),
  ] as const,
  status: [undefined, 'Online'] as const,
  opening: [
    new MappedProp(
      { closeLabel: 'Close', label: 'Living Room details' },
      '{ closeLabel: "Close", label: "Living Room details" }',
    ),
    undefined,
  ] as const,
  expansion: [
    undefined,
    expansionOf(addLog, false),
    expansionOf(addLog, true),
  ] as const,
  getMoreLabel: [
    undefined,
    new MappedProp(
      (count: number) => `+${String(count)}`,
      '(count) => "+" + String(count)',
    ),
  ] as const,
  lessLabel: [undefined, 'Fewer'] as const,
  ...rootOptions,
});

/** A segmented card's option, as the demos keep it (see `itemsOf`). */
export type SegmentedOptionData = {
  disabled?: boolean;
  icon?: SymbolIcon;
  label: string;
  subtitle?: string;
  tint?: string;
  value: string;
};

export const heatPumpOptions: readonly SegmentedOptionData[] = [
  { icon: sfPower, label: 'Off', value: 'off' },
  { icon: sfFlameFill, label: 'Heat', tint: cardTints.heat, value: 'heat' },
  { icon: sfSnowflake, label: 'Cool', tint: cardTints.shade, value: 'cool' },
  { icon: sfThermometerMedium, label: 'Auto', value: 'auto' },
];
const heatPumpTargetOptions: readonly SegmentedOptionData[] = [
  { icon: sfPower, label: 'Off', value: 'off' },
  {
    icon: sfFlameFill,
    label: 'Heat',
    subtitle: 'to 21 °C',
    tint: cardTints.heat,
    value: 'heat',
  },
  {
    icon: sfSnowflake,
    label: 'Cool',
    subtitle: 'to 24 °C',
    tint: cardTints.shade,
    value: 'cool',
  },
  {
    icon: sfThermometerMedium,
    label: 'Auto',
    subtitle: '21 to 24 °C',
    value: 'auto',
  },
];
const alarmOptions: readonly SegmentedOptionData[] = [
  { icon: sfLockOpen, label: 'Off', value: 'off' },
  { icon: sfHouseFill, label: 'Home', value: 'home' },
  { icon: sfAirplane, label: 'Away', value: 'away' },
];

export const getPropOptionsSegmented = (addLog: AddLog) => ({
  name: ['Heat Pump', 'Alarm'] as const,
  icon: [
    new MappedProp(sfPower, '[power]'),
    new MappedProp(sfLockOpen, '[lock.open]'),
  ] as const,
  emphasizedIcon: [undefined] as const,
  // (Its items' data: the part's view composes them, see parts.tsx.)
  children: [
    new MappedProp(heatPumpOptions, '[Off, Heat, Cool, Auto]'),
    new MappedProp(alarmOptions, '[Off, Home, Away]'),
    new MappedProp(
      heatPumpTargetOptions,
      '[Off, Heat, Cool, Auto] with subtitles',
    ),
    new MappedProp(
      heatPumpOptions.map((option) =>
        option.value === 'cool' ? { ...option, disabled: true } : option,
      ),
      '[Off, Heat, Cool (disabled), Auto]',
    ),
  ] as const,
  defaultValue: ['heat', 'off', 'home'] as const,
  offValue: ['off', undefined] as const,
  optionContent: [undefined, 'icon', 'label'] as const,
  orientation: [undefined, 'vertical', 'horizontal'] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  tint: [undefined, cardTints.heat] as const,
  opening: [
    new MappedProp(
      { closeLabel: 'Close', label: 'Heat Pump modes' },
      '{ closeLabel: "Close", label: "Heat Pump modes" }',
    ),
    undefined,
  ] as const,
  ...rootOptions,
});

export const propOptionsSegmentedItem = {
  children: ['Heat', 'Heating'] as const,
  value: ['heat'] as const,
  icon: [new MappedProp(sfFlameFill, '[flame.fill]'), undefined] as const,
  subtitle: [undefined, 'to 21 °C'] as const,
  tint: [new MappedProp(cardTints.heat, 'cardTints.heat'), undefined] as const,
  disabled: [undefined, true] as const,
  className: commonPropOptions.className,
};

export const propOptionsChannels = {
  // (Its channels' data: the view composes them.)
  children: channelsOptions,
  className: commonPropOptions.className,
};

export const getPropOptionsChannel = (addLog: AddLog) => ({
  name: ['Red', 'Temperature'] as const,
  tint: [
    '#ff3b30',
    undefined,
    '#1a2a8c',
    'var(--color-ui-system-teal)',
  ] as const,
  colors: [
    undefined,
    new MappedProp(kelvinColors, '[warm to cool, six colors]'),
    new MappedProp(['#000', '#fff'], '[black, white]'),
  ] as const,
  defaultValue: [0.6, undefined, 0, 1] as const,
  value: [undefined, 0, 0.03, 0.5, 0.97, 1] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  min: [undefined, 2200] as const,
  max: [undefined, 6500] as const,
  step: [undefined, 0.1, 100] as const,
  getValueText: [
    undefined,
    new MappedProp(
      (_: string, value: number) => `${String(value)} K`,
      '[(_, value) => value + " K"]',
    ),
  ] as const,
  format: [undefined, percent] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  disabled: [undefined, true] as const,
  className: commonPropOptions.className,
});

export const propOptionsTrend = {
  angle: [30, 0, -45, 90, -90] as const,
};

export const getPropOptionsExpandButton = (addLog: AddLog) => ({
  collapsedSize: ['1x1', '2x2', '2x1'] as const,
  expanded: [false, true] as const,
  expandedSize: ['2x2', '3x2', '1x1'] as const,
  label: ['Heating details', 'Expand'] as const,
  onExpandedChange: [logged(addLog, 'expanded')] as const,
});

export const propOptionsOpenButtons = {
  label: ['Speaker details', 'Open'] as const,
  closeLabel: ['Close', 'Schließen'] as const,
};
