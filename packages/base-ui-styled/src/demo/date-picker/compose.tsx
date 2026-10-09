/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useMemo,
} from 'react';

import {
  DatePicker,
  DatePickerMode,
  DatePickerProps,
  DateRange,
} from '../../components/index.js';
import { PropMap, usePropControl } from '../utils/main.js';
import {
  getFooters,
  getPropOptionsContent,
  withRangeMessage,
} from './props.js';

/** How many controls (and states) `useDatePickerDemo` has. */
export const datePickerControlCount = 2;

export type DatePickerDemoOptions<Picker extends PropMap> = {
  /**
   * The picker's options: as the date picker demo's
   * (`getPropOptionsDatePicker`, in its mode), with a composing demo's own
   * values (e.g. a birthday's: only past dates).
   */
  picker: Picker;
  /** Before the controls' titles (e.g. `birthday: `). */
  prefix?: string;
};

/** What a demo composing a date picker gives it (e.g. its value). */
export type DatePickerOwnProps = Omit<
  DatePickerProps,
  'defaultValue' | 'onValueChange' | 'range' | 'value'
> & {
  /** A date (or, as a range, from it to four days later). */
  defaultValue?: Date;
  onValueChange?: (value: Date) => void;
  value?: Date | null;
};

/**
 * A `DatePicker`'s demo controls (its content: a range, the footer; the
 * picker), for its demo and demos composing one (e.g. a form's date field):
 * all of its demo's props (in `mode`), with the composing demo's values;
 * `render` composes the picker, its `own` props (e.g. its value) over them.
 */
export const useDatePickerDemo = <Picker extends PropMap>(
  externals: readonly unknown[],
  mode: DatePickerMode,
  { picker, prefix = '' }: DatePickerDemoOptions<Picker>,
) => {
  const [externalContent, externalControl] = externals;

  const [controlContent, content, stateContent, RemounterContent] =
    usePropControl(
      useMemo(() => getPropOptionsContent(mode), [mode]),
      `${prefix}[content]`,
      externalContent,
      true,
    );
  // The calendar's footer, composed (see `footers`); by default, the
  // picker's own.
  const footer =
    'footer' in content && content.footer
      ? getFooters(mode)[content.footer]
      : undefined;
  const range = 'range' in content && content.range;

  const [control, props, stateControl, RemounterPicker] = usePropControl(
    picker,
    `${prefix}date picker`,
    externalControl,
    true,
  );
  // Ranges' only (dates only, see `getPropOptionsDatePicker`).
  const { isRangeDisabled, ...pickerProps } =
    props as Partial<DatePickerProps> & {
      isRangeDisabled?: (start: Date, end: Date) => boolean;
    };

  const Remounter = useMemo<FunctionComponent<PropsWithChildren>>(
    () =>
      function DatePickerRemounter({ children }) {
        return (
          <RemounterContent>
            <RemounterPicker>{children}</RemounterPicker>
          </RemounterContent>
        );
      },
    [RemounterContent, RemounterPicker],
  );

  const render = ({
    defaultValue,
    onValueChange,
    value,
    ...own
  }: DatePickerOwnProps): ReactNode => {
    if (range) {
      const start = value ?? defaultValue;
      const exampleRange: DateRange | undefined = start
        ? {
            end: new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate() + 4,
            ),
            start,
          }
        : undefined;
      return (
        <DatePicker
          range
          defaultValue={exampleRange}
          footer={withRangeMessage(footer, isRangeDisabled)}
          isRangeDisabled={isRangeDisabled}
          {...(pickerProps as object)}
          {...own}
          {...(onValueChange && {
            onValueChange: (next: DateRange) => onValueChange(next.start),
          })}
        />
      );
    }

    return (
      <DatePicker
        defaultValue={defaultValue}
        footer={footer}
        {...(pickerProps as object)}
        {...(value === undefined ? {} : { value })}
        {...own}
        {...(onValueChange && { onValueChange })}
      />
    );
  };

  return {
    // Ranges are of dates only, footers of calendars: not in the time's.
    controls: mode === 'time' ? [control] : [controlContent, control],
    Remounter,
    render,
    states: [stateContent, stateControl],
  };
};
