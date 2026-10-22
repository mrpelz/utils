import '../checkbox/style.css';
import '../typography/style.css';
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  ComponentProps,
  createContext,
  FocusEvent,
  forwardRef,
  FunctionComponent,
  MouseEvent,
  PointerEvent,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import {
  Check,
  Checkbox as CheckboxBase,
  CheckboxRootProps,
  Radio as RadioBase,
  RadioRootProps,
} from '../checkbox/main.js';
import {
  cn,
  edgeScrollDelta,
  frameElapsed,
  useForwardedRef,
  usePointerDrag,
  useSecondaryClick,
  withStyle,
} from '../utils/main.js';
import type {
  Drag,
  ExpandableContextValue,
  Handler,
  ItemContextValue,
  ListBlockProps,
  ListButtonProps,
  ListEditButtonProps,
  ListExpandableProps,
  ListExpandableRootProps,
  ListGroupProps,
  ListHeaderProps,
  ListImageProps,
  ListIndexProps,
  ListItemProps,
  ListRootProps,
  ListSwipeActionProps,
  ListSwipeActionsProps,
  ListTextProps,
  Overswipe,
  PartProps,
  Scrub,
  Side,
  Swipe,
} from './props.js';

export type {
  ListBlockProps,
  ListButtonProps,
  ListEditButtonProps,
  ListExpandableProps,
  ListExpandableRootProps,
  ListGroupProps,
  ListHeaderProps,
  ListImageProps,
  ListIndexProps,
  ListItemProps,
  ListRootProps,
  ListStyle,
  ListSwipeActionProps,
  ListSwipeActionsProps,
  ListTextProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Lists and tables”: “Row” Height=Regular/Tall,
// “_Images”, “_Trailing”, “_Edit Buttons”, “_Grabber”, “_Separator”, “Row -
// Button”, “Row with Swipe Actions”, “_Swipe Actions”, “Header”, “_Header
// Trailing Accessories”, “Section Title”, “Grouped Table Footer”, “Index Bar”),
// with its colors mapped to UIKit semantic colors (the tint, the label colors,
// `systemRed`, `systemGray2`/`3`/`5`); the separator is a token in
// `styles.css`. What Figma doesn't define follows Framework7 (`list.less`,
// `list-ios.less`, `list-vars.less`, `swipeout.less`, `swipeout-ios.less`,
// `swipeout.js`, `list-index.less`, `block.less`):
// - list styles (UIKit `UITableView.Style`): `insetGrouped` (the default: 16px
//   inset, 24px corners), `grouped`, `plain` (Framework7 `.list`,
//   `.list.inset`); 35px between sections (none at the list's ends: its
//   neighbors' and container's spacing); optionally outlined
//   (`.list-outline`)
// - pressed rows (UIKit's cell selection, `systemGray4`), hiding the separators
//   around pressed and swiped rows
// - swiping: the row follows the pointer (rubber-banding past its actions) over
//   its actions, pinned to the list's edge, which scale in one after another
//   from the edge; it opens on releasing past half the actions, or on a quick
//   swipe (300ms, 10px); optionally, swiping on past them (without
//   rubber-banding) stretches the outermost action from the edge up to the
//   others, which follow the row, and arms overswiping (see `armDistance`;
//   Framework7: past 1.2 times the actions), triggering it on release; armed,
//   its symbol moves to the row's end, its label hides (150ms)
// - reordering rows by their grabbers (`sortable.js`, see `useReorder`),
//   independent of the leading edit controls (`Checkbox`, `Radio`,
//   `EditButton`); entering and leaving edit mode (`Root` `editing`; UIKit
//   `setEditing(_:animated:)`), they slide in and out from the rows' edges
//   (300ms), the rows' content making room
// - media rows, as in Mail (`.media-list`: a `Text` part)
// - the Content Block (`Block`)
//
// Titles, subtitles and details are in the Body and Subheadline text styles,
// prominent headers in Title 3 Emphasized, index letters in Caption 1
// Emphasized; Figma's nested and extra prominent headers, header subtitles and
// details, footers and swipe action labels differ from the text styles in
// tracking, and are kept.
//
// Rows are grids: [edit control] [image] title/subtitle [trailing …], where
// everything that is not a leading part, a title or a subtitle is trailing
// (Figma “Contents - Trailing”: 16px apart), e.g. a `Switch` or a `Menu`
// trigger; up to 36px high (e.g. a `Stepper` or `Segmented`), they fit regular
// rows (8px from their edges). Rows with a subtitle are tall (Figma
// Height=Tall: 68px); others are regular (52px). Both are minimum heights,
// growing with wrapping text. A row is pressable when its `Title` (or `Button`)
// is a link or button (`render`): its hit area covers the row, beneath the
// trailing controls.
//
// Deviations:
// - Focusing a swipe action opens the actions, and the delete edit button opens
//   the trailing actions.
// - Header and footer text is aligned with the rows' text (Figma: headers are
//   laid out for the full width, footers for the rows').
// - Sticky section titles (plain lists) are opaque (Framework7 contacts list;
//   Figma: a blur only), and sections snap to the top of a scroll container
//   with `scroll-snap-type` (Framework7: none).
// - Images keep their regular size (one line's height) in tall rows (Figma
//   Height=Tall: rounded 44px, circular 60px, fill 68px).
// - Swiped rows taller than Figma's tall rows (e.g. Mail's) get 34px corners
//   (Figma: a capsule, which would cut into their content).
// - Swiped rows keep a round end at their place's edge, their content sliding
//   away beneath it (iOS; Figma shows rows opened in place only).
// - Swipe actions are 44px circles, 4px from a regular row's edges (Figma:
//   52px, the row's height), or rounded rectangles as high as the row (as iOS
//   notifications'), by action; labels are optional (for multi-line rows), 4px
//   below the shapes, in 13px (Figma: 50px circles, 3px above 15px labels,
//   which overflow a 68px row). Symbols can be text, in capitals (regular
//   weight).
// - Actions fade in as they scale in, and the others fade out while overswiping
//   (iOS; Figma: none).
// - Rounded and circular images size their symbol to the image (Figma: none
//   given); header buttons are round (Figma PNG; CSS: 10px corners).
// - Separators, chevrons and the checkmarks are drawn as CSS borders and SVG
//   strokes (Figma: SF Symbols glyphs 􀆊, 􀆅, 􀅼, 􀅽, 􀌇, 􀆏).

// Glyphs (SF Symbols, as SVG strokes at the current font size).

const Chevron = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.75em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 8 14"
    width="0.43em"
  >
    <path d="M1.5 1.5L6.5 7l-5 5.5" />
  </svg>
);

// Figma PNG: 15.2 × 14.5px of ink at 17px (590).
const Lines = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.7em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 18 12"
    width="1.06em"
  >
    <path d="M1 1h16M1 6h16M1 11h16" />
  </svg>
);

const Sign = ({ plus }: { plus: boolean }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.8em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeWidth="1.8"
    viewBox="0 0 12 12"
    width="0.8em"
  >
    <path d={plus ? 'M2 6h8M6 2v8' : 'M2 6h8'} />
  </svg>
);

// Root: the list's style, as custom properties for its parts (their
// fallbacks are `insetGrouped`'s, for parts outside of a root).

/** A list (UIKit `UITableView`): sections of rows, headers and footers. */
const Root = forwardRef<HTMLElement, ListRootProps>(
  ({ className, editing, listStyle, outline, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-editing': editing === undefined ? undefined : String(editing),
        'data-list-part': 'root',
        'data-list-style': listStyle,
        'data-outline': outline ? '' : undefined,
        className: cn('uikit-list-root', className),
        ...props,
      },
      ref,
      render,
    }),
);

/** A section: an optional `Header`, a `Group` or `Block`, a `Footer`. */
const Section = forwardRef<HTMLElement, PartProps<'section'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'section',
      props: {
        'data-list-part': 'section',
        className: cn('uikit-list-section', className),
        ...props,
      },
      ref,
      render,
    }),
);

// Reordering (Framework7 `sortable.js`, `sortable.less`): dragging a row's
// grabber lifts the row, which follows the pointer within its group, the
// other rows making room (300ms); near an end of the scroll container, it
// scrolls (as the tab bar's lens does). Released, the row settles into its
// place, and the group's `onReorder` is called; the app reorders its rows.
// Until their order changes (or, if it doesn't, the rows slide back), they
// keep their offsets. Arrow keys on a focused grabber move its row by one.
const reorderDuration = 300;

