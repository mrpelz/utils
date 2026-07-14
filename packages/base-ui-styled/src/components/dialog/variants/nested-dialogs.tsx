import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDialog } from '../common.js';

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

const GhostButton = styled(BaseDialog.Trigger, forwardRef)`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: none;
  margin: 0;
  background-color: transparent;
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-sm);
  user-select: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--active-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const EndActions = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: var(--space-3);
`;

export const nestedDialogs = {
  ...CommonDialog,
  Popup,
  GhostButton,
  Actions,
  EndActions,
};
