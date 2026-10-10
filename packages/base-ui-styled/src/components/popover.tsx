import { Popover as BasePopover } from '@base-ui/react/popover';
import { styled } from 'goober';
import {
  createContext,
  forwardRef,
  ReactElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { glassMedium } from './glass.js';
import { popupTransition } from './menu.js';
import {
  colorScheme,
  css,
  LogicalSide,
  positionerSide,
  useForwardedRef,
} from './utils.js';

// Source: Apple iOS 26 Figma (“Popovers (iPad Only)”): a panel with 13px
// corners, its arrow a rounded wedge 56px wide, 13px deep, on any side, at
// its start, center or end (Base UI's `Arrow`, pointing at its anchor's
// center), its shadow 0 10px 100px at 30%. After the date picker's popover
// (see `DatePicker`): 8px from its anchor (its arrow's tip, with an arrow)
// and from the viewport's edges; in a list row, aligned with its end (as
// its value's), otherwise centered; scaling in from its anchor (as menus).
//
// Deviations:
// - The material is the menus' glass (`glassMedium`, see `Menu`; Figma: the
//   “Thick” material, blended with what's behind, which a popup, positioned
//   by a transform and animated, can't be).

export type PopoverAlign = 'center' | 'end' | 'start';

// Its trigger (for its alignment), and whether its popup has an arrow (for
// its distance).
type PopoverState = {
  arrow: boolean;
  setArrow: (arrow: boolean) => void;
  setTrigger: (trigger: HTMLElement | null) => void;
  trigger: HTMLElement | null;
};

const PopoverContext = createContext<PopoverState | undefined>(undefined);

const Root = <Payload,>(
  props: BasePopover.Root.Props<Payload>,
): ReactElement => {
  const [arrow, setArrow] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const state = useMemo(
    () => ({ arrow, setArrow, setTrigger, trigger }),
    [arrow, trigger],
  );

  return (
    <PopoverContext.Provider value={state}>
      <BasePopover.Root {...props} />
    </PopoverContext.Provider>
  );
};

const Trigger = forwardRef<
  HTMLButtonElement,
  Omit<BasePopover.Trigger.Props, 'ref'>
>((props, ref) => {
  const triggerRef = useForwardedRef(ref);
  const setTrigger = useContext(PopoverContext)?.setTrigger;
  useLayoutEffect(() => {
    setTrigger?.(triggerRef.current);
    return () => setTrigger?.(null);
  }, [setTrigger, triggerRef]);

  return (
    <BasePopover.Trigger
      ref={triggerRef}
      {...props}
    />
  );
});

/** The arrow's depth. */
const arrowDepth = 13;

export type PopoverPositionerProps = Omit<
  BasePopover.Positioner.Props,
  'align' | 'ref' | 'side'
> & {
  /**
   * Its alignment to its anchor.
   * @default its end in a list row, otherwise centered
   */
  align?: PopoverAlign;
  /**
   * Its side of its anchor (logical).
   * @default 'block-end'
   */
  side?: LogicalSide;
};

const Positioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  (
    { align, anchor, collisionPadding = 8, side, sideOffset, ...props },
    ref,
  ) => {
    const context = useContext(PopoverContext);
    // In a list row (by its trigger, as is its anchor, if another element).
    const inRow = Boolean(context?.trigger?.closest('[data-list-part=item]'));

    return (
      <BasePopover.Positioner
        ref={ref}
        align={align ?? (inRow ? 'end' : 'center')}
        anchor={anchor}
        collisionPadding={collisionPadding}
        side={positionerSide(side)}
        sideOffset={sideOffset ?? 8 + (context?.arrow ? arrowDepth : 0)}
        {...props}
      />
    );
  },
);

// The arrow's wedge: rounded at its tip and where it meets the popup, 28px
// to either side of its center; narrower (at least 10px) where that would
// reach into a corner (its center near one, e.g. aligned at its start or
// end: `--styled-popover-wedge`, see `placeNose`).
const wedgeHalf = 28;
const wedgeHalfMin = 10;

