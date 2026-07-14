import { Select as BaseSelect } from '@base-ui/react/select';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonSelect } from '../common.js';

const Trigger = styled(CommonSelect.Trigger, forwardRef)`
  min-width: 14rem;
`;

const Popup = styled(CommonSelect.Popup, forwardRef)`
  max-height: var(--available-height);
  overflow-y: auto;
  padding-block: var(--space-1);

  &[data-side='none'] {
    transform: none;
  }
`;

const Item = styled(BaseSelect.Item, forwardRef)`
  display: grid;
  box-sizing: border-box;
  align-items: center;
  padding-right: var(--space-2-5);
  padding-left: var(--space-2-5);
  cursor: default;
  font-size: var(--text-sm);
  gap: var(--space-2);
  grid-template-columns: 1rem 1fr;
  line-height: var(--leading-sm);
  outline: 0;
  padding-block: var(--space-1-5);
  scroll-margin-block: var(--space-1);
  user-select: none;

  @media (hover: hover) {
    &[data-highlighted] {
      background-color: var(--ink);
      color: var(--on-ink);
    }
  }
`;

export const multipleSelection = {
  ...CommonSelect,
  Trigger,
  Popup,
  Item,
};
