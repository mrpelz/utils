import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { useRender } from '@base-ui/react/use-render';
import { styled } from 'goober';
import {
  createContext,
  FocusEvent,
  forwardRef,
  MouseEvent,
  PointerEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import { textStyle } from './typography.js';
import {
  css,
  edgeScrollDelta,
  fontWeight,
  useForwardedRef,
  usePointerDrag,
} from './utils.js';

// Source: Apple iOS 26 Figma (“Lists and tables”: “Row” Height=Regular/Tall,
// “_Images”, “_Trailing”, “_Edit Buttons”, “_Grabber”, “_Separator”,
// “Row - Button”, “Row with Swipe Actions”, “_Swipe Actions”, “Header”,
// “_Header Trailing Accessories”, “Section Title”, “Grouped Table Footer”,
// “Index Bar”), with its colors mapped to UIKit semantic colors (the tint,
// the label colors, `systemRed`, `systemGray2`/`3`/`5`); the separator is a
// token in `styles.tsx`. What Figma doesn't define follows Framework7
// (`list.less`, `list-ios.less`, `list-vars.less`, `swipeout.less`,
// `swipeout-ios.less`, `swipeout.js`, `list-index.less`, `block.less`):
// - list styles (UIKit `UITableView.Style`): `insetGrouped` (the default:
//   16px inset, 24px corners), `grouped`, `plain` (Framework7 `.list`,
//   `.list.inset`); 35px between sections; optionally outlined
//   (`.list-outline`)
// - pressed rows (UIKit's cell selection, `systemGray4`), hiding the
//   separators around pressed and swiped rows
// - swiping: the row follows the pointer (rubber-banding past its actions)
//   over its actions, pinned to the list's edge, which scale in one after
//   another from the edge; it opens on releasing past half the actions, or
//   on a quick swipe (300ms, 10px); optionally, overswiping (past 1.2 times
//   the actions) stretches the outermost action over the others and the
//   area the row uncovers (200ms), the others fading out, and triggers it
//   on release
// - reordering rows by their grabbers (`sortable.js`, see `useReorder`),
//   independent of the leading edit controls (`Checkbox`, `Radio`,
//   `EditButton`)
// - media rows, as in Mail (`.media-list`: a `Text` part)
// - the Content Block (`Block`)
//
// Titles, subtitles and details are in the Body and Subheadline text styles,
// prominent headers in Title 3 Emphasized, index letters in Caption 1
// Emphasized; Figma's nested and extra prominent headers, header subtitles
// and details, footers and swipe action labels differ from the text styles
// in tracking, and are kept.
//
// Rows are grids: [edit control] [image] title/subtitle [trailing …], where
// everything that is not a leading part, a title or a subtitle is trailing
// (Figma “Contents - Trailing”: 16px apart), e.g. a `Switch` or a `Menu`
// trigger. Rows with a subtitle are tall (Figma Height=Tall: 68px, labelled
// swipe actions); others are regular (52px). Both are
// minimum heights, growing with wrapping text. A row is pressable when its
// `Title` (or `Button`) is a link or button (`render`): its hit area covers
// the row, beneath the trailing controls.
//
// Deviations:
// - Focusing a swipe action opens the actions, and the delete edit button
//   opens the trailing actions.
// - Header and footer text is aligned with the rows' text (Figma: headers are
//   laid out for the full width, footers for the rows').
// - Sticky section titles (plain lists) are opaque (Framework7 contacts
//   list; Figma: a blur only), and sections snap to the top of a scroll
//   container with `scroll-snap-type` (Framework7: none).
// - Images keep their regular size (one line's height) in tall rows (Figma
//   Height=Tall: rounded 44px, circular 60px, fill 68px).
// - Swiped rows taller than Figma's tall rows (e.g. Mail's) get 34px
//   corners (Figma: a capsule, which would cut into their content).
// - Labelled swipe actions (tall rows) are 36px circles (smaller symbols, as
//   Framework7's), 4px above 13px labels, centered in the row (Figma: 50px
//   circles, 3px above 15px labels, which overflow a 68px row).
// - Rounded and circular images size their symbol to the image (Figma: none
//   given); header buttons are round (Figma PNG; CSS: 10px corners).
// - Separators, chevrons and the checkmarks are drawn as CSS borders and SVG
//   strokes (Figma: SF Symbols glyphs 􀆊, 􀆅, 􀅼, 􀅽, 􀌇, 􀆏).

export type ListStyle = 'grouped' | 'insetGrouped' | 'plain';

type Side = 'leading' | 'trailing';

const part = 'data-list-part';

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

/** Props of a part rendering `Tag`, replaceable via `render` (Base UI). */
type PartProps<Tag extends IntrinsicTag> = Omit<
  useRender.ComponentProps<Tag>,
  'ref'
>;

/**
 * A part: an element marked as the part `name` (internal, for the list's
 * layout), replaceable via `render`; props named in `omitted` only style it.
 */
const partElement = <Tag extends IntrinsicTag, Omitted extends string = never>(
  tag: Tag,
  name: string,
  omitted: readonly Omitted[] = [],
  defaults: Record<string, unknown> = {},
) =>
  forwardRef<HTMLElement, PartProps<Tag> & { [Key in Omitted]?: unknown }>(
    ({ render, ...props }, ref) => {
      const elementProps: Record<string, unknown> = { ...props };
      for (const key of omitted) delete elementProps[key];

      return useRender({
        defaultTagName: tag,
        props: { [part]: name, ...defaults, ...elementProps },
        ref,
        render: render as useRender.RenderProp,
      });
    },
  );

// As `Button`: a `cursor` prop, or the fallback.
const cursorProperty = (fallback: string) =>
  `--styled-cursor: attr(cursor type(<custom-ident>), ${fallback});`;

const cursor = (fallback: string) =>
  [
    cursorProperty(fallback),
    '@media (hover: hover) { cursor: var(--styled-cursor); }',
  ].join('\n');

const reset = css`
  padding: 0;
  border: 0;
  margin: 0;
  background: none;
  color: inherit;
  font-family: inherit;
  text-align: inherit;
  text-decoration: none;
`;

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
const Check = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 17 17"
    width="1em"
  >
    <path d="M2 9l4.5 5L15.2 1.5" />
  </svg>
);

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

const UpDown = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.94em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.6"
    viewBox="0 0 10 16"
    width="0.59em"
  >
    <path d="M2 6l3-3.5L8 6M2 10l3 3.5L8 10" />
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

// Chevrons point the other way in right-to-left layouts.
const mirrored = css`
  &:dir(rtl) {
    scale: -1 1;
  }
`;

// Root: the list's style, as custom properties for its parts (their
// fallbacks are `insetGrouped`'s, for parts outside of a root).

// Framework7 `.list-outline`: hairlines above and below groups that span
// the list, a border around inset ones; drawn as shadows, taking no space.
const outlineBlock = [
  'inset 0 1px var(--styled-list-outline, transparent)',
  'inset 0 -1px var(--styled-list-outline, transparent)',
].join(', ');

