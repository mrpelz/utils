import { publicUrl } from '../tooling/public-url.js';

// The test page's variants and status bar styles, and their pages (see
// main.tsx): `/ios27-blur/<style>/<variant>`, and a round's own pages
// (`start`, `done`, see run.tsx).

export const statuses = ['black-translucent', 'default', 'black'] as const;

export type Status = (typeof statuses)[number];

/** The site's own (see scripts/demo-head.js), at `/ios27-blur` itself. */
export const siteStatus: Status = 'black-translucent';

export type Strip = {
  /** Painting nothing (`background-clip: text`), its color still set. */
  clip?: boolean;
  color?: string;
  fade?: boolean;
  height?: string;
  opacity?: number;
  /** Its opacity as far as content has scrolled under the bar. */
  progress?: boolean;
  top?: string;
  width?: string;
};

const red = '#ff3b30';

/** Each variant: its label, its strip (none: no strip). */
export const variants = {
  none: { label: 'None (iOS’ own blur)' },
  strip: { label: 'Strip, safe area tall (page background)', strip: {} },
  'opaque-8': { label: 'Strip, 8px', strip: { height: '8px' } },
  'opaque-11': { label: 'Strip, 11px', strip: { height: '11px' } },
  'clip-11': {
    label: 'Strip, 11px, painting nothing (background-clip: text)',
    strip: { clip: true, height: '11px' },
  },
  'clip-11-red': {
    label: 'Red, 11px, painting nothing (background-clip: text)',
    strip: { clip: true, color: red, height: '11px' },
  },
  fade: {
    label: 'Strip, fading into the edge effect',
    strip: { fade: true },
  },
  red: { label: 'Red, safe area tall', strip: { color: red } },
  'red-11': { label: 'Red, 11px', strip: { color: red, height: '11px' } },
  half: { label: 'Strip, opacity 0.5', strip: { opacity: 0.5 } },
  zero: { label: 'Strip, opacity 0', strip: { opacity: 0 } },
  progress: {
    label: 'Strip, fading in as content scrolls under',
    strip: { fade: true, progress: true },
  },
  'width-79': {
    label: 'Red, 11px, 79% wide',
    strip: { color: red, height: '11px', width: '79%' },
  },
  'width-80': {
    label: 'Red, 11px, 80% wide',
    strip: { color: red, height: '11px', width: '80%' },
  },
  'height-5': { label: 'Red, 5px', strip: { color: red, height: '5px' } },
  'height-6': { label: 'Red, 6px', strip: { color: red, height: '6px' } },
  'top-4': {
    label: 'Red, 11px, 4px from the top',
    strip: { color: red, height: '11px', top: '4px' },
  },
  'top-5': {
    label: 'Red, 11px, 5px from the top',
    strip: { color: red, height: '11px', top: '5px' },
  },
} satisfies Record<string, { label: string; strip?: Strip }>;

export type Variant = keyof typeof variants;

export const variantKeys = Object.keys(variants) as Variant[];

export const isStatus = (value: string | undefined): value is Status =>
  statuses.includes(value as Status);

export const isVariant = (value: string | undefined): value is Variant =>
  variantKeys.includes(value as Variant);

/** A round's own pages (see run.tsx): its setup, its end. */
export type Step = 'done' | 'start';

/** A variant's page, or a round's (on the site, see `publicUrl`). */
export const pathOf = (status: Status, page: Step | Variant): string =>
  `ios27-blur/${status}/${page}`;

/** Every page, for each status bar style (see demo-ssg.tsx). */
export const ios27BlurPaths: readonly string[] = statuses.flatMap((status) =>
  (['start', 'done', ...variantKeys] as const).map((page) =>
    pathOf(status, page),
  ),
);

/** Loads another page (its strip in its HTML, its head read anew). */
export const go = (status: Status, page: Step | Variant): void => {
  location.assign(publicUrl(pathOf(status, page)));
};

/** Its title (the Home Screen app's name, see scripts/demo-head.js). */
export const titleOf = (status: Status | undefined): string =>
  status === undefined ? 'iOS 27 Blur' : `Blur ${status}`;
