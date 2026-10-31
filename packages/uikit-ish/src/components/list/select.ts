import { edgeScrollDelta, frameElapsed } from '../utils/main.js';

// Dragging to select (as iOS' multiple selection): pressed on a row's
// checkbox and dragged along the rows (past `slop`, mostly vertically),
// the first checkbox flips, and every row from it to the one under the
// pointer takes its new state; rows dragged back over return to theirs.
// Each changes by its checkbox's `click()` (Base UI's own toggling, its
// `onCheckedChange` called, controlled or not). Near the scroll container's
// ends, it scrolls along (as text selections do). The press's own click,
// released, is swallowed (the first checkbox flipped already).

/** How far (px) a press moves to start dragging. */
const slop = 8;

/** A list's checkboxes that can change, in order (shown, enabled). */
const checkboxesOf = (root: Element) =>
  [
    ...root.querySelectorAll<HTMLElement>(
      '[role=checkbox][data-list-part=edit]',
    ),
  ].filter(
    (checkbox) =>
      !Object.hasOwn(checkbox.dataset, 'disabled') &&
      !Object.hasOwn(checkbox.dataset, 'readonly') &&
      checkbox.getClientRects().length > 0,
  );

const isChecked = (checkbox: HTMLElement) =>
  checkbox.getAttribute('aria-checked') === 'true';

/** The nearest scroll container along the block axis (or the document's). */
const scrollerOf = (element: HTMLElement): Element => {
  for (
    let parent = element.parentElement;
    parent && parent !== document.body;
    parent = parent.parentElement
  ) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') return parent;
  }
  return document.scrollingElement ?? document.documentElement;
};

/** The row (its checkbox's index) nearest `y`, by its row's box. */
const nearestTo = (checkboxes: readonly HTMLElement[], y: number) => {
  let nearest = 0;
  let distance = Number.POSITIVE_INFINITY;
  for (const [index, checkbox] of checkboxes.entries()) {
    const row = checkbox.closest('[data-list-part=item]') ?? checkbox;
    const { bottom, top } = row.getBoundingClientRect();
    const to = y < top ? top - y : Math.max(0, y - bottom);
    if (!(to < distance)) continue;
    distance = to;
    nearest = index;
  }
  return nearest;
};

/** The press's click, released after dragging: swallowed (see above). */
const swallowClick = () => {
  const swallow = (event: MouseEvent) => {
    if (!event.isTrusted) return;
    event.preventDefault();
    event.stopPropagation();
    removeEventListener('click', swallow, { capture: true });
  };
  addEventListener('click', swallow, { capture: true });
  // (None followed, e.g. released elsewhere: none swallowed later.)
  setTimeout(() => removeEventListener('click', swallow, { capture: true }));
};

/**
 * Starts tracking a press on a checkbox (see above), to drag along its
 * list's rows (its `root`).
 */
export const dragToSelect = (
  checkbox: HTMLElement,
  root: HTMLElement,
  { clientX, clientY, pointerId }: PointerEvent,
): void => {
  const scroller = scrollerOf(checkbox);
  const elapsedOf = frameElapsed();
  let y = clientY;
  let frame = 0;
  const listening = new AbortController();
  const stop = () => {
    cancelAnimationFrame(frame);
    delete root.dataset.selecting;
    listening.abort();
  };
  // Dragging: the checkboxes, their states before, and the ones set.
  let drag:
    | {
        checkboxes: HTMLElement[];
        original: boolean[];
        start: number;
        states: boolean[];
        target: boolean;
      }
    | undefined;

  const update = () => {
    if (!drag) return;
    const { checkboxes, original, start, states, target } = drag;
    const end = nearestTo(checkboxes, y);
    const [from, to] = start < end ? [start, end] : [end, start];
    for (const [index, each] of checkboxes.entries()) {
      const state =
        index >= from && index <= to ? target : (original[index] ?? false);
      if (states[index] === state) continue;
      states[index] = state;
      each.click();
    }
  };

  // Near the scroller's ends: scrolling along, the rows under the pointer
  // changing.
  const tick = (time: number) => {
    frame = requestAnimationFrame(tick);
    const { bottom, top } =
      scroller === document.scrollingElement
        ? { bottom: window.innerHeight, top: 0 }
        : scroller.getBoundingClientRect();
    const delta = edgeScrollDelta(y, top, bottom, elapsedOf(time));
    if (delta === 0) return;
    scroller.scrollTop += delta;
    update();
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    y = event.clientY;
    if (drag) {
      update();
      return;
    }
    const dy = Math.abs(event.clientY - clientY);
    if (dy <= slop || dy < Math.abs(event.clientX - clientX)) return;
    const checkboxes = checkboxesOf(root);
    const start = checkboxes.indexOf(checkbox);
    if (start === -1) {
      stop();
      return;
    }
    const original = checkboxes.map((each) => isChecked(each));
    drag = {
      checkboxes,
      original,
      start,
      states: [...original],
      target: !original[start],
    };
    root.dataset.selecting = '';
    update();
    frame = requestAnimationFrame(tick);
  };

  const onUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    if (drag && event.type === 'pointerup') swallowClick();
    stop();
  };

  const options = { capture: true, signal: listening.signal };
  addEventListener('pointermove', onMove, options);
  addEventListener('pointerup', onUp, options);
  addEventListener('pointercancel', onUp, options);
};
