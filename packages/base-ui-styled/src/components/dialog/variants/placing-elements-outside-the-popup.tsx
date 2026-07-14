import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDialog } from '../common.js';

const Viewport = styled(BaseDialog.Viewport, forwardRef)`
  position: fixed;
  display: grid;
  padding: var(--space-12) var(--space-4);
  inset: 0;
  place-items: center;

  @media (width >= 80rem) {
    padding-block: var(--space-6);
  }
`;

const PopupRoot = styled(BaseDialog.Popup, forwardRef)`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 70rem;
  height: 100%;
  justify-content: center;
  pointer-events: none;
  transition: opacity var(--duration-medium);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  @media (width >= 80rem) {
    max-width: none;
  }
`;

const PopupSurface = styled('div', forwardRef)`
  width: 100%;
  max-width: 70rem;
  height: 100%;
  box-sizing: border-box;
  padding: var(--space-4);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  pointer-events: auto;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);

  [data-starting-style] & {
    transform: scale(1.05);
  }
`;

const Close = styled(BaseDialog.Close, forwardRef)`
  position: absolute;
  top: calc(-1 * var(--space-10));
  right: 0;
  display: flex;
  width: 2rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  pointer-events: auto;

  @media (width >= 80rem) {
    top: 0;
  }

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

const StyledXIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const XIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledXIcon
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
      <path d="m2.5 2.5 11 11m-11 0 11-11" />
    </StyledXIcon>
  ),
);

export const placingElementsOutsideThePopup = {
  ...CommonDialog,
  Viewport,
  PopupRoot,
  PopupSurface,
  Close,
  XIcon,
};
