import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { getPropOptionsRoot, propOptionsThumb } from './props.js';

export const SwitchDemo: FunctionComponent = () => {
  const id = 'switch';

  const [log, addLog] = useLog();
  const [externalRoot, externalThumb] = useProvidedState(id);

  // Indeterminate for a while after each change (e.g. while an app saves
  // the new state): see the root's `onCheckedChange` options.
  const [pending, setPending] = useState(false);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog, setPending), [addLog]),
    'Switch.Root',
    externalRoot,
    true,
  );
  const [controlThumb, propsThumb, stateThumb] = usePropControl(
    propOptionsThumb,
    'Switch.Thumb',
    externalThumb,
  );

  return (
    <Component
      center
      baseUiId="switch"
      controls={[controlRoot, controlThumb]}
      id={id}
      log={log}
      state={[stateRoot, stateThumb]}
      title="Switch"
    >
      <Switch.Root
        key={elementKey}
        {...propsRoot}
        indeterminate={
          (propsRoot.indeterminate as boolean | undefined) ?? pending
        }
      >
        <Switch.Thumb {...propsThumb} />
      </Switch.Root>
    </Component>
  );
};
