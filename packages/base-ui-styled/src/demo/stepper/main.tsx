import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { styled } from 'goober';
import { FunctionComponent, useMemo, useState } from 'react';

import { Stepper } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { getPropOptionsRoot, propOptionsHalf } from './props.js';

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

  const [externalRoot, externalGroup, externalDecrement, externalIncrement] =
    useProvidedState(id);
  const [value, setValue] = useState<number | null>(5);

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
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
      title="Stepper"
      stateUrl={useCreateStateUrl(id, [
        stateRoot,
        stateGroup,
        stateDecrement,
        stateIncrement,
      ])}
    >
      <Row>
        <output>{value ?? '–'}</output>
        <RemounterRoot>
          <Stepper.Root
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
        </RemounterRoot>
      </Row>
    </Component>
  );
};
