import '../glass/style.css';
import './style.css';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import {
  ComponentProps,
  createContext,
  forwardRef,
  MouseEvent,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { GlassBackground } from '../glass/main.js';
import {
  cn,
  type DelayedLens,
  delayLens,
  edgeScrollDelta,
  frameElapsed,
  useForwardedRef,
  usePointerDrag,
  useSecondaryClick,
  withStyle,
} from '../utils/main.js';
import type {
  AccessoryMorph,
  Box,
  CollapsedGroupSelection,
  CollapsedPosition,
  CollapsedVisibility,
  GroupState,
  ListState,
  TabBarAccessoryProps,
  TabBarGroupProps,
  TabBarListProps,
  TabBarRootProps,
  TabBarTabProps,
} from './props.js';

export type {
  AccessoryVisibility,
  CollapsedContent,
  CollapsedGroupSelection,
  CollapsedPosition,
  TabBarAccessoryProps,
  TabBarGroupProps,
  TabBarListProps,
  TabBarRootProps,
  TabBarTabProps,
} from './props.js';

// The tab bar in dim and bright contexts, with the selected content color
// mapped to the app tint (`--color-ui-primary`, i.e. `systemBlue`); glass
// materials, vibrant content and selection colors are tokens in
// `styles.css`, used via `glass/main.tsx`. The selection's transition
// duration comes from Framework7 `components/toolbar/toolbar-ios.less`
// (`.tab-link-highlight`), disabled opacity from Framework7 `less/mixins.less`
// (`.disabled()`).
//
// In the regular size, symbols and labels are in the Subheadline text style
// (selected labels: 17px, bold); the compact size's (17/28px, 10/12px) are in
// none.
//
// Also:
// - The list's `size` (a size class) switches between the phone and the
//   tablet tab bar, for all its groups; tabs hold a symbol, a label or both in
//   either: - `compact`: content stacked, 54px high, with a preferred
//   (shrinkable, not fixed) width of 102px, down to a minimum of 54px;
//   `width` is used as `flex-basis` is ignored for the group's intrinsic
//   size. A single tab next to the search tab is 102px. Neighbors overlap.
//   - `regular`: content in a row, 36px high, hugging it, with larger labels
//   that grow when selected and smaller symbols; white selected content on
//   dim glass (compact: the tint). The selection is the same token as the
//   compact size's. Symbol-only tabs are circles in the compact size and
//   capsules hugging the symbol in the regular size (50×36), but circles
//   alone in a group; others capsules; a tab's (or its group's) `shape`
//   overrides this (`circle`: a circle in both sizes). Labels reserve their
//   selected width, so selecting a tab doesn't shift the tabs.
// - The bar's inline padding is always 32px.
// - No padding below the groups: the safe area is its anchor's (a
//   `Viewport.BlockEnd`), so it sits right above it.
// - In a bar wider than its groups, the space between them widens, the first
//   at the bar's start, as when collapsed.
// - Nothing isolates blending, as that would cut the glass blur off from the
//   content behind the bar; glass, indicator and tabs stack by document order
//   instead.
// - Each group positions its own selection (the indicator) on its active tab.
//   When the active tab leaves a group, its selection fades out in place; a
//   group gaining the active tab fades its selection in, so the selection never
//   travels between groups.
// - The fills' blend modes are applied as `mix-blend-mode` of separate layers
//   (blending with the blurred backdrop), each carrying the fill's opacity.
// - The blur layer's own `filter: blur(10px)` and masking are omitted.
// - The glass effect (its rim and shading) is emulated as in Framework7 `less/mixins.less` (`.ios-glass()`: backdrop
//   `saturate(180%)` and `--f7-glass-shadow`, see `styles.css`).
// - Pressing a tab turns the selection into a glass lens that follows the
//   pointer and activates the closest tab on release, as in Framework7
//   `components/toolbar/tabbar-highlight.js` and `toolbar-ios.less`
//   (`.tab-link-highlight-pressed`); unlike Framework7 for all pointer types,
//   not only touch, and only once held a moment or dragged (a quick tap
//   only selects, see `delayLens`). The lens belongs to the list, so it moves (and can be
//   dragged) between groups, and is drawn above the tabs, as it has to be above
//   the groups' glass. While dragging, it follows the pointer without a
//   transition (Framework7: 300ms ease-out).
// - The browser's default focus ring is kept.

// Metrics of tabs and their content per size, inherited from the list. Tabs
// of the compact size shrink to fit their group, down to their content's
// width; those of the regular size keep it. Beyond that, the group scrolls
// (see `StyledTabs`).
// (See style.css.)

// Marks a tab's symbol and label, so a tab can lay out by its content, and

const setProperties = (
  element: HTMLElement,
  properties: Record<string, string>,
) => {
  for (const [property, value] of Object.entries(properties)) {
    element.style.setProperty(property, value);
  }
};

const isTab = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement && element.getAttribute('role') === 'tab';

const isActive = (element: HTMLElement) =>
  Object.hasOwn(element.dataset, 'active');

// A group's tabs (and its selection) are in its scroller, inside its glass.
const scrollerOf = (group: HTMLElement) =>
  group.querySelector<HTMLElement>(':scope > [data-tab-bar-part=tabs]');

const groupOf = (tab: HTMLElement) => tab.parentElement?.parentElement ?? null;

const tabsOf = (group: HTMLElement) =>
  [...(scrollerOf(group)?.children ?? [])].filter(isTab);

// The position of an element in the layout of the scroller containing it
// (unaffected by scrolling and transforms).
const offsetIn = (element: HTMLElement, scroller: HTMLElement) => {
  let x = 0;
  let y = 0;

  for (
    let current: Element | null = element;
    current instanceof HTMLElement && current !== scroller;
    current = current.offsetParent
  ) {
    x += current.offsetLeft;
    y += current.offsetTop;
  }

  return { x, y };
};

// How far a group's scroller scrolls by its tabs' layout (not by their
// content, which grows beyond while pressed, see `pressGroup`). By their
// boxes (tabs aren't transformed, only their content), as `offsetLeft` and
// `offsetWidth` round, together off by up to a pixel.
const scrollRange = (scroller: HTMLElement) => {
  const origin =
    scroller.getBoundingClientRect().left +
    scroller.clientLeft -
    scroller.scrollLeft;

  return (
    Math.max(
      0,
      ...[...scroller.children]
        .filter(isTab)
        .map((tab) => tab.getBoundingClientRect().right - origin),
    ) - scroller.clientWidth
  );
};

// Only a group too narrow for its tabs clips them: others show their
// content growing beyond while pressed.
const updateOverflow = (group: HTMLElement) => {
  const scroller = scrollerOf(group);
  scroller?.toggleAttribute('data-overflowing', scrollRange(scroller) > 1);
};

// A tab's box as far as its group shows it, or `undefined` if scrolled out
// of view.
const visibleRect = (tab: HTMLElement) => {
  const rect = tab.getBoundingClientRect();
  const { parentElement: scroller } = tab;
  if (!scroller) return rect;

  const clip = scroller.getBoundingClientRect();
  const left = Math.max(rect.left, clip.left);
  const right = Math.min(rect.right, clip.right);

  return right - left > 1
    ? new DOMRect(left, rect.top, right - left, rect.height)
    : undefined;
};

/**
 * Scrolls a group to show `tab` entirely, if it doesn't. Scrolls to a
 * position rather than by a distance, so repeating it while scrolling
 * doesn't scroll further.
 */
const reveal = (tab: HTMLElement, behavior: ScrollBehavior = 'smooth') => {
  const { parentElement: scroller } = tab;
  if (!scroller) return;

  const { x } = offsetIn(tab, scroller);
  const left = Math.min(x, scroller.scrollLeft);
  const target = Math.max(left, x + tab.offsetWidth - scroller.clientWidth);
  if (Math.abs(target - scroller.scrollLeft) < 1) return;

  scroller.scrollTo({ behavior, left: target });
};

// Groups that had an active tab when their selection was last positioned.
const hadActiveTab = new WeakMap<HTMLElement, boolean>();

const setSelection = (
  group: HTMLElement,
  rect: DOMRect,
  { instant = false, left = rect.left } = {},
) => {
  // Positioned in its scroller's content, so it scrolls with the tabs.
  const scroller = scrollerOf(group);
  if (!scroller) return;

  const scrollerRect = scroller.getBoundingClientRect();
  const originX = scrollerRect.left + scroller.clientLeft - scroller.scrollLeft;
  const originY = scrollerRect.top + scroller.clientTop - scroller.scrollTop;

  if (instant) {
    group.style.setProperty('--uikit-tab-bar-selection-duration', '0s');
  }

  setProperties(group, {
    '--uikit-tab-bar-selection-height': `${rect.height}px`,
    '--uikit-tab-bar-selection-left': `${left - originX}px`,
    '--uikit-tab-bar-selection-top': `${rect.top - originY}px`,
    '--uikit-tab-bar-selection-width': `${rect.width}px`,
  });

  if (instant) {
    group.getBoundingClientRect();
    group.style.removeProperty('--uikit-tab-bar-selection-duration');
  }
};

// Positions a group's selection on its active tab and shows it; without an
// active tab, the selection fades out in place. A selection appearing in a
// group is placed instantly, so it does not travel in from elsewhere.
const updateSelection = (group: HTMLElement, { instant = false } = {}) => {
  const tab = tabsOf(group).find((child) => isActive(child));
  const hadActive = hadActiveTab.get(group) ?? false;
  hadActiveTab.set(group, Boolean(tab));

  group.style.setProperty('--uikit-tab-bar-selection-opacity', tab ? '1' : '0');
  if (!tab) return;

  group.style.removeProperty('--uikit-tab-bar-pressed');

  setSelection(group, tab.getBoundingClientRect(), {
    instant: instant || !hadActive,
  });
};

// Collapsed: the bar is 48pt high instead of
// 62pt around the same center line, 7pt further in from the edges. The
// groups and tabs marked `visibleWhenCollapsed` remain (and only those: what
// remains is the app's to decide, e.g. by `collapsedSelection`), the others
// collapse away; each group at its `collapsedPosition` (or the list's),
// groups at the same one side by side: ordered by position between two
// spacers, the list's pseudo-elements, which take up the free space. Tabs
// show `collapsedContent`, in the content color, the selection faded out
// (with several remaining tabs, on the active one, if it's among them): a
// symbol in a 40pt circle, or a label (and symbol, side by side, in the
// regular size's metrics) in a capsule. The bar keeps its size (see `List`).
// The regular size keeps its height (it's never minimized).

/**
 * A choice of what remains while collapsed (for `visibleWhenCollapsed`): the
 * active tab (by its value, among the groups' tab values) and its
 * group; without one, the first group's first tab. Every group's `tab` is
 * its active tab, or its first (for groups the app keeps, too).
 */
export const collapsedSelection = <Value,>(
  groups: readonly (readonly Value[])[],
  value: Value | undefined,
): CollapsedGroupSelection[] => {
  const active = groups.findIndex((tabs) => tabs.includes(value as Value));
  const remaining = Math.max(active, 0);

  return groups.map((tabs, index) => ({
    remains: index === remaining,
    tab: Math.max(tabs.indexOf(value as Value), 0),
  }));
};

// The order of groups by their position, around the spacers (1 and 3).
const collapsedOrder: Record<CollapsedPosition, number> = {
  center: 2,
  'inline-end': 4,
  'inline-start': 0,
};

// What a collapsed tab shows, as custom properties used by the list's styles
// (`collapsedList`): set on the list (its `collapsedContent`), or on a tab
// (its own, which wins). Symbols in a capsule take the regular size's
// metrics; `initial` leaves a tab's own.
// (See style.css.)

// A hidden tab: no size, so neither its width nor its aspect ratio (circles)
// takes up space while it collapses.

// A remaining tab, as the list's styles show the active one.

// With several groups marked to remain, they are spaced by transparent
// borders (see `StyledGroup`), as the list has no gap while collapsed: the
// groups collapsing away would take it up.
// (See style.css.)

// The accessory's height and gap above the groups (see `Accessory`).
const accessoryHeight = 40;
const accessoryGap = 16;

// Enabled tabs, but those a collapsed bar hides (see `collapsedList`).
const getTabs = (list: HTMLElement) =>
  [...list.querySelectorAll('[role="tab"]')].filter(
    (tab): tab is HTMLElement =>
      tab instanceof HTMLElement &&
      !Object.hasOwn(tab.dataset, 'disabled') &&
      getComputedStyle(tab).pointerEvents !== 'none',
  );

const getGroups = (list: HTMLElement) =>
  new Set(
    getTabs(list)
      .map((tab) => groupOf(tab))
      .filter((group): group is HTMLElement => group !== null),
  );

// Places the lens on `rect`, centered at `centerX`, its left and right edges
// within `bounds` (default: those it has, e.g. settling from a press: the
// rect's own would pin an edge of the still larger lens).
const setLens = (
  list: HTMLElement,
  rect: DOMRect,
  centerX: number,
  bounds?: { left: number; right: number },
) => {
  const listRect = list.getBoundingClientRect();
  const originX = listRect.left + list.clientLeft - list.scrollLeft;
  const originY = listRect.top + list.clientTop - list.scrollTop;

  if (bounds) {
    setProperties(list, {
      '--uikit-tab-bar-lens-max': `${bounds.right - originX}px`,
      '--uikit-tab-bar-lens-min': `${bounds.left - originX}px`,
    });
  }

  setProperties(list, {
    '--uikit-tab-bar-lens-height': `${rect.height}px`,
    '--uikit-tab-bar-lens-width': `${rect.width}px`,
    '--uikit-tab-bar-lens-x': `${centerX - originX}px`,
    '--uikit-tab-bar-lens-y': `${rect.top + rect.height / 2 - originY}px`,
  });
};

// Grows the group under the lens (or, with `pressed` false, back): its
// glass layers scale around their (the group's) center by themselves; its
// tabs' symbols and labels scale around the group's center too, set as their
// transform origin. Scaling the group itself would isolate its layers'
// blending (rendering the glass gray). Called again while the group scrolls,
// as its center moves over its tabs.
const pressGroup = (group: HTMLElement, isPressed: boolean) => {
  if (!isPressed) {
    delete group.dataset.pressed;
    return;
  }

  const scroller = scrollerOf(group);
  if (!scroller) return;

  // The group's center in the layout of its scroller (filling the group).
  const centerX = scroller.scrollLeft + scroller.clientWidth / 2;
  const centerY = scroller.scrollTop + scroller.clientHeight / 2;
  // (Symbols scale their glyphs, see `Symbol`.)
  const content = scroller.querySelectorAll(
    '[data-tab-bar-part=icon], [data-tab-bar-part=label], .uikit-symbol-glyph',
  );

  for (const element of content) {
    if (!(element instanceof HTMLElement)) continue;

    const { x, y } = offsetIn(element, scroller);
    element.style.transformOrigin = `${centerX - x}px ${centerY - y}px`;
  }

  group.dataset.pressed = '';
};

/** The index of the rectangle centered closest to `x`. */
const closest = (rects: DOMRect[], x: number) => {
  const distances = rects.map(({ left, width }) =>
    Math.abs(left + width / 2 - x),
  );

  return distances.indexOf(Math.min(...distances));
};

/**
 * How a group grows while pressed (see `pressGroup`): its scale, around its
 * center. Its tabs keep their (unscaled) boxes; their content scales.
 */
const growth = (group: HTMLElement) => {
  const { height, left, top, width } = group.getBoundingClientRect();
  const scale = Number.parseFloat(
    getComputedStyle(group).getPropertyValue(
      '--uikit-tab-bar-pressed-group-scale',
    ),
  );

  return {
    scale: Number.isFinite(scale) ? scale : 1,
    x: left + width / 2,
    y: top + height / 2,
  };
};

// Moves the lens to the pointer, clamped to the list's tabs, and returns the
// closest tab (Framework7 `tabbar-highlight.js`, `setHighlightOnTouch`), of
// those its group shows (not scrolled out of view). The (hidden) selection of
// the closest tab's group follows the lens, so it settles from there on
// release. The lens and the pointer are where the pressed group shows its
// (scaled) content.
const press = (list: HTMLElement, clientX: number) => {
  const tabs: HTMLElement[] = [];
  const visible: DOMRect[] = [];
  for (const tab of getTabs(list)) {
    const rect = visibleRect(tab);
    if (!rect) continue;

    tabs.push(tab);
    visible.push(rect);
  }

  // The pointer in the tabs' unscaled layout, as the group under it grows.
  const overTab = tabs[closest(visible, clientX)];
  const over = overTab ? groupOf(overTab) : undefined;
  const overGrowth = over ? growth(over) : undefined;
  const x = overGrowth
    ? overGrowth.x + (clientX - overGrowth.x) / overGrowth.scale
    : clientX;

  const index = closest(visible, x);
  const tab = tabs[index];
  const pressedGroup = tab ? groupOf(tab) : undefined;
  if (!tab || !pressedGroup) return undefined;

  const rect = tab.getBoundingClientRect();
  const left = Math.min(...visible.map((visibleTab) => visibleTab.left));
  const right = Math.max(...visible.map((visibleTab) => visibleTab.right));
  const centerX = Math.max(
    left + rect.width / 2,
    Math.min(x, right - rect.width / 2),
  );

  // The lens is on the tab as its grown group shows it.
  const { scale, x: originX, y: originY } = growth(pressedGroup);
  setLens(
    list,
    new DOMRect(
      originX + (rect.left - originX) * scale,
      originY + (rect.top - originY) * scale,
      rect.width * scale,
      rect.height * scale,
    ),
    originX + (centerX - originX) * scale,
    {
      left: originX + (left - originX) * scale,
      right: originX + (right - originX) * scale,
    },
  );

  for (const group of getGroups(list)) {
    pressGroup(group, group === pressedGroup);

    if (group === pressedGroup) {
      // Only a group holding the active tab moves its selection; others place
      // it instantly, so it never travels in from a stale position.
      setSelection(group, rect, {
        instant: !hadActiveTab.get(group),
        left: centerX - rect.width / 2,
      });
    } else {
      updateSelection(group);
    }
  }

  return tab;
};

// Settles the lens on the chosen tab (if any) while it fades out. Groups take
// their final state right away, so the selection of a group losing the active
// tab does not reappear while the press ends: the chosen tab's group settles
// its selection from the lens position, all others fade out. They are
// reconciled on the next frame, in case the chosen tab is not activated.
const release = (list: HTMLElement, tab?: HTMLElement) => {
  list.style.removeProperty('--uikit-tab-bar-lens-move-duration');
  list.style.removeProperty('--uikit-tab-bar-pressed');

  const groups = getGroups(list);
  for (const group of groups) pressGroup(group, false);

  if (!tab) {
    for (const group of groups) updateSelection(group);
    return;
  }

  const rect = tab.getBoundingClientRect();
  setLens(list, rect, rect.left + rect.width / 2);

  for (const group of groups) {
    const isChosen = group === groupOf(tab);
    const hadActive = hadActiveTab.get(group) ?? false;
    hadActiveTab.set(group, isChosen);
    group.style.setProperty(
      '--uikit-tab-bar-selection-opacity',
      isChosen ? '1' : '0',
    );

    if (isChosen) {
      // A group gaining the active tab only fades its selection in.
      setSelection(group, rect, { instant: !hadActive });
    } else {
      // Keep the selection hidden like while pressed, so it only fades out.
      group.style.setProperty('--uikit-tab-bar-pressed', '1');
    }
  }

  requestAnimationFrame(() => {
    for (const group of groups) updateSelection(group);
  });
};

/**
 * Scrolls the group of the lens' tab, if too narrow for its tabs, in every
 * frame the lens' pointer is near one of the group's ends, faster closer to
 * it (as text selections scroll). Returns a function stopping it.
 */
const autoScroll = (pointer: {
  current: { clientX: number; state: { tab?: HTMLElement } } | undefined;
}) => {
  const elapsedOf = frameElapsed();
  let frame = requestAnimationFrame(function step(time) {
    frame = requestAnimationFrame(step);
    const elapsed = elapsedOf(time);

    const { current } = pointer;
    const scroller = current?.state.tab?.parentElement;
    if (!current || !scroller) return;

    const range = scrollRange(scroller);
    if (range <= 1) return;

    const { left, right } = scroller.getBoundingClientRect();
    const delta = edgeScrollDelta(current.clientX, left, right, elapsed);
    if (delta === 0) return;

    // Within the tabs' layout (see `scrollRange`).
    scroller.scrollLeft = Math.max(
      0,
      Math.min(range, scroller.scrollLeft + delta),
    );
  });

  return () => cancelAnimationFrame(frame);
};

/**
 * Calls `done` once the transitions of `element` and its descendants have
 * finished (also when slowed down, e.g. in the browser's developer tools, or
 * restarted), starting from the next frame, when they have begun. Returns a
 * function cancelling it.
 */
const afterTransitions = (element: HTMLElement, done: () => void) => {
  let isCancelled = false;

  const check = () => {
    if (isCancelled) return;

    const running = element
      .getAnimations({ subtree: true })
      .filter(({ playState }) => playState === 'running');
    if (running.length === 0) {
      done();
      return;
    }

    Promise.allSettled(running.map(({ finished }) => finished))
      .then(() => requestAnimationFrame(check))
      .catch(() => undefined);
  };

  requestAnimationFrame(check);

  return () => {
    isCancelled = true;
  };
};

/**
 * Counts the elements marked by a context's children: `mark` counts one
 * until the returned function is called.
 */
const useMarks = () => {
  const [count, setCount] = useState(0);
  const mark = useCallback(() => {
    setCount((current) => current + 1);
    return () => setCount((current) => current - 1);
  }, []);

  return [count, mark] as const;
};

// The accessory (e.g. a music app's mini player): expanded, a capsule as wide as the bar's groups, its glass 48pt
// high and 8pt above theirs; collapsed, it moves into their row, filling the
// space after the remaining groups at the start (spaced as groups are), at
// the height of their tabs. Sizes are of its box: the glass extends beyond
// (see `GlassBackground`). It's a sibling of the list (not in the tab list,
// for its content's semantics), positioned absolutely at it by CSS anchor
// positioning (see `Root`), so it never changes the bar's layout and moves
// with it. Both places follow the groups in every frame; while the bar
// collapses or expands, it morphs from one to the other. Shown in one state
// only (`visibleIn`), it stays at its place there, fading in and out as the
// bar collapses and expands.
const accessorySpacing = 16;

// The accessory of a list (see `Accessory`).
const accessories = new WeakMap<HTMLElement, HTMLElement>();

/** Boxes mixed, `fraction` of the way from `from` to `to`. */
const mixBoxes = (from: Box, to: Box, fraction: number): Box => {
  const mix = (key: keyof Box) => from[key] + (to[key] - from[key]) * fraction;
  return {
    height: mix('height'),
    left: mix('left'),
    right: mix('right'),
    top: mix('top'),
  };
};

const accessoryMorphs = new WeakMap<HTMLElement, AccessoryMorph>();

/** The running CSS transitions of `element` and its descendants. */
const runningTransitions = (element: HTMLElement) =>
  element
    .getAnimations({ subtree: true })
    .filter(
      (animation): animation is CSSTransition =>
        animation instanceof CSSTransition && animation.playState === 'running',
    );

// Properties not affecting layout: their transitions aren't sought (see
// `atTransitionsEnd`).
const paintOnly =
  /^(?:opacity|visibility|transform|translate|scale|rotate|filter|backdrop-filter|box-shadow|color|background.*|border-.*-color|outline.*|fill|stroke)$/u;

// Just before their end (ms): still running (ended, they'd be removed),
// their values all but their targets.
const beforeEnd = 0.01;

/**
 * `measure`'s result as `transitions` will have ended: sought to just
 * before their end, and back (synchronously: nothing renders in between, and
 * they don't end).
 */
const atTransitionsEnd = <T,>(
  transitions: CSSTransition[],
  measure: () => T,
): T => {
  const layout = transitions.filter(
    (transition) => !paintOnly.test(transition.transitionProperty),
  );
  const times = layout.map((transition) => transition.currentTime);
  for (const transition of layout) {
    const end = Number(transition.effect?.getComputedTiming().endTime);
    if (Number.isFinite(end)) {
      transition.currentTime = Math.max(0, end - beforeEnd);
    }
  }

  try {
    return measure();
  } finally {
    for (const [index, transition] of layout.entries()) {
      transition.currentTime = times[index] ?? null;
    }
  }
};

// CSS `ease`, as the groups' transitions (approximately).
const ease = (progress: number) => {
  const inOut = progress * progress * (3 - 2 * progress);
  return inOut + (1 - inOut) * progress * (1 - progress) * 0.5;
};

// The accessory's box, relative to the list.
const accessoryBox = (list: HTMLElement, accessory: HTMLElement): Box => {
  const listRect = list.getBoundingClientRect();
  const { height, left, right, top } = accessory.getBoundingClientRect();

  return {
    height,
    left: left - listRect.left,
    right: right - listRect.left,
    top: top - listRect.top,
  };
};

/**
 * How far `transitions` have got (0 to 1, eased): the one ending last, by
 * its own time (so slowed down with it, e.g. in the browser's developer
 * tools).
 */
const transitionsProgress = (transitions: CSSTransition[]) => {
  let latest = Number.NEGATIVE_INFINITY;
  let progress = 1;
  for (const transition of transitions) {
    const timing = transition.effect?.getComputedTiming();
    const end = Number(timing?.endTime);
    if (!(end > latest)) continue;

    latest = end;
    const delay = Number(timing?.delay ?? 0);
    const duration = Number(timing?.duration);
    const time = Number(transition.currentTime);
    progress =
      duration > 0 ? Math.min(1, Math.max(0, (time - delay) / duration)) : 1;
  }

  return ease(progress);
};

/**
 * The free space of an expanded list (the space between its groups, or
 * after its only group): while it collapses or expands, a length for its
 * groups' margins, so they transition (from or to `auto` they couldn't).
 */
const measureFreeSpace = (list: HTMLElement) => {
  const groups = [...list.querySelectorAll<HTMLElement>(':scope > div')];
  const last = groups.at(-1);
  if (!last) return 0;

  const style = getComputedStyle(list);
  const isRightToLeft = style.direction === 'rtl';
  const box = list.getBoundingClientRect();
  const rect = last.getBoundingClientRect();
  const rest = isRightToLeft
    ? rect.left - (box.left + Number.parseFloat(style.paddingLeft))
    : box.right - Number.parseFloat(style.paddingRight) - rect.right;
  if (groups.length < 2) return Math.max(0, rest);

  // The space between: the second group's margin (auto, or the length).
  const [, second] = groups;
  const margin = second
    ? Number.parseFloat(
        getComputedStyle(second)[isRightToLeft ? 'marginRight' : 'marginLeft'],
      )
    : 0;
  const free = Math.max(0, margin + rest);
  return free;
};

/** Starts the accessory's morph to the collapsed (or expanded) place. */
const morphAccessory = (list: HTMLElement, isCollapsed: boolean) => {
  const morph = accessoryMorphs.get(list);
  if (morph?.isCollapsed === isCollapsed) return;

  const accessory = accessories.get(list);
  accessoryMorphs.set(list, {
    isCollapsed,
    // From where it is (also mid-morph); placed right away the first time.
    from: morph && accessory ? accessoryBox(list, accessory) : undefined,
    remaining: morph?.remaining ?? [],
  });
};

// A group's box without its spacing (see `StyledGroup`): its scroller's.
const contentRect = (group: HTMLElement) =>
  (scrollerOf(group) ?? group).getBoundingClientRect();

// The accessory's place above the groups (all of them).
const aboveGroups = (rects: DOMRect[]): Box => ({
  height: accessoryHeight,
  left: Math.min(...rects.map((rect) => rect.left)),
  right: Math.max(...rects.map((rect) => rect.right)),
  top:
    Math.min(...rects.map((rect) => rect.top)) - accessoryGap - accessoryHeight,
});

// The accessory's place between the remaining groups, in the order they're
// placed in (see `collapsedOrder`): after those at the start, where the free
// space is, at the height of a collapsed tab, centered with them.
const betweenGroups = (list: HTMLElement, groups: HTMLElement[]): Box => {
  const listRect = list.getBoundingClientRect();
  const style = getComputedStyle(list);
  const sorted = groups
    .map((group) => ({
      order: Number.parseFloat(getComputedStyle(group).order) || 0,
      rect: contentRect(group),
    }))
    .toSorted((a, b) => a.order - b.order);
  const startCount = sorted.filter(({ order }) => order === 0).length;
  const before = sorted[startCount - 1]?.rect;
  const after = sorted[startCount]?.rect;
  const row = before ?? after ?? listRect;
  const height =
    Number.parseFloat(
      style.getPropertyValue('--uikit-tab-bar-collapsed-tab-height'),
    ) || accessoryHeight;

  return {
    height,
    left: before
      ? before.right + accessorySpacing
      : listRect.left + Number.parseFloat(style.paddingLeft),
    right: after
      ? after.left - accessorySpacing
      : listRect.right - Number.parseFloat(style.paddingRight),
    top: row.top + row.height / 2 - height / 2,
  };
};

/** A box (in the viewport) relative to the list's `rect`. */
const relativeTo = (box: Box, rect: DOMRect): Box => ({
  height: box.height,
  left: box.left - rect.left,
  right: box.right - rect.left,
  top: box.top - rect.top,
});

const placeAccessory = (list: HTMLElement): void => {
  const accessory = accessories.get(list);
  const morph: AccessoryMorph = accessoryMorphs.get(list) ?? {
    isCollapsed: false,
    remaining: [],
  };
  if (!accessory) return;

  const groups = [...list.querySelectorAll<HTMLElement>(':scope > div')];
  if (groups.length === 0) return;

  if (morph.isCollapsed) {
    // Groups collapsing away stop taking pointer events right away.
    morph.remaining = groups.filter(
      (group) => getComputedStyle(group).pointerEvents !== 'none',
    );
  }

  // State for its styles (see `StyledAccessory`).
  accessory.toggleAttribute('data-collapsed', morph.isCollapsed);
  const visibleIn = getComputedStyle(accessory)
    .getPropertyValue('--uikit-tab-bar-accessory-visible-in')
    .trim();

  // Its place as the groups are; shown in one state only, at its place
  // there.
  const isCollapsedPlace =
    visibleIn === 'both' ? morph.isCollapsed : visibleIn === 'collapsed';
  const measure = () => {
    const box = isCollapsedPlace
      ? betweenGroups(
          list,
          morph.remaining.length > 0 ? morph.remaining : groups,
        )
      : aboveGroups(groups.map((group) => contentRect(group)));
    return relativeTo(box, list.getBoundingClientRect());
  };

  // Morphing: from where it was, to its place as the groups will be, as far
  // as their transitions have got; once they've ended, done.
  const running =
    morph.from && visibleIn === 'both' ? runningTransitions(list) : [];
  morph.transitions ??= running;
  const transitions = morph.transitions.filter((transition) =>
    running.includes(transition),
  );
  if (transitions.length === 0) {
    delete morph.from;
    delete morph.target;
    delete morph.transitions;
  }

  let place: Box;
  if (morph.from) {
    const time = document.timeline.currentTime;
    if (morph.target?.time !== time) {
      morph.target = { box: atTransitionsEnd(running, measure), time };
    }
    place = mixBoxes(
      morph.from,
      morph.target.box,
      transitionsProgress(transitions),
    );
  } else {
    place = measure();
  }
  const isDone = !morph.from;

  // Room above the list for its place above the groups (see StyledList).
  list.toggleAttribute('data-accessory-above', visibleIn !== 'collapsed');

  setProperties(accessory, {
    '--uikit-tab-bar-accessory-height': `${place.height}px`,
    '--uikit-tab-bar-accessory-left': `${place.left}px`,
    '--uikit-tab-bar-accessory-top': `${place.top}px`,
    '--uikit-tab-bar-accessory-width': `${Math.max(0, place.right - place.left)}px`,
  });

  // Morphing on by itself, also once the groups have settled.
  if (!isDone && morph.frame === undefined && accessoryMorphs.has(list)) {
    morph.frame = requestAnimationFrame(() => {
      morph.frame = undefined;
      placeAccessory(list);
    });
  }
};

/**
 * Links a bar's list and accessory, as they're added and removed (in any
 * order).
 */
const createAccessoryLink = () => {
  let list: HTMLElement | null = null;
  let accessory: HTMLElement | null = null;

  const sync = () => {
    if (!list) return;
    if (!accessory) {
      accessories.delete(list);
      delete list.dataset.accessoryAbove;
      return;
    }

    accessories.set(list, accessory);
    placeAccessory(list);
  };

  return {
    setAccessory: (element: HTMLElement | null) => {
      accessory = element;
      sync();
    },
    setList: (element: HTMLElement | null) => {
      if (list) accessories.delete(list);
      list = element;
      sync();
    },
  };
};

/** The bar's anchor name (unique per bar), for its accessory (internal). */
type RootState = Partial<ReturnType<typeof createAccessoryLink>> & {
  anchor?: string;
};

const RootContext = createContext<RootState>({});

/**
 * Base UI's `Tabs.Root`, also providing the anchor its `TabBar.Accessory`
 * is positioned at (the `TabBar.List`).
 */
const Root = forwardRef<HTMLDivElement, TabBarRootProps>(
  ({ className, ...props }, ref) => {
    const id = useId();
    const [link] = useState(createAccessoryLink);
    const context = useMemo(
      () => ({
        ...link,
        anchor: `--uikit-tab-bar-${id.replaceAll(/[^\w-]/gu, '')}`,
      }),
      [id, link],
    );

    return (
      <RootContext.Provider value={context}>
        <BaseTabs.Root
          ref={ref}
          {...props}
          className={cn('uikit-tab-bar-root', className)}
        />
      </RootContext.Provider>
    );
  },
);

const ListContext = createContext<ListState>({
  isCollapsed: false,
  collapsedPosition: 'inline-start',
  markedGroups: 0,
});

/**
 * The tab bar, containing `TabBar.Group`s. Renders the glass lens shown
 * while a tab is pressed.
 */
const List = forwardRef<HTMLDivElement, Omit<TabBarListProps, 'ref'>>(
  (
    {
      className,
      children,
      collapsed = false,
      collapsedContent,
      collapsedPosition = 'inline-start',
      context: glassContext = 'auto',
      onClickCapture,
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onTouchMove,
      size = 'compact',
      style,
      ...props
    },
    ref,
  ) => {
    const listRef = useForwardedRef(ref);
    const root = useContext(RootContext);

    // For its accessory (see `Accessory`).
    const { setList } = root;
    useLayoutEffect(() => {
      setList?.(listRef.current);
      return () => setList?.(null);
    }, [listRef, setList]);
    const expandedWidthRef = useRef<number | undefined>(undefined);
    const resizingRef = useRef(collapsed);
    const wasCollapsedRef = useRef(collapsed);
    // Expanding (from collapsed, until settled): set while rendering, so
    // the transitions start with its easing (see `StyledList`).
    const [isExpanding, setIsExpanding] = useState(false);
    // Wider than its groups (expanded): the space between them as a length
    // (see `freeSpace`), so it transitions as the bar collapses.
    const [isWide, setIsWide] = useState(false);
    const freeRef = useRef(0);
    const [isRenderedCollapsed, setIsRenderedCollapsed] = useState(collapsed);
    if (collapsed !== isRenderedCollapsed) {
      setIsRenderedCollapsed(collapsed);
      setIsExpanding(!collapsed);
    }

    // The width while expanded, kept while collapsed (and until it has
    // expanded again), so the bar doesn't change size.
    useLayoutEffect(() => {
      const { current: list } = listRef;
      if (!list) return undefined;

      const observer = new ResizeObserver(() => {
        placeAccessory(list);
        if (resizingRef.current) return;
        expandedWidthRef.current = list.getBoundingClientRect().width;
        freeRef.current = measureFreeSpace(list);
        setIsWide(freeRef.current > 0.5);
      });
      observer.observe(list);

      return () => observer.disconnect();
    }, [listRef]);

    useLayoutEffect(() => {
      const { current: list } = listRef;
      if (!list) return undefined;

      const wasCollapsed = wasCollapsedRef.current;
      wasCollapsedRef.current = collapsed;
      morphAccessory(list, collapsed);

      // While collapsing or expanding, the selections follow their active
      // tabs in every frame (resize observers lag a frame behind, and miss
      // tabs that only move), which their groups keep in view.
      let frame: number | undefined;
      const follow = () => {
        for (const group of list.querySelectorAll(':scope > div')) {
          if (!(group instanceof HTMLElement)) continue;

          const active = tabsOf(group).find((tab) => isActive(tab));
          if (active) reveal(active, 'instant');
          updateSelection(group, { instant: true });
        }
        placeAccessory(list);
        frame = requestAnimationFrame(follow);
      };
      const stopFollowing = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        frame = undefined;
      };

      // While expanding, the groups grow from the collapsed tabs' positions
      // until they fill the bar, their labels clipped meanwhile. Set from
      // collapsing on, so they're in place as soon as the collapsed styles
      // go: layout read in between (e.g. by Base UI's indicator) would start
      // transitions from the expanded styles (or not at all, from `auto`).
      const holdCollapsedLayout = () => {
        list.style.setProperty('--uikit-tab-bar-collapsed-layout', '1');
        list.style.setProperty('--uikit-tab-bar-group-margin', '0');
        list.style.setProperty('--uikit-tab-bar-label-overflow', 'clip');
        list.style.setProperty('--uikit-tab-bar-label-min-width', '0');
      };

      if (collapsed) {
        resizingRef.current = true;
        list.style.removeProperty('--uikit-tab-bar-spacer-grow');
        if (expandedWidthRef.current !== undefined) {
          list.style.minWidth = `${expandedWidthRef.current}px`;
        }
        holdCollapsedLayout();
        // Wider than its groups: the space between them shrinks from its
        // length (a frame later: from it, not from auto).
        let shrink: number | undefined;
        if (Object.hasOwn(list.dataset, 'wide')) {
          list.style.setProperty(
            '--uikit-tab-bar-group-margin',
            `${String(freeRef.current)}px`,
          );
          shrink = requestAnimationFrame(() =>
            list.style.setProperty('--uikit-tab-bar-group-margin', '0'),
          );
        }

        follow();
        const cancel = afterTransitions(list, stopFollowing);

        return () => {
          if (shrink !== undefined) cancelAnimationFrame(shrink);
          cancel();
          stopFollowing();
        };
      }

      const settle = () => {
        resizingRef.current = false;
        list.style.removeProperty('min-width');
        list.style.removeProperty('--uikit-tab-bar-collapsed-layout');
        list.style.removeProperty('--uikit-tab-bar-group-margin');
        list.style.removeProperty('--uikit-tab-bar-label-overflow');
        list.style.removeProperty('--uikit-tab-bar-label-min-width');
        list.style.removeProperty('--uikit-tab-bar-spacer-grow');
        expandedWidthRef.current = list.getBoundingClientRect().width;
        placeAccessory(list);
        setIsExpanding(false);
        freeRef.current = measureFreeSpace(list);
        setIsWide(freeRef.current > 0.5);
      };

      if (!wasCollapsed) {
        settle();
        return undefined;
      }

      holdCollapsedLayout();
      // Wider than its groups: the space between them grows back, the
      // spacers shrink, all in step (the groups' order still held).
      if (Object.hasOwn(list.dataset, 'wide')) {
        list.style.setProperty(
          '--uikit-tab-bar-group-margin',
          `${String(freeRef.current)}px`,
        );
        list.style.setProperty('--uikit-tab-bar-spacer-grow', '0');
      }

      follow();
      const cancel = afterTransitions(list, () => {
        stopFollowing();
        settle();
      });

      return () => {
        cancel();
        stopFollowing();
      };
    }, [collapsed, listRef]);

    // The accessory follows the groups while any of their transitions run
    // (e.g. groups marked to remain while collapsed).
    useLayoutEffect(() => {
      const { current: list } = listRef;
      if (!list) return undefined;

      let frame: number | undefined;
      let cancel: (() => void) | undefined;
      const stop = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        frame = undefined;
        cancel?.();
        cancel = undefined;
      };

      const onTransitionRun = () => {
        if (frame !== undefined || !accessories.has(list)) return;

        const step = () => {
          placeAccessory(list);
          frame = requestAnimationFrame(step);
        };
        step();
        cancel = afterTransitions(list, () => {
          stop();
          placeAccessory(list);
        });
      };
      list.addEventListener('transitionrun', onTransitionRun);

      return () => {
        list.removeEventListener('transitionrun', onTransitionRun);
        stop();
      };
    }, [listRef]);

    // The pointer of the lens, so it follows the tabs under it while a
    // group scrolls.
    const dragRef = useRef<
      { clientX: number; state: { tab?: HTMLElement } } | undefined
    >(undefined);
    const stopScrollingRef = useRef<(() => void) | undefined>(undefined);
    // A press releases on its tab by clicking it (see `end`); the browser's
    // own click that may follow (WebKit: on the tab, despite the capture)
    // would reach the tab and its group a second time (e.g. collapsing the
    // bar its first click expanded).
    const pressClickedRef = useRef(false);

    // A group too narrow for its tabs scrolls (by wheel, or by touches on
    // the lens, which scroll it while near its ends). Scroll events don't
    // bubble, but are captured.
    useLayoutEffect(() => {
      const { current: list } = listRef;
      if (!list) return undefined;

      const onScroll = () => {
        const { current: drag } = dragRef;
        if (drag) drag.state.tab = press(list, drag.clientX);
      };
      list.addEventListener('scroll', onScroll, {
        capture: true,
        passive: true,
      });

      return () => {
        list.removeEventListener('scroll', onScroll, { capture: true });
        stopScrollingRef.current?.();
      };
    }, [listRef]);

    const [markedGroups, markGroup] = useMarks();
    const context = useMemo(
      () => ({
        collapsedPosition,
        isCollapsed: collapsed,
        markGroup,
        markedGroups,
      }),
      [collapsed, collapsedPosition, markGroup, markedGroups],
    );

    const handlers = usePointerDrag<
      HTMLDivElement,
      { clientX: number; lens: DelayedLens; tab?: HTMLElement }
    >(
      {
        end: (list, state, isCancelled) => {
          state.lens.cancel();
          dragRef.current = undefined;
          stopScrollingRef.current?.();

          if (isCancelled) {
            release(list);
            return;
          }

          release(list, state.tab);
          if (!state.tab) return;

          // Also the active tab: the click reaches it and its group (e.g. to
          // expand a collapsed bar), the press having captured the pointer.
          state.tab.click();
          pressClickedRef.current = true;
          setTimeout(() => {
            pressClickedRef.current = false;
          }, 300);
          reveal(state.tab);
        },
        move: (list, state, event) => {
          state.clientX = event.clientX;
          state.lens.move(event);
          if (!state.lens.isShown()) return;

          state.tab = press(list, event.clientX);
          dragRef.current = { clientX: event.clientX, state };
        },
        start: (list, event) => {
          if (!(event.target instanceof Element)) return undefined;
          const tab = event.target.closest('[role="tab"]');
          if (!(tab instanceof HTMLElement)) return undefined;

          // The press (the lens, its group grown) a moment later: a quick
          // tap only selects its tab (see `delayLens`).
          const state: {
            clientX: number;
            lens: DelayedLens;
            tab?: HTMLElement;
          } = {
            clientX: event.clientX,
            lens: delayLens(event, () => {
              // Place (and size) the lens at the pointer without a
              // transition, then let it follow without delay; only opacity
              // and scale animate.
              list.style.setProperty(
                '--uikit-tab-bar-lens-move-duration',
                '0s',
              );
              list.style.setProperty(
                '--uikit-tab-bar-lens-size-duration',
                '0s',
              );
              state.tab = press(list, state.clientX);
              list.getBoundingClientRect();
              list.style.removeProperty('--uikit-tab-bar-lens-size-duration');
              list.style.setProperty('--uikit-tab-bar-pressed', '1');

              dragRef.current = { clientX: state.clientX, state };
              stopScrollingRef.current = autoScroll(dragRef);
            }),
            tab,
          };
          return state;
        },
      },
      {
        onLostPointerCapture,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onTouchMove,
      },
    );

    return (
      <ListContext.Provider value={context}>
        <BaseTabs.List
          ref={listRef}
          data-collapsed={collapsed ? '' : undefined}
          data-collapsed-content={collapsed ? collapsedContent : undefined}
          data-expanding={isExpanding ? '' : undefined}
          data-glass-context={glassContext}
          data-size={size}
          data-spaced={markedGroups > 1 ? '' : undefined}
          data-wide={isWide ? '' : undefined}
          style={withStyle({ 'anchor-name': root.anchor }, style)}
          {...props}
          {...handlers}
          className={cn('uikit-tab-bar-list', className)}
          // Its drags don't swipe a sheet (or drawer) away.
          data-base-ui-swipe-ignore=""
          data-tab-bar-part="list"
          onClickCapture={(event: MouseEvent<HTMLDivElement>) => {
            (
              onClickCapture as
                ((event: MouseEvent<HTMLDivElement>) => void) | undefined
            )?.(event);
            if (!event.isTrusted || !pressClickedRef.current) return;
            pressClickedRef.current = false;
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          {children}
          {/* The lens: positioned by its center, so it stays under the
              pointer while its size transitions between tab shapes, but
              within its bounds at its current size: its size and position
              transition as registered lengths (see `styles.css`), so the
              clamp follows. Growing beyond the bar, it would overflow its
              container. */}
          <span
            aria-hidden="true"
            className="uikit-tab-bar-lens"
            data-tab-bar-part="lens"
          />
        </BaseTabs.List>
      </ListContext.Provider>
    );
  },
);

const GroupContext = createContext<GroupState>({
  isAway: false,
  markedTabs: 0,
});

/**
 * A glass capsule of tabs, to be rendered inside `TabBar.List`. Its
 * `TabBar.Indicator` has to precede its tabs.
 */
const Group = forwardRef<HTMLDivElement, TabBarGroupProps>(
  (
    {
      className,
      children,
      collapsedContent,
      collapsedPosition,
      shape,
      visibleWhenCollapsed,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const list = useContext(ListContext);
    const { markGroup } = list;
    const [markedTabs, markTab] = useMarks();

    // Counted, for the layout of several remaining groups.
    useLayoutEffect(
      () => (visibleWhenCollapsed ? markGroup?.() : undefined),
      [markGroup, visibleWhenCollapsed],
    );

    let collapsedVisibility: CollapsedVisibility | undefined;
    if (list.isCollapsed) {
      collapsedVisibility = visibleWhenCollapsed ? 'shown' : 'away';
    }
    const isAway = collapsedVisibility === 'away';

    useLayoutEffect(() => {
      const { current: group } = ref;
      if (!group) return undefined;

      // Only the group and its tabs: the selection resizes itself while
      // following the lens, which must not snap it back to the active tab.
      // It follows changes of their size right away (e.g. collapsing).
      const resizeObserver = new ResizeObserver(() => {
        updateOverflow(group);
        updateSelection(group, { instant: true });
        if (group.parentElement) placeAccessory(group.parentElement);
      });
      const observe = () => {
        resizeObserver.observe(group);
        for (const tab of tabsOf(group)) resizeObserver.observe(tab);
      };

      const update = (behavior: ScrollBehavior) => {
        observe();
        updateOverflow(group);
        const active = tabsOf(group).find((tab) => isActive(tab));
        if (active) reveal(active, behavior);
        updateSelection(group);
      };
      update('instant');

      const mutationObserver = new MutationObserver(() => update('smooth'));
      mutationObserver.observe(group, {
        attributeFilter: ['data-active'],
        childList: true,
        subtree: true,
      });

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, [ref]);

    const context = useMemo(
      () => ({ isAway, markTab, markedTabs, shape }),
      [isAway, markTab, markedTabs, shape],
    );

    return (
      <GroupContext.Provider value={context}>
        {/* Neighboring tabs overlap in the compact size. Groups of
           several tabs share the bar's width by their own (single tabs, e.g.
           search, keep theirs): too narrow, their tabs scroll within (see
           `StyledTabs`), they keep their shape. A grid track up to their width
           lets them (and the bar) shrink in intrinsically sized containers too:
           a scroll container still counts its content as its minimum width, the
           track doesn't. */}
        <div
          ref={ref}
          data-collapsed-visibility={collapsedVisibility}
          data-spaced={list.markedGroups > 1 ? '' : undefined}
          data-collapsed-content={
            list.isCollapsed ? collapsedContent : undefined
          }
          data-selection-shown={
            list.isCollapsed &&
            !isAway &&
            (markedTabs > 1 || list.markedGroups > 1)
              ? ''
              : undefined
          }
          {...props}
          className={cn('uikit-tab-bar-group', className)}
          data-tab-bar-part="group"
          style={withStyle(
            {
              '--uikit-tab-bar-collapsed-order': String(
                collapsedOrder[collapsedPosition ?? list.collapsedPosition],
              ),
            },
            props.style,
          )}
        >
          <GlassBackground />
          {/* A group's tabs (and selection), filling it. Too narrow for them,
             it scrolls, clipped to the group's shape; otherwise it doesn't
             clip, so a pressed group's content grows beyond (see `pressGroup`).
             Touches drag the lens, not the tabs: a scroll container's own
             `touch-action` decides for the touches within (the list's stops at
             it); the lens scrolls them near the group's ends (see
             `autoScroll`). */}
          <div
            className="uikit-tab-bar-tabs"
            data-tab-bar-part="tabs"
          >
            {children}
          </div>
        </div>
      </GroupContext.Provider>
    );
  },
);

/**
 * The selection, to be rendered first inside each `TabBar.Group`, which
 * positions it on its active tab; hidden while pressed, when the list's lens
 * takes over (Framework7 `toolbar-ios.less`, `.tab-link-highlight`).
 */
const Indicator = forwardRef<
  HTMLElement,
  Omit<ComponentProps<typeof BaseTabs.Indicator>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    className={cn('uikit-tab-bar-indicator', className)}
    data-tab-bar-part="indicator"
    {...props}
  />
));

const Tab = forwardRef<HTMLElement, Omit<TabBarTabProps, 'ref'>>(
  (tabProps, ref) => {
    const {
      className,
      collapsedContent,
      shape,
      visibleWhenCollapsed,
      ...props
    } = useSecondaryClick(tabProps);
    const group = useContext(GroupContext);
    const { markTab } = group;
    const { isCollapsed } = useContext(ListContext);

    useLayoutEffect(
      () => (visibleWhenCollapsed ? markTab?.() : undefined),
      [markTab, visibleWhenCollapsed],
    );

    // Only while collapsed, in a remaining group.
    let collapsedVisibility: CollapsedVisibility | undefined;
    if (isCollapsed && !group.isAway) {
      collapsedVisibility = visibleWhenCollapsed ? 'shown' : 'away';
    }

    return (
      <BaseTabs.Tab
        ref={ref}
        {...props}
        className={cn('uikit-tab-bar-tab', className)}
        data-collapsed-content={isCollapsed ? collapsedContent : undefined}
        data-collapsed-visibility={collapsedVisibility}
        data-shape={shape ?? group.shape}
        data-tab-bar-part="tab"
      />
    );
  },
);

const Icon = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    // Symbol of a tab (e.g. a `Symbol`, with its badge),
    // sized by the list's size.
    <span
      ref={ref}
      data-tab-bar-part="icon"
      {...props}
      className={cn('uikit-tab-bar-icon', className)}
    />
  ),
);

