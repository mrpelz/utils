import './style.css';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { FunctionComponent, useMemo, useState } from 'react';

import { Stepper } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { commonPropOptions, usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { getPropOptionsRoot, propOptionsHalf } from './props.js';

/**
 * A stepper (UIKit `UIStepper`, a Base UI number field): its value is shown
 * next to it by the app, as UIKit's isn't.
 */
export const StepperDemo: FunctionComponent = () => {
  const id = 'stepper';

  const [log, addLog] = useLog();
  const [externalRoot, externalGroup, externalDecrement, externalIncrement] =
    useProvidedState(id);

  const [value = '–', setValue] = useState<number | null>(5);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    commonPropOptions,
    'group',
    externalGroup,
  );
  const [controlDecrement, propsDecrement, stateDecrement] = usePropControl(
    propOptionsHalf,
    'decrement',
    externalDecrement,
  );
  const [controlIncrement, propsIncrement, stateIncrement] = usePropControl(
    propOptionsHalf,
    'increment',
    externalIncrement,
  );

  return (
    <Component
      center
      baseUiId="number-field"
      controls={[controlRoot, controlGroup, controlDecrement, controlIncrement]}
      id={id}
      log={log}
      state={[stateRoot, stateGroup, stateDecrement, stateIncrement]}
      title="Stepper"
    >
      <div className="stepper-demo-row">
        <output>{value}</output>
        <Stepper.Root
          key={elementKey}
          {...propsRoot}
          onValueChange={(
            next: number | null,
            { reason }: BaseNumberField.Root.ChangeEventDetails,
          ) => {
            addLog(`value change: ${String(next)}/${reason}`);
            setValue(next);
          }}
        >
          <Stepper.Group
            inputProps={{ 'aria-label': 'Quantity' }}
            {...propsGroup}
          >
            <Stepper.Decrement {...propsDecrement} />
            <Stepper.Increment {...propsIncrement} />
          </Stepper.Group>
        </Stepper.Root>
      </div>
    </Component>
  );
};
