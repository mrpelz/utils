import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export type CollapsibleRootProps = BaseCollapsible.Root.Props & {
  'styled-max-width'?: Properties['maxWidth'];
};

// eslint-disable-next-line prettier/prettier
const Root = styled<typeof BaseCollapsible.Root, CollapsibleRootProps>(BaseCollapsible.Root, forwardRef)`
  display: flex;
  width: 100%;
  /* stylelint-disable-next-line declaration-property-value-no-unknown */
  max-width: attr(styled-max-width type(\<length\>), none);
  min-height: 9rem;
  flex-direction: column;
  justify-content: center;
  color: var(--on-surface);
`;

const StyledIcon = styled('svg', forwardRef)`
  transition: transform var(--duration-fast) ease-out;
`;

const Icon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledIcon
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
    </StyledIcon>
  ),
);

const Trigger = styled(BaseCollapsible.Trigger, forwardRef)`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-2) 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-none);
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

  &[data-panel-open] ${StyledIcon} {
    transform: rotate(90deg);
  }

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Panel = styled(BaseCollapsible.Panel, forwardRef)`
  display: flex;
  overflow: hidden;
  height: var(--collapsible-panel-height);
  flex-direction: column;
  justify-content: end;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  transition: height var(--duration-medium) ease-out;

  &[hidden]:not([hidden='until-found']) {
    display: none;
  }

  &[data-starting-style],
  &[data-ending-style] {
    height: 0;
  }
`;

const Content = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  padding: var(--space-2) 0.875rem;
  gap: var(--space-2);
`;

export const Collapsible = {
  ...BaseCollapsible,
  Root,
  Icon,
  Trigger,
  Panel,
  Content,
};
