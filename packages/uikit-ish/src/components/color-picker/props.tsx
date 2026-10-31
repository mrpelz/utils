import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps, ReactElement } from 'react';

import type { ButtonRootProps } from '../button/main.js';
import type {
  SegmentedItemProps,
  SegmentedRootProps,
} from '../segmented/main.js';

export type Rgba = { a: number; b: number; g: number; r: number };

/**
 * Why the color changed, and the event: its grid, spectrum or sliders, the
 * opacity (slider or percentage), a saved color pressed, or the eyedropper.
 */
export type ColorPickerChangeEventDetails = {
  event: Event;
  reason: 'eyedropper' | 'grid' | 'opacity' | 'saved' | 'sliders' | 'spectrum';
};

/** Why the saved colors changed (one added, or deleted), and the event. */
export type ColorPickerSavedColorsChangeEventDetails = {
  event: Event;
  reason: 'add' | 'delete';
};

export type PickerState = {
  color: Rgba;
  /** An `Opacity` rendered: the color keeping its alpha while it is. */
  registerOpacity: () => () => void;
  setColor: (color: Rgba, eventDetails: ColorPickerChangeEventDetails) => void;
};

/** A panel's modes (see `Panel`). */
export type PanelState = {
  mode: string | null;
  registerMode: (value: string) => void;
  setMode: (
    mode: string,
    eventDetails: BaseRadioGroup.ChangeEventDetails,
  ) => void;
};

export type ColorPickerRootProps = Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  /** The initial color (uncontrolled; a hex string). */
  defaultValue?: string;
  /** Called with the picked color (a hex string), and why. */
  onValueChange?: (
    value: string,
    eventDetails: ColorPickerChangeEventDetails,
  ) => void;
  /** The color (controlled; a hex string). */
  value?: string;
};

export type ColorPickerPanelProps = ComponentProps<'div'> & {
  /**
   * The initial mode (uncontrolled): its `Mode`'s and `View`'s `value`.
   * @default the first `Mode`
   */
  defaultMode?: string;
  /** The mode (controlled): its `Mode`'s and `View`'s `value`. */
  mode?: string;
  /** Called with the mode chosen (its segmented control's details). */
  onModeChange?: (
    mode: string,
    eventDetails: BaseRadioGroup.ChangeEventDetails,
  ) => void;
};

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

export type ColorPickerSlidersProps = ComponentProps<'div'> & {
  /**
   * Its color model: its channels' sliders.
   * @default 'rgb'
   */
  model?: ColorPickerSlidersModel;
};

export type ColorPickerSwatchesProps = ComponentProps<'div'> & {
  /**
   * The initial saved colors (uncontrolled).
   * @default ten colors (see `defaultSavedColors`)
   */
  defaultSavedColors?: string[];
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

export type ColorWellProps = ComponentProps<'button'> & {
  /** Its color (a hex string; without one: the hues only). */
  color?: string;
  /**
   * Its size (small: 28px, large: 36px).
   * @default 'small'
   */
  size?: 'large' | 'small';
};
