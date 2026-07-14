import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export type AccordionRootProps = BaseAccordion.Root.Props & {
  'styled-max-width'?: Properties['maxWidth'];
};

// eslint-disable-next-line prettier/prettier
const Root = styled<typeof BaseAccordion.Root, AccordionRootProps>(BaseAccordion.Root, forwardRef)`
  display: flex;
  width: 100%;
  /* stylelint-disable-next-line declaration-property-value-no-unknown */
  max-width: attr(styled-max-width type(\<length\>), none);
  box-sizing: border-box;
  flex-direction: column;
  border: var(--border-width) solid var(--border);
  color: var(--on-surface);
`;

const Item = styled(BaseAccordion.Item, forwardRef)`
  & + & {
    border-top: var(--border-width) solid var(--border);
  }
`;

export type AccordionHeaderProps = BaseAccordion.Header.Props & {
  'styled-cursor-closed'?: Properties['cursor'];
  'styled-cursor-open'?: Properties['cursor'];
};

// eslint-disable-next-line prettier/prettier
const Header = styled<typeof BaseAccordion.Header, AccordionHeaderProps>(BaseAccordion.Header, forwardRef)`
  margin: 0;

  --styled-cursor-closed: attr(styled-cursor-closed type(\<custom-ident\>));
  --styled-cursor-open: attr(styled-cursor-open type(\<custom-ident\>));

  &:not([data-disabled]) {
    &[data-closed] {
      & > button {
        cursor: var(--styled-cursor-closed, zoom-in);
      }
    }

    &[data-open] {
      & > button {
        cursor: var(--styled-cursor-open, zoom-out);
      }
    }
  }
`;

const StyledIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
  transition: transform var(--duration-fast) ease-out;

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
  padding: var(--space-2) var(--space-3);
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-4);
  line-height: var(--leading-sm);
  text-align: left;
  user-select: none;

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
  }
`;

const Panel = styled(BaseAccordion.Panel, forwardRef)`
  overflow: hidden;
  height: var(--accordion-panel-height);
  box-sizing: border-box;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  transition: height var(--duration-medium) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    height: 0;
  }
`;

const Content = styled('div', forwardRef)`
  padding: var(--space-2) var(--space-3);
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
