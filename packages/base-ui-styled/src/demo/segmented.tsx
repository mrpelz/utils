import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent, useMemo } from 'react';

import { Segmented } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';

const propOptionsContent = {
  count: [3, 2, 4, 5] as const,
  label1: ['Day'] as const,
  label2: ['Week'] as const,
  label3: ['Month'] as const,
  label4: ['Year'] as const,
  label5: ['All Time'] as const,
} as const;

const propOptionsRoot = {
  ...commonPropOptions,
  defaultValue: ['first', undefined, 'second'] as const,
  value: [undefined, 'first', 'second', 'third'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
};

const getPropOptionsItem = (
  value: string,
  addLog: (message: string) => void,
) => ({
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  inputRef: [
    undefined,
    new MappedProp(
      (element: HTMLInputElement | null) =>
        addLog(`${value} input ref: ${element?.type ?? 'null'}`),
      '[log ref]',
    ),
  ] as const,
});

export const SegmentedDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlContent, { count, label1, label2, label3, label4, label5 }] =
    usePropControl(propOptionsContent, '[content]', true);

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onValueChange: [
          new MappedProp(
            (value: unknown, { reason }: BaseRadioGroup.ChangeEventDetails) =>
              addLog(`root value: ${String(value)}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
        inputRef: [
          undefined,
          new MappedProp(
            (element: HTMLInputElement | null) =>
              addLog(`root input ref: ${element?.type ?? 'null'}`),
            '[log ref]',
          ),
        ] as const,
      }),
      [addLog],
    ),
    'root',
    true,
  );

  const [controlItemFirst, propsItemFirst] = usePropControl(
    useMemo(() => getPropOptionsItem('first', addLog), [addLog]),
    '1st item',
  );

  const [controlItemSecond, propsItemSecond] = usePropControl(
    useMemo(() => getPropOptionsItem('second', addLog), [addLog]),
    '2nd item',
  );

  const [controlItemThird, propsItemThird] = usePropControl(
    useMemo(() => getPropOptionsItem('third', addLog), [addLog]),
    '3rd item',
  );

  const [controlItemFourth, propsItemFourth] = usePropControl(
    useMemo(() => getPropOptionsItem('fourth', addLog), [addLog]),
    '4th item',
  );

  const [controlItemFifth, propsItemFifth] = usePropControl(
    useMemo(() => getPropOptionsItem('fifth', addLog), [addLog]),
    '5th item',
  );

  const [controlHighlight, propsHighlight] = usePropControl(
    commonPropOptions,
    'highlight',
  );

  return (
    <Component
      center
      baseUiId="radio"
      id="segmented"
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
