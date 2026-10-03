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
  scroll-snap-type: y mandatory;

  @media screen and (width <= 768px) {
    grid-template: 'content' 'config';
  }
`;

// Sticky, so a stacking context: it needs the page background, or glass in
// it blends with nothing (rendering gray and unblurred).
export const Content = styled('section')`
  position: sticky;
  top: 0;
  display: grid;
  height: 100svh;
  padding: 1rem;
  margin: calc(1rem * -1);
  background-color: light-dark(white, #0a0a0a);
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
  background-color: light-dark(white, #0a0a0a);
  grid-area: head;
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
  text-decoration: underline;
`;

export const ComponentDocsLink = styled('a')`
  display: inline-block;
  color: #a1a1a1;
  font-size: 0.875rem;
`;

// Snaps to snap points of demos having them (plain lists' sections).
export const Stage = styled('stage')`
  position: relative;
  display: grid;
  overflow: auto;
  align-items: center;
  grid-area: stage;
  scroll-snap-stop: always;

  @media screen and (width <= 768px) {
    margin: calc(1rem * -1);
    margin-block-start: 0;
  }
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
    rgb(0 0 0) 0%,
    rgb(0 0 0 / 0%) 90%
  );
  mask-repeat: no-repeat;
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
    background-color: light-dark(white, #0a0a0a);
    ${({ drawBackdrop }) =>
      drawBackdrop
        ? css`
            content: '';
          `
        : undefined}
    inset: 0;
  }
`;

export const Config = styled('config' as 'section')`
  z-index: 1;
  display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
  min-height: 100svh;
  flex-direction: column;
  border: 1px dashed #404040;
  background-color: light-dark(white, #0a0a0a);
  color: light-dark(black, #a1a1a1);
  font-family: monospace;
  font-size: 0.875rem;
  grid-area: config;

  @media screen and (width <= 768px) {
    padding: 1rem;
    margin: calc(1rem * -1);
    margin-block: 0;
  }
`;

export const ConfigInner = styled(Config)`
  min-height: auto;
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

  @media screen and (width <= 768px) {
    margin: 0;
    margin-inline: calc(1rem * -1);
  }
`;

export const ConfigHeading = styled('summary')`
  position: sticky;
  top: 0;
  padding: 0.5rem;
  margin: calc(0.5rem * -1);
  margin-bottom: 0.25rem;
  background-color: light-dark(white, #0a0a0a);
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
