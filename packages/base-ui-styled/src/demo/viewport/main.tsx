import { styled } from 'goober';
import { FunctionComponent, useMemo, useRef } from 'react';

import {
  List,
  TextField,
  useScrollDirection,
  useViewportScroll,
  useVisualViewport,
  Viewport,
} from '../../components/index.js';
import { useTextFieldDemo } from '../text-field/compose.js';
import {
  getPropOptionsControl,
  propOptionsRoot as propOptionsTextFieldRoot,
} from '../text-field/props.js';
import { AddLog, useLog } from '../utils/log.js';
import { Component, MappedProp, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  propOptionsBottom,
  propOptionsContent,
  propOptionsLayer,
  propOptionsSide,
  propOptionsTop,
} from './props.js';

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

// An anchor's sample content (a bar, or a sidebar), labelled.
const Sample = styled('div')`
  display: grid;
  min-width: 44px;
  min-height: 44px;
  box-sizing: border-box;
  padding: 12px 16px;
  background-color: var(--color-ios-secondary-system-grouped-background);
  box-shadow: 0 0 0 0.5px var(--color-ios-separator);
  color: var(--color-ios-label);
  font-size: 15px;
  place-items: center;
`;

const SideSample = styled(Sample)`
  width: 200px;
  height: 100%;
`;

// The content layer's sample: long enough to scroll.
const LayerSample = styled('div')`
  min-height: 200vh;
  padding: 16px;
  background: linear-gradient(
    var(--color-ios-system-grouped-background),
    var(--color-ios-system-gray5)
  );
  color: var(--color-ios-label);
`;

// The message field: a text field (all of its demo's options, see
// `ViewportDemo`).
const Field: FunctionComponent<{
  field: ReturnType<typeof useTextFieldDemo>;
}> = ({ field }) => (
  <List.Root>
    <List.Group style={{ marginInline: 0 }}>
      <field.Remounter>
        <TextField.Root
          {...field.props.root}
          render={<List.Item />}
        >
          <TextField.Control
            aria-label="Message"
            {...field.props.control}
          />
          <TextField.Clear {...field.props.clear} />
        </TextField.Root>
      </field.Remounter>
      {field.suggestions}
    </List.Group>
  </List.Root>
);

// The message field's control: the text field demo's props, a message's
// values.
const getMessageControl = (addLog: AddLog) => ({
  ...getPropOptionsControl(addLog),
  placeholder: ['Message', 'iMessage', undefined] as const,
  type: ['text', 'search', undefined] as const,
  enterKeyHint: ['send', 'enter', undefined] as const,
  render: [undefined, new MappedProp(<textarea />, '[<textarea />]')] as const,
});

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
 * the page's scroll direction (e.g. for collapsing a tab bar), anchors at
 * each edge (a bar fixed above the keyboard), and a content layer.
 */
export const ViewportDemo: FunctionComponent = () => {
  const id = 'viewport';
  const [log, addLog] = useLog();

  const [
    externalContent,
    externalTop,
    externalBottom,
    externalLeading,
    externalTrailing,
    externalLayer,
    ...externalMessage
  ] = useProvidedState(id);

  const message = useTextFieldDemo(addLog, externalMessage, {
    control: useMemo(() => getMessageControl(addLog), [addLog]),
    prefix: 'message field: ',
    root: propOptionsTextFieldRoot,
  });

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlTop, { shown: top, ...propsTop }, stateTop] = usePropControl(
    propOptionsTop,
    'anchor (top)',
    externalTop,
  );
  const [controlBottom, { shown: bottom, ...propsBottom }, stateBottom] =
    usePropControl(propOptionsBottom, 'anchor (bottom)', externalBottom);
  const [controlLeading, { shown: leading, ...propsLeading }, stateLeading] =
    usePropControl(propOptionsSide, 'anchor (leading)', externalLeading);
  const [
    controlTrailing,
    { shown: trailing, ...propsTrailing },
    stateTrailing,
  ] = usePropControl(propOptionsSide, 'anchor (trailing)', externalTrailing);
  const [controlLayer, { shown: layer, ...propsLayer }, stateLayer] =
    usePropControl(propOptionsLayer, 'content layer', externalLayer);

  return (
    <Component
      center
      id={id}
      log={log}
      title="Viewport"
      controls={[
        controlContent,
        controlTop,
        controlBottom,
        controlLeading,
        controlTrailing,
        controlLayer,
        ...message.controls,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateTop,
        stateBottom,
        stateLeading,
        stateTrailing,
        stateLayer,
        ...message.states,
      ])}
    >
      <Viewport.Provider>
        <Status onScrollLog={addLog} />
        {layer ? (
          <Viewport.Content {...propsLayer}>
            <LayerSample>
              <Field field={message} />
            </LayerSample>
          </Viewport.Content>
        ) : null}
        {top ? (
          <Viewport.Anchor
            edge="block-start"
            {...propsTop}
          >
            <Sample>Top</Sample>
          </Viewport.Anchor>
        ) : null}
        {bottom ? (
          <Viewport.Anchor
            edge="block-end"
            {...propsBottom}
          >
            <Sample>Bottom</Sample>
          </Viewport.Anchor>
        ) : null}
        {leading ? (
          <Viewport.Anchor
            edge="inline-start"
            {...propsLeading}
          >
            <SideSample>Leading</SideSample>
          </Viewport.Anchor>
        ) : null}
        {trailing ? (
          <Viewport.Anchor
            edge="inline-end"
            {...propsTrailing}
          >
            <SideSample>Trailing</SideSample>
          </Viewport.Anchor>
        ) : null}
        {content.bottomBar ? (
          <Viewport.BlockEnd>
            <Bar>
              <Field field={message} />
            </Bar>
          </Viewport.BlockEnd>
        ) : null}
      </Viewport.Provider>
    </Component>
  );
};
