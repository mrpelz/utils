import { useLayoutEffect, useState } from 'react';

import { edgeScrollDelta, frameElapsed } from '../utils/main.js';

// Reordering rows (Framework7 `sortable.js`, `sortable.less`, beyond its
// single list), by a handle (`List.createReorderHandle`, in a component
// `useCreateReorderHandle`): rows given it (`Item` `reorderHandle`) are
// grabbed (by their `Grabber`, or the app's `grab`), and dropped where it's
// given a target: an explicit `DropTarget` (a gap where it's placed), or a
// range's gaps (`DropGroup`, `Group` `reorderHandle`: before, between and
// after its rows). The rows lift, following the pointer (or moved from gap to
// gap, by keyboard or the app), the rows they leave closing up, a gap opening
// at their target (layout changes, so groups and what follows them make
// room); near an end of the scroll container, it scrolls. Dropped, they
// settle into the gap, and the handle's `onReorder` is called with what moved
// and where (`ListReorderChange`); the app reorders its data (e.g. by
// `List.reorder`), and once the rows' order in the document changes (or, if
// it doesn't, after the rows slide back), they're laid out as before.
//
// Which handle: a row's handles in order of priority (its `reorderHandle`
// array's); grabbing several, those all of them have, by the first's order.
// A target takes them by the first of those it's given.

const duration = 300;
// Rows grabbed together: stacked behind the first, offset by this each.
const stackOffset = 6;

/** Which part a drop target comes from. */
export type ListReorderPart = 'DropGroup' | 'DropTarget' | 'Group';

/** A moved row: its `dropName`, its index among the handle's rows. */
export type ListReorderItem = {
  /** Among the handle's rows, in document order (before moving). */
  index: number;
  name?: string;
};

/** Where rows are dropped. */
export type ListReorderTarget = {
  /** The `dropName` of the row before the gap (any row, not one moved). */
  after?: string;
  /** The `dropName` of the row after the gap (any row, not one moved). */
  before?: string;
  /** Among the handle's targets, in document order. */
  flat: number;
  /** The gap within its `Group` or `DropGroup` (a `DropTarget`: 0). */
  index: number;
  /** Its `Group`'s, `DropGroup`'s or `DropTarget`'s `dropName`. */
  name?: string;
  part: ListReorderPart;
};

/** Rows moved to a target (see `ListReorderHandle`). */
export type ListReorderChange = {
  /** The rows moved, in the order they were grabbed. */
  items: readonly ListReorderItem[];
  target: ListReorderTarget;
};

/** How rows were moved: dragged, by keyboard, or by the app. */
export type ListReorderReason = 'drag' | 'imperative' | 'keyboard';

export type ListReorderEventDetails = {
  event: Event;
  reason: ListReorderReason;
};

export type ListReorderOptions = {
  /** Called when rows are moved to a target; the app reorders them. */
  onReorder?: (
    change: ListReorderChange,
    eventDetails: ListReorderEventDetails,
  ) => void;
};

type Ref = { readonly current: HTMLElement | null };

/** What handles are, to rows and targets (see `ListReorderHandle`). */
type Handle = {
  readonly items: Set<ReorderItemEntry>;
  readonly options: ListReorderOptions;
  readonly targets: Set<ReorderTargetEntry>;
};

/**
 * A row (see `Item`): its handles, its name.
 * @internal
 */
export type ReorderItemEntry = {
  readonly handles: () => readonly Handle[];
  readonly name: () => string | undefined;
  readonly ref: Ref;
};

/**
 * A drop target (see `DropTarget`), or a range of rows' gaps (`DropGroup`,
 * `Group`; its rows registering with it).
 * @internal
 */
export type ReorderTargetEntry = {
  readonly handles: () => readonly Handle[];
  readonly members?: Set<Ref>;
  readonly name: () => string | undefined;
  readonly part: ListReorderPart;
  /**
   * A `DropTarget`'s element, a `DropGroup`'s marker, a `Group`'s (its rows'
   * container).
   */
  readonly ref?: Ref;
};

/** A gap rows can be dropped into. */
type Gap = {
  /** The row before it, the row after it (not grabbed ones). */
  after: HTMLElement | undefined;
  before: HTMLElement | undefined;
  /** Its rows' container. */
  container: HTMLElement;
  handle: Handle;
  target: Omit<ListReorderTarget, 'after' | 'before'>;
  /** Its position, the grabbed rows taken out (in the scroller's content). */
  y: number;
};

