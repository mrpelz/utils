import { Progress as BaseProgress } from '@base-ui/react/progress';
import { keyframes, styled } from 'goober';
import {
  createContext,
  CSSProperties,
  forwardRef,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import { tooltipSurface } from './tooltip.js';
import { textStyle } from './typography.js';

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

export type ProgressRootProps = BaseProgress.Root.Props & {
  /**
   * The fill's color.
   * @default system blue
   */
  tint?: string;
};

// eslint-disable-next-line prettier/prettier
const StyledRoot = styled<typeof BaseProgress.Root, BaseProgress.Root.Props>(BaseProgress.Root, forwardRef)`
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  anchor-scope: --styled-progress-fill;
  color: var(--color-ios-secondary-label);
  gap: 6px 8px;
  ${textStyle('subheadline')}

  /* Its label and value (see Label, Value): above the track (by default;
     on a line of their own, the label at its start, the value at its end),
     below it, or before or after it. */
  & > [data-progress-placement='block-start'] {
    order: -3;
  }

  & > [data-progress-placement='inline-start'] {
    order: -1;
  }

  & > [data-progress-placement='inline-end'] {
    order: 1;
  }

  & > [data-progress-placement='block-end'] {
    order: 3;
  }

  &
    > [data-progress-placement='block-start']
    + [data-progress-placement='block-start'],
  &
    > [data-progress-placement='block-end']
    + [data-progress-placement='block-end'] {
    margin-inline-start: auto;
  }

  /* (Nested: goober mangles selectors continuing after parentheses.) */
  &:has(> [data-progress-placement='block-start']) {
    &::before {
      flex-basis: 100%;
      order: -2;
      content: '';
      margin-block-end: -6px;
    }
  }

  /* Focused by keyboard (with a momentary tooltip, see Value): a ring in
     the tint around the track, its tooltip shown. */
  &:focus-visible {
    outline: none;

    & > [data-progress-placement='momentary-tooltip'] {
      opacity: 1;
      scale: 1;
    }

    & > [data-progress-part='track'] {
      outline: 2px solid
        var(--styled-progress-tint, var(--color-ios-system-blue));
      outline-offset: 2px;
    }
  }

  &:has(> [data-progress-placement='block-end']) {
    &::after {
      flex-basis: 100%;
      order: 2;
      content: '';
      margin-block-end: -6px;
    }
  }
`;

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
        <StyledRoot
          ref={ref}
          style={tintProperty(tint, style as CSSProperties | undefined)}
          tabIndex={tabIndex ?? (momentary ? 0 : undefined)}
          {...props}
        />
      </RootContext.Provider>
    );
  },
);

const StyledTrack = styled(BaseProgress.Track, forwardRef)`
  position: relative;
  overflow: hidden;
  min-width: var(--styled-progress-min-length, 280px);
  height: 6px;
  flex: 1 1 0;
  border-radius: 3px;
  background-color: var(--color-ios-system-fill);
  container-type: inline-size;
`;

const Track = forwardRef<HTMLDivElement, Omit<BaseProgress.Track.Props, 'ref'>>(
  (props, ref) => (
    <StyledTrack
      ref={ref}
      data-progress-part="track"
      {...props}
    />
  ),
);

const slide = keyframes`
  from {
    translate: -100% 0;
  }

  to {
    translate: 100cqw 0;
  }
`;

const Indicator = styled(BaseProgress.Indicator, forwardRef)`
  display: block;
  min-width: 6px;
  height: 100%;
  border-radius: 3px;
  anchor-name: --styled-progress-fill;
  background-color: var(--styled-progress-tint, var(--color-ios-system-blue));
  transition: width 200ms;

  [data-indeterminate] > & {
    width: 30%;
    animation: ${slide} 1.2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/** Where a label or value is (see `Root`). */
export type ProgressPlacement =
  'block-end' | 'block-start' | 'inline-end' | 'inline-start';

const StyledLabel = styled(BaseProgress.Label, forwardRef)`
  min-width: 0;
`;

export type ProgressLabelProps = Omit<BaseProgress.Label.Props, 'ref'> & {
  /** @default 'block-start' */
  placement?: ProgressPlacement;
};

const Label = forwardRef<HTMLSpanElement, ProgressLabelProps>(
  ({ placement = 'block-start', ...props }, ref) => (
    <StyledLabel
      ref={ref}
      data-progress-placement={placement}
      {...props}
    />
  ),
);

const StyledValue = styled(BaseProgress.Value, forwardRef)`
  font-variant-numeric: tabular-nums;
  text-align: end;

  /* In a tooltip (see Tooltip) centered on the fill's end, 8px above it. */
  &[data-progress-placement='tooltip'],
  &[data-progress-placement='momentary-tooltip'] {
    ${tooltipSurface}
    position: absolute;
    z-index: 1;
    bottom: calc(anchor(top) + 8px);
    left: anchor(right);
    position-anchor: --styled-progress-fill;
    translate: -50% 0;
    white-space: nowrap;
  }

  /* Momentary: shown while the bar is hovered (or focused by keyboard, see
     Root). */
  &[data-progress-placement='momentary-tooltip'] {
    opacity: 0;
    scale: 0.85;
    transition-duration: 150ms;
    transition-property: opacity, scale;
  }

  [role='progressbar']:hover > &[data-progress-placement='momentary-tooltip'] {
    opacity: 1;
    scale: 1;
  }
