import { Toast as BaseToast } from '@base-ui/react/toast';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonToast } from '../common.js';

const Viewport = styled(BaseToast.Viewport, forwardRef)`
  position: fixed;
  z-index: 1;
  width: calc(100vw - 2rem);
  max-width: 22.5rem;
  margin: 0 auto;
  inset: 1rem 0 auto;
`;

const Root = styled(BaseToast.Root, forwardRef)`
  --gap: var(--space-3);
  --peek: var(--space-3);
  --scale: calc(max(0, 1 - (var(--toast-index) * 0.1)));
  --shrink: calc(1 - var(--scale));
  --height: var(--toast-frontmost-height, var(--toast-height));
  --offset-y: calc(
    var(--toast-offset-y) + (var(--toast-index) * var(--gap)) +
      var(--toast-swipe-movement-y)
  );

  position: absolute;
  z-index: calc(1000 - var(--toast-index));
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: var(--height);
  box-sizing: border-box;
  padding: 0;
  border: var(--border-width) solid var(--border);
  margin: 0 auto;
  margin-right: auto;
  margin-left: auto;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  cursor: default;
  transform: translateX(var(--toast-swipe-movement-x))
    translateY(
      calc(
        var(--toast-swipe-movement-y) + (var(--toast-index) * var(--peek)) +
          (var(--shrink) * var(--height))
      )
    )
    scale(var(--scale));
  transform-origin: top center;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.5s,
    height 0.15s;
  user-select: none;

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &[data-expanded] {
    height: var(--toast-height);
    transform: translateX(var(--toast-swipe-movement-x))
      translateY(var(--offset-y));
  }

  &[data-starting-style],
  &[data-ending-style] {
    transform: translateY(-150%);
  }

  &[data-limited] {
    opacity: 0;
  }

  &[data-ending-style] {
    opacity: 0;

    &[data-swipe-direction='up'] {
      transform: translateY(calc(var(--toast-swipe-movement-y) - 150%));
    }

    &[data-swipe-direction='left'] {
      transform: translateX(calc(var(--toast-swipe-movement-x) - 150%))
        translateY(var(--offset-y));
    }

    &[data-swipe-direction='right'] {
      transform: translateX(calc(var(--toast-swipe-movement-x) + 150%))
        translateY(var(--offset-y));
    }

    &[data-swipe-direction='down'] {
      transform: translateY(calc(var(--toast-swipe-movement-y) + 150%));
    }
  }

  &::after {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: calc(var(--gap) + 1px);
    content: '';
  }
`;

export const customPosition = {
  ...CommonToast,
  Viewport,
  Root,
};
