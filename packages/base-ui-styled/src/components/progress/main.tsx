import '../tooltip/style.css';
import '../glass/style.css';
import './style.css';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import {
  ComponentProps,
  createContext,
  CSSProperties,
  forwardRef,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import { cn } from '../utils/main.js';
import type {
  ActivityIndicatorProps,
  ProgressLabelProps,
  ProgressRootProps,
  ProgressValueProps,
} from './props.js';

export type {
  ActivityIndicatorMovement,
  ActivityIndicatorProps,
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

const tintProperty = (tint: string | undefined, style?: CSSProperties) =>
  tint === undefined
    ? style
    : ({ ...style, '--styled-progress-tint': tint } as CSSProperties);

// Registers a momentary tooltip (see `Value`), which makes the bar
// focusable.
const RootContext = createContext<((momentary: boolean) => void) | undefined>(
  undefined,
);

/** A progress bar (UIKit `UIProgressView`), its parts Base UI's. */
const Root = forwardRef<HTMLDivElement, ProgressRootProps>(
  ({ style, tabIndex, tint, ...props }, ref) => {
    const [momentary, setMomentary] = useState(false);

    return (
      <RootContext.Provider value={setMomentary}>
        <BaseProgress.Root
          ref={ref}
          style={tintProperty(tint, style as CSSProperties | undefined)}
          tabIndex={tabIndex ?? (momentary ? 0 : undefined)}
          {...props}
          className={cn('bus-progress-root', props.className)}
        />
      </RootContext.Provider>
    );
  },
);

const Track = forwardRef<HTMLDivElement, Omit<BaseProgress.Track.Props, 'ref'>>(
  (props, ref) => (
    <BaseProgress.Track
      ref={ref}
      data-progress-part="track"
      {...props}
      className={cn('bus-progress-track', props.className)}
    />
  ),
);

const Indicator = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseProgress.Indicator>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseProgress.Indicator
    ref={ref}
    className={cn('bus-progress-indicator', className)}
    {...props}
  />
));

const Label = forwardRef<HTMLSpanElement, ProgressLabelProps>(
  ({ placement = 'block-start', ...props }, ref) => (
    <BaseProgress.Label
      ref={ref}
      data-progress-placement={placement}
      {...props}
      className={cn('bus-progress-label', props.className)}
    />
  ),
);

const Value = forwardRef<HTMLSpanElement, ProgressValueProps>(
  ({ className, placement = 'block-start', ...props }, ref) => {
    const setMomentary = useContext(RootContext);
    const momentary = placement === 'momentary-tooltip';
    useLayoutEffect(() => {
      if (!momentary) return undefined;
      setMomentary?.(true);
      return () => setMomentary?.(false);
    }, [momentary, setMomentary]);

    return (
      <BaseProgress.Value
        ref={ref}
        data-progress-placement={placement}
        className={cn(
          'bus-progress-value',
          placement === 'tooltip' || momentary
            ? cn('bus-tooltip-surface bus-glass-medium', className)
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
      animating = true,
      children,
      color,
      duration,
      movement = 'stepped',
      size = 'regular',
      style,
      ...props
    },
    ref,
  ) => (
    <BaseProgress.Root
      ref={ref}
      data-movement={movement}
      data-size={size}
      data-stopped={animating ? undefined : ''}
      value={null}
      style={
        {
          ...(style as CSSProperties | undefined),
          ...(color !== undefined && { '--styled-activity-color': color }),
          ...(duration !== undefined && {
            '--styled-activity-duration': `${String(duration)}s`,
          }),
        } as CSSProperties
      }
      {...props}
      className={cn('bus-progress-activity-indicator', props.className)}
    >
      <span
        aria-hidden="true"
        className="bus-progress-spinner"
      >
        {spokes.map((opacity, index) => (
          <span
            key={index}
            style={
              {
                '--styled-activity-phase': String(
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
  ),
);
