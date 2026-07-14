import { Select as BaseSelect } from '@base-ui/react/select';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonToolbar } from '../common.js';

const ToggleGroup = styled(BaseToggleGroup, forwardRef)`
  display: flex;
  gap: 1px;
`;

const SelectPositioner = styled(BaseSelect.Positioner, forwardRef)`
  z-index: 10;
  outline: none;
  user-select: none;
`;

const SelectPopup = styled(BaseSelect.Popup, forwardRef)`
  min-width: var(--anchor-width);
  max-height: var(--available-height);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-clip: padding-box;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  overflow-y: auto;
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

const SelectItem = styled(BaseSelect.Item, forwardRef)`
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

  @media (pointer: coarse) {
    padding-block: var(--space-2-5);
  }

  &[data-highlighted] {
    background-color: var(--ink);
    color: var(--on-ink);
  }
`;

const SelectItemIndicator = styled(BaseSelect.ItemIndicator, forwardRef)`
  grid-column-start: 1;
`;

const SelectItemText = styled(BaseSelect.ItemText, forwardRef)`
  grid-column-start: 2;
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
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
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
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </StyledCheckIcon>
  ),
);

export const main = {
  ...CommonToolbar,
  ToggleGroup,
  SelectPositioner,
  SelectPopup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  CaretUpDownIcon,
  CheckIcon,
};
