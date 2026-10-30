import { RefObject, useEffect } from 'react';

// iOS' WebKit (iPhone, iPad) zooms the page in as a text field with a font
// smaller than 16px is focused, and scrolls the layout viewport to keep a
// field it focuses clear of the keyboard (shifting a fixed layout, e.g. a
// `Viewport`'s bars). Two guards against them, each also a hook (made, and
// let go of, with the component); elsewhere, they do nothing. A third
// keeps a held press from selecting text (and showing the browser's text
// menu), e.g. on a menu's trigger.

/** Whether this is iOS' WebKit (the touch callout: iOS only). */
const isIos = () =>
  typeof CSS !== 'undefined' && CSS.supports('-webkit-touch-callout', 'none');

/** Nothing to let go of (a guard that didn't apply). */
const noop = () => undefined;

/** Holds of the zoom guard, and the viewport's content before the first. */
let zoomHolds = 0;
let zoomRestore: string | undefined;

/** A viewport's content, its largest scale 1 (other entries kept). */
const withMaximumScale = (content: string) =>
  [
    ...content
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry !== '' && !entry.startsWith('maximum-scale')),
    'maximum-scale=1',
  ].join(', ');

/**
 * iOS: no zoom as a text field is focused (the viewport's `maximum-scale`
 * 1; iOS still lets the page be pinch-zoomed). Held until the returned
 * function lets go of it (the viewport's content restored with the last).
 */
export const preventInputZoom = (): (() => void) => {
  const meta = isIos()
    ? document.querySelector<HTMLMetaElement>('meta[name=viewport]')
    : null;
  if (!meta) return noop;

  if (zoomHolds === 0) {
    zoomRestore = meta.content;
    meta.content = withMaximumScale(meta.content);
  }
  zoomHolds += 1;

  let isHeld = true;
  return () => {
    if (!isHeld) return;
    isHeld = false;
    zoomHolds -= 1;
    if (zoomHolds === 0 && zoomRestore !== undefined) {
      meta.content = zoomRestore;
    }
  };
};

/** `preventInputZoom`, while the component is mounted (and `enabled`). */
export const useInputZoomPrevention = (isEnabled = true): void => {
  useEffect(() => (isEnabled ? preventInputZoom() : undefined), [isEnabled]);
};

/** What the keyboard edits text in (not buttons, boxes, pickers or files). */
const textField = [
  'input:not([type=button], [type=checkbox], [type=color], [type=file], [type=hidden], [type=image], [type=radio], [type=range], [type=reset], [type=submit])',
  'textarea',
  '[contenteditable]:not([contenteditable=false])',
].join(', ');

/** What a touch activates itself (not a text field near it, see below). */
const control = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable]:not([contenteditable=false])',
  '[role=button]',
  '[role=link]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * How far from a text field a touch still focuses it (px): iOS adjusts a
 * touch to the control nearest it, within about a finger's width.
 */
const touchReach = 24;

/** How far a tap's touch may move (px; farther, it's a drag). */
const tapSlop = 10;

/** The distance from a point to a rect (0 within it). */
const distance = (x: number, y: number, rect: DOMRect) =>
  Math.hypot(
    Math.max(rect.left - x, 0, x - rect.right),
    Math.max(rect.top - y, 0, y - rect.bottom),
  );

/**
 * The text field a touch focuses: the one touched (or within it), a
 * label's, or, touching no control, the nearest within reach (iOS
 * adjusting the touch to it).
 */
const touchedField = (
  event: TouchEvent,
  root: Document | HTMLElement,
): HTMLElement | null => {
  const { target } = event;
  if (!(target instanceof Element)) return null;

  const field = target.closest<HTMLElement>(textField);
  if (field) return field;

  const labelled = target.closest('label')?.control;
  if (labelled) {
    return labelled.matches(textField) ? (labelled as HTMLElement) : null;
  }

  const touch = event.changedTouches[0];
  if (!touch || target.closest(control)) return null;
  const { clientX: x, clientY: y } = touch;

  let nearest: HTMLElement | null = null;
  let nearestDistance = touchReach;
  for (const candidate of root.querySelectorAll<HTMLElement>(textField)) {
    const candidateDistance = distance(x, y, candidate.getBoundingClientRect());
    if (!(candidateDistance <= nearestDistance)) {
      continue;
    }

    nearest = candidate;
    nearestDistance = candidateDistance;
  }
  return nearest;
};

/** The layout viewport scrolled back to `scroll` (see `preventFocusShift`). */
const restoreScroll = (scroll: number) => {
  if (Math.abs(window.scrollY - scroll) >= 1) window.scrollTo(0, scroll);
};

/**
 * iOS: a text field touched in `target` focused without scrolling (its
 * touch's end: the field focused, `preventScroll`, instead of the
 * browser's focusing, which scrolls the layout viewport); also touched
 * just beside it (see `touchedField`). The touch's click doesn't follow,
 * and the caret goes where the field puts it, not where it was touched.
 * The page hidden with one focused and shown again (e.g. a Home Screen app
 * left and reopened), it's focused again without scrolling, the layout
 * viewport's scroll as it was. Until the returned function removes it.
 */
