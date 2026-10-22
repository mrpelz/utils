import type { Popover as BasePopover } from '@base-ui/react/popover';

export type ActionSheetPopupProps = Omit<BasePopover.Popup.Props, 'ref'> & {
  /**
   * Where its portal renders it (Base UI's `Popover.Portal`), e.g. a frame
   * of the app's: its dimmed backdrop filling it if it's a containing
   * block; without a trigger, the sheet at its bottom.
   * @default document.body
   */
  container?: BasePopover.Portal.Props['container'];
};

/** A handle linking an action sheet to its triggers outside it. */
export type ActionSheetHandle<Payload = unknown> = BasePopover.Handle<Payload>;

/** Figma “Type” (no primary: an action sheet has no preferred action). */
export type ActionSheetActionVariant = 'destructive' | 'secondary';

export type ActionSheetActionProps = Omit<BasePopover.Close.Props, 'ref'> & {
  /**
   * Figma “Type”: secondary (the label's color), destructive (red).
   * @default 'secondary'
   */
  variant?: ActionSheetActionVariant;
};
