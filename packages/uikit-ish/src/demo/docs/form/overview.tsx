import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  Button,
  Field,
  Fieldset,
  Form,
  List,
  Stepper,
  TextField,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { fieldsetLegendRows, fieldsetRootRows, formRows } from './docs.js';

/** A short form: a fieldset of two fields, submitted. */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [copies, setCopies] = useState<number | null>(1);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="form-overview"
      log={log}
      title="Form"
    >
      <Form
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root>
          <Fieldset.Root>
            <Fieldset.Legend>
              <List.Title>Order</List.Title>
            </Fieldset.Legend>
            <List.Group>
              <TextField.Root
                name="name"
                render={<List.Item />}
              >
                <List.Content>
                  <TextField.Label>Name</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    required
                    placeholder="Required"
                  />
                </List.Trailing>
                <List.Below>
                  <TextField.Error match="valueMissing">
                    Enter a name.
                  </TextField.Error>
                </List.Below>
              </TextField.Root>
              <Field.Root
                name="copies"
                render={<List.Item />}
              >
                <List.Content>
                  <List.Title>Copies</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail className="form-demo-value">
                    {copies ?? '–'}
                  </List.Detail>
                </List.Trailing>
                <List.Trailing>
                  <Stepper.Root
                    min={1}
                    value={copies}
                    onValueChange={(next: number | null) => setCopies(next)}
                  >
                    <Stepper.Group>
                      <Stepper.Input aria-label="Copies" />
                      <Stepper.Decrement />
                      <Stepper.Increment />
                    </Stepper.Group>
                  </Stepper.Root>
                </List.Trailing>
              </Field.Root>
            </List.Group>
          </Fieldset.Root>
          <List.Section>
            <List.Block style={{ paddingInline: 0 }}>
              <Button.Root
                fill
                size="large"
                type="submit"
                variant="bordered-prominent"
              >
                <Button.Label>Order</Button.Label>
              </Button.Root>
            </List.Block>
          </List.Section>
        </List.Root>
      </Form>
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

/** `/form`: what a form is for, and its props. */
export const FormOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Fields to fill in and submit together, as iOS lays them out (Settings,
        Contacts): a <a href="list">List</a>, fieldsets its sections, fields its
        rows.
      </li>
      <li>
        Base UI’s form: values by their fields’ names, validated, submitted with
        a <a href="button">Button</a>.
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
        For values taken together, once: creating or editing something (an
        account, an event), deferring to a submit or a Done (the guide’s{' '}
        <GuideLink to="commit-model">commit model</GuideLink>, §8.2).
      </li>
      <li>
        For its validation, too: required fields, types, a server’s errors shown
        on their fields.
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
        Settings that apply at once (each its own change): a{' '}
        <a href="list">List</a> of controls, no form or submit (the commit
        model’s other kind).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most forms set.</li>
      <li>
        All parts’ props: <a href="form/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Form',
          pickRows(formRows, 'onFormSubmit', 'validationMode', 'errors'),
        ],
        ['Fieldset.Root', pickRows(fieldsetRootRows, 'disabled')],
        ['Fieldset.Legend', pickRows(fieldsetLegendRows, 'render')],
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
        A fieldset is a <code>fieldset</code>, its legend naming the group (its{' '}
        <code>aria-labelledby</code>; the section’s header).
      </li>
      <li>
        Each field names its control: a label (
        <PartLink
          component="text-field"
          part="TextField.Label"
        />
        ), or the control’s own <code>aria-label</code>.
      </li>
      <li>
        Invalid fields are marked (<code>aria-invalid</code>), their errors tied
        to them; submitting focuses the first invalid one.
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
        Submitted (a button of <code>type=&quot;submit&quot;</code>, or Enter in
        a text field), it validates; valid, <code>onFormSubmit</code> gets the
        values by name.
      </li>
      <li>
        Each control submits by a field’s name: text fields by{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />
        ’s, others by{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>
        ’s.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const formOverviewDemos = [LiveView];
