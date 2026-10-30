import type { Menu as BaseMenu } from '@base-ui/react/menu';
import type { Properties } from 'csstype';
import type { ComponentProps, RefObject } from 'react';

import type { LogicalSide, SecondaryClickProps } from '../utils/main.js';

export type Size = 'compact' | 'regular';

export type MenuHandle<Payload = unknown> = BaseMenu.Handle<Payload>;

export type MenuContextValue = {
  /** The root menu's actions (closing it). */
  actionsRef?: RefObject<BaseMenu.Root.Actions | null>;
  /** The menu's orientation (edit menus: horizontal). */
  orientation: 'horizontal' | 'vertical';
  size: Size;
  /** Inside a submenu: its parent's orientation. */
  submenu?: 'horizontal' | 'vertical';
};

export type MenuRootProps<Payload = unknown> = BaseMenu.Root.Props<Payload> & {
  /** A size class: `compact` (a phone, default) or `regular` (a tablet). */
  size?: Size;
};

/** A dragging finger, and its last movement (never none). */
export type Finger = {
  movementX: number;
  movementY: number;
  x: number;
  y: number;
};

export type TriggerProps = Omit<BaseMenu.Trigger.Props, 'ref'> &
  SecondaryClickProps & {
    /**
     * What opens the menu: a click (default), or a secondary click (a right
     * click, or a touch held, then dragged on to the items; see
     * `useSecondaryClick`), a click then being the trigger's own (e.g. a
     * back button's, its menu the history, or a context menu).
     */
    openOn?: 'click' | 'secondaryClick';
  };

export type MenuPositionerProps = Omit<
  BaseMenu.Positioner.Props,
  'ref' | 'side'
> & {
  /**
   * Its side of its anchor (logical).
   * @default 'block-end' (a submenu: 'inline-end')
   */
  side?: LogicalSide;
};

export type ItemProps = {
  /**
   * The cursor (where the pointer hovers).
   * @default 'pointer' with a click handler (toggles, links, submenu
   * triggers: always), otherwise or while disabled 'not-allowed'
   */
  cursor?: Properties['cursor'];
  /** Red content (destructive). */
  destructive?: boolean;
};

export type SpanProps = ComponentProps<'span'>;
