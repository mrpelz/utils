import './style.css';

import { Fragment, FunctionComponent } from 'react';

import { Typography } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  dynamicTypeSizes,
  propOptionsContent,
  propOptionsMatrix,
  propOptionsSizes,
  propOptionsTypography,
  textStyles,
} from './props.js';

export const TypographyDemo: FunctionComponent = () => {
  const id = 'typography';

  const [externalContent, externalControl] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, open: true, title: '[content]' },
  );

  const [control, props, stateControl] = usePropControl(propOptionsTypography, {
    external: externalControl,
    open: true,
    title: 'typography',
  });

  return (
    <Component
      center
      controls={[controlContent, control]}
      id={id}
      state={[stateContent, stateControl]}
      title="Typography"
    >
      <Typography {...props}>{content.text}</Typography>
    </Component>
  );
};

const variants = [
  { emphasized: false, italic: false, name: 'regular' },
  { emphasized: true, italic: false, name: 'emphasized' },
  { emphasized: false, italic: true, name: 'italic' },
  { emphasized: true, italic: true, name: 'emphasized italic' },
] as const;

// Figma “Text styles”: the variants (in a label color, at a Dynamic Type
// size, both as controls).
export const TypographyMatrixDemo: FunctionComponent = () => {
  const id = 'typography-matrix';

  const [externalControl] = useProvidedState(id);

  const [control, { color, dynamicTypeSize }, stateControl] = usePropControl(
    propOptionsMatrix,
    { external: externalControl, open: true, title: 'matrix' },
  );

  return (
    <Component
      controls={control}
      id={id}
      state={[stateControl]}
      title="Typography (Matrix)"
    >
      <div className="typography-demo-matrix typography-demo-variants">
        <span />
        {variants.map(({ name }) => (
          <span
            key={name}
            className="typography-demo-heading"
          >
            {name}
          </span>
        ))}
        {textStyles.map(([textStyle, name]) => (
          <Fragment key={textStyle}>
            <span className="typography-demo-heading">{textStyle}</span>
            {variants.map((variant) => (
              <Typography
                key={variant.name}
                color={color}
                dynamicTypeSize={dynamicTypeSize}
                emphasized={variant.emphasized}
                italic={variant.italic}
                textStyle={textStyle}
              >
                {name}
              </Typography>
            ))}
          </Fragment>
        ))}
      </div>
    </Component>
  );
};

// Figma “Dynamic Type”: the text styles at each size (in a label color, as
// a control).
export const TypographySizesDemo: FunctionComponent = () => {
  const id = 'typography-sizes';

  const [externalControl] = useProvidedState(id);

  const [control, { color }, stateControl] = usePropControl(propOptionsSizes, {
    external: externalControl,
    open: true,
    title: 'sizes',
  });

  return (
    <Component
      controls={control}
      id={id}
      state={[stateControl]}
      title="Typography (Dynamic Type)"
    >
      <div className="typography-demo-matrix typography-demo-sizes">
        <span />
        {dynamicTypeSizes.map((size) => (
          <span
            key={size}
            className="typography-demo-heading"
          >
            {size}
          </span>
        ))}
        {textStyles.map(([textStyle, name]) => (
          <Fragment key={textStyle}>
            <span className="typography-demo-heading">{textStyle}</span>
            {dynamicTypeSizes.map((size) => (
              <Typography
                key={size}
                color={color}
                dynamicTypeSize={size}
                textStyle={textStyle}
              >
                {name}
              </Typography>
            ))}
          </Fragment>
        ))}
      </div>
    </Component>
  );
};
