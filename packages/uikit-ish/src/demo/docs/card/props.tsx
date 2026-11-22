/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  glassSurfacePropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import { getPropOptionsCornerButton as gridCornerButton } from '../grid/props.js';
import { getPropOptionsRoot as switchRoot } from '../switch/props.js';

// Every part's options (its parts page's, see part-options.ts for the other
// demos).

/** A part rendering its own element: its class name and style. */
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsRoot = {
  ...glassSurfacePropOptions,
  ...commonPropOptions,
  active: [undefined, true, false] as const,
  momentary: [undefined, true] as const,
};

/** A corner button: the grid's options, named as the temperature's is. */
export const getPropOptionsCornerButton = (addLog: AddLog) => ({
  ...gridCornerButton(addLog),
  'aria-label': ['Living Room details', undefined] as const,
  visible: [undefined, false] as const,
});

export const propOptionsSymbol = {
  ...elementOptions,
  active: [undefined, true] as const,
  tint: [undefined, 'var(--color-ui-system-yellow)'] as const,
};

/** Its switch: a switch's options, its tint a card's. */
export const getPropOptionsSwitch = (addLog: AddLog) => {
  const { tint: _tint, ...options } = switchRoot(addLog, () => undefined);
  return {
    ...options,
    tint: [
      undefined,
      'var(--color-ui-system-teal)',
      'var(--color-ui-system-yellow)',
    ] as const,
  };
};

export const propOptionsTitle = elementOptions;

/** Formats as an app might choose them (`Intl.NumberFormat`'s options). */
const formats = [
  new MappedProp<Intl.NumberFormatOptions>(
    {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
      style: 'unit',
      unit: 'celsius',
    },
    '[°C, one decimal]',
  ),
  undefined,
  new MappedProp<Intl.NumberFormatOptions>(
    { maximumFractionDigits: 0, style: 'unit', unit: 'celsius' },
    '[°C, whole]',
  ),
  new MappedProp<Intl.NumberFormatOptions>(
    { style: 'unit', unit: 'fahrenheit', maximumFractionDigits: 0 },
    '[°F, whole]',
  ),
  new MappedProp<Intl.NumberFormatOptions>(
    { notation: 'compact' },
    '[compact]',
  ),
] as const;

export const propOptionsValue = {
  ...elementOptions,
  value: [21.5, undefined, 0, -3.25, 1234.5] as const,
  format: formats,
  locale: [undefined, 'en-US', 'de-DE', 'fr-FR', 'ar-EG'] as const,
  children: [undefined, 'Locked'] as const,
};
