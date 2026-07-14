import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonOTPField } from '../common.js';

const Code = styled('span', forwardRef)`
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo,
    monospace;
`;

export const alphanumericVerificationCodes = {
  ...CommonOTPField,
  Code,
};
