import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonContextMenu } from '../common.js';

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

  &[data-popup-open]::before {
    position: absolute;
    z-index: -1;
    background-color: var(--hover-wash);
    content: '';
    inset-block: 0;
    inset-inline: var(--space-1);
  }

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: var(--on-ink);
  }

  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    background-color: var(--ink);
    content: '';
    inset-block: 0;
    inset-inline: var(--space-1);
  }

  &[data-highlighted][data-popup-open]::before {
    background-color: var(--ink);
  }

  &[data-disabled] {
    color: var(--subtle);
  }
`;

const Item = styled(BaseContextMenu.Item, forwardRef)`
  ${itemStyles}
`;

const SubmenuTrigger = styled(BaseContextMenu.SubmenuTrigger, forwardRef)`
  ${itemStyles}

  align-items: center;
  justify-content: space-between;
  padding-right: var(--space-2);
  gap: var(--space-4);
`;

const Arrow = styled(BaseContextMenu.Arrow, forwardRef)`
  display: flex;

  &[data-side='top'] {
    bottom: -8px;
    rotate: 180deg;
  }

  &[data-side='bottom'] {
    top: -8px;
    rotate: 0deg;
  }

  &[data-side='left'] {
    right: -13px;
    rotate: 90deg;
  }

  &[data-side='right'] {
    left: -13px;
    rotate: -90deg;
  }
`;

const ArrowFill = styled('path', forwardRef)`
  fill: var(--surface);
`;

const ArrowOuterStroke = styled('path', forwardRef)`
  fill: var(--border);
`;

const ArrowInnerStroke = styled('path', forwardRef)`
  fill: var(--surface);
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
  ...CommonContextMenu,
  Item,
  SubmenuTrigger,
  Arrow,
  ArrowFill,
  ArrowOuterStroke,
  ArrowInnerStroke,
  CaretRightIcon,
};
