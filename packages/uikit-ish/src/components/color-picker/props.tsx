import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactElement, ReactNode } from 'react';

import type { ButtonRootProps } from '../button/main.js';
import type { ListItemProps } from '../list/main.js';
import type {
  SegmentedItemProps,
  SegmentedRootProps,
} from '../segmented/main.js';

export type Rgba = { a: number; b: number; g: number; r: number };

/**
 * Why the color changed, and the event: its grid, spectrum or sliders, the
 * opacity (slider or percentage), a saved color pressed, the eyedropper,
 * the system's color picker, its code typed, a named color picked, or its
 * transparency removed or flattened (see `Swatches` `flattenOnPress`).
 */
export type ColorPickerChangeEventDetails = {
  event: Event;
  reason:
    | 'code'
    | 'eyedropper'
    | 'flatten'
    | 'grid'
    | 'named'
    | 'opacity'
    | 'saved'
    | 'sliders'
    | 'spectrum'
    | 'system-colors';
};

/** Why the saved colors changed (one added, or deleted), and the event. */
export type ColorPickerSavedColorsChangeEventDetails = {
  event: Event;
  reason: 'add' | 'delete';
};

export type PickerState = {
  color: Rgba;
  /** An `Opacity` rendered: the color's alpha its own (else opaque). */
  hasOpacity: boolean;
  /** An `Opacity` rendered: the color keeping its alpha while it is. */
  registerOpacity: () => () => void;
  setColor: (color: Rgba, eventDetails: ColorPickerChangeEventDetails) => void;
};

/** A panel's modes (see `Panel`). */
export type PanelState = {
  /** Its views all as high as the grid (one of them a grid, a spectrum). */
  isGridHeight: boolean;
  mode: string | null;
  /** A view of the grid's height, while mounted (its cleanup). */
  registerGridHeight: () => () => void;
  registerMode: (value: string) => void;
  setMode: (
    mode: string,
    eventDetails: BaseRadioGroup.ChangeEventDetails,
  ) => void;
};

/**
 * The sliders’ built-in words: their titles, and their names for assistive technology (see
 * `colorPickerLabels` for their defaults).
 */
export type ColorPickerSlidersLabels = {
  /**
   * The black channel’s title and slider.
   * @default `colorPickerLabels.blackLabel`
   */
  blackLabel?: string;
  /**
   * The blue channel’s title and slider.
   * @default `colorPickerLabels.blueLabel`
   */
  blueLabel?: string;
  /**
   * A channel’s field, by its name (e.g. “Red value”).
   * @default `colorPickerLabels.channelValueLabel`
   */
  channelValueLabel?: (channel: string) => string;
  /**
   * The cyan channel’s title and slider.
   * @default `colorPickerLabels.cyanLabel`
   */
  cyanLabel?: string;
  /**
   * The green channel’s title and slider.
   * @default `colorPickerLabels.greenLabel`
   */
  greenLabel?: string;
  /**
   * The hue channel’s title and slider.
   * @default `colorPickerLabels.hueLabel`
   */
  hueLabel?: string;
  /**
   * The lightness channel’s title and slider.
   * @default `colorPickerLabels.lightnessLabel`
   */
  lightnessLabel?: string;
  /**
   * The magenta channel’s title and slider.
   * @default `colorPickerLabels.magentaLabel`
   */
  magentaLabel?: string;
  /**
   * The red channel’s title and slider.
   * @default `colorPickerLabels.redLabel`
   */
  redLabel?: string;
  /**
   * The saturation channel’s title and slider.
   * @default `colorPickerLabels.saturationLabel`
   */
  saturationLabel?: string;
  /**
   * The yellow channel’s title and slider.
   * @default `colorPickerLabels.yellowLabel`
   */
  yellowLabel?: string;
};

/**
 * The opacity’s built-in words (see
 * `colorPickerLabels` for their defaults).
 */
export type ColorPickerOpacityLabels = {
  /**
   * The opacity’s title and slider.
   * @default `colorPickerLabels.opacityLabel`
   */
  opacityLabel?: string;
  /**
   * The opacity’s field.
   * @default `colorPickerLabels.opacityValueLabel`
   */
  opacityValueLabel?: string;
};

/**
 * The swatches’ built-in words (see
 * `colorPickerLabels` for their defaults).
 */
