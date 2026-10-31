/* eslint-disable unicorn/prefer-ternary */
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  Children,
  ComponentProps,
  createContext,
  CSSProperties,
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
  NavigationPersistentProps,
  NavigationRootProps,
  NavigationStackProps,
  NavigationSwipeAreaProps,
  Role,
  Transition,
} from './props.js';

export type {
  NavigationBackEventDetails,
  NavigationBackProps,
  NavigationPersistentProps,
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
// Popped again while popping (e.g. a back button pressed again), each pop
// runs its own transition: the page on top leaves on its own, on from where
// it is, and the page it revealed starts leaving too (a cascade); pushed
// back mid-transition, the push reverses from where it is.
//
// Pages under the top one stay mounted (their state and scroll positions
// kept), hidden. A page's `Header` moves with its page, its bar too; its
// persistent items (e.g. its back button, see `Persistent`) stay put while
// the other page moving has them too. What stays regardless (e.g. a bar of
// the app's) is in the `Root`, outside its `Stack`.
//
// Also:
// - Each page's bar moves with it, its title too; the back button stays, in a bar of
//   the app's outside the stack (see above), or in each page's bar, a
//   persistent item (see `Persistent`): staying put between pages having
//   one, moving with a page where only it has one.

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
  /** The progress now (also mid-transition), 0 at rest. */
  progress: () => number;
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
      // (Its width as a length: moved by it, persistent items stay put, see
      // `Persistent`.)
      root.style.setProperty(
        '--uikit-navigation-width',
        `${String(root.clientWidth)}px`,
      );
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

    const progress = () => {
      const { current: root } = ref;
      if (!root) return 0;
      return (
        Number.parseFloat(
          getComputedStyle(root).getPropertyValue(
            '--uikit-navigation-progress',
          ),
        ) || 0
      );
    };

    const rest = () => {
      const { current: root } = ref;
      root?.style.removeProperty('transition');
      root?.style.removeProperty('--uikit-navigation-progress');
      root?.style.removeProperty('--uikit-navigation-width');
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
            progress,
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
 * A stack's keys changed (`previous` to `keys`, its tops differing): pushed,
 * popped (also mid-transition, see `Stack`), or anything else (at rest).
 */
const changeKeys = (
  stack: StackContext,
  previous: { keys: string[]; pages: ReactElement[] },
  keys: string[],
  element: HTMLElement | null,
) => {
  const oldTop = previous.keys.at(-1) ?? '';
  const newTop = keys.at(-1) ?? '';
  // Mid-transition (e.g. a back button pressed again): on from where it
  // is, the page on top still leaving (popped further: the new top under
  // it, those between gone) or coming back (pushed again).
  const running = stack.transition;

  if (isPrefix(keys, previous.keys)) {
    // Swiped back: popped already.
    if (stack.swipedRef.current === oldTop) {
      stack.swipedRef.current = undefined;
      stack.rest();
      return;
    }
    if (running?.top === oldTop) {
      // Its push reversed, from where it is.
      stack.setTransition({
        departing: running.departing,
        leaving: previous.pages.at(-1),
        top: oldTop,
        under: newTop,
      });
      stack.animate(stack.progress(), 1, stack.rest);
      return;
    }
    if (running && !keys.includes(running.top)) {
      // Popped further while popping: the page on top leaving on its own
      // (on from where it is, see `Departing`), the one it revealed
      // leaving too, from where it was revealed to, the new top under
      // it (a cascade, each press its own).
      const progress = stack.progress();
      const width = element?.clientWidth ?? 0;
      const direction =
        element && getComputedStyle(element).direction === 'rtl' ? -1 : 1;
      const leavingPage =
        running.leaving ??
        previous.pages.find((page) => String(page.key) === running.top);
      stack.setTransition({
        departing: [
          ...(running.departing ?? []),
          ...(leavingPage
            ? [{ key: running.top, page: leavingPage, progress }]
            : []),
        ],
        from: (1 - progress) * -0.3 * width * direction,
        leaving: previous.pages.at(-1),
        top: oldTop,
        under: newTop,
      });
      stack.animate(0, 1, stack.rest);
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
    const isBack = running?.top === newTop;
    stack.setTransition({ top: newTop, under: oldTop });
    stack.animate(isBack ? stack.progress() : 1, 0, stack.rest);
    return;
  }

  stack.rest();
};

/**
 * Its stack of pages (keyed children, see above), filling its root: pushed,
 * popped, or replaced as the app's keys change.
 */
const Stack = forwardRef<HTMLDivElement, NavigationStackProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
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

      changeKeys(stack, previous, keys, ref.current);
      // (On a change of the stack's keys only, compared above.)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys.join('\n')]);

    const departing = transition?.departing ?? [];

    // Pages still leaving on their own (see above): each on from its
    // progress as it was handed over, to gone (its own progress, over the
    // root's).
    const departedRef = useRef(new Set<string>());
    useLayoutEffect(() => {
      const { current: element } = ref;
      const { current: departed } = departedRef;
      if (!transition) departed.clear();
      if (!element) return;
      for (const { key, progress } of departing) {
        if (departed.has(key)) continue;
        const frame = element.querySelector<HTMLElement>(
          `:scope > [data-navigation-key="${CSS.escape(key)}"]`,
        );
        if (!frame) continue;
        departed.add(key);
        frame.animate(
          [
            { '--uikit-navigation-progress': String(progress) },
            { '--uikit-navigation-progress': '1' },
          ],
          { duration, easing, fill: 'forwards' },
        );
      }
    });

    // In a transition, the persistent items several moving pages have (by
    // their ids, see `Persistent`): shared, staying put (see style.css); the
    // uppermost page's shown, still pressable (e.g. its back button pressed
    // again: further back, see above), its page not inert.
    const [pressable, setPressable] = useState<string | undefined>(undefined);
    useLayoutEffect(() => {
      const { current: element } = ref;
      if (!element || !transition) {
        setPressable(undefined);
        return undefined;
      }
      // The moving pages, uppermost first: those leaving on their own (the
      // earliest above), the top, the one under it.
      const frames = [
        ...(transition.departing ?? []).map(({ key }) => key),
        transition.top,
        transition.under,
      ]
        .map((key) =>
          element.querySelector<HTMLElement>(
            `:scope > [data-navigation-key="${CSS.escape(key)}"]`,
          ),
        )
        .filter((frame) => frame !== null);
      const itemsOf = (frame: HTMLElement) => [
        ...frame.querySelectorAll<HTMLElement>('[data-navigation-persistent]'),
      ];
      const counts = new Map<string | undefined, number>();
      for (const frame of frames) {
        for (const id of new Set(
          itemsOf(frame).map((item) => item.dataset.navigationPersistent),
        )) {
          counts.set(id, (counts.get(id) ?? 0) + 1);
        }
      }
      const shown = new Set<string | undefined>();
      const marked: HTMLElement[] = [];
      let uppermost: string | undefined;
      for (const frame of frames) {
        for (const item of itemsOf(frame)) {
          const id = item.dataset.navigationPersistent;
          if ((counts.get(id) ?? 0) < 2) continue;
          item.dataset.navigationShared = '';
          if (shown.has(id)) {
            item.dataset.navigationSharedHidden = '';
          } else {
            shown.add(id);
            uppermost ??= frame.dataset.navigationKey;
          }
          marked.push(item);
        }
      }
      setPressable(uppermost);
      return () => {
        for (const item of marked) {
          delete item.dataset.navigationShared;
          delete item.dataset.navigationSharedHidden;
        }
      };
    }, [ref, transition]);

    const roleOf = (key: string, index: number, count: number): Role => {
      if (transition) {
        const isLeaving = departing.some((entry) => entry.key === key);
        if (isLeaving || key === transition.top) return 'top';
        if (key === transition.under) return 'under';
        return 'hidden';
      }
      return index === count - 1 ? 'current' : 'hidden';
    };

    const leaving =
      transition?.leaving && !keys.includes(transition.top)
        ? [transition.leaving]
        : [];
    const shown = [
      ...pages,
      ...leaving,
      ...departing
        .filter(({ key }) => !keys.includes(key) && key !== transition?.top)
        .map(({ page }) => page),
    ];

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
          const isInert = role !== 'current' && key !== pressable;
          const departingIndex = departing.findIndex(
            (entry) => entry.key === key,
          );
          return (
            // A page's frame. In a transition (see `Root`), the upper page
            // (`top`) and the one under it (`under`) move by the progress (0:
            // the upper shown), their headers with them. At rest, none of it
            // applies (no transforms, which would isolate glass' blending).
            <div
              key={key}
              aria-hidden={isInert ? true : undefined}
              className="uikit-navigation-frame"
              data-navigation-departing={departingIndex === -1 ? undefined : ''}
              data-navigation-key={key}
              data-navigation-part="page"
              data-navigation-role={role}
              inert={isInert}
              style={
                {
                  // Leaving on their own: above the top page, the earliest
                  // uppermost; the top page from where it was (see `from`).
                  zIndex:
                    departingIndex === -1
                      ? undefined
                      : 2 + departing.length - departingIndex,
                  '--uikit-navigation-from':
                    key === transition?.top && transition.from !== undefined
                      ? `${String(transition.from)}px`
                      : undefined,
                } as CSSProperties
              }
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
  ({ disabled, onClick, persistentId = 'back', render, ...props }, ref) => {
    const { back } = useContext(NavigationContext);

    return useRender({
      defaultTagName: 'button',
      props: {
        'data-navigation-part': 'back',
        'data-navigation-persistent': persistentId || undefined,
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

/**
 * An item of a page's bar (e.g. a toolbar button, `render`) that stays put
 * through a transition while both pages moving have one of its id
 * (`persistentId`), the upper page's shown; otherwise moving with its page.
 * E.g. a back button (`Back` is one, by default): sliding in with the first
 * page to have one, staying put on to deeper pages and back, sliding out
 * with the first again.
 */
const Persistent = forwardRef<HTMLDivElement, NavigationPersistentProps>(
  ({ persistentId, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-navigation-part': 'persistent',
        'data-navigation-persistent': persistentId,
        ...props,
      },
      ref,
      render,
    }),
);

export const Navigation = {
  Root,
  Stack,
  SwipeArea,
  Back,
  Persistent,
};
