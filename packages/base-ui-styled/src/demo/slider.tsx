import { Slider as BaseSlider } from '@base-ui/react/slider';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Slider } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';

const propOptionsContent = {
  thumbs: [1, 2] as const,
  ticks: [0, 6, 11] as const,
  minSymbol: [undefined, '🔈', 'A'] as const,
  maxSymbol: [undefined, '🔊', 'A'] as const,
  label: [undefined, 'Volume'] as const,
  value: [false, true] as const,
} as const;

const propOptionsRoot = {
  ...commonPropOptions,
  name: [undefined, 'slider'] as const,
  form: [undefined, 'form'] as const,
  defaultValue: [
    50,
    0,
    100,
    new MappedProp<number[]>([25, 75], '[25, 75]'),
  ] as const,
  value: [
    undefined,
    30,
    new MappedProp<number[]>([10, 90], '[10, 90]'),
  ] as const,
  min: [undefined, 0, 20] as const,
  max: [undefined, 100, 80] as const,
  step: [undefined, 1, 10] as const,
  largeStep: [undefined, 10, 25] as const,
  minStepsBetweenValues: [3, undefined, 0, 10] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  format: [
    undefined,
    new MappedProp<Intl.NumberFormatOptions>(
      { minimumFractionDigits: 1 },
      '[{ minimumFractionDigits: 1 }]',
    ),
    new MappedProp<Intl.NumberFormatOptions>(
      { currency: 'EUR', style: 'currency' },
      '[{ style: currency, currency: EUR }]',
    ),
  ] as const,
  disabled: [undefined, false, true] as const,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
  thumbAlignment: [undefined, 'center', 'edge', 'edge-client-only'] as const,
  thumbCollisionBehavior: [undefined, 'push', 'swap', 'none'] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
};

const propOptionsValue = {
  ...commonPropOptions,
  children: [
    undefined,
    new MappedProp(
      (formattedValues: readonly string[]) => formattedValues.join(' – '),
      '[join with –]',
    ),
  ] as const,
};

const propOptionsThumb = {
  ...commonPropOptions,
  'aria-valuetext': [undefined, 'custom value text'] as const,
  getAriaLabel: [
    undefined,
    new MappedProp((index: number) => `Thumb ${index + 1}`, '[Thumb n]'),
  ] as const,
  getAriaValueText: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `${formattedValue} units`,
      '[… units]',
    ),
  ] as const,
  tabIndex: [undefined, 0, -1] as const,
  disabled: [undefined, false, true] as const,
};

export const SliderDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onValueChange: [
          undefined,
          new MappedProp(
            (
              value: number | readonly number[],
              { reason }: BaseSlider.Root.ChangeEventDetails,
            ) => addLog(`value change: ${String(value)}/${reason}`),
            '[log change]',
          ),
        ] as const,
        onValueCommitted: [
          new MappedProp(
            (
              value: number | readonly number[],
              { reason }: BaseSlider.Root.CommitEventDetails,
            ) => addLog(`value committed: ${String(value)}/${reason}`),
            '[log commit]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'root',
    true,
  );

  const [controlLabel, propsLabel] = usePropControl(commonPropOptions, 'label');

  const [controlValue, propsValue] = usePropControl(propOptionsValue, 'value');

  const [controlControl, propsControl] = usePropControl(
    commonPropOptions,
    'control',
  );

  const [controlTrack, propsTrack] = usePropControl(commonPropOptions, 'track');

  const [controlIndicator, propsIndicator] = usePropControl(
    commonPropOptions,
    'indicator',
  );

  const propOptionsThumbWithLog = useMemo(
    () => ({
      ...propOptionsThumb,
      onBlur: [
        undefined,
        new MappedProp(() => addLog('thumb blur'), '[log blur]'),
      ] as const,
      onFocus: [
        undefined,
        new MappedProp(() => addLog('thumb focus'), '[log focus]'),
      ] as const,
      onKeyDown: [
        undefined,
        new MappedProp(
          ({ key }: KeyboardEvent) => addLog(`thumb key down: ${key}`),
          '[log key down]',
        ),
      ] as const,
      inputRef: [
        undefined,
        new MappedProp(
          (element: HTMLInputElement | null) =>
            addLog(`thumb input ref: ${element?.type ?? 'null'}`),
          '[log ref]',
        ),
      ] as const,
    }),
    [addLog],
  );

  const [controlThumbFirst, propsThumbFirst] = usePropControl(
    propOptionsThumbWithLog,
    '1st thumb',
  );

  const [controlThumbSecond, propsThumbSecond] = usePropControl(
    propOptionsThumbWithLog,
    '2nd thumb',
  );

  const [controlTicks, propsTicks] = usePropControl(commonPropOptions, 'ticks');

  const [controlMinSymbol, propsMinSymbol] = usePropControl(
    commonPropOptions,
    'min symbol',
  );

  const [controlMaxSymbol, propsMaxSymbol] = usePropControl(
    commonPropOptions,
    'max symbol',
  );

  return (
    <Component
      backdrop
      center
      stretch
      id="slider"
      log={log}
      title="Slider"
      controls={[
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
      ]}
    >
      <RemounterRoot>
        <Slider.Root {...propsRoot}>
          {content.label === undefined ? null : (
            <Slider.Label {...propsLabel}>{content.label}</Slider.Label>
          )}
          {content.value ? <Slider.Value {...propsValue} /> : null}
          {content.minSymbol === undefined ? null : (
            <Slider.Symbol {...propsMinSymbol}>
              {content.minSymbol}
            </Slider.Symbol>
          )}
          <Slider.Control {...propsControl}>
            <Slider.Track {...propsTrack}>
              <Slider.Indicator {...propsIndicator} />
              {content.ticks ? (
                <Slider.Ticks
                  {...propsTicks}
                  count={content.ticks}
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
              {content.maxSymbol}
            </Slider.Symbol>
          )}
        </Slider.Root>
      </RemounterRoot>
    </Component>
  );
};
