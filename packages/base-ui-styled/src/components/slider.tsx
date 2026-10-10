import { Slider as BaseSlider } from '@base-ui/react/slider';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
  createContext,
  forwardRef,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { glassLensGlow } from './glass.js';
import { tooltipSurface } from './tooltip.js';
import { textStyle } from './typography.js';
import { Reserve, wrap } from './utils.js';

// Source: Apple iOS 26 Figma (“Sliders”, light and dark appearance), with
// Figma colors mapped to UIKit semantic colors: track `systemFill`, fill the
// tint (`tint`; default: the app's, `--color-ios-primary`), ticks
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
// - The control's length (Figma example: 280px) is a minimum.
// - The pressed state is driven by Base UI's `data-dragging`.
// - Vertical sliders put the minimum symbol at the bottom.
// - The fill is derived from the value (Base UI couples it to the thumb's
//   center), so it spans the whole track at the maximum.
// - Focused by keyboard, the knob has a 2px ring in the tint, 2px around
//   it (Figma: none; Base UI focuses a visually hidden input, which shows no
//   ring).
// - `Slider.Value` (not in UIKit or Figma) is in the Body text style (the
//   symbols: Body, emphasized), with tabular numerals, and reserves the width
//   of its widest value. `Slider.Label` (neither) is in Body, in the label
//   color. Both are where they are among the parts, or by `placement`:
//   before or after them all, or on a line above or below (the label at its
//   start, the value at its end); the value also in a tooltip (see
//   `Tooltip`) above each thumb (beside it, vertically), its own value.

export type SliderRootProps = BaseSlider.Root.Props & {
  cursor?: Properties['cursor'];
  /**
   * The fill's color, and the pressed knob's glow (UIKit
   * `minimumTrackTintColor`).
   * @default the app's tint
   */
  tint?: string;
};

// eslint-disable-next-line prettier/prettier
const StyledRoot = wrap(styled<typeof BaseSlider.Root, SliderRootProps>(BaseSlider.Root, forwardRef)`
    --styled-cursor: attr(
      cursor type(\<custom-ident\>),
      ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')}
    );
    --styled-slider-size: 28px;
    --styled-slider-bar-size: 6px;
    --styled-slider-knob-width: 38px;
    --styled-slider-knob-height: 24px;
    --styled-slider-min-length: 280px;
    --styled-slider-tint: ${({ tint }) => tint ?? 'var(--color-ios-primary)'};

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

    /* Placed (see Label, Value): before or after the parts, or on a line
       above or below them (after a line break). */
    & > [data-slider-placement='inline-start'] {
      order: -1;
    }

    & > [data-slider-placement='inline-end'] {
      order: 1;
    }

    & > [data-slider-placement='block-start'] {
      order: -3;
      margin-block-end: -6px;
    }

    & > [data-slider-placement='block-end'] {
      order: 3;
      margin-block-start: -6px;
    }

    /* (Separate, nested: goober mangles selector lists with parentheses,
       and selectors continuing after them.) */
    &:has(> [data-slider-placement='block-start']) {
      flex-wrap: wrap;

      &::before {
        flex-basis: 100%;
        order: -2;
        content: '';
      }
    }

    &:has(> [data-slider-placement='block-end']) {
      flex-wrap: wrap;

      &::after {
        flex-basis: 100%;
        order: 2;
        content: '';
      }
    }

    &
      > [data-slider-placement='block-start']
      + [data-slider-placement='block-start'],
    &
      > [data-slider-placement='block-end']
      + [data-slider-placement='block-end'] {
      margin-inline-start: auto;
    }
  `,
  (props: SliderRootProps) => ({
    ...props,
    // (Also for its ticks.)
    'data-thumb-alignment': props.thumbAlignment ?? 'edge',
    thumbAlignment: props.thumbAlignment ?? 'edge',
  }),
);

