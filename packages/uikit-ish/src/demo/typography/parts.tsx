import { FunctionComponent } from 'react';

import { Typography } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { typographyRows } from './docs.js';
import { propOptionsTypography } from './props.js';

/** `Typography`, outlined, with its props. */
const TypographyPart: FunctionComponent = () => {
  const id = 'typography-parts-typography';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTypography, {
    external,
    open: true,
    outlined: true,
    title: 'Typography',
  });

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      state={[state]}
      title="Typography"
    >
      <Typography {...props}>
        The quick brown fox jumps over the lazy dog
      </Typography>
    </Component>
  );
};

/** `/typography/parts`: the text, one element. */
export const TypographyParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>One element: its text in a style.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="typography"
          part="Typography"
        />
      </li>
    </ul>

    <Heading
      id="typography"
      level={2}
    >
      <code>Typography</code>
    </Heading>
    <ul>
      <li>
        Look: <code>textStyle</code>, <code>emphasized</code>,{' '}
        <code>italic</code>, <code>color</code>.
      </li>
      <li>
        Size: <code>dynamicTypeSize</code>, for its text and everything in it.
      </li>
      <li>
        Renders a <code>span</code>, without a role; another element (a heading,
        a paragraph) by <code>render</code>.
      </li>
    </ul>
    <TypographyPart />
    <h3>Props</h3>
    <PropsTable rows={typographyRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const typographyPartsDemos = [TypographyPart];
