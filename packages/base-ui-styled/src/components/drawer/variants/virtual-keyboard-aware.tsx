import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../../style.js';
import { CommonDrawer } from '../common.js';

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

  /* While swiping, the popup's own bleed covers the bottom edge, so hide the
     fixed fill — otherwise it paints the surface color over the backdrop once
     the popup is dragged far enough down. */
  &:has([data-swiping])::after {
    opacity: 0;
  }
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  --bleed: var(--space-12);
  --footer-reserved-height: calc(5.25rem + var(--bleed));

  position: relative;
  z-index: 1;
  display: flex;
  overflow: visible;
  width: 100%;
  height: calc(100% - 1rem + var(--bleed));
  max-height: calc(100% - 1rem + var(--bleed));
  box-sizing: border-box;
  flex-direction: column;
  border-top: var(--border-width) solid var(--border);
  margin-bottom: calc(-1 * var(--bleed));
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  touch-action: none;
  transform: translateY(var(--drawer-swipe-movement-y));
  transition:
    transform var(--duration-slow) var(--ease-drawer),
    box-shadow var(--duration-slow) var(--ease-drawer);
  will-change: transform;

  &[data-swiping] {
    user-select: none;
  }

  &[data-starting-style],
  &[data-ending-style] {
    box-shadow: var(--popup-shadow-transparent);
    transform: translateY(calc(100% - var(--bleed) + 2px));
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }
`;

const Header = styled('div', forwardRef)`
  position: relative;
  flex-shrink: 0;
  padding: var(--space-4) var(--space-6);
  border-bottom: var(--border-width) solid var(--border-muted);
  touch-action: none;
  user-select: none;
`;

const HeaderActions = styled('div', forwardRef)`
  display: grid;
  align-items: center;
  gap: var(--space-3);
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
`;

const HeaderButton = styled('div', forwardRef)`
  min-width: 0;

  &:first-child {
    justify-self: start;
  }

  &:last-child {
    justify-self: end;
  }
`;

const Handle = styled('div', forwardRef)`
  position: absolute;
  top: var(--space-2);
  left: 50%;
  width: var(--space-12);
  height: var(--space-1);
  flex-shrink: 0;
  margin: 0;
  background-color: var(--border-muted);
  transform: translateX(-50%);
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  margin: 0;
  cursor: default;
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  line-height: var(--leading-md);
  text-align: center;
`;

const Scroll = styled(BaseDrawer.Content, forwardRef)`
  min-height: 0;
  flex: 1 1 auto;
  padding: var(--space-4) var(--space-6) var(--space-6);
  overflow-y: auto;
  overscroll-behavior: contain;
  touch-action: auto;
`;

const Form = styled('div', forwardRef)`
  display: grid;
  width: 100%;
  max-width: 22.5rem;
  margin: 0 auto;
  gap: var(--space-3);
`;

const Field = styled('label', forwardRef)`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

const FieldLabel = styled('span', forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const fieldInputStyles = css`
  width: 100%;
  box-sizing: border-box;
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

const Input = styled('input', forwardRef)`
  ${fieldInputStyles}
  height: var(--control-height);
  padding: 0 var(--space-2);
`;

const Textarea = styled('textarea', forwardRef)`
  ${fieldInputStyles}
  min-height: 5.5rem;
  padding: var(--space-2);
  resize: vertical;
`;

const FooterSlot = styled('div', forwardRef)`
  position: relative;
  min-height: var(--footer-reserved-height);
  flex-shrink: 0;
  transition-duration: 260ms;
  transition-property: min-height;
  transition-timing-function: var(--ease-drawer);

  &:focus-within {
    min-height: calc(
      var(--footer-reserved-height) + var(--drawer-keyboard-inset, 0px)
    );
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;
  }
`;

const StickyFooter = styled('div', forwardRef)`
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  left: 0;
  padding: var(--space-2-5) var(--space-6)
    calc(var(--space-2-5) + env(safe-area-inset-bottom, 0px) + var(--bleed));
  border-top: var(--border-width) solid var(--border);
  background-color: var(--surface);
  transition-duration: 260ms;
  transition-property: bottom, padding-bottom;
  transition-timing-function: var(--ease-drawer);
  will-change: bottom, padding-bottom;

  &:focus-within {
    position: fixed;
    z-index: 3;
    bottom: 0;
    padding-bottom: calc(
      var(--space-2-5) + env(safe-area-inset-bottom, 0px) + var(--bleed) +
        var(--drawer-keyboard-inset, 0px)
    );
    transform: translate3d(0, 0, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;
  }
`;

const Composer = styled('label', forwardRef)`
  display: flex;
  width: 100%;
  max-width: 22.5rem;
  flex-direction: column;
  margin: 0 auto;
  gap: var(--space-1);
`;

const ComposerInput = styled('input', forwardRef)`
  ${fieldInputStyles}
  height: var(--control-height-lg);
  padding: 0 var(--space-2-5);
`;

export const virtualKeyboardAware = {
  ...CommonDrawer,
  Viewport,
  Popup,
  Header,
  HeaderActions,
  HeaderButton,
  Handle,
  Title,
  Scroll,
  Form,
  Field,
  FieldLabel,
  Input,
  Textarea,
  FooterSlot,
  StickyFooter,
  Composer,
  ComposerInput,
};
