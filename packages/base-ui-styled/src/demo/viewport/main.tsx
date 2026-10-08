import { styled } from 'goober';
import { FunctionComponent, useRef } from 'react';

import {
  List,
  TextField,
  useScrollDirection,
  useViewportScroll,
  useVisualViewport,
  Viewport,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
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

/**
 * The viewport (`Viewport`): the visual viewport and the keyboard's height,
 * the page's scroll direction (e.g. for collapsing a tab bar), and a bar
 * fixed above the keyboard.
 */
export const ViewportDemo: FunctionComponent = () => {
  const id = 'viewport';
  const [log, addLog] = useLog();

  const [externalContent] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  return (
    <Component
      center
      controls={[controlContent]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateContent])}
      title="Viewport"
    >
      <Viewport.Provider>
        <Status onScrollLog={addLog} />
        {content.bottomBar ? (
          <Viewport.Bottom>
            <Bar>
              <Field />
            </Bar>
          </Viewport.Bottom>
        ) : null}
      </Viewport.Provider>
    </Component>
  );
};
