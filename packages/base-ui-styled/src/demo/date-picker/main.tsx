import { FunctionComponent, useMemo } from 'react';

import {
  DatePicker,
  DatePickerMode,
  DateRange,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  getFooters,
  getPropOptionsContent,
  getPropOptionsDatePicker,
  withRangeMessage,
} from './props.js';

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

  const [externalContent, externalControl] = useProvidedState(preset.id);

  const [controlContent, content, stateContent, RemounterContent] =
    usePropControl(
      useMemo(() => getPropOptionsContent(preset.mode), [preset.mode]),
      '[content]',
      externalContent,
      true,
    );
  // The calendar's footer, composed (see `footers`); by default, the
  // picker's own.
  const footer =
    'footer' in content && content.footer
      ? getFooters(preset.mode)[content.footer]
      : undefined;
  const range = 'range' in content && content.range;

  const [control, props, stateControl, Remounter] = usePropControl(
    useMemo(
      () => getPropOptionsDatePicker(preset.mode, addLog),
      [addLog, preset.mode],
    ),
    'date picker',
    externalControl,
    true,
  );
  // Ranges' only (dates only, see `getPropOptionsDatePicker`).
  const { isRangeDisabled, ...pickerProps } = props as typeof props & {
    isRangeDisabled?: (start: Date, end: Date) => boolean;
  };

  return (
    <Component
      center
      // Ranges are of dates only, footers of calendars: not in the time's.
      controls={preset.mode === 'time' ? [control] : [controlContent, control]}
      id={preset.id}
      log={log}
      stateUrl={useCreateStateUrl(preset.id, [stateContent, stateControl])}
      title={preset.title}
    >
      <RemounterContent>
        <Remounter>
          {range ? (
            <DatePicker
              range
              defaultValue={exampleRange}
              footer={withRangeMessage(footer, isRangeDisabled)}
              isRangeDisabled={isRangeDisabled}
              {...pickerProps}
            />
          ) : (
            <DatePicker
              defaultValue={example}
              footer={footer}
              {...pickerProps}
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
