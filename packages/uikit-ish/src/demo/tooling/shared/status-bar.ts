/** The devices' screens (see style.css). */
const frames = '.demo-phone, .demo-tablet';

/** Whether an element scrolls vertically (it overflows, and may). */
const scrolls = (element: Element) => {
  if (element.scrollHeight <= element.clientHeight + 1) return false;
  const { overflowY } = getComputedStyle(element);
  return overflowY === 'auto' || overflowY === 'scroll';
};

/**
 * The devices' status bars, tapped (a click in a screen's top inset):
 * what scrolls below it scrolled to its top, smoothly (the
 * topmost element there, or its nearest ancestor scrolling, within the
 * screen: e.g. a page, or a sheet open over it; nothing, if a modal's
 * backdrop covers it). The click goes no further (the status bar's).
 */
export const startStatusBarTaps = (): void => {
  if (typeof document === 'undefined') return;

  addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const frame = target?.closest<HTMLElement>(frames);
      if (!frame) return;

      // A tap's click, within the inset: not a script's (`click()`, at 0,
      // 0) or a key's (`detail` 0), which aren't the status bar's.
      if (!event.isTrusted || event.detail === 0) return;
      const { top } = frame.getBoundingClientRect();
      const inset = Number.parseFloat(
        getComputedStyle(frame).getPropertyValue('--uikit-safe-area-inset-top'),
      );
      const y = event.clientY - top;
      if (!(y >= 0 && y < inset)) return;

      event.preventDefault();
      event.stopPropagation();

      // (Just below the status bar, where the tap was.)
      let element = document.elementFromPoint(event.clientX, top + inset + 1);
      while (element && element !== frame && frame.contains(element)) {
        if (scrolls(element)) {
          element.scrollTo({ behavior: 'smooth', top: 0 });
          return;
        }
        element = element.parentElement;
      }
    },
    { capture: true },
  );
};
