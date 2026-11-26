import type { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { useRender } from '@base-ui/react/use-render';

import type { ButtonRootProps } from '../button/main.js';
import type { GlassContextValue } from '../glass/main.js';

export type Placement = 'block-end' | 'block-start';

export type ToolbarRootProps = Omit<BaseToolbar.Root.Props, 'ref'> & {
  /**
   * How bright the content behind the glass is (`adaptive`: by what's
   * behind the bar, see `useBackdropTone`).
   * @default the color scheme's
   */
  context?: GlassContextValue;
  /**
   * Its direction (Base UI's, also for its arrow keys): a row, or a column
   * (e.g. in a `Viewport.Anchor` at a side), its capsules a bottom bar's;
   * not for a title.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Where the bar is: at the bottom, or at the top (a navigation bar).
   * Vertical, at the bottom's size.
   * @default 'block-end'
   */
  placement?: Placement;
};

export type ToolbarSideProps = useRender.ComponentProps<'div'>;

export type ToolbarStackProps = useRender.ComponentProps<'div'> & {
  /**
   * Its capsules' direction.
   * @default across its bar's: a column in a row, a row in a column
   */
  orientation?: 'horizontal' | 'vertical';
};

export type ToolbarGroupProps = Omit<BaseToolbar.Group.Props, 'ref'> & {
  /**
   * The space between its buttons (a length; a number: px), not at its
   * ends (`--uikit-toolbar-group-gap`).
   * @default 12
   */
  gap?: number | string;
  /** A tinted capsule. */
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
     * Of its own (not in a `Group`): tinted glass
     * (`variant="glass-prominent"`).
     */
    prominent?: boolean;
  };

export type ToolbarTitleProps = useRender.ComponentProps<'div'> & {
  /** Aligned to the bar's start. */
  alignStart?: boolean;
};
