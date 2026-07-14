import { Progress as BaseProgress } from '@base-ui/react/progress';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled<typeof BaseProgress.Root, BaseProgress.Root.Props>(
  BaseProgress.Root,
  forwardRef,
)`
  display: grid;
  width: 15rem;
  max-width: 100%;
  grid-template-columns: 1fr 1fr;
  row-gap: var(--space-2);
`;

const Label = styled(BaseProgress.Label, forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
`;

const Value = styled(BaseProgress.Value, forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-align: right;
`;

const Track = styled(BaseProgress.Track, forwardRef)`
  overflow: hidden;
  height: var(--space-1);
  background-color: var(--active-wash);
  grid-column: 1 / 3;
`;

const Indicator = styled(BaseProgress.Indicator, forwardRef)`
  background-color: var(--ink);
  transition: width 500ms;
`;

export const CommonProgress = {
  ...BaseProgress,
  Root,
  Label,
  Value,
  Track,
  Indicator,
};
