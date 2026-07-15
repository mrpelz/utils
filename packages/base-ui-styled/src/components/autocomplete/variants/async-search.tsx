import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { keyframes, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonAutocomplete } from '../common.js';

const Viewport = styled('div', forwardRef)`
  max-height: min(var(--available-height), 22.5rem);
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-1);
`;

const MovieItem = styled('span', forwardRef)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: var(--space-1);
`;

const MovieName = styled('span', forwardRef)`
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const MovieYear = styled('span', forwardRef)`
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);

  ${CommonAutocomplete.Item}[data-highlighted] & {
    color: var(--border-muted);
  }
`;

const Status = styled(BaseAutocomplete.Status, forwardRef)`
  display: flex;
  align-items: center;
  padding-right: var(--space-8);
  padding-left: var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  gap: var(--space-2);
  padding-block: var(--space-1);
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled('span', forwardRef)`
  width: var(--space-3);
  height: var(--space-3);
  box-sizing: border-box;
  border: var(--border-width) solid currentcolor;
  border-radius: 50%;
  border-right-color: transparent;
  animation: ${spin} 0.75s linear infinite;
`;

export const asyncSearch = {
  ...CommonAutocomplete,
  Viewport,
  MovieItem,
  MovieName,
  MovieYear,
  Status,
  Spinner,
};
