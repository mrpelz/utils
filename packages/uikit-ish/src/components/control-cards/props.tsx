import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { ReactNode } from 'react';

import type { CardRootProps } from '../card/main.js';
import type { GridSize } from '../grid/main.js';
import type { SymbolIcon } from '../symbol/main.js';

/**
 * What every control card takes: a `Card.Root`'s props (`context`,
 * `actionsRef`, `className`…), its name, its symbol, and what's added to
 * its parts (`children`: e.g. a corner button, after them).
 */
export type ControlCardProps = Omit<CardRootProps, 'children'> & {
  /** What's added after its parts (e.g. a `ControlCards.ExpandButton`). */
  children?: ReactNode;
  /**
   * Its symbol's icon while on (e.g. filled), its `icon` while off (e.g.
   * outlined), see `Symbol`. Without one, its `icon` always.
   */
  emphasizedIcon?: SymbolIcon;
  /** Its symbol's icon (e.g. outlined, for a card switched on and off). */
  icon: SymbolIcon;
  /** What it is (e.g. a device's name): its title, and its controls' name. */
  name: string;
};

/** Words for a state, on and off (e.g. `['Open', 'Closed']`). */
export type ControlCardStates = readonly [on: ReactNode, off: ReactNode];

/** Words for on and off, as text (a value's text, see `getValueText`). */
export type ControlCardTextStates = readonly [on: string, off: string];

/** What a slider card's value text is told (see `getValueText`). */
export type ControlCardValueTextDetails = {
  /** Whether it's on; without a switch, `undefined`. */
  checked: boolean | undefined;
  /** Its words for on and off (see `states`). */
  states: ControlCardTextStates;
};

/** How a number's shown (`Intl.NumberFormat`'s). */
export type ControlCardFormat = {
  /** Its number's format (e.g. `{ style: 'percent' }`). */
  format?: Intl.NumberFormatOptions;
  /**
   * Its number's locale.
   * @default the document's language
   */
  locale?: Intl.LocalesArgument;
};

export type ControlCardStateProps = ControlCardProps & {
  /** Whether it's on (lit, its emphasized icon): e.g. a door open. */
  active: boolean;
  /**
   * Its value's words, on and off.
   * @default ['On', 'Off']
   */
  states?: ControlCardStates;
};

export type ControlCardSwitchProps = ControlCardProps & {
  /** Whether it's on (controlled). */
  checked?: boolean;
  /**
   * Whether it's on at first (uncontrolled).
   * @default false
   */
  defaultChecked?: boolean;
  /** As it's switched (by its switch, or a press on the card). */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Its value's words, on and off.
   * @default ['On', 'Off']
   */
  states?: ControlCardStates;
  /**
   * Its tint (a CSS color): its symbol's and its switch's while on.
   * @default the switch's on color (green)
   */
  tint?: string;
};

export type ControlCardValueProps = ControlCardProps &
  ControlCardFormat & {
    /**
     * Its trend: an arrow after its value, pointing up as steeply as it
     * rises (-90 to 90 degrees, 0 steady). None, no arrow.
     */
    trend?: number;
    /** Its number (formatted, see `format`), or what's shown instead. */
    value: number | ReactNode;
  };

export type ControlCardSliderProps = ControlCardProps &
  ControlCardFormat & {
    /**
     * It controls a brightness (e.g. a dimmer): its glass dark in both
     * color schemes (its fill telling how much light), its symbol on (its
     * emphasized icon) above its minimum, while on. Else, its glass
     * follows the color scheme (e.g. blinds).
     * @default false
     */
    brightness?: boolean;
    /**
     * Whether it's on (controlled): a switch at its top trailing corner,
     * and a click on it (not a drag) toggling it. Its value kept either
     * way (how the two go together is the app's, e.g. on at its minimum,
     * at its maximum); off, its fill not drawn, a dashed line where it'd
     * end (see `Card`). Neither this nor `defaultChecked`: no switch.
     */
    checked?: boolean;
    /** Whether it's on at first (uncontrolled; a switch, see `checked`). */
    defaultChecked?: boolean;
    /** Its value at first (uncontrolled). */
    defaultValue?: number;
    /**
     * Its value's text (its value line, and what assistive technology reads),
     * from its formatted number (see `format`), its number, and whether it's
     * on (see `states`).
     * @default with a switch, its state's word and its number (“On · 60%”,
     * “Off · 60%”); without one, its number
     */
    getValueText?: (
      formattedValue: string,
      value: number,
      details: ControlCardValueTextDetails,
    ) => string;
    /**
     * Its greatest value.
     * @default 100
     */
    max?: number;
    /**
     * Its least value.
     * @default 0
     */
    min?: number;
    /** As it's switched (see `checked`). */
    onCheckedChange?: (checked: boolean) => void;
    /** As its value changes, dragged (or by keyboard). */
    onValueChange?: (value: number) => void;
    /**
     * Its value's words, on and off, with a switch (see `getValueText`).
     * @default ['On', 'Off']
     */
    states?: ControlCardTextStates;
    /**
     * Its values' step: given, a tick at each (none: continuous).
     * @default none (continuous: 1/100 of its range)
     */
    step?: number;
    /**
     * Its fill's color: opaque, any color (its text drawn again over it,
     * dark on a bright fill, light on a dim one).
     * @default the app's tint
     */
    tint?: string;
    /** Its value (controlled). */
    value?: number;
  };

