import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';

import {
  GlassBackground,
  GlassContext,
  glassContext,
  glassLensScale,
} from './glass.js';
import { css, fontWeight, useForwardedRef, usePointerDrag } from './utils.js';

// Source: Apple iOS 26 Figma (“Tab Bar - iPhone”, BG Context Dim/Bright),
// with the selected content color mapped to the app tint
// (`--color-ios-primary`, i.e. `systemBlue`); glass materials, vibrant content
// and selection colors are tokens in `styles.tsx`, used via `glass.tsx`. The selection's transition
// duration comes from Framework7 `components/toolbar/toolbar-ios.less`
// (`.tab-link-highlight`), disabled opacity from Framework7
// `less/mixins.less` (`.disabled()`).
//
// In the regular size, symbols and labels are in the Subheadline text style
// (selected labels: 17px, bold); the compact size's (17/28px, 10/12px) are
// in none.
//
// Deviations:
// - The list's `size` (UIKit size class) switches between the iPhone and the
//   iPad tab bar, for all its groups; tabs hold a symbol, a label or both in
//   either:
//   - `compact` (Figma “Tab Bar - iPhone”): content stacked, 54px high, with
//     a preferred (shrinkable, not fixed) width of 102px, down to a minimum
//     of 54px (Figma: 102px, or filling the bar with 4+ tabs); `width` is
//     used as `flex-basis` is ignored for the group's intrinsic size. A single
//     tab next to the search tab is 102px (Figma: 110px). Neighbors overlap.
//   - `regular` (Figma “Tab Bar - iPad”): content in a row, 36px high,
//     hugging it (Figma: stretching to the bar's width), with larger labels
//     that grow when selected and smaller symbols; white selected content on
//     dim glass (iPhone: the tint). The selection is the same token as the
//     iPhone's (Figma: #EDEDED for symbol tabs, rgb(118 118 128 / 12%) for
//     text tabs in the bright context, one or two levels apart).
//   Symbol-only tabs are circles in the compact size (Figma: iPhone search)
//   and capsules hugging the symbol in the regular size (Figma: iPad sidebar
//   and search, 50×36), but circles alone in a group; others capsules; a
//   tab's (or its group's) `shape` overrides this (`circle`: a circle in both
//   sizes). Labels reserve their selected width, so selecting a tab doesn't
//   shift the tabs.
// - The bar's inline padding is always 32px (Figma: 28px with up to 3 tabs).
// - Nothing isolates blending (Figma: each group), as that would cut the
//   glass blur off from the content behind the bar; glass, indicator and tabs
//   stack by document order instead.
// - Each group positions its own selection (the indicator) on its active tab.
//   When the active tab leaves a group, its selection fades out in place; a
//   group gaining the active tab fades its selection in, so the selection
//   never travels between groups.
// - Figma's fill blend modes are applied as `mix-blend-mode` of separate
//   layers (blending with the blurred backdrop), each carrying the fill's
//   opacity.
// - The blur layer's own `filter: blur(10px)` and masking are omitted.
// - Figma's glass effect (a layer effect, missing from the CSS export) is
//   emulated as in Framework7 `less/mixins.less` (`.ios-glass()`: backdrop
//   `saturate(180%)` and `--f7-glass-shadow`, see `styles.tsx`).
// - Pressing a tab turns the selection into a glass lens that follows the
//   pointer and activates the closest tab on release, as in Framework7
//   `components/toolbar/tabbar-highlight.js` and `toolbar-ios.less`
//   (`.tab-link-highlight-pressed`); unlike Framework7 for all pointer types,
//   not only touch. The lens belongs to the list, so it moves (and can be
//   dragged) between groups, and is drawn above the tabs, as it has to be
//   above the groups' glass. While dragging, it follows the pointer without
//   a transition (Framework7: 300ms ease-out).
// - The browser's default focus ring is kept.

type Size = 'compact' | 'regular';

