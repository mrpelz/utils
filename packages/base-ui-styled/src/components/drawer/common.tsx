import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

export const drawerButtonStyles = css`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
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

  &[data-disabled] {
    border-color: var(--subtle);
    color: var(--subtle);
  }
`;

const Trigger = styled(BaseDrawer.Trigger, forwardRef)`
  ${drawerButtonStyles}
`;

const Close = styled(BaseDrawer.Close, forwardRef)`
  ${drawerButtonStyles}
`;

const Backdrop = styled(BaseDrawer.Backdrop, forwardRef)`
  --backdrop-opacity: 0.2;
  --bleed: var(--space-12);

  position: fixed;
  min-height: 100dvh;
  background-color: black;
  inset: 0;
  opacity: calc(var(--backdrop-opacity) * (1 - var(--drawer-swipe-progress)));
  transition-duration: var(--duration-slow);
  transition-property: opacity;
  transition-timing-function: var(--ease-drawer);

  /* iOS 26+: cover the entire visual viewport. */
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

  &[data-swiping] {
    transition-duration: 0ms;
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }
`;

const Content = styled(BaseDrawer.Content, forwardRef)`
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  margin-top: 0;
  margin-bottom: var(--space-1);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
`;

const Description = styled(BaseDrawer.Description, forwardRef)`
  margin: 0 0 var(--space-6);
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

export const CommonDrawer = {
  ...BaseDrawer,
  Trigger,
  Close,
  Backdrop,
  Content,
  Title,
  Description,
};
