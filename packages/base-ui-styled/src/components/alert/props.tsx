import type { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';

export type AlertActionsProps = ComponentProps<'div'> & {
  /** Stacked (default: with more than two buttons, otherwise side by side). */
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
