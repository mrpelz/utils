import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonScrollArea } from '../common.js';

const Root = styled(BaseScrollArea.Root, forwardRef)`
  width: 24rem;
  max-width: calc(100vw - 8rem);
  height: 8.5rem;
  box-sizing: border-box;
  background-color: var(--surface);
`;

export const main = {
  ...CommonScrollArea,
  Root,
};