const isItem = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement && element.matches('[data-list-part=item]');

// The nearest ancestor scrolling vertically, or the document's.
const scrollContainerOf = (element: HTMLElement) => {
  for (
    let current = element.parentElement;
    current;
    current = current.parentElement
  ) {
    const { overflowY } = getComputedStyle(current);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
  }

  return element.ownerDocument.scrollingElement ?? element.ownerDocument.body;
};

const setOffset = (item: HTMLElement, offset: number, animate: boolean) => {
  item.style.transition = animate ? `transform ${reorderDuration}ms` : 'none';
  item.style.transform = offset === 0 ? '' : `translateY(${offset}px)`;
};

/** Reorders a group's rows by their grabbers (see above). */
const useReorder = (
  groupRef: { current: HTMLElement | null },
  onReorder: ((from: number, to: number) => void) | undefined,
) => {
  const onReorderRef = useRef(onReorder);
  useLayoutEffect(() => {
    onReorderRef.current = onReorder;
  });

  useEffect(() => {
    const { current: group } = groupRef;
    if (!group) return undefined;

    const grabberOf = (target: EventTarget | null) => {
      const grabber =
        target instanceof Element
          ? target.closest<HTMLElement>('[data-list-part=grabber]')
          : null;
      const item = grabber?.closest<HTMLElement>('[data-list-part=item]');
      return grabber && item && item.parentElement === group
        ? { grabber, item }
        : undefined;
    };

    // Clears the rows' offsets once their order changed, or slides them
    // back if it doesn't.
    const commit = (items: HTMLElement[], from: number, to: number) => {
      const settle = { observer: undefined as MutationObserver | undefined };
      let timeout: ReturnType<typeof setTimeout> | undefined;
      const clearOffsets = (animate: boolean) => {
        settle.observer?.disconnect();
        clearTimeout(timeout);
        for (const element of items) {
          setOffset(element, 0, animate);
          delete element.dataset.reordering;
          delete element.dataset.reorderEdge;
        }
      };
      settle.observer = new MutationObserver(() => clearOffsets(false));
      settle.observer.observe(group, { childList: true });
      timeout = setTimeout(() => clearOffsets(true), reorderDuration);

      if (from === to) {
        clearOffsets(true);
        return;
      }
      onReorderRef.current?.(from, to);
    };

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (event.button !== 0) return;
      const target = grabberOf(event.target);
      if (!target) return;

      const { grabber, item } = target;
      const items = [...group.children].filter(isItem);
      const from = items.indexOf(item);
      const origin = group.getBoundingClientRect().top;
      // Relative to the group, which may scroll.
      const tops = items.map(
        (element) => element.getBoundingClientRect().top - origin,
      );
      const heights = items.map((element) => element.offsetHeight);
      const height = heights[from] ?? 0;
      const top = tops[from] ?? 0;
      const bottomLimit =
        (tops.at(-1) ?? 0) + (heights.at(-1) ?? 0) - top - height;
      const startY = event.clientY - origin;
      let clientY = event.clientY;
      let to = from;

      event.preventDefault();
      grabber.setPointerCapture(event.pointerId);
      item.dataset.reordering = '';
      const scroller = scrollContainerOf(group);

      // The rows' corners and separators follow their order on screen.
      const markEdges = (place: number) => {
        const order = items.filter((element) => element !== item);
        order.splice(place, 0, item);
        for (const [index, element] of order.entries()) {
          element.dataset.reorderEdge = [
            index === 0 ? 'first' : '',
            index === order.length - 1 ? 'last' : '',
            order[index - 1] === item ? 'after' : '',
          ]
            .filter(Boolean)
            .join(' ');
        }
      };
      markEdges(from);

      const update = () => {
        const groupTop = group.getBoundingClientRect().top;
        const offset = Math.min(
          Math.max(clientY - groupTop - startY, -top),
          bottomLimit,
        );
        setOffset(item, offset, false);

        // The row's place: its leading edge past the middle of the rows
        // it's moved over (so it reaches the group's ends at any heights).
        to = from;
        for (const [index, rowTop] of tops.entries()) {
          const middle = rowTop + (heights[index] ?? 0) / 2;
          if (index < from && top + offset <= middle) to = Math.min(to, index);
          if (index > from && top + height + offset >= middle) {
            to = Math.max(to, index);
          }
        }
        for (const [index, element] of items.entries()) {
          if (index === from) continue;
          const below = index > from && index <= to;
          const above = index < from && index >= to;
          setOffset(element, (above ? height : 0) - (below ? height : 0), true);
        }
        markEdges(to);
      };

      const elapsedOf = frameElapsed();
      let frame = requestAnimationFrame(function scroll(time) {
        frame = requestAnimationFrame(scroll);
        const elapsed = elapsedOf(time);
        const { bottom, top: scrollerTop } =
          scroller === scroller.ownerDocument.scrollingElement
            ? { bottom: window.innerHeight, top: 0 }
            : scroller.getBoundingClientRect();
        const delta = edgeScrollDelta(clientY, scrollerTop, bottom, elapsed);
        if (delta === 0) return;

        const before = scroller.scrollTop;
        scroller.scrollTop += delta;
        if (scroller.scrollTop !== before) update();
      });

      const onMove = (moveEvent: globalThis.PointerEvent) => {
        if (moveEvent.pointerId !== event.pointerId) return;
        clientY = moveEvent.clientY;
        update();
      };

      const onEnd = (endEvent: globalThis.PointerEvent) => {
        if (endEvent.pointerId !== event.pointerId) return;
        cancelAnimationFrame(frame);
        grabber.removeEventListener('pointermove', onMove);
        grabber.removeEventListener('pointerup', onEnd);
        grabber.removeEventListener('pointercancel', onEnd);

        // Settles into its place, then commits.
        const place =
          to > from
            ? (tops[to] ?? 0) + (heights[to] ?? 0) - top - height
            : (tops[to] ?? 0) - top;
        const committed = endEvent.type === 'pointercancel' ? from : to;
        if (committed === from) {
          for (const element of items) setOffset(element, 0, true);
        } else {
          setOffset(item, place, true);
        }
        markEdges(committed);
        setTimeout(() => commit(items, from, committed), reorderDuration);
      };

      grabber.addEventListener('pointermove', onMove);
      grabber.addEventListener('pointerup', onEnd);
      grabber.addEventListener('pointercancel', onEnd);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      const target = grabberOf(event.target);
      if (!target) return;

      const items = [...group.children].filter(isItem);
      const from = items.indexOf(target.item);
      const to = from + (event.key === 'ArrowUp' ? -1 : 1);
      if (to < 0 || to >= items.length) return;

      event.preventDefault();
      onReorderRef.current?.(from, to);
    };

    group.addEventListener('pointerdown', onPointerDown);
    group.addEventListener('keydown', onKeyDown);

    return () => {
      group.removeEventListener('pointerdown', onPointerDown);
      group.removeEventListener('keydown', onKeyDown);
    };
  }, [groupRef]);
};

/** The rows of a section, on the list's background (inset: a card). */
// Clips swiped rows sideways only (and reordered rows' shadows).
const StyledGroup = forwardRef<HTMLElement, PartProps<'ul'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'ul',
      props: {
        'data-list-part': 'group',
        className: cn('uikit-list-group', className),
        ...props,
      },
      ref,
      render,
    }),
);

const Group = forwardRef<HTMLElement, ListGroupProps>(
  ({ onReorder, ...props }, ref) => {
    const groupRef = useForwardedRef<HTMLElement>(ref);
    useReorder(groupRef, onReorder);

    return (
      <StyledGroup
        ref={groupRef}
        {...props}
      />
    );
  },
);

// Rows.

/**
 * A swiped row's corners: a capsule up to Figma's tall rows (68px), taller
 * rows (e.g. Mail's) get rounded corners.
 */
const swipeRadius = 34;

/** A row's own controls (pressing them doesn't press a pressable row). */
const ownControl =
  'a, button, input, select, textarea, label, [role], [tabindex]';

// The row's box (see `Item`): its background, corners and states; with
// swipe actions, a horizontal scroll container (no scroll bar), its row in
// a track with room for the actions (and overswiping) on both sides, the
// row's offset its scroll position, snapping open or closed.
const StyledItem = forwardRef<HTMLElement, PartProps<'li'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'li',
      props: {
        'data-list-part': 'item',
        className: cn('uikit-list-item', className),
        ...useSecondaryClick(props),
      },
      ref,
      render,
    }),
);

