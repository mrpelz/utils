import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from '@base-ui/react/button';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
  Children,
  ComponentProps,
  forwardRef,
  FunctionComponent,
  isValidElement,
  ReactNode,
} from 'react';

import { Badge, badgeOnSymbol } from './badge.js';
import {
  GlassBackground,
  GlassContext,
  glassContext,
  glassLensGlow,
} from './glass.js';
import {
  css,
  fontWeight,
  SecondaryClickProps,
  useSecondaryClick,
  wrap,
} from './utils.js';

export type ButtonRootProps = BaseButtonProps &
  SecondaryClickProps & {
    /** Brightness behind glass variants (default: follows the color scheme). */
    context?: GlassContext;
    cursor?: Properties['cursor'];
    /** Figma “Destructive”: tints the button red. */
    destructive?: boolean;
    /**
     * Grows to fill the available width (a block, or a flex item sharing a
     * row's free space), its content centered (Figma: hugging its content).
     */
    fill?: boolean;
    /**
     * `circle` is square with a round shape, for symbol-only buttons;
     * `roundedRectangle` has 6px corners (large: 12px; Figma “Date and time -
     * Collapsed”, large borderless buttons).
     */
    shape?: 'capsule' | 'circle' | 'roundedRectangle';
    /** Figma “Size” (not applicable to glass variants, which have one size). */
    size?: 'large' | 'medium' | 'small';
    /**
     * Its text and symbols' color, over its variant's (e.g. for a light
     * `tint` behind them; unblended on glass).
     */
    textColor?: string;
    /**
     * The button's color (labels, fills, tinted glass; UIKit `tintColor`,
     * e.g. Notes' yellow; default: the primary color). `destructive` wins.
     */
    tint?: string;
    /** Figma “Style”, and “Button - Liquid Glass” with “Tinted”. */
    variant?:
      | 'bordered'
      | 'bordered-prominent'
      | 'bordered-secondary'
      | 'borderless'
      | 'glass'
      | 'glass-prominent';
  };

// A borderless button's text (without a size), as its context gives it
// (`--styled-button-plain-*`, e.g. a list row's); otherwise Subheadline.
// Also its end margin (e.g. a list row's, its content aligned with the row's
// details, its padding beyond them), the gap of its label and symbol, and
// the symbol's weight; its inline padding and pressed fill (e.g. a sidebar's
// toolbar's).
const plainText = css`
  --styled-button-symbol-font-size: var(
    --styled-button-plain-size,
    var(--font-ios-subheadline-size)
  );
  --styled-button-symbol-line-height: var(
    --styled-button-plain-line-height,
    var(--font-ios-subheadline-line-height)
  );
  --styled-button-symbol-font-weight: var(
    --styled-button-plain-symbol-weight,
    400
  );
  --styled-button-background-pressed: var(
    --styled-button-plain-background-pressed,
    color-mix(
      in srgb,
      var(--styled-button-background),
      var(--styled-button-color) 15%
    )
  );

  font-size: var(--styled-button-plain-size, var(--font-ios-subheadline-size));
  gap: var(--styled-button-plain-gap, 4px);
  letter-spacing: var(
    --styled-button-plain-tracking,
    var(--font-ios-subheadline-tracking)
  );
  line-height: var(
    --styled-button-plain-line-height,
    var(--font-ios-subheadline-line-height)
  );
  margin-inline-end: var(--styled-button-plain-margin-end, 0);
  padding-inline: var(--styled-button-plain-padding-inline, 14px);
`;

/** The button's tint color at the given opacity. */
const tintAlpha = (alpha: number) =>
  `color-mix(in srgb, var(--styled-button-tint) ${alpha}%, transparent)`;

const isGlass = (variant: ButtonRootProps['variant']) =>
  variant === 'glass' || variant === 'glass-prominent';

