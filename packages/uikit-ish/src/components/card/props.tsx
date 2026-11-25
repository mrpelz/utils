import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { Slider as BaseSlider } from '@base-ui/react/slider';
import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactNode, RefObject } from 'react';

import type { GlassSurfaceProps } from '../glass/main.js';
import type { GridCornerButtonProps, GridSize } from '../grid/main.js';
import type { ListItemProps, ListRootProps } from '../list/props.js';
import type { SliderRootProps } from '../slider/props.js';
import type { SwitchRootProps } from '../switch/props.js';
import type { SymbolIcon } from '../symbol/main.js';

/** How a part's number is shown (`Intl.NumberFormat`'s, as Base UI's). */
export type CardFormat = {
  /** Its number's format (e.g. `{ style: 'percent' }`). */
  format?: Intl.NumberFormatOptions;
  /**
   * Its number's locale.
   * @default the document's language
   */
  locale?: Intl.LocalesArgument;
};

/** A card's corner button: a `Grid.CornerButton` (see `Card.CornerButton`). */
export type CardCornerButtonProps = Omit<
  GridCornerButtonProps,
  'whileEditing'
> & {
  /**
   * In edit mode: hidden then (`hide`), shown only then (`show`, e.g. a
   * button opening the card's settings), or either way (`stay`). Shown
   * while editing, it's over the card's veil, in the grid's controls'
   * color (see `Grid.CornerButton`).
   * @default 'hide'
   */
  whileEditing?: GridCornerButtonProps['whileEditing'];
};

/** A card's actions (see `CardRootProps.actionsRef`). */
export type CardActions = {
  /**
   * Lights it up as `active` does, for a moment, and fades it back: for
   * something that happened, for example a doorbell rung, told by the app's
   * server.
   */
  flash: () => void;
};

export type CardRootProps = useRender.ComponentProps<'div'> &
  GlassSurfaceProps & {
    /** Its actions (`flash`), for the app to call from anywhere. */
    actionsRef?: RefObject<CardActions | null>;
    /**
     * Whether what it switches is on (`true`, lit) or off (`false`, dark
     * glass, in both color schemes), so it can be told at a glance: e.g. a
     * group of lights, at least one of them on. Left out, it isn't
     * switchable (e.g. a sensor's): its glass by the color scheme (or its
     * `context`). A switch in it makes it switchable, by its state.
     * @default not switchable (or by its switch)
     */
    active?: boolean;
    /**
     * Whether it's a momentary button: a press flashes it (see `actionsRef`),
     * for a press with no state of its own, for example a chime or “all
     * lights off”. Needs an `onClick`.
     * @default false
     */
    momentary?: boolean;
  };

export type CardSymbolProps = useRender.ComponentProps<'span'> & {
  /**
   * Whether it shows what it stands for as on, in its tint and its
   * `Symbol`'s `emphasizedIcon` (e.g. filled): for a card that isn't lit
   * while on, for example a dimmer's above its minimum (its fill telling how
   * much). A lit card's symbol shows as on anyway; off, its `icon` (e.g.
   * outlined).
   * @default false
   */
  active?: boolean;
  /**
   * Its color while `active` (a CSS color).
   * @default the switch's on color (`--uikit-switch-on-color`)
   */
  tint?: string;
};

export type CardSwitchProps = Omit<
  SwitchRootProps,
  'children' | 'ref' | 'tint'
> & {
  /**
   * Its color while on (a CSS color): the card's tint, as its symbol's.
   * Over a slider's fill, and in a card never lit (`active` given false,
   * e.g. a dimmer's) at every size, a darker shade of it (it's the fill's
   * color too, see `Card.Slider`); off there, a darker shade of the fill's
   * gray.
   * @default the system green; over a slider's fill, the app's tint
   */
  tint?: string;
};

export type CardTitleProps = useRender.ComponentProps<'span'>;

