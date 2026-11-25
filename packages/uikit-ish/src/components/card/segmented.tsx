import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import {
  createContext,
  forwardRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useGridItem } from '../grid/main.js';
import { Symbol, type SymbolIcon } from '../symbol/main.js';
import { cn } from '../utils/main.js';
import { pressSlop, touchSlop } from './press.js';
import type { CardSegmentedItemProps, CardSegmentedProps } from './props.js';
import { useCardTitleId, useControlled } from './shared.js';

// A card's choice of a few (`Card.Segmented` of `Card.SegmentedItem`s):
// segments in a well at its bottom, laid out by its tile's size.

/** A segmented card's layout, by its tile's size (see `SegmentedCard`). */
export type SegmentedLayout = 'compact' | 'row' | 'tall' | 'upright';

/**
 * Its layout by its size (open above the page, that one) and its
 * orientation (the app's; none, by its size): taller than a row, its
 * options stacked (`upright`: vertical, or one wide) or side by side, a
 * symbol over its words (`tall`: horizontal, or wider); one row, side by
 * side across it (`row`: wider, not vertical); else none (`compact`: 1x1,
 * or vertical in one row, no room to stack them). Outside a grid, a row,
 * or stacked (vertical).
 */
const layoutOf = (
  orientation: CardSegmentedProps['orientation'],
  isWide: boolean,
  isTall: boolean,
): SegmentedLayout => {
  if (isTall) {
    if (orientation === undefined) return isWide ? 'tall' : 'upright';
    return orientation === 'vertical' ? 'upright' : 'tall';
  }
  return isWide && orientation !== 'vertical' ? 'row' : 'compact';
};

/** Its layout (see `layoutOf`), and whether it's one wide (narrow). */
export const useSegmentedLayout = (
  orientation: CardSegmentedProps['orientation'],
): readonly [SegmentedLayout, boolean] => {
  const item = useGridItem();
  if (!item) return [orientation === 'vertical' ? 'upright' : 'row', false];
  const [columns = '1', rows = '1'] = (
    item.open ? item.openSize : item.size
  ).split('x');
  const isWide = columns === '*' || Number(columns) >= 2;
  return [layoutOf(orientation, isWide, Number(rows) >= 2), !isWide];
};

/** A segmented card's thumb, placed on an option's box (see below). */
const placeThumb = (thumb: HTMLElement, on: HTMLElement | null) => {
  thumb.hidden = !on;
  if (!on) return;
  thumb.style.setProperty(
    '--uikit-card-segmented-thumb-x',
    `${String(on.offsetLeft)}px`,
  );
  thumb.style.setProperty(
    '--uikit-card-segmented-thumb-y',
    `${String(on.offsetTop)}px`,
  );
  thumb.style.setProperty(
    '--uikit-card-segmented-thumb-width',
    `${String(on.offsetWidth)}px`,
  );
  thumb.style.setProperty(
    '--uikit-card-segmented-thumb-height',
    `${String(on.offsetHeight)}px`,
  );
};

/** The option nearest a point, along the options (see `dragProps`). */
const nearestOption = (
  root: HTMLElement,
  isUpright: boolean,
  { clientX, clientY }: { clientX: number; clientY: number },
) => {
  let nearest: HTMLElement | undefined;
  let distance = Infinity;
  for (const option of root.querySelectorAll<HTMLElement>('[role="radio"]')) {
    if (Object.hasOwn(option.dataset, 'disabled')) continue;
    const box = option.getBoundingClientRect();
    const away = isUpright
      ? Math.abs(box.top + box.height / 2 - clientY)
      : Math.abs(box.left + box.width / 2 - clientX);
    if (!(away < distance)) {
      continue;
    }

    distance = away;
    nearest = option;
  }
  return nearest;
};

/**
 * Dragging between a segmented card's options (as Segmented's, no lens:
 * its thumb what moves): held back until it moves (`pressSlop`; a touch,
 * `touchSlop`), then along the options (a mouse, any way), the nearest one
 * chosen as it's reached (its thumb going there); a touch across them, or
 * the browser panning first (it's cancelled), a scroll, let go (as a
 * slider card's, see `pressProps`). Dragging, the page doesn't pan (see
 * `SegmentedChoice`). Released before, a press: the option's own (its
 * click).
 */
