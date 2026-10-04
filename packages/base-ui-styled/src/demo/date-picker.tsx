import { FunctionComponent, useMemo } from 'react';

import { DatePicker } from '../components/index.js';
import { useLog } from './utils/log.js';
import { Component, MappedProp, usePropControl } from './utils/main.js';

// Figma's example: April 20, 2025, 9:41.
const example = new Date(2025, 3, 20, 9, 41);

const propOptions = {
  mode: [undefined, 'date', 'dateAndTime', 'time'] as const,
  pickerStyle: [undefined, 'compact', 'inline'] as const,
  disabled: [undefined, false, true] as const,
  locale: [undefined, 'en-US', 'de-DE', 'fr-FR', 'ar-EG'] as const,
  min: [
    undefined,
    new MappedProp(new Date(2025, 3, 10), '[April 10, 2025]'),
  ] as const,
  max: [
    undefined,
    new MappedProp(new Date(2025, 4, 15), '[May 15, 2025]'),
  ] as const,
};

/**
 * A date picker (UIKit `UIDatePicker`, Figma “Date and time”): compact
 * buttons opening the calendar, or the calendar inline, with the time.
 */
export const DatePickerDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [control, props, Remounter] = usePropControl(
    useMemo(
      () => ({
        ...propOptions,
        onValueChange: [
          new MappedProp(
            (date: Date) => addLog(`value change: ${date.toLocaleString()}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'date picker',
    true,
  );

  return (
    <Component
      center
      controls={[control]}
      id="date-picker"
      log={log}
      title="Date Picker"
    >
      <Remounter>
        <DatePicker
          defaultValue={example}
          {...props}
        />
      </Remounter>
    </Component>
  );
};
