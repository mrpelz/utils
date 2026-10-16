import type { ComponentProps } from 'react';

export type BadgeProps = ComponentProps<'span'> & {
  /**
   * On its element's top end corner (in a `Symbol`: on the symbol; its
   * element positioned, e.g. an `Avatar`), or inline.
   * @default 'corner'
   */
  placement?: 'corner' | 'inline';
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