type Nose = 'bottom' | 'left' | 'right' | 'top';

const px = (value: number) => `${String(value)}px`;

/**
 * Its material's outline (see `Popup`) as a path's start and commands, the
 * wedge on the side of `nose`, grown by `grow` px (shrunk, if negative).
 */
const outlinePath = (nose: Nose | undefined, grow: number) => {
  // In the material's box: the popup's, the arrow's depth bigger all around
  // (room for the wedge): its edges `e` in, its corners `r`; the wedge's
  // center `c` along its edge, its tip `t` from the box's edge.
  const e = px(arrowDepth - grow);
  const r = px(13 + grow);
  const t = px(-grow);
  const far = `calc(100% - ${e})`;
  const tipFar = `calc(100% - ${t})`;
  const c = `calc(${px(arrowDepth)} + var(--styled-popover-nose, 0px))`;
  // Along its edge, by a share of the wedge's half (its curves' points).
  const at = (share: number) =>
    `calc(${c} + var(--styled-popover-wedge, ${px(wedgeHalf)}) * ${String(share)})`;
  const w = 1;
  const [outer, inner] = [0.5, 6 / wedgeHalf];

  const top =
    nose === 'top'
      ? `hline to ${at(-w)},
         curve to ${c} ${t} with ${at(-outer)} ${e} / ${at(-inner)} ${t},
         curve to ${at(w)} ${e} with ${at(inner)} ${t} / ${at(outer)} ${e},`
      : '';
  const right =
    nose === 'right'
      ? `vline to ${at(-w)},
         curve to ${tipFar} ${c} with ${far} ${at(-outer)} / ${tipFar} ${at(-inner)},
         curve to ${far} ${at(w)} with ${tipFar} ${at(inner)} / ${far} ${at(outer)},`
      : '';
  const bottom =
    nose === 'bottom'
      ? `hline to ${at(w)},
         curve to ${c} ${tipFar} with ${at(outer)} ${far} / ${at(inner)} ${tipFar},
         curve to ${at(-w)} ${far} with ${at(-inner)} ${tipFar} / ${at(-outer)} ${far},`
      : '';
  const left =
    nose === 'left'
      ? `vline to ${at(w)},
         curve to ${t} ${c} with ${e} ${at(outer)} / ${t} ${at(inner)},
         curve to ${e} ${at(-w)} with ${t} ${at(-inner)} / ${e} ${at(-outer)},`
      : '';

  return {
    commands: `${top}
      hline to calc(100% - ${e} - ${r}),
      arc to ${far} calc(${e} + ${r}) of ${r} cw,
      ${right}
      vline to calc(100% - ${e} - ${r}),
      arc to calc(100% - ${e} - ${r}) ${far} of ${r} cw,
      ${bottom}
      hline to calc(${e} + ${r}),
      arc to ${e} calc(100% - ${e} - ${r}) of ${r} cw,
      ${left}
      vline to calc(${e} + ${r}),
      arc to calc(${e} + ${r}) ${e} of ${r} cw,
      close`,
    start: `calc(${e} + ${r}) ${e}`,
  };
};

/** Its material's outline (see `Popup`), the wedge on the side of `nose`. */
const outline = (nose?: Nose) => {
  const { commands, start } = outlinePath(nose, 0);
  return `shape(from ${start}, ${commands})`;
};

/** A ring along its outline, from `outer` to `inner` px off it. */
const ring = (nose: Nose | undefined, outer: number, inner: number) => {
  const outside = outlinePath(nose, outer);
  const inside = outlinePath(nose, inner);
  return `shape(evenodd from ${outside.start}, ${outside.commands},
    move to ${inside.start}, ${inside.commands})`;
};

