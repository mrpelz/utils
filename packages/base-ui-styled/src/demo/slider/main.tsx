import { FunctionComponent, useMemo } from 'react';

import { Slider } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  getPropOptionsMaxSymbol,
  getPropOptionsMinSymbol,
  getPropOptionsRoot,
  getPropOptionsThumb,
  propOptionsContent,
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

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );

  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    'label',
    externalLabel,
  );

  const [controlValue, propsValue, stateValue] = usePropControl(
    propOptionsValue,
    'value',
    externalValue,
  );

  const [controlControl, propsControl, stateControl] = usePropControl(
    commonPropOptions,
    'control',
    externalControl,
  );

  const [controlTrack, propsTrack, stateTrack] = usePropControl(
    commonPropOptions,
    'track',
    externalTrack,
  );

  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    commonPropOptions,
    'indicator',
    externalIndicator,
  );

  const propOptionsThumbWithLog = useMemo(
    () => getPropOptionsThumb(addLog),
    [addLog],
  );

  const [controlThumbFirst, propsThumbFirst, stateThumbFirst] = usePropControl(
    propOptionsThumbWithLog,
    '1st thumb',
    externalThumbFirst,
  );

  const [controlThumbSecond, propsThumbSecond, stateThumbSecond] =
    usePropControl(propOptionsThumbWithLog, '2nd thumb', externalThumbSecond);

  const [controlTicks, propsTicks, stateTicks] = usePropControl(
    commonPropOptions,
    'ticks',
    externalTicks,
  );

  const [controlMinSymbol, propsMinSymbol, stateMinSymbol] = usePropControl(
    useMemo(() => getPropOptionsMinSymbol(addLog), [addLog]),
    'min symbol',
    externalMinSymbol,
  );

  const [controlMaxSymbol, propsMaxSymbol, stateMaxSymbol] = usePropControl(
    useMemo(() => getPropOptionsMaxSymbol(addLog), [addLog]),
    'max symbol',
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
      stateUrl={useCreateStateUrl(id, [
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
      ])}
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
