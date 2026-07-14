import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css } from '../../style.js';

const Trigger = styled(BasePreviewCard.Trigger, forwardRef)`
  color: var(--on-surface);
  outline: 0;
  text-decoration-color: color-mix(
    in oklab,
    var(--on-surface),
    transparent 40%
  );
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;

  @media (hover: hover) {
    &:hover {
      text-decoration-color: var(--on-surface);
    }
  }

  &[data-popup-open] {
    text-decoration-color: var(--on-surface);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    text-decoration-line: none;
  }
`;

const Positioner = styled(BasePreviewCard.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
`;

const Popup = styled(BasePreviewCard.Popup, forwardRef)`
  position: relative;
  width: var(--popup-width, auto);
  height: var(--popup-height, auto);
  box-sizing: border-box;
  border: var(--border-width) solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--popup-shadow);
  color: var(--on-surface);
  transform-origin: var(--transform-origin);
  transition:
    transform var(--duration-fast) ease-out,
    opacity var(--duration-fast) ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.98);
  }
`;

const Arrow = styled(BasePreviewCard.Arrow, forwardRef)`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;

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
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: var(--border-width) solid var(--border);
    background-color: var(--surface);
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);
  }
`;

const PopupContent = styled('div', forwardRef)`
  display: flex;
  width: min-content;
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--space-2);
  gap: var(--space-2);
`;

const Image = styled('img', forwardRef)`
  display: block;
  max-width: none;
`;

const Summary = styled('p', forwardRef)`
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  text-wrap: pretty;
`;

const Paragraph = styled('p', forwardRef)`
  margin: 0;
  color: var(--on-surface);
  font-size: var(--text-md);
  line-height: var(--leading-md);
  text-wrap: balance;
`;

const Container = styled('div', forwardRef)`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-2);
`;

const LinkGroup = styled('div', forwardRef)`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1);
`;

export const previewCardButtonStyles = css`
  display: flex;
  height: var(--control-height);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  margin: 0;
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-none);
  user-select: none;
  white-space: nowrap;

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-wash);
    }
  }

  &:active {
    background-color: var(--active-wash);
  }
`;

const Button = styled('button', forwardRef)`
  ${previewCardButtonStyles}
`;

export const CommonPreviewCard = {
  ...BasePreviewCard,
  Trigger,
  Positioner,
  Popup,
  Arrow,
  PopupContent,
  Image,
  Summary,
  Paragraph,
  Container,
  LinkGroup,
  Button,
};
