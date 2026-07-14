import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonOTPField, otpFieldInputStyles } from '../common.js';

const Input = styled(BaseOTPField.Input, forwardRef)`
  ${otpFieldInputStyles}

  &::placeholder {
    color: var(--muted);
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

export const placeholderHints = {
  ...CommonOTPField,
  Input,
};
