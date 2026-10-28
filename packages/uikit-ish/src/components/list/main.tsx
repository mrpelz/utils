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
  ReactNode,
  RefObject,
  useCallback,
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
  AccordionContextValue,
  CollapsibleContextValue,
  Drag,
  Handler,
  ItemContextValue,
  ListAccordionItemProps,
  ListAccordionRootProps,
  ListAllowSwipe,
  ListBlockProps,
  ListButtonProps,
  ListCollapsiblePanelProps,
  ListCollapsibleRootProps,
  ListEditButtonProps,
  ListEditing,
  ListGroupProps,
  ListHeaderProps,
  ListImageProps,
  ListIndexProps,
  ListItemProps,
  ListRootProps,
  ListSectionProps,
  ListSwipeActionProps,
  ListSwipeActionsProps,
  ListSwipeActionsTriggerProps,
  ListTextProps,
  ListWhileEditing,
  Overswipe,
  PanelContextValue,
  PartProps,
  Scrub,
  Side,
  Swipe,
  WhileEditingProps,
} from './props.js';

export type {
  ListAllowSwipe,
  ListBlockProps,
  ListButtonProps,
  ListEditButtonProps,
  ListEditing,
  ListAccordionItemProps,
  ListAccordionRootProps,
  ListCollapsibleChangeEventDetails,
  ListCollapsiblePanelProps,
  ListCollapsibleRootProps,
  ListGroupProps,
  ListHeaderProps,
  ListImageProps,
  ListIndexProps,
  ListItemProps,
  ListRootProps,
  ListSectionProps,
  ListStyle,
  ListSwipeActionProps,
  ListSwipeActionsProps,
  ListSwipeActionsTriggerProps,
  ListTextProps,
  ListWhileEditing,
} from './props.js';
import { createSwipeActionsHandle } from './swipe-actions-handle.js';

export {
  ListSwipeActionsHandle,
  useCreateSwipeActionsHandle,
} from './swipe-actions-handle.js';

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
// - Focusing a swipe action opens the actions. A trigger opens them
//   (`SwipeActionsTrigger`: in the row, or by a handle; e.g. rendering the
//   delete edit button), not the edit button itself.
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

// Root: the list's style, as custom properties for its parts (their
// fallbacks are `insetGrouped`'s, for parts outside of a root).

// Edit modes: the root's, its sections' (unless their own), their groups'
// (unless their own), their rows' (unless their own); each row marks its
// sides (see `Item`), its parts
// reacting by their `whileEditing` (see style.css).
const EditingContext = createContext<ListEditing>('ignore');

/** A part's `whileEditing`, as its attribute (see style.css). */
const whileEditingOf = (whileEditing?: ListWhileEditing) => ({
  'data-while-editing': whileEditing,
});