type RootContextValue = Pick<
  BaseSlider.Root.Props,
  'format' | 'locale' | 'max' | 'min' | 'step'
> & {
  // Its value in tooltips on its thumbs (see `Value`): always, or only
  // while hovered or dragged (momentary).
  setValueTooltip?: (shown: ValueTooltip) => void;
  valueTooltip?: ValueTooltip;
};

type ValueTooltip = 'always' | 'momentary' | undefined;

// Base UI's root context isn't public; `Slider.Value` needs the range and
// format to find its widest values.
const RootContext = createContext<RootContextValue>({});

const Root = forwardRef<HTMLDivElement, Omit<SliderRootProps, 'ref'>>(
  (props, ref) => {
    const { format, locale, max, min, step } = props;
    const [valueTooltip, setValueTooltip] = useState<ValueTooltip>(undefined);
    const context = useMemo(
      () => ({ format, locale, max, min, setValueTooltip, step, valueTooltip }),
      [format, locale, max, min, step, valueTooltip],
    );

    return (
      <RootContext.Provider value={context}>
        <StyledRoot
          ref={ref}
          {...props}
        />
      </RootContext.Provider>
    );
  },
);

const Control = styled(BaseSlider.Control, forwardRef)`
  position: relative;
  display: flex;
  min-width: var(--styled-slider-min-length);
  min-height: var(--styled-slider-size);
  flex-grow: 1;
  align-items: center;

  &[data-orientation='vertical'] {
    min-width: var(--styled-slider-size);
    min-height: var(--styled-slider-min-length);
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
  background-color: var(--styled-slider-tint);
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
const StyledThumb = styled(BaseSlider.Thumb, forwardRef)`
  z-index: 1;
  width: var(--styled-slider-knob-width);
  height: var(--styled-slider-knob-height);
  box-sizing: border-box;

  &[data-orientation='vertical'] {
    width: var(--styled-slider-knob-height);
    height: var(--styled-slider-knob-width);
  }

  &::before {
    ${glassLensGlow('var(--styled-slider-tint)', '0')}
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

  /* Focused by keyboard (its hidden input): a ring in the tint around the
     knob (as List's), following its shape. */
  &:has(input:focus-visible) {
    &::after {
      outline: 2px solid var(--styled-slider-tint);
      outline-offset: 2px;
    }

    /* (Its momentary tooltip, see ValueBubble.) */
    & > [data-momentary] {
      opacity: 1;
      scale: 1;
    }
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

// Its value in a tooltip (see `Value`), 8px above it (beside it,
// vertically).
const ValueBubble = styled('span')`
  ${tooltipSurface}

  position: absolute;
  z-index: 1;
  bottom: calc(100% + 8px);
  left: 50%;
  font-variant-numeric: tabular-nums;
  translate: -50% 0;
  white-space: nowrap;

  [data-orientation='vertical'] > & {
    top: 50%;
    bottom: auto;
    left: calc(100% + 8px);
    translate: 0 -50%;
  }

  /* Momentary: shown while the slider is hovered (a pointer that can), or
     its knob dragged (also by touch) or focused by keyboard (see Thumb; not
     while it stays focused after being dragged). */
  &[data-momentary] {
    opacity: 0;
    scale: 0.85;
    transition-duration: 150ms;
    transition-property: opacity, scale;
  }

  @media (hover: hover) {
    [data-thumb-alignment]:hover &[data-momentary] {
      opacity: 1;
      scale: 1;
    }
  }

  [data-dragging] > &[data-momentary] {
    opacity: 1;
    scale: 1;
  }
`;

const Thumb = forwardRef<HTMLDivElement, Omit<BaseSlider.Thumb.Props, 'ref'>>(
  ({ children, index, ...props }, ref) => {
    const { valueTooltip } = useContext(RootContext);

    return (
      <StyledThumb
        ref={ref}
        index={index}
        {...props}
      >
        {children}
        {valueTooltip ? (
          <ValueBubble
            aria-hidden="true"
            data-momentary={valueTooltip === 'momentary' ? '' : undefined}
          >
            <BaseSlider.Value>
              {(formattedValues) => formattedValues[index ?? 0]}
            </BaseSlider.Value>
          </ValueBubble>
        ) : null}
      </StyledThumb>
    );
  },
);

// Round (Figma renders the ticks as circles, the CSS export has no radius).
// Where the fill ends at their values, across the whole track (Figma: inset
// 16px, at the knob's center; but the fill shows through the knob while
// it's dragged, user), whatever the thumb's alignment.
const StyledTicks = styled('div', forwardRef)`
  position: absolute;
  top: calc(50% - 2px + 9px);
  right: 0;
  left: 0;
  height: 4px;
  pointer-events: none;

  & > * {
    position: absolute;
    top: 0;
    left: var(--styled-slider-tick);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--color-ios-quaternary-label);
    translate: -50% 0;
  }

  [data-orientation='vertical'] > & {
    width: 4px;
    height: auto;
    inset: 0 auto 0 calc(50% - 2px + 9px);
  }

  /* (Vertical: the minimum at the bottom.) */
  [data-orientation='vertical'] > & > * {
    top: auto;
    bottom: var(--styled-slider-tick);
    left: 0;
    translate: 0 50%;
  }
`;

export type SliderTicksProps = React.ComponentProps<'div'> & {
  /**
   * The values across the slider (usually `(max - min) / step + 1`); ticks
   * mark those between its ends (not the ends themselves).
   */
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
      {Array.from({ length: Math.max(0, count - 2) }, (_, index) => (
        <span
          key={index}
          style={
            {
              '--styled-slider-tick': `${String(((index + 1) / (count - 1)) * 100)}%`,
            } as React.CSSProperties
          }
        />
      ))}
    </StyledTicks>
  ),
);

const StyledSymbol = styled('span', forwardRef)`
  display: flex;
  min-width: 32px;
  min-height: 1lh;
  flex: none;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  color: var(--color-ios-secondary-label);
  ${textStyle('body', { emphasized: true })}
  text-align: center;
`;

export type SliderSymbolProps = React.ComponentProps<'span'> & {
  /**
   * The end of the slider the symbol stands for. Clicking it moves the first
   * thumb to the minimum (`min`), or the last thumb to the maximum (`max`), as
   * the Home/End keys do; with a range, the other end stays. An `onClick`
   * replaces this behavior.
   */
  edge: 'max' | 'min';
};

/**
 * Minimum/maximum value symbol (UIKit `minimumValueImage`,
 * `maximumValueImage`), to be rendered inside `Slider.Root`.
 */
const ValueSymbol = forwardRef<HTMLSpanElement, SliderSymbolProps>(
  ({ edge, onClick, ...props }, ref) => {
    // Base UI has no API to set an uncontrolled value from outside, so this
    // dispatches Home/End to the thumb's input, reusing its handling (range
    // limits, change and commit callbacks). Base UI focuses the thumb as for a
    // key press; it's blurred again unless it was focused before.
    const moveThumb = useCallback(
      ({ currentTarget }: MouseEvent<HTMLSpanElement>) => {
        const root = currentTarget.parentElement;
        if (!root || Object.hasOwn(root.dataset, 'disabled')) return;

        const inputs = [...root.querySelectorAll('input[type="range"]')];
        const input = edge === 'min' ? inputs[0] : inputs.at(-1);
        if (!(input instanceof HTMLInputElement) || input.disabled) return;

        const focused = input.ownerDocument.activeElement === input;
        input.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: edge === 'min' ? 'Home' : 'End',
          }),
        );
        if (!focused) input.blur();
      },
      [edge],
    );

    return (
      <StyledSymbol
        ref={ref}
        {...props}
        onClick={onClick ?? moveThumb}
      />
    );
  },
);