const ItemContext = createContext<ItemContextValue | undefined>(undefined);

/** Closes the item whose swipe actions are open (one at a time). */
let closeOpenItem: (() => void) | undefined;

const swipeDuration = 300;
const swipeThreshold = 8;
/** A sideways scroll swiping a row ends after this long without scrolling. */
const scrollEndDelay = 150;
/**
 * How far a row arms overswiping, with any actions (also fewer, or
 * labelled ones): past 5 circles (5 × (44 + 10) + 16 + 10 + 8px;
 * Framework7: 1.2 times the actions' width), or half the row, if less (on
 * narrow screens), but at least one more action's width past its actions
 * (see `armDistance`). Released before, it doesn't.
 */
const overswipeArm = 304;
/** Armed (or disarmed), the outermost action's symbol moves quickly. */
const armDuration = 150;
/**
 * Actions fade in from this opacity as they scale in, and the others fade
 * to it while overswiping, until armed (iOS, measured: shapes, symbols and
 * labels each at 36%).
 */
const actionFade = 0.36;

const sides = ['leading', 'trailing'] as const;

const isRtl = (element: HTMLElement) =>
  getComputedStyle(element).direction === 'rtl';

/**
 * Overswipe (Framework7 iOS): widens the outermost action's shape by
 * `extra` px towards the row (`towardsRow`, physical), from the edge (its
 * negative margin keeps the action's size), its symbol and label centered in
 * it, as the row moves (`transition`).
 */
const stretchAction = (
  button: HTMLElement,
  extra: number,
  towardsRow: number,
  transition: (...properties: string[]) => string,
) => {
  const [shape, label] = button.children;
  if (!(shape instanceof HTMLElement) || !(label instanceof HTMLElement)) {
    return;
  }

  const width = button.offsetWidth;
  const margin = extra > 0 ? `${-extra}px` : '';
  // Armed, the symbol's box narrows to the action's size (see SwipeAction).
  button.style.setProperty('--uikit-list-action-width', `${width}px`);
  shape.style.transition = transition('width', 'margin');
  // In pixels (from and to its own size), to transition; cleared once the
  // row is closed (see `Item`).
  shape.style.width = `${width + Math.max(extra, 0)}px`;
  shape.style.marginLeft = towardsRow < 0 ? margin : '';
  shape.style.marginRight = towardsRow > 0 ? margin : '';
  label.style.transition = `${transition('translate')}, filter ${armDuration}ms`;
  label.style.translate = extra > 0 ? `${(towardsRow * extra) / 2}px` : '';
};

/** The outermost action of a side's actions (Framework7: overswipe). */
const outermostAction = (container: HTMLElement, side: Side) => {
  const buttons = [...container.children].filter(
    (child) => child instanceof HTMLElement,
  );

  return side === 'trailing' ? buttons.at(-1) : buttons.at(0);
};

/**
 * How far a row (`item`) is swiped to arm overswiping its side's actions
 * (`container`, `width` wide): `overswipeArm`, or half the row if less, but
 * at least its outermost action's width past them.
 */
const armDistance = (
  item: HTMLElement,
  container: HTMLElement,
  side: Side,
  width: number,
) =>
  Math.max(
    width + (outermostAction(container, side)?.offsetWidth ?? 0),
    Math.min(overswipeArm, item.offsetWidth / 2),
  );

/**
 * A swiped row's clip (`width` × `height`), its content moved `offset` px
 * (physical) within it (scrolled, see `Item`): its box, rounded at the side
 * the content leaves, so it slides away beneath that round end; over its
 * actions on the other side (beneath the row, see `Pin`).
 */
const rowPath = (width: number, height: number, offset: number) => {
  const radius = Math.min(swipeRadius, height / 2);

  if (offset <= 0) {
    return `path('M ${radius} 0 H ${width} V ${height} H ${radius} A ${radius} ${radius} 0 0 1 0 ${height - radius} V ${radius} A ${radius} ${radius} 0 0 1 ${radius} 0 Z')`;
  }

  const end = width - radius;
  return `path('M 0 0 H ${end} A ${radius} ${radius} 0 0 1 ${width} ${radius} V ${height - radius} A ${radius} ${radius} 0 0 1 ${end} ${height} H 0 Z')`;
};

/**
 * The scroll range each of a row's actions (`container`, on `side`) scales
 * in over, one after another from the edge, as the row uncovers them (see
 * `StyledSwipeAction`): in the row's scroll position (logical, its content
 * at rest at `lead`).
 */
const revealRanges = (container: HTMLElement, side: Side, lead: number) => {
  const width = container.offsetWidth;
  // Whether the row is on the container's left (the edge on its right).
  const rowOnLeft = (side === 'trailing') === !isRtl(container);

  for (const button of container.children) {
    if (!(button instanceof HTMLElement)) continue;

    // From the edge, uncovered from `start` to `start` + its width.
    const start = rowOnLeft
      ? width - button.offsetLeft - button.offsetWidth
      : button.offsetLeft;
    const end = start + button.offsetWidth;
    // Trailing: scrolled on; leading: scrolled back (reversed).
    const [from, to] =
      side === 'trailing'
        ? [lead + start, lead + end]
        : [lead - end, lead - start];
    button.style.setProperty('--uikit-list-action-reveal-from', `${from}px`);
    button.style.setProperty('--uikit-list-action-reveal-to', `${to}px`);
    button.style.setProperty(
      '--uikit-list-action-reveal-direction',
      side === 'trailing' ? 'normal' : 'reverse',
    );
  }
};

/**
 * Overswiping (the row's content moved `offset` px towards its inline end,
 * negative: its start, past its actions): the others follow the row, the
 * outermost action's shape fills the space up to them, from the edge (see
 * `stretchAction`), the others fading until it's armed; on across the
 * whole row, it pushes them out. Up to then, the
 * actions stay in place by themselves (see `Pin`) and scale in with the
 * scroll (see `StyledSwipeAction`).
 */
const placeRow = (
  item: HTMLElement,
  actions: Partial<Record<Side, HTMLElement>>,
  offset: number,
  animate: boolean,
  overswipes: (side: Side) => boolean,
) => {
  const direction = isRtl(item) ? -1 : 1;
  const transition = (...properties: string[]) =>
    properties
      .map((property) => `${property} ${animate ? swipeDuration : 0}ms`)
      .join(', ');

  // Rounded at the side the content leaves (changing with the side only); at
  // rest, none (the row's own corners, e.g. pressed, see `resetRow`).
  if (offset === 0) {
    item.style.removeProperty('clip-path');
  } else {
    const clipPath = rowPath(
      item.offsetWidth,
      item.offsetHeight,
      offset * direction,
    );
    if (item.style.clipPath !== clipPath) item.style.clipPath = clipPath;
  }

  for (const side of sides) {
    const container = actions[side];
    if (!container) continue;

    const width = container.offsetWidth;
    const revealed = Math.max(0, side === 'leading' ? offset : -offset);
    const extra = overswipes(side) ? Math.max(0, revealed - width) : 0;
    const outermost = outermostAction(container, side);
    const rowOnLeft = (side === 'trailing') === (direction === 1);
    const towardsRow = rowOnLeft ? -1 : 1;
    const arm = armDistance(item, container, side, width);
    const arming = Math.min(extra / (arm - width), 1);
    // Past the armed place, on across the whole row (see `snapPlaces`): the
    // outermost action takes the others' room too (up to 16px from the
    // row's end, as from the edge), pushing them out, fading.
    const full = item.clientWidth;
    const armed = Math.min(2 * arm - width, full);
    const pushing =
      extra > 0 && full > armed
        ? Math.min(Math.max((revealed - armed) / (full - armed), 0), 1)
        : 0;
    const pushed =
      pushing * Math.max(0, width - (outermost?.offsetWidth ?? 0) - 2 * 16);

    for (const button of container.children) {
      if (!(button instanceof HTMLElement)) continue;

      if (button === outermost) {
        stretchAction(button, extra + pushed, towardsRow, transition);
        continue;
      }
      button.style.setProperty(
        '--uikit-list-action-arming',
        String((1 - (1 - actionFade) * arming) * (1 - pushing)),
      );
      button.style.translate =
        extra > 0 ? `${towardsRow * (extra + pushed)}px` : '';
    }
  }
};

