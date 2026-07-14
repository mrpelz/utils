import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { ScrollArea } from '../../scroll-area/component.js';
import { CommonAutocomplete } from '../common.js';

const Button = styled(BaseDialog.Trigger, forwardRef)`
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
  cursor: default;
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

const Backdrop = styled(BaseDialog.Backdrop, forwardRef)`
  position: fixed;
  background-color: black;
  inset: 0;
  opacity: 0.2;
  transition: opacity var(--duration-medium) var(--ease-out-fast);

  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  @media (prefers-color-scheme: dark) {
    opacity: 0.7;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const Viewport = styled(BaseDialog.Viewport, forwardRef)`
  position: fixed;
  display: flex;
  overflow: hidden;
  align-items: flex-start;
  justify-content: center;
  padding: 4.5rem var(--space-2) var(--space-2);
  inset: 0;
`;

const Popup = styled(BaseDialog.Popup, forwardRef)`
  position: relative;
  display: flex;
  width: calc(100vw - 1rem);
  max-width: 28rem;
  max-height: min(36rem, calc(100dvh - 5rem));
  box-sizing: border-box;
  flex-direction: column;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  transition:
    transform 150ms,
    opacity 150ms;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: translateY(-1rem) scale(0.95);
  }
`;

const visuallyHiddenStyles = css`
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  margin: -1px;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const VisuallyHidden = styled('span', forwardRef)`
  ${visuallyHiddenStyles}
`;

const DialogClose = styled(BaseDialog.Close, forwardRef)`
  ${visuallyHiddenStyles}
`;

const Input = styled(BaseAutocomplete.Input, forwardRef)`
  position: relative;
  z-index: 1;
  width: 100%;
  height: var(--control-height-lg);
  box-sizing: border-box;
  padding: 0 var(--space-3);
  border: none;
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
  }
`;

const ListArea = styled(ScrollArea.Root, forwardRef)`
  position: relative;
  display: flex;
  overflow: hidden;
  min-height: 0;
  max-height: min(60dvh, 24rem);
  flex: 0 1 auto;
  border-top: var(--border-width) solid var(--border);
`;

const ListViewport = styled(BaseScrollArea.Viewport, forwardRef)`
  min-height: 0;
  box-sizing: border-box;
  flex: 1 1 auto;
  overscroll-behavior: contain;
  scroll-padding-block: var(--space-1);

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const ListContent = styled(BaseScrollArea.Content, forwardRef)`
  min-width: 100%;
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  display: flex;
  width: 1rem;
  justify-content: center;
  background-color: color-mix(in srgb, var(--on-surface) 12%, transparent);
  transition: opacity var(--duration-medium);
`;

const List = styled(BaseAutocomplete.List, forwardRef)`
  box-sizing: border-box;
  padding: var(--space-1) 0;

  &:empty {
    padding: 0;
  }
`;

const Group = styled(BaseAutocomplete.Group, forwardRef)`
  &:not(:last-child) {
    margin-block-end: var(--space-1);
  }
`;

const GroupLabel = styled(BaseAutocomplete.GroupLabel, forwardRef)`
  display: flex;
  min-height: var(--control-height);
  align-items: center;
  padding: 0 var(--space-6) 0 var(--space-3);
  margin: 0;
  color: var(--subtle);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-none);
  outline: 0;
  user-select: none;
`;

const Item = styled(BaseAutocomplete.Item, forwardRef)`
  display: grid;
  min-height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  padding: 0 var(--space-6);
  cursor: default;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  grid-template-columns: minmax(0, 1fr) auto;
  line-height: 1.25;
  outline: 0;
  scroll-margin-block: var(--space-1);
  user-select: none;

  &[data-highlighted] {
    background-color: var(--active-wash);
  }
`;

const ItemLabel = styled('span', forwardRef)`
  overflow: hidden;
  min-width: 0;
  font-weight: var(--font-regular);
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemType = styled('span', forwardRef)`
  color: var(--subtle);
  font-size: var(--text-sm);
  white-space: nowrap;

  [data-highlighted] & {
    color: var(--color-gray-700);
  }
`;

const Empty = styled(BaseAutocomplete.Empty, forwardRef)`
  display: flex;
  min-height: 8rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: flex-start;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
`;

const Footer = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2-5) var(--space-3);
  border-top: var(--border-width) solid var(--border);
  background-color: var(--surface);
  color: var(--muted);
  font-size: var(--text-xs);
`;

const FooterLeft = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

const FooterRight = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

const Kbd = styled('kbd', forwardRef)`
  display: inline-flex;
  min-width: var(--space-5);
  height: var(--space-5);
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-1);
  border: var(--border-width) solid var(--color-gray-400);
  background-color: var(--hover-wash);
  color: var(--muted);
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo,
    monospace;
  font-size: 0.625rem;
  font-weight: var(--font-regular);
  line-height: var(--leading-none);
`;

export const commandPalette = {
  ...CommonAutocomplete,
  Button,
  Backdrop,
  Viewport,
  Popup,
  VisuallyHidden,
  DialogClose,
  Input,
  ListArea,
  ListViewport,
  ListContent,
  Scrollbar,
  ScrollbarThumb: ScrollArea.Thumb,
  List,
  Group,
  GroupLabel,
  Item,
  ItemLabel,
  ItemType,
  Empty,
  Footer,
  FooterLeft,
  FooterRight,
  Kbd,
};
