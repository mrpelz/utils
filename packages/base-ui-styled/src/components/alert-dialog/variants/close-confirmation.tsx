import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { alertDialogButtonStyles, CommonAlertDialog } from '../common.js';

const Popup = styled(BaseAlertDialog.Popup, forwardRef)`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  width: var(--popup-width-sm);
  max-width: calc(100vw - var(--space-12));
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-4);
  border: var(--border-width) solid var(--border);
  margin-top: -2rem;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  gap: var(--space-4);
  scale: calc(1 - 0.1 * var(--nested-dialogs));
  transition:
    translate var(--duration-fast) ease-out,
    scale var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;
  translate: -50% calc(-50% + var(--space-5) * var(--nested-dialogs));

  &::after {
    position: absolute;
    background-color: rgb(0 0 0 / 5%);
    content: '';
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-fast) ease-out;
  }

  &[data-nested-dialog-open]::after {
    opacity: 1;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    scale: 0.96;
    translate: -50%
      calc(-50% + var(--space-1) + var(--space-5) * var(--nested-dialogs));
  }
`;

const DialogBackdrop = styled(BaseDialog.Backdrop, forwardRef)`
  position: fixed;
  min-height: 100dvh;
  background-color: black;
  inset: 0;
  opacity: 0.2;
  transition: opacity var(--duration-medium);

  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const DialogPopup = styled(BaseDialog.Popup, forwardRef)`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  width: var(--popup-width-sm);
  max-width: calc(100vw - var(--space-12));
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-4);
  border: var(--border-width) solid var(--border);
  margin-top: -2rem;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  gap: var(--space-4);
  scale: calc(1 - 0.1 * var(--nested-dialogs));
  transition:
    translate var(--duration-fast) ease-out,
    scale var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;
  translate: -50% calc(-50% + var(--space-5) * var(--nested-dialogs));

  &::after {
    position: absolute;
    background-color: rgb(0 0 0 / 5%);
    content: '';
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-fast) ease-out;
  }

  &[data-nested-dialog-open]::after {
    opacity: 1;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    scale: 0.96;
    translate: -50%
      calc(-50% + var(--space-1) + var(--space-5) * var(--nested-dialogs));
  }
`;

const DialogTrigger = styled(BaseDialog.Trigger, forwardRef)`
  ${alertDialogButtonStyles}
`;

const DialogClose = styled(BaseDialog.Close, forwardRef)`
  ${alertDialogButtonStyles}
`;

const PopupBody = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const DialogTitle = styled(BaseDialog.Title, forwardRef)`
  margin: 0;
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
`;

const TextareaContainer = styled('form', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const Textarea = styled('textarea', forwardRef)`
  width: 100%;
  min-height: 8rem;
  box-sizing: border-box;
  padding: var(--space-2);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &::placeholder {
    color: var(--subtle);
  }

  &:focus {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

export const closeConfirmation = {
  ...CommonAlertDialog,
  Popup,
  DialogBackdrop,
  DialogPopup,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  PopupBody,
  TextareaContainer,
  Textarea,
};
