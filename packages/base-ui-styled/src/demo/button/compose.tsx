/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import { Fragment, ReactNode } from 'react';

import { Button } from '../../components/index.js';
import { commonPropOptions, PropMap, usePropControl } from '../utils/main.js';

/** How many controls (and states) `useButtonDemo` has. */
export const buttonControlCount = 4;

/** The content's options (see `propOptionsContent`): its keys. */
export type ButtonContentOptions = PropMap & {
  label: readonly unknown[];
  order: readonly unknown[];
  symbol: readonly unknown[];
};

export type ButtonDemoOptions<
  Content extends ButtonContentOptions,
  Root extends PropMap,
> = {
  /**
   * The content's options: as the button demo's (`propOptionsContent`),
   * with a composing demo's own values.
   */
  content: Content;
  /** Without its content's control (the composing demo gives the content). */
  noContent?: boolean;
  /** Before the controls' titles (e.g. `trigger: `). */
  prefix?: string;
  /** The root's options (as `getPropOptionsRoot`'s, with own values). */
  root: Root;
};

/**
 * A `Button`'s demo controls (its content, root, symbol and label) and
 * content, for its demo and demos composing a button (e.g. a menu's
 * trigger): all of its demo's props, with the composing demo's values.
 */
export const useButtonDemo = <
  Content extends ButtonContentOptions,
  Root extends PropMap,
>(
  externals: readonly unknown[],
  {
    content: contentOptions,
    noContent = false,
    prefix = '',
    root,
  }: ButtonDemoOptions<Content, Root>,
) => {
  const [externalContent, externalRoot, externalSymbol, externalLabel] =
    externals;

  const [controlContent, content, stateContent] = usePropControl(
    contentOptions,
    `${prefix}[content]`,
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    root,
    `${prefix}root`,
    externalRoot,
    true,
  );
  const [controlSymbol, propsSymbol, stateSymbol] = usePropControl(
    commonPropOptions,
    `${prefix}symbol`,
    externalSymbol,
  );
  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    `${prefix}label`,
    externalLabel,
  );

  // Composed in either order: a pop-up button's label comes first, its
  // symbol (e.g. chevron.up.chevron.down) after it.
  const symbol =
    content.symbol === undefined ? null : (
      <Button.Symbol {...propsSymbol}>
        {content.symbol as ReactNode}
      </Button.Symbol>
    );
  const label =
    content.label === undefined ? null : (
      <Button.Label {...propsLabel}>{content.label as ReactNode}</Button.Label>
    );
  const children: ReactNode =
    content.order === 'labelFirst' ? (
      <Fragment>
        {label}
        {symbol}
      </Fragment>
    ) : (
      <Fragment>
        {symbol}
        {label}
      </Fragment>
    );

  return {
    children,
    controls: [
      ...(noContent ? [] : [controlContent]),
      controlRoot,
      controlSymbol,
      controlLabel,
    ],
    propsLabel,
    propsRoot,
    propsSymbol,
    Remounter,
    states: [stateContent, stateRoot, stateSymbol, stateLabel],
  };
};
