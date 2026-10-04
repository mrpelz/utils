import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { useRender } from '@base-ui/react/use-render';
import { Properties } from 'csstype';
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
//   on a quick swipe (300ms, 10px); optionally, swiping on past them
//   (without rubber-banding) stretches the outermost action from the edge
//   up to the others, which follow the row, and arms overswiping past 304px
//   (Framework7: 1.2 times the actions), triggering it on release;
//   armed, its symbol moves to the row's end, its label hides (150ms)
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
// trigger; up to 36px high (e.g. a `Stepper` or `Segmented`), they fit
// regular rows (8px from their edges). Rows with a subtitle are tall (Figma
// Height=Tall: 68px); others are regular (52px).
// Both are minimum heights, growing with wrapping text. A row is pressable when its
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
// - Swiped rows keep a round end at their place's edge, their content
//   sliding away beneath it (iOS; Figma shows rows opened in place only).
// - Swipe actions are 44px circles, 4px from a regular row's edges (Figma:
//   52px, the row's height), or rounded rectangles as high as the row (as
//   iOS notifications'), by action; labels are optional (for multi-line
//   rows), 4px below the shapes, in 13px (Figma: 50px circles, 3px above
//   15px labels, which overflow a 68px row). Symbols can be text, in
//   capitals (regular weight).
// - Actions fade in as they scale in, and the others fade out while
//   overswiping (iOS; Figma: none).
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

// Pressed: a pressable title or button, or a row with a click handler,
// pressed itself (see `Item`).
const whilePressed = [
  ...pressable.map((selector) => `&:has(> ${selector}:active)`),
  '&[data-pressed]',
].join(', ');

/** A row's own controls (pressing them doesn't press a pressable row). */
const ownControl =
  'a, button, input, select, textarea, label, [role], [tabindex]';

export type ListItemProps = PartProps<'li'> & {
  /** As `Button`: the cursor (default: `pointer` with a click handler). */
  cursor?: Properties['cursor'];
};

