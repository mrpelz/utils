import '../glass/style.css';
import './style.css';

import { Button as BaseButton } from '@base-ui/react/button';
import { ComponentProps, forwardRef } from 'react';

import { GlassBackground, useGlassContext } from '../glass/main.js';
import {
  cn,
  useForwardedRef,
  useSecondaryClick,
  withStyle,
} from '../utils/main.js';
import type { ButtonRootProps } from './props.js';

export type { ButtonRootProps } from './props.js';

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
// Its props as attributes and properties (see style.css). Without a click
// handler (nor a secondary one), disabled, unless it submits or resets its
// form.
const Root = forwardRef<HTMLElement, Omit<ButtonRootProps, 'ref'>>(
  (
    {
      children,
      className,
      context: contextProp,
      destructive,
      fill,
      shape,
      size,
      style,
      textColor,
      tint,
      variant = 'borderless',
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const glass = isGlass(variant);
    const context = useGlassContext(ref, glass ? contextProp : undefined);
    const pressable =
      Boolean(props.onClick ?? props.onSecondaryClick) ||
      props.type === 'submit' ||
      props.type === 'reset';
    const rootProps = useSecondaryClick({
      ...props,
      ...(!pressable && props.disabled === undefined && { disabled: true }),
    });
    return (
      <BaseButton
        ref={ref}
        data-destructive={destructive ? '' : undefined}
        data-fill={fill ? '' : undefined}
        data-glass-context={glass ? (context ?? 'auto') : undefined}
        data-shape={shape}
        data-size={size}
        data-variant={variant}
        style={withStyle(
          {
            // (`destructive` wins.)
            ...((destructive ?? tint) && {
              '--styled-button-tint': destructive
                ? 'var(--color-ios-system-red)'
                : tint,
              '--styled-glass-tint': destructive
                ? 'var(--color-ios-system-red)'
                : tint,
            }),
            // (Over the variants'.)
            ...(textColor && {
              '--styled-button-blend': 'normal',
              '--styled-button-color': textColor,
            }),
          },
          style,
        )}
        {...rootProps}
        className={cn('bus-button-root', className)}
      >
        {glass ? (
          // Glass variants draw their material behind the content.
          <>
            <GlassBackground
              kind="button"
              tinted={variant === 'glass-prominent'}
            />
            {/* Figma “Text” frame of glass buttons: the content, drawn above the
               glass and blended with it (vibrant labels), and scaled up with
               the lens while pressed. */}
            <span className="bus-button-content">{children}</span>
          </>
        ) : (
          children
        )}
      </BaseButton>
    );
  },
);

// (Marked, e.g. for fading a bar's content, see `Header`.)
const Icon = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  (props, ref) => (
    // Figma “Symbol”: its glyph (e.g. a `Symbol`, with its badge), in the
    // label's typography (glass: its own).
    <span
      ref={ref}
      data-button-part="icon"
      {...props}
      className={cn('bus-button-icon', props.className)}
    />
  ),
);

const Label = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  (props, ref) => (
    // Figma “Label”, truncated when the button is narrower than its content.
    <span
      ref={ref}
      data-button-part="label"
      {...props}
      className={cn('bus-button-label', props.className)}
    />
  ),
);

export const Button = {
  Root,
  Icon,
  Label,
};
