import './style.css';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { forwardRef, ReactNode } from 'react';

import { cn } from '../utils/main.js';
import type { CheckboxRootProps, RadioRootProps } from './props.js';

export type { CheckboxRootProps, RadioRootProps } from './props.js';

// Source: Apple iOS 26 Figma (“_Edit Buttons”, State=Selected/Unselected):
// 22px circles, unselected with a 1.5px `systemGray3` border, selected in
// the tint with a white checkmark. iOS has no checkboxes or radio buttons
// of its own: lists select rows with these circles (UIKit editing), as
// Framework7's iOS checkboxes are (`checkbox-ios.less`); mixed
// (indeterminate), a dash (Framework7). Base UI checkboxes and radios (a
// button, with a hidden input for forms), also used by `List` (`Checkbox`,
// `Radio`).
//
// Deviations:
// - Radios are circles too (Framework7 iOS: a checkmark only, as
//   `List.Checkmark`).
// - The hit area is 44px (HIG), centered (Figma: the circle).

export const Check = (): ReactNode => (
  <svg
    aria-hidden="true"
    data-glyph="check"
    fill="none"
    height="1em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 17 17"
    width="1em"
  >
    <path d="M2 9l4.5 5L15.2 1.5" />
  </svg>
);

const Dash = () => (
  <svg
    aria-hidden="true"
    data-glyph="dash"
    fill="none"
    height="1em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 17 17"
    width="1em"
  >
    <path d="M3.5 8.5h10" />
  </svg>
);

/**
 * A checkbox (Base UI): a selection circle, its checkmark (mixed: a dash)
 * shown by `Indicator` unless given other children.
 */
const CheckboxRoot = forwardRef<HTMLElement, CheckboxRootProps>(
  ({ className, children, ...props }, ref) => (
    <BaseCheckbox.Root
      ref={ref}
      {...props}
      data-checkbox-part="select-circle"
      className={cn(
        'uikit-checkbox-select-circle uikit-checkbox-edit-circle',
        className,
      )}
    >
      {children ?? (
        <BaseCheckbox.Indicator>
          <Check />
          <Dash />
        </BaseCheckbox.Indicator>
      )}
    </BaseCheckbox.Root>
  ),
);

/** A radio (Base UI), in a `RadioGroup`: a selection circle, as `Checkbox`. */
const RadioRoot = forwardRef<HTMLElement, RadioRootProps>(
  ({ className, children, ...props }, ref) => (
    <BaseRadio.Root
      ref={ref}
      {...props}
      data-checkbox-part="select-circle"
      className={cn(
        'uikit-checkbox-select-circle uikit-checkbox-edit-circle',
        className,
      )}
    >
      {children ?? (
        <BaseRadio.Indicator>
          <Check />
        </BaseRadio.Indicator>
      )}
    </BaseRadio.Root>
  ),
);

export const Checkbox = {
  ...BaseCheckbox,
  Root: CheckboxRoot,
};

export const Radio = {
  ...BaseRadio,
  Root: RadioRoot,
};

/** Base UI's: checkboxes sharing a value (an array), and a parent's. */
export const CheckboxGroup = BaseCheckboxGroup;

/** Base UI's: radios sharing a value. */
export const RadioGroup = BaseRadioGroup;
