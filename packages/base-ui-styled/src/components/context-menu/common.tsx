import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Trigger = styled(BaseContextMenu.Trigger, forwardRef)`
  display: flex;
  width: 15rem;
  height: 12rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-weight: var(--font-regular);
  outline: 0;
  user-select: none;
`;

const Positioner = styled(BaseContextMenu.Positioner, forwardRef)`
  outline: 0;
`;

const Popup = styled(BaseContextMenu.Popup, forwardRef)`
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  padding-block: var(--space-1);
  transform-origin: var(--transform-origin);
  transition:
    transform var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.98);
  }
`;

const Separator = styled(BaseContextMenu.Separator, forwardRef)`
  height: 1px;
  margin: var(--space-1);
  background-color: var(--border);
`;

export const CommonContextMenu = {
  ...BaseContextMenu,
  Trigger,
  Positioner,
  Popup,
  Separator,
};
