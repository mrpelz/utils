import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseFieldset.Root, forwardRef)`
  display: flex;
  width: 100%;
  max-width: var(--control-width-sm);
  flex-direction: column;
  padding: 0;
  border: 0;
  margin: 0;
  gap: var(--space-4);
`;

const Legend = styled(BaseFieldset.Legend, forwardRef)`
  border-bottom: var(--border-width) solid var(--border);
  color: var(--on-surface);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
`;

export const CommonFieldset = {
  ...BaseFieldset,
  Root,
  Legend,
};