export type CardValueProps = Omit<
  useRender.ComponentProps<'span'>,
  'children'
> &
  CardFormat & {
    /**
     * What it shows instead of a number (e.g. a state: “Locked”); with a
     * number, after it (e.g. a `Card.Trend`).
     */
    children?: ReactNode;
    /** A number, formatted (see `format`); else its children. */
    value?: number;
  };

/**
 * A card's subtitle (`Card.Subtitle`): more words under its title, where
 * there's room for them.
 */
export type CardSubtitleProps = useRender.ComponentProps<'span'>;

/** A value's trend (`Card.Trend`): an arrow, in a `Card.Value`. */
export type CardTrendProps = Omit<
  useRender.ComponentProps<'span'>,
  'children'
> & {
  /**
   * How steeply its value changes: -90 (falling) to 90 (rising) degrees, 0
   * steady. Its arrow points so; named rising, falling or steady.
   */
  angle: number;
};

/**
 * A slider filling its card (`Card.Slider`): Base UI's slider (its
 * `Slider.Root`'s props: `min`, `max`, `step`, `format`, `disabled`,
 * `name`…), one value.
 */
export type CardSliderProps = Omit<
  SliderRootProps,
  | 'children'
  | 'defaultValue'
  | 'onValueChange'
  | 'onValueCommitted'
  | 'orientation'
  | 'ref'
  | 'thumbAlignment'
  | 'value'
> & {
  /**
   * Its value's words, from its formatted value (see `format`) and its
   * value: e.g. its card's state with it, the app's.
   * @default its formatted value
   */
  children?: (formattedValue: string, value: number) => ReactNode;
  /** Its value at first (uncontrolled). */
  defaultValue?: number;
  /**
   * What assistive technology reads as its value (as Base UI's
   * `getAriaValueText`), from its formatted value and its value.
   * @default its formatted value
   */
  getAriaValueText?: (formattedValue: string, value: number) => string;
  /** Its label, and its accessible name (e.g. the card's title). */
  label: string;
  /**
   * A press on it (released before it moves): this, not a value (e.g. its
   * card's switch toggled); a drag sets its value. None: a press sets it.
   */
  onPress?: () => void;
  /** As its value changes, dragged (or by keyboard). */
  onValueChange?: (value: number) => void;
  /**
   * Its fill's color: opaque, any color (what's over it drawn again in it,
   * dark on a bright fill, light on a dim one).
   * @default the app's tint
   */
  tint?: string;
  /** Its value (controlled). */
  value?: number;
};

/**
 * A card's progress (`Card.Progress`): its value and range, as Base UI's
 * `Progress.Root`, for its parts (`Card.ProgressValue`,
 * `Card.ProgressBar`). Renders no element of its own.
 */
export type CardProgressProps = CardFormat & {
  /** Its parts (and anything else of the card's). */
  children?: ReactNode;
  /**
   * What assistive technology reads as its value (as Base UI's), from its
   * formatted value and its value.
   * @default its formatted value
   */
  getAriaValueText?: (formattedValue: string, value: number | null) => string;
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
  /** Its value (`min` to `max`); `null`, none under way (its bar empty). */
  value: number | null;
};

/**
 * A card's progress bar (`Card.ProgressBar`): a pill at the card's bottom,
 * Base UI's progress bar.
 */
export type CardProgressBarProps = useRender.ComponentProps<'div'> & {
  /**
   * What's on it (a `Card.ProgressLabel`, a `Card.ProgressDetail`), drawn
   * on the well and again on the fill.
   */
  children?: ReactNode;
  /**
   * Its fill's color.
   * @default the app's tint
   */
  tint?: string;
};

/** A progress bar's words at its start (`Card.ProgressLabel`). */
export type CardProgressLabelProps = useRender.ComponentProps<'span'>;

/** A progress bar's words at its end (`Card.ProgressDetail`). */
export type CardProgressDetailProps = useRender.ComponentProps<'span'>;

