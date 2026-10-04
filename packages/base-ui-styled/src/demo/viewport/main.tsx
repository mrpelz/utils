import { styled } from 'goober';
import { forwardRef, FunctionComponent, useRef, useState } from 'react';

import {
  Button,
  List,
  TextField,
  useScrollDirection,
  useViewportScroll,
  useVisualViewport,
  Viewport,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import { propOptionsContent } from './props.js';

const Metrics = styled('dl')`
  display: grid;
  margin: 0;
  color: var(--color-ios-label);
  column-gap: 16px;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  grid-template-columns: auto auto;

  & > dd {
    margin: 0;
  }
`;

const Bar = styled('div')`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--color-ios-secondary-system-grouped-background);
  box-shadow: 0 -0.5px var(--color-ios-separator);
  gap: 8px;

  & > :first-child {
    flex: 1;
  }
`;

// The locked app: the visual viewport's height (see `useViewportLock`),
// its messages scrolling (pan-y), the composer at its end.
const App = styled('div', forwardRef)`
  position: fixed;
  z-index: 100;
  top: 0;
  display: flex;
  height: 100dvh;
  flex-direction: column;
  background-color: var(--color-ios-system-grouped-background);
  inset-inline: 0;
  touch-action: none;
`;

const AppHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top) + 8px) 16px 8px;
  color: var(--color-ios-label);
  font-size: 17px;
  font-weight: 600;
`;

const Messages = styled('div', forwardRef)`
  overflow: auto;
  flex: 1;
  overscroll-behavior: contain;
  touch-action: pan-y;
`;

const Composer = styled('div')`
  padding-bottom: env(safe-area-inset-bottom);
`;

const Field = () => (
  <List.Root>
    <List.Group style={{ marginInline: 0 }}>
      <TextField.Root render={<List.Item />}>
        <TextField.Control
          aria-label="Message"
          placeholder="Message"
        />
      </TextField.Root>
    </List.Group>
  </List.Root>
);

const Status: FunctionComponent<{ onScrollLog: (text: string) => void }> = ({
  onScrollLog,
}) => {
  const visual = useVisualViewport();
  const { atBottom, atTop, direction } = useScrollDirection();
  const edge = atBottom ? 'bottom' : '–';
  const last = useRef<string | undefined>(undefined);

  useViewportScroll((event) => {
    const turned = String(event.direction);
    if (turned === last.current) return;
    last.current = turned;
    onScrollLog(`scrolling ${turned} at ${Math.round(event.position)}px`);
  });

  return (
    <Metrics>
      <dt>Visual viewport</dt>
      <dd>
        {Math.round(visual.width)} × {Math.round(visual.height)} at{' '}
        {Math.round(visual.left)}, {Math.round(visual.top)}
      </dd>
      <dt>Keyboard</dt>
      <dd>{visual.keyboardInset}px</dd>
      <dt>Scrolling</dt>
      <dd>{direction ?? '–'}</dd>
      <dt>At</dt>
      <dd>{atTop ? 'top' : edge}</dd>
    </Metrics>
  );
};

const LockedApp: FunctionComponent<{ onClose: () => void }> = ({ onClose }) => {
  const appRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  return (
    <App ref={appRef}>
      <Viewport.Provider
        lock={appRef}
        scroller={messagesRef}
      >
        <AppHeader>
          <span>Locked</span>
          <Button.Root
            variant="borderless"
            onClick={onClose}
          >
            <Button.Label>Done</Button.Label>
          </Button.Root>
        </AppHeader>
        <Messages ref={messagesRef}>
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
        </Messages>
        <Composer>
          <Field />
        </Composer>
      </Viewport.Provider>
    </App>
  );
};

/**
 * The viewport (`Viewport`): the visual viewport and the keyboard's height,
 * the page's scroll direction (e.g. for collapsing a tab bar), a bar fixed
 * above the keyboard, and a locked app (iOS: focusing its field doesn't
 * scroll it off screen).
 */
export const ViewportDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [locked, setLocked] = useState(false);

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  return (
    <Component
      center
      controls={[controlContent]}
      id="viewport"
      log={log}
      title="Viewport"
    >
      <Viewport.Provider>
        <Status onScrollLog={addLog} />
        <Button.Root
          variant="bordered"
          onClick={() => setLocked(true)}
        >
          <Button.Label>Open a locked app</Button.Label>
        </Button.Root>
        {content.bottomBar ? (
          <Viewport.Bottom>
            <Bar>
              <Field />
            </Bar>
          </Viewport.Bottom>
        ) : null}
        {locked ? <LockedApp onClose={() => setLocked(false)} /> : null}
      </Viewport.Provider>
    </Component>
  );
};
