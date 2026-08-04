import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css, wrap } from './utils.js';

export type CollapsibleRootProps = BaseCollapsible.Root.Props & {
  'styled-max-width'?: Properties['maxWidth'];
};

// eslint-disable-next-line prettier/prettier
const Root = styled<typeof BaseCollapsible.Root, CollapsibleRootProps>(BaseCollapsible.Root, forwardRef)`
  --styled-max-width: attr(styled-max-width type(\<length\>), none);

  display: flex;
  max-width: var(--styled-max-width);
  flex-direction: column;
  justify-content: center;
  color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const StyledIcon = styled('svg', forwardRef)`
  transition: transform 100ms ease-out;
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
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem 0 0.75rem;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.5rem;
  line-height: 1;
  user-select: none;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    color: white;
  }

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: oklch(97% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(26.9% 0 0deg);
      }
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }

  &:active:not([data-disabled]) {
    background-color: oklch(92.2% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(37.1% 0 0deg);
    }
  }

  &[data-panel-open] svg {
    transform: rotate(90deg);
  }

  &[data-disabled] {
    border-color: oklch(55.6% 0 0deg);
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      border-color: oklch(70.8% 0 0deg);
      color: oklch(70.8% 0 0deg);
    }
  }
`;

export type CollapsiblePanelProps = BaseCollapsible.Panel.Props & {
  takeExpandedWidth?: boolean;
};

// eslint-disable-next-line prettier/prettier
const Panel = wrap(styled<typeof BaseCollapsible.Panel, CollapsiblePanelProps>(BaseCollapsible.Panel, forwardRef)`
    display: flex;
    overflow: hidden;
    height: var(--collapsible-panel-height);
    flex-direction: column;
    justify-content: end;
    font-size: 0.875rem;
    line-height: 1.25rem;
    transition: height 150ms ease-out;

    &[hidden]:not([hidden='until-found']) {
      ${({ takeExpandedWidth }) =>
        takeExpandedWidth
          ? css`
              height: 0;
              content-visibility: visible;
              visibility: hidden;
            `
          : css`
              display: none;
            `}
    }

    &[hidden='until-found'] {
      content-visibility: visible;
    }

    &[data-starting-style],
    &[data-ending-style] {
      height: 0;
    }
  `,
  (props: CollapsiblePanelProps) => ({
    ...props,
    ...((props.takeExpandedWidth ?? true) && {
      keepMounted: true,
      takeExpandedWidth: true,
    }),
  }),
);

const Content = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.875rem;
  gap: 0.5rem;
`;

export const Collapsible = {
  ...BaseCollapsible,
  Root,
  Icon,
  Trigger,
  Panel,
  Content,
};
