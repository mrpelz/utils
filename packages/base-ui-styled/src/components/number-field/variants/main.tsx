import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonNumberField } from '../common.js';

const StyledCursorGrowIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const CursorGrowIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledCursorGrowIcon
      ref={ref}
      fill="black"
      height="14"
      stroke="white"
      viewBox="0 0 24 14"
      width="26"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </StyledCursorGrowIcon>
  ),
);

const StyledPlusIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const PlusIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledPlusIcon
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="M1.5 8h13M8 14.5v-13" />
    </StyledPlusIcon>
  ),
);

const StyledMinusIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const MinusIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledMinusIcon
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="M1.5 8h13" />
    </StyledMinusIcon>
  ),
);

export const main = {
  ...CommonNumberField,
  CursorGrowIcon,
  PlusIcon,
  MinusIcon,
};