// Source: Apple iOS 26 Figma (Button: Size, Style, Label Type, Enabled,
// Destructive; Button - Liquid Glass: Tinted, BG Context).
// Labels and symbols are in the Subheadline (small, medium) and Body
// (large) text styles; glass buttons' labels (17/20px, no tracking) are in
// none.
//
// The padding and line height give the Figma heights (small 28px, medium
// 34px, large 50px), which are also the minimum sizes; glass buttons are
// 48px high (Figma: 6px padding around a 36px “Text” frame).
//
// HIG (Buttons): a hit region of at least 44×44pt, and always a press state.
// Figma has no press state: classic buttons follow Framework7
// (`button-ios.less`: the tint at 15% behind the label, a lighter fill for
// filled buttons); glass buttons turn into a glass lens like the slider thumb
// (scaled up, a tinted glow behind, the fill cleared, the lens' edge), and
// their content scales up less than the lens.
// eslint-disable-next-line prettier/prettier
const StyledRoot = styled<typeof BaseButton, ButtonRootProps>(BaseButton, forwardRef)`
  --styled-cursor: attr(
    cursor type(\<custom-ident\>),
    ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')}
  );
  --styled-button-tint: var(--color-ios-primary);
  --styled-button-background: transparent;
  --styled-button-background-disabled: var(--styled-button-background);
  --styled-button-background-pressed: color-mix(
    in srgb,
    var(--styled-button-background),
    var(--styled-button-color) 15%
  );
  --styled-button-color: var(--styled-button-tint);
  --styled-button-color-disabled: var(--color-ios-tertiary-label);
  --styled-button-blend: normal;
  --styled-button-radius: 1000px;
  --styled-button-size: 34px;
  --styled-button-symbol-font-size: var(--font-ios-subheadline-size);
  --styled-button-font-weight: 400;
  --styled-button-symbol-font-weight: 400;
  --styled-button-symbol-line-height: var(--font-ios-subheadline-line-height);
  --styled-glass-outset: 0px;

  position: relative;
  display: inline-flex;
  min-width: var(--styled-button-size);
  min-height: var(--styled-button-size);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 7px 14px;
  border: 0;
  border-radius: var(--styled-button-radius);
  margin: 0;
  appearance: none;
  background-color: var(--styled-button-background);
  color: var(--styled-button-color);
  font-family: inherit;
  font-size: var(--font-ios-subheadline-size);
  ${fontWeight('var(--styled-button-font-weight)')}
  gap: 4px;
  letter-spacing: var(--font-ios-subheadline-tracking);
  line-height: var(--font-ios-subheadline-line-height);
  text-align: center;
  text-decoration: none;
  text-transform: none;
  transition-duration: 100ms;
  transition-property: background-color;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;

  ${({ fill }) =>
    fill
      ? css`
          display: flex;
          width: 100%;
          flex: 1 1 auto;
        `
      : undefined}
  ${({ tint }) =>
    tint
      ? css`
          --styled-button-tint: ${tint};
          --styled-glass-tint: ${tint};
        `
      : undefined}
  ${({ destructive }) =>
    destructive
      ? css`
          --styled-button-tint: var(--color-ios-system-red);
          --styled-glass-tint: var(--color-ios-system-red);
        `
      : undefined}

  ${({ size }) => {
    switch (size) {
      case 'large': {
        return css`
          --styled-button-size: 50px;
          --styled-button-symbol-font-size: var(--font-ios-body-size);
          --styled-button-symbol-line-height: var(--font-ios-body-line-height);

          padding: 14px 20px;
          font-size: var(--font-ios-body-size);
          letter-spacing: var(--font-ios-body-tracking);
          line-height: var(--font-ios-body-line-height);
        `;
      }

      case 'small': {
        return css`
          --styled-button-size: 28px;

          padding: 4px 10px;
          gap: 3px;
        `;
      }

      default: {
        return undefined;
      }
    }
  }}

  ${({ context, destructive, size, variant }) => {
    switch (variant) {
      case 'bordered':
      case 'bordered-secondary': {
        return css`
          --styled-button-background: ${
            destructive
              ? tintAlpha(14)
              : 'var(--color-ios-tertiary-system-fill)'
          };
          --styled-button-color: ${
            variant === 'bordered-secondary' && !destructive
              ? 'var(--color-ios-label)'
              : 'var(--styled-button-tint)'
          };
          --styled-button-color-disabled: ${
            destructive ? tintAlpha(50) : 'var(--color-ios-tertiary-label)'
          };
        `;
      }

      case 'bordered-prominent': {
        return css`
          --styled-button-background: var(--styled-button-tint);
          --styled-button-background-disabled: ${tintAlpha(20)};
          --styled-button-color: rgb(255 255 255);
          --styled-button-color-disabled: rgb(255 255 255 / 30%);
        `;
      }

      case 'glass':
      case 'glass-prominent': {
        const content =
          variant === 'glass'
            ? '--styled-glass-content'
            : '--styled-glass-content-prominent';

        return css`
          ${glassContext(context)}
          --styled-button-size: 48px;
          --styled-button-background-pressed: transparent;
          --styled-button-color: var(${content});
          --styled-button-color-disabled: var(${content}-disabled);
          --styled-button-blend: var(${content}-blend);
          --styled-button-symbol-font-size: 19px;
          --styled-button-font-weight: 510;
          --styled-button-symbol-font-weight: 590;
          --styled-button-symbol-line-height: 22px;

          padding: 6px 20px;
          font-feature-settings: 'ss16';

          &::before {
            ${glassLensGlow(
              'var(--styled-glass-tint, var(--glass-ios-tint))',
              'var(--styled-glass-pressed, 0)',
            )}
          }

          font-size: 17px;
          gap: 4px;
          letter-spacing: 0;
          line-height: 20px;
        `;
      }

      default: {
        return css`
          --styled-button-color-disabled: ${
            destructive ? tintAlpha(50) : 'var(--color-ios-tertiary-label)'
          };
          --styled-button-radius: ${size === 'large' ? '12px' : '40px'};

          /* Borderless, without a size: in its context's text style, if it
             gives one (e.g. a list row's: Body, as its details). */
          ${size === undefined ? plainText : ''}
        `;
      }
    }
  }}

  /* (After the variants': over theirs.) */
  ${({ textColor }) =>
    textColor
      ? css`
          --styled-button-color: ${textColor};
          --styled-button-blend: normal;
        `
      : undefined}

  ${({ shape, size }) => {
    switch (shape) {
      case 'circle': {
        return css`
          --styled-button-radius: 1000px;
          --styled-button-plain-padding-inline: 0px;

          padding: 0;
        `;
      }
      case 'roundedRectangle': {
        return css`
          --styled-button-radius: ${size === 'large' ? '12px' : '6px'};
        `;
      }
      default: {
        return undefined;
      }
    }
  }}

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }

  /* Hit region: at least 44×44px, centered. */
  &::after {
    position: absolute;
    content: '';
    inset: min(0px, calc(50% - 22px));
  }

  &:active:not([data-disabled]) {
    --styled-glass-pressed: 1;
    --styled-glass-scale: var(--glass-ios-lens-scale);
    --styled-button-content-scale: var(--glass-ios-lens-content-scale);

    background-color: var(--styled-button-background-pressed);
  }

  &[data-disabled] {
    background-color: var(--styled-button-background-disabled);
    color: var(--styled-button-color-disabled);
  }

  /* A badge on its symbol (see Badge). */
  ${badgeOnSymbol('[data-button-part=symbol]')}
`;

