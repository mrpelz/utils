import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonMenu } from '../common.js';

const IconButton = styled(BaseMenu.Trigger, forwardRef)`
  display: flex;
  width: 2rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  outline: 0;
  user-select: none;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Item = styled(CommonMenu.Item, forwardRef)`
  color: inherit;
`;

const StyledEllipsisHorizontalIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const EllipsisHorizontalIcon = forwardRef<
  SVGSVGElement,
  React.ComponentProps<'svg'>
>(({ style, ...props }, ref) => (
  <StyledEllipsisHorizontalIcon
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
    <circle
      cx="3"
      cy="8"
      r="1"
    />
    <circle
      cx="8"
      cy="8"
      r="1"
    />
    <circle
      cx="13"
      cy="8"
      r="1"
    />
  </StyledEllipsisHorizontalIcon>
));

export const detachedTriggers = {
  ...CommonMenu,
  IconButton,
  Item,
  EllipsisHorizontalIcon,
};