export type ColorPickerSwatchesLabels = {
  /**
   * The add button.
   * @default `colorPickerLabels.addColorLabel`
   */
  addColorLabel?: string;
  /**
   * A saved color’s menu item, deleting it.
   * @default `colorPickerLabels.deleteColorLabel`
   */
  deleteColorLabel?: string;
  /**
   * The color’s button, translucent (see `flattenOnPress`).
   * @default `colorPickerLabels.flattenColorLabel`
   */
  flattenColorLabel?: string;
  /**
   * Its action sheet’s title.
   * @default `colorPickerLabels.flattenColorTitleLabel`
   */
  flattenColorTitleLabel?: string;
  /**
   * Its action sheet’s action, flattening the color on black.
   * @default `colorPickerLabels.flattenOnBlackLabel`
   */
  flattenOnBlackLabel?: string;
  /**
   * Its action sheet’s action, flattening the color on white.
   * @default `colorPickerLabels.flattenOnWhiteLabel`
   */
  flattenOnWhiteLabel?: string;
  /**
   * Its action sheet’s action, making the color opaque.
   * @default `colorPickerLabels.removeTransparencyLabel`
   */
  removeTransparencyLabel?: string;
  /**
   * The saved colors’ group.
   * @default `colorPickerLabels.savedColorsLabel`
   */
  savedColorsLabel?: string;
};

/**
 * The code’s built-in words (see
 * `colorPickerLabels` for their defaults).
 */
export type ColorPickerCodeLabels = {
  /**
   * The code’s title and field (and the copy menu’s hex code).
   * @default `colorPickerLabels.hexLabel`
   */
  hexLabel?: string;
};

/**
 * The copy menu’s built-in words (its hex code’s `hexLabel` shared with the code’s) (see
 * `colorPickerLabels` for their defaults).
 */
export type ColorPickerCodeCopyLabels = {
  /**
   * The copy menu’s hex code with alpha.
   * @default `colorPickerLabels.hexWithAlphaLabel`
   */
  hexWithAlphaLabel?: string;
  /**
   * The copy menu’s perceptual codes (a submenu).
   * @default `colorPickerLabels.perceptualLabel`
   */
  perceptualLabel?: string;
  /**
   * The copy menu’s sRGB codes (a submenu).
   * @default `colorPickerLabels.srgbLabel`
   */
  srgbLabel?: string;
  /**
   * The copy menu’s wide-gamut codes (a submenu).
   * @default `colorPickerLabels.wideGamutLabel`
   */
  wideGamutLabel?: string;
};

/**
 * The named colors’ built-in words (see
 * `colorPickerLabels` for their defaults).
 */
export type ColorPickerNamedLabels = {
  /**
   * The index of first letters.
   * @default `colorPickerLabels.indexLabel`
   */
  indexLabel?: string;
};

/**
 * The names of the parts that are a single element, for assistive technology (their `aria-label`s win) (see
 * `colorPickerLabels` for their defaults).
 */
export type ColorPickerOwnLabels = {
  /**
   * The copy button (`CodeCopy`; its `aria-label` wins).
   * @default `colorPickerLabels.copyColorCodeLabel`
   */
  copyColorCodeLabel?: string;
  /**
   * The eyedropper’s button (`Eyedropper`; its `aria-label` wins).
   * @default `colorPickerLabels.eyedropperLabel`
   */
  eyedropperLabel?: string;
  /**
   * The grid (`Grid`; its `aria-label` wins).
   * @default `colorPickerLabels.gridLabel`
   */
  gridLabel?: string;
  /**
   * The modes’ control (`Modes`; its `aria-label` wins).
   * @default `colorPickerLabels.modesLabel`
   */
  modesLabel?: string;
  /**
   * The spectrum (`Spectrum`; its `aria-label` wins).
   * @default `colorPickerLabels.spectrumLabel`
   */
  spectrumLabel?: string;
  /**
   * The system colors’ button (`SystemColors`; its `aria-label` wins).
   * @default `colorPickerLabels.systemColorsLabel`
   */
  systemColorsLabel?: string;
};

/** Every built-in word of a picker (see `colorPickerLabels`). */
export type ColorPickerLabels = ColorPickerCodeCopyLabels &
  ColorPickerCodeLabels &
  ColorPickerNamedLabels &
  ColorPickerOpacityLabels &
  ColorPickerOwnLabels &
  ColorPickerSlidersLabels &
  ColorPickerSwatchesLabels;

export type ColorPickerRootProps = ColorPickerLabels &
  Omit<useRender.ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
    /**
     * The initial mode (uncontrolled): its `Mode`'s and `View`'s `value`.
     * @default the first `Mode`
     */
    defaultMode?: string;
    /** The initial color (uncontrolled; a hex string). */
    defaultValue?: string;
    /** The mode (controlled): its `Mode`'s and `View`'s `value`. */
    mode?: string;
    /** Called with the mode chosen (its segmented control's details). */
    onModeChange?: (
      mode: string,
      eventDetails: BaseRadioGroup.ChangeEventDetails,
    ) => void;
    /** Called with the picked color (a hex string), and why. */
    onValueChange?: (
      value: string,
      eventDetails: ColorPickerChangeEventDetails,
    ) => void;
    /** The color (controlled; a hex string). */
    value?: string;
  };

