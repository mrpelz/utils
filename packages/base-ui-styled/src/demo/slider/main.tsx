import { FunctionComponent, useMemo } from 'react';

import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { useSliderDemo } from './compose.js';
import { getPropOptionsRoot, propOptionsContent } from './props.js';

export const SliderDemo: FunctionComponent = () => {
  const id = 'slider';

  const [log, addLog] = useLog();

  const { controls, element, states } = useSliderDemo(
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
      baseUiId="slider"
      controls={controls}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, states)}
      title="Slider"
    >
      {element}
    </Component>
  );
};
