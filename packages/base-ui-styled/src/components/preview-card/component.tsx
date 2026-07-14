import { CommonPreviewCard } from './common.js';
import { animatingThePreviewCard } from './variants/animating-the-preview-card.js';
import { controlledModeWithMultipleTriggers } from './variants/controlled-mode-with-multiple-triggers.js';
import { detachedTriggers } from './variants/detached-triggers.js';
import { main } from './variants/main.js';

export const variants = {
  main,
  detachedTriggers,
  controlledModeWithMultipleTriggers,
  animatingThePreviewCard,
};

export const PreviewCard = {
  ...CommonPreviewCard,
  variants,
};

export { CommonPreviewCard, previewCardButtonStyles } from './common.js';
