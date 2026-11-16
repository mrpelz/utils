import { flushSync } from 'react-dom';

import { fillIn } from '../utils/main.js';

// Tiles changing size or place by the app's or the user's doing (a card
// expanded, collapsed, opened above the page, closed again): animated by
// a view transition (the browser's: the page captured before and after,
// its named parts moved and resized from where they were to where they
// are). The change itself is made at once (laid out at the new size, the
// grid reflowed); what shows meanwhile is the browser's snapshots of it,
// over the page as it is (live).
//
// Named for it, while it runs:
// - Each tile shown clear of its screen's bars (its surface: a card's
//   glass, else its body): a group of its own, its glass's blur that
//   group's (the browser's, live), rounded as it is, its shadow its
//   group's too (see `groupRules`). Its glass shown at its own size, the
//   larger of its snapshots alone (translucent: two would show both);
//   resized, clipped to its group as it grows or shrinks (see the CSS). Tiles under
//   its bars (or their edge effects) stay in the page: drawn above them,
//   the bars' blur wouldn't cover them; they move by the grid's own reflow
//   there (see `isMovedByTransition`).
// - A named tile's card's parts (`[data-card-part]`, but its root):
//   sliding unscaled from their places to their new ones; those only
//   before or after fading.
// - An open tile's backdrop (fading in or out as a whole) and underlay
//   (not shown meanwhile). The one opened or closed above everything else
//   (`uikit-grid-lifted`), always named.
//
// Started by the library around what it does (a card's corner buttons,
// see Card; opening and closing an item above the page, see `Grid.Item`),
// and by the app around its own changes (`startGridTransition`). Without
// view transitions (or with reduced motion), the change is made at once.

/** The transition running, if any (one at a time). */
let current: ViewTransition | undefined;

/** Whether its change is being made (a nested start: made in it). */
let isUpdating = false;

/**
 * When the running transition's tiles are where they go (an open one's
 * move done: its backdrop cut out then, under it, see overlay.tsx), not
 * when it's gone (WebKit tells that frames later, the page shown as it is
 * meanwhile); none running: at once.
 */
let settled: Promise<void> | undefined;

/** Resolves once the running transition's tiles are there (see above). */
export const whenGridTransitioned = (): Promise<void> =>
  current && settled ? settled : Promise.resolve();

/**
 * Its lifted tiles' moves (their groups' animations), once they've
 * started: their end, the transition's settling (see `settled`); none, its
 * end.
 */
const settlingOf = async (transition: ViewTransition, names: string[]) => {
  try {
    await transition.ready;
    const groups = new Set(
      names.map((name) => `::view-transition-group(${name})`),
    );
    const moves = document
      .getAnimations()
      .filter((animation) =>
        groups.has(
          (animation.effect as KeyframeEffect | null)?.pseudoElement ?? '',
        ),
      );
    await (moves.length > 0
      ? Promise.all(moves.map(({ finished }) => finished))
      : transition.finished);
  } catch {
    // (Skipped, or none: settled.)
  }
};

/** Whether an element has a transition's name. */
const isNamed = (element: HTMLElement) =>
  element.style.getPropertyValue('view-transition-name') !== '';

/**
 * Whether a transition moves a grid's cell (or section) rather than its
 * reflow (see `useReflow`): while one runs, a section (carrying named
 * tiles), a named tile, or a cell with one in it.
 */
export const isMovedByTransition = (element: HTMLElement): boolean =>
  current !== undefined &&
  (element.dataset.gridPart === 'section' ||
    isNamed(element) ||
    Array.from(
      element.querySelectorAll<HTMLElement>('[style*="view-transition-name"]'),
    ).some((each) => isNamed(each)));

/** Its elements' ids, for unique names (`uikit-grid-<id>`). */
let counter = 0;
const ids = new WeakMap<Element, number>();
const idOf = (element: Element) => {
  let id = ids.get(element);
  if (id === undefined) {
    counter += 1;
    id = counter;
    ids.set(element, id);
  }
  return id;
};

