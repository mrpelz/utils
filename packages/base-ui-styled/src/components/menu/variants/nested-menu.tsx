import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonMenu } from '../common.js';

const itemStyles = css`
  display: flex;
  padding-right: var(--space-6);
  padding-left: var(--space-4);
  cursor: default;
  font-size: var(--text-sm);
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

const Item = styled(BaseMenu.Item, forwardRef)`
  ${itemStyles}
`;

const SubmenuTrigger = styled(BaseMenu.SubmenuTrigger, forwardRef)`
  ${itemStyles}

  align-items: center;
  justify-content: space-between;
  padding-right: var(--space-2);
  gap: var(--space-4);
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

export const nestedMenu = {
  ...CommonMenu,
  Item,
  SubmenuTrigger,
  CaretRightIcon,
};
