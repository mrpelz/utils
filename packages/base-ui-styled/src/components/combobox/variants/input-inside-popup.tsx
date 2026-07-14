import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonCombobox, itemBaseStyles } from '../common.js';

const Field = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

const Label = styled(BaseCombobox.Label, forwardRef)`
  color: var(--on-surface);
  cursor: default;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const TriggerIcon = styled(BaseCombobox.Icon, forwardRef)`
  color: var(--on-surface);
`;

const Trigger = styled(BaseCombobox.Trigger, forwardRef)`
  display: flex;
  min-width: 10rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding-right: var(--space-1);
  padding-left: var(--space-2);
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  cursor: default;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-3);
  line-height: var(--leading-none);
  outline: 0;
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active {
    background-color: var(--active-wash);
  }

  &[data-placeholder] {
    color: var(--subtle);
  }
`;

const Input = styled(BaseCombobox.Input, forwardRef)`
  width: 100%;
  min-width: 20rem;
  height: var(--control-height);
  box-sizing: border-box;
  padding: 0 var(--space-2);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
  outline: none;

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &::placeholder {
    color: var(--subtle);
  }

  &:focus {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: -2px;
  }
`;

const Popup = styled(BaseCombobox.Popup, forwardRef)`
  --input-container-height: var(--control-height);

  max-width: var(--available-width);
  max-height: 24.5rem;
  box-sizing: border-box;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  transform-origin: var(--transform-origin);
  transition:
    transform 150ms,
    opacity 150ms;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const Viewport = styled('div', forwardRef)`
  border-right: var(--border-width) solid var(--border);
  border-bottom: var(--border-width) solid var(--border);
  border-left: var(--border-width) solid var(--border);
`;

const List = styled(BaseCombobox.List, forwardRef)`
  overflow: auto;
  max-height: min(
    calc(24.5rem - var(--input-container-height) - 2px),
    calc(var(--available-height) - var(--input-container-height) - 2px)
  );
  box-sizing: border-box;
  overscroll-behavior: contain;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-1);

  &:empty {
    padding: 0;
  }
`;

const Item = styled(BaseCombobox.Item, forwardRef)`
  ${itemBaseStyles}
  min-width: var(--anchor-width);
  align-items: center;
  line-height: var(--leading-xs);

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: var(--on-ink);
  }

  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    background-color: var(--ink);
    content: '';
    inset-block: 0;
    inset-inline: 0;
  }
`;

const Separator = styled(BaseCombobox.Separator, forwardRef)`
  height: var(--border-width);
  margin: var(--space-1-5) var(--space-4);
  background-color: var(--hover-wash);
`;

export const inputInsidePopup = {
  ...CommonCombobox,
  Field,
  Label,
  TriggerIcon,
  Trigger,
  Input,
  Popup,
  Viewport,
  List,
  Item,
  Separator,
};
