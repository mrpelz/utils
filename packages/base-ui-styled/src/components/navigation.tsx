import { styled } from 'goober';
import {
  Children,
  ComponentProps,
  forwardRef,
  isValidElement,
  PointerEvent,
  ReactElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useForwardedRef } from './utils.js';

// Navigation (UIKit `UINavigationController`, after Framework7's views and
// `router` transitions, without its routing): a stack of pages, the app's
// (no router of its own). The app renders its stack's pages as children,
// each with a key; the navigation transitions between them:
//
// - a page added on top (keys extended): pushed, sliding in from the
//   trailing edge over the page under it, which moves on a little and dims;
// - the top page removed (keys cut back, by one or more): popped, the
//   reverse;
// - anything else (e.g. another stack, a sibling's): shown at once, no
//   transition.
//
// Swiping from the top page's leading edge (touch, or a mouse) pops it
// interactively: released past half the width (or flung), `onBack` is
// called for the app to pop its stack (the transition is done by then);
// otherwise it settles back.
//
// Pages under the top one stay mounted (their state and scroll positions
// kept), hidden. A page's `Header` blends over: its bar stays in place
// while its content fades (the large title moves with the page).
//
// Deviations:
// - The bar's title cross-fades in place (iOS: it moves to the back
//   button's place, and the back button's label to the title's).

const part = 'data-navigation-part';

/** Pushing and popping (iOS: about 350ms, an ease-out curve). */
const duration = 350;
const easing = 'cubic-bezier(0.2, 0.9, 0.3, 1)';
/** Where a swipe back starts: within this far of the leading edge. */
const edgeWidth = 20;
/**
 * A swipe back released this quick (px/ms, over its last 100ms) pops,
 * however far.
 */
const flingVelocity = 0.3;
const flingWindow = 100;
/** How far the page under the top one is moved back (of its width). */
const underOffset = 30;

type Role = 'current' | 'hidden' | 'top' | 'under';

type Transition = {
  /** A popped page, shown while it leaves. */
  leaving?: ReactElement;
  top: string;
  under: string;
};

const StyledRoot = styled('div', forwardRef)`
  --styled-navigation-direction: 1;

  position: relative;
  overflow: hidden;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  isolation: isolate;

  &:dir(rtl) {
    --styled-navigation-direction: -1;
  }
`;

// A page's frame. In a transition (see `Root`), the upper page (`top`) and
// the one under it (`under`) move by the progress (0: the upper shown),
// their headers' bars held in place (`--styled-navigation-counter`) while
// their content fades (`--styled-navigation-shown`, see `Header`). At rest,
// none of it applies (no transforms, which would isolate glass' blending).
const Frame = styled('div', forwardRef)`
  position: absolute;
  display: flex;
  flex-direction: column;
  inset: 0;

  & > * {
    min-height: 0;
    flex: 1 1 auto;
  }

  &[data-navigation-role='hidden'] {
    visibility: hidden;
  }

  &[data-navigation-role='top'] {
    --styled-navigation-x: calc(
      var(--styled-navigation-progress) * 100% *
        var(--styled-navigation-direction)
    );
    --styled-navigation-shown: calc(1 - var(--styled-navigation-progress));

    z-index: 1;
    box-shadow: 0 0 24px rgb(0 0 0 / calc(16% * var(--styled-navigation-shown)));
  }

  &[data-navigation-role='under'] {
    --styled-navigation-x: calc(
      (1 - var(--styled-navigation-progress)) * -${underOffset}% *
        var(--styled-navigation-direction)
    );
    --styled-navigation-shown: var(--styled-navigation-progress);

    &::after {
      position: absolute;
      background-color: rgb(
        0 0 0 / calc(10% * (1 - var(--styled-navigation-progress)))
      );
      content: '';
      inset: 0;
      pointer-events: none;
    }
  }

  &[data-navigation-role='top'],
  &[data-navigation-role='under'] {
    --styled-navigation-counter: calc(-1 * var(--styled-navigation-x)) 0;
    --styled-navigation-filter: opacity(var(--styled-navigation-shown));

    pointer-events: none;
    translate: var(--styled-navigation-x) 0;
  }
`;

// Where a swipe back starts: the leading edge, over the pages.
const Edge = styled('div', forwardRef)`
  position: absolute;
  z-index: 2;
  width: ${edgeWidth}px;
  inset-block: 0;
  inset-inline-start: 0;
  touch-action: none;
`;

export type NavigationRootProps = ComponentProps<'div'> & {
  /**
   * Called when the top page is swiped back (popped): the app pops its
   * stack. Without it, pages can't be swiped back.
   */
  onBack?: () => void;
};

const isPrefix = (shorter: string[], longer: string[]) =>
  shorter.length < longer.length &&
  shorter.every((key, index) => longer[index] === key);

const sameKeys = (a: string[], b: string[]) =>
  a.length === b.length && a.every((key, index) => b[index] === key);

