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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { textFieldRootRows } from '../text-field/docs.js';
import { fieldsetLegendRows, fieldsetRootRows, formRows } from './docs.js';
import {
  getPropOptionsForm,
  propOptionsField,
  propOptionsFieldset,
  propOptionsLegend,
} from './props.js';

/** `Form`, outlined, with its props: a name and a quantity, submitted. */
const FormPart: FunctionComponent = () => {
  const id = 'form-parts-form';
  const [log, addLog] = useLog();
  const [quantity, setQuantity] = useState<number | null>(1);
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsForm(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Form' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Form"
    >
      <Form
        key={elementKey}
        {...props}
        style={{ width: 'min(402px, 100%)', ...props.style }}
      >
        <List.Root>
          <Fieldset.Root>
            <Fieldset.Legend>
              <List.Title>Order</List.Title>
            </Fieldset.Legend>
            <List.Group>
              <TextField.Root
                name="email"
                render={<List.Item />}
              >
                <TextField.Control
                  required
                  aria-label="Email"
                  placeholder="Email"
                  type="email"
                />
                <TextField.Error />
              </TextField.Root>
              <Field.Root
                name="quantity"
                render={<List.Item />}
              >
                <List.Title>Quantity</List.Title>
                <List.Detail className="form-demo-value">
                  {quantity ?? '–'}
                </List.Detail>
                <Stepper.Root
                  min={1}
                  value={quantity}
                  onValueChange={(next: number | null) => setQuantity(next)}
                >
                  <Stepper.Group>
                    <Stepper.Input aria-label="Quantity" />
                    <Stepper.Decrement />
                    <Stepper.Increment />
                  </Stepper.Group>
                </Stepper.Root>
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

/** `Fieldset.Root`, outlined, with its props. */
const FieldsetRootPart: FunctionComponent = () => {
  const id = 'form-parts-fieldset-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsFieldset, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Fieldset.Root',
  });

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Fieldset.Root"
    >
      <Form
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root>
          <Fieldset.Root {...props}>
            <Fieldset.Legend>
              <List.Title>Contact</List.Title>
            </Fieldset.Legend>
            <List.Group>
              <TextField.Root
                name="name"
                render={<List.Item />}
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Control placeholder="Name" />
              </TextField.Root>
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
                <Button.Label>Save</Button.Label>
              </Button.Root>
            </List.Block>
          </List.Section>
        </List.Root>
      </Form>
    </Component>
  );
};

/** `Fieldset.Legend`, outlined, with its props. */
const FieldsetLegendPart: FunctionComponent = () => {
  const id = 'form-parts-fieldset-legend';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsLegend, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Fieldset.Legend',
  });

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Fieldset.Legend"
    >
      <Form style={{ width: 'min(402px, 100%)' }}>
        <List.Root>
          <Fieldset.Root>
            <Fieldset.Legend {...props}>
              <List.Title>Contact</List.Title>
            </Fieldset.Legend>
            <List.Group>
              <TextField.Root
                name="name"
                render={<List.Item />}
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Control placeholder="Name" />
              </TextField.Root>
            </List.Group>
          </Fieldset.Root>
        </List.Root>
      </Form>
    </Component>
  );
};

/** `Field.Root` around a stepper, outlined, with its props. */
const FieldPart: FunctionComponent = () => {
  const id = 'form-parts-field';
  const [log, addLog] = useLog();
  const [quantity, setQuantity] = useState<number | null>(1);
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsField, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Field.Root',
  });

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Field"
    >
      <Form
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root>
          <List.Section>
            <List.Group>
              <Field.Root
                key={elementKey}
                {...props}
              >
                <List.Title>Quantity</List.Title>
                <List.Detail className="form-demo-value">
                  {quantity ?? '–'}
                </List.Detail>
                <Stepper.Root
                  min={1}
                  value={quantity}
                  onValueChange={(next: number | null) => setQuantity(next)}
                >
                  <Stepper.Group>
                    <Stepper.Input aria-label="Quantity" />
                    <Stepper.Decrement />
                    <Stepper.Increment />
                  </Stepper.Group>
                </Stepper.Root>
              </Field.Root>
            </List.Group>
          </List.Section>
          <List.Section>
            <List.Block style={{ paddingInline: 0 }}>
              <Button.Root
                fill
                size="large"
                type="submit"
                variant="bordered-prominent"
              >
                <Button.Label>Submit</Button.Label>
              </Button.Root>
            </List.Block>
          </List.Section>
        </List.Root>
      </Form>
    </Component>
  );
};

