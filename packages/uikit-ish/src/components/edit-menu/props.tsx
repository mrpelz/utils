import type { Menu as BaseMenu } from '@base-ui/react/menu';
import type { Properties } from 'csstype';

import type { MenuRootProps } from '../menu/main.js';
import type { Size } from '../menu/props.js';
import type { LogicalSide } from '../utils/main.js';

/** A menu root's props; its size, its menus' (see `Root`). */
export type EditMenuRootProps<Payload = unknown> = Omit<
  MenuRootProps<Payload>,
  'size'
> & {
  /**
   * The size class of its menus (e.g. the “more” button's): `regular`
   * (their submenus beside their trigger) or `compact` (their submenus over
   * it). The capsule is the
   * same either way.
   * @default 'regular'
   */
  size?: Size;
};

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
  /** Red label (destructive). */
  destructive?: boolean;
};