// Figma “Text” frame of glass buttons: the content, drawn above the glass and
// blended with it as a group (vibrant labels), and scaled up with the lens
// while pressed.
const Content = styled('span')`
  position: relative;
  display: inline-flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  gap: inherit;
  mix-blend-mode: var(--styled-button-blend);
  scale: var(--styled-button-content-scale, none);
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: scale;
`;

const isBadge = (child: ReactNode) =>
  isValidElement(child) && (child as { type: unknown }).type === Badge;

// Glass variants draw their material behind the content; badges stay out of
// it (not blended with the glass, nor scaled). (Typed loosely: Base UI's
// `ref` type, a union with its own callbacks, takes no forwarded ref.)
const ContentRoot = wrap(StyledRoot, (props: ButtonRootProps) => {
  if (!isGlass(props.variant)) return props;

  const children = Children.toArray(props.children);

  return {
    ...props,
    children: (
      <>
        <GlassBackground
          kind="button"
          tinted={props.variant === 'glass-prominent'}
        />
        <Content>{children.filter((child) => !isBadge(child))}</Content>
        {children.filter((child) => isBadge(child))}
      </>
    ),
  };
}) as FunctionComponent<Record<string, unknown>>;

// Without a click handler (nor a secondary one), disabled, unless it
// submits or resets its form.
const Root = forwardRef<unknown, Omit<ButtonRootProps, 'ref'>>((props, ref) => {
  const pressable =
    Boolean(props.onClick ?? props.onSecondaryClick) ||
    props.type === 'submit' ||
    props.type === 'reset';
  const rootProps = useSecondaryClick({
    ...props,
    ...(!pressable && props.disabled === undefined && { disabled: true }),
  });

  return (
    <ContentRoot
      ref={ref}
      {...rootProps}
    />
  );
}) as FunctionComponent<ButtonRootProps>;

// Figma “Symbol”: the glyph, in the label's typography (glass: its own).
const StyledSymbol = styled('span', forwardRef)`
  display: inline-flex;
  min-height: 1lh;
  align-items: center;
  justify-content: center;
  font-size: var(--styled-button-symbol-font-size);
  ${fontWeight('var(--styled-button-symbol-font-weight)')}
  line-height: var(--styled-button-symbol-line-height);
`;

// Figma “Label”, truncated when the button is narrower than its content.
const StyledLabel = styled('span', forwardRef)`
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
`;

// (Marked, e.g. for fading a bar's content, see `Header`.)
const ButtonSymbol = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  (props, ref) => (
    <StyledSymbol
      ref={ref}
      data-button-part="symbol"
      {...props}
    />
  ),
);

const Label = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  (props, ref) => (
    <StyledLabel
      ref={ref}
      data-button-part="label"
      {...props}
    />
  ),
);

export const Button = {
  Root,
  Symbol: ButtonSymbol,
  Label,
};
