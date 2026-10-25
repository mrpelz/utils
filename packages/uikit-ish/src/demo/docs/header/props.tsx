/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import {
  commonPropOptions,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';

export const propOptionsBar = {
  ...commonPropOptions,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
    'adaptive',
  ] as const,
  disabled: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
};

export const propOptionsTitle = {
  ...commonPropOptions,
  alignStart: [undefined, false, true] as const,
};

export const propOptionsLargeTitle = {
  ...commonPropOptions,
  'aria-level': [undefined, 1, 2] as const,
};

export const propOptionsAccessory = { ...commonPropOptions };

// The guide pages' views (see overview.tsx, parts.tsx).

/** The overview's header: a large title (or the bar's only), a subtitle. */
export const propOptionsOverviewContent = {
  largeTitle: [true, false] as const,
  subtitle: [false, true] as const,
};

/** A view's parts: the one it's about, open and outlined. */
export type HeaderPart = 'Accessory' | 'Bar' | 'LargeTitle';

/**
 * A view's prop controls: its bar's (the app's `Toolbar.Root`, in a
 * `Viewport.BlockStart`), its large title's, its accessory's (if it has
 * one), each with all its props; the featured part's open and outlined;
 * without one (an overview), the bar's open, unless all are closed (a
 * composition's). Its state from `offset` in the view's (after its own).
 */
export const useHeaderControls = (
  id: string,
  {
    featured,
    hasAccessory = false,
    isClosed = false,
    offset = 0,
  }: {
    featured?: HeaderPart;
    hasAccessory?: boolean;
    isClosed?: boolean;
    offset?: number;
  } = {},
) => {
  const [externalBar, externalLargeTitle, externalAccessory] =
    useProvidedState(id).slice(offset);
  const options = (part: HeaderPart) => ({
    emphasize: featured === part ? ('outline' as const) : undefined,
    isOpen:
      featured === undefined ? !isClosed && part === 'Bar' : featured === part,
  });

  const [controlBar, propsBar, stateBar] = usePropControl(propOptionsBar, {
    external: externalBar,
    title: 'Toolbar.Root (bar)',
    ...options('Bar'),
  });
  const [controlLargeTitle, propsLargeTitle, stateLargeTitle] = usePropControl(
    propOptionsLargeTitle,
    {
      external: externalLargeTitle,
      title: 'Header.LargeTitle',
      ...options('LargeTitle'),
    },
  );
  const [controlAccessory, propsAccessory, stateAccessory] = usePropControl(
    propOptionsAccessory,
    {
      external: externalAccessory,
      title: 'Header.Accessory',
      ...options('Accessory'),
    },
  );

  return {
    controls: [
      controlBar,
      controlLargeTitle,
      ...(hasAccessory ? [controlAccessory] : []),
    ],
    propsAccessory,
    propsBar,
    propsLargeTitle,
    state: [stateBar, stateLargeTitle, stateAccessory],
  };
};
