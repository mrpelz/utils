import './style.css';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { FunctionComponent, useMemo, useState } from 'react';

import { Stepper } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  getPropOptionsRoot,
  propOptionsGroup,
  propOptionsHalf,
  propOptionsInput,
} from './props.js';

/**
 * A stepper (a Base UI number field): its value is shown next to it by the
 * app, as the stepper doesn't show it.
 */
export const StepperDemo: FunctionComponent = () => {
  const id = 'stepper';

  const [log, addLog] = useLog();
  const [
    externalRoot,
    externalGroup,
    externalInput,
    externalDecrement,
    externalIncrement,
  ] = useProvidedState(id);

  const [value = '–', setValue] = useState<number | null>(5);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    { external: externalGroup, title: 'group' },
  );
  const [controlInput, propsInput, stateInput] = usePropControl(
    propOptionsInput,
    { external: externalInput, title: 'input' },
  );
  const [controlDecrement, propsDecrement, stateDecrement] = usePropControl(
    propOptionsHalf,
    { external: externalDecrement, title: 'decrement' },
  );
  const [controlIncrement, propsIncrement, stateIncrement] = usePropControl(
    propOptionsHalf,
    { external: externalIncrement, title: 'increment' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      baseUiId="number-field"
      id={id}
      log={log}
      title="Stepper"
      controls={[
        controlRoot,
        controlGroup,
        controlInput,
        controlDecrement,
        controlIncrement,
      ]}
      state={[
        stateRoot,
        stateGroup,
        stateInput,
        stateDecrement,
        stateIncrement,
      ]}
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
          <Stepper.Group {...propsGroup}>
            <Stepper.Input {...propsInput} />
            <Stepper.Decrement {...propsDecrement} />
            <Stepper.Increment {...propsIncrement} />
          </Stepper.Group>
        </Stepper.Root>
      </div>
    </Component>
  );
};
