import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDrawer } from '../common.js';

const Viewport = styled(BaseDrawer.Viewport, forwardRef)`
  --viewport-padding: 0px;

  position: fixed;
  display: flex;
  justify-content: flex-end;
  padding: var(--viewport-padding);
  inset: 0;
  pointer-events: none;

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
  overscroll-behavior: contain;
  pointer-events: auto;
  touch-action: auto;
  transform: translateX(var(--drawer-swipe-movement-x));
  transition:
    transform var(--duration-slow) var(--ease-drawer),
    box-shadow var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &[data-starting-style],
  &[data-ending-style] {
    box-shadow: var(--popup-shadow-transparent);
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

export const nonModal = {
  ...CommonDrawer,
  Viewport,
  Popup,
  Actions,
};
