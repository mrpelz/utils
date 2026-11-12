import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Field,
  Fieldset,
  Form,
  List,
  Stepper,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

// A row's code (as Guests' in the list below).
/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const listRowCode = `const [guests, setGuests] = useState(2);

<List.Item>
  <List.Content>
    <List.Title>Guests</List.Title>
  </List.Content>
  <List.Trailing>
    <List.Detail>{guests}</List.Detail>
  </List.Trailing>
  <List.Trailing>
    <Stepper.Root
      max={8}
      min={1}
      value={guests}
      onValueChange={(value) => setGuests(value ?? 1)}
    >
      <Stepper.Group>
        <Stepper.Input aria-label="Guests" />
        <Stepper.Decrement />
        <Stepper.Increment />
      </Stepper.Group>
    </Stepper.Root>
  </List.Trailing>
</List.Item>`;
const valueShownCode = `const [zoom, setZoom] = useState(1);
const percent = new Intl.NumberFormat(undefined, { style: 'percent' });

{/* Its value is the app's to show. */}
<output>{zoom === null ? '–' : percent.format(zoom)}</output>
<Stepper.Root
  format={{ style: 'percent' }}
  max={2}
  min={0.5}
  step={0.25}
  value={zoom}
  onValueChange={setZoom}
>
  <Stepper.Group>
    <Stepper.Input aria-label="Zoom" />
    <Stepper.Decrement />
    <Stepper.Increment />
  </Stepper.Group>
</Stepper.Root>`;

