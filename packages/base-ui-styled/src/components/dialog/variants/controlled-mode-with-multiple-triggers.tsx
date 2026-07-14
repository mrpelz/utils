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
  transform: translate(-50%, -50%);
  transition:
    transform var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.98);
  }
`;

const Container = styled('div', forwardRef)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

export const controlledModeWithMultipleTriggers = {
  ...CommonDialog,
  Popup,
  Container,
};
