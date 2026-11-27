import { forwardRef, type ReactNode, useContext, useRef } from 'react';

import { colorSchemeStyle } from '../glass/main.js';
import { Slider } from '../slider/main.js';
import { cn } from '../utils/main.js';
import { pressProps } from './press.js';
import type { CardOrientation, CardSliderProps } from './props.js';
import { CardBlendScope, useCardOrientation } from './root.js';
import {
  TintProbe,
  useControlled,
  useFillScheme,
  useGivenTint,
} from './shared.js';

// A slider filling its card (`Card.Slider`): its fill the card's
// background, what's over it drawn again in the fill's colors.

/** A slider's value's words, as `Slider.Value`'s children (one value). */
type ValueText = (
  formattedValues: readonly string[],
  values: readonly number[],
) => ReactNode;

/** Its value's words (see `children`) as `Slider.Value`'s children. */
const valueTextOf = (
  children: CardSliderProps['children'],
): ValueText | undefined =>
  children
    ? (formattedValues, values) =>
        children(formattedValues[0] ?? '', values[0] ?? 0)
    : undefined;

/**
 * What's over a slider's fill, drawn again in it: a layer at the card's
 * size, in the fill's color scheme, its label, its value and its ticks in
 * it; the card's own parts portaled in (see `CardBlendScope`). Hidden from
 * assistive technology, inert.
 */
const FillCopies = ({
  label,
  layerRef,
  orientation,
  scheme,
  ticks,
  valueText,
}: {
  label: string;
  layerRef: ((layer: HTMLElement | null) => void) | undefined;
  orientation: CardOrientation;
  scheme: 'dark' | 'light';
  ticks: number | undefined;
  valueText: ValueText | undefined;
}) => (
  <span
    ref={layerRef}
    aria-hidden
    inert
    className="uikit-card-blend"
    data-color-scheme={scheme}
    data-orientation={orientation}
    style={colorSchemeStyle(scheme)}
  >
    <span
      className="uikit-slider-label"
      data-card-copy=""
    >
      {label}
    </span>
    <Slider.Value data-card-copy="">{valueText}</Slider.Value>
    {ticks === undefined ? null : (
      <Slider.Ticks
        count={ticks}
        data-card-copy=""
      />
    )}
  </span>
);

/**
 * A slider filling its card (among the card's parts): its fill the card's
 * background (from its leading edge, or from its bottom upright, by its
 * tile's shape), ticks at its steps (`step`), its label and value at the
 * card's bottom. What's over the fill (its label, value and ticks, the
 * card's symbol and corner buttons) drawn twice: on the card, and again
 * inside the fill in the fill's color scheme (dark on a bright fill, light
 * on a dim one), clipped by its edge, so it reads whatever its tint. With
 * an `onPress`, a press on it is that (e.g. a switch toggled), a drag sets
 * its value.
 */
export const CardSlider = forwardRef<HTMLDivElement, CardSliderProps>(
  (
    {
      children,
      className,
      defaultValue,
      getAriaValueText,
      label,
      max = 100,
      min = 0,
      onPress,
      onValueChange,
      step,
      tint: tintProp,
      value,
      ...props
    },
    ref,
  ) => {
    const tint = useGivenTint(tintProp);
    const orientation: CardOrientation = useCardOrientation();
    const [current, setCurrent] = useControlled(value, defaultValue ?? min);
    // (Its fill's color scheme; the layer in it registered with its card,
    // see `CardBlendScope`.)
    const probe = useRef<HTMLSpanElement>(null);
    const scheme = useFillScheme(probe, tint);
    const setLayer = useContext(CardBlendScope)?.setLayer;
    const ticks =
      step === undefined ? undefined : Math.round((max - min) / step) + 1;
    const valueText = valueTextOf(children);
    return (
      <Slider.Root
        ref={ref}
        {...props}
        className={cn('uikit-card-slider', className)}
        data-card-part="slider"
        max={max}
        min={min}
        orientation={orientation}
        step={step ?? (max - min) / 100}
        tint={tint}
        value={current}
        onValueChange={(next) => {
          setCurrent(next as number);
          onValueChange?.(next as number);
        }}
        {...pressProps(onPress, orientation)}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator>
              <TintProbe ref={probe} />
              {scheme ? (
                <FillCopies
                  label={label}
                  layerRef={setLayer}
                  orientation={orientation}
                  scheme={scheme}
                  ticks={ticks}
                  valueText={valueText}
                />
              ) : null}
            </Slider.Indicator>
            {ticks === undefined ? null : <Slider.Ticks count={ticks} />}
            <Slider.Thumb
              aria-label={label}
              getAriaValueText={
                getAriaValueText
                  ? (formattedValue, thumbValue) =>
                      getAriaValueText(formattedValue, thumbValue)
                  : undefined
              }
            />
          </Slider.Track>
        </Slider.Control>
        <Slider.Label>{label}</Slider.Label>
        <Slider.Value>{valueText}</Slider.Value>
      </Slider.Root>
    );
  },
);
