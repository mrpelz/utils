import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const Button = styled(BaseToggle, forwardRef)`
  display: flex;
  width: var(--control-height);
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  color: var(--on-surface);
  user-select: none;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 1px;
  }

  &:active:not([data-disabled], [data-pressed]) {
    background-color: var(--active-wash);
  }

  &[data-pressed] {
    background-color: var(--ink);
    color: var(--on-ink);
  }

  @media (hover: hover) {
    &[data-pressed]:hover:not([data-disabled]) {
      background-color: var(--ink);
      color: var(--on-ink);
    }
  }
`;

const StyledAlignLeftIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

export const AlignLeftIcon = forwardRef<
  SVGSVGElement,
  React.ComponentProps<'svg'>
>(({ style, ...props }, ref) => (
  <StyledAlignLeftIcon
    ref={ref}
    fill="none"
    height="16"
    stroke="currentColor"
    viewBox="0 0 16 16"
    width="16"
    {...props}
    style={{
      display: 'block',
      ...(typeof style === 'object' && style),
    }}
  >
    <path
      d="M2.5 4.5h11m-11 7h9M2.5 8h5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </StyledAlignLeftIcon>
));

const StyledAlignCenterIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

export const AlignCenterIcon = forwardRef<
  SVGSVGElement,
  React.ComponentProps<'svg'>
>(({ style, ...props }, ref) => (
  <StyledAlignCenterIcon
    ref={ref}
    height="16"
    stroke="currentColor"
    viewBox="0 0 16 16"
    width="16"
    {...props}
    style={{
      display: 'block',
      ...(typeof style === 'object' && style),
    }}
  >
    <path
      d="M2.5 4.5h11m-10 7h9M5.5 8h5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </StyledAlignCenterIcon>
));

const StyledAlignRightIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

export const AlignRightIcon = forwardRef<
  SVGSVGElement,
  React.ComponentProps<'svg'>
>(({ style, ...props }, ref) => (
  <StyledAlignRightIcon
    ref={ref}
    height="16"
    stroke="currentColor"
    viewBox="0 0 16 16"
    width="16"
    {...props}
    style={{
      display: 'block',
      ...(typeof style === 'object' && style),
    }}
  >
    <path
      d="M2.5 4.5h11m-9 7h9M8.5 8h5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </StyledAlignRightIcon>
));

export { CommonToggleGroup as main } from '../common.js';
