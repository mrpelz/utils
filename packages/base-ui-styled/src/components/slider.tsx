import { Slider as BaseSlider } from '@base-ui/react/slider';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'react';

import { glassLensGlow } from './glass.js';
import { fontWeight, wrap } from './utils.js';

// Source: Apple iOS 26 Figma (“Sliders”, light and dark appearance), with
// Figma colors mapped to UIKit semantic colors: track `systemFill`, fill the
// app tint (`--color-ios-primary`, i.e. `systemBlue`), ticks
// `quaternaryLabel`, symbols `secondaryLabel`; the knob (`#fff`) has no
// semantic equivalent. The knob shadow matches Konsta UI `styles/base.css`
// (`--shadow-ios-thumb`).
// The pressed glass effect and everything Figma does not specify come from
// Framework7 `components/range/range.less`, `range-ios.less` (iOS values,
// `.range-knob-active-state`): control size, transitions, pressed scale, glow.
//
// Deviations:
// - The track does not clip (`overflow: hidden`), as Base UI renders the
//   thumb inside it; the indicator inherits the track's radius instead.
// - The knob surface and glass effect are drawn by the thumb's `::after`,
//   which alone scales while dragging (Base UI measures the thumb's box for
//   positioning); only its `transform`, `background-color` and `box-shadow`
//   transition (Konsta UI `--transition-ios-range-thumb`).
// - Minimum control length: ten times the knob width (not specified by any
//   source).
// - The pressed state is driven by Base UI's `data-dragging`.
// - Vertical sliders put the minimum symbol at the bottom.
// - The fill is derived from the value (Base UI couples it to the thumb's
//   center), so it spans the whole track at the maximum.
// - The browser's default focus ring is kept.

export type SliderRootProps = BaseSlider.Root.Props & {
  cursor?: Properties['cursor'];
};

// eslint-disable-next-line prettier/prettier
const Root = wrap(styled<typeof BaseSlider.Root, SliderRootProps>(BaseSlider.Root, forwardRef)`
    --styled-cursor: attr(
      cursor type(\<custom-ident\>),
      ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')}
    );
    --styled-slider-size: 28px;
    --styled-slider-bar-size: 6px;
    --styled-slider-knob-width: 38px;
    --styled-slider-knob-height: 24px;

    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    align-self: center;
    gap: 12px;
    touch-action: pan-y;
    user-select: none;

    @media (hover: hover) {
      cursor: var(--styled-cursor);
    }

    &[data-orientation='vertical'] {
      width: auto;
      height: 100%;
      flex-direction: column-reverse;
      touch-action: pan-x;
    }

    &[data-disabled] {
      opacity: 0.55;
    }
  `,
  (props: SliderRootProps) => ({
    ...props,
    thumbAlignment: props.thumbAlignment ?? 'edge',
  }),
);

const Control = styled(BaseSlider.Control, forwardRef)`
  position: relative;
  display: flex;
  min-width: calc(var(--styled-slider-knob-width) * 10);
  min-height: var(--styled-slider-size);
  flex-grow: 1;
  align-items: center;

  &[data-orientation='vertical'] {
    min-width: var(--styled-slider-size);
    min-height: calc(var(--styled-slider-knob-width) * 10);
    align-items: stretch;
    align-self: stretch;
    justify-content: center;
  }
`;

const Track = styled(BaseSlider.Track, forwardRef)`
  position: relative;
  width: 100%;
  height: var(--styled-slider-bar-size);
  border-radius: 3px;
  background-color: var(--color-ios-system-fill);

  &[data-orientation='vertical'] {
    width: var(--styled-slider-bar-size);
    height: auto;
  }
`;

const StyledIndicator = styled(BaseSlider.Indicator, forwardRef)`
  border-radius: inherit;
  background-color: var(--color-ios-primary);
`;

const toPercent = (value: number, min: number, max: number) =>
  max === min ? 0 : ((value - min) / (max - min)) * 100;

