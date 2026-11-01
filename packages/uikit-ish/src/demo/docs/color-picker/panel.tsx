import type { ReactNode } from 'react';

import {
  ColorPicker,
  type ColorPickerSlidersModel,
  type ColorPickerSlidersRange,
  type ColorPickerSwatchesProps,
} from '../../../components/index.js';

// The demos' panels, as composed (see `panelParts`): their modes (in
// order), whether they have the opacity and the swatches.

type ModeEntry = [value: string, label: string, view: ReactNode];

const sliders = (
  model?: ColorPickerSlidersModel,
  range?: ColorPickerSlidersRange,
) => (
  <ColorPicker.Sliders
    model={model}
    range={range}
  />
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

/** Mode sets: the system's (one sliders view, “Sliders”), and others (their values the same: `grid`, `spectrum`, `rgb`, `hsl`, `cmyk`). */
export const modeSets = {
  all: [grid, spectrum, rgb, hsl, cmyk],
  sliders: [rgb, hsl, cmyk],
  system: [grid, spectrum, ['rgb', 'Sliders', sliders()]],
} satisfies Record<string, ModeEntry[]>;

export type ModeSet = keyof typeof modeSets;

/**
 * Each mode rendered or not (as a prop control's, see the overview); RGB,
 * in its range.
 */
export type ModesShown = {
  cmyk?: boolean;
  grid?: boolean;
  hsl?: boolean;
  rgb?: ColorPickerSlidersRange | false;
  spectrum?: boolean;
};

/**
 * The modes rendered, in their order; RGB labeled “Sliders” while it's the
 * only sliders mode (as the system's).
 */
export const shownModes = ({
  cmyk: isCmyk = false,
  grid: isGrid = true,
  hsl: isHsl = false,
  rgb: rgbRange = 'byte',
  spectrum: isSpectrum = true,
}: ModesShown): ModeEntry[] => {
  const rgbEntry: ModeEntry = [
    'rgb',
    isHsl || isCmyk ? 'RGB' : 'Sliders',
    sliders(isHsl || isCmyk ? 'rgb' : undefined, rgbRange || undefined),
  ];
  return [
    isGrid ? grid : undefined,
    isSpectrum ? spectrum : undefined,
    rgbRange ? rgbEntry : undefined,
    isHsl ? hsl : undefined,
    isCmyk ? cmyk : undefined,
  ].filter((entry) => entry !== undefined);
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
