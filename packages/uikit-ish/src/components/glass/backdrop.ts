import { useLayoutEffect, useState } from 'react';

import { parseCssColor } from '../color-picker/color.js';
import { backgroundColorAt, type Rgba } from './gradient.js';

// What's behind an element: bright or dim (its tone), sampled from what the
// page paints behind it, for glass (see `useGlassContext`) and the app's own
// (`useBackdropTone`). One sampler for all of them: a frame's reads first
// (what's behind each element), then its writes (the tones that changed),
// as the page scrolls (any scroller) or resizes, or an element does, as
// what's over it changes (attributes, elements added or removed; the color
// scheme, all), and every frame while what's over it transitions or
// animates; elements off-screen skipped. Each reads 9 points on it, all at
// once as something changes, one a frame as it (or what's behind it) moves:
// each a hit test of the page, costly on a large one. An element sampled
// `within` an ancestor (e.g. a card's title, on its card) reads only what's
// painted in it, and is sampled again only as something in it (or what it's
// in) changes, not as the page scrolls. It reads the backgrounds' colors (their
// gradients' too), not pixels: an image, a video or a canvas behind is
// unknown, and leaves the tone as it was.

/** A backdrop's tone: bright (light glass on it) or dim (dark glass). */
export type BackdropTone = 'bright' | 'dim';

/** `useBackdropTone`'s options. */
export type BackdropToneOptions = {
  /**
   * How long (ms) a new tone must hold before it's taken (e.g. a large
   * surface, not flipping as a stripe scrolls past). Its first is taken at
   * once.
   * @default 0
   */
  dwell?: number;
  /**
   * Sampling at all (off: none, `undefined`).
   * @default true
   */
  enabled?: boolean;
  /**
   * An ancestor it's sampled within (e.g. its card): only what's painted in
   * it read (its own background last), sampled again only as something in
   * it, or what it's in, changes (not as the page scrolls). E.g. a card's
   * text over a slider's fill, on the card.
   */
  within?: { current: Element | null };
};

// Its luminance below this, the tone turns dim; above the other, bright;
// between, it stays, so it doesn't flicker between them. Around 0.18, black
// and white text read equally well (their contrast ratios meet), so the
// thresholds sit on either side of it: e.g. a vivid orange (about 0.45)
// bright, dark text reading on it at 10:1.
const toDim = 0.14;
const toBright = 0.24;

/** The tone for what's behind (its luminance), from the last one. */
const nextTone = (
  luminance: number,
  last: BackdropTone | undefined,
): BackdropTone => {
  if (luminance < toDim) return 'dim';
  if (luminance > toBright) return 'bright';
  return last ?? (luminance < (toDim + toBright) / 2 ? 'dim' : 'bright');
};

/**
 * A color's tone (e.g. a slider's fill, opaque: see Card), from the last
 * one (see `nextTone`); none, unreadable or nearly transparent.
 */
export const toneOfColor = (
  color: string,
  last?: BackdropTone,
): BackdropTone | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- hoisted helpers below
  const rgba = parseColor(color);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- hoisted helpers below
  return rgba && rgba[3] >= 0.3 ? nextTone(luminanceOf(rgba), last) : undefined;
};

/** A luminance's tone, without one before it (e.g. an image's area). */
export const toneOf = (luminance: number): BackdropTone =>
  nextTone(luminance, undefined);

const parsedColors = new Map<string, Rgba | undefined>();

// An sRGB channel (0 to 255), linear.
const linear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/**
 * A CSS color's channels (sRGB, 0 to 255) and alpha (0 to 1): any computed
 * color's (e.g. a `color-mix()`'s, as `color(srgb …)`, its channels 0 to 1;
 * see the color picker's `parseCssColor`), cached.
 */
const parseColor = (color: string): Rgba | undefined => {
  if (parsedColors.has(color)) return parsedColors.get(color);
  const parsed = parseCssColor(color);
  const rgba: Rgba | undefined = parsed && [
    parsed.r,
    parsed.g,
    parsed.b,
    parsed.a,
  ];
  // (Few colors on a page; bounded all the same.)
  if (parsedColors.size > 256) parsedColors.clear();
  parsedColors.set(color, rgba);
  return rgba;
};