const StyledValue = styled(BaseSlider.Value, forwardRef)`
  display: grid;
  flex: none;
  color: var(--color-ios-secondary-label);
  ${textStyle('body')}
  font-variant-numeric: tabular-nums;
  justify-items: end;

  /* In tooltips (see Thumb): for assistive technology only. */
  &[data-slider-placement='tooltip'],
  &[data-slider-placement='momentary-tooltip'] {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

/** Where a label or value is (default: where it is among the parts). */
export type SliderPlacement =
  'block-end' | 'block-start' | 'inline-end' | 'inline-start';

export type SliderLabelProps = Omit<BaseSlider.Label.Props, 'ref'> & {
  placement?: SliderPlacement;
};

const StyledLabel = styled(BaseSlider.Label, forwardRef)`
  flex: none;
  color: var(--color-ios-label);
  ${textStyle('body')}
`;

/** Its label (Base UI's), placed (see `SliderPlacement`). */
const Label = forwardRef<HTMLDivElement, SliderLabelProps>(
  ({ placement, ...props }, ref) => (
    <StyledLabel
      ref={ref}
      data-slider-placement={placement}
      {...props}
    />
  ),
);

export type SliderValueProps = Omit<BaseSlider.Value.Props, 'ref'> & {
  /**
   * Placed (see `SliderPlacement`), or in a tooltip on each thumb: always,
   * or momentary (while hovered, or a knob dragged or focused).
   */
  placement?: SliderPlacement | 'momentary-tooltip' | 'tooltip';
};

type ValueRenderer = (
  formattedValues: readonly string[],
  values: readonly number[],
) => ReactNode;

/**
 * The formatted value(s), taking up the width of the widest value between
 * `min` and `max` (by digits and fraction digits of `step`), so the slider
 * doesn't shift while it changes.
 */
const Value = forwardRef<HTMLOutputElement, SliderValueProps>(
  ({ children, placement, ...props }, ref) => {
    const {
      format,
      locale,
      max = 100,
      min = 0,
      setValueTooltip,
      step = 1,
    } = useContext(RootContext);

    // In tooltips on the thumbs (always, or momentary).
    let tooltip: ValueTooltip;
    if (placement === 'tooltip') tooltip = 'always';
    else if (placement === 'momentary-tooltip') tooltip = 'momentary';
    useLayoutEffect(() => {
      if (!tooltip) return undefined;
      setValueTooltip?.(tooltip);
      return () => setValueTooltip?.(undefined);
    }, [setValueTooltip, tooltip]);

    const render = useCallback<ValueRenderer>(
      (formattedValues, values) =>
        typeof children === 'function'
          ? children(formattedValues, values)
          : formattedValues.join(' – '),
      [children],
    );

    const renderWithReserve = useCallback<ValueRenderer>(
      (formattedValues, values) => {
        const formatter = new Intl.NumberFormat(locale, format);
        // Tabular numerals make width depend on sign, digits and fraction
        // digits only: the extremes have the most digits, a step off them
        // the fraction digits of `step`.
        const extremes = [min, max, min + step, max - step].filter(
          (value) => value >= min && value <= max,
        );

        return (
          <Reserve
            reserve={extremes.map((extreme) => {
              const reserveValues = values.map(() => extreme);
              return render(
                reserveValues.map((value) => formatter.format(value)),
                reserveValues,
              );
            })}
          >
            {render(formattedValues, values)}
          </Reserve>
        );
      },
      [format, locale, max, min, render, step],
    );

    return (
      <StyledValue
        ref={ref}
        data-slider-placement={placement}
        {...props}
      >
        {renderWithReserve}
      </StyledValue>
    );
  },
);

export const Slider = {
  ...BaseSlider,
  Root,
  Label,
  Value,
  Control,
  Track,
  Indicator,
  Thumb,
  Ticks,
  Symbol: ValueSymbol,
};
