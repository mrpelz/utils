import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

const Input = styled(BaseAutocomplete.Input, forwardRef)`
  width: var(--control-width-sm);
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
    outline-offset: var(--focus-ring-offset);
  }
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

const Positioner = styled(BaseAutocomplete.Positioner, forwardRef)`
  outline: 0;
`;

const Popup = styled(BaseAutocomplete.Popup, forwardRef)`
  width: var(--anchor-width);
  max-width: var(--available-width);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
`;

const List = styled(BaseAutocomplete.List, forwardRef)`
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

export const itemBaseStyles = css`
  box-sizing: border-box;
  cursor: default;
  outline: 0;
  user-select: none;
`;

const Item = styled(BaseAutocomplete.Item, forwardRef)`
  ${itemBaseStyles}
  display: flex;
  padding-right: var(--space-2);
  padding-left: var(--space-2);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  padding-block: var(--space-2);

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

const Empty = styled(BaseAutocomplete.Empty, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
`;

const Separator = styled(BaseAutocomplete.Separator, forwardRef)`
  height: 1px;
  margin: var(--space-1-5) var(--space-4);
  background-color: var(--hover-wash);
`;

const GroupLabel = styled(BaseAutocomplete.GroupLabel, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  user-select: none;
`;

export const CommonAutocomplete = {
  ...BaseAutocomplete,
  Input,
  Label,
  Positioner,
  Popup,
  List,
  Item,
  Empty,
  Separator,
  GroupLabel,
};
