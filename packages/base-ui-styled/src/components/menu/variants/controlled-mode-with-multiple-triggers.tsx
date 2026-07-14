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

const Item = styled(CommonMenu.Item, forwardRef)`
  color: inherit;
`;

export const controlledModeWithMultipleTriggers = {
  ...CommonMenu,
  Container,
  Button,
  Item,
};