/** A color's relative luminance (0 to 1). */
export const luminanceOf = ([red, green, blue]: Rgba): number =>
  0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);

/**
 * The luminance an element's background shows at a point (see
 * gradient.ts; undefined: unknown, e.g. an image; null: none, nearly
 * transparent there).
 */
const backgroundLuminanceAt = (
  element: Element,
  x: number,
  y: number,
): number | null | undefined => {
  const { backgroundColor, backgroundImage } = getComputedStyle(element);
  // (Most have none: no box to read.)
  if (backgroundImage === 'none') {
    const color = parseColor(backgroundColor);
    return color && color[3] >= 0.3 ? luminanceOf(color) : null;
  }
  const { height, left, top, width } = element.getBoundingClientRect();
  const color = backgroundColorAt(
    backgroundImage,
    backgroundColor,
    { height, width, x: x - left, y: y - top },
    parseColor,
  );
  return color ? luminanceOf(color) : color;
};

/**
 * The luminance at a point behind an element: the first element below it
 * there (in paint order, the page's layers, not only its ancestors) with a
 * background (undefined: unknown, or none).
 */
/**
 * A backdrop marked by the app (see marker.ts): its element's attribute,
 * a luminance (0 to 1), or a grid of them across its box (`g`, then
 * `gridSize` by `gridSize` cells, row by row, two hex digits each, 00 to fe;
 * `__` unknown, e.g. a transparent part of an image).
 */
export const markerAttribute = 'data-uikit-backdrop';

/** A marker's grid's cells across and down (see `markerAttribute`). */
export const gridSize = 8;

/**
 * A marker's luminance at a point (null: none there, e.g. a transparent
 * cell, what's behind it showing; undefined: unreadable).
 */
const markerLuminanceAt = (
  marked: Element,
  x: number,
  y: number,
): number | null | undefined => {
  const value = marked.getAttribute(markerAttribute) ?? '';
  if (!value.startsWith('g')) {
    const luminance = Number.parseFloat(value);
    return Number.isFinite(luminance) ? luminance : undefined;
  }
  const { height, left, top, width } = marked.getBoundingClientRect();
  if (width <= 0 || height <= 0) return undefined;
  const cell = (offset: number, size: number) =>
    Math.min(Math.max(Math.floor((offset / size) * gridSize), 0), gridSize - 1);
  const index = cell(y - top, height) * gridSize + cell(x - left, width);
  const digits = value.slice(1 + index * 2, 3 + index * 2);
  if (digits === '__') return null;
  const luminance = Number.parseInt(digits, 16) / 254;
  return Number.isFinite(luminance) ? luminance : undefined;
};

const luminanceAt = (
  element: Element,
  within: Element | undefined,
  x: number,
  y: number,
) => {
  const stack = document.elementsFromPoint(x, y);
  // (Below it: not what's over it, nor it or what's in it; its ancestors
  // count, e.g. the page it's on, painting the background behind it; within
  // an ancestor, nothing past it.)
  const at = stack.findIndex((candidate) => element.contains(candidate));
  for (const candidate of stack.slice(Math.max(at, 0))) {
    if (element.contains(candidate)) continue;
    if (within && !within.contains(candidate)) return undefined;
    // (Marked by the app, it or what it's in (e.g. a map's tiles, in its
    // marked container): its luminance; else its background's.)
    const marked = candidate.closest(`[${CSS.escape(markerAttribute)}]`);
    const value =
      marked && !element.contains(marked)
        ? markerLuminanceAt(marked, x, y)
        : backgroundLuminanceAt(candidate, x, y);
    if (value !== null) return value;
  }
  return undefined;
};

/** The points read on an element (see `pointOf`): 3 by 3. */
const pointCount = 9;

/**
 * One of the points read on an element, of a 3 by 3 grid on it (inset
 * from its edges), row by row; none while it has no box.
 */
