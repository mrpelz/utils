import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css, wrap } from './utils.js';

export type AccordionRootProps = BaseAccordion.Root.Props & {
  maxWidth?: Properties['maxWidth'];
  takeExpandedWidth?: boolean;
};

// eslint-disable-next-line prettier/prettier
const Root = wrap(styled<typeof BaseAccordion.Root, AccordionRootProps>(BaseAccordion.Root, forwardRef)`
    --styled-max-width: attr(maxwidth type(\<length\>), none);

    display: flex;
    width: 100%;
    max-width: var(--styled-max-width);
    box-sizing: border-box;
    flex-direction: column;
    border: 1px solid oklch(14.5% 0 0deg);
    color: oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      border: 1px solid white;
      color: white;
    }

    & > * {
      & > [hidden]:not([hidden='until-found']) {
        ${({ takeExpandedWidth }) =>
          takeExpandedWidth
            ? css`
                display: block;
                height: 0;
                content-visibility: visible;
                visibility: hidden;
              `
            : undefined}
      }

      & > [hidden='until-found'] {
        content-visibility: visible;
      }
    }
  `,
  (props: AccordionRootProps) => ({
    ...props,
    ...((props.takeExpandedWidth ?? true) && {
      keepMounted: true,
      takeExpandedWidth: true,
    }),
  }),
);

const Item = styled(BaseAccordion.Item, forwardRef)`
  & + & {
    border-top: 1px solid oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      border-top: 1px solid white;
    }
  }
`;

export type AccordionHeaderProps = BaseAccordion.Header.Props & {
  cursorClosed?: Properties['cursor'];
  cursorOpen?: Properties['cursor'];
};

// eslint-disable-next-line prettier/prettier
const Header = styled<typeof BaseAccordion.Header, AccordionHeaderProps>(BaseAccordion.Header, forwardRef)`
  --styled-cursor-closed: attr(cursorclosed type(\<custom-ident\>));
  --styled-cursor-open: attr(cursoropen type(\<custom-ident\>));

  margin: 0;

  &:not([data-disabled]) {
    &[data-closed] {
      & > * {
        cursor: var(--styled-cursor-closed, zoom-in);
      }
    }

    &[data-open] {
      & > * {
        cursor: var(--styled-cursor-open, zoom-out);
      }
    }
  }
`;

const StyledIcon = styled('svg', forwardRef)`
  transition: transform 100ms ease-out;

  [data-panel-open] > & {
    transform: rotate(45deg);
  }
`;

const Icon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledIcon
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="M1.5 8h13M8 14.5v-13" />
    </StyledIcon>
  ),
);

const Trigger = styled(BaseAccordion.Trigger, forwardRef)`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 1rem;
  line-height: 1.25rem;
  text-align: left;
  user-select: none;

  @media (prefers-color-scheme: dark) {
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
    position: relative;
    z-index: 1;
    outline: 2px solid oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const Panel = styled(BaseAccordion.Panel, forwardRef)`
  overflow: hidden;
  height: var(--accordion-panel-height);
  box-sizing: border-box;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: height 150ms ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    height: 0;
  }
`;

const Content = styled('div', forwardRef)`
  padding: 0.5rem 0.75rem;
`;

export const Accordion = {
  ...BaseAccordion,
  Root,
  Item,
  Header,
  Trigger,
  Panel,
  Icon,
  Content,
};
