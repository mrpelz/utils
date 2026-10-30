import type { Slider as BaseSlider } from '@base-ui/react/slider';
import type { Properties } from 'csstype';
import type { ComponentProps, ReactNode } from 'react';

export type SliderRootProps = BaseSlider.Root.Props & {
  /**
   * The cursor (where the pointer hovers).
   * @default 'pointer' (disabled: 'not-allowed')
   */
  cursor?: Properties['cursor'];
  /**
   * The fill's color, and the pressed knob's glow.
   * @default the app's tint
   */
  tint?: string;
};

export type RootContextValue = Pick<
  BaseSlider.Root.Props,
  'format' | 'locale' | 'max' | 'min' | 'step'
> & {
  // Its value in tooltips on its thumbs (see `Value`): always, or only
  // while hovered or dragged (momentary).
  setValueTooltip?: (shown: ValueTooltip) => void;
  valueTooltip?: ValueTooltip;
};

export type ValueTooltip = 'always' | 'momentary' | undefined;

export type SliderTicksProps = ComponentProps<'div'> & {
  /**
   * The values across the slider (usually `(max - min) / step + 1`); ticks
   * mark those between its ends (not the ends themselves).
   */
  count: number;
};

export type SliderSymbolProps = ComponentProps<'span'> & {
  /**
   * The end of the slider the symbol stands for. Clicking it moves the first
   * thumb to the minimum (`min`), or the last thumb to the maximum (`max`), as
   * the Home/End keys do; with a range, the other end stays. An `onClick`
   * replaces this behavior.
   */
  edge: 'max' | 'min';
};

/** Where a label or value is. */
export type SliderPlacement =
  'block-end' | 'block-start' | 'inline-end' | 'inline-start';

export type SliderLabelProps = Omit<BaseSlider.Label.Props, 'ref'> & {
  /**
   * Placed (see `SliderPlacement`).
   * @default where it is among the parts
   */
  placement?: SliderPlacement;
};

export type SliderValueProps = Omit<BaseSlider.Value.Props, 'ref'> & {
  /**
   * Placed (see `SliderPlacement`), or in a tooltip on each thumb: always,
   * or momentary (while hovered, or a knob dragged or focused).
   * @default where it is among the parts
   */
  placement?: SliderPlacement | 'momentary-tooltip' | 'tooltip';
};

export type ValueRenderer = (
  formattedValues: readonly string[],
  values: readonly number[],
) => ReactNode;