const dragProps = (
  isUpright: boolean,
  onChoose: (value: string) => void,
): { onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void } => ({
  onPointerDown: (event) => {
    if (event.button !== 0) return;
    const root = event.currentTarget;
    const { clientX, clientY, pointerId, pointerType } = event;
    const isMouse = pointerType === 'mouse';
    const slop = isMouse ? pressSlop : touchSlop;
    let isDragging = false;
    let under: HTMLElement | undefined;
    const listening = new AbortController();
    const options = { capture: true, signal: listening.signal };
    const end = () => {
      listening.abort();
      delete root.dataset.dragging;
    };
    addEventListener(
      'pointermove',
      (move) => {
        if (move.pointerId !== pointerId) return;
        if (!isDragging) {
          const across = Math.abs(move.clientX - clientX);
          const upright = Math.abs(move.clientY - clientY);
          if (Math.hypot(across, upright) < slop) return;
          const along = isUpright ? upright : across;
          const crossing = isUpright ? across : upright;
          // (A touch across them: a scroll, let go.)
          if (!isMouse && crossing > along) {
            end();
            return;
          }
          isDragging = true;
          root.dataset.dragging = '';
        }
        // (Its nearest option chosen as it's reached.)
        const next = nearestOption(root, isUpright, move);
        if (!next || next === under) return;
        under = next;
        const { value } = next.dataset;
        if (value !== undefined && !Object.hasOwn(next.dataset, 'checked')) {
          onChoose(value);
        }
      },
      options,
    );
    addEventListener(
      'pointerup',
      (up) => {
        if (up.pointerId !== pointerId) return;
        end();
        if (!isDragging) return;
        // (Its click next, if any: not an option's (dragged, not pressed);
        // none before another press or key, nothing.)
        const clicking = new AbortController();
        const once = { capture: true, signal: clicking.signal };
        addEventListener(
          'click',
          (clicked) => {
            clicking.abort();
            clicked.preventDefault();
            clicked.stopPropagation();
          },
          once,
        );
        for (const type of ['pointerdown', 'keydown']) {
          addEventListener(type, () => clicking.abort(), once);
        }
      },
      options,
    );
    addEventListener(
      'pointercancel',
      (cancel) => {
        if (cancel.pointerId === pointerId) end();
      },
      options,
    );
  },
});

/** A segmented card's option, as it tells its card (see `SegmentedItem`). */
export type SegmentedOptionInfo = {
  icon: SymbolIcon | undefined;
  label: ReactNode;
  tint: string | undefined;
};

/** What a segmented card's options read from it (see `SegmentedItem`). */
type SegmentedContextValue = {
  content: 'both' | 'icon' | 'label';
  layout: SegmentedLayout;
  /** Tells it an option (its symbol, words, tint), until it's gone. */
  register: (value: string, info: SegmentedOptionInfo) => () => void;
};

const SegmentedContext = createContext<SegmentedContextValue | undefined>(
  undefined,
);

/**
 * Its options, as they've told it (in the order they did: theirs), see
 * `SegmentedItem`.
 */
export const useSegmentedOptions = (): readonly [
  ReadonlyMap<string, SegmentedOptionInfo>,
  SegmentedContextValue['register'],
] => {
  const [options, setOptions] = useState<
    ReadonlyMap<string, SegmentedOptionInfo>
  >(() => new Map());
  const register = useCallback((value: string, info: SegmentedOptionInfo) => {
    setOptions((current) => new Map(current).set(value, info));
    return () =>
      setOptions((current) => {
        const next = new Map(current);
        next.delete(value);
        return next;
      });
  }, []);
  return [options, register] as const;
};

/**
 * What a ready-made card holding a choice tells it (see ControlCards'
 * `Segmented`): where its options register too (their symbols, words,
 * tints: its symbol and value the chosen one's), and where its value and
 * layout go. Internal.
 */
type SegmentedHost = {
  register: SegmentedContextValue['register'];
  report: (value: string, layout: SegmentedLayout) => void;
};
export const SegmentedHostContext = createContext<SegmentedHost | undefined>(
  undefined,
);

/**
 * A card's choice of a few (Base UI's radio group; its options its
 * children, see `SegmentedItem`; named by its card's title, or its
 * `aria-label`): segments in a well at its bottom, laid out by its tile's
 * size and its `orientation` (see `useSegmentedLayout`), the chosen one's
 * raised (a thumb, moved to it as it's chosen, by its box: its corners the
 * well's less its padding, a pill while short); dragged between (see
 * `dragProps`). None shown (1x1): there all the same, unseen, its options
 * telling a ready-made card theirs.
 */
