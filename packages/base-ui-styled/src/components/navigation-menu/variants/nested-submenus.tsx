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
    min-width: 400px;
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

  @media (width >= 640px) {
    grid-template-columns: 12rem 12rem;
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

const NestedIcon = styled(BaseNavigationMenu.Icon, forwardRef)`
  position: absolute;
  top: 50%;
  right: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -0.3rem;
  transition: transform 0.2s ease;

  &[data-popup-open] {
    transform: rotate(180deg);
  }
`;

export const nestedSubmenus = {
  ...CommonNavigationMenu,
  Content,
  GridLinkList,
  FlexLinkList,
  NestedIcon,
};
