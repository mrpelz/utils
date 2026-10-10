import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
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

import { badgeOnSymbol } from './badge.js';
import {
  GlassBackground,
  GlassContext,
  glassContext,
  glassLensScale,
  isDim,
} from './glass.js';
import {
  colorScheme,
  css,
  edgeScrollDelta,
  fontWeight,
  frameElapsed,
  SecondaryClickProps,
  useForwardedRef,
  usePointerDrag,
  useSecondaryClick,
} from './utils.js';

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
// - In a bar wider than its groups, the space between them widens (Figma:
//   groups centered), the first at the bar's start, as when collapsed.
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

// Metrics of tabs and their content per size, inherited from the list. Tabs
// of the compact size shrink to fit their group, down to their content's
// width; those of the regular size keep it. Beyond that, the group scrolls
// (see `StyledTabs`).
const sizeVars: Record<Size, string> = {
  compact: css`
    --styled-tabbar-tab-height: 54px;
    --styled-tabbar-tab-width: 102px;
    --styled-tabbar-tab-shrink: 1;
    --styled-tabbar-tab-min-width: auto;
    --styled-tabbar-label-min-width: max-content;
    --styled-tabbar-tab-direction: column;
    --styled-tabbar-tab-padding: 6px 8px 7px;
    --styled-tabbar-tab-gap: 1px;
    --styled-tabbar-overlap-factor: 1;
    --styled-tabbar-symbol-padding: 6px 8px 7px;
    --styled-tabbar-symbol-aspect-ratio: 1;

    /* Badges on its tabs' symbols, at the labeled tabs' symbols' height (a
       symbol-only tab's symbol is centered, lower; see Badge). */
    --styled-tabbar-badge-top: 6px;
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
    --styled-tabbar-tab-shrink: 0;
    --styled-tabbar-tab-min-width: var(--styled-tabbar-tab-height);
    --styled-tabbar-label-min-width: max-content;
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

  if (context) return isDim(context) ? dim : bright;

  return colorScheme(bright, dim);
};

// Marks a tab's symbol and label, so a tab can lay out by its content, and
// a group's scroller.
const part = 'data-tab-bar-part';
const tabsPart = `[${part}='tabs']`;

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
  group.querySelector<HTMLElement>(`:scope > [${CSS.escape(part)}='tabs']`);

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
    group.style.setProperty('--styled-tabbar-selection-duration', '0s');
  }

  setProperties(group, {
    '--styled-tabbar-selection-height': `${rect.height}px`,
    '--styled-tabbar-selection-left': `${left - originX}px`,
    '--styled-tabbar-selection-top': `${rect.top - originY}px`,
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
  const tab = tabsOf(group).find((child) => isActive(child));
  const hadActive = hadActiveTab.get(group) ?? false;
  hadActiveTab.set(group, Boolean(tab));

  group.style.setProperty('--styled-tabbar-selection-opacity', tab ? '1' : '0');
  if (!tab) return;

  group.style.removeProperty('--styled-tabbar-pressed');

  setSelection(group, tab.getBoundingClientRect(), {
    instant: instant || !hadActive,
  });
};

// Collapsed (measured on iOS 26, iPhone): the bar is 48pt high instead of
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
// The regular size (iPad doesn't minimize its tab bar) keeps its height.

export type CollapsedContent = 'label' | 'symbol' | 'symbolAndLabel';

/** Whether a group remains while collapsed, and which of its tabs does. */
export type CollapsedGroupSelection = { remains: boolean; tab: number };

/**
 * A choice of what remains while collapsed (for `visibleWhenCollapsed`), as
 * iOS's: the active tab (by its value, among the groups' tab values) and its
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

export type CollapsedPosition = 'center' | 'inline-end' | 'inline-start';

// The order of groups by their position, around the spacers (1 and 3).
const collapsedOrder: Record<CollapsedPosition, number> = {
  center: 2,
  'inline-end': 4,
  'inline-start': 0,
};

/** Whether a group or a tab remains while collapsed, if marks decide it. */
type CollapsedVisibility = 'away' | 'shown';

// Selectors outranking the list's collapsed styles (see `collapsedList`):
// for groups, and for tabs.
const groupOverride = '&'.repeat(6);
const tabOverride = '&'.repeat(9);

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

// A remaining tab, as the list's styles show the active one.
const collapsedShown = css`
  --styled-tabbar-tab-fade: 1;

  width: var(--styled-tabbar-collapsed-width);
  min-width: var(--styled-tabbar-tab-height);
  padding: var(--styled-tabbar-collapsed-padding);
  margin: 0;
  pointer-events: auto;
  visibility: visible;
`;

const collapsedHidden = css`
  --styled-tabbar-tab-fade: 0;

  ${collapsedAway}
  pointer-events: none;
  visibility: hidden;
`;

// With several groups marked to remain, they are spaced by transparent
// borders (see `StyledGroup`), as the list has no gap while collapsed: the
// groups collapsing away would take it up.
const collapsedList = ({
  content,
  spaced,
}: {
  content?: CollapsedContent;
  spaced: boolean;
}) => css`
  --styled-tabbar-tab-height: var(--styled-tabbar-collapsed-tab-height);
  --styled-tabbar-selection-shown: 0;
  --styled-tabbar-group-gap: 0px;
  --styled-tabbar-collapsed-layout: 1;
  --styled-tabbar-label-overflow: clip;
  --styled-tabbar-label-min-width: 0;

  /* (Its badges on their symbols: the remaining tabs alike.) */
  --styled-tabbar-badge-top: initial;
  ${content ? collapsedContents[content] : ''}

  padding: calc(16px + var(--styled-tabbar-collapsed-inset))
    calc(${spaced ? '24px' : '32px'} + var(--styled-tabbar-collapsed-inset))
    calc(32px + var(--styled-tabbar-collapsed-inset));

  && > div > ${tabsPart} > [role='tab'] {
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
          && > div > ${tabsPart} > [role='tab'] {
            ${collapsedContents.label}
          }

          && > div > ${tabsPart} > [role='tab']:has(> [${part}='icon']) {
            ${collapsedContents.symbol}
          }
        `
  }

  && > div > ${tabsPart} > [role='tab'] > [${part}='icon'] {
    display: var(--styled-tabbar-collapsed-symbol);
    mix-blend-mode: var(--styled-glass-content-blend);
  }

  && > div > ${tabsPart} > [role='tab'] > [${part}='label'] {
    width: var(--styled-tabbar-collapsed-label-extent);
    height: var(--styled-tabbar-collapsed-label-extent);
    mix-blend-mode: var(--styled-glass-content-blend);
    opacity: var(--styled-tabbar-collapsed-label-opacity);
  }

  && > div > ${tabsPart} > [role='tab'] > [${part}='label'] > * {
    ${fontWeight(510)}
  }
`;

// The accessory's height and gap above the groups (see `Accessory`).
const accessoryHeight = 40;
const accessoryGap = 16;

// eslint-disable-next-line prettier/prettier
const StyledList = styled<typeof BaseTabs.List, TabBarListProps & { anchor?: string; spaced?: boolean }>(BaseTabs.List, forwardRef)`
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 32px 32px;
  gap: var(--styled-tabbar-group-gap, 16px);
  interpolate-size: allow-keywords;
  touch-action: none;
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: padding, gap;

  /* Room for its accessory above the groups (see placeAccessory), in the
     bar's layout: its height and gap above the groups (at the padding),
     also while collapsed (nothing moves). */
  &[data-accessory-above] {
    margin-block-start: ${accessoryHeight + accessoryGap - 16}px;
  }

  /* The spacers placing collapsed groups by position (see collapsedOrder);
     otherwise empty, their margins taking up the gaps around them, in step
     with the gap's transition. In a bar wider than its groups (data-wide),
     they grow and shrink in step with the space between the groups (see
     List), so the groups move instead of jumping. */
  &::before,
  &::after {
    flex: var(
        --styled-tabbar-spacer-grow,
        var(--styled-tabbar-collapsed-layout, 0)
      )
      1 0;
    content: '';
    transition: margin var(--glass-ios-lens-duration);
  }

  &[data-wide]::before,
  &[data-wide]::after {
    transition:
      margin var(--glass-ios-lens-duration),
      flex-grow var(--glass-ios-lens-duration);
  }

  &::before {
    order: var(--styled-tabbar-collapsed-layout, 0);
    margin-inline-end: calc(var(--styled-tabbar-group-gap, 16px) * -1);
  }

  &::after {
    order: calc(var(--styled-tabbar-collapsed-layout, 0) * 3);
    margin-inline-start: calc(var(--styled-tabbar-group-gap, 16px) * -1);
  }

  /* Expanding is the collapse played backwards (see List): every
     transition's easing reversed (CSS ease's). */
  &[data-expanding],
  &[data-expanding]::before,
  &[data-expanding]::after,
  &[data-expanding] *,
  &[data-expanding] *::before,
  &[data-expanding] *::after {
    transition-timing-function: cubic-bezier(0.75, 0, 0.75, 0.9) !important;
  }

  ${({ anchor }) => (anchor ? `anchor-name: ${anchor};` : '')}
  ${({ context }) => glassContext(context)}
  ${({ size = 'compact' }) => sizeVars[size]}
  ${({ context, size }) =>
    size === 'regular' ? regularActiveColor(context) : undefined}
  ${({ collapsed, collapsedContent, spaced = false }) =>
    collapsed
      ? collapsedList({ content: collapsedContent, spaced })
      : undefined}
`;

// Positioned by its center, so it stays under the pointer while its size
// transitions between tab shapes, but within its bounds at its current size:
// its size and position transition as registered lengths (see `styles.tsx`),
// so the clamp follows. Growing beyond the bar, it would overflow its
// container.
const Lens = styled('span')`
  position: absolute;
  top: 0;
  left: 0;
  width: var(--styled-tabbar-lens-width);
  height: var(--styled-tabbar-lens-height);
  border-radius: 100px;
  background-color: var(--styled-glass-lens);
  box-shadow: var(--styled-glass-lens-shadow);
  opacity: var(--styled-tabbar-pressed, 0);
  pointer-events: none;
  scale: ${glassLensScale('var(--styled-tabbar-pressed, 0)')};
  transition-duration:
    var(--styled-tabbar-lens-move-duration, var(--glass-ios-lens-duration)),
    var(--styled-tabbar-lens-move-duration, var(--glass-ios-lens-duration)),
    var(--styled-tabbar-lens-size-duration, var(--glass-ios-lens-duration)),
    var(--styled-tabbar-lens-size-duration, var(--glass-ios-lens-duration)),
    var(--glass-ios-lens-duration), var(--glass-ios-lens-duration);
  transition-property:
    --styled-tabbar-lens-x, --styled-tabbar-lens-y, --styled-tabbar-lens-width,
    --styled-tabbar-lens-height, opacity, scale;
  transition-timing-function: ease-out;
  translate: clamp(
      var(--styled-tabbar-lens-min, 0px),
      var(--styled-tabbar-lens-x) - var(--styled-tabbar-lens-width) / 2,
      var(--styled-tabbar-lens-max, 0px) - var(--styled-tabbar-lens-width)
    )
    calc(var(--styled-tabbar-lens-y) - var(--styled-tabbar-lens-height) / 2);
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
      '--styled-tabbar-lens-max': `${bounds.right - originX}px`,
      '--styled-tabbar-lens-min': `${bounds.left - originX}px`,
    });
  }

  setProperties(list, {
    '--styled-tabbar-lens-height': `${rect.height}px`,
    '--styled-tabbar-lens-width': `${rect.width}px`,
    '--styled-tabbar-lens-x': `${centerX - originX}px`,
    '--styled-tabbar-lens-y': `${rect.top + rect.height / 2 - originY}px`,
  });
};

// Grows the group under the lens (or, with `pressed` false, back): its
// glass layers scale around their (the group's) center by themselves; its
// tabs' symbols and labels scale around the group's center too, set as their
// transform origin. Scaling the group itself would isolate its layers'
// blending (rendering the glass gray). Called again while the group scrolls,
// as its center moves over its tabs.
const pressGroup = (group: HTMLElement, pressed: boolean) => {
  if (!pressed) {
    delete group.dataset.pressed;
    return;
  }

  const scroller = scrollerOf(group);
  if (!scroller) return;

  // The group's center in the layout of its scroller (filling the group).
  const centerX = scroller.scrollLeft + scroller.clientWidth / 2;
  const centerY = scroller.scrollTop + scroller.clientHeight / 2;
  const content = scroller.querySelectorAll(
    `[${CSS.escape(part)}='icon'], [${CSS.escape(part)}='label']`,
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
    const chosen = group === groupOf(tab);
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

// The accessory (UIKit `bottomAccessory`, e.g. Music's mini player), from
// iOS 26: expanded, a capsule as wide as the bar's groups, its glass 48pt
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

type Box = { height: number; left: number; right: number; top: number };

/**
 * The accessory's morph to its place above the groups (`collapsed` false) or
 * between them, from where it was (relative to the list), along with the
 * groups' transitions: straight to its place as they'll have ended (see
 * `atTransitionsEnd`), not following them on their way (e.g. towards a
 * collapsing group's far edge, narrowing meanwhile); expanding, the same
 * way back. Also the groups remaining while collapsed (all groups take
 * pointer events again while expanding).
 */
type AccessoryMorph = {
  collapsed: boolean;
  frame?: number;
  from?: Box;
  remaining: HTMLElement[];
  // Its place as the groups will be, as last measured (in a frame, by
  // `document.timeline`'s time, as it's placed several times a frame).
  target?: { box: Box; time: CSSNumberish | null };
  // The transitions it morphs along (those running as it started, not
  // later ones, e.g. once the groups have settled).
  transitions?: CSSTransition[];
};

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
  const rtl = style.direction === 'rtl';
  const box = list.getBoundingClientRect();
  const rect = last.getBoundingClientRect();
  const rest = rtl
    ? rect.left - (box.left + Number.parseFloat(style.paddingLeft))
    : box.right - Number.parseFloat(style.paddingRight) - rect.right;
  if (groups.length < 2) return Math.max(0, rest);

  // The space between: the second group's margin (auto, or the length).
  const [, second] = groups;
  const margin = second
    ? Number.parseFloat(
        getComputedStyle(second)[rtl ? 'marginRight' : 'marginLeft'],
      )
    : 0;
  const free = Math.max(0, margin + rest);
  return free;
};

/** Starts the accessory's morph to the collapsed (or expanded) place. */
const morphAccessory = (list: HTMLElement, collapsed: boolean) => {
  const morph = accessoryMorphs.get(list);
  if (morph?.collapsed === collapsed) return;

  const accessory = accessories.get(list);
  accessoryMorphs.set(list, {
    collapsed,
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
      style.getPropertyValue('--styled-tabbar-collapsed-tab-height'),
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
    collapsed: false,
    remaining: [],
  };
  if (!accessory) return;

  const groups = [...list.querySelectorAll<HTMLElement>(':scope > div')];
  if (groups.length === 0) return;

  if (morph.collapsed) {
    // Groups collapsing away stop taking pointer events right away.
    morph.remaining = groups.filter(
      (group) => getComputedStyle(group).pointerEvents !== 'none',
    );
  }

  // State for its styles (see `StyledAccessory`).
  accessory.toggleAttribute('data-collapsed', morph.collapsed);
  const visibleIn = getComputedStyle(accessory)
    .getPropertyValue('--styled-tabbar-accessory-visible-in')
    .trim();

  // Its place as the groups are; shown in one state only, at its place
  // there.
  const collapsedPlace =
    visibleIn === 'both' ? morph.collapsed : visibleIn === 'collapsed';
  const measure = () => {
    const box = collapsedPlace
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
  const done = !morph.from;

  // Room above the list for its place above the groups (see StyledList).
  list.toggleAttribute('data-accessory-above', visibleIn !== 'collapsed');

  setProperties(accessory, {
    '--styled-tabbar-accessory-height': `${place.height}px`,
    '--styled-tabbar-accessory-left': `${place.left}px`,
    '--styled-tabbar-accessory-top': `${place.top}px`,
    '--styled-tabbar-accessory-width': `${Math.max(0, place.right - place.left)}px`,
  });

  // Morphing on by itself, also once the groups have settled.
  if (!done && morph.frame === undefined && accessoryMorphs.has(list)) {
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

export type TabBarRootProps = Omit<BaseTabs.Root.Props, 'ref'>;

/**
 * Base UI's `Tabs.Root`, also providing the anchor its `TabBar.Accessory`
 * is positioned at (the `TabBar.List`).
 */
const Root = forwardRef<HTMLDivElement, TabBarRootProps>((props, ref) => {
  const id = useId();
  const [link] = useState(createAccessoryLink);
  const context = useMemo(
    () => ({
      ...link,
      anchor: `--styled-tabbar-${id.replaceAll(/[^\w-]/gu, '')}`,
    }),
    [id, link],
  );

  return (
    <RootContext.Provider value={context}>
      <BaseTabs.Root
        ref={ref}
        {...props}
      />
    </RootContext.Provider>
  );
});

/** The list's state, for its groups and tabs (internal). */
type ListState = {
  collapsed: boolean;
  collapsedPosition: CollapsedPosition;
  markGroup?: () => () => void;
  markedGroups: number;
};

const ListContext = createContext<ListState>({
  collapsed: false,
  collapsedPosition: 'inline-start',
  markedGroups: 0,
});

export type TabBarListProps = BaseTabs.List.Props & {
  /**
   * Minimized (UIKit `tabBarMinimizeBehavior`): only the groups and tabs
   * marked `visibleWhenCollapsed` remain, by default as symbols in circles.
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
   * @default 'inline-start'
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
      collapsedPosition = 'inline-start',
      onClickCapture,
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
    const [expanding, setExpanding] = useState(false);
    // Wider than its groups (expanded): the space between them as a length
    // (see `freeSpace`), so it transitions as the bar collapses.
    const [wide, setWide] = useState(false);
    const freeRef = useRef(0);
    const [renderedCollapsed, setRenderedCollapsed] = useState(collapsed);
    if (collapsed !== renderedCollapsed) {
      setRenderedCollapsed(collapsed);
      setExpanding(!collapsed);
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
        setWide(freeRef.current > 0.5);
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
        list.style.setProperty('--styled-tabbar-collapsed-layout', '1');
        list.style.setProperty('--styled-tabbar-group-margin', '0');
        list.style.setProperty('--styled-tabbar-label-overflow', 'clip');
        list.style.setProperty('--styled-tabbar-label-min-width', '0');
      };

      if (collapsed) {
        resizingRef.current = true;
        list.style.removeProperty('--styled-tabbar-spacer-grow');
        if (expandedWidthRef.current !== undefined) {
          list.style.minWidth = `${expandedWidthRef.current}px`;
        }
        holdCollapsedLayout();
        // Wider than its groups: the space between them shrinks from its
        // length (a frame later: from it, not from auto).
        let shrink: number | undefined;
        if (Object.hasOwn(list.dataset, 'wide')) {
          list.style.setProperty(
            '--styled-tabbar-group-margin',
            `${String(freeRef.current)}px`,
          );
          shrink = requestAnimationFrame(() =>
            list.style.setProperty('--styled-tabbar-group-margin', '0'),
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
        list.style.removeProperty('--styled-tabbar-collapsed-layout');
        list.style.removeProperty('--styled-tabbar-group-margin');
        list.style.removeProperty('--styled-tabbar-label-overflow');
        list.style.removeProperty('--styled-tabbar-label-min-width');
        list.style.removeProperty('--styled-tabbar-spacer-grow');
        expandedWidthRef.current = list.getBoundingClientRect().width;
        placeAccessory(list);
        setExpanding(false);
        freeRef.current = measureFreeSpace(list);
        setWide(freeRef.current > 0.5);
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
          '--styled-tabbar-group-margin',
          `${String(freeRef.current)}px`,
        );
        list.style.setProperty('--styled-tabbar-spacer-grow', '0');
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
        if (frame !== undefined) return;
        if (!accessories.has(list)) return;

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
      () => ({ collapsed, collapsedPosition, markGroup, markedGroups }),
      [collapsed, collapsedPosition, markGroup, markedGroups],
    );

    const handlers = usePointerDrag<HTMLDivElement, { tab?: HTMLElement }>(
      {
        end: (list, state, cancelled) => {
          dragRef.current = undefined;
          stopScrollingRef.current?.();

          if (cancelled) {
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
          state.tab = press(list, event.clientX);
          dragRef.current = { clientX: event.clientX, state };
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

          const state = { tab };
          dragRef.current = { clientX: event.clientX, state };
          stopScrollingRef.current = autoScroll(dragRef);
          return state;
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
      <ListContext.Provider value={context}>
        <StyledList
          ref={listRef}
          anchor={root.anchor}
          collapsed={collapsed}
          data-expanding={expanding ? '' : undefined}
          data-wide={wide ? '' : undefined}
          spaced={markedGroups > 1}
          {...props}
          {...handlers}
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
          <Lens aria-hidden="true" />
        </StyledList>
      </ListContext.Provider>
    );
  },
);

// Neighboring tabs overlap in the compact size (Figma: negative spacing of
// 10px, 7.333px with 4 and 5.5px with 5 tabs). Groups of several tabs share
// the bar's width by their own (single tabs, e.g. search, keep theirs): too
// narrow, their tabs scroll within (see `StyledTabs`), they keep their shape.
// A grid track up to their width lets them (and the bar) shrink in
// intrinsically sized containers too: a scroll container still counts its
// content as its minimum width, the track doesn't.
type StyledGroupProps = {
  collapsedContent?: CollapsedContent;
  collapsedVisibility?: CollapsedVisibility;
  positionOrder: number;
  selectionShown?: boolean;
  spaced?: boolean;
};

const StyledGroup = styled<'div', StyledGroupProps>('div', forwardRef)`
  --styled-tabbar-overlap: 10px;
  --styled-tabbar-collapsed-order: ${({ positionOrder }) => positionOrder};

  position: relative;
  display: grid;
  min-width: var(--styled-tabbar-tab-height);
  min-height: var(--styled-tabbar-tab-height);
  box-sizing: border-box;
  flex: 0 0 auto;
  order: calc(
    var(--styled-tabbar-collapsed-layout, 0) *
      var(--styled-tabbar-collapsed-order)
  );
  border: 0 solid transparent;
  grid-template-columns: minmax(0, max-content);
  margin-inline: 0;
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: min-width, min-height, margin, border-width, visibility;

  /* Groups after the first take the free space before them: in a wide bar,
     the space between the groups widens, the first at the bar's start (as
     collapsed, so expanded and collapsed bars line up). */
  div ~ & {
    margin-inline-start: var(--styled-tabbar-group-margin, auto);
  }

  /* Under the lens, the group grows: its glass and content scale up around
     its center (measured on iOS 26: iPhone 1.05, iPad 1.065). Scaled layer
     by layer, so nothing isolates their blending (see pressGroup). */
  &[data-pressed] {
    --styled-glass-scale: var(--styled-tabbar-pressed-group-scale);
    --styled-tabbar-content-scale: var(--styled-tabbar-pressed-group-scale);
  }

  &:has(> ${tabsPart} > [role='tab'] ~ [role='tab']) {
    flex-shrink: 1;
  }

  &:has(
    > ${tabsPart} > [role='tab'] ~ [role='tab'] ~ [role='tab'] ~ [role='tab']
  ) {
    --styled-tabbar-overlap: 7.333px;
  }

  &:has(
    > ${tabsPart}
      > [role='tab']
      ~ [role='tab']
      ~ [role='tab']
      ~ [role='tab']
      ~ [role='tab']
  ) {
    --styled-tabbar-overlap: 5.5px;
  }

  /* Remaining while collapsed, or collapsing away (see Group) */
  ${({ collapsedVisibility, spaced }) => {
    switch (collapsedVisibility) {
      case 'shown': {
        return css`
          ${groupOverride} {
            --styled-glass-fade: 1;

            min-width: var(--styled-tabbar-tab-height);
            ${spaced ? 'border-inline-width: 8px;' : ''}
            pointer-events: auto;
            visibility: visible;
          }
        `;
      }

      case 'away': {
        // Its selection hidden too: coming back, it fades in (rather than
        // showing on its tab growing from nothing).
        return css`
          ${groupOverride} {
            --styled-tabbar-selection-shown: 0;
            --styled-glass-fade: 0;

            min-width: 0;
            margin-inline: 0;
            pointer-events: none;
            visibility: hidden;
          }

          ${groupOverride} > ${tabsPart} > [role='tab'] {
            ${collapsedAway}
          }
        `;
      }

      default: {
        return undefined;
      }
    }
  }}

  /* Its collapsed content, over the list's, under its tabs' own (see
     collapsedList, StyledTab) */
  ${({ collapsedContent }) =>
    collapsedContent
      ? css`
          &&&& > ${tabsPart} > [role='tab'] {
            ${collapsedContents[collapsedContent]}
          }
        `
      : undefined}

  /* Several remaining tabs (in the group, or in several groups) show the
     selection on the active one. */
  ${({ selectionShown }) =>
    selectionShown
      ? css`
          ${groupOverride} {
            --styled-tabbar-selection-shown: 1;
          }

          ${groupOverride} > ${tabsPart} > [role='tab'][data-active] {
            color: var(--styled-tabbar-active-color, var(--color-ios-primary));
          }
        `
      : undefined}
`;

// A group's tabs (and selection), filling it. Too narrow for them, it
// scrolls, clipped to the group's shape; otherwise it doesn't clip, so a
// pressed group's content grows beyond (see `pressGroup`). Touches drag the
// lens, not the tabs: a scroll container's own `touch-action` decides for
// the touches within (the list's stops at it); the lens scrolls them near
// the group's ends (see `autoScroll`).
const StyledTabs = styled('div', forwardRef)`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 100px;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  touch-action: none;

  &[data-overflowing] {
    overflow: auto hidden;
  }
`;

type Shape = 'capsule' | 'circle';

/** The group's state, for its tabs (internal). */
type GroupState = {
  away: boolean;
  markTab?: () => () => void;
  markedTabs: number;
  shape?: Shape;
};

const GroupContext = createContext<GroupState>({ away: false, markedTabs: 0 });

export type TabBarGroupProps = React.ComponentProps<'div'> & {
  /**
   * What the collapsed bar's tabs in the group show.
   * @default the list's `collapsedContent`
   */
  collapsedContent?: CollapsedContent;
  /**
   * Where the group is, along the collapsed bar.
   * @default the list's `collapsedPosition`
   */
  collapsedPosition?: CollapsedPosition;
  /** Default shape of the contained tabs (default: by their content). */
  shape?: Shape;
  /**
   * Remains while the bar is collapsed, with its tabs marked so; groups not
   * marked collapse away (see `collapsedSelection`).
   */
  visibleWhenCollapsed?: boolean;
};

/**
 * A glass capsule of tabs, to be rendered inside `TabBar.List`. Its
 * `TabBar.Indicator` has to precede its tabs.
 */
const Group = forwardRef<HTMLDivElement, TabBarGroupProps>(
  (
    {
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
    if (list.collapsed) {
      collapsedVisibility = visibleWhenCollapsed ? 'shown' : 'away';
    }
    const away = collapsedVisibility === 'away';

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
      () => ({ away, markTab, markedTabs, shape }),
      [away, markTab, markedTabs, shape],
    );

    return (
      <GroupContext.Provider value={context}>
        <StyledGroup
          ref={ref}
          collapsedContent={list.collapsed ? collapsedContent : undefined}
          collapsedVisibility={collapsedVisibility}
          spaced={list.markedGroups > 1}
          positionOrder={
            collapsedOrder[collapsedPosition ?? list.collapsedPosition]
          }
          selectionShown={
            list.collapsed && !away && (markedTabs > 1 || list.markedGroups > 1)
          }
          {...props}
        >
          <GlassBackground />
          <StyledTabs {...{ [part]: 'tabs' }}>{children}</StyledTabs>
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

  /* Base UI hides it while the active tab has no size (e.g. collapsed
     away); its opacity (below) hides it instead, so it fades in again
     rather than appearing at once (no transition starts from display: none). */
  &[hidden] {
    display: block;
  }

  /* Fades here, not on the indicator: opacity on the indicator would isolate
     the fill's blending, rendering its raw color while fading. */
  &::before {
    position: absolute;
    border-radius: inherit;
    background-color: var(--styled-glass-selection);
    content: '';
    inset: 0;
    opacity: calc(
      var(--styled-glass-fade, 1) * var(--styled-tabbar-selection-opacity, 0) *
        (1 - var(--styled-tabbar-pressed, 0)) *
        var(--styled-tabbar-selection-shown, 1)
    );
    transform: scale(${glassLensScale('var(--styled-tabbar-pressed, 0)')});
    transition-duration: var(--glass-ios-lens-duration);
  }
`;

export type TabBarTabProps = BaseTabs.Tab.Props &
  SecondaryClickProps & {
    /**
     * What the tab shows while its bar is collapsed. Never nothing: a tab with
     * only a label shows its label, one with only a symbol its symbol.
     * @default the group's `collapsedContent`, or the list's
     */
    collapsedContent?: CollapsedContent;
    cursor?: Properties['cursor'];
    /**
     * `circle`: sized like a symbol-only tab; `capsule`: like a stacked tab.
     * @default the group's shape, or by the tab's content
     */
    shape?: Shape;
    /**
     * Remains while the bar is collapsed, in its group (if the group does);
     * tabs not marked collapse away. Several remaining tabs show the
     * selection on the active one.
     */
    visibleWhenCollapsed?: boolean;
  };

// eslint-disable-next-line prettier/prettier
const StyledTab = styled<typeof BaseTabs.Tab, Omit<TabBarTabProps, 'visibleWhenCollapsed'> & { collapsedVisibility?: CollapsedVisibility }>(BaseTabs.Tab, forwardRef)`
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
  min-width: var(--styled-tabbar-tab-min-width);
  min-height: var(--styled-tabbar-tab-height);
  box-sizing: border-box;
  flex: 0 var(--styled-tabbar-tab-shrink) auto;
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
    width, min-width, min-height, padding, margin, gap, visibility;
  user-select: none;

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }

  /* A badge on its symbol (see Badge). Its content other than its symbol
     and label (e.g. a badge) fades with it (collapsing away), as they do
     (see contentFade). */
  & > :not([${part}='icon']):not([${part}='label']) {
    opacity: calc(
      var(--styled-glass-fade, 1) * var(--styled-tabbar-tab-fade, 1)
    );
    transition: opacity var(--glass-ios-lens-duration);
  }

  ${badgeOnSymbol(`[${part}='icon']`)}

  /* (Over badgeOnSymbol's, a tripled class outranking its :has.) */
  &&& > [data-badge='corner'] {
    inset-block-start: calc(
      var(--styled-tabbar-badge-top, anchor(start)) - var(
          --styled-badge-symbol-y
        )
    );
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
            flex-shrink: var(--styled-tabbar-tab-shrink);
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

  /* Marked to remain while collapsed, or not (see Group) */
  ${({ collapsedVisibility }) => {
    if (!collapsedVisibility) return undefined;

    return css`
      ${tabOverride} {
        ${collapsedVisibility === 'shown' ? collapsedShown : collapsedHidden}
      }
    `;
  }}

  /* Its own collapsed content, over its group's and the list's (see
     collapsedList, StyledGroup) */
  ${({ collapsedContent }) =>
    collapsedContent
      ? css`
          &&&&&&& {
            ${collapsedContents[collapsedContent]}
          }
        `
      : undefined}

  /* Never collapsed to nothing, over any collapsed content: with only a
     label, it shows its label; with only a symbol, its symbol. */
  &&&&&&&:not(:has(> [${part}='icon'])) {
    ${collapsedContents.label}
  }

  &&&&&&&:not(:has(> [${part}='label'])) {
    ${collapsedContents.symbol}
  }
`;

const Tab = forwardRef<HTMLButtonElement, TabBarTabProps>((tabProps, ref) => {
  const { collapsedContent, shape, visibleWhenCollapsed, ...props } =
    useSecondaryClick(tabProps);
  const group = useContext(GroupContext);
  const { markTab } = group;
  const { collapsed } = useContext(ListContext);

  useLayoutEffect(
    () => (visibleWhenCollapsed ? markTab?.() : undefined),
    [markTab, visibleWhenCollapsed],
  );

  // Only while collapsed, in a remaining group.
  let collapsedVisibility: CollapsedVisibility | undefined;
  if (collapsed && !group.away) {
    collapsedVisibility = visibleWhenCollapsed ? 'shown' : 'away';
  }

  return (
    <StyledTab
      ref={ref}
      {...props}
      collapsedContent={collapsed ? collapsedContent : undefined}
      collapsedVisibility={collapsedVisibility}
      shape={shape ?? group.shape}
    />
  );
});

// A tab's content fading with its group's glass and the tab (collapsing
// away): inside its blended parts (the blending stays with the glass), not
// on the group or the tab, which would isolate it (see GlassBackground).
const contentFade = css`
  & > * {
    opacity: calc(
      var(--styled-glass-fade, 1) * var(--styled-tabbar-tab-fade, 1)
    );
    transition: opacity var(--glass-ios-lens-duration);
  }
`;

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

  ${contentFade}

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
// Not narrower than its text (a group scrolls instead), but while the bar
// collapses or expands.
const StyledLabel = styled('span', forwardRef)`
  display: grid;
  min-width: var(--styled-tabbar-label-min-width, 0);
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

  ${contentFade}

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

// Above its glass (see `GlassBackground`), clipped to the accessory, which
// its glass extends beyond, on one line (also while it's narrow, e.g.
// growing from nothing); fading with the glass (see `visibleIn`).
const AccessoryContent = styled('span')`
  position: relative;
  display: flex;
  overflow: hidden;
  min-width: 0;
  flex: 1;
  align-items: center;
  align-self: stretch;
  border-radius: inherit;
  gap: 12px;
  padding-inline: 16px;
  white-space: nowrap;

  & > * {
    opacity: var(--styled-glass-fade, 1);
    transition: opacity var(--glass-ios-lens-duration);
  }
`;

/**
 * The bar's states the accessory shows in: `both` (morphing between its
 * places), only `expanded` (above the groups), or only `collapsed` (between
 * the remaining groups).
 */
export type AccessoryVisibility = 'both' | 'collapsed' | 'expanded';

// Hidden in the state it isn't shown in (see `visibleIn`), fading.
const accessoryHidden = css`
  --styled-glass-fade: 0;

  pointer-events: none;
  visibility: hidden;
`;

// eslint-disable-next-line prettier/prettier
const StyledAccessory = styled<'div', { anchor?: string; context?: GlassContext; visibleIn?: AccessoryVisibility }>('div', forwardRef)`
  --styled-tabbar-accessory-visible-in: ${({ visibleIn = 'both' }) =>
    visibleIn};

  position: absolute;
  top: calc(anchor(top) + var(--styled-tabbar-accessory-top, 0px));
  left: calc(anchor(left) + var(--styled-tabbar-accessory-left, 0px));
  display: flex;
  width: var(--styled-tabbar-accessory-width, 0);
  height: var(--styled-tabbar-accessory-height, 0);
  box-sizing: border-box;
  border-radius: 100px;
  color: var(--styled-glass-content);
  font-size: var(--font-ios-subheadline-size);
  letter-spacing: var(--font-ios-subheadline-tracking);
  line-height: var(--font-ios-subheadline-line-height);
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: visibility;
  ${({ anchor }) => (anchor ? `position-anchor: ${anchor};` : '')}
  ${({ context }) => glassContext(context)}

  ${({ visibleIn }) => {
    switch (visibleIn) {
      case 'expanded': {
        return css`
          &[data-collapsed] {
            ${accessoryHidden}
          }
        `;
      }

      case 'collapsed': {
        return css`
          &:not([data-collapsed]) {
            ${accessoryHidden}
          }
        `;
      }

      default: {
        return undefined;
      }
    }
  }}
`;

export type TabBarAccessoryProps = React.ComponentProps<'div'> & {
  /**
   * Brightness of the content behind the glass (as the list's).
   * @default 'bright', or 'dim' in dark mode
   */
  context?: GlassContext;
  /**
   * The bar's states it shows in; fading out and in as the bar collapses
   * and expands, unless `both`.
   * @default 'both'
   */
  visibleIn?: AccessoryVisibility;
};

/**
 * A glass capsule of arbitrary content attached to the bar (UIKit
 * `bottomAccessory`, e.g. a mini player), to be rendered inside
 * `TabBar.Root`, after `TabBar.List`: above its groups, or, while the bar is
 * collapsed, between them. Positioned at the list, it doesn't take up space
 * in the layout.
 */
const Accessory = forwardRef<HTMLDivElement, TabBarAccessoryProps>(
  ({ children, visibleIn = 'both', ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const { anchor, setAccessory } = useContext(RootContext);

    // Placed by its list, as its groups change, and when added (or shown in
    // other states).
    useLayoutEffect(() => {
      setAccessory?.(ref.current);
      return () => setAccessory?.(null);
    }, [ref, setAccessory, visibleIn]);

    return (
      <StyledAccessory
        ref={ref}
        anchor={anchor}
        visibleIn={visibleIn}
        {...{ [part]: 'accessory' }}
        {...props}
      >
        <GlassBackground />
        <AccessoryContent>{children}</AccessoryContent>
      </StyledAccessory>
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
