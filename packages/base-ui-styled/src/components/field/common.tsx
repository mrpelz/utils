import { Field as BaseField } from '@base-ui/react/field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseField.Root, forwardRef)`
  display: flex;
  width: 100%;
  max-width: var(--control-width-sm);
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

const Label = styled(BaseField.Label, forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Control = styled(BaseField.Control, forwardRef)`
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

const Error = styled(BaseField.Error, forwardRef)`
  color: var(--color-red);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const Description = styled(BaseField.Description, forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

export const CommonField = {
  ...BaseField,
  Root,
  Label,
  Control,
  Error,
  Description,
};
