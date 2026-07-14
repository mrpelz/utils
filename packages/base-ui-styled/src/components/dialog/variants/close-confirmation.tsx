import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDialog, dialogButtonStyles } from '../common.js';

const Popup = styled(BaseDialog.Popup, forwardRef)`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  width: var(--popup-width-sm);
  max-width: calc(100vw - 3rem);
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-4);
  border: var(--border-width) solid var(--border);
  margin-top: -2rem;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  gap: var(--space-1);
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

const PopupBody = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
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

const AlertDialogPopup = styled(BaseAlertDialog.Popup, forwardRef)`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  width: var(--popup-width-sm);
  max-width: calc(100vw - 3rem);
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

const AlertDialogIntro = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const AlertDialogTitle = styled(BaseAlertDialog.Title, forwardRef)`
  margin: 0;
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
`;

const AlertDialogDescription = styled(BaseAlertDialog.Description, forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const AlertDialogClose = styled(BaseAlertDialog.Close, forwardRef)`
  ${dialogButtonStyles}
`;

export const closeConfirmation = {
  ...CommonDialog,
  Popup,
  PopupBody,
  TextareaContainer,
  Textarea,
  AlertDialogRoot: BaseAlertDialog.Root,
  AlertDialogPortal: BaseAlertDialog.Portal,
  AlertDialogPopup,
  AlertDialogIntro,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
};
