import '../glass/style.css';
import '../typography/style.css';
import './style.css';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Input as BaseInput } from '@base-ui/react/input';
import { ComponentProps, forwardRef, useState } from 'react';

import { cn, usePortalContainer } from '../utils/main.js';
import type {
  AlertActionProps,
  AlertActionsProps,
  AlertHandle,
  AlertPopupProps,
} from './props.js';

export type {
  AlertActionProps,
  AlertActionVariant,
  AlertActionsProps,
  AlertHandle,
  AlertPopupProps,
} from './props.js';

// Alerts (buttons side by side or stacked; also action sheets, see
// `ActionSheet`): a glass panel 300px wide, 14px in,
// its corners 34px, its parts 10px apart: its title (Headline) and
// description (Body), 8px in, 24px above what follows; text fields (Body,
// medium, 52px high, 16px in, between separators, on a gray fill with 26px
// corners, 19px above the buttons); capsule buttons 48px high (Body,
// medium): secondary and destructive on a gray fill (the label's color,
// red), primary in the tint (white); side by side 16px apart, or stacked 10px
// apart (more than two, or `stacked`). Base UI's `AlertDialog`: modal, its
// buttons closing it.
//
// Also:
// - The panel is the menus' glass (`glassMedium`, see `Menu`: not blended
//   with what's behind, which a popup, positioned by a transform and
//   animated, can't be); its fills unblended, as the system fills.
// - Behind it, the page dims (black, 20%; 40% in dark mode); it scales in from 110% as it fades in.

/**
 * The alert at the viewport's center (or its `container`'s, if that's a
 * containing block), the page dimmed behind it, in its portal.
 */
const Popup = forwardRef<HTMLDivElement, AlertPopupProps>(
  ({ className, container, ...props }, ref) => (
    <BaseAlertDialog.Portal
      className="uikit-alert-portal"
      container={usePortalContainer(container)}
    >
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
  ),
);

/** Its title and description. */
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

/** A text field (Base UI's `Input`), in `Alert.Fields`. */
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
 * A handle linking an alert to its triggers outside it, and opening or
 * closing it imperatively (Base UI's `AlertDialog.createHandle`): pass it to
 * the root's and the triggers' `handle` (in a component, see
 * `useCreateAlertHandle`).
 */
const createHandle = <Payload = unknown,>(): AlertHandle<Payload> =>
  BaseAlertDialog.createHandle<Payload>();

/** `Alert.createHandle`, in a component: made once, for its lifetime. */
export const useCreateAlertHandle = <
  Payload = unknown,
>(): AlertHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());
  return handle;
};

/**
 * An alert (Base UI's `AlertDialog`): a modal panel with a title and description, optionally
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
  createHandle,
};