const StyledItem = styled(partElement('li', 'item'), forwardRef)<ListItemProps>`
  --styled-list-min-height: 52px;

  ${({ onClick }) => cursor(onClick ? 'pointer' : 'auto')}

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

  /* Fields (see Field, Root rendering the row): the label as the title, in
     Body, the control filling the rest of the row (the label's column as
     wide as it), the clear button 8px after it, messages below. */
  &:has(> [data-text-field-part='control']) {
    grid-template-columns: auto auto minmax(0, max-content) minmax(0, 1fr);
    grid-template-rows: auto auto auto;

    & > [data-text-field-part='label'] {
      align-self: center;
      color: var(--color-ios-label);
      grid-area: 1 / 3;
      margin-block: 0;
      margin-inline: 0 16px;
      ${textStyle('body')}
    }

    & > [data-text-field-part='control'] {
      position: relative;
      align-self: center;
      margin: 0;
      grid-area: 1 / 4;
    }

    & > textarea[data-text-field-part='control'] {
      align-self: start;
    }

    &:not(:has(> [data-text-field-part='label']))
      > [data-text-field-part='control'] {
      grid-column: 3 / 5;
    }

    & > [data-text-field-part='clear'] {
      grid-row: 1;
      margin-block: 0;
      margin-inline-start: 8px;
    }

    & > [data-text-field-part='description'],
    & > [data-text-field-part='error'] {
      margin: 4px 0 0;
      grid-column: 3 / -1;
    }

    & > [data-text-field-part='description'] {
      grid-row: 2;
    }

    & > [data-text-field-part='error'] {
      grid-row: 3;
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

    /* To the padding edge (auto, as absolutely positioned; line 99 exists
       in rows spanning to it, e.g. media rows). */
    grid-column: 3 / auto;
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
    margin-block: -4px;
    margin-inline-start: 16px;
  }

  /* A row of a single control (no row part, e.g. a Slider): across the
     row's content. */
  &:not(:has(> [${part}])) > :only-child {
    z-index: auto;
    margin: 0;
    grid-column: 1 / -1;
    grid-row: 1 / 3;
    justify-self: stretch;
  }

  /* A calendar (DatePicker, inline) has its own insets: across the row. */
  &:not(:has(> [${part}])) > [data-date-picker-part='calendar']:only-child {
    margin: -12px -16px;
  }

  /* Trailing controls filling their container elsewhere (e.g. Segmented)
     take their content's width. */
  & > [role='radiogroup'] {
    width: auto;
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

  /* Figma “Row with Swipe Actions”: the swiped row is a capsule (also
     first and last rows, see above). */
  &&[data-swipe] {
    border-radius: ${swipeRadius}px;
    background-color: var(--color-ios-system-gray5);
  }

  /* An expandable row, closed (see Expandable): no height, nor separator. */
  &[data-closed] {
    overflow: hidden;
    height: 0;
    min-height: 0;
    padding-block: 0;
    visibility: hidden;

    &::before {
      opacity: 0;
    }
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
/**
 * How far a row arms overswiping, with any actions (also fewer, or
 * labelled ones): past 5 circles (5 × (44 + 10) + 16 + 10 + 8px;
 * Framework7: 1.2 times the actions' width), at least 8px past its actions.
 * Released before, it doesn't.
 */
const overswipeArm = 304;
const overswipeDistance = 8;
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
  button.style.setProperty('--styled-list-action-width', `${width}px`);
  shape.style.transition = transition('width', 'margin');
  // In pixels (from and to its own size), to transition; cleared once the
  // row is closed (see `Item`).
  shape.style.width = `${width + Math.max(extra, 0)}px`;
  shape.style.marginLeft = towardsRow < 0 ? margin : '';
  shape.style.marginRight = towardsRow > 0 ? margin : '';
  label.style.transition = `${transition('translate')}, opacity ${armDuration}ms`;
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
 * A swiped row's clip (`width` × `height`), moved `offset` px (physical):
 * rounded at its place's edge on the side it leaves, so its content slides
 * away beneath that round end; reaching beyond its other end, over its
 * actions (which clip themselves, see `uncoveredPath`).
 */
const rowPath = (width: number, height: number, offset: number) => {
  const radius = Math.min(swipeRadius, height / 2);
  const distance = Math.abs(offset);

  if (offset <= 0) {
    const start = distance + radius;
    return `path('M ${start} 0 H ${width + distance} V ${height} H ${start} A ${radius} ${radius} 0 0 1 ${distance} ${height - radius} V ${radius} A ${radius} ${radius} 0 0 1 ${start} 0 Z')`;
  }

  const end = width - distance;
  return `path('M ${-distance} 0 H ${end - radius} A ${radius} ${radius} 0 0 1 ${end} ${radius} V ${height - radius} A ${radius} ${radius} 0 0 1 ${end - radius} ${height} H ${-distance} Z')`;
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
  overswipes: (side: Side) => boolean,
) => {
  const direction = isRtl(item) ? -1 : 1;
  const transition = (...properties: string[]) =>
    properties
      .map((property) => `${property} ${animate ? swipeDuration : 0}ms`)
      .join(', ');

  item.style.transition = transition('transform', 'clip-path');
  item.style.transform =
    offset === 0 ? '' : `translateX(${offset * direction}px)`;
  item.style.clipPath = rowPath(
    item.offsetWidth,
    item.offsetHeight,
    offset * direction,
  );

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

    // Overswiping: the others follow the row, the outermost action's shape
    // fills the space up to them, from the edge (see `stretchAction`), the
    // others fading until it's armed.
    const extra = overswipes(side) ? Math.max(0, revealed - width) : 0;
    const outermost = outermostAction(container, side);
    const towardsRow = rowOnLeft ? -1 : 1;
    const arming = Math.min(
      extra / (Math.max(width + overswipeDistance, overswipeArm) - width),
      1,
    );

    for (const button of container.children) {
      if (!(button instanceof HTMLElement)) continue;

      const start = rowOnLeft
        ? width - button.offsetLeft - button.offsetWidth
        : button.offsetLeft;
      const scale = Math.min(
        Math.max((revealed - start) / button.offsetWidth, 0),
        1,
      );
      const fade = Math.min(
        actionFade + (1 - actionFade) * scale,
        button === outermost ? 1 : 1 - (1 - actionFade) * arming,
      );

      button.style.transition = transition('transform', 'translate');
      button.style.transform = `scale(${scale})`;
      button.style.setProperty('--styled-list-action-fade', String(fade));
      button.style.setProperty(
        '--styled-list-action-fade-duration',
        `${animate ? swipeDuration : 0}ms`,
      );
      if (button === outermost) {
        stretchAction(button, extra, towardsRow, transition);
      } else {
        button.style.translate = extra > 0 ? `${towardsRow * extra}px` : '';
      }
    }
  }
};

/**
 * The row's offset for a swipe to `offset`: none towards a side without
 * actions, rubber-banding past the actions (Framework7 `swipeout.js`),
 * unless they can be overswiped (`overswipes`).
 */
const swipeOffset = (
  widths: Partial<Record<Side, number>>,
  offset: number,
  overswipes: (side: Side) => boolean,
) => {
  const side = offset > 0 ? 'leading' : 'trailing';
  const width = widths[side];
  if (width === undefined) return 0;
  if (Math.abs(offset) <= width || overswipes(side)) return offset;

  return Math.sign(offset) * (width + (Math.abs(offset) - width) ** 0.8);
};

type Gesture = {
  base: number;
  offset: number;
  /** The side overswiping is armed on. */
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

/**
 * A row (UIKit `UITableViewCell`), with optional swipe actions. With a click
 * handler, it's pressable itself (e.g. passing the click on to a control in
 * it), but where its own controls are pressed.
 */
const Item = forwardRef<HTMLElement, ListItemProps>(
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
      const overswipes = (side: Side) => Boolean(overswipeRef.current[side]);

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

          // An overswiped action narrows as the row slides back.
          placeRow(item, actionsRef.current, 0, true, overswipes);

          // The row stays a capsule until it's back in place.
          clearTimeout(settleRef.current);
          settleRef.current = setTimeout(() => {
            if (openSideRef.current || gestureRef.current?.started) return;
            delete item.dataset.swipe;
            for (const button of item.querySelectorAll<HTMLElement>(
              '[data-armed]',
            )) {
              delete button.dataset.armed;
            }
            for (const shape of item.querySelectorAll<HTMLElement>(
              `[${CSS.escape(part)}='swipe-action-shape']`,
            )) {
              shape.style.removeProperty('width');
            }
            item.style.removeProperty('transition');
            item.style.removeProperty('clip-path');
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

          item.dataset.swipe = side;
          placeRow(
            item,
            actionsRef.current,
            (side === 'leading' ? 1 : -1) * container.offsetWidth,
            true,
            overswipes,
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

    const release = () => {
      if (itemRef.current) delete itemRef.current.dataset.pressed;
    };

    const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
      (onPointerDown as Handler<typeof event>)?.(event);

      const { current: item } = itemRef;
      const { current: actions } = actionsRef;
      if (event.button !== 0 || gestureRef.current || !item) return;

      const { target } = event;
      const control =
        target instanceof Element ? target.closest(ownControl) : null;
      if (props.onClick && !(control && item.contains(control))) {
        item.dataset.pressed = '';
      }
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

    // Far enough past its actions, overswiping is armed (the outermost
    // action is triggered on release).
    const overswipe = (gesture: Gesture, side: Side, revealed: number) => {
      const { [side]: container } = actionsRef.current;
      const { [side]: width = 0 } = gesture.widths;
      const armed =
        Boolean(overswipeRef.current[side]) &&
        container !== undefined &&
        revealed > Math.max(width + overswipeDistance, overswipeArm);

      gesture.overswipe = armed ? side : undefined;
      for (const key of sides) {
        const { [key]: actions } = actionsRef.current;
        const action = actions && outermostAction(actions, key);
        action?.toggleAttribute('data-armed', armed && key === side);
      }
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
        release();
        item.setPointerCapture(event.pointerId);
        if (closeOpenItem !== context.close) closeOpenItem?.();
        clearTimeout(settleRef.current);
      }

      const { current: actions } = actionsRef;
      const offset = swipeOffset(gesture.widths, gesture.base + moved, (key) =>
        Boolean(overswipeRef.current[key]),
      );
      const side = offset > 0 ? 'leading' : 'trailing';

      gesture.offset = offset;
      if (offset !== 0) item.dataset.swipe = side;
      placeRow(item, actions, offset, false, (key) =>
        Boolean(overswipeRef.current[key]),
      );
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
            release();
            finish(event, true);
          }}
          onPointerUp={(event: PointerEvent<HTMLElement>) => {
            (onPointerUp as Handler<typeof event>)?.(event);
            release();
            finish(event, false);
          }}
        >
          {children}
        </StyledItem>
      </ItemContext.Provider>
    );
  },
);

/** How long an expandable row opens or closes (as swiping). */
const expandDuration = 300;

export type ListExpandableProps = ListItemProps & {
  /** Shown (default: not); changing, its height and padding transition. */
  open?: boolean;
};

/**
 * An expandable row: a row shown or not (`open`), opening and closing in
 * place, e.g. an inline `Calendar` or `TimeRoll` below a row with a
 * `DatePicker` (without popovers, as iOS's Calendar). Closed, it's inert.
 */
const Expandable = forwardRef<HTMLElement, ListExpandableProps>(
  ({ open = false, ...props }, ref) => {
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
        {...props}
      />
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

// Swipe actions (Figma “Row with Swipe Actions”, “_Swipe Actions”): shapes
// 10px apart, 10px from the row and 16px from the edge.

export type ListSwipeActionsProps = PartProps<'div'> & {
  /**
   * Called when released swiped on past the actions (overswiped), instead of
   * triggering the outermost action; enables `overswipe`.
   */
  onOverswipe?: () => void;
  /**
   * Swiping on past the actions stretches the outermost one up to the
   * others (following the row), and, past 304px, triggers it on
   * release (Framework7 `.swipeout-overswipe`; UIKit
   * `performsFirstActionWithFullSwipe`).
   */
  overswipe?: boolean;
  /** The row's side the actions are revealed on (default: `trailing`). */
  side?: Side;
};

// Circles centered in the row, rounded rectangles 4px from its edges.
const StyledSwipeActions = styled(
  partElement('div', 'swipe-actions', ['overswipe', 'side']),
  forwardRef,
)<ListSwipeActionsProps>`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  gap: 10px;
  padding-block: 4px;
  pointer-events: none;
  ${({ side }) =>
    side === 'leading'
      ? css`
          inset-inline-start: 0;
          padding-inline: 16px 10px;

          & > * > [${part}='swipe-action-shape'] {
            justify-content: flex-end;
          }
        `
      : css`
          inset-inline-end: 0;
          padding-inline: 10px 16px;

          & > * > [${part}='swipe-action-shape'] {
            justify-content: flex-start;
          }
        `}

  & > * {
    pointer-events: auto;
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
  /** The action's name: its accessible name (see `showLabel`). */
  label: string;
  /**
   * The action's shape: a 44px circle, or a capsule around wider content
   * (default); or a rounded rectangle (12px corners, as large buttons') as
   * high as the row (4px from its edges), at least 60px wide.
   */
  shape?: 'circle' | 'roundedRectangle';
  /**
   * Shows the label below the shape (Figma “Label”; default: not). It needs
   * room: for multi-line rows (`Text`).
   */
  showLabel?: boolean;
  /** Background color (default: `systemGray`). */
  tint?: string;
};

