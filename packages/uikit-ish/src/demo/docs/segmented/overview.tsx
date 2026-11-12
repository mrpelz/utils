import './style.css';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent, useMemo } from 'react';

import { Segmented, Viewport } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { morePeriods, periods } from './content.js';
import { segmentedItemRows, segmentedRootRows } from './docs.js';
import { propOptionsOverviewRoot, propOptionsPeriodsContent } from './props.js';

/** Periods on a phone's screen (its width), with a few of the root's props. */
const LiveView: FunctionComponent = () => {
  const id = 'segmented-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsPeriodsContent,
    { external: externalContent, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsOverviewRoot,
    { external: externalRoot, isOpen: true, title: 'Segmented.Root' },
  );

  const shown =
    content.count > periods.length
      ? morePeriods
      : periods.slice(0, content.count);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[controlContent, controlRoot, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[stateContent, stateRoot, partState]}
      title="Segmented"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="segmented-demo-content">
          <Segmented.Root
            key={elementKey}
            aria-label="Period"
            {...propsRoot}
            onValueChange={(
              value: unknown,
              { reason }: BaseRadioGroup.ChangeEventDetails,
            ) => addLog(`value change: ${String(value)}/${reason}`)}
          >
            {shown.map(([value, label]) => (
              <Segmented.Item
                key={value}
                {...partProps['Segmented.Item']}
                value={value}
              >
                {label}
              </Segmented.Item>
            ))}
            <Segmented.Highlight {...partProps['Segmented.Highlight']} />
          </Segmented.Root>
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/segmented`: what a segmented control is for, and its props. */
export const SegmentedOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>Chooses one of a few options, side by side on a track.</li>
      <li>For example a chart’s period, or which of a list’s items to show.</li>
      <li>The chosen one is highlighted.</li>
      <li>It’s Base UI’s radio group.</li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For two to five options of the same kind, short enough to show at once
        (one or two words each), such as Day, Week, Month and Year.
      </li>
      <li>
        For switching between views of the same content (for example All and
        Missed calls), in a navigation bar or a toolbar (see{' '}
        <a href={publicUrl('segmented/composition')}>Composition</a>).
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A setting that’s on or off: use a{' '}
        <a href={publicUrl('switch')}>Switch</a>.
      </li>
      <li>
        More options, or long ones: use a <a href={publicUrl('menu')}>Menu</a>{' '}
        (a pop-up button) or a <a href={publicUrl('roll')}>Roll</a> picker,
        collapsed until needed.
      </li>
      <li>
        Switching an app’s top-level sections: use a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a>.
      </li>
      <li>
        Starting something: use a <a href={publicUrl('button')}>Button</a>,
        because choosing an option doesn’t perform an action.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most segmented controls set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('segmented/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Segmented.Root',
          pickRows(
            segmentedRootRows,
            'value',
            'defaultValue',
            'onValueChange',
            'disabled',
            'name',
            'hideSeparators',
            'overflow',
          ),
        ],
        ['Segmented.Item', pickRows(segmentedItemRows, 'value', 'disabled')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        It’s Base UI’s radio group: the root has the <code>radiogroup</code>{' '}
        role, and each item the <code>radio</code> role and{' '}
        <code>aria-checked</code>. Hidden radio inputs next to them carry the
        value for forms, hidden from assistive technology.
      </li>
      <li>
        Give the root an accessible name (<code>aria-label</code>, or{' '}
        <code>aria-labelledby</code> pointing at a visible label) that says what
        the options choose (for example “Period”). Items are named by their
        labels.
      </li>
      <li>
        Tab focuses the chosen item (the others are skipped). The arrow keys
        move to the next or previous item and choose it.
      </li>
      <li>
        The lens, and the copies of the labels that reserve their width, are
        hidden from assistive technology.
      </li>
      <li>
        Its animations (the highlight, the lens) don’t follow{' '}
        <code>prefers-reduced-motion</code>.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        A click or tap chooses an item. While pressed, the selection turns into
        a glass lens that follows the pointer across the items. On release, the
        item under it is chosen, and the lens settles on it.
      </li>
      <li>
        Items share the width equally, each as wide as the widest label, so the
        chosen label’s bolder weight doesn’t change the control’s width.
      </li>
      <li>
        Separators show only between unchosen items (or not at all, with{' '}
        <code>hideSeparators</code>).
      </li>
      <li>
        When it’s too narrow for its items, their labels truncate. Or, with{' '}
        <code>overflow=&quot;scroll&quot;</code>, the items scroll sideways,
        snapping to an item, with the chosen one scrolled into view.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const segmentedOverviewDemos = [LiveView];