/**
 * Whether a press belongs to a control of its own: text entry, a switch or
 * slider, or anything capturing the pointer (e.g. a `Switch` being dragged) —
 * but the touched element itself, which touch captures implicitly.
 */
const isOwnGesture = (item: HTMLElement, event: PointerEvent<HTMLElement>) => {
  const { pointerId, pointerType, target } = event;
  if (!(target instanceof Element)) return false;
  if (
    target.closest(
      'input, textarea, select, [contenteditable], [role="switch"], [role="slider"]',
    )
  ) {
    return true;
  }

  for (
    let element: Element | null = target;
    element && element !== item;
    element = element.parentElement
  ) {
    if (pointerType === 'touch' && element === target) continue;
    if (element.hasPointerCapture(pointerId)) return true;
  }

  return false;
};

// The layer a swipeable row's actions are in (see `SwipeActions`): beneath
// the row, as wide as it, stuck to the scrollport's start, so it stays in
// place while the row scrolls (natively, in every frame). At the track's
// start (a margin would keep it from moving there: sticky boxes stay in
// their containing block with their margins).
const Pin = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-list-pin', className)}
      data-list-part="pin"
      {...props}
    />
  ),
);

/** The layer a row's swipe actions are rendered in (see `Pin`). */
const PinContext = createContext<HTMLElement | null>(null);

/**
 * The snap points of a swipeable row (see `Item`): closed, open, armed
 * (twice the arming distance past the actions, so released past that
 * distance, it snaps there or on), and overswiped (across the whole row).
 */
const snapPoints = [
  'closed',
  'leading',
  'leadingArmed',
  'leadingOverswipe',
  'trailing',
  'trailingArmed',
  'trailingOverswipe',
] as const;

type SnapPoint = (typeof snapPoints)[number];

/**
 * Where a row snaps armed: twice the arming distance from its place, past
 * its actions (or across the whole row, if less, see `snapPlaces`).
 */
const armedPlace = (swipe: Swipe, side: Side) =>
  Math.min(
    2 * (swipe.arms[side] ?? 0) - (swipe.widths[side] ?? 0),
    swipe.extents[side] ?? 0,
  );

/** Where a row snaps (see `snapPoints`), in its track (its content at rest at `lead`). */
const snapPlaces = (
  swipe: Swipe,
  lead: number,
  overswipes: (side: Side) => boolean,
) => {
  const places: Partial<Record<SnapPoint, number>> = { closed: lead };
  for (const side of sides) {
    const { [side]: width } = swipe.widths;
    if (width === undefined) continue;
    const sign = side === 'leading' ? -1 : 1;
    places[side] = lead + sign * width;
    if (!overswipes(side)) continue;
    const extent = swipe.extents[side] ?? 0;
    const armed = armedPlace(swipe, side);
    if (armed < extent) places[`${side}Armed`] = lead + sign * armed;
    places[`${side}Overswipe`] = lead + sign * extent;
  }

  return places;
};

/** Whether the browser fires `scrollend` (else: a pause in scrolling). */
const scrollEnds = typeof window !== 'undefined' && 'onscrollend' in window;

/**
 * A row (UIKit `UITableViewCell`), with optional swipe actions. With a click
 * handler, it's pressable itself (e.g. passing the click on to a control in
 * it), but where its own controls are pressed.
 *
 * With swipe actions, it scrolls sideways natively (touch, trackpads,
 * wheels, with their inertia; dragged with a mouse, as it moves), snapping
 * closed, open, or overswiped: across the whole row, the outermost action
 * filling it (armed, it no longer snaps open). The overswipe triggers only
 * once the scroll comes to rest there, so scrolling back disarms it.
 */
