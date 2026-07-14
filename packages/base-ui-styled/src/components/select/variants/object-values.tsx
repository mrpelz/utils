import { Select as BaseSelect } from '@base-ui/react/select';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonSelect } from '../common.js';

const Trigger = styled(BaseSelect.Trigger, forwardRef)`
  display: flex;
  min-width: var(--control-width-sm);
  min-height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding-right: var(--space-1);
  padding-left: var(--space-2);
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-3);
  line-height: var(--leading-none);
  outline: 0;
  padding-block: var(--space-1-5);
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const ValueText = styled('span', forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-0-5);
`;

const ValuePrimary = styled('span', forwardRef)`
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const ValueSecondary = styled('span', forwardRef)`
  color: var(--muted);
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
`;

const ItemIndicator = styled(CommonSelect.ItemIndicator, forwardRef)`
  position: relative;
  top: 0.4em;
  display: flex;
  align-items: center;
  align-self: start;
  justify-content: center;
`;

const ItemText = styled(CommonSelect.ItemText, forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-0-5);
`;

const ItemLabel = styled('span', forwardRef)`
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const ItemDescription = styled('span', forwardRef)`
  color: var(--muted);
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
`;

const Item = styled(BaseSelect.Item, forwardRef)`
  display: grid;
  box-sizing: border-box;
  align-items: flex-start;
  padding-right: var(--space-4);
  padding-left: var(--space-2-5);
  cursor: default;
  font-size: var(--text-sm);
  gap: var(--space-2);
  grid-template-columns: 1rem 1fr;
  line-height: var(--leading-sm);
  outline: 0;
  padding-block: var(--space-1-5);
  user-select: none;

  &[data-highlighted] {
    background-color: var(--ink);
    color: var(--on-ink);

    ${ItemDescription} {
      color: var(--subtle);
    }
  }
`;

export const objectValues = {
  ...CommonSelect,
  Trigger,
  ValueText,
  ValuePrimary,
  ValueSecondary,
  ItemIndicator,
  ItemText,
  ItemLabel,
  ItemDescription,
  Item,
};
