import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import {
  CommonNavigationMenu,
  navigationMenuArrowStyles,
  navigationMenuPopupStyles,
} from '../common.js';

const Popup = styled(BaseNavigationMenu.Popup, forwardRef)`
  ${navigationMenuPopupStyles}

  &[data-ending-style] {
    transition-property: opacity, transform;
  }
`;

const Content = styled(BaseNavigationMenu.Content, forwardRef)`
  width: calc(100vw - 40px);
  height: 100%;
  box-sizing: border-box;
  padding: var(--space-2);
  transition:
    opacity calc(var(--duration) * 0.5) ease,
    transform var(--duration) cubic-bezier(0.4, 0, 0.2, 1);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  &[data-starting-style] {
    &[data-activation-direction='left'] {
      transform: translateX(-2rem);
    }

    &[data-activation-direction='right'] {
      transform: translateX(2rem);
    }
  }

  &[data-ending-style] {
    transition-duration: calc(var(--duration) * 0.5);
    transition-timing-function: ease;

    &[data-activation-direction='left'] {
      transform: translateX(2rem);
    }

    &[data-activation-direction='right'] {
      transform: translateX(-2rem);
    }
  }
`;

const ProductContent = styled(Content, forwardRef)`
  padding: 0;

  @media (width >= 700px) {
    width: min(675px, calc(100vw - 40px));
  }
`;

const GuidesContent = styled(Content, forwardRef)`
  padding: 0;

  @media (width >= 700px) {
    width: min(500px, calc(100vw - 40px));
  }
`;

const SubmenuRoot = styled(BaseNavigationMenu.Root, forwardRef)`
  overflow: clip;
  color: var(--on-surface);
`;

const SubmenuLayout = styled('div', forwardRef)`
  display: grid;
  overflow: clip;
  grid-template-columns: 1fr;

  @media (width >= 700px) {
    grid-template-columns: 13rem minmax(0, 1fr);
  }
`;

const SubmenuList = styled(BaseNavigationMenu.List, forwardRef)`
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  padding: var(--space-2);
  margin: 0;
  gap: var(--space-1);
  list-style: none;
  overflow-x: auto;

  @media (width >= 700px) {
    overflow: visible clip;
    height: var(--popup-height);
    flex-direction: column;
    border-right: var(--border-width) solid var(--border);
    gap: 1px;
    transition: height var(--duration) var(--easing);
  }
`;

const SubmenuTrigger = styled(BaseNavigationMenu.Trigger, forwardRef)`
  display: flex;
  width: 100%;
  min-width: 10rem;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--space-2);
  border: 0;
  margin: 0;
  background-color: transparent;
  color: inherit;
  font-family: inherit;
  gap: var(--space-1);
  text-align: left;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &[data-popup-open] {
    background-color: var(--hover-wash);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const SubmenuLabel = styled('span', forwardRef)`
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-xs);
`;

const SubmenuHint = styled('span', forwardRef)`
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const SubmenuViewport = styled(BaseNavigationMenu.Viewport, forwardRef)`
  position: relative;
  overflow: hidden;
  min-height: 16.5rem;
  border-top: var(--border-width) solid var(--border);

  @media (width >= 700px) {
    border-top: 0;
  }
`;

const SubmenuContent = styled(BaseNavigationMenu.Content, forwardRef)`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
  transform: translateX(0);
  transition:
    opacity var(--duration) var(--easing),
    transform var(--duration) var(--easing),
    filter var(--duration) var(--easing);

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

  @media (width >= 700px) {
    filter: blur(0);
    transform: translateY(0);
    transition-duration: calc(var(--duration) * 1.35);
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);

    &[data-starting-style] {
      &[data-activation-direction='up'] {
        transform: translateY(-72px);
      }

      &[data-activation-direction='down'] {
        transform: translateY(72px);
      }
    }

    &[data-ending-style] {
      &[data-activation-direction='up'] {
        transform: translateY(72px);
      }

      &[data-activation-direction='down'] {
        transform: translateY(-72px);
      }
    }

    &[data-starting-style],
    &[data-ending-style] {
      filter: blur(2px);
    }
  }
`;

const SubmenuTitle = styled('h4', forwardRef)`
  margin: 0;
  font-size: var(--text-md);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
`;

const SubmenuDescription = styled('p', forwardRef)`
  margin: var(--space-1) 0 0;
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

const LinkList = styled('ul', forwardRef)`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0 calc(-1 * var(--space-2));
  gap: 0;
  list-style: none;
`;

const GuidesPanel = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
`;

const Arrow = styled(BaseNavigationMenu.Arrow, forwardRef)`
  ${navigationMenuArrowStyles}

  @media (width <= 699px) {
    display: none;
  }
`;

export const nestedInlineSubmenus = {
  ...CommonNavigationMenu,
  Popup,
  Content,
  ProductContent,
  GuidesContent,
  SubmenuRoot,
  SubmenuLayout,
  SubmenuList,
  SubmenuTrigger,
  SubmenuLabel,
  SubmenuHint,
  SubmenuViewport,
  SubmenuContent,
  SubmenuTitle,
  SubmenuDescription,
  LinkList,
  GuidesPanel,
  Arrow,
};
