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

// Source: Apple iOS 26 Figma (“Stepper”, “_Decrement”, “_Increment”:
// Style=Default/Pressed/Disabled, light and dark appearance), with Figma
// colors mapped to UIKit semantic colors: the halves `quaternarySystemFill`,
// the separator and disabled symbols `tertiaryLabel`, symbols `label`.
//
// A Base UI number field (UIKit `UIStepper`): `Group` is the capsule, with
// `Decrement` and `Increment` halves; the value isn't shown (as UIKit's), but
// held by a visually hidden input in the group, which keyboards focus (arrow
// keys step) and assistive technology reads (a spin button).
//
// Deviations:
// - The halves' size (46×32) is a minimum, not a fixed size.
// - The symbols (Figma: “−” and “+” in Headline) are SVG strokes, 14px wide
//   (as Figma's PNG, at 2px).
// - Pressed in dark mode, the halves lighten by 8% white (Figma: 8% black,
//   given in light mode only).
// - Focused by keyboard, the capsule has a 2px ring in the tint, 2px around
//   it (Figma: none; as `Slider`'s knob).

/**
 * The stepper's capsule; it holds the field's (hidden) input. Pressed, it's
 * marked as focused by a pointer (no focus ring) until a key is pressed or
 * focus leaves it.
 */
const Group = forwardRef<
  HTMLDivElement,
  Omit<BaseNumberField.Group.Props, 'ref'> & {
    /** Props of the hidden input (e.g. `aria-label`). */
    inputProps?: Omit<BaseNumberField.Input.Props, 'ref'>;
  }
>(
  (
    {
      className,
      children,
      inputProps,
      onBlur,
      onKeyDown,
      onPointerDown,
      ...props
    },
    ref,
  ) => (
    // Figma “Stepper”: two halves side by side, a 1×24px separator between them
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
    >
      {/* The hidden input (the field's value, focus target and spin button).
       */}
      <BaseNumberField.Input
        {...inputProps}
        className={cn('uikit-stepper-hidden-input', inputProps?.className)}
        data-stepper-part="hidden-input"
      />
      {children as ReactNode}
    </BaseNumberField.Group>
  ),
);

// Figma PNG: 14px wide, 2px strokes (Headline at 590).
const Sign = ({ plus }: { plus: boolean }) => (
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
    <path d={plus ? 'M1 7h12M7 1v12' : 'M1 7h12'} />
  </svg>
);

/** Figma “_Decrement”: the leading half, “−”. */
const Decrement = forwardRef<
  HTMLButtonElement,
  Omit<BaseNumberField.Decrement.Props, 'ref'> & HalfProps
>(({ className, children, ...props }, ref) => (
  // Figma “_Decrement”, “_Increment” (see style.css).
  <BaseNumberField.Decrement
    ref={ref}
    {...props}
    className={cn('uikit-stepper-half uikit-stepper-decrement', className)}
    data-stepper-part="half"
  >
    {(children as ReactNode) ?? <Sign plus={false} />}
  </BaseNumberField.Decrement>
));

/** Figma “_Increment”: the trailing half, “+”. */
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
    {(children as ReactNode) ?? <Sign plus />}
  </BaseNumberField.Increment>
));

export const Stepper = {
  ...BaseNumberField,
  Group,
  Decrement,
  Increment,
};
