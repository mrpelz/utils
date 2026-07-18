import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from '@base-ui/react/button';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { wrap } from './utils.js';

export type ButtonProps = BaseButtonProps & {
  'styled-cursor'?: Properties['cursor'];
};

export const Button = wrap(
  styled<typeof BaseButton, ButtonProps>(BaseButton, forwardRef)`
    --styled-cursor: attr(
      styled-cursor type(\<custom-ident\>),
      ${({ onClick }) => (onClick ? 'pointer' : 'not-allowed')}
    );

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
      cursor: var(--styled-cursor);
    }

    &:active:not([data-disabled]) {
      background-color: var(--active-wash);
    }

    &[data-disabled] {
      border-color: var(--subtle);
      color: var(--subtle);
    }
  `,
  (props: ButtonProps) => ({
    ...props,
    ...(!props.onClick && props.disabled === undefined && { disabled: true }),
  }),
);
