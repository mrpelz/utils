import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { ComponentProps, ReactNode } from 'react';

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

export type ControlCardProgressProps = ControlCardProps &
  ControlCardFormat & {
    /** Whether it's on (lit, its emphasized icon). */
    active?: boolean;
    /**
     * Its parts (see `ControlCards.Progress`): e.g. a `ControlCards.Subtitle`,
     * a `ControlCards.ProgressValue`, a `ControlCards.ProgressBar`; and what's
     * added (e.g. a corner button).
     */
    children?: ReactNode;
    /**
     * Its progress's greatest value.
     * @default 100
     */
    max?: number;
    /**
     * Its bar's fill's color, and its symbol's while it's on (as a stages
     * card's).
     * @default the app's tint
     */
    tint?: string;
    /** Its progress (0 to `max`); none, none under way (its bar empty). */
    value?: number;
  };

/**
 * A progress card's bar (`ControlCards.ProgressBar`): a pill at the card's
 * bottom, Base UI's progress bar.
 */
export type ControlCardProgressBarProps = {
  /**
   * What's on it (a `ControlCards.ProgressLabel`, a
   * `ControlCards.ProgressDetail`), drawn on the well and again on the fill.
   */
  children?: ReactNode;
  className?: string;
};

/** A progress bar's words at its start (`ControlCards.ProgressLabel`). */
export type ControlCardProgressLabelProps = {
  /** Its words (e.g. `Rinsing`). */
  children: ReactNode;
  className?: string;
};

/** A progress bar's words at its end (`ControlCards.ProgressDetail`). */
export type ControlCardProgressDetailProps = {
  /** Its words (e.g. `40 min left`). */
  children: ReactNode;
  className?: string;
};

/** A progress card's value (`ControlCards.ProgressValue`). */
export type ControlCardProgressValueProps = {
  /**
   * Its words, from its formatted value and its value (see the card's
   * `format`); none, its formatted value.
   */
  children?: (formattedValue: string, value: number) => ReactNode;
  className?: string;
};

/**
 * A card's subtitle (`ControlCards.Subtitle`): more words under its title,
 * where there's room for them.
 */
export type ControlCardSubtitleProps = {
  /** Its words (e.g. `Cotton, 40°`). */
  children: ReactNode;
  className?: string;
};

export type ControlCardTrendProps = {
  /**
   * How steeply its value changes: -90 (falling) to 90 (rising) degrees, 0
   * steady. Its arrow points so; named rising, falling or steady.
   */
  angle: number;
};

/** A card's channels (`ControlCards.Channels`): its sliders, stacked. */
export type ControlCardChannelsProps = {
  /** Its channels (`ControlCards.Channel`s), in order. */
  children: ReactNode;
  className?: string;
};

/**
 * A channel (`ControlCards.Channel`): a slider in a well of its own. An
 * amount (`tint`: e.g. a light's red, black to red), or a scale (`colors`:
 * e.g. a color temperature, warm to cold).
 */
export type ControlCardChannelProps = ControlCardFormat & {
  className?: string;
  /**
   * Its colors from its least value to its greatest (evenly spread; two or
   * more): a scale, shown whole on its well, its thumb the color at its
   * value (e.g. a color temperature's, warm to cold). Instead of `tint`.
   */
  colors?: readonly string[];
  /** Its value at first (uncontrolled). */
  defaultValue?: number;
  /** Whether it takes no input. */
  disabled?: boolean;
  /**
   * Its value's words, from its formatted value and its value (e.g.
   * `3800 K`); none, its formatted value.
   */
  getValueText?: (formattedValue: string, value: number) => string;
  /**
   * Its greatest value.
   * @default 1
   */
  max?: number;
  /**
   * Its least value.
   * @default 0
   */
  min?: number;
  /** Its name (e.g. `Red`): on its well, and its slider's name. */
  name: string;
  /** As its value changes. */
  onValueChange?: (value: number) => void;
  /**
   * How far a step goes.
   * @default 1/100 of its range
   */
  step?: number;
  /**
   * An amount's color at its greatest value (e.g. a light's red): its fill,
   * its thumb that color mixed on black by its share (as light adds up).
   * @default the app's tint
   */
  tint?: string;
  /** Its value (controlled). */
  value?: number;
};

export type ControlCardLightProps = ControlCardProps &
  ControlCardFormat & {
    /** Whether it's on (controlled). */
    checked?: boolean;
    /**
     * Its parts (see `ControlCards.Light`): its `ControlCards.Channels`,
     * shown large; and what's added (e.g. a corner button).
     */
    children?: ReactNode;
    /**
     * Whether it's on at first (uncontrolled).
     * @default true
     */
    defaultChecked?: boolean;
    /**
     * Its value's text (its value line), the app's: from its brightness
     * formatted (see `format`; its strongest amount channel's share), its
     * brightness, and whether it's on (see `states`).
     * @default on, its brightness (“60%”); off, its off word (“Off”)
     */
    getValueText?: (
      formattedValue: string,
      value: number,
      details: ControlCardValueTextDetails,
    ) => string;
    /** As it's switched. */
    onCheckedChange?: (checked: boolean) => void;
    /**
     * Its value's words, on and off (see `getValueText`).
     * @default ['On', 'Off']
     */
    states?: ControlCardTextStates;
  };

/** A stages card's stage (`ControlCards.Stage`). */
export type ControlCardStageProps = Omit<ComponentProps<'li'>, 'children'> & {
  /** Its words, under its dot. */
  children: ReactNode;
  /** What it is (its card's `value` names the current one). */
  value: string;
};

/**
 * A stages card (`ControlCards.Stages`): a run of stages in order (e.g. a
 * washer's), shown, not chosen.
 */
export type ControlCardStagesProps = ControlCardProps & {
  /** Whether it's on (lit, its emphasized icon), e.g. while it runs. */
  active?: boolean;
  /**
   * Its parts (see `ControlCards.Stages`): e.g. a `ControlCards.Subtitle`, a
   * `ControlCards.StageList`; and what's added (e.g. a corner button).
   */
  children: ReactNode;
  /**
   * The color of its current stage, and of those done.
   * @default the app's tint
   */
  tint?: string;
  /**
   * Its current stage's value: those before it done, those after to come;
   * none, all to come.
   */
  value?: string;
};

/** A stages card's stages (`ControlCards.StageList`), an ordered list. */
export type ControlCardStageListProps = Omit<
  ComponentProps<'ol'>,
  'children'
> & {
  /** Its stages (`ControlCards.Stage`s), in order. */
  children: ReactNode;
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
