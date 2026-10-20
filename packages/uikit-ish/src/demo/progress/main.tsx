import { FunctionComponent } from 'react';

import { ActivityIndicator, Progress } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  propOptionsBar,
  propOptionsBarContent,
  propOptionsIndicator,
  propOptionsLabel,
  propOptionsValue,
} from './props.js';

/**
 * Progress indicators (Figma “Progress Indicators”): a progress bar (UIKit
 * `UIProgressView`, Base UI's `Progress`), and an activity indicator (UIKit
 * `UIActivityIndicatorView`) for progress of unknown length.
 */
export const ProgressDemo: FunctionComponent = () => {
  const id = 'progress';

  const [
    externalBar,
    externalBarContent,
    externalIndicator,
    externalLabel,
    externalValue,
  ] = useProvidedState(id);

  const [controlBar, propsBar, stateBar, keyBar] = usePropControl(
    propOptionsBar,
    'bar',
    externalBar,
    true,
  );
  const [controlBarContent, propsBarContent, stateBarContent] = usePropControl(
    propOptionsBarContent,
    '[bar content]',
    externalBarContent,
    true,
  );
  const [controlIndicator, propsIndicator, stateIndicator, keyIndicator] =
    usePropControl(propOptionsIndicator, 'indicator', externalIndicator, true);

  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    propOptionsLabel,
    'label',
    externalLabel,
  );
  const [controlValue, propsValue, stateValue] = usePropControl(
    propOptionsValue,
    'value',
    externalValue,
  );

  const { label, showValue } = propsBarContent;

  return (
    <Component
      center
      baseUiId="progress"
      id={id}
      title="Progress"
      controls={[
        controlBar,
        controlBarContent,
        controlIndicator,
        controlLabel,
        controlValue,
      ]}
      state={[
        stateBar,
        stateBarContent,
        stateIndicator,
        stateLabel,
        stateValue,
      ]}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          gap: 32,
          justifyItems: 'center',
          paddingBlock: 16,
        }}
      >
        <Progress.Root
          key={`${keyBar}`}
          aria-label={label === undefined ? 'Progress' : undefined}
          {...propsBar}
        >
          {label === undefined ? null : (
            <Progress.Label {...propsLabel}>{label}</Progress.Label>
          )}
          {showValue ? <Progress.Value {...propsValue} /> : null}
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
        <ActivityIndicator
          key={keyIndicator}
          aria-label={
            propsIndicator.children === undefined ? 'Loading' : undefined
          }
          {...propsIndicator}
        />
      </div>
    </Component>
  );
};
