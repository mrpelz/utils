import { keyframes } from 'goober';

import { css } from '../../../style.js';
import { CommonToast } from '../common.js';

const pulse = keyframes`
  0%,
  100% {
    scale: 1;
  }

  50% {
    scale: 1.04;
  }
`;

export const pulseEven = css`
  animation: ${pulse} 0.28s ease;
`;

export const pulseOdd = css`
  animation: ${pulse} 0.28s ease;
`;

export const deduplicatedToast = {
  ...CommonToast,
  pulseEven,
  pulseOdd,
};
