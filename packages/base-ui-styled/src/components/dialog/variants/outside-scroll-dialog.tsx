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
  transition-duration: 600ms;
  transition-property: opacity;
  transition-timing-function: var(--ease-out-fast);

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

  &[data-ending-style] {
    transition-duration: 350ms;
    transition-timing-function: cubic-bezier(0.375, 0.015, 0.545, 0.455);
  }
`;

const Viewport = styled(BaseDialog.Viewport, forwardRef)`
  position: fixed;
  inset: 0;
`;

const ScrollAreaRoot = styled(BaseScrollArea.Root, forwardRef)`
  height: 100%;
  box-sizing: border-box;
  overscroll-behavior: contain;

  [data-ending-style] & {
    pointer-events: none;
  }
`;

const ScrollAreaViewport = styled(BaseScrollArea.Viewport, forwardRef)`
  height: 100%;
  box-sizing: border-box;
  overscroll-behavior: contain;

  [data-ending-style] & {
    pointer-events: none;
  }
`;

const ScrollContent = styled(BaseScrollArea.Content, forwardRef)`
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  display: flex;
  width: 1rem;
  justify-content: center;
  background-color: color-mix(in srgb, var(--on-surface) 12%, transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 250ms;

  &:hover,
  &[data-scrolling] {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 0ms;
    transition-duration: 75ms;
  }

  [data-ending-style] & {
    opacity: 0;
    transition-duration: 250ms;
  }
`;

const ScrollbarThumb = styled(BaseScrollArea.Thumb, forwardRef)`
  width: 100%;
  background-color: var(--border);
`;

const Popup = styled(BaseDialog.Popup, forwardRef)`
  position: relative;
  display: flex;
  width: min(40rem, calc(100vw - 2rem));
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-4);
  border: var(--border-width) solid var(--border);
  margin: 4rem auto;
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  gap: var(--space-4);
  outline: 0;
  transition: transform 700ms var(--ease-out-fast);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &[data-starting-style] {
    transform: translateY(100dvh);
  }

  &[data-ending-style] {
    transform: translateY(max(100dvh, 100%));
    transition-duration: 350ms;
    transition-timing-function: cubic-bezier(0.375, 0.015, 0.545, 0.455);
  }
`;

const PopupHeader = styled('div', forwardRef)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-right: var(--space-8);
  gap: var(--space-1);
`;

const Close = styled(BaseDialog.Close, forwardRef)`
  position: absolute;
  top: calc(-1 * var(--space-1));
  right: calc(-1 * var(--space-1));
  display: inline-flex;
  width: 2rem;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background-color: transparent;
  color: var(--on-surface);

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

const Body = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const Section = styled('section', forwardRef)`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
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

const FooterNote = styled('p', forwardRef)`
  margin: 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const FooterLink = styled('a', forwardRef)`
  color: var(--on-surface);
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.16em;

  @media (hover: hover) {
    &:hover {
      text-decoration: none;
    }
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 2px;
  }
`;

const StyledXIcon = styled('svg', forwardRef)`
  flex-shrink: 0;
`;

const XIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ style, ...props }, ref) => (
    <StyledXIcon
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof style === 'object' && style),
      }}
    >
      <path d="m2.5 2.5 11 11m-11 0 11-11" />
    </StyledXIcon>
  ),
);

export const outsideScrollDialog = {
  ...CommonDialog,
  Backdrop,
  Viewport,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollContent,
  Scrollbar,
  ScrollbarThumb,
  Popup,
  PopupHeader,
  Close,
  Body,
  Section,
  SectionTitle,
  SectionBody,
  FooterNote,
  FooterLink,
  XIcon,
};
