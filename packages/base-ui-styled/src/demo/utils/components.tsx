import { styled } from 'goober';
import { forwardRef } from 'react-dom';

import { css } from '../../components/utils.js';

export const Container = styled('component')`
  position: relative;
  display: grid;
  width: 100svw;
  min-height: 100svh;
  padding: 1rem;
  gap: 1rem;
  grid-auto-columns: 1fr;
  grid-template: 'content config' 1fr / 1fr 25em;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

export const Content = styled('section')`
  position: sticky;
  top: 0;
  display: grid;
  height: 100svh;
  padding: 1rem;
  margin: calc(1rem * -1);
  gap: 1rem;
  grid-area: content;
  grid-template: 'head' auto 'stage' 1fr / 1fr;
`;

export const ComponentHeader = styled('component-header')`
  position: sticky;
  z-index: 1;
  top: 0;
  display: block;
  width: stretch;
  padding: 1rem;
  margin: calc(1rem * -1);
  background-color: white;
  grid-area: head;

  @media (prefers-color-scheme: dark) {
    background-color: #0a0a0a;
  }
`;

export const ComponentHeading = styled('h2')`
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

export const ComponentId = styled('a')`
  color: #a1a1a1;
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 400;
  margin-inline-start: 0.5rem;
`;

export const ComponentDocsLink = styled('a')`
  display: inline-block;
  color: #a1a1a1;
  font-size: 0.875rem;
`;

export const Stage = styled('stage')`
  position: relative;
  display: grid;
  align-items: center;
  grid-area: stage;
`;

export const StageBackground = styled('stage-background')`
  position: absolute;
  z-index: -1;
  background-image: radial-gradient(circle, #a1a1a1 0.5px, transparent 0.5px);
  background-position: center center;
  background-repeat: repeat;
  background-size: 9px 9px;
  inset: 0;
  mask-image: radial-gradient(
    ellipse at center,
    rgb(255 255 255) 0%,
    rgb(255 255 255 / 0%) 90%
  );
  mask-repeat: no-repeat;

  @media (prefers-color-scheme: dark) {
    mask-image: radial-gradient(
      ellipse at center,
      rgb(0 0 0) 0%,
      rgb(0 0 0 / 0%) 90%
    );
  }
`;

// eslint-disable-next-line prettier/prettier
export const StageInner = styled<{ center: boolean; drawBackdrop: boolean; stretch: boolean }>('stage-inner')`
  position: relative;
  display: block;
  width: ${({ stretch }) => (stretch ? '100%' : 'fit-content')};
  ${({ center }) =>
    center
      ? css`
          margin: 0 auto;
        `
      : undefined};

  &::before {
    position: absolute;
    z-index: -1;
    display: block;
    background-color: white;
    ${({ drawBackdrop }) =>
      drawBackdrop
        ? css`
            content: '';
          `
        : undefined}
    inset: 0;

    @media (prefers-color-scheme: dark) {
      background-color: #0a0a0a;
    }
  }
`;

export const Config = styled('config' as 'section')`
  display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
  flex-direction: column;
  border: 1px dashed #404040;
  font-family: monospace;
  font-size: 0.875rem;
  grid-area: config;

  @media (prefers-color-scheme: dark) {
    color: #a1a1a1;
    color-scheme: dark;
  }
`;

export const ConfigInner = styled(Config)`
  padding: 0.5rem;
  border-right: none !important;
  border-left: none !important;

  &[hidden] {
    display: none;
  }

  & + &,
  &:first-child {
    border-top: none;
  }

  &:last-child {
    flex-grow: 1;
    border-bottom: none;
  }
`;

export const ConfigHeading = styled('summary')`
  position: sticky;
  top: 0;
  padding: 0.5rem;
  margin: calc(0.5rem * -1);
  margin-bottom: 0.25rem;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: #0a0a0a;
  }

  cursor: pointer;
`;

export const PropContainer = styled('prop-container')`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: auto auto min-content;
  margin-block: 1rem;
`;

export const LogContainer = styled('log-container' as 'section', forwardRef)`
  display: block;
  flex-grow: 1;
  margin-block: 1rem;
`;

export const Button = styled('button', forwardRef)`
  align-self: self-start;
`;
