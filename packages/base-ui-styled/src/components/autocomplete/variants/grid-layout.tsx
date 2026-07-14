import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonAutocomplete } from '../common.js';

const Container = styled('div', forwardRef)`
  width: var(--control-width-sm);
  margin: 0 auto;
`;

const InputGroup = styled('div', forwardRef)`
  position: relative;
  display: flex;
  width: 100%;
`;

const TextInput = styled('input', forwardRef)`
  height: var(--control-height);
  box-sizing: border-box;
  flex: 1;
  padding: 0 var(--space-2);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  border-right: 0;
  margin: 0;
  margin-right: -1px;
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
    position: relative;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const EmojiButton = styled(BaseAutocomplete.Trigger, forwardRef)`
  display: flex;
  width: 2rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: var(--border-width) solid var(--border);
  background-color: transparent;
  color: var(--on-surface);
  font-size: var(--text-lg);
  line-height: var(--leading-none);
  outline: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

const Viewport = styled('div', forwardRef)`
  border: var(--border-width) solid var(--border);
  border-top: none;
`;

const Popup = styled(BaseAutocomplete.Popup, forwardRef)`
  --input-container-height: var(--space-8);

  max-width: var(--available-width);
  max-height: 20.5rem;
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

const Input = styled(BaseAutocomplete.Input, forwardRef)`
  width: var(--control-width-sm);
  max-width: 100%;
  height: var(--input-container-height);
  box-sizing: border-box;
  padding: 0 var(--space-2);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
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

const List = styled(BaseAutocomplete.List, forwardRef)`
  overflow: auto;
  max-height: min(
    calc(20.5rem - var(--input-container-height) - 2px),
    calc(var(--available-height) - var(--input-container-height) - 2px)
  );
  overscroll-behavior: contain;
  padding-block: var(--space-2);
  scroll-padding-bottom: 0.35rem;
  scroll-padding-top: var(--space-1);

  &:empty {
    padding: 0;
  }
`;

const Group = styled(BaseAutocomplete.Group, forwardRef)`
  display: block;
`;

const Grid = styled('div', forwardRef)`
  padding: 0 var(--space-2) var(--space-1);
`;

const Row = styled(BaseAutocomplete.Row, forwardRef)`
  display: grid;
  grid-template-columns: repeat(var(--cols, 5), 1fr);
`;

const Item = styled(BaseAutocomplete.Item, forwardRef)`
  display: flex;
  min-width: var(--anchor-width);
  height: var(--control-height-lg);
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-0-5);
  background: transparent;
  cursor: default;
  outline: 0;
  user-select: none;

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: var(--on-ink);
  }

  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    background-color: var(--hover-wash);
    content: '';
    inset: 0;
  }
`;

const Emoji = styled('span', forwardRef)`
  font-size: var(--text-xl);
  line-height: var(--leading-none);
`;

const Name = styled('span', forwardRef)`
  overflow: hidden;
  max-width: 100%;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
  opacity: 0.8;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${Item}[data-highlighted] & {
    opacity: 1;
  }
`;

const Empty = styled(BaseAutocomplete.Empty, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-3) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
`;

export const gridLayout = {
  ...CommonAutocomplete,
  Container,
  InputGroup,
  TextInput,
  EmojiButton,
  Viewport,
  Popup,
  Input,
  List,
  Group,
  Grid,
  Row,
  Item,
  Emoji,
  Name,
  Empty,
};
