import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent } from 'react';

import { Segmented } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { periods } from './content.js';
import { segmentedItemRows, segmentedRootRows } from './docs.js';
import { propOptionsOverviewRoot, propOptionsPeriodsContent } from './props.js';

/** Periods, with a few of the root's props. */
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

  return (
    <Component
      isCentered
      isInline
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      state={[stateContent, stateRoot]}
      title="Segmented"
    >
      <Segmented.Root
        key={elementKey}
        aria-label="Period"
        {...propsRoot}
        onValueChange={(
          value: unknown,
          { reason }: BaseRadioGroup.ChangeEventDetails,
        ) => addLog(`value change: ${String(value)}/${reason}`)}
      >
        {periods.slice(0, content.count).map(([value, label]) => (
          <Segmented.Item
            key={value}
            value={value}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
      </Segmented.Root>
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
      <li>E.g. a chart’s period, or which of a list’s items to show.</li>
      <li>The chosen one highlighted.</li>
      <li>Base UI’s radio group.</li>
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
        (one or two words each), e.g. Day, Week, Month, Year.
      </li>
      <li>
        To switch between views of the same content (e.g. All and Missed calls),
        in the content, a navigation bar or a toolbar (see{' '}
        <a href="segmented/composition">Composition</a>).
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
        A setting that’s on or off: a <a href="switch">Switch</a>.
      </li>
      <li>
        More options, or long ones: a <a href="menu">Menu</a> (a pop-up button)
        or a <a href="roll">Roll</a> picker, collapsed until needed (guide{' '}
        <GuideLink to="choice-family">§5</GuideLink>).
      </li>
      <li>
        Switching an app’s top-level sections: a <a href="tab-bar">Tab bar</a>.
      </li>
      <li>
        Starting something: a <a href="button">Button</a>, as choosing an option
        doesn’t perform an action.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most segmented controls set, across their parts.</li>
      <li>
        All parts’ props: <a href="segmented/parts">Parts</a>.
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
        role, each item the <code>radio</code> role and{' '}
        <code>aria-checked</code>; hidden radio inputs beside them carry the
        value for forms, hidden from assistive technology.
      </li>
      <li>
        Give the root an accessible name (<code>aria-label</code>, or{' '}
        <code>aria-labelledby</code> pointing at a visible label): it says what
        the options choose (e.g. “Period”). Items are named by their labels.
      </li>
      <li>
        Keyboard: Tab focuses the chosen item (the others are skipped); arrow
        keys move to the next or previous item and choose it.
      </li>
      <li>
        The lens and the labels’ width-reserving copies are hidden from
        assistive technology.
      </li>
      <li>
        Its animations (highlight, lens) don’t follow{' '}
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
        A click or tap chooses an item. Pressed, the selection turns into a
        glass lens that follows the pointer across the items; released, the item
        under it is chosen, and the lens settles on it.
      </li>
      <li>
        Items share the width equally, each as wide as the widest label; the
        chosen label’s bolder weight doesn’t change the control’s width.
      </li>
      <li>
        Separators show between unchosen items only (or none:{' '}
        <code>hideSeparators</code>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const segmentedOverviewDemos = [LiveView];
