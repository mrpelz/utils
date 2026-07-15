import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { css as cssClass, keyframes, styled } from 'goober';
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
  width: var(--control-width-sm);
  height: var(--control-height);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);

  @media (width >= 32rem) {
    width: 20rem;
  }

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

  &[data-starting-style] {
    opacity: 0;
    transform: scale(0.95);
  }

  &[data-ending-style] {
    transition: none;
  }
`;

const Viewport = styled('div', forwardRef)`
  max-height: min(var(--available-height), 22.5rem);
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

export const asyncSearchSingle = {
  ...CommonCombobox,
  InputGroup,
  Input,
  Label,
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
