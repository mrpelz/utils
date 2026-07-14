import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Label = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-sm);
`;

const Root = styled(BaseCheckbox.Root, forwardRef)`
  display: flex;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--surface);

  &[data-checked],
  &[data-indeterminate] {
    background-color: var(--ink);
    color: var(--on-ink);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 2px;
  }
`;

const Indicator = styled(BaseCheckbox.Indicator, forwardRef)`
  display: flex;

  &[data-unchecked] {
    display: none;
  }
`;

const StyledIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const Icon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledIcon
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
    </StyledIcon>
  ),
);

export const CommonCheckbox = {
  ...BaseCheckbox,
  Label,
  Root,
  Indicator,
  Icon,
};