/** A navigation: the app's stack of pages (keyed children, see above). */
const Root = forwardRef<HTMLDivElement, NavigationRootProps>(
  ({ children, onBack, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const pages = Children.toArray(children).filter(
      (child): child is ReactElement => isValidElement(child),
    );
    const keys = pages.map((page) => String(page.key));
    const previousRef = useRef({ keys, pages });
    const [transition, setTransition] = useState<Transition | null>(null);
    // The page a completed swipe popped (the app pops it: no transition).
    const swipedRef = useRef<string | undefined>(undefined);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );
    const swipeRef = useRef<
      | {
          /** The latest moves (time, progress), for the release's speed. */
          moves: [number, number][];
          pointerId: number;
          progress: number;
          width: number;
          x: number;
        }
      | undefined
    >(undefined);

    // The progress (and its transition), on the root.
    const setProgress = (progress: number, animate: boolean) => {
      const { current: root } = ref;
      if (!root) return;
      root.style.transition = animate
        ? `--styled-navigation-progress ${String(duration)}ms ${easing}`
        : 'none';
      root.style.setProperty('--styled-navigation-progress', String(progress));
    };

    // Animates the progress, then calls `done` (once it's there).
    const animate = (from: number, to: number, done: () => void) => {
      clearTimeout(timerRef.current);
      setProgress(from, false);
      ref.current?.getBoundingClientRect();
      requestAnimationFrame(() => {
        setProgress(to, true);
        timerRef.current = setTimeout(done, duration + 50);
      });
    };

    const rest = () => {
      const { current: root } = ref;
      root?.style.removeProperty('transition');
      root?.style.removeProperty('--styled-navigation-progress');
      setTransition(null);
    };

    // Pushed, popped, or replaced (see above).
    useLayoutEffect(() => {
      const { current: previous } = previousRef;
      previousRef.current = { keys, pages };
      if (sameKeys(previous.keys, keys)) return;

      const oldTop = previous.keys.at(-1);
      const newTop = keys.at(-1);
      if (oldTop === undefined || newTop === undefined || oldTop === newTop) {
        rest();
        return;
      }

      if (isPrefix(keys, previous.keys)) {
        // Swiped back: popped already.
        if (swipedRef.current === oldTop) {
          swipedRef.current = undefined;
          rest();
          return;
        }
        setTransition({
          leaving: previous.pages.at(-1),
          top: oldTop,
          under: newTop,
        });
        animate(0, 1, rest);
        return;
      }

      if (isPrefix(previous.keys, keys)) {
        setTransition({ top: newTop, under: oldTop });
        animate(1, 0, rest);
        return;
      }

      rest();
      // (On a change of the stack's keys only, compared above.)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys.join('\n')]);

    useLayoutEffect(() => () => clearTimeout(timerRef.current), []);

    const roleOf = (key: string, index: number, count: number): Role => {
      if (transition) {
        if (key === transition.top) return 'top';
        if (key === transition.under) return 'under';
        return 'hidden';
      }
      return index === count - 1 ? 'current' : 'hidden';
    };

    const leaving =
      transition?.leaving && !keys.includes(transition.top)
        ? [transition.leaving]
        : [];
    const shown = [...pages, ...leaving];

    const canSwipe = Boolean(onBack) && keys.length > 1 && !transition;

    const endSwipe = (event: PointerEvent<HTMLDivElement>) => {
      const { current: swipe } = swipeRef;
      if (swipe?.pointerId !== event.pointerId) return;
      swipeRef.current = undefined;

      // Its speed as released: over the last moves (held still: none).
      const now = performance.now();
      const recent = swipe.moves.find(([time]) => now - time < flingWindow);
      const first = recent;
      const velocity = first
        ? ((swipe.progress - first[1]) * swipe.width) /
          Math.max(now - first[0], 1)
        : 0;
      const top = keys.at(-1);
      if (
        event.type !== 'pointercancel' &&
        (swipe.progress > 0.5 || velocity > flingVelocity)
      ) {
        animate(swipe.progress, 1, () => {
          swipedRef.current = top;
          onBack?.();
          // Not popped by the app after all: back.
          timerRef.current = setTimeout(() => {
            if (swipedRef.current !== top) return;
            swipedRef.current = undefined;
            animate(1, 0, rest);
          }, 1000);
        });
        return;
      }
      animate(swipe.progress, 0, rest);
    };

    return (
      <StyledRoot
        ref={ref}
        {...{ [part]: 'root' }}
        data-navigation-moving={transition ? '' : undefined}
        {...props}
      >
        {shown.map((page, index) => {
          const key = String(page.key);
          const role = roleOf(key, index, shown.length);
          return (
            <Frame
              key={key}
              {...{ [part]: 'page' }}
              aria-hidden={role === 'current' ? undefined : true}
              data-navigation-role={role}
              inert={role !== 'current'}
            >
              {page}
            </Frame>
          );
        })}
        {canSwipe || swipeRef.current ? (
          <Edge
            {...{ [part]: 'edge' }}
            onLostPointerCapture={endSwipe}
            onPointerCancel={endSwipe}
            onPointerUp={endSwipe}
            onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
              const { current: root } = ref;
              const top = keys.at(-1);
              const under = keys.at(-2);
              if (!root || !top || !under || event.button !== 0) return;
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              swipeRef.current = {
                pointerId: event.pointerId,
                moves: [[performance.now(), 0]],
                progress: 0,
                width: root.clientWidth,
                x: event.clientX,
              };
              setProgress(0, false);
              setTransition({ top, under });
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              const { current: swipe } = swipeRef;
              const { current: root } = ref;
              if (swipe?.pointerId !== event.pointerId || !root) return;
              const direction =
                getComputedStyle(root).direction === 'rtl' ? -1 : 1;
              const moved = (event.clientX - swipe.x) * direction;
              swipe.progress = Math.min(Math.max(moved / swipe.width, 0), 1);
              swipe.moves = [
                ...swipe.moves.slice(-8),
                [performance.now(), swipe.progress],
              ];
              setProgress(swipe.progress, false);
            }}
          />
        ) : null}
      </StyledRoot>
    );
  },
);

export const Navigation = {
  Root,
};
