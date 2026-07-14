import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDrawer } from '../common.js';

const Root = styled('div', forwardRef)`
  --bleed: var(--space-12);

  position: relative;
  overflow: hidden;
  width: 100%;
`;

const Indent = styled(BaseDrawer.Indent, forwardRef)`
  --indent-radius: calc(1rem * (1 - var(--drawer-swipe-progress)));
  --indent-transition: calc(
    1 - clamp(0, calc(var(--drawer-swipe-progress) * 100000), 1)
  );

  position: relative;
  min-height: 20rem;
  padding: var(--space-4);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  color: var(--on-surface);
  contain: layout;
  transform-origin: center top;
  transition:
    transform 0.4s var(--ease-drawer),
    border-radius 0.25s var(--ease-drawer);
  transition-duration:
    calc(400ms * var(--indent-transition)),
    calc(250ms * var(--indent-transition));
  will-change: transform;

  &[data-active] {
    border-top-left-radius: var(--indent-radius);
    border-top-right-radius: var(--indent-radius);
    transform: scale(calc(0.98 + (0.02 * var(--drawer-swipe-progress))))
      translateY(calc(var(--space-2) * (1 - var(--drawer-swipe-progress))));
  }
`;

const Center = styled('div', forwardRef)`
  display: flex;
  min-height: 20rem;
  align-items: center;
  justify-content: center;
`;

const IndentBackground = styled(BaseDrawer.IndentBackground, forwardRef)`
  position: absolute;
  background-color: var(--indent-background);
  inset: 0;
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
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  inset: 0;
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  --bleed: var(--space-12);

  width: 100%;
  max-height: calc(80vh + var(--bleed));
  box-sizing: border-box;
  padding: var(--space-4) var(--space-6) var(--space-6);
  padding-bottom: calc(
    var(--space-6) + env(safe-area-inset-bottom, 0px) + var(--bleed)
  );
  border-top: var(--border-width) solid var(--border);
  margin-bottom: calc(-1 * var(--bleed));
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  transform: translateY(var(--drawer-swipe-movement-y));
  transition: transform var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &[data-starting-style],
  &[data-ending-style] {
    transform: translateY(calc(100% - var(--bleed) + 2px));
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }
`;

const Handle = styled('div', forwardRef)`
  width: var(--space-12);
  height: var(--space-1);
  margin: 0 auto var(--space-4);
  background-color: var(--border-muted);
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  margin-top: 0;
  margin-bottom: var(--space-1);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
  text-align: center;
`;

const Description = styled(BaseDrawer.Description, forwardRef)`
  margin: 0 0 var(--space-6);
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-align: center;
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  justify-content: center;
  gap: var(--space-3);
`;

export const indentEffect = {
  ...CommonDrawer,
  Root,
  Indent,
  Center,
  IndentBackground,
  Backdrop,
  Viewport,
  Popup,
  Handle,
  Title,
  Description,
  Actions,
};
