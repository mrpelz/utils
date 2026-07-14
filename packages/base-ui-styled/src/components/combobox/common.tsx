import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

export const itemBaseStyles = css`
  display: grid;
  box-sizing: border-box;
  padding-right: var(--space-2);
  padding-left: var(--space-2);
  cursor: default;
  font-size: var(--text-sm);
  gap: var(--space-2);
  grid-template-columns: 1rem 1fr;
  outline: 0;
  padding-block: var(--space-2);
  user-select: none;
`;

export const iconButtonStyles = css`
  display: flex;
  width: var(--space-6);
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: var(--on-surface);
`;

const Trigger = styled(BaseCombobox.Trigger, forwardRef)`
  ${iconButtonStyles}
`;

const Clear = styled(BaseCombobox.Clear, forwardRef)`
  ${iconButtonStyles}
`;

const ActionButtons = styled('div', forwardRef)`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  color: var(--subtle);
`;

const Positioner = styled(BaseCombobox.Positioner, forwardRef)`
  outline: 0;
`;

const ItemIndicator = styled(BaseCombobox.ItemIndicator, forwardRef)`
  grid-column-start: 1;
`;

const ItemText = styled('span', forwardRef)`
  grid-column-start: 2;
`;

const Empty = styled('div', forwardRef)`
  box-sizing: border-box;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-2);
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
`;

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
      style={{ display: 'block', ...(typeof style === 'object' && style) }}
    >
      <path d="m4.5 4.5 7 7m-7 0 7-7" />
    </StyledXIcon>
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

const StyledPlusIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const PlusIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledPlusIcon
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: 'block', ...(typeof style === 'object' && style) }}
    >
      <path d="M1.5 8h13M8 14.5v-13" />
    </StyledPlusIcon>
  ),
);

export const CommonCombobox = {
  ...BaseCombobox,
  Trigger,
  Clear,
  ActionButtons,
  Positioner,
  ItemIndicator,
  ItemText,
  Empty,
  CheckIcon,
  XIcon,
  CaretDownIcon,
  CaretUpDownIcon,
  PlusIcon,
};
