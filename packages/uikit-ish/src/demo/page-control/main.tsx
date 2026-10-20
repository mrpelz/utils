import { FunctionComponent, useMemo } from 'react';

import { PageControl } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { getPropOptionsRoot } from './props.js';

/**
 * A page control (UIKit `UIPageControl`, Figma “_Page control”): pressed
 * before or after the current dot, or by keys, it goes to the previous or
 * next page; of more than 7 pages, a window of 8 dots.
 */
export const PageControlDemo: FunctionComponent = () => {
  const id = 'page-control';

  const [log, addLog] = useLog();

  const [externalRoot] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );

  return (
    <Component
      center
      controls={[controlRoot]}
      id={id}
      log={log}
      state={[stateRoot]}
      title="Page Control"
    >
      <PageControl
        key={keyRoot}
        {...propsRoot}
      />
    </Component>
  );
};