/** A body's card's parts (its own: not a nested grid's). */
const partsOf = (body: HTMLElement) =>
  Array.from(
    body.querySelectorAll<HTMLElement>(
      '[data-card-part]:not([data-card-part="root"])',
    ),
  ).filter(
    (part) => part.closest<HTMLElement>('[data-grid-part="body"]') === body,
  );

/** A tile's surface: its card's glass (its root), else its body. */
const surfaceOf = (body: HTMLElement) =>
  body.querySelector<HTMLElement>(':scope > [data-card-part="root"]') ?? body;

/** A part's key in its body's names: its kind, a corner button's corner. */
const keyOf = (part: HTMLElement) =>
  part.dataset.cardPart === 'corner-button'
    ? `corner-${part.dataset.gridCorner ?? ''}`
    : (part.dataset.cardPart ?? '');

type Rect = { bottom: number; left: number; right: number; top: number };

const isOverlapping = (a: Rect, b: Rect) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

/**
 * The screen's bars and their edge effects (see Viewport): where a tile
 * isn't named (see the top).
 */
const barsOf = (): Rect[] =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '.uikit-viewport-anchor, .uikit-viewport-edge-effect',
    ),
  )
    .map((bar) => bar.getBoundingClientRect())
    .filter(({ height, width }) => width > 0 && height > 0);

/** Whether a tile shows on screen clear of its bars. */
const isClear = (body: HTMLElement, bars: readonly Rect[]) => {
  if (body.offsetParent === null) return false;
  const rect = body.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < innerHeight &&
    rect.left < innerWidth &&
    bars.every((bar) => !isOverlapping(rect, bar))
  );
};

/** A transition's state, as it names its elements (see `nameAll`). */
type Naming = {
  /** The tiles named before its change (its bodies). */
  bodies: Set<HTMLElement>;
  /** Whether its change moved or resized a named tile (see `noteChange`). */
  isChanged: boolean;
  /** The bodies opened or closed in it: above the rest. */
  lifted: Set<HTMLElement>;
  /** The lifted bodies' surfaces' names (see `settlingOf`). */
  liftedNames: Set<string>;
  /** What's named: its names removed once it's done. */
  named: Set<HTMLElement>;
  /** Its surfaces' places (on screen) before its change. */
  places: Map<HTMLElement, readonly [number, number]>;
  /** Its surfaces' rims, by their bodies (see `rimOf`). */
  rims: Map<HTMLElement, HTMLElement>;
  /**
   * Its surfaces' shadows (left out of their snapshots, its groups' own,
   * see `groupRules`).
   */
  shadows: Map<HTMLElement, string>;
  /** Its surfaces' sizes before its change. */
  sizes: Map<HTMLElement, readonly [number, number]>;
};

/** Shadow layers as a `box-shadow` (none: `none`). */
const shadowOf = (layers: readonly string[]) =>
  layers.length > 0 ? layers.join(', ') : 'none';

/** A `box-shadow`'s layers, outer and inset (split at top-level commas). */
const layersOf = (shadow: string) => {
  const layers =
    shadow === 'none'
      ? []
      : shadow.split(/,(?![^(]*\))/u).map((each) => each.trim());
  return [
    shadowOf(layers.filter((layer) => !layer.includes('inset'))),
    shadowOf(layers.filter((layer) => layer.includes('inset'))),
  ] as const;
};

/**
 * A named surface's groups' own style (see the top): rounded as it is (its
 * blur too); resized, clipped. Its shadow (left out of its snapshots: the
 * new one, larger than its group as it grows, would cut off its edges):
 * outside, its group's; inside (e.g. a glass's rim), its rim's (see
 * `rimOf`): a group of its own, over its glass (as the shadow is over its
 * background), no snapshot shown, moving and resized with it.
 */
const groupRules = (
  name: string,
  surface: HTMLElement,
  shadow: string,
  isResized: boolean,
) => {
  const { borderRadius } = getComputedStyle(surface);
  const [outer, inner] = layersOf(shadow);
  return [
    `::view-transition-group(${name}) { border-radius: ${borderRadius}; box-shadow: ${outer};${isResized ? ' overflow: clip;' : ''} }`,
    `::view-transition-group(${name}-rim) { border-radius: ${borderRadius}; box-shadow: ${inner}; }`,
  ];
};

