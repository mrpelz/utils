import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { keyframes } from '@emotion/react';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
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
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
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

const Viewport = styled('div', forwardRef)`
  max-height: min(var(--available-height), 24.5rem);
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-1);
`;

const Status = styled(BaseCombobox.Status, forwardRef)`
  display: flex;
  align-items: center;
  padding-right: var(--space-5);
  padding-left: var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  gap: var(--space-2);
  line-height: var(--leading-sm);
  padding-block: var(--space-1);
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled('span', forwardRef)`
  width: var(--space-3);
  height: var(--space-3);
  box-sizing: border-box;
  border: var(--border-width) solid currentcolor;
  border-radius: 10rem;
  border-right-color: transparent;
  animation: ${spin} 0.75s linear infinite;
`;

const itemHighlightStyles = css`
  @media (hover: hover) {
    &[data-highlighted] {
      position: relative;
      z-index: 0;
      color: var(--on-surface);
    }

    &[data-highlighted]::before {
      position: absolute;
      z-index: -1;
      background-color: var(--hover-wash);
      content: '';
      inset-block: 0;
      inset-inline: 0;
    }
  }
`;

const Item = styled(BaseCombobox.Item, forwardRef)`
  ${itemBaseStyles}
  ${itemHighlightStyles}
  align-items: flex-start;
  line-height: 1.2rem;
`;

const ItemIndicator = styled(BaseCombobox.ItemIndicator, forwardRef)`
  margin-top: var(--space-1);
  grid-column-start: 1;
`;

const ItemText = styled('span', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  grid-column-start: 2;
`;

const ItemTitle = styled('span', forwardRef)`
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const ItemSubtitle = styled('span', forwardRef)`
  display: flex;
  flex-wrap: wrap;
  color: var(--subtle);
  font-size: var(--text-xs);
  gap: var(--space-2);
`;

const ItemEmail = styled('span', forwardRef)`
  font-size: var(--text-xs);
`;

export const asyncSearchMultiple = {
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
  Viewport,
  Status,
  Spinner,
  Item,
  ItemIndicator,
  ItemText,
  ItemTitle,
  ItemSubtitle,
  ItemEmail,
};
