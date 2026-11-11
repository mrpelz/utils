import '../glass/style.css';
import '../menu/style.css';
import './style.css';

import { Popover as BasePopover } from '@base-ui/react/popover';
import {
  ComponentProps,
  createContext,
  forwardRef,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { useSettingsPortalProps } from '../settings/main.js';
import {
  cn,
  positionerSide,
  useCollision,
  useForwardedRef,
  useGrowAvoidance,
  useInitialFocus,
  usePortalContainer,
  withStyle,
} from '../utils/main.js';
import {
  EdgeEffects,
  useAnchorRegistration,
  useCurrentLayer,
  useScrollerRegistration,
  Viewport,
  ViewportInsetContext,
  ViewportScopeContext,
} from '../viewport/main.js';
import type {
  Nose,
  PopoverArrowProps,
  PopoverHandle,
  PopoverHeaderProps,
  PopoverPositionerProps,
  PopoverState,
} from './props.js';

export type {
  PopoverAlign,
  PopoverArrowProps,
  PopoverHandle,
  PopoverHeaderProps,
  PopoverPositionerProps,
} from './props.js';

// A panel with 13px
// corners, its arrow a rounded wedge 56px wide, 13px deep, on any side, at
// its start, center or end (Base UI's `Arrow`, pointing at its anchor's
// center), its shadow 0 10px 100px at 30%. After the date picker's popover
// (see `DatePicker`): 8px from its anchor (its arrow's tip, with an arrow)
// and from the viewport's edges; centered (in a list row, aligned with
// the row's end: the app's `align`); scaling in from its anchor (as
// menus). Its bar (`Header`): 16px from its top.
//
// Also:
// - The material is the menus' glass (`glassMedium`, see `Menu`: not
//   blended with what's behind, which a popup, positioned by a transform and
//   animated, can't be).

const PopoverContext = createContext<PopoverState | undefined>(undefined);

/** Its positioner shifted over its anchor (see `useGrowAvoidance`). */
const ShiftedContext = createContext(false);

/**
 * Not closed by a press or focus in a menu (in a portal) opened from it, e.g.
 * a submenu: Base UI tells those from outside ones by its menus' floating
 * tree, a root menu's joining the popover's, its submenus' their own, and by
 * React's event bubbling through portals, which Preact's portals lack (as
 * Menu's, see `useKeepOpenInSubmenus`).
 */
const Root = <Payload,>({
  onOpenChange,
  ...props
}: BasePopover.Root.Props<Payload>): ReactElement => {
  const [hasArrow, setHasArrow] = useState(false);
  const state = useMemo(() => ({ hasArrow, setHasArrow }), [hasArrow]);

  const onRootOpenChange = useCallback(
    (isOpen: boolean, details: BasePopover.Root.ChangeEventDetails) => {
      const { event, reason } = details;
      const target =
        reason === 'focus-out' && event instanceof FocusEvent
          ? event.relatedTarget
          : event.target;
      if (
        !isOpen &&
        (reason === 'outside-press' || reason === 'focus-out') &&
        target instanceof Element &&
        target.closest('[role="menu"]') !== null
      ) {
        details.cancel();
        return;
      }
      onOpenChange?.(isOpen, details);
    },
    [onOpenChange],
  );

  return (
    <PopoverContext.Provider value={state}>
      <BasePopover.Root
        {...props}
        onOpenChange={onRootOpenChange}
      />
    </PopoverContext.Provider>
  );
};

/**
 * A handle linking a popover to its triggers outside it (detached), and
 * opening or closing it imperatively (Base UI's `Popover.createHandle`):
 * pass it to the root's and the triggers' `handle` (in a component, see
 * `useCreatePopoverHandle`).
 */
const createHandle = <Payload = unknown,>(): PopoverHandle<Payload> =>
  BasePopover.createHandle<Payload>();

/** `Popover.createHandle`, in a component: made once, for its lifetime. */
export const useCreatePopoverHandle = <
  Payload = unknown,
>(): PopoverHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());
  return handle;
};

/** The arrow's depth. */
const arrowDepth = 13;

const Positioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  (
    {
      align = 'center',
      className,
      collisionBoundary,
      collisionPadding,
      side,
      sideOffset,
      ...props
    },
    forwardedRef,
  ) => {
    const context = useContext(PopoverContext);
    const ref = useForwardedRef(forwardedRef);
    const collision = useCollision({ collisionBoundary, collisionPadding });
    // Growing rather than scrolling (unless its own is given).
    const [grow, growRef, isShifted] = useGrowAvoidance({}, ref);

    return (
      <ShiftedContext.Provider value={isShifted}>
        <BasePopover.Positioner
          ref={growRef}
          align={align}
          {...collision}
          collisionAvoidance={grow}
          // Lifted clear of the keyboard (as a whole) while a field in it is
          // typed into (see Viewport's `KeyboardAccessory`).
          render={<Viewport.KeyboardAccessory />}
          side={positionerSide(side)}
          sideOffset={sideOffset ?? 8 + (context?.hasArrow ? arrowDepth : 0)}
          {...props}
          className={cn('uikit-popover-positioner', className)}
        />
      </ShiftedContext.Provider>
    );
  },
);

// The arrow's wedge: rounded at its tip and where it meets the popup, 28px
// to either side of its center; narrower (at least 10px) where that would
// reach into a corner (its center near one, e.g. aligned at its start or
// end: `--uikit-popover-wedge`, see `placeNose`).
const wedgeHalf = 28;
const wedgeHalfMin = 10;

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
  const c = `calc(${px(arrowDepth)} + var(--uikit-popover-nose, 0px))`;
  // Along its edge, by a share of the wedge's half (its curves' points).
  const at = (share: number) =>
    `calc(${c} + var(--uikit-popover-wedge, ${px(wedgeHalf)}) * ${String(share)})`;
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
// Its outlines, without and with the wedge by its side, as custom
// properties of the popup (see style.css).
const outlines = Object.fromEntries(
  ([undefined, 'top', 'right', 'bottom', 'left'] as const).flatMap((nose) => {
    const suffix = nose ? `-${nose}` : '';
    return [
      [`--uikit-popover-outline${suffix}`, outline(nose)],
      [`--uikit-popover-rim-outline${suffix}`, ring(nose, 0, -1)],
      [`--uikit-popover-highlight-outline${suffix}`, ring(nose, -1, -2)],
    ];
  }),
) as Record<string, string>;

