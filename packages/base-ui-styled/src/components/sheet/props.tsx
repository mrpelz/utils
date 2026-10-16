import type { Dialog as BaseDialog } from '@base-ui/react/dialog';

export type SheetDetent = 'large' | 'medium';

export type SheetPopupProps = Omit<BaseDialog.Popup.Props, 'ref'> & {
  /**
   * Its height on an iPhone (compact width): the whole screen, or its
   * content's (a floating glass panel).
   * @default 'large'
   */
  detent?: SheetDetent;
};