/** Grabbed rows, measured, and their gaps. */
type Layout = {
  readonly gaps: readonly Gap[];
  readonly height: number;
  readonly heights: readonly number[];
  readonly items: readonly HTMLElement[];
  /** Where the first row was (a gap of its own, if no target is there). */
  readonly origin: Gap;
  readonly scroller: Element;
};

const entries = new WeakMap<HTMLElement, ReorderItemEntry>();

/**
 * Registers a row's element (see `Item`).
 * @internal
 */
export const setItemEntry = (
  element: HTMLElement,
  entry: ReorderItemEntry | undefined,
): void => {
  if (entry) entries.set(element, entry);
  else entries.delete(element);
};

const isItem = (element: Element | null): element is HTMLElement =>
  element instanceof HTMLElement &&
  element.matches('[data-list-part=item]:not([data-closed])');

const byDocumentOrder = (a: Node, b: Node) => {
  if (a === b) return 0;
  // eslint-disable-next-line no-bitwise -- a bit mask
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
};

// The nearest ancestor scrolling vertically, or the document's.
const scrollContainerOf = (element: HTMLElement): Element => {
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

const isDocumentScroller = (scroller: Element) =>
  scroller === scroller.ownerDocument.scrollingElement;

// A viewport position in the scroller's content.
const contentY = (scroller: Element, clientY: number) =>
  clientY -
  (isDocumentScroller(scroller) ? 0 : scroller.getBoundingClientRect().top) +
  scroller.scrollTop;

const titleOf = (element: Element | null | undefined) =>
  element?.querySelector('[data-list-part=title]')?.textContent?.trim() ||
  undefined;

const sectionTitleOf = (container: HTMLElement) =>
  titleOf(
    container
      .closest('[data-list-part=section]')
      ?.querySelector('[data-list-part=header]'),
  );

// Announces moves (by keyboard, by the app; dropped).
let liveRegion: HTMLElement | undefined;
const announce = (text: string) => {
  if (!liveRegion?.isConnected) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    Object.assign(liveRegion.style, {
      position: 'fixed',
      overflow: 'hidden',
      width: '1px',
      height: '1px',
      clipPath: 'inset(50%)',
      whiteSpace: 'nowrap',
    });
    document.body.append(liveRegion);
  }
  liveRegion.textContent = text;
};

const ease = (t: number) => 1 - (1 - t) ** 3;

// The row before (-1) or after (1) an element in its container: not one
// grabbed, nor closed.
const neighbour = (
  from: Element,
  direction: -1 | 1,
  grabbed: readonly HTMLElement[],
): HTMLElement | undefined => {
  const sibling = (element: Element) =>
    direction === -1
      ? element.previousElementSibling
      : element.nextElementSibling;
  for (let current = sibling(from); current; current = sibling(current)) {
    if (isItem(current) && !grabbed.includes(current)) return current;
  }
  return undefined;
};

type RawGap = Gap & { at: Node; rank: number };

// Kept where several are at one place: a `DropTarget`, a `DropGroup`, a
// `Group` (a range's end after its starts).
const partRank: Record<ListReorderPart, number> = {
  DropGroup: 1,
  DropTarget: 0,
  Group: 2,
};

const targetGapOf = (
  entry: ReorderTargetEntry,
  handle: Handle,
  grabbed: readonly HTMLElement[],
): RawGap[] => {
  const element = entry.ref?.current;
  const container = element?.parentElement;
  if (!element || !container) return [];

  return [
    {
      after: neighbour(element, -1, grabbed),
      at: element,
      before: neighbour(element, 1, grabbed),
      container,
      handle,
      rank: partRank.DropTarget,
      target: { flat: 0, index: 0, name: entry.name(), part: entry.part },
      y: 0,
    },
  ];
};

// The rows around a range's gap: before its row (`index`), or after its last.
const slotOf = (
  member: HTMLElement,
  isEnd: boolean,
  grabbed: readonly HTMLElement[],
) => {
  const isGrabbed = grabbed.includes(member);
  if (isEnd) {
    return {
      after: isGrabbed ? neighbour(member, -1, grabbed) : member,
      before: neighbour(member, 1, grabbed),
    };
  }
  return {
    after: neighbour(member, -1, grabbed),
    before: isGrabbed ? neighbour(member, 1, grabbed) : member,
  };
};