/**
 * A surface's rim, while a transition runs (see `groupRules`): an empty
 * element filling it (its last), its inner shadow's group; none for a
 * surface without one, or not positioned (nothing to fill).
 */
const rimOf = (surface: HTMLElement, shadow: string) => {
  if (
    layersOf(shadow)[1] === 'none' ||
    getComputedStyle(surface).position === 'static'
  ) {
    return undefined;
  }
  const rim = document.createElement('span');
  rim.setAttribute('aria-hidden', 'true');
  rim.style.cssText =
    'position: absolute; inset: 0; border-radius: inherit; pointer-events: none;';
  surface.append(rim);
  return rim;
};

/**
 * A tile before its change (see `nameAll`): its size, its shadow (left out
 * of its snapshots, its rim made, see `groupRules`).
 */
const prepare = (
  body: HTMLElement,
  surface: HTMLElement,
  size: readonly [number, number],
  { places, rims, shadows, sizes }: Naming,
) => {
  sizes.set(body, size);
  const { left, top } = surface.getBoundingClientRect();
  places.set(body, [left, top]);
  const shadow = getComputedStyle(surface).boxShadow;
  shadows.set(body, shadow);
  surface.style.setProperty('box-shadow', 'none');
  const rim = rimOf(surface, shadow);
  if (rim) rims.set(body, rim);
};

/**
 * Notes whether a named tile moved or was resized by the change (none
 * did, e.g. a corner button's going to another page: nothing for the
 * transition to show, see `startGridTransition`).
 */
const noteChange = (
  naming: Naming,
  body: HTMLElement,
  surface: HTMLElement,
  isResized: boolean,
) => {
  const was = naming.places.get(body);
  const { left, top } = surface.getBoundingClientRect();
  if (
    isResized ||
    !was ||
    Math.abs(left - was[0]) > 0.5 ||
    Math.abs(top - was[1]) > 0.5
  ) {
    naming.isChanged = true;
  }
};

/** Whether a size changed, and got smaller (either way). */
const changeOf = (
  was: readonly [number, number] | undefined,
  size: readonly [number, number],
): readonly [isResized: boolean, isShrinking: boolean] =>
  was
    ? [
        size[0] !== was[0] || size[1] !== was[1],
        size[0] < was[0] || size[1] < was[1],
      ]
    : [false, false];

/**
 * Names a transition's elements (see the top), before its change (the
 * tiles chosen then) and after; returns its groups' rules (after).
 */
const nameAll = (naming: Naming, isAfter: boolean): string[] => {
  const { bodies, lifted, named, rims, shadows, sizes } = naming;
  const rules: string[] = [];
  const used = new Set<string>();
  const name = (element: HTMLElement, value: string, classes: string[]) => {
    if (used.has(value)) return;
    used.add(value);
    element.style.setProperty('view-transition-name', value);
    element.style.setProperty(
      'view-transition-class',
      classes.filter(Boolean).join(' '),
    );
    named.add(element);
  };
  const bars = barsOf();
  for (const body of document.querySelectorAll<HTMLElement>(
    '[data-grid-part="body"]',
  )) {
    if (Object.hasOwn(body.dataset, 'gridOpen')) lifted.add(body);
    const isLifted = lifted.has(body);
    if (!isLifted && !(isAfter ? bodies.has(body) : isClear(body, bars))) {
      continue;
    }
    bodies.add(body);
    const id = String(idOf(body));
    const surface = surfaceOf(body);
    // (Its size before, and whether it's resized, smaller: its old
    // snapshot then the one shown, see the CSS.)
    const size = [surface.offsetWidth, surface.offsetHeight] as const;
    if (!isAfter) prepare(body, surface, size, naming);
    const [isResized, isShrinking] = isAfter
      ? changeOf(sizes.get(body), size)
      : [false, false];
    const surfaceName = `uikit-grid-${id}`;
    const liftedClass = isLifted ? 'uikit-grid-lifted' : '';
    if (isLifted) naming.liftedNames.add(surfaceName);
    name(surface, surfaceName, [
      'uikit-grid-tile',
      liftedClass,
      isShrinking ? 'uikit-grid-shrinking' : '',
    ]);
    const rim = rims.get(body);
    if (rim?.isConnected) {
      name(rim, `${surfaceName}-rim`, ['uikit-grid-rim', liftedClass]);
    }
    if (isAfter) {
      noteChange(naming, body, surface, isResized);
      rules.push(
        ...groupRules(
          surfaceName,
          surface,
          shadows.get(body) ?? 'none',
          isResized,
        ),
      );
    }
    for (const part of partsOf(body)) {
      name(part, `uikit-grid-${id}-${keyOf(part)}`, [
        'uikit-card-part',
        part.dataset.cardPart === 'corner-button' ? 'uikit-card-corner' : '',
        liftedClass,
      ]);
    }
  }
  for (const layer of document.querySelectorAll<HTMLElement>(
    '[data-grid-part="backdrop"], [data-grid-part="underlay"]',
  )) {
    name(layer, `uikit-grid-${String(idOf(layer))}`, [
      `uikit-grid-${layer.dataset.gridPart ?? ''}`,
    ]);
  }
  return rules;
};

