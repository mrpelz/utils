import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { styled } from 'goober';
import { FunctionComponent, useMemo, useState } from 'react';

import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { useStepperDemo } from './compose.js';
import { getPropOptionsRoot } from './props.js';

// The value next to the stepper (as apps show it, UIKit's stepper doesn't).
const Row = styled('div')`
  display: flex;
  align-items: center;
  color: var(--color-ios-label);
  font-size: var(--font-ios-body-size);
  font-variant-numeric: tabular-nums;
  gap: 16px;
  line-height: var(--font-ios-body-line-height);
`;

/**
 * A stepper (UIKit `UIStepper`, a Base UI number field): its value is shown
 * next to it by the app, as UIKit's isn't.
 */
export const StepperDemo: FunctionComponent = () => {
  const id = 'stepper';

  const [log, addLog] = useLog();

  const [value, setValue] = useState<number | null>(5);

  const { controls, element, states } = useStepperDemo(
    useProvidedState(id),
    { root: useMemo(() => getPropOptionsRoot(addLog), [addLog]) },
    {
      label: 'Quantity',
      onValueChange: (
        next: number | null,
        { reason }: BaseNumberField.Root.ChangeEventDetails,
      ) => {
        addLog(`value change: ${String(next)}/${reason}`);
        setValue(next);
      },
    },
  );

  return (
    <Component
      center
      baseUiId="number-field"
      controls={controls}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, states)}
      title="Stepper"
    >
      <Row>
        <output>{value ?? '–'}</output>
        {element}
      </Row>
    </Component>
  );
};