const rangeGapsOf = (
  entry: ReorderTargetEntry,
  handle: Handle,
  grabbed: readonly HTMLElement[],
): RawGap[] => {
  const target = { flat: 0, name: entry.name(), part: entry.part };
  const members = (entry.members?.values().toArray() ?? [])
    .map((member) => member.current)
    .filter((element) => isItem(element))
    .toSorted(byDocumentOrder);
  // Empty: a group's one gap; a drop group's where its marker is.
  const element = entry.ref?.current;
  if (members.length === 0) {
    if (!element) return [];
    const isMarker = entry.part === 'DropGroup';
    const container = isMarker ? element.parentElement : element;
    if (!container) return [];
    return [
      {
        after: isMarker ? neighbour(element, -1, grabbed) : undefined,
        at: element,
        before: isMarker ? neighbour(element, 1, grabbed) : undefined,
        container,
        handle,
        rank: partRank[entry.part],
        target: { ...target, index: 0 },
        y: 0,
      },
    ];
  }

  return Array.from({ length: members.length + 1 }, (_, index) => {
    const isEnd = index === members.length;
    const member = members[isEnd ? index - 1 : index] as HTMLElement;
    return {
      ...slotOf(member, isEnd, grabbed),
      at: member,
      container: member.parentElement ?? member,
      handle,
      rank: partRank[entry.part] + (isEnd ? 0.5 : 0),
      target: { ...target, index },
      y: 0,
    };
  });
};

/** The gaps the grabbed rows can be dropped into, top to bottom. */
const gapsOf = (
  grabbed: readonly HTMLElement[],
  candidates: readonly Handle[],
  scroller: Element,
): Gap[] => {
  const targets = new Set(
    candidates.flatMap((handle) => handle.targets.values().toArray()),
  );
  const raw = targets
    .values()
    .flatMap((entry) => {
      const handle = candidates.find((candidate) =>
        entry.handles().includes(candidate),
      );
      if (!handle) return [];
      return entry.part === 'DropTarget'
        ? targetGapOf(entry, handle, grabbed)
        : rangeGapsOf(entry, handle, grabbed);
    })
    .toArray()
    .toSorted((a, b) => byDocumentOrder(a.at, b.at) || a.rank - b.rank);

  // Each handle's targets, in document order.
  const flat = new Map<Handle, number>();
  for (const gap of raw) {
    const count = flat.get(gap.handle) ?? 0;
    gap.target.flat = count;
    flat.set(gap.handle, count + 1);
  }

  // One per place, by its part's priority.
  const ids = new Map<Element, number>();
  const idOf = (element: Element | undefined) => {
    if (!element) return '-';
    if (!ids.has(element)) ids.set(element, ids.size);
    return String(ids.get(element));
  };
  const unique = new Map<string, RawGap>();
  for (const gap of raw) {
    const key = [gap.container, gap.after, gap.before]
      .map((element) => idOf(element))
      .join(',');
    const known = unique.get(key);
    if (!known || Math.floor(gap.rank) < Math.floor(known.rank)) {
      unique.set(key, gap);
    }
  }

  // Their positions, the grabbed rows taken out.
  const boxes = grabbed.map((item) => item.getBoundingClientRect());
  return unique
    .values()
    .map((gap) => {
      let top = gap.container.getBoundingClientRect().top;
      if (gap.before) top = gap.before.getBoundingClientRect().top;
      else if (gap.after) top = gap.after.getBoundingClientRect().bottom;
      const above = boxes
        .filter((box) => box.top < top)
        .reduce((sum, box) => sum + box.height, 0);
      return { ...gap, y: contentY(scroller, top - above) };
    })
    .toArray()
    .toSorted((a, b) => a.y - b.y || a.rank - b.rank);
};

/** Measures grabbed rows, and their gaps. */
const measure = (
  items: readonly HTMLElement[],
  candidates: readonly Handle[],
): Layout => {
  const lead = items[0] as HTMLElement;
  const heights = items.map((item) => item.getBoundingClientRect().height);
  const scroller = scrollContainerOf(lead);
  const gaps = gapsOf(items, candidates, scroller);
  const after = neighbour(lead, -1, items);
  const before = neighbour(lead, 1, items);
  const container: HTMLElement = lead.parentElement ?? lead;
  const origin = gaps.find(
    (gap) =>
      gap.container === container &&
      gap.after === after &&
      gap.before === before,
  ) ?? {
    after,
    before,
    container,
    handle: candidates[0] as Handle,
    target: { flat: -1, index: -1, part: 'Group' },
    y: contentY(scroller, lead.getBoundingClientRect().top),
  };

  return {
    gaps,
    height: heights.reduce((sum, height) => sum + height, 0),
    heights,
    items,
    origin,
    scroller,
  };
};

