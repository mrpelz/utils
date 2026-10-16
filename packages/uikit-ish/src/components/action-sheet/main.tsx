import '../glass/style.css';
import '../alert/style.css';
import './style.css';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { ComponentProps, forwardRef } from 'react';

import { AlertHeader } from '../alert/main.js';
import { cn } from '../utils/main.js';
import type { ActionSheetActionProps } from './props.js';

export type { ActionSheetActionProps } from './props.js';

// Source: Apple iOS 26 Figma (“Action Sheets”): an alert's panel (see
// `Alert`) of a title and description and its actions, stacked (Secondary
// and Destructive types: on a gray fill, the label's color, red). As an
// alert: modal, at the viewport's center, the page dimmed behind it (Figma
// has none); unlike one, dismissed by a press outside it (Base UI's
// `Dialog`).

/** The sheet at the viewport's center, the page dimmed behind it. */
const Popup = forwardRef<HTMLDivElement, Omit<BaseDialog.Popup.Props, 'ref'>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className="uikit-action-sheet-backdrop uikit-alert-backdrop"
        data-action-sheet-part="backdrop"
      />
      <BaseDialog.Popup
        ref={ref}
        {...props}
        data-action-sheet-part="popup"
        className={cn(
          'uikit-action-sheet-popup uikit-alert-panel uikit-glass-medium uikit-alert-centered',
          className,
        )}
      />
    </BaseDialog.Portal>
  ),
);

const Title = forwardRef<
  HTMLHeadingElement,
  Omit<ComponentProps<typeof BaseDialog.Title>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn('uikit-action-sheet-title uikit-alert-title', className)}
    data-action-sheet-part="title"
    {...props}
  />
));

const Description = forwardRef<
  HTMLParagraphElement,
  Omit<ComponentProps<typeof BaseDialog.Description>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    data-action-sheet-part="description"
    className={cn(
      'uikit-action-sheet-description uikit-alert-description',
      className,
    )}
    {...props}
  />
));

const Actions = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-action-sheet-actions', className)}
      data-action-sheet-part="actions"
      {...props}
    />
  ),
);

/** An action, closing the sheet. */
const Action = forwardRef<HTMLButtonElement, ActionSheetActionProps>(
  ({ className, variant = 'secondary', ...props }, ref) => (
    <BaseDialog.Close
      ref={ref}
      data-alert-part="action"
      data-variant={variant}
      {...props}
      className={cn('uikit-action-sheet-action uikit-alert-action', className)}
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
