/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import { ReactNode, useMemo } from 'react';

import { AddLog } from '../utils/log.js';
import { commonPropOptions, PropMap, usePropControl } from '../utils/main.js';
import {
  getPropOptionsClear,
  propOptionsError,
  suggestionsId,
} from './props.js';

/** How many controls (and states) `useTextFieldDemo` has. */
export const textFieldControlCount = 6;

export type TextFieldDemoOptions<
  Root extends PropMap,
  Control extends PropMap,
> = {
  /**
   * The control's options: as the text field demo's
   * (`getPropOptionsControl`), with a composing demo's own values.
   */
  control: Control;
  /** Before the controls' titles (e.g. `name field: `). */
  prefix?: string;
  /** The root's options (as `propOptionsRoot`'s, with own values). */
  root: Root;
};

/**
 * A `TextField`'s demo controls (root, label, control, clear button,
 * description, error), for its demo and demos composing a field (e.g. a
 * form): all of its demo's props, with the composing demo's values; the
 * parts' props, and the suggestions
 * (`<datalist>`) its control's `list` option refers to.
 */
export const useTextFieldDemo = <Root extends PropMap, Control extends PropMap>(
  addLog: AddLog,
  externals: readonly unknown[],
  { control, prefix = '', root }: TextFieldDemoOptions<Root, Control>,
) => {
  const [
    externalRoot,
    externalLabel,
    externalControl,
    externalClear,
    externalDescription,
    externalError,
  ] = externals;

  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    root,
    `${prefix}root`,
    externalRoot,
    true,
  );
  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    `${prefix}label`,
    externalLabel,
  );
  const [controlControl, propsControl, stateControl] = usePropControl(
    control,
    `${prefix}control`,
    externalControl,
    true,
  );
  const [controlClear, propsClear, stateClear] = usePropControl(
    useMemo(() => getPropOptionsClear(addLog), [addLog]),
    `${prefix}clear`,
    externalClear,
  );
  const [controlDescription, propsDescription, stateDescription] =
    usePropControl(
      commonPropOptions,
      `${prefix}description`,
      externalDescription,
    );
  const [controlError, propsError, stateError] = usePropControl(
    propOptionsError,
    `${prefix}error`,
    externalError,
  );

  const suggestions: ReactNode = (
    <datalist id={suggestionsId}>
      {['Kate Bell', 'John Appleseed', 'Anna Haro'].map((name) => (
        <option
          key={name}
          value={name}
        />
      ))}
    </datalist>
  );

  return {
    controls: [
      controlRoot,
      controlLabel,
      controlControl,
      controlClear,
      controlDescription,
      controlError,
    ],
    props: {
      clear: propsClear,
      control: propsControl,
      description: propsDescription,
      error: propsError,
      label: propsLabel,
      root: propsRoot,
    },
    Remounter,
    states: [
      stateRoot,
      stateLabel,
      stateControl,
      stateClear,
      stateDescription,
      stateError,
    ],
    suggestions,
  };
};
