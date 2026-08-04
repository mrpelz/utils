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
    height: 2rem;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    padding: 0 0.75rem;
    border: 1px solid oklch(14.5% 0 0deg);
    border-radius: 0;
    margin: 0;
    background-color: white;
    color: oklch(14.5% 0 0deg);
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 400;
    gap: 0.5rem;
    line-height: 1;
    user-select: none;
    white-space: nowrap;

    @media (prefers-color-scheme: dark) {
      border: 1px solid white;
      background-color: oklch(14.5% 0 0deg);
      color: white;
    }

    @media (hover: hover) {
      cursor: var(--styled-cursor);

      &:hover:not([data-disabled]) {
        background-color: oklch(97% 0 0deg);

        @media (prefers-color-scheme: dark) {
          background-color: oklch(26.9% 0 0deg);
        }
      }
    }

    &:focus-visible {
      outline: 2px solid oklch(14.5% 0 0deg);
      outline-offset: -1px;

      @media (prefers-color-scheme: dark) {
        outline-color: white;
      }
    }

    &:active:not([data-disabled]) {
      background-color: oklch(92.2% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(37.1% 0 0deg);
      }
    }

    &[data-disabled] {
      border-color: oklch(55.6% 0 0deg);
      color: oklch(55.6% 0 0deg);

      @media (prefers-color-scheme: dark) {
        border-color: oklch(70.8% 0 0deg);
        color: oklch(70.8% 0 0deg);
      }
    }
  `,
  (props: ButtonProps) => ({
    ...props,
    ...(!props.onClick && props.disabled === undefined && { disabled: true }),
  }),
);