// Its material behind its content, as one surface with its arrow's wedge
// (on the side facing its anchor, as `data-arrow`: see `Arrow`), in two
// layers, each clipped to its outline:
// - its backdrop blur (`::before`; not on the popup itself, which would
//   make it the backdrop of what's in it);
// - its fill, rim and highlight (rings along the outline), in a shadow
//   layer (`Shape`) whose filter draws the glass' glow along it (box
//   shadows can't follow it).
// Its outlines with the wedge, by its side (`popup`: a selector of the
// clipped element, of the popup's arrow's side).
const outlines = (
  popup: (nose: string) => string,
  path: (nose?: Nose) => string = outline,
) => css`
  ${popup('[data-arrow=top]')} {
    clip-path: ${path('top')};
  }

  ${popup('[data-arrow=bottom]')} {
    clip-path: ${path('bottom')};
  }

  ${popup('[data-arrow=right]')} {
    clip-path: ${path('right')};
  }

  ${popup('[data-arrow=left]')} {
    clip-path: ${path('left')};
  }
`;

// eslint-disable-next-line prettier/prettier
const StyledPopup = styled<typeof BasePopover.Popup, BasePopover.Popup.Props>(BasePopover.Popup, forwardRef)`
  ${glassMedium()}
  ${popupTransition}
  ${colorScheme(
    `--styled-popover-rim: rgb(0 0 0 / 12%);
     --styled-popover-highlight: rgb(255 255 255 / 60%);
     --styled-popover-glow: rgb(0 0 0 / 20%);`,
    `--styled-popover-rim: rgb(255 255 255 / 15%);
     --styled-popover-highlight: transparent;
     --styled-popover-glow: rgb(0 0 0 / 15%);`,
  )}

  position: relative;
  border-radius: 13px;
  backdrop-filter: none;
  background-color: transparent;
  box-shadow: none;
  color: var(--styled-glass-content);
  isolation: isolate;
  outline: none;

  &::before {
    position: absolute;
    z-index: -1;
    backdrop-filter: saturate(180%) blur(16px);
    clip-path: ${outline()};
    content: '';
    inset: -${String(arrowDepth)}px;
  }

  ${outlines((nose) => `&${nose}::before`)}
`;

const Shape = styled('span')`
  position: absolute;
  z-index: -1;
  filter: drop-shadow(0 0 25px var(--styled-popover-glow));
  inset: -${String(arrowDepth)}px;
  pointer-events: none;

  & > span {
    position: absolute;
    inset: 0;
  }

  /* Its fill. */
  & > [data-layer='fill'] {
    background-color: var(--styled-glass-background);
    clip-path: ${outline()};
    ${outlines((nose) => `${nose} > &`)}
  }

  /* Its rim (as the glass': an edge, 1px; light, a highlight inside it). */
  & > [data-layer='rim'] {
    background-color: var(--styled-popover-rim);
    clip-path: ${ring(undefined, 0, -1)};
    ${outlines(
      (nose) => `${nose} > &`,
      (nose) => ring(nose, 0, -1),
    )}
  }

  & > [data-layer='highlight'] {
    background-color: var(--styled-popover-highlight);
    clip-path: ${ring(undefined, -1, -2)};
    ${outlines(
      (nose) => `${nose} > &`,
      (nose) => ring(nose, -1, -2),
    )}
  }
`;

/** Its panel: the material (see above) behind its content. */
const Popup = forwardRef<HTMLDivElement, Omit<BasePopover.Popup.Props, 'ref'>>(
  ({ children, ...props }, ref) => (
    <StyledPopup
      ref={ref}
      {...props}
    >
      <Shape aria-hidden="true">
        <span data-layer="fill" />
        <span data-layer="rim" />
        <span data-layer="highlight" />
      </Shape>
      {children}
    </StyledPopup>
  ),
);

/**
 * The arrow's (physical) side of its popup: facing its anchor, away from the
 * popup's side (Base UI's `data-side`, logical if requested so).
 */
const arrowSide = (side: string | undefined, rtl: boolean): Nose => {
  switch (side) {
    case 'bottom': {
      return 'top';
    }
    case 'inline-end': {
      return rtl ? 'right' : 'left';
    }
    case 'inline-start': {
      return rtl ? 'left' : 'right';
    }
    case 'left': {
      return 'right';
    }
    case 'right': {
      return 'left';
    }
    default: {
      return 'bottom';
    }
  }
};

