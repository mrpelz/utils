import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

const Trigger = styled(BaseMenu.Trigger, forwardRef)`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-2) 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-1-5);
  line-height: var(--leading-none);
  outline: 0;
  user-select: none;
  white-space: nowrap;

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

const Positioner = styled(BaseMenu.Positioner, forwardRef)`
  outline: 0;
`;

const Popup = styled(BaseMenu.Popup, forwardRef)`
  position: relative;
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  border-radius: 0;
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
`;

const Item = styled(BaseMenu.Item, forwardRef)`
  display: flex;
  padding-right: var(--space-8);
  padding-left: var(--space-4);
  cursor: default;
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  outline: 0;
  padding-block: var(--space-2);
  user-select: none;

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

  &[data-disabled] {
    color: var(--subtle);
  }
`;

const menuGridItemStyles = css`
  display: grid;
  align-items: center;
  padding-right: var(--space-8);
  padding-left: var(--space-2-5);
  cursor: default;
  font-size: var(--text-sm);
  gap: var(--space-2);
  grid-template-columns: 1rem 1fr;
  line-height: var(--leading-xs);
  outline: 0;
  padding-block: var(--space-2);
  user-select: none;

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

  &[data-disabled] {
    color: var(--subtle);
  }
`;

const CheckboxItem = styled(BaseMenu.CheckboxItem, forwardRef)`
  ${menuGridItemStyles}
`;

const RadioItem = styled<typeof BaseMenu.RadioItem, BaseMenu.RadioItem.Props>(
  BaseMenu.RadioItem,
  forwardRef,
)`
  ${menuGridItemStyles}
`;

const CheckboxItemIndicator = styled(
  BaseMenu.CheckboxItemIndicator,
  forwardRef,
)`
  grid-column-start: 1;
`;

const RadioItemIndicator = styled(BaseMenu.RadioItemIndicator, forwardRef)`
  grid-column-start: 1;
`;

const CheckboxItemText = styled('span', forwardRef)`
  grid-column-start: 2;
`;

const RadioItemText = styled('span', forwardRef)`
  grid-column-start: 2;
`;

const Separator = styled(BaseMenu.Separator, forwardRef)`
  height: var(--border-width);
  margin: var(--space-1);
  background-color: var(--border);
`;

const StyledCaretDownIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const CaretDownIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledCaretDownIcon
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
      <path d="M12 6H4l4 4.5z" />
    </StyledCaretDownIcon>
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

export const CommonMenu = {
  ...BaseMenu,
  Trigger,
  Positioner,
  Popup,
  Item,
  CheckboxItem,
  RadioItem,
  CheckboxItemIndicator,
  RadioItemIndicator,
  CheckboxItemText,
  RadioItemText,
  Separator,
  CaretDownIcon,
  CheckIcon,
};
