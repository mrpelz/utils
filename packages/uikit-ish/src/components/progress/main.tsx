import '../tooltip/style.css';
import '../glass/style.css';
import './style.css';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import {
  ComponentProps,
  createContext,
  CSSProperties,
  forwardRef,
  RefObject,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import type {
  ActivityIndicatorDisplay,
  ActivityIndicatorMovement,
  ActivityIndicatorProps,
  ProgressLabelProps,
  ProgressRootProps,
  ProgressValueProps,
} from './props.js';

export type {
  ActivityIndicatorMovement,
  ActivityIndicatorProps,
  ActivityIndicatorDisplay,
  ProgressLabelProps,
  ProgressPlacement,
  ProgressRootProps,
  ProgressValueProps,
} from './props.js';

// Progress indicators:
// - Progress bar: a track 6px high, rounded, in the system fill, filled from
//   its start in the tint (system blue); at 0% a 6px dot, linear between.
// - Activity indicator: 8 spokes around
//   its center (Regular: 30px, spokes 4×10px; Small: 22px, 3×7px),
//   rounded, in the secondary label color, at 100% at its top, then
//   counterclockwise at 87%, 75%, 63%, 51%, 39%, 27% and 15%, spinning
//   clockwise a spoke at a time (once a second; also smoothly, or its
//   spokes in place, fading in turn: `movement`); optionally with a Body
//   label in the secondary label color, 8px after it (Small: 4px).
//
// Also:
// - The bar fills its container, at least 280px long (as a slider's
//   control).
// - The bar's label and value (Base UI's), in Subheadline,
//   in the secondary label color: above its track (by default, at its start
//   and end), below it, before or after it (`placement`); the value also in
//   a tooltip (see `Tooltip`) centered on the fill's end: always, or while
//   the bar is hovered or focused by keyboard (it's focusable then).
// - Indeterminate (Base UI's `value` null), a bar's fill slides along its
//   track (or use an `ActivityIndicator`).
// - Stopping, an activity indicator rests at once, freezes where it is, or
//   finishes its turn first; or hides, once finished or at once
//   (`display`).
// - Spinning activity indicators (without their own progress or speed), and
//   indeterminate bars' fills, all in sync: at once alike, whenever each
//   started (`synchronized`).

/**
 * Synchronized (see `synchronized`): its animations (CSS's) on the page's
 * clock (each started at its origin), not each on its own (started as
 * applied), so all show alike at once; again as they restart (`restart`
 * changing).
 */
const useSynchronized = (
  element: RefObject<HTMLElement | null>,
  isSynchronized: boolean,
  restart: unknown,
) => {
  useLayoutEffect(() => {
    if (!isSynchronized) return;
    for (const animation of element.current?.getAnimations({ subtree: true }) ??
      []) {
      if (animation instanceof CSSAnimation) animation.startTime = 0;
    }
  }, [element, isSynchronized, restart]);
};

// Registers a momentary tooltip (see `Value`), which makes the bar
// focusable.
const RootContext = createContext<((isMomentary: boolean) => void) | undefined>(
  undefined,
);

/** A progress bar, its parts Base UI's. */
const Root = forwardRef<HTMLDivElement, ProgressRootProps>(
  (
    { className, style, synchronized = true, tabIndex, tint, value, ...props },
    forwardedRef,
  ) => {
    const [isMomentary, setIsMomentary] = useState(false);
    const ref = useForwardedRef(forwardedRef);
    // Indeterminate, its fill sliding (see `synchronized`).
    const isIndeterminate = value === null;
    useSynchronized(ref, synchronized && isIndeterminate, isIndeterminate);

    return (
      <RootContext.Provider value={setIsMomentary}>
        <BaseProgress.Root
          ref={ref}
          style={withStyle({ '--uikit-progress-tint': tint }, style)}
          tabIndex={tabIndex ?? (isMomentary ? 0 : undefined)}
          value={value}
          {...props}
          className={cn('uikit-progress-root', className)}
          data-progress-part="root"
        />
      </RootContext.Provider>
    );
  },
);

const Track = forwardRef<HTMLDivElement, Omit<BaseProgress.Track.Props, 'ref'>>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Track
      ref={ref}
      data-progress-part="track"
      {...props}
      className={cn('uikit-progress-track', className)}
    />
  ),
);

