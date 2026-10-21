/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type { PageControlChangeEventDetails } from '../../components/index.js';
import { propOptionsRoot as propOptionsButtonRoot } from '../button/props.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

/** The page dots demo's content: its pages. */
export const propOptionsPageDotsContent = { pages: [5, 3, 12] as const };

/** The symbols demo's content: its capsule's buttons. */
export const propOptionsSymbolsContent = { symbols: [3, 2, 4, 5, 6] as const };

export const propOptionsRoot = {
  ...commonPropOptions,
  placement: [undefined, 'block-end', 'block-start'] as const,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
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
};

export const propOptionsGroup = {
  ...commonPropOptions,
  prominent: [undefined, false, true] as const,
  // Over the tint: dark, light, or custom.
  textColor: [
    undefined,
    '#000',
    '#fff',
    'var(--color-ios-system-yellow)',
  ] as const,
  tint: [
    undefined,
    'var(--color-ios-system-orange)',
    'var(--color-ios-system-green)',
  ] as const,
  disabled: [undefined, false, true] as const,
};

// A button of its own: a `Button` (its demo's options), also `prominent`
// (tinted glass); in a group, what applies there.
const propOptionsOwnButton = {
  ...propOptionsButtonRoot,
  prominent: [undefined, false, true] as const,
};

// (Not `size`, `context`, nor glass variants: the capsule's.)
const propOptionsGroupButton = {
  disabled: propOptionsButtonRoot.disabled,
  focusableWhenDisabled: propOptionsButtonRoot.focusableWhenDisabled,
  variant: [
    undefined,
    'borderless',
    'bordered',
    'bordered-secondary',
    'bordered-prominent',
  ] as const,
  shape: [undefined, 'capsule', 'circle'] as const,
  destructive: propOptionsButtonRoot.destructive,
  fill: propOptionsButtonRoot.fill,
  tint: propOptionsButtonRoot.tint,
};

/** A button's options; of its own (not in a group), a `Button`'s. */
export const getPropOptionsButton = (addLog: AddLog, own: boolean) => ({
  ...commonPropOptions,
  ...(own ? propOptionsOwnButton : propOptionsGroupButton),
  cursor: cursorOptions,
  onClick: [
    new MappedProp(() => addLog('button clicked'), '[log click]'),
    undefined,
  ] as const,
  onSecondaryClick: [
    undefined,
    new MappedProp(
      () => addLog('button secondary click'),
      '[log secondary click]',
    ),
  ] as const,
});

export const getPropOptionsPageControl = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: [undefined, 0, 2] as const,
  value: [undefined, 0, 1, 4] as const,
  disabled: [undefined, false, true] as const,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
    'adaptive',
  ] as const,
  onValueChange: [
    new MappedProp(
      (page: number, { reason }: PageControlChangeEventDetails) =>
        addLog(`page change: ${page} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

// The guide pages' views (see overview.tsx, parts.tsx): each part's props,
// outlined by default.

/** The overview's bars: shown, and what they hold. */
export const propOptionsOverviewTop = {
  shown: [true, false] as const,
  subtitle: [false, true] as const,
  alignStart: [undefined, false, true] as const,
};

export const propOptionsOverviewBottom = {
  shown: [true, false] as const,
  title: [true, false] as const,
  prominent: [undefined, false, true] as const,
};

export const propOptionsOverviewRoot = {
  context: propOptionsRoot.context,
  disabled: propOptionsRoot.disabled,
};

export const propOptionsSpacer = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsTitle = {
  ...commonPropOptions,
  alignStart: [undefined, false, true] as const,
};

export const propOptionsSeparator = {
  ...commonPropOptions,
  orientation: [undefined, 'vertical', 'horizontal'] as const,
};

export const propOptionsLink = {
  ...commonPropOptions,
  href: ['toolbar/parts#toolbar-link', undefined] as const,
};

export const propOptionsInput = {
  ...commonPropOptions,
  defaultValue: [undefined, 'Cupertino'] as const,
  disabled: [undefined, false, true] as const,
  focusableWhenDisabled: [undefined, false, true] as const,
};

export {
  commonPropOptions as propOptionsSide,
  commonPropOptions as propOptionsSubtitle,
} from '../frame/prop-control.js';
