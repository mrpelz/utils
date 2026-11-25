/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type {
  ControlCardStates,
  ControlCardValueTextDetails,
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
import {
  channelsOptions,
  getRowsChildrenOptions,
  percent,
  precisePercent,
  type ProgressPartData,
  segmentedChildrenOptions,
} from '../card/props.js';

// Every part's options (its parts page's; see part-options.ts for the
// other demos). Each card's own first, then its `Card.Root`'s.

/** A card's `Card.Root` props (its other props). */
const rootOptions = {
  ...glassSurfacePropOptions,
  ...commonPropOptions,
};

/**
 * A switchable card's `Card.Root` props: no `context` (its state decides
 * its glass, see `Card.Root`'s `active`).
 */
const switchableRootOptions = commonPropOptions;

/** Logs a callback's call, its arguments shown. */
const logged = (addLog: AddLog, name: string) =>
  new MappedProp(
    (...args: unknown[]) =>
      addLog(`${name}: ${args.map((each) => JSON.stringify(each)).join(', ')}`),
    `[log ${name}]`,
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
  label: ['Front Door', 'Back Door'] as const,
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
  ...switchableRootOptions,
};

export const getPropOptionsSwitch = (addLog: AddLog) => ({
  label: ['Ceiling Fan', 'Floor Lamp'] as const,
  icon: [
    new MappedProp(sfFan, '[fan]'),
    new MappedProp(sfLightbulb, '[lightbulb]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfFanFill, '[fan.fill]'),
    undefined,
    new MappedProp(sfLightbulbFill, '[lightbulb.fill]'),
  ] as const,
  // (Off at first: only its other states do something.)
  defaultChecked: [undefined, true] as const,
  checked: [undefined, true] as const,
  onCheckedChange: [logged(addLog, 'checked'), undefined] as const,
  disabled: [undefined, true] as const,
  states: [undefined, states('Running', 'Stopped')] as const,
  tint: [undefined, cardTints.light, cardTints.air] as const,
  ...switchableRootOptions,
});

export const propOptionsValue = {
  label: ['Living Room', 'Humidity'] as const,
  icon: [
    new MappedProp(sfThermometerMedium, '[thermometer.medium]'),
    new MappedProp(sfHumidityFill, '[humidity.fill]'),
  ] as const,
  emphasizedIcon: [undefined] as const,
  value: [21.5, 0.46, -3.25, 'Unknown'] as const,
  format: [celsius, undefined, percent] as const,
  locale: [undefined, 'de-DE', 'ar-EG'] as const,
  trend: [undefined, 30, 0, -45, 90] as const,
  ...rootOptions,
};

/** A slider's range, value and look (see `Card.Slider`). */
const sliderOptions = (addLog: AddLog) => ({
  label: ['Dimmer', 'Blinds'] as const,
  min: [0, undefined] as const,
  max: [1, undefined, 100] as const,
  disabled: [undefined, true] as const,
  step: [undefined, 0.25, 0.1] as const,
  defaultValue: [0.6, undefined, 0.25] as const,
  value: [undefined, 0, 0.5, 1] as const,
  onValueChange: [logged(addLog, 'value'), undefined] as const,
  format: [percent, undefined] as const,
  locale: [undefined, 'de-DE', 'ar-EG'] as const,
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
  // (Not a brightness at first: its glass by its context.)
  brightness: [undefined, true] as const,
  // (A switch from the start, on: its states and value text shown.)
  defaultChecked: [true, undefined, false] as const,
  checked: [undefined, false] as const,
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
      ) =>
        checked === undefined
          ? formattedValue
          : `${formattedValue} (${checked ? 'on' : 'off'})`,
      '[value, “(on)” or “(off)” after it]',
    ),
  ] as const,
  ...rootOptions,
});

export const getPropOptionsButton = (addLog: AddLog) => ({
  label: ['Doorbell', 'All Lights Off', 'Mailbox'] as const,
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
  onClick: [logged(addLog, 'click'), undefined] as const,
  ...rootOptions,
});

/** Which of a progress card's parts its view composes (see parts.tsx). */

export const propOptionsProgress = {
  label: ['Washer', 'Garage Door'] as const,
  icon: [
    new MappedProp(sfWasher, '[washer]'),
    new MappedProp(sfDoorGarageClosed, '[door.garage.closed]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfWasherFill, '[washer.fill]'),
    undefined,
    new MappedProp(sfDoorGarageOpen, '[door.garage.open]'),
  ] as const,
  // (Not switchable at first: its glass by its context.)
  active: [undefined, true, false] as const,
  tint: [undefined, 'var(--color-ui-system-orange)', '#ffd60a'] as const,
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

/** Which of a stages card's parts its view composes (see parts.tsx). */
export type StagesPartData = 'list' | 'subtitle';

export const propOptionsStages = {
  label: ['Washer Program', 'Dishwasher'] as const,
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
  // (Not switchable at first: its glass by its context.)
  active: [undefined, true, false] as const,
  tint: [
    'var(--color-ui-system-teal)',
    undefined,
    'var(--color-ui-system-orange)',
  ] as const,
  ...rootOptions,
};

export const getPropOptionsLight = (addLog: AddLog) => ({
  label: ['Light Strip', 'Ceiling Light'] as const,
  icon: [
    new MappedProp(sfLightStrip2, '[light.strip.2]'),
    new MappedProp(sfLightbulb, '[lightbulb]'),
  ] as const,
  emphasizedIcon: [
    new MappedProp(sfLightStrip2Fill, '[light.strip.2.fill]'),
    undefined,
    new MappedProp(sfLightbulbFill, '[lightbulb.fill]'),
  ] as const,
  // (Its channels' data: the view composes them in its Card.Channels.)
  children: channelsOptions,
  // (Off at first; the view's second light on: both its words shown.)
  defaultChecked: [undefined, true] as const,
  checked: [undefined, true] as const,
  onCheckedChange: [logged(addLog, 'checked'), undefined] as const,
  disabled: [undefined, true] as const,
  states: [undefined, states('An', 'Aus')] as const,
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
  format: [undefined, precisePercent] as const,
  locale: [undefined, 'de-DE', 'ar-EG'] as const,
  ...switchableRootOptions,
});

export const getPropOptionsList = (addLog: AddLog) => ({
  label: ['Living Room', 'Hallway Sensor'] as const,
  icon: [
    new MappedProp(sfHouseFill, '[house.fill]'),
    new MappedProp(sfAntennaRadiowavesLeftAndRight, '[antenna]'),
  ] as const,
  emphasizedIcon: [undefined] as const,
  // (Its rows' data: the view composes them in its Card.Rows.)
  children: getRowsChildrenOptions(addLog),
  status: [undefined, 'Online'] as const,
  ...rootOptions,
});

export const propOptionsSegmented = {
  label: ['Heat Pump', 'Alarm'] as const,
  icon: [
    new MappedProp(sfPower, '[power]'),
    new MappedProp(sfLockOpen, '[lock.open]'),
  ] as const,
  emphasizedIcon: [undefined] as const,
  // (Its options' data: the view composes them in its Card.Segmented.)
  children: segmentedChildrenOptions,
  offValue: [
    'off',
    undefined,
    new MappedProp(['off', 'heat'] as const, '["off", "heat"]'),
  ] as const,
  tint: [undefined, cardTints.heat] as const,
  ...rootOptions,
};

export { type ProgressPartData } from '../card/props.js';
