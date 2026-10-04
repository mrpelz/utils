import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import { getPropOptionsRoot, propOptionsThumb } from './props.js';

export const SwitchDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  // Indeterminate for a while after each change (e.g. while an app saves
  // the new state), once the knob has moved over.
  const [pending, setPending] = useState(false);

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog, setPending), [addLog]),
    'root',
    true,
  );

  const [controlThumb, propsThumb] = usePropControl(propOptionsThumb, 'thumb');

  return (
    <Component
      center
      baseUiId="switch"
      controls={[controlRoot, controlThumb]}
      id="switch"
      log={log}
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
