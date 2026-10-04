import { Field as BaseField } from '@base-ui/react/field';
import { styled } from 'goober';
import { forwardRef, MouseEvent, PointerEvent, ReactNode, useId } from 'react';

import { textStyle } from './typography.js';
import { css, fontWeight } from './utils.js';

// Source: Apple iOS 26 Figma (“Text Field”, light and dark appearance), with
// Figma colors mapped to UIKit semantic colors: 52px rows (padding 0 16px),
// the value in 17px at 510 (20px line height, Body's tracking) in `label`,
// the placeholder in `placeholderText`, a 2px caret in the tint, the clear
// button (􀁑, 17px) in `tertiaryLabel` while focused and filled. What Figma
// doesn't show follows Framework7 (`components/input/input.less`,
// `input-ios.less`, `input-vars.less`): info (`Description`) and error
// messages in 12px below, invalid text in `systemRed`, disabled at 55%.
//
// A Base UI field (UIKit `UITextField`): in a list row (`Root` rendering a
// `List.Item`), the label is the row's title and the control fills the rest
// of the row, the description and error below (see `List`); elsewhere, the
// parts stack. A textarea renders through `Control`'s `render`.
//
// Deviations:
// - No outlined style (Framework7 `.input-outline`).
// - Labels (Figma: none) are inline in rows, in Body, as UIKit's forms
//   (Framework7 iOS: 12px labels above the input, `.item-label`); standalone,
//   they're above, in Subheadline.
// - Info and errors are in Caption 1 (12/16px, Framework7: 12px, 1.4).
// - The caret is the browser's (Figma: 2×22px, rounded).
// - The clear button is UIKit's circled cross, cut out of the circle (Figma:
//   the SF Symbols glyph), with a 44px hit area.

const part = 'data-text-field-part';

// Standalone, the parts stack (not as a list row, see `List`).
const StyledRoot = styled(BaseField.Root, forwardRef)`
  &:not([data-list-part]) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* The clear button, only while focused and filled */
  &:not([data-filled][data-focused]) > [${part}='clear'] {
    visibility: hidden;
  }
`;

/** A field (Base UI); rendering a `List.Item`, a list row. */
const Root = forwardRef<HTMLDivElement, Omit<BaseField.Root.Props, 'ref'>>(
  (props, ref) => (
    <StyledRoot
      ref={ref}
      {...{ [part]: 'root' }}
      {...props}
    />
  ),
);

const StyledLabel = styled(BaseField.Label, forwardRef)`
  ${textStyle('subheadline')}

  color: var(--color-ios-secondary-label);

  &[data-disabled] {
    opacity: 0.55;
  }
`;

const Label = forwardRef<HTMLElement, Omit<BaseField.Label.Props, 'ref'>>(
  (props, ref) => (
    <StyledLabel
      ref={ref}
      {...{ [part]: 'label' }}
      {...props}
    />
  ),
);

// Framework7 `.item-input-wrap input`: no box of its own.
// Figma “Value”: 17px, 510, 20px line height.
const StyledControl = styled(BaseField.Control, forwardRef)`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0;
  border: 0;
  margin: 0;
  appearance: none;
  background: none;
  caret-color: var(--color-ios-primary);
  color: var(--color-ios-label);
  font-family: inherit;
  font-size: var(--font-ios-body-size);
  ${fontWeight(510)}
  letter-spacing: var(--font-ios-body-tracking);
  line-height: 20px;
  outline: none;

  &::placeholder {
    color: var(--color-ios-placeholder-text);
    opacity: 1;
  }

  /* As a textarea: three lines, growing with its text where supported */
  textarea& {
    min-height: calc(3 * 20px);
    field-sizing: content;
    resize: none;
  }

  &[data-invalid] {
    color: var(--color-ios-system-red);
  }

  &[data-disabled] {
    opacity: 0.55;
  }
`;

const Control = forwardRef<HTMLElement, Omit<BaseField.Control.Props, 'ref'>>(
  (props, ref) => (
    <StyledControl
      ref={ref}
      {...{ [part]: 'control' }}
      {...props}
    />
  ),
);

const message = css`
  ${textStyle('caption1')}

  margin: 0;
`;

const StyledDescription = styled(BaseField.Description, forwardRef)`
  ${message}

  color: var(--color-ios-secondary-label);
`;

/** Framework7 `.input-info`. */
const Description = forwardRef<
  HTMLParagraphElement,
  Omit<BaseField.Description.Props, 'ref'>
>((props, ref) => (
  <StyledDescription
    ref={ref}
    {...{ [part]: 'description' }}
    {...props}
  />
));

const StyledError = styled(BaseField.Error, forwardRef)`
  ${message}

  color: var(--color-ios-system-red);
`;

/** Framework7 `.input-error-message`; shown while the field is invalid. */
const ErrorMessage = forwardRef<
  HTMLDivElement,
  Omit<BaseField.Error.Props, 'ref'>
>((props, ref) => (
  <StyledError
    ref={ref}
    {...{ [part]: 'error' }}
    {...props}
  />
));

// Shown while the field is focused and filled (Framework7
// `.input-clear-button`, `.input-with-value`); its hit area is 44px.
const StyledClear = styled('button', forwardRef)`
  position: relative;
  display: grid;
  padding: 0;
  border: 0;
  margin: 0;
  appearance: none;
  background: none;
  color: var(--color-ios-tertiary-label);
  cursor: pointer;
  place-items: center;
  -webkit-tap-highlight-color: transparent;

  &::before {
    position: absolute;
    width: 44px;
    height: 44px;
    content: '';
    inset: 50% auto auto 50%;
    translate: -50% -50%;
  }
`;

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

type ClearProps = Omit<React.ComponentProps<'button'>, 'ref'>;

/**
 * Empties the field's control (as typing would, so its change handlers run),
 * keeping it focused (UIKit `clearButtonMode = .whileEditing`).
 */
const Clear = forwardRef<HTMLButtonElement, ClearProps>(
  ({ children, onClick, onPointerDown, ...props }, ref) => {
    const mask = useId();

    return (
      <StyledClear
        ref={ref}
        aria-label="Clear text"
        tabIndex={-1}
        type="button"
        {...{ [part]: 'clear' }}
        {...props}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          (onClick as ((clickEvent: typeof event) => void) | undefined)?.(
            event,
          );
          if (event.defaultPrevented) return;

          const control = event.currentTarget
            .closest(`[${CSS.escape(part)}='root']`)
            ?.querySelector(`[${CSS.escape(part)}='control']`);
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
              mask={`url(#${CSS.escape(mask)})`}
              r="8.5"
            />
          </svg>
        )}
      </StyledClear>
    );
  },
);

export const TextField = {
  ...BaseField,
  Root,
  Label,
  Control,
  Description,
  Error: ErrorMessage,
  Clear,
};