/** Waits for what's rendered to be in the DOM (a render scheduled). */
const rendered = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve);
  });

/**
 * Makes a change to the grid (e.g. an item's size, a card expanded) in a
 * view transition (see the top): its tiles and their cards' parts moving
 * from where they were to where they are. `update` makes it (e.g. the
 * app's state set); without view transitions, or with reduced motion, it's
 * made at once. Inside another's change, made in that one.
 */
export const startGridTransition = (update: () => void): void => {
  if (
    isUpdating ||
    typeof document === 'undefined' ||
    !('startViewTransition' in document) ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    update();
    return;
  }
  // (One at a time: a running one finished at once.)
  current?.skipTransition();
  const root = document.documentElement;
  // (An open item's backdrop whole again: captured without its hole, fading
  // out closing; cut out again once it's done, see overlay.tsx.)
  for (const backdrop of document.querySelectorAll<HTMLElement>(
    '[data-grid-part="backdrop"]',
  )) {
    fillIn(backdrop);
  }
  const naming: Naming = {
    bodies: new Set(),
    lifted: new Set(),
    named: new Set(),
    isChanged: false,
    liftedNames: new Set(),
    places: new Map(),
    rims: new Map(),
    shadows: new Map(),
    sizes: new Map(),
  };
  nameAll(naming, false);
  const wasOpen = naming.lifted.size > 0;
  // (Its groups' own rules, see `groupRules`.)
  const sheet = document.createElement('style');
  const transition = document.startViewTransition(async () => {
    isUpdating = true;
    try {
      flushSync(update);
    } finally {
      isUpdating = false;
    }
    await rendered();
    sheet.textContent = nameAll(naming, true).join('\n');
    document.head.append(sheet);
    // (Its page live meanwhile; an item opening or closing above it, its
    // backdrop fading in or out, see the CSS.)
    const isOpen = [...naming.lifted].some((body) =>
      Object.hasOwn(body.dataset, 'gridOpen'),
    );
    let kind = '';
    if (isOpen && !wasOpen) kind = 'open';
    else if (!isOpen && wasOpen) kind = 'close';
    root.dataset.gridTransition = kind;
    // (No tile moved nor resized, nothing opened or closed (e.g. a corner
    // button going to another page): skipped, the page shown as it is at
    // once; its own motion (e.g. a page sliding in) not covered by the
    // tiles' snapshots.)
    if (!naming.isChanged && !kind) transition.skipTransition();
  });
  current = transition;
  settled = (async () => {
    // (Its names known once its change is made, after it's started.)
    await transition.updateCallbackDone.catch(() => undefined);
    await settlingOf(transition, [...naming.liftedNames]);
  })();
  const done = () => {
    if (current === transition) current = undefined;
    for (const element of naming.named) {
      element.style.removeProperty('view-transition-name');
      element.style.removeProperty('view-transition-class');
      element.style.removeProperty('box-shadow');
    }
    for (const rim of naming.rims.values()) rim.remove();
    sheet.remove();
    if (!current) delete root.dataset.gridTransition;
  };
  transition.finished.catch(() => undefined).then(done);
};
