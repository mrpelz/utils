/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type {
  ControlCardChannel,
  ControlCardRow,
  ControlCardStates,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  glassSurfacePropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import {
  sfAntennaRadiowavesLeftAndRight,
  sfBell,
  sfBellFill,
  sfDoorGarageClosed,
  sfDoorGarageOpen,
  sfEnvelope,
  sfEnvelopeFill,
  sfFan,
  sfFanFill,
  sfHouseFill,
  sfHumidityFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLightStrip2,
  sfLightStrip2Fill,
  sfLockFill,
  sfLockOpen,
  sfPower,
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
  ...rootOptions,
});

export const getPropOptionsSliderFill = (addLog: AddLog) => ({
  ...sliderOptions(addLog),
  name: ['Heat to', 'Dimmer'] as const,
  onPress: [undefined, logged(addLog, 'press')] as const,
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
  status: ['42 min left', undefined, 'Opening…'] as const,
  tint: [undefined, 'var(--color-ui-system-orange)'] as const,
  ...rootOptions,
};

const rgb: readonly ControlCardChannel[] = [
  { label: 'R', name: 'Red', tint: '#ff3b30' },
  { label: 'G', name: 'Green', tint: '#34c759' },
  { label: 'B', name: 'Blue', tint: '#0a84ff' },
];
const rgbw: readonly ControlCardChannel[] = [
  ...rgb,
  { label: 'W', name: 'White', tint: '#fff4e0' },
];

const channelsOptions = [
  new MappedProp(rgb, '[red, green, blue]'),
  new MappedProp(rgbw, '[red, green, blue, white]'),
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
  channels: channelsOptions,
  defaultValue: [
    undefined,
    new MappedProp([1, 0.6, 0.2, 0], '[1, 0.6, 0.2, 0]'),
  ] as const,
  value: [
    undefined,
    new MappedProp([0.2, 0.4, 1, 0.5], '[0.2, 0.4, 1, 0.5]'),
  ] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  defaultChecked: [undefined, true, false] as const,
  checked: [undefined, true, false] as const,
  onCheckedChange: [logged(addLog, 'checked'), undefined] as const,
  offLabel: [undefined, 'Aus'] as const,
  format: [undefined, celsius] as const,
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

export const propOptionsList = {
  name: ['Living Room', 'Hallway Sensor'] as const,
  icon: [
    new MappedProp(sfHouseFill, '[house.fill]'),
    new MappedProp(sfAntennaRadiowavesLeftAndRight, '[antenna]'),
  ] as const,
  emphasizedIcon: [undefined] as const,
  rows: [
    new MappedProp(roomRows, '[a room’s, with symbols]'),
    new MappedProp(detailRows, '[a device’s details]'),
    new MappedProp([], '[none]'),
  ] as const,
  status: [undefined, 'Online'] as const,
  ...rootOptions,
};

export const getPropOptionsChannels = (addLog: AddLog) => ({
  channels: channelsOptions,
  value: [
    new MappedProp([1, 0.6, 0.2, 0.8], '[1, 0.6, 0.2, 0.8]'),
    new MappedProp([0, 0, 0, 0], '[all 0]'),
  ] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
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
