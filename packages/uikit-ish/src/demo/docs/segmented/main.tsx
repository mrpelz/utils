import { FunctionComponent, useMemo } from 'react';

import { Segmented } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'Segmented.Root' },
  );
  const [controlItemFirst, propsItemFirst, stateItemFirst] = usePropControl(
    useMemo(() => getPropOptionsItem('first', addLog), [addLog]),
    { external: externalItemFirst, title: 'Segmented.Item (1st)' },
  );
  const [controlItemSecond, propsItemSecond, stateItemSecond] = usePropControl(
    useMemo(() => getPropOptionsItem('second', addLog), [addLog]),
    { external: externalItemSecond, title: 'Segmented.Item (2nd)' },
  );
  const [controlItemThird, propsItemThird, stateItemThird] = usePropControl(
    useMemo(() => getPropOptionsItem('third', addLog), [addLog]),
    { external: externalItemThird, title: 'Segmented.Item (3rd)' },
  );
  const [controlItemFourth, propsItemFourth, stateItemFourth] = usePropControl(
    useMemo(() => getPropOptionsItem('fourth', addLog), [addLog]),
    { external: externalItemFourth, title: 'Segmented.Item (4th)' },
  );
  const [controlItemFifth, propsItemFifth, stateItemFifth] = usePropControl(
    useMemo(() => getPropOptionsItem('fifth', addLog), [addLog]),
    { external: externalItemFifth, title: 'Segmented.Item (5th)' },
  );
  const [controlHighlight, propsHighlight, stateHighlight] = usePropControl(
    commonPropOptions,
    { external: externalHighlight, title: 'Segmented.Highlight' },
  );

  const count = Number(content.count);

  return (
    <Component
      isCentered
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
        <Segmented.Item {...propsItemFirst}>Day</Segmented.Item>
        <Segmented.Item {...propsItemSecond}>Week</Segmented.Item>
        {count >= 3 ? (
          <Segmented.Item {...propsItemThird}>Month</Segmented.Item>
        ) : null}
        {count >= 4 ? (
          <Segmented.Item {...propsItemFourth}>Year</Segmented.Item>
        ) : null}
        {count >= 5 ? (
          <Segmented.Item {...propsItemFifth}>All Time</Segmented.Item>
        ) : null}
        <Segmented.Highlight {...propsHighlight} />
      </Segmented.Root>
    </Component>
  );
};
