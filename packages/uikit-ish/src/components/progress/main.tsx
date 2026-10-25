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

import { cn, withStyle } from '../utils/main.js';
import type {
  ActivityIndicatorMovement,
  ActivityIndicatorProps,
  ActivityIndicatorStopBehavior,
  ProgressLabelProps,
  ProgressRootProps,
  ProgressValueProps,
} from './props.js';

export type {
  ActivityIndicatorMovement,
  ActivityIndicatorProps,
  ActivityIndicatorStopBehavior,
  ProgressLabelProps,
  ProgressPlacement,
  ProgressRootProps,
  ProgressValueProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Progress Indicators”):
// - Progress bar (UIKit `UIProgressView`): a track 6px high, rounded, in
//   the system fill, filled from its start in the tint (system blue); at 0%
//   a 6px dot (Figma's fills between are hand-placed, near linear: linear).
// - Progress indicator (UIKit `UIActivityIndicatorView`): 8 spokes around
//   its center (Regular: 30px, spokes 4×10px; Small: 22px, 3×7px),
//   rounded, in the secondary label color, at 100% at its top, then
//   counterclockwise at 87%, 75%, 63%, 51%, 39%, 27% and 15%, spinning
//   clockwise a spoke at a time (once a second; also smoothly, or its
//   spokes in place, fading in turn: `movement`); optionally with a Body
//   label in the secondary label color, 8px after it (Small: 4px).
//
// Deviations:
// - The bar fills its container, at least 280px long (as a slider's
//   control; Figma: 370px in a 402px frame).
// - The bar's label and value (Base UI's; Figma has none), in Subheadline,
//   in the secondary label color: above its track (by default, at its start
//   and end), below it, before or after it (`placement`); the value also in
//   a tooltip (see `Tooltip`) centered on the fill's end: always, or while
//   the bar is hovered or focused by keyboard (it's focusable then).
// - Indeterminate (Base UI's `value` null), a bar's fill slides along its
//   track (UIKit has none: use an `ActivityIndicator`).
// - Stopping, an activity indicator rests at once (UIKit's), freezes where
//   it is, or finishes its turn first (`stopBehavior`).

// Registers a momentary tooltip (see `Value`), which makes the bar
// focusable.
const RootContext = createContext<((isMomentary: boolean) => void) | undefined>(
  undefined,
);

/** A progress bar (UIKit `UIProgressView`), its parts Base UI's. */
const Root = forwardRef<HTMLDivElement, ProgressRootProps>(
  ({ className, style, tabIndex, tint, ...props }, ref) => {
    const [isMomentary, setIsMomentary] = useState(false);

    return (
      <RootContext.Provider value={setIsMomentary}>
        <BaseProgress.Root
          ref={ref}
          style={withStyle({ '--uikit-progress-tint': tint }, style)}
          tabIndex={tabIndex ?? (isMomentary ? 0 : undefined)}
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

/**
 * How a spinner rests while stopped (see `stopBehavior`): none while it
 * spins (or finishes its turn); at rest (its animations gone), or frozen.
 */
const useStopped = (
  spinner: RefObject<HTMLElement | null>,
  isAnimating: boolean,
  movement: ActivityIndicatorMovement,
  stopBehavior: ActivityIndicatorStopBehavior,
): 'freeze' | 'reset' | undefined => {
  // Whether its last turn is done (stopped from the start: at rest).
  const [isFinished, setIsFinished] = useState(!isAnimating);
  const [wasAnimating, setWasAnimating] = useState(isAnimating);
  if (isAnimating !== wasAnimating) {
    setWasAnimating(isAnimating);
    setIsFinished(false);
  }

  useLayoutEffect(() => {
    if (isAnimating || stopBehavior !== 'finish') return undefined;

    // Finishing: the turn's animation (the spinner's; fading, the top
    // spoke's) ends with its current iteration, at the top; then at rest.
    const element =
      movement === 'fade'
        ? spinner.current?.firstElementChild
        : spinner.current;
    const [turn] = element?.getAnimations() ?? [];
    const iteration = turn?.effect?.getComputedTiming().currentIteration;
    if (typeof iteration === 'number') {
      turn?.effect?.updateTiming({ iterations: iteration + 1 });
    }

    let isCancelled = false;
    (turn?.finished ?? Promise.resolve())
      .then(() => {
        if (!isCancelled) setIsFinished(true);
      })
      .catch(() => undefined);

    return () => {
      isCancelled = true;
      turn?.effect?.updateTiming({ iterations: Infinity });
    };
  }, [isAnimating, movement, spinner, stopBehavior]);

  if (isAnimating) return undefined;
  if (stopBehavior === 'finish') return isFinished ? 'reset' : undefined;
  return stopBehavior;
};

/**
 * An activity indicator (UIKit `UIActivityIndicatorView`, Figma “Progress
 * indicator”): spinning spokes, for progress of unknown length (an
 * indeterminate Base UI `Progress.Root`); optionally labeled.
 */
export const ActivityIndicator = forwardRef<
  HTMLDivElement,
  ActivityIndicatorProps
>(
  (
    {
      className,
      animating = true,
      children,
      color,
      duration,
      movement = 'stepped',
      size = 'regular',
      stopBehavior = 'reset',
      style,
      ...props
    },
    ref,
  ) => {
    const spinner = useRef<HTMLSpanElement>(null);
    const stopped = useStopped(spinner, animating, movement, stopBehavior);

    return (
      <BaseProgress.Root
        ref={ref}
        data-movement={movement}
        data-size={size}
        data-stopped={stopped}
        value={null}
        style={withStyle(
          {
            '--uikit-progress-activity-color': color,
            '--uikit-progress-activity-duration':
              duration === undefined ? undefined : `${String(duration)}s`,
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
        >
          {spokes.map((opacity, index) => (
            <span
              key={index}
              style={
                {
                  '--uikit-progress-activity-phase': String(
                    ((spokes.length - index) % spokes.length) / spokes.length,
                  ),
                  opacity,
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