const swipeActionShapes: Record<
  Required<ListSwipeActionProps>['shape'],
  string
> = {
  circle: css`
    --styled-list-action-min-width: 44px;
    --styled-list-action-height: calc(
      44px + var(--styled-list-action-label-space)
    );
    --styled-list-action-shape-height: 44px;
    --styled-list-action-shape-grow: 0;
    --styled-list-action-radius: 100px;
  `,
  roundedRectangle: css`
    --styled-list-action-min-width: 60px;
    --styled-list-action-height: auto;
    --styled-list-action-shape-height: auto;
    --styled-list-action-shape-grow: 1;
    --styled-list-action-radius: 12px;

    align-self: stretch;
  `,
};

// Faded (see `actionFade`) as the row moves (see `placeRow`): the shape's
// fill, the symbol and the label each.
const actionFadeStyle = css`
  opacity: var(--styled-list-action-fade, 1);
`;

const actionFadeTransition =
  'opacity var(--styled-list-action-fade-duration, 0ms)';

const StyledSwipeAction = styled(
  partElement('button', 'swipe-action', ['shape', 'showLabel', 'tint'], {
    type: 'button',
  }),
  forwardRef,
)<Omit<ListSwipeActionProps, 'label'>>`
  /* Its label: 4px below the shape, 16px high */
  --styled-list-action-label-space: ${({ showLabel }) =>
    showLabel ? '20px' : '0px'};
  --styled-list-action-label-display: ${({ showLabel }) =>
    showLabel ? 'block' : 'none'};

  ${reset}
  ${({ shape = 'circle' }) => swipeActionShapes[shape]}

  position: relative;
  display: flex;
  height: var(--styled-list-action-height, 44px);
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  color: #fff;
  padding-block-end: var(--styled-list-action-label-space, 0);
  ${cursor('pointer')}
  transform: scale(0);

  &:disabled {
    ${cursorProperty('not-allowed')}
  }

  /* The shape: its fill beneath, sized by the symbol (or text), stretched
     from the edge's side (see stretchAction). */
  & > [${part}='swipe-action-shape'] {
    position: relative;
    display: flex;
    min-width: var(--styled-list-action-min-width, 44px);
    height: var(--styled-list-action-shape-height, 44px);
    box-sizing: border-box;
    flex-grow: var(--styled-list-action-shape-grow, 0);
    border-radius: var(--styled-list-action-radius, 100px);

    &::before {
      position: absolute;
      border-radius: inherit;
      background-color: ${({ tint }) => tint ?? 'var(--color-ios-system-gray)'};
      content: '';
      inset: 0;
      ${actionFadeStyle}
      transition: ${actionFadeTransition};
    }
  }

  /* The symbol's box: the shape's width (centered in it, also stretched,
     following without delay), at the row's end of it (see SwipeActions).
     Text (instead of a symbol) is in capitals. */
  & > * > [${part}='swipe-action-symbol'] {
    position: relative;
    display: grid;
    width: 100%;
    box-sizing: border-box;
    flex: none;
    font-size: 15px;
    ${fontWeight(400)}
    letter-spacing: -0.23px;
    line-height: 20px;
    padding-inline: 10px;
    place-items: center;
    text-transform: uppercase;
    ${actionFadeStyle}
    transition:
      width ${armDuration}ms,
      ${actionFadeTransition};
    white-space: nowrap;

    & > svg {
      font-size: var(--font-ios-body-size);
    }
  }

  /* Armed (overswiped far enough to trigger on release): the symbol at the
     row's end of the stretched shape, without its label. */
  &[data-armed] {
    & > * > [${part}='swipe-action-symbol'] {
      width: var(--styled-list-action-width, 44px);
    }

    & > [${part}='swipe-action-label'] {
      opacity: 0;
    }
  }

  & > [${part}='swipe-action-label'] {
    position: absolute;
    bottom: 0;
    display: var(--styled-list-action-label-display, none);
    color: var(--color-ios-secondary-label);
    font-size: 13px;
    ${fontWeight(510)}
    line-height: 16px;
    ${actionFadeStyle}
    transition: ${actionFadeTransition};
    white-space: nowrap;
  }
`;

/**
 * A swipe action: a symbol (or short text) in a shape, closing the actions
 * when clicked.
 */
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
        <span {...{ [part]: 'swipe-action-shape' }}>
          <span {...{ [part]: 'swipe-action-symbol' }}>{children}</span>
        </span>
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
   * As `Button`, when it's a button (e.g. a Base UI `Collapsible.Trigger`):
   * the cursor (default: `pointer`).
   */
  cursor?: Properties['cursor'];
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

  &[role='button'],
  button&,
  a& {
    ${cursor('pointer')}
  }

  &[aria-disabled='true'],
  &[data-disabled] {
    ${cursorProperty('not-allowed')}
  }

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