export type ColorPickerPanelProps = ComponentProps<'div'>;

export type ColorPickerModesProps = Omit<
  SegmentedRootProps,
  'defaultValue' | 'onValueChange' | 'ref' | 'value'
>;

export type ColorPickerModeProps = Omit<SegmentedItemProps, 'ref' | 'value'> & {
  /** Its mode: its `View`'s `value`. */
  value: string;
};

export type ColorPickerViewProps = ComponentProps<'div'> & {
  /** Its mode: its `Mode`'s `value`. */
  value: string;
};

/**
 * A color model, its channels as sliders: red, green and blue (0–255);
 * hue (0–360°), saturation and lightness (0–100%); cyan, magenta, yellow
 * and black (0–100%, naive: from sRGB, no ink's profile).
 */
export type ColorPickerSlidersModel = 'cmyk' | 'hsl' | 'rgb';

/**
 * Red, green and blue's range: in bytes (0–255), or in percent (0–100%,
 * coarser: a channel set, the others kept exact).
 */
export type ColorPickerSlidersRange = 'byte' | 'percentage';

export type ColorPickerSlidersProps = ColorPickerSlidersLabels &
  ComponentProps<'div'> & {
    /**
     * Its color model: its channels' sliders.
     * @default 'rgb'
     */
    model?: ColorPickerSlidersModel;
    /**
     * Red, green and blue's range (`model` `rgb`; the others' are fixed).
     * @default 'byte'
     */
    range?: ColorPickerSlidersRange;
  };

export type ColorPickerSwatchesProps = ColorPickerSwatchesLabels &
  ComponentProps<'div'> & {
    /**
     * The initial saved colors (uncontrolled).
     * @default ten colors (see `defaultSavedColors`)
     */
    defaultSavedColors?: string[];
    /**
     * Whether pressing the color, while it's translucent, offers to make it
     * opaque (an action sheet, “Flatten Color?”): its transparency removed,
     * or the color flattened on white or on black.
     * @default true
     */
    flattenOnPress?: boolean;
    /** Called with the saved colors, as one is added or deleted, and why. */
    onSavedColorsChange?: (
      colors: string[],
      eventDetails: ColorPickerSavedColorsChangeEventDetails,
    ) => void;
    /** The saved colors (controlled). */
    savedColors?: string[];
  };

export type EyeDropperApi = { open: () => Promise<{ sRGBHex: string }> };

export type ColorPickerEyedropperProps = Omit<
  ButtonRootProps,
  'onClick' | 'ref' | 'render'
> & {
  /**
   * What it renders (e.g. a `Toolbar.Button` in a toolbar, sized as its
   * other buttons).
   * @default a `Button.Root`
   */
  render?: ReactElement<Record<string, unknown>>;
};

export type ColorPickerSystemColorsProps = Omit<
  ButtonRootProps,
  'onClick' | 'ref' | 'render'
> & {
  /**
   * What it renders (e.g. a `Toolbar.Button` in a toolbar, sized as its
   * other buttons).
   * @default a `Button.Root`
   */
  render?: ReactElement<Record<string, unknown>>;
};

export type ColorPickerCodeProps = ColorPickerCodeLabels &
  ComponentProps<'div'>;

export type ColorPickerOpacityProps = ColorPickerOpacityLabels &
  ComponentProps<'div'>;

export type ColorPickerNamedProps = ColorPickerNamedLabels &
  ComponentProps<'div'>;

export type ColorPickerNamedColorProps = Omit<ListItemProps, 'color'> & {
  /** Its label (e.g. its name). @default its `color` */
  children?: ReactNode;
  /** Its color: any CSS color (e.g. a name, a hex code, `oklch()`). */
  color: string;
};

/** A row's index entry (see `Named`): its first letter, its element. */
export type NamedIndexEntry = { element: HTMLElement; label: string };

export type ColorPickerCodeCopyProps = ColorPickerCodeCopyLabels &
  Pick<ColorPickerCodeLabels, 'hexLabel'> &
  Omit<ButtonRootProps, 'onClick' | 'ref' | 'render'> & {
    /** Called with a code copied (to the clipboard), and the event. */
    onCodeCopy?: (code: string, event: Event) => void;
    /**
     * What it renders (e.g. a `Button.Root`, sized as the code's field).
     * @default a `Button.Root`
     */
    render?: ReactElement<Record<string, unknown>>;
  };

export type ColorWellProps = ComponentProps<'button'> & {
  /** Its color (a hex string; without one: the hues only). */
  color?: string;
  /**
   * Its size (small: 28px, large: 36px).
   * @default 'small'
   */
  size?: 'large' | 'small';
};
