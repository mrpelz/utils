import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';
import { type FunctionComponent, useRef } from 'react';

import {
  type GridItemLayoutChange,
  useGridItemLayout,
} from '../../components/index.js';

// What the demos' cards do with GSAP's Flip (an app's choice, not the
// library's: GSAP is the demos' dependency only): their parts moved from
// where they were as their tile gets to a new box (see the library's
// `useGridItemLayout`), by the tile's timing. What's laid out anew moves
// there (its text scaled, not reflowed); what comes or goes isn't faded
// (shown or hidden as the card's edge passes it: no opacity animations in
// a scroller, for iOS).

gsap.registerPlugin(Flip, CustomEase);

/** A cubic Bézier's CSS easing (its points). */
const bezier = /^cubic-bezier\((?<points>[^)]+)\)$/u;

/** CSS easings as GSAP's, made once each (see `easeOf`). */
const eases = new Map<string, gsap.EaseFunction>();

/** A CSS easing as GSAP's (a cubic Bézier's; else one of GSAP's own). */
const easeOf = (easing: string) => {
  const points = bezier.exec(easing)?.groups?.points;
  if (!points) return 'power3.out';
  let ease = eases.get(easing);
  if (!ease) {
    const [x1 = '0', y1 = '0', x2 = '1', y2 = '1'] = points
      .split(',')
      .map((each) => each.trim());
    ease = CustomEase.create(
      `uikit-${String(eases.size)}`,
      `M0,0 C${x1},${y1} ${x2},${y2} 1,1`,
    );
    eases.set(easing, ease);
  }
  return ease;
};

/** A card's parts that move (its corner buttons the library's). */
const partsOf = (root: HTMLElement) =>
  root.querySelectorAll<HTMLElement>(
    '[data-card-part]:not([data-card-part="root"], [data-card-part="corner-button"])',
  );

/**
 * A card's parts moved from where they were as its tile changes its box
 * (with Flip, see the top): placed in its `Card.Root` (nothing shown).
 * Their boxes and
 * font sizes tweened (not scaled: a part's box may change its shape, e.g.
 * a symbol's column, which would squash what's in it), their timeline
 * paused, set to the tile's time each frame (its `elapsed`: started with
 * it, however long its first frame takes).
 */
export const FlipParts: FunctionComponent = () => {
  const marker = useRef<HTMLSpanElement | null>(null);
  const rootOf = () =>
    marker.current?.closest<HTMLElement>('[data-card-part="root"]') ?? null;
  const state = useRef<Flip.FlipState | undefined>(undefined);
  const running = useRef<(() => void) | undefined>(undefined);
  useGridItemLayout({
    onAfterChange: ({ duration, easing, elapsed }: GridItemLayoutChange) => {
      const root = rootOf();
      const before = state.current;
      state.current = undefined;
      if (!root || !before) return;
      const timeline = Flip.from(before, {
        duration: duration / 1000,
        ease: easeOf(easing),
        // (Laid out at their new sizes as they go, their text too.)
        props: 'fontSize',
        // (Measured by their boxes alone: nothing in a card is rotated or
        // skewed.)
        simple: true,
        targets: partsOf(root),
      }).pause();
      // (Following its tile each frame: its time set from the tile's.)
      let frame = 0;
      const stop = () => {
        cancelAnimationFrame(frame);
        timeline.progress(1).kill();
        if (running.current === stop) running.current = undefined;
      };
      const follow = () => {
        const time = elapsed();
        timeline.time(Math.min(time, duration) / 1000);
        if (time >= duration) stop();
        else frame = requestAnimationFrame(follow);
      };
      running.current = stop;
      frame = requestAnimationFrame(follow);
    },
    onBeforeChange: () => {
      const root = rootOf();
      if (!root) return;
      // (Where they're drawn now, a move of theirs running or not; that
      // move then done, so what's measured after is where they're laid
      // out.)
      state.current = Flip.getState(partsOf(root), {
        props: 'fontSize',
        simple: true,
      });
      running.current?.();
    },
  });
  return (
    <span
      ref={marker}
      hidden
    />
  );
};
