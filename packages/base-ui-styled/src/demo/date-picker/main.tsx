import { FunctionComponent, useMemo } from 'react';

import {
  DatePicker,
  DatePickerMode,
  DateRange,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import { getPropOptionsDatePicker, propOptionsContent } from './props.js';

// Figma's example: April 20, 2025, 9:41 (a range: to April 24).
const example = new Date(2025, 3, 20, 9, 41);
const exampleRange: DateRange = { end: new Date(2025, 3, 24), start: example };

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

  const [controlContent, content, RemounterContent] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [control, props, Remounter] = usePropControl(
    useMemo(
      () => getPropOptionsDatePicker(preset.mode, addLog),
      [addLog, preset.mode],
    ),
    'date picker',
    true,
  );

  return (
    <Component
      center
      // Ranges are of dates only: not in the time's demos.
      controls={preset.mode === 'date' ? [controlContent, control] : [control]}
      id={preset.id}
      log={log}
      title={preset.title}
    >
      <RemounterContent>
        <Remounter>
          {content.range && preset.mode === 'date' ? (
            <DatePicker
              range
              defaultValue={exampleRange}
              {...props}
            />
          ) : (
            <DatePicker
              defaultValue={example}
              {...props}
            />
          )}
        </Remounter>
      </RemounterContent>
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
