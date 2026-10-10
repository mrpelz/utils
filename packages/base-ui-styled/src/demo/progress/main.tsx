import { FunctionComponent } from 'react';

import { ActivityIndicator, Progress } from '../../components/index.js';
import { Component, Remounters, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
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

  const [controlBar, propsBar, stateBar, RemounterBar] = usePropControl(
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
  const [controlIndicator, propsIndicator, stateIndicator, RemounterIndicator] =
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
      stateUrl={useCreateStateUrl(id, [
        stateBar,
        stateBarContent,
        stateIndicator,
        stateLabel,
        stateValue,
      ])}
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
        <Remounters remounters={[RemounterBar]}>
          <Progress.Root
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
        </Remounters>
        <RemounterIndicator>
          <ActivityIndicator
            aria-label={
              propsIndicator.children === undefined ? 'Loading' : undefined
            }
            {...propsIndicator}
          />
        </RemounterIndicator>
      </div>
    </Component>
  );
};
