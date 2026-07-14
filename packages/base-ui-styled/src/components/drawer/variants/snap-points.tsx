import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDrawer } from '../common.js';

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
  --bleed: var(--space-12);

  position: fixed;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  inset: 0;
  touch-action: none;

  &::after {
    position: fixed;
    bottom: 0;
    height: var(--bleed);
    background-color: var(--surface);
    content: '';
    inset-inline: 0;
    pointer-events: none;
  }

  &[data-closed]::after {
    opacity: 0;
  }
`;

const Content = styled('div', forwardRef)`
  width: 100%;
  max-width: 22.5rem;
  margin: 0 auto;
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  position: relative;
  z-index: 1;
  display: flex;
  overflow: visible;
  width: 100%;
  max-height: calc(100dvh - var(--top-margin));
  box-sizing: border-box;
  flex-direction: column;
  padding-bottom: max(
    0px,
    calc(var(--drawer-snap-point-offset) + var(--drawer-swipe-movement-y))
  );
  border-top: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  touch-action: none;
  transform: translateY(
    calc(var(--drawer-snap-point-offset) + var(--drawer-swipe-movement-y))
  );
  transition:
    transform var(--duration-slow) var(--ease-drawer),
    box-shadow var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &::after {
    position: absolute;
    top: 100%;
    height: var(--bleed);
    background-color: inherit;
    content: '';
    inset-inline: 0;
    pointer-events: none;
  }

  &[data-starting-style],
  &[data-ending-style] {
    padding-bottom: 0;
    box-shadow: var(--popup-shadow-transparent);
    transform: translateY(calc(100% + 2px));
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }
`;

const DragArea = styled('div', forwardRef)`
  flex-shrink: 0;
  padding: 0.875rem var(--space-6) var(--space-4);
  border-bottom: var(--border-width) solid var(--border-muted);
  touch-action: none;
  user-select: none;
`;

const Scroll = styled(BaseDrawer.Content, forwardRef)`
  min-height: 0;
  flex: 1 1 auto;
  padding: var(--space-4) var(--space-6)
    calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  overscroll-behavior: contain;
  touch-action: auto;
`;

const Handle = styled('div', forwardRef)`
  width: var(--space-12);
  height: var(--space-1);
  flex-shrink: 0;
  margin: 0 auto var(--space-2-5);
  background-color: var(--border-muted);
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  margin: 0;
  cursor: default;
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

const Cards = styled('div', forwardRef)`
  display: grid;
  margin: 0 0 var(--space-6);
  gap: var(--space-3);
`;

const Card = styled('div', forwardRef)`
  height: 3rem;
  background-color: var(--active-wash);
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: var(--space-4);
`;

export const snapPoints = {
  ...CommonDrawer,
  Backdrop,
  Viewport,
  Content,
  Popup,
  DragArea,
  Scroll,
  Handle,
  Title,
  Description,
  Cards,
  Card,
  Actions,
};