/** The previous or next gap from one (by position, if it's not a target). */
const besideOf = (
  layout: Layout,
  from: Gap,
  direction: -1 | 1,
): Gap | undefined => {
  const index = layout.gaps.indexOf(from);
  if (index !== -1) return layout.gaps[index + direction];
  return direction === 1
    ? layout.gaps.find((gap) => gap.y > from.y)
    : layout.gaps.findLast((gap) => gap.y < from.y);
};

// Dropped there, the rows' order wouldn't change.
const isNoOp = (items: readonly HTMLElement[], gap: Gap): boolean => {
  if (items.some((item) => item.parentElement !== gap.container)) {
    return false;
  }
  const rows = [...gap.container.children].filter((row) => isItem(row));
  const rest = rows.filter((row) => !items.includes(row));
  let at = 0;
  if (gap.after) at = rest.indexOf(gap.after) + 1;
  else if (gap.before) at = rest.indexOf(gap.before);
  const order = [...rest.slice(0, at), ...items, ...rest.slice(at)];
  return order.every((row, index) => rows[index] === row);
};

const changeOf = (
  items: readonly HTMLElement[],
  gap: Gap,
): ListReorderChange => {
  const rows = gap.handle.items
    .values()
    .map((entry) => entry.ref.current)
    .filter((element) => element !== null)
    .toArray()
    .toSorted(byDocumentOrder);
  return {
    items: items.map((item) => ({
      index: rows.indexOf(item),
      name: entries.get(item)?.name(),
    })),
    target: {
      ...gap.target,
      after: gap.after ? entries.get(gap.after)?.name() : undefined,
      before: gap.before ? entries.get(gap.before)?.name() : undefined,
    },
  };
};

// E.g. “Moved Mars after Venus, Inner Planets”.
const describe = (
  verb: string,
  items: readonly HTMLElement[],
  gap: Gap | undefined,
) => {
  const what =
    items.length === 1
      ? (titleOf(items[0]) ?? 'row')
      : `${String(items.length)} rows`;
  if (!gap) return `${verb} ${what}`;
  let where = 'into empty group';
  if (gap.after) where = `after ${titleOf(gap.after) ?? 'row'}`;
  else if (gap.before) where = `before ${titleOf(gap.before) ?? 'row'}`;
  return [`${verb} ${what} ${where}`, sectionTitleOf(gap.container)]
    .filter(Boolean)
    .join(', ');
};

// The handles all the rows have, by the first's order.
const candidatesOf = (rows: readonly HTMLElement[]): Handle[] => {
  const [first = [], ...rest] = rows.map(
    (row) => entries.get(row)?.handles() ?? [],
  );
  return first.filter((handle) =>
    rest.every((handles) => handles.includes(handle)),
  );
};

// The rows' corners and separators follow their order on screen.
const edgeOf = (isFirst: boolean, isLast: boolean, isAfter: boolean) =>
  [isFirst ? 'first' : '', isLast ? 'last' : '', isAfter ? 'after' : '']
    .filter(Boolean)
    .join(' ');

const markEdges = (layout: Layout, current: Gap, marked: Set<HTMLElement>) => {
  const { items } = layout;
  const containers = new Set(
    [...items, ...layout.gaps].map((item) =>
      item instanceof HTMLElement ? item.parentElement : item.container,
    ),
  );
  for (const container of containers) {
    if (!container) continue;
    const rows = [...container.children].filter(
      (row): row is HTMLElement => isItem(row) && !items.includes(row),
    );
    const isAtGap = current.container === container;
    for (const [index, row] of rows.entries()) {
      row.dataset.reorderEdge = edgeOf(
        index === 0 && !(isAtGap && current.after === undefined),
        index === rows.length - 1 && !(isAtGap && current.before === undefined),
        isAtGap && current.before === row,
      );
      marked.add(row);
    }
  }
  for (const [index, item] of items.entries()) {
    item.dataset.reorderEdge = edgeOf(
      index === 0 && current.after === undefined,
      index === items.length - 1 && current.before === undefined,
      false,
    );
  }
};

// The lifted rows' center, in the content without the open gap's room
// (gaps are measured without it); within it, the open gap's.
const collapsedCenter = (center: number, open: number, height: number) =>
  center > open + height ? center - height : Math.min(center, open);