const Item = forwardRef<HTMLElement, ListItemProps>((itemProps, ref) => {
  const {
    children,
    onBlurCapture,
    onClickCapture,
    onLostPointerCapture,
    onPointerCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    level,
    selected,
    style,
    ...props
  } = useSecondaryClick(itemProps);
  const itemRef = useForwardedRef<HTMLElement>(ref);
  const actionsRef = useRef<Partial<Record<Side, HTMLElement>>>({});
  const overswipeRef = useRef<Partial<Record<Side, Overswipe>>>({});
  const snapsRef = useRef<Partial<Record<SnapPoint, HTMLElement | null>>>({});
  const swipeRef = useRef<Swipe>({ arms: {}, extents: {}, widths: {} });
  const placesRef = useRef<Partial<Record<SnapPoint, number>>>({});
  // Closing (scrolling back, e.g. from across the row): not arming.
  const closingRef = useRef(false);
  // A touch is down on the row (it isn't at rest yet).
  const touchingRef = useRef(false);
  // Swiped (touch, a mouse drag; not scrolled), until at rest again.
  const swipingRef = useRef(false);
  // Open, at rest there (see `overswipable`).
  const restingOpenRef = useRef(false);
  const dragRef = useRef<Drag | null>(null);
  const pressRef = useRef<{ pointerId: number; x: number; y: number } | null>(
    null,
  );
  const openSideRef = useRef<Side | undefined>(undefined);
  const suppressClickRef = useRef(false);
  const settleRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const outsideRef = useRef<((event: Event) => void) | undefined>(undefined);
  const [swipeable, setSwipeable] = useState(false);
  const [pin, setPin] = useState<HTMLElement | null>(null);

  const overswipes = (side: Side) => Boolean(overswipeRef.current[side]);

  // The track's room before the row (the leading side's extent).
  const lead = () => swipeRef.current.extents.leading ?? 0;

  // The row's offset (towards its inline end), from the scroll position.
  const offsetOf = (item: HTMLElement) =>
    isRtl(item) ? item.scrollLeft + lead() : lead() - item.scrollLeft;

  // Overswiping a side: swiped (touch, a mouse drag) in one go; scrolled
  // (wheels, trackpads), only once it's open at rest (the scroll opening it
  // stops there).
  const overswipable = (side: Side) =>
    swipingRef.current ||
    (openSideRef.current === side && restingOpenRef.current);
  const overswipesNow = (side: Side) => overswipes(side) && overswipable(side);

  // The snap points (see `snapPlaces`). Open, the other side's actions
  // don't open (scrolled past closed, the row snaps back closed): only from
  // closed; overswiped, only as above. (They change at rest, or as a touch
  // starts, only: changed while scrolling, browsers snap at once.) Safari
  // snaps to the point at the same place in their order once they change
  // (e.g. armed, shown before closed as a touch starts), so the row is put
  // back where it was.
  const showSnaps = () => {
    const { current: item } = itemRef;
    const scrollLeft = item?.scrollLeft;
    const { current: openSide } = openSideRef;
    for (const point of snapPoints) {
      const snap = snapsRef.current[point];
      if (!snap) continue;
      const side: Side = point.startsWith('leading') ? 'leading' : 'trailing';
      const overswiping =
        point.endsWith('Armed') || point.endsWith('Overswipe');
      snap.hidden =
        placesRef.current[point] === undefined ||
        (openSide !== undefined && point !== 'closed' && side !== openSide) ||
        (overswiping && !overswipable(side));
    }
    if (item && scrollLeft !== undefined && item.scrollLeft !== scrollLeft) {
      item.scrollLeft = scrollLeft;
    }
  };

  const scrollTo = (offset: number, smooth: boolean) => {
    const { current: item } = itemRef;
    if (!item) return;
    const rtl = isRtl(item);
    const left = rtl ? offset - lead() : lead() - offset;
    item.scrollTo({ behavior: smooth ? 'smooth' : 'instant', left });
  };

  // Measures the actions (and the row) for the track's room and snap
  // points, keeping the row where it is (closed, or open).
  const measure = () => {
    const { current: item } = itemRef;
    if (!item) return;
    const swipe: Swipe = { arms: {}, extents: {}, widths: {} };
    for (const side of sides) {
      const { [side]: container } = actionsRef.current;
      if (!container) continue;
      const width = container.offsetWidth;
      const arm = armDistance(item, container, side, width);
      swipe.widths[side] = width;
      swipe.arms[side] = arm;
      // Overswiping across the whole row.
      swipe.extents[side] = overswipes(side) ? item.clientWidth : width;
    }
    swipeRef.current = swipe;
    item.style.setProperty('--uikit-list-swipe-lead', `${String(lead())}px`);
    item.style.setProperty(
      '--uikit-list-swipe-trail',
      `${String(swipe.extents.trailing ?? 0)}px`,
    );

    const places = snapPlaces(swipe, lead(), overswipes);
    placesRef.current = places;
    for (const side of sides) {
      const { [side]: container } = actionsRef.current;
      if (container) revealRanges(container, side, lead());
    }

    for (const point of snapPoints) {
      const snap = snapsRef.current[point];
      if (!snap) continue;
      const place = places[point];
      snap.hidden = place === undefined;
      snap.style.insetInlineStart = `${String(place ?? 0)}px`;
    }

    const { current: side } = openSideRef;
    const offset = side
      ? (side === 'leading' ? 1 : -1) * (swipe.widths[side] ?? 0)
      : 0;
    scrollTo(offset, false);
  };
  const measureRef = useRef(measure);
  useLayoutEffect(() => {
    measureRef.current = measure;
  });

  // Back in place: no longer a capsule, its actions reset.
  const resetRow = (item: HTMLElement) => {
    delete item.dataset.swipe;
    for (const button of item.querySelectorAll<HTMLElement>('[data-armed]')) {
      delete button.dataset.armed;
    }
    for (const shape of item.querySelectorAll<HTMLElement>(
      '[data-list-part=swipe-action-shape]',
    )) {
      shape.style.removeProperty('width');
    }
    item.style.removeProperty('clip-path');
  };

  const context = useMemo<ItemContextValue>(() => {
    const value: ItemContextValue = {
      close: () => {
        if (outsideRef.current) {
          document.removeEventListener('pointerdown', outsideRef.current, {
            capture: true,
          });
          outsideRef.current = undefined;
        }
        if (closeOpenItem === value.close) closeOpenItem = undefined;
        openSideRef.current = undefined;
        restingOpenRef.current = false;
        closingRef.current = true;
        // (Its snap points change once closed, see `settle`.)
        scrollTo(0, true);
      },
      open: (side) => {
        const { current: item } = itemRef;
        const width = swipeRef.current.widths[side];
        if (!item || width === undefined) return;

        if (closeOpenItem !== value.close) closeOpenItem?.();
        closeOpenItem = value.close;
        if (openSideRef.current !== side) restingOpenRef.current = false;
        openSideRef.current = side;
        showSnaps();
        scrollTo((side === 'leading' ? 1 : -1) * width, true);

        if (outsideRef.current) return;
        outsideRef.current = (event) => {
          if (event.target instanceof Node && item.contains(event.target)) {
            return;
          }
          value.close();
        };
        document.addEventListener('pointerdown', outsideRef.current, {
          capture: true,
        });
      },
      setActions: (side, element, overswipe = false) => {
        overswipeRef.current[side] = overswipe;
        if (element) {
          actionsRef.current[side] = element;
        } else {
          delete actionsRef.current[side];
        }
        setSwipeable(
          Boolean(actionsRef.current.leading ?? actionsRef.current.trailing),
        );
        measureRef.current();
      },
    };

    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once
  }, [itemRef]);

  useEffect(
    () => () => {
      if (closeOpenItem === context.close) closeOpenItem = undefined;
      if (outsideRef.current) {
        document.removeEventListener('pointerdown', outsideRef.current, {
          capture: true,
        });
      }
      clearTimeout(settleRef.current);
    },
    [context],
  );

  const suppressClick = () => {
    suppressClickRef.current = true;
    setTimeout(() => {
      suppressClickRef.current = false;
    });
  };

  // Overswiped (at rest there): the outermost action is triggered (and
  // closes the row), or the handler.
  const trigger = (side: Side) => {
    const { [side]: container } = actionsRef.current;
    const { [side]: action } = overswipeRef.current;
    if (typeof action === 'function') {
      action();
      context.close();
      return;
    }
    if (container) outermostAction(container, side)?.click();
  };

  // The scroll at rest (not touched): overswiped (armed, or across the
  // whole row: triggering there), open or closed.
  const settle = () => {
    const { current: item } = itemRef;
    if (!item || dragRef.current?.moved || touchingRef.current) return;
    item.style.removeProperty('scroll-snap-type');
    const offset = offsetOf(item);
    const side: Side = offset > 0 ? 'leading' : 'trailing';
    const distance = Math.abs(offset);
    const { [side]: width = 0 } = swipeRef.current.widths;
    const { [side]: extent = 0 } = swipeRef.current.extents;
    const { [side]: arm = Infinity } = swipeRef.current.arms;

    closingRef.current = false;
    if (distance < 1) {
      swipingRef.current = false;
      restingOpenRef.current = false;
      openSideRef.current = undefined;
      showSnaps();
      if (closeOpenItem === context.close) closeOpenItem = undefined;
      resetRow(item);
      return;
    }
    if (overswipesNow(side) && distance > arm) {
      // Held between snap points (no `scrollend`): not yet.
      if (distance < armedPlace(swipeRef.current, side) - 1) return;
      // Across the whole row first (settling there again).
      if (distance < extent - 1) {
        scrollTo((side === 'leading' ? 1 : -1) * extent, true);
        return;
      }
      trigger(side);
      return;
    }
    swipingRef.current = false;
    if (Math.abs(distance - width) < 1) {
      if (openSideRef.current !== side) context.open(side);
      restingOpenRef.current = true;
    }
    showSnaps();
  };

  // Scrolled (by any means): the row's actions follow, overswiping arms
  // past its distance.
  const onScroll = () => {
    const { current: item } = itemRef;
    if (!item) return;
    const offset = offsetOf(item);
    const side: Side = offset > 0 ? 'leading' : 'trailing';
    if (Math.abs(offset) >= 1) {
      item.dataset.swipe = side;
      if (closeOpenItem && closeOpenItem !== context.close) closeOpenItem();
    }
    placeRow(item, actionsRef.current, offset, false, overswipesNow);

    const { [side]: arm = Infinity } = swipeRef.current.arms;
    const armed =
      !closingRef.current && overswipesNow(side) && Math.abs(offset) > arm;
    for (const key of sides) {
      const { [key]: actions } = actionsRef.current;
      const action = actions && outermostAction(actions, key);
      action?.toggleAttribute('data-armed', armed && key === side);
    }

    if (scrollEnds) return;
    clearTimeout(settleRef.current);
    settleRef.current = setTimeout(settle, scrollEndDelay);
  };

  // At rest: once scrolling ends (and a touch is lifted).
  const settleNowRef = useRef(settle);
  const showSnapsRef = useRef(showSnaps);
  useLayoutEffect(() => {
    settleNowRef.current = settle;
    showSnapsRef.current = showSnaps;
  });
  useEffect(() => {
    const { current: item } = itemRef;
    if (!item || !swipeable) return undefined;
    const onScrollEnd = () => settleNowRef.current();
    const onTouchStart = () => {
      touchingRef.current = true;
      // Swiped: overswiping in one go (see `overswipable`).
      swipingRef.current = true;
      showSnapsRef.current();
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length > 0) return;
      touchingRef.current = false;
      clearTimeout(settleRef.current);
      settleRef.current = setTimeout(onScrollEnd, scrollEndDelay);
    };
    item.addEventListener('scrollend', onScrollEnd);
    item.addEventListener('touchstart', onTouchStart, { passive: true });
    item.addEventListener('touchend', onTouchEnd);
    item.addEventListener('touchcancel', onTouchEnd);
    return () => {
      item.removeEventListener('scrollend', onScrollEnd);
      item.removeEventListener('touchstart', onTouchStart);
      item.removeEventListener('touchend', onTouchEnd);
      item.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [itemRef, swipeable]);

  useLayoutEffect(() => {
    const { current: item } = itemRef;
    if (!item || !swipeable) return undefined;
    measureRef.current();
    const observer = new ResizeObserver(() => measureRef.current());
    observer.observe(item);
    for (const side of sides) {
      const { [side]: container } = actionsRef.current;
      if (container) observer.observe(container);
    }
    return () => observer.disconnect();
  }, [itemRef, swipeable]);

  const release = () => {
    if (itemRef.current) delete itemRef.current.dataset.pressed;
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    (onPointerDown as Handler<typeof event>)?.(event);

    const { current: item } = itemRef;
    const { current: actions } = actionsRef;
    if (event.button !== 0 || !item) return;

    const { target } = event;
    const control =
      target instanceof Element ? target.closest(ownControl) : null;
    if (props.onClick && !(control && item.contains(control))) {
      item.dataset.pressed = '';
    }
    if (
      !swipeable ||
      sides.some((side) => actions[side]?.contains(event.target as Node | null))
    ) {
      return;
    }
    pressRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    // Touch scrolls natively; a mouse drags the scroll position.
    if (event.pointerType !== 'mouse' || isOwnGesture(item, event)) return;
    dragRef.current = {
      base: offsetOf(item),
      moved: false,
      pointerId: event.pointerId,
      scroll: item.scrollLeft,
      time: performance.now(),
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    (onPointerMove as Handler<typeof event>)?.(event);

    const { current: drag } = dragRef;
    const { current: item } = itemRef;
    if (!item || drag?.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.x;
    if (!drag.moved) {
      const vertical = Math.abs(event.clientY - drag.y);
      if (vertical > swipeThreshold && vertical > Math.abs(dx)) {
        dragRef.current = null;
        return;
      }
      if (Math.abs(dx) < swipeThreshold) return;

      drag.moved = true;
      // Swiped: overswiping in one go (see `overswipable`).
      swipingRef.current = true;
      release();
      item.setPointerCapture(event.pointerId);
      item.style.scrollSnapType = 'none';
      showSnaps();
    }

    // The content follows the pointer.
    item.scrollLeft = drag.scroll - dx;
  };

  // A mouse drag released: overswiped (armed), opened (past half its
  // actions, or quickly towards them) or closed, scrolling there.
  const endDrag = (drag: Drag, cancelled: boolean) => {
    const { current: item } = itemRef;
    if (!item) return;
    const offset = offsetOf(item);
    const side: Side = offset > 0 ? 'leading' : 'trailing';
    const distance = Math.abs(offset);
    const { [side]: width } = swipeRef.current.widths;
    const { [side]: arm = Infinity } = swipeRef.current.arms;

    suppressClick();
    // Open, the other side doesn't (see `showSnaps`).
    const locked =
      openSideRef.current !== undefined && openSideRef.current !== side;
    // Across the whole row, triggering there (see `settle`): not snapping
    // until then (which would start where it is).
    if (!locked && !cancelled && overswipesNow(side) && distance > arm) {
      const { [side]: extent = 0 } = swipeRef.current.extents;
      scrollTo((side === 'leading' ? 1 : -1) * extent, true);
      return;
    }
    // Not overswiped: no longer, before snapping again (which would snap to
    // where it's dragged, as far as overswiped).
    swipingRef.current = false;
    showSnaps();
    item.style.removeProperty('scroll-snap-type');
    if (locked || cancelled || width === undefined || distance < 1) {
      context.close();
      return;
    }
    const moved = offset - drag.base;
    const quick = performance.now() - drag.time < 300;
    const towards = side === 'leading' ? moved > 10 : moved < -10;
    if (quick ? towards : distance > width / 2) {
      context.open(side);
    } else {
      context.close();
    }
  };

  const finish = (event: PointerEvent<HTMLElement>, cancelled: boolean) => {
    const { current: press } = pressRef;
    const { current: drag } = dragRef;
    if (press?.pointerId === event.pointerId) pressRef.current = null;
    if (drag?.pointerId === event.pointerId) {
      dragRef.current = null;
      if (drag.moved) {
        endDrag(drag, cancelled);
        return;
      }
    }
    if (press?.pointerId !== event.pointerId) return;

    // A tap on an open row closes it.
    const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
    if (!cancelled && moved < swipeThreshold && openSideRef.current) {
      context.close();
      suppressClick();
    }
  };

  const handleBlurCapture = (event: FocusEvent<HTMLElement>) => {
    (onBlurCapture as Handler<typeof event>)?.(event);

    const { current: item } = itemRef;
    if (!openSideRef.current || !item) return;

    const { relatedTarget } = event;
    if (relatedTarget instanceof Node && item.contains(relatedTarget)) {
      return;
    }

    context.close();
  };

  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    (onClickCapture as Handler<typeof event>)?.(event);
    if (!suppressClickRef.current) return;

    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <ItemContext.Provider value={context}>
      <StyledItem
        ref={itemRef}
        aria-current={selected ? 'true' : undefined}
        data-clickable={props.onClick ? '' : undefined}
        data-selected={selected ? '' : undefined}
        data-swipeable={swipeable ? '' : undefined}
        style={withStyle(
          {
            '--uikit-list-level':
              level === undefined ? undefined : String(level),
          },
          style,
        )}
        {...props}
        onBlurCapture={handleBlurCapture}
        onClickCapture={handleClickCapture}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onScroll={swipeable ? onScroll : undefined}
        onLostPointerCapture={(event: PointerEvent<HTMLElement>) => {
          (onLostPointerCapture as Handler<typeof event>)?.(event);
          // Only the row's own capture: taking it over from the touched
          // element (implicitly captured) makes that lose its capture.
          if (event.target !== event.currentTarget) return;
          finish(event, false);
        }}
        onPointerCancel={(event: PointerEvent<HTMLElement>) => {
          (onPointerCancel as Handler<typeof event>)?.(event);
          release();
          finish(event, true);
        }}
        onPointerUp={(event: PointerEvent<HTMLElement>) => {
          (onPointerUp as Handler<typeof event>)?.(event);
          release();
          finish(event, false);
        }}
      >
        {/* The track a swipeable row scrolls in (see `Item`): the row, with
           room for its actions (and overswiping) on both sides. */}
        <div
          className="uikit-list-track"
          data-list-part="track"
        >
          <Pin ref={setPin} />
          {swipeable
            ? snapPoints.map((point) => (
                // Where a swipeable row snaps (see `Item`), in the track.
                // Closed, it stops even when flung: closing one side doesn't
                // open the other.
                <span
                  key={point}
                  ref={(element: HTMLElement | null) => {
                    snapsRef.current[point] = element;
                  }}
                  hidden
                  aria-hidden="true"
                  className="uikit-list-snap"
                  data-closed={point === 'closed' ? '' : undefined}
                  data-list-part="snap"
                />
              ))
            : null}
          <PinContext.Provider value={pin}>
            {/* The row's content: a grid of its parts (see above), with its
               separator; in its item, offset by the item's leading swipe room
               (see `Item`). */}
            <div
              className="uikit-list-row"
              data-list-part="row"
            >
              {children}
            </div>
          </PinContext.Provider>
        </div>
      </StyledItem>
    </ItemContext.Provider>
  );
});

/** How long an expandable row opens or closes (as swiping). */
const expandDuration = 300;

/**
 * An expandable row: a row shown or not (`open`), opening and closing in
 * place, e.g. an inline `Calendar` or `TimeRoll` below a row with a
 * `DatePicker` (without popovers, as iOS's Calendar). Closed, it's inert.
 */
// Uncontrolled (or controlled) expandable rows: `ExpandableRoot` holds the
// state (no element of its own, so its rows stay a group's children), its
// `ExpandableTrigger` (e.g. the row's title, `render`) toggles it, its
// `Expandable` shows it.
const ExpandableContext = createContext<ExpandableContextValue | undefined>(
  undefined,
);

/** An expandable row's state, for its trigger and the row (no element). */
const ExpandableRoot: FunctionComponent<ListExpandableRootProps> = ({
  children,
  defaultOpen = false,
  onOpenChange,
  open: openProp,
}) => {
  const id = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const context = useMemo<ExpandableContextValue>(
    () => ({
      id,
      open,
      setOpen: (next, event) => {
        onOpenChange?.(next, event);
        if (openProp === undefined) setUncontrolled(next);
      },
    }),
    [id, onOpenChange, open, openProp],
  );

  return (
    <ExpandableContext.Provider value={context}>
      {children}
    </ExpandableContext.Provider>
  );
};

/**
 * Toggles its `ExpandableRoot`'s row: a button (e.g. rendered by a row's
 * `Title`, making the row pressable), with `aria-expanded` and
 * `aria-controls`.
 */
const ExpandableTrigger = forwardRef<HTMLElement, PartProps<'button'>>(
  ({ onClick, render, ...props }, ref) => {
    const expandable = useContext(ExpandableContext);

    return useRender({
      defaultTagName: 'button',
      props: {
        'aria-controls': expandable?.id,
        'aria-expanded': expandable?.open ?? false,
        'data-list-part': 'expandable-trigger',
        type: 'button',
        ...props,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (onClick as Handler<typeof event>)?.(event);
          if (event.defaultPrevented || !expandable) return;
          expandable.setOpen(!expandable.open, event);
        },
      },
      ref,
      render,
    });
  },
);

const Expandable = forwardRef<HTMLElement, ListExpandableProps>(
  ({ id, open: openProp, ...props }, ref) => {
    const expandable = useContext(ExpandableContext);
    const open = openProp ?? expandable?.open ?? false;
    const itemRef = useForwardedRef<HTMLElement>(ref);
    const shown = useRef<boolean | undefined>(undefined);

    useLayoutEffect(() => {
      const { current: item } = itemRef;
      if (!item) return undefined;
      const was = shown.current;
      shown.current = open;

      const settle = () => {
        item.toggleAttribute('data-closed', !open);
        item.inert = !open;
      };
      if (was === undefined || was === open) {
        settle();
        return undefined;
      }

      // From its height as it is, to the other state's. Opening, it's
      // measured open; closing, it closes once the animation finishes (its
      // content shrinking at once, a scroll container could scroll back).
      // eslint-disable-next-line unicorn/no-unnecessary-parameters
      const box = (element: HTMLElement) => {
        const style = getComputedStyle(element);
        return {
          height: `${String(element.offsetHeight)}px`,
          paddingBottom: style.paddingBottom,
          paddingTop: style.paddingTop,
        };
      };
      const closed = { height: '0px', paddingBottom: '0px', paddingTop: '0px' };
      const from = open ? closed : box(item);
      if (open) settle();
      const to = open ? box(item) : closed;
      item.inert = !open;

      item.style.overflow = 'clip';
      const animation = item.animate(
        [
          {
            ...from,
            minHeight: '0px',
            opacity: open ? 0 : 1,
            visibility: 'visible',
          },
          {
            ...to,
            minHeight: '0px',
            opacity: open ? 1 : 0,
            visibility: 'visible',
          },
        ],
        { duration: expandDuration, easing: 'ease' },
      );
      const done = () => {
        item.style.removeProperty('overflow');
        if (!open) settle();
      };
      animation.finished.then(done).catch(() => undefined);

      return () => {
        animation.cancel();
        item.style.removeProperty('overflow');
        settle();
      };
    }, [itemRef, open]);

    return (
      <Item
        ref={itemRef}
        id={id ?? expandable?.id}
        {...props}
      />
    );
  },
);

// Figma “Title”; as a link or button (`render`), it makes the row pressable.
const Title = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'title',
        className: cn('uikit-list-title', className),
        draggable: false,
        ...props,
      },
      ref,
      render,
    }),
);

