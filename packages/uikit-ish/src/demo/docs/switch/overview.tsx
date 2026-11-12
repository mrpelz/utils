import { FunctionComponent, useMemo } from 'react';

import { Switch } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
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
import { switchRootRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** The switch on its own, with a few of its props. */
const LiveView: FunctionComponent = () => {
  const id = 'switch-overview';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsOverview,
    { external, isOpen: true, title: 'Switch.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Switch.Thumb': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Switch"
    >
      <Switch.Root
        key={elementKey}
        aria-label="Example"
        {...props}
      >
        <Switch.Thumb {...partProps['Switch.Thumb']} />
      </Switch.Root>
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

/** `/switch`: what a switch is for, and its props. */
export const SwitchOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>Turns one setting on or off.</li>
      <li>It takes effect at once, with nothing to save or confirm.</li>
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
        For a setting with two states that applies right away, such as Airplane
        Mode or a notification category.
      </li>
      <li>
        Label it by what it turns on (a row’s title, or <code>aria-label</code>
        ), never by “on” or “off”, since its position says that.
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
        Selecting items (rows to delete, people to invite): use a{' '}
        <a href={publicUrl('checkbox')}>Checkbox</a>, a selection circle.
      </li>
      <li>
        Two named options, or more than two: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
      </li>
      <li>
        Starting something (Connect, Sign Out): use a{' '}
        <a href={publicUrl('button')}>Button</a>, because a switch states a
        setting rather than performing an action.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most switches set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('switch/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Switch.Root',
          pickRows(
            switchRootRows,
            'checked',
            'defaultChecked',
            'onCheckedChange',
            'disabled',
            'indeterminate',
            'tint',
            'name',
          ),
        ],
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
        The root has the <code>switch</code> role and <code>aria-checked</code>.
        A hidden checkbox input next to it carries its value for forms.
      </li>
      <li>
        Give it an accessible name: <code>aria-label</code>, or{' '}
        <code>aria-labelledby</code> pointing at the visible label (for example
        its list row’s title). Name it by what it turns on, never “on” or “off”.
      </li>
      <li>
        Tab focuses it (with the browser’s focus ring), and Space or Enter
        toggles it.
      </li>
      <li>
        With <code>onOffLabels</code> (“I” and “O” on the track, as an
        accessibility setting would show), color alone doesn’t tell its state.
        The library doesn’t read such a setting itself.
      </li>
      <li>
        Its animations (the knob, the lens) don’t follow{' '}
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
        A click or tap toggles it. The knob can also be dragged: the state flips
        as it crosses the middle, and a quick release that didn’t get there
        still toggles, like a tap.
      </li>
      <li>While pressed, the knob turns into a glass lens.</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const switchOverviewDemos = [LiveView];