const pointOf = (box: DOMRect, index: number) => {
  const { bottom, left, right, top } = box;
  if (right <= left || bottom <= top) return undefined;
  const inset = 4;
  const xs = [left + inset, (left + right) / 2, right - inset] as const;
  const ys = [top + inset, (top + bottom) / 2, bottom - inset] as const;
  return [xs[index % 3] ?? left, ys[Math.floor(index / 3)] ?? top] as const;
};

/** The luminance behind an element at one of its points (see `pointOf`). */
const luminanceAtPoint = (
  element: Element,
  within: Element | undefined,
  box: DOMRect,
  index: number,
) => {
  const point = pointOf(box, index);
  return point ? luminanceAt(element, within, ...point) : undefined;
};

/** The luminance at every point behind an element (see `pointOf`). */
const readingsBehind = (element: Element, within?: Element) => {
  const box = element.getBoundingClientRect();
  return Array.from({ length: pointCount }, (_, index) =>
    luminanceAtPoint(element, within, box, index),
  );
};

/**
 * The luminance of what's behind an element: its points' average (see
 * `readingsBehind`), those unknown left out.
 */
const averageOf = (readings: readonly (number | undefined)[]) => {
  const values = readings.filter((value) => value !== undefined);
  return values.length === 0
    ? undefined
    : values.reduce((sum, value) => sum + value, 0) / values.length;
};

/**
 * Until when something's transitioning or animating (see `sample`): a
 * while past the latest start (its end may never come, e.g. its element
 * removed; its end samples again anyway).
 */
let movingUntil = 0;
const movingFor = 1000;

/** What's transitioning or animating, until when (see `movingUntil`). */
const moving = new Map<Node, number>();

type Entry = {
  /** Its point read next, read one a frame (see `readingOf`). */
  cursor: number;
  dwell: number;
  element: Element;
  isVisible: boolean;
  last: BackdropTone | undefined;
  onChange: (tone: BackdropTone) => void;
  pending: { since: number; tone: BackdropTone } | undefined;
  /** Its points' latest luminances (see `pointOf`); none yet, undefined. */
  readings: (number | undefined)[] | undefined;
  /** Its points still to read one a frame, all read since it last moved. */
  unread: number;
  // (Its ancestor's ref, read as it's sampled: set after it registers,
  // an ancestor's ref attached after its descendants' effects ran.)
  within: { current: Element | null } | undefined;
};

const entries = new Map<Element, Entry>();
let frame = 0;
let timer = 0;

// What's to be sampled next frame: everything (e.g. the color scheme
// changed), what's on the page (it scrolled: not those within an ancestor),
// or those over what changed (`touched`, e.g. a card's slider's fill; those
// within an ancestor, within it), or what scrolled in their ancestor
// (`scrolled`, e.g. a list in a card).
let isEverything = false;
let isPage = false;
/** Changes in a frame past which everything's sampled (not each looked at). */
const touchedLimit = 64;
/** Some element's points still to be read, one a frame (see `readingOf`). */
let isReading = false;
const touched = new Set<Node>();
const scrolled = new Set<Node>();

/** Its sampling (see `sample`), at the next frame. */
const request = () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- each schedules the other
  frame ||= requestAnimationFrame(sample);
};

/** Every element sampled next frame (see `sample`). */
const schedule = () => {
  isEverything = true;
  request();
};

/**
 * Those not within an ancestor sampled next frame, as something scrolled;
 * those within one, if it's in it.
 */
const scheduleScrolled = ({ target }: Event) => {
  isPage = true;
  if (target instanceof Node) scrolled.add(target);
  request();
};

/**
 * Those over what changed sampled next frame: those not within an
 * ancestor, over it, and those within one it's in, or that's in it.
 */
const scheduleTouched = (node: Node) => {
  touched.add(node);
  request();
};

/**
 * A node's box: its element's, or its nearest ancestor's with one (e.g. as
 * it's hidden, what it was in); none, unknown (e.g. removed).
 */
const boxOfNode = (node: Node) => {
  for (
    let element = node instanceof Element ? node : node.parentElement;
    element;
    element = element.parentElement
  ) {
    const box = element.getBoundingClientRect();
    if (box.width > 0 || box.height > 0) return box;
  }
  return undefined;
};

