import { sfCheckmark } from '@bradleyhodges/sfsymbols/sfCheckmark';
import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { styled } from 'goober';
import { forwardRef, FunctionComponent } from 'react';

import { Button, Header, List, Toolbar } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  propOptionsBar,
  propOptionsContent,
  propOptionsLargeTitle,
  propOptionsTitle,
} from './props.js';

// The page: a scroll container (of the stage's height, as a phone's
// screen), its header at its start.
const Page = styled('div', forwardRef)`
  overflow: auto;
  height: min(640px, 70vh);
  background-color: var(--color-ios-system-grouped-background);
  overscroll-behavior: contain;
`;

/**
 * A top toolbar in a page's header (UIKit `UINavigationBar`, Figma “Toobar
 * - Top - iPhone”): the bar sticks to the top; a large title sits below its
 * buttons and scrolls away under it, the bar's title fading in between
 * them (Style=Large Title); without one, the bar's title (with a subtitle:
 * Style=Title 2 Line).
 */
export const ToolbarTopDemo: FunctionComponent = () => {
  const id = 'toolbar-top';

  const [log, addLog] = useLog();

  const [externalContent, externalBar, externalTitle, externalLargeTitle] =
    useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const [controlBar, propsBar, stateBar] = usePropControl(
    propOptionsBar,
    'bar',
    externalBar,
    true,
  );

  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    propOptionsTitle,
    'title',
    externalTitle,
  );

  const [controlLargeTitle, propsLargeTitle, stateLargeTitle] = usePropControl(
    propOptionsLargeTitle,
    'large title',
    externalLargeTitle,
  );

  const symbolButton = (
    icon: typeof sfEllipsis,
    label: string,
    prominent?: boolean,
  ) => (
    <Toolbar.Button
      aria-label={label}
      prominent={prominent}
      shape="circle"
      onClick={() => addLog(`${label} clicked`)}
    >
      <Button.Symbol>
        <SFSymbol icon={icon} />
      </Button.Symbol>
    </Toolbar.Button>
  );

  return (
    <Component
      stretch
      controls={[controlContent, controlBar, controlTitle, controlLargeTitle]}
      id={id}
      log={log}
      title="Toolbar (Top)"
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateBar,
        stateTitle,
        stateLargeTitle,
      ])}
    >
      <Page>
        <Header.Root>
          <Header.Bar {...propsBar}>
            <Toolbar.Leading>
              {symbolButton(sfChevronBackward, 'Back')}
            </Toolbar.Leading>
            <Toolbar.Title {...propsTitle}>
              <span>{content.title}</span>
              {content.subtitle === undefined ? null : (
                <Toolbar.Subtitle>{content.subtitle}</Toolbar.Subtitle>
              )}
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Toolbar.Group>
                {symbolButton(sfSquareAndArrowUp, 'Share')}
                {symbolButton(sfEllipsis, 'More')}
              </Toolbar.Group>
              {symbolButton(sfCheckmark, 'Done', true)}
            </Toolbar.Trailing>
          </Header.Bar>
          {content.largeTitle ? (
            <Header.LargeTitle {...propsLargeTitle}>
              <span>{content.title}</span>
              {content.subtitle === undefined ? null : (
                <Toolbar.Subtitle>{content.subtitle}</Toolbar.Subtitle>
              )}
            </Header.LargeTitle>
          ) : null}
        </Header.Root>
        <List.Root>
          <List.Section>
            <List.Group>
              {Array.from({ length: 30 }, (_, index) => (
                <List.Item key={index}>
                  <List.Title>Message {index + 1}</List.Title>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
      </Page>
    </Component>
  );
};
