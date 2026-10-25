import './style.css';

import { sfCheckmark } from '@bradleyhodges/sfsymbols/sfCheckmark';
import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { FunctionComponent } from 'react';

import {
  Button,
  Header,
  List,
  Page,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  propOptionsBar,
  propOptionsLargeTitle,
  propOptionsTitle,
} from './props.js';

/**
 * A page's header (UIKit `UINavigationBar`, Figma “Toobar - Top - iPhone”,
 * Style=Large Title): its top toolbar anchored above the page; the large
 * title sits below its buttons and scrolls away under it, the bar's title
 * fading in between them.
 */
export const HeaderDemo: FunctionComponent = () => {
  const id = 'header';

  const [log, addLog] = useLog();
  const [externalBar, externalTitle, externalLargeTitle] = useProvidedState(id);

  const [controlBar, propsBar, stateBar] = usePropControl(propOptionsBar, {
    external: externalBar,
    isOpen: true,
    title: 'Toolbar.Root (bar)',
  });
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    propOptionsTitle,
    { external: externalTitle, title: 'Toolbar.Title' },
  );
  const [controlLargeTitle, propsLargeTitle, stateLargeTitle] = usePropControl(
    propOptionsLargeTitle,
    { external: externalLargeTitle, title: 'Header.LargeTitle' },
  );

  return (
    <Component
      controls={[controlBar, controlTitle, controlLargeTitle]}
      id={id}
      log={log}
      stage="phone"
      state={[stateBar, stateTitle, stateLargeTitle]}
      title="Header"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Back"
                  shape="circle"
                  onClick={() => addLog('Back clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...propsTitle}>
                <span>Inbox</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Group>
                  <Toolbar.Button
                    aria-label="Share"
                    shape="circle"
                    onClick={() => addLog('Share clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfSquareAndArrowUp} />
                    </Button.Icon>
                  </Toolbar.Button>
                  <Toolbar.Button
                    aria-label="More"
                    shape="circle"
                    onClick={() => addLog('More clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfEllipsis} />
                    </Button.Icon>
                  </Toolbar.Button>
                </Toolbar.Group>
                <Toolbar.Button
                  prominent
                  aria-label="Done"
                  shape="circle"
                  onClick={() => addLog('Done clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfCheckmark} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Inbox</span>
            </Header.LargeTitle>

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
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/**
 * A page's header without a large title: the bar's title shows, with a
 * subtitle (Figma Style=Title 2 Line); centered, or at its start.
 */
export const HeaderTitleDemo: FunctionComponent = () => {
  const id = 'header-title';

  const [log, addLog] = useLog();
  const [externalBar, externalTitle, externalSubtitle] = useProvidedState(id);

  const [controlBar, propsBar, stateBar] = usePropControl(propOptionsBar, {
    external: externalBar,
    isOpen: true,
    title: 'Toolbar.Root (bar)',
  });
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    propOptionsTitle,
    { external: externalTitle, isOpen: true, title: 'Toolbar.Title' },
  );
  const [controlSubtitle, propsSubtitle, stateSubtitle] = usePropControl(
    commonPropOptions,
    { external: externalSubtitle, title: 'Toolbar.Subtitle' },
  );

  return (
    <Component
      controls={[controlBar, controlTitle, controlSubtitle]}
      id={id}
      log={log}
      stage="phone"
      state={[stateBar, stateTitle, stateSubtitle]}
      title="Header (Title)"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root
              placement="block-start"
              {...propsBar}
            >
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Back"
                  shape="circle"
                  onClick={() => addLog('Back clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...propsTitle}>
                <span>Inbox</span>
                <Toolbar.Subtitle {...propsSubtitle}>Subtitle</Toolbar.Subtitle>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Group>
                  <Toolbar.Button
                    aria-label="Share"
                    shape="circle"
                    onClick={() => addLog('Share clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfSquareAndArrowUp} />
                    </Button.Icon>
                  </Toolbar.Button>
                  <Toolbar.Button
                    aria-label="More"
                    shape="circle"
                    onClick={() => addLog('More clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfEllipsis} />
                    </Button.Icon>
                  </Toolbar.Button>
                </Toolbar.Group>
                <Toolbar.Button
                  prominent
                  aria-label="Done"
                  shape="circle"
                  onClick={() => addLog('Done clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfCheckmark} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
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
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};
