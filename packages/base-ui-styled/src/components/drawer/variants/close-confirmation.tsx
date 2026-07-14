import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
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

  @supports (-webkit-touch-callout: none) {
    --viewport-padding: var(--space-2-5);
  }
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  --bleed: var(--space-12);

  position: relative;
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
  touch-action: auto;
  transform: translateX(var(--drawer-swipe-movement-x));
  transition: transform var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &::after {
    position: absolute;
    background-color: rgb(0 0 0 / 5%);
    content: '';
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-fast) ease-out;
  }

  &[data-dimmed]::after {
    opacity: 1;
  }

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

const Content = styled(BaseDrawer.Content, forwardRef)`
  display: flex;
  width: 100%;
  max-width: 32rem;
  flex-direction: column;
  margin: 0 auto;
  gap: var(--space-4);
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  margin: 0;
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
`;

const Description = styled(BaseDrawer.Description, forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const Intro = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const TextareaContainer = styled('form', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const Textarea = styled('textarea', forwardRef)`
  width: 100%;
  min-height: 8rem;
  box-sizing: border-box;
  padding: var(--space-2);
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

  &:focus {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  justify-content: end;
  gap: var(--space-3);
`;

const AlertPopup = styled(BaseAlertDialog.Popup, forwardRef)`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  width: var(--popup-width-sm);
  max-width: calc(100vw - 3rem);
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-4);
  border: var(--border-width) solid var(--border);
  margin-top: -2rem;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  gap: var(--space-4);
  transition:
    translate var(--duration-fast) ease-out,
    scale var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;
  translate: -50% -50%;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    scale: 0.96;
    translate: -50% calc(-50% + var(--space-1));
  }
`;

export const closeConfirmation = {
  ...CommonDrawer,
  Viewport,
  Popup,
  Content,
  Title,
  Description,
  Intro,
  TextareaContainer,
  Textarea,
  Actions,
  AlertPopup,
};
