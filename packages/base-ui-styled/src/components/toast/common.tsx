import { Toast as BaseToast } from '@base-ui/react/toast';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

export const toastButtonStyles = css`
  box-sizing: border-box;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-none);
  white-space: nowrap;

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Viewport = styled(BaseToast.Viewport, forwardRef)`
  position: fixed;
  z-index: 1;
  width: calc(100vw - var(--space-8));
  margin: 0 auto;
  inset: auto var(--space-4) var(--space-4) auto;

  @media (width >= 500px) {
    right: var(--space-8);
    bottom: var(--space-8);
    width: 22.5rem;
  }
`;

const Root = styled(BaseToast.Root, forwardRef)`
  --gap: var(--space-3);
  --peek: var(--space-3);
  --scale: calc(max(0, 1 - (var(--toast-index) * 0.1)));
  --shrink: calc(1 - var(--scale));
  --height: var(--toast-frontmost-height, var(--toast-height));
  --offset-y: calc(
    var(--toast-offset-y) * -1 + (var(--toast-index) * var(--gap) * -1) +
      var(--toast-swipe-movement-y)
  );

  position: absolute;
  z-index: calc(1000 - var(--toast-index));
  right: 0;
  bottom: 0;
  left: auto;
  width: 100%;
  height: var(--height);
  box-sizing: border-box;
  padding: 0;
  border: var(--border-width) solid var(--border);
  margin: 0 auto;
  margin-right: 0;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  cursor: default;
  transform: translateX(var(--toast-swipe-movement-x))
    translateY(
      calc(
        var(--toast-swipe-movement-y) - (var(--toast-index) * var(--peek)) -
          (var(--shrink) * var(--height))
      )
    )
    scale(var(--scale));
  transform-origin: bottom center;
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
    transform: translateY(150%);
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
    top: 100%;
    left: 0;
    width: 100%;
    height: calc(var(--gap) + 1px);
    content: '';
  }
`;

const Content = styled(BaseToast.Content, forwardRef)`
  display: flex;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  padding: var(--space-3);
  gap: var(--space-4);
  transition: opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &[data-behind] {
    opacity: 0;
  }

  &[data-expanded] {
    opacity: 1;
  }
`;

const Text = styled('div', forwardRef)`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--space-1);
`;

const Title = styled(BaseToast.Title, forwardRef)`
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Description = styled(BaseToast.Description, forwardRef)`
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const Close = styled(BaseToast.Close, forwardRef)`
  ${toastButtonStyles}

  display: flex;
  height: var(--control-height);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Button = styled('button', forwardRef)`
  ${toastButtonStyles}

  display: flex;
  height: var(--control-height);
  align-items: center;
  justify-content: center;
  margin: 0;
  gap: var(--space-2);
  user-select: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

export const CommonToast = {
  ...BaseToast,
  Viewport,
  Root,
  Content,
  Text,
  Title,
  Description,
  Close,
  Button,
};