/** Whether a node is over a box, or might be (its own unknown). */
const isOver = (node: Node, box: DOMRect) => {
  const other = boxOfNode(node);
  return (
    !other ||
    (other.left < box.right &&
      box.left < other.right &&
      other.top < box.bottom &&
      box.top < other.bottom)
  );
};

/**
 * How an element's to be sampled, if it is (see above): all its points
 * (e.g. something over it, or in what it's within, changed: once), or one
 * more (it, or what's behind it, moving: one a frame, see `readingOf`; a
 * change meanwhile too, its points all read again that way). Those not
 * within an ancestor as the page scrolls, or as what's over them changes or
 * moves; those within one as something in it (or what it's in) changes,
 * moves or scrolls.
 */
const dueOf = (
  entry: Entry,
  within: Element | undefined,
  box: DOMRect,
  now: number,
): 'all' | 'one' | undefined => {
  if (isEverything || !entry.readings) return 'all';
  const isRelated = within
    ? (node: Node) => within.contains(node) || node.contains(within)
    : (node: Node) => isOver(node, box);
  const isMoving = () => {
    if (within) {
      for (const node of scrolled) if (within.contains(node)) return true;
    } else if (isPage) {
      return true;
    }
    for (const [node, until] of moving) {
      if (until > now && isRelated(node)) return true;
    }
    return false;
  };
  const isTouched = () => {
    if (touched.size > touchedLimit) return true;
    for (const node of touched) if (isRelated(node)) return true;
    return false;
  };
  if (isMoving()) return 'one';
  return isTouched() ? 'all' : undefined;
};

/**
 * The points read one a frame left in this frame (see `readingOf`): one,
 * however many elements are moving, each in turn (see `sample`).
 */
let pointsLeft = 0;

/** Who read a point this frame (see `pointsLeft`), last in line after it. */
let turnTaken: Entry | undefined;

/**
 * An entry's luminance, if it's due (see above): none off-screen, or within
 * an ancestor not there yet. Moving, one point a frame (each a hit test of
 * the page, costly on a large one), the others' latest kept; then the rest,
 * one a frame, so all are read once it's stopped.
 */
const readingOf = (entry: Entry, now: number) => {
  if (!entry.isVisible) return undefined;
  const within = entry.within?.current ?? undefined;
  if (entry.within && !within) return undefined;
  const { element } = entry;
  const box = element.getBoundingClientRect();
  const due = dueOf(entry, within, box, now);
  if (!due && entry.unread === 0) return undefined;
  // (Inert or hidden (e.g. a Navigation stack's pages as they move, or
  // under its top one): not sampled, its tone kept. What's behind it is
  // passed by too (ignoring the pointer, as a moving page does; hidden),
  // so it can't be read right; and it's not taking part, for now.)
  if (
    element.closest('[inert]') ||
    !element.checkVisibility({ visibilityProperty: true })
  ) {
    return undefined;
  }
  if (due === 'all' || !entry.readings) {
    entry.readings = Array.from({ length: pointCount }, (_, index) =>
      luminanceAtPoint(element, within, box, index),
    );
    entry.unread = 0;
  } else {
    if (due === 'one') entry.unread = pointCount;
    // (Another's turn this frame: its points left for the next.)
    if (pointsLeft === 0) {
      isReading = true;
      return undefined;
    }
    pointsLeft -= 1;
    turnTaken = entry;
    entry.readings[entry.cursor] = luminanceAtPoint(
      element,
      within,
      box,
      entry.cursor,
    );
    entry.cursor = (entry.cursor + 1) % pointCount;
    entry.unread -= 1;
    if (entry.unread > 0) isReading = true;
  }
  return averageOf(entry.readings);
};

