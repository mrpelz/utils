import type { ComponentProps } from 'react';

export type RollValue = number | string;

export type Entry = { disabled: boolean; value: RollValue };

export type ColumnContextValue = {
  editing: boolean;
  entries: WeakMap<Element, Entry>;
  /** The id of a row by its value. */
  idOf: (value: RollValue) => string;
  select: (element: HTMLElement) => void;
  selected: RollValue | undefined;
};

export type RollColumnProps = Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange' | 'ref'
> & {
  /** The rows' alignment (default: `center`). */
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
   * Its rows repeat endlessly (as iOS's time wheels): scrolled past the
   * last row, the first follows, and so on.
   */
  loop?: boolean;
  /** Called as rows pass the center while scrolling (e.g. for haptics). */
  onHighlightChange?: (value: RollValue) => void;
  /** Called with the newly selected value, once the column settled. */
  onValueChange?: (value: RollValue) => void;
  /** The selected value (controlled). */
  value?: RollValue;
};

export type Drag = {
  moved: boolean;
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
