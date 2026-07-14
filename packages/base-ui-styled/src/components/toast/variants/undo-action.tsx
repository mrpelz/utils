import { Toast as BaseToast } from '@base-ui/react/toast';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonToast, toastButtonStyles } from '../common.js';

const Text = styled('div', forwardRef)`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: start;
  gap: var(--space-3);
`;

const Message = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const UndoButton = styled(BaseToast.Action, forwardRef)`
  ${toastButtonStyles}

  display: inline-flex;
  height: var(--control-height);
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

export const undoAction = {
  ...CommonToast,
  Text,
  Message,
  UndoButton,
};