const formCode = `const order = (values) => console.log(values);
const [quantity, setQuantity] = useState(1);

<Form onFormSubmit={order}>
  <List.Root>
    <Fieldset.Root>
      <Fieldset.Legend>
        <List.Title>Order</List.Title>
      </Fieldset.Legend>
      <List.Group>
        {/* Submitted by the field's name. */}
        <Field.Root
          name="quantity"
          render={<List.Item />}
        >
          <List.Content>
            <List.Title>Quantity</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Detail>{quantity ?? '–'}</List.Detail>
          </List.Trailing>
          <List.Trailing>
            <Stepper.Root
              required
              max={9}
              min={1}
              value={quantity}
              onValueChange={setQuantity}
            >
              …
            </Stepper.Root>
          </List.Trailing>
        </Field.Root>
      </List.Group>
    </Fieldset.Root>
    …
  </List.Root>
</Form>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A booking's rows: each count shown in its row's detail. */
const InListRows: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(1);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Detail': ['className'],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': ['max', 'min', 'onValueChange', 'value'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('stepper-composition-list') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="stepper-composition-list"
      log={log}
      state={[partState]}
      title="Stepper in list rows"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Guests</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail
                  {...partProps['List.Detail']}
                  className="stepper-demo-value"
                >
                  {guests}
                </List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <Stepper.Root
                  {...partProps['Stepper.Root']}
                  max={8}
                  min={1}
                  value={guests}
                  onValueChange={(value: number | null) => {
                    addLog(`guests: ${String(value)}`);
                    setGuests(value ?? 1);
                  }}
                >
                  <Stepper.Group {...partProps['Stepper.Group']}>
                    <Stepper.Input
                      {...partProps['Stepper.Input']}
                      aria-label="Guests"
                    />
                    <Stepper.Decrement {...partProps['Stepper.Decrement']} />
                    <Stepper.Increment {...partProps['Stepper.Increment']} />
                  </Stepper.Group>
                </Stepper.Root>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Nights</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail
                  {...partProps['List.Detail']}
                  className="stepper-demo-value"
                >
                  {nights}
                </List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <Stepper.Root
                  {...partProps['Stepper.Root']}
                  max={14}
                  min={1}
                  value={nights}
                  onValueChange={(value: number | null) => {
                    addLog(`nights: ${String(value)}`);
                    setNights(value ?? 1);
                  }}
                >
                  <Stepper.Group {...partProps['Stepper.Group']}>
                    <Stepper.Input
                      {...partProps['Stepper.Input']}
                      aria-label="Nights"
                    />
                    <Stepper.Decrement {...partProps['Stepper.Decrement']} />
                    <Stepper.Increment {...partProps['Stepper.Increment']} />
                  </Stepper.Group>
                </Stepper.Root>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A zoom: its value, formatted, beside the stepper. */
const WithItsValueShown: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [zoom, setZoom] = useState<number | null>(1);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': [
              'format',
              'max',
              'min',
              'onValueChange',
              'step',
              'value',
            ],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('stepper-composition-value') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="stepper-composition-value"
      log={log}
      state={[partState]}
      title="Stepper with its value shown"
    >
      <div className="stepper-demo-row">
        <output>
          {zoom === null
            ? '–'
            : new Intl.NumberFormat(undefined, { style: 'percent' }).format(
                zoom,
              )}
        </output>
        <Stepper.Root
          {...partProps['Stepper.Root']}
          format={{ style: 'percent' }}
          max={2}
          min={0.5}
          step={0.25}
          value={zoom}
          onValueChange={(value: number | null) => {
            addLog(`zoom: ${String(value)}`);
            setZoom(value);
          }}
        >
          <Stepper.Group {...partProps['Stepper.Group']}>
            <Stepper.Input
              {...partProps['Stepper.Input']}
              aria-label="Zoom"
            />
            <Stepper.Decrement {...partProps['Stepper.Decrement']} />
            <Stepper.Increment {...partProps['Stepper.Increment']} />
          </Stepper.Group>
        </Stepper.Root>
      </div>
    </Component>
  );
};

/** An order: its quantity submitted by name, as a native number input. */
const InForms: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [quantity, setQuantity] = useState<number | null>(1);

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
            'Stepper.Root': [
              'max',
              'min',
              'onValueChange',
              'required',
              'value',
            ],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('stepper-composition-form') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="stepper-composition-form"
      log={log}
      state={[partState]}
      title="Stepper in a form"
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
                    className="stepper-demo-value"
                  >
                    {quantity ?? '–'}
                  </List.Detail>
                </List.Trailing>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Stepper.Root
                    {...partProps['Stepper.Root']}
                    required
                    max={9}
                    min={1}
                    value={quantity}
                    onValueChange={(value: number | null) => setQuantity(value)}
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-list-rows', 'In list rows'],
  ['with-its-value-shown', 'With its value shown'],
  ['in-forms', 'In forms'],
];

/** `/stepper/composition`: steppers with rows, values, forms. */
export const StepperComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="in-list-rows"
      level={2}
    >
      In list rows
    </Heading>
    <ul>
      <li>
        Usually, it sits in the trailing slot of{' '}
        <a href={publicUrl('list')}>List</a> rows, with the value in the row’s
        detail (the app shows it, since the stepper shows none).
      </li>
      <li>
        It’s controlled (<code>value</code>, <code>onValueChange</code>), so the
        row shows what it holds.
      </li>
      <li>
        <code>min</code> and <code>max</code> bound it, and a half is disabled
        at its end.
      </li>
      <li>
        It’s also on the list’s{' '}
        <a href={publicUrl('list/composition#a-settings-page')}>
          settings page
        </a>{' '}
        (Auto-Lock).
      </li>
      <li>
        <strong>Library:</strong> the stepper (
        <PartLink
          component="stepper"
          part="Stepper.Root"
        />
        , with its halves and input) in the row’s trailing slot, bound by{' '}
        <code>min</code> and <code>max</code>.
      </li>
      <li>
        <strong>Demo:</strong> the guests and nights (the app’s state), shown in
        the rows’ details.
      </li>
    </ul>
    <CodeView code={listRowCode} />
    <InListRows />

    <Heading
      id="with-its-value-shown"
      level={2}
    >
      With its value shown
    </Heading>
    <ul>
      <li>
        The app shows its value next to it (here in an <code>{'<output>'}</code>
        ), formatted as the app likes.
      </li>
      <li>
        <code>format</code> formats its input’s text, which assistive technology
        reads (“125%”). Using the same format for both keeps them in step.
      </li>
      <li>
        Steps don’t have to be whole: here, <code>step</code> is 0.25, from 50%
        to 200%.
      </li>
      <li>
        <strong>Library:</strong> <code>step</code> and <code>format</code> (the
        input’s text, read by assistive technology).
      </li>
      <li>
        <strong>Demo:</strong> the zoom (the app’s state), and showing it next
        to the stepper.
      </li>
    </ul>
    <CodeView code={valueShownCode} />
    <WithItsValueShown />

    <Heading
      id="in-forms"
      level={2}
    >
      In forms
    </Heading>
    <ul>
      <li>
        In a <a href={publicUrl('form')}>Form</a>, it goes in Base UI’s{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        (with its <code>name</code>, rendered as the row,{' '}
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        ). Its value is among the form’s submitted values.
      </li>
      <li>
        With <code>required</code>, it must hold a value for the form to submit.
      </li>
      <li>
        <strong>Library:</strong> the stepper’s value in Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />{' '}
        under its field’s name, and <code>required</code>.
      </li>
      <li>
        <strong>Demo:</strong> the quantity (the app’s state), and logging
        what’s submitted.
      </li>
    </ul>
    <CodeView code={formCode} />
    <InForms />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const stepperCompositionDemos = [InListRows, WithItsValueShown, InForms];
