import { keyframes, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonOTPField } from '../common.js';

const shake = keyframes`
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
`;

const invalidStyles = css`
  border-color: var(--color-red);
  animation: ${shake} 180ms ease-in-out;
  outline: var(--focus-ring-width) solid var(--color-red);
  outline-offset: var(--focus-ring-offset);

  &:focus {
    outline: var(--focus-ring-width) solid var(--color-red);
    outline-offset: var(--focus-ring-offset);
  }
`;

const InputInvalidA = styled(CommonOTPField.Input, forwardRef)`
  ${invalidStyles}
`;

const InputInvalidB = styled(CommonOTPField.Input, forwardRef)`
  ${invalidStyles}
`;

const ScreenReaderOnly = styled('span', forwardRef)`
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  margin: -1px;
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const customNormalization = {
  ...CommonOTPField,
  InputInvalidA,
  InputInvalidB,
  ScreenReaderOnly,
};