export type ControlCardSliderFillProps = ControlCardFormat & {
  className?: string;
  /** Its value at first (uncontrolled). */
  defaultValue?: number;
  /**
   * Its value's text (its value line, and what assistive technology reads),
   * from its formatted number (see `format`) and its number: e.g. its
   * card's state with it, the app's.
   * @default its formatted number
   */
  getValueText?: (formattedValue: string, value: number) => string;
  /**
   * Its greatest value.
   * @default 100
   */
  max?: number;
  /**
   * Its least value.
   * @default 0
   */
  min?: number;
  /** Its label, and its accessible name (e.g. the card's name). */
  name: string;
  /**
   * A click on it (released before it moves): this, not a value (e.g. its
   * card's switch toggled); a drag sets its value. None: a press sets it.
   */
  onPress?: () => void;
  /** As its value changes, dragged (or by keyboard). */
  onValueChange?: (value: number) => void;
  /**
   * Its values' step: given, a tick at each (none: continuous).
   * @default none (continuous: 1/100 of its range)
   */
  step?: number;
  /**
   * Its fill's color: opaque, any color (what's over it drawn again in it,
   * dark on a bright fill, light on a dim one).
   * @default the app's tint
   */
  tint?: string;
  /** Its value (controlled). */
  value?: number;
};

export type ControlCardButtonProps = ControlCardProps & {
  /** A badge on its symbol (e.g. a count); none, none. */
  badge?: ReactNode;
  /** As it's pressed (it lights up for a moment, and fades back). */
  onPress?: () => void;
  /** Its value's words (e.g. when it last rang). */
  status?: ReactNode;
};

export type ControlCardProgressProps = ControlCardProps & {
  /** Whether it's on (lit, its emphasized icon). */
  active?: boolean;
  /**
   * Its progress's greatest value.
   * @default 100
   */
  max?: number;
  /** Its value's words (e.g. how long it has left). */
  status?: ReactNode;
  /**
   * Its progress bar's color.
   * @default the app's tint
   */
  tint?: string;
  /** Its progress (0 to `max`); none (`undefined`), no bar. */
  value?: number;
};

export type ControlCardTrendProps = {
  /**
   * How steeply its value changes: -90 (falling) to 90 (rising) degrees, 0
   * steady. Its arrow points so; named rising, falling or steady.
   */
  angle: number;
};

/** A channel of a light, or a bar (see `ControlCards.Channels`). */
export type ControlCardChannel = {
  /** Its name, short (e.g. `R`), shown on its bar. */
  label: string;
  /** Its accessible name (e.g. `Red`). */
  name: string;
  /** Its bar's color. */
  tint: string;
};

export type ControlCardChannelsProps = {
  /** Its bars, in order. */
  channels: readonly ControlCardChannel[];
  className?: string;
  /** As a bar's value changes: its index, its value (0 to 1). */
  onValueChange?: (index: number, value: number) => void;
  /** Each bar's value (0 to 1), by index. */
  value: readonly number[];
};

export type ControlCardLightProps = ControlCardProps &
  ControlCardFormat & {
    /** Its channels (e.g. red, green, blue): bars, shown large. */
    channels: readonly ControlCardChannel[];
    /** Whether it's on (controlled). */
    checked?: boolean;
    /**
     * Whether it's on at first (uncontrolled).
     * @default true
     */
    defaultChecked?: boolean;
    /** Its channels' values at first (uncontrolled; 0 to 1 each). */
    defaultValue?: readonly number[];
    /**
     * Its value's words while it's off (on: its brightness, its strongest
     * channel's).
     * @default 'Off'
     */
    offLabel?: ReactNode;
    /** As it's switched. */
    onCheckedChange?: (checked: boolean) => void;
    /** As a channel's value changes: all of them (0 to 1 each). */
    onValueChange?: (value: readonly number[]) => void;
    /** Its channels' values (controlled; 0 to 1 each). */
    value?: readonly number[];
  };

/** A segmented card's option (`ControlCards.SegmentedItem`). */
export type ControlCardSegmentedItemProps = Omit<
  BaseRadio.Root.Props,
  'children' | 'ref' | 'value'