type Mode =
  | {
      clientY: number;
      /** Where the rows were as the pointer took them (gathering, see `start`). */
      from: readonly number[];
      kind: 'pointer';
      offset: number;
      pointerId: number;
      /** When it took them: gathered into the stack over `duration`. */
      start: number;
    }
  | {
      from: readonly number[];
      kind: 'settle';
      onSettled?: () => void;
      start: number;
    };

/** A grab: its rows lifted, moved from gap to gap, until dropped. */
type Session = {
  readonly end: (
    gap: Gap | undefined,
    event: Event,
    reason: ListReorderReason,
  ) => void;
  readonly follow: (event: PointerEvent) => void;
  readonly layout: Layout;
  readonly mode: () => Mode | undefined;
  readonly point: (event: PointerEvent) => void;
  readonly step: (direction: -1 | 1) => void;
  readonly target: () => Gap;
};

/** The grab under way (one at a time). */
let session: Session | undefined;

const transitions = `margin ${String(duration)}ms, padding ${String(duration)}ms`;

const clearStyles = (styled: Iterable<HTMLElement>, isAnimated: boolean) => {
  for (const element of styled) {
    element.style.transition = isAnimated
      ? `${transitions}, translate ${String(duration)}ms`
      : '';
    element.style.marginBlockStart = '';
    element.style.marginBlockEnd = '';
    element.style.paddingBlockEnd = '';
    element.style.translate = '';
    element.style.zIndex = '';
    delete element.dataset.reordering;
    delete element.dataset.reorderEdge;
    delete element.dataset.reorderActive;
  }
  if (!isAnimated) return;
  setTimeout(() => {
    for (const element of styled) element.style.transition = '';
  }, duration);
};

// Once the app reordered (the rows' order in the document changed), the rows
// are laid out as before; if it doesn't, they slide back.
const awaitReorder = (
  containers: Iterable<HTMLElement | null>,
  styled: Iterable<HTMLElement>,
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    observer.disconnect();
    clearStyles(styled, false);
  });
  for (const container of containers) {
    if (container) observer.observe(container, { childList: true });
  }
  timeout = setTimeout(() => {
    observer.disconnect();
    clearStyles(styled, true);
  }, duration);
};

