import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Label = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-sm);
`;

const Root = styled(BaseSwitch.Root, forwardRef)`
  display: flex;
  width: var(--space-9);
  height: var(--space-5);
  box-sizing: border-box;
  flex-shrink: 0;
  padding: var(--space-0-5);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  transition: background-color var(--duration-medium) ease;

  &[data-checked] {
    background-color: var(--ink);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 2px;
  }
`;

const Thumb = styled(BaseSwitch.Thumb, forwardRef)`
  width: 0.875rem;
  height: 0.875rem;
  background-color: var(--ink);
  transition:
    translate var(--duration-medium) ease,
    background-color var(--duration-medium) ease;

  &[data-checked] {
    background-color: var(--on-ink);
    translate: 1rem 0;
  }
`;

export const CommonSwitch = {
  ...BaseSwitch,
  Label,
  Root,
  Thumb,
};
