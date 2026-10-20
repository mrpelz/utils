import { Field } from '@base-ui/react/field';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent } from 'react';

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  forwardClick,
  List,
  Radio,
  RadioGroup,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { Contents, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const rowsCode = `<List.Group>
  <List.Item onClick={forwardClick('[role=checkbox]')}>
    <List.Checkbox aria-label="Anna Haro" />
    <List.Title>Anna Haro</List.Title>
  </List.Item>
  …
</List.Group>`;

const oneRowCode = `<RadioGroup
  aria-label="Default account"
  defaultValue="icloud"
  render={<List.Group />}
>
  <List.Item onClick={forwardClick('[role=radio]')}>
    <List.Radio
      aria-label="iCloud"
      value="icloud"
    />
    <List.Title>iCloud</List.Title>
  </List.Item>
  …
</RadioGroup>`;

const allCode = `<CheckboxGroup
  allValues={['messages', 'mentions', 'reminders']}
  defaultValue={['mentions']}
  render={<List.Group />}
>
  <List.Item onClick={forwardClick('[role=checkbox]')}>
    <List.Checkbox
      parent
      aria-label="All"
    />
    <List.Title>All</List.Title>
  </List.Item>
  <List.Item onClick={forwardClick('[role=checkbox]')}>
    <List.Checkbox
      aria-label="Messages"
      value="messages"
    />
    <List.Title>Messages</List.Title>
  </List.Item>
  …
</CheckboxGroup>`;

const formCode = `<Form onFormSubmit={(values) => …}>
  <Field.Root name="contact">
    <RadioGroup
      aria-label="Contact by"
      defaultValue="email"
    >
      <label>
        <Radio.Root value="email" />
        Email
      </label>
      …
    </RadioGroup>
  </Field.Root>
  <Field.Root name="newsletter">
    <label>
      <Checkbox.Root />
      Newsletter
    </label>
  </Field.Root>
  <Button.Root type="submit">…</Button.Root>
</Form>`;

const people = ['Anna Haro', 'Daniel Higgins', 'John Appleseed', 'Kate Bell'];

const accounts = [
  ['icloud', 'iCloud'],
  ['gmail', 'Gmail'],
  ['work', 'Work'],
] as const;

const notifications = [
  ['messages', 'Messages'],
  ['mentions', 'Mentions'],
  ['reminders', 'Reminders'],
] as const;

const contacts = [
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['mail', 'Mail'],
] as const;

/** People to invite, selected by their rows. */
const SelectingRows: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      inline
      stretch
      id="checkbox-composition-rows"
      log={log}
      title="Checkboxes selecting rows"
    >
      <List.Root>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Invite</List.Title>
          </List.Header>
          <List.Group>
            {people.map((name) => (
              <List.Item
                key={name}
                onClick={forwardClick('[role=checkbox]')}
              >
                <List.Checkbox
                  aria-label={name}
                  onCheckedChange={(checked: boolean) =>
                    addLog(`${name}: ${String(checked)}`)
                  }
                />
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** The default account, one of the rows. */
const ChoosingOneRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      inline
      stretch
      id="checkbox-composition-one-row"
      log={log}
      title="Radios choosing a row"
    >
      <List.Root>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Default Account</List.Title>
          </List.Header>
          <RadioGroup
            aria-label="Default account"
            defaultValue="icloud"
            render={<List.Group />}
            onValueChange={(
              value: unknown,
              { reason }: BaseRadioGroup.ChangeEventDetails,
            ) => addLog(`value change: ${String(value)}/${reason}`)}
          >
            {accounts.map(([value, label]) => (
              <List.Item
                key={value}
                onClick={forwardClick('[role=radio]')}
              >
                <List.Radio
                  aria-label={label}
                  value={value}
                />
                <List.Title>{label}</List.Title>
              </List.Item>
            ))}
          </RadioGroup>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** Notifications, with a parent row selecting all of them. */
const SelectAll: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      inline
      stretch
      id="checkbox-composition-all"
      log={log}
      title="Checkboxes with a parent"
    >
      <List.Root>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Notifications</List.Title>
          </List.Header>
          <CheckboxGroup
            allValues={notifications.map(([value]) => value)}
            defaultValue={['mentions']}
            render={<List.Group />}
            onValueChange={(value: string[]) =>
              addLog(`value change: ${value.join(', ')}`)
            }
          >
            <List.Item onClick={forwardClick('[role=checkbox]')}>
              <List.Checkbox
                parent
                aria-label="All"
              />
              <List.Title>All</List.Title>
            </List.Item>
            {notifications.map(([value, label]) => (
              <List.Item
                key={value}
                onClick={forwardClick('[role=checkbox]')}
              >
                <List.Checkbox
                  aria-label={label}
                  value={value}
                />
                <List.Title>{label}</List.Title>
              </List.Item>
            ))}
          </CheckboxGroup>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A form: a radio group and a checkbox, submitted by their fields' names. */
const InAForm: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="checkbox-composition-form"
      log={log}
      title="Radios and a checkbox in a form"
    >
      <Form
        className="checkbox-demo-group"
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <Field.Root name="contact">
          <RadioGroup
            aria-label="Contact by"
            className="checkbox-demo-group"
            defaultValue="email"
          >
            {contacts.map(([value, label]) => (
              <label
                key={value}
                className="checkbox-demo-option"
              >
                <Radio.Root value={value} />
                {label}
              </label>
            ))}
          </RadioGroup>
        </Field.Root>
        <Field.Root name="newsletter">
          <label className="checkbox-demo-option">
            <Checkbox.Root />
            Newsletter
          </label>
        </Field.Root>
        <Button.Root
          type="submit"
          variant="bordered-prominent"
        >
          <Button.Label>Submit</Button.Label>
        </Button.Root>
      </Form>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['selecting-list-rows', 'Selecting list rows'],
  ['choosing-one-row', 'Choosing one row'],
  ['selecting-all', 'Selecting all'],
  ['labels-and-forms', 'Labels and forms'],
];

/** `/checkbox/composition`: selection circles in lists and forms. */
export const CheckboxComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <h2 id="selecting-list-rows">Selecting list rows</h2>
    <ul>
      <li>
        Where iOS shows them: before a <a href="list">List</a>’s rows, as{' '}
        <code>List.Checkbox</code> (a <code>Checkbox.Root</code> as the row’s
        leading edit control).
      </li>
      <li>
        The row passes its clicks on to it (<code>forwardClick</code>): the
        whole row selects.
      </li>
      <li>
        The list owns the selection; actions on it go elsewhere, e.g. a toolbar
        (guide <GuideLink to="rule-g7">G7</GuideLink>).
      </li>
      <li>Name each by its row.</li>
    </ul>
    <CodeView code={rowsCode} />
    <SelectingRows />

    <h2 id="choosing-one-row">Choosing one row</h2>
    <ul>
      <li>
        A <code>RadioGroup</code> rendering the list’s group (
        <code>render</code>), a <code>List.Radio</code> before each row.
      </li>
      <li>One row chosen at a time; arrow keys move between them.</li>
    </ul>
    <CodeView code={oneRowCode} />
    <ChoosingOneRow />

    <h2 id="selecting-all">Selecting all</h2>
    <ul>
      <li>
        A <code>CheckboxGroup</code> (rendering the list’s group) holds the
        selected rows’ names.
      </li>
      <li>
        Given all of them (<code>allValues</code>), a <code>parent</code>{' '}
        checkbox selects or deselects all.
      </li>
      <li>The parent is mixed (a dash) while only some are selected.</li>
    </ul>
    <CodeView code={allCode} />
    <SelectAll />

    <h2 id="labels-and-forms">Labels and forms</h2>
    <ul>
      <li>
        Outside lists: a <code>{'<label>'}</code> around a circle and its text;
        the text ticks it and names it.
      </li>
      <li>
        In a <a href="form">Form</a>: Base UI’s <code>Field.Root</code> names
        each value (the radio group’s chosen <code>value</code>, the checkbox’s
        ticked state).
      </li>
      <li>
        Outside a field: the checkbox’s own <code>name</code> and{' '}
        <code>value</code>, through its hidden input.
      </li>
    </ul>
    <CodeView code={formCode} />
    <InAForm />
  </>
);
