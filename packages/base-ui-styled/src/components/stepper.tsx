import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  Ref,
} from 'react';

import { colorScheme, css, fontWeight } from './utils.js';

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

/** As `Button`: a `cursor` prop, or the fallback. */
const cursor = (fallback: string) => css`
  --styled-cursor: attr(cursor type(<custom-ident>), ${fallback});

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }
`;

// The hidden input (the field's value, focus target and spin button).
const HiddenInput = styled(BaseNumberField.Input, forwardRef)`
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  margin: -1px;
  clip-path: inset(50%);
  white-space: nowrap;
`;

// Figma “Stepper”: two halves side by side, a 1×24px separator between them
// (4px from the top), its corners 8px.
const StyledGroup = styled(BaseNumberField.Group, forwardRef)`
  position: relative;
  display: inline-grid;
  border-radius: 100px;
  grid-auto-columns: minmax(46px, 1fr);
  grid-auto-flow: column;
  vertical-align: middle;

  &::after {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: calc(50% - 0.5px);
    width: 1px;
    border-radius: 8px;
    background-color: var(--color-ios-tertiary-label);
    content: '';
    pointer-events: none;
  }

  /* Focused by keyboard only: a text input is always :focus-visible,
     also when pressing a half focuses it (see Group). */
  &:not([data-pointer-focus]):has(input:focus-visible) {
    outline: 2px solid var(--color-ios-primary);
    outline-offset: 2px;
  }
`;

type FocusHandler<E> = ((event: E) => void) | undefined;

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
    { children, inputProps, onBlur, onKeyDown, onPointerDown, ...props },
    ref,
  ) => (
    <StyledGroup
      ref={ref}
      {...props}
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
      <HiddenInput {...inputProps} />
      {children as ReactNode}
    </StyledGroup>
  ),
);

// Figma “_Decrement”, “_Increment”: 46×32px, the symbol in Headline;
// pressed, 8% darker; disabled, the symbol in `tertiaryLabel`.
const half = css`
  display: grid;
  min-height: 32px;
  box-sizing: border-box;
  padding: 0;
  border: 0;
  margin: 0;
  appearance: none;
  background-color: var(--color-ios-quaternary-system-fill);
  color: var(--color-ios-label);
  font-family: inherit;
  font-size: var(--font-ios-headline-size);
  ${fontWeight(590)}
  line-height: var(--font-ios-headline-line-height);
  place-items: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;

  &:active:not([data-disabled]) {
    ${colorScheme(
      'background-image: linear-gradient(rgb(0 0 0 / 8%), rgb(0 0 0 / 8%));',
      'background-image: linear-gradient(rgb(255 255 255 / 8%), rgb(255 255 255 / 8%));',
    )}
  }

  &[data-disabled] {
    color: var(--color-ios-tertiary-label);
  }
`;

type HalfProps = {
  cursor?: Properties['cursor'];
};

const StyledDecrement = styled<
  typeof BaseNumberField.Decrement,
  Omit<BaseNumberField.Decrement.Props, 'ref'> &
    HalfProps & { ref?: Ref<HTMLButtonElement> }
>(BaseNumberField.Decrement, forwardRef)`
  ${half}
  ${({ disabled }) => cursor(disabled ? 'not-allowed' : 'pointer')}

  border-end-start-radius: 100px;
  border-start-start-radius: 100px;
`;

const StyledIncrement = styled<
  typeof BaseNumberField.Increment,
  Omit<BaseNumberField.Increment.Props, 'ref'> &
    HalfProps & { ref?: Ref<HTMLButtonElement> }
>(BaseNumberField.Increment, forwardRef)`
  ${half}
  ${({ disabled }) => cursor(disabled ? 'not-allowed' : 'pointer')}

  border-end-end-radius: 100px;
  border-start-end-radius: 100px;
`;

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
>(({ children, ...props }, ref) => (
  <StyledDecrement
    ref={ref}
    {...props}
  >
    {(children as ReactNode) ?? <Sign plus={false} />}
  </StyledDecrement>
));

/** Figma “_Increment”: the trailing half, “+”. */
const Increment = forwardRef<
  HTMLButtonElement,
  Omit<BaseNumberField.Increment.Props, 'ref'> & HalfProps
>(({ children, ...props }, ref) => (
  <StyledIncrement
    ref={ref}
    {...props}
  >
    {(children as ReactNode) ?? <Sign plus />}
  </StyledIncrement>
));

export const Stepper = {
  ...BaseNumberField,
  Group,
  Decrement,
  Increment,
};
