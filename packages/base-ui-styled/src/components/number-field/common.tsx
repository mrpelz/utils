import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

const Root = styled(BaseNumberField.Root, forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

const ScrubArea = styled(BaseNumberField.ScrubArea, forwardRef)`
  cursor: ew-resize;
  font-weight: var(--font-bold);
  user-select: none;
`;

const ScrubAreaCursor = styled(BaseNumberField.ScrubAreaCursor, forwardRef)`
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 50%));
`;

const Label = styled('label', forwardRef)`
  color: var(--on-surface);
  cursor: ew-resize;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Group = styled(BaseNumberField.Group, forwardRef)`
  display: flex;
  height: var(--control-height);
`;

const Input = styled(BaseNumberField.Input, forwardRef)`
  width: 7ch;
  height: 100%;
  box-sizing: border-box;
  padding: 0 var(--space-2);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
  text-align: left;

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &:focus {
    z-index: 1;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

export const numberFieldStepperStyles = css`
  display: flex;
  width: 2rem;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-clip: padding-box;
  background-color: var(--surface);
  color: var(--on-surface);
  outline: 0;
  user-select: none;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Decrement = styled(BaseNumberField.Decrement, forwardRef)`
  ${numberFieldStepperStyles}

  border-right: 0;
`;

const Increment = styled(BaseNumberField.Increment, forwardRef)`
  ${numberFieldStepperStyles}

  border-left: 0;
`;

export const CommonNumberField = {
  ...BaseNumberField,
  Root,
  ScrubArea,
  ScrubAreaCursor,
  Label,
  Group,
  Input,
  Decrement,
  Increment,
};
