import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseTabs.Root, forwardRef)`
  width: 100%;
  max-width: 20rem;
  box-sizing: border-box;
`;

const List = styled(BaseTabs.List, forwardRef)`
  position: relative;
  z-index: 1;
  display: flex;
  margin-bottom: -1px;
  gap: var(--space-1);
`;

const Tab = styled<typeof BaseTabs.Tab, BaseTabs.Tab.Props>(
  BaseTabs.Tab,
  forwardRef,
)`
  display: flex;
  height: calc(2rem + 1px);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 0;
  margin: 0;
  background: none;
  color: var(--muted);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-sm);
  outline: 0;
  padding-block: 0;
  padding-inline: var(--space-2);
  user-select: none;
  white-space: nowrap;
  word-break: keep-all;

  @media (hover: hover) {
    &:hover {
      color: var(--on-surface);
    }
  }

  &[data-active] {
    color: var(--on-surface);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Indicator = styled(BaseTabs.Indicator, forwardRef)`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: var(--active-tab-width);
  height: 100%;
  box-sizing: border-box;
  border-top: var(--border-width) solid var(--border);
  background-color: var(--surface);
  border-inline: var(--border-width) solid var(--border);
  transition-duration: var(--duration-medium);
  transition-property: translate, width;
  transition-timing-function: ease-in-out;
  translate: var(--active-tab-left);
`;

const PanelViewport = styled('div', forwardRef)`
  display: grid;
  width: 100%;
  min-height: 8rem;
  box-sizing: border-box;
  border-block: var(--border-width) solid var(--border);
  border-inline: var(--border-width) solid var(--border);
  grid-template-columns: minmax(0, 1fr);
`;

const Panel = styled<typeof BaseTabs.Panel, BaseTabs.Panel.Props>(
  BaseTabs.Panel,
  forwardRef,
)`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background-color: var(--surface);
  color: var(--on-surface);
  font-size: var(--text-sm);
  grid-area: 1 / 1;
  line-height: var(--leading-sm);
  outline: 0;
  text-align: center;

  &:focus-visible {
    z-index: 1;
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  &[hidden] {
    display: none;
  }
`;

const Paragraph = styled('p', forwardRef)`
  margin: 0;
`;

export const CommonTabs = {
  ...BaseTabs,
  Root,
  List,
  Tab,
  Indicator,
  PanelViewport,
  Panel,
  Paragraph,
};
