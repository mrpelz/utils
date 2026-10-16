import type { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';

import type { MenuRootProps } from '../menu/main.js';

export type Box = { height: number; left: number; top: number; width: number };

export type Align = 'center' | 'end' | 'start';

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
  setPopupHeight: (height: number) => void;
  setPreviewSize: (size: { height: number; width: number } | undefined) => void;
  triggerRef: { current: HTMLElement | null };
};

export type ContextualMenuRootProps = MenuRootProps;

export type ContextualMenuTriggerProps = Omit<BaseMenu.Trigger.Props, 'ref'>;

export type ContextualMenuPreviewProps = ComponentProps<'div'>;

export type ContextualMenuPositionerProps = Omit<
  BaseMenu.Positioner.Props,
  'anchor' | 'ref' | 'side'
>;

export type ContextualMenuPopupProps = Omit<BaseMenu.Popup.Props, 'ref'>;
