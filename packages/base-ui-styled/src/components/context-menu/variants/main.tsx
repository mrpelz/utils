import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonContextMenu } from '../common.js';

const Item = styled(BaseContextMenu.Item, forwardRef)`
  display: flex;
  padding-right: var(--space-8);
  padding-left: var(--space-4);
  cursor: default;
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  outline: 0;
  padding-block: var(--space-2);
  user-select: none;

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: var(--on-ink);
  }

  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    background-color: var(--ink);
    content: '';
    inset-block: 0;
    inset-inline: var(--space-1);
  }

  &[data-disabled] {
    color: var(--subtle);
  }
`;

export const main = {
  ...CommonContextMenu,
  Item,
};