// Metrics of tabs and their content per size, inherited from the list.
const sizeVars: Record<Size, string> = {
  compact: css`
    --styled-tabbar-tab-height: 54px;
    --styled-tabbar-tab-width: 102px;
    --styled-tabbar-tab-direction: column;
    --styled-tabbar-tab-padding: 6px 8px 7px;
    --styled-tabbar-tab-gap: 1px;
    --styled-tabbar-overlap-factor: 1;
    --styled-tabbar-symbol-padding: 6px 8px 7px;
    --styled-tabbar-symbol-aspect-ratio: 1;
    --styled-tabbar-circle-padding: 6px 8px 7px;
    --styled-tabbar-pressed-group-scale: 1.05;
    --styled-tabbar-collapsed-tab-height: 40px;
    --styled-tabbar-collapsed-inset: 7px;
    --styled-tabbar-icon-size: 17px;
    --styled-tabbar-icon-line-height: 28px;
    --styled-tabbar-icon-letter-spacing: normal;
    --styled-tabbar-icon-weight: 400;
    --styled-tabbar-icon-active-weight: 590;
    --styled-tabbar-label-size: 10px;
    --styled-tabbar-label-active-size: 10px;
    --styled-tabbar-label-line-height: 12px;
    --styled-tabbar-label-letter-spacing: normal;
  `,
  regular: css`
    --styled-tabbar-tab-height: 36px;
    --styled-tabbar-tab-width: auto;
    --styled-tabbar-tab-direction: row;
    --styled-tabbar-tab-padding: 8px 18px;
    --styled-tabbar-tab-gap: 10px;
    --styled-tabbar-overlap-factor: 0;
    --styled-tabbar-symbol-padding: 8px 16px;
    --styled-tabbar-symbol-aspect-ratio: auto;
    --styled-tabbar-circle-padding: 8px;
    --styled-tabbar-pressed-group-scale: 1.065;
    --styled-tabbar-collapsed-tab-height: 36px;
    --styled-tabbar-collapsed-inset: 0px;
    --styled-tabbar-icon-size: var(--font-ios-subheadline-size);
    --styled-tabbar-icon-line-height: var(--font-ios-subheadline-line-height);
    --styled-tabbar-icon-letter-spacing: var(--font-ios-subheadline-tracking);
    --styled-tabbar-icon-weight: 510;
    --styled-tabbar-icon-active-weight: 700;
    --styled-tabbar-label-size: var(--font-ios-subheadline-size);
    --styled-tabbar-label-active-size: 17px;
    --styled-tabbar-label-line-height: var(--font-ios-subheadline-line-height);
    --styled-tabbar-label-letter-spacing: var(--font-ios-subheadline-tracking);
  `,
};

// Selected content in the regular size: the tint, or white on dim glass.
const regularActiveColor = (context?: GlassContext) => {
  const bright = css`
    --styled-tabbar-active-color: var(--color-ios-primary);
  `;
  const dim = css`
    --styled-tabbar-active-color: #fff;
  `;

  if (context) return context === 'dim' ? dim : bright;

  return css`
    ${bright}

    @media (prefers-color-scheme: dark) {
      ${dim}
    }
  `;
};

// Marks a tab's symbol and label, so a tab can lay out by its content.
const part = 'data-tab-bar-part';

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

// Groups that had an active tab when their selection was last positioned.
const hadActiveTab = new WeakMap<HTMLElement, boolean>();

const setSelection = (
  group: HTMLElement,
  rect: DOMRect,
  { instant = false, left = rect.left } = {},
) => {
  const groupRect = group.getBoundingClientRect();

  if (instant) {
    group.style.setProperty('--styled-tabbar-selection-duration', '0s');
  }

  setProperties(group, {
    '--styled-tabbar-selection-height': `${rect.height}px`,
    '--styled-tabbar-selection-left': `${left - groupRect.left}px`,
    '--styled-tabbar-selection-top': `${rect.top - groupRect.top}px`,
    '--styled-tabbar-selection-width': `${rect.width}px`,
  });

  if (instant) {
    group.getBoundingClientRect();
    group.style.removeProperty('--styled-tabbar-selection-duration');
  }
};

// Positions a group's selection on its active tab and shows it; without an
// active tab, the selection fades out in place. A selection appearing in a
// group is placed instantly, so it does not travel in from elsewhere.
const updateSelection = (group: HTMLElement, { instant = false } = {}) => {
  const tab = [...group.children]
    .filter(isTab)
    .find((child) => isActive(child));
  const hadActive = hadActiveTab.get(group) ?? false;
  hadActiveTab.set(group, Boolean(tab));

  // State for the collapsed bar's styles (see `collapsedList`).
  group.dataset.hasActive = String(Boolean(tab));
  group.style.setProperty('--styled-tabbar-selection-opacity', tab ? '1' : '0');
  if (!tab) return;

  group.style.removeProperty('--styled-tabbar-pressed');

  setSelection(group, tab.getBoundingClientRect(), {
    instant: instant || !hadActive,
  });
};

// Collapsed (measured on iOS 26, iPhone): the bar is 48pt high instead of
// 62pt around the same center line, 7pt further in from the edges. Only the
// group of the active tab (or, without one, the first) remains, with only
// that tab (or its first), at `collapsedPosition`; the other tabs and groups
// collapse away. The tab shows `collapsedContent`, in the content color, its
// selection faded out: its symbol in a 40pt circle, or its label (and
// symbol, side by side, in the regular size's metrics) in a capsule. The bar
// keeps its size (see `List`). The regular size (iPad doesn't minimize its
// tab bar) keeps its height.

export type CollapsedContent = 'label' | 'symbol' | 'symbolAndLabel';

export type CollapsedPosition = 'center' | 'end' | 'start';

const collapsedJustify: Record<CollapsedPosition, string> = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
};

