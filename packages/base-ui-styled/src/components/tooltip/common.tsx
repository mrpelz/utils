import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

export const tooltipButtonStyles = css`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-none);
  user-select: none;
  white-space: nowrap;

  &:focus-visible {
    position: relative;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }
`;

const Trigger = styled(BaseTooltip.Trigger, forwardRef)`
  display: flex;
  width: 2rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  user-select: none;

  &:focus-visible {
    position: relative;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }

  &:not(:first-child) {
    border-left: none;
  }

  &[data-popup-open]:not([data-disabled]) {
    background-color: var(--hover-wash);
  }

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }
`;

const Popup = styled(BaseTooltip.Popup, forwardRef)`
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-1) var(--space-2);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  transform-origin: var(--transform-origin);
  transition:
    scale var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    scale: 0.98;
  }

  &[data-instant] {
    transition: none;
  }
`;

const Arrow = styled(BaseTooltip.Arrow, forwardRef)`
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
    display: block;
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: var(--border-width) solid var(--border);
    background-color: var(--surface);
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);
  }
`;

export const CommonTooltip = {
  ...BaseTooltip,
  Trigger,
  Popup,
  Arrow,
};
