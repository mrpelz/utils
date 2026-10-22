import '../glass/style.css';
import '../menu/style.css';
import '../alert/style.css';
import './style.css';

import { Popover as BasePopover } from '@base-ui/react/popover';
import {
  ComponentProps,
  createContext,
  forwardRef,
  ReactElement,
  RefObject,
  useContext,
  useMemo,
  useState,
} from 'react';

import { cn } from '../utils/main.js';
import type {
  ActionSheetActionProps,
  ActionSheetHandle,
  ActionSheetPopupProps,
} from './props.js';

export type {
  ActionSheetActionProps,
  ActionSheetActionVariant,
  ActionSheetHandle,
  ActionSheetPopupProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Action Sheets”): an alert's panel (see
// `Alert`) of a title and description and its actions, stacked (Secondary
// and Destructive types: on a gray fill, the label's color, red). As iOS
// 26's: at the control that presented it (below it, above it if there's no
// room; Base UI's `Popover`, positioned as a popover without an arrow,
// scaling in from it as menus); presented without one (e.g. by `open`), at
// its container's bottom, above its safe area. Modal: the page dimmed
// behind it (Figma has none), dismissed by a press outside it.
//
// iPad shows action sheets as popovers (with an arrow): the app's choice
// (see `Popover`).

// The trigger it opened from (its change's), if any (see `Popup`).
const ActionSheetContext = createContext<Element | null>(null);

const Root = <Payload,>({
  modal = true,
  onOpenChange,
  onOpenChangeComplete,
  ...props
}: BasePopover.Root.Props<Payload>): ReactElement => {
  const [trigger, setTrigger] = useState<Element | null>(null);

  return (
    <ActionSheetContext.Provider value={trigger}>
      <BasePopover.Root
        modal={modal}
        {...props}
        onOpenChange={(open, eventDetails) => {
          if (open) setTrigger(eventDetails.trigger ?? null);
          onOpenChange?.(open, eventDetails);
        }}
        onOpenChangeComplete={(open) => {
          // (Closed: presented anew, by a trigger or not.)
          if (!open) setTrigger(null);
          onOpenChangeComplete?.(open);
        }}
      />
    </ActionSheetContext.Provider>
  );
};

/** An element of a portal's container (its ref's, or the document's). */
const containerElement = (
  container: ActionSheetPopupProps['container'],
): Element => {
  const element =
    container && 'current' in container
      ? (container as RefObject<Element | null>).current
      : container;
  return element instanceof Element ? element : document.documentElement;
};

/**
 * Its anchor without a trigger: its container's bottom center, above its
 * safe area (the container's `--uikit-safe-area-inset-bottom`, if any).
 */
const bottomAnchor = (container: ActionSheetPopupProps['container']) => ({
  getBoundingClientRect: () => {
    const element = containerElement(container);
    const box =
      element === document.documentElement
        ? new DOMRect(0, 0, innerWidth, innerHeight)
        : element.getBoundingClientRect();
    const inset =
      Number.parseFloat(
        getComputedStyle(element).getPropertyValue(
          '--uikit-safe-area-inset-bottom',
        ),
      ) || 0;
    return new DOMRect(box.left + box.width / 2, box.bottom - inset, 0, 0);
  },
});

/**
 * The sheet at its trigger (or its container's bottom), the page dimmed
 * behind it, in its portal.
 */
const Popup = forwardRef<HTMLDivElement, ActionSheetPopupProps>(
  ({ className, container, ...props }, ref) => {
    const trigger = useContext(ActionSheetContext);
    const bottom = useMemo(() => bottomAnchor(container), [container]);
    // Within its container, if one (e.g. the views' frames).
    const boundary = container ? containerElement(container) : undefined;

    return (
      <BasePopover.Portal
        className="uikit-alert-portal"
        container={container}
      >
        <BasePopover.Backdrop
          className="uikit-action-sheet-backdrop uikit-alert-backdrop"
          data-action-sheet-part="backdrop"
        />
        <BasePopover.Positioner
          anchor={trigger ? undefined : bottom}
          className="uikit-action-sheet-positioner"
          collisionBoundary={boundary}
          collisionPadding={8}
          side={trigger ? 'bottom' : 'top'}
          sideOffset={8}
        >
          <BasePopover.Popup
            ref={ref}
            {...props}
            data-action-sheet-part="popup"
            className={cn(
              'uikit-action-sheet-popup uikit-alert-panel uikit-glass-medium uikit-popup-transition',
              className,
            )}
          />
        </BasePopover.Positioner>
      </BasePopover.Portal>
    );
  },
);

/** Its title and description (as an alert's, see `Alert.Header`). */
const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-action-sheet-part="header"
      {...props}
      className={cn('uikit-action-sheet-header uikit-alert-header', className)}
    />
  ),
);

const Title = forwardRef<
  HTMLHeadingElement,
  Omit<ComponentProps<typeof BasePopover.Title>, 'ref'>
>(({ className, ...props }, ref) => (
  <BasePopover.Title
    ref={ref}
    className={cn('uikit-action-sheet-title uikit-alert-title', className)}
    data-action-sheet-part="title"
    {...props}
  />
));

const Description = forwardRef<
  HTMLParagraphElement,
  Omit<ComponentProps<typeof BasePopover.Description>, 'ref'>
>(({ className, ...props }, ref) => (
  <BasePopover.Description
    ref={ref}
    data-action-sheet-part="description"
    className={cn(
      'uikit-action-sheet-description uikit-alert-description',
      className,
    )}
    {...props}
  />
));

const Actions = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-action-sheet-actions', className)}
      data-action-sheet-part="actions"
      {...props}
    />
  ),
);

/** An action, closing the sheet. */
const Action = forwardRef<HTMLButtonElement, ActionSheetActionProps>(
  ({ className, variant = 'secondary', ...props }, ref) => (
    <BasePopover.Close
      ref={ref}
      data-action-sheet-part="action"
      data-variant={variant}
      {...props}
      className={cn('uikit-action-sheet-action uikit-alert-action', className)}
    />
  ),
);

/**
 * A handle linking an action sheet to its triggers outside it, and opening
 * or closing it imperatively (Base UI's `Popover.createHandle`): pass it to
 * the root's and the triggers' `handle` (in a component, see
 * `useCreateActionSheetHandle`).
 */
const createHandle = <Payload = unknown,>(): ActionSheetHandle<Payload> =>
  BasePopover.createHandle<Payload>();

/** `ActionSheet.createHandle`, in a component: made once, for its lifetime. */
export const useCreateActionSheetHandle = <
  Payload = unknown,
>(): ActionSheetHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());
  return handle;
};

/**
 * An action sheet (UIKit `UIAlertController`, style `actionSheet`; Base
 * UI's `Popover`, modal): choices for an action, at the control that
 * presented it.
 */
export const ActionSheet = {
  ...BasePopover,
  Root,
  Popup,
  Header,
  Title,
  Description,
  Actions,
  Action,
  createHandle,
};
