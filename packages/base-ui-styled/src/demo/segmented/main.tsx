import { FunctionComponent, useMemo } from 'react';

import { Segmented } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  getPropOptionsItem,
  getPropOptionsRoot,
  propOptionsContent,
} from './props.js';

export const SegmentedDemo: FunctionComponent = () => {
  const id = 'segmented';

  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalItemFirst,
    externalItemSecond,
    externalItemThird,
    externalItemFourth,
    externalItemFifth,
    externalHighlight,
  ] = useProvidedState(id);

  const [
    controlContent,
    { count, label1, label2, label3, label4, label5 },
    stateContent,
  ] = usePropControl(propOptionsContent, '[content]', externalContent, true);

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );

  const [controlItemFirst, propsItemFirst, stateItemFirst] = usePropControl(
    useMemo(() => getPropOptionsItem('first', addLog), [addLog]),
    '1st item',
    externalItemFirst,
  );

  const [controlItemSecond, propsItemSecond, stateItemSecond] = usePropControl(
    useMemo(() => getPropOptionsItem('second', addLog), [addLog]),
    '2nd item',
    externalItemSecond,
  );

  const [controlItemThird, propsItemThird, stateItemThird] = usePropControl(
    useMemo(() => getPropOptionsItem('third', addLog), [addLog]),
    '3rd item',
    externalItemThird,
  );

  const [controlItemFourth, propsItemFourth, stateItemFourth] = usePropControl(
    useMemo(() => getPropOptionsItem('fourth', addLog), [addLog]),
    '4th item',
    externalItemFourth,
  );

  const [controlItemFifth, propsItemFifth, stateItemFifth] = usePropControl(
    useMemo(() => getPropOptionsItem('fifth', addLog), [addLog]),
    '5th item',
    externalItemFifth,
  );

  const [controlHighlight, propsHighlight, stateHighlight] = usePropControl(
    commonPropOptions,
    'highlight',
    externalHighlight,
  );

  return (
    <Component
      center
      baseUiId="radio"
      id={id}
      log={log}
      title="Segmented"
      controls={[
        controlContent,
        controlRoot,
        controlItemFirst,
        controlItemSecond,
        controlItemThird,
        controlItemFourth,
        controlItemFifth,
        controlHighlight,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateItemFirst,
        stateItemSecond,
        stateItemThird,
        stateItemFourth,
        stateItemFifth,
        stateHighlight,
      ])}
    >
      <RemounterRoot>
        <Segmented.Root {...propsRoot}>
          <Segmented.Item
            value="first"
            {...propsItemFirst}
          >
            {label1}
          </Segmented.Item>
          <Segmented.Item
            value="second"
            {...propsItemSecond}
          >
            {label2}
          </Segmented.Item>
          {count >= 3 ? (
            <Segmented.Item
              value="third"
              {...propsItemThird}
            >
              {label3}
            </Segmented.Item>
          ) : null}
          {count >= 4 ? (
            <Segmented.Item
              value="fourth"
              {...propsItemFourth}
            >
              {label4}
            </Segmented.Item>
          ) : null}
          {count >= 5 ? (
            <Segmented.Item
              value="fifth"
              {...propsItemFifth}
            >
              {label5}
            </Segmented.Item>
          ) : null}
          <Segmented.Highlight {...propsHighlight} />
        </Segmented.Root>
      </RemounterRoot>
    </Component>
  );
};
