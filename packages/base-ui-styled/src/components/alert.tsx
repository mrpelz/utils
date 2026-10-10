import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Input as BaseInput } from '@base-ui/react/input';
import { styled } from 'goober';
import { ComponentProps, forwardRef } from 'react';

import { glassMedium } from './glass.js';
import { textStyle } from './typography.js';
import { colorScheme, css, fontWeight } from './utils.js';

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

const part = 'data-alert-part';

// The panel (also an action sheet's).
export const alertPanel = css`
  ${glassMedium()}

  display: flex;
  width: 300px;
  max-width: calc(100vw - 32px);
  box-sizing: border-box;
  flex-direction: column;
  padding: 14px;
  border-radius: 34px;
  color: var(--color-ios-label);
  gap: 10px;
  outline: none;
`;

// The page dimmed behind it (also behind an action sheet).
export const alertBackdrop = css`
  ${colorScheme(
    '--styled-alert-dim: rgb(0 0 0 / 20%);',
    '--styled-alert-dim: rgb(0 0 0 / 40%);',
  )}

  position: fixed;
  background-color: var(--styled-alert-dim);
  inset: 0;
  transition: opacity 300ms;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const StyledBackdrop = styled(BaseAlertDialog.Backdrop, forwardRef)`
  ${alertBackdrop}
`;

// At the viewport's center, scaling in from 110% as it fades in (also an
// action sheet).
export const alertCentered = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transition-duration: 300ms;
  transition-property: opacity, scale;
  transition-timing-function: cubic-bezier(0.2, 0.9, 0.3, 1);
  translate: -50% -50%;

  &[data-starting-style] {
    opacity: 0;
    scale: 1.1;
  }

  &[data-ending-style] {
    opacity: 0;
    transition-duration: 200ms;
  }
`;

const StyledPopup = styled(BaseAlertDialog.Popup, forwardRef)`
  ${alertPanel}
  ${alertCentered}
`;

/** The alert at the viewport's center, the page dimmed behind it. */
const Popup = forwardRef<
  HTMLDivElement,
  Omit<BaseAlertDialog.Popup.Props, 'ref'>
>((props, ref) => (
  <BaseAlertDialog.Portal>
    <StyledBackdrop />
    <StyledPopup
      ref={ref}
      {...props}
    />
  </BaseAlertDialog.Portal>
));

// Its title and description, 24px above what follows.
const StyledHeader = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  padding: 8px 8px 24px;
  gap: 10px;
`;

/** Its title and description (Figma “Title and Description”). */
export const AlertHeader = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  (props, ref) => (
    <StyledHeader
      ref={ref}
      {...{ [part]: 'header' }}
      {...props}
    />
  ),
);

export const alertTitle = css`
  margin: 0;
  ${textStyle('headline')}
`;

export const alertDescription = css`
  margin: 0;
  ${textStyle('body')}
`;

const Title = styled(BaseAlertDialog.Title, forwardRef)`
  ${alertTitle}
`;

const Description = styled(BaseAlertDialog.Description, forwardRef)`
  ${alertDescription}
`;

// Its text fields: on a gray fill, between separators, 19px above the
// buttons.
const Fields = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  border-radius: 26px;
  background-color: var(--color-ios-secondary-system-fill);
  margin-block-end: 9px;
`;

// eslint-disable-next-line prettier/prettier
const StyledField = styled<typeof BaseInput, BaseInput.Props>(BaseInput, forwardRef)`
  min-width: 0;
  height: 52px;
  box-sizing: border-box;
  padding: 0 16px;
  border: 0;
  margin: 0;
  background: linear-gradient(
      var(--styled-glass-separator),
      var(--styled-glass-separator)
    )
    center bottom / calc(100% - 32px) 1px no-repeat;
  color: inherit;
  font-family: inherit;
  ${textStyle('body')}
  ${fontWeight(510)}
  line-height: 20px;
  outline: none;

  &:last-child {
    background: none;
  }

  &::placeholder {
    color: var(--color-ios-tertiary-label);
  }
`;

/** A text field (Figma “Text Field”; Base UI's `Input`), in `Alert.Fields`. */
const Field = forwardRef<HTMLInputElement, Omit<BaseInput.Props, 'ref'>>(
  (props, ref) => (
    <StyledField
      ref={ref}
      {...{ [part]: 'field' }}
      {...props}
    />
  ),
);

// Its buttons: side by side, or stacked (more than two, or `stacked`).
const StyledActions = styled('div', forwardRef)`
  display: flex;
  gap: 16px;

  /* (Separately: goober mangles selector lists with parentheses.) */
  &[data-stacked] {
    flex-direction: column;
    gap: 10px;
  }

  /* (Three or more; goober mangles nth-child inside has.) */
  &:has(> [${part}] + [${part}] + [${part}]) {
    flex-direction: column;
    gap: 10px;
  }
`;

export type AlertActionsProps = ComponentProps<'div'> & {
  /** Stacked (default: with more than two buttons, otherwise side by side). */
  stacked?: boolean;
};

export const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(
  ({ stacked, ...props }, ref) => (
    <StyledActions
      ref={ref}
      data-stacked={stacked ? '' : undefined}
      {...{ [part]: 'actions' }}
      {...props}
    />
  ),
);

export type AlertActionVariant = 'destructive' | 'primary' | 'secondary';

// A capsule button (Figma “Type”): on a gray fill (secondary: the label's
// color, destructive: red), or in the tint (primary: white).
export const alertAction = css`
  display: flex;
  min-width: 0;
  min-height: 48px;
  box-sizing: border-box;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  padding: 13px 16px;
  border: 0;
  border-radius: 100px;
  margin: 0;
  background-color: var(--color-ios-secondary-system-fill);
  color: var(--color-ios-label);
  cursor: pointer;
  font-family: inherit;
  ${textStyle('body')}
  ${fontWeight(510)}
  outline-offset: 2px;
  text-align: center;
  transition: filter 150ms;

  &[data-variant='destructive'] {
    color: var(--color-ios-system-red);
  }

  &[data-variant='primary'] {
    background-color: var(--color-ios-primary);
    color: #fff;
  }

  &:active {
    filter: brightness(0.85);
  }

  &:disabled {
    color: var(--color-ios-tertiary-label);
    cursor: default;
    filter: none;
  }
`;

const StyledAction = styled(BaseAlertDialog.Close, forwardRef)`
  ${alertAction}
`;

export type AlertActionProps = Omit<BaseAlertDialog.Close.Props, 'ref'> & {
  /**
   * Figma “Type”.
   * @default 'secondary'
   */
  variant?: AlertActionVariant;
};

/** A button, closing the alert. */
const Action = forwardRef<HTMLButtonElement, AlertActionProps>(
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
