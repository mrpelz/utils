import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

const Field = styled('div', forwardRef)`
  display: flex;
  width: 100%;
  max-width: 20rem;
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

const Label = styled('label', forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

export const otpFieldRootStyles = css`
  display: flex;
  width: 100%;
  gap: var(--space-2);
`;

const Root = styled<typeof BaseOTPField.Root, BaseOTPField.Root.Props>(
  BaseOTPField.Root,
  forwardRef,
)`
  ${otpFieldRootStyles}
`;

export const otpFieldInputStyles = css`
  width: var(--control-height-lg);
  height: var(--control-height-lg);
  box-sizing: border-box;
  padding: 0;
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-md);
  font-weight: var(--font-regular);
  line-height: var(--leading-md);
  text-align: center;

  &:focus {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Input = styled(BaseOTPField.Input, forwardRef)`
  ${otpFieldInputStyles}
`;

const Description = styled('p', forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

export const CommonOTPField = {
  ...BaseOTPField,
  Field,
  Label,
  Root,
  Input,
  Description,
};
