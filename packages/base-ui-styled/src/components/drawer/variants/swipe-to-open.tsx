import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDrawer } from '../common.js';

const Root = styled('div', forwardRef)`
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 20rem;
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  color: var(--on-surface);
`;

const Center = styled('div', forwardRef)`
  display: flex;
  min-height: 20rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
`;

const Instructions = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
`;

const Hint = styled('p', forwardRef)`
  box-sizing: border-box;
  padding-right: var(--space-12);
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-align: center;
`;

const SwipeArea = styled(BaseDrawer.SwipeArea, forwardRef)`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--space-10);
  box-sizing: border-box;
  border-left: 2px dashed var(--color-blue);
  background-color: color-mix(in oklch, var(--color-blue), transparent 90%);
`;

const SwipeLabel = styled('span', forwardRef)`
  position: absolute;
  z-index: 0;
  top: 50%;
  right: 0;
  margin-right: var(--space-2);
  color: var(--color-blue);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  letter-spacing: 0.12em;
  pointer-events: none;
  text-transform: uppercase;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center;
  white-space: nowrap;
`;

const Backdrop = styled(BaseDrawer.Backdrop, forwardRef)`
  --backdrop-opacity: 0.2;
  --bleed: var(--space-12);

  position: absolute;
  min-height: 100dvh;
  background-color: black;
  inset: 0;
  opacity: calc(var(--backdrop-opacity) * (1 - var(--drawer-swipe-progress)));
  transition-duration: var(--duration-slow);
  transition-property: opacity;
  transition-timing-function: var(--ease-drawer);

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
  --viewport-padding: 0px;

  position: absolute;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  padding: var(--viewport-padding);
  inset: 0;

  @supports (-webkit-touch-callout: none) {
    --viewport-padding: var(--space-2-5);
  }
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  --bleed: var(--space-12);

  width: calc(20rem + var(--bleed));
  max-width: calc(100vw - 3rem + var(--bleed));
  height: 100%;
  box-sizing: border-box;
  padding: var(--space-6);
  padding-right: calc(var(--space-6) + var(--bleed));
  border-left: var(--border-width) solid var(--border);
  margin-right: calc(-1 * var(--bleed));
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  overflow-y: auto;
  touch-action: auto;
  transform: translateX(var(--drawer-swipe-movement-x));
  transition: transform var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &[data-starting-style],
  &[data-ending-style] {
    transform: translateX(
      calc(100% - var(--bleed) + var(--viewport-padding) + 2px)
    );
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }

  @supports (-webkit-touch-callout: none) {
    --bleed: 0px;

    border: var(--border-width) solid var(--border);
    margin-right: 0;
  }
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
`;

export const swipeToOpen = {
  ...CommonDrawer,
  Root,
  Center,
  Instructions,
  Hint,
  SwipeArea,
  SwipeLabel,
  Backdrop,
  Viewport,
  Popup,
  Actions,
};
