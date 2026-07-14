import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const CommonToggleGroup = styled(BaseToggleGroup, forwardRef)`
  display: flex;
  padding: 1px;
  border: var(--border-width) solid var(--border);
  gap: 1px;
`;
