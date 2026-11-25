/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type { SymbolIcon } from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  glassSurfacePropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import {
  sfAirplane,
  sfFanFill,
  sfFlameFill,
  sfHouseFill,
  sfHumidityFill,
  sfLightbulbFill,
  sfLockFill,
  sfLockOpen,
  sfPower,
  sfSnowflake,
  sfSpeakerFill,
  sfThermometerMedium,
  sfWindowShadeClosed,
} from '../../tooling/icons.js';
import { getPropOptionsCornerButton as gridCornerButton } from '../grid/props.js';
import { getPropOptionsRoot as switchRoot } from '../switch/props.js';

// Every part's options (its parts page's, see part-options.ts for the other
// demos).

/** A part rendering its own element: its class name and style. */
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/** A part rendering its own element, replaceable (`render`). */
const renderOptions = commonPropOptions;

/** Logs a callback's call, its arguments shown. */
const logged = (addLog: AddLog, name: string) =>
  new MappedProp(
    (...args: unknown[]) =>
      addLog(`${name}: ${args.map((each) => JSON.stringify(each)).join(', ')}`),
    `[log ${name}]`,
  );

/** A whole percentage (`Intl.NumberFormat`'s options). */
export const percent = new MappedProp<Intl.NumberFormatOptions>(
  { maximumFractionDigits: 0, style: 'percent' },
  '[percent]',
);

export const propOptionsRoot = {
  ...glassSurfacePropOptions,
  ...commonPropOptions,
  active: [undefined, true, false] as const,
  momentary: [undefined, true] as const,
};

/** A corner button: the grid's options, named as the temperature's is. */
export const getPropOptionsCornerButton = (addLog: AddLog) => ({
  ...gridCornerButton(addLog),
  'aria-label': ['Living Room details', undefined] as const,
  visible: [undefined, false] as const,
  whileEditing: [undefined, 'show', 'stay'] as const,
});

export const propOptionsSymbol = {
  ...renderOptions,
  active: [undefined, true] as const,
  tint: [undefined, 'var(--color-ui-system-yellow)'] as const,
};

/** Its switch: a switch's options, its tint a card's. */
export const getPropOptionsSwitch = (addLog: AddLog) => {
  const { tint: _tint, ...options } = switchRoot(addLog, () => undefined);
  return {
    ...options,
    tint: [
      undefined,
      'var(--color-ui-system-teal)',
      'var(--color-ui-system-yellow)',
    ] as const,
  };
};

export const propOptionsTitle = {
  ...renderOptions,
  id: [undefined, 'living-room-title'] as const,
};

/** Formats as an app might choose them (`Intl.NumberFormat`'s options). */
const formats = [
  new MappedProp<Intl.NumberFormatOptions>(
    {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
      style: 'unit',
      unit: 'celsius',
    },
    '[°C, one decimal]',
  ),
  undefined,
  new MappedProp<Intl.NumberFormatOptions>(
    { maximumFractionDigits: 0, style: 'unit', unit: 'celsius' },
    '[°C, whole]',
  ),
  new MappedProp<Intl.NumberFormatOptions>(
    { style: 'unit', unit: 'fahrenheit', maximumFractionDigits: 0 },
    '[°F, whole]',
  ),
  new MappedProp<Intl.NumberFormatOptions>(
    { notation: 'compact' },
    '[compact]',
  ),
] as const;

export const propOptionsValue = {
  ...renderOptions,
  value: [21.5, undefined, 0, -3.25, 1234.5] as const,
  format: formats,
  locale: [undefined, 'en-US', 'de-DE', 'fr-FR', 'ar-EG'] as const,
  children: [undefined, 'Locked', ' (set)'] as const,
};

export const propOptionsSubtitle = {
  ...renderOptions,
  children: ['Cotton, 40°', 'Ends at 14:30'] as const,
};

export const propOptionsTrend = {
  ...renderOptions,
  angle: [30, 0, -45, 90, -90] as const,
};

export const getPropOptionsSlider = (addLog: AddLog) => ({
  ...elementOptions,
  label: ['Heat to', 'Dimmer'] as const,
  min: [16, undefined, 0] as const,
  max: [26, undefined, 100] as const,
  step: [0.5, undefined, 1, 2.5] as const,
  defaultValue: [21, undefined, 16, 26] as const,
  value: [undefined, 16, 21, 26] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  onPress: [undefined, logged(addLog, 'press')] as const,
  format: [
    new MappedProp<Intl.NumberFormatOptions>(
      { maximumFractionDigits: 1, style: 'unit', unit: 'celsius' },
      '[°C]',
    ),
    undefined,
    percent,
  ] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  tint: [cardTints.heat, undefined, cardTints.shade, '#1c3f94'] as const,
  disabled: [undefined, true] as const,
  name: [undefined, 'target-temperature'] as const,
  children: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `Set to ${formattedValue}`,
      '[“Set to …”]',
    ),
  ] as const,
  getAriaValueText: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `Heating to ${formattedValue}`,
      '[“Heating to …”]',
    ),
  ] as const,
});