// What a collapsed tab shows, as custom properties used by the list's styles
// (`collapsedList`): set on the list (its `collapsedContent`), or on a tab
// (its own, which wins). Symbols in a capsule take the regular size's
// metrics; `initial` leaves a tab's own.
const collapsedContents: Record<CollapsedContent, string> = {
  label: css`
    --styled-tabbar-collapsed-width: auto;
    --styled-tabbar-collapsed-padding: 0 18px;
    --styled-tabbar-collapsed-direction: row;
    --styled-tabbar-collapsed-gap: 10px;
    --styled-tabbar-collapsed-label-extent: auto;
    --styled-tabbar-collapsed-label-opacity: 1;
    --styled-tabbar-collapsed-symbol: none;
    --styled-tabbar-collapsed-icon-size: initial;
    --styled-tabbar-collapsed-icon-line-height: initial;
    --styled-tabbar-collapsed-icon-letter-spacing: initial;
  `,
  symbol: css`
    --styled-tabbar-collapsed-width: var(--styled-tabbar-tab-height);
    --styled-tabbar-collapsed-padding: 0;
    --styled-tabbar-collapsed-direction: var(--styled-tabbar-tab-direction);
    --styled-tabbar-collapsed-gap: 0px;
    --styled-tabbar-collapsed-label-extent: 0;
    --styled-tabbar-collapsed-label-opacity: 0;
    --styled-tabbar-collapsed-symbol: flex;
    --styled-tabbar-collapsed-icon-size: initial;
    --styled-tabbar-collapsed-icon-line-height: initial;
    --styled-tabbar-collapsed-icon-letter-spacing: initial;
  `,
  symbolAndLabel: css`
    --styled-tabbar-collapsed-width: auto;
    --styled-tabbar-collapsed-padding: 0 18px;
    --styled-tabbar-collapsed-direction: row;
    --styled-tabbar-collapsed-gap: 10px;
    --styled-tabbar-collapsed-label-extent: auto;
    --styled-tabbar-collapsed-label-opacity: 1;
    --styled-tabbar-collapsed-symbol: flex;
    --styled-tabbar-collapsed-icon-size: var(--font-ios-subheadline-size);
    --styled-tabbar-collapsed-icon-line-height: var(
      --font-ios-subheadline-line-height
    );
    --styled-tabbar-collapsed-icon-letter-spacing: var(
      --font-ios-subheadline-tracking
    );
  `,
};

// A hidden tab: no size, so neither its width nor its aspect ratio (circles)
// takes up space while it collapses.
const collapsedAway = css`
  width: 0;
  min-width: 0;
  padding: 0;
  margin: 0;
  aspect-ratio: auto;
`;

const collapsedList = ({
  content,
  position = 'start',
}: {
  content?: CollapsedContent;
  position?: CollapsedPosition;
}) => css`
  --styled-tabbar-tab-height: var(--styled-tabbar-collapsed-tab-height);
  --styled-tabbar-selection-shown: 0;
  --styled-tabbar-group-margin: 0;
  --styled-tabbar-label-overflow: clip;
  ${content ? collapsedContents[content] : ''}

  justify-content: ${collapsedJustify[position]};
  padding: calc(16px + var(--styled-tabbar-collapsed-inset))
    calc(32px + var(--styled-tabbar-collapsed-inset))
    calc(32px + var(--styled-tabbar-collapsed-inset));
  gap: 0;

  && > div > [role='tab'] {
    --styled-tabbar-label-size: var(--font-ios-subheadline-size);
    --styled-tabbar-label-active-size: var(--font-ios-subheadline-size);
    --styled-tabbar-label-line-height: var(--font-ios-subheadline-line-height);
    --styled-tabbar-label-letter-spacing: var(--font-ios-subheadline-tracking);

    width: var(--styled-tabbar-collapsed-width);
    flex-direction: var(--styled-tabbar-collapsed-direction);
    padding: var(--styled-tabbar-collapsed-padding);
    margin: 0;
    aspect-ratio: auto;
    color: var(--styled-glass-content);
    gap: var(--styled-tabbar-collapsed-gap);
  }

  ${
    content
      ? ''
      : css`
          /* By default, its label, or, with a symbol, its symbol (goober can't
           nest :not(:has(…))) */
          && > div > [role='tab'] {
            ${collapsedContents.label}
          }

          && > div > [role='tab']:has(> [${part}='icon']) {
            ${collapsedContents.symbol}
          }
        `
  }

  && > div > [role='tab'] > [${part}='icon'] {
    display: var(--styled-tabbar-collapsed-symbol);
    mix-blend-mode: var(--styled-glass-content-blend);
  }

  && > div > [role='tab'] > [${part}='label'] {
    width: var(--styled-tabbar-collapsed-label-extent);
    height: var(--styled-tabbar-collapsed-label-extent);
    mix-blend-mode: var(--styled-glass-content-blend);
    opacity: var(--styled-tabbar-collapsed-label-opacity);
  }

  && > div > [role='tab'] > [${part}='label'] > * {
    ${fontWeight(510)}
  }

  /* Groups without the active tab collapse away. */
  && > div[data-has-active='false'] {
    min-width: 0;
    opacity: 0;
    pointer-events: none;
    visibility: hidden;

    & > [role='tab'] {
      ${collapsedAway}
    }
  }

  && > div[data-has-active='true'] > [role='tab']:not([data-active]),
  && > div[data-has-active='false'] > [role='tab'] ~ [role='tab'] {
    ${collapsedAway}
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  /* Without an active tab, the first group remains. */
  &&:not(:has(> div[data-has-active='true'])) {
    & > div:first-of-type {
      min-width: var(--styled-tabbar-tab-height);
      opacity: 1;
      pointer-events: auto;
      visibility: visible;

      & > [role='tab']:first-of-type {
        width: var(--styled-tabbar-collapsed-width);
        min-width: var(--styled-tabbar-tab-height);
        padding: var(--styled-tabbar-collapsed-padding);
        margin: 0;
      }
    }
  }
`;

