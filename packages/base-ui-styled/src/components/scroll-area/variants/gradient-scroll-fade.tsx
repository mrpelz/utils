import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonScrollArea } from '../common.js';

const Viewport = styled(BaseScrollArea.Viewport, forwardRef)`
  --fade-size: 40px;

  height: 100%;
  background: var(--hover-wash);
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    black min(var(--fade-size), var(--scroll-area-overflow-y-start)),
    black
      calc(
        100% - min(
            var(--fade-size),
            var(--scroll-area-overflow-y-end, var(--fade-size))
          )
      ),
    transparent 100%
  );
  mask-repeat: no-repeat;
  outline: none;

  @media (prefers-color-scheme: dark) {
    background: var(--color-gray-200);
  }
`;

const Root = styled(BaseScrollArea.Root, forwardRef)`
  width: 24rem;
  max-width: calc(100vw - 8rem);
  height: 12rem;
  box-sizing: border-box;
  background-color: var(--hover-wash);

  @media (prefers-color-scheme: dark) {
    background-color: var(--color-gray-200);
  }

  &:has(${Viewport}:focus-visible) {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
  }
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  display: flex;
  width: 1rem;
  justify-content: center;
  margin: 1px;
  background-color: color-mix(in srgb, var(--on-surface) 8%, transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-medium);

  &[data-hovering],
  &[data-scrolling] {
    opacity: 1;
    pointer-events: auto;
  }

  &[data-scrolling] {
    transition-duration: 0ms;
  }
`;

export const gradientScrollFade = {
  ...CommonScrollArea,
  Viewport,
  Root,
  Scrollbar,
};
