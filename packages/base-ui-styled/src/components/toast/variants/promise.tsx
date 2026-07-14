import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonToast } from '../common.js';

const Root = styled(CommonToast.Root, forwardRef)`
  &[data-type='success'] ${CommonToast.Text} {
    color: var(--color-green);
  }

  &[data-type='error'] ${CommonToast.Text} {
    color: var(--color-red);
  }
`;

export const promise = {
  ...CommonToast,
  Root,
};
