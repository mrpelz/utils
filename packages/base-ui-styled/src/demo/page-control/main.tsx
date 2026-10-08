import { FunctionComponent, useMemo } from 'react';

import { PageControl } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
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

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
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
      stateUrl={useCreateStateUrl(id, [stateRoot])}
      title="Page Control"
    >
      <RemounterRoot>
        <PageControl {...propsRoot} />
      </RemounterRoot>
    </Component>
  );
};
