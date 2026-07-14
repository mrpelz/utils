import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

const Root = styled(BaseNavigationMenu.Root, forwardRef)`
  min-width: max-content;
  box-sizing: border-box;
  color: var(--on-surface);
`;

const List = styled(BaseNavigationMenu.List, forwardRef)`
  position: relative;
  display: flex;
  padding: 0;
  margin: 0;
  gap: 1px;
  list-style: none;
`;

export const navigationMenuTriggerStyles = css`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: 0;
  margin: 0;
  background-color: transparent;
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-1-5);
  line-height: var(--leading-sm);
  outline: 0;
  text-decoration: none;
  user-select: none;

  @media (width <= 500px) {
    padding: 0 var(--space-2);
  }

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

const Trigger = styled(BaseNavigationMenu.Trigger, forwardRef)`
  ${navigationMenuTriggerStyles}
`;

const Icon = styled(BaseNavigationMenu.Icon, forwardRef)`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &[data-popup-open] {
    transform: rotate(180deg);
  }
`;

const Positioner = styled(BaseNavigationMenu.Positioner, forwardRef)`
  --duration: 0.35s;
  --easing: cubic-bezier(0.22, 1, 0.36, 1);

  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
  box-sizing: border-box;
  transition-duration: var(--duration);
  transition-property: top, left, right, bottom;
  transition-timing-function: var(--easing);

  &::before {
    position: absolute;
    content: '';
  }

  &[data-side='top']::before {
    right: 0;
    bottom: -10px;
    left: 0;
    height: 10px;
  }

  &[data-side='bottom']::before {
    top: -10px;
    right: 0;
    left: 0;
    height: 10px;
  }

  &[data-side='left']::before {
    top: 0;
    right: -10px;
    bottom: 0;
    width: 10px;
  }

  &[data-side='right']::before {
    top: 0;
    bottom: 0;
    left: -10px;
    width: 10px;
  }

  &[data-instant] {
    transition: none;
  }
`;

export const navigationMenuPopupStyles = css`
  position: relative;
  overflow: visible;
  width: var(--popup-width);
  height: var(--popup-height);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: 0;
  transform-origin: var(--transform-origin);
  transition-duration: var(--duration);
  transition-property: opacity, transform, width, height;
  transition-timing-function: var(--easing);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }

  &[data-ending-style] {
    transition-duration: var(--duration-medium);
    transition-timing-function: ease;
  }
`;

const Popup = styled(BaseNavigationMenu.Popup, forwardRef)`
  ${navigationMenuPopupStyles}
`;

const Viewport = styled(BaseNavigationMenu.Viewport, forwardRef)`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

export const navigationMenuArrowStyles = css`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;
  transition:
    left var(--duration) var(--easing),
    right var(--duration) var(--easing);

  &[data-side='top'] {
    bottom: -6px;
    rotate: 180deg;
  }

  &[data-side='bottom'] {
    top: -6px;
    rotate: 0deg;
  }

  &[data-side='left'] {
    right: -9px;
    rotate: 90deg;
  }

  &[data-side='right'] {
    left: -9px;
    rotate: -90deg;
  }

  &::before {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: var(--border-width) solid var(--border);
    background-color: var(--surface);
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);
  }
`;

const Arrow = styled(BaseNavigationMenu.Arrow, forwardRef)`
  ${navigationMenuArrowStyles}
`;

export const navigationMenuLinkCardStyles = css`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: var(--space-2);
  border: 0;
  background-color: transparent;
  color: inherit;
  text-align: left;
  text-decoration: none;

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

const LinkCard = styled(BaseNavigationMenu.Link, forwardRef)`
  ${navigationMenuLinkCardStyles}
`;

const LinkTitle = styled('h3', forwardRef)`
  margin: 0 0 4px;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-xs);
`;

const LinkDescription = styled('p', forwardRef)`
  margin: 0;
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
`;

export const CommonNavigationMenu = {
  ...BaseNavigationMenu,
  Root,
  List,
  Trigger,
  Icon,
  Positioner,
  Popup,
  Viewport,
  Arrow,
  LinkCard,
  LinkTitle,
  LinkDescription,
};
