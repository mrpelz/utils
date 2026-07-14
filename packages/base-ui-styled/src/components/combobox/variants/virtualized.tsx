import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonCombobox, itemBaseStyles } from '../common.js';

const Input = styled(BaseCombobox.Input, forwardRef)`
  width: var(--control-width-sm);
  height: var(--control-height);
  box-sizing: border-box;
  padding: 0 var(--space-2);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
  outline: none;

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &:focus {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Label = styled('label', forwardRef)`
  display: flex;
  flex-direction: column;
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  gap: var(--space-1);
  line-height: var(--leading-sm);
`;

const Popup = styled(BaseCombobox.Popup, forwardRef)`
  width: var(--anchor-width);
  max-width: var(--available-width);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
`;

const Scroller = styled('div', forwardRef)`
  overflow: auto;
  height: min(22.5rem, var(--total-size));
  max-height: var(--available-height);
  box-sizing: border-box;
  overscroll-behavior: contain;
  scroll-padding-block: var(--space-1);
`;

const VirtualizedPlaceholder = styled('div', forwardRef)`
  position: relative;
  width: 100%;
`;

const List = styled(BaseCombobox.List, forwardRef)`
  box-sizing: border-box;
  padding: 0;
`;

const Item = styled(BaseCombobox.Item, forwardRef)`
  ${itemBaseStyles}
  align-items: center;
  line-height: var(--leading-xs);

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
    inset-inline: 0;
  }
`;

export const virtualized = {
  ...CommonCombobox,
  Input,
  Label,
  Popup,
  Scroller,
  VirtualizedPlaceholder,
  List,
  Item,
};
