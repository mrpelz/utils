import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseToolbar.Root, forwardRef)`
  display: flex;
  width: 37.5rem;
  box-sizing: border-box;
  align-items: center;
  padding: 1px;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  gap: 1px;
`;

const Group = styled(BaseToolbar.Group, forwardRef)`
  display: flex;
  gap: 1px;
`;

const Button = styled(BaseToolbar.Button, forwardRef)`
  display: flex;
  min-width: 2rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  margin: 0;
  background-color: transparent;
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-none);
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover:not([data-disabled], [data-popup-open]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 1px;
  }

  &:active:not([data-disabled], [data-pressed]) {
    background-color: var(--active-wash);
  }

  &[aria-pressed] {
    padding: 0 var(--space-3);
  }

  &[data-pressed] {
    background-color: var(--ink);
    color: var(--on-ink);
  }

  @media (hover: hover) {
    &[data-pressed]:hover:not([data-disabled], [data-popup-open]) {
      background-color: var(--ink);
      color: var(--on-ink);
    }
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
    color: var(--on-surface);
  }

  &[role='combobox'] {
    min-width: 8rem;
    justify-content: space-between;
    padding: 0 var(--space-2);
  }
`;

const Separator = styled(BaseToolbar.Separator, forwardRef)`
  width: 1px;
  height: 16px;
  margin: var(--space-1);
  background-color: var(--border);
`;

const Link = styled(BaseToolbar.Link, forwardRef)`
  flex: 0 0 auto;
  align-self: center;
  color: var(--subtle);
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  margin-inline: auto 0.875rem;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      color: var(--color-blue);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
  }
`;

export const CommonToolbar = {
  ...BaseToolbar,
  Root,
  Group,
  Button,
  Separator,
  Link,
};
