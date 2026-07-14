import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonNavigationMenu } from '../common.js';

const Content = styled(BaseNavigationMenu.Content, forwardRef)`
  width: calc(100vw - 40px);
  height: 100%;
  box-sizing: border-box;
  padding: var(--space-2);
  transition:
    opacity calc(var(--duration) * 0.5) ease,
    transform var(--duration) var(--easing);

  @media (width >= 500px) {
    width: max-content;
    max-width: 400px;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  &[data-starting-style] {
    &[data-activation-direction='left'] {
      transform: translateX(-50%);
    }

    &[data-activation-direction='right'] {
      transform: translateX(50%);
    }
  }

  &[data-ending-style] {
    &[data-activation-direction='left'] {
      transform: translateX(50%);
    }

    &[data-activation-direction='right'] {
      transform: translateX(-50%);
    }
  }
`;

const GridLinkList = styled('ul', forwardRef)`
  display: grid;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  grid-template-columns: 1fr 1fr;
  list-style: none;

  @media (width <= 500px) {
    grid-template-columns: 1fr;
  }
`;

const FlexLinkList = styled('ul', forwardRef)`
  display: flex;
  max-width: 400px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const main = {
  ...CommonNavigationMenu,
  Content,
  GridLinkList,
  FlexLinkList,
};
