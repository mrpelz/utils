import type { Menu as BaseMenu } from '@base-ui/react/menu';
import type { Properties } from 'csstype';

import type { LogicalSide } from '../utils/main.js';

export type EditMenuPositionerProps = Omit<
  BaseMenu.Positioner.Props,
  'ref' | 'side'
> & {
  /**
   * Its side of its anchor (logical).
   * @default 'block-start'
   */
  side?: LogicalSide;
};

export type ItemProps = {
  /**
   * The cursor (where the pointer hovers).
   * @default 'pointer' with a click handler, otherwise or while disabled
   * 'not-allowed'
   */
  cursor?: Properties['cursor'];
  /** Red label (Figma State=Destructive). */
  destructive?: boolean;
};