const listStyles: Record<ListStyle, string> = {
  grouped: css`
    --styled-list-background: var(--color-ios-system-grouped-background);
    --styled-list-group-background: var(
      --color-ios-secondary-system-grouped-background
    );
    --styled-list-inset: 0px;
    --styled-list-radius: 0px;
    --styled-list-section-spacing: 35px;
    --styled-list-outline-shadow: ${outlineBlock};
  `,
  insetGrouped: css`
    --styled-list-background: var(--color-ios-system-grouped-background);
    --styled-list-group-background: var(
      --color-ios-secondary-system-grouped-background
    );
    --styled-list-inset: 16px;
    --styled-list-radius: 24px;
    --styled-list-section-spacing: 35px;
    --styled-list-outline-shadow: inset 0 0 0 1px
      var(--styled-list-outline, transparent);
  `,
  // Figma “Section Title”: nested headers stick to the top, 22px high on an
  // opaque background (Framework7 contacts list), and sections are snap points, so
  // scrolling ends with a section title fully in view. Rows are on the list
  // background of Framework7's `.list-strong`.
  plain: css`
    --styled-list-background: var(--color-ios-system-background);
    --styled-list-group-background: var(
      --color-ios-secondary-system-grouped-background
    );
    --styled-list-section-snap: start;
    --styled-list-inset: 0px;
    --styled-list-radius: 0px;
    --styled-list-section-spacing: 0px;
    --styled-list-outline-shadow: ${outlineBlock};
    --styled-list-header-position: sticky;
    --styled-list-header-background: var(
      --color-ios-list-section-title-background
    );
    --styled-list-nested-padding-block: 0;
    --styled-list-nested-min-height: 22px;
    --styled-list-nested-size: var(--font-ios-body-size);
    --styled-list-nested-line-height: var(--font-ios-body-line-height);
    --styled-list-nested-tracking: var(--font-ios-body-tracking);
  `,
};

export type ListRootProps = PartProps<'div'> & {
  /** UIKit `UITableView.Style` (default: `insetGrouped`). */
  listStyle?: ListStyle;
  /**
   * Outlines its groups (Framework7 `.list-outline`): hairlines above and
   * below, or a border around inset ones.
   */
  outline?: boolean;
};

const StyledRoot = styled(
  partElement('div', 'root', ['listStyle', 'outline']),
  forwardRef,
)<ListRootProps>`
  ${({ listStyle = 'insetGrouped' }) => listStyles[listStyle]}
  ${({ outline }) =>
    outline ? '--styled-list-outline: var(--color-ios-list-separator);' : ''}

  display: flow-root;
  min-width: 240px;
  background-color: var(--styled-list-background);
  color: var(--color-ios-label);
`;

/** A list (UIKit `UITableView`): sections of rows, headers and footers. */
const Root = StyledRoot;

/** A section: an optional `Header`, a `Group` or `Block`, a `Footer`. */
const Section = styled(partElement('section', 'section'), forwardRef)`
  display: block;
  margin-block: var(--styled-list-section-spacing, 35px);
  scroll-snap-align: var(--styled-list-section-snap, none);
`;

// Reordering (Framework7 `sortable.js`, `sortable.less`): dragging a row's
// grabber lifts the row, which follows the pointer within its group, the
// other rows making room (300ms); near an end of the scroll container, it
// scrolls (as the tab bar's lens does). Released, the row settles into its
// place, and the group's `onReorder` is called; the app reorders its rows.
// Until their order changes (or, if it doesn't, the rows slide back), they
// keep their offsets. Arrow keys on a focused grabber move its row by one.
const reorderDuration = 300;

