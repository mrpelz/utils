import { FunctionComponent, useMemo } from 'react';

import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { useSegmentedDemo } from './compose.js';
import { getPropOptionsRoot, propOptionsContent } from './props.js';

export const SegmentedDemo: FunctionComponent = () => {
  const id = 'segmented';

  const [log, addLog] = useLog();

  const { controls, element, states } = useSegmentedDemo(
    addLog,
    useProvidedState(id),
    {
      content: propOptionsContent,
      root: useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    },
  );

  return (
    <Component
      center
      baseUiId="radio"
      controls={controls}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, states)}
      title="Segmented"
    >
      {element}
    </Component>
  );
};
