import { FunctionComponent } from 'react';

import { Stack } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { buttons } from './content.js';
import { stackRows } from './docs.js';
import { propOptionsStack } from './props.js';

/** `Stack`, outlined, with its props. */
const StackPart: FunctionComponent = () => {
  const id = 'stack-parts-stack';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsStack, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Stack',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      state={[state]}
      title="Stack"
    >
      <Stack {...props}>{buttons(3)}</Stack>
    </Component>
  );
};

/** `/stack/parts`: the stack. */
export const StackParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>One part: the stack, with its children inside.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="stack"
          part="Stack"
        />
        <ul>
          <li className="demo-tree-context">
            <span>Any components, each one a child</span>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="stack"
      level={2}
    >
      <code>Stack</code>
    </Heading>
    <ul>
      <li>
        Its children in a column or a row, with a step of the spacing scale
        between them, and with <code>inset</code>, the content margin at its
        sides.
      </li>
      <li>
        Renders a <code>div</code> (a flexbox).
      </li>
    </ul>
    <StackPart />
    <h3>Props</h3>
    <PropsTable rows={stackRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const stackPartsDemos = [StackPart];
