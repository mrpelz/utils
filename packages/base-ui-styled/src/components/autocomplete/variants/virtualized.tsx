import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonAutocomplete, itemBaseStyles } from '../common.js';

const Input = styled(BaseAutocomplete.Input, forwardRef)`
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

const List = styled(BaseAutocomplete.List, forwardRef)`
  box-sizing: border-box;
  padding: 0;
`;

const Item = styled(BaseAutocomplete.Item, forwardRef)`
  ${itemBaseStyles}
  display: flex;
  padding-right: var(--space-2);
  padding-left: var(--space-2);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  padding-block: var(--space-2);

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

const Empty = styled(BaseAutocomplete.Empty, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-3) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
`;

export const virtualized = {
  ...CommonAutocomplete,
  Input,
  Scroller,
  VirtualizedPlaceholder,
  List,
  Item,
  Empty,
};
