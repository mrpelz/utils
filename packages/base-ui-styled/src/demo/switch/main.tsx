import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { getPropOptionsRoot, propOptionsThumb } from './props.js';

export const SwitchDemo: FunctionComponent = () => {
  const id = 'switch';

  const [log, addLog] = useLog();

  const [externalRoot, externalThumb] = useProvidedState(id);

  // Indeterminate for a while after each change (e.g. while an app saves
  // the new state), once the knob has moved over.
  const [pending, setPending] = useState(false);

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog, setPending), [addLog]),
    'root',
    externalRoot,
    true,
  );

  const [controlThumb, propsThumb, stateThumb] = usePropControl(
    propOptionsThumb,
    'thumb',
    externalThumb,
  );

  return (
    <Component
      center
      baseUiId="switch"
      controls={[controlRoot, controlThumb]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateRoot, stateThumb])}
      title="Switch"
    >
      <RemounterRoot>
        <Switch.Root
          {...propsRoot}
          indeterminate={propsRoot.indeterminate ?? pending}
        >
          <Switch.Thumb {...propsThumb} />
        </Switch.Root>
      </RemounterRoot>
    </Component>
  );
};