> & {
  /**
   * Its words: its segment's (its name with its symbol only, see
   * `optionContent`), and the card's value while it's chosen.
   */
  children: ReactNode;
  /**
   * Whether it can't be chosen now (as Segmented's items): dimmed, not
   * pressed, dragged past, skipped by keys (see Base UI's Radio).
   */
  disabled?: boolean;
  /**
   * Its symbol: in its segment, and the card's while it's chosen (else
   * the card's `icon`).
   */
  icon?: SymbolIcon;
  /**
   * More words, under its words (in the card's value's color), where
   * there's room for them: in a tile taller than a row (not across one,
   * not with its symbol only, see `optionContent`); stacked, once its
   * segment's tall enough.
   */
  subtitle?: ReactNode;
  /** The card's symbol's tint while it's chosen (else the card's `tint`). */
  tint?: string;
  /** What it stands for (unique in its card). */
  value: string;
};

export type ControlCardSegmentedProps = Omit<ControlCardProps, 'children'> & {
  /**
   * Its options (`ControlCards.SegmentedItem`s), in order: segments in a
   * well at its bottom, side by side (across a row, a symbol beside its
   * words; taller, over them), or stacked (beside them; one wide, over
   * them), the chosen one's raised; dragged between (each chosen as it's
   * reached).
   */
  children: ReactNode;
  /** The option chosen at first (uncontrolled). @default its first's */
  defaultValue?: string;
  /**
   * The option that's off: chosen, the card isn't lit (its dark glass);
   * any other, it is. None: as its glass is (never lit).
   */
  offValue?: string;
  /** Chosen, as it's pressed (or by keys, see Base UI's RadioGroup). */
  onValueChange?: (value: string) => void;
  /**
   * Opening it above the page (its grid item's `open`; as `OpenButtons`,
   * its props), a tile too small for its options (1x1): its corner
   * button, or a press on it, opening it; open, an x in its top trailing
   * corner (clear of its symbol) closing it.
   */
  opening?: ControlCardOpenButtonsProps;
  /**
   * What its options' segments show: their symbols and words (`both`; an
   * option without a symbol, its words), their symbols only (`icon`, its
   * words its name, unseen), or their words only (`label`).
   * @default 'both'
   */
  optionContent?: 'both' | 'icon' | 'label';
  /**
   * Its options side by side (`horizontal`) or stacked (`vertical`), in a
   * tile taller than a row; in one row, side by side only (vertical: none,
   * as 1x1, see `opening`). None: by its size (one wide and taller,
   * stacked; else side by side).
   */
  orientation?: 'horizontal' | 'vertical';
  /** Its symbol's tint (an option's own instead, while it's chosen). */
  tint?: string;
  /** The option chosen (controlled). */
  value?: string;
};

/** A list card's row: its symbol (optional), its label, its value. */
export type ControlCardRow = {
  icon?: SymbolIcon;
  /** Its label, also its key: unique in its card. */
  label: string;
  /**
   * Pressed (anywhere on it), e.g. going to a page of its own: a chevron
   * after its value (List's `DrillIn`), its label a button.
   */
  onPress?: () => void;
  value: ReactNode;
};

export type ControlCardListProps = ControlCardProps & {
  /**
   * Expanding it in place (as `ExpandButton`, its props): from its list's
   * last row while rows are left out (“3 more”, see `getMoreLabel`),
   * expanded, making it small again from there (“Less”, see `lessLabel`);
   * no list shown, by `ExpandButton` in its corner. Before `opening`.
   */
  expansion?: ControlCardExpandButtonProps;
  /**
   * Its list's last row while rows are left out (their count given).
   * @default `${count} more`
   */
  getMoreLabel?: (count: number) => string;
  /**
   * Its list's last row while it's expanded (see `expansion`).
   * @default 'Less'
   */
  lessLabel?: string;
  /**
   * Opening it above the page (its grid item's `open`, see `Grid.Item`;
   * as `OpenButtons`, its props): from its list's last row while rows are
   * left out (“3 more”), no list shown, by a corner button; open, closed by
   * an x in its top trailing corner (clear of its symbol).
   */
  opening?: ControlCardOpenButtonsProps;
  /**
   * Its rows: as many as fit whole shown, in order; the last one, while
   * some are left out, counting them (see `getMoreLabel`).
   */
  rows: readonly ControlCardRow[];
  /** Its value's words, under its title (none: none). */
  status?: ReactNode;
};

export type ControlCardExpandButtonProps = {
  /**
   * Its card's size, not expanded (its grid item's `size` then). Hidden
   * while expanding changes nothing: as its item would be either size now
   * (see `useGridItem`'s `sizeOf`), the same (e.g. too few columns).
   */
  collapsedSize: GridSize;
  /** Whether its card is expanded. */
  expanded: boolean;
  /**
   * Its card's size, expanded (its grid item's `size` then; smaller than
   * `collapsedSize` too, its icon then collapsing).
   */
  expandedSize: GridSize;
  /** Its accessible name (e.g. “Thermostat details”). */
  label: string;
  /** As it's pressed: expanded, or made small again. */
  onExpandedChange: (expanded: boolean) => void;
};

export type ControlCardOpenButtonsProps = {
  /** Its close button's accessible name (e.g. “Close”). */
  closeLabel: string;
  /** Its open button's accessible name (e.g. “Speaker details”). */
  label: string;
};
