import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonMenu } from '../common.js';

const GroupLabel = styled(BaseMenu.GroupLabel, forwardRef)`
  padding-right: var(--space-8);
  padding-left: 2.125rem;
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  padding-block: var(--space-2);
  user-select: none;
`;

export const groupLabels = {
  ...CommonMenu,
  GroupLabel,
};
