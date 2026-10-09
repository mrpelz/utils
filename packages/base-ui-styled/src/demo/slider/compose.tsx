/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import { ComponentProps, ReactNode, useMemo } from 'react';

import { Slider } from '../../components/index.js';
import { AddLog } from '../utils/log.js';
import { commonPropOptions, PropMap, usePropControl } from '../utils/main.js';
import {
  getPropOptionsMaxSymbol,
  getPropOptionsMinSymbol,
  getPropOptionsThumb,
  propOptionsValue,
} from './props.js';

/** How many controls (and states) `useSliderDemo` has. */
export const sliderControlCount = 12;

/** The content's options (see `propOptionsContent`): its keys. */
export type SliderContentOptions = PropMap & {
  label: readonly unknown[];
  maxSymbol: readonly unknown[];
  minSymbol: readonly unknown[];
  thumbs: readonly unknown[];
  ticks: readonly unknown[];
  value: readonly unknown[];
};

export type SliderDemoOptions<
  Content extends SliderContentOptions,
  Root extends PropMap,
> = {
  /**
   * The content's options: as the slider demo's (`propOptionsContent`),
   * with a composing demo's own values.
   */
  content: Content;
  /** Before the controls' titles (e.g. `brightness: `). */
  prefix?: string;
  /** The root's options (as `getPropOptionsRoot`'s, with own values). */
  root: Root;
};

/**
 * A `Slider`'s demo controls (its content, and each part) and the slider,
 * for its demo and demos composing one (e.g. a list row): all of its demo's
 * props, with the composing demo's values; its `own` props (e.g. an
 * accessible name) over them.
 */
export const useSliderDemo = <
  Content extends SliderContentOptions,
  Root extends PropMap,
>(
  addLog: AddLog,
  externals: readonly unknown[],
  {
    content: contentOptions,
    prefix = '',
    root,
  }: SliderDemoOptions<Content, Root>,
  own: Omit<ComponentProps<typeof Slider.Root>, 'ref'> = {},
) => {
  const [
    externalContent,
    externalRoot,
    externalLabel,
    externalValue,
    externalControl,
    externalTrack,
    externalIndicator,
    externalThumbFirst,
    externalThumbSecond,
    externalTicks,
    externalMinSymbol,
    externalMaxSymbol,
  ] = externals;

  const [controlContent, content, stateContent] = usePropControl(
    contentOptions,
    `${prefix}[content]`,
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    root,
    `${prefix}root`,
    externalRoot,
    true,
  );
  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    `${prefix}label`,
    externalLabel,
  );
  const [controlValue, propsValue, stateValue] = usePropControl(
    propOptionsValue,
    `${prefix}value`,
    externalValue,
  );
  const [controlControl, propsControl, stateControl] = usePropControl(
    commonPropOptions,
    `${prefix}control`,
    externalControl,
  );
  const [controlTrack, propsTrack, stateTrack] = usePropControl(
    commonPropOptions,
    `${prefix}track`,
    externalTrack,
  );
  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    commonPropOptions,
    `${prefix}indicator`,
    externalIndicator,
  );
  const propOptionsThumbWithLog = useMemo(
    () => getPropOptionsThumb(addLog),
    [addLog],
  );
  const [controlThumbFirst, propsThumbFirst, stateThumbFirst] = usePropControl(
    propOptionsThumbWithLog,
    `${prefix}1st thumb`,
    externalThumbFirst,
  );
  const [controlThumbSecond, propsThumbSecond, stateThumbSecond] =
    usePropControl(
      propOptionsThumbWithLog,
      `${prefix}2nd thumb`,
      externalThumbSecond,
    );
  const [controlTicks, propsTicks, stateTicks] = usePropControl(
    commonPropOptions,
    `${prefix}ticks`,
    externalTicks,
  );
  const [controlMinSymbol, propsMinSymbol, stateMinSymbol] = usePropControl(
    useMemo(() => getPropOptionsMinSymbol(addLog), [addLog]),
    `${prefix}min symbol`,
    externalMinSymbol,
  );
  const [controlMaxSymbol, propsMaxSymbol, stateMaxSymbol] = usePropControl(
    useMemo(() => getPropOptionsMaxSymbol(addLog), [addLog]),
    `${prefix}max symbol`,
    externalMaxSymbol,
  );

  const element = (
    <Remounter>
      <Slider.Root
        {...propsRoot}
        {...own}
      >
        {content.label === undefined ? null : (
          <Slider.Label {...propsLabel}>
            {content.label as ReactNode}
          </Slider.Label>
        )}
        {content.value ? <Slider.Value {...propsValue} /> : null}
        {content.minSymbol === undefined ? null : (
          <Slider.Symbol {...propsMinSymbol}>
            {content.minSymbol as ReactNode}
          </Slider.Symbol>
        )}
        <Slider.Control {...propsControl}>
          <Slider.Track {...propsTrack}>
            <Slider.Indicator {...propsIndicator} />
            {content.ticks ? (
              <Slider.Ticks
                {...propsTicks}
                count={content.ticks as number}
              />
            ) : null}
            <Slider.Thumb
              {...propsThumbFirst}
              index={0}
            />
            {content.thumbs === 2 ? (
              <Slider.Thumb
                {...propsThumbSecond}
                index={1}
              />
            ) : null}
          </Slider.Track>
        </Slider.Control>
        {content.maxSymbol === undefined ? null : (
          <Slider.Symbol {...propsMaxSymbol}>
            {content.maxSymbol as ReactNode}
          </Slider.Symbol>
        )}
      </Slider.Root>
    </Remounter>
  );

  return {
    controls: [
      controlContent,
      controlRoot,
      controlLabel,
      controlValue,
      controlControl,
      controlTrack,
      controlIndicator,
      controlThumbFirst,
      controlThumbSecond,
      controlTicks,
      controlMinSymbol,
      controlMaxSymbol,
    ],
    element,
    states: [
      stateContent,
      stateRoot,
      stateLabel,
      stateValue,
      stateControl,
      stateTrack,
      stateIndicator,
      stateThumbFirst,
      stateThumbSecond,
      stateTicks,
      stateMinSymbol,
      stateMaxSymbol,
    ],
  };
};
