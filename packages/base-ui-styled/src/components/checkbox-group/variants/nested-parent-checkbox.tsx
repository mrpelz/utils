import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const StyledIndeterminateIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

export const IndeterminateIcon = forwardRef<
  SVGSVGElement,
  React.ComponentProps<'svg'>
>(({ style, ...props }, ref) => (
  <StyledIndeterminateIcon
    ref={ref}
    fill="currentColor"
    height="12"
    strokeWidth={1}
    viewBox="0 0 24 24"
    width="12"
    {...props}
    style={{
      display: 'block',
      ...(typeof style === 'object' && style),
    }}
  >
    <line
      stroke="currentColor"
      vectorEffect="non-scaling-stroke"
      x1="3"
      x2="21"
      y1="12"
      y2="12"
    />
  </StyledIndeterminateIcon>
));

export { CommonCheckboxGroup as nestedParentCheckbox } from '../common.js';
