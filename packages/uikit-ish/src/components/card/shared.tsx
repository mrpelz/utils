import {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import { useGridItem } from '../grid/main.js';
import { useSettings } from '../settings/main.js';
import { textSchemeOn } from './color.js';
import type { CardFormat } from './props.js';

// What a card's parts share: its context (its title's id), state kept as
// Base UI's components keep it, numbers formatted, a fill's color scheme.

/** What a card tells its parts (see `Card.Root`). */
type CardContextValue = {
  /** Its title's id (see `Card.Title`): what its parts are named by. */
  setTitleId: (id: string | undefined) => void;
  titleId: string | undefined;
};

export const CardContext = createContext<CardContextValue | undefined>(
  undefined,
);

/**
 * Its card's title's id, for a part named by it (e.g. a progress bar, a
 * list of stages, a choice): none until its title is there (or none at
 * all, or outside a card).
 */
export const useCardTitleId = (): string | undefined =>
  useContext(CardContext)?.titleId;

/**
 * Controlled or uncontrolled state, as Base UI's components keep it: which
 * one by whether a value's given as it mounts, for as long as it's there.
 */
export const useControlled = <T,>(
  value: T | undefined,
  defaultValue: T,
): [T, (next: T) => void] => {
  const [isControlled] = useState(value !== undefined);
  const [state, setState] = useState(defaultValue);
  return [isControlled ? (value as T) : state, setState];
};

/** The document's language, if it says (none: the runtime's default). */
export const documentLocale = (): string | undefined =>
  typeof document === 'undefined'
    ? undefined
    : document.documentElement.lang || undefined;

/** A number, formatted (see `CardFormat`). */
export const formatted = (
  value: number,
  { format, locale }: CardFormat,
): string =>
  new Intl.NumberFormat(locale ?? documentLocale(), format).format(value);

/** A share's default format: a whole percentage. */
export const percentFormat: Intl.NumberFormatOptions = {
  maximumFractionDigits: 0,
  style: 'percent',
};

/** Its share of its range (0 to 1); none, none. */
export const shareOf = (
  value: number | null | undefined,
  min: number,
  max: number,
): number =>
  value === undefined || value === null || max <= min
    ? 0
    : Math.min(Math.max((value - min) / (max - min), 0), 1);

/**
 * A value's words by a format (see `CardFormat`): a percentage of its
 * share (`style: 'percent'`), else the value itself.
 */
export const formattedShare = (
  value: number,
  share: number,
  { format, locale }: CardFormat,
): string =>
  formatted(format?.style === 'percent' ? share : value, { format, locale });

/**
 * Whether its card shows its large layout: its tile at least 2x2 (a full
 * width's: wide), however it got there (expanded, resized), or open above
 * the page.
 */
export const useIsLarge = (): boolean => {
  const item = useGridItem();
  if (!item) return false;
  const [columns = '1', rows = '1'] = item.size.split('x');
  return (
    item.open ||
    ((columns === '*' || Number(columns) >= 2) && Number(rows) >= 2)
  );
};

/**
 * The color scheme of what's drawn over a fill (see `textSchemeOn`), as
 * its tint or the color scheme changes (not as it moves). Its tint's, read
 * where it's drawn (its `light-dark()` resolved there), not what's painted:
 * off, with a switch, a slider's fill isn't drawn (see Card), and its
 * scheme is still wanted as it's switched on.
 */
export const useFillScheme = (
  probe: { current: HTMLElement | null },
  tint: string | undefined,
): 'dark' | 'light' | undefined => {
  const { colorScheme } = useSettings();
  const [scheme, setScheme] = useState<'dark' | 'light' | undefined>();
  useLayoutEffect(() => {
    const { current: element } = probe;
    if (!element) return;
    // (Its color computed, the var resolved, by a probe kept in its fill
    // (see `TintProbe`): only read, nothing changed on the page, so many
    // cards mounting at once (e.g. a page pushed) don't each restyle it.)
    const read = () => {
      setScheme(textSchemeOn(getComputedStyle(element).color));
    };
    read();
  }, [colorScheme, probe, tint]);
  return scheme;
};

/** A fill's tint, resolved where it's drawn (see `useFillScheme`). */
export const TintProbe = forwardRef<HTMLSpanElement>((_, ref) => (
  <span
    ref={ref}
    hidden
    aria-hidden="true"
    className="uikit-card-tint-probe"
  />
));
