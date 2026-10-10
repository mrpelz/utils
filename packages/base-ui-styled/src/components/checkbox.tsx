import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef, ReactNode } from 'react';

import { css, fontWeight } from './utils.js';

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

/** Figma “_Edit Buttons”: a 22px circle, its glyph white (see `List`). */
export const editCircle = css`
  display: grid;
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  border-radius: 50%;
  color: #fff;
  font-size: 14.5px;
  ${fontWeight(590)}
  place-items: center;
`;

type CursorProps = {
  /** As `Button`: the cursor (default: `pointer`; disabled: `not-allowed`). */
  cursor?: Properties['cursor'];
  disabled?: boolean;
};

// Figma State=Selected/Unselected (mixed: as selected).
const selectCircle = ({ disabled }: CursorProps) => css`
  --styled-cursor: attr(
    cursor type(<custom-ident>),
    ${disabled ? 'not-allowed' : 'pointer'}
  );

  ${editCircle}

  position: relative;
  flex: none;
  padding: 0;
  border: 1.5px solid
    var(--styled-select-circle-border, var(--color-ios-system-gray3));
  margin: 0;
  appearance: none;
  background: none;
  outline-offset: 2px;

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }

  /* Hit region: 44×44px, centered. */
  &::after {
    position: absolute;
    content: '';
    inset: -12.5px;
  }

  &[data-checked],
  &[data-indeterminate] {
    border-color: transparent;
    background-color: var(--color-ios-primary);
  }

  &[data-disabled] {
    opacity: 0.5;
  }

  /* The glyph (checked: the checkmark, mixed: the dash). */
  & > * {
    display: contents;
  }

  & [data-glyph='dash'],
  &[data-indeterminate] [data-glyph='check'] {
    display: none;
  }

  &[data-indeterminate] [data-glyph='dash'] {
    display: block;
  }
`;

export type CheckboxRootProps = Omit<BaseCheckbox.Root.Props, 'ref'> &
  CursorProps;

const StyledCheckbox = styled(BaseCheckbox.Root, forwardRef)<CursorProps>`
  ${selectCircle}
`;

/**
 * A checkbox (Base UI): a selection circle, its checkmark (mixed: a dash)
 * shown by `Indicator` unless given other children.
 */
const CheckboxRoot = forwardRef<HTMLElement, CheckboxRootProps>(
  ({ children, ...props }, ref) => (
    <StyledCheckbox
      ref={ref}
      {...props}
    >
      {children ?? (
        <BaseCheckbox.Indicator>
          <Check />
          <Dash />
        </BaseCheckbox.Indicator>
      )}
    </StyledCheckbox>
  ),
);

export type RadioRootProps = Omit<BaseRadio.Root.Props, 'ref'> & CursorProps;

const StyledRadio = styled(BaseRadio.Root, forwardRef)<CursorProps>`
  ${selectCircle}
`;

/** A radio (Base UI), in a `RadioGroup`: a selection circle, as `Checkbox`. */
const RadioRoot = forwardRef<HTMLElement, RadioRootProps>(
  ({ children, ...props }, ref) => (
    <StyledRadio
      ref={ref}
      {...props}
    >
      {children ?? (
        <BaseRadio.Indicator>
          <Check />
        </BaseRadio.Indicator>
      )}
    </StyledRadio>
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
