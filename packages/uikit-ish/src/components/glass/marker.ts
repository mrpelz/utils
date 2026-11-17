import { useLayoutEffect, useState } from 'react';

import {
  type BackdropTone,
  gridSize,
  luminanceOf,
  markerAttribute,
  onResample,
  toneOf,
} from './backdrop.js';

// Backdrops marked by the app (see backdrop.ts): what the sampler can't
// read from the page's styles (an image, a video, a canvas, a map), told by
// the app, as a tone or a luminance, or an image's, sampled once from its
// pixels. The marker is an attribute on the element (`markerAttribute`),
// written by the hooks: the app never writes it itself.

/**
 * A marker's value: a tone, a luminance (0 to 1), or a grid of luminances
 * across the element's box (`gridSize` by `gridSize`, row by row; `null`, a
 * cell unknown, e.g. transparent), see `backdropGridOf`.
 */
export type BackdropMarkerValue =
  BackdropTone | number | readonly (number | null)[];

// (A tone's luminance: well past its threshold, see backdrop.ts.)
const toneLuminances: Record<BackdropTone, number> = { bright: 0.8, dim: 0.05 };

/** A marker's value as its attribute (see backdrop.ts). */
const encode = (value: BackdropMarkerValue): string => {
  if (typeof value === 'string') return String(toneLuminances[value]);
  if (typeof value === 'number') return String(value);
  return `g${value
    .map((luminance) =>
      luminance === null
        ? '__'
        : Math.round(Math.min(Math.max(luminance, 0), 1) * 254)
            .toString(16)
            .padStart(2, '0'),
    )
    .join('')}`;
};

/**
 * Marks an element (`ref`'s) as a backdrop of the given tone or luminance
 * (or a grid of them, see `backdropGridOf`), for glass over it to follow
 * (`adaptive`, see `useBackdropTone`): e.g. a video, a canvas, a map, what
 * the sampler can't read; what's in it too. `undefined`, unmarked: what's
 * painted is read again.
 */
export const useBackdropMarker = (
  ref: { current: Element | null },
  value: BackdropMarkerValue | undefined,
): void => {
  const encoded = value === undefined ? undefined : encode(value);
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element || encoded === undefined) return undefined;
    element.setAttribute(markerAttribute, encoded);
    return () => element.removeAttribute(markerAttribute);
  }, [encoded, ref]);
};

/** A position's offset (`50%`, `12px`) in `room` px to spare. */
const offset = (token: string, room: number) =>
  token.endsWith('%')
    ? (Number.parseFloat(token) / 100) * room
    : Number.parseFloat(token) || 0;

/** A box: where something's drawn within another (px). */
type Box = { height: number; width: number; x: number; y: number };

/**
 * Where an image (`width` by `height`) is drawn in a box `into` (its
 * element's), by a fit (`object-fit`, or `background-size`'s `cover`,
 * `contain`) and a position (`object-position`, `background-position`:
 * percentages and px).
 */
const fitted = (
  { height, width }: { height: number; width: number },
  into: { height: number; width: number },
  fit: string,
  position: string,
): Box => {
  const cover = Math.max(into.width / width, into.height / height);
  const contain = Math.min(into.width / width, into.height / height);
  const scales: Record<string, number> = {
    contain,
    cover,
    none: 1,
    'scale-down': Math.min(1, contain),
  };
  const scale = scales[fit];
  const drawnWidth = scale === undefined ? into.width : width * scale;
  const drawnHeight = scale === undefined ? into.height : height * scale;
  const [xToken = '50%', yToken = '50%'] = position.split(/\s+/u);
  return {
    height: drawnHeight,
    width: drawnWidth,
    x: offset(xToken, into.width - drawnWidth),
    y: offset(yToken, into.height - drawnHeight),
  };
};

/**
 * A grid of luminances (see `BackdropMarkerValue`) of an image as drawn
 * across a box: `source` (anything a canvas draws: an image, a canvas, an
 * `ImageBitmap`, e.g. an app's own preview of an image it can't read), at
 * `box` within one `width` by `height` (all of it, without one). For
 * `useBackdropMarker`; costly (it reads pixels): once per image and size.
 */
export const backdropGridOf = (
  source: CanvasImageSource,
  {
    box,
    height = 1,
    width = 1,
  }: { box?: Box; height?: number; width?: number } = {},
): (number | null)[] => {
  const canvas = document.createElement('canvas');
  canvas.width = gridSize;
  canvas.height = gridSize;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return [];
  context.imageSmoothingQuality = 'high';
  const {
    x,
    y,
    width: boxWidth,
    height: boxHeight,
  } = box ?? {
    height,
    width,
    x: 0,
    y: 0,
  };
  context.drawImage(
    source,
    (x / width) * gridSize,
    (y / height) * gridSize,
    (boxWidth / width) * gridSize,
    (boxHeight / height) * gridSize,
  );
  const { data } = context.getImageData(0, 0, gridSize, gridSize);
  const cells: (number | null)[] = [];
  for (let index = 0; index < data.length; index += 4) {
    const alpha = (data[index + 3] ?? 0) / 255;
    cells.push(
      alpha < 0.3
        ? null
        : luminanceOf([
            data[index] ?? 0,
            data[index + 1] ?? 0,
            data[index + 2] ?? 0,
            alpha,
          ]),
    );
  }
  return cells;
};

/** How large a loaded image is kept (its longer side, px), see `load`. */
const keptSize = 64;

/** Loaded images, small (see `load`), by their URL. */
const loaded = new Map<string, Promise<HTMLCanvasElement | undefined>>();