// eslint-disable-next-line prettier/prettier
const StyledList = styled<typeof BaseTabs.List, TabBarListProps>(BaseTabs.List, forwardRef)`
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 16px 32px 32px;
  gap: 16px;
  interpolate-size: allow-keywords;
  touch-action: none;
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: padding, gap;

  ${({ context }) => glassContext(context)}
  ${({ size = 'compact' }) => sizeVars[size]}
  ${({ context, size }) =>
    size === 'regular' ? regularActiveColor(context) : undefined}
  ${({ collapsed, collapsedContent, collapsedPosition }) =>
    collapsed
      ? collapsedList({
          content: collapsedContent,
          position: collapsedPosition,
        })
      : undefined}
`;

// Positioned by its center, so it stays under the pointer while its size
// transitions between tab shapes.
const Lens = styled('span')`
  position: absolute;
  top: 0;
  left: 0;
  width: var(--styled-tabbar-lens-width, 0);
  height: var(--styled-tabbar-lens-height, 0);
  border-radius: 100px;
  background-color: var(--styled-glass-lens);
  box-shadow: var(--styled-glass-lens-shadow);
  opacity: var(--styled-tabbar-pressed, 0);
  pointer-events: none;
  scale: ${glassLensScale('var(--styled-tabbar-pressed, 0)')};
  transition-duration:
    var(--styled-tabbar-lens-move-duration, var(--glass-ios-lens-duration)),
    var(--styled-tabbar-lens-size-duration, var(--glass-ios-lens-duration)),
    var(--styled-tabbar-lens-size-duration, var(--glass-ios-lens-duration)),
    var(--glass-ios-lens-duration), var(--glass-ios-lens-duration);
  transition-property: translate, width, height, opacity, scale;
  transition-timing-function: ease-out;
  translate: calc(var(--styled-tabbar-lens-x, 0px) - 50%)
    calc(var(--styled-tabbar-lens-y, 0px) - 50%);
`;

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
      .map(({ parentElement }) => parentElement)
      .filter((group): group is HTMLElement => group !== null),
  );

const setLens = (list: HTMLElement, rect: DOMRect, centerX: number) => {
  const listRect = list.getBoundingClientRect();

  setProperties(list, {
    '--styled-tabbar-lens-height': `${rect.height}px`,
    '--styled-tabbar-lens-width': `${rect.width}px`,
    '--styled-tabbar-lens-x': `${centerX - listRect.left - list.clientLeft + list.scrollLeft}px`,
    '--styled-tabbar-lens-y': `${rect.top + rect.height / 2 - listRect.top - list.clientTop + list.scrollTop}px`,
  });
};

// Grows the group under the lens (or, with `pressed` false, back): its
// glass layers scale around their (the group's) center by themselves; its
// tabs' symbols and labels scale around the group's center too, set as their
// transform origin. Scaling the group itself would isolate its layers'
// blending (rendering the glass gray).
const pressGroup = (group: HTMLElement, pressed: boolean) => {
  if (pressed === Object.hasOwn(group.dataset, 'pressed')) return;

  if (!pressed) {
    delete group.dataset.pressed;
    return;
  }

  const { height, left, top, width } = group.getBoundingClientRect();
  const content = group.querySelectorAll(
    `[${CSS.escape(part)}='icon'], [${CSS.escape(part)}='label']`,
  );

  for (const element of content) {
    if (!(element instanceof HTMLElement)) continue;

    const rect = element.getBoundingClientRect();
    element.style.transformOrigin = `${left + width / 2 - rect.left}px ${top + height / 2 - rect.top}px`;
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
      '--styled-tabbar-pressed-group-scale',
    ),
  );

  return {
    scale: Number.isFinite(scale) ? scale : 1,
    x: left + width / 2,
    y: top + height / 2,
  };
};

