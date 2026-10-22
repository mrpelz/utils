import type { ComponentProps } from 'react';

export type BadgePlacement = 'corner' | 'inline' | 'symbol';

export type BadgeProps = ComponentProps<'span'> & {
  /**
   * On its element's top end corner (its element positioned, e.g. an
   * `Avatar`), inline, or on a symbol (a child of a `Symbol`, smaller).
   * @default 'corner'
   */
  placement?: BadgePlacement;
  /**
   * Its text color (e.g. for a light `tint`).
   * @default white
   */
  textColor?: string;
  /**
   * Its color.
   * @default system red
   */
  tint?: string;
};