/** Lifts rows (see `Session`). */
const createSession = (layout: Layout, initial: Mode): Session => {
  const { gaps, height, heights, items, origin, scroller } = layout;
  const styled = new Set<HTMLElement>();
  const shifts = items.map(() => 0);
  const elapsedOf = frameElapsed();
  let current = origin;
  let opened: HTMLElement | undefined;
  let mode: Mode | undefined = initial;
  let frame = 0;

  // (Rows only marked, see `markEdges`, are in `styled` too: the
  // transition is set regardless.)
  const style = (element: HTMLElement) => {
    styled.add(element);
    element.style.transition = transitions;
  };

  // Opens a gap (closing the last).
  const open = (gap: Gap) => {
    current = gap;
    if (opened) {
      opened.style.marginBlockStart = '';
      opened.style.paddingBlockEnd = '';
    }
    opened = gap.before ?? gap.container;
    style(opened);
    if (gap.before) gap.before.style.marginBlockStart = `${String(height)}px`;
    else gap.container.style.paddingBlockEnd = `${String(height)}px`;
    markEdges(layout, gap, styled);
  };

  // Where the gap's rows land (on screen).
  const landing = () => {
    const top =
      (current.before?.getBoundingClientRect().top ??
        current.container.getBoundingClientRect().bottom) - height;
    let offset = 0;
    return heights.map((rowHeight) => {
      const at = top + offset;
      offset += rowHeight;
      return at;
    });
  };

  const tops = () => items.map((item) => item.getBoundingClientRect().top);

  const place = (to: readonly number[]) => {
    for (const [index, item] of items.entries()) {
      const shift = shifts[index] ?? 0;
      const natural = item.getBoundingClientRect().top - shift;
      const next = (to[index] ?? natural) - natural;
      shifts[index] = next;
      item.style.translate = next === 0 ? '' : `0 ${String(next)}px`;
    }
  };

  // Where they'd go back to, too, if it isn't a target.
  const places = gaps.includes(origin) ? gaps : [...gaps, origin];

  // The gap nearest the lifted rows.
  const choose = (center: number) => {
    const y = collapsedCenter(center, current.y, height);
    let nearest = current;
    let distance = Number.POSITIVE_INFINITY;
    for (const gap of places) {
      const to = Math.abs(gap.y - y);
      if (!(to < distance)) {
        continue;
      }

      distance = to;
      nearest = gap;
    }
    if (nearest !== current) open(nearest);
  };

  const followPointer = (pointer: Mode & { kind: 'pointer' }, time: number) => {
    const { bottom, top } = isDocumentScroller(scroller)
      ? { bottom: window.innerHeight, top: 0 }
      : scroller.getBoundingClientRect();
    const delta = edgeScrollDelta(
      pointer.clientY,
      top,
      bottom,
      elapsedOf(time),
    );
    if (delta !== 0) scroller.scrollTop += delta;

    // Stacked behind the first, gathering there from where they were (as
    // they spread out, settling).
    const lead = pointer.clientY - pointer.offset;
    const t = Math.min(1, (time - pointer.start) / duration);
    place(
      items.map((_, index) => {
        const at = lead + index * stackOffset;
        const from = pointer.from[index] ?? at;
        return from + (at - from) * ease(t);
      }),
    );
    choose(contentY(scroller, lead) + (heights[0] ?? 0) / 2);
  };

  const settle = (settling: Mode & { kind: 'settle' }, time: number) => {
    const t = Math.min(1, (time - settling.start) / duration);
    const to = landing();
    place(
      to.map((at, index) => {
        const from = settling.from[index] ?? at;
        return from + (at - from) * ease(t);
      }),
    );
    if (t < 1 || !settling.onSettled) return;
    const { onSettled } = settling;
    settling.onSettled = undefined;
    onSettled();
  };

  const tick = (time: number) => {
    frame = requestAnimationFrame(tick);
    if (mode?.kind === 'pointer') followPointer(mode, time);
    else if (mode?.kind === 'settle') settle(mode, time);
  };

  const end = (
    gap: Gap | undefined,
    event: Event,
    reason: ListReorderReason,
  ) => {
    if (!mode) return;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- added below
    document.removeEventListener('keydown', onKeyDown, true);
    const isMove = gap !== undefined && !isNoOp(items, gap);
    if (!isMove && current !== origin) open(origin);
    mode = {
      from: tops(),
      kind: 'settle',
      onSettled: () => {
        cancelAnimationFrame(frame);
        mode = undefined;
        if (session?.layout === layout) session = undefined;
        if (!isMove) {
          clearStyles(styled, false);
          return;
        }
        awaitReorder(
          [gap.container, ...items.map((item) => item.parentElement)],
          styled,
        );
        announce(describe('Dropped', items, gap));
        gap.handle.options.onReorder?.(changeOf(items, gap), {
          event,
          reason,
        });
      },
      start: performance.now(),
    };
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    end(undefined, event, 'drag');
  };

  // Lifted: the rows' room closing, the gap where they were opening.
  for (const [index, item] of items.entries()) {
    style(item);
    item.dataset.reordering = '';
    item.style.zIndex = String(items.length - index + 1);
    item.style.marginBlockEnd = `${String(-(heights[index] ?? 0))}px`;
  }
  // Their groups (and those they can go to) don't clip them meanwhile (see
  // the group's style).
  for (const container of new Set([
    ...items.map((item) => item.parentElement),
    ...gaps.map((gap) => gap.container),
  ])) {
    if (!container) continue;
    styled.add(container);
    container.dataset.reorderActive = '';
  }
  open(origin);
  document.addEventListener('keydown', onKeyDown, { capture: true });
  frame = requestAnimationFrame(tick);

  return {
    end,
    follow: (event) => {
      const leadTop = items[0]?.getBoundingClientRect().top ?? 0;
      mode = {
        clientY: event.clientY,
        from: tops(),
        kind: 'pointer',
        offset: event.clientY - leadTop,
        pointerId: event.pointerId,
        start: performance.now(),
      };
    },
    layout,
    mode: () => mode,
    point: (event) => {
      if (mode?.kind === 'pointer' && mode.pointerId === event.pointerId) {
        mode.clientY = event.clientY;
      }
    },
    step: (direction) => {
      const next = besideOf(layout, current, direction);
      if (!next) return;
      open(next);
      mode = { from: tops(), kind: 'settle', start: performance.now() };
      announce(describe('Moved', items, next));
    },
    target: () => current,
  };
};

/**
 * Starts dragging a row by its grabber (see `Grabber`): the app's grab, if
 * it holds the row, else the row.
 * @internal
 */
