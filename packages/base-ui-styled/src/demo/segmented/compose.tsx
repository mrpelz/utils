/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- demo hooks, typed by inference */

import { ComponentProps, ReactNode, useMemo } from 'react';

import { Segmented } from '../../components/index.js';
import { AddLog } from '../utils/log.js';
import { commonPropOptions, PropMap, usePropControl } from '../utils/main.js';
import { getPropOptionsItem } from './props.js';

/** How many controls (and states) `useSegmentedDemo` has. */
export const segmentedControlCount = 8;

/** The content's options (see `propOptionsContent`): its keys. */
export type SegmentedContentOptions = PropMap & {
  count: readonly unknown[];
  label1: readonly unknown[];
  label2: readonly unknown[];
  label3: readonly unknown[];
  label4: readonly unknown[];
  label5: readonly unknown[];
};

export type SegmentedDemoOptions<
  Content extends SegmentedContentOptions,
  Root extends PropMap,
> = {
  /**
   * The content's options: as the segmented demo's (`propOptionsContent`),
   * with a composing demo's own values (e.g. as many items as it has
   * panels).
   */
  content: Content;
  /** Each item's own props, by its value (e.g. `aria-controls`). */
  itemProps?: Record<string, Record<string, unknown>>;
  /** Before the controls' titles (e.g. `text size: `). */
  prefix?: string;
  /** The root's options (as `getPropOptionsRoot`'s, with own values). */
  root: Root;
  /** The items' values (default: `first` to `fifth`). */
  values?: readonly string[];
};

const defaultValues = ['first', 'second', 'third', 'fourth', 'fifth'];

/**
 * A `Segmented` control's demo controls (its content, root, items and
 * highlight) and the control, for its demo and demos composing one (e.g. a
 * list row): all of its demo's props, with the composing demo's values;
 * its `own` props (e.g. its value) over them.
 */
export const useSegmentedDemo = <
  Content extends SegmentedContentOptions,
  Root extends PropMap,
>(
  addLog: AddLog,
  externals: readonly unknown[],
  {
    content: contentOptions,
    itemProps = {},
    prefix = '',
    root,
    values = defaultValues,
  }: SegmentedDemoOptions<Content, Root>,
  own: Omit<ComponentProps<typeof Segmented.Root>, 'ref'> = {},
) => {
  const [
    externalContent,
    externalRoot,
    externalItemFirst,
    externalItemSecond,
    externalItemThird,
    externalItemFourth,
    externalItemFifth,
    externalHighlight,
  ] = externals;

  const [controlContent, content, stateContent] = usePropControl(
    contentOptions,
    `${prefix}[content]`,
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, Remounter] = usePropControl(
    root,
    `${prefix}root`,
    externalRoot,
    true,
  );
  const [controlItemFirst, propsItemFirst, stateItemFirst] = usePropControl(
    useMemo(() => getPropOptionsItem('first', addLog), [addLog]),
    `${prefix}1st item`,
    externalItemFirst,
  );
  const [controlItemSecond, propsItemSecond, stateItemSecond] = usePropControl(
    useMemo(() => getPropOptionsItem('second', addLog), [addLog]),
    `${prefix}2nd item`,
    externalItemSecond,
  );
  const [controlItemThird, propsItemThird, stateItemThird] = usePropControl(
    useMemo(() => getPropOptionsItem('third', addLog), [addLog]),
    `${prefix}3rd item`,
    externalItemThird,
  );
  const [controlItemFourth, propsItemFourth, stateItemFourth] = usePropControl(
    useMemo(() => getPropOptionsItem('fourth', addLog), [addLog]),
    `${prefix}4th item`,
    externalItemFourth,
  );
  const [controlItemFifth, propsItemFifth, stateItemFifth] = usePropControl(
    useMemo(() => getPropOptionsItem('fifth', addLog), [addLog]),
    `${prefix}5th item`,
    externalItemFifth,
  );
  const [controlHighlight, propsHighlight, stateHighlight] = usePropControl(
    commonPropOptions,
    `${prefix}highlight`,
    externalHighlight,
  );

  const items = [
    [content.label1, propsItemFirst],
    [content.label2, propsItemSecond],
    [content.label3, propsItemThird],
    [content.label4, propsItemFourth],
    [content.label5, propsItemFifth],
  ] as const;

  const element = (
    <Remounter>
      <Segmented.Root
        {...propsRoot}
        {...own}
      >
        {items.slice(0, Number(content.count)).map(([label, props], index) => (
          <Segmented.Item
            key={values[index]}
            value={values[index]}
            {...itemProps[values[index] ?? '']}
            {...props}
          >
            {label as ReactNode}
          </Segmented.Item>
        ))}
        <Segmented.Highlight {...propsHighlight} />
      </Segmented.Root>
    </Remounter>
  );

  return {
    controls: [
      controlContent,
      controlRoot,
      controlItemFirst,
      controlItemSecond,
      controlItemThird,
      controlItemFourth,
      controlItemFifth,
      controlHighlight,
    ],
    element,
    states: [
      stateContent,
      stateRoot,
      stateItemFirst,
      stateItemSecond,
      stateItemThird,
      stateItemFourth,
      stateItemFifth,
      stateHighlight,
    ],
  };
};
