import { sfCheckmark } from '@bradleyhodges/sfsymbols/sfCheckmark';
import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { styled } from 'goober';
import { forwardRef, FunctionComponent, useMemo } from 'react';

import {
  Button,
  Header,
  List,
  Toolbar,
  ToolbarButtonProps,
} from '../../components/index.js';
import { propOptionsRoot as propOptionsListRoot } from '../list/props.js';
import { getPropOptionsButton, propOptionsGroup } from '../toolbar/props.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
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
 * A page's header (UIKit `UINavigationBar`, Figma “Toobar - Top - iPhone”):
 * its top toolbar sticks to the top; a large title sits below its buttons
 * and scrolls away under it, the bar's title fading in between them
 * (Style=Large Title); without one, the bar's title (with a subtitle:
 * Style=Title 2 Line).
 */
export const HeaderDemo: FunctionComponent = () => {
  const id = 'header';

  const [log, addLog] = useLog();

  const [
    externalContent,
    externalBar,
    externalTitle,
    externalLargeTitle,
    externalSubtitle,
    externalOwnButton,
    externalGroup,
    externalGroupButton,
    externalList,
  ] = useProvidedState(id);

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

  const [controlSubtitle, propsSubtitle, stateSubtitle] = usePropControl(
    commonPropOptions,
    'subtitle',
    externalSubtitle,
  );

  // Composed: the toolbar's buttons (the back button of its own, the
  // capsule and its first button) and the list (their demos' options).
  const [controlOwnButton, propsOwnButton, stateOwnButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    'button (back)',
    externalOwnButton,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    'group',
    externalGroup,
  );
  const [controlGroupButton, propsGroupButton, stateGroupButton] =
    usePropControl(
      useMemo(() => getPropOptionsButton(addLog, false), [addLog]),
      'group button (share)',
      externalGroupButton,
    );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsListRoot,
    'list',
    externalList,
  );

  const symbolButton = (
    icon: typeof sfEllipsis,
    label: string,
    prominent?: boolean,
    props?: ToolbarButtonProps,
  ) => (
    <Toolbar.Button
      aria-label={label}
      prominent={prominent}
      onClick={() => addLog(`${label} clicked`)}
      {...props}
      shape={props?.shape ?? 'circle'}
    >
      <Button.Symbol>
        <SFSymbol icon={icon} />
      </Button.Symbol>
    </Toolbar.Button>
  );

  return (
    <Component
      stretch
      id={id}
      log={log}
      title="Header"
      controls={[
        controlContent,
        controlBar,
        controlTitle,
        controlSubtitle,
        controlLargeTitle,
        controlOwnButton,
        controlGroup,
        controlGroupButton,
        controlList,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateBar,
        stateTitle,
        stateLargeTitle,
        stateSubtitle,
        stateOwnButton,
        stateGroup,
        stateGroupButton,
        stateList,
      ])}
    >
      <Page>
        <Header.Root>
          <Header.Bar {...propsBar}>
            <Toolbar.Leading>
              {symbolButton(sfChevronBackward, 'Back', false, propsOwnButton)}
            </Toolbar.Leading>
            <Toolbar.Title {...propsTitle}>
              <span>{content.title}</span>
              {content.subtitle === undefined ? null : (
                <Toolbar.Subtitle {...propsSubtitle}>
                  {content.subtitle}
                </Toolbar.Subtitle>
              )}
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Toolbar.Group {...propsGroup}>
                {symbolButton(
                  sfSquareAndArrowUp,
                  'Share',
                  false,
                  propsGroupButton,
                )}
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
        <List.Root {...propsList}>
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
