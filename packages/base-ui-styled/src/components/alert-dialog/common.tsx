import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

export const alertDialogButtonStyles = css`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-none);
  user-select: none;
  white-space: nowrap;

  &[data-color='red'] {
    color: var(--color-red);
  }

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Trigger = styled(BaseAlertDialog.Trigger, forwardRef)`
  ${alertDialogButtonStyles}
`;

const Close = styled(BaseAlertDialog.Close, forwardRef)`
  ${alertDialogButtonStyles}
`;

const Backdrop = styled(BaseAlertDialog.Backdrop, forwardRef)`
  --backdrop-opacity: 0.2;

  position: fixed;
  min-height: 100dvh;
  background-color: black;
  inset: 0;
  opacity: var(--backdrop-opacity);
  transition: opacity var(--duration-medium);

  /* iOS 26+: cover the entire visual viewport. */
  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  @media (prefers-color-scheme: dark) {
    --backdrop-opacity: 0.5;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const Title = styled(BaseAlertDialog.Title, forwardRef)`
  margin: 0;
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
`;

const Description = styled(BaseAlertDialog.Description, forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const Intro = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  justify-content: end;
  gap: var(--space-3);
`;

export const CommonAlertDialog = {
  ...BaseAlertDialog,
  Trigger,
  Close,
  Backdrop,
  Title,
  Description,
  Intro,
  Actions,
};