/** Its panel: the material (see above) behind its content. */
const Popup = forwardRef<HTMLDivElement, Omit<BasePopover.Popup.Props, 'ref'>>(
  ({ className, children, initialFocus, style, ...props }, ref) => {
    const popupRef = useForwardedRef(ref);
    const focus = useInitialFocus(popupRef);
    // Its anchors' scope (its header's): fixed to it (see Viewport.Padding).
    const [scope] = useState(() => ({}));

    return (
      <BasePopover.Popup
        ref={popupRef}
        initialFocus={initialFocus ?? focus}
        style={withStyle(outlines, style)}
        {...props}
        data-popover-part="popup"
        className={cn(
          'uikit-popover-popup uikit-glass-medium uikit-popup-transition',
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="uikit-popover-shape"
          data-popover-part="shape"
        >
          <span data-layer="fill" />
          <span data-layer="rim" />
          <span data-layer="highlight" />
        </span>
        <ViewportScopeContext.Provider value={scope}>
          <ViewportInsetContext.Provider value>
            {children as ReactNode}
          </ViewportInsetContext.Provider>
        </ViewportScopeContext.Provider>
      </BasePopover.Popup>
    );
  },
);

/**
 * The arrow's (physical) side of its popup: facing its anchor, away from the
 * popup's side (Base UI's `data-side`, logical if requested so).
 */
const arrowSide = (side: string | undefined, isRightToLeft: boolean): Nose => {
  switch (side) {
    case 'bottom': {
      return 'top';
    }
    case 'inline-end': {
      return isRightToLeft ? 'right' : 'left';
    }
    case 'inline-start': {
      return isRightToLeft ? 'left' : 'right';
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

// No arrow drawn by the popup.
const unplaceNose = (popup: HTMLElement) => {
  delete popup.dataset.arrow;
  popup.style.removeProperty('--uikit-popover-nose');
  popup.style.removeProperty('--uikit-popover-wedge');
};

// The arrow's side (on both, as `data-arrow`; on the popup, drawn: not
// hidden) and its center along the popup's edge (`--uikit-popover-nose`),
// where Base UI placed it.
const placeNose = (
  arrow: HTMLElement,
  popup: HTMLElement,
  isHidden: boolean,
) => {
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
  if (isHidden) {
    unplaceNose(popup);
    return;
  }
  popup.dataset.arrow = nose;
  popup.style.setProperty('--uikit-popover-nose', `${String(along)}px`);
  popup.style.setProperty('--uikit-popover-wedge', `${String(wedge)}px`);
};

/**
 * Its arrow, pointing at its anchor (moving its popup further out),
 * drawn by its popup: where Base UI places it (its center along the
 * popup's edge, as `--uikit-popover-nose`); shifted so far it can't point
 * at its anchor's center (`data-uncentered`), or over its anchor (not
 * fitting on either side, see `useGrowAvoidance`), hidden (`whenShifted`).
 */
const Arrow = forwardRef<HTMLDivElement, PopoverArrowProps>(
  ({ className, whenShifted = 'hide', ...props }, ref) => {
    const arrowRef = useForwardedRef(ref);
    const setHasArrow = useContext(PopoverContext)?.setHasArrow;
    const isShifted = useContext(ShiftedContext);

    useLayoutEffect(() => {
      const { current: arrow } = arrowRef;
      const popup = arrow?.parentElement;
      if (!arrow || !popup) return undefined;

      const update = () => {
        const isHidden =
          whenShifted === 'hide' &&
          (isShifted || 'uncentered' in arrow.dataset);
        // (Hidden: its popup as close as without one.)
        setHasArrow?.(!isHidden);
        placeNose(arrow, popup, isHidden);
      };
      update();
      const observer = new MutationObserver(update);
      observer.observe(arrow, {
        attributeFilter: ['style', 'data-side', 'data-uncentered'],
        attributes: true,
      });

      return () => {
        observer.disconnect();
        setHasArrow?.(false);
        unplaceNose(popup);
      };
    }, [arrowRef, isShifted, setHasArrow, whenShifted]);

    return (
      // Positioned by Base UI, drawn by the popup (see there; its side as
      // `data-arrow`).
      <BasePopover.Arrow
        ref={arrowRef}
        {...props}
        className={cn('uikit-popover-arrow', className)}
        data-popover-part="arrow"
      />
    );
  },
);

/**
 * Its bar at its top (e.g. a `Toolbar`: its title, a close button), spaced
 * as popovers' are (16px from the top, 10px above the content; the
 * toolbar's row 44px). Optional. Over the body, which scrolls under it (a
 * block-start anchor in the popup's scope, its soft edge effect): the body
 * makes room with a `Viewport.Padding`, as a sheet's content does.
 */
const Header = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ className, edgeEffect = 'soft', edgeTint, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    useAnchorRegistration(ref, 'block-start', undefined, {
      effect: edgeEffect,
      tint: edgeTint,
    });

    return (
      <div
        ref={ref}
        className={cn('uikit-popover-header', className)}
        data-popover-part="header"
        {...props}
      />
    );
  },
);

/**
 * Its content, scrolling inside the popup, as high as the popup may be (the
 * popup itself can't scroll: its material and arrow are drawn around it);
 * a scroller (registered), drawing its header's edge effect (see
 * `Viewport`): beside it, not in it, so its mask (fading it out under the
 * header, see style.css) leaves it be.
 */
const Body = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    // (An overlay's: never what a provider tracks, see Viewport.)
    useScrollerRegistration(ref, true, true);
    // (the current scroller while open, see Viewport's `useCurrentScroller`.)
    useCurrentLayer(ref, 'overlay');

    return (
      <>
        <div
          ref={ref}
          className={cn('uikit-popover-body', className)}
          data-popover-part="body"
          data-viewport-scroller=""
          {...props}
        />
        <EdgeEffects scroller={ref} />
      </>
    );
  },
);

/**
 * A popover (Base UI's `Popover`):
 * a panel of the menus' glass at its trigger (or `anchor`), optionally with
 * an arrow pointing at it.
 */
/**
 * Its portal (Base UI's): no box of its own (\`display: contents\`), so
 * rendered into a container (e.g. a screen laid out as a flex column) it
 * doesn't shift its content.
 */
const Portal = forwardRef<
  HTMLDivElement,
  Omit<BasePopover.Portal.Props, 'ref'>
>(({ className, container, ...props }, ref) => (
  <BasePopover.Portal
    ref={ref}
    {...useSettingsPortalProps()}
    container={usePortalContainer(container)}
    {...props}
    className={cn('uikit-popover-portal', className)}
  />
));

export const Popover = {
  ...BasePopover,
  Root,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Header,
  Body,
  createHandle,
};