export const preventFocusShift = (
  target: Document | HTMLElement = document,
): (() => void) => {
  if (!isIos()) return noop;

  // Where the touch started: a tap's (not a drag's, e.g. scrolling) end
  // focuses.
  let start: Touch | undefined;
  const onTouchStart = (event: Event) => {
    start =
      (event as TouchEvent).touches.length === 1
        ? (event as TouchEvent).touches[0]
        : undefined;
  };

  const onTouchEnd = (event: Event) => {
    const end = (event as TouchEvent).changedTouches[0];
    const isTap =
      start !== undefined &&
      end !== undefined &&
      Math.hypot(end.clientX - start.clientX, end.clientY - start.clientY) <=
        tapSlop;
    start = undefined;
    const field = isTap ? touchedField(event as TouchEvent, target) : null;
    if (
      !field ||
      field === document.activeElement ||
      field.matches(':disabled') ||
      !event.cancelable
    ) {
      return;
    }
    event.preventDefault();
    field.focus({ preventScroll: true });
  };

  // The page hidden with a text field focused in `target` (e.g. a Home
  // Screen app left with the keyboard shown): that field, its selection
  // and the layout viewport's scroll. Shown again, iOS may focus it anew
  // itself, scrolling (or drop the keyboard): it's focused again here
  // without scrolling (its selection as it was), the scroll put back, also
  // a frame and a moment later (iOS' scrolling may follow).
  let hidden:
    | {
        field: HTMLElement;
        scroll: number;
        selection?: [number | null, number | null];
      }
    | undefined;
  let restores: ReturnType<typeof setTimeout>[] = [];
  const onVisibility = () => {
    for (const restore of restores) clearTimeout(restore);
    restores = [];
    if (document.visibilityState === 'hidden') {
      const { activeElement } = document;
      hidden =
        activeElement instanceof HTMLElement &&
        activeElement.matches(textField) &&
        target.contains(activeElement)
          ? {
              field: activeElement,
              scroll: window.scrollY,
              selection:
                activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement
                  ? [activeElement.selectionStart, activeElement.selectionEnd]
                  : undefined,
            }
          : undefined;
      return;
    }

    if (!hidden) return;
    const { field, scroll, selection } = hidden;
    hidden = undefined;
    if (!field.isConnected || field.matches(':disabled')) return;
    if (field === document.activeElement) field.blur();
    field.focus({ preventScroll: true });
    if (
      selection &&
      (field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement)
    ) {
      try {
        field.setSelectionRange(...selection);
      } catch {
        // (Fields without a selection, e.g. `type="email"`.)
      }
    }
    restoreScroll(scroll);
    requestAnimationFrame(() => restoreScroll(scroll));
    restores = [100, 300].map((delay) =>
      setTimeout(() => restoreScroll(scroll), delay),
    );
  };

  const listeners: [string, (event: Event) => void][] = [
    ['touchstart', onTouchStart],
    ['touchend', onTouchEnd],
  ];
  for (const [type, listener] of listeners) {
    target.addEventListener(type, listener, { capture: true, passive: false });
  }
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    for (const [type, listener] of listeners) {
      target.removeEventListener(type, listener, { capture: true });
    }
    document.removeEventListener('visibilitychange', onVisibility);
    for (const restore of restores) clearTimeout(restore);
  };
};

/**
 * `preventFocusShift`, in `target` (or the document), while the component
 * is mounted (and `enabled`).
 */
export const useFocusShiftPrevention = (
  target?: RefObject<HTMLElement | null>,
  isEnabled = true,
): void => {
  useEffect(
    () =>
      isEnabled ? preventFocusShift(target?.current ?? document) : undefined,
    [isEnabled, target],
  );
};

/** The properties `preventTextActions` sets (to `none`). */
const textActionProperties = [
  '-webkit-touch-callout',
  '-webkit-user-select',
  'user-select',
] as const;

/**
 * A held press in `target` (e.g. a menu's trigger opened by it, its
 * `openOn="secondaryClick"`) selects no text in it and shows no callout
 * nor the browser's own text menu (iOS: its `user-select` and
 * `-webkit-touch-callout`, `none`). Until the returned function restores
 * them. (An app's choice: the text may well stay selectable.)
 */
export const preventTextActions = (target: HTMLElement): (() => void) => {
  const { style } = target;
  const previous = textActionProperties.map(
    (property) =>
      [
        property,
        style.getPropertyValue(property),
        style.getPropertyPriority(property),
      ] as const,
  );
  for (const property of textActionProperties) {
    style.setProperty(property, 'none');
  }

  let isHeld = true;
  return () => {
    if (!isHeld) return;
    isHeld = false;
    for (const [property, value, priority] of previous) {
      if (value) style.setProperty(property, value, priority);
      else style.removeProperty(property);
    }
  };
};

/**
 * `preventTextActions` on `target`, while the component is mounted (and
 * `enabled`).
 */
export const useTextActionsPrevention = (
  target: RefObject<HTMLElement | null>,
  isEnabled = true,
): void => {
  useEffect(() => {
    const { current: element } = target;
    return isEnabled && element ? preventTextActions(element) : undefined;
  }, [isEnabled, target]);
};
