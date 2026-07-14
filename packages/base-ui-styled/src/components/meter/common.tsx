import { Meter as BaseMeter } from '@base-ui/react/meter';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled<typeof BaseMeter.Root, BaseMeter.Root.Props>(
  BaseMeter.Root,
  forwardRef,
)`
  display: grid;
  width: 15rem;
  max-width: 100%;
  grid-template-columns: 1fr 1fr;
  row-gap: var(--space-2);
`;

const Label = styled(BaseMeter.Label, forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
`;

const Value = styled(BaseMeter.Value, forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-align: right;
`;

const Track = styled(BaseMeter.Track, forwardRef)`
  overflow: hidden;
  height: var(--space-3);
  background-color: var(--active-wash);
  grid-column: 1 / 3;
`;

const Indicator = styled(BaseMeter.Indicator, forwardRef)`
  background-color: var(--ink);
  transition: width 500ms;
`;

export const CommonMeter = {
  ...BaseMeter,
  Root,
  Label,
  Value,
  Track,
  Indicator,
};
