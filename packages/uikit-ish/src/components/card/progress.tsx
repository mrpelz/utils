import { Progress as BaseProgress } from '@base-ui/react/progress';
import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { colorSchemeStyle } from '../glass/main.js';
import { cn, withStyle } from '../utils/main.js';
import type {
  CardFormat,
  CardProgressBarProps,
  CardProgressDetailProps,
  CardProgressLabelProps,
  CardProgressProps,
  CardProgressValueProps,
} from './props.js';
import {
  formattedShare,
  percentFormat,
  shareOf,
  TintProbe,
  useCardTitleId,
  useFillScheme,
} from './shared.js';

// A card's progress (`Card.Progress`, as Base UI's `Progress.Root`): its
// value, in words (`Card.ProgressValue`) and as a bar (`Card.ProgressBar`,
// its words on it: `Card.ProgressLabel`, `Card.ProgressDetail`).

/** A card's progress, for its parts (see `Progress`). */
type ProgressContextValue = CardFormat &
  Pick<CardProgressProps, 'getAriaValueText'> & {
    max: number;
    min: number;
    value: number | null;
  };

const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined,
);

/**
 * Whether a progress bar's words are its fill's copy (see `ProgressBar`):
 * theirs, not the app's, to hold no ref of the app's (its words' own, on
 * the well, do).
 */
const ProgressCopyContext = createContext(false);

const useProgressContext = (part: string) => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error(`Card.${part} goes in a Card.Progress.`);
  }
  return context;
};

/**
 * A card's progress (e.g. a washer's run): its value and range (`value`,
 * `min`, `max`) and how it's put in words (`format`, `locale`; by default a
 * whole percentage), as Base UI's `Progress.Root`, for its parts composed
 * in it: its value in words (`ProgressValue`), its bar (`ProgressBar`).
 * Renders no element of its own: its parts are the card's.
 */
export const Progress = ({
  children,
  format = percentFormat,
  getAriaValueText,
  locale,
  max = 100,
  min = 0,
  value,
}: CardProgressProps): ReactNode => {
  const context = useMemo(
    () => ({ format, getAriaValueText, locale, max, min, value }),
    [format, getAriaValueText, locale, max, min, value],
  );
  return (
    <ProgressContext.Provider value={context}>
      {children}
    </ProgressContext.Provider>
  );
};

/**
 * A card's progress in words (by its `format`: e.g. `72%`), as a card's
 * value (large in a large tile); in a tile a row tall, none beside its bar
 * (no room for it, see the CSS). None under way, none.
 */
export const ProgressValue = forwardRef<
  HTMLSpanElement,
  CardProgressValueProps
>(({ children, className, render, ...props }, ref) => {
  const { format, locale, max, min, value } =
    useProgressContext('ProgressValue');
  const text =
    value === null
      ? ''
      : formattedShare(value, shareOf(value, min, max), { format, locale });
  const element = useRender({
    defaultTagName: 'span',
    props: {
      ...props,
      children: children && value !== null ? children(text, value) : text,
      className: cn('uikit-card-value uikit-card-progress-value', className),
      'data-card-part': 'progress-value',
    },
    ref,
    render,
  });
  return value === null ? null : element;
});

/**
 * A card's progress bar: a pill at its bottom (a well, as a list's),
 * filling from its start in its tint; what's on it (its children: a
 * `ProgressLabel`, a `ProgressDetail`) drawn on the well, and again on the
 * fill (a copy, as wide as the pill, clipped to it) in the fill's color
 * scheme (by its tint, see `textSchemeOn`: read as its tint or the color
 * scheme changes). Base UI's progress bar (named by its card's title, or
 * its `aria-label`), the words beside it, read as they are.
 */
export const ProgressBar = forwardRef<HTMLDivElement, CardProgressBarProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      render,
      style,
      tint,
      ...props
    },
    ref,
  ) => {
    const { format, getAriaValueText, locale, max, min, value } =
      useProgressContext('ProgressBar');
    const titleId = useCardTitleId();
    const probe = useRef<HTMLSpanElement>(null);
    const scheme = useFillScheme(probe, tint);
    return useRender({
      defaultTagName: 'div',
      props: {
        ...props,
        children: (
          <>
            <span className="uikit-card-progress-content">{children}</span>
            <BaseProgress.Root
              aria-label={ariaLabel}
              className="uikit-card-progress-meter"
              format={format}
              getAriaValueText={getAriaValueText}
              locale={locale}
              max={max}
              min={min}
              value={value}
              aria-labelledby={
                ariaLabel === undefined
                  ? (ariaLabelledBy ?? titleId)
                  : undefined
              }
            >
              <span
                aria-hidden="true"
                className="uikit-card-progress-fill"
                data-color-scheme={scheme}
                style={colorSchemeStyle(scheme)}
              >
                <TintProbe ref={probe} />
                <ProgressCopyContext.Provider value>
                  <span className="uikit-card-progress-content">
                    {children}
                  </span>
                </ProgressCopyContext.Provider>
              </span>
            </BaseProgress.Root>
          </>
        ),
        className: cn('uikit-card-progress-bar', className),
        'data-card-part': 'progress-bar',
        style: withStyle(
          {
            '--uikit-card-progress': `${String(shareOf(value, min, max) * 100)}%`,
            '--uikit-card-progress-tint': tint,
          },
          style,
        ),
      },
      ref,
      render,
    });
  },
);

/** A progress bar's words at its start (e.g. `Rinsing`). */
export const ProgressLabel = forwardRef<
  HTMLSpanElement,
  CardProgressLabelProps
>(({ className, render, ...props }, ref) => {
  const isCopy = useContext(ProgressCopyContext);
  return useRender({
    defaultTagName: 'span',
    props: {
      ...props,
      className: cn('uikit-card-progress-label', className),
      'data-card-part': 'progress-label',
    },
    ref: isCopy ? undefined : ref,
    render,
  });
});

/**
 * A progress bar's words at its end (e.g. `40 min left`), quieter: on the
 * well in its secondary text color, on the fill in the fill's text color,
 * less strong (see the CSS).
 */
export const ProgressDetail = forwardRef<
  HTMLSpanElement,
  CardProgressDetailProps
>(({ className, render, ...props }, ref) => {
  const isCopy = useContext(ProgressCopyContext);
  return useRender({
    defaultTagName: 'span',
    props: {
      ...props,
      className: cn('uikit-card-progress-detail', className),
      'data-card-part': 'progress-detail',
    },
    ref: isCopy ? undefined : ref,
    render,
  });
});