/** Each entry's tone sampled (reads), then those changed told (writes). */
const sample = () => {
  frame = 0;
  const now = performance.now();
  isReading = false;
  pointsLeft = 1;
  turnTaken = undefined;
  const readings: [Entry, number][] = [];
  for (const entry of entries.values()) {
    const luminance = readingOf(entry, now);
    if (luminance !== undefined) readings.push([entry, luminance]);
  }
  // (Its turn taken: the others' first next frame. Set by `readingOf`.)
  const taken = turnTaken as Entry | undefined;
  if (taken) {
    entries.delete(taken.element);
    entries.set(taken.element, taken);
  }
  isEverything = false;
  isPage = false;
  touched.clear();
  scrolled.clear();
  for (const [node, until] of moving) if (until <= now) moving.delete(node);
  let wait = Infinity;
  for (const [entry, luminance] of readings) {
    const next = nextTone(luminance, entry.last);
    if (next === entry.last) {
      entry.pending = undefined;
      continue;
    }
    // (A first one at once; else held for its dwell.)
    if (entry.last !== undefined && entry.dwell > 0) {
      if (entry.pending?.tone !== next) {
        entry.pending = { since: now, tone: next };
      }
      const left = entry.pending.since + entry.dwell - now;
      if (left > 0) {
        wait = Math.min(wait, left);
        continue;
      }
    }
    entry.last = next;
    entry.pending = undefined;
    entry.onChange(next);
  }
  // (While something transitions or animates (e.g. a card's background
  // as it's switched on): every frame, its colors read as they go.)
  // (Points still to be read: next frame.)
  if (now < movingUntil || isReading) request();
  // (Held ones looked at again once their dwell's over.)
  if (wait !== Infinity) {
    clearTimeout(timer);
    timer = window.setTimeout(schedule, wait);
  }
};

/** What else is told to read again (see `resampleBackdrops`). */
const rereaders = new Set<() => void>();

/**
 * Told to read again by `resampleBackdrops` (e.g. an image marker, its
 * source), until unsubscribed (the returned function).
 */
export const onResample = (reread: () => void): (() => void) => {
  rereaders.add(reread);
  return () => rereaders.delete(reread);
};

/**
 * Every element's backdrop sampled again (see `useBackdropTone`), and
 * image markers' sources read again (see `useImageBackdropMarker`): after
 * a change the sampling can't see, e.g. a class switching a background's
 * color, a transform or an animation moving what's behind (it follows
 * scrolls, resizes and markers by itself).
 */
export const resampleBackdrops = (): void => {
  for (const reread of rereaders) reread();
  schedule();
};

let resizeObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;
let pageObserver: MutationObserver | undefined;

/**
 * Whether something moving is a sampled element's concern: in what it's
 * within (or around it), or over it, or in it or around it (e.g. a sheet
 * with its toolbar), as it starts.
 */
const concernsAny = (node: Node) => {
  for (const { element, within } of entries.values()) {
    const ancestor = within?.current;
    if (ancestor) {
      if (ancestor.contains(node) || node.contains(ancestor)) return true;
      continue;
    }
    const isNear = element.contains(node) || node.contains(element);
    if (isNear || isOver(node, element.getBoundingClientRect())) return true;
  }
  return false;
};

/**
 * Something started moving (see `movingStarts`): sampled every frame for a
 * while (see `movingFor`), if it's any element's concern (see
 * `concernsAny`); else nothing (e.g. a live value's arrow turning far
 * below: no frames). Its end samples what's over it all the same.
 */
const onMoving = ({ target }: Event) => {
  if (!(target instanceof Node) || !concernsAny(target)) return;
  movingUntil = performance.now() + movingFor;
  moving.set(target, movingUntil);
  request();
};

/** Something's moving ended (see `onMoving`): what's over it sampled. */
const onMoved = ({ target }: Event) => {
  if (target instanceof Node) scheduleTouched(target);
  else schedule();
};

const movingStarts = ['transitionrun', 'animationstart'] as const;
const movingEnds = [
  'transitionend',
  'transitioncancel',
  'animationend',
  'animationcancel',
] as const;

/** The system's color scheme and contrast (what `light-dark()` follows). */
const schemeQueries = [
  '(prefers-color-scheme: dark)',
  '(prefers-contrast: more)',
] as const;

