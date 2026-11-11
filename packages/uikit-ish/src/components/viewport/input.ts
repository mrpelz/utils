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
export const textField = [
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
export const tapSlop = 10;

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
  // Another control (e.g. a field's clear button, in its label): its own.
  if (target.closest(control)) return null;

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

/** A hidden box filling the window's fixed layers' box (see `fixedBottom`). */
let probe: HTMLElement | undefined;

/**
 * Where the window's fixed layers end (px, from its top): a hidden box's
 * bottom, fixed and filling the screen (made once, on the root element).
 * The layout viewport's bottom, `innerHeight`, as a rule; not so where iOS
 * shrinks it to the visual viewport, the keyboard shown (iPadOS: a field's
 * tap left to iOS, see `preventFocusShift`), its fixed layers laid out as
 * tall as before: what the keyboard is measured against.
 */
export const fixedBottom = (): number => {
  if (!probe?.isConnected) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.dataset.uikitViewportProbe = '';
    probe.style.cssText =
      'position:fixed;inset:0;visibility:hidden;pointer-events:none;contain:strict;z-index:-1';
    document.documentElement.append(probe);
  }
  return probe.getBoundingClientRect().bottom;
};

/**
 * Whether the software keyboard is shown (the visual viewport ending above
 * the fixed layers' box, see `fixedBottom`, by more than a bar's height).
 */
export const isKeyboardShown = (): boolean => {
  const { visualViewport: viewport } = window;
  return viewport
    ? fixedBottom() - (viewport.offsetTop + viewport.height) > 100
    : false;
};

/** The layout viewport scrolled back to `scroll` (see `preventFocusShift`). */
const restoreScroll = (scroll: number) => {
  if (Math.abs(window.scrollY - scroll) >= 1) window.scrollTo(0, scroll);
};

/**
 * iOS: a text field touched in `target` focused without scrolling (its
 * touch's end: the field focused, `preventScroll`, instead of the
 * browser's focusing, which scrolls the layout viewport); also touched
 * just beside it (see `touchedField`). Its keyboard showing over it still,
 * iOS' scroll revealing it put back, while its keyboard's shown (until
 * it's hidden, the field left, or the screen touched). Its keyboard hidden
 * by the user (iPadOS' hide key), a tap on it again left to iOS (no focus
 * from code shows it then), its scroll put back the same (a brief jump, as
 * iOS' visual viewport follows). The touch's click doesn't follow,
 * and the caret goes where the field puts it, not where it was touched.
 * Also a field focused already, but not by a touch (e.g. a popup's initial
 * focus, its keyboard not shown): focused anew, without scrolling.
 * The page hidden with one focused and shown again (e.g. a Home Screen app
 * left and reopened), it's focused again without scrolling, the layout
 * viewport's scroll as it was; without one, the scroll as it was, too. Until the returned function removes it.
 */
