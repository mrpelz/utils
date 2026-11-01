import type { ReactNode } from 'react';

import {
  Button,
  ColorPicker,
  type ColorPickerSlidersModel,
  type ColorPickerSlidersRange,
  type ColorPickerSwatchesProps,
  Symbol,
} from '../../../components/index.js';
import { sfDocumentOnDocument } from '../../tooling/icons.js';

// The demos' panels, as composed (see `panelParts`): their modes (in
// order), whether they have the opacity and the swatches.

type ModeEntry = [value: string, label: string, view: ReactNode];

/** The code's copy button (a menu of its codes). */
const codeCopy = (
  <ColorPicker.CodeCopy
    shape="circle"
    size="small"
    variant="bordered-secondary"
  >
    <Button.Icon>
      <Symbol icon={sfDocumentOnDocument} />
    </Button.Icon>
  </ColorPicker.CodeCopy>
);

/**
 * The code's row (under the sliders, as the system's), its copy button
 * before its field (or none: `hasCopy`).
 */
export const codeRow = (hasCopy = true): ReactNode => (
  <ColorPicker.Code>{hasCopy ? codeCopy : null}</ColorPicker.Code>
);

const sliders = (
  model?: ColorPickerSlidersModel,
  range?: ColorPickerSlidersRange,
  code: ReactNode = codeRow(),
) => (
  <ColorPicker.Sliders
    model={model}
    range={range}
  >
    {code}
  </ColorPicker.Sliders>
);

const grid: ModeEntry = ['grid', 'Grid', <ColorPicker.Grid key="grid" />];
const spectrum: ModeEntry = [
  'spectrum',
  'Spectrum',
  <ColorPicker.Spectrum key="spectrum" />,
];
const rgb: ModeEntry = ['rgb', 'RGB', sliders('rgb')];
const hsl: ModeEntry = ['hsl', 'HSL', sliders('hsl')];
const cmyk: ModeEntry = ['cmyk', 'CMYK', sliders('cmyk')];
const named: ModeEntry = [
  'named',
  'Named',
  <ColorPicker.Named key="named">
    <ColorPicker.CssNamedColors />
  </ColorPicker.Named>,
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
): ReactNode => (
  <ColorPicker.Modes key="modes">
    {entriesOf(modes).map(([value, label]) => (
      <ColorPicker.Mode
        key={value}
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
  swatches = true,
  swatchesProps,
}: {
  isModesElsewhere?: boolean;
  modes?: ModeEntry[] | ModeSet;
  opacity?: boolean;
  swatches?: boolean;
  swatchesProps?: ColorPickerSwatchesProps;
} = {}): ReactNode[] => {
  const entries = entriesOf(modes);
  return [
    isModesElsewhere ? null : modesControl(entries),
    ...entries.map(([value, , view]) => (
      <ColorPicker.View
        key={value}
        value={value}
      >
        {view}
      </ColorPicker.View>
    )),
    opacity ? <ColorPicker.Opacity key="opacity" /> : null,
    swatches ? (
      <ColorPicker.Swatches
        key="swatches"
        {...swatchesProps}
      />
    ) : null,
  ];
};