const StyledRoot = forwardRef<HTMLElement, Omit<ListRootProps, 'editing'>>(
  ({ className, listStyle, outline, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
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

/** A list (UIKit `UITableView`): sections of rows, headers and footers. */
const Root = forwardRef<HTMLElement, ListRootProps>(
  ({ editing = 'ignore', ...props }, ref) => (
    <EditingContext.Provider value={editing}>
      <StyledRoot
        ref={ref}
        {...props}
      />
    </EditingContext.Provider>
  ),
);

const StyledSection = forwardRef<
  HTMLElement,
  Omit<ListSectionProps, 'editing'>
>(({ className, render, ...props }, ref) =>
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

/** A section: an optional `Header`, a `Group` or `Block`, a `Footer`. */
const Section = forwardRef<HTMLElement, ListSectionProps>(
  ({ editing, ...props }, ref) => {
    const inherited = useContext(EditingContext);

    return (
      <EditingContext.Provider value={editing ?? inherited}>
        <StyledSection
          ref={ref}
          {...props}
        />
      </EditingContext.Provider>
    );
  },
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

const setOffset = (item: HTMLElement, offset: number, isAnimated: boolean) => {
  item.style.transition = isAnimated
    ? `transform ${reorderDuration}ms`
    : 'none';
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
      const clearOffsets = (isAnimated: boolean) => {
        settle.observer?.disconnect();
        clearTimeout(timeout);
        for (const element of items) {
          setOffset(element, 0, isAnimated);
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
          const isBelow = index > from && index <= to;
          const isAbove = index < from && index >= to;
          setOffset(
            element,
            (isAbove ? height : 0) - (isBelow ? height : 0),
            true,
          );
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
  ({ editing, onReorder, ...props }, ref) => {
    const groupRef = useForwardedRef<HTMLElement>(ref);
    const inherited = useContext(EditingContext);
    useReorder(groupRef, onReorder);

    return (
      <EditingContext.Provider value={editing ?? inherited}>
        <StyledGroup
          ref={groupRef}
          {...props}
        />
      </EditingContext.Provider>
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

/** A row's side in an edit mode: editing, not, or not managed. */
const editSide = (editing: ListEditing, side: 'leading' | 'trailing') => {
  if (editing === 'ignore') return undefined;
  return editing === side || editing === 'both' ? 'on' : 'off';
};

// The slots sliding in or out by their width (see style.css).
const sizedParts =
  ':scope > [data-list-part="row"] > :is([data-list-part="leading"], [data-list-part="trailing"])';

// A row's slots: its only children (see style.css).
const slots = new Set(['below', 'content', 'leading', 'span', 'trailing']);

// Rows already told about their foreign elements (see `useStrictSlots`).
const toldRows = new WeakSet<Element>();

/**
 * Warns (once per row) about elements of other components placed in a row
 * directly, not in one of its slots (`Leading`, `Content`, `Trailing`,
 * `Span`, `Below`): the row places only its own parts.
 */
const useStrictSlots = (itemRef: RefObject<HTMLElement | null>) => {
  useLayoutEffect(() => {
    const row = itemRef.current?.querySelector<HTMLElement>(
      ':scope > [data-list-part="track"] > [data-list-part="row"]',
    );
    if (!row || toldRows.has(row)) return;
    const foreign = [...row.children].filter(
      (child) =>
        !(
          child instanceof HTMLElement &&
          slots.has(child.dataset.listPart ?? '')
        ),
    );
    if (foreign.length === 0) return;
    toldRows.add(row);
    // eslint-disable-next-line no-console -- a misuse, told to the developer
    console.warn(
      'List.Item: a row holds only slots (List.Leading, List.Content, List.Trailing, List.Span, List.Below); parts and other elements go in them:',
      foreign,
    );
  });
};

/**
 * A managed row's slots sliding in or out in edit mode, their widths as
 * `--uikit-list-slot-size` (taking no room while out, see style.css).
 */
const useEditingSizes = (
  itemRef: RefObject<HTMLElement | null>,
  isManaged: boolean,
) => {
  useLayoutEffect(() => {
    const track = itemRef.current?.querySelector(
      ':scope > [data-list-part="track"]',
    );
    if (!isManaged || !(track instanceof HTMLElement)) return undefined;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const { target } of entries) {
        if (!(target instanceof HTMLElement)) continue;
        target.style.setProperty(
          '--uikit-list-slot-size',
          `${String(target.offsetWidth)}px`,
        );
      }
    });
    const observe = () => {
      resizeObserver.disconnect();
      for (const part of track.querySelectorAll(sizedParts)) {
        resizeObserver.observe(part);
      }
    };
    observe();
    const row = track.querySelector('[data-list-part="row"]');
    const mutationObserver = new MutationObserver(observe);
    if (row) mutationObserver.observe(row, { childList: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [itemRef, isManaged]);
};

/** Closes the item whose swipe actions are open (one at a time). */
let closeOpenItem: (() => void) | undefined;

const swipeDuration = 300;
const swipeThreshold = 8;
/** A sideways scroll swiping a row ends after this long without scrolling. */
const scrollEndDelay = 150;
// How long a wheel (or a trackpad's momentum) is quiet before a row it
// scrolled open is at rest there (see `settle`).
const wheelQuiet = 300;
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
  const isRowOnLeft = (side === 'trailing') === !isRtl(container);

  for (const button of container.children) {
    if (!(button instanceof HTMLElement)) continue;

    // From the edge, uncovered from `start` to `start` + its width.
    const start = isRowOnLeft
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
  isAnimated: boolean,
  overswipes: (side: Side) => boolean,
) => {
  const direction = isRtl(item) ? -1 : 1;
  const transition = (...properties: string[]) =>
    properties
      .map((property) => `${property} ${isAnimated ? swipeDuration : 0}ms`)
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
    const isRowOnLeft = (side === 'trailing') === (direction === 1);
    const towardsRow = isRowOnLeft ? -1 : 1;
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
const hasScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window;

/**
 * Whether a row dragged to `offset` (towards `side`) opens its actions
 * there when released: flicked towards them, or past half their `width`.
 */
const opensOnRelease = (
  drag: Drag,
  offset: number,
  side: Side,
  width: number | undefined,
) => {
  const distance = Math.abs(offset);
  if (width === undefined || distance < 1) return false;
  const moved = offset - drag.base;
  const isQuick = performance.now() - drag.time < 300;
  const isMovedTowards = side === 'leading' ? moved > 10 : moved < -10;
  return isQuick ? isMovedTowards : distance > width / 2;
};

/** How long a collapsible row opens or closes (as swiping). */
const expandDuration = 300;

// Rows opening and closing in place, as Base UI's Collapsible and Accordion
// (without elements of their own: a group's rows stay its children, a list
// having no other elements among them). A `CollapsibleRoot` (or an
// `AccordionItem`, its `AccordionRoot` holding which are open) holds the
// state, its `CollapsibleTrigger` (e.g. a row's title, `render`) toggles
// it, its `CollapsiblePanel` shows its rows.
const CollapsibleContext = createContext<CollapsibleContextValue | undefined>(
  undefined,
);

// A collapsible's rows' ids (see `useExpandedRow`), in mounting order: its
// trigger's `aria-controls`.
const useControls = () => {
  const [ids, setIds] = useState<readonly string[]>([]);
  const register = useCallback((id: string) => {
    setIds((current) => [...current, id]);
    return () => setIds((current) => current.filter((other) => other !== id));
  }, []);

  return [ids.join(' ') || undefined, register] as const;
};

/**
 * Rows' state (Base UI `Collapsible.Root`), for their trigger and them; no
 * element of its own.
 */
const CollapsibleRoot: FunctionComponent<ListCollapsibleRootProps> = ({
  children,
  defaultOpen = false,
  disabled = false,
  onOpenChange,
  open: openProp,
}) => {
  const [isUncontrolled, setIsUncontrolled] = useState(defaultOpen);
  const isOpen = openProp ?? isUncontrolled;
  const [controls, register] = useControls();
  const context = useMemo<CollapsibleContextValue>(
    () => ({
      controls,
      disabled,
      isOpen,
      register,
      setOpen: (isNextOpen, eventDetails) => {
        onOpenChange?.(isNextOpen, eventDetails);
        if (openProp === undefined) setIsUncontrolled(isNextOpen);
      },
    }),
    [controls, disabled, isOpen, onOpenChange, openProp, register],
  );

  return (
    <CollapsibleContext.Provider value={context}>
      {children}
    </CollapsibleContext.Provider>
  );
};

/**
 * Toggles its collapsible's rows (Base UI `Collapsible.Trigger`,
 * `Accordion.Trigger`): a button (e.g. rendered by a row's `Title`, making
 * the row pressable), with `aria-expanded` and `aria-controls`.
 */
const CollapsibleTrigger = forwardRef<HTMLElement, PartProps<'button'>>(
  ({ onClick, render, ...props }, ref) => {
    const collapsible = useContext(CollapsibleContext);

    return useRender({
      defaultTagName: 'button',
      props: {
        'aria-controls': collapsible?.controls,
        'aria-expanded': collapsible?.isOpen ?? false,
        'data-disabled': collapsible?.disabled ? '' : undefined,
        'data-list-part': 'collapsible-trigger',
        'data-panel-open': collapsible?.isOpen ? '' : undefined,
        disabled: collapsible?.disabled,
        type: 'button',
        ...props,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (onClick as Handler<typeof event>)?.(event);
          if (event.defaultPrevented || !collapsible || collapsible.disabled) {
            return;
          }
          collapsible.setOpen(!collapsible.isOpen, {
            event: event as unknown as Event,
            reason: 'trigger-press',
          });
        },
      },
      ref,
      render,
    });
  },
);

// The rows of a `CollapsiblePanel` (see `Item`): shown or not.
const PanelContext = createContext<PanelContextValue | undefined>(undefined);

/**
 * Its collapsible's rows (Base UI `Collapsible.Panel`, `Accordion.Panel`),
 * shown or not, opening and closing in place, together (each its height),
 * e.g. an inline `Calendar` or `TimeRoll` below a row with a `DatePicker`
 * (see `DatePicker.Expandable`, as iOS's Calendar). Placed among a group's
 * rows (no element of its own: the group's rows stay its children), or
 * among another's (closed with it). Closed, they're inert.
 */
const CollapsiblePanel: FunctionComponent<ListCollapsiblePanelProps> = ({
  children,
}) => {
  const collapsible = useContext(CollapsibleContext);
  // In another's rows: closed with it.
  const outer = useContext(PanelContext);
  const isOpen = (collapsible?.isOpen ?? false) && (outer?.isOpen ?? true);
  const register = collapsible?.register;
  const context = useMemo<PanelContextValue>(
    () => ({ isOpen, register }),
    [isOpen, register],
  );

  // Its rows aren't its collapsible's triggers (nor a picker's, see
  // `useCollapsible`): theirs are their own collapsibles'.
  return (
    <CollapsibleContext.Provider value={undefined}>
      <PanelContext.Provider value={context}>{children}</PanelContext.Provider>
    </CollapsibleContext.Provider>
  );
};

const AccordionContext = createContext<AccordionContextValue | undefined>(
  undefined,
);

/**
 * Collapsibles, one open at a time (unless `multiple`), as Base UI
 * `Accordion.Root`: its `AccordionItem`s, by their `value`; no element of
 * its own.
 */
const AccordionRoot = <Value,>({
  children,
  defaultValue = [],
  disabled = false,
  multiple = false,
  onValueChange,
  value: valueProp,
}: ListAccordionRootProps<Value>): ReactNode => {
  const [uncontrolled, setUncontrolled] =
    useState<readonly Value[]>(defaultValue);
  const value = valueProp ?? uncontrolled;
  const context = useMemo<AccordionContextValue>(
    () => ({
      disabled,
      isOpen: (item) => value.includes(item as Value),
      setOpen: (item, isOpen, eventDetails) => {
        const others = value.filter((open) => open !== item);
        const next = isOpen
          ? [...(multiple ? others : []), item as Value]
          : others;
        onValueChange?.(next, eventDetails);
        if (valueProp === undefined) setUncontrolled(next);
      },
    }),
    [disabled, multiple, onValueChange, value, valueProp],
  );

  return (
    <AccordionContext.Provider value={context}>
      {children}
    </AccordionContext.Provider>
  );
};

/**
 * A collapsible of its `AccordionRoot` (Base UI `Accordion.Item`), open as
 * its root holds (by its `value`): its trigger and panel as a
 * `CollapsibleRoot`'s; no element of its own.
 */
const AccordionItem = <Value,>({
  children,
  disabled: disabledProp,
  onOpenChange,
  value: valueProp,
}: ListAccordionItemProps<Value>): ReactNode => {
  const accordion = useContext(AccordionContext);
  const ownValue = useId();
  const value = valueProp ?? ownValue;
  const isOpen = accordion?.isOpen(value) ?? false;
  const disabled = disabledProp ?? accordion?.disabled ?? false;
  const [controls, register] = useControls();
  const context = useMemo<CollapsibleContextValue>(
    () => ({
      controls,
      disabled,
      isOpen,
      register,
      setOpen: (isNextOpen, eventDetails) => {
        onOpenChange?.(isNextOpen, eventDetails);
        accordion?.setOpen(value, isNextOpen, eventDetails);
      },
    }),
    [accordion, controls, disabled, isOpen, onOpenChange, register, value],
  );

  return (
    <CollapsibleContext.Provider value={context}>
      {children}
    </CollapsibleContext.Provider>
  );
};

/**
 * The collapsible around (a `CollapsibleRoot`, an `AccordionItem`; not in
 * its panel): whether it's open, and opening or closing it (e.g. for a
 * control opening rows of its own, see `DatePicker` `handle`).
 */
export const useCollapsible = ():
  Pick<CollapsibleContextValue, 'isOpen' | 'setOpen'> | undefined =>
  useContext(CollapsibleContext);

/**
 * Whether the collapsible rows around (see `CollapsiblePanel`) are open;
 * `undefined` outside any (e.g. for a control closing its popups with
 * them, see `DatePicker`).
 */
export const useExpandedOpen = (): boolean | undefined =>
  useContext(PanelContext)?.isOpen;

/**
 * A row of a `CollapsiblePanel`: shown or not (`isOpen`, unset outside
 * one), its height and padding transitioning; its id (given, or its own)
 * one its `CollapsibleTrigger` controls.
 */
const useExpandedRow = (
  itemRef: RefObject<HTMLElement | null>,
  idProp: ListItemProps['id'],
) => {
  const expanded = useContext(PanelContext);
  const isOpen = expanded?.isOpen;
  const ownId = useId();
  const id =
    expanded && (idProp === undefined || typeof idProp === 'string')
      ? (idProp ?? ownId)
      : undefined;
  const register = expanded?.register;
  const shown = useRef<boolean | undefined>(undefined);

  useLayoutEffect(
    () => (!register || id === undefined ? undefined : register(id)),
    [id, register],
  );

  useLayoutEffect(() => {
    const { current: item } = itemRef;
    if (!item || isOpen === undefined) return undefined;
    const wasShown = shown.current;
    shown.current = isOpen;

    const settle = () => {
      item.toggleAttribute('data-closed', !isOpen);
      item.inert = !isOpen;
    };
    if (wasShown === undefined || wasShown === isOpen) {
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
    const from = isOpen ? closed : box(item);
    if (isOpen) settle();
    const to = isOpen ? box(item) : closed;
    item.inert = !isOpen;

    item.style.overflow = 'clip';
    const animation = item.animate(
      [
        {
          ...from,
          minHeight: '0px',
          opacity: isOpen ? 0 : 1,
          visibility: 'visible',
        },
        {
          ...to,
          minHeight: '0px',
          opacity: isOpen ? 1 : 0,
          visibility: 'visible',
        },
      ],
      { duration: expandDuration, easing: 'ease' },
    );
    const done = () => {
      item.style.removeProperty('overflow');
      if (!isOpen) settle();
    };
    animation.finished.then(done).catch(() => undefined);

    return () => {
      animation.cancel();
      item.style.removeProperty('overflow');
      settle();
    };
  }, [itemRef, isOpen]);

  return id ?? idProp;
};

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
    editing: itemEditing,
    id: idProp,
    level,
    selected,
    style,
    ...props
  } = useSecondaryClick(itemProps);
  const inheritedEditing = useContext(EditingContext);
  const editing = itemEditing ?? inheritedEditing;
  const itemRef = useForwardedRef<HTMLElement>(ref);
  const id = useExpandedRow(itemRef, idProp);
  useEditingSizes(itemRef, editing !== 'ignore');
  useStrictSlots(itemRef);
  const actionsRef = useRef<Partial<Record<Side, HTMLElement>>>({});
  const overswipeRef = useRef<Partial<Record<Side, Overswipe>>>({});
  // What swiping does to each side's actions (see `ListAllowSwipe`).
  const allowRef = useRef<Partial<Record<Side, ListAllowSwipe>>>({});
  const canReveal = (side: Side) =>
    ['all', 'reveal'].includes(allowRef.current[side] ?? 'all');
  const canConceal = (side: Side) =>
    ['all', 'conceal'].includes(allowRef.current[side] ?? 'all');
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
  // The last wheel event's time (scrolled: at rest once the wheel is quiet).
  const wheelRef = useRef(0);
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
  const [isSwipeable, setIsSwipeable] = useState(false);
  const [pin, setPin] = useState<HTMLElement | null>(null);

  const overswipes = (side: Side) => Boolean(overswipeRef.current[side]);

  // The track's room before the row (the leading side's, see `layOut`),
  // and after it.
  const leadRef = useRef(0);
  const trailRef = useRef(0);
  const lead = () => leadRef.current;

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

  const scrollTo = (offset: number, isSmooth: boolean) => {
    const { current: item } = itemRef;
    if (!item) return;
    const isRightToLeft = isRtl(item);
    const left = isRightToLeft ? offset - lead() : lead() - offset;
    item.scrollTo({ behavior: isSmooth ? 'smooth' : 'instant', left });
  };

  // The track's room on a side: the actions' width; across the whole row
  // only while overswiping it is possible (see `overswipable`), so a scroll
  // opening the actions stops at them, not past them (snapping back).
  const roomOf = (side: Side) => {
    // Not swiped open (see `allowSwipe`): no room, unless open.
    if (openSideRef.current !== side && !canReveal(side)) return 0;
    const { [side]: width = 0 } = swipeRef.current.widths;
    return overswipesNow(side)
      ? (swipeRef.current.extents[side] ?? width)
      : width;
  };

  // Lays the track out for each side's room: its size, the snap points'
  // places, the actions' reveal; the row kept where it is (the room before
  // it moving the scroll position). The room grows at once, but narrows at
  // rest only (`isAtRest`): narrowed, the track re-snaps at once (e.g.
  // released from a drag, before snapping smoothly), and never less than
  // where the row is.
  const layOut = (isAtRest: boolean) => {
    const { current: item } = itemRef;
    if (!item) return;
    const offset = offsetOf(item);
    const fit = (room: number, current: number, reach: number) =>
      Math.max(isAtRest ? room : Math.max(room, current), reach);
    const { current: wasLead } = leadRef;
    const { current: wasTrail } = trailRef;
    leadRef.current = fit(roomOf('leading'), leadRef.current, offset);
    trailRef.current = fit(roomOf('trailing'), trailRef.current, -offset);
    const isResized =
      leadRef.current !== wasLead || trailRef.current !== wasTrail;
    item.style.setProperty('--uikit-list-swipe-lead', `${String(lead())}px`);
    item.style.setProperty(
      '--uikit-list-swipe-trail',
      `${String(trailRef.current)}px`,
    );

    const places = snapPlaces(swipeRef.current, lead(), overswipes);
    placesRef.current = places;
    for (const side of sides) {
      const { [side]: container } = actionsRef.current;
      if (!container) continue;
      revealRanges(container, side, lead());
      // Safari keeps running its reveal (on the compositor) for the scroll
      // range it started in, so scaling in out of order and flickering once
      // the room changed (e.g. as a swipe starts, overswiping): restarted.
      if (!isResized) continue;
      for (const animation of container.getAnimations({ subtree: true })) {
        // (Not the stretched action's transitions.)
        if (!(animation instanceof CSSAnimation)) continue;
        animation.cancel();
        animation.play();
      }
    }
    for (const point of snapPoints) {
      const snap = snapsRef.current[point];
      if (snap) snap.style.insetInlineStart = `${String(places[point] ?? 0)}px`;
    }
    // (Only if it moved: a scroll on its way, e.g. closing, goes on.)
    if (offsetOf(item) !== offset) scrollTo(offset, false);
  };

  // The snap points (see `snapPlaces`). Open, the other side's actions
  // don't open (scrolled past closed, the row snaps back closed): only from
  // closed; overswiped, only as above. (They change at rest, or as a touch
  // starts, only: changed while scrolling, browsers snap at once.) Safari
  // snaps to the point at the same place in their order once they change
  // (e.g. armed, shown before closed as a touch starts), so the row is put
  // back where it was.
  const showSnaps = (isAtRest = false) => {
    const { current: item } = itemRef;
    const offset = item ? offsetOf(item) : undefined;
    // (The room changing with them, see `layOut`.)
    layOut(isAtRest);
    const { current: openSide } = openSideRef;
    for (const point of snapPoints) {
      const snap = snapsRef.current[point];
      if (!snap) continue;
      const side: Side = point.startsWith('leading') ? 'leading' : 'trailing';
      const isOverswiping =
        point.endsWith('Armed') || point.endsWith('Overswipe');
      snap.hidden =
        placesRef.current[point] === undefined ||
        (openSide !== undefined && point !== 'closed' && side !== openSide) ||
        (isOverswiping && !overswipable(side));
    }
    if (item && offset !== undefined && offsetOf(item) !== offset) {
      scrollTo(offset, false);
    }
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
    showSnaps(true);

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

  // As allowed (see `allowSwipe`), keyboards too: open, not swiped closed,
  // no scrolling (closed by scrolling it programmatically only); closed,
  // not swiped open, its actions inert (not revealed by focusing them).
  const lock = () => {
    const { current: openSide } = openSideRef;
    itemRef.current?.toggleAttribute(
      'data-swipe-locked',
      openSide !== undefined && !canConceal(openSide),
    );
    for (const side of sides) {
      const { [side]: container } = actionsRef.current;
      if (container) container.inert = openSide !== side && !canReveal(side);
    }
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
        lock();
        // (Its snap points change once closed, see `settle`.)
        scrollTo(0, true);
      },
      focus: (side) => {
        if (openSideRef.current !== side) return;
        // (The row scrolling to show them on its own.)
        actionsRef.current[side]
          ?.querySelector<HTMLElement>('button:not(:disabled)')
          ?.focus({ preventScroll: true });
      },
      isOpen: (side) => openSideRef.current === side,
      open: (side) => {
        const { current: item } = itemRef;
        const width = swipeRef.current.widths[side];
        if (!item || width === undefined) return;

        if (closeOpenItem !== value.close) closeOpenItem?.();
        closeOpenItem = value.close;
        if (openSideRef.current !== side) restingOpenRef.current = false;
        openSideRef.current = side;
        lock();
        showSnaps();
        scrollTo((side === 'leading' ? 1 : -1) * width, true);

        if (outsideRef.current) return;
        outsideRef.current = (event) => {
          // Not swiped closed (see `allowSwipe`): nor by a press outside.
          if (
            (event.target instanceof Node && item.contains(event.target)) ||
            (openSideRef.current && !canConceal(openSideRef.current))
          ) {
            return;
          }
          value.close();
        };
        document.addEventListener('pointerdown', outsideRef.current, {
          capture: true,
        });
      },
      setActions: (side, element, overswipe = false, allowSwipe = 'all') => {
        overswipeRef.current[side] = overswipe;
        allowRef.current[side] = allowSwipe;
        if (element) {
          actionsRef.current[side] = element;
        } else {
          delete actionsRef.current[side];
        }
        lock();
        setIsSwipeable(
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

  // Not swiped closed (see `allowSwipe`): nor scrolled closed otherwise
  // (e.g. by the browser, focusing the row's content), open again.
  const reopen = () => {
    const { current: openSide } = openSideRef;
    if (!openSide || canConceal(openSide)) return false;
    const { [openSide]: width = 0 } = swipeRef.current.widths;
    scrollTo((openSide === 'leading' ? 1 : -1) * width, true);
    return true;
  };

  // Closed, at rest.
  const restClosed = (item: HTMLElement) => {
    swipingRef.current = false;
    restingOpenRef.current = false;
    openSideRef.current = undefined;
    lock();
    showSnaps(true);
    if (closeOpenItem === context.close) closeOpenItem = undefined;
    resetRow(item);
  };

  // The scroll at rest (not touched): overswiped (armed, or across the
  // whole row: triggering there), open or closed.
  const settle = () => {
    const { current: item } = itemRef;
    if (!item || dragRef.current?.isMoved || touchingRef.current) return;
    item.style.removeProperty('scroll-snap-type');
    const offset = offsetOf(item);
    const side: Side = offset > 0 ? 'leading' : 'trailing';
    const distance = Math.abs(offset);
    const { [side]: width = 0 } = swipeRef.current.widths;
    const { [side]: extent = 0 } = swipeRef.current.extents;
    const { [side]: arm = Infinity } = swipeRef.current.arms;

    const { current: isClosing } = closingRef;
    closingRef.current = false;
    if (distance < 1) {
      if (isClosing || !reopen()) restClosed(item);
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
      // Scrolled open (stopped at the actions, see `roomOf`): at rest only
      // once the wheel (a trackpad's momentum too) is quiet, so the same
      // scroll doesn't overswipe.
      const quiet = performance.now() - wheelRef.current;
      if (quiet < wheelQuiet) {
        clearTimeout(settleRef.current);
        settleRef.current = setTimeout(settle, wheelQuiet - quiet);
        return;
      }
      restingOpenRef.current = true;
    }
    showSnaps(true);
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
      // (Swiped, it closes another row's; closing, not: e.g. as another
      // opens by a trigger, which its scroll would close again.)
      if (
        !closingRef.current &&
        closeOpenItem &&
        closeOpenItem !== context.close
      ) {
        closeOpenItem();
      }
    }
    placeRow(item, actionsRef.current, offset, false, overswipesNow);

    const { [side]: arm = Infinity } = swipeRef.current.arms;
    const isArmed =
      !closingRef.current && overswipesNow(side) && Math.abs(offset) > arm;
    for (const key of sides) {
      const { [key]: actions } = actionsRef.current;
      const action = actions && outermostAction(actions, key);
      action?.toggleAttribute('data-armed', isArmed && key === side);
    }

    if (hasScrollEnd) return;
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
    if (!item || !isSwipeable) return undefined;
    const onScrollEnd = () => settleNowRef.current();
    const onWheel = () => {
      wheelRef.current = performance.now();
    };
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
    item.addEventListener('wheel', onWheel, { passive: true });
    item.addEventListener('touchstart', onTouchStart, { passive: true });
    item.addEventListener('touchend', onTouchEnd);
    item.addEventListener('touchcancel', onTouchEnd);
    return () => {
      item.removeEventListener('scrollend', onScrollEnd);
      item.removeEventListener('wheel', onWheel);
      item.removeEventListener('touchstart', onTouchStart);
      item.removeEventListener('touchend', onTouchEnd);
      item.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [itemRef, isSwipeable]);

  useLayoutEffect(() => {
    const { current: item } = itemRef;
    if (!item || !isSwipeable) return undefined;
    measureRef.current();
    const observer = new ResizeObserver(() => measureRef.current());
    observer.observe(item);
    for (const side of sides) {
      const { [side]: container } = actionsRef.current;
      if (container) observer.observe(container);
    }
    return () => observer.disconnect();
  }, [itemRef, isSwipeable]);

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
      !isSwipeable ||
      sides.some((side) => actions[side]?.contains(event.target as Node | null))
    ) {
      return;
    }
    pressRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    // Touch scrolls natively; a mouse drags the scroll position, as allowed
    // (see `allowSwipe`; touch: by the room, and the lock, see style.css).
    if (event.pointerType !== 'mouse' || isOwnGesture(item, event)) return;
    const { current: openSide } = openSideRef;
    if (
      openSide ? !canConceal(openSide) : sides.every((side) => !canReveal(side))
    ) {
      return;
    }
    dragRef.current = {
      base: offsetOf(item),
      isMoved: false,
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
    if (!drag.isMoved) {
      const vertical = Math.abs(event.clientY - drag.y);
      if (vertical > swipeThreshold && vertical > Math.abs(dx)) {
        dragRef.current = null;
        return;
      }
      if (Math.abs(dx) < swipeThreshold) return;

      drag.isMoved = true;
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
  const endDrag = (drag: Drag, isCancelled: boolean) => {
    const { current: item } = itemRef;
    if (!item) return;
    const offset = offsetOf(item);
    const side: Side = offset > 0 ? 'leading' : 'trailing';
    const distance = Math.abs(offset);
    const { [side]: width } = swipeRef.current.widths;
    const { [side]: arm = Infinity } = swipeRef.current.arms;

    suppressClick();
    // Open, the other side doesn't (see `showSnaps`).
    const isLocked =
      openSideRef.current !== undefined && openSideRef.current !== side;
    // Across the whole row, triggering there (see `settle`): not snapping
    // until then (which would start where it is).
    if (!isLocked && !isCancelled && overswipesNow(side) && distance > arm) {
      const { [side]: extent = 0 } = swipeRef.current.extents;
      scrollTo((side === 'leading' ? 1 : -1) * extent, true);
      return;
    }
    // Not overswiped: no longer, before snapping again (which would snap to
    // where it's dragged, as far as overswiped).
    swipingRef.current = false;
    showSnaps();
    const isOpening =
      !isLocked && !isCancelled && opensOnRelease(drag, offset, side, width);
    // Snapping again once at rest there (see `settle`): snapping now, the
    // browser would snap at once, not smoothly. (Already there: now.)
    if (Math.abs(distance - (isOpening ? (width ?? 0) : 0)) < 1) {
      item.style.removeProperty('scroll-snap-type');
    }
    if (isOpening) {
      context.open(side);
    } else {
      context.close();
    }
  };

  const finish = (event: PointerEvent<HTMLElement>, isCancelled: boolean) => {
    const { current: press } = pressRef;
    const { current: drag } = dragRef;
    if (press?.pointerId === event.pointerId) pressRef.current = null;
    if (drag?.pointerId === event.pointerId) {
      dragRef.current = null;
      if (drag.isMoved) {
        endDrag(drag, isCancelled);
        return;
      }
    }
    if (press?.pointerId !== event.pointerId) return;

    // A tap on an open row closes it.
    const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
    if (!isCancelled && moved < swipeThreshold && openSideRef.current) {
      context.close();
      suppressClick();
    }
  };

  const handleBlurCapture = (event: FocusEvent<HTMLElement>) => {
    (onBlurCapture as Handler<typeof event>)?.(event);

    const { current: item } = itemRef;
    const { current: openSide } = openSideRef;
    // Not swiped closed (see `allowSwipe`): nor by focus leaving it.
    if (!openSide || !item || !canConceal(openSide)) return;

    // Focus moving elsewhere only (e.g. tabbing on): not to nothing, as
    // WebKit's, pressing a button (its actions' too) not focusing it (a
    // press outside closes it, see `open`).
    const { relatedTarget } = event;
    if (!(relatedTarget instanceof Node) || item.contains(relatedTarget)) {
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
        data-edit-leading={editSide(editing, 'leading')}
        data-edit-trailing={editSide(editing, 'trailing')}
        data-selected={selected ? '' : undefined}
        data-swipeable={isSwipeable ? '' : undefined}
        id={id}
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
        onScroll={isSwipeable ? onScroll : undefined}
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
          {isSwipeable
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

// Row slots (see style.css): a row's parts in a line, in their order;
// elements of other components only in these.

/**
 * Any elements before a row's content (e.g. a spinner, an avatar), in a
 * line; several per row; sliding in or out in edit mode (`whileEditing`).
 */
const Leading = forwardRef<HTMLElement, PartProps<'span'> & WhileEditingProps>(
  ({ className, render, whileEditing, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'leading',
        ...whileEditingOf(whileEditing),
        className: cn('uikit-list-leading', className),
        ...props,
      },
      ref,
      render,
    }),
);

/**
 * Any elements after a row's content (e.g. a `Switch`, a `Stepper`), in a
 * line; several per row; sliding in or out in edit mode (`whileEditing`).
 */
const Trailing = forwardRef<HTMLElement, PartProps<'span'> & WhileEditingProps>(
  ({ className, render, whileEditing, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'trailing',
        ...whileEditingOf(whileEditing),
        className: cn('uikit-list-trailing', className),
        ...props,
      },
      ref,
      render,
    }),
);

/**
 * A row's text (its `Title`, `Subtitle`, `Text`; or a field's label),
 * taking the rest of its line; every row has one (or a `Span`).
 */
const Content = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'content',
        className: cn('uikit-list-content', className),
        ...props,
      },
      ref,
      render,
    }),
);

/**
 * Content across a row's whole line (e.g. a `Slider` between its symbols,
 * a `Segmented` control, an inline calendar).
 */
const Span = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'span',
        className: cn('uikit-list-span', className),
        ...props,
      },
      ref,
      render,
    }),
);

/**
 * A line under a row's line, across it (e.g. a field's description and
 * error); last in its row.
 */
const Below = forwardRef<HTMLElement, PartProps<'div'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-list-part': 'below',
        className: cn('uikit-list-below', className),
        ...props,
      },
      ref,
      render,
    }),
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
const Accessory = forwardRef<
  HTMLElement,
  PartProps<'span'> & WhileEditingProps
>(({ className, render, ...props }, ref) =>
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
const Checkmark = forwardRef<
  HTMLElement,
  PartProps<'span'> & WhileEditingProps
>(({ children, className, render, ...props }, ref) =>
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
    // Turned down while its row's collapsible is open (see
    // `CollapsibleRoot`, `AccordionItem`).
    const collapsible = useContext(CollapsibleContext);

    return useRender({
      defaultTagName: 'span',
      props: {
        'data-list-part': 'disclosure',
        'data-panel-open': collapsible?.isOpen ? '' : undefined,
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
const Checkbox = forwardRef<HTMLElement, CheckboxRootProps & WhileEditingProps>(
  ({ whileEditing, ...props }, ref) => (
    <CheckboxBase.Root
      ref={ref}
      data-list-part="edit"
      {...whileEditingOf(whileEditing)}
      {...props}
    />
  ),
);

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

const StyledEditButton = forwardRef<
  HTMLElement,
  Omit<ListEditButtonProps, 'textColor' | 'tint'>
>(({ className, render, ...props }, ref) =>
  useRender({
    defaultTagName: 'button',
    props: {
      'data-list-part': 'edit',
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
 * Figma State=Remove/Add: a symbol (its child) in a circle of its `tint`,
 * doing what the app gives it (e.g. deleting the row; or, rendered by a
 * `SwipeActionsTrigger`, opening its trailing actions).
 */
const EditButton = forwardRef<HTMLElement, ListEditButtonProps>(
  ({ style, textColor, tint, ...props }, ref) => (
    <StyledEditButton
      ref={ref}
      style={withStyle(
        {
          '--uikit-list-edit-text-color': textColor,
          '--uikit-list-edit-tint': tint,
        },
        style,
      )}
      {...props}
    />
  ),
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
      allowSwipe = 'all',
      handle,
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

    // Opened and closed by their handle, while mounted.
    useLayoutEffect(() => {
      if (!handle || !item) return undefined;

      return handle.attach({
        close: () => item.close(),
        focus: () => item.focus(side),
        isOpen: () => item.isOpen(side),
        open: () => item.open(side),
      });
    }, [handle, item, side]);

    useLayoutEffect(() => {
      const { current: element } = elementRef;
      if (!item || !element) return undefined;

      item.setActions(
        side,
        element,
        hasHandler ? () => onOverswipeRef.current?.() : overswipe,
        allowSwipe,
      );

      return () => item.setActions(side, undefined);
    }, [allowSwipe, elementRef, hasHandler, item, overswipe, pin, side]);

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

/**
 * Opens a row's swipe actions when clicked (Base UI's triggers' shape):
 * those of its `handle`, from anywhere, or, in the row, its own on its
 * `side`; focusing the first of them. Renders a button, or what it's given
 * (e.g. the delete `EditButton`).
 */
const SwipeActionsTrigger = forwardRef<
  HTMLElement,
  ListSwipeActionsTriggerProps
>(
  (
    { className, handle, onClick, render, side = 'inline-end', ...props },
    ref,
  ) => {
    const item = useContext(ItemContext);

    return useRender({
      defaultTagName: 'button',
      props: {
        className: cn('uikit-list-swipe-actions-trigger', className),
        type: 'button',
        ...props,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (onClick as Handler<typeof event>)?.(event);
          if (event.defaultPrevented) return;
          // Moving focus to the actions it opened (as Base UI's triggers
          // to their popups).
          if (handle) {
            handle.open();
            handle.focus();
            return;
          }
          const itemSide = side === 'inline-start' ? 'leading' : 'trailing';
          item?.open(itemSide);
          item?.focus(itemSide);
        },
      },
      ref,
      render,
    });
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
  Leading,
  Content,
  Trailing,
  Span,
  Below,
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
  AccordionRoot,
  AccordionItem,
  // (Base UI's names in an accordion: the same parts.)
  AccordionTrigger: CollapsibleTrigger,
  AccordionPanel: CollapsiblePanel,
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
  SwipeActionsTrigger,
  SwipeAction,
  Index,
  IndexItem,
  createSwipeActionsHandle,
};
