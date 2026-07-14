import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonDrawer } from '../common.js';

const Backdrop = styled(BaseDrawer.Backdrop, forwardRef)`
  --backdrop-opacity: 0.4;

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

const Viewport = styled(BaseDrawer.Viewport, forwardRef)`
  position: fixed;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  inset: 0;
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  display: flex;
  width: 100%;
  max-width: 20rem;
  box-sizing: border-box;
  flex-direction: column;
  padding: 0 var(--space-4)
    calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  gap: var(--space-3);
  outline: 0;
  pointer-events: none;
  transform: translateY(var(--drawer-swipe-movement-y));
  transition: transform var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &[data-starting-style],
  &[data-ending-style] {
    transform: translateY(calc(100% + 1rem + 2px));
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }
`;

const Surface = styled(BaseDrawer.Content, forwardRef)`
  overflow: hidden;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  pointer-events: auto;
`;

const Actions = styled('ul', forwardRef)`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const Action = styled('li', forwardRef)`
  &:not(:first-child) {
    border-top: var(--border-width) solid var(--border);
  }
`;

const ActionButton = styled('button', forwardRef)`
  width: 100%;
  height: var(--control-height-lg);
  box-sizing: border-box;
  padding: 0 var(--space-5);
  border: 0;
  margin: 0;
  background-color: transparent;
  color: inherit;
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-align: center;
  user-select: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    background-color: var(--hover-wash);
    outline: 0;
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

const DangerSurface = styled('div', forwardRef)`
  overflow: hidden;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  pointer-events: auto;
`;

const DangerButton = styled('button', forwardRef)`
  width: 100%;
  height: var(--control-height-lg);
  box-sizing: border-box;
  padding: 0 var(--space-5);
  border: 0;
  margin: 0;
  background-color: transparent;
  color: var(--color-red);
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-align: center;
  user-select: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    background-color: var(--hover-wash);
    outline: 0;
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

const visuallyHiddenStyles = css`
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  margin: -1px;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  ${visuallyHiddenStyles}
`;

const Description = styled(BaseDrawer.Description, forwardRef)`
  ${visuallyHiddenStyles}
`;

const Close = styled(BaseDrawer.Close, forwardRef)`
  ${visuallyHiddenStyles}
`;

export const actionSheetWithSeparateDestructiveAction = {
  ...CommonDrawer,
  Backdrop,
  Viewport,
  Popup,
  Surface,
  Actions,
  Action,
  ActionButton,
  DangerSurface,
  DangerButton,
  Title,
  Description,
  Close,
};