/** A card's progress in words (`Card.ProgressValue`). */
export type CardProgressValueProps = Omit<
  useRender.ComponentProps<'span'>,
  'children'
> & {
  /**
   * Its words, from its formatted value and its value (as Base UI's
   * `Progress.Value`); none, its formatted value.
   */
  children?: (formattedValue: string, value: number) => ReactNode;
};

/** A card's stages (`Card.StageList`): an ordered list. */
export type CardStageListProps = Omit<ComponentProps<'ol'>, 'children'> & {
  /** Its stages (`Card.Stage`s), in order. */
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

/** A stage (`Card.Stage`), in a `Card.StageList`. */
export type CardStageProps = Omit<
  ComponentProps<'li'>,
  'children' | 'value'
> & {
  /** Its words, under its dot. */
  children: ReactNode;
  /** What it is (its list's `value` names the current one). */
  value: string;
};

/** The light a card's channels make together (see `Card.Channels`). */
export type CardLight = {
  /**
   * Its brightness (0 to 1): its strongest amount channel's share; none of
   * those, 1.
   */
  brightness: number;
  /** Its color at full strength (a CSS color); giving none, none. */
  color: string | undefined;
};

/** A card's channels (`Card.Channels`): its sliders, stacked. */
export type CardChannelsProps = ComponentProps<'div'> & {
  /** Its channels (`Card.Channel`s), in order. */
  children: ReactNode;
  /** As the light its channels make changes (see `CardLight`). */
  onLightChange?: (light: CardLight) => void;
};

/**
 * A channel (`Card.Channel`): Base UI's slider in a well of its own (its
 * `Slider.Root`'s props), one value. An amount (`tint`: e.g. a light's red,
 * black to red), or a scale (`colors`: e.g. a color temperature).
 */
export type CardChannelProps = Omit<
  BaseSlider.Root.Props,
  | 'children'
  | 'defaultValue'
  | 'onValueChange'
  | 'onValueCommitted'
  | 'orientation'
  | 'ref'
  | 'thumbAlignment'
  | 'value'
> & {
  /**
   * Its value's words, from its formatted value and its value (e.g.
   * `3800 K`); none, its formatted value.
   */
  children?: (formattedValue: string, value: number) => ReactNode;
  /**
   * Its colors from its least value to its greatest (evenly spread; two or
   * more): a scale, shown whole on its well, its thumb the color at its
   * value (e.g. a color temperature's, warm to cold). Instead of `tint`.
   */
  colors?: readonly string[];
  /** Its value at first (uncontrolled). */
  defaultValue?: number;
  /**
   * What assistive technology reads as its value (as Base UI's), from its
   * formatted value and its value.
   * @default its formatted value
   */
  getAriaValueText?: (formattedValue: string, value: number) => string;
  /** Its name (e.g. `Red`): on its well, and its slider's name. */
  label: string;
  /** As its value changes. */
  onValueChange?: (value: number) => void;
  /**
   * An amount's color at its greatest value (e.g. a light's red): its fill,
   * its thumb that color mixed on black by its share (as light adds up).
   * @default the app's tint
   */
  tint?: string;
  /** Its value (controlled). */
  value?: number;
};

/** A choice's option (`Card.SegmentedItem`). */
export type CardSegmentedItemProps = Omit<
  BaseRadio.Root.Props,
  'children' | 'ref' | 'value'
> & {
  /**
   * Its words: its segment's (its name with its symbol only, see
   * `optionContent`), and a ready-made card's value while it's chosen.
   */
  children: ReactNode;
  /**
   * Whether it can't be chosen now (as Segmented's items): dimmed, not
   * pressed, dragged past, skipped by keys (see Base UI's Radio).
   */
  disabled?: boolean;
  /** Its symbol: in its segment (a ready-made card's while it's chosen). */
  icon?: SymbolIcon;
  /**
   * More words, under its words (in the card's value's color), where
   * there's room for them: in a tile taller than a row (not across one,
   * not with its symbol only, see `optionContent`); stacked, once its
   * segment's tall enough.
   */
  subtitle?: ReactNode;
  /** A ready-made card's symbol's tint while it's chosen. */
  tint?: string;
  /** What it stands for (unique in its choice). */
  value: string;
};

/** A choice of a few (`Card.Segmented`): Base UI's radio group. */
export type CardSegmentedProps = Omit<
  BaseRadioGroup.Props,
  'children' | 'defaultValue' | 'onValueChange' | 'ref' | 'value'
> & {
  /**
   * Its options (`Card.SegmentedItem`s), in order: segments in a well at
   * its card's bottom, side by side (across a row, a symbol beside its
   * words; taller, over them), or stacked (beside them; one wide, over
   * them), the chosen one's raised; dragged between (each chosen as it's
   * reached).
   */
  children: ReactNode;
  /** The option chosen at first (uncontrolled). @default its first's */
  defaultValue?: string;
  /** Chosen, as it's pressed (or by keys, see Base UI's RadioGroup). */
  onValueChange?: (value: string) => void;
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
   * as 1x1). None: by its tile's size (one wide and taller, stacked; else
   * side by side).
   */
  orientation?: 'horizontal' | 'vertical';
  /** The option chosen (controlled). */
  value?: string;
};

