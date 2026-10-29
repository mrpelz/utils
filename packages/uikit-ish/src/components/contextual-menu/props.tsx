import type { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';

import type {
  MenuHandle,
  MenuRootProps,
  MenuTriggerProps,
} from '../menu/main.js';

export type ContextualMenuContextValue = {
  /** The backdrop, shown (its cutout: the lifted trigger, see `Trigger`). */
  backdrop?: HTMLElement;
  isOpen: boolean;
  /** A `Preview` is given (else the trigger is lifted, see `Trigger`). */
  isPreview: boolean;
  setBackdrop: (backdrop: HTMLElement | undefined) => void;
  setIsPreview: (isPreview: boolean) => void;
  setSlot: (slot: HTMLElement | undefined) => void;
  /** The preview's slot in the positioned stack, while shown. */
  slot?: HTMLElement;
  /** The trigger's wrapper: the menu's anchor (see `Positioner`). */
  triggerRef: { current: HTMLElement | null };
};

export type ContextualMenuRootProps<Payload = unknown> = MenuRootProps<Payload>;

/**
 * Opens or closes the menu imperatively (its triggers inside its root: a
 * detached trigger couldn't lift).
 */
export type ContextualMenuHandle<Payload = unknown> = MenuHandle<Payload>;

export type ContextualMenuTriggerProps = MenuTriggerProps;

export type ContextualMenuPreviewProps = ComponentProps<'div'>;

export type ContextualMenuPositionerProps = Omit<
  BaseMenu.Positioner.Props,
  'anchor' | 'collisionAvoidance' | 'ref' | 'side' | 'sideOffset'
>;

export type ContextualMenuPortalProps = Omit<BaseMenu.Portal.Props, 'ref'>;

export type ContextualMenuPopupProps = Omit<BaseMenu.Popup.Props, 'ref'>;
