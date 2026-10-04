// Source: `ios-haptics` (github.com/tijnjh/ios-haptics).
//
// Haptic feedback on the web: Safari on iOS (18 and later) taps when a
// switch (`<input type="checkbox" switch>`) is toggled, also one that isn't
// shown, by clicking its label; elsewhere, the Vibration API, where there is
// one (Android). Safari only taps while handling a user's action (e.g. a
// click, a key or the end of a touch); browsers without either do nothing.
//
// Up to the app (as UIKit's feedback generators are): e.g. a selection
// changing (`Roll` `onHighlightChange`), an action confirmed (an overswipe),
// or an error.

const vibrate = (pattern: number | number[]) => {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return false;
  }
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
};

// Only touch screens tap (on a Mac, it would toggle a hidden switch for
// nothing).
const switchTaps = () =>
  typeof document !== 'undefined' &&
  typeof matchMedia === 'function' &&
  matchMedia('(pointer: coarse)').matches;

const toggleSwitch = () => {
  const label = document.createElement('label');
  label.ariaHidden = 'true';
  label.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.append(input);

  document.head.append(label);
  label.click();
  label.remove();
};

const taps = (count: number) => {
  if (vibrate(Array.from({ length: count * 2 - 1 }, () => 50))) return;
  if (!switchTaps()) return;

  toggleSwitch();
  // Further taps, 120ms apart (still within the user's action).
  for (let index = 1; index < count; index += 1) {
    setTimeout(toggleSwitch, index * 120);
  }
};

/** Haptic feedback (see above). */
export const haptics = {
  /** Two taps: an action confirmed (UIKit's `success` notification). */
  confirm: (): void => taps(2),
  /** Three taps: an error (UIKit's `error` notification). */
  error: (): void => taps(3),
  /** A tap: a selection changed, or an impact. */
  tap: (): void => taps(1),
};