// Moves the lens to the pointer, clamped to the list's tabs, and returns the
// closest tab (Framework7 `tabbar-highlight.js`, `setHighlightOnTouch`). The
// (hidden) selection of the closest tab's group follows the lens, so it
// settles from there on release. The lens and the pointer are where the
// pressed group shows its (scaled) content.
const press = (list: HTMLElement, clientX: number) => {
  const tabs = getTabs(list);
  const rects = tabs.map((tab) => tab.getBoundingClientRect());

  // The pointer in the tabs' unscaled layout, as the group under it grows.
  const over = tabs[closest(rects, clientX)]?.parentElement;
  const overGrowth = over ? growth(over) : undefined;
  const x = overGrowth
    ? overGrowth.x + (clientX - overGrowth.x) / overGrowth.scale
    : clientX;

  const index = closest(rects, x);
  const tab = tabs[index];
  const rect = rects[index];
  if (!tab?.parentElement || !rect) return undefined;

  const centerX = Math.max(
    Math.min(...rects.map(({ left }) => left)) + rect.width / 2,
    Math.min(x, Math.max(...rects.map(({ right }) => right)) - rect.width / 2),
  );

  // The lens is on the tab as its grown group shows it.
  const { scale, x: originX, y: originY } = growth(tab.parentElement);
  setLens(
    list,
    new DOMRect(
      originX + (rect.left - originX) * scale,
      originY + (rect.top - originY) * scale,
      rect.width * scale,
      rect.height * scale,
    ),
    originX + (centerX - originX) * scale,
  );

  const { parentElement: pressedGroup } = tab;

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
  list.style.removeProperty('--styled-tabbar-lens-move-duration');
  list.style.removeProperty('--styled-tabbar-pressed');

  const groups = getGroups(list);
  for (const group of groups) pressGroup(group, false);

  if (!tab) {
    for (const group of groups) updateSelection(group);
    return;
  }

  const rect = tab.getBoundingClientRect();
  setLens(list, rect, rect.left + rect.width / 2);

  for (const group of groups) {
    const chosen = group === tab.parentElement;
    const hadActive = hadActiveTab.get(group) ?? false;
    hadActiveTab.set(group, chosen);
    group.style.setProperty(
      '--styled-tabbar-selection-opacity',
      chosen ? '1' : '0',
    );

    if (chosen) {
      // A group gaining the active tab only fades its selection in.
      setSelection(group, rect, { instant: !hadActive });
    } else {
      // Keep the selection hidden like while pressed, so it only fades out.
      group.style.setProperty('--styled-tabbar-pressed', '1');
    }
  }

  requestAnimationFrame(() => {
    for (const group of groups) updateSelection(group);
  });
};

/**
 * Calls `done` once the transitions of `element` and its descendants have
 * finished (also when slowed down, e.g. in the browser's developer tools, or
 * restarted), starting from the next frame, when they have begun. Returns a
 * function cancelling it.
 */
const afterTransitions = (element: HTMLElement, done: () => void) => {
  let cancelled = false;

  const check = () => {
    if (cancelled) return;

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
    cancelled = true;
  };
};

/** The list's state, for its tabs (internal). */
const ListContext = createContext<{ collapsed: boolean }>({
  collapsed: false,
});

export type TabBarListProps = BaseTabs.List.Props & {
  /**
   * Minimized (UIKit `tabBarMinimizeBehavior`): each group shows only its
   * active tab (or its first) as a symbol in a circle.
   */
  collapsed?: boolean;
  /**
   * What the collapsed bar's tab shows: its symbol in a circle, its label,
   * or both side by side in a capsule.
   * @default its symbol, or, without one, its label
   */
  collapsedContent?: CollapsedContent;
  /**
   * Where the collapsed bar's tab is, along the bar.
   * @default 'start'
   */
  collapsedPosition?: CollapsedPosition;
  /**
   * Brightness of the content behind the glass.
   * @default 'bright', or 'dim' in dark mode
   */
  context?: GlassContext;
  /**
   * UIKit size class: `compact` is the iPhone tab bar (content stacked),
   * `regular` the iPad tab bar (content in a row).
   * @default 'compact'
   */
  size?: Size;
};

/**
 * The tab bar, containing `TabBar.Group`s. Renders the glass lens shown
 * while a tab is pressed.
 */