// Figma “Subtitle” (rows), “Supertitle” and “Subtitle” (headers).
const Subtitle = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'subtitle',
        className: cn('uikit-list-subtitle', className),
        ...props,
      },
      ref,
      render,
    }),
);

/**
 * Body text below a row's title and subtitle, making it a media row (as in
 * Mail; Framework7 `.media-list` `.item-text`).
 */
const Text = forwardRef<HTMLElement, ListTextProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'text',
        className: cn('uikit-list-text', className),
        ...props,
      },
      ref,
      render,
    }),
);

const Supertitle = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'supertitle',
        className: cn('uikit-list-supertitle', className),
        ...props,
      },
      ref,
      render,
    }),
);

// Figma “Detail”.
const Detail = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'detail',
        className: cn('uikit-list-detail', className),
        ...props,
      },
      ref,
      render,
    }),
);

// Figma “_Images”: a symbol, or an image (`img`, `video`, `canvas` filling
// it, or a symbol) in a rounded, circular or square frame.
const Image = forwardRef<HTMLElement, ListImageProps>(
  ({ className, render, variant = 'symbol', ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'image',
        'data-variant': variant,
        className: cn('uikit-list-image', className),
        ...props,
      },
      ref,
      render,
    }),
);

// Figma “Symbol” and “Info”: a symbol in the tint color, pressable as a
// link or button (`render`).
const Accessory = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'accessory',
        className: cn('uikit-list-accessory', className),
        ...props,
      },
      ref,
      render,
    }),
);

