import { FunctionComponent, useMemo } from 'react';

import { PageControl } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { getPropOptionsRoot } from './props.js';

/**
 * A page control: pressed
 * before or after the current dot, or by keys, it goes to the previous or
 * next page; of more than 7 pages, a window of 8 dots.
 */
export const PageControlDemo: FunctionComponent = () => {
  const id = 'page-control';

  const [log, addLog] = useLog();

  const [externalRoot] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );

  return (
    <Component
      isCentered
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