export const preventFocusShift = (
  target: Document | HTMLElement = document,
): (() => void) => {
  if (!isIos()) return noop;

  // Where the touch started: a tap's (not a drag's, e.g. scrolling) end
  // focuses.
  let start: Touch | undefined;
  // The field focused here (its keyboard shown), until it's left, or its
  // keyboard hidden (iPadOS' hide key: see `dismissed`).
  let focused: HTMLElement | undefined;
  // The layout viewport's scroll as a tap focused a field, held while its
  // keyboard is shown (see `onWindowScroll`): until it's hidden, the field
  // left, or the screen touched.
  let held: number | undefined;
  // The field focused here whose keyboard the user hid (iPadOS' hide key),
  // still focused: its keyboard shown again only by iOS' own handling of a
  // tap (not by a focus from code, even its focus moved elsewhere from code
  // meanwhile), see `onTouchEnd`.
  let dismissed: HTMLElement | undefined;
  const onFocusOut = (event: Event) => {
    if (event.target === dismissed) dismissed = undefined;
    if (event.target === focused) {
      focused = undefined;
      held = undefined;
    }
  };
  // A field focused by a tap, still covered by the keyboard as it shows
  // (e.g. at the bottom of a column, iPadOS: in a fixed layer contained by
  // it, not the window's, see Layout), iOS scrolls the layout viewport to
  // reveal it, its focus without scrolling notwithstanding (also later on,
  // focused again: after its keyboard is shown; or the visual viewport
  // within it): put back, also a frame later.
  const putBackHeld = () => {
    if (held === undefined) return;
    const { visualViewport: viewport } = window;
    if (
      Math.abs(window.scrollY - held) >= 1 ||
      (viewport !== null && viewport.offsetTop >= 1)
    ) {
      window.scrollTo(0, held);
    }
  };
  const onWindowScroll = () => {
    putBackHeld();
    requestAnimationFrame(putBackHeld);
  };
  let wasKeyboardShown = false;
  const onViewportResize = () => {
    const isShown = isKeyboardShown();
    // Its keyboard hidden by the user (iPadOS' hide key), its field still
    // focused: a tap on it again left to iOS (see `onTouchEnd`).
    if (wasKeyboardShown && !isShown) {
      dismissed =
        focused !== undefined && focused === document.activeElement
          ? focused
          : undefined;
      focused = undefined;
      held = undefined;
    }
    wasKeyboardShown = isShown;
    onWindowScroll();
  };
  const onTouchStart = (event: Event) => {
    start =
      (event as TouchEvent).touches.length === 1
        ? (event as TouchEvent).touches[0]
        : undefined;
    // (A touch: e.g. scrolling, the user's.)
    held = undefined;
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
    if (!field || field.matches(':disabled') || !event.cancelable) return;
    if (field === document.activeElement) {
      // Its keyboard shown: the caret placed where touched, as iOS does.
      if (isKeyboardShown()) return;
      // Focused here, its keyboard not shown (hidden by the user, or none
      // shown for a focus from code; or a hardware keyboard): the tap left
      // to iOS (its keyboard shown, the caret placed), its scroll revealing
      // it put back (see `putBackHeld`: iOS' visual viewport following a
      // few frames later, a brief jump).
      if (field === focused || field === dismissed) {
        dismissed = undefined;
        focused = field;
        held = window.scrollY;
        return;
      }
      // Focused without its keyboard (e.g. a popup's initial focus, not in
      // a touch's handler): iOS would show it, scrolling.
      field.blur();
    }
    event.preventDefault();
    if (!isKeyboardShown()) held = window.scrollY;
    field.focus({ preventScroll: true });
    focused = field;
  };

  // The page hidden with a text field focused in `target` (e.g. a Home
  // Screen app left with the keyboard shown): that field, its selection
  // and the layout viewport's scroll. Shown again, iOS may focus it anew
  // itself, scrolling (or drop the keyboard): it's focused again here
  // without scrolling (its selection as it was), the scroll put back, also
  // a frame and a moment later (iOS' scrolling may follow).
  // Hidden without one (e.g. a hardware keyboard's iPad), shown again:
  // iOS may leave the layout viewport scrolled (the page shifted up until a
  // field is focused and left), its scroll put back as it was, the same.
  let hidden:
    | {
        field?: HTMLElement;
        scroll: number;
        selection?: [number | null, number | null];
      }
    | undefined;
  let restores: ReturnType<typeof setTimeout>[] = [];
  const putBack = (scroll: number) => {
    restoreScroll(scroll);
    requestAnimationFrame(() => restoreScroll(scroll));
    restores = [100, 300].map((delay) =>
      setTimeout(() => restoreScroll(scroll), delay),
    );
  };
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
          : { scroll: window.scrollY };
      return;
    }

    if (!hidden) return;
    const { field, scroll, selection } = hidden;
    hidden = undefined;
    if (!field) {
      putBack(scroll);
      return;
    }
    if (!field.isConnected || field.matches(':disabled')) return;
    if (field === document.activeElement) field.blur();
    field.focus({ preventScroll: true });
    focused = field;
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
    putBack(scroll);
  };

  const listeners: [string, (event: Event) => void][] = [
    ['touchstart', onTouchStart],
    ['touchend', onTouchEnd],
    ['focusout', onFocusOut],
  ];
  for (const [type, listener] of listeners) {
    target.addEventListener(type, listener, { capture: true, passive: false });
  }
  document.addEventListener('visibilitychange', onVisibility);
  const { visualViewport } = window;
  visualViewport?.addEventListener('resize', onViewportResize);
  visualViewport?.addEventListener('scroll', onWindowScroll);
  addEventListener('scroll', onWindowScroll, { passive: true });
  return () => {
    for (const [type, listener] of listeners) {
      target.removeEventListener(type, listener, { capture: true });
    }
    document.removeEventListener('visibilitychange', onVisibility);
    visualViewport?.removeEventListener('resize', onViewportResize);
    visualViewport?.removeEventListener('scroll', onWindowScroll);
    removeEventListener('scroll', onWindowScroll);
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
