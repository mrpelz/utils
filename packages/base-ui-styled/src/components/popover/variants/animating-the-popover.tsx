import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonPopover } from '../common.js';

const Positioner = styled(BasePopover.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
  transition-duration: var(--duration-slow);
  transition-property: top, left, right, bottom, transform;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);

  &[data-instant] {
    transition: none;
  }
`;

const Popup = styled(BasePopover.Popup, forwardRef)`
  position: relative;
  width: var(--popup-width, auto);
  max-width: 31.25rem;
  height: var(--popup-height, auto);
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  outline: none;
  transform-origin: var(--transform-origin);
  transition-duration: var(--duration-slow);
  transition-property: width, height, opacity, transform;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }

  &[data-instant] {
    transition: none;
  }
`;

const Arrow = styled(BasePopover.Arrow, forwardRef)`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;
  transition: left var(--duration-slow) cubic-bezier(0.22, 1, 0.36, 1);

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

const Viewport = styled(BasePopover.Viewport, forwardRef)`
  --viewport-inline-padding: var(--space-2);

  position: relative;
  overflow: clip;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: var(--space-2) var(--viewport-inline-padding);

  [data-previous],
  [data-current] {
    width: calc(var(--popup-width) - 2 * var(--viewport-inline-padding));
    opacity: 1;
    transform: translateX(0);
    transition:
      transform var(--duration-slow) cubic-bezier(0.22, 1, 0.36, 1),
      opacity calc(var(--duration-slow) / 2) cubic-bezier(0.22, 1, 0.36, 1);
  }

  &[data-activation-direction~='right'] [data-previous][data-ending-style] {
    opacity: 0;
    transform: translateX(-50%);
  }

  &[data-activation-direction~='right'] [data-current][data-starting-style] {
    opacity: 0;
    transform: translateX(50%);
  }

  &[data-activation-direction~='left'] [data-previous][data-ending-style] {
    opacity: 0;
    transform: translateX(50%);
  }

  &[data-activation-direction~='left'] [data-current][data-starting-style] {
    opacity: 0;
    transform: translateX(-50%);
  }
`;

const Stack = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const Container = styled('div', forwardRef)`
  display: flex;
  gap: var(--space-2);
`;

const ProfilePanel = styled('div', forwardRef)`
  display: grid;
  width: max-content;
  column-gap: var(--space-2);
  grid-template-columns: auto auto;
`;

const ProfileTitle = styled('span', forwardRef)`
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  grid-column: 2;
  grid-row: 1;
`;

const ProfilePlan = styled('span', forwardRef)`
  color: var(--muted);
  font-size: var(--text-sm);
  grid-column: 2;
  grid-row: 2;
  line-height: var(--leading-sm);
`;

const ProfileActions = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  padding-top: var(--space-2);
  font-size: var(--text-sm);
  gap: var(--space-2);
  grid-column: 1 / span 2;
  grid-row: 3;
  line-height: var(--leading-sm);
`;

const ProfileLink = styled('a', forwardRef)`
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

const ProfileAvatar = styled(BaseAvatar.Root, forwardRef)`
  display: inline-flex;
  overflow: hidden;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  background-color: var(--active-wash);
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  grid-column: 1;
  grid-row: 1 / span 2;
  line-height: var(--leading-none);
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
`;

const ProfileAvatarImage = styled(BaseAvatar.Image, forwardRef)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const animatingThePopover = {
  ...CommonPopover,
  Positioner,
  Popup,
  Arrow,
  Viewport,
  Stack,
  Container,
  ProfilePanel,
  ProfileTitle,
  ProfilePlan,
  ProfileActions,
  ProfileLink,
  ProfileAvatar,
  ProfileAvatarImage,
};
