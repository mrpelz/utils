import {
  ColorSpace,
  HSL,
  HWB,
  Lab,
  LCH,
  OKLab,
  OKLCH,
  P3,
  parse,
  type PlainColorObject,
  sRGB,
  to,
  toGamut,
} from 'colorjs.io/fn';

import type { Rgba } from './props.js';

// The picker's colors in CSS's color syntaxes (Color.js, its functional API:
// only these spaces bundled): parsed (a color input's value, see
// `SystemColors`), and as codes to copy (see `CodeCopy`).

// (Registered: their syntaxes parsed by `parse`.)
for (const space of [sRGB, HSL, HWB, Lab, LCH, OKLab, OKLCH, P3]) {
  ColorSpace.register(space);
}

/** A coordinate, given (`none`, missing: 0). */
const given = (coord: number | null) =>
  coord === null || Number.isNaN(coord) ? 0 : coord;

/** A number, to at most three decimals (a code's coordinate, an alpha). */
const decimals = (value: number) => String(Math.round(value * 1000) / 1000);

/** A color as Color.js's: sRGB, its channels 0–1. */
const fromRgba = ({ a, b, g, r }: Rgba): PlainColorObject => ({
  alpha: a,
  coords: [r / 255, g / 255, b / 255],
  space: sRGB,
});

/**
 * A CSS color (any syntax of the spaces above: hex, `rgb()`, `oklch()`,
 * `color(display-p3 …)`, …) as the picker's: in sRGB (out of it, mapped into
 * it); not one, none.
 */
export const parseCssColor = (text: string): Rgba | undefined => {
  let color: PlainColorObject;
  try {
    color = toGamut(to(parse(text), sRGB), { space: sRGB });
  } catch {
    return undefined;
  }
  const [r = 0, g = 0, b = 0] = color.coords.map((coord) =>
    Math.min(Math.max(given(coord) * 255, 0), 255),
  );
  return { a: typeof color.alpha === 'number' ? color.alpha : 1, b, g, r };
};

/** A code to copy (see `codeGroups`): its format, its values, its CSS. */
export type ColorCode = {
  code: string;
  label: string;
  subtitle: string;
  /** Its color shown (hex's: opaque, or with its alpha). */
  well?: string;
};

/** A group of codes: its title, its codes. */
export type CodeGroup = readonly [title: string, codes: readonly ColorCode[]];

/**
 * A format: its CSS function (and, for `color()`, its space's name), its
 * space, its coordinates' names and units (`%`: in CSS, a percentage), its
 * coordinates scaled and whole (sRGB's: 0–255, as its hex code's).
 */
type Format = {
  coords: readonly (readonly [name: string, unit?: string])[];
  css: string;
  isWhole?: boolean;
  label: string;
  scale?: number;
  space: ColorSpace;
};

const formats = {
  hsl: {
    coords: [['h'], ['s', '%'], ['l', '%']],
    css: 'hsl(',
    label: 'hsl()',
    space: HSL,
  },
  hwb: {
    coords: [['h'], ['w', '%'], ['b', '%']],
    css: 'hwb(',
    label: 'hwb()',
    space: HWB,
  },
  lab: {
    coords: [['l'], ['a'], ['b']],
    css: 'lab(',
    label: 'lab()',
    space: Lab,
  },
  lch: {
    coords: [['l'], ['c'], ['h']],
    css: 'lch(',
    label: 'lch()',
    space: LCH,
  },
  oklab: {
    coords: [['l'], ['a'], ['b']],
    css: 'oklab(',
    label: 'oklab()',
    space: OKLab,
  },
  oklch: {
    coords: [['l'], ['c'], ['h']],
    css: 'oklch(',
    label: 'oklch()',
    space: OKLCH,
  },
  p3: {
    coords: [['r'], ['g'], ['b']],
    css: 'color(display-p3 ',
    label: 'color(display-p3)',
    space: P3,
  },
  rgb: {
    coords: [['r'], ['g'], ['b']],
    css: 'rgb(',
    isWhole: true,
    label: 'rgb()',
    scale: 255,
    space: sRGB,
  },
} satisfies Record<string, Format>;

/**
 * A color in a format: its CSS (its coordinates to three decimals, as its
 * subtitle's; a gray's hue 0, not `none`), its subtitle (each coordinate
 * named, e.g. “r: 255 / g: 127 / b: 0”; translucent, its alpha last).
 */
const code = (color: PlainColorObject, format: Format): ColorCode => {
  const values = to(color, format.space).coords.map((coord) => {
    const value = given(coord) * (format.scale ?? 1);
    return format.isWhole ? String(Math.round(value)) : decimals(value);
  });
  const alpha = typeof color.alpha === 'number' ? color.alpha : 1;
  const coords = format.coords.map(
    ([, unit = ''], index) => `${values[index] ?? '0'}${unit}`,
  );
  const named = format.coords.map(
    ([name], index) => `${name}: ${coords[index] ?? '0'}`,
  );
  return {
    code: `${format.css}${coords.join(' ')}${alpha < 1 ? ` / ${decimals(alpha)}` : ''})`,
    label: format.label,
    subtitle: [...named, ...(alpha < 1 ? [`a: ${decimals(alpha)}`] : [])].join(
      ' / ',
    ),
  };
};

/**
 * A color's codes, by group: hex (without its alpha, with it), sRGB's CSS
 * functions, the perceptual ones, the wide gamut's.
 */
export const codeGroups = (color: Rgba, hex: string): readonly CodeGroup[] => {
  const plain = fromRgba(color);
  const alphaHex = Math.round(color.a * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  const withAlpha = `${hex}${alphaHex}`;

  return [
    [
      'Hex',
      [
        { code: hex, label: 'Hex', subtitle: hex, well: hex },
        {
          code: withAlpha,
          label: 'Hex with alpha',
          subtitle: withAlpha,
          well: withAlpha,
        },
      ],
    ],
    [
      'sRGB',
      [
        code(plain, formats.rgb),
        code(plain, formats.hsl),
        code(plain, formats.hwb),
      ],
    ],
    [
      'Perceptual',
      [
        code(plain, formats.oklch),
        code(plain, formats.oklab),
        code(plain, formats.lab),
        code(plain, formats.lch),
      ],
    ],
    ['Wide gamut', [code(plain, formats.p3)]],
  ];
};
