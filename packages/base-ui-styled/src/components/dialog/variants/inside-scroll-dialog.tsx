import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonDialog } from '../common.js';

const Backdrop = styled(BaseDialog.Backdrop, forwardRef)`
  --backdrop-opacity: 0.2;

  position: fixed;
  background-color: black;
  inset: 0;
  opacity: var(--backdrop-opacity);
  transition: opacity var(--duration-medium);

  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  @media (prefers-color-scheme: dark) {
    --backdrop-opacity: 0.5;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const Viewport = styled(BaseDialog.Viewport, forwardRef)`
  position: fixed;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) 0;
  inset: 0;

  @media (height >= 600px) {
    padding: var(--space-8) 0 var(--space-12);
  }
`;

const Popup = styled(BaseDialog.Popup, forwardRef)`
  position: relative;
  display: flex;
  width: min(40rem, calc(100vw - 2rem));
  max-width: 100%;
  min-height: 0;
  max-height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  transition:
    transform var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.98);
  }
`;

const Header = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  border-bottom: var(--border-width) solid var(--border);
  gap: var(--space-1);
`;

const Body = styled(BaseScrollArea.Root, forwardRef)`
  position: relative;
  display: flex;
  overflow: hidden;
  min-height: 0;
  flex: 1 1 auto;

  &:has(> :focus-visible) {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 0;
  }
`;

const BodyViewport = styled(BaseScrollArea.Viewport, forwardRef)`
  min-height: 0;
  box-sizing: border-box;
  flex: 1 1 auto;
  outline: none;
  overscroll-behavior: contain;
`;

const BodyContent = styled(BaseScrollArea.Content, forwardRef)`
  display: flex;
  flex-direction: column;
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  display: flex;
  width: 1rem;
  justify-content: center;
  background-color: color-mix(in srgb, var(--on-surface) 12%, transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-medium);

  &[data-hovering],
  &[data-scrolling] {
    opacity: 1;
    pointer-events: auto;
  }

  &[data-scrolling] {
    transition-duration: 0ms;
  }
`;

const ScrollbarThumb = styled(BaseScrollArea.Thumb, forwardRef)`
  width: 100%;
  background-color: var(--border);
`;

const Section = styled('section', forwardRef)`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-1);
`;

const SectionTitle = styled('h3', forwardRef)`
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const SectionBody = styled('p', forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const Actions = styled('div', forwardRef)`
  display: flex;
  justify-content: flex-end;
  padding: var(--space-4);
  border-top: var(--border-width) solid var(--border);
  gap: var(--space-3);
`;

export const insideScrollDialog = {
  ...CommonDialog,
  Backdrop,
  Viewport,
  Popup,
  Header,
  Body,
  BodyViewport,
  BodyContent,
  Scrollbar,
  ScrollbarThumb,
  Section,
  SectionTitle,
  SectionBody,
  Actions,
};
