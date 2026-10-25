/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { useMemo } from 'react';

import { DrawerSide, Toolbar } from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';

// Every part's props (all of them, for every view: see `useDrawerControls`).
// Parts with an element of their own: its class name and style (outlined
// or overlaid by the controls' checkboxes).
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/**
 * `Drawer.Root`'s options (its changes logged), its `side` first; open at
 * first (`isDefaultOpen`, uncontrolled: e.g. its popup's view, so the part
 * shows).
 */
export const getPropOptionsRoot = (
  addLog: AddLog,
  side: DrawerSide = 'inline-start',
  isDefaultOpen = false,
) => ({
  side: [
    side,
    side === 'inline-start' ? 'inline-end' : 'inline-start',
  ] as readonly DrawerSide[],
  defaultOpen: isDefaultOpen ? [true, undefined] : [undefined, true],
  disablePointerDismissal: [undefined, true] as const,
  modal: [undefined, false, 'trap-focus'] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean, { reason }: { reason: string }) =>
        addLog(`open: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onOpenChangeComplete: [
    undefined,
    new MappedProp(
      (isOpen: boolean) => addLog(`open complete: ${String(isOpen)}`),
      '[log change]',
    ),
  ] as const,
});

/**
 * `Drawer.Root`'s options, controlled (its `open` and `onOpenChange` the
 * app's: none of its own state's).
 */
export const getPropOptionsRootControlled = (addLog: AddLog) => {
  const {
    defaultOpen: _defaultOpen,
    onOpenChange: _onOpenChange,
    ...options
  } = getPropOptionsRoot(addLog);

  return options;
};

export const propOptionsSwipeArea = {
  ...elementOptions,
  render: commonPropOptions.render,
  width: [undefined, 44] as const,
  disabled: [undefined, true] as const,
};

export const propOptionsPopup = {
  ...elementOptions,
  size: [undefined, 280, 400] as const,
  floating: [undefined, true] as const,
};

/** A drawer's trigger: a bar's button, or a plain one. */
export const propOptionsTrigger = {
  ...elementOptions,
  render: [
    new MappedProp(<Toolbar.Button shape="circle" />, '[<Toolbar.Button />]'),
    new MappedProp(<button type="button" />, '[<button />]'),
  ] as const,
};

/** A drawer's close: its bar's Done, or a plain button. */
export const propOptionsClose = {
  ...elementOptions,
  render: [
    new MappedProp(
      <Toolbar.Button prominent />,
      '[<Toolbar.Button prominent />]',
    ),
    new MappedProp(<button type="button" />, '[<button />]'),
  ] as const,
};

/**
 * A drawer's close as a row's title (`List.Title`'s `render`): its own
 * element, a button (no toolbar's button outside a toolbar).
 */
export const propOptionsCloseRow = {
  ...elementOptions,
  render: [
    undefined,
    new MappedProp(<button type="button" />, '[<button />]'),
  ] as const,
};

/** A view's parts: the one it's about, open and emphasized. */
export type DrawerPart = 'Close' | 'Popup' | 'Root' | 'SwipeArea' | 'Trigger';

/**
 * A view's prop controls, one per part (each with all its props, in the
 * parts' order), the featured part's open and emphasized (the swipe area,
 * showing nothing of its own, overlaid; the others outlined); without one
 * (an overview), the root's open, unless all are closed (a composition's).
 * Several drawers in a view: each its `label` (in its controls' titles) and
 * its `offset` (its state's first index in the view's).
 */
export const useDrawerControls = (
  id: string,
  addLog: AddLog,
  {
    featured,
    isCloseInRow = false,
    isClosed = false,
    label,
    offset = 0,
    side,
  }: {
    featured?: DrawerPart;
    /** Its close a row's title (see `propOptionsCloseRow`). */
    isCloseInRow?: boolean;
    isClosed?: boolean;
    label?: string;
    offset?: number;
    /** Its drawer's side (first among the root's options). */
    side?: DrawerSide;
  } = {},
) => {
  const [
    externalRoot,
    externalSwipeArea,
    externalPopup,
    externalTrigger,
    externalClose,
  ] = useProvidedState(id).slice(offset);
  // (The swipe area, showing nothing of its own, overlaid.)
  const emphasis =
    featured === 'SwipeArea' ? ('overlay' as const) : ('outline' as const);
  const options = (part: DrawerPart) => ({
    emphasize: featured === part ? emphasis : undefined,
    isOpen:
      featured === undefined ? !isClosed && part === 'Root' : featured === part,
    title: label ? `Drawer.${part} (${label})` : `Drawer.${part}`,
  });

  // A part shown only while it's open, featured: open at first.
  const isDefaultOpen = featured === 'Popup' || featured === 'Close';
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(
      () => getPropOptionsRoot(addLog, side, isDefaultOpen),
      [addLog, isDefaultOpen, side],
    ),
    { external: externalRoot, ...options('Root') },
  );
  const [controlSwipeArea, propsSwipeArea, stateSwipeArea] = usePropControl(
    propOptionsSwipeArea,
    { external: externalSwipeArea, ...options('SwipeArea') },
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    { external: externalPopup, ...options('Popup') },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsTrigger,
    { external: externalTrigger, ...options('Trigger') },
  );
  const [controlClose, propsClose, stateClose] = usePropControl(
    isCloseInRow ? propOptionsCloseRow : propOptionsClose,
    { external: externalClose, ...options('Close') },
  );

  return {
    controls: [
      controlRoot,
      controlSwipeArea,
      controlPopup,
      controlTrigger,
      controlClose,
    ],
    keyRoot,
    propsClose,
    propsPopup,
    propsRoot,
    propsSwipeArea,
    propsTrigger,
    state: [stateRoot, stateSwipeArea, statePopup, stateTrigger, stateClose],
  };
};
