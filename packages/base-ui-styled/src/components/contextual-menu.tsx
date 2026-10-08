import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import {
  createContext,
  CSSProperties,
  forwardRef,
  ReactNode,
  Ref,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { Menu, MenuRootProps, MenuTrigger } from './menu.js';
import { useForwardedRef } from './utils.js';

// A contextual menu (UIKit `UIContextMenuInteraction`): a trigger and its
// `Menu`, below it. Opening, the trigger is lifted (above a blurred
// `Backdrop`) as far as the menu needs to fit below it in the viewport, and
// can turn into a `Preview` of what the menu acts on (e.g. a photo to
// share), shown in its place, lifted with it; closing, it settles back.
// Source: behavior after iOS (Figma: menus only, see `Menu`).
//
// Deviations:
// - The trigger lifts by a translation (and above the page by a
//   `z-index`): in stacking contexts of its ancestors, it can't rise above
//   the backdrop.
// - Opened as Base UI menus are (a press; on touch already on touch down,
//   see `MenuTrigger`), not by a long press.
// - The preview takes no pointer events (iOS: pressing it commits).

/** The gap between the lifted trigger and the menu, and the viewport. */
const gap = 8;
const margin = 8;

type Box = { height: number; left: number; top: number; width: number };

type Align = 'center' | 'end' | 'start';

type ContextualMenuContextValue = {
  align: Align;
  /** The lifted box (the trigger's, or the preview's) at its lifted place. */
  anchor?: {
    contextElement?: Element;
    getBoundingClientRect: () => DOMRect;
  };
  /** The lifted box (the trigger's, or the preview's) before lifting. */
  box?: Box;
  lift: number;
  open: boolean;
  origin?: Box;
  preview: boolean;
  setAlign: (align: Align) => void;
  setPopupHeight: (height: number) => void;
  setPreviewSize: (size: { height: number; width: number } | undefined) => void;
  triggerRef: { current: HTMLElement | null };
};

const ContextualMenuContext = createContext<ContextualMenuContextValue>({
  align: 'center',
  lift: 0,
  open: false,
  preview: false,
  setAlign: () => undefined,
  setPopupHeight: () => undefined,
  setPreviewSize: () => undefined,
  triggerRef: { current: null },
});

/**
 * How far a box (`top`, `height`) lifts for a menu below it to fit, never
 * leaving the viewport (negative: moved down, e.g. scrolled partly above).
 */
const liftFor = (top: number, height: number, menu: number) => {
  const fitting = window.innerHeight - margin - menu - gap - height;
  return top - Math.max(margin, Math.min(top, fitting));
};

/**
 * The lifted box for the trigger's (`trigger`): the preview's (from the
 * trigger's top, aligned to it as the menu is, within the viewport), or the
 * trigger's.
 */
const boxOf = (
  trigger: Box,
  preview: { height: number; width: number } | undefined,
  align: Align,
  rtl: boolean,
): Box => {
  if (!preview) return trigger;
  const start = rtl
    ? trigger.left + trigger.width - preview.width
    : trigger.left;
  const end = rtl ? trigger.left : trigger.left + trigger.width - preview.width;
  const left = {
    center: trigger.left + trigger.width / 2 - preview.width / 2,
    end,
    start,
  }[align];

  return {
    ...preview,
    left: Math.max(
      margin,
      Math.min(left, window.innerWidth - margin - preview.width),
    ),
    top: trigger.top,
  };
};

const isRtl = (element: Element | null) =>
  element ? getComputedStyle(element).direction === 'rtl' : false;

export type ContextualMenuRootProps = MenuRootProps;

/**
 * The contextual menu: its `Trigger` (and optional `Preview`), and its menu
 * (`Portal` with a `Backdrop`, `Positioner`, `Popup`, items).
 */
const Root = ({
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: ContextualMenuRootProps): ReactNode => {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const triggerRef = useRef<HTMLElement | null>(null);
  // The trigger's box when it opened (unlifted).
  const [origin, setOrigin] = useState<(Box & { rtl: boolean }) | undefined>(
    undefined,
  );
  const [popupHeight, setPopupHeight] = useState(0);
  const [previewSize, setPreviewSize] = useState<
    { height: number; width: number } | undefined
  >(undefined);
  // The menu's alignment (see `Positioner`), also the preview's.
  const [align, setAlign] = useState<Align>('center');

  // Opening, the trigger's box, before it lifts.
  const [opened, setOpened] = useState(open);
  if (opened !== open) {
    setOpened(open);
    if (!open) setOrigin(undefined);
  }
  useLayoutEffect(() => {
    const { current: trigger } = triggerRef;
    if (!open || origin || !trigger) return;
    const { height, left, top, width } = trigger.getBoundingClientRect();
    setOrigin({ height, left, rtl: isRtl(trigger), top, width });
  }, [open, origin]);

  const box = origin && boxOf(origin, previewSize, align, origin.rtl);
  const lift = open && box ? liftFor(box.top, box.height, popupHeight) : 0;

  const value = useMemo<ContextualMenuContextValue>(
    () => ({
      // Where the trigger is now (e.g. scrolled), lifted.
      anchor: {
        // Tracked (scroll containers, layout shifts) as the trigger.
        get contextElement() {
          return triggerRef.current ?? undefined;
        },
        getBoundingClientRect: () => {
          const { current: trigger } = triggerRef;
          const now = boxOf(
            trigger?.getBoundingClientRect() ?? new DOMRect(),
            previewSize,
            align,
            isRtl(trigger),
          );
          return new DOMRect(now.left, now.top - lift, now.width, now.height);
        },
      },
      align,
      box,
      lift,
      open,
      origin,
      preview: previewSize !== undefined,
      setAlign,
      setPopupHeight,
      setPreviewSize,
      triggerRef,
    }),
    [align, box, lift, open, origin, previewSize],
  );

  return (
    <ContextualMenuContext.Provider value={value}>
      <Menu.Root
        {...props}
        open={open}
        onOpenChange={(next, details) => {
          // Released off the trigger (it lifted away under the pointer):
          // open all the same, as iOS's stays open as the finger lifts.
          if (!next && details.reason === 'cancel-open') {
            details.cancel();
            return;
          }
          setOpenState(next);
          onOpenChange?.(next, details);
        }}
      />
    </ContextualMenuContext.Provider>
  );
};

// Lifted: above the page (and the backdrop), its trigger moved up as far
// as needed (the wrapper stays, for the menu's anchor); with a preview,
// hidden behind it.
const StyledTrigger = styled('span', forwardRef)`
  display: inline-flex;

  & > * {
    transition-duration: 300ms;
    transition-property: translate, opacity;
    transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
    translate: 0 calc(var(--styled-contextual-lift, 0) * -1px);
  }

  &[data-lifted] {
    position: relative;
    z-index: 1;
  }

  &[data-previewed] > * {
    opacity: 0;
  }
`;

export type ContextualMenuTriggerProps = Omit<BaseMenu.Trigger.Props, 'ref'>;

/**
 * What the menu is about (e.g. a `Button.Root`, rendered by `render`): it
 * opens the menu, lifting as far as the menu needs.
 */
const Trigger = forwardRef<HTMLElement, ContextualMenuTriggerProps>(
  (props, forwardedRef) => {
    const { lift, open, preview, triggerRef } = useContext(
      ContextualMenuContext,
    );
    const ref = useForwardedRef(forwardedRef);

    return (
      <StyledTrigger
        ref={(element: HTMLElement | null) => {
          triggerRef.current = element;
        }}
        data-lifted={open ? '' : undefined}
        data-previewed={open && preview ? '' : undefined}
        style={{ '--styled-contextual-lift': lift } as CSSProperties}
      >
        <MenuTrigger
          ref={ref as Ref<HTMLElement>}
          {...props}
        />
      </StyledTrigger>
    );
  },
);

// Over the page and the backdrop, at the lifted place; scaling in from the
// trigger's top.
const StyledPreview = styled('div', forwardRef)`
  position: fixed;
  z-index: 1;
  max-width: calc(100vw - ${2 * margin}px);
  max-height: calc(100vh - ${2 * margin}px);

  /* Shown as the trigger is pressed: the release is the trigger's (Base UI
     cancels opening a menu released elsewhere). */
  pointer-events: none;
  transition-duration: 300ms;
  transition-property: translate, scale, opacity;
  transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
  translate: 0 calc(var(--styled-contextual-lift, 0) * -1px);

  @starting-style {
    opacity: 0;
    scale: 0.8;
  }
`;

export type ContextualMenuPreviewProps = React.ComponentProps<'div'>;

/**
 * What the trigger turns into while the menu is open (e.g. the content the
 * menu acts on), in its place (aligned as the menu, see `Positioner`),
 * lifted with it, always in the viewport (at most as large).
 */
const Preview = forwardRef<HTMLDivElement, ContextualMenuPreviewProps>(
  ({ style, ...props }, forwardedRef) => {
    const { align, box, lift, open, origin, setPreviewSize } = useContext(
      ContextualMenuContext,
    );
    const ref = useForwardedRef(forwardedRef);

    useLayoutEffect(() => {
      const { current: preview } = ref;
      if (!open || !preview) return undefined;
      const measure = () =>
        setPreviewSize({
          height: preview.offsetHeight,
          width: preview.offsetWidth,
        });
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(preview);
      return () => {
        observer.disconnect();
        setPreviewSize(undefined);
      };
    }, [open, ref, setPreviewSize]);

    if (!open || !origin) return null;

    return createPortal(
      <StyledPreview
        ref={ref}
        {...props}
        style={
          {
            '--styled-contextual-lift': lift,
            // Measured, at its place; not yet, at the trigger's.
            left: `${String((box ?? origin).left)}px`,
            top: `${String(origin.top)}px`,
            transformOrigin: `top ${{ center: 'center', end: 'right', start: 'left' }[align]}`,
            ...(typeof style === 'object' && style),
          } as CSSProperties
        }
      />,
      document.body,
    );
  },
);

// iOS: the page blurred and dimmed behind the lifted trigger and the menu.
const Backdrop = styled(BaseMenu.Backdrop, forwardRef)`
  position: fixed;
  backdrop-filter: blur(12px);
  background-color: rgb(0 0 0 / 15%);
  inset: 0;
  transition: opacity 300ms;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

export type ContextualMenuPositionerProps = Omit<
  BaseMenu.Positioner.Props,
  'anchor' | 'ref' | 'side'
>;

/** The menu's place: below the lifted trigger (or preview). */
const Positioner = forwardRef<HTMLDivElement, ContextualMenuPositionerProps>(
  (props, ref) => {
    const { anchor, setAlign } = useContext(ContextualMenuContext);
    const align = props.align ?? 'center';
    useLayoutEffect(() => setAlign(align), [align, setAlign]);

    return (
      <Menu.Positioner
        ref={ref}
        align="center"
        anchor={anchor}
        collisionAvoidance={{ align: 'shift', side: 'none' }}
        side="bottom"
        sideOffset={gap}
        {...props}
      />
    );
  },
);

export type ContextualMenuPopupProps = Omit<BaseMenu.Popup.Props, 'ref'>;

/** The menu (its height decides how far the trigger lifts). */
const Popup = forwardRef<HTMLDivElement, ContextualMenuPopupProps>(
  (props, forwardedRef) => {
    const { setPopupHeight } = useContext(ContextualMenuContext);
    const ref = useForwardedRef(forwardedRef);

    useLayoutEffect(() => {
      const { current: popup } = ref;
      if (!popup) return undefined;
      setPopupHeight(popup.scrollHeight);
      return () => setPopupHeight(0);
    }, [ref, setPopupHeight]);

    return (
      <Menu.Popup
        ref={ref}
        {...props}
      />
    );
  },
);

export const ContextualMenu = {
  ...Menu,
  Root,
  Trigger,
  Preview,
  Backdrop,
  Positioner,
  Popup,
};
