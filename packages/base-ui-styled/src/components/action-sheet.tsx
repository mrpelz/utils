import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { styled } from 'goober';
import { forwardRef } from 'react';

import {
  alertAction,
  type AlertActionVariant,
  alertBackdrop,
  alertCentered,
  alertDescription,
  AlertHeader,
  alertPanel,
  alertTitle,
} from './alert.js';

// Source: Apple iOS 26 Figma (“Action Sheets”): an alert's panel (see
// `Alert`) of a title and description and its actions, stacked (Secondary
// and Destructive types: on a gray fill, the label's color, red). As an
// alert: modal, at the viewport's center, the page dimmed behind it (Figma
// has none); unlike one, dismissed by a press outside it (Base UI's
// `Dialog`).

const part = 'data-alert-part';

const Backdrop = styled(BaseDialog.Backdrop, forwardRef)`
  ${alertBackdrop}
`;

const StyledPopup = styled(BaseDialog.Popup, forwardRef)`
  ${alertPanel}
  ${alertCentered}
`;

/** The sheet at the viewport's center, the page dimmed behind it. */
const Popup = forwardRef<HTMLDivElement, Omit<BaseDialog.Popup.Props, 'ref'>>(
  (props, ref) => (
    <BaseDialog.Portal>
      <Backdrop />
      <StyledPopup
        ref={ref}
        {...props}
      />
    </BaseDialog.Portal>
  ),
);

const Title = styled(BaseDialog.Title, forwardRef)`
  ${alertTitle}
`;

const Description = styled(BaseDialog.Description, forwardRef)`
  ${alertDescription}
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledAction = styled(BaseDialog.Close, forwardRef)`
  ${alertAction}
`;

export type ActionSheetActionProps = Omit<BaseDialog.Close.Props, 'ref'> & {
  /**
   * Figma “Type”.
   * @default 'secondary'
   */
  variant?: AlertActionVariant;
};

/** An action, closing the sheet. */
const Action = forwardRef<HTMLButtonElement, ActionSheetActionProps>(
  ({ variant = 'secondary', ...props }, ref) => (
    <StyledAction
      ref={ref}
      data-variant={variant}
      {...{ [part]: 'action' }}
      {...props}
    />
  ),
);

/**
 * An action sheet (UIKit `UIAlertController`, style `actionSheet`; Base
 * UI's `Dialog`): choices for an action, as a modal panel.
 */
export const ActionSheet = {
  ...BaseDialog,
  Popup,
  Header: AlertHeader,
  Title,
  Description,
  Actions,
  Action,
};
