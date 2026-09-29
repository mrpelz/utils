import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from '@base-ui/react/button';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css, wrap } from './utils.js';

export type ButtonProps = BaseButtonProps & {
  cursor?: Properties['cursor'];
  /** Full width unless set (Konsta UI `inline`). */
  inline?: boolean;
  /** Capsule shape (Framework7 `button-round`). */
  round?: boolean;
  /** Framework7 `button-small`/`button-large`. */
  size?: 'large' | 'medium' | 'small';
  /** Framework7 `button-fill`/`button-outline`/`button-tonal`. */
  variant?: 'clear' | 'fill' | 'outline' | 'tonal';
};

// Source: Framework7 `components/button/button.less`, `button-ios.less`,
// `button-vars.less` (iOS values). Additions from Konsta UI
// `shared/classes/ButtonClasses.js`: `inline`, `user-select: none`.
//
// Deviations:
// - `gap` replaces Framework7's `margin-left: 4px` between children.
// - The browser's default focus ring is kept (Framework7 removes it).
// - `:active` replaces Framework7's JS-driven `.active-state`.
export const Button = wrap(
  styled<typeof BaseButton, ButtonProps>(BaseButton, forwardRef)`
    --styled-cursor: attr(
      cursor type(\<custom-ident\>),
      ${({ onClick }) => (onClick ? 'pointer' : 'not-allowed')}
    );
    --styled-height: 34px;
    --styled-border-width: 0px;
    --styled-bg-color: transparent;
    --styled-pressed-bg-color: color-mix(
      in srgb,
      var(--color-ios-primary) 15%,
      transparent
    );
    --styled-text-color: var(--color-ios-primary);
    --styled-pressed-text-color: var(--styled-text-color);

    position: relative;
    display: flex;
    overflow: hidden;
    width: 100%;
    min-width: 32px;
    min-height: var(--styled-height);
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border: var(--styled-border-width) solid var(--color-ios-primary);
    border-radius: 4px;
    margin: 0;
    appearance: none;
    background-color: var(--styled-bg-color);
    color: var(--styled-text-color);
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    gap: 4px;
    letter-spacing: 0;
    line-height: calc(var(--styled-height) - var(--styled-border-width) * 2);
    text-align: center;
    text-decoration: none;
    text-overflow: ellipsis;
    text-transform: none;
    transition-duration: 100ms;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;

    ${({ variant }) => {
      switch (variant) {
        case 'fill': {
          return css`
            --styled-bg-color: var(--color-ios-primary);
            --styled-pressed-bg-color: var(--color-ios-primary-tint);
            --styled-text-color: #fff;
          `;
        }

        case 'outline': {
          return css`
            --styled-border-width: 2px;
          `;
        }

        case 'tonal': {
          return css`
            --styled-bg-color: color-mix(
              in srgb,
              var(--color-ios-primary) 15%,
              transparent
            );
            --styled-pressed-bg-color: color-mix(
              in srgb,
              var(--color-ios-primary) 25%,
              transparent
            );
            --styled-text-color: var(--color-ios-primary);
          `;
        }

        default: {
          return undefined;
        }
      }
    }}

    ${({ size, variant }) => {
      switch (size) {
        case 'large': {
          return css`
            --styled-height: 48px;

            font-size: 17px;
            font-weight: 500;
          `;
        }

        case 'small': {
          return css`
            --styled-height: 28px;

            font-size: 14px;
            font-weight: 500;
            transition-duration: 200ms;

            ${
              variant === 'fill'
                ? css`
                    --styled-border-width: 2px;
                    --styled-pressed-bg-color: transparent;
                    --styled-pressed-text-color: var(--color-ios-primary);
                  `
                : undefined
            }
          `;
        }

        default: {
          return undefined;
        }
      }
    }}

    ${({ inline }) =>
      inline
        ? css`
            display: inline-flex;
            width: auto;
          `
        : undefined}

    ${({ round }) =>
      round
        ? css`
            border-radius: var(--styled-height);
          `
        : undefined}

    @media (hover: hover) {
      cursor: var(--styled-cursor);
    }

    &:active {
      background-color: var(--styled-pressed-bg-color);
      color: var(--styled-pressed-text-color);
    }

    &[data-disabled] {
      opacity: 0.55;
    }
  `,
  (props: ButtonProps) => ({
    ...props,
    ...(!props.onClick && props.disabled === undefined && { disabled: true }),
  }),
);
