import type { ReactNode } from 'react';

import {
  ColorPicker,
  type ColorPickerSlidersModel,
  type ColorPickerSwatchesProps,
} from '../../../components/index.js';

// The demos' panels, as composed (see `panelParts`): their modes (in
// order), whether they have the opacity and the swatches.

type ModeEntry = [value: string, label: string, view: ReactNode];

const sliders = (model?: ColorPickerSlidersModel) => (
  <ColorPicker.Sliders model={model} />
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

/** Each mode rendered or not (as a prop control's, see the overview). */
export type ModesShown = {
  cmyk?: boolean;
  grid?: boolean;
  hsl?: boolean;
  rgb?: boolean;
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
  rgb: isRgb = true,
  spectrum: isSpectrum = true,
}: ModesShown): ModeEntry[] => {
  const rgbEntry = isHsl || isCmyk ? rgb : modeSets.system[2];
  return [
    isGrid ? grid : undefined,
    isSpectrum ? spectrum : undefined,
    isRgb ? rgbEntry : undefined,
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

/**
 * A panel's parts: its modes' control and views (by `modes`), its opacity
 * and swatches (unless left out).
 */
export const panelParts = ({
  modes = 'system',
  opacity = true,
  swatches = true,
  swatchesProps,
}: {
  modes?: ModeEntry[] | ModeSet;
  opacity?: boolean;
  swatches?: boolean;
  swatchesProps?: ColorPickerSwatchesProps;
} = {}): ReactNode[] => {
  const entries = typeof modes === 'string' ? modeSets[modes] : modes;
  return [
    <ColorPicker.Modes key="modes">
      {entries.map(([value, label]) => (
        <ColorPicker.Mode
          key={value}
          value={value}
        >
          {label}
        </ColorPicker.Mode>
      ))}
    </ColorPicker.Modes>,
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
