import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonOTPField, otpFieldRootStyles } from '../common.js';

const Root = styled<typeof BaseOTPField.Root, BaseOTPField.Root.Props>(
  BaseOTPField.Root,
  forwardRef,
)`
  ${otpFieldRootStyles}

  align-items: center;
`;

const Group = styled('div', forwardRef)`
  display: flex;
  gap: var(--space-2);
`;

const Separator = styled(BaseOTPField.Separator, forwardRef)`
  width: 1rem;
  height: var(--border-width);
  background-color: currentcolor;
  color: var(--on-surface);
`;

export const groupedLayouts = {
  ...CommonOTPField,
  Root,
  Group,
  Separator,
};
