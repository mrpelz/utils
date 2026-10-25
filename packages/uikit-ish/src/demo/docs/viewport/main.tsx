import './style.css';

import { FunctionComponent, useRef } from 'react';

import {
  List,
  TextField,
  useScrollDirection,
  useViewportScroll,
  useVisualViewport,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  propOptionsBottom,
  propOptionsLayer,
  propOptionsSide,
  propOptionsTop,
} from './props.js';

// The viewport's hooks, inside its `Provider`: the visual viewport, the
// keyboard's height, the page's scroll direction (e.g. for collapsing a tab
// bar), and its turns.
const ViewportStatus: FunctionComponent<{
  onScrollLog: (text: string) => void;
}> = ({ onScrollLog }) => {
  const visual = useVisualViewport();
  const { atBottom, atTop, direction = '–' } = useScrollDirection();
  const edge = atBottom ? 'bottom' : '–';
  const last = useRef<string | undefined>(undefined);

  useViewportScroll((event) => {
    const turned = String(event.direction);
    if (turned === last.current) return;
    last.current = turned;
    onScrollLog(`scrolling ${turned} at ${Math.round(event.position)}px`);
  });

  return (
    <dl className="viewport-demo-metrics">
      <dt>Visual viewport</dt>
      <dd>
        {Math.round(visual.width)} × {Math.round(visual.height)} at{' '}
        {Math.round(visual.left)}, {Math.round(visual.top)}
      </dd>
      <dt>Keyboard</dt>
      <dd>{visual.keyboardInset}px</dd>
      <dt>Scrolling</dt>
      <dd>{direction}</dd>
      <dt>At</dt>
      <dd>{atTop ? 'top' : edge}</dd>
    </dl>
  );
};

/**
 * The viewport (`Viewport.Provider`): the visual viewport and the
 * keyboard's height, and the page's scroll direction.
 */
export const ViewportDemo: FunctionComponent = () => {
  const id = 'viewport';

  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      id={id}
      log={log}
      title="Viewport"
    >
      <Viewport.Provider>
        <ViewportStatus onScrollLog={addLog} />
      </Viewport.Provider>
    </Component>
  );
};

/**
 * A bar at the bottom of the visual viewport (`Viewport.BlockEnd`): above
 * the keyboard while it's shown, e.g. a message field.
 */
export const ViewportBarDemo: FunctionComponent = () => {
  const id = 'viewport-bar';

  const [log, addLog] = useLog();

  return (
    <Component
      hasInputGuards
      isCentered
      id={id}
      log={log}
      title="Viewport (Bar)"
    >
      <Viewport.Provider>
        <ViewportStatus onScrollLog={addLog} />
        <Viewport.BlockEnd className="viewport-demo-surface">
          <div className="viewport-demo-bar">
            <List.Root>
              <List.Group style={{ marginInline: 0 }}>
                <TextField.Root render={<List.Item />}>
                  <TextField.Control
                    aria-label="Message"
                    enterKeyHint="send"
                    placeholder="Message"
                  />
                  <TextField.Clear />
                </TextField.Root>
              </List.Group>
            </List.Root>
          </div>
        </Viewport.BlockEnd>
      </Viewport.Provider>
    </Component>
  );
};

/**
 * Anchors at each edge of the visual viewport (`Viewport.Anchor`: bars at
 * the top and bottom, sidebars at the sides), their safe areas kept clear,
 * the keyboard pushing (or covering) them; and a content layer
 * (`Viewport.Content`) below them.
 */
export const ViewportAnchorsDemo: FunctionComponent = () => {
  const id = 'viewport-anchors';

  const [log] = useLog();
  const [
    externalTop,
    externalBottom,
    externalLeading,
    externalTrailing,
    externalLayer,
  ] = useProvidedState(id);

  const [controlTop, { shown: isTopShown, ...propsTop }, stateTop] =
    usePropControl(propOptionsTop, {
      external: externalTop,
      isOpen: true,
      title: 'anchor (top)',
    });
  const [controlBottom, { shown: isBottomShown, ...propsBottom }, stateBottom] =
    usePropControl(propOptionsBottom, {
      external: externalBottom,
      isOpen: true,
      title: 'anchor (bottom)',
    });
  const [
    controlLeading,
    { shown: isLeadingShown, ...propsLeading },
    stateLeading,
  ] = usePropControl(propOptionsSide, {
    external: externalLeading,
    isOpen: true,
    title: 'anchor (leading)',
  });
  const [
    controlTrailing,
    { shown: isTrailingShown, ...propsTrailing },
    stateTrailing,
  ] = usePropControl(propOptionsSide, {
    external: externalTrailing,
    isOpen: true,
    title: 'anchor (trailing)',
  });
  const [controlLayer, { shown: isLayerShown, ...propsLayer }, stateLayer] =
    usePropControl(propOptionsLayer, {
      external: externalLayer,
      isOpen: true,
      title: 'content layer',
    });

  return (
    <Component
      isCentered
      id={id}
      log={log}
      state={[stateTop, stateBottom, stateLeading, stateTrailing, stateLayer]}
      title="Viewport (Anchors)"
      controls={[
        controlTop,
        controlBottom,
        controlLeading,
        controlTrailing,
        controlLayer,
      ]}
    >
      <Viewport.Provider>
        {isLayerShown ? (
          <Viewport.Content {...propsLayer}>
            <div className="viewport-demo-layer">Content layer</div>
          </Viewport.Content>
        ) : null}
        {isTopShown ? (
          <Viewport.Anchor
            edge="block-start"
            {...propsTop}
          >
            <div className="viewport-demo-sample">Top</div>
          </Viewport.Anchor>
        ) : null}
        {isBottomShown ? (
          <Viewport.Anchor
            edge="block-end"
            {...propsBottom}
          >
            <div className="viewport-demo-sample">Bottom</div>
          </Viewport.Anchor>
        ) : null}
        {isLeadingShown ? (
          <Viewport.Anchor
            edge="inline-start"
            {...propsLeading}
          >
            <div
              className="viewport-demo-sample"
              data-side=""
            >
              Leading
            </div>
          </Viewport.Anchor>
        ) : null}
        {isTrailingShown ? (
          <Viewport.Anchor
            edge="inline-end"
            {...propsTrailing}
          >
            <div
              className="viewport-demo-sample"
              data-side=""
            >
              Trailing
            </div>
          </Viewport.Anchor>
        ) : null}
      </Viewport.Provider>
    </Component>
  );
};