const isItem = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement &&
  element.matches(`[${CSS.escape(part)}='item']`);

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
          ? target.closest<HTMLElement>(`[${CSS.escape(part)}='grabber']`)
          : null;
      const item = grabber?.parentElement;
      return grabber && item && isItem(item) && item.parentElement === group
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

        // The row's place: past the middle of the rows it's moved over.
        const center = top + height / 2 + offset;
        to = from;
        for (const [index, rowTop] of tops.entries()) {
          const middle = rowTop + (heights[index] ?? 0) / 2;
          if (index < from && center < middle) to = Math.min(to, index);
          if (index > from && center > middle) to = Math.max(to, index);
        }
        for (const [index, element] of items.entries()) {
          if (index === from) continue;
          const below = index > from && index <= to;
          const above = index < from && index >= to;
          setOffset(element, (above ? height : 0) - (below ? height : 0), true);
        }
        markEdges(to);
      };

      let frame = requestAnimationFrame(function scroll() {
        frame = requestAnimationFrame(scroll);
        const { bottom, top: scrollerTop } =
          scroller === scroller.ownerDocument.scrollingElement
            ? { bottom: window.innerHeight, top: 0 }
            : scroller.getBoundingClientRect();
        const delta = edgeScrollDelta(clientY, scrollerTop, bottom);
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
const StyledGroup = styled(partElement('ul', 'group'), forwardRef)`
  overflow: clip visible;
  padding: 0;
  border-radius: var(--styled-list-radius, 24px);
  background-color: var(
    --styled-list-group-background,
    var(--color-ios-secondary-system-grouped-background)
  );
  box-shadow: var(--styled-list-outline-shadow, none);
  list-style: none;
  margin-block: 0;
  margin-inline: var(--styled-list-inset, 16px);
`;

export type ListGroupProps = PartProps<'ul'> & {
  /**
   * Called when a row is moved by its `Grabber` from one index to another
   * (among the group's rows); the app reorders them.
   */
  onReorder?: (from: number, to: number) => void;
};

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

// Pressable rows: a link or button title, or a button (goober splits
// selector lists inside parentheses, and mangles selectors continuing after
// them: nest instead).
const pressable = [
  `a[href][${part}='title']`,
  `button[${part}='title']:enabled`,
  `button[${part}='button']:enabled`,
];

const whilePressed = pressable
  .map((selector) => `&:has(> ${selector}:active)`)
  .join(', ');

const StyledItem = styled(partElement('li', 'item'), forwardRef)`
  --styled-list-min-height: 52px;
  --styled-list-action-size: 52px;
  --styled-list-action-height: var(--styled-list-action-size);
  --styled-list-action-symbol-size: var(--font-ios-body-size);
  --styled-list-action-label-display: none;
  --styled-list-actions-align: center;

  position: relative;
  display: grid;
  min-height: var(--styled-list-min-height);
  box-sizing: border-box;
  align-content: center;
  padding: 12px 16px;
  background-color: var(--styled-list-row-background, transparent);
  grid-auto-columns: auto;
  grid-auto-flow: column;
  grid-template-columns: auto auto minmax(0, 1fr);
  grid-template-rows: auto auto;

  /* The pressed state is the row's (a title's hit area covers it). */
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-y;
  transition-duration: 300ms;
  transition-property: background-color;
  user-select: none;

  /* Figma Height=Tall (images keep their regular size) */
  &:has(> [${part}='subtitle']) {
    --styled-list-min-height: 68px;

    /* Labelled, centered in the row with room around (see Deviations) */
    --styled-list-action-size: 36px;
    --styled-list-action-height: calc(36px + 4px + 16px);
    --styled-list-action-symbol-size: var(--font-ios-subheadline-size);
    --styled-list-action-label-display: block;

    & > [${part}='title'] {
      align-self: end;
      grid-area: 1 / 3;
    }
  }

  /* Framework7 media list (Mail): a title row with the trailing parts, the
     subtitle and text below, spanning the row, the image at the top; the
     title emphasized (Framework7: 600), trailing details in Subheadline. */
  &:has(> [${part}='text']) {
    --styled-list-min-height: 0px;

    align-content: start;
    grid-template-rows: auto auto auto;
    padding-block: 10px;

    &::after {
      grid-area: 1 / 1 / 2 / 4;
    }

    & > [${part}='edit'] {
      grid-area: 1 / 1 / 4;
    }

    & > [${part}='image'] {
      align-self: start;
      grid-area: 1 / 2 / 4;
      margin-block: 0;
    }

    & > [${part}='title'] {
      align-self: center;
      grid-area: 1 / 3;
      ${fontWeight(590)}
    }

    & > [${part}='subtitle'] {
      color: var(--color-ios-label);
      grid-area: 2 / 3 / 3 / 99;
    }

    & > [${part}='text'] {
      grid-area: 3 / 3 / 4 / 99;
    }

    & > [${part}='detail'] {
      ${textStyle('subheadline')}
    }

    &
      > :not(
        [${part}='edit'],
        [${part}='image'],
        [${part}='title'],
        [${part}='subtitle'],
        [${part}='text'],
        [${part}='button'],
        [${part}='swipe-actions']
      ) {
      grid-row: 1;
    }
  }

  /* Lifted while reordered (see useReorder), opaque (Framework7: 80%, the
     rows beneath showing through), its separators hidden */
  &[data-reordering] {
    z-index: 2;
    background-color: var(
      --styled-list-group-background,
      var(--color-ios-secondary-system-grouped-background)
    );
    box-shadow: var(--shadow-ios-list-reorder);
  }

  &[data-reordering]::before,
  &[data-reorder-edge~='after']::before {
    opacity: 0;
  }

  /* Figma “_Separator”, from the text to 16px before the edge */
  &::before {
    position: absolute;
    top: 0;
    border-top: 1px solid var(--color-ios-list-separator);
    content: '';
    grid-column: 3 / 99;
    inset-inline: 0 16px;
    transition: opacity 300ms;
  }

  /* While reordering, by their order on screen (see useReorder) */
  &:first-child:not([data-reorder-edge]),
  &[data-reorder-edge~='first'] {
    border-start-end-radius: var(--styled-list-radius, 24px);
    border-start-start-radius: var(--styled-list-radius, 24px);

    &::before {
      display: none;
    }
  }

  &:last-child:not([data-reorder-edge]),
  &[data-reorder-edge~='last'] {
    border-end-end-radius: var(--styled-list-radius, 24px);
    border-end-start-radius: var(--styled-list-radius, 24px);
  }

  /* Keeps the trailing parts out of the leading and text columns. */
  &::after {
    content: '';
    grid-area: 1 / 1 / 3 / 4;
    pointer-events: none;
  }

  /* Above a pressable title's hit area, as trailing controls */
  & > [${part}='edit'] {
    position: relative;
    z-index: 1;
    align-self: center;
    grid-area: 1 / 1 / 3;
    margin-inline: 2px 17px;
  }

  & > [${part}='image'] {
    align-self: center;
    grid-area: 1 / 2 / 3;
    margin-inline-end: 8px;
  }

  /* Alone, centered across both rows (trailing parts taller than it, e.g. a
     switch, would grow both). */
  & > [${part}='title'] {
    align-self: center;
    grid-area: 1 / 3 / 3;
  }

  & > [${part}='subtitle'] {
    align-self: start;
    grid-area: 2 / 3;
  }

  & > [${part}='button'] {
    grid-area: 1 / 3 / 3;
  }

  /* Figma “Contents - Trailing”: everything else */
  &
    > :not(
      [${part}='edit'],
      [${part}='image'],
      [${part}='title'],
      [${part}='subtitle'],
      [${part}='text'],
      [${part}='button'],
      [${part}='swipe-actions']
    ) {
    position: relative;
    z-index: 1;
    align-self: center;
    grid-row: 1 / 3;
    margin-inline-start: 16px;
  }

  /* Figma Type=Disclosure */
  & > [${part}='detail'] + [${part}='disclosure'] {
    margin-inline-start: 12px;
  }

  /* Figma “_Grabber” */
  & > [${part}='grabber'] {
    margin-inline-start: 12px;
  }

  ${whilePressed} {
    --styled-list-row-background: var(--color-ios-system-gray4);

    transition-duration: 0ms;

    &::before,
    & + *::before {
      opacity: 0;
    }
  }

  ${pressable.map((selector) => `&:has(> ${selector}:focus-visible)`).join(', ')} {
    outline: 2px solid var(--color-ios-primary);
    outline-offset: -2px;
  }

  &[data-swipe]::before,
  &[data-swipe] + *::before {
    opacity: 0;
  }

  /* Figma “Row with Swipe Actions”: the swiped row is a capsule. */
  &[data-swipe] {
    border-radius: ${swipeRadius}px;
    background-color: var(--color-ios-system-gray5);
  }
`;

type ItemContextValue = {
  /** The item's swipe actions, by side. */
  close: () => void;
  open: (side: Side) => void;
  /**
   * Sets (or, with `undefined`, removes) the actions of a side, and what
   * swiping past them does (see `Overswipe`).
   */
  setActions: (
    side: Side,
    element: HTMLElement | undefined,
    overswipe?: Overswipe,
  ) => void;
};

/**
 * What swiping past a side's actions does: nothing (`false`), triggering
 * the outermost action (`true`), or calling a handler.
 */
type Overswipe = boolean | (() => void);

const ItemContext = createContext<ItemContextValue | undefined>(undefined);

/** Closes the item whose swipe actions are open (one at a time). */
let closeOpenItem: (() => void) | undefined;

const swipeDuration = 300;
const swipeThreshold = 8;
/** Framework7 `swipeout.overswipeRatio`: of the actions' width. */
const overswipeRatio = 1.2;
/** Framework7 `swipeout-ios.less` `.swipeout-overswipe`. */
const overswipeDuration = 200;

const sides = ['leading', 'trailing'] as const;

const isRtl = (element: HTMLElement) =>
  getComputedStyle(element).direction === 'rtl';

/**
 * The part of a row's actions (`width` × `height`) the capsule-shaped row
 * doesn't cover, when it covers `covered` px of them from the row's side: up
 * to the row's rounded end, and below it (tall rows' labels hang below).
 */
const uncoveredPath = (
  width: number,
  height: number,
  covered: number,
  rowOnLeft: boolean,
) => {
  // The row's `border-radius`, as drawn.
  const radius = Math.min(swipeRadius, height / 2);
  const below = height + 20;

  if (rowOnLeft) {
    const end = covered;
    const start = end - radius;
    return `path('M ${start} 0 A ${radius} ${radius} 0 0 1 ${end} ${radius} L ${end} ${height - radius} A ${radius} ${radius} 0 0 1 ${start} ${height} L ${start} ${below} L ${width} ${below} L ${width} 0 Z')`;
  }

  const end = width - covered;
  const start = end + radius;
  return `path('M ${start} 0 A ${radius} ${radius} 0 0 0 ${end} ${radius} L ${end} ${height - radius} A ${radius} ${radius} 0 0 0 ${start} ${height} L ${start} ${below} L 0 ${below} L 0 0 Z')`;
};

/**
 * Moves the row `offset` px towards its inline end (negative: its start),
 * over its actions, which stay at the list's edge (Framework7: the row's
 * content slides over them): they show where the row uncovers them, scaling
 * in one after another from the edge.
 */
const placeRow = (
  item: HTMLElement,
  actions: Partial<Record<Side, HTMLElement>>,
  offset: number,
  animate: boolean,
) => {
  const direction = isRtl(item) ? -1 : 1;
  const transition = (...properties: string[]) =>
    properties
      .map((property) => `${property} ${animate ? swipeDuration : 0}ms`)
      .join(', ');

  item.style.transition = transition('transform');
  item.style.transform =
    offset === 0 ? '' : `translateX(${offset * direction}px)`;

  for (const side of sides) {
    const container = actions[side];
    if (!container) continue;

    const width = container.offsetWidth;
    const revealed = Math.max(0, side === 'leading' ? offset : -offset);
    // Negative past the actions (overswiped: the stretched action follows).
    const covered = width - revealed;
    // Whether the row is on the container's left (the edge on its right).
    const rowOnLeft = (side === 'trailing') === (direction === 1);

    container.style.transition = transition('transform', 'clip-path');
    container.style.transform =
      offset === 0 ? '' : `translateX(${-offset * direction}px)`;
    container.style.clipPath = uncoveredPath(
      width,
      container.offsetHeight,
      covered,
      rowOnLeft,
    );

    for (const button of container.children) {
      if (!(button instanceof HTMLElement)) continue;
      if (Object.hasOwn(button.dataset, 'overswipe')) continue;

      const start = rowOnLeft
        ? width - button.offsetLeft - button.offsetWidth
        : button.offsetLeft;
      const scale = Math.min(
        Math.max((revealed - start) / button.offsetWidth, 0),
        1,
      );

      button.style.transition = [
        transition('transform'),
        `opacity ${overswipeDuration}ms`,
      ].join(', ');
      button.style.transform = `scale(${scale})`;
    }
  }
};

/**
 * The row's offset for a swipe to `offset`: none towards a side without
 * actions, rubber-banding past the actions (Framework7 `swipeout.js`).
 */
const swipeOffset = (widths: Partial<Record<Side, number>>, offset: number) => {
  const width = widths[offset > 0 ? 'leading' : 'trailing'];
  if (width === undefined) return 0;
  if (Math.abs(offset) <= width) return offset;

  return Math.sign(offset) * (width + (Math.abs(offset) - width) ** 0.8);
};

/** The outermost action of a side's actions (Framework7: overswipe). */
const outermostAction = (container: HTMLElement, side: Side) => {
  const buttons = [...container.children].filter(
    (child) => child instanceof HTMLElement,
  );

  return side === 'trailing' ? buttons.at(-1) : buttons.at(0);
};

/** An outermost action's overswipe stretch (see `stretchAction`). */
type Stretch = {
  frame: number;
  /** The width eased from, since `start`. */
  from: number;
  start: number;
  stretched: boolean;
  target: number;
  width: number;
};

const stretches = new WeakMap<HTMLElement, Stretch>();

const easeOut = (progress: number) => 1 - (1 - progress) ** 3;

/**
 * Overswipe (Framework7 iOS): stretches the outermost action's circle over
 * the others (which fade out) and the whole area the row uncovers
 * (`revealed`, at least the actions' `width`), from the edge, its symbol and
 * label at the row's end; or, with `false`, back to its size. The circle
 * overlays the actions (they keep their layout); its width eases from where
 * it is towards the moving target (200ms), then follows it.
 */
const stretchAction = (
  container: HTMLElement,
  side: Side,
  stretch: false | { revealed: number; width: number },
) => {
  const outermost = outermostAction(container, side);
  const [circle, label] = outermost?.children ?? [];
  if (
    !outermost ||
    !(circle instanceof HTMLElement) ||
    !(label instanceof HTMLElement)
  ) {
    return;
  }

  const size = outermost.offsetWidth;
  let state = stretches.get(outermost);
  if (!state) {
    if (!stretch) return;
    state = {
      frame: 0,
      from: size,
      start: 0,
      stretched: false,
      target: size,
      width: size,
    };
    stretches.set(outermost, state);
  }

  const style = getComputedStyle(container);
  const padding =
    Number.parseFloat(style.paddingInlineStart) +
    Number.parseFloat(style.paddingInlineEnd);
  if (Boolean(stretch) !== state.stretched) {
    state.stretched = Boolean(stretch);
    state.from = state.width;
    state.start = performance.now();
  }
  state.target = stretch
    ? Math.max(stretch.width, stretch.revealed) - padding
    : size;

  // Whether the row is on the actions' left (the circle grows leftwards).
  const rowOnLeft = (side === 'trailing') !== isRtl(container);
  const current = state;

  const frame = () => {
    const progress = Math.min(
      (performance.now() - current.start) / overswipeDuration,
      1,
    );
    current.width =
      current.from + (current.target - current.from) * easeOut(progress);

    if (progress === 1 && !current.stretched) {
      stretches.delete(outermost);
      delete outermost.dataset.overswipe;
      for (const property of ['left', 'right', 'width', 'justify-content']) {
        circle.style.removeProperty(property);
      }
      label.style.removeProperty('translate');
      return;
    }

    outermost.dataset.overswipe = current.stretched ? 'stretched' : '';
    outermost.style.transform = 'scale(1)';
    circle.style.setProperty(rowOnLeft ? 'right' : 'left', '0');
    circle.style.width = `${current.width}px`;
    circle.style.justifyContent = rowOnLeft ? 'left' : 'right';
    label.style.translate = `${(rowOnLeft ? -1 : 1) * (current.width - size)}px`;
    if (progress < 1) current.frame = requestAnimationFrame(frame);
  };

  cancelAnimationFrame(state.frame);
  frame();
};

type Gesture = {
  base: number;
  offset: number;
  /** The side being overswiped. */
  overswipe?: Side;
  pointerId: number;
  started: boolean;
  time: number;
  /** The actions' widths, before any overswipe. */
  widths: Partial<Record<Side, number>>;
  x: number;
  y: number;
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

type Handler<E> = ((event: E) => void) | undefined;

/** A row (UIKit `UITableViewCell`), with optional swipe actions. */
const Item = forwardRef<HTMLElement, PartProps<'li'>>(
  (
    {
      children,
      onBlurCapture,
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
    const itemRef = useForwardedRef<HTMLElement>(ref);
    const actionsRef = useRef<Partial<Record<Side, HTMLElement>>>({});
    const overswipeRef = useRef<Partial<Record<Side, Overswipe>>>({});
    const gestureRef = useRef<Gesture | null>(null);
    const openSideRef = useRef<Side | undefined>(undefined);
    const suppressClickRef = useRef(false);
    const settleRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );
    const outsideRef = useRef<((event: Event) => void) | undefined>(undefined);

    const context = useMemo<ItemContextValue>(() => {
      const unstretch = () => {
        for (const side of sides) {
          const { [side]: container } = actionsRef.current;
          if (container) stretchAction(container, side, false);
        }
      };

      const value: ItemContextValue = {
        close: () => {
          const { current: item } = itemRef;

          if (outsideRef.current) {
            document.removeEventListener('pointerdown', outsideRef.current, {
              capture: true,
            });
            outsideRef.current = undefined;
          }
          if (closeOpenItem === value.close) closeOpenItem = undefined;
          openSideRef.current = undefined;
          if (!item) return;

          // An overswiped action stays stretched, covered by the row as it
          // slides back.
          placeRow(item, actionsRef.current, 0, true);

          // The row stays a capsule until it's back in place.
          clearTimeout(settleRef.current);
          settleRef.current = setTimeout(() => {
            if (openSideRef.current || gestureRef.current?.started) return;
            unstretch();
            delete item.dataset.swipe;
            item.style.removeProperty('transition');
          }, swipeDuration);
        },
        open: (side) => {
          const { current: item } = itemRef;
          const { [side]: container } = actionsRef.current;
          if (!item || !container) return;

          if (closeOpenItem !== value.close) closeOpenItem?.();
          closeOpenItem = value.close;
          openSideRef.current = side;
          clearTimeout(settleRef.current);
          unstretch();

          item.dataset.swipe = side;
          placeRow(
            item,
            actionsRef.current,
            (side === 'leading' ? 1 : -1) * container.offsetWidth,
            true,
          );

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
        },
      };

      return value;
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

    // A touch moving the slightest bit vertically would be scrolled (the row
    // pans vertically), cancelling its swipe: a touch on a swipeable row
    // that first moves more horizontally than vertically isn't scrolled
    // (as Framework7 swipeouts do; only touch events can prevent it).
    useEffect(() => {
      const { current: item } = itemRef;
      if (!item) return undefined;

      let start: { x: number; y: number } | undefined;
      let horizontal: boolean | undefined;

      const onTouchStart = ({ touches }: TouchEvent) => {
        const [touch] = touches;
        start =
          touches.length === 1 && touch
            ? { x: touch.clientX, y: touch.clientY }
            : undefined;
        horizontal = undefined;
      };

      const onTouchMove = (event: TouchEvent) => {
        const [touch] = event.touches;
        if (!start || !touch || !gestureRef.current) return;

        if (horizontal === undefined) {
          const x = Math.abs(touch.clientX - start.x);
          const y = Math.abs(touch.clientY - start.y);
          if (x === y) return;
          horizontal = x > y;
        }
        if (horizontal && event.cancelable) event.preventDefault();
      };

      item.addEventListener('touchstart', onTouchStart, { passive: true });
      item.addEventListener('touchmove', onTouchMove, { passive: false });
      return () => {
        item.removeEventListener('touchstart', onTouchStart);
        item.removeEventListener('touchmove', onTouchMove);
      };
    }, [itemRef]);

    const suppressClick = () => {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      });
    };

    const finish = (event: PointerEvent<HTMLElement>, cancelled: boolean) => {
      const { current: gesture } = gestureRef;
      if (gesture?.pointerId !== event.pointerId) return;
      gestureRef.current = null;

      if (!gesture.started) {
        // A tap on an open row closes it.
        if (!cancelled && openSideRef.current) {
          context.close();
          suppressClick();
        }
        return;
      }

      const { offset, overswipe } = gesture;
      const { [overswipe ?? 'trailing']: container } = actionsRef.current;

      // Overswiped: the outermost action is triggered (and closes the row;
      // clicked before suppressing the release's click), or the handler.
      if (overswipe && container && !cancelled) {
        const { [overswipe]: action } = overswipeRef.current;
        if (typeof action === 'function') {
          action();
          context.close();
        } else {
          outermostAction(container, overswipe)?.click();
        }
        suppressClick();
        return;
      }

      suppressClick();

      if (offset === 0 || cancelled) {
        context.close();
        return;
      }

      const side = offset > 0 ? 'leading' : 'trailing';
      const width = gesture.widths[side] ?? 0;
      const moved = offset - gesture.base;
      const quick = performance.now() - gesture.time < 300;
      const towards = side === 'leading' ? moved > 10 : moved < -10;

      if (quick ? towards : Math.abs(offset) > width / 2) {
        context.open(side);
      } else {
        context.close();
      }
    };

    const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
      (onPointerDown as Handler<typeof event>)?.(event);

      const { current: item } = itemRef;
      const { current: actions } = actionsRef;
      if (event.button !== 0 || gestureRef.current || !item) return;
      if (!actions.leading && !actions.trailing) return;
      if (
        sides.some((side) =>
          actions[side]?.contains(event.target as Node | null),
        )
      ) {
        return;
      }
      if (isOwnGesture(item, event)) return;

      const { current: side } = openSideRef;
      const base = side
        ? (side === 'leading' ? 1 : -1) * (actions[side]?.offsetWidth ?? 0)
        : 0;

      gestureRef.current = {
        base,
        offset: base,
        pointerId: event.pointerId,
        started: false,
        time: performance.now(),
        widths: Object.fromEntries(
          sides.flatMap((key) => {
            const { [key]: container } = actions;
            return container ? [[key, container.offsetWidth]] : [];
          }),
        ),
        x: event.clientX,
        y: event.clientY,
      };
    };

    // Framework7: past 1.2 times the actions' width, the outermost action
    // covers the others.
    const overswipe = (gesture: Gesture, side: Side, revealed: number) => {
      const { [side]: container } = actionsRef.current;
      const { [side]: width = 0 } = gesture.widths;
      const active =
        Boolean(overswipeRef.current[side]) &&
        revealed > width * overswipeRatio;

      if (gesture.overswipe && (!active || gesture.overswipe !== side)) {
        const { [gesture.overswipe]: previous } = actionsRef.current;
        if (previous) stretchAction(previous, gesture.overswipe, false);
        gesture.overswipe = undefined;
      }
      if (!active || !container) return;

      gesture.overswipe = side;
      stretchAction(container, side, { revealed, width });
    };

    const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
      (onPointerMove as Handler<typeof event>)?.(event);

      const { current: gesture } = gestureRef;
      const { current: item } = itemRef;
      if (!item || gesture?.pointerId !== event.pointerId) return;

      const moved = (event.clientX - gesture.x) * (isRtl(item) ? -1 : 1);

      if (!gesture.started) {
        const vertical = Math.abs(event.clientY - gesture.y);
        if (vertical > swipeThreshold && vertical > Math.abs(moved)) {
          gestureRef.current = null;
          return;
        }
        if (Math.abs(moved) < swipeThreshold) return;

        gesture.started = true;
        item.setPointerCapture(event.pointerId);
        if (closeOpenItem !== context.close) closeOpenItem?.();
        clearTimeout(settleRef.current);
        // Still stretched from a previous overswipe, if it hadn't settled.
        for (const side of sides) {
          const { [side]: container } = actionsRef.current;
          if (container) stretchAction(container, side, false);
        }
      }

      const { current: actions } = actionsRef;
      const offset = swipeOffset(gesture.widths, gesture.base + moved);
      const side = offset > 0 ? 'leading' : 'trailing';

      gesture.offset = offset;
      if (offset !== 0) item.dataset.swipe = side;
      placeRow(item, actions, offset, false);
      overswipe(gesture, side, Math.abs(offset));
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
          {...props}
          onBlurCapture={handleBlurCapture}
          onClickCapture={handleClickCapture}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onLostPointerCapture={(event: PointerEvent<HTMLElement>) => {
            (onLostPointerCapture as Handler<typeof event>)?.(event);
            // Only the row's own capture: taking it over from the touched
            // element (implicitly captured) makes that lose its capture.
            if (event.target !== event.currentTarget) return;
            finish(event, false);
          }}
          onPointerCancel={(event: PointerEvent<HTMLElement>) => {
            (onPointerCancel as Handler<typeof event>)?.(event);
            finish(event, true);
          }}
          onPointerUp={(event: PointerEvent<HTMLElement>) => {
            (onPointerUp as Handler<typeof event>)?.(event);
            finish(event, false);
          }}
        >
          {children}
        </StyledItem>
      </ItemContext.Provider>
    );
  },
);

// Figma “Title”; as a link or button (`render`), it makes the row pressable.
const Title = styled(
  partElement('span', 'title', [], { draggable: false }),
  forwardRef,
)`
  ${reset}
  ${textStyle('body')}

  min-width: 0;
  overflow-wrap: break-word;

  a&,
  button&,
  label& {
    ${cursor('pointer')}
    &::after {
      position: absolute;
      content: '';
      inset: 0;
    }
  }

  &:disabled {
    ${cursorProperty('not-allowed')}
  }

  &:focus-visible {
    outline: none;
  }
`;

// Figma “Subtitle” (rows), “Supertitle” and “Subtitle” (headers).
const Subtitle = styled(partElement('span', 'subtitle'), forwardRef)`
  min-width: 0;
  margin: 0;
  color: var(--color-ios-secondary-label);
  ${textStyle('subheadline')}
  overflow-wrap: break-word;
  pointer-events: none;
`;

export type ListTextProps = PartProps<'span'> & {
  /** Lines shown at most, ellipsized (default: 2; Framework7 `.item-text`). */
  lines?: number;
};

/**
 * Body text below a row's title and subtitle, making it a media row (as in
 * Mail; Framework7 `.media-list` `.item-text`).
 */
const Text = styled(partElement('span', 'text'), forwardRef)<ListTextProps>`
  display: -webkit-box;
  overflow: hidden;
  min-width: 0;
  margin: 0;
  -webkit-box-orient: vertical;
  color: var(--color-ios-secondary-label);
  ${textStyle('subheadline')}
  -webkit-line-clamp: attr(lines type(<integer>), 2);
  overflow-wrap: break-word;
  pointer-events: none;
`;

const Supertitle = styled(partElement('span', 'supertitle'), forwardRef)`
  min-width: 0;
  margin: 0;
  color: var(--color-ios-secondary-label);
  font-size: 15px;
  ${fontWeight(400)}
  letter-spacing: -0.45px;
  line-height: 20px;
  overflow-wrap: break-word;
`;

// Figma “Detail”.
const Detail = styled(partElement('span', 'detail'), forwardRef)`
  color: var(--color-ios-secondary-label);
  ${textStyle('body')}
  pointer-events: none;
  white-space: nowrap;
`;

export type ListImageProps = PartProps<'span'> & {
  /** Figma “_Images” Type (default: `symbol`). */
  variant?: 'circular' | 'fill' | 'rounded' | 'symbol';
};

const imageVariants: Record<Required<ListImageProps>['variant'], string> = {
  circular: css`
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: var(--color-ios-tertiary-system-fill);
    color: var(--color-ios-secondary-label);
    font-size: 21px;
    margin-block: -12px;
  `,
  fill: css`
    width: 52px;
    height: 52px;
    background-color: var(--color-ios-tertiary-system-fill);
    color: var(--color-ios-secondary-label);
    font-size: 21px;
    margin-block: -12px;
  `,
  rounded: css`
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background-color: var(--color-ios-primary);
    color: #fff;
    font-size: 17px;
    margin-block: -12px;
  `,
  symbol: css`
    width: 28px;
    min-height: 20px;
    color: var(--color-ios-primary);
    font-size: var(--font-ios-body-size);
    line-height: 20px;
  `,
};

// Figma “_Images”: a symbol, or an image (`img`, `video`, `canvas` filling
// it, or a symbol) in a rounded, circular or square frame.
const Image = styled(
  partElement('span', 'image', ['variant']),
  forwardRef,
)<ListImageProps>`
  display: grid;
  overflow: hidden;
  box-sizing: border-box;
  ${fontWeight(400)}
  place-items: center;
  pointer-events: none;
  ${({ variant = 'symbol' }) => imageVariants[variant]}

  & > :is(img, video, canvas) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Figma “Symbol” and “Info”: a symbol in the tint color, pressable as a
// link or button (`render`).
const Accessory = styled(partElement('span', 'accessory'), forwardRef)`
  ${reset}

  display: grid;
  min-width: 22px;
  min-height: 22px;
  color: var(--color-ios-primary);
  font-size: var(--font-ios-body-size);
  ${fontWeight(400)}
  line-height: var(--font-ios-body-line-height);
  place-items: center;

  &:is(a, button) {
    ${cursor('pointer')}
  }

  &:not(a, button) {
    pointer-events: none;
  }
`;

// Figma “Checkmark” (􀆅, 17px, 590).
const StyledCheckmark = styled(partElement('span', 'checkmark'), forwardRef)`
  display: grid;
  min-width: 22px;
  min-height: 22px;
  color: var(--color-ios-label);
  font-size: var(--font-ios-body-size);
  ${fontWeight(590)}
  place-items: center;
  pointer-events: none;
`;

const Checkmark = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, ...props }, ref) => (
    <StyledCheckmark
      ref={ref}
      {...props}
    >
      {children ?? <Check />}
    </StyledCheckmark>
  ),
);

// Figma “Drill-in” (􀆊, 17px, 590).
const StyledDrillIn = styled(partElement('span', 'drill-in'), forwardRef)`
  display: grid;
  min-width: 8px;
  min-height: 22px;
  color: var(--color-ios-tertiary-label);
  font-size: var(--font-ios-body-size);
  ${fontWeight(590)}
  place-items: center;
  pointer-events: none;
  ${mirrored}
`;

const DrillIn = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, ...props }, ref) => (
    <StyledDrillIn
      ref={ref}
      aria-hidden="true"
      {...props}
    >
      {children ?? <Chevron />}
    </StyledDrillIn>
  ),
);

// Figma “Disclosure” (rows: 17px, headers: 19px, 590, in the tint color),
// turned down while open (e.g. in a Base UI `Collapsible.Trigger`).
const StyledDisclosure = styled(partElement('span', 'disclosure'), forwardRef)`
  --styled-list-disclosure-turn: 90deg;

  display: grid;
  min-width: 8px;
  min-height: 22px;
  color: var(--color-ios-primary);
  font-size: var(--font-ios-body-size);
  ${fontWeight(590)}
  place-items: center;
  pointer-events: none;

  &:dir(rtl) {
    --styled-list-disclosure-turn: -90deg;

    scale: -1 1;
  }

  & > svg {
    transition: rotate 200ms;
  }

  [data-panel-open] & > svg,
  &[data-panel-open] > svg {
    rotate: var(--styled-list-disclosure-turn);
  }
`;

const Disclosure = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, ...props }, ref) => (
    <StyledDisclosure
      ref={ref}
      aria-hidden="true"
      {...props}
    >
      {children ?? <Chevron />}
    </StyledDisclosure>
  ),
);

// Figma “_Grabber” (􀌇, 17px, 400).
const StyledGrabber = styled(partElement('span', 'grabber'), forwardRef)`
  display: grid;
  min-width: 22px;
  min-height: 25px;
  color: var(--color-ios-tertiary-label);
  ${cursor('grab')}
  font-size: var(--font-ios-body-size);
  ${fontWeight(400)}
  place-items: center;
  touch-action: none;
`;

/**
 * Figma “_Grabber”: drags its row to reorder its group (see `Group`
 * `onReorder`); focused, arrow keys move the row.
 */
const Grabber = forwardRef<HTMLElement, PartProps<'span'>>(
  ({ children, ...props }, ref) => (
    <StyledGrabber
      ref={ref}
      tabIndex={0}
      {...props}
    >
      {children ?? <Lines />}
    </StyledGrabber>
  ),
);

// Figma Type=Pop-up: the value and 􀆏 (e.g. as a `Menu.Trigger`).
const StyledPopUp = styled(
  partElement('button', 'pop-up', [], { type: 'button' }),
  forwardRef,
)`
  ${reset}

  display: inline-flex;
  align-items: center;
  color: var(--color-ios-secondary-label);
  ${cursor('pointer')}
  ${textStyle('body')}
  gap: 10px;
  white-space: nowrap;

  & > svg {
    width: 13px;
  }
`;

const PopUp = forwardRef<HTMLElement, PartProps<'button'>>(
  ({ children, ...props }, ref) => (
    <StyledPopUp
      ref={ref}
      {...props}
    >
      {children}
      <UpDown />
    </StyledPopUp>
  ),
);

// Figma Type=Button (rows) and Type=Action (headers): text in the tint
// color.
const Action = styled(
  partElement('button', 'action', [], { type: 'button' }),
  forwardRef,
)`
  ${reset}

  color: var(--color-ios-primary);
  ${cursor('pointer')}
  ${textStyle('body')}
  white-space: nowrap;

  &:disabled {
    ${cursorProperty('not-allowed')}
    color: var(--color-ios-system-gray2);
  }
`;

export type ListButtonProps = PartProps<'button'> & {
  /** Figma Value=Destructive. */
  destructive?: boolean;
};

// Figma “Row - Button”: a pressable row's title in the tint color.
const Button = styled(
  partElement('button', 'button', ['destructive'], { type: 'button' }),
  forwardRef,
)<ListButtonProps>`
  ${reset}
  ${textStyle('body')}

  min-width: 0;
  color: ${({ destructive }) =>
    destructive ? 'var(--color-ios-system-red)' : 'var(--color-ios-primary)'};
  ${cursor('pointer')}
  overflow-wrap: break-word;
  text-align: start;

  &::after {
    position: absolute;
    content: '';
    inset: 0;
  }

  &:disabled {
    ${cursorProperty('not-allowed')}
    color: var(--color-ios-system-gray2);
  }

  &:focus-visible {
    outline: none;
  }
`;

// Figma “_Edit Buttons”: 22px circles.
const editCircle = css`
  display: grid;
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  border-radius: 50%;
  color: #fff;
  font-size: 14.5px;
  ${fontWeight(590)}
  place-items: center;
`;

const selectCircle = css`
  ${editCircle}

  border: 1.5px solid var(--color-ios-system-gray3);

  &[data-checked] {
    border-color: transparent;
    background-color: var(--color-ios-primary);
  }

  &[data-disabled] {
    opacity: 0.5;
  }
`;

const selectCursor = ({ disabled }: { disabled?: boolean }) =>
  cursor(disabled ? 'not-allowed' : 'pointer');

const StyledCheckbox = styled(BaseCheckbox.Root, forwardRef)`
  ${selectCircle}
  ${selectCursor}
`;

const CheckboxIndicator = styled(BaseCheckbox.Indicator, forwardRef)`
  display: contents;
`;

/** Figma State=Selected/Unselected: a Base UI checkbox (selecting rows). */
const Checkbox = forwardRef<HTMLElement, Omit<BaseCheckbox.Root.Props, 'ref'>>(
  ({ children, ...props }, ref) => (
    <StyledCheckbox
      ref={ref}
      {...{ [part]: 'edit' }}
      {...props}
    >
      {children ?? (
        <CheckboxIndicator>
          <Check />
        </CheckboxIndicator>
      )}
    </StyledCheckbox>
  ),
);

const StyledRadio = styled(BaseRadio.Root, forwardRef)`
  ${selectCircle}
  ${selectCursor}
`;

const RadioIndicator = styled(BaseRadio.Indicator, forwardRef)`
  display: contents;
`;

/**
 * A Base UI radio (selecting one row), as `Checkbox`; its group is a Base UI
 * `RadioGroup` (e.g. rendering a `Group`).
 */
const Radio = forwardRef<HTMLElement, Omit<BaseRadio.Root.Props, 'ref'>>(
  ({ children, ...props }, ref) => (
    <StyledRadio
      ref={ref}
      {...{ [part]: 'edit' }}
      {...props}
    >
      {children ?? (
        <RadioIndicator>
          <Check />
        </RadioIndicator>
      )}
    </StyledRadio>
  ),
);

export type ListEditButtonProps = PartProps<'button'> & {
  /** UIKit `UITableViewCell.EditingStyle` (default: `delete`). */
  editingStyle?: 'delete' | 'insert';
};

const StyledEditButton = styled(
  partElement('button', 'edit', ['editingStyle'], { type: 'button' }),
  forwardRef,
)<ListEditButtonProps>`
  ${reset}
  ${editCircle}

  background-color: ${({ editingStyle }) =>
    editingStyle === 'insert'
      ? 'var(--color-ios-system-green)'
      : 'var(--color-ios-system-red)'};
  color: #fff;
  ${cursor('pointer')}

  &:disabled {
    ${cursorProperty('not-allowed')}
    opacity: 0.5;
  }
`;

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

// Swipe actions (Figma “Row with Swipe Actions”, “_Swipe Actions”): circles
// 10px apart, 10px from the row and 16px from the edge.

export type ListSwipeActionsProps = PartProps<'div'> & {
  /**
   * Called when released swiped on past the actions (overswiped), instead of
   * triggering the outermost action; enables `overswipe`.
   */
  onOverswipe?: () => void;
  /**
   * Swiping on past the actions stretches the outermost one over the area
   * the row uncovers, and triggers it on release (Framework7
   * `.swipeout-overswipe`; UIKit `performsFirstActionWithFullSwipe`).
   */
  overswipe?: boolean;
  /** The row's side the actions are revealed on (default: `trailing`). */
  side?: Side;
};

const StyledSwipeActions = styled(
  partElement('div', 'swipe-actions', ['overswipe', 'side']),
  forwardRef,
)<ListSwipeActionsProps>`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: var(--styled-list-actions-align, center);
  gap: 10px;
  pointer-events: none;
  ${({ side }) =>
    side === 'leading'
      ? css`
          inset-inline-start: 0;
          padding-inline: 16px 10px;
        `
      : css`
          inset-inline-end: 0;
          padding-inline: 10px 16px;
        `}

  & > * {
    pointer-events: auto;
  }

  /* The others fade out under a stretched action (labels included). */
  &:has(> [data-overswipe='stretched']) {
    & > :not([data-overswipe]) {
      opacity: 0;
    }
  }
`;

const SwipeActions = forwardRef<HTMLElement, ListSwipeActionsProps>(
  (
    {
      onFocusCapture,
      onOverswipe,
      overswipe = false,
      side = 'trailing',
      ...props
    },
    ref,
  ) => {
    const item = useContext(ItemContext);
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
    }, [elementRef, hasHandler, item, overswipe, side]);

    return (
      <StyledSwipeActions
        ref={elementRef}
        side={side}
        {...props}
        onFocusCapture={(event: FocusEvent<HTMLElement>) => {
          (onFocusCapture as Handler<typeof event>)?.(event);
          item?.open(side);
        }}
      />
    );
  },
);

export type ListSwipeActionProps = PartProps<'button'> & {
  /** The action's name, shown below it in tall rows (Figma “Label”). */
  label: string;
  /** Background color (default: `systemGray`). */
  tint?: string;
};

const StyledSwipeAction = styled(
  partElement('button', 'swipe-action', ['label', 'tint'], {
    type: 'button',
  }),
  forwardRef,
)<Omit<ListSwipeActionProps, 'label'>>`
  ${reset}

  position: relative;
  display: grid;
  width: var(--styled-list-action-size, 52px);
  height: var(--styled-list-action-height, 52px);
  align-content: start;
  color: #fff;
  ${cursor('pointer')}
  justify-items: center;
  transform: scale(0);

  &:disabled {
    ${cursorProperty('not-allowed')}
  }

  /* Overswiped: its circle stretched over the other actions (see
     stretchAction) */
  &[data-overswipe] {
    z-index: 1;

    & > [${part}='swipe-action-circle'] {
      position: absolute;
      top: 0;
      grid-template-columns: var(--styled-list-action-size, 52px);
    }
  }

  & > [${part}='swipe-action-circle'] {
    display: grid;
    width: 100%;
    height: var(--styled-list-action-size, 52px);
    border-radius: 100px;
    background-color: ${({ tint }) => tint ?? 'var(--color-ios-system-gray)'};
    font-size: var(--styled-list-action-symbol-size);
    ${fontWeight(400)}
    line-height: var(--font-ios-body-line-height);
    place-items: center;
  }

  & > [${part}='swipe-action-label'] {
    position: absolute;
    top: calc(var(--styled-list-action-size, 52px) + 4px);
    display: var(--styled-list-action-label-display, none);
    color: var(--color-ios-secondary-label);
    font-size: 13px;
    ${fontWeight(510)}
    line-height: 16px;
    white-space: nowrap;
  }
`;

/** A swipe action: a symbol in a circle, closing the actions when clicked. */
const SwipeAction = forwardRef<HTMLElement, ListSwipeActionProps>(
  ({ children, label, onClick, ...props }, ref) => {
    const item = useContext(ItemContext);

    return (
      <StyledSwipeAction
        ref={ref}
        aria-label={label}
        {...props}
        onClick={(event: MouseEvent<HTMLElement>) => {
          (onClick as Handler<typeof event>)?.(event);
          item?.close();
        }}
      >
        <span {...{ [part]: 'swipe-action-circle' }}>{children}</span>
        <span
          aria-hidden="true"
          {...{ [part]: 'swipe-action-label' }}
        >
          {label}
        </span>
      </StyledSwipeAction>
    );
  },
);

// Headers (Figma “Header” Type, “Section Title”) and footers (Figma
// “Grouped Table Footer”).

export type ListHeaderProps = PartProps<'div'> & {
  /**
   * Figma “Header” Type (default: `prominent`); `nested` headers of plain
   * lists are section titles (Figma “Section Title”).
   */
  prominence?: 'extraProminent' | 'nested' | 'prominent';
};

const prominences: Record<Required<ListHeaderProps>['prominence'], string> = {
  extraProminent: css`
    padding-block: 8px 10px;

    & > [${part}='title'] {
      color: var(--color-ios-label);
      font-size: 22px;
      ${fontWeight(700)}
      letter-spacing: -0.45px;
      line-height: 28px;
    }
  `,
  nested: css`
    min-height: var(--styled-list-nested-min-height, 0);
    padding-block: var(--styled-list-nested-padding-block, 10px);

    & > [${part}='title'] {
      color: var(--color-ios-secondary-label);
      font-size: var(--styled-list-nested-size, 17px);
      ${fontWeight(590)}
      letter-spacing: var(--styled-list-nested-tracking, 0);
      line-height: var(--styled-list-nested-line-height, 22px);
    }
  `,
  prominent: css`
    padding-block: 5px 10px;

    & > [${part}='title'] {
      color: var(--color-ios-label);
      ${textStyle('title3', { emphasized: true })}
    }
  `,
};

const Header = styled(
  partElement('div', 'header', ['prominence']),
  forwardRef,
)<ListHeaderProps>`
  position: var(--styled-list-header-position, static);
  z-index: 2;
  top: 0;
  display: grid;
  box-sizing: border-box;
  align-content: end;
  align-items: end;
  background-color: var(--styled-list-header-background, transparent);
  grid-auto-flow: column;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto auto;
  padding-inline: calc(16px + var(--styled-list-inset, 16px));
  ${({ prominence = 'prominent' }) => prominences[prominence]}

  &::after {
    content: '';
    grid-area: 1 / 1 / 4;
    pointer-events: none;
  }

  & > [${part}='supertitle'] {
    grid-area: 1 / 1;
    margin-block-end: 2px;
  }

  & > [${part}='title'] {
    grid-area: 2 / 1;
  }

  & > [${part}='subtitle'] {
    font-size: 15px;
    grid-area: 3 / 1;
    letter-spacing: -0.45px;
    line-height: 20px;
    margin-block-start: 2px;
  }

  /* Figma “Trailing”, “_Header Trailing Accessories” */
  & > :not([${part}='supertitle'], [${part}='title'], [${part}='subtitle']) {
    grid-row: 1 / 4;
    margin-inline-start: 16px;
  }

  & > [${part}='detail'] {
    font-size: 17px;
    letter-spacing: 0;
    line-height: 22px;
  }

  /* Figma: 8.7px between the detail and the chevron; turned down (open),
     the chevron is wider: 7px apart, closed 11px */
  & > [${part}='detail'] + [${part}='disclosure'] {
    margin-inline-start: 8px;
  }

  /* The box fits the glyph turned down, too (Figma: 12px) */
  & > [${part}='disclosure'] {
    min-width: 13px;
    font-size: 19px;
  }

  & > [${part}='action'] {
    font-size: 15px;
    letter-spacing: 0;
    line-height: 20px;
  }

  & > [${part}='image'] {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    margin-block: 0;
  }

  /* Its symbol aligned with the rows' trailing parts */
  & > [${part}='accessory'] {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: color-mix(
      in srgb,
      var(--color-ios-primary) 5%,
      transparent
    );
    margin-inline-end: -11px;
  }
`;

const Footer = styled(partElement('div', 'footer'), forwardRef)`
  display: block;
  padding: 8px calc(16px + var(--styled-list-inset, 16px)) 6px;
  color: var(--color-ios-secondary-label);
  font-size: 13px;
  ${fontWeight(400)}
  line-height: 18px;
`;

export type ListBlockProps = PartProps<'div'> & {
  /** On the rows' background (Framework7 `.block-strong`). */
  strong?: boolean;
};

// Framework7 “Content Block” (`block.less`): text aligned with the rows'.
const Block = styled(
  partElement('div', 'block', ['strong']),
  forwardRef,
)<ListBlockProps>`
  display: flow-root;
  color: var(--color-ios-label);
  margin-inline: var(--styled-list-inset, 16px);
  ${textStyle('body')}
  padding-inline: 16px;
  ${({ strong }) =>
    strong
      ? css`
          border-radius: var(--styled-list-radius, 24px);
          background-color: var(
            --styled-list-group-background,
            var(--color-ios-secondary-system-grouped-background)
          );
          padding-block: 16px;
        `
      : ''}

  & > :first-child {
    margin-block-start: 0;
  }

  & > :last-child {
    margin-block-end: 0;
  }
`;

// Index (Figma “Index Bar”; Framework7 “List Index”): letters in the tint
// color, selected by pressing or scrubbing over them (clicking each item).
// Placing it is up to the page (Framework7: at the page's edge), above the
// sticky headers of plain lists (z-index 2).

export type ListIndexProps = PartProps<'nav'> & {
  /** UIKit size class: `compact` (iPhone, default) or `regular` (iPad). */
  size?: 'compact' | 'regular';
};

const StyledIndex = styled(
  partElement('nav', 'index', ['size']),
  forwardRef,
)<ListIndexProps>`
  display: flex;
  min-width: ${({ size }) => (size === 'regular' ? '30px' : '16px')};
  flex-direction: column;
  justify-content: center;
  gap: ${({ size }) => (size === 'regular' ? '9px' : '0')};
  touch-action: none;
  user-select: none;
`;

/** The index item nearest to `y`. */
const indexItemAt = (index: HTMLElement, y: number) => {
  let nearest: [HTMLElement, number] | undefined;

  for (const item of index.querySelectorAll(
    `[${CSS.escape(part)}='index-item']`,
  )) {
    if (!(item instanceof HTMLElement)) continue;

    const { bottom, top } = item.getBoundingClientRect();
    const distance = Math.abs((top + bottom) / 2 - y);
    if (!nearest || distance < nearest[1]) nearest = [item, distance];
  }

  return nearest?.[0];
};

type Scrub = { item?: HTMLElement };

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

const IndexItem = styled(
  partElement('button', 'index-item', [], { type: 'button' }),
  forwardRef,
)`
  ${reset}

  display: block;
  color: var(--color-ios-primary);
  ${cursor('pointer')}
  ${textStyle('caption1', { emphasized: true })}
  text-align: center;
`;

export const List = {
  Root,
  Section,
  Header,
  Group,
  Item,
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
  PopUp,
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
