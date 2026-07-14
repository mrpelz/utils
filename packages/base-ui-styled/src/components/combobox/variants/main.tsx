import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { css as cssClass, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonCombobox, itemBaseStyles } from '../common.js';

const input = css`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 calc(var(--space-2) + var(--space-8)) 0 var(--space-2);
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

const Input = styled(BaseCombobox.Input, forwardRef)`
  ${input}
`;

const InputGroup = styled(BaseCombobox.InputGroup, forwardRef)`
  position: relative;
  width: 14rem;
  height: var(--control-height);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);

  &:focus-within {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:has(${CommonCombobox.Clear}) ${cssClass(input)} {
    padding: 0 calc(var(--space-2) + var(--space-8) * 2) 0 var(--space-2);
  }
`;

const Label = styled('div', forwardRef)`
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  gap: var(--space-1);
  line-height: var(--leading-sm);
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

const List = styled(BaseCombobox.List, forwardRef)`
  max-height: min(22.5rem, var(--available-height));
  box-sizing: border-box;
  outline: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-1);

  &[data-empty] {
    padding: 0;
  }
`;

const Item = styled(BaseCombobox.Item, forwardRef)`
  ${itemBaseStyles}
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

export const main = {
  ...CommonCombobox,
  InputGroup,
  Input,
  Label,
  Popup,
  List,
  Item,
};
