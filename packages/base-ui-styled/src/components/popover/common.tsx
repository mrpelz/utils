import { Popover as BasePopover } from '@base-ui/react/popover';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

export const popoverButtonStyles = css`
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

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &[data-disabled],
  &:disabled {
    border-color: var(--subtle);
    color: var(--subtle);
  }

  @media (hover: hover) {
    &:hover:not([data-disabled], :disabled) {
      background-color: var(--hover-wash);
    }
  }

  &:active:not([data-disabled], :disabled),
  &[data-popup-open]:not([data-disabled], :disabled) {
    background-color: var(--active-wash);
  }
`;

const Trigger = styled(BasePopover.Trigger, forwardRef)`
  ${popoverButtonStyles}
`;

const Popup = styled(BasePopover.Popup, forwardRef)`
  position: relative;
  display: flex;
  width: var(--popup-width, auto);
  max-width: 500px;
  height: var(--popup-height, auto);
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-3);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  gap: var(--space-1);
  outline: none;
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

const Arrow = styled(BasePopover.Arrow, forwardRef)`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;

  &[data-side='top'] {
    bottom: -6px;
    rotate: 180deg;
  }

  &[data-side='bottom'] {
    top: -6px;
    rotate: 0deg;
  }

  &[data-side='left'] {
    right: -9px;
    rotate: 90deg;
  }

  &[data-side='right'] {
    left: -9px;
    rotate: -90deg;
  }

  &::before {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: var(--border-width) solid var(--border);
    background-color: var(--surface);
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);
  }
`;

const Title = styled(BasePopover.Title, forwardRef)`
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Description = styled(BasePopover.Description, forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const Container = styled('div', forwardRef)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

export const CommonPopover = {
  ...BasePopover,
  Trigger,
  Popup,
  Arrow,
  Title,
  Description,
  Container,
};
