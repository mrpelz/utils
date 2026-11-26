import { FunctionComponent } from 'react';

import { Stack } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { buttons } from './content.js';
import { propOptionsContent, propOptionsStack } from './props.js';

/** A stack of buttons, every prop of it. */
export const StackDemo: FunctionComponent = () => {
  const id = 'stack';
  const [externalContent, externalStack] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, title: '[content]' },
  );
  const [controlStack, props, stateStack] = usePropControl(propOptionsStack, {
    external: externalStack,
    isOpen: true,
    title: 'Stack',
  });

  return (
    <Component
      isStretched
      controls={[controlContent, controlStack]}
      id={id}
      state={[stateContent, stateStack]}
      title="Stack"
    >
      <Stack {...props}>{buttons(content.count)}</Stack>
    </Component>
  );
};
