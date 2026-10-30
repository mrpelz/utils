/* eslint-disable unicorn/prefer-ternary */
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  Children,
  ComponentProps,
  createContext,
  forwardRef,
  isValidElement,
  MouseEvent,
  PointerEvent,
  ReactElement,
  RefObject,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import type {
  NavigationBackEventDetails,
  NavigationBackProps,
  NavigationRootProps,
  NavigationStackProps,
  NavigationSwipeAreaProps,
  Role,
  Transition,
} from './props.js';

export type {
  NavigationBackEventDetails,
  NavigationBackProps,
  NavigationRootProps,
  NavigationStackProps,
  NavigationSwipeAreaProps,
} from './props.js';

// Navigation (after Framework7's views and
// `router` transitions, without its routing): a stack of pages, the app's
// (no router of its own). The app renders its stack's pages as its
// `Stack`'s children, each with a key; the navigation transitions between
// them:
//
// - a page added on top (keys extended): pushed, sliding in from the
//   trailing edge over the page under it, which moves on a little and dims;
// - the top page removed (keys cut back, by one or more): popped, the
//   reverse;
// - anything else (e.g. another stack, a sibling's): shown at once, no
//   transition.
//
// Swiping from the top page's leading edge (its `SwipeArea`: touch, or a
// mouse) pops it interactively: released past half the width (or flung),
// `onBack` is called for the app to pop its stack (the transition is done
// by then); otherwise it settles back. A `Back` (e.g. a bar's back button)
// calls `onBack` too, the app's pop transitioning as any.
//
// Pages under the top one stay mounted (their state and scroll positions
// kept), hidden. A page's `Header` moves with its page, its bar too; what
// stays (e.g. the back button: a toolbar in a `Viewport.BlockStart`) is in
// the `Root`, outside its `Stack`.
//
// Also:
// - Each page's bar moves with it, its title too; the back button stays, in a bar of
//   the app's outside the stack (see above).

/** Pushing and popping (350ms, an ease-out curve). */
const duration = 350;
const easing = 'cubic-bezier(0.2, 0.9, 0.3, 1)';
/**
 * A swipe back released this quick (px/ms, over its last 100ms) pops,
 * however far.
 */
const flingVelocity = 0.3;
const flingWindow = 100;

const isPrefix = (shorter: string[], longer: string[]) =>
  shorter.length < longer.length &&
  shorter.every((key, index) => longer[index] === key);

const sameKeys = (a: string[], b: string[]) =>
  a.length === b.length && a.every((key, index) => b[index] === key);

type GoBack = (eventDetails: NavigationBackEventDetails) => void;

/** A swipe back's handlers (see `SwipeArea`), while one can start or goes on. */
type SwipeHandlers = Pick<
  ComponentProps<'div'>,
  | 'onLostPointerCapture'
  | 'onPointerCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
>;

/**
 * Its stack's transitions (see `Stack`): its keys reported, a transition
 * set, animated, and done (at rest); the page a swipe popped.
 */
type StackContext = {
  animate: (from: number, to: number, done: () => void) => void;
  rest: () => void;
  setKeys: (keys: string[]) => void;
  setTransition: (transition: Transition) => void;
  swipedRef: RefObject<string | undefined>;
  transition: Transition | null;
};

/**
 * Its root, for its `Back`s (going back: the app's `onBack`, if it can),
 * its `SwipeArea`s (swiping back, if it can), and its `Stack`.
 */
const NavigationContext = createContext<{
  back?: GoBack;
  stack?: StackContext;
  swipe?: SwipeHandlers;
}>({});

/**
 * A navigation: its stack's state (see above), its parts in it (its
 * `Stack`, a `SwipeArea`, a bar that stays).
 */
const Root = forwardRef<HTMLDivElement, NavigationRootProps>(
  ({ className, onBack, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    // Its stack's keys (reported by its `Stack`).
    const [keys, setKeys] = useState<string[]>([]);
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
    const setProgress = (progress: number, isAnimated: boolean) => {
      const { current: root } = ref;
      if (!root) return;
      root.style.transition = isAnimated
        ? `--uikit-navigation-progress ${String(duration)}ms ${easing}`
        : 'none';
      root.style.setProperty('--uikit-navigation-progress', String(progress));
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
      root?.style.removeProperty('--uikit-navigation-progress');
      setTransition(null);
    };

    useLayoutEffect(() => () => clearTimeout(timerRef.current), []);

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
          onBack?.({ event, reason: 'swipe' });
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

    const back =
      onBack && keys.length > 1
        ? (eventDetails: NavigationBackEventDetails) => onBack(eventDetails)
        : undefined;

    // Where a swipe back starts (see `SwipeArea`): while one can, or goes on.
    const swipeHandlers: SwipeHandlers | undefined =
      canSwipe || swipeRef.current
        ? {
            onLostPointerCapture: endSwipe,
            onPointerCancel: endSwipe,
            onPointerUp: endSwipe,
            onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
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
            },
            onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
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
            },
          }
        : undefined;

    return (
      <NavigationContext.Provider
        value={{
          back,
          stack: {
            animate,
            rest,
            setKeys,
            setTransition,
            swipedRef,
            transition,
          },
          swipe: swipeHandlers,
        }}
      >
        <div
          ref={ref}
          data-navigation-moving={transition ? '' : undefined}
          data-navigation-part="root"
          {...props}
          className={cn('uikit-navigation-root', className)}
        />
      </NavigationContext.Provider>
    );
  },
);

