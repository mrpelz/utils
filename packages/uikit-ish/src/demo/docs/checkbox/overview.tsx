import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { FunctionComponent } from 'react';

import { Checkbox } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import {
  checkboxGroupRows,
  checkboxRootRows,
  radioGroupRows,
  radioRootRows,
} from './docs.js';
import { propOptionsOverview } from './props.js';

/** A selection circle, in its states. */
const LiveView: FunctionComponent = () => {
  const id = 'checkbox-overview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsOverview,
    { external, isOpen: true, title: 'Checkbox.Root' },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Checkbox"
    >
      <Checkbox.Root
        key={elementKey}
        aria-label="Selected"
        {...props}
        onCheckedChange={(
          isChecked: boolean,
          { reason }: BaseCheckbox.Root.ChangeEventDetails,
        ) => addLog(`checked change: ${String(isChecked)}/${reason}`)}
      />
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

/** `/checkbox`: what selection circles are for, and their key props. */
export const CheckboxOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        No classic checkboxes or radio buttons: items are selected with
        selection circles, e.g. rows while editing a list.
      </li>
      <li>
        <PartLink
          component="checkbox"
          part="Checkbox.Root"
        >
          Checkbox
        </PartLink>{' '}
        and{' '}
        <PartLink
          component="checkbox"
          part="Radio.Root"
        >
          Radio
        </PartLink>
        : those circles, Base UI’s checkbox and radio.
      </li>
      <li>
        Unticked: a gray ring. Ticked: the tint, with a checkmark. Mixed: a
        dash.
      </li>
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
        Selecting items to act on together (rows to delete or move, people to
        invite): a{' '}
        <PartLink
          component="checkbox"
          part="Checkbox.Root"
        >
          Checkbox
        </PartLink>{' '}
        per item, several at once.
      </li>
      <li>
        Choosing one item of a list (e.g. a default account):{' '}
        <PartLink
          component="checkbox"
          part="Radio.Root"
        >
          Radio
        </PartLink>
        s in a{' '}
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />
        .
      </li>
      <li>
        Selecting all of them at once: a parent checkbox in a{' '}
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />
        , mixed while only some are selected.
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
        A setting that takes effect at once: a <a href="switch">Switch</a>.
      </li>
      <li>
        Choosing one of a few short options shown side by side: a{' '}
        <a href="segmented">Segmented</a> control.
      </li>
      <li>
        A checkmark after the chosen row (settings lists, e.g. a language):{' '}
        <PartLink
          component="list"
          part="List.Checkmark"
        />{' '}
        (see <a href="list">List</a>).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most selection circles set, across the parts.</li>
      <li>
        All parts’ props: <a href="checkbox/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Checkbox.Root',
          pickRows(
            checkboxRootRows,
            'checked',
            'defaultChecked',
            'onCheckedChange',
            'indeterminate',
            'disabled',
            'name',
            'value',
            'parent',
          ),
        ],
        ['Radio.Root', pickRows(radioRootRows, 'value', 'disabled')],
        [
          'CheckboxGroup',
          pickRows(
            checkboxGroupRows,
            'value',
            'defaultValue',
            'onValueChange',
            'allValues',
          ),
        ],
        [
          'RadioGroup',
          pickRows(
            radioGroupRows,
            'value',
            'defaultValue',
            'onValueChange',
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
        A checkbox is a <code>span</code> with the <code>checkbox</code> role
        and <code>aria-checked</code> (<code>mixed</code> while indeterminate);
        a radio has the <code>radio</code> role, its group the{' '}
        <code>radiogroup</code> role. Hidden inputs beside them carry the values
        for forms, hidden from assistive technology.
      </li>
      <li>
        Name each circle: wrap it and its text in a <code>{'<label>'}</code>{' '}
        (clicking the text then ticks it, and it’s labelled by it), or give it
        an <code>aria-label</code> (e.g. the row’s title, as in lists). Name a{' '}
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />{' '}
        too.
      </li>
      <li>
        Keyboard: Tab focuses a checkbox, Space ticks or unticks it (Enter
        doesn’t, as with native checkboxes). In a radio group, Tab focuses the
        chosen radio, and arrow keys move to the next one and choose it.
      </li>
      <li>
        Ticked and unticked differ in more than color: a filled circle with a
        checkmark, or an empty ring.
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
        A click or tap ticks or unticks a checkbox, and chooses a radio; the hit
        area is 44px (HIG), around the 22px circle.
      </li>
      <li>
        In a list, a row passes its clicks on to its circle (
        <code>forwardClick</code>), so the whole row selects (see{' '}
        <a href="checkbox/composition">Composition</a>; guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>: the list owns the selection).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const checkboxOverviewDemos = [LiveView];
