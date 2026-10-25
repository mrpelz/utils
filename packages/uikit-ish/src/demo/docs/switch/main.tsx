import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { getPropOptionsRoot, propOptionsThumb } from './props.js';

export const SwitchDemo: FunctionComponent = () => {
  const id = 'switch';

  const [log, addLog] = useLog();
  const [externalRoot, externalThumb] = useProvidedState(id);

  // Indeterminate for a while after each change (e.g. while an app saves
  // the new state): see the root's `onCheckedChange` options.
  const [isPending, setIsPending] = useState(false);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog, setIsPending), [addLog]),
    { external: externalRoot, isOpen: true, title: 'Switch.Root' },
  );
  const [controlThumb, propsThumb, stateThumb] = usePropControl(
    propOptionsThumb,
    { external: externalThumb, title: 'Switch.Thumb' },
  );

  return (
    <Component
      isCentered
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
          (propsRoot.indeterminate as boolean | undefined) ?? isPending
        }
      >
        <Switch.Thumb {...propsThumb} />
      </Switch.Root>
    </Component>
  );
};
