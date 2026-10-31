import '../menu/style.css';
import './style.css';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import {
  ComponentProps,
  createContext,
  CSSProperties,
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { Menu, MenuTrigger } from '../menu/main.js';
import { cn, useForwardedRef } from '../utils/main.js';
import type {
  ContextualMenuContextValue,
  ContextualMenuHandle,
  ContextualMenuPopupProps,
  ContextualMenuPortalProps,
  ContextualMenuPositionerProps,
  ContextualMenuPreviewProps,
  ContextualMenuRootProps,
  ContextualMenuTriggerProps,
} from './props.js';

export type {
  ContextualMenuHandle,
  ContextualMenuPopupProps,
  ContextualMenuPortalProps,
  ContextualMenuPositionerProps,
  ContextualMenuPreviewProps,
  ContextualMenuRootProps,
  ContextualMenuTriggerProps,
} from './props.js';

// A contextual menu: a trigger and its
// `Menu`, below it. Opening, what the menu is about is lifted with it, above
// a blurred `Backdrop`: a `Preview` of it (e.g. a photo to share), or the
// trigger itself.
//
// The preview and the menu are one popup (its `Positioner`): a stack, its
// preview's slot first, placed from the trigger's place (its top, aligned
// to it as the menu is), shifted as far as the stack needs to fit (as
// menus grow, see `useGrowAvoidance`), within its portal's container (a
// device's screen, e.g. the views' frames), clear of its safe area. Taller
// than that, the menu scrolls; the preview takes at most what's left of
// the room beside the menu (or, the menu taller, half of it).
//
// Also:
// - Without a `Preview`, the live trigger is lifted onto the preview's slot
//   (a translation, following it, and above the page by a `z-index`): in
//   stacking contexts of its ancestors, it can't rise above the backdrop
//   (there, give it a `Preview`).
// - Opened as Base UI menus are (a press; on touch already on touch down,
//   see `MenuTrigger`), not by a long press.
// - The preview takes no pointer events.

const ContextualMenuContext = createContext<ContextualMenuContextValue>({
  isOpen: false,
  isPreview: false,
  setBackdrop: () => undefined,
  setIsPreview: () => undefined,
  setSlot: () => undefined,
  triggerRef: { current: null },
});

/**
 * The contextual menu: its `Trigger` (and optional `Preview`), and its menu
 * (`Portal` with a `Backdrop`, `Positioner`, `Popup`, items).
 */
const Root = <Payload,>({
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: ContextualMenuRootProps<Payload>): ReactNode => {
  const [isOpenState, setIsOpenState] = useState(defaultOpen);
  const isOpen = openProp ?? isOpenState;
  const triggerRef = useRef<HTMLElement | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  // The preview's slot in the positioned stack (see `Positioner`), shown.
  const [slot, setSlot] = useState<HTMLElement | undefined>(undefined);
  const [backdrop, setBackdrop] = useState<HTMLElement | undefined>(undefined);

  const value = useMemo<ContextualMenuContextValue>(
    () => ({
      backdrop,
      isOpen,
      isPreview,
      setBackdrop,
      setIsPreview,
      setSlot,
      slot,
      triggerRef,
    }),
    [backdrop, isOpen, isPreview, slot],
  );

  return (
    <ContextualMenuContext.Provider value={value}>
      <Menu.Root
        {...props}
        open={isOpen}
        onOpenChange={(isNextOpen, details) => {
          // Released off the trigger (it lifted away under the pointer):
          // open all the same, staying open as the finger lifts.
          if (!isNextOpen && details.reason === 'cancel-open') {
            details.cancel();
            return;
          }
          setIsOpenState(isNextOpen);
          onOpenChange?.(isNextOpen, details);
        }}
      />
    </ContextualMenuContext.Provider>
  );
};

/**
 * The backdrop with a hole where an element is (its box, its corners'
 * radii), so it shows through: a mask (also its blur's, which a clip path
 * leaves whole), an even-odd path of the backdrop's box, then the
 * element's.
 */
const cutOut = (backdrop: HTMLElement, element: Element) => {
  const outer = backdrop.getBoundingClientRect();
  const { height, left, top, width } = element.getBoundingClientRect();
  const x = left - outer.left;
  const y = top - outer.top;
  const radius = Math.min(
    Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0,
    width / 2,
    height / 2,
  );
  const n = (value: number) => String(Math.round(value * 100) / 100);
  const r = n(radius);
  const path = [
    `M0 0H${n(outer.width)}V${n(outer.height)}H0Z`,
    `M${n(x + radius)} ${n(y)}H${n(x + width - radius)}`,
    `A${r} ${r} 0 0 1 ${n(x + width)} ${n(y + radius)}`,
    `V${n(y + height - radius)}`,
    `A${r} ${r} 0 0 1 ${n(x + width - radius)} ${n(y + height)}`,
    `H${n(x + radius)}`,
    `A${r} ${r} 0 0 1 ${n(x)} ${n(y + height - radius)}`,
    `V${n(y + radius)}`,
    `A${r} ${r} 0 0 1 ${n(x + radius)} ${n(y)}Z`,
  ].join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${n(outer.width)}" height="${n(outer.height)}"><path fill-rule="evenodd" d="${path}"/></svg>`;
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const { style } = backdrop;
  style.setProperty('mask', `${mask} 0 0 / 100% 100% no-repeat`);
  style.setProperty('-webkit-mask', `${mask} 0 0 / 100% 100% no-repeat`);
};

/** The backdrop whole again (see `cutOut`). */
const fillIn = (backdrop: HTMLElement) => {
  backdrop.style.removeProperty('mask');
  backdrop.style.removeProperty('-webkit-mask');
};

/**
 * What the menu is about (e.g. a `Button.Root`, rendered by `render`): it
 * opens the menu; without a `Preview`, it's lifted onto the preview's slot.
 */
const Trigger = forwardRef<HTMLElement, ContextualMenuTriggerProps>(
  (props, forwardedRef) => {
    const { backdrop, isOpen, isPreview, slot, triggerRef } = useContext(
      ContextualMenuContext,
    );
    const ref = useForwardedRef(forwardedRef);
    const wrapperRef = useRef<HTMLSpanElement | null>(null);

    // Lifted: onto the slot, following it (as it's placed, shifted, its
    // trigger scrolled) while open; closed, back. Seen through the backdrop
    // where it is (its cutout, in its shape: above the backdrop by its
    // `z-index` only outside its ancestors' stacking contexts, e.g. a
    // `Viewport`'s layers'), until the backdrop's gone.
    useLayoutEffect(() => {
      const { current: wrapper } = wrapperRef;
      if (!wrapper) return undefined;
      const { style } = wrapper;
      const isLifted = isOpen && !isPreview && slot !== undefined;
      if (!isLifted) {
        style.removeProperty('--uikit-contextual-menu-lift-x');
        style.removeProperty('--uikit-contextual-menu-lift-y');
      }
      if (isPreview || (!isLifted && !backdrop)) return undefined;
      let frame = 0;
      const follow = () => {
        const from = wrapper.getBoundingClientRect();
        // (Once placed: until then, Base UI's positioner is hidden at a
        // provisional place.)
        if (isLifted && slot.parentElement?.style.opacity !== '0') {
          const to = slot.getBoundingClientRect();
          style.setProperty(
            '--uikit-contextual-menu-lift-x',
            `${String(to.left - from.left)}px`,
          );
          style.setProperty(
            '--uikit-contextual-menu-lift-y',
            `${String(to.top - from.top)}px`,
          );
        }
        const { current: trigger } = ref;
        if (backdrop && trigger) cutOut(backdrop, trigger);
        frame = requestAnimationFrame(follow);
      };
      follow();
      return () => {
        cancelAnimationFrame(frame);
        if (backdrop) fillIn(backdrop);
      };
    }, [backdrop, isOpen, isPreview, ref, slot]);

    return (
      // Lifted: above the page (and the backdrop), its trigger moved (the
      // wrapper stays, for the menu's anchor); with a preview, hidden behind
      // it.
      <span
        ref={(element: HTMLSpanElement | null) => {
          wrapperRef.current = element;
          triggerRef.current = element;
        }}
        className="uikit-contextual-menu-trigger"
        data-contextual-menu-part="trigger"
        data-lifted={isOpen && !isPreview ? '' : undefined}
        data-previewed={isOpen && isPreview ? '' : undefined}
      >
        <MenuTrigger
          ref={ref as Ref<HTMLElement>}
          {...props}
        />
      </span>
    );
  },
);

/**
 * What the trigger turns into while the menu is open (e.g. the content the
 * menu acts on): in the preview's slot, above the menu (aligned as it is),
 * scaling in from the trigger's place.
 */
const Preview = forwardRef<HTMLDivElement, ContextualMenuPreviewProps>(
  ({ className, ...props }, ref) => {
    const { isOpen, setIsPreview, slot } = useContext(ContextualMenuContext);

    useLayoutEffect(() => {
      setIsPreview(true);
      return () => setIsPreview(false);
    }, [setIsPreview]);

    if (!isOpen || !slot) return null;

    return createPortal(
      <div
        ref={ref}
        {...props}
        className={cn('uikit-contextual-menu-preview', className)}
        data-contextual-menu-part="preview"
      />,
      slot,
    );
  },
);

/** The menu's portal (a `Menu`'s): into its `container`, e.g. a screen. */
const Portal = forwardRef<HTMLDivElement, ContextualMenuPortalProps>(
  (props, ref) => (
    <Menu.Portal
      ref={ref}
      {...props}
    />
  ),
);

// The page blurred and dimmed behind the lifted trigger and the menu.
// (Registered: cut out where the lifted trigger is, see `Trigger`.)
const Backdrop = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseMenu.Backdrop>, 'ref'>
>(({ className, ...props }, forwardedRef) => {
  const { setBackdrop } = useContext(ContextualMenuContext);
  const ref = useForwardedRef(forwardedRef);
  const backdropRef = useCallback(
    (element: HTMLDivElement | null) => {
      ref.current = element;
      setBackdrop(element ?? undefined);
    },
    [ref, setBackdrop],
  );

  return (
    <BaseMenu.Backdrop
      ref={backdropRef}
      className={cn('uikit-contextual-menu-backdrop', className)}
      data-contextual-menu-part="backdrop"
      {...props}
    />
  );
});

/** Its stack's sizes, as custom properties (see style.css). */
const useStackSizes = (
  positionerRef: { current: HTMLElement | null },
  slot: HTMLElement | undefined,
) => {
  useLayoutEffect(() => {
    const { current: positioner } = positionerRef;
    if (!positioner || !slot) return undefined;
    const measure = () => {
      const popup = positioner.querySelector('.uikit-menu-popup');
      positioner.style.setProperty(
        '--uikit-contextual-menu-slot',
        `${String(slot.offsetHeight)}px`,
      );
      positioner.style.setProperty(
        '--uikit-contextual-menu-popup',
        `${String(popup?.scrollHeight ?? 0)}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slot);
    const popup = positioner.querySelector('.uikit-menu-popup');
    if (popup) observer.observe(popup);
    return () => observer.disconnect();
  }, [positionerRef, slot]);
};

/**
 * The stack's place: from the trigger's top (aligned to it, `align`),
 * shifted to fit; the preview's slot, then the menu.
 */
const Positioner = forwardRef<HTMLDivElement, ContextualMenuPositionerProps>(
  ({ align = 'center', children, className, ...props }, forwardedRef) => {
    const { isPreview, setSlot, slot, triggerRef } = useContext(
      ContextualMenuContext,
    );
    const ref = useForwardedRef(forwardedRef);
    // Without a preview, the slot is the trigger's size (it's lifted onto
    // it, see `Trigger`).
    const [size, setSize] = useState<
      { height: number; width: number } | undefined
    >(undefined);
    useLayoutEffect(() => {
      const { current: trigger } = triggerRef;
      if (isPreview || !trigger) return;
      const { height, width } = trigger.getBoundingClientRect();
      setSize({ height, width });
    }, [isPreview, triggerRef]);
    const slotRef = useCallback(
      (element: HTMLDivElement | null) => setSlot(element ?? undefined),
      [setSlot],
    );
    useStackSizes(ref, slot);

    return (
      <Menu.Positioner
        ref={ref}
        align={align}
        anchor={triggerRef}
        // (Shifted: its stack covers the trigger's place by design.)
        collisionAvoidance={{ align: 'shift', side: 'shift' }}
        side="block-end"
        sideOffset={({ anchor }) => -anchor.height}
        {...props}
        className={cn('uikit-contextual-menu-positioner', className)}
      >
        <div
          ref={slotRef}
          className="uikit-contextual-menu-slot"
          data-contextual-menu-part="slot"
          style={
            isPreview || !size
              ? undefined
              : ({
                  height: `${String(size.height)}px`,
                  width: `${String(size.width)}px`,
                } satisfies CSSProperties)
          }
        />
        {children}
      </Menu.Positioner>
    );
  },
);

/** The menu (below the preview's slot; taller than its room, it scrolls). */
const Popup = forwardRef<HTMLDivElement, ContextualMenuPopupProps>(
  (props, ref) => (
    <Menu.Popup
      ref={ref}
      {...props}
    />
  ),
);

/**
 * A handle opening or closing the menu imperatively (Base UI's
 * `Menu.createHandle`): pass it to the root's and its trigger's `handle`
 * (its trigger inside the root, to lift; in a component, see
 * `useCreateContextualMenuHandle`).
 */
const createHandle = <Payload = unknown,>(): ContextualMenuHandle<Payload> =>
  BaseMenu.createHandle<Payload>();

/** `ContextualMenu.createHandle`, in a component: made once. */
export const useCreateContextualMenuHandle = <
  Payload = unknown,
>(): ContextualMenuHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());
  return handle;
};

export const ContextualMenu = {
  ...Menu,
  Root,
  createHandle,
  Trigger,
  Preview,
  Portal,
  Backdrop,
  Positioner,
  Popup,
};
