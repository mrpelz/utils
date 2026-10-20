import { FunctionComponent, ReactNode, useMemo } from 'react';

import { Slider } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { commonPropOptions, usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsMaxSymbol,
  getPropOptionsMinSymbol,
  getPropOptionsRoot,
  getPropOptionsThumb,
  propOptionsContent,
  propOptionsLabel,
  propOptionsValue,
} from './props.js';

export const SliderDemo: FunctionComponent = () => {
  const id = 'slider';

  const [log, addLog] = useLog();
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
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'Slider.Root',
    externalRoot,
    true,
  );
  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    propOptionsLabel,
    'Slider.Label',
    externalLabel,
  );
  const [controlValue, propsValue, stateValue] = usePropControl(
    propOptionsValue,
    'Slider.Value',
    externalValue,
  );
  const [controlControl, propsControl, stateControl] = usePropControl(
    commonPropOptions,
    'Slider.Control',
    externalControl,
  );
  const [controlTrack, propsTrack, stateTrack] = usePropControl(
    commonPropOptions,
    'Slider.Track',
    externalTrack,
  );
  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    commonPropOptions,
    'Slider.Indicator',
    externalIndicator,
  );
  const propOptionsThumbWithLog = useMemo(
    () => getPropOptionsThumb(addLog),
    [addLog],
  );
  const [controlThumbFirst, propsThumbFirst, stateThumbFirst] = usePropControl(
    propOptionsThumbWithLog,
    'Slider.Thumb (1st)',
    externalThumbFirst,
  );
  const [controlThumbSecond, propsThumbSecond, stateThumbSecond] =
    usePropControl(
      propOptionsThumbWithLog,
      'Slider.Thumb (2nd)',
      externalThumbSecond,
    );
  const [controlTicks, propsTicks, stateTicks] = usePropControl(
    commonPropOptions,
    'Slider.Ticks',
    externalTicks,
  );
  const [controlMinSymbol, propsMinSymbol, stateMinSymbol] = usePropControl(
    useMemo(() => getPropOptionsMinSymbol(addLog), [addLog]),
    'Slider.Symbol (min)',
    externalMinSymbol,
  );
  const [controlMaxSymbol, propsMaxSymbol, stateMaxSymbol] = usePropControl(
    useMemo(() => getPropOptionsMaxSymbol(addLog), [addLog]),
    'Slider.Symbol (max)',
    externalMaxSymbol,
  );

  return (
    <Component
      center
      baseUiId="slider"
      id={id}
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
      state={[
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
      ]}
    >
      <Slider.Root
        key={elementKey}
        {...propsRoot}
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
    </Component>
  );
};
