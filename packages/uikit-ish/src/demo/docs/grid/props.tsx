/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type {
  GridBreakRows,
  GridSize,
  GridSizeChangeDetails,
} from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

// Every part's options (its parts page's, see part-options.ts for the other
// demos). The reorder handles and names are the app's wiring, set by each
// view, never controls.

/** A part rendering its own element: its class name and style. */
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/** A size change, logged with what it took in. */
const logSize = (addLog: AddLog, name: string) =>
  new MappedProp(
    (size: GridSize, { merged }: GridSizeChangeDetails) =>
      addLog(
        `${name} size: ${size}${merged.length > 0 ? ` (took in ${merged.join(', ')})` : ''}`,
      ),
    '[log change]',
  );

export const propOptionsRoot = {
  ...elementOptions,
  editing: [undefined, false, true] as const,
  dense: [undefined, false, true] as const,
  gap: [undefined, 8, 12, 20] as const,
  unitSize: [undefined, 90, 110, 140] as const,
  unitMin: [undefined, 80, 100] as const,
  unitMax: [undefined, 130, 160] as const,
};

/** The root's, editing from the start (a view about editing). */
export const propOptionsRootEditing = {
  ...propOptionsRoot,
  editing: [true, false] as const,
};

export const propOptionsSection = {
  ...elementOptions,
  dense: [undefined, false, true] as const,
};

export const propOptionsHeader = elementOptions;

/** A drop group renders nothing of its own: no options but its wiring. */
export const propOptionsDropGroup = {};

/** An item's size options: its own first, then a few others. */
const sizesOf = (size: GridSize | undefined) => [
  size,
  ...([undefined, '1x1', '2x1', '2x2', '3x2'] as const).filter(
    (each) => each !== size,
  ),
];

export const getPropOptionsItem =
  (name: string, defaultSize?: GridSize) => (addLog: AddLog) => ({
    ...elementOptions,
    defaultSize: sizesOf(defaultSize),
    size: [undefined, '1x1', '2x2'] as const,
    supportedSizes: [
      undefined,
      new MappedProp<readonly GridSize[]>(
        ['1x1', '2x1', '2x2'],
        '[1x1, 2x1, 2x2]',
      ),
      new MappedProp<readonly GridSize[]>(['2x1'], '[2x1]'),
    ] as const,
    onSizeChange: [logSize(addLog, name), undefined] as const,
  });

export const getPropOptionsSpacer =
  (name: string, defaultSize?: GridSize) => (addLog: AddLog) => ({
    ...elementOptions,
    defaultSize: sizesOf(defaultSize),
    size: [undefined, '1x1', '2x1'] as const,
    onSizeChange: [logSize(addLog, name), undefined] as const,
  });

export const getPropOptionsSpawn =
  (name: string, defaultSize?: GridSize) => (addLog: AddLog) => ({
    ...commonPropOptions,
    defaultSize: sizesOf(defaultSize),
    size: [undefined, '1x1', '2x1'] as const,
    onSizeChange: [logSize(addLog, name), undefined] as const,
  });

export const getPropOptionsBreak =
  (name: string, defaultRows?: GridBreakRows) => (addLog: AddLog) => ({
    ...elementOptions,
    defaultRows: [
      defaultRows,
      ...([undefined, 1, 2, 3] as const).filter((rows) => rows !== defaultRows),
    ],
    rows: [undefined, 1, 2] as const,
    onRowsChange: [
      new MappedProp(
        (rows: GridBreakRows, { merged }: GridSizeChangeDetails) =>
          addLog(
            `${name} rows: ${String(rows)}${merged.length > 0 ? ` (took in ${merged.join(', ')})` : ''}`,
          ),
        '[log change]',
      ),
      undefined,
    ] as const,
  });

export const getPropOptionsResizeHandle = (addLog: AddLog) => ({
  ...commonPropOptions,
  onClick: [
    undefined,
    new MappedProp(() => addLog('resize handle: click'), '[log click]'),
  ] as const,
});

export const propOptionsRemoveButton = {
  ...commonPropOptions,
  'aria-label': ['Remove Lamp', undefined] as const,
};

/** The overview's few: how it lays out, not its plumbing. */
export const propOptionsOverviewRoot = {
  dense: [undefined, true] as const,
  unitSize: [undefined, 90, 140] as const,
  gap: [undefined, 8, 20] as const,
};
