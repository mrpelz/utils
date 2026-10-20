import './style.css';

import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { Fragment, FunctionComponent, ReactNode, useMemo } from 'react';

import { Button, ButtonRootProps, Symbol } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { commonPropOptions, usePropControl } from '../frame/prop-control.js';
import { useCreateStateUrl, useProvidedState } from '../frame/state.js';
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
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
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

  const symbol =
    content.symbol === undefined ? null : (
      <Button.Icon {...propsSymbol}>{content.symbol as ReactNode}</Button.Icon>
    );
  const label =
    content.label === undefined ? null : (
      <Button.Label {...propsLabel}>{content.label as ReactNode}</Button.Label>
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
      {/* A pop-up button: the label first, then the symbol. */}
      <Button.Root
        key={elementKey}
        {...propsRoot}
      >
        {content.order === 'labelFirst' ? label : symbol}
        {content.order === 'labelFirst' ? symbol : label}
      </Button.Root>
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
    ? { size: undefined, variant }
    : matrixSizes.map((size) => ({ size, variant })),
);

const matrixColumns = [false, true].flatMap((disabled) =>
  matrixLabelTypes.map((labelType) => ({ disabled, labelType })),
);

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
      <div className="button-demo-matrix">
        <span />
        {matrixColumns.map(({ disabled, labelType }) => (
          <span
            key={`${labelType}-${String(disabled)}`}
            className="button-demo-heading"
          >
            {labelType}
            {disabled ? ' (disabled)' : ''}
          </span>
        ))}
        {matrixRows.map(({ size, variant }) => (
          <Fragment key={`${variant}-${size ?? ''}`}>
            <span className="button-demo-heading">
              {variant}
              {size ? ` ${size}` : ''}
            </span>
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
                  <Button.Icon>
                    <Symbol icon={sfHeartFill} />
                  </Button.Icon>
                )}
                {labelType === 'symbol' ? null : (
                  <Button.Label>Label</Button.Label>
                )}
              </Button.Root>
            ))}
          </Fragment>
        ))}
      </div>
    </Component>
  );
};
