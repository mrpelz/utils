import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonAutocomplete } from '../common.js';

const Popup = styled(BaseAutocomplete.Popup, forwardRef)`
  width: var(--anchor-width);
  max-width: var(--available-width);
  max-height: min(var(--available-height), 22.5rem);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-1);
`;

const Empty = styled(BaseAutocomplete.Empty, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
`;

const Status = styled(BaseAutocomplete.Status, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

export const limitResults = {
  ...CommonAutocomplete,
  Popup,
  Empty,
  Status,
};
