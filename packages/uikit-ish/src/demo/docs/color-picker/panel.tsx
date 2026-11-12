import type { ReactNode } from 'react';

import {
  Button,
  ColorPicker,
  type ColorPickerSlidersModel,
  type ColorPickerSlidersRange,
  type ColorPickerSwatchesProps,
  Symbol,
} from '../../../components/index.js';
import type { PartProps } from '../../tooling/frame/prop-control.js';
import { sfDocumentOnDocument } from '../../tooling/icons.js';

// The demos' panels, as composed (see `panelParts`): their modes (in
// order), whether they have the opacity and the swatches.

/**
 * A mode's view: its element, or made with the demo's other parts' props
 * (see `usePartControls`).
 */
type ModeView = ReactNode | ((partProps: PartProps) => ReactNode);

/** A mode: its value, its label, its view. */
export type ModeEntry = [value: string, label: string, view: ModeView];

/** A view, with the demo's other parts' props. */
const viewOf = (view: ModeView, partProps: PartProps): ReactNode =>
  typeof view === 'function' ? view(partProps) : view;

/** The code's copy button (a menu of its codes). */
const codeCopy = (partProps: PartProps) => (
  <ColorPicker.CodeCopy
    {...partProps['ColorPicker.CodeCopy']}
    shape="circle"
    size="small"
    variant="bordered-secondary"
  >
    <Button.Icon {...partProps['Button.Icon']}>
      <Symbol
        {...partProps.Symbol}
        icon={sfDocumentOnDocument}
      />
    </Button.Icon>
  </ColorPicker.CodeCopy>
);

/**
 * The code's row (under the sliders, as the system's), its copy button
 * before its field (or none: `hasCopy`).
 */
export const codeRow =
  (hasCopy = true) =>
  (partProps: PartProps): ReactNode => (
    <ColorPicker.Code {...partProps['ColorPicker.Code']}>
      {hasCopy ? codeCopy(partProps) : null}
    </ColorPicker.Code>
  );

const sliders =
  (
    model?: ColorPickerSlidersModel,
    range?: ColorPickerSlidersRange,
    code: ModeView = codeRow(),
  ) =>
  (partProps: PartProps) => (
    <ColorPicker.Sliders
      {...partProps['ColorPicker.Sliders']}
      model={model}
      range={range}
    >
      {viewOf(code, partProps)}
    </ColorPicker.Sliders>
  );

const grid: ModeEntry = [
  'grid',
  'Grid',
  (partProps) => (
    <ColorPicker.Grid
      key="grid"
      {...partProps['ColorPicker.Grid']}
    />
  ),
];
const spectrum: ModeEntry = [
  'spectrum',
  'Spectrum',
  (partProps) => (
    <ColorPicker.Spectrum
      key="spectrum"
      {...partProps['ColorPicker.Spectrum']}
    />
  ),
];
const rgb: ModeEntry = ['rgb', 'RGB', sliders('rgb')];
const hsl: ModeEntry = ['hsl', 'HSL', sliders('hsl')];
const cmyk: ModeEntry = ['cmyk', 'CMYK', sliders('cmyk')];
const named: ModeEntry = [
  'named',
  'Named',
  (partProps) => (
    <ColorPicker.Named
      key="named"
      {...partProps['ColorPicker.Named']}
    >
      <ColorPicker.CssNamedColors />
    </ColorPicker.Named>
  ),
];

/** Mode sets: the system's (one sliders view, “Sliders”), and others (their values the same: `grid`, `spectrum`, `rgb`, `hsl`, `cmyk`, `named`). */
export const modeSets = {
  all: [grid, spectrum, rgb, hsl, cmyk, named],
  sliders: [rgb, hsl, cmyk],
  system: [grid, spectrum, ['rgb', 'Sliders', sliders()]],
} satisfies Record<string, ModeEntry[]>;

export type ModeSet = keyof typeof modeSets;

/**
 * Each mode rendered or not (as a prop control's, see the overview); RGB,
 * in its range; the sliders' code row, its copy button.
 */
