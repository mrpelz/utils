import { FunctionComponent } from 'react';

import { List, TextField } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import {
  textFieldControlRows,
  textFieldErrorRows,
  textFieldRootRows,
} from './docs.js';
import {
  propOptionsOverviewContent,
  propOptionsOverviewControl,
  propOptionsOverviewRoot,
} from './props.js';

/** A field as a list row: its label, its value, its clear button. */
const LiveView: FunctionComponent = () => {
  const id = 'text-field-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalControl] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsOverviewRoot,
    'TextField.Root',
    externalRoot,
    true,
  );
  const [controlControl, propsControl, stateControl, keyControl] =
    usePropControl(
      propOptionsOverviewControl,
      'TextField.Control',
      externalControl,
      true,
    );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[controlContent, controlRoot, controlControl]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, stateControl]}
      title="Text field"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root
              key={`${keyRoot}-${keyControl}`}
              render={<List.Item />}
              {...propsRoot}
            >
              {content.label ? <TextField.Label>Name</TextField.Label> : null}
              <TextField.Control
                aria-label={content.label ? undefined : 'Name'}
                {...propsControl}
                onValueChange={(value: string) => addLog(`value: ${value}`)}
              />
              <TextField.Clear />
              {content.description ? (
                <TextField.Description>
                  As shown to others.
                </TextField.Description>
              ) : null}
              <TextField.Error>Please enter a name.</TextField.Error>
            </TextField.Root>
          </List.Group>
        </List.Section>
      </List.Root>
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

/** `/text-field`: what a text field is for, and its props. */
export const TextFieldOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Free text, a line (or several) of it (UIKit <code>UITextField</code>;
        Base UI’s <code>Field</code>): a name, an address, a search.
      </li>
      <li>
        As a <a href="list">List</a> row (a form’s, Settings’): its label the
        row’s title, its value at the row’s end; or stacked on its own; or a
        search field’s capsule.
      </li>
      <li>
        Validated as the browser’s inputs are (and by a function of the app’s),
        its error below it.
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
        Something only people know: a name, an email address, a note (see{' '}
        <a href="text-field/composition#in-a-form-list">Composition</a>).
      </li>
      <li>
        Searching: a search field (
        <PartLink
          component="text-field"
          part="TextField.Search"
        />
        ), filtering what’s shown.
      </li>
      <li>Entry with suggestions: what people have typed before, contacts.</li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A pick from a known set: a <a href="segmented">Segmented</a> control, a{' '}
        <a href="list">List</a> with checkmarks, a <a href="menu">Menu</a>.
      </li>
      <li>
        A number in a range: a <a href="slider">Slider</a> or a{' '}
        <a href="stepper">Stepper</a>; a date: a{' '}
        <a href="date-picker">Date picker</a>.
      </li>
      <li>
        A text asked for at a moment (a name for a new folder): an{' '}
        <a href="alert">Alert</a>’s field.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most fields set, across their parts.</li>
      <li>
        All parts’ props: <a href="text-field/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'TextField.Root',
          pickRows(
            textFieldRootRows,
            'render',
            'name',
            'validate',
            'validationMode',
            'disabled',
          ),
        ],
        [
          'TextField.Control',
          pickRows(
            textFieldControlRows,
            'value',
            'defaultValue',
            'onValueChange',
            'placeholder',
            'type',
          ),
        ],
        ['TextField.Error', pickRows(textFieldErrorRows, 'match')],
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
        The control is a native <code>input</code> (or <code>textarea</code>),
        named by its{' '}
        <PartLink
          component="text-field"
          part="TextField.Label"
        />
        ; without one (a placeholder alone), give it an <code>aria-label</code>.
      </li>
      <li>
        Its description and its error describe it (<code>aria-describedby</code>
        ); invalid, it’s <code>aria-invalid</code>.
      </li>
      <li>
        The clear button is out of the tab order (as UIKit’s), named “Clear
        text”: the keyboard clears by selecting and deleting.
      </li>
      <li>
        Its <code>type</code>, <code>inputMode</code>, <code>autoComplete</code>{' '}
        and <code>enterKeyHint</code> pick iOS’s keyboard and its autofill.
      </li>
      <li>
        Invalid isn’t told by color alone: the error message says what to fix.
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
        A row: the label in Body, the value after it (aligned to the row’s end
        with a label; filling the row without one), 17px.
      </li>
      <li>
        Standalone (not a row): label, control, description and error stacked,
        4px apart; the label in Subheadline.
      </li>
      <li>
        The clear button only while it’s filled: by default while it’s focused
        too (UIKit’s <code>whileEditing</code>; its <code>mode</code>: also{' '}
        <code>unlessEditing</code>, <code>always</code>), clearing as typing
        would (its change handlers run), focusing the control.
      </li>
      <li>
        Validated when its <code>validationMode</code> says: on submitting its{' '}
        <a href="form">Form</a> (then on each change), on leaving it, or on each
        change; invalid, its value in red, its error shown.
      </li>
      <li>
        Its description and error in Caption 1 (12px), below it; disabled,
        dimmed (55%).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const textFieldOverviewDemos = [LiveView];
