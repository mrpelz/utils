import './style.css';

import { FunctionComponent, useState } from 'react';

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
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

// A row's code (as Guests' in the list below).
/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const listRowCode = `const [guests, setGuests] = useState(2);

<List.Item>
  <List.Title>Guests</List.Title>
  <List.Detail>{guests}</List.Detail>
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
</List.Item>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A booking's rows: each count shown in its row's detail. */
const InListRows: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(1);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="stepper-composition-list"
      log={log}
      title="Stepper in list rows"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Title>Guests</List.Title>
              <List.Detail className="stepper-demo-value">{guests}</List.Detail>
              <Stepper.Root
                max={8}
                min={1}
                value={guests}
                onValueChange={(value: number | null) => {
                  addLog(`guests: ${String(value)}`);
                  setGuests(value ?? 1);
                }}
              >
                <Stepper.Group>
                  <Stepper.Input aria-label="Guests" />
                  <Stepper.Decrement />
                  <Stepper.Increment />
                </Stepper.Group>
              </Stepper.Root>
            </List.Item>
            <List.Item>
              <List.Title>Nights</List.Title>
              <List.Detail className="stepper-demo-value">{nights}</List.Detail>
              <Stepper.Root
                max={14}
                min={1}
                value={nights}
                onValueChange={(value: number | null) => {
                  addLog(`nights: ${String(value)}`);
                  setNights(value ?? 1);
                }}
              >
                <Stepper.Group>
                  <Stepper.Input aria-label="Nights" />
                  <Stepper.Decrement />
                  <Stepper.Increment />
                </Stepper.Group>
              </Stepper.Root>
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

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="stepper-composition-value"
      log={log}
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
          <Stepper.Group>
            <Stepper.Input aria-label="Zoom" />
            <Stepper.Decrement />
            <Stepper.Increment />
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

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="stepper-composition-form"
      log={log}
      title="Stepper in a form"
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
              <Field.Root
                name="quantity"
                render={<List.Item />}
              >
                <List.Title>Quantity</List.Title>
                <List.Detail className="stepper-demo-value">
                  {quantity ?? '–'}
                </List.Detail>
                <Stepper.Root
                  required
                  max={9}
                  min={1}
                  value={quantity}
                  onValueChange={(value: number | null) => setQuantity(value)}
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
        On iOS: in the trailing slot of <a href="list">List</a> rows, the value
        in the row’s detail (the app’s: the stepper shows none).
      </li>
      <li>
        Controlled (<code>value</code>, <code>onValueChange</code>): the row
        shows what it holds.
      </li>
      <li>
        <code>min</code> and <code>max</code> bound it; a half disables at its
        end.
      </li>
      <li>
        Also in a settings page: the list’s{' '}
        <a href="list/composition#a-settings-page">settings page</a>{' '}
        (Auto-Lock).
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
        Its value is the app’s to show, beside it (here an{' '}
        <code>{'<output>'}</code>), formatted as the app likes.
      </li>
      <li>
        <code>format</code> formats its input’s text, which assistive tech reads
        (“125%”): the same format keeps both in step.
      </li>
      <li>
        Steps needn’t be whole: <code>step</code> 0.25, from 50% to 200%.
      </li>
    </ul>
    <WithItsValueShown />

    <Heading
      id="in-forms"
      level={2}
    >
      In forms
    </Heading>
    <ul>
      <li>
        In a <a href="form">Form</a>, in Base UI’s{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        (its <code>name</code>; the row:{' '}
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        ): its value is among the form’s submitted values.
      </li>
      <li>
        <code>required</code>: it must hold a value to submit.
      </li>
    </ul>
    <InForms />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const stepperCompositionDemos = [InListRows, WithItsValueShown, InForms];
