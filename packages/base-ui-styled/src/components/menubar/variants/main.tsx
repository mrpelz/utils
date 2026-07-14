import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonMenubar } from '../common.js';

const MenuTrigger = styled(BaseMenu.Trigger, forwardRef)`
  height: var(--control-height);
  box-sizing: border-box;
  padding: 0 var(--space-3);
  border: 0;
  margin: 0;
  background-color: transparent;
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
  user-select: none;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    position: relative;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-pressed],
  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &[data-disabled] {
    color: var(--subtle);
  }
`;

const MenuPositioner = styled(BaseMenu.Positioner, forwardRef)`
  outline: 0;
`;

const MenuPopup = styled(BaseMenu.Popup, forwardRef)`
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  padding-block: var(--space-1);
  transform-origin: var(--transform-origin);
  transition:
    transform var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.98);
  }

  &[data-instant] {
    transition: none;
  }
`;

const menuItemStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: var(--space-4);
  cursor: default;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-4);
  line-height: var(--leading-xs);
  outline: 0;
  padding-block: var(--space-2);
  user-select: none;

  &[data-popup-open] {
    position: relative;
    z-index: 0;
  }

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: var(--on-ink);
  }

  &[data-popup-open]::before,
  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    content: '';
    inset-block: 0;
    inset-inline: var(--space-1);
  }

  &[data-popup-open]::before {
    background-color: var(--hover-wash);
  }

  &[data-highlighted]::before {
    background-color: var(--ink);
  }

  &[data-highlighted][data-popup-open]::before {
    background-color: var(--ink);
  }
`;

const MenuItem = styled(BaseMenu.Item, forwardRef)`
  ${menuItemStyles}

  padding-right: var(--space-4);
`;

const SubmenuTrigger = styled(BaseMenu.SubmenuTrigger, forwardRef)`
  ${menuItemStyles}

  padding-right: var(--space-2);
`;

const MenuSeparator = styled(BaseMenu.Separator, forwardRef)`
  height: 1px;
  margin: var(--space-1);
  background-color: var(--border);
`;

const StyledCaretRightIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const CaretRightIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledCaretRightIcon
      ref={ref}
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="M6 12V4l4.5 4z" />
    </StyledCaretRightIcon>
  ),
);

export const main = Object.assign(CommonMenubar, {
  MenuTrigger,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  SubmenuTrigger,
  MenuSeparator,
  CaretRightIcon,
});
