import { Toast as BaseToast } from '@base-ui/react/toast';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonToast, toastButtonStyles } from '../common.js';

const AnchoredViewport = styled(BaseToast.Viewport, forwardRef)`
  outline: 0;
`;

const AnchoredPositioner = styled(BaseToast.Positioner, forwardRef)`
  z-index: calc(1000 - var(--toast-index));
`;

const popupCardStyles = css`
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-1) var(--space-2);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  transform-origin: var(--transform-origin);
  transition:
    scale 100ms ease-out,
    opacity 100ms ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    scale: 0.98;
  }

  &[data-instant] {
    transition: none;
  }
`;

const AnchoredRoot = styled(BaseToast.Root, forwardRef)`
  ${popupCardStyles}

  width: max-content;

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const arrowStyles = css`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;

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
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: var(--border-width) solid var(--border);
    background-color: var(--surface);
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);
  }
`;

const Arrow = styled(BaseToast.Arrow, forwardRef)`
  ${arrowStyles}
`;

const AnchoredDescription = styled(BaseToast.Description, forwardRef)`
  margin: 0;
`;

const ButtonGroup = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const CopyButton = styled(BaseTooltip.Trigger, forwardRef)`
  ${toastButtonStyles}

  display: flex;
  width: 2rem;
  height: var(--control-height);
  align-items: center;
  justify-content: center;
  padding: 0;
  user-select: none;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }
`;

const TooltipPopup = styled(BaseTooltip.Popup, forwardRef)`
  ${popupCardStyles}
`;

const TooltipArrow = styled(BaseTooltip.Arrow, forwardRef)`
  ${arrowStyles}
`;

const StyledClipboardIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const ClipboardIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledClipboardIcon
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <rect
        height="4"
        rx="1"
        ry="1"
        width="8"
        x="8"
        y="2"
      />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </StyledClipboardIcon>
  ),
);

const StyledCheckIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const CheckIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledCheckIcon
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
      <path d="m2.5 8.5 4 4 7-9" />
    </StyledCheckIcon>
  ),
);

export const anchoredToasts = {
  ...CommonToast,
  AnchoredViewport,
  AnchoredPositioner,
  AnchoredRoot,
  Arrow,
  AnchoredDescription,
  ButtonGroup,
  CopyButton,
  TooltipPopup,
  TooltipArrow,
  ClipboardIcon,
  CheckIcon,
};
