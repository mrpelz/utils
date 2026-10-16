import type { ComponentProps, ReactElement } from 'react';

import type { ButtonRootProps } from '../button/main.js';

export type Rgba = { a: number; b: number; g: number; r: number };

export type PickerState = {
  color: Rgba;
  setColor: (color: Rgba) => void;
};

export type ColorPickerMode = 'grid' | 'sliders' | 'spectrum';

export type ColorPickerRootProps = Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  /** The initial color (uncontrolled; a hex string). */
  defaultValue?: string;
  /** Called with the picked color (a hex string). */
  onValueChange?: (value: string) => void;
  /** The color (controlled; a hex string). */
  value?: string;
};

export type ColorPickerPanelProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** The initial view (uncontrolled). */
  defaultMode?: ColorPickerMode;
  /** The initial saved colors (uncontrolled; default: Figma's). */
  defaultSavedColors?: string[];
  /** The view (controlled). */
  mode?: ColorPickerMode;
  /** Called with the view chosen. */
  onModeChange?: (mode: ColorPickerMode) => void;
  /** Called with the saved colors, as one is added or deleted. */
  onSavedColorsChange?: (colors: string[]) => void;
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
   * Figma “Size” (Small: 28px, Large: 36px).
   * @default 'small'
   */
  size?: 'large' | 'small';
};
