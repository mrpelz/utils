import { Form as BaseForm } from '@base-ui/react/form';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const CommonForm = styled(BaseForm, forwardRef)`
  display: flex;
  width: 100%;
  max-width: 16rem;
  flex-direction: column;
  gap: var(--space-4);
`;
