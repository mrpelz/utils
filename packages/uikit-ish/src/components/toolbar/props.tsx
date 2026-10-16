import type { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { useRender } from '@base-ui/react/use-render';

import type { ButtonRootProps } from '../button/main.js';
import type { GlassContextValue } from '../glass/main.js';

export type Placement = 'block-end' | 'block-start';

export type ToolbarRootProps = Omit<BaseToolbar.Root.Props, 'ref'> & {
  /**
   * Brightness of the content behind the glass (`adaptive`: by what's
   * behind the bar).
   * @default 'bright', or 'dim' in dark mode
   */
  context?: GlassContextValue;
  /**
   * Where the bar is: at the bottom, or at the top (a navigation bar).
   * @default 'block-end'
   */
  placement?: Placement;
};

export type ToolbarSideProps = useRender.ComponentProps<'div'>;

export type ToolbarGroupProps = Omit<BaseToolbar.Group.Props, 'ref'> & {
  /** A tinted capsule (Figma “Text - Primary”, “Symbol Primary”). */
  prominent?: boolean;
  /**
   * Its content's color (e.g. for a light `tint`; unblended).
   * @default the glass' (tinted: white)
   */
  textColor?: string;
  /**
   * The tinted capsule's color (as a glass `Button`'s; given, the capsule
   * is tinted).
   * @default the app's tint
   */
  tint?: string;
};

export type ToolbarButtonProps = Omit<BaseToolbar.Button.Props, 'ref'> &
  Pick<
    ButtonRootProps,
    | 'context'
    | 'cursor'
    | 'destructive'
    | 'fill'
    | 'onSecondaryClick'
    | 'shape'
    | 'size'
    | 'tint'
    | 'variant'
  > & {
    /**
     * Of its own (not in a `Group`): tinted glass (Figma “Text - Primary”,
     * “Symbol Primary”; `variant="glass-prominent"`).
     */
    prominent?: boolean;
  };

export type ToolbarTitleProps = useRender.ComponentProps<'div'> & {
  /** Aligned to the bar's start (Figma Style=Title 2 Line Left). */
  alignStart?: boolean;
};
