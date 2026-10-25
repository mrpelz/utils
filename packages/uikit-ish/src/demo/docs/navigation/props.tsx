/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { useMemo } from 'react';

import {
  type NavigationBackEventDetails,
  Toolbar,
} from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';

/** Popping the shown stack (logging why). */
type Pop = (eventDetails: NavigationBackEventDetails) => void;

/** The root's options; `pop` pops the shown stack (see `NavigationDemo`). */
export const getPropOptionsRoot = (pop: Pop) => ({
  ...commonPropOptions,
  onBack: [new MappedProp(pop, '[pop the stack]'), undefined] as const,
});

// The guide pages' views (see overview.tsx, parts.tsx).

/** The root's options in the guide's views; `pop` pops the stack. */
export const getPropOptionsGuideRoot = (pop: Pop) => ({
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  onBack: [new MappedProp(pop, '[pop the stack]'), undefined] as const,
});

/** A back button's options in the guide's views (its presses logged). */
export const getPropOptionsGuideBack = (addLog: AddLog) => ({
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  render: [
    new MappedProp(<Toolbar.Button shape="circle" />, '[<Toolbar.Button />]'),
    new MappedProp(<button type="button" />, '[<button />]'),
  ] as const,
  disabled: [undefined, true] as const,
  onClick: [
    undefined,
    new MappedProp(() => addLog('back clicked'), '[log click]'),
  ] as const,
});

/**
 * The compact-or-regular view's content: a phone's or a tablet's layout, or
 * (unset) by the window's width.
 */
export const propOptionsAdaptiveContent = {
  layout: [undefined, 'phone', 'tablet'] as const,
};

export const propOptionsGuideSwipeArea = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  width: [undefined, 44] as const,
};

/** A view's parts: the one it's about, open and emphasized. */
export type NavigationPart = 'Back' | 'Root' | 'SwipeArea';

/**
 * A view's prop controls, one per part (each with all its props), the
 * featured part's open and emphasized (the swipe area, showing nothing of
 * its own, overlaid; the others outlined); without one (an overview), the
 * root's open, unless all are closed (a composition's). `pop` pops the
 * view's stack (the root's `onBack`).
 */
export const useNavigationControls = (
  id: string,
  addLog: AddLog,
  pop: Pop,
  {
    featured,
    isClosed = false,
    offset = 0,
  }: { featured?: NavigationPart; isClosed?: boolean; offset?: number } = {},
) => {
  const [externalRoot, externalSwipeArea, externalBack] =
    useProvidedState(id).slice(offset);
  // (The swipe area, showing nothing of its own, overlaid.)
  const emphasis =
    featured === 'SwipeArea' ? ('overlay' as const) : ('outline' as const);
  const options = (part: NavigationPart) => ({
    emphasize: featured === part ? emphasis : undefined,
    isOpen:
      featured === undefined ? !isClosed && part === 'Root' : featured === part,
    title: `Navigation.${part}`,
  });

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(pop), [pop]),
    { external: externalRoot, ...options('Root') },
  );
  const [controlSwipeArea, propsSwipeArea, stateSwipeArea] = usePropControl(
    propOptionsGuideSwipeArea,
    { external: externalSwipeArea, ...options('SwipeArea') },
  );
  const [controlBack, propsBack, stateBack] = usePropControl(
    useMemo(() => getPropOptionsGuideBack(addLog), [addLog]),
    { external: externalBack, ...options('Back') },
  );

  return {
    controls: [controlRoot, controlSwipeArea, controlBack],
    propsBack,
    propsRoot,
    propsSwipeArea,
    state: [stateRoot, stateSwipeArea, stateBack],
  };
};