export const startReorderDrag = (
  event: PointerEvent,
  grabber: HTMLElement,
): void => {
  const item = grabber.closest<HTMLElement>('[data-list-part=item]');
  if (!item || event.button !== 0) return;

  let grab = session;
  if (!grab?.layout.items.includes(item)) {
    grab?.end(undefined, event, 'drag');
    const candidates = candidatesOf([item]);
    if (candidates.length === 0) return;
    grab = createSession(measure([item], candidates), {
      from: [],
      kind: 'settle',
      start: performance.now(),
    });
    session = grab;
  }

  event.preventDefault();
  grabber.setPointerCapture(event.pointerId);
  grab.follow(event);
  const current = grab;

  const onMove = (moveEvent: PointerEvent) => current.point(moveEvent);
  const onEnd = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== event.pointerId) return;
    grabber.removeEventListener('pointermove', onMove);
    grabber.removeEventListener('pointerup', onEnd);
    grabber.removeEventListener('pointercancel', onEnd);
    if (current.mode()?.kind !== 'pointer') return;
    current.end(
      endEvent.type === 'pointercancel' ? undefined : current.target(),
      endEvent,
      'drag',
    );
  };
  grabber.addEventListener('pointermove', onMove);
  grabber.addEventListener('pointerup', onEnd);
  grabber.addEventListener('pointercancel', onEnd);
};

// Moved to another group, it's a new row: its grabber keeps the focus.
const refocus = (item: HTMLElement, handle: Handle, name: string) => {
  requestAnimationFrame(() => {
    if (item.isConnected) return;
    for (const entry of handle.items) {
      if (entry.name() !== name) continue;
      entry.ref.current
        ?.querySelector<HTMLElement>('[data-list-part=grabber]')
        ?.focus();
    }
  });
};

const directionOf = (key: string) => {
  if (key === 'ArrowUp') return -1;
  return key === 'ArrowDown' ? 1 : undefined;
};

/**
 * Moves a row by keyboard (see `Grabber`): to the previous or next gap, at
 * once; the app's grab, if it holds the row, step by step (dropped by Enter
 * or Space).
 * @internal
 */
export const reorderByKey = (
  event: KeyboardEvent,
  grabber: HTMLElement,
): void => {
  const item = grabber.closest<HTMLElement>('[data-list-part=item]');
  if (!item) return;
  const direction = directionOf(event.key);

  if (session?.layout.items.includes(item)) {
    if (direction) {
      event.preventDefault();
      session.step(direction);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      session.end(session.target(), event, 'keyboard');
    }
    return;
  }
  if (!direction) return;

  const candidates = candidatesOf([item]);
  if (candidates.length === 0) return;
  const layout = measure([item], candidates);
  const gap = besideOf(layout, layout.origin, direction);
  if (!gap) return;

  event.preventDefault();
  const change = changeOf([item], gap);
  announce(describe('Moved', [item], gap));
  gap.handle.options.onReorder?.(change, { event, reason: 'keyboard' });
  const name = change.items[0]?.name;
  if (name !== undefined) refocus(item, gap.handle, name);
};

/**
 * Rows reordered by a handle (`List.createReorderHandle`, in a component
 * `useCreateReorderHandle`): given to the rows (`Item` `reorderHandle`), and
 * to where they can be dropped (`DropTarget`, `DropGroup`, `Group`
 * `reorderHandle`); its `onReorder` called when rows are moved (see above).
 * The app grabs rows itself (`grab`, by their `dropName`), e.g. several
 * selected ones; their grabbers then drag them together, or `move`, `drop`
 * and `cancel` move them.
 */
export class ListReorderHandle implements Handle {
  /** @internal */
  readonly items = new Set<ReorderItemEntry>();
  /** @internal */
  options: ListReorderOptions;
  /** @internal */
  readonly targets = new Set<ReorderTargetEntry>();

  constructor(options: ListReorderOptions = {}) {
    this.options = options;
  }

  /** Rows are grabbed (by the app, a grabber, or a drag), not yet dropped. */
  get isGrabbed(): boolean {
    return (
      session?.mode() !== undefined &&
      session.layout.items.some((item) => {
        const entry = entries.get(item);
        return entry !== undefined && this.items.has(entry);
      })
    );
  }

  /** Puts the grabbed rows back. */
  cancel(): void {
    if (this.isGrabbed) {
      session?.end(undefined, new Event('cancel'), 'imperative');
    }
  }

  /** Drops the grabbed rows at their target (calling `onReorder`). */
  drop(): void {
    if (this.isGrabbed) {
      session?.end(session.target(), new Event('drop'), 'imperative');
    }
  }

