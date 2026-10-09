import { FunctionComponent } from 'react';

import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { useSwitchDemo } from './compose.js';
import { getPropOptionsRoot } from './props.js';

export const SwitchDemo: FunctionComponent = () => {
  const id = 'switch';

  const [log, addLog] = useLog();

  const { controls, element, states } = useSwitchDemo(useProvidedState(id), {
    root: (setPending) => getPropOptionsRoot(addLog, setPending),
  });

  return (
    <Component
      center
      baseUiId="switch"
      controls={controls}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, states)}
      title="Switch"
    >
      {element}
    </Component>
  );
};
