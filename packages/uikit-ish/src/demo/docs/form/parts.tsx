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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
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
            'List.Span': [],
            'List.Title': [],
            'List.Trailing': [],
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': ['min', 'onValueChange', 'value'],
            'TextField.Control': [
              'aria-label',
              'placeholder',
              'required',
              'type',
            ],
            'TextField.Error': [],
            'TextField.Root': ['name', 'render'],
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
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Form"
    >
      <Form
        key={elementKey}
        {...props}
        style={{ width: 'min(402px, 100%)', ...props.style }}
      >
        <List.Root {...partProps['List.Root']}>
          <Fieldset.Root {...partProps['Fieldset.Root']}>
            <Fieldset.Legend {...partProps['Fieldset.Legend']}>
              <List.Title {...partProps['List.Title']}>Order</List.Title>
            </Fieldset.Legend>
            <List.Group {...partProps['List.Group']}>
              <TextField.Root
                {...partProps['TextField.Root']}
                name="email"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Span {...partProps['List.Span']}>
                  <TextField.Control
                    {...partProps['TextField.Control']}
                    required
                    aria-label="Email"
                    placeholder="Email"
                    type="email"
                  />
                </List.Span>
                <List.Below {...partProps['List.Below']}>
                  <TextField.Error {...partProps['TextField.Error']} />
                </List.Below>
              </TextField.Root>
              <Field.Root
                {...partProps['Field.Root']}
                name="quantity"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Quantity</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail
                    {...partProps['List.Detail']}
                    className="form-demo-value"
                  >
                    {quantity ?? '–'}
                  </List.Detail>
                </List.Trailing>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Stepper.Root
                    {...partProps['Stepper.Root']}
                    min={1}
                    value={quantity}
                    onValueChange={(next: number | null) => setQuantity(next)}
                  >
                    <Stepper.Group {...partProps['Stepper.Group']}>
                      <Stepper.Input
                        {...partProps['Stepper.Input']}
                        aria-label="Quantity"
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['onFormSubmit', 'style'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'Fieldset.Legend': [],
            'List.Block': ['style'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'TextField.Control': ['placeholder'],
            'TextField.Label': [],
            'TextField.Root': ['name', 'render'],
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
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Fieldset.Root"
    >
      <Form
        {...partProps.Form}
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root {...partProps['List.Root']}>
          <Fieldset.Root {...props}>
            <Fieldset.Legend {...partProps['Fieldset.Legend']}>
              <List.Title {...partProps['List.Title']}>Contact</List.Title>
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
                    placeholder="Name"
                  />
                </List.Trailing>
              </TextField.Root>
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
                <Button.Label {...partProps['Button.Label']}>Save</Button.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Form: ['style'],
          'Fieldset.Root': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Title': [],
          'List.Trailing': [],
          'TextField.Control': ['placeholder'],
          'TextField.Label': [],
          'TextField.Root': ['name', 'render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Fieldset.Legend"
    >
      <Form
        {...partProps.Form}
        style={{ width: 'min(402px, 100%)' }}
      >
        <List.Root {...partProps['List.Root']}>
          <Fieldset.Root {...partProps['Fieldset.Root']}>
            <Fieldset.Legend {...props}>
              <List.Title {...partProps['List.Title']}>Contact</List.Title>
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
                    placeholder="Name"
                  />
                </List.Trailing>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['onFormSubmit', 'style'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'List.Block': ['style'],
            'List.Content': [],
            'List.Detail': ['className'],
            'List.Group': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': ['min', 'onValueChange', 'value'],
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
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Field"
    >
      <Form
        {...partProps.Form}
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <Field.Root
                key={elementKey}
                {...props}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Quantity</List.Title>
                </List.Content>
                <List.Detail
                  {...partProps['List.Detail']}
                  className="form-demo-value"
                >
                  {quantity ?? '–'}
                </List.Detail>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Stepper.Root
                    {...partProps['Stepper.Root']}
                    min={1}
                    value={quantity}
                    onValueChange={(next: number | null) => setQuantity(next)}
                  >
                    <Stepper.Group {...partProps['Stepper.Group']}>
                      <Stepper.Input
                        {...partProps['Stepper.Input']}
                        aria-label="Quantity"
                      />
                      <Stepper.Decrement {...partProps['Stepper.Decrement']} />
                      <Stepper.Increment {...partProps['Stepper.Increment']} />
                    </Stepper.Group>
                  </Stepper.Root>
                </List.Trailing>
              </Field.Root>
            </List.Group>
          </List.Section>
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
                  Submit
                </Button.Label>
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
        : Base UI’s form, which collects and validates its fields.
      </li>
      <li>
        Fieldset: a list section of fields, with the section’s header as its
        legend.
      </li>
      <li>
        Field: Base UI’s field, a value under its name (text fields are{' '}
        <a href={publicUrl('text-field')}>Text Field</a>s).
      </li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="form"
          part="Form"
        />
        <ul>
          <li className="demo-tree-context">
            <PartLink
              component="list"
              part="List.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="form"
                  part="Fieldset.Root"
                />{' '}
                (optional; rendering a{' '}
                <PartLink
                  component="list"
                  part="List.Section"
                />
                )
                <ul>
                  <li>
                    <PartLink
                      component="form"
                      part="Fieldset.Legend"
                    />{' '}
                    (optional; rendering a{' '}
                    <PartLink
                      component="list"
                      part="List.Header"
                    />
                    )
                  </li>
                  <li className="demo-tree-context">
                    <PartLink
                      component="list"
                      part="List.Group"
                    />
                    <ul>
                      <li className="demo-tree-context">
                        <PartLink
                          component="text-field"
                          part="TextField.Root"
                        />
                        <span>s, for text fields</span>
                      </li>
                      <li>
                        <PartLink
                          component="form"
                          part="Field"
                        >
                          Field.Root
                        </PartLink>{' '}
                        (rendering a{' '}
                        <PartLink
                          component="list"
                          part="List.Item"
                        />
                        ), around other controls
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="list"
                  part="List.Section"
                />{' '}
                <span>→</span>{' '}
                <PartLink
                  component="list"
                  part="List.Block"
                />{' '}
                <span>→</span>{' '}
                <PartLink
                  component="button"
                  part="Button.Root"
                />{' '}
                <span>(</span>
                <code>type=&quot;submit&quot;</code>
                <span>)</span>
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
        Base UI’s form, as it is. It passes its fields’ values by name to{' '}
        <code>onFormSubmit</code>, validates them (<code>validationMode</code>),
        and shows external <code>errors</code> on them.
      </li>
      <li>
        It’s laid out as a <a href={publicUrl('list')}>List</a>, with fieldsets
        as its sections and fields as its rows. A{' '}
        <a href={publicUrl('button')}>Button</a> with{' '}
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
        . <code>disabled</code> disables them all.
      </li>
      <li>
        Renders a <code>fieldset</code>, with its browser styles reset.
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
        The fieldset’s legend (Base UI’s), which names the fieldset. Base UI
        sets the fieldset’s <code>aria-labelledby</code> to it. It’s an
        accessible name, not a form field’s name.
      </li>
      <li>
        It’s rendered as the section’s{' '}
        <PartLink
          component="list"
          part="List.Header"
        />
        , and its children are the header’s parts, as in any header (a{' '}
        <PartLink
          component="list"
          part="List.Title"
        />
        , and so on). Render another header with <code>render</code> (for
        example <code>{'<List.Header prominence="nested" />'}</code>).
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
        ).{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        names a value in the form: its control’s.
      </li>
      <li>
        Put it around a control that isn’t a text field (a{' '}
        <a href={publicUrl('stepper')}>Stepper</a>, a{' '}
        <a href={publicUrl('slider')}>Slider</a>, a{' '}
        <a href={publicUrl('date-picker')}>Date Picker</a>), rendered as its row
        (
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
        s, which are Base UI’s field with styles. Its other parts (
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
        </PartLink>{' '}
        and so on) work as the{' '}
        <a href={publicUrl('text-field/parts')}>Text Field</a>’s do.
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