`;

export type ProgressValueProps = Omit<BaseProgress.Value.Props, 'ref'> & {
  /**
   * Placed (see `ProgressPlacement`), or in a tooltip at the fill's end:
   * always, or momentary (while the bar is hovered or focused by keyboard;
   * it's focusable then).
   * @default 'block-start'
   */
  placement?: ProgressPlacement | 'momentary-tooltip' | 'tooltip';
};

const Value = forwardRef<HTMLSpanElement, ProgressValueProps>(
  ({ placement = 'block-start', ...props }, ref) => {
    const setMomentary = useContext(RootContext);
    const momentary = placement === 'momentary-tooltip';
    useLayoutEffect(() => {
      if (!momentary) return undefined;
      setMomentary?.(true);
      return () => setMomentary?.(false);
    }, [momentary, setMomentary]);

    return (
      <StyledValue
        ref={ref}
        data-progress-placement={placement}
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

export type ActivityIndicatorMovement = 'fade' | 'rotate' | 'stepped';

export type ActivityIndicatorProps = Omit<
  BaseProgress.Root.Props,
  'children' | 'value'
> & {
  /**
   * Spinning (UIKit `startAnimating`, `stopAnimating`); stopped, it rests.
   * @default true
   */
  animating?: boolean;
  /** A label after it (Figma “Label”). */
  children?: ReactNode;
  /**
   * The spokes' color (UIKit `color`).
   * @default the secondary label color
   */
  color?: string;
  /**
   * Seconds a turn takes (its speed).
   * @default 1
   */
  duration?: number;
  /**
   * How it spins: a spoke at a time (as UIKit), smoothly, or its spokes
   * staying in place, fading in turn.
   * @default 'stepped'
   */
  movement?: ActivityIndicatorMovement;
  /**
   * Figma “Size” (Regular: 30px, Small: 22px).
   * @default 'regular'
   */
  size?: 'regular' | 'small';
};

// A spoke at a time, clockwise.
const spin = keyframes`
  to {
    rotate: 1turn;
  }
`;

// Fading: each spoke from the brightest to the faintest, a turn long.
const fade = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0.15;
  }
`;

// The spokes' opacities, clockwise from the top.
const spokes = [1, 0.15, 0.27, 0.39, 0.51, 0.63, 0.75, 0.87];

// eslint-disable-next-line prettier/prettier
const StyledActivityIndicator = styled<typeof BaseProgress.Root, BaseProgress.Root.Props>(BaseProgress.Root, forwardRef)`
  --styled-activity-size: 30px;
  --styled-activity-spoke-width: 4px;
  --styled-activity-spoke-length: 10px;

  display: inline-flex;
  align-items: center;
  color: var(--color-ios-secondary-label);
  gap: 8px;
  vertical-align: middle;
  ${textStyle('body')}

  &[data-size='small'] {
    --styled-activity-size: 22px;
    --styled-activity-spoke-width: 3px;
    --styled-activity-spoke-length: 7px;

    gap: 4px;
  }
`;

const Spinner = styled('span')`
  position: relative;
  width: var(--styled-activity-size);
  height: var(--styled-activity-size);
  flex: none;
  animation: ${spin} var(--styled-activity-duration, 1s) steps(8) infinite;

  & > span {
    position: absolute;
    top: 0;
    left: calc(50% - var(--styled-activity-spoke-width) / 2);
    width: var(--styled-activity-spoke-width);
    height: var(--styled-activity-spoke-length);
    border-radius: calc(var(--styled-activity-spoke-width) / 2);
    background-color: var(--styled-activity-color, currentcolor);
    transform-origin: 50% calc(var(--styled-activity-size) / 2);
  }

  [data-movement='rotate'] > & {
    animation-timing-function: linear;
  }

  /* Fading: the spokes in place, each as far into its fade as its opacity
     (its phase: a share of a turn behind the brightest). */
  [data-movement='fade'] > & {
    animation: none;
  }

  [data-movement='fade'] > & > span {
    animation: ${fade} var(--styled-activity-duration, 1s) linear infinite;
    animation-delay: calc(
      var(--styled-activity-duration, 1s) * var(--styled-activity-phase) * -1
    );
  }

  [data-stopped] > &,
  [data-stopped] > & > span {
    animation-play-state: paused;
  }
`;

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
    <StyledActivityIndicator
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
    >
      <Spinner aria-hidden="true">
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
      </Spinner>
      {children === undefined ? null : (
        <BaseProgress.Label>{children}</BaseProgress.Label>
      )}
    </StyledActivityIndicator>
  ),
);
