/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import { ComponentProps } from 'react';

import { Stepper } from '../../components/index.js';
import { commonPropOptions, PropMap, usePropControl } from '../utils/main.js';
import { propOptionsHalf } from './props.js';

/** How many controls (and states) `useStepperDemo` has. */
export const stepperControlCount = 4;

export type StepperDemoOptions<Root extends PropMap> = {
  /** Before the controls' titles (e.g. `quantity: `). */
  prefix?: string;
  /**
   * The root's options: as the stepper demo's (`getPropOptionsRoot`), with
   * a composing demo's own values.
   */
  root: Root;
};

type StepperOwnProps = Omit<ComponentProps<typeof Stepper.Root>, 'ref'> & {
  /** The (hidden) input's accessible name. */
  label: string;
};

/**
 * A `Stepper`'s demo controls (root, group, decrement, increment) and the
 * stepper, for its demo and demos composing one (e.g. a list row): all of
 * its demo's props, with the composing demo's values; its `own` props
 * (e.g. its value) over them.
 */
export const useStepperDemo = <Root extends PropMap>(
  externals: readonly unknown[],
  { prefix = '', root }: StepperDemoOptions<Root>,
  { label, ...own }: StepperOwnProps,
) => {
  const [externalRoot, externalGroup, externalDecrement, externalIncrement] =
    externals;

  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    root,
    `${prefix}root`,
    externalRoot,
    true,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    commonPropOptions,
    `${prefix}group`,
    externalGroup,
  );
  const [controlDecrement, propsDecrement, stateDecrement] = usePropControl(
    propOptionsHalf,
    `${prefix}decrement`,
    externalDecrement,
  );
  const [controlIncrement, propsIncrement, stateIncrement] = usePropControl(
    propOptionsHalf,
    `${prefix}increment`,
    externalIncrement,
  );

  const element = (
    <Remounter>
      <Stepper.Root
        {...propsRoot}
        {...own}
      >
        <Stepper.Group
          inputProps={{ 'aria-label': label }}
          {...propsGroup}
        >
          <Stepper.Decrement {...propsDecrement} />
          <Stepper.Increment {...propsIncrement} />
        </Stepper.Group>
      </Stepper.Root>
    </Remounter>
  );

  return {
    controls: [controlRoot, controlGroup, controlDecrement, controlIncrement],
    element,
    states: [stateRoot, stateGroup, stateDecrement, stateIncrement],
  };
};
