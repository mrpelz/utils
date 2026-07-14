import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonAutocomplete, itemBaseStyles } from '../common.js';

const List = styled(BaseAutocomplete.List, forwardRef)`
  display: flex;
  max-height: min(var(--available-height), 28rem);
  box-sizing: border-box;
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-1);

  &:empty {
    padding: 0;
  }
`;

const Item = styled(BaseAutocomplete.Item, forwardRef)`
  ${itemBaseStyles}
  display: flex;
  padding: var(--space-3) var(--space-2);
  font-size: var(--text-sm);
  line-height: var(--leading-md);

  &[data-highlighted] {
    position: relative;
    z-index: 0;
  }

  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    background-color: var(--hover-wash);
    content: '';
    inset-block: 0;
    inset-inline: 0;
  }

  & mark {
    background-color: transparent;
    color: var(--color-blue);
    font-weight: var(--font-bold);
  }
`;

const ItemContent = styled('span', forwardRef)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: var(--space-1);
`;

const ItemHeader = styled('span', forwardRef)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
`;

const ItemTitle = styled('span', forwardRef)`
  flex: 1;
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const ItemDescription = styled('span', forwardRef)`
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const Empty = styled(BaseAutocomplete.Empty, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-3) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
`;

export const fuzzyMatching = {
  ...CommonAutocomplete,
  List,
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
  ItemDescription,
  Empty,
};
