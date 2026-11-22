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
     * at its maximum); off, its fill gray. Neither this nor
     * `defaultChecked`: no switch.
     */
    checked?: boolean;
    /** Whether it's on at first (uncontrolled; a switch, see `checked`). */
    defaultChecked?: boolean;
    /** Its value at first (uncontrolled). */
    defaultValue?: number;
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

/** A list card's row: its symbol (optional), its label, its value. */
export type ControlCardRow = {
  icon?: SymbolIcon;
  /** Its label, also its key: unique in its card. */
  label: string;
  value: ReactNode;
};

export type ControlCardListProps = ControlCardProps & {
  /** Its rows: as many as fit whole shown, in order. */
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
