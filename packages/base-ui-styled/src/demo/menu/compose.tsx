/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import { sfChevronUpChevronDown } from '@bradleyhodges/sfsymbols/sfChevronUpChevronDown';
import { useMemo } from 'react';

import { Button, Menu } from '../../components/index.js';
import { buttonControlCount, useButtonDemo } from '../button/compose.js';
import { propOptionsContent as propOptionsButtonContent } from '../button/props.js';
import { AddLog } from '../utils/log.js';
import { PropMap, usePropControl } from '../utils/main.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsRoot,
  propOptionsPopup,
  propOptionsPositioner,
} from './props.js';

/** How many controls (and states) `usePopUpDemo` has. */
export const popUpControlCount = buttonControlCount + 3;

export type PopUpDemoOptions<ButtonRoot extends PropMap> = {
  /**
   * Its button's root's options: as the button demo's
   * (`getPropOptionsRoot`), with a composing demo's own values (e.g. gray,
   * as in lists).
   */
  button: ButtonRoot;
  /** Before the controls' titles (e.g. `pop-up: `). */
  prefix?: string;
};

/**
 * A pop-up button's demo controls (its button's, the menu's root,
 * positioner and popup) and its element: a menu of `options`, its trigger a
 * button (the chosen option's label, then chevron.up.chevron.down), closing
 * on choosing; all of the button's and menu's demos' props.
 */
export const usePopUpDemo = <Option extends string, ButtonRoot extends PropMap>(
  addLog: AddLog,
  externals: readonly unknown[],
  options: readonly Option[],
  { button, prefix = '' }: PopUpDemoOptions<ButtonRoot>,
) => {
  const [externalRoot, externalPositioner, externalPopup, ...externalButton] =
    externals;

  // Its button's content is the chosen option's label (no control).
  const trigger = useButtonDemo(externalButton, {
    content: propOptionsButtonContent,
    noContent: true,
    prefix: `${prefix}button: `,
    root: button,
  });
  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    useMemo(() => getPropOptionsRoot(undefined, addLog), [addLog]),
    `${prefix}menu root`,
    externalRoot,
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    `${prefix}menu positioner`,
    externalPositioner,
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    `${prefix}menu popup`,
    externalPopup,
  );

  const render = (value: Option, onValueChange: (value: Option) => void) => (
    <Remounter>
      <Menu.Root {...propsRoot}>
        <Menu.Trigger render={<Button.Root {...trigger.propsRoot} />}>
          <Button.Label {...trigger.propsLabel}>{value}</Button.Label>
          <Button.Symbol {...trigger.propsSymbol}>
            <SFSymbol icon={sfChevronUpChevronDown} />
          </Button.Symbol>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner
            {...propsPositioner}
            align={propsPositioner.align ?? 'end'}
          >
            <Menu.Popup {...propsPopup}>
              <Menu.RadioGroup
                value={value}
                onValueChange={(next: unknown) => onValueChange(next as Option)}
              >
                {options.map((option) => (
                  <Menu.RadioItem
                    key={option}
                    // A pop-up closes on choosing (iOS).
                    closeOnClick
                    value={option}
                  >
                    <Menu.RadioItemIndicator />
                    <Menu.Label>{option}</Menu.Label>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Remounter>
  );

  return {
    controls: [
      ...trigger.controls,
      controlRoot,
      controlPositioner,
      controlPopup,
    ],
    render,
    states: [stateRoot, statePositioner, statePopup, ...trigger.states],
  };
};
