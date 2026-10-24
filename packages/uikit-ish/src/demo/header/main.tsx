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
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { commonPropOptions, usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  propOptionsBar,
  propOptionsLargeTitle,
  propOptionsTitle,
} from './props.js';

/**
 * A page's header (UIKit `UINavigationBar`, Figma “Toobar - Top - iPhone”,
 * Style=Large Title): its top toolbar sticks to the top of the page; the
 * large title sits below its buttons and scrolls away under it, the bar's
 * title fading in between them.
 */
export const HeaderDemo: FunctionComponent = () => {
  const id = 'header';

  const [log, addLog] = useLog();
  const [externalBar, externalTitle, externalLargeTitle] = useProvidedState(id);

  const [controlBar, propsBar, stateBar] = usePropControl(propOptionsBar, {
    external: externalBar,
    open: true,
    title: 'bar',
  });
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    propOptionsTitle,
    { external: externalTitle, title: 'title' },
  );
  const [controlLargeTitle, propsLargeTitle, stateLargeTitle] = usePropControl(
    propOptionsLargeTitle,
    { external: externalLargeTitle, title: 'large title' },
  );

  return (
    <Component
      stretch
      controls={[controlBar, controlTitle, controlLargeTitle]}
      id={id}
      log={log}
      state={[stateBar, stateTitle, stateLargeTitle]}
      title="Header"
    >
      <div className="demo-phone demo-fill">
        <Page.Root>
          <Header.Root>
            <Header.Bar {...propsBar}>
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
            </Header.Bar>
            <Header.LargeTitle {...propsLargeTitle}>
              <span>Inbox</span>
            </Header.LargeTitle>
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
        </Page.Root>
      </div>
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
    open: true,
    title: 'bar',
  });
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    propOptionsTitle,
    { external: externalTitle, open: true, title: 'title' },
  );
  const [controlSubtitle, propsSubtitle, stateSubtitle] = usePropControl(
    commonPropOptions,
    { external: externalSubtitle, title: 'subtitle' },
  );

  return (
    <Component
      stretch
      controls={[controlBar, controlTitle, controlSubtitle]}
      id={id}
      log={log}
      state={[stateBar, stateTitle, stateSubtitle]}
      title="Header (Title)"
    >
      <div className="demo-phone demo-fill">
        <Page.Root>
          <Header.Root>
            <Header.Bar {...propsBar}>
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
            </Header.Bar>
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
        </Page.Root>
      </div>
    </Component>
  );
};
