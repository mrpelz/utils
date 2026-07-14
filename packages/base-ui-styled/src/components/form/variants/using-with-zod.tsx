import { Button as BaseButton } from '@base-ui/react/button';
import { Field as BaseField } from '@base-ui/react/field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const FieldRoot = styled(BaseField.Root, forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

export const FieldLabel = styled(BaseField.Label, forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

export const Input = styled(BaseField.Control, forwardRef)`
  width: 100%;
  height: var(--control-height);
  box-sizing: border-box;
  padding: 0 var(--space-2);
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

export const FieldError = styled(BaseField.Error, forwardRef)`
  color: var(--color-red);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

export const Button = styled(BaseButton, forwardRef)`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
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

export { CommonForm as usingWithZod } from '../common.js';