  /**
   * Grabs rows (by their `dropName`, in this order), lifting them where the
   * first is; ends any other grab. Rows not given this handle are skipped.
   */
  grab(names: readonly string[]): void {
    const entriesByName = this.items.values().toArray();
    const rows = names.flatMap((name) => {
      const element = entriesByName.find((entry) => entry.name() === name)?.ref
        .current;
      return element && isItem(element) ? [element] : [];
    });
    session?.end(undefined, new Event('grab'), 'imperative');
    // This handle's targets first.
    const shared = candidatesOf(rows);
    if (rows.length === 0 || !shared.includes(this)) return;
    const candidates = [this, ...shared.filter((handle) => handle !== this)];

    session = createSession(measure(rows, candidates), {
      from: rows.map((row) => row.getBoundingClientRect().top),
      kind: 'settle',
      start: performance.now(),
    });
  }

  /** Moves the grabbed rows to the previous or next target. */
  move(direction: 'next' | 'previous'): void {
    if (this.isGrabbed) session?.step(direction === 'next' ? 1 : -1);
  }

  /**
   * Its options, the latest (see `useCreateReorderHandle`).
   * @internal
   */
  setOptions(options: ListReorderOptions): void {
    this.options = options;
  }
}

/** A reorder handle, made once (see above). */
export const createReorderHandle = (
  options?: ListReorderOptions,
): ListReorderHandle => new ListReorderHandle(options);

/**
 * `List.createReorderHandle`, in a component: made once, for its lifetime,
 * its options the latest.
 */
export const useCreateReorderHandle = (
  options: ListReorderOptions = {},
): ListReorderHandle => {
  const [handle] = useState(() => createReorderHandle(options));
  useLayoutEffect(() => {
    handle.setOptions(options);
  });

  return handle;
};

// Where moved rows go in a list (`rest`, without them): after `after`, or
// before `before`; rows not in it taken as those before (after) it.
const insertionOf = <T>(
  rest: readonly T[],
  target: ListReorderTarget,
  nameOf: (row: T) => string,
) => {
  const afterAt = rest.findIndex((row) => nameOf(row) === target.after);
  if (afterAt !== -1) return afterAt + 1;
  const beforeAt = rest.findIndex((row) => nameOf(row) === target.before);
  if (beforeAt !== -1) return beforeAt;
  return target.after === undefined ? rest.length : 0;
};

/**
 * Applies a change (see `ListReorderChange`) to the app's rows, named by
 * `nameOf` (as their `dropName`): a list of them, or lists by name (their
 * `Group`'s or `DropGroup`'s `dropName`). The moved rows are taken out and
 * put after the target's `after` row (or before its `before` row); rows not
 * in the data (e.g. a pinned row) are taken as those before (after) it; in
 * an empty list, by the target's `name`. Returns new arrays for those that
 * changed (the input, if a row isn't found).
 */
export function reorder<T>(
  data: readonly T[],
  change: ListReorderChange,
  nameOf: (row: T) => string,
): readonly T[];
export function reorder<T, Key extends string>(
  data: Readonly<Record<Key, readonly T[]>>,
  change: ListReorderChange,
  nameOf: (row: T) => string,
): Readonly<Record<Key, readonly T[]>>;
export function reorder<T>(
  data: readonly T[] | Readonly<Record<string, readonly T[]>>,
  change: ListReorderChange,
  nameOf: (row: T) => string,
): readonly T[] | Readonly<Record<string, readonly T[]>> {
  const isList = Array.isArray(data);
  const lists: Record<string, readonly T[]> = isList
    ? { '': data as readonly T[] }
    : { ...(data as Readonly<Record<string, readonly T[]>>) };
  const keys = Object.keys(lists);

  const all = keys.flatMap((key) => lists[key] ?? []);
  const moved = change.items.map((item) =>
    all.find((row) => nameOf(row) === item.name),
  );
  if (moved.includes(undefined)) return data;

  const { target } = change;
  const containing = (name: string | undefined) =>
    keys.find((key) => lists[key]?.some((row) => nameOf(row) === name));
  let key = isList ? '' : containing(target.after);
  key ??= containing(target.before);
  if (key === undefined && target.name !== undefined && target.name in lists) {
    key = target.name;
  }
  if (key === undefined) return data;

  for (const other of keys) {
    const list = lists[other] ?? [];
    if (list.some((row) => moved.includes(row))) {
      lists[other] = list.filter((row) => !moved.includes(row));
    }
  }
  const rest = lists[key] ?? [];
  const at = insertionOf(rest, target, nameOf);
  lists[key] = [...rest.slice(0, at), ...(moved as T[]), ...rest.slice(at)];

  return isList ? (lists[''] ?? []) : lists;
}
