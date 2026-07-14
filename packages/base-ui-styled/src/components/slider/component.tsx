import { CommonSlider } from './common.js';
import { main } from './variants/main.js';
import { rangeSlider } from './variants/range-slider.js';
import { thumbAlignment } from './variants/thumb-alignment.js';
import { vertical } from './variants/vertical.js';

export const variants = {
  main,
  rangeSlider,
  thumbAlignment,
  vertical,
};

export const Slider = {
  ...CommonSlider,
  variants,
};

export { CommonSlider } from './common.js';
