import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { styled } from 'goober';
import { FunctionComponent, useMemo, useState } from 'react';

import { Stepper } from '../components/index.js';
import { useLog } from './utils/log.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  usePropControl,
} from './utils/main.js';

const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

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

const propOptionsRoot = {
  ...commonPropOptions,
  defaultValue: [5, undefined, 0, 10] as const,
  min: [0, undefined, 3] as const,
  max: [10, undefined, 7] as const,
  step: [undefined, 1, 2, 0.5] as const,
  largeStep: [undefined, 5] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
};

const propOptionsHalf = {
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
};

/**
 * A stepper (UIKit `UIStepper`, a Base UI number field): its value is shown
 * next to it by the app, as UIKit's isn't.
 */
export const StepperDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, setValue] = useState<number | null>(5);

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onValueCommitted: [
          undefined,
          new MappedProp(
            (committed: number | null) =>
              addLog(`value committed: ${String(committed)}`),
            '[log commit]',
          ),
        ] as const,
      }),
      [addLog],
    ),
    'root',
    true,
  );
  const [controlGroup, propsGroup] = usePropControl(commonPropOptions, 'group');
  const [controlDecrement, propsDecrement] = usePropControl(
    propOptionsHalf,
    'decrement',
  );
  const [controlIncrement, propsIncrement] = usePropControl(
    propOptionsHalf,
    'increment',
  );

  return (
    <Component
      center
      baseUiId="number-field"
      controls={[controlRoot, controlGroup, controlDecrement, controlIncrement]}
      id="stepper"
      log={log}
      title="Stepper"
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
