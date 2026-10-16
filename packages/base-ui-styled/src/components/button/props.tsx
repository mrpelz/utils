import type { ButtonProps as BaseButtonProps } from '@base-ui/react/button';
import type { Properties } from 'csstype';

import type { GlassContextValue } from '../glass/main.js';
import type { SecondaryClickProps } from '../utils/main.js';

export type ButtonRootProps = BaseButtonProps &
  SecondaryClickProps & {
    /**
     * Brightness behind glass variants (`adaptive`: by what's behind it).
     * @default follows the color scheme
     */
    context?: GlassContextValue;
    cursor?: Properties['cursor'];
    /** Figma “Destructive”: tints the button red. */
    destructive?: boolean;
    /**
     * Grows to fill the available width (a block, or a flex item sharing a
     * row's free space), its content centered (Figma: hugging its content).
     */
    fill?: boolean;
    /**
     * `circle` is square with a round shape, for symbol-only buttons;
     * `roundedRectangle` has 6px corners (large: 12px; Figma “Date and time -
     * Collapsed”, large borderless buttons).
     */
    shape?: 'capsule' | 'circle' | 'roundedRectangle';
    /** Figma “Size” (not applicable to glass variants, which have one size). */
    size?: 'large' | 'medium' | 'small';
    /**
     * Its text and symbols' color, over its variant's (e.g. for a light
     * `tint` behind them; unblended on glass).
     */
    textColor?: string;
    /**
     * The button's color (labels, fills, tinted glass; UIKit `tintColor`,
     * e.g. Notes' yellow; default: the primary color). `destructive` wins.
     */
    tint?: string;
    /** Figma “Style”, and “Button - Liquid Glass” with “Tinted”. */
    variant?:
      | 'bordered'
      | 'bordered-prominent'
      | 'bordered-secondary'
      | 'borderless'
      | 'glass'
      | 'glass-prominent';
  };
