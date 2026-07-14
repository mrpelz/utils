import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonMenu } from '../common.js';

const Container = styled('div', forwardRef)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
`;

const Button = styled(BaseMenu.Trigger, forwardRef)`
  display: inline-flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-1-5);
  line-height: var(--leading-none);
  outline: 0;
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Positioner = styled(CommonMenu.Positioner, forwardRef)`
  --easing: cubic-bezier(0.22, 1, 0.36, 1);
  --animation-duration: 0.35s;

  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
  transition-duration: var(--animation-duration);
  transition-property: top, left, right, bottom, transform;
  transition-timing-function: var(--easing);

  &[data-instant] {
    transition: none;
  }
`;

const Popup = styled(CommonMenu.Popup, forwardRef)`
  width: var(--popup-width, auto);
  height: var(--popup-height, auto);
  transition-duration: var(--animation-duration);
  transition-property: width, height, opacity, transform;
  transition-timing-function: var(--easing);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }

  &[data-instant] {
    transition: none;
  }
`;

const Viewport = styled(BaseMenu.Viewport, forwardRef)`
  position: relative;
  overflow: clip;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;

  [data-previous],
  [data-current] {
    width: var(--popup-width);
    opacity: 1;
    transform: translateX(0);
    transition:
      transform var(--animation-duration) var(--easing),
      opacity calc(var(--animation-duration) / 2) var(--easing);
  }

  &[data-activation-direction~='right'] [data-previous][data-ending-style] {
    opacity: 0;
    transform: translateX(-50%);
  }

  &[data-activation-direction~='right'] [data-current][data-starting-style] {
    opacity: 0;
    transform: translateX(50%);
  }

  &[data-activation-direction~='left'] [data-previous][data-ending-style] {
    opacity: 0;
    transform: translateX(50%);
  }

  &[data-activation-direction~='left'] [data-current][data-starting-style] {
    opacity: 0;
    transform: translateX(-50%);
  }
`;

const GroupLabel = styled(BaseMenu.GroupLabel, forwardRef)`
  padding: var(--space-2) var(--space-4);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  user-select: none;
`;

const Item = styled(CommonMenu.Item, forwardRef)`
  color: inherit;
`;

export const animatingTheMenu = {
  ...CommonMenu,
  Container,
  Button,
  Positioner,
  Popup,
  Viewport,
  GroupLabel,
  Item,
};
