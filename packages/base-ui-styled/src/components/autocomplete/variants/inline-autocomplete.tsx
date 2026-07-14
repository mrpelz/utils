import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonAutocomplete, itemBaseStyles } from '../common.js';

const Container = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const Positioner = styled(BaseAutocomplete.Positioner, forwardRef)`
  outline: 0;

  &[data-empty] {
    display: none;
  }
`;

const Item = styled(BaseAutocomplete.Item, forwardRef)`
  ${itemBaseStyles}
  display: flex;
  align-items: center;
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

export const inlineAutocomplete = {
  ...CommonAutocomplete,
  Container,
  Positioner,
  Item,
};
