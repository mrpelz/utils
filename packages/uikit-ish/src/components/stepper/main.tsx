import './style.css';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import {
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
} from 'react';

import { cn } from '../utils/main.js';
import type { FocusHandler, HalfProps } from './props.js';

// A stepper's halves (default, pressed, disabled), light and dark, in the
// semantic colors: the halves `quaternarySystemFill`,
// the separator and disabled symbols `tertiaryLabel`, symbols `label`.
//
// A Base UI number field: `Group` is the capsule, with `Decrement` and
// `Increment` halves; the value isn't shown, but
// held by the field's `Input`, visually hidden in the group, which keyboards
// focus (arrow keys step) and assistive technology reads (a spin button).
//
// Also:
// - The halves' size (46×32) is a minimum, not a fixed size.
// - The symbols (“−” and “+”) are SVG strokes, 14px wide, at 2px.
// - Pressed, the halves darken by 8% black (light mode) or lighten by 8%
//   white (dark mode).
// - Focused by keyboard, the capsule has a 2px ring in the tint, 2px around
//   it (as `Slider`'s knob).

/**
 * The stepper's capsule; it holds the field's `Input`. Pressed, it's marked
 * as focused by a pointer (no focus ring) until a key is pressed or focus
 * leaves it.
 */
const Group = forwardRef<
  HTMLDivElement,
  Omit<BaseNumberField.Group.Props, 'ref'>
>(({ className, onBlur, onKeyDown, onPointerDown, ...props }, ref) => (
  // Two halves side by side, a 1×24px separator between them
  // (4px from the top), its corners 8px.
  <BaseNumberField.Group
    ref={ref}
    {...props}
    className={cn('uikit-stepper-group', className)}
    data-stepper-part="group"
    onBlur={(event: FocusEvent<HTMLDivElement>) => {
      (onBlur as FocusHandler<typeof event>)?.(event);
      const { currentTarget, relatedTarget } = event;
      if (
        relatedTarget instanceof Node &&
        currentTarget.contains(relatedTarget)
      ) {
        return;
      }
      delete currentTarget.dataset.pointerFocus;
    }}
    onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
      (onKeyDown as FocusHandler<typeof event>)?.(event);
      delete event.currentTarget.dataset.pointerFocus;
    }}
    onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
      (onPointerDown as FocusHandler<typeof event>)?.(event);
      event.currentTarget.dataset.pointerFocus = '';
    }}
  />
));

/**
 * The field's input, in the group: visually hidden (no value is shown),
 * the focus target and spin button; name it (`aria-label`).
 */
const Input = forwardRef<
  HTMLInputElement,
  Omit<BaseNumberField.Input.Props, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Input
    ref={ref}
    {...props}
    className={cn('uikit-stepper-input', className)}
    data-stepper-part="input"
  />
));

// 14px wide, 2px strokes (Headline at 590).
const Sign = ({ isPlus }: { isPlus: boolean }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="14"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 14 14"
    width="14"
  >
    <path d={isPlus ? 'M1 7h12M7 1v12' : 'M1 7h12'} />
  </svg>
);

/** The leading half, “−”. */
const Decrement = forwardRef<
  HTMLButtonElement,
  Omit<BaseNumberField.Decrement.Props, 'ref'> & HalfProps
>(({ className, children, ...props }, ref) => (
  // A half (see style.css).
  <BaseNumberField.Decrement
    ref={ref}
    {...props}
    className={cn('uikit-stepper-half uikit-stepper-decrement', className)}
    data-stepper-part="half"
  >
    {(children as ReactNode) ?? <Sign isPlus={false} />}
  </BaseNumberField.Decrement>
));

/** The trailing half, “+”. */
const Increment = forwardRef<
  HTMLButtonElement,
  Omit<BaseNumberField.Increment.Props, 'ref'> & HalfProps
>(({ className, children, ...props }, ref) => (
  <BaseNumberField.Increment
    ref={ref}
    {...props}
    className={cn('uikit-stepper-half uikit-stepper-increment', className)}
    data-stepper-part="half"
  >
    {(children as ReactNode) ?? <Sign isPlus />}
  </BaseNumberField.Increment>
));

export const Stepper = {
  ...BaseNumberField,
  Group,
  Input,
  Decrement,
  Increment,
};
