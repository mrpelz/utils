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
    { external: externalBar, open: true, title: 'bar' },
  );
  const [controlBarContent, propsBarContent, stateBarContent] = usePropControl(
    propOptionsBarContent,
    { external: externalBarContent, open: true, title: '[bar content]' },
  );
  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    propOptionsIndicator,
    { external: externalIndicator, open: true, title: 'indicator' },
  );

  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    propOptionsLabel,
    { external: externalLabel, title: 'label' },
  );
  const [controlValue, propsValue, stateValue] = usePropControl(
    propOptionsValue,
    { external: externalValue, title: 'value' },
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
          aria-label={
            propsIndicator.children === undefined ? 'Loading' : undefined
          }
          {...propsIndicator}
        />
      </div>
    </Component>
  );
};
