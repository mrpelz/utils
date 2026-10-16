import '../tooltip/style.css';
import '../glass/style.css';
import './style.css';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import {
  ComponentProps,
  createContext,
  forwardRef,
  MouseEvent,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { cn, Reserve, withStyle } from '../utils/main.js';
import type {
  RootContextValue,
  SliderLabelProps,
  SliderRootProps,
  SliderSymbolProps,
  SliderTicksProps,
  SliderValueProps,
  ValueRenderer,
  ValueTooltip,
} from './props.js';

export type {
  SliderLabelProps,
  SliderPlacement,
  SliderRootProps,
  SliderSymbolProps,
  SliderTicksProps,
  SliderValueProps,
} from './props.js';

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

// Base UI's root context isn't public; `Slider.Value` needs the range and
// format to find its widest values.
const RootContext = createContext<RootContextValue>({});

const Root = forwardRef<HTMLDivElement, Omit<SliderRootProps, 'ref'>>(
  ({ className, style, thumbAlignment = 'edge', tint, ...props }, ref) => {
    const { format, locale, max, min, step } = props;
    const [valueTooltip, setValueTooltip] = useState<ValueTooltip>(undefined);
    const context = useMemo(
      () => ({ format, locale, max, min, setValueTooltip, step, valueTooltip }),
      [format, locale, max, min, step, valueTooltip],
    );

    return (
      <RootContext.Provider value={context}>
        <BaseSlider.Root
          ref={ref}
          // (Also for its ticks.)
          data-thumb-alignment={thumbAlignment}
          style={withStyle({ '--styled-slider-tint': tint }, style)}
          thumbAlignment={thumbAlignment}
          {...props}
          className={cn('bus-slider-root', className)}
        />
      </RootContext.Provider>
    );
  },
);

const Control = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseSlider.Control>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseSlider.Control
    ref={ref}
    className={cn('bus-slider-control', className)}
    {...props}
  />
));

const Track = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseSlider.Track>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseSlider.Track
    ref={ref}
    className={cn('bus-slider-track', className)}
    {...props}
  />
));

const toPercent = (value: number, min: number, max: number) =>
  max === min ? 0 : ((value - min) / (max - min)) * 100;

// Base UI couples the fill to the thumb's center, which (with edge
// alignment) never reaches the track's ends. The fill is derived from the
// value instead, so it spans the whole track at the maximum.
const Indicator = forwardRef<
  HTMLDivElement,
  Omit<BaseSlider.Indicator.Props, 'ref'>
>(({ className, style, ...props }, ref) => (
  <BaseSlider.Indicator
    ref={ref}
    className={cn('bus-slider-indicator', className)}
    style={(state) => {
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
    }}
    {...props}
  />
));

const Thumb = forwardRef<HTMLDivElement, Omit<BaseSlider.Thumb.Props, 'ref'>>(
  ({ children, index, ...props }, ref) => {
    const { valueTooltip } = useContext(RootContext);

    return (
      // The knob is drawn by `::after`, so only it scales while dragging: Base UI
      // measures the thumb's bounding box to position it, which has to stay the
      // resting size.
      <BaseSlider.Thumb
        ref={ref}
        index={index}
        {...props}
        className={cn('bus-slider-thumb', props.className)}
      >
        {children}
        {valueTooltip ? (
          // Its value in a tooltip (see `Value`), 8px above it (beside it,
          // vertically).
          <span
            aria-hidden="true"
            className="bus-slider-value-bubble bus-tooltip-surface bus-glass-medium"
            data-momentary={valueTooltip === 'momentary' ? '' : undefined}
          >
            <BaseSlider.Value>
              {(formattedValues) => formattedValues[index ?? 0]}
            </BaseSlider.Value>
          </span>
        ) : null}
      </BaseSlider.Thumb>
    );
  },
);

/** Tick marks (iOS 26), to be rendered inside `Slider.Track`. */
const Ticks = forwardRef<HTMLDivElement, SliderTicksProps>(
  ({ count, ...props }, ref) => (
    // Round (Figma renders the ticks as circles, the CSS export has no radius).
    // Where the fill ends at their values, across the whole track (Figma: inset
    // 16px, at the knob's center; but the fill shows through the knob while
    // it's dragged, user), whatever the thumb's alignment.
    <div
      ref={ref}
      aria-hidden="true"
      {...props}
      className={cn('bus-slider-ticks', props.className)}
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
    </div>
  ),
);

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
      <span
        ref={ref}
        {...props}
        className={cn('bus-slider-symbol', props.className)}
        onClick={onClick ?? moveThumb}
      />
    );
  },
);

/** Its label (Base UI's), placed (see `SliderPlacement`). */
const Label = forwardRef<HTMLDivElement, SliderLabelProps>(
  ({ placement, ...props }, ref) => (
    <BaseSlider.Label
      ref={ref}
      data-slider-placement={placement}
      {...props}
      className={cn('bus-slider-label', props.className)}
    />
  ),
);

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
      <BaseSlider.Value
        ref={ref}
        data-slider-placement={placement}
        {...props}
        className={cn('bus-slider-value', props.className)}
      >
        {renderWithReserve}
      </BaseSlider.Value>
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
