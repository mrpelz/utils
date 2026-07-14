import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Viewport = styled(BaseScrollArea.Viewport, forwardRef)`
  height: 100%;
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Content = styled(BaseScrollArea.Content, forwardRef)`
  display: flex;
  flex-direction: column;
  padding-right: var(--space-5);
  padding-left: var(--space-3);
  gap: var(--space-4);
  padding-block: var(--space-2);
`;

const Paragraph = styled('p', forwardRef)`
  margin: 0;
  color: var(--on-surface);
  font-size: var(--text-sm);
  line-height: 1.375rem;
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  display: flex;
  width: 1rem;
  justify-content: center;
  margin: 1px;
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

const Thumb = styled(BaseScrollArea.Thumb, forwardRef)`
  width: 100%;
  background-color: var(--border);
`;

export const CommonScrollArea = {
  ...BaseScrollArea,
  Viewport,
  Content,
  Paragraph,
  Scrollbar,
  Thumb,
};
