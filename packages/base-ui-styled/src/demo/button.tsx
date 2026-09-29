import Plus from 'framework7-icons/react/esm/Plus.js';
import StarFill from 'framework7-icons/react/esm/StarFill.js';
import { styled } from 'goober';
import { Fragment, FunctionComponent, useMemo } from 'react';

import { Button, ButtonRootProps } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';

const propOptionsContent = {
  symbol: [
    undefined,
    new MappedProp(<StarFill />, '[star.fill]'),
    new MappedProp(<Plus />, '[plus]'),
  ] as const,
  label: ['Button', undefined, 'Long button label'] as const,
} as const;

const propOptionsRoot = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  focusableWhenDisabled: [undefined, false, true] as const,
  nativeButton: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  variant: [
    undefined,
    'borderless',
    'bordered',
    'bordered-secondary',
    'bordered-prominent',
    'glass',
    'glass-prominent',
  ] as const,
  size: [undefined, 'small', 'medium', 'large'] as const,
  shape: [undefined, 'capsule', 'circle'] as const,
  destructive: [undefined, false, true] as const,
  context: [undefined, 'bright', 'dim'] as const,
};

export const ButtonDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot, Remounter] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onClick: [
          new MappedProp(
            () => addLog('button has been clicked'),
            '[log click]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'root',
    true,
  );

  const [controlSymbol, propsSymbol] = usePropControl(
    commonPropOptions,
    'symbol',
  );

  const [controlLabel, propsLabel] = usePropControl(commonPropOptions, 'label');

  return (
    <Component
      center
      baseUiId="button"
      controls={[controlContent, controlRoot, controlSymbol, controlLabel]}
      id="button"
      log={log}
      title="Button"
    >
      <Remounter>
        <Button.Root {...propsRoot}>
          {content.symbol === undefined ? null : (
            <Button.Symbol {...propsSymbol}>{content.symbol}</Button.Symbol>
          )}
          {content.label === undefined ? null : (
            <Button.Label {...propsLabel}>{content.label}</Button.Label>
          )}
        </Button.Root>
      </Remounter>
    </Component>
  );
};

const matrixVariants = [
  'borderless',
  'bordered',
  'bordered-secondary',
  'bordered-prominent',
  'glass',
  'glass-prominent',
] as const;

const matrixSizes = ['small', 'medium', 'large'] as const;

const matrixLabelTypes = ['text', 'symbol', 'symbol + text'] as const;

const matrixRows = matrixVariants.flatMap<{
  size?: ButtonRootProps['size'];
  variant: ButtonRootProps['variant'];
}>((variant) =>
  variant === 'glass' || variant === 'glass-prominent'
    ? [{ size: undefined, variant }]
    : matrixSizes.map((size) => ({ size, variant })),
);

const matrixColumns = [false, true].flatMap((disabled) =>
  matrixLabelTypes.map((labelType) => ({ disabled, labelType })),
);

const propOptionsMatrix = {
  destructive: [false, true] as const,
  context: [undefined, 'bright', 'dim'] as const,
};

const Matrix = styled('div')`
  display: grid;
  gap: 12px 16px;
  grid-template-columns: repeat(${matrixColumns.length + 1}, max-content);
  place-items: center start;
`;

const MatrixHeading = styled('span')`
  color: #a1a1a1;
  font-family: monospace;
  font-size: 12px;
`;

// All Figma permutations (Style, Size, Label Type, Enabled) at once, with
// Destructive and the glass context as controls.
export const ButtonMatrixDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [control, props] = usePropControl(propOptionsMatrix, 'matrix', true);

  return (
    <Component
      baseUiId="button"
      controls={control}
      id="button-matrix"
      log={log}
      title="Button (Matrix)"
    >
      <Matrix>
        <span />
        {matrixColumns.map(({ disabled, labelType }) => (
          <MatrixHeading key={`${labelType}-${String(disabled)}`}>
            {labelType}
            {disabled ? ' (disabled)' : ''}
          </MatrixHeading>
        ))}
        {matrixRows.map(({ size, variant }) => (
          <Fragment key={`${variant}-${size ?? ''}`}>
            <MatrixHeading>
              {variant}
              {size ? ` ${size}` : ''}
            </MatrixHeading>
            {matrixColumns.map(({ disabled, labelType }) => (
              <Button.Root
                key={`${labelType}-${String(disabled)}`}
                context={props.context}
                destructive={props.destructive}
                disabled={disabled}
                shape={labelType === 'symbol' ? 'circle' : undefined}
                size={size}
                variant={variant}
                onClick={() => addLog(`${variant} ${size ?? ''} clicked`)}
              >
                {labelType === 'text' ? null : (
                  <Button.Symbol>
                    <StarFill />
                  </Button.Symbol>
                )}
                {labelType === 'symbol' ? null : (
                  <Button.Label>Label</Button.Label>
                )}
              </Button.Root>
            ))}
          </Fragment>
        ))}
      </Matrix>
    </Component>
  );
};
