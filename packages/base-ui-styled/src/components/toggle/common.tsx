import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const CommonToggle = styled(BaseToggle, forwardRef)`
  display: flex;
  width: 2rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  color: var(--on-surface);
  user-select: none;

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

  &[data-pressed] {
    color: var(--on-surface);
  }
`;
