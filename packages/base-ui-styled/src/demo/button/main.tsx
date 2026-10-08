import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { styled } from 'goober';
import { Fragment, FunctionComponent, useMemo } from 'react';

import { Button, ButtonRootProps } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsMatrix,
} from './props.js';

export const ButtonDemo: FunctionComponent = () => {
  const id = 'button';

  const [log, addLog] = useLog();

  const [externalContent, externalRoot, externalSymbol, externalLabel] =
    useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );

  const [controlSymbol, propsSymbol, stateSymbol] = usePropControl(
    commonPropOptions,
    'symbol',
    externalSymbol,
  );

  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    'label',
    externalLabel,
  );

  // Composed in either order: a pop-up button's label comes first, its
  // symbol (e.g. chevron.up.chevron.down) after it.
  const symbol =
    content.symbol === undefined ? null : (
      <Button.Symbol {...propsSymbol}>{content.symbol}</Button.Symbol>
    );
  const label =
    content.label === undefined ? null : (
      <Button.Label {...propsLabel}>{content.label}</Button.Label>
    );

  return (
    <Component
      center
      baseUiId="button"
      controls={[controlContent, controlRoot, controlSymbol, controlLabel]}
      id={id}
      log={log}
      title="Button"
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateSymbol,
        stateLabel,
      ])}
    >
      <Remounter>
        <Button.Root {...propsRoot}>
          {content.order === 'labelFirst' ? (
            <>
              {label}
              {symbol}
            </>
          ) : (
            <>
              {symbol}
              {label}
            </>
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
  const id = 'button-matrix';

  const [log, addLog] = useLog();

  const [externalControl] = useProvidedState(id);

  const [control, props, stateControl] = usePropControl(
    propOptionsMatrix,
    'matrix',
    externalControl,
    true,
  );

  return (
    <Component
      baseUiId="button"
      controls={control}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateControl])}
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
                    <SFSymbol icon={sfHeartFill} />
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
