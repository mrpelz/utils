import { FunctionComponent, useMemo } from 'react';

import { DatePickerMode } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { useDatePickerDemo } from './compose.js';
import { getPropOptionsDatePicker } from './props.js';

// Figma's example: April 20, 2025, 9:41 (a range: to April 24).
const example = new Date(2025, 3, 20, 9, 41);

type Preset = { id: string; mode: DatePickerMode; title: string };

/**
 * A date picker (UIKit `UIDatePicker`, Figma “Date and time”): compact
 * buttons opening the calendar or the time, or the calendar inline, with
 * the time; or a range of dates (dragged, or picked by its ends).
 */
const DatePickerDemoBase: FunctionComponent<{ preset: Preset }> = ({
  preset,
}) => {
  const [log, addLog] = useLog();

  const { controls, Remounter, render, states } = useDatePickerDemo(
    useProvidedState(preset.id),
    preset.mode,
    {
      picker: useMemo(
        () => getPropOptionsDatePicker(preset.mode, addLog),
        [addLog, preset.mode],
      ),
    },
  );

  return (
    <Component
      center
      controls={controls}
      id={preset.id}
      log={log}
      stateUrl={useCreateStateUrl(preset.id, states)}
      title={preset.title}
    >
      <Remounter>{render({ defaultValue: example })}</Remounter>
    </Component>
  );
};

export const DatePickerDemo: FunctionComponent = () => (
  <DatePickerDemoBase
    preset={{ id: 'date-picker', mode: 'date', title: 'Date Picker' }}
  />
);

export const TimePickerDemo: FunctionComponent = () => (
  <DatePickerDemoBase
    preset={{ id: 'time-picker', mode: 'time', title: 'Date Picker (Time)' }}
  />
);

export const DateAndTimePickerDemo: FunctionComponent = () => (
  <DatePickerDemoBase
    preset={{
      id: 'date-and-time-picker',
      mode: 'dateAndTime',
      title: 'Date Picker (Date and Time)',
    }}
  />
);
