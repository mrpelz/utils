import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { type FunctionComponent, useRef } from 'react';

import {
  type GridItemLayoutChange,
  useGridItemLayout,
} from '../../components/index.js';

// What the demos' cards do with GSAP (an app's choice, not the library's:
// GSAP is the demos' dependency only): their parts moved from where they
// were as their tile gets to a new box (FLIP, see the library's
// `useGridItemLayout`), by the tile's timing. Each by transforms only: a
// translate from its old place in the card, its text from its old size by
// one scale (its font sizes' ratio). Not GSAP's Flip plugin: it tweens a
// part's width and height (laying the card out anew each frame: a part's
// box is a grid's, its columns following it) or scales it by its box (whose
// shape may change, squashing what's in it). What comes or goes isn't
// faded (shown or hidden as the card's edge passes it: no opacity
// animations in a scroller, for iOS).

gsap.registerPlugin(CustomEase);

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
 * A part's place in its card, its leading top corner's, its text size and
 * its text.
 */
type Place = { fontSize: number; text: string; x: number; y: number };

/**
 * Its parts' places, by their part (one of each in a card), from the
 * card's leading top corner, where they're drawn (a move of theirs running:
 * where it has them, their text at its scale).
 */
const placesOf = (root: HTMLElement) => {
  const isRtl = getComputedStyle(root).direction === 'rtl';
  const card = root.getBoundingClientRect();
  const places = new Map<string, Place>();
  for (const part of partsOf(root)) {
    const name = part.dataset.cardPart;
    if (!name || part.getClientRects().length === 0) continue;
    const box = part.getBoundingClientRect();
    places.set(name, {
      fontSize:
        (Number.parseFloat(getComputedStyle(part).fontSize) || 1) *
        Number(gsap.getProperty(part, 'scale') || 1),
      text: part.textContent,
      x: isRtl ? card.right - box.right : box.left - card.left,
      y: box.top - card.top,
    });
  }
  return [places, isRtl] as const;
};

/**
 * A card's parts moved from where they were as its tile changes its box
 * (see the top): placed in its `Card.Root` (nothing shown). Its timeline
 * paused, set to the tile's time each frame (its `elapsed`: started with
 * it, however long its first frame takes).
 */
export const FlipParts: FunctionComponent = () => {
  const marker = useRef<HTMLSpanElement | null>(null);
  const rootOf = () =>
    marker.current?.closest<HTMLElement>('[data-card-part="root"]') ?? null;
  const before = useRef<Map<string, Place> | undefined>(undefined);
  const running = useRef<(() => void) | undefined>(undefined);
  useGridItemLayout({
    onAfterChange: ({ duration, easing, elapsed }: GridItemLayoutChange) => {
      const root = rootOf();
      const from = before.current;
      before.current = undefined;
      if (!root || !from) return;
      const [to, isRtl] = placesOf(root);
      const timeline = gsap.timeline({ paused: true });
      for (const part of partsOf(root)) {
        const name = part.dataset.cardPart ?? '';
        const old = from.get(name);
        const now = to.get(name);
        if (!old || !now) continue;
        const dx = isRtl ? now.x - old.x : old.x - now.x;
        timeline.fromTo(
          part,
          {
            // (Its text as large as it was, when it's the same text; other
            // text (e.g. a longer value) only moved: scaled, it'd spill.
            // None (e.g. its switch): only moved, its size its own.)
            scale:
              old.text !== '' && old.text === now.text
                ? old.fontSize / now.fontSize
                : 1,
            transformOrigin: isRtl ? 'right top' : 'left top',
            x: dx,
            y: old.y - now.y,
          },
          {
            clearProps: 'transform,transformOrigin',
            duration: duration / 1000,
            ease: easeOf(easing),
            scale: 1,
            x: 0,
            y: 0,
          },
          0,
        );
      }
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
      timeline.time(0);
      frame = requestAnimationFrame(follow);
    },
    onBeforeChange: () => {
      const root = rootOf();
      if (!root) return;
      // (Where they're drawn now, a move of theirs running or not; that
      // move then let go, so what's measured after is where they're laid
      // out.)
      const [drawn] = placesOf(root);
      before.current = drawn;
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