// Base UI couples the fill to the thumb's center, which (with edge
// alignment) never reaches the track's ends. The fill is derived from the
// value instead, so it spans the whole track at the maximum.
const Indicator = wrap(
  StyledIndicator,
  ({
    style,
    ...props
  }: BaseSlider.Indicator.Props): BaseSlider.Indicator.Props => ({
    ...props,
    style: (state) => {
      const { max, min, orientation, values } = state;
      const range = values.length > 1;

      const start = range ? toPercent(values[0] ?? min, min, max) : 0;
      const end = toPercent(values.at(-1) ?? min, min, max);

      const geometry: React.CSSProperties =
        orientation === 'vertical'
          ? { bottom: `${start}%`, height: `${end - start}%` }
          : { insetInlineStart: `${start}%`, width: `${end - start}%` };

      return {
        ...geometry,
        ...(typeof style === 'function' ? style(state) : style),
      };
    },
  }),
);

// The knob is drawn by `::after`, so only it scales while dragging: Base UI
// measures the thumb's bounding box to position it, which has to stay the
// resting size.
const Thumb = styled(BaseSlider.Thumb, forwardRef)`
  z-index: 1;
  width: var(--styled-slider-knob-width);
  height: var(--styled-slider-knob-height);
  box-sizing: border-box;

  &[data-orientation='vertical'] {
    width: var(--styled-slider-knob-height);
    height: var(--styled-slider-knob-width);
  }

  &::before {
    ${glassLensGlow('var(--color-ios-primary)', '0')}
  }

  &::after {
    position: absolute;
    border-radius: 100px;
    background-color: #fff;
    box-shadow:
      0 0.5px 4px rgb(0 0 0 / 12%),
      0 6px 13px rgb(0 0 0 / 12%);
    content: '';
    inset: 0;
    transition-duration: var(--glass-ios-lens-duration);
    transition-property: transform, background-color, box-shadow;
  }

  &[data-dragging] {
    &::before {
      opacity: 1;
    }

    &::after {
      background-color: transparent;
      box-shadow:
        var(--glass-ios-lens-shadow),
        0 0.5px 4px rgb(0 0 0 / 12%),
        0 6px 13px rgb(0 0 0 / 12%);
      transform: scale(var(--glass-ios-lens-scale));
    }
  }
`;

// Figma: inset 16px from the track's ends, so the ticks line up with the
// knob's center at their values; round (Figma renders the ticks as circles,
// the CSS export has no radius).
const StyledTicks = styled('div', forwardRef)`
  position: absolute;
  top: calc(50% - 2px + 9px);
  right: 16px;
  left: 16px;
  display: flex;
  height: 4px;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;

  & > * {
    width: 4px;
    height: 4px;
    flex: none;
    border-radius: 50%;
    background-color: var(--color-ios-quaternary-label);
  }

  [data-orientation='vertical'] > & {
    width: 4px;
    height: auto;
    flex-direction: column;
    inset: 16px auto 16px calc(50% - 2px + 9px);
  }
`;

export type SliderTicksProps = React.ComponentProps<'div'> & {
  /** Number of ticks, usually `(max - min) / step + 1`. */
  count: number;
};

/** Tick marks (iOS 26), to be rendered inside `Slider.Track`. */
const Ticks = forwardRef<HTMLDivElement, SliderTicksProps>(
  ({ count, ...props }, ref) => (
    <StyledTicks
      ref={ref}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <span key={index} />
      ))}
    </StyledTicks>
  ),
);

/**
 * Minimum/maximum value symbol (UIKit `minimumValueImage`,
 * `maximumValueImage`), to be rendered inside `Slider.Root`.
 */
const ValueSymbol = styled('span', forwardRef)`
  display: flex;
  min-width: 32px;
  flex: none;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  color: var(--color-ios-secondary-label);
  font-size: 17px;
  ${fontWeight(590)}
  line-height: 22px;
  text-align: center;
`;

export const Slider = {
  ...BaseSlider,
  Root,
  Control,
  Track,
  Indicator,
  Thumb,
  Ticks,
  Symbol: ValueSymbol,
};
