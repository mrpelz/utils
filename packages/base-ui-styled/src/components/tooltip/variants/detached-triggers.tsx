import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonTooltip } from '../common.js';

const StyledIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const TrashIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledIcon
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path
        d="M2.5 4h11"
        strokeLinecap="square"
      />
      <path
        d="M6.5 4V3c0-.82843.67157-1.5 1.5-1.5s1.5.67157 1.5 1.5v1"
        strokeLinecap="round"
      />
      <path
        d="m3.5 4 .87069 9.1422c.07332.7699.7199 1.3578 1.49324 1.3578h4.27217c.7733 0 1.4199-.5879 1.4932-1.3578L12.5 4"
        strokeLinecap="square"
      />
    </StyledIcon>
  ),
);

export const detachedTriggers = {
  ...CommonTooltip,
  TrashIcon,
};
