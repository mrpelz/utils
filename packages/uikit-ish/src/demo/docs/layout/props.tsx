/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { useMemo } from 'react';

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';

// The guide pages' views (see overview.tsx, parts.tsx): each part's props
// (its own element's class name and style; it has no `render`).
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsGuideRoot = elementOptions;

export const propOptionsGuideBackground = elementOptions;

/**
 * A column's own props in a view, its defaults first: floating, clear of a
 * floating one, its size controlled (the app's: none of its own state's).
 */
export type LayoutColumnFlags = {
  isClearFloating?: boolean;
  isControlled?: boolean;
  isFloating?: boolean;
  maxSize?: number;
  minSize?: number;
};

/**
 * A column's options (its size's changes logged); `defaultSize` first
 * (`undefined`: flexible), its flags' defaults first.
 */
export const getPropOptionsGuideColumn = (
  name: string,
  defaultSize: number | undefined,
  isResizable: boolean,
  addLog: AddLog,
  {
    isClearFloating,
    isControlled,
    isFloating,
    maxSize,
    minSize,
  }: LayoutColumnFlags = {},
) => {
  const options = {
    ...elementOptions,
    defaultSize: [
      defaultSize,
      ...[undefined, 280, 360].filter((size) => size !== defaultSize),
    ],
    size: [undefined, 320] as const,
    minSize: [
      minSize,
      ...[undefined, 200, 280].filter((size) => size !== minSize),
    ],
    maxSize: [
      maxSize,
      ...[undefined, 400, 480].filter((size) => size !== maxSize),
    ],
    resizable: [isResizable, !isResizable] as const,
    floating: isFloating ? [true, undefined] : [undefined, true],
    clearFloating: isClearFloating ? [true, undefined] : [undefined, true],
    onSizeChange: [
      new MappedProp(
        (size: number) => addLog(`${name} size: ${String(size)}`),
        '[log change]',
      ),
      undefined,
    ] as const,
  };
  if (!isControlled) return options;

  const {
    defaultSize: _defaultSize,
    onSizeChange: _onSizeChange,
    size: _size,
    ...uncontrolled
  } = options;

  return uncontrolled;
};

/** A view's parts: the one it's about, open and outlined. */
export type LayoutPart = 'Background' | 'Column' | 'Root';

/**
 * A view's column: its name, its initial size, whether it's resizable, its
 * own props (see `LayoutColumnFlags`).
 */
export type LayoutColumn = readonly [
  name: string,
  defaultSize: number | undefined,
  isResizable: boolean,
  flags?: LayoutColumnFlags,
];

/**
 * A view's prop controls, one per part (each with all its props: the root,
 * the background if it has one, each column), the featured part's open and
 * outlined (a column: the first); without one (an overview), the root's
 * open, unless all are closed (a composition's).
 */
export const useLayoutControls = (
  id: string,
  addLog: AddLog,
  {
    columns,
    featured,
    hasBackground = false,
    isClosed = false,
  }: {
    /** Two columns, or three. */
    columns: readonly [LayoutColumn, LayoutColumn, LayoutColumn?];
    featured?: LayoutPart;
    hasBackground?: boolean;
    isClosed?: boolean;
  },
) => {
  const [
    externalRoot,
    externalBackground,
    externalFirst,
    externalSecond,
    externalThird,
  ] = useProvidedState(id);
  const [
    [firstName, firstSize, isFirstResizable, firstFlags],
    [secondName, secondSize, isSecondResizable, secondFlags],
    third,
  ] = columns;
  // (Its hooks called all the same, without a third column.)
  const [thirdName, thirdSize, isThirdResizable, thirdFlags] = third ?? [
    'third',
    undefined,
    false,
  ];
  const options = (part: LayoutPart, isFirst = true) => ({
    emphasize: featured === part && isFirst ? ('outline' as const) : undefined,
    isOpen:
      featured === undefined
        ? !isClosed && part === 'Root'
        : featured === part && isFirst,
  });

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsGuideRoot,
    { external: externalRoot, title: 'Layout.Root', ...options('Root') },
  );
  const [controlBackground, propsBackground, stateBackground] = usePropControl(
    propOptionsGuideBackground,
    {
      external: externalBackground,
      title: 'Layout.Background',
      ...options('Background'),
    },
  );
  const [controlFirst, propsFirst, stateFirst, keyFirst] = usePropControl(
    useMemo(
      () =>
        getPropOptionsGuideColumn(
          firstName,
          firstSize,
          isFirstResizable,
          addLog,
          firstFlags,
        ),
      [addLog, firstFlags, firstName, firstSize, isFirstResizable],
    ),
    {
      external: externalFirst,
      title: `Layout.Column (${firstName})`,
      ...options('Column'),
    },
  );
  const [controlSecond, propsSecond, stateSecond, keySecond] = usePropControl(
    useMemo(
      () =>
        getPropOptionsGuideColumn(
          secondName,
          secondSize,
          isSecondResizable,
          addLog,
          secondFlags,
        ),
      [addLog, isSecondResizable, secondFlags, secondName, secondSize],
    ),
    {
      external: externalSecond,
      title: `Layout.Column (${secondName})`,
      ...options('Column', false),
    },
  );

  const [controlThird, propsThird, stateThird, keyThird] = usePropControl(
    useMemo(
      () =>
        getPropOptionsGuideColumn(
          thirdName,
          thirdSize,
          isThirdResizable,
          addLog,
          thirdFlags,
        ),
      [addLog, isThirdResizable, thirdFlags, thirdName, thirdSize],
    ),
    {
      external: externalThird,
      title: `Layout.Column (${thirdName})`,
      ...options('Column', false),
    },
  );

  return {
    controls: [
      controlRoot,
      ...(hasBackground ? [controlBackground] : []),
      controlFirst,
      controlSecond,
      ...(third ? [controlThird] : []),
    ],
    keyFirst,
    keySecond,
    keyThird,
    propsBackground,
    propsFirst,
    propsRoot,
    propsSecond,
    propsThird,
    state: [stateRoot, stateBackground, stateFirst, stateSecond, stateThird],
  };
};
