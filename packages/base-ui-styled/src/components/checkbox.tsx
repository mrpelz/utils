import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseCheckbox.Root, forwardRef)`
  display: flex;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: white;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    color: oklch(14.5% 0 0deg);
  }

  &[data-checked],
  &[data-indeterminate] {
    background-color: oklch(14.5% 0 0deg);
    color: white;

    @media (prefers-color-scheme: dark) {
      background-color: white;
      color: oklch(14.5% 0 0deg);
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: 2px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
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

export const Checkbox = {
  ...BaseCheckbox,
  Root,
  Indicator,
  Icon,
};