export type ModesShown = {
  cmyk?: boolean;
  code?: boolean;
  codeCopy?: boolean;
  grid?: boolean;
  hsl?: boolean;
  named?: boolean;
  rgb?: ColorPickerSlidersRange | false;
  spectrum?: boolean;
};

/**
 * The modes rendered, in their order; RGB labeled “Sliders” while it's the
 * only sliders mode (as the system's).
 */
export const shownModes = ({
  cmyk: isCmyk = false,
  code: isCode = true,
  codeCopy: isCodeCopy = true,
  grid: isGrid = true,
  hsl: isHsl = false,
  named: isNamed = false,
  rgb: rgbRange = 'byte',
  spectrum: isSpectrum = true,
}: ModesShown): ModeEntry[] => {
  const code = isCode ? codeRow(isCodeCopy) : null;
  const rgbEntry: ModeEntry = [
    'rgb',
    isHsl || isCmyk ? 'RGB' : 'Sliders',
    sliders(isHsl || isCmyk ? 'rgb' : undefined, rgbRange || undefined, code),
  ];
  const hslEntry: ModeEntry = ['hsl', 'HSL', sliders('hsl', undefined, code)];
  const cmykEntry: ModeEntry = [
    'cmyk',
    'CMYK',
    sliders('cmyk', undefined, code),
  ];
  const entries: [isShown: boolean, entry: ModeEntry][] = [
    [isGrid, grid],
    [isSpectrum, spectrum],
    [rgbRange !== false, rgbEntry],
    [isHsl, hslEntry],
    [isCmyk, cmykEntry],
    [isNamed, named],
  ];
  return entries.filter(([isShown]) => isShown).map(([, entry]) => entry);
};

/** Its composition's options (see `panelParts`), as a prop control's. */
export const propOptionsComposition = {
  modes: ['system', 'all', 'sliders'] as const,
  opacity: [true, false] as const,
  swatches: [true, false] as const,
};

const entriesOf = (modes: ModeEntry[] | ModeSet) =>
  typeof modes === 'string' ? modeSets[modes] : modes;

/** Its modes' control (by `modes`): in its panel, or a sheet's header. */
export const modesControl = (
  modes: ModeEntry[] | ModeSet = 'system',
  partProps: PartProps = {},
): ReactNode => (
  <ColorPicker.Modes
    key="modes"
    {...partProps['ColorPicker.Modes']}
  >
    {entriesOf(modes).map(([value, label]) => (
      <ColorPicker.Mode
        key={value}
        {...partProps['ColorPicker.Mode']}
        value={value}
      >
        {label}
      </ColorPicker.Mode>
    ))}
  </ColorPicker.Modes>
);

/**
 * A panel's parts: its modes' control (unless elsewhere: `isModesElsewhere`,
 * e.g. in a sheet's header) and views (by `modes`), its opacity and
 * swatches (unless left out).
 */
export const panelParts = ({
  isModesElsewhere = false,
  modes = 'system',
  opacity = true,
  partProps = {},
  swatches = true,
  swatchesProps,
}: {
  isModesElsewhere?: boolean;
  modes?: ModeEntry[] | ModeSet;
  opacity?: boolean;
  /** The demo's other parts' props (see `usePartControls`). */
  partProps?: PartProps;
  swatches?: boolean;
  swatchesProps?: ColorPickerSwatchesProps;
} = {}): ReactNode[] => {
  const entries = entriesOf(modes);
  return [
    isModesElsewhere ? null : modesControl(entries, partProps),
    ...entries.map(([value, , view]) => (
      <ColorPicker.View
        key={value}
        {...partProps['ColorPicker.View']}
        value={value}
      >
        {viewOf(view, partProps)}
      </ColorPicker.View>
    )),
    opacity ? (
      <ColorPicker.Opacity
        key="opacity"
        {...partProps['ColorPicker.Opacity']}
      />
    ) : null,
    swatches ? (
      <ColorPicker.Swatches
        key="swatches"
        {...partProps['ColorPicker.Swatches']}
        {...swatchesProps}
      />
    ) : null,
  ];
};
