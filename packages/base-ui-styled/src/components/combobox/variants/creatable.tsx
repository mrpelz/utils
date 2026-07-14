import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
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

const CreateButton = styled('button', forwardRef)`
  display: grid;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  padding: var(--space-2);
  border: none;
  background: none;
  color: var(--on-surface);
  cursor: default;
  gap: var(--space-2);
  grid-template-columns: 1rem 1fr;
  text-align: left;
`;

const CreateText = styled('span', forwardRef)`
  grid-column-start: 2;
`;

const Backdrop = styled(BaseDialog.Backdrop, forwardRef)`
  position: fixed;
  min-height: 100dvh;
  background-color: black;
  inset: 0;
  opacity: 0.2;
  transition: opacity var(--duration-medium) var(--ease-out-fast);

  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const DialogPopup = styled(BaseDialog.Popup, forwardRef)`
  position: fixed;
  top: 50%;
  left: 50%;
  width: var(--popup-width-sm);
  max-width: calc(100vw - var(--space-12));
  box-sizing: border-box;
  padding: var(--space-6);
  border: var(--border-width) solid var(--border);
  margin-top: -2rem;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  transform: translate(-50%, -50%);
  transition: all var(--duration-medium);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
`;

const DialogTitle = styled(BaseDialog.Title, forwardRef)`
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const DialogDescription = styled(BaseDialog.Description, forwardRef)`
  margin: 0 0 var(--space-4);
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const TextField = styled('input', forwardRef)`
  width: 100%;
  height: var(--control-height);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
  padding-inline: var(--space-2);

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &::placeholder {
    color: var(--subtle);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const DialogActions = styled('div', forwardRef)`
  display: flex;
  justify-content: end;
  margin-top: var(--space-4);
  gap: var(--space-3);
`;

const DialogButton = styled('button', forwardRef)`
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
  outline: 0;
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

export const creatable = {
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
  CreateButton,
  CreateText,
  Backdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  TextField,
  DialogActions,
  DialogButton,
};