// Figma “Checkmark” (􀆅, 17px, 590).
const Checkmark = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'checkmark',
        className: cn('uikit-list-checkmark', className),
        children: children ?? <Check />,
        ...props,
      },
      ref,
      render,
    }),
);

// Figma “Drill-in” (􀆊, 17px, 590).
const DrillIn = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'drill-in',
        className: cn('uikit-list-drill-in', className),
        'aria-hidden': 'true',
        children: children ?? <Chevron />,
        ...props,
      },
      ref,
      render,
    }),
);

// Figma “Disclosure” (rows: 17px, headers: 19px, 590, in the tint color),
// turned down while open (e.g. in a Base UI `Collapsible.Trigger`).
const Disclosure = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, className, render, ...props }, ref) => {
    // Turned down while its row's expandable row is open (see
    // `ExpandableRoot`).
    const expandable = useContext(ExpandableContext);

    return useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'disclosure',
        'data-panel-open': expandable?.open ? '' : undefined,
        className: cn('uikit-list-disclosure', className),
        'aria-hidden': 'true',
        children: children ?? <Chevron />,
        ...props,
      },
      ref,
      render,
    });
  },
);

// Figma “_Grabber” (􀌇, 17px, 400).
/**
 * Figma “_Grabber”: drags its row to reorder its group (see `Group`
 * `onReorder`); focused, arrow keys move the row.
 */
const Grabber = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, className, onClick, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'grabber',
        className: cn('uikit-list-grabber', className),
        tabIndex: 0,
        children: children ?? <Lines />,
        ...props,
        // The click ending a drag (captured by the grabber, see `useReorder`)
        // stays with it: its row doesn't act on it (e.g. pass it on to its
        // checkbox, see `forwardClick`).
        onClick: (event: MouseEvent<HTMLElement>) => {
          (onClick as Handler<typeof event>)?.(event);
          event.stopPropagation();
        },
      },
      ref,
      render,
    }),
);

// Figma Type=Button (rows) and Type=Action (headers): text in the tint
// color.
const Action = forwardRef<HTMLElement, PartProps<'button'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'button',
      props: {
        'data-list-part': 'action',
        className: cn('uikit-list-action', className),
        type: 'button',
        ...useSecondaryClick(props),
      },
      ref,
      render,
    }),
);

// Figma “Row - Button”: a pressable row's title in the tint color.
const Button = forwardRef<HTMLElement, ListButtonProps>(
  ({ className, destructive, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'button',
      props: {
        'data-list-part': 'button',
        'data-destructive': destructive ? '' : undefined,
        className: cn('uikit-list-button', className),
        type: 'button',
        ...useSecondaryClick(props),
      },
      ref,
      render,
    }),
);

/** Figma State=Selected/Unselected: a checkbox (selecting rows). */
const Checkbox = forwardRef<HTMLElement, CheckboxRootProps>((props, ref) => (
  <CheckboxBase.Root
    ref={ref}
    data-list-part="edit"
    {...props}
  />
));

/**
 * A radio (selecting one row), as `Checkbox`; its group is a `RadioGroup`
 * (e.g. rendering a `Group`).
 */
const Radio = forwardRef<HTMLElement, RadioRootProps>((props, ref) => (
  <RadioBase.Root
    ref={ref}
    data-list-part="edit"
    {...props}
  />
));

const StyledEditButton = forwardRef<HTMLElement, ListEditButtonProps>(
  ({ className, editingStyle, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'button',
      props: {
        'data-list-part': 'edit',
        'data-editing-style': editingStyle,
        className: cn(
          'uikit-list-edit-button uikit-checkbox-edit-circle',
          className,
        ),
        type: 'button',
        ...useSecondaryClick(props),
      },
      ref,
      render,
    }),
);

/**
 * Figma State=Remove/Add; deleting opens the row's trailing swipe actions
 * (unless the click handler prevents it).
 */
const EditButton = forwardRef<HTMLElement, ListEditButtonProps>(
  ({ children, editingStyle = 'delete', onClick, ...props }, ref) => {
    const item = useContext(ItemContext);

    return (
      <StyledEditButton
        ref={ref}
        editingStyle={editingStyle}
        {...props}
        onClick={(event: MouseEvent<HTMLElement>) => {
          (onClick as Handler<typeof event>)?.(event);
          if (event.defaultPrevented || editingStyle !== 'delete') return;
          item?.open('trailing');
        }}
      >
        {children ?? <Sign plus={editingStyle === 'insert'} />}
      </StyledEditButton>
    );
  },
);