/** Which of a progress's parts its view composes (see blocks.tsx). */
export type ProgressPartData = 'bar' | 'subtitle' | 'value';

export const propOptionsProgress = {
  value: [53, null, 0, 100] as const,
  min: [undefined, 20] as const,
  max: [undefined, 90] as const,
  format: [undefined, percent] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  getAriaValueText: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `${formattedValue} washed`,
      '[“… washed”]',
    ),
  ] as const,
  // (Its parts: the view composes them, see blocks.tsx.)
  children: [
    new MappedProp<readonly ProgressPartData[]>(
      ['subtitle', 'value', 'bar'],
      '[Subtitle, ProgressValue, ProgressBar]',
    ),
    new MappedProp<readonly ProgressPartData[]>(['bar'], '[ProgressBar]'),
    new MappedProp<readonly ProgressPartData[]>(['value'], '[ProgressValue]'),
  ] as const,
};

export const propOptionsProgressValue = {
  ...renderOptions,
  children: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `${formattedValue} done`,
      '[“… done”]',
    ),
  ] as const,
};

export const propOptionsProgressBar = {
  ...renderOptions,
  tint: [
    undefined,
    'var(--color-ui-system-orange)',
    'var(--color-ui-system-yellow)',
    '#1c3f94',
  ] as const,
  'aria-label': [undefined, 'Washer progress'] as const,
};

export const propOptionsProgressLabel = {
  ...renderOptions,
  children: ['Rinsing', 'Layer 184 of 256'] as const,
};

export const propOptionsProgressDetail = {
  ...renderOptions,
  children: ['40 min left', '2 h 10 min'] as const,
};

/** A run's stages (see `Card.StageList`'s view). */
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

export const propOptionsStageList = {
  ...elementOptions,
  value: ['rinse', undefined, 'wash', 'done', 'main'] as const,
  tint: [
    undefined,
    'var(--color-ui-system-teal)',
    'var(--color-ui-system-orange)',
  ] as const,
  'aria-label': [undefined, 'Washer stages'] as const,
  // (Its stages' data: the view composes them, see blocks.tsx.)
  children: [
    new MappedProp(washerStages, '[Wash, Rinse, Spin, Done]'),
    new MappedProp(dishwasherStages, '[Prewash, Main wash, Dry]'),
    new MappedProp(longStages, '[Soak, Prewash, Wash, Rinse, Spin, Done]'),
  ] as const,
};

export const propOptionsStage = {
  ...elementOptions,
  children: ['Rinse', 'Rinse and hold'] as const,
  value: ['rinse', 'hold'] as const,
};

