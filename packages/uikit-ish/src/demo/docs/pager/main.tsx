import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Pager } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { pages } from './content.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPage,
} from './props.js';

/** A pager of onboarding steps, every prop of its parts. */
export const PagerDemo: FunctionComponent = () => {
  const id = 'pager';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalPage] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'Pager.Root' },
  );
  const [controlPage, propsPage, statePage] = usePropControl(propOptionsPage, {
    external: externalPage,
    title: 'Pager.Page',
  });

  return (
    <Component
      isCentered
      controls={[controlContent, controlRoot, controlPage]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, statePage]}
      title="Pager"
    >
      <div className="pager-demo-frame">
        <Pager.Root
          key={keyRoot}
          {...propsRoot}
        >
          {pages(content.count, propsPage)}
        </Pager.Root>
      </div>
    </Component>
  );
};
