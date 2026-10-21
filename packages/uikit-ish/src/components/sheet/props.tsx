import type { Dialog as BaseDialog } from '@base-ui/react/dialog';

export type SheetDetent = 'large' | 'medium';

export type SheetPopupProps = Omit<BaseDialog.Popup.Props, 'ref'> & {
  /**
   * A sheet from the bottom (`detent`), or (not compact) a form sheet,
   * centered.
   * @default by the window's width (compact below 768px)
   */
  compact?: boolean;
  /**
   * Where its portal renders it (Base UI's `Dialog.Portal`), e.g. a
   * frame of the app's, fixed to it if it's a containing block (and
   * `overflow: clip`, not `hidden`: focus moving into the sheet, still
   * below it, would scroll it).
   * @default document.body
   */
  container?: BaseDialog.Portal.Props['container'];
  /**
   * Its height on an iPhone (compact width): the whole screen, or its
   * content's (a floating glass panel).
   * @default 'large'
   */
  detent?: SheetDetent;
};
