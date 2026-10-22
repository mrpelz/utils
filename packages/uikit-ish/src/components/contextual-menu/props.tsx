import type { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';

import type {
  MenuHandle,
  MenuRootProps,
  MenuTriggerProps,
} from '../menu/main.js';

export type Box = { height: number; left: number; top: number; width: number };

export type Align = 'center' | 'end' | 'start';

/** A portal's container (Base UI's `container` prop). */
export type PortalContainer = NonNullable<BaseMenu.Portal.Props['container']>;

export type ContextualMenuContextValue = {
  align: Align;
  /** The lifted box (the trigger's, or the preview's) at its lifted place. */
  anchor?: {
    contextElement?: Element;
    getBoundingClientRect: () => DOMRect;
  };
  /** The lifted box (the trigger's, or the preview's) before lifting. */
  box?: Box;
  lift: number;
  open: boolean;
  origin?: Box;
  /** Too tall for the viewport: scrolled together (see `Root`). */
  overflowing: boolean;
  preview: boolean;
  scrollerRef: { current: HTMLDivElement | null };
  setAlign: (align: Align) => void;
  /** Its portal's container: the screen it lifts within (see `Portal`). */
  setContainer: (container: PortalContainer | undefined) => void;
  setPopupHeight: (height: number) => void;
  setPreviewSize: (size: { height: number; width: number } | undefined) => void;
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
  'anchor' | 'ref' | 'side'
>;

export type ContextualMenuPortalProps = Omit<BaseMenu.Portal.Props, 'ref'>;

export type ContextualMenuPopupProps = Omit<BaseMenu.Popup.Props, 'ref'>;
