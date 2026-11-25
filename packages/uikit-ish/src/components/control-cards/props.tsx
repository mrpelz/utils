import type { ReactNode } from 'react';

import type { CardFormat, CardRootProps } from '../card/main.js';
import type { SymbolIcon } from '../symbol/main.js';

/**
 * What every control card takes: a `Card.Root`'s props (`context`,
 * `actionsRef`, `className`…), its label, its symbol, and what's added to
 * its parts (`children`: e.g. a corner button, after them; a composed
 * card's own parts).
 */
export type ControlCardProps = Omit<CardRootProps, 'children'> & {
  /**
   * What's added after its parts (e.g. a `Card.ExpandButton`); a composed
   * card's (a progress, stages, a light, rows) its parts too.
   */
  children?: ReactNode;
  /**
   * Its symbol's icon while on (e.g. filled), its `icon` while off (e.g.
   * outlined), see `Symbol`. Without one, its `icon` always.
   */
  emphasizedIcon?: SymbolIcon;
  /** Its symbol's icon (e.g. outlined, for a card switched on and off). */
  icon: SymbolIcon;
  /**
   * What it is (e.g. a device's name): its title, and its controls'
   * accessible name.
   */
  label: string;
};

/** Words for a state, on and off (e.g. `['Open', 'Closed']`). */
export type ControlCardStates = readonly [on: string, off: string];

/** What a card's value text is told (see `getValueText`). */
export type ControlCardValueTextDetails = {
  /** Whether it's on; without a switch, `undefined`. */
  checked: boolean | undefined;
  /** Its words for on and off (see `states`). */
  states: ControlCardStates;
};

/** A card's value text (see `getValueText`): what's shown, and read. */
export type ControlCardGetValueText = (
  formattedValue: string,
  value: number,
  details: ControlCardValueTextDetails,
) => string;

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
  /** Whether its switch takes no input (the card's presses neither). */
  disabled?: boolean;
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
  CardFormat & {
    /**
     * Its trend: an arrow after its value (a `Card.Trend`), pointing up as
     * steeply as it rises (-90 to 90 degrees, 0 steady). None, no arrow.
     */
    trend?: number;
    /** Its number (formatted, see `format`), or what's shown instead. */
    value: number | ReactNode;
  };

export type ControlCardSliderProps = ControlCardProps &
  CardFormat & {
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
    /** Whether it takes no input (its slider, its switch). */
    disabled?: boolean;
    /**
     * Its value's text (its value line, and what assistive technology reads),
     * from its formatted number (see `format`), its number, and whether it's
     * on (see `states`).
     * @default with a switch, its state's word and its number (“On · 60%”,
     * “Off · 60%”); without one, its number
     */
    getValueText?: ControlCardGetValueText;
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
    states?: ControlCardStates;
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

export type ControlCardButtonProps = ControlCardProps & {
  /** A badge on its symbol (e.g. a count, a `Badge`'s); none, none. */
  badge?: ReactNode;
  /** Its value's words (e.g. when it last rang). */
  status?: ReactNode;
};

export type ControlCardProgressProps = ControlCardProps & {
  /** Whether it's on (lit, its emphasized icon). */
  active?: boolean;
  /**
   * Its parts: a `Card.Progress` (its value) holding a `Card.Subtitle`, a
   * `Card.ProgressValue`, a `Card.ProgressBar`, as the app shows them; and
   * what's added (e.g. a corner button).
   */
  children?: ReactNode;
  /**
   * Its symbol's color while it's on, and its bar's fill's (unless the
   * bar's own `tint`).
   * @default the app's tint
   */
  tint?: string;
};

export type ControlCardStagesProps = ControlCardProps & {
  /** Whether it's on (lit, its emphasized icon), e.g. while it runs. */
  active?: boolean;
  /**
   * Its parts: e.g. a `Card.Subtitle`, a `Card.StageList`; and what's added
   * (e.g. a corner button).
   */
  children: ReactNode;
  /**
   * Its symbol's color while it's on, and its stages' (unless the list's
   * own `tint`).
   * @default the app's tint
   */
  tint?: string;
};

export type ControlCardLightProps = ControlCardProps &
  CardFormat & {
    /** Whether it's on (controlled). */
    checked?: boolean;
    /**
     * Its parts: its `Card.Channels`, shown large (expanded, resized,
     * opened); and what's added (e.g. a corner button).
     */
    children?: ReactNode;
    /**
     * Whether it's on at first (uncontrolled).
     * @default false
     */
    defaultChecked?: boolean;
    /** Whether its switch takes no input (the card's presses neither). */
    disabled?: boolean;
    /**
     * Its value's text (its value line), the app's: from its brightness
     * formatted (see `format`; its strongest amount channel's share), its
     * brightness, and whether it's on (see `states`).
     * @default on, its brightness (“60%”); off, its off word (“Off”)
     */
    getValueText?: ControlCardGetValueText;
    /** As it's switched. */
    onCheckedChange?: (checked: boolean) => void;
    /**
     * Its value's words, on and off (see `getValueText`).
     * @default ['On', 'Off']
     */
    states?: ControlCardStates;
  };

export type ControlCardListProps = ControlCardProps & {
  /**
   * Its parts: its `Card.Rows` (as many as fit shown; rows left out,
   * expanding or opening its tile, see `Card.Rows`); and what's added (e.g.
   * a `Card.ExpandButton`, a `Card.CloseButton`).
   */
  children?: ReactNode;
  /** Its value's words, under its title (none: none). */
  status?: ReactNode;
};

export type ControlCardSegmentedProps = ControlCardProps & {
  /**
   * Its parts: its `Card.Segmented` (its options, its value); and what's
   * added (e.g. a `Card.OpenButton` for its 1x1 size, a `Card.CloseButton`).
   * Its symbol and value its chosen option's.
   */
  children: ReactNode;
  /**
   * The option (or options) that's off: chosen, the card isn't lit (its
   * dark glass); any other, it is (e.g. `['off', 'away']`). None: as its
   * glass is (never lit).
   */
  offValue?: string | readonly string[];
  /** Its symbol's tint (an option's own instead, while it's chosen). */
  tint?: string;
};
