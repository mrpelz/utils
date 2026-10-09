/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import { ComponentProps, useMemo, useState } from 'react';

import { Switch } from '../../components/index.js';
import { PropMap, usePropControl } from '../utils/main.js';
import { propOptionsThumb } from './props.js';

/** How many controls (and states) `useSwitchDemo` has. */
export const switchControlCount = 2;

export type SwitchDemoOptions<Root extends PropMap> = {
  /** Before the controls' titles (e.g. `airplane mode: `). */
  prefix?: string;
  /**
   * The root's options: as the switch demo's (`getPropOptionsRoot`, its
   * pending state by `setPending`), with a composing demo's own values.
   */
  root: (setPending: (pending: boolean) => void) => Root;
};

/**
 * A `Switch`'s demo controls (root, thumb) and the switch, for its demo and
 * demos composing one (e.g. a list row): all of its demo's props, with the
 * composing demo's values; its `own` props (e.g. an accessible name) over
 * them.
 */
export const useSwitchDemo = <Root extends PropMap>(
  externals: readonly unknown[],
  { prefix = '', root }: SwitchDemoOptions<Root>,
  own: Omit<ComponentProps<typeof Switch.Root>, 'ref'> = {},
) => {
  const [externalRoot, externalThumb] = externals;

  // Indeterminate for a while after each change (e.g. while an app saves
  // the new state), once the knob has moved over.
  const [pending, setPending] = useState(false);

  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    // (Once: its options don't change.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => root(setPending), []),
    `${prefix}root`,
    externalRoot,
    true,
  );
  const [controlThumb, propsThumb, stateThumb] = usePropControl(
    propOptionsThumb,
    `${prefix}thumb`,
    externalThumb,
  );

  const element = (
    <Remounter>
      <Switch.Root
        {...propsRoot}
        indeterminate={
          (propsRoot.indeterminate as boolean | undefined) ?? pending
        }
        {...own}
      >
        <Switch.Thumb {...propsThumb} />
      </Switch.Root>
    </Remounter>
  );

  return {
    controls: [controlRoot, controlThumb],
    element,
    states: [stateRoot, stateThumb],
  };
};
