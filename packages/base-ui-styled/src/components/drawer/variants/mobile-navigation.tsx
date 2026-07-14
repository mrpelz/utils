import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDrawer } from '../common.js';

const Backdrop = styled(BaseDrawer.Backdrop, forwardRef)`
  --backdrop-opacity: 1;

  position: fixed;
  min-height: 100dvh;
  background-image: linear-gradient(
    to bottom,
    rgb(0 0 0 / 5%) 0,
    rgb(0 0 0 / 10%) 50%
  );
  inset: 0;
  opacity: calc(var(--backdrop-opacity) * (1 - var(--drawer-swipe-progress)));
  transition-duration: 600ms;
  transition-property: opacity;
  transition-timing-function: var(--ease-out-fast);

  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  @media (prefers-color-scheme: dark) {
    --backdrop-opacity: 0.7;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  &[data-ending-style] {
    transition-duration: 350ms;
    transition-timing-function: cubic-bezier(0.375, 0.015, 0.545, 0.455);
  }
`;

const Viewport = styled(BaseDrawer.Viewport, forwardRef)`
  position: fixed;
  inset: 0;
`;

const ScrollAreaRoot = styled(BaseScrollArea.Root, forwardRef)`
  height: 100%;
  box-sizing: border-box;
  overscroll-behavior: contain;
  transition: transform 600ms var(--ease-out-fast);

  [data-ending-style] & {
    pointer-events: none;
  }

  [data-starting-style] & {
    transform: translateY(100dvh);
  }
`;

const ScrollAreaViewport = styled(BaseScrollArea.Viewport, forwardRef)`
  height: 100%;
  box-sizing: border-box;
  overscroll-behavior: contain;
  touch-action: auto;
`;

const ScrollContent = styled(BaseScrollArea.Content, forwardRef)`
  display: flex;
  min-height: 100%;
  align-items: flex-end;
  justify-content: center;
  padding-top: var(--space-8);

  @media (width >= 42rem) {
    padding-top: 4rem;
    padding-bottom: 4rem;
    padding-inline: 4rem;
  }
`;

const Content = styled(BaseDrawer.Content, forwardRef)`
  width: 100%;
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  width: 100%;
  max-width: 42rem;
  box-sizing: border-box;
  margin: 0 auto;
  outline: 0;
  transform: translateY(var(--drawer-swipe-movement-y));
  transition: transform 600ms var(--ease-out-fast);
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &[data-ending-style] {
    transform: translateY(calc(max(100dvh, 100%) + 2px));
    transition-duration: 350ms;
    transition-timing-function: cubic-bezier(0.375, 0.015, 0.545, 0.455);
  }
`;

const Panel = styled('nav', forwardRef)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-6) var(--space-6);
  border-top: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  transition: box-shadow 350ms cubic-bezier(0.375, 0.015, 0.545, 0.455);

  [data-ending-style] & {
    box-shadow: var(--popup-shadow-transparent);
  }

  @media (width >= 42rem) {
    border: var(--border-width) solid var(--border);
  }
`;

const Header = styled('div', forwardRef)`
  display: grid;
  align-items: start;
  grid-template-columns: 1fr auto 1fr;
`;

const HeaderSpacer = styled('div', forwardRef)`
  width: var(--space-9);
  height: var(--space-9);
`;

const Handle = styled('div', forwardRef)`
  width: var(--space-12);
  height: var(--space-1);
  background-color: var(--border-muted);
  justify-self: center;
`;

const CloseButton = styled(BaseDrawer.Close, forwardRef)`
  display: flex;
  width: var(--control-height);
  height: var(--control-height);
  align-items: center;
  justify-content: center;
  border: 0;
  background-color: transparent;
  color: var(--on-surface);
  justify-self: end;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:active {
    background-color: var(--active-wash);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  margin: 0 0 var(--space-1);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
`;

const Description = styled(BaseDrawer.Description, forwardRef)`
  margin: 0 0 var(--space-5);
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const List = styled('ul', forwardRef)`
  display: grid;
  padding: 0;
  margin: 0;
  gap: var(--space-1);
  list-style: none;
`;

const LongList = styled('ul', forwardRef)`
  display: grid;
  padding: 0;
  margin: var(--space-6) 0 0;
  gap: var(--space-1);
  list-style: none;
`;

const Item = styled('li', forwardRef)`
  display: flex;
`;

const Link = styled('a', forwardRef)`
  display: flex;
  width: 100%;
  height: var(--space-12);
  box-sizing: border-box;
  align-items: center;
  padding: 0 var(--space-4);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  color: inherit;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:active {
    background-color: var(--active-wash);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  position: absolute;
  display: flex;
  width: var(--space-4);
  justify-content: center;
  margin: 1px;
  background-color: rgb(0 0 0 / 12%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 250ms;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(255 255 255 / 12%);
  }

  &:hover,
  &[data-scrolling] {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 0ms;
    transition-duration: 75ms;
  }

  [data-ending-style] & {
    opacity: 0;
    transition-duration: 250ms;
  }
`;

const ScrollbarThumb = styled(BaseScrollArea.Thumb, forwardRef)`
  width: 100%;
  background-color: var(--border);
`;

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
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="m2.5 2.5 11 11m-11 0 11-11" />
    </StyledXIcon>
  ),
);

export const mobileNavigation = {
  ...CommonDrawer,
  Backdrop,
  Viewport,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollContent,
  Content,
  Popup,
  Panel,
  Header,
  HeaderSpacer,
  Handle,
  CloseButton,
  Title,
  Description,
  List,
  LongList,
  Item,
  Link,
  Scrollbar,
  ScrollbarThumb,
  XIcon,
};