export const Segmented = forwardRef<HTMLDivElement, CardSegmentedProps>(
  (
    {
      children,
      className,
      defaultValue = '',
      onValueChange,
      optionContent = 'both',
      orientation,
      value,
      ...props
    },
    forwardedRef,
  ) => {
    const titleId = useCardTitleId();
    const host = useContext(SegmentedHostContext);
    const [options, registerOwn] = useSegmentedOptions();
    const register = useCallback(
      (option: string, info: SegmentedOptionInfo) => {
        const own = registerOwn(option, info);
        const hosted = host?.register(option, info);
        return () => {
          own();
          hosted?.();
        };
      },
      [host, registerOwn],
    );
    // (None chosen at first: its first option.)
    const [chosen, setChosen] = useControlled(value, defaultValue);
    const current = chosen || (options.keys().next().value ?? '');
    const [layout, isNarrow] = useSegmentedLayout(orientation);
    // (Its value and layout told a ready-made card holding it, before
    // it's painted.)
    const report = host?.report;
    useLayoutEffect(() => {
      report?.(current, layout);
    }, [current, layout, report]);
    const context = useMemo(
      () => ({ content: optionContent, layout, register }),
      [layout, optionContent, register],
    );
    const choose = (next: string) => {
      setChosen(next);
      onValueChange?.(next);
    };
    const group = useRef<HTMLDivElement | null>(null);
    const isShown = layout !== 'compact';
    // (Its thumb on the chosen segment, as it's chosen and as its box
    // changes; moved (transitioned) once it's been placed.)
    useLayoutEffect(() => {
      const root = group.current;
      const thumb = root?.querySelector<HTMLElement>('[data-part="thumb"]');
      if (!root || !thumb || !isShown) return undefined;
      const place = () => {
        placeThumb(thumb, root.querySelector('[data-checked]'));
      };
      place();
      let frame = requestAnimationFrame(() => {
        root.dataset.placed = '';
      });
      // (Its box changing (e.g. its card resized, opened): there at once,
      // as its options are; moved only as another's chosen. Its first
      // report (as it's observed, each choice: this effect's again) no
      // change.)
      let size = `${String(root.offsetWidth)}x${String(root.offsetHeight)}`;
      const observer = new ResizeObserver(() => {
        const next = `${String(root.offsetWidth)}x${String(root.offsetHeight)}`;
        if (next === size) return;
        size = next;
        cancelAnimationFrame(frame);
        delete root.dataset.placed;
        place();
        frame = requestAnimationFrame(() => {
          root.dataset.placed = '';
        });
      });
      observer.observe(root);
      // (Its options changing (added, removed, laid out anew), or another
      // marked chosen (Base UI's radios a render after its value): placed
      // again.)
      const mutations = new MutationObserver(place);
      mutations.observe(root, {
        attributeFilter: ['data-checked'],
        childList: true,
        subtree: true,
      });
      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        mutations.disconnect();
      };
    }, [current, isShown, layout]);
    // (Dragged (see `dragProps`): its touch's moves not the page's, its pan
    // not starting as the finger strays across its options; not passive,
    // as React's listeners are.)
    useLayoutEffect(() => {
      const root = group.current;
      if (!root) return undefined;
      const hold = (move: TouchEvent) => {
        if (Object.hasOwn(root.dataset, 'dragging') && move.cancelable) {
          move.preventDefault();
        }
      };
      root.addEventListener('touchmove', hold, { passive: false });
      return () => root.removeEventListener('touchmove', hold);
    }, []);
    return (
      <SegmentedContext.Provider value={context}>
        <BaseRadioGroup
          ref={(element: HTMLDivElement | null) => {
            group.current = element;
            if (typeof forwardedRef === 'function') forwardedRef(element);
            else if (forwardedRef) forwardedRef.current = element;
          }}
          aria-labelledby={
            props['aria-label'] === undefined ? titleId : undefined
          }
          {...props}
          className={cn('uikit-card-segmented', className)}
          // (Its presses its options', not its card's: no press tint on the
          // card, nor a press passed on, see `forwardClick`.)
          data-card-own-press=""
          data-card-part="segmented"
          data-layout={layout}
          data-narrow={isNarrow ? '' : undefined}
          hidden={!isShown}
          value={current}
          onValueChange={(next) => choose(next as string)}
          {...dragProps(layout === 'upright', choose)}
        >
          <span
            aria-hidden="true"
            className="uikit-card-segmented-thumb"
            data-part="thumb"
          />
          {children}
        </BaseRadioGroup>
      </SegmentedContext.Provider>
    );
  },
);

/**
 * A choice's option (a radio, Base UI's): its symbol and its words
 * (`children`), or either (its choice's `optionContent`; its symbol only,
 * its words unseen, its name), a subtitle under them where there's room;
 * telling its choice its symbol, words and tint (a ready-made card's value
 * and symbol while it's chosen).
 */
export const SegmentedItem = forwardRef<HTMLElement, CardSegmentedItemProps>(
  ({ children, className, icon, subtitle, tint, value, ...props }, ref) => {
    const context = useContext(SegmentedContext);
    if (!context) {
      throw new Error('Card.SegmentedItem goes in a Card.Segmented.');
    }
    const { register } = context;
    useLayoutEffect(
      () => register(value, { icon, label: children, tint }),
      [children, icon, register, tint, value],
    );
    const hasIcon = icon !== undefined && context.content !== 'label';
    const isIconOnly = hasIcon && context.content === 'icon';
    return (
      <BaseRadio.Root
        ref={ref}
        {...props}
        className={cn('uikit-card-segmented-item', className)}
        data-card-part="segmented-item"
        data-value={value}
        value={value}
      >
        {hasIcon ? <Symbol icon={icon} /> : null}
        {/* (Its words, and more under them where there's room: taller
            than a row; its symbol only, unseen, its name.) */}
        <span
          className="uikit-card-segmented-text"
          data-unseen={isIconOnly ? '' : undefined}
        >
          <span className="uikit-card-segmented-label">{children}</span>
          {context.layout !== 'row' && subtitle !== undefined ? (
            <span className="uikit-card-segmented-subtitle">{subtitle}</span>
          ) : null}
        </span>
      </BaseRadio.Root>
    );
  },
);
