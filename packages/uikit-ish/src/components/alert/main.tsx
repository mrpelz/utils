import '../glass/style.css';
import '../typography/style.css';
import './style.css';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Input as BaseInput } from '@base-ui/react/input';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '../utils/main.js';
import type { AlertActionProps, AlertActionsProps } from './props.js';

export type {
  AlertActionProps,
  AlertActionVariant,
  AlertActionsProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Alerts”, Type=Side-by-Side and Stacked; also
// “Action Sheets”, see `ActionSheet`): a glass panel 300px wide, 14px in,
// its corners 34px, its parts 10px apart: its title (Headline) and
// description (Body), 8px in, 24px above what follows; text fields (Body,
// medium, 52px high, 16px in, between separators, on a gray fill with 26px
// corners, 19px above the buttons); capsule buttons 48px high (Body,
// medium): Secondary and Destructive on a gray fill (the label's color, red),
// Primary in the tint (white); side by side 16px apart, or stacked 10px
// apart (more than two, or `stacked`). Base UI's `AlertDialog`: modal, its
// buttons closing it.
//
// Deviations:
// - The panel is the menus' glass (`glassMedium`, see `Menu`; Figma: the
//   glass fill, blended with what's behind, which a popup, positioned by a
//   transform and animated, can't be); its fills unblended (Figma:
//   plus-darker, plus-lighter in dark mode), as the system fills.
// - Behind it, the page dims (black, 20%; 40% in dark mode; Figma has
//   none); it scales in from 110% as it fades in.

/** The alert at the viewport's center, the page dimmed behind it. */
const Popup = forwardRef<
  HTMLDivElement,
  Omit<BaseAlertDialog.Popup.Props, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Portal>
    <BaseAlertDialog.Backdrop
      className="uikit-alert-backdrop"
      data-alert-part="backdrop"
    />
    <BaseAlertDialog.Popup
      ref={ref}
      {...props}
      data-alert-part="popup"
      className={cn(
        'uikit-alert-popup uikit-alert-panel uikit-glass-medium uikit-alert-centered',
        className,
      )}
    />
  </BaseAlertDialog.Portal>
));

/** Its title and description (Figma “Title and Description”). */
export const AlertHeader = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    // Its title and description, 24px above what follows.
    <div
      ref={ref}
      data-alert-part="header"
      {...props}
      className={cn('uikit-alert-header', className)}
    />
  ),
);

const Title = forwardRef<
  HTMLHeadingElement,
  Omit<ComponentProps<typeof BaseAlertDialog.Title>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Title
    ref={ref}
    className={cn('uikit-alert-title', className)}
    data-alert-part="title"
    {...props}
  />
));

const Description = forwardRef<
  HTMLParagraphElement,
  Omit<ComponentProps<typeof BaseAlertDialog.Description>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Description
    ref={ref}
    className={cn('uikit-alert-description', className)}
    data-alert-part="description"
    {...props}
  />
));

// Its text fields: on a gray fill, between separators, 19px above the
// buttons.
const Fields = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-alert-fields', className)}
      data-alert-part="fields"
      {...props}
    />
  ),
);

/** A text field (Figma “Text Field”; Base UI's `Input`), in `Alert.Fields`. */
const Field = forwardRef<HTMLElement, Omit<BaseInput.Props, 'ref'>>(
  ({ className, ...props }, ref) => (
    <BaseInput
      ref={ref}
      data-alert-part="field"
      {...props}
      className={cn('uikit-alert-field', className)}
    />
  ),
);

export const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(
  ({ className, stacked, ...props }, ref) => (
    // Its buttons: side by side, or stacked (more than two, or `stacked`).
    <div
      ref={ref}
      data-alert-part="actions"
      data-stacked={stacked ? '' : undefined}
      {...props}
      className={cn('uikit-alert-actions', className)}
    />
  ),
);

/** A button, closing the alert. */
const Action = forwardRef<HTMLButtonElement, AlertActionProps>(
  ({ className, variant = 'secondary', ...props }, ref) => (
    <BaseAlertDialog.Close
      ref={ref}
      data-alert-part="action"
      data-variant={variant}
      {...props}
      className={cn('uikit-alert-action', className)}
    />
  ),
);

/**
 * An alert (UIKit `UIAlertController`, style `alert`; Base UI's
 * `AlertDialog`): a modal panel with a title and description, optionally
 * text fields, and its buttons.
 */
export const Alert = {
  ...BaseAlertDialog,
  Popup,
  Header: AlertHeader,
  Title,
  Description,
  Fields,
  Field,
  Actions: AlertActions,
  Action,
};
