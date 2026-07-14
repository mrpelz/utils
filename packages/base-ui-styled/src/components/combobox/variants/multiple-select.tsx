import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonCombobox, itemBaseStyles } from '../common.js';

const Container = styled('div', forwardRef)`
  display: flex;
  max-width: 28rem;
  flex-direction: column;
  gap: var(--space-1);
`;

const Label = styled('label', forwardRef)`
  display: flex;
  flex-direction: column;
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  gap: var(--space-1);
  line-height: var(--leading-sm);
`;

const Chip = styled(BaseCombobox.Chip, forwardRef)`
  display: flex;
  overflow: hidden;
  min-height: calc(var(--space-6) - 2px);
  box-sizing: border-box;
  align-items: center;
  padding: 0 0.2rem 0 0.4rem;
  background-color: var(--hover-wash);
  color: var(--on-surface);
  cursor: default;
  font-size: var(--text-sm);
  gap: var(--space-1);
  line-height: var(--leading-none);
  outline: 0;

  &:focus-within {
    background-color: var(--ink);
    color: var(--on-ink);
  }

  @media (hover: hover) {
    &[data-highlighted] {
      background-color: var(--ink);
      color: var(--on-ink);
    }
  }
`;

const ChipRemove = styled(BaseCombobox.ChipRemove, forwardRef)`
  display: flex;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: inherit;

  @media (hover: hover) {
    &:hover {
      background-color: var(--active-wash);
    }
  }

  ${Chip}:focus-within & {
    @media (hover: hover) {
      &:hover {
        background-color: color-mix(in oklch, currentcolor, transparent 80%);
      }
    }
  }
`;

const Chips = styled(BaseCombobox.Chips, forwardRef)`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
`;

const Input = styled(BaseCombobox.Input, forwardRef)`
  min-width: 3rem;
  height: calc(var(--space-6) - 2px);
  box-sizing: border-box;
  flex: 1;
  padding: 0;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &::placeholder {
    color: var(--subtle);
  }

  &:focus {
    outline: none;
  }
`;

const InputGroup = styled(BaseCombobox.InputGroup, forwardRef)`
  display: flex;
  width: var(--control-width-sm);
  min-height: var(--control-height);
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  cursor: text;
  gap: var(--space-0-5);

  @media (width >= 32rem) {
    width: 22rem;
  }

  &:has(${Chip}) {
    padding-inline: var(--space-1);
  }

  &:focus-within {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Positioner = styled(BaseCombobox.Positioner, forwardRef)`
  z-index: 50;
  outline: 0;
`;

const Popup = styled(BaseCombobox.Popup, forwardRef)`
  width: var(--anchor-width);
  max-width: var(--available-width);
  max-height: min(var(--available-height), 24.5rem);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-1);
  transform-origin: var(--transform-origin);
  transition:
    opacity 0.1s,
    transform 0.1s;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const Item = styled(BaseCombobox.Item, forwardRef)`
  ${itemBaseStyles}
  align-items: center;
  line-height: var(--leading-xs);

  &[data-selected] {
    position: relative;
    z-index: 0;
    color: var(--on-surface);
  }

  &[data-selected]::before,
  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    content: '';
    inset-block: 0;
    inset-inline: 0;
  }

  @media (hover: hover) {
    &[data-highlighted] {
      position: relative;
      z-index: 0;
      color: var(--on-ink);
    }

    &[data-highlighted]::before {
      background-color: var(--ink);
    }
  }
`;

const ItemName = styled('span', forwardRef)`
  color: inherit;
  font-weight: var(--font-bold);
`;

export const multipleSelect = {
  ...CommonCombobox,
  Container,
  Label,
  Chip,
  ChipRemove,
  Chips,
  Input,
  InputGroup,
  Positioner,
  Popup,
  Item,
  ItemName,
};
