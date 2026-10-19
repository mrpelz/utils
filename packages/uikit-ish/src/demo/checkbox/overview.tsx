import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { FunctionComponent } from 'react';

import { Checkbox } from '../../components/index.js';
import { GuideLink } from '../hig-guide/link.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { KeyPropsTable, pickRows } from '../utils/props-table.js';
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
    'Checkbox.Root',
    external,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Checkbox"
    >
      <Checkbox.Root
        key={elementKey}
        aria-label="Selected"
        {...props}
        onCheckedChange={(
          checked: boolean,
          { reason }: BaseCheckbox.Root.ChangeEventDetails,
        ) => addLog(`checked change: ${String(checked)}/${reason}`)}
      />
    </Component>
  );
};

/** `/checkbox`: what selection circles are for, and their key props. */
export const CheckboxOverview: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      iOS has no checkboxes or radio buttons of its own: it selects items with
      selection circles, as rows while editing a list (UIKit’s editing
      selection). <code>Checkbox</code> and <code>Radio</code> are those
      circles: Base UI’s checkbox and radio, unticked in a gray ring, ticked in
      the tint with a checkmark, mixed with a dash.
    </p>
    <LiveView />

    <h2>When to use it</h2>
    <ul>
      <li>
        Selecting items to act on together (rows to delete or move, people to
        invite): a <code>Checkbox</code> per item, several at once.
      </li>
      <li>
        Choosing one item of a list (e.g. a default account): <code>Radio</code>
        s in a <code>RadioGroup</code>.
      </li>
      <li>
        Selecting all of them at once: a parent checkbox in a{' '}
        <code>CheckboxGroup</code>, mixed while only some are selected.
      </li>
    </ul>

    <h2>When to use something else</h2>
    <ul>
      <li>
        A setting that takes effect at once: a <a href="switch">Switch</a>.
      </li>
      <li>
        Choosing one of a few short options shown side by side: a{' '}
        <a href="segmented">Segmented</a> control.
      </li>
      <li>
        A checkmark after the chosen row (iOS’s settings lists, e.g. a
        language): <code>List.Checkmark</code> (see <a href="list">List</a>).
      </li>
    </ul>

    <h2>Key props</h2>
    <p>
      The props most selection circles set, across the parts; every part’s props
      are on <a href="checkbox/parts">Parts</a>.
    </p>
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

    <h2>Accessibility</h2>
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
        <code>RadioGroup</code> too.
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

    <h2>Behavior</h2>
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
