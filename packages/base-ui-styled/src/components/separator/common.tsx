import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const CommonSeparator = styled(BaseSeparator, forwardRef)`
  width: 1px;
  height: stretch;
  background-color: var(--border-muted);

  &[data-orientation='vertical'] {
    width: stretch;
    height: 1px;
  }
`;