const List = forwardRef<HTMLDivElement, TabBarListProps>(
  (
    {
      children,
      collapsed = false,
      collapsedPosition = 'start',
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const listRef = useForwardedRef(ref);
    const expandedWidthRef = useRef<number | undefined>(undefined);
    const resizingRef = useRef(collapsed);
    const wasCollapsedRef = useRef(collapsed);

    // The width while expanded, kept while collapsed (and until it has
    // expanded again), so the bar doesn't change size.
    useLayoutEffect(() => {
      const { current: list } = listRef;
      if (!list) return undefined;

      const observer = new ResizeObserver(() => {
        if (resizingRef.current) return;
        expandedWidthRef.current = list.getBoundingClientRect().width;
      });
      observer.observe(list);

      return () => observer.disconnect();
    }, [listRef]);

    useLayoutEffect(() => {
      const { current: list } = listRef;
      if (!list) return undefined;

      const wasCollapsed = wasCollapsedRef.current;
      wasCollapsedRef.current = collapsed;

      // While collapsing or expanding, the selections follow their active
      // tabs in every frame (resize observers lag a frame behind, and miss
      // tabs that only move).
      let frame: number | undefined;
      const follow = () => {
        for (const group of list.querySelectorAll(':scope > div')) {
          if (group instanceof HTMLElement) {
            updateSelection(group, { instant: true });
          }
        }
        frame = requestAnimationFrame(follow);
      };
      const stopFollowing = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        frame = undefined;
      };

      if (collapsed) {
        resizingRef.current = true;
        if (expandedWidthRef.current !== undefined) {
          list.style.minWidth = `${expandedWidthRef.current}px`;
        }

        follow();
        const cancel = afterTransitions(list, stopFollowing);

        return () => {
          cancel();
          stopFollowing();
        };
      }

      const settle = () => {
        resizingRef.current = false;
        list.style.removeProperty('min-width');
        list.style.removeProperty('justify-content');
        list.style.removeProperty('--styled-tabbar-group-margin');
        list.style.removeProperty('--styled-tabbar-label-overflow');
        expandedWidthRef.current = list.getBoundingClientRect().width;
      };

      if (!wasCollapsed) {
        settle();
        return undefined;
      }

      // Expanding: the groups grow from the collapsed tab's position until
      // they fill the bar, their labels clipped meanwhile.
      list.style.justifyContent = collapsedJustify[collapsedPosition];
      list.style.setProperty('--styled-tabbar-group-margin', '0');
      list.style.setProperty('--styled-tabbar-label-overflow', 'clip');

      follow();
      const cancel = afterTransitions(list, () => {
        stopFollowing();
        settle();
      });

      return () => {
        cancel();
        stopFollowing();
      };
    }, [collapsed, collapsedPosition, listRef]);

    const handlers = usePointerDrag<HTMLDivElement, { tab?: HTMLElement }>(
      {
        end: (list, state, cancelled) => {
          if (cancelled) {
            release(list);
            return;
          }

          release(list, state.tab);
          if (state.tab && !isActive(state.tab)) state.tab.click();
        },
        move: (list, state, event) => {
          state.tab = press(list, event.clientX);
        },
        start: (list, event) => {
          if (!(event.target instanceof Element)) return undefined;
          if (!event.target.closest('[role="tab"]')) return undefined;

          // Place (and size) the lens at the pointer without a transition,
          // then let it follow without delay; only opacity and scale animate.
          list.style.setProperty('--styled-tabbar-lens-move-duration', '0s');
          list.style.setProperty('--styled-tabbar-lens-size-duration', '0s');
          const tab = press(list, event.clientX);
          list.getBoundingClientRect();
          list.style.removeProperty('--styled-tabbar-lens-size-duration');
          list.style.setProperty('--styled-tabbar-pressed', '1');

          return { tab };
        },
      },
      {
        onLostPointerCapture,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
      },
    );

    return (
      <ListContext.Provider value={{ collapsed }}>
        <StyledList
          ref={listRef}
          collapsed={collapsed}
          collapsedPosition={collapsedPosition}
          {...props}
          {...handlers}
        >
          {children}
          <Lens aria-hidden="true" />
        </StyledList>
      </ListContext.Provider>
    );
  },
);

// Neighboring tabs overlap in the compact size (Figma: negative spacing of
// 10px, 7.333px with 4 and 5.5px with 5 tabs).
const StyledGroup = styled('div', forwardRef)`
  --styled-tabbar-overlap: 10px;

  position: relative;
  display: flex;
  min-width: var(--styled-tabbar-tab-height);
  min-height: var(--styled-tabbar-tab-height);
  box-sizing: border-box;
  flex: 0 1 auto;
  align-items: center;
  margin-inline: var(--styled-tabbar-group-margin, auto);
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: min-width, min-height, opacity, visibility;

  /* Under the lens, the group grows: its glass and content scale up around
     its center (measured on iOS 26: iPhone 1.05, iPad 1.065). Scaled layer
     by layer, so nothing isolates their blending (see pressGroup). */
  &[data-pressed] {
    --styled-glass-scale: var(--styled-tabbar-pressed-group-scale);
    --styled-tabbar-content-scale: var(--styled-tabbar-pressed-group-scale);
  }

  &:has(> [role='tab'] ~ [role='tab'] ~ [role='tab'] ~ [role='tab']) {
    --styled-tabbar-overlap: 7.333px;
  }

  &:has(
    > [role='tab'] ~ [role='tab'] ~ [role='tab'] ~ [role='tab'] ~ [role='tab']
  ) {
    --styled-tabbar-overlap: 5.5px;
  }
`;

type Shape = 'capsule' | 'circle';

const GroupContext = createContext<{ shape?: Shape }>({});

export type TabBarGroupProps = React.ComponentProps<'div'> & {
  /** Default shape of the contained tabs (default: by their content). */
  shape?: Shape;
};

/**
 * A glass capsule of tabs, to be rendered inside `TabBar.List`. Its
 * `TabBar.Indicator` has to precede its tabs.
 */