const Indicator = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseProgress.Indicator>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseProgress.Indicator
    ref={ref}
    className={cn('uikit-progress-indicator', className)}
    data-progress-part="indicator"
    {...props}
  />
));

const Label = forwardRef<HTMLSpanElement, ProgressLabelProps>(
  ({ className, placement = 'block-start', ...props }, ref) => (
    <BaseProgress.Label
      ref={ref}
      data-progress-placement={placement}
      {...props}
      className={cn('uikit-progress-label', className)}
      data-progress-part="label"
    />
  ),
);

const Value = forwardRef<HTMLSpanElement, ProgressValueProps>(
  ({ className, placement = 'block-start', ...props }, ref) => {
    const setMomentary = useContext(RootContext);
    const isMomentary = placement === 'momentary-tooltip';
    useLayoutEffect(() => {
      if (!isMomentary) return undefined;
      setMomentary?.(true);
      return () => setMomentary?.(false);
    }, [isMomentary, setMomentary]);

    return (
      <BaseProgress.Value
        ref={ref}
        data-progress-part="value"
        data-progress-placement={placement}
        className={cn(
          'uikit-progress-value',
          placement === 'tooltip' || isMomentary
            ? cn('uikit-tooltip-surface uikit-glass-medium', className)
            : className,
        )}
        {...props}
      />
    );
  },
);

export const Progress = {
  ...BaseProgress,
  Root,
  Track,
  Indicator,
  Label,
  Value,
};

// The spokes' opacities, clockwise from the top.
const spokes = [1, 0.15, 0.27, 0.39, 0.51, 0.63, 0.75, 0.87];

// A spoke's phase: a share of a turn behind the brightest.
const phaseOf = (index: number) =>
  ((spokes.length - index) % spokes.length) / spokes.length;

// A share of a turn (0 to 1), of any number of turns.
const turnOf = (turns: number) => ((turns % 1) + 1) % 1;

/**
 * A spoke's opacity at rest, `progress` turns along (see `progress`):
 * rotating, as it is (the spinner turned); fading, as far into its fade
 * (1 to 0.15) as its phase; stepped, a spoke at a time.
 */
const restingOpacity = (
  index: number,
  movement: ActivityIndicatorMovement,
  progress: number,
) => {
  if (movement === 'rotate') return spokes[index];
  const into = turnOf(phaseOf(index) + progress);
  const fade =
    movement === 'fade'
      ? into
      : Math.floor(into * spokes.length + 1e-9) / (spokes.length - 1);
  return 1 - 0.85 * fade;
};

/**
 * How a spinner rests while stopped (see `display`): none while it spins
 * (or finishes its turn); at rest (its animations gone), or frozen.
 */
