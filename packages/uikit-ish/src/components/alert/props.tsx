import type { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';

export type AlertPopupProps = Omit<BaseAlertDialog.Popup.Props, 'ref'> & {
  /**
   * Where its portal renders it (Base UI's `AlertDialog.Portal`), e.g. a
   * frame of the app's, centered in it if it's a containing block.
   * @default document.body
   */
  container?: BaseAlertDialog.Portal.Props['container'];
};

/** A handle linking an alert to its triggers outside it. */
export type AlertHandle<Payload = unknown> = BaseAlertDialog.Handle<Payload>;

export type AlertActionsProps = ComponentProps<'div'> & {
  /**
   * Stacked (e.g. two long labels; UIKit stacks more than two buttons
   * itself, as this does).
   * @default with more than two buttons, otherwise side by side
   */
  stacked?: boolean;
};

export type AlertActionVariant = 'destructive' | 'primary' | 'secondary';

export type AlertActionProps = Omit<BaseAlertDialog.Close.Props, 'ref'> & {
  /**
   * Figma “Type”.
   * @default 'secondary'
   */
  variant?: AlertActionVariant;
};
