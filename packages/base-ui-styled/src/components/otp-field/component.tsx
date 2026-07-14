import { CommonOTPField } from './common.js';
import { alphanumericVerificationCodes } from './variants/alphanumeric-verification-codes.js';
import { customNormalization } from './variants/custom-normalization.js';
import { groupedLayouts } from './variants/grouped-layouts.js';
import { main } from './variants/main.js';
import { maskedEntry } from './variants/masked-entry.js';
import { placeholderHints } from './variants/placeholder-hints.js';

export const variants = {
  main,
  alphanumericVerificationCodes,
  groupedLayouts,
  placeholderHints,
  customNormalization,
  maskedEntry,
};

export const OTPField = {
  ...CommonOTPField,
  variants,
};

export { CommonOTPField } from './common.js';
