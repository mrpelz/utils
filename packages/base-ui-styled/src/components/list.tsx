import { useRender } from '@base-ui/react/use-render';
import { Properties } from 'csstype';
import { keyframes, styled } from 'goober';
import {
  createContext,
  CSSProperties,
  FocusEvent,
  forwardRef,
  MouseEvent,
  PointerEvent,
  useContext,
  useEffect,
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
  editCircle,
  Radio as RadioBase,
  RadioRootProps,
} from './checkbox.js';
import { textStyle } from './typography.js';
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
//   up to the others, which follow the row, and arms overswiping (see
//   `armDistance`; Framework7: past 1.2 times the actions), triggering it on
//   release; armed, its symbol moves to the row's end, its label hides
//   (150ms)
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

export type ListStyle = 'grouped' | 'insetGrouped' | 'plain' | 'sidebar';

type Side = 'leading' | 'trailing';

const part = 'data-list-part';

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

/** Props of a part rendering `Tag`, replaceable via `render` (Base UI). */
// Button-like parts (buttons, rows) take a secondary click (see
// `useSecondaryClick`).
type PartProps<Tag extends IntrinsicTag> = Omit<
  useRender.ComponentProps<Tag>,
  'ref'
> &
  (Tag extends 'button' | 'li' ? SecondaryClickProps : unknown);

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
    (partProps, ref) => {
      const { render, ...props } = useSecondaryClick(
        partProps as SecondaryClickProps & typeof partProps,
      );
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
  // Figma “Sidebars” (“Sidebar Row”, in a `Sidebar`'s glass): groups
  // without a shape of their own (nor a background), their rows capsules,
  // 44px high (selected: on a fill, its symbol and title emphasized, in the
  // tint), without separators; 10px in at the first level, 20px more per
  // level, their trailing parts 16px from the end; symbols 34px wide, 4px
  // from the title; sections 20px apart, their headers (“Section Header”)
  // in Body, in the secondary label color, 12px in.
  sidebar: css`
    ${colorScheme(
      `--styled-list-selected-background: var(--styled-sidebar-selection, rgb(0 0 0 / 7%));
       --styled-select-circle-border: #bfbfbf;`,
      `--styled-list-selected-background: var(--styled-sidebar-selection, rgb(255 255 255 / 12%));
       --styled-select-circle-border: rgb(255 255 255 / 30%);`,
    )}
    --styled-list-background: transparent;
    --styled-list-group-background: transparent;
    --styled-list-inset: 0px;
    --styled-list-radius: 0px;
    --styled-list-item-radius: 100px;
    --styled-list-section-spacing: 20px;
    --styled-list-outline-shadow: none;
    --styled-list-separator-opacity: 0;
    --styled-list-row-min-height: 44px;
    --styled-list-row-padding: 0 16px;
    --styled-list-row-padding-start: 10px;
    --styled-list-selected-title: var(--color-ios-primary);

    /* Pressed: on the selection's fill too (user: Figma's pressed rows are
       wrong; selected and pressed differ in their text only; the
       sidebar's toolbar buttons pressed alike, see Sidebar). */
    --styled-list-pressed-background: var(--styled-list-selected-background);

    min-width: 0;

    & [${part}='row'] > [${part}='image'][data-variant='symbol'] {
      width: 34px;
      color: var(--color-ios-label);
      margin-inline-end: 4px;
    }

    & [data-selected] [${part}='row'] > [${part}='title'] {
      color: var(--color-ios-primary);
      ${fontWeight(590)}
    }

    & [data-selected] [${part}='row'] > [${part}='image'] {
      color: var(--color-ios-primary);
      ${fontWeight(590)}
    }

    & [${part}='header'] {
      min-height: 44px;
      align-items: center;
      padding: 2px 12px 10px;
    }

    & [${part}='header'] > [${part}='title'] {
      color: var(--color-ios-secondary-label);
      ${textStyle('body')}
      ${fontWeight(400)}
    }

    /* Its selection circles (Figma “Edit Button”): 8px before the symbol. */
    & [${part}='row'] > [${part}='edit'] {
      margin-inline: 0 8px;
    }

    /* Chevrons (Figma “Disclosure”: #999, 590, an 18px box 12px from the
       row's end): gray, not the tint; headers' and rows' alike, aligned. */
    & [${part}='disclosure'] {
      color: var(--color-ios-secondary-label);
    }

    & [${part}='header'] > [${part}='disclosure'] {
      min-width: 18px;
      font-size: var(--font-ios-body-size);
    }

    & [${part}='row'] > [${part}='accessory']:has(> [${part}='disclosure']) {
      min-width: 18px;
      margin-inline-end: -4px;
    }
  `,
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
      const item = grabber?.closest<HTMLElement>(
        `[${CSS.escape(part)}='item']`,
      );
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
  ...pressable.map((selector) => `&:has(> * > * > ${selector}:active)`),
  '&[data-pressed]',
].join(', ');

/** A row's own controls (pressing them doesn't press a pressable row). */
const ownControl =
  'a, button, input, select, textarea, label, [role], [tabindex]';

export type ListItemProps = PartProps<'li'> & {
  /** As `Button`: the cursor (default: `pointer` with a click handler). */
  cursor?: Properties['cursor'];
  /** Its level in a hierarchy (indented 20px per level; e.g. a sidebar). */
  level?: number;
  /** Selected (e.g. a sidebar's current section): on a fill. */
  selected?: boolean;
};

// The row's content: a grid of its parts (see above), with its separator;
// in its item, offset by the item's leading swipe room (see `Item`).
const StyledRow = styled(partElement('div', 'row'), forwardRef)`
  --styled-list-min-height: var(--styled-list-row-min-height, 52px);

  /* Borderless buttons in rows (e.g. a pop-up's) in Body, as details; their
     content ending where the details do (their padding beyond), their label
     and symbol 16px apart (as a detail and its chevron, user), the symbol
     light (user: thinner than regular). */
  --styled-button-plain-size: var(--font-ios-body-size);
  --styled-button-plain-line-height: var(--font-ios-body-line-height);
  --styled-button-plain-tracking: var(--font-ios-body-tracking);
  --styled-button-plain-margin-end: -14px;
  --styled-button-plain-gap: 16px;
  --styled-button-plain-symbol-weight: 300;

  position: relative;
  display: grid;
  min-height: var(--styled-list-min-height);
  box-sizing: border-box;
  align-content: center;
  padding: var(--styled-list-row-padding, 12px 16px);
  grid-auto-columns: auto;
  grid-auto-flow: column;
  grid-template-columns: auto auto minmax(0, 1fr);
  grid-template-rows: auto auto;

  /* Indented by its level (see Item). */
  padding-inline-start: calc(
    var(--styled-list-row-padding-start, 16px) + var(--styled-list-level, 0) *
      20px
  );

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
     wide as it, its value at the end), the clear button 8px after it,
     messages below. */
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

    /* After an inline label, the value at the row's end (UIKit forms,
       Settings). */
    &:has(> [data-text-field-part='label'])
      > input[data-text-field-part='control'] {
      text-align: end;
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

    /* Hidden by its row's state (see StyledItem). */
    opacity: var(--styled-list-separator-opacity, 1);
    transition: opacity 300ms;
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

  /* Figma “_Grabber” */
  & > [${part}='grabber'] {
    margin-inline-start: 12px;
  }
`;

// The row's box (see `Item`): its background, corners and states; with
// swipe actions, a horizontal scroll container (no scroll bar), its row in
// a track with room for the actions (and overswiping) on both sides, the
// row's offset its scroll position, snapping open or closed.
const StyledItem = styled(partElement('li', 'item'), forwardRef)<ListItemProps>`
  ${({ onClick }) => cursor(onClick ? 'pointer' : 'auto')}

  position: relative;
  display: block;
  border-radius: var(--styled-list-item-radius, 0);
  background-color: var(--styled-list-row-background, transparent);

  /* The pressed state is the row's (a title's hit area covers it). */
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-y;
  transition-duration: 300ms;
  transition-property: background-color;
  user-select: none;

  &[data-swipeable] {
    overflow: auto hidden;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    touch-action: pan-x pan-y;

    &::-webkit-scrollbar {
      display: none;
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

  &[data-reordering],
  &[data-reorder-edge~='after'] {
    --styled-list-separator-opacity: 0;
  }

  /* While reordering, by their order on screen (see useReorder) */
  &:first-child:not([data-reorder-edge]),
  &[data-reorder-edge~='first'] {
    border-start-end-radius: var(
      --styled-list-item-radius,
      var(--styled-list-radius, 24px)
    );
    border-start-start-radius: var(
      --styled-list-item-radius,
      var(--styled-list-radius, 24px)
    );

    --styled-list-separator-opacity: 0;
  }

  &:last-child:not([data-reorder-edge]),
  &[data-reorder-edge~='last'] {
    border-end-end-radius: var(
      --styled-list-item-radius,
      var(--styled-list-radius, 24px)
    );
    border-end-start-radius: var(
      --styled-list-item-radius,
      var(--styled-list-radius, 24px)
    );
  }

  ${whilePressed} {
    --styled-list-row-background: var(
      --styled-list-pressed-background,
      var(--color-ios-system-gray4)
    );

    transition-duration: 0ms;

    &,
    & + * {
      --styled-list-separator-opacity: 0;
    }
  }

  ${pressable.map((selector) => `&:has(> * > * > ${selector}:focus-visible)`).join(', ')} {
    outline: 2px solid var(--color-ios-primary);
    outline-offset: -2px;
  }

  &[data-swipe],
  &[data-swipe] + * {
    --styled-list-separator-opacity: 0;
  }

  /* Figma “Row with Swipe Actions”: the swiped row's content is a capsule
     (its end leaving the row rounded by its clip, see rowPath); its actions
     on the row's background. */
  &[data-swipe] > * > [${part}='row'] {
    border-radius: ${swipeRadius}px;
    background-color: var(--color-ios-system-gray5);
  }

  /* Selected (see Item): on a fill (sidebars: its title in the tint), its
     separators hidden. */
  &[data-selected] {
    --styled-list-row-background: var(
      --styled-list-selected-background,
      var(--color-ios-system-gray5)
    );
    --styled-list-separator-opacity: 0;
  }

  &[data-selected] + * {
    --styled-list-separator-opacity: 0;
  }

  &[data-selected] [${part}='title'] {
    color: var(--styled-list-selected-title, inherit);
  }

  /* An expandable row, closed (see Expandable): no height, nor separator. */
  &[data-closed] {
    overflow: hidden;
    height: 0;
    min-height: 0;
    visibility: hidden;

    --styled-list-separator-opacity: 0;
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
  button.style.setProperty('--styled-list-action-width', `${width}px`);
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
    button.style.setProperty('--styled-list-action-reveal-from', `${from}px`);
    button.style.setProperty('--styled-list-action-reveal-to', `${to}px`);
    button.style.setProperty(
      '--styled-list-action-reveal-direction',
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

  // Rounded at the side the content leaves (changing with the side only).
  const clipPath = rowPath(
    item.offsetWidth,
    item.offsetHeight,
    offset * direction,
  );
  if (item.style.clipPath !== clipPath) item.style.clipPath = clipPath;

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
        '--styled-list-action-arming',
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

type Handler<E> = ((event: E) => void) | undefined;

// The track a swipeable row scrolls in (see `Item`): the row, with room
// for its actions (and overswiping) on both sides.
const Track = styled('div', forwardRef)`
  position: relative;
  display: grid;
  width: calc(
    100% + var(--styled-list-swipe-lead, 0px) +
      var(--styled-list-swipe-trail, 0px)
  );
  box-sizing: border-box;
  grid-template-columns:
    var(--styled-list-swipe-lead, 0)
    minmax(0, 1fr)
    var(--styled-list-swipe-trail, 0);

  /* Not part of the row's intrinsic width (e.g. a list sized by its
     content): its room cancelled out (without effect on its layout). */
  margin-inline-end: calc(
    -1 *
      (var(--styled-list-swipe-lead, 0px) + var(--styled-list-swipe-trail, 0px))
  );

  & > [${part}='row'] {
    grid-area: 1 / 2;
  }
`;

// The layer a swipeable row's actions are in (see `SwipeActions`): beneath
// the row, as wide as it, stuck to the scrollport's start, so it stays in
// place while the row scrolls (natively, in every frame). At the track's
// start (a margin would keep it from moving there: sticky boxes stay in
// their containing block with their margins).
const Pin = styled('div', forwardRef)`
  position: sticky;
  z-index: 0;
  width: calc(
    100% - var(--styled-list-swipe-lead, 0px) - var(
        --styled-list-swipe-trail,
        0px
      )
  );
  grid-area: 1 / 1 / 2 / 4;
  inset-inline: 0;
  justify-self: start;
  pointer-events: none;
`;

/** The layer a row's swipe actions are rendered in (see `Pin`). */
const PinContext = createContext<HTMLElement | null>(null);

// Where a swipeable row snaps (see `Item`), in the track. Closed, it stops
// even when flung: closing one side doesn't open the other.
const Snap = styled('span', forwardRef)`
  position: absolute;
  top: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
  scroll-snap-align: start;

  &[data-closed] {
    scroll-snap-stop: always;
  }
`;

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

/** A swipeable row's geometry (see `Item`), by side. */
type Swipe = {
  /** How far the row moves to arm overswiping. */
  arms: Partial<Record<Side, number>>;
  /** How far the row moves at most (overswiping: across the whole row). */
  extents: Partial<Record<Side, number>>;
  /** The actions' widths. */
  widths: Partial<Record<Side, number>>;
};

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

/** A mouse drag swiping a row (see `Item`). */
type Drag = {
  /** The row's offset when it started. */
  base: number;
  moved: boolean;
  pointerId: number;
  scroll: number;
  time: number;
  x: number;
  y: number;
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
  // starts, only: changed while scrolling, browsers snap at once.)
  const showSnaps = () => {
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
    item.style.setProperty('--styled-list-swipe-lead', `${String(lead())}px`);
    item.style.setProperty(
      '--styled-list-swipe-trail',
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
      `[${CSS.escape(part)}='swipe-action-shape']`,
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
    if (!swipeable) return;
    if (
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
        data-selected={selected ? '' : undefined}
        data-swipeable={swipeable ? '' : undefined}
        style={
          level === undefined
            ? style
            : ({
                ...(style as CSSProperties | undefined),
                '--styled-list-level': String(level),
              } as CSSProperties)
        }
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
        <Track>
          <Pin ref={setPin} />
          {swipeable
            ? snapPoints.map((point) => (
                <Snap
                  key={point}
                  ref={(element: HTMLElement | null) => {
                    snapsRef.current[point] = element;
                  }}
                  hidden
                  aria-hidden="true"
                  data-closed={point === 'closed' ? '' : undefined}
                />
              ))
            : null}
          <PinContext.Provider value={pin}>
            <StyledRow>{children}</StyledRow>
          </PinContext.Provider>
        </Track>
      </StyledItem>
    </ItemContext.Provider>
  );
});

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
const StyledImage = styled(
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

// (Its variant also as `data-variant`, e.g. for a sidebar's symbols.)
const Image = forwardRef<HTMLElement, ListImageProps>((props, ref) => (
  <StyledImage
    ref={ref}
    data-variant={props.variant ?? 'symbol'}
    {...props}
  />
));

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

/** Figma State=Selected/Unselected: a checkbox (selecting rows). */
const Checkbox = forwardRef<HTMLElement, CheckboxRootProps>((props, ref) => (
  <CheckboxBase.Root
    ref={ref}
    {...{ [part]: 'edit' }}
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
    {...{ [part]: 'edit' }}
    {...props}
  />
));

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
  /**
   * The row's side the actions are revealed on.
   * @default 'inline-end'
   */
  side?: 'inline-end' | 'inline-start';
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
    side === 'inline-start'
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
  /** Text color (default: white), e.g. for a light `tint`. */
  textColor?: string;
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

// An action's reveal (see `StyledSwipeAction`): scaling in, and its parts
// fading in (see `actionFade`).
const revealScale = keyframes`
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
`;

const revealFade = keyframes`
  from {
    opacity: ${actionFade};
  }

  to {
    opacity: 1;
  }
`;

// With the row's scroll, over the action's range (see revealRanges).
const revealAnimation = (name: string) => css`
  animation: ${name} linear both;
  animation-direction: var(--styled-list-action-reveal-direction, normal);
  animation-range: var(--styled-list-action-reveal-from, 0)
    var(--styled-list-action-reveal-to, 0);
  animation-timeline: scroll(nearest inline);
`;

// Faded in as the row uncovers the action, and, overswiping, until the
// outermost action is armed (see `placeRow`): the shape's fill, the symbol
// and the label each.
const actionFadeStyle = css`
  ${revealAnimation(revealFade)}
  filter: opacity(var(--styled-list-action-arming, 1));
`;

const StyledSwipeAction = styled(
  partElement(
    'button',
    'swipe-action',
    ['shape', 'showLabel', 'textColor', 'tint'],
    {
      type: 'button',
    },
  ),
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
  color: ${({ textColor }) => textColor ?? '#fff'};
  padding-block-end: var(--styled-list-action-label-space, 0);
  ${cursor('pointer')}
  transform: scale(0);

  /* Scaling in with the row's scroll as it uncovers it (natively: see
     revealRanges). Without a scroll timeline (not swipeable yet), hidden. */
  ${revealAnimation(revealScale)}

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
    transition: width ${armDuration}ms;
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
      filter: opacity(0);
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
