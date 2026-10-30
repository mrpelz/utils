import './style.css';

import { Field as BaseField } from '@base-ui/react/field';
import {
  ComponentProps,
  forwardRef,
  MouseEvent,
  PointerEvent,
  ReactNode,
  useId,
  useState,
} from 'react';

import { cn, isKeyboardFocus } from '../utils/main.js';
import type { ClearProps } from './props.js';

// Text fields, light and dark, in the semantic colors: 52px rows (padding
// 0 16px),
// the value in 17px at 510 (20px line height, Body's tracking) in `label`,
// the placeholder in `placeholderText`, a 2px caret in the tint, the clear
// button (17px) in `tertiaryLabel` while focused and filled. Messages
// follow Framework7 (`components/input/input.less`,
// `input-ios.less`, `input-vars.less`): info (`Description`) and error
// messages in 12px below, invalid text in `systemRed`, disabled at 55%.
//
// A Base UI field: in a list row (`Root` rendering a
// `List.Item`), the label is the row's title and the control fills the rest
// of the row, the description and error below (see `List`); elsewhere, the
// parts stack. A textarea renders through `Control`'s `render`.
//
// Also:
// - No outlined style (Framework7 `.input-outline`).
// - Labels are inline in rows, in Body (Framework7's iOS theme: 12px labels
//   above the input, `.item-label`); standalone,
//   they're above, in Subheadline.
// - Info and errors are in Caption 1 (12/16px, Framework7: 12px, 1.4).
// - The caret is the browser's.
// - The clear button is a circled cross, cut out of the circle, with a 44px
//   hit area.

/** A field (Base UI); rendering a `List.Item`, a list row. */
const Root = forwardRef<HTMLDivElement, Omit<BaseField.Root.Props, 'ref'>>(
  ({ className, ...props }, ref) => (
    // Standalone, the parts stack (not as a list row, see `List`).
    <BaseField.Root
      ref={ref}
      data-text-field-part="root"
      {...props}
      className={cn('uikit-text-field-root', className)}
    />
  ),
);

const Label = forwardRef<HTMLElement, Omit<BaseField.Label.Props, 'ref'>>(
  ({ className, ...props }, ref) => (
    <BaseField.Label
      ref={ref}
      data-text-field-part="label"
      {...props}
      className={cn('uikit-text-field-label', className)}
    />
  ),
);

const Control = forwardRef<HTMLElement, Omit<BaseField.Control.Props, 'ref'>>(
  ({ className, ...props }, ref) => (
    // Framework7 `.item-input-wrap input`: no box of its own.
    // The value: 17px, 510, 20px line height.
    <BaseField.Control
      ref={ref}
      data-text-field-part="control"
      {...props}
      className={cn('uikit-text-field-control', className)}
    />
  ),
);

/** Framework7 `.input-info`. */
const Description = forwardRef<
  HTMLParagraphElement,
  Omit<BaseField.Description.Props, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseField.Description
    ref={ref}
    data-text-field-part="description"
    {...props}
    className={cn('uikit-text-field-description', className)}
  />
));

/** Framework7 `.input-error-message`; shown while the field is invalid. */
const ErrorMessage = forwardRef<
  HTMLDivElement,
  Omit<BaseField.Error.Props, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseField.Error
    ref={ref}
    data-text-field-part="error"
    {...props}
    className={cn('uikit-text-field-error', className)}
  />
));

// The value setter of the control's element type (bypassing React's
// tracking, so the following input event reports the change).
const setValue = (control: HTMLInputElement | HTMLTextAreaElement) => {
  const prototype =
    control instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(control, '');
  control.dispatchEvent(new Event('input', { bubbles: true }));
};

/**
 * Empties the field's control (as typing would, so its change handlers run),
 * focusing it; shown while it's filled, and (`mode`) while
 * it's focused, while it isn't, or always.
 */
const Clear = forwardRef<HTMLButtonElement, ClearProps>(
  (
    {
      className,
      children,
      mode = 'whileEditing',
      onClick,
      onPointerDown,
      ...props
    },
    ref,
  ) => {
    const mask = useId();

    return (
      // Shown while the field is filled, and (`mode`) focused or not
      // (Framework7 `.input-clear-button`, `.input-with-value`); its hit area
      // is 44px.
      <button
        ref={ref}
        aria-label="Clear text"
        data-mode={mode}
        data-text-field-part="clear"
        tabIndex={-1}
        type="button"
        {...props}
        className={cn('uikit-text-field-clear', className)}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          (onClick as ((clickEvent: typeof event) => void) | undefined)?.(
            event,
          );
          if (event.defaultPrevented) return;

          const control = event.currentTarget
            .closest('[data-text-field-part=root]')
            ?.querySelector('[data-text-field-part=control]');
          if (
            !(control instanceof HTMLInputElement) &&
            !(control instanceof HTMLTextAreaElement)
          ) {
            return;
          }
          setValue(control);
          control.focus();
        }}
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
          (
            onPointerDown as ((pointerEvent: typeof event) => void) | undefined
          )?.(event);
          // The control keeps focus.
          event.preventDefault();
        }}
      >
        {(children as ReactNode) ?? (
          <svg
            aria-hidden="true"
            height="17"
            viewBox="0 0 17 17"
            width="17"
          >
            <mask id={mask}>
              <rect
                fill="#fff"
                height="17"
                width="17"
              />
              <path
                d="M5.5 5.5l6 6M11.5 5.5l-6 6"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.6"
              />
            </mask>
            <circle
              cx="8.5"
              cy="8.5"
              fill="currentcolor"
              mask={`url(#${typeof CSS === 'object' ? CSS.escape(mask) : mask})`}
              r="8.5"
            />
          </svg>
        )}
      </button>
    );
  },
);

/**
 * A search field's capsule: its symbol, a
 * `TextField.Control` (e.g. `type="search"`), and its buttons.
 */
const Search = forwardRef<HTMLLabelElement, ComponentProps<'label'>>(
  ({ className, onBlur, onFocus, ...props }, ref) => {
    // Focused by keyboard, or by a pointer (pressed anywhere: also beside
    // it, see `preventFocusShift`).
    const [isKeyboard, setIsKeyboard] = useState(false);

    return (
      // A search field (sidebars, toolbars): a capsule (36px high, on the
      // tertiary fill, 10px in) of a magnifier symbol (the secondary label
      // color), the field (Body, regular), and e.g. a dictation button; pressed
      // anywhere, it focuses the field (a label). In a sidebar (see `Sidebar`):
      // 44px high, on the secondary fill, 11px in, its parts 8px apart.
      <label
        ref={ref}
        data-keyboard-focus={isKeyboard ? '' : undefined}
        data-text-field-part="search"
        onBlur={(event) => {
          onBlur?.(event);
          const { relatedTarget } = event;
          if (
            !(relatedTarget instanceof Node) ||
            !event.currentTarget.contains(relatedTarget)
          ) {
            setIsKeyboard(false);
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setIsKeyboard(isKeyboardFocus());
        }}
        {...props}
        className={cn('uikit-text-field-search', className)}
      />
    );
  },
);

export const TextField = {
  ...BaseField,
  Search,
  Root,
  Label,
  Control,
  Description,
  Error: ErrorMessage,
  Clear,
};
