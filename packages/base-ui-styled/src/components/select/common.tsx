import { Select as BaseSelect } from '@base-ui/react/select';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Field = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

const Label = styled(BaseSelect.Label, forwardRef)`
  color: var(--on-surface);
  cursor: default;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Value = styled(BaseSelect.Value, forwardRef)`
  &[data-placeholder] {
    color: var(--subtle);
  }
`;

const Trigger = styled(BaseSelect.Trigger, forwardRef)`
  display: flex;
  min-width: 10rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding-right: var(--space-1);
  padding-left: var(--space-2);
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-3);
  line-height: var(--leading-none);
  outline: 0;
  user-select: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active:not([data-disabled]) {
    background-color: var(--active-wash);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Positioner = styled(BaseSelect.Positioner, forwardRef)`
  z-index: 10;
  outline: none;
  user-select: none;
`;

const Popup = styled(BaseSelect.Popup, forwardRef)`
  min-width: var(--anchor-width);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-clip: padding-box;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  transform-origin: var(--transform-origin);
  transition:
    transform var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.98);
  }

  &[data-side='none'] {
    min-width: calc(var(--anchor-width) + 1.75rem);
    opacity: 1;
    transform: translateY(1px);
    transition: none;
  }
`;

const List = styled(BaseSelect.List, forwardRef)`
  position: relative;
  max-height: var(--available-height);
  box-sizing: border-box;
  overflow-y: auto;
  padding-block: var(--space-1);
  scroll-padding-block: var(--space-6);
`;

const Item = styled(BaseSelect.Item, forwardRef)`
  display: grid;
  box-sizing: border-box;
  align-items: center;
  padding-right: var(--space-4);
  padding-left: var(--space-2-5);
  cursor: default;
  font-size: var(--text-sm);
  gap: var(--space-2);
  grid-template-columns: 1rem 1fr;
  line-height: var(--leading-sm);
  outline: 0;
  padding-block: var(--space-1-5);
  user-select: none;

  &[data-highlighted] {
    background-color: var(--ink);
    color: var(--on-ink);
  }
`;

const ItemIndicator = styled(BaseSelect.ItemIndicator, forwardRef)`
  grid-column-start: 1;
`;

const ItemText = styled(BaseSelect.ItemText, forwardRef)`
  grid-column-start: 2;
`;

const ScrollArrow = styled('div', forwardRef)`
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 1rem;
  align-items: center;
  justify-content: center;
  background-color: var(--surface);
  cursor: default;
  font-size: var(--text-xs);
  text-align: center;

  &::before {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
  }

  &[data-direction='up'] {
    top: 0;

    &[data-side='none']::before {
      top: -100%;
    }
  }

  &[data-direction='down'] {
    bottom: 0;

    &[data-side='none']::before {
      bottom: -100%;
    }
  }
`;

const StyledCaretUpDownIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const CaretUpDownIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledCaretUpDownIcon
      ref={ref}
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: 'block', ...(typeof style === 'object' && style) }}
    >
      <path d="M11 10H5l3 3.5zm0-4H5l3-3.5z" />
    </StyledCaretUpDownIcon>
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
      style={{ display: 'block', ...(typeof style === 'object' && style) }}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </StyledCheckIcon>
  ),
);

const StyledCaretUpIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const CaretUpIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledCaretUpIcon
      ref={ref}
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: 'block', ...(typeof style === 'object' && style) }}
    >
      <path d="M12 10H4l4-4.5z" />
    </StyledCaretUpIcon>
  ),
);

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
      style={{ display: 'block', ...(typeof style === 'object' && style) }}
    >
      <path d="M12 6H4l4 4.5z" />
    </StyledCaretDownIcon>
  ),
);

export const CommonSelect = {
  ...BaseSelect,
  Field,
  Label,
  Value,
  Trigger,
  Positioner,
  Popup,
  List,
  Item,
  ItemIndicator,
  ItemText,
  ScrollArrow,
  CaretUpDownIcon,
  CheckIcon,
  CaretUpIcon,
  CaretDownIcon,
};