/** A channel the views compose (see `Card.Channel`). */
export type ChannelData = {
  colors?: readonly string[];
  defaultValue: number;
  label: string;
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

export const rgbChannels: readonly ChannelData[] = [
  { defaultValue: 100, label: 'Red', tint: '#ff3b30' },
  { defaultValue: 60, label: 'Green', tint: '#34c759' },
  { defaultValue: 20, label: 'Blue', tint: '#0a84ff' },
];
const rgbwChannels: readonly ChannelData[] = [
  ...rgbChannels,
  { defaultValue: 80, label: 'White', tint: '#fff4e0' },
];
const deepChannels: readonly ChannelData[] = [
  { defaultValue: 4, label: 'Royal Blue', tint: '#1a2a8c' },
  { defaultValue: 60, label: 'Violet', tint: '#5b1f9e' },
  { defaultValue: 85, label: 'Deep Red', tint: '#7a0d12' },
];
export const fiveChannels: readonly ChannelData[] = [
  ...rgbChannels,
  { defaultValue: 30, label: 'Cool white', tint: '#cfdcff' },
  { defaultValue: 80, label: 'Warm white', tint: '#ffd9a0' },
];
const tunableChannels: readonly ChannelData[] = [
  { defaultValue: 70, label: 'Brightness', tint: '#ffd1a3' },
  { colors: kelvinColors, defaultValue: 30, label: 'Temperature' },
];

/** A light's or channels' channels (their view composes them). */
export const channelsOptions = [
  new MappedProp(rgbChannels, '[red, green, blue]'),
  new MappedProp(rgbwChannels, '[red, green, blue, white]'),
  new MappedProp(deepChannels, '[royal blue, violet, deep red]'),
  new MappedProp(tunableChannels, '[brightness, temperature (a scale)]'),
] as const;

export const getPropOptionsChannels = (addLog: AddLog) => ({
  ...elementOptions,
  // (Its channels' data: the view composes them.)
  children: channelsOptions,
  onLightChange: [undefined, logged(addLog, 'light')] as const,
});

export const getPropOptionsChannel = (addLog: AddLog) => ({
  ...elementOptions,
  label: ['Red', 'Temperature'] as const,
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
  defaultValue: [60, undefined, 0, 100] as const,
  value: [undefined, 0, 3, 50, 97, 100] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  // (A range: both ends together, a color temperature's.)
  min: [undefined, 2200] as const,
  max: [undefined, 6500] as const,
  step: [undefined, 10, 100] as const,
  format: [undefined, percent] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  children: [
    undefined,
    new MappedProp(
      (_: string, value: number) => `${String(value)} K`,
      '[“… K”]',
    ),
  ] as const,
  getAriaValueText: [
    undefined,
    new MappedProp(
      (_: string, value: number) => `${String(value)} kelvin`,
      '[“… kelvin”]',
    ),
  ] as const,
  disabled: [undefined, true] as const,
  name: [undefined, 'red'] as const,
});

/** A choice's option, as the demos keep it (see blocks.tsx). */
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
export const alarmOptions: readonly SegmentedOptionData[] = [
  { icon: sfLockOpen, label: 'Off', value: 'off' },
  { icon: sfHouseFill, label: 'Home', value: 'home' },
  { icon: sfAirplane, label: 'Away', value: 'away' },
];

/** A choice's options (their view composes them). */
export const segmentedChildrenOptions = [
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
] as const;

export const getPropOptionsSegmented = (addLog: AddLog) => ({
  ...elementOptions,
  // (Its options' data: the view composes them, see blocks.tsx.)
  children: segmentedChildrenOptions,
  defaultValue: ['heat', undefined, 'off', 'home'] as const,
  value: [undefined, 'off', 'cool'] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  optionContent: [undefined, 'icon', 'label'] as const,
  orientation: [undefined, 'vertical', 'horizontal'] as const,
  disabled: [undefined, true] as const,
  'aria-label': [undefined, 'Modes'] as const,
});

export const propOptionsSegmentedItem = {
  ...elementOptions,
  children: ['Heat', 'Heating'] as const,
  value: ['heat'] as const,
  icon: [new MappedProp(sfFlameFill, '[flame.fill]'), undefined] as const,
  subtitle: [undefined, 'to 21 °C'] as const,
  tint: [new MappedProp(cardTints.heat, 'cardTints.heat'), undefined] as const,
  disabled: [undefined, true] as const,
};

/** A card's row's data, as the demos keep it (see blocks.tsx). */
export type RowData = {
  icon?: SymbolIcon;
  label: string;
  onClick?: () => void;
  value?: string;
};

export const roomRows: readonly RowData[] = [
  { icon: sfLightbulbFill, label: 'Lights', value: '2 on' },
  { icon: sfThermometerMedium, label: 'Temperature', value: '21.5 °C' },
  { icon: sfHumidityFill, label: 'Humidity', value: '46 %' },
  { icon: sfWindowShadeClosed, label: 'Blinds', value: '50 %' },
  { icon: sfFanFill, label: 'Ceiling Fan', value: 'Off' },
  { icon: sfSpeakerFill, label: 'Speaker', value: 'Paused' },
  { icon: sfLockFill, label: 'Balcony Door', value: 'Locked' },
];
export const detailRows: readonly RowData[] = [
  { label: 'Connection', value: 'Zigbee' },
  { label: 'Battery', value: '80 %' },
  { label: 'Signal', value: '−62 dBm' },
];

/** A card's rows (their view composes them). */
export const getRowsChildrenOptions = (addLog: AddLog) =>
  [
    new MappedProp(roomRows, '[a room’s, seven, with symbols]'),
    new MappedProp(detailRows, '[a device’s details]'),
    new MappedProp(
      roomRows.map((row, index) =>
        index < 2
          ? { ...row, onClick: () => addLog(`${row.label}: click`) }
          : row,
      ),
      '[a room’s, two going on (onClick)]',
    ),
    new MappedProp([], '[none]'),
  ] as const;

export const getPropOptionsRows = (addLog: AddLog) => ({
  ...renderOptions,
  // (Its rows' data: the view composes them, see blocks.tsx.)
  children: getRowsChildrenOptions(addLog),
  getMoreLabel: [
    undefined,
    new MappedProp((count: number) => `+${String(count)}`, '[“+…”]'),
  ] as const,
  lessLabel: [undefined, 'Fewer'] as const,
});

export const getPropOptionsRow = (addLog: AddLog) => ({
  ...renderOptions,
  children: ['Lights', 'Ceiling Fan'] as const,
  icon: [
    new MappedProp(sfLightbulbFill, '[lightbulb.fill]'),
    undefined,
  ] as const,
  value: ['2 on', undefined, 'Off'] as const,
  onClick: [undefined, logged(addLog, 'click')] as const,
});

/** A corner button's own options (its `aria-label` and press). */
const cornerOptions = (addLog: AddLog, label: string) => ({
  ...commonPropOptions,
  'aria-label': [label, undefined] as const,
  whileEditing: [undefined, 'show', 'stay'] as const,
  onClick: [undefined, logged(addLog, 'click')] as const,
});

export const getPropOptionsExpandButton = (addLog: AddLog) =>
  cornerOptions(addLog, 'Heating details');

export const getPropOptionsOpenButton = (addLog: AddLog) => ({
  ...cornerOptions(addLog, 'Speaker details'),
  mirrored: [undefined, true] as const,
});

export const getPropOptionsCloseButton = (addLog: AddLog) => ({
  ...cornerOptions(addLog, 'Close'),
  mirrored: [undefined, true] as const,
});
