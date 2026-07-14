import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonAutocomplete } from '../common.js';

const Group = styled(BaseAutocomplete.Group, forwardRef)`
  display: block;
  padding-bottom: var(--space-2);

  &:last-child {
    padding-bottom: 0;
  }
`;

export const grouped = {
  ...CommonAutocomplete,
  Group,
};
