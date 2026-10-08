import { styled } from 'goober';
import { Fragment, FunctionComponent } from 'react';

import { Typography } from '../../components/index.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  dynamicTypeSizes,
  propOptionsContent,
  propOptionsMatrix,
  propOptionsTypography,
  textStyles,
} from './props.js';

export const TypographyDemo: FunctionComponent = () => {
  const id = 'typography';

  const [externalContent, externalControl] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const [control, props, stateControl] = usePropControl(
    propOptionsTypography,
    'typography',
    externalControl,
    true,
  );

  return (
    <Component
      center
      controls={[controlContent, control]}
      id={id}
      stateUrl={useCreateStateUrl(id, [stateContent, stateControl])}
      title="Typography"
    >
      <Typography {...props}>{content.text}</Typography>
    </Component>
  );
};

const Matrix = styled('div')`
  display: grid;
  gap: 12px 24px;
  grid-template-columns: repeat(var(--columns), max-content);
  place-items: baseline start;
`;

const Matrices = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const MatrixHeading = styled('span')`
  color: #a1a1a1;
  font-family: monospace;
  font-size: 12px;
`;

const variants = [
  { emphasized: false, italic: false, name: 'regular' },
  { emphasized: true, italic: false, name: 'emphasized' },
  { emphasized: false, italic: true, name: 'italic' },
  { emphasized: true, italic: true, name: 'emphasized italic' },
] as const;

// Figma “Text styles” (the variants, in a label color) and “Dynamic Type”
// (the sizes), with the color and size as controls.
export const TypographyMatrixDemo: FunctionComponent = () => {
  const id = 'typography-matrix';

  const [externalControl] = useProvidedState(id);

  const [control, { color, dynamicTypeSize }, stateControl] = usePropControl(
    propOptionsMatrix,
    'matrix',
    externalControl,
    true,
  );

  return (
    <Component
      controls={control}
      id={id}
      stateUrl={useCreateStateUrl(id, [stateControl])}
      title="Typography (Matrix)"
    >
      <Matrices>
        <Matrix style={{ '--columns': variants.length + 1 }}>
          <span />
          {variants.map(({ name }) => (
            <MatrixHeading key={name}>{name}</MatrixHeading>
          ))}
          {textStyles.map(([textStyle, name]) => (
            <Fragment key={textStyle}>
              <MatrixHeading>{textStyle}</MatrixHeading>
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
        </Matrix>
        <Matrix style={{ '--columns': dynamicTypeSizes.length + 1 }}>
          <span />
          {dynamicTypeSizes.map((size) => (
            <MatrixHeading key={size}>{size}</MatrixHeading>
          ))}
          {textStyles.map(([textStyle, name]) => (
            <Fragment key={textStyle}>
              <MatrixHeading>{textStyle}</MatrixHeading>
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
        </Matrix>
      </Matrices>
    </Component>
  );
};
