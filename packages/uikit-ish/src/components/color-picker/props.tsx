import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps, ReactElement } from 'react';

import type { ButtonRootProps } from '../button/main.js';

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
  setColor: (color: Rgba, eventDetails: ColorPickerChangeEventDetails) => void;
};

export type ColorPickerMode = 'grid' | 'sliders' | 'spectrum';

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

export type ColorPickerPanelProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** The initial view (uncontrolled). */
  defaultMode?: ColorPickerMode;
  /**
   * The initial saved colors (uncontrolled).
   * @default ten colors (see `defaultSavedColors`)
   */
  defaultSavedColors?: string[];
  /** The view (controlled). */
  mode?: ColorPickerMode;
  /** Called with the view chosen (its segmented control's details). */
  onModeChange?: (
    mode: ColorPickerMode,
    eventDetails: BaseRadioGroup.ChangeEventDetails,
  ) => void;
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