/**
 * A card's rows (`Card.Rows`): a list, as many rows as fit whole (its
 * `List.Root`'s props).
 */
export type CardRowsProps = Omit<ListRootProps, 'children'> & {
  /** Its rows (`Card.Row`s), in order. */
  children: ReactNode;
  /**
   * Its last row while rows are left out (their count given).
   * @default `${count} more`
   */
  getMoreLabel?: (count: number) => string;
  /**
   * Its last row while its tile's expanded (see `Grid.Item`'s `expanded`).
   * @default 'Less'
   */
  lessLabel?: string;
};

/**
 * A card's row (`Card.Row`): its symbol, its label, its value (its
 * `List.Item`'s props).
 */
export type CardRowProps = Omit<
  ListItemProps,
  'children' | 'onClick' | 'value'
> & {
  /** Its label (unique in its card). */
  children: ReactNode;
  /** Its symbol, before its label. */
  icon?: SymbolIcon;
  /**
   * Pressed (anywhere on it), e.g. going to a page of its own: a chevron
   * after its value (List's `DrillIn`), its label a button.
   */
  onClick?: () => void;
  /** Its value, at its end. */
  value?: ReactNode;
};

/**
 * A corner button expanding its card's tile and making it small again
 * (`Card.ExpandButton`), by its grid item's expansion.
 */
export type CardExpandButtonProps = Omit<
  CardCornerButtonProps,
  'corner' | 'icon' | 'mirrored' | 'visible'
>;

/**
 * A corner button opening its card's tile above the page
 * (`Card.OpenButton`), by its grid item's `open`.
 */
export type CardOpenButtonProps = Omit<
  CardCornerButtonProps,
  'corner' | 'icon' | 'visible'
>;

/**
 * A corner button closing its card's tile opened above the page
 * (`Card.CloseButton`): its top trailing corner.
 */
export type CardCloseButtonProps = Omit<
  CardCornerButtonProps,
  'corner' | 'icon' | 'visible'
>;

/** A card's orientation (see `useCardOrientation`). */
export type CardOrientation = 'horizontal' | 'vertical';

/** The sizes each kind of card supports (see `cardSizes`). */
export type CardSizes = Readonly<
  Record<
    | 'binaryControl'
    | 'binaryDisplay'
    | 'choiceControl'
    | 'numericalControl'
    | 'numericalDisplay'
    | 'progressDisplay'
    | 'stagesDisplay'
    | 'summaryDisplay',
    readonly GridSize[]
  >
>;
