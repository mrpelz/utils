import type { ComponentProps } from 'react';

export type RollValue = number | string;

/**
 * What changed a column's selection (or highlight), and the event that
 * started it: a scroll (touch, wheel, a drag), a key, a press on a row, or
 * a typed value. Selections commit once the column settles, so `event` can
 * be some time past.
 */
export type RollChangeEventDetails = {
  event: Event;
  reason: 'input' | 'item-press' | 'keyboard' | 'scroll';
};

export type Entry = { disabled: boolean; value: RollValue };

export type ColumnContextValue = {
  entries: WeakMap<Element, Entry>;
  /** The id of a row by its value. */
  idOf: (value: RollValue) => string;
  isEditing: boolean;
  select: (element: HTMLElement, event: Event) => void;
  selected: RollValue | undefined;
};

export type RollColumnProps = Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange' | 'ref'
> & {
  /**
   * The rows' alignment.
   * @default 'center'
   */
  align?: 'center' | 'end' | 'start';
  /** The initially selected value (uncontrolled). */
  defaultValue?: RollValue;
  /** Disables the column: it can't be scrolled or focused. */
  disabled?: boolean;
  /**
   * Pressing the selected row (or typing a digit) enters a value as text
   * (a numeric keyboard; see above).
   */
  editable?: boolean;
  /**
   * Its rows repeat endlessly (e.g. a time's): scrolled past the
   * last row, the first follows, and so on.
   */
  loop?: boolean;
  /**
   * Called as rows pass the center while scrolling (e.g. for haptics), and
   * why (see `onValueChange`).
   */
  onHighlightChange?: (
    value: RollValue,
    eventDetails: RollChangeEventDetails,
  ) => void;
  /**
   * Called with the newly selected value, once the column settled, and why
   * (`reason`): `scroll` (touch, wheel, a drag), `keyboard`, `item-press`,
   * or `input` (a typed value).
   */
  onValueChange?: (
    value: RollValue,
    eventDetails: RollChangeEventDetails,
  ) => void;
  /** The selected value (controlled). */
  value?: RollValue;
};

export type Drag = {
  isMoved: boolean;
  pointerId: number;
  samples: { time: number; y: number }[];
  startTop: number;
  startY: number;
};

export type RollItemProps = Omit<ComponentProps<'div'>, 'ref'> & {
  /** Shown, but not selectable (the column moves on from it). */
  disabled?: boolean;
  /** The row's value (its text by default). */
  value: RollValue;
};
