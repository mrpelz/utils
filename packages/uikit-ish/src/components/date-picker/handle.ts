import { type ReactNode, useState } from 'react';

import type { DatePickerOpen } from './props.js';

// A date picker's pickers, by a handle (see `Root` `handle`): shown in
// place elsewhere (`Expandable`, e.g. in expandable list rows after the
// picker's row), as Base UI's handles link a trigger to its popup. The
// picker publishes them while it's mounted.

/** What a date picker publishes for its handle's `Expandable`. */
export type DatePickerPickers = {
  /** Its calendar (with a date). */
  calendar?: ReactNode;
  /** The open picker. */
  open: DatePickerOpen | null;
  /** Its time roll (with a time). */
  time?: ReactNode;
};

const closed: DatePickerPickers = { open: null };

/**
 * A date picker's pickers, by a handle (`DatePicker.createHandle`, in a
 * component `useCreateDatePickerHandle`): given to it (`handle`, its
 * buttons toggling them) and to the `DatePicker.Expandable` showing them.
 */
export class DatePickerHandle {
  #listeners = new Set<() => void>();

  #pickers = closed;

  /** The open picker (`date`, `time`), or `null`. */
  get open(): DatePickerOpen | null {
    return this.#pickers.open;
  }

  /**
   * The pickers, as published (see `subscribe`).
   * @internal
   */
  readonly getSnapshot = (): DatePickerPickers => this.#pickers;

  /**
   * Publishes the pickers (see `Root`); `undefined`: none (unmounted).
   * @internal
   */
  publish(pickers: DatePickerPickers | undefined): void {
    this.#pickers = pickers ?? closed;
    for (const listener of this.#listeners) listener();
  }

  /**
   * Calls `listener` when the pickers change; returns what stops it.
   * @internal
   */
  readonly subscribe = (listener: () => void): (() => void) => {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  };
}

/** A handle to a date picker's pickers, made once (see above). */
export const createHandle = (): DatePickerHandle => new DatePickerHandle();

/** `DatePicker.createHandle`, in a component: made once, for its lifetime. */
export const useCreateDatePickerHandle = (): DatePickerHandle => {
  const [handle] = useState(createHandle);

  return handle;
};
