import './style.css';

import { Fragment, FunctionComponent } from 'react';

import { Typography } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  propOptionsContent,
  propOptionsMatrix,
  propOptionsSizes,
  propOptionsTypography,
  textSizes,
  textStyles,
} from './props.js';

export const TypographyDemo: FunctionComponent = () => {
  const id = 'typography';

  const [externalContent, externalControl] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

  const [control, props, stateControl] = usePropControl(propOptionsTypography, {
    external: externalControl,
    isOpen: true,
    title: 'typography',
  });

  return (
    <Component
      isCentered
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

// The text styles' variants (in a label color, at a text size, both as
// controls).
export const TypographyMatrixDemo: FunctionComponent = () => {
  const id = 'typography-matrix';

  const [externalControl] = useProvidedState(id);

  const [control, { color, textSize }, stateControl] = usePropControl(
    propOptionsMatrix,
    { external: externalControl, isOpen: true, title: 'matrix' },
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
                emphasized={variant.emphasized}
                italic={variant.italic}
                textSize={textSize}
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

// The text styles at each text size (in a label color, as
// a control).
export const TypographySizesDemo: FunctionComponent = () => {
  const id = 'typography-sizes';

  const [externalControl] = useProvidedState(id);

  const [control, { color }, stateControl] = usePropControl(propOptionsSizes, {
    external: externalControl,
    isOpen: true,
    title: 'sizes',
  });

  return (
    <Component
      controls={control}
      id={id}
      state={[stateControl]}
      title="Typography (text sizes)"
    >
      <div className="typography-demo-matrix typography-demo-sizes">
        <span />
        {textSizes.map((size) => (
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
            {textSizes.map((size) => (
              <Typography
                key={size}
                color={color}
                textSize={size}
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
