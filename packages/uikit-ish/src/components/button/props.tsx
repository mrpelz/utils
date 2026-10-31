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
    /**
     * The cursor (where the pointer hovers).
     * @default 'pointer' (disabled, also without a click handler: 'not-allowed')
     */
    cursor?: Properties['cursor'];
    /** Tints the button red. */
    destructive?: boolean;
    /**
     * Grows to fill the available width (a block, or a flex item sharing a
     * row's free space), its content centered.
     */
    fill?: boolean;
    /**
     * `circle` is square with a round shape, for symbol-only buttons;
     * `roundedRectangle` has 6px corners (large: 12px; e.g. a date
     * picker's collapsed buttons, large borderless buttons).
     */
    shape?: 'capsule' | 'circle' | 'roundedRectangle';
    /** Its size (not applicable to glass variants, which have one size). */
    size?: 'large' | 'medium' | 'small';
    /**
     * Its text and symbols' color, over its variant's (e.g. for a light
     * `tint` behind them; unblended on glass).
     */
    textColor?: string;
    /**
     * The button's color (labels, fills, tinted glass; e.g. a notes
     * app's yellow). `destructive` wins.
     * @default the primary color
     */
    tint?: string;
    /** Its style: classic ones, and glass (tinted or not). */
    variant?:
      | 'bordered'
      | 'bordered-prominent'
      | 'bordered-secondary'
      | 'borderless'
      | 'glass'
      | 'glass-prominent';
  };