const useStopped = (
  spinner: RefObject<HTMLElement | null>,
  display: ActivityIndicatorDisplay,
  movement: ActivityIndicatorMovement,
): 'freeze' | 'reset' | undefined => {
  const isAnimating = display === 'animate';
  const isFinishing = display === 'finish' || display === 'finish-and-hide';
  const isHiding = display === 'finish-and-hide';
  // Whether its last turn is done (stopped from the start: at rest).
  const [isFinished, setIsFinished] = useState(!isAnimating);
  const [wasAnimating, setWasAnimating] = useState(isAnimating);
  if (isAnimating !== wasAnimating) {
    setWasAnimating(isAnimating);
    setIsFinished(false);
  }

  useLayoutEffect(() => {
    if (!isFinishing) return undefined;

    // Finishing: the turn's animation (rotating, the spinner's; otherwise
    // the top spoke's) ends with its current iteration, at the top; then at
    // rest.
    const element =
      movement === 'rotate'
        ? spinner.current
        : spinner.current?.firstElementChild;
    const [turn] = element?.getAnimations() ?? [];
    const iteration = turn?.effect?.getComputedTiming().currentIteration;
    if (typeof iteration === 'number') {
      turn?.effect?.updateTiming({ iterations: iteration + 1 });
    }

    let isCancelled = false;
    (turn?.finished ?? Promise.resolve())
      .then(() => {
        if (isCancelled) return;
        setIsFinished(true);
        // Hiding: turning on as it fades out (see `ActivityIndicator`).
        if (isHiding) turn?.effect?.updateTiming({ iterations: Infinity });
      })
      .catch(() => undefined);

    return () => {
      isCancelled = true;
      turn?.effect?.updateTiming({ iterations: Infinity });
    };
  }, [isFinishing, isHiding, movement, spinner]);

  if (isAnimating) return undefined;
  if (isFinishing) return isFinished ? 'reset' : undefined;
  return display === 'freeze' ? 'freeze' : 'reset';
};

/**
 * An activity indicator: spinning spokes, for progress of unknown length (an
 * indeterminate Base UI `Progress.Root`); optionally labeled.
 */
export const ActivityIndicator = forwardRef<
  HTMLDivElement,
  ActivityIndicatorProps
>(
  (
    {
      className,
      children,
      color,
      display = 'animate',
      duration,
      movement = 'stepped',
      progress: setProgress,
      size = 'regular',
      style,
      synchronized = true,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const progress = setProgress ?? 0;
    const spinner = useRef<HTMLSpanElement>(null);
    const stopped = useStopped(spinner, display, movement);
    // Spinning, from where it was then (later progress not restarting it).
    const [from, setFrom] = useState(progress);
    const [wasDisplay, setWasDisplay] = useState(display);
    if (display !== wasDisplay) {
      setWasDisplay(display);
      if (display === 'animate') setFrom(progress);
    }
    // Hidden: at once, or once its turn's finished (see `display`); spinning
    // on meanwhile (e.g. fading out, see style.css), not at rest.
    const isHidden =
      display === 'none' ||
      (display === 'finish-and-hide' && stopped === 'reset');
    const shown = isHidden ? undefined : stopped;
    const isAtRest = shown === 'reset';
    // (Not with its own progress or speed: see `synchronized`.)
    useSynchronized(
      ref,
      synchronized && setProgress === undefined && duration === undefined,
      `${display} ${movement} ${String(shown)}`,
    );

    return (
      <BaseProgress.Root
        ref={ref}
        data-movement={movement}
        data-size={size}
        data-stopped={shown}
        hidden={isHidden || undefined}
        value={null}
        style={withStyle(
          {
            '--uikit-progress-activity-color': color,
            '--uikit-progress-activity-duration':
              duration === undefined ? undefined : `${String(duration)}s`,
            '--uikit-progress-activity-from': String(turnOf(from)),
          },
          style,
        )}
        {...props}
        className={cn('uikit-progress-activity-indicator', className)}
        data-progress-part="activity-indicator"
      >
        <span
          ref={spinner}
          aria-hidden="true"
          className="uikit-progress-spinner"
          data-progress-part="spinner"
          style={
            isAtRest && movement === 'rotate'
              ? { rotate: `${String(progress)}turn` }
              : undefined
          }
        >
          {spokes.map((_, index) => (
            <span
              key={index}
              style={
                {
                  '--uikit-progress-activity-phase': String(phaseOf(index)),
                  opacity: restingOpacity(
                    index,
                    movement,
                    isAtRest ? progress : 0,
                  ),
                  rotate: `${String(index * 45)}deg`,
                } as CSSProperties
              }
            />
          ))}
        </span>
        {children === undefined ? null : (
          <BaseProgress.Label>{children}</BaseProgress.Label>
        )}
      </BaseProgress.Root>
    );
  },
);
