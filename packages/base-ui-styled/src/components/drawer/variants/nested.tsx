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
    pointer-events: none;
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
  --bleed: var(--space-12);
  --peek: var(--space-4);
  --stack-progress: clamp(0, var(--drawer-swipe-progress), 1);
  --stack-step: 0.05;
  --stack-peek-offset: max(
    0px,
    calc((var(--nested-drawers) - var(--stack-progress)) * var(--peek))
  );
  --stack-scale-base: max(
    0,
    calc(1 - (var(--nested-drawers) * var(--stack-step)))
  );
  --stack-scale: calc(
    var(--stack-scale-base) + (var(--stack-step) * var(--stack-progress))
  );
  --stack-shrink: calc(1 - var(--stack-scale));
  --stack-height: max(
    0px,
    calc(var(--drawer-frontmost-height, var(--drawer-height)) - var(--bleed))
  );
  --translate-y: calc(
    var(--drawer-swipe-movement-y) - var(--stack-peek-offset) -
      (var(--stack-shrink) * var(--stack-height))
  );

  position: relative;
  width: calc(100% + 2px);
  height: var(--drawer-height, auto);
  max-height: calc(80vh + var(--bleed));
  box-sizing: border-box;
  padding: var(--space-4) var(--space-6) var(--space-6);
  padding-bottom: calc(
    var(--space-6) + env(safe-area-inset-bottom, 0px) + var(--bleed)
  );
  border-width: 1px 1px 0;
  border-style: solid;
  border-color: var(--border);
  margin-right: -1px;
  margin-bottom: calc(-1 * var(--bleed));
  margin-left: -1px;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  transform: translateY(var(--translate-y)) scale(var(--stack-scale));
  transform-origin: 50% calc(100% - var(--bleed));
  transition:
    transform var(--duration-slow) var(--ease-drawer),
    height var(--duration-slow) var(--ease-drawer),
    opacity var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &[data-swiping],
  &[data-nested-drawer-swiping] {
    transition-duration: 0ms;
  }

  &::after {
    position: absolute;
    background-color: transparent;
    content: '';
    inset: 0;
    pointer-events: none;
    transition: background-color var(--duration-slow) var(--ease-drawer);
  }

  &[data-nested-drawer-open] {
    overflow: hidden;
    height: calc(var(--stack-height) + var(--bleed));

    &::after {
      background-color: rgb(0 0 0 / 5%);
    }
  }

  &[data-starting-style],
  &[data-ending-style] {
    transform: translateY(calc(100% - var(--bleed) + 2px));
  }

  &[data-ending-style] {
    opacity: 0.9999;
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }
`;

const Content = styled(BaseDrawer.Content, forwardRef)`
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
  transition: opacity var(--duration-medium) var(--ease-out-fast);

  [data-nested-drawer-open] & {
    opacity: 0;
  }

  [data-nested-drawer-open][data-nested-drawer-swiping] & {
    opacity: 1;
  }
`;

const Handle = styled('div', forwardRef)`
  width: var(--space-12);
  height: var(--space-1);
  margin: 0 auto var(--space-4);
  background-color: var(--border-muted);
  transition: opacity var(--duration-medium);

  [data-nested-drawer-open] & {
    opacity: 0;
  }

  [data-nested-drawer-open][data-nested-drawer-swiping] & {
    opacity: 1;
  }
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
  align-items: center;
  justify-content: end;
  gap: var(--space-4);
`;

const ActionsLeft = styled('div', forwardRef)`
  margin-right: auto;
`;

const List = styled('ul', forwardRef)`
  padding-left: var(--space-5);
  margin: 0 0 var(--space-6);
  color: var(--muted);
`;

const Field = styled('div', forwardRef)`
  display: grid;
  margin-bottom: var(--space-4);
  gap: var(--space-2);
`;

const Label = styled('label', forwardRef)`
  color: var(--muted);
  font-size: 0.925rem;
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Input = styled('input', forwardRef)`
  width: 100%;
  height: var(--control-height);
  box-sizing: border-box;
  padding: 0 var(--space-2);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &::placeholder {
    color: var(--subtle);
  }

  &:focus,
  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Textarea = styled('textarea', forwardRef)`
  width: 100%;
  min-height: 8rem;
  box-sizing: border-box;
  padding: var(--space-2) var(--space-2-5);
  border: var(--border-width) solid var(--border);
  border-radius: 0;
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
  resize: vertical;

  @media (any-pointer: coarse) {
    font-size: var(--text-md);
    line-height: var(--leading-md);
  }

  &::placeholder {
    color: var(--subtle);
  }

  &:focus,
  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

export const nested = {
  ...CommonDrawer,
  Backdrop,
  Viewport,
  Popup,
  Content,
  Handle,
  Title,
  Description,
  Actions,
  ActionsLeft,
  List,
  Field,
  Label,
  Input,
  Textarea,
};