/**
 * Its stack of pages (keyed children, see above), filling its root: pushed,
 * popped, or replaced as the app's keys change.
 */
const Stack = forwardRef<HTMLDivElement, NavigationStackProps>(
  ({ className, children, ...props }, ref) => {
    const { stack } = useContext(NavigationContext);
    const pages = Children.toArray(children).filter(
      (child): child is ReactElement => isValidElement(child),
    );
    const keys = pages.map((page) => String(page.key));
    const previousRef = useRef({ keys, pages });
    const transition = stack?.transition ?? null;

    // Pushed, popped, or replaced (see above).
    useLayoutEffect(() => {
      stack?.setKeys(keys);
      const { current: previous } = previousRef;
      previousRef.current = { keys, pages };
      if (!stack || sameKeys(previous.keys, keys)) return;

      const oldTop = previous.keys.at(-1);
      const newTop = keys.at(-1);
      if (oldTop === undefined || newTop === undefined || oldTop === newTop) {
        stack.rest();
        return;
      }

      if (isPrefix(keys, previous.keys)) {
        // Swiped back: popped already.
        if (stack.swipedRef.current === oldTop) {
          stack.swipedRef.current = undefined;
          stack.rest();
          return;
        }
        stack.setTransition({
          leaving: previous.pages.at(-1),
          top: oldTop,
          under: newTop,
        });
        stack.animate(0, 1, stack.rest);
        return;
      }

      if (isPrefix(previous.keys, keys)) {
        stack.setTransition({ top: newTop, under: oldTop });
        stack.animate(1, 0, stack.rest);
        return;
      }

      stack.rest();
      // (On a change of the stack's keys only, compared above.)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys.join('\n')]);

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

    return (
      <div
        ref={ref}
        data-navigation-part="stack"
        {...props}
        className={cn('uikit-navigation-stack', className)}
      >
        {shown.map((page, index) => {
          const key = String(page.key);
          const role = roleOf(key, index, shown.length);
          return (
            // A page's frame. In a transition (see `Root`), the upper page
            // (`top`) and the one under it (`under`) move by the progress (0:
            // the upper shown), their headers with them. At rest, none of it
            // applies (no transforms, which would isolate glass' blending).
            <div
              key={key}
              aria-hidden={role === 'current' ? undefined : true}
              className="uikit-navigation-frame"
              data-navigation-part="page"
              data-navigation-role={role}
              inert={role !== 'current'}
            >
              {page}
            </div>
          );
        })}
      </div>
    );
  },
);

/**
 * Where a swipe back starts (touch, or a mouse): a strip at the leading
 * edge (`width`, 20px), over the pages, while there's a page to go back to
 * (and an `onBack`); in its `Root`. Without one, pages aren't swiped back.
 * Its swipes are its own: nothing scrolls meanwhile (`touch-action`), and
 * a sheet around it isn't swiped along (Base UI's swipe ignore).
 */
const SwipeArea = forwardRef<HTMLDivElement, NavigationSwipeAreaProps>(
  ({ className, style, width = 20, ...props }, ref) => {
    const { swipe } = useContext(NavigationContext);
    if (!swipe) return null;

    return (
      <div
        ref={ref}
        data-base-ui-swipe-ignore=""
        data-navigation-part="swipe-area"
        style={withStyle(
          { '--uikit-navigation-swipe-area-width': `${String(width)}px` },
          style,
        )}
        {...props}
        {...swipe}
        className={cn('uikit-navigation-swipe-area', className)}
      />
    );
  },
);

/**
 * A button taking its navigation back (its `onBack`, the app popping its
 * stack), e.g. a bar's back button (`render`: a `Toolbar.Button`); on the
 * root page (nothing to go back to), disabled.
 */
const Back = forwardRef<HTMLButtonElement, NavigationBackProps>(
  ({ disabled, onClick, render, ...props }, ref) => {
    const { back } = useContext(NavigationContext);

    return useRender({
      defaultTagName: 'button',
      props: {
        'data-navigation-part': 'back',
        disabled: disabled ?? !back,
        type: 'button',
        ...props,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          back?.({ event, reason: 'back-press' });
        },
      },
      ref,
      render,
    });
  },
);

export const Navigation = {
  Root,
  Stack,
  SwipeArea,
  Back,
};
