import { FunctionComponent, useMemo } from 'react';

import { Segmented } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { commonPropOptions, usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
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

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'Segmented.Root',
    externalRoot,
    true,
  );
  const [controlItemFirst, propsItemFirst, stateItemFirst] = usePropControl(
    useMemo(() => getPropOptionsItem('first', addLog), [addLog]),
    'Segmented.Item (1st)',
    externalItemFirst,
  );
  const [controlItemSecond, propsItemSecond, stateItemSecond] = usePropControl(
    useMemo(() => getPropOptionsItem('second', addLog), [addLog]),
    'Segmented.Item (2nd)',
    externalItemSecond,
  );
  const [controlItemThird, propsItemThird, stateItemThird] = usePropControl(
    useMemo(() => getPropOptionsItem('third', addLog), [addLog]),
    'Segmented.Item (3rd)',
    externalItemThird,
  );
  const [controlItemFourth, propsItemFourth, stateItemFourth] = usePropControl(
    useMemo(() => getPropOptionsItem('fourth', addLog), [addLog]),
    'Segmented.Item (4th)',
    externalItemFourth,
  );
  const [controlItemFifth, propsItemFifth, stateItemFifth] = usePropControl(
    useMemo(() => getPropOptionsItem('fifth', addLog), [addLog]),
    'Segmented.Item (5th)',
    externalItemFifth,
  );
  const [controlHighlight, propsHighlight, stateHighlight] = usePropControl(
    commonPropOptions,
    'Segmented.Highlight',
    externalHighlight,
  );

  const count = Number(content.count);

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
      state={[
        stateContent,
        stateRoot,
        stateItemFirst,
        stateItemSecond,
        stateItemThird,
        stateItemFourth,
        stateItemFifth,
        stateHighlight,
      ]}
    >
      <Segmented.Root
        key={elementKey}
        {...propsRoot}
      >
        <Segmented.Item
          value="first"
          {...propsItemFirst}
        >
          Day
        </Segmented.Item>
        <Segmented.Item
          value="second"
          {...propsItemSecond}
        >
          Week
        </Segmented.Item>
        {count >= 3 ? (
          <Segmented.Item
            value="third"
            {...propsItemThird}
          >
            Month
          </Segmented.Item>
        ) : null}
        {count >= 4 ? (
          <Segmented.Item
            value="fourth"
            {...propsItemFourth}
          >
            Year
          </Segmented.Item>
        ) : null}
        {count >= 5 ? (
          <Segmented.Item
            value="fifth"
            {...propsItemFifth}
          >
            All Time
          </Segmented.Item>
        ) : null}
        <Segmented.Highlight {...propsHighlight} />
      </Segmented.Root>
    </Component>
  );
};