const Label = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  ({ className, children, ...props }, ref) => (
    // Label of a tab, sized by the list's size. A hidden copy in the selected
    // style, in the same grid cell, reserves its width, so the tab doesn't
    // change width when selected. Its text centered vertically, also while the
    // tab's padding animates (e.g. collapsing). Collapsing into a circle, it
    // shrinks away (see collapsedContents), so the symbol moves smoothly. Not
    // narrower than its text (a group scrolls instead), but while the bar
    // collapses or expands.
    <span
      ref={ref}
      data-tab-bar-part="label"
      {...props}
      className={cn('uikit-tab-bar-label', className)}
    >
      <span
        className="uikit-tab-bar-label-text"
        data-tab-bar-part="label-text"
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="uikit-tab-bar-label-reserve"
        data-tab-bar-part="label-reserve"
      >
        {children}
      </span>
    </span>
  ),
);

/**
 * A glass capsule of arbitrary content attached to the bar (e.g. a mini
 * player), to be rendered inside
 * `TabBar.Root`, after `TabBar.List`: above its groups, or, while the bar is
 * collapsed, between them. Positioned at the list, it doesn't take up space
 * in the layout.
 */
const Accessory = forwardRef<HTMLDivElement, TabBarAccessoryProps>(
  (
    {
      className,
      children,
      context = 'auto',
      style,
      visibleIn = 'both',
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const { anchor, setAccessory } = useContext(RootContext);

    // Placed by its list, as its groups change, and when added (or shown in
    // other states).
    useLayoutEffect(() => {
      setAccessory?.(ref.current);
      return () => setAccessory?.(null);
    }, [ref, setAccessory, visibleIn]);

    return (
      <div
        ref={ref}
        data-glass-context={context}
        data-tab-bar-part="accessory"
        data-visible-in={visibleIn}
        {...props}
        className={cn('uikit-tab-bar-accessory', className)}
        style={withStyle(
          {
            '--uikit-tab-bar-accessory-visible-in': visibleIn,
            'position-anchor': anchor,
          },
          style,
        )}
      >
        <GlassBackground />
        {/* Above its glass (see `GlassBackground`), clipped to the accessory,
           which its glass extends beyond, on one line (also while it's narrow,
           e.g. growing from nothing); fading with the glass (see `visibleIn`).
           */}
        <span
          className="uikit-tab-bar-accessory-content"
          data-tab-bar-part="accessory-content"
        >
          {children}
        </span>
      </div>
    );
  },
);

export const TabBar = {
  ...BaseTabs,
  Accessory,
  Root,
  List,
  Group,
  Indicator,
  Tab,
  Icon,
  Label,
};
