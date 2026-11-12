import { FunctionComponent, useMemo } from 'react';

import { List, TextField } from '../../../components/index.js';
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
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsOverviewRoot,
    { external: externalRoot, title: 'TextField.Root' },
  );
  const [controlControl, propsControl, stateControl, keyControl] =
    usePropControl(propOptionsOverviewControl, {
      external: externalControl,
      title: 'TextField.Control',
    });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Below': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Trailing': [],
            'TextField.Clear': [],
            'TextField.Description': [],
            'TextField.Error': [],
            'TextField.Label': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[controlContent, controlRoot, controlControl, partControls]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, stateControl, partState]}
      title="Text field"
    >
      <List.Root
        {...partProps['List.Root']}
        className="text-field-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              key={`${keyRoot}-${keyControl}`}
              render={<List.Item {...partProps['List.Item']} />}
              {...propsRoot}
            >
              <List.Content {...partProps['List.Content']}>
                {content.label ? (
                  <TextField.Label {...partProps['TextField.Label']}>
                    Name
                  </TextField.Label>
                ) : null}
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  aria-label={content.label ? undefined : 'Name'}
                  {...propsControl}
                  onValueChange={(value: string) => addLog(`value: ${value}`)}
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                {content.description ? (
                  <TextField.Description
                    {...partProps['TextField.Description']}
                  >
                    As shown to others.
                  </TextField.Description>
                ) : null}
                <TextField.Error {...partProps['TextField.Error']}>
                  Please enter a name.
                </TextField.Error>
              </List.Below>
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
        Free text, a line or several of it, such as a name, an address or a
        search. It’s Base UI’s <code>Field</code>.
      </li>
      <li>
        It can be a <a href={publicUrl('list')}>List</a> row (as in a form or a
        settings app), with its label as the row’s title and its value at the
        row’s end. Or it can stand on its own, stacked, or be a search field’s
        capsule.
      </li>
      <li>
        It’s validated like the browser’s inputs (and by a function of the
        app’s), with its error below it.
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
        For something only people know: a name, an email address, a note (see{' '}
        <a href={publicUrl('text-field/composition#in-a-form-list')}>
          Composition
        </a>
        ).
      </li>
      <li>
        For searching: a search field (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />
        ) that filters what’s shown.
      </li>
      <li>
        For entry with suggestions, such as what people typed before, or
        contacts.
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
        A pick from a known set: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control, a{' '}
        <a href={publicUrl('list')}>List</a> with checkmarks, or a{' '}
        <a href={publicUrl('menu')}>Menu</a>.
      </li>
      <li>
        A number in a range: use a <a href={publicUrl('slider')}>Slider</a> or a{' '}
        <a href={publicUrl('stepper')}>Stepper</a>. A date: use a{' '}
        <a href={publicUrl('date-picker')}>Date Picker</a>.
      </li>
      <li>
        A text asked for in the moment (a name for a new folder): use an{' '}
        <a href={publicUrl('alert')}>Alert</a>’s field.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most fields set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('text-field/parts')}>Parts</a> page.
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
        . Without one (with only a placeholder), give it an{' '}
        <code>aria-label</code>.
      </li>
      <li>
        Its description and its error describe it (<code>aria-describedby</code>
        ). When it’s invalid, it’s <code>aria-invalid</code>.
      </li>
      <li>
        The clear button is out of the tab order and named “Clear text”. With
        the keyboard, people clear the field by selecting and deleting.
      </li>
      <li>
        Its <code>type</code>, <code>inputMode</code>, <code>autoComplete</code>{' '}
        and <code>enterKeyHint</code> pick the on-screen keyboard and its
        autofill.
      </li>
      <li>
        Color alone doesn’t say it’s invalid: the error message says what to
        fix.
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
        As a row: the label in Body, and the value after it at 17px (aligned
        with the row’s end when there’s a label, filling the row when there
        isn’t).
      </li>
      <li>
        On its own (not a row): the label, control, description and error
        stacked 4px apart, with the label in Subheadline.
      </li>
      <li>
        The clear button shows only while the field is filled, and by default
        only while it has focus too (<code>whileEditing</code>; its{' '}
        <code>mode</code> can also be <code>unlessEditing</code> or{' '}
        <code>always</code>). It clears the field as typing would (its change
        handlers run), and focuses the control.
      </li>
      <li>
        It’s validated when its <code>validationMode</code> says: when its{' '}
        <a href={publicUrl('form')}>Form</a> is submitted (then on each change),
        when focus leaves it, or on each change. When it’s invalid, its value
        turns red and its error shows.
      </li>
      <li>
        Its description and error are in Caption 1 (12px), below it. When it’s
        disabled, it’s dimmed (55%).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const textFieldOverviewDemos = [LiveView];
