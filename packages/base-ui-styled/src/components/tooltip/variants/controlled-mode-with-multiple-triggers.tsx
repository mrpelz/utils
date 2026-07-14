import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonTooltip, tooltipButtonStyles } from '../common.js';

const Positioner = styled(BaseTooltip.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
`;

const Container = styled('div', forwardRef)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
`;

const ButtonGroup = styled('div', forwardRef)`
  display: flex;
`;

const Button = styled('button', forwardRef)`
  ${tooltipButtonStyles}
`;

const StyledIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const HeadphonesIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledIcon
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
        d="M1.5 11V7.5c0-2.5 2.5-6 6.5-6s6.5 3.5 6.5 6V11"
        strokeLinecap="round"
      />
      <path d="M12 7.5c1.3807 0 2.5 1.11929 2.5 2.5v2c0 1.3807-1.1193 2.5-2.5 2.5h-1.5v-7zm-8 0h1.5v7H4c-1.38071 0-2.5-1.1193-2.5-2.5v-2c0-1.38071 1.11929-2.5 2.5-2.5Z" />
    </StyledIcon>
  ),
);

const StopwatchIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledIcon
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
      <circle
        cx="8"
        cy="8.5"
        r="6"
      />
      <path
        d="M8 9.5v-5m0-2v-2m-2 0h4M12 4l1.5-1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </StyledIcon>
  ),
);

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

export const controlledModeWithMultipleTriggers = {
  ...CommonTooltip,
  Positioner,
  Container,
  ButtonGroup,
  Button,
  HeadphonesIcon,
  StopwatchIcon,
  TrashIcon,
};
