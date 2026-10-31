import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { CalendarFooter, DatePicker } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  getPropOptionsDatePicker,
  getPropOptionsRangePicker,
  propOptionsFooterContent,
  rangeMessages,
} from './props.js';

// An example date: April 20, 2025, 10:00 (a range: to April 24).
const example = new Date(2025, 3, 20, 10, 0);

/**
 * A date picker: compact
 * buttons opening the calendar in a popover, or the calendar inline.
 */
export const DatePickerDemo: FunctionComponent = () => {
  const id = 'date-picker';

  const [log, addLog] = useLog();
  const [externalPicker] = useProvidedState(id);

  const [controlPicker, propsPicker, statePicker, elementKey] = usePropControl(
    useMemo(() => getPropOptionsDatePicker('date', addLog), [addLog]),
    { external: externalPicker, isOpen: true, title: 'date picker' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      baseUiId="popover"
      controls={controlPicker}
      id={id}
      log={log}
      state={[statePicker]}
      title="Date Picker"
    >
      <DatePicker.Root
        key={elementKey}
        defaultValue={example}
        {...propsPicker}
      />
    </Component>
  );
};

/**
 * A range of dates, dragged, or picked by its ends; its rule's message
 * (`isRangeDisabled`) in the calendar's footer: what can be picked, or (its
 * end missing) what's wrong.
 */
export const DatePickerRangeDemo: FunctionComponent = () => {
  const id = 'date-picker-range';

  const [log, addLog] = useLog();
  const [externalPicker] = useProvidedState(id);

  const [controlPicker, propsPicker, statePicker, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRangePicker(addLog), [addLog]),
    { external: externalPicker, isOpen: true, title: 'date picker' },
  );

  const message = rangeMessages.get(
    propsPicker.isRangeDisabled as Parameters<typeof rangeMessages.get>[0],
  );

  return (
    <Component
      hasInputGuards
      isCentered
      baseUiId="popover"
      controls={controlPicker}
      id={id}
      log={log}
      state={[statePicker]}
      title="Date Picker (Range)"
    >
      <DatePicker.Root
        key={elementKey}
        range
        defaultValue={{ end: new Date(2025, 3, 24), start: example }}
        footer={
          message
            ? ({ value }: CalendarFooter) => {
                const error =
                  value !== null &&
                  !(value instanceof Date) &&
                  value.end === null
                    ? message.error
                    : undefined;

                return (
                  <DatePicker.CalendarMessage
                    variant={error ? 'error' : 'info'}
                  >
                    {error ?? message.info}
                  </DatePicker.CalendarMessage>
                );
              }
            : undefined
        }
        {...propsPicker}
      />
    </Component>
  );
};

/** The time only: a roll, in place or in a popover. */
export const TimePickerDemo: FunctionComponent = () => {
  const id = 'time-picker';

  const [log, addLog] = useLog();
  const [externalPicker] = useProvidedState(id);

  const [controlPicker, propsPicker, statePicker, elementKey] = usePropControl(
    useMemo(() => getPropOptionsDatePicker('time', addLog), [addLog]),
    { external: externalPicker, isOpen: true, title: 'date picker' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      baseUiId="popover"
      controls={controlPicker}
      id={id}
      log={log}
      state={[statePicker]}
      title="Date Picker (Time)"
    >
      <DatePicker.Root
        key={elementKey}
        defaultValue={example}
        {...propsPicker}
      />
    </Component>
  );
};

/** The date and the time: two buttons opening one popover. */
export const DateAndTimePickerDemo: FunctionComponent = () => {
  const id = 'date-and-time-picker';

  const [log, addLog] = useLog();
  const [externalPicker] = useProvidedState(id);

  const [controlPicker, propsPicker, statePicker, elementKey] = usePropControl(
    useMemo(() => getPropOptionsDatePicker('dateAndTime', addLog), [addLog]),
    { external: externalPicker, isOpen: true, title: 'date picker' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      baseUiId="popover"
      controls={controlPicker}
      id={id}
      log={log}
      state={[statePicker]}
      title="Date Picker (Date and Time)"
    >
      <DatePicker.Root
        key={elementKey}
        defaultValue={example}
        {...propsPicker}
      />
    </Component>
  );
};

/**
 * The calendar's footer, composed (`footer`): the Time row, and buttons
 * jumping to dates from the selection (with its time: “Now”).
 */
export const DatePickerFooterDemo: FunctionComponent = () => {
  const id = 'date-picker-footer';

  const [log, addLog] = useLog();
  const [externalContent, externalPicker] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsFooterContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlPicker, propsPicker, statePicker, elementKey] = usePropControl(
    useMemo(() => getPropOptionsDatePicker('dateAndTime', addLog), [addLog]),
    { external: externalPicker, isOpen: true, title: 'date picker' },
  );

  const hasTimeRow =
    content.footer === 'timeRow' || content.footer === 'timeRowAndJumps';
  const hasJumps =
    content.footer === 'jumps' || content.footer === 'timeRowAndJumps';

  return (
    <Component
      hasInputGuards
      isCentered
      baseUiId="popover"
      controls={[controlContent, controlPicker]}
      id={id}
      log={log}
      state={[stateContent, statePicker]}
      title="Date Picker (Footer)"
    >
      <DatePicker.Root
        key={elementKey}
        defaultValue={example}
        footer={
          content.footer === undefined
            ? undefined
            : (calendar: CalendarFooter) => {
                // Jumps start from the selected date.
                const selected =
                  calendar.value instanceof Date ? calendar.value : example;

                return (
                  <>
                    {hasTimeRow ? (
                      <DatePicker.CalendarTimeRow calendar={calendar} />
                    ) : null}
                    {hasJumps ? (
                      <DatePicker.CalendarRow>
                        <span aria-hidden="true">Jump to</span>
                        <span className="date-picker-demo-jumps">
                          <DatePicker.CalendarButton
                            disabled={calendar.disabled}
                            shape={calendar.buttonShape}
                            onClick={() =>
                              calendar.select(
                                new Date(
                                  selected.getFullYear(),
                                  selected.getMonth(),
                                  selected.getDate() + 7,
                                ),
                                false,
                              )
                            }
                          >
                            In a week
                          </DatePicker.CalendarButton>
                          <DatePicker.CalendarButton
                            disabled={calendar.disabled}
                            shape={calendar.buttonShape}
                            onClick={() =>
                              calendar.select(
                                new Date(
                                  selected.getFullYear(),
                                  selected.getMonth() + 1,
                                  1,
                                ),
                                false,
                              )
                            }
                          >
                            Next month
                          </DatePicker.CalendarButton>
                          <DatePicker.CalendarButton
                            disabled={calendar.disabled}
                            shape={calendar.buttonShape}
                            onClick={() => calendar.select(new Date(), false)}
                          >
                            Today
                          </DatePicker.CalendarButton>
                          <DatePicker.CalendarButton
                            disabled={calendar.disabled}
                            shape={calendar.buttonShape}
                            onClick={() => calendar.select(new Date(), true)}
                          >
                            Now
                          </DatePicker.CalendarButton>
                        </span>
                      </DatePicker.CalendarRow>
                    ) : null}
                  </>
                );
              }
        }
        {...propsPicker}
      />
    </Component>
  );
};
