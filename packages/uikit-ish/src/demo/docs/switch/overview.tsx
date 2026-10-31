import { FunctionComponent } from 'react';

import { Switch } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Switch"
    >
      <Switch.Root
        key={elementKey}
        aria-label="Example"
        {...props}
      >
        <Switch.Thumb />
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
      <li>Takes effect at once: nothing to save or confirm.</li>
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
        For a setting with two states that applies immediately, e.g. Airplane
        Mode or a notification category.
      </li>
      <li>
        Labeled by what it turns on (a row’s title, or <code>aria-label</code>),
        never by “on” or “off”: its position says that.
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
        Selecting items (rows to delete, people to invite): a{' '}
        <a href="checkbox">Checkbox</a>, a selection circle.
      </li>
      <li>
        Two named options, or more than two: a <a href="segmented">Segmented</a>{' '}
        control.
      </li>
      <li>
        Starting something (Connect, Sign Out): a <a href="button">Button</a>,
        as a switch states a setting, it doesn’t perform an action.
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
        All parts’ props: <a href="switch/parts">Parts</a>.
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
        The root has the <code>switch</code> role and <code>aria-checked</code>;
        a hidden checkbox input beside it carries its value for forms.
      </li>
      <li>
        Give it an accessible name: <code>aria-label</code>, or{' '}
        <code>aria-labelledby</code> pointing at the visible label (e.g. its
        list row’s title). Name it by what it turns on, never “on” or “off”.
      </li>
      <li>
        Keyboard: Tab focuses it (the browser’s focus ring shows), Space or
        Enter toggles it.
      </li>
      <li>
        Its state isn’t told by color alone if you set <code>onOffLabels</code>{' '}
        (“I” and “O” on the track, as an accessibility setting would); the
        library doesn’t read such a setting itself.
      </li>
      <li>
        Its animations (knob, lens) don’t follow{' '}
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
        as it crosses the middle; a quick release that didn’t get there still
        toggles, as a tap.
      </li>
      <li>Pressed, the knob turns into a glass lens.</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const switchOverviewDemos = [LiveView];