const listen = () => {
  addEventListener('scroll', scheduleScrolled, {
    capture: true,
    passive: true,
  });
  addEventListener('resize', schedule);
  resizeObserver = new ResizeObserver((records) => {
    for (const { target } of records) scheduleTouched(target);
  });
  intersectionObserver = new IntersectionObserver((records) => {
    for (const { isIntersecting, target } of records) {
      const entry = entries.get(target);
      if (entry) entry.isVisible = isIntersecting;
      // (Scrolled in: sampled, e.g. after its card changed off-screen.)
      scheduleTouched(target);
    }
  });
  // (The page changed: a class or a style switching a background (e.g. a
  // card switched on), an element added or removed, a marker (see
  // marker.ts): sampled again, nothing scrolled; once per frame however
  // much changed.)
  pageObserver = new MutationObserver((records) => {
    for (const { target } of records) scheduleTouched(target);
  });
  pageObserver.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  for (const type of movingStarts) {
    addEventListener(type, onMoving, { capture: true, passive: true });
  }
  for (const type of movingEnds) {
    addEventListener(type, onMoved, { capture: true, passive: true });
  }
  for (const query of schemeQueries) {
    matchMedia(query).addEventListener('change', schedule);
  }
};

const unlisten = () => {
  removeEventListener('scroll', scheduleScrolled, { capture: true });
  removeEventListener('resize', schedule);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  pageObserver?.disconnect();
  resizeObserver = undefined;
  intersectionObserver = undefined;
  pageObserver = undefined;
  for (const type of movingStarts) {
    removeEventListener(type, onMoving, { capture: true });
  }
  for (const type of movingEnds) {
    removeEventListener(type, onMoved, { capture: true });
  }
  for (const query of schemeQueries) {
    matchMedia(query).removeEventListener('change', schedule);
  }
  movingUntil = 0;
  moving.clear();
  touched.clear();
  scrolled.clear();
  cancelAnimationFrame(frame);
  clearTimeout(timer);
  frame = 0;
};

/**
 * An element's backdrop sampled (see above), `onChange` told its tone as
 * it changes; sampled once at once (its first, before it paints, when
 * called before then). Returns its unregistering.
 */
const register = (
  element: Element,
  within: { current: Element | null } | undefined,
  dwell: number,
  onChange: (tone: BackdropTone) => void,
) => {
  if (entries.size === 0) listen();
  const entry: Entry = {
    cursor: 0,
    dwell,
    element,
    isVisible: true,
    last: undefined,
    onChange,
    pending: undefined,
    readings: undefined,
    unread: 0,
    within,
  };
  entries.set(element, entry);
  resizeObserver?.observe(element);
  intersectionObserver?.observe(element);
  entry.readings =
    within && !within.current
      ? undefined
      : readingsBehind(element, within?.current ?? undefined);
  const luminance = entry.readings && averageOf(entry.readings);
  if (luminance !== undefined) {
    entry.last = nextTone(luminance, undefined);
    onChange(entry.last);
  }
  // (Again once placed: e.g. a popup, positioned after it's mounted, by a
  // transform no observer sees, transitioning in.)
  scheduleTouched(element);
  const settled = window.setTimeout(() => scheduleTouched(element), 300);
  return () => {
    clearTimeout(settled);
    entries.delete(element);
    resizeObserver?.unobserve(element);
    intersectionObserver?.unobserve(element);
    if (entries.size === 0) unlisten();
  };
};

/**
 * The tone of what's behind an element (`ref`'s): bright or dim, sampled as
 * the page or the element scrolls or resizes (see above); `undefined` until
 * known (e.g. an image behind it), or while not `enabled`. For glass of the
 * library's (its `context` `adaptive`), and the app's own (e.g. symbols over
 * whatever is behind them); `within` an ancestor, what's painted in it
 * (e.g. a card's text, on its card).
 */
export const useBackdropTone = (
  ref: { current: Element | null },
  { dwell = 0, enabled = true, within }: BackdropToneOptions = {},
): BackdropTone | undefined => {
  const [tone, setTone] = useState<BackdropTone | undefined>(undefined);
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!enabled || !element) return undefined;
    const unregister = register(element, within, dwell, setTone);
    return () => {
      unregister();
      setTone(undefined);
    };
  }, [dwell, enabled, ref, within]);

  return enabled ? tone : undefined;
};
