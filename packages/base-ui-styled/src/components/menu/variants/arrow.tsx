import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonMenu } from '../common.js';

const Arrow = styled(BaseMenu.Arrow, forwardRef)`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;

  &[data-side='top'] {
    bottom: -6px;
    rotate: 180deg;
  }

  &[data-side='bottom'] {
    top: -6px;
    rotate: 0deg;
  }

  &[data-side='left'] {
    right: -9px;
    rotate: 90deg;
  }

  &[data-side='right'] {
    left: -9px;
    rotate: -90deg;
  }

  &::before {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: var(--border-width) solid var(--border);
    background-color: var(--surface);
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);
  }
`;

export const arrow = {
  ...CommonMenu,
  Arrow,
};