/** `/form/parts`: the form, its fieldsets and their legends, fields. */
export const FormParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        <PartLink
          component="form"
          part="Form"
        />
        : Base UI’s, collecting and validating its fields.
      </li>
      <li>
        Fieldset: a list section of fields, its legend the section’s header.
      </li>
      <li>
        Field: Base UI’s, a value by its name (text fields are{' '}
        <a href="text-field">Text field</a>s).
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="form"
          part="Form"
        />
        <ul>
          <li>
            <PartLink
              component="form"
              part="Fieldset.Root"
            />{' '}
            (optional)
            <ul>
              <li>
                <PartLink
                  component="form"
                  part="Fieldset.Legend"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="form"
                  part="Field"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="form"
      level={2}
    >
      <code>Form</code>
    </Heading>
    <ul>
      <li>
        Base UI’s form, as it is: its fields’ values by name to{' '}
        <code>onFormSubmit</code>, validated (<code>validationMode</code>),
        external <code>errors</code> shown on them.
      </li>
      <li>
        Laid out as a <a href="list">List</a>: fieldsets its sections, fields
        its rows; a <a href="button">Button</a> of{' '}
        <code>type=&quot;submit&quot;</code> submits it.
      </li>
      <li>
        Renders a <code>form</code>.
      </li>
    </ul>
    <FormPart />
    <h3>Props</h3>
    <PropsTable rows={formRows} />

    <Heading
      id="fieldset-root"
      level={2}
    >
      <code>Fieldset.Root</code>
    </Heading>
    <ul>
      <li>
        A group of fields (Base UI’s fieldset), rendered as a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        : <code>disabled</code> disables them all.
      </li>
      <li>
        Renders a <code>fieldset</code> (its browser styles reset).
      </li>
    </ul>
    <FieldsetRootPart />
    <h3>Props</h3>
    <PropsTable rows={fieldsetRootRows} />

    <Heading
      id="fieldset-legend"
      level={2}
    >
      <code>Fieldset.Legend</code>
    </Heading>
    <ul>
      <li>
        The fieldset’s legend (Base UI’s): it names the fieldset (Base UI sets
        the fieldset’s <code>aria-labelledby</code> to it; an accessible name,
        not a form field’s name).
      </li>
      <li>
        Rendered as the section’s{' '}
        <PartLink
          component="list"
          part="List.Header"
        />
        , its children the header’s parts, as any header’s (a{' '}
        <PartLink
          component="list"
          part="List.Title"
        />
        , …); another header by <code>render</code> (e.g.{' '}
        <code>{'<List.Header prominence="nested" />'}</code>).
      </li>
    </ul>
    <FieldsetLegendPart />
    <h3>Props</h3>
    <PropsTable rows={fieldsetLegendRows} />

    <Heading
      id="field"
      level={2}
    >
      <code>Field</code>
    </Heading>
    <ul>
      <li>
        Base UI’s field, re-exported as it is (see{' '}
        <a
          href="https://base-ui.com/react/components/field"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Field
        </a>
        ):{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        names a value in the form, its control’s.
      </li>
      <li>
        Around a control that isn’t a text field (a{' '}
        <a href="stepper">Stepper</a>, a <a href="slider">Slider</a>, a{' '}
        <a href="date-picker">Date picker</a>), rendered as its row (
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        ).
      </li>
      <li>
        Text fields are{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />
        s: Base UI’s field, styled; its other parts (
        <PartLink
          component="form"
          part="Field"
        >
          Field.Label
        </PartLink>
        ,{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Control
        </PartLink>
        ,{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Error
        </PartLink>
        , …) as <a href="text-field/parts">Text field’s</a>.
      </li>
    </ul>
    <FieldPart />
    <h3>
      <code>Field.Root</code>’s props
    </h3>
    <PropsTable rows={textFieldRootRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const formPartsDemos = [
  FormPart,
  FieldsetRootPart,
  FieldsetLegendPart,
  FieldPart,
];
