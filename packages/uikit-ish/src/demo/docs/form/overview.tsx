import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

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
import { usePartControls } from '../../tooling/frame/prop-control.js';
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
import { fieldsetLegendRows, fieldsetRootRows, formRows } from './docs.js';

/** A short form: a fieldset of two fields, submitted. */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [copies, setCopies] = useState<number | null>(1);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['onFormSubmit', 'style'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'Field.Root': ['name', 'render'],
            'Fieldset.Legend': [],
            'Fieldset.Root': [],
            'List.Below': [],
            'List.Block': ['style'],
            'List.Content': [],
            'List.Detail': ['className'],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': ['min', 'onValueChange', 'value'],
            'TextField.Control': ['placeholder', 'required'],
            'TextField.Error': ['match'],
            'TextField.Label': [],
            'TextField.Root': ['name', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('form-overview') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="form-overview"
      log={log}
      state={[partState]}
      title="Form"
    >
      <Form
        {...partProps.Form}
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root {...partProps['List.Root']}>
          <Fieldset.Root {...partProps['Fieldset.Root']}>
            <Fieldset.Legend {...partProps['Fieldset.Legend']}>
              <List.Title {...partProps['List.Title']}>Order</List.Title>
            </Fieldset.Legend>
            <List.Group {...partProps['List.Group']}>
              <TextField.Root
                {...partProps['TextField.Root']}
                name="name"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Content {...partProps['List.Content']}>
                  <TextField.Label {...partProps['TextField.Label']}>
                    Name
                  </TextField.Label>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <TextField.Control
                    {...partProps['TextField.Control']}
                    required
                    placeholder="Required"
                  />
                </List.Trailing>
                <List.Below {...partProps['List.Below']}>
                  <TextField.Error
                    {...partProps['TextField.Error']}
                    match="valueMissing"
                  >
                    Enter a name.
                  </TextField.Error>
                </List.Below>
              </TextField.Root>
              <Field.Root
                {...partProps['Field.Root']}
                name="copies"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Copies</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail
                    {...partProps['List.Detail']}
                    className="form-demo-value"
                  >
                    {copies ?? '–'}
                  </List.Detail>
                </List.Trailing>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Stepper.Root
                    {...partProps['Stepper.Root']}
                    min={1}
                    value={copies}
                    onValueChange={(next: number | null) => setCopies(next)}
                  >
                    <Stepper.Group {...partProps['Stepper.Group']}>
                      <Stepper.Input
                        {...partProps['Stepper.Input']}
                        aria-label="Copies"
                      />
                      <Stepper.Decrement {...partProps['Stepper.Decrement']} />
                      <Stepper.Increment {...partProps['Stepper.Increment']} />
                    </Stepper.Group>
                  </Stepper.Root>
                </List.Trailing>
              </Field.Root>
            </List.Group>
          </Fieldset.Root>
          <List.Section {...partProps['List.Section']}>
            <List.Block
              {...partProps['List.Block']}
              style={{ paddingInline: 0 }}
            >
              <Button.Root
                {...partProps['Button.Root']}
                fill
                size="large"
                type="submit"
                variant="bordered-prominent"
              >
                <Button.Label {...partProps['Button.Label']}>
                  Order
                </Button.Label>
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
        Fields to fill in and submit together, laid out the way settings and
        contacts apps do it: a <a href={publicUrl('list')}>List</a>, with
        fieldsets as its sections and fields as its rows.
      </li>
      <li>
        It’s Base UI’s form: it collects values by their fields’ names,
        validates them, and is submitted with a{' '}
        <a href={publicUrl('button')}>Button</a>.
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
        For values taken together, once, such as when creating or editing
        something (an account, an event), with the change deferred to a submit
        or a Done.
      </li>
      <li>
        For its validation, too: required fields, types, and a server’s errors
        shown on their fields.
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
        Settings that apply at once, each as its own change: use a{' '}
        <a href={publicUrl('list')}>List</a> of controls, without a form or a
        submit.
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
        All props of all parts are on the{' '}
        <a href={publicUrl('form/parts')}>Parts</a> page.
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
        A fieldset is a <code>fieldset</code>, and its legend (the section’s
        header) names the group (its <code>aria-labelledby</code>).
      </li>
      <li>
        Each field names its control, with a label (
        <PartLink
          component="text-field"
          part="TextField.Label"
        />
        ) or the control’s own <code>aria-label</code>.
      </li>
      <li>
        Invalid fields are marked (<code>aria-invalid</code>), with their errors
        tied to them. Submitting focuses the first invalid one.
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
        When it’s submitted (by a button with{' '}
        <code>type=&quot;submit&quot;</code>, or Enter in a text field), it
        validates. If it’s valid, <code>onFormSubmit</code> gets the values by
        name.
      </li>
      <li>
        Each control submits under a field’s name: text fields under their{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />
        ’s, other controls under their{' '}
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
