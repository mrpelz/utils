import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonPreviewCard } from '../common.js';

const Positioner = styled(BasePreviewCard.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
  transition-duration: var(--duration-slow);
  transition-property: top, left, right, bottom, transform;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
`;

const Popup = styled(BasePreviewCard.Popup, forwardRef)`
  position: relative;
  width: var(--popup-width, auto);
  height: var(--popup-height, auto);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  transform-origin: var(--transform-origin);
  transition-duration: var(--duration-slow);
  transition-property: width, height, opacity, transform;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.98);
  }
`;

const Viewport = styled(BasePreviewCard.Viewport, forwardRef)`
  position: relative;
  overflow: clip;
  width: 100%;
  height: 100%;

  & [data-previous],
  & [data-current] {
    width: var(--popup-width);
    opacity: 1;
    transition:
      translate var(--duration-slow) cubic-bezier(0.22, 1, 0.36, 1),
      opacity calc(var(--duration-slow) / 2) cubic-bezier(0.22, 1, 0.36, 1);
    translate: 0;
  }

  &[data-activation-direction~='left'] [data-current][data-starting-style] {
    opacity: 0;
    translate: -30% 0;
  }

  &[data-activation-direction~='right'] [data-current][data-starting-style] {
    opacity: 0;
    translate: 30% 0;
  }

  &[data-activation-direction~='left'] [data-previous][data-ending-style] {
    opacity: 0;
    translate: 30% 0;
  }

  &[data-activation-direction~='right'] [data-previous][data-ending-style] {
    opacity: 0;
    translate: -30% 0;
  }
`;

export const animatingThePreviewCard = {
  ...CommonPreviewCard,
  Positioner,
  Popup,
  Viewport,
};
