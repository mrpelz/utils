import { RefObject, useEffect } from 'react';

// iOS' WebKit (iPhone, iPad) zooms the page in as a text field with a font
// smaller than 16px is focused, and scrolls the layout viewport to keep a
// field it focuses clear of the keyboard (shifting a fixed layout, e.g. a
// `Viewport`'s bars). Two guards against them, each also a hook (made, and
// let go of, with the component); elsewhere, they do nothing.

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

/**
 * iOS: a text field touched in `target` focused without scrolling (its
 * touch's end: the field focused, `preventScroll`, instead of the
 * browser's focusing, which scrolls the layout viewport). The touch's
 * click doesn't follow, and the caret goes where the field puts it, not
 * where it was touched. Until the returned function removes it.
 */
export const preventFocusShift = (
  target: Document | HTMLElement = document,
): (() => void) => {
  if (!isIos()) return noop;

  const onTouchEnd = (event: Event) => {
    const field =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>(textField)
        : null;
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

  target.addEventListener('touchend', onTouchEnd, {
    capture: true,
    passive: false,
  });
  return () =>
    target.removeEventListener('touchend', onTouchEnd, { capture: true });
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