// Swipe actions (Figma “Row with Swipe Actions”, “_Swipe Actions”): shapes
// 10px apart, 10px from the row and 16px from the edge.

// Circles centered in the row, rounded rectangles 4px from its edges.
const StyledSwipeActions = forwardRef<
  HTMLElement,
  Omit<ListSwipeActionsProps, 'onOverswipe'>
>(({ className, overswipe, render, side, ...props }, ref) =>
  useRender({
    defaultTagName: 'div',
    props: {
      'data-list-part': 'swipe-actions',
      'data-overswipe': overswipe ? '' : undefined,
      'data-side': side,
      className: cn('uikit-list-swipe-actions', className),
      ...props,
    },
    ref,
    render,
  }),
);

const SwipeActions = forwardRef<HTMLElement, ListSwipeActionsProps>(
  (
    {
      onFocusCapture,
      onOverswipe,
      overswipe = false,
      side: sideProp = 'inline-end',
      ...props
    },
    ref,
  ) => {
    // (Internally: leading, trailing.)
    const side: Side = sideProp === 'inline-start' ? 'leading' : 'trailing';
    const item = useContext(ItemContext);
    const pin = useContext(PinContext);
    const elementRef = useForwardedRef<HTMLElement>(ref);

    // The latest handler, without setting the actions again.
    const onOverswipeRef = useRef(onOverswipe);
    useLayoutEffect(() => {
      onOverswipeRef.current = onOverswipe;
    });
    const hasHandler = onOverswipe !== undefined;

    useLayoutEffect(() => {
      const { current: element } = elementRef;
      if (!item || !element) return undefined;

      item.setActions(
        side,
        element,
        hasHandler ? () => onOverswipeRef.current?.() : overswipe,
      );

      return () => item.setActions(side, undefined);
    }, [elementRef, hasHandler, item, overswipe, pin, side]);

    // In the row's pin layer, staying in place as it scrolls (see `Pin`).
    if (!pin) return null;

    return createPortal(
      <StyledSwipeActions
        ref={elementRef}
        side={sideProp}
        {...props}
        onFocusCapture={(event: FocusEvent<HTMLElement>) => {
          (onFocusCapture as Handler<typeof event>)?.(event);
          item?.open(side);
        }}
      />,
      pin,
    );
  },
);

const StyledSwipeAction = forwardRef<
  HTMLElement,
  Omit<ListSwipeActionProps, 'label' | 'textColor' | 'tint'>
>(({ className, render, shape, showLabel, ...props }, ref) =>
  useRender({
    defaultTagName: 'button',
    props: {
      'data-list-part': 'swipe-action',
      'data-shape': shape,
      'data-show-label': showLabel ? '' : undefined,
      className: cn('uikit-list-swipe-action', className),
      type: 'button',
      ...useSecondaryClick(props),
    },
    ref,
    render,
  }),
);

/**
 * A swipe action: a symbol (or short text) in a shape, closing the actions
 * when clicked.
 */
const SwipeAction = forwardRef<HTMLElement, ListSwipeActionProps>(
  ({ children, label, onClick, style, textColor, tint, ...props }, ref) => {
    const item = useContext(ItemContext);

    return (
      <StyledSwipeAction
        ref={ref}
        aria-label={label}
        style={withStyle(
          {
            '--uikit-list-action-text-color': textColor,
            '--uikit-list-action-tint': tint,
          },
          style,
        )}
        {...props}
        onClick={(event: MouseEvent<HTMLElement>) => {
          (onClick as Handler<typeof event>)?.(event);
          item?.close();
        }}
      >
        <span data-list-part="swipe-action-shape">
          <span data-list-part="swipe-action-symbol">{children}</span>
        </span>
        <span
          aria-hidden="true"
          data-list-part="swipe-action-label"
        >
          {label}
        </span>
      </StyledSwipeAction>
    );
  },
);

// Headers (Figma “Header” Type, “Section Title”) and footers (Figma
// “Grouped Table Footer”).

const Header = forwardRef<HTMLElement, ListHeaderProps>(
  ({ className, prominence, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-list-part': 'header',
        'data-prominence': prominence,
        className: cn('uikit-list-header', className),
        ...props,
      },
      ref,
      render,
    }),
);

const Footer = forwardRef<HTMLElement, PartProps<'div'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-list-part': 'footer',
        className: cn('uikit-list-footer', className),
        ...props,
      },
      ref,
      render,
    }),
);

// Framework7 “Content Block” (`block.less`): text aligned with the rows'.
const Block = forwardRef<HTMLElement, ListBlockProps>(
  ({ className, render, strong, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-list-part': 'block',
        'data-strong': strong ? '' : undefined,
        className: cn('uikit-list-block', className),
        ...props,
      },
      ref,
      render,
    }),
);

// Index (Figma “Index Bar”; Framework7 “List Index”): letters in the tint
// color, selected by pressing or scrubbing over them (clicking each item).
// Placing it is up to the page (Framework7: at the page's edge), above the
// sticky headers of plain lists (z-index 2).

const StyledIndex = forwardRef<HTMLElement, ListIndexProps>(
  ({ className, render, size, ...props }, ref) =>
    useRender({
      defaultTagName: 'nav',
      props: {
        'data-list-part': 'index',
        'data-size': size,
        className: cn('uikit-list-index', className),
        ...props,
      },
      ref,
      render,
    }),
);

/** The index item nearest to `y`. */
const indexItemAt = (index: HTMLElement, y: number) => {
  let nearest: [HTMLElement, number] | undefined;

  for (const item of index.querySelectorAll('[data-list-part=index-item]')) {
    if (!(item instanceof HTMLElement)) continue;

    const { bottom, top } = item.getBoundingClientRect();
    const distance = Math.abs((top + bottom) / 2 - y);
    if (!nearest || distance < nearest[1]) nearest = [item, distance];
  }

  return nearest?.[0];
};

/** Clicks the index item nearest to `y`, once per item while scrubbing. */
const scrub = (index: HTMLElement, state: Scrub, y: number) => {
  const item = indexItemAt(index, y);
  if (!item || item === state.item) return;

  state.item = item;
  item.click();
};

const Index = forwardRef<HTMLElement, ListIndexProps>(
  (
    {
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const handlers = usePointerDrag<HTMLElement, Scrub>(
      {
        end: () => undefined,
        move: (index, state, event) => scrub(index, state, event.clientY),
        start: (index, event) => {
          // No text selection while scrubbing (from the mouse's default).
          event.preventDefault();
          const state: Scrub = {};
          scrub(index, state, event.clientY);

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
      <StyledIndex
        ref={ref}
        {...props}
        {...handlers}
      />
    );
  },
);

const IndexItem = forwardRef<HTMLElement, PartProps<'button'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'button',
      props: {
        'data-list-part': 'index-item',
        className: cn('uikit-list-index-item', className),
        type: 'button',
        ...useSecondaryClick(props),
      },
      ref,
      render,
    }),
);

/**
 * A row's click handler passing the click on to the control in it
 * (`selector`, e.g. `[role=switch]`), as iOS rows do, unless it was the
 * control's own: `<List.Item onClick={forwardClick('[role=switch]')}>`. As
 * the click it is: a pointer's (`detail` > 0) or a keyboard's (a control's
 * `click()` would be a keyboard's, so menus would open with their first
 * item highlighted).
 */
export const forwardClick =
  (selector: string) =>
  (event: MouseEvent<HTMLElement>): void => {
    const { currentTarget, target } = event;
    const control = currentTarget.querySelector<HTMLElement>(selector);
    if (!control || (target instanceof Node && control.contains(target))) {
      return;
    }
    control.dispatchEvent(new globalThis.MouseEvent('click', event));
  };

export const List = {
  Root,
  Section,
  Header,
  Group,
  Item,
  ExpandableRoot,
  ExpandableTrigger,
  Expandable,
  Footer,
  Block,
  Title,
  Subtitle,
  Supertitle,
  Text,
  Detail,
  Image,
  Accessory,
  Checkmark,
  DrillIn,
  Disclosure,
  Grabber,
  Action,
  Button,
  Checkbox,
  Radio,
  EditButton,
  SwipeActions,
  SwipeAction,
  Index,
  IndexItem,
};
