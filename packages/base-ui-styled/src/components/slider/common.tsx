import { Slider as BaseSlider } from '@base-ui/react/slider';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Control = styled(BaseSlider.Control, forwardRef)`
  display: flex;
  width: 14rem;
  box-sizing: border-box;
  align-items: center;
  padding-block: var(--space-3);
  touch-action: none;
  user-select: none;

  &[data-orientation='vertical'] {
    width: auto;
    height: 8rem;
    padding-block: 0;
    padding-inline: var(--space-3);
  }
`;

const Track = styled(BaseSlider.Track, forwardRef)`
  width: 100%;
  height: var(--space-1);
  background-color: var(--active-wash);
  user-select: none;

  &[data-orientation='vertical'] {
    width: var(--space-1);
    height: 100%;
  }
`;

const Indicator = styled(BaseSlider.Indicator, forwardRef)`
  background-color: var(--ink);
  user-select: none;
`;

const Thumb = styled(BaseSlider.Thumb, forwardRef)`
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  user-select: none;

  &:has(:focus-visible) {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 2px;
  }
`;

export const CommonSlider = {
  ...BaseSlider,
  Control,
  Track,
  Indicator,
  Thumb,
};
