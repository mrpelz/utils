import { Button as BaseButton } from '@base-ui/react/button';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export type ButtonProps = BaseButton.Props & {
  'styled-cursor'?: Properties['cursor'];
};

// eslint-disable-next-line prettier/prettier
export const Button = styled<typeof BaseButton, ButtonProps>(BaseButton, forwardRef)`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-none);
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:not([data-disabled]) {
    /* stylelint-disable-next-line declaration-property-value-no-unknown */
    cursor: attr(styled-cursor type(\<custom-ident\>), pointer);
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;
