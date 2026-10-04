import { FunctionComponent, useMemo } from 'react';

import { Slider } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  getPropOptionsMaxSymbol,
  getPropOptionsMinSymbol,
  getPropOptionsRoot,
  getPropOptionsThumb,
  propOptionsContent,
  propOptionsValue,
} from './props.js';

export const SliderDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
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
    () => getPropOptionsThumb(addLog),
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
    useMemo(() => getPropOptionsMinSymbol(addLog), [addLog]),
    'min symbol',
  );

  const [controlMaxSymbol, propsMaxSymbol] = usePropControl(
    useMemo(() => getPropOptionsMaxSymbol(addLog), [addLog]),
    'max symbol',
  );

  return (
    <Component
      center
      baseUiId="slider"
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
