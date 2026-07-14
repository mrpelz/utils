import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonScrollArea } from '../common.js';

const Root = styled(BaseScrollArea.Root, forwardRef)`
  width: 20rem;
  max-width: calc(100vw - 8rem);
  height: 20rem;
  box-sizing: border-box;
`;

const Content = styled(BaseScrollArea.Content, forwardRef)`
  padding: var(--space-3) var(--space-6) var(--space-6) var(--space-3);
`;

const Grid = styled('ul', forwardRef)`
  display: grid;
  padding: 0;
  margin: 0;
  gap: var(--space-3);
  grid-template-columns: repeat(10, 6.25rem);
  grid-template-rows: repeat(10, 6.25rem);
  list-style: none;
`;

const Item = styled('li', forwardRef)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--active-wash);
  color: var(--muted);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  position: relative;
  display: flex;
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

  &[data-orientation='vertical'] {
    width: 1rem;
  }

  &[data-orientation='horizontal'] {
    height: 1rem;
  }
`;

export const bothScrollbars = {
  ...CommonScrollArea,
  Root,
  Content,
  Grid,
  Item,
  Scrollbar,
};