/**
 * An image loaded for its pixels: a copy of its own, requested with CORS
 * (the page's own, as is; another site's, only if it allows it), kept
 * small; once per URL. Undefined, unreadable.
 */
const load = (url: string) => {
  let pending = loaded.get(url);
  if (!pending) {
    pending = (async () => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = url;
      try {
        await image.decode();
      } catch {
        return undefined;
      }
      const scale =
        keptSize / Math.max(image.naturalWidth, image.naturalHeight);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) return undefined;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      try {
        // (Read once: a tainted copy (no CORS) throws, unreadable.)
        context.getImageData(0, 0, 1, 1);
      } catch {
        return undefined;
      }
      return canvas;
    })();
    loaded.set(url, pending);
  }
  return pending;
};

const urlPattern = /url\(["']?(?<url>[^"')]+)["']?\)/u;

/** An element's image: an `img`'s source as shown, or its background's. */
const imageOf = (element: Element) => {
  if (element instanceof HTMLImageElement) {
    return {
      fit: getComputedStyle(element).objectFit,
      position: getComputedStyle(element).objectPosition,
      url: element.currentSrc || element.src,
    };
  }
  const style = getComputedStyle(element);
  const url = urlPattern.exec(style.backgroundImage)?.groups?.url;
  const size = style.backgroundSize;
  return {
    // (Other sizes: across its box, roughly.)
    fit: size === 'cover' || size === 'contain' ? size : 'fill',
    position: style.backgroundPosition,
    url,
  };
};

/** A grid's cells (see `BackdropMarkerValue`). */
type Cells = readonly (number | null)[];

/** An area of an image's element: its box, in fractions (x, y, w, h). */
export type BackdropArea = readonly [
  x: number,
  y: number,
  width: number,
  height: number,
];

/** `useImageBackdropMarker`'s options. */
export type ImageBackdropMarkerOptions<Area extends string> = {
  /**
   * Areas of it, each one's tone returned (e.g. where the app's text goes
   * over it).
   */
  areas?: Readonly<Record<Area, BackdropArea>>;
  /** Its marker while it can't be read (loading, or not allowed). */
  fallback?: BackdropTone | number;
};

/** The first grid cell from a fraction across it. */
const from = (fraction: number) =>
  Math.min(Math.floor(fraction * gridSize), gridSize - 1);

/** The grid cell up to a fraction across it (past it). */
const to = (fraction: number) => Math.max(Math.ceil(fraction * gridSize), 1);

/** The average of a grid's cells in an area (see `BackdropArea`). */
const areaLuminance = (
  cells: readonly (number | null)[],
  [x, y, width, height]: BackdropArea,
) => {
  const values: number[] = [];
  for (let row = from(y); row < to(y + height); row += 1) {
    for (let column = from(x); column < to(x + width); column += 1) {
      const value = cells[row * gridSize + column];
      if (value !== null && value !== undefined) values.push(value);
    }
  }
  return values.length === 0
    ? undefined
    : values.reduce((sum, value) => sum + value, 0) / values.length;
};

/**
 * Marks an image's element (`ref`'s: an `img`, or an element with a
 * background image) as a backdrop by its pixels (see `useBackdropMarker`):
 * a copy of the image loaded with CORS (the page's own, or another site's
 * allowing it), sampled once, small; as drawn in the element (its
 * `object-fit`, `background-size`), again as it resizes or its source
 * changes. Unreadable, `fallback`. Returns its `areas`' tones.
 */
export const useImageBackdropMarker = <Area extends string = never>(
  ref: { current: Element | null },
  { areas, fallback }: ImageBackdropMarkerOptions<Area> = {},
): Partial<Record<Area, BackdropTone>> => {
  const [cells, setCells] = useState<Cells | undefined>(undefined);

  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    let isCurrent = true;
    let source: HTMLCanvasElement | undefined;
    let url: string | undefined;

    // (Drawn as it's shown in its box, from its small copy.)
    const draw = () => {
      if (!source) return;
      const { height, width } = element.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const { fit, position } = imageOf(element);
      setCells(
        backdropGridOf(source, {
          box: fitted(source, { height, width }, fit, position),
          height,
          width,
        }),
      );
    };
    const read = () => {
      const { url: next } = imageOf(element);
      if (next === url) return;
      url = next;
      source = undefined;
      setCells(undefined);
      if (!next) return;
      load(next)
        .then((canvas) => {
          if (!isCurrent || url !== next) return;
          source = canvas;
          draw();
        })
        .catch(() => undefined);
    };

    read();
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(element);
    // (Its source changed: an `img`'s `src`, `srcset` chosen anew as it
    // loads, a background's.)
    const mutationObserver = new MutationObserver(read);
    mutationObserver.observe(element, {
      attributeFilter: ['src', 'srcset', 'style', 'class'],
    });
    element.addEventListener('load', read);
    // (Asked to (`resampleBackdrops`): its source read again, and drawn.)
    const unsubscribe = onResample(() => {
      read();
      draw();
    });
    return () => {
      isCurrent = false;
      unsubscribe();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      element.removeEventListener('load', read);
    };
  }, [ref]);

  useBackdropMarker(ref, cells ?? fallback);

  const tones: Partial<Record<Area, BackdropTone>> = {};
  if (cells && areas) {
    for (const [name, area] of Object.entries(areas) as [
      Area,
      BackdropArea,
    ][]) {
      const luminance = areaLuminance(cells, area);
      if (luminance !== undefined) tones[name] = toneOf(luminance);
    }
  }
  return tones;
};