// The arrow's side (on both, as `data-arrow`) and its center along the
// popup's edge (`--styled-popover-nose`), where Base UI placed it.
const placeNose = (arrow: HTMLElement, popup: HTMLElement) => {
  const nose = arrowSide(
    arrow.dataset.side,
    getComputedStyle(popup).direction === 'rtl',
  );
  const along =
    nose === 'left' || nose === 'right'
      ? arrow.offsetTop + arrow.offsetHeight / 2
      : arrow.offsetLeft + arrow.offsetWidth / 2;
  const length =
    nose === 'left' || nose === 'right'
      ? popup.offsetHeight
      : popup.offsetWidth;
  // The room to either side of its center, before its corners.
  const room = Math.min(along, length - along) - 13;
  const wedge = Math.max(wedgeHalfMin, Math.min(wedgeHalf, room));
  arrow.dataset.arrow = nose;
  popup.dataset.arrow = nose;
  popup.style.setProperty('--styled-popover-nose', `${String(along)}px`);
  popup.style.setProperty('--styled-popover-wedge', `${String(wedge)}px`);
};

// Positioned by Base UI, drawn by the popup (see there; its side as
// `data-arrow`).
const StyledArrow = styled(BasePopover.Arrow, forwardRef)`
  width: ${String(wedgeHalf * 2)}px;
  height: ${String(arrowDepth)}px;
  pointer-events: none;

  &[data-arrow='bottom'] {
    top: 100%;
  }

  &[data-arrow='top'] {
    bottom: 100%;
  }

  &[data-arrow='right'] {
    left: 100%;
    width: ${String(arrowDepth)}px;
    height: ${String(wedgeHalf * 2)}px;
  }

  &[data-arrow='left'] {
    right: 100%;
    width: ${String(arrowDepth)}px;
    height: ${String(wedgeHalf * 2)}px;
  }
`;

/**
 * Figma's arrow, pointing at its anchor (moving its popup further out),
 * drawn by its popup: where Base UI places it (its center along the
 * popup's edge, as `--styled-popover-nose`).
 */
const Arrow = forwardRef<HTMLDivElement, Omit<BasePopover.Arrow.Props, 'ref'>>(
  (props, ref) => {
    const arrowRef = useForwardedRef(ref);
    const setArrow = useContext(PopoverContext)?.setArrow;
    useLayoutEffect(() => {
      setArrow?.(true);
      return () => setArrow?.(false);
    }, [setArrow]);

    useLayoutEffect(() => {
      const { current: arrow } = arrowRef;
      const popup = arrow?.parentElement;
      if (!arrow || !popup) return undefined;

      const update = () => placeNose(arrow, popup);
      update();
      const observer = new MutationObserver(update);
      observer.observe(arrow, {
        attributeFilter: ['style', 'data-side'],
        attributes: true,
      });

      return () => {
        observer.disconnect();
        delete popup.dataset.arrow;
        popup.style.removeProperty('--styled-popover-nose');
        popup.style.removeProperty('--styled-popover-wedge');
      };
    }, [arrowRef]);

    return (
      <StyledArrow
        ref={arrowRef}
        {...props}
      />
    );
  },
);

/**
 * A popover (UIKit `UIPopoverPresentationController`, Base UI's `Popover`):
 * a panel of the menus' glass at its trigger (or `anchor`), optionally with
 * an arrow pointing at it.
 */
// Its content scrolling inside the popup, as high as the popup may be (the
// popup itself can't scroll: its material and arrow are drawn around it).
const Body = styled('div', forwardRef)`
  overflow: auto;
  max-height: inherit;
  box-sizing: border-box;
  border-radius: inherit;
  overscroll-behavior: contain;
`;

export const Popover = {
  ...BasePopover,
  Root,
  Trigger,
  Positioner,
  Popup,
  Arrow,
  Body,
};
