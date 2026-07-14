import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonTooltip } from '../common.js';

const ButtonGroup = styled('div', forwardRef)`
  display: flex;
`;

const Positioner = styled(BaseTooltip.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
  transition-duration: var(--duration-slow);
  transition-property: top, left, right, bottom, transform;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);

  &[data-instant] {
    transition: none;
  }
`;

const Popup = styled(BaseTooltip.Popup, forwardRef)`
  position: relative;
  width: var(--popup-width, auto);
  max-width: 500px;
  height: var(--popup-height, auto);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  transform-origin: var(--transform-origin);
  transition-duration: var(--duration-slow);
  transition-property: width, height, opacity, scale;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    scale: 0.9;
  }

  &[data-instant] {
    transition: none;
  }
`;

const Arrow = styled(BaseTooltip.Arrow, forwardRef)`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;
  transition: left var(--duration-slow) cubic-bezier(0.22, 1, 0.36, 1);

  &[data-instant] {
    transition: none;
  }

  &[data-side='top'] {
    bottom: -6px;
    rotate: 180deg;
  }

  &[data-side='bottom'] {
    top: -6px;
    rotate: 0deg;
  }

  &[data-side='left'] {
    right: -9px;
    rotate: 90deg;
  }

  &[data-side='right'] {
    left: -9px;
    rotate: -90deg;
  }

  &::before {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: var(--border-width) solid var(--border);
    background-color: var(--surface);
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);
  }
`;

const Viewport = styled(BaseTooltip.Viewport, forwardRef)`
  --viewport-inline-padding: var(--space-2);

  position: relative;
  overflow: clip;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: var(--space-1) var(--viewport-inline-padding);

  [data-previous],
  [data-current] {
    width: calc(var(--popup-width) - 2 * var(--viewport-inline-padding));
    opacity: 1;
    transition:
      translate 350ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 175ms cubic-bezier(0.22, 1, 0.36, 1);
    translate: 0;

    [data-instant] & {
      transition: none;
    }
  }

  &[data-activation-direction~='left'] [data-current][data-starting-style] {
    opacity: 0;
    translate: -50% 0;
  }

  &[data-activation-direction~='right'] [data-current][data-starting-style] {
    opacity: 0;
    translate: 50% 0;
  }

  &[data-activation-direction~='left'] [data-previous][data-ending-style] {
    opacity: 0;
    translate: 50% 0;
  }

  &[data-activation-direction~='right'] [data-previous][data-ending-style] {
    opacity: 0;
    translate: -50% 0;
  }
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

export const animatingTheTooltip = {
  ...CommonTooltip,
  ButtonGroup,
  Positioner,
  Popup,
  Arrow,
  Viewport,
  HeadphonesIcon,
  StopwatchIcon,
  TrashIcon,
};
