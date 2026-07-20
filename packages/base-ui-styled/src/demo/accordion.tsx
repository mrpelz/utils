/* eslint-disable unicorn/prefer-string-raw */
import { Accordion as BaseAccordion, AccordionValue } from '@base-ui/react';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Accordion } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';

const propOptionsRoot = {
  ...commonPropOptions,
  defaultValue: [
    undefined,
    new MappedProp<AccordionValue>(['first'], String.raw`['first']`),
    new MappedProp<AccordionValue>(
      ['second', 'third'],
      String.raw`['second', 'third']`,
    ),
  ] as const,
  value: [
    undefined,
    new MappedProp<AccordionValue>(['first'], String.raw`['first']`),
    new MappedProp<AccordionValue>(
      ['second', 'third'],
      String.raw`['second', 'third']`,
    ),
  ] as const,
  hiddenUntilFound: [undefined, false, true] as const,
  multiple: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  keepMounted: [undefined, false, true] as const,
  'styled-max-width': [undefined, 'none', '20rem'] as const,
};

const propOptionsItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
};

const propOptionsHeader = {
  ...commonPropOptions,
  'styled-cursor-closed': [undefined, 'auto', 'pointer', 'copy'] as const,
  'styled-cursor-open': [undefined, 'auto', 'pointer', 'copy'] as const,
};

const propOptionsTrigger = {
  ...commonPropOptions,
  nativeButton: [undefined, false, true] as const,
};

const propOptionsPanel = {
  ...commonPropOptions,
  hiddenUntilFound: [undefined, false, true] as const,
  keepMounted: [undefined, false, true] as const,
};

export const AccordionDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        onValueChange: [
          new MappedProp(
            (
              value: AccordionValue,
              { reason }: BaseAccordion.Root.ChangeEventDetails,
            ) => addLog(`root value: ${value}/${reason}`),
            'log change',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'root',
  );

  const [controlItemFirst, propsItemFirst] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsItem,
        onOpenChange: [
          new MappedProp(
            (
              open: boolean,
              { reason }: BaseAccordion.Item.ChangeEventDetails,
            ) => addLog(`item first: ${open}/${reason}`),
            'log open',
          ),
          undefined,
        ] as const,
        value: ['first', undefined] as const,
      }),
      [addLog],
    ),
    '1st item',
  );

  const [controlHeaderFirst, propsHeaderFirst] = usePropControl(
    propOptionsHeader,
    '1st header',
  );

  const [controlTriggerFirst, propsTriggerFirst] = usePropControl(
    propOptionsTrigger,
    '1st trigger',
  );

  const [controlPanelFirst, propsPanelFirst] = usePropControl(
    propOptionsPanel,
    '1st panel',
  );

  const [controlItemSecond, propsItemSecond] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsItem,
        onOpenChange: [
          new MappedProp(
            (
              open: boolean,
              { reason }: BaseAccordion.Item.ChangeEventDetails,
            ) => addLog(`item second: ${open}/${reason}`),
            'log open',
          ),
          undefined,
        ] as const,
        value: ['second', undefined] as const,
      }),
      [addLog],
    ),
    '2nd item',
  );

  const [controlHeaderSecond, propsHeaderSecond] = usePropControl(
    propOptionsHeader,
    '2nd header',
  );

  const [controlTriggerSecond, propsTriggerSecond] = usePropControl(
    propOptionsTrigger,
    '2nd trigger',
  );

  const [controlPanelSecond, propsPanelSecond] = usePropControl(
    propOptionsPanel,
    '2nd panel',
  );

  const [controlItemThird, propsItemThird] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsItem,
        onOpenChange: [
          new MappedProp(
            (
              open: boolean,
              { reason }: BaseAccordion.Item.ChangeEventDetails,
            ) => addLog(`item third: ${open}/${reason}`),
            'log open',
          ),
          undefined,
        ] as const,
        value: ['third', undefined] as const,
      }),
      [addLog],
    ),
    '3rd item',
  );

  const [controlHeaderThird, propsHeaderThird] = usePropControl(
    propOptionsHeader,
    '3rd header',
  );

  const [controlTriggerThird, propsTriggerThird] = usePropControl(
    propOptionsTrigger,
    '3rd trigger',
  );

  const [controlPanelThird, propsPanelThird] = usePropControl(
    propOptionsPanel,
    '3rd panel',
  );

  return (
    <Component
      id="accordion"
      log={log}
      title="Accordion"
      controls={[
        controlRoot,
        controlItemFirst,
        controlHeaderFirst,
        controlTriggerFirst,
        controlPanelFirst,
        controlItemSecond,
        controlHeaderSecond,
        controlTriggerSecond,
        controlPanelSecond,
        controlItemThird,
        controlHeaderThird,
        controlTriggerThird,
        controlPanelThird,
      ]}
    >
      <RemounterRoot>
        <Accordion.Root {...propsRoot}>
          <Accordion.Item {...propsItemFirst}>
            <Accordion.Header {...propsHeaderFirst}>
              <Accordion.Trigger {...propsTriggerFirst}>
                What is Base UI?
                <Accordion.Icon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel {...propsPanelFirst}>
              <Accordion.Content>
                Base UI is a library of high-quality unstyled React components
                for design systems and web apps.
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item {...propsItemSecond}>
            <Accordion.Header {...propsHeaderSecond}>
              <Accordion.Trigger {...propsTriggerSecond}>
                How do I get started?
                <Accordion.Icon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel {...propsPanelSecond}>
              <Accordion.Content>
                Head to the “Quick start” guide in the docs. If you’ve used
                unstyled libraries before, you’ll feel at home.
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item {...propsItemThird}>
            <Accordion.Header {...propsHeaderThird}>
              <Accordion.Trigger {...propsTriggerThird}>
                Can I use it for my project?
                <Accordion.Icon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel {...propsPanelThird}>
              <Accordion.Content>
                Of course! Base UI is free and open source.
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </RemounterRoot>
    </Component>
  );
};