const Group = forwardRef<HTMLDivElement, TabBarGroupProps>(
  ({ children, shape, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);

    useLayoutEffect(() => {
      const { current: group } = ref;
      if (!group) return undefined;

      // Only the group and its tabs: the selection resizes itself while
      // following the lens, which must not snap it back to the active tab.
      // It follows changes of their size right away (e.g. collapsing).
      const resizeObserver = new ResizeObserver(() =>
        updateSelection(group, { instant: true }),
      );
      const observe = () => {
        resizeObserver.observe(group);
        for (const child of group.children) {
          if (isTab(child)) resizeObserver.observe(child);
        }
      };

      const update = () => {
        observe();
        updateSelection(group);
      };
      update();

      const mutationObserver = new MutationObserver(update);
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

    const context = { shape };

    return (
      <GroupContext.Provider value={context}>
        <StyledGroup
          ref={ref}
          {...props}
        >
          <GlassBackground />
          {children}
        </StyledGroup>
      </GroupContext.Provider>
    );
  },
);

/**
 * The selection, to be rendered first inside each `TabBar.Group`, which
 * positions it on its active tab; hidden while pressed, when the list's lens
 * takes over (Framework7 `toolbar-ios.less`, `.tab-link-highlight`).
 */
const Indicator = styled(BaseTabs.Indicator, forwardRef)`
  position: absolute;
  top: var(--styled-tabbar-selection-top, 0);
  left: var(--styled-tabbar-selection-left, 0);
  width: var(--styled-tabbar-selection-width, 0);
  height: var(--styled-tabbar-selection-height, 0);
  border-radius: 100px;
  transition-duration: var(--styled-tabbar-selection-duration, 300ms);
  transition-property: top, left, width, height;

  /* Fades here, not on the indicator: opacity on the indicator would isolate
     the fill's blending, rendering its raw color while fading. */
  &::before {
    position: absolute;
    border-radius: inherit;
    background-color: var(--styled-glass-selection);
    content: '';
    inset: 0;
    mix-blend-mode: var(--styled-glass-selection-blend);
    opacity: calc(
      var(--styled-tabbar-selection-opacity, 0) *
        (1 - var(--styled-tabbar-pressed, 0)) *
        var(--styled-tabbar-selection-shown, 1)
    );
    transform: scale(${glassLensScale('var(--styled-tabbar-pressed, 0)')});
    transition-duration: var(--glass-ios-lens-duration);
  }
`;

export type TabBarTabProps = BaseTabs.Tab.Props & {
  /**
   * What the tab shows while its bar is collapsed.
   * @default the list's `collapsedContent`
   */
  collapsedContent?: CollapsedContent;
  cursor?: Properties['cursor'];
  /**
   * `circle`: sized like a symbol-only tab; `capsule`: like a stacked tab.
   * @default the group's shape, or by the tab's content
   */
  shape?: Shape;
};

// eslint-disable-next-line prettier/prettier
const StyledTab = styled<typeof BaseTabs.Tab, TabBarTabProps>(BaseTabs.Tab, forwardRef)`
  --styled-cursor: attr(
    cursor type(\<custom-ident\>),
    ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')}
  );
  --styled-tabbar-tab-overlap: calc(
    var(--styled-tabbar-overlap) * var(--styled-tabbar-overlap-factor) * -1
  );

  position: relative;
  display: flex;
  width: var(--styled-tabbar-tab-width);
  min-width: var(--styled-tabbar-tab-height);
  min-height: var(--styled-tabbar-tab-height);
  box-sizing: border-box;
  flex: 0 1 auto;
  flex-direction: var(--styled-tabbar-tab-direction);
  align-items: center;
  justify-content: center;
  padding: var(--styled-tabbar-tab-padding);
  border: 0;
  margin: 0;
  appearance: none;
  background-color: transparent;
  color: var(--styled-glass-content);
  font-family: inherit;
  gap: var(--styled-tabbar-tab-gap);
  margin-inline-end: var(--styled-tabbar-tab-overlap);
  text-align: center;
  transition-duration: var(--glass-ios-lens-duration);
  transition-property:
    width, min-width, min-height, padding, margin, gap, opacity, visibility;
  user-select: none;

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }

  /* Symbol only: a circle (iPhone) or a capsule hugging it (iPad) */
  &:not(:has(> [${part}='label'])) {
    width: auto;
    flex-shrink: 0;
    padding: var(--styled-tabbar-symbol-padding);
    aspect-ratio: var(--styled-tabbar-symbol-aspect-ratio);
    margin-inline-end: 0;
  }

  /* The shape overrides the content's default (a tripled class outranks it). */
  ${({ shape }) => {
    switch (shape) {
      case 'capsule': {
        return css`
          &&& {
            width: var(--styled-tabbar-tab-width);
            flex-shrink: 1;
            padding: var(--styled-tabbar-tab-padding);
            aspect-ratio: auto;
            margin-inline-end: var(--styled-tabbar-tab-overlap);
          }

          &&&:last-child {
            margin-inline-end: 0;
          }

          /* Symbol only (Figma iPad: sidebar and search, 50×36) */
          &&&:not(:has(> [${part}='label'])) {
            padding: var(--styled-tabbar-symbol-padding);
          }
        `;
      }

      case 'circle': {
        return css`
          &&& {
            width: auto;
            flex-shrink: 0;
            padding: var(--styled-tabbar-circle-padding);
            aspect-ratio: 1;
            margin-inline-end: 0;
          }
        `;
      }

      // Alone in its group (e.g. search), a circle in both sizes.
      default: {
        return css`
          &:only-of-type:not(:has(> [${part}='label'])) {
            padding: var(--styled-tabbar-circle-padding);
            aspect-ratio: 1;
          }
        `;
      }
    }
  }}

  &:last-child {
    margin-inline-end: 0;
  }

  &[data-active] {
    color: var(--styled-tabbar-active-color, var(--color-ios-primary));
  }

  &[data-disabled] {
    opacity: 0.55;
  }

  /* Its own collapsed content, over the list's (see collapsedList) */
  ${({ collapsedContent }) =>
    collapsedContent
      ? css`
          &&&&& {
            ${collapsedContents[collapsedContent]}
          }
        `
      : undefined}
`;

const Tab = forwardRef<HTMLButtonElement, TabBarTabProps>(
  ({ collapsedContent, shape, ...props }, ref) => {
    const group = useContext(GroupContext);
    const { collapsed } = useContext(ListContext);

    return (
      <StyledTab
        ref={ref}
        {...props}
        collapsedContent={collapsed ? collapsedContent : undefined}
        shape={shape ?? group.shape}
      />
    );
  },
);

// Symbol of a tab (Figma “􀋃”, “􀰱”), sized by the list's size.
const StyledIcon = styled('span', forwardRef)`
  display: flex;
  min-height: 1lh;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  font-feature-settings: 'ss16';
  font-size: var(
    --styled-tabbar-collapsed-icon-size,
    var(--styled-tabbar-icon-size)
  );
  ${fontWeight('var(--styled-tabbar-icon-weight)')}
  letter-spacing: var(
    --styled-tabbar-collapsed-icon-letter-spacing,
    var(--styled-tabbar-icon-letter-spacing)
  );
  line-height: var(
    --styled-tabbar-collapsed-icon-line-height,
    var(--styled-tabbar-icon-line-height)
  );
  mix-blend-mode: var(--styled-glass-content-blend);
  scale: var(--styled-tabbar-content-scale, none);
  transition: scale var(--glass-ios-lens-duration);

  [data-active] > & {
    ${fontWeight('var(--styled-tabbar-icon-active-weight)')}
    mix-blend-mode: normal;
  }
`;

const Icon = forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
  (props, ref) => (
    <StyledIcon
      ref={ref}
      {...{ [part]: 'icon' }}
      {...props}
    />
  ),
);

// Label of a tab, sized by the list's size. A hidden copy in the selected
// style, in the same grid cell, reserves its width, so the tab doesn't change
// width when selected.
// Its text centered vertically, also while the tab's padding animates (e.g.
// collapsing). Collapsing into a circle, it shrinks away (see
// collapsedContents), so the symbol moves smoothly.
const StyledLabel = styled('span', forwardRef)`
  display: grid;
  min-width: 0;
  min-height: 0;
  align-content: center;
  align-self: stretch;
  font-size: var(--styled-tabbar-label-size);
  grid-template-columns: minmax(0, 1fr);
  letter-spacing: var(--styled-tabbar-label-letter-spacing);
  line-height: var(--styled-tabbar-label-line-height);
  mix-blend-mode: var(--styled-glass-content-blend);
  scale: var(--styled-tabbar-content-scale, none);
  text-align: center;
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: scale, width, height, opacity;

  [data-active] > & {
    mix-blend-mode: normal;
  }
`;

// Clipped, not ellipsized, while the bar collapses or expands.
const labelLayer = css`
  overflow: hidden;
  grid-area: 1 / 1;
  text-overflow: var(--styled-tabbar-label-overflow, ellipsis);
  white-space: nowrap;
`;

const LabelText = styled('span')`
  ${labelLayer}
  ${fontWeight(510)}

  [data-active] > * > & {
    font-size: var(--styled-tabbar-label-active-size);
    ${fontWeight(700)}
  }
`;

const LabelReserve = styled('span')`
  ${labelLayer}

  font-size: var(--styled-tabbar-label-active-size);
  ${fontWeight(700)}
  visibility: hidden;
`;

const Label = forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
  ({ children, ...props }, ref) => (
    <StyledLabel
      ref={ref}
      {...{ [part]: 'label' }}
      {...props}
    >
      <LabelText>{children}</LabelText>
      <LabelReserve aria-hidden="true">{children}</LabelReserve>
    </StyledLabel>
  ),
);

export const TabBar = {
  ...BaseTabs,
  List,
  Group,
  Indicator,
  Tab,
  Icon,
  Label,
};
