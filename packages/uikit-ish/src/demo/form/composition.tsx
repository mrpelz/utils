import { FunctionComponent, useId, useState } from 'react';

import {
  Button,
  DatePicker,
  Field,
  Fieldset,
  Form,
  forwardClick,
  List,
  Sheet,
  Slider,
  Stepper,
  Switch,
  TextField,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/** A sign-up: required fields, validated; a server's error, shown. */
const ValidationAndServerErrors: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Component
      center
      inline
      inputGuards
      id="form-composition-validation"
      log={log}
      title="Form: validation and server errors"
    >
      <Form
        errors={errors}
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) => {
          addLog(`submitted: ${JSON.stringify(values)}`);
          // (The server: this address is taken.)
          setErrors(
            values.email === 'taken@example.com'
              ? { email: 'This address is taken.' }
              : {},
          );
        }}
      >
        <List.Root>
          <Fieldset.Root>
            <Fieldset.Legend>Account</Fieldset.Legend>
            <List.Group>
              <TextField.Root
                name="name"
                render={<List.Item />}
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Control
                  required
                  placeholder="Required"
                />
                <TextField.Error match="valueMissing">
                  Enter a name.
                </TextField.Error>
              </TextField.Root>
              <TextField.Root
                name="email"
                render={<List.Item />}
              >
                <TextField.Label>Email</TextField.Label>
                <TextField.Control
                  required
                  placeholder="taken@example.com"
                  type="email"
                />
                <TextField.Error />
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
                <Button.Label>Sign Up</Button.Label>
              </Button.Root>
            </List.Block>
          </List.Section>
        </List.Root>
      </Form>
    </Component>
  );
};

/** A new event in a sheet: Cancel, or Done submitting it. */
const InASheetWithCancelDone: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [open, setOpen] = useState(false);
  const formId = useId();

  return (
    <Component
      center
      inline
      inputGuards
      id="form-composition-sheet"
      log={log}
      title="Form in a sheet with Cancel and Done"
    >
      <Sheet.Root
        open={open}
        onOpenChange={(next: boolean) => setOpen(next)}
      >
        <Sheet.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>New Event</Button.Label>
        </Sheet.Trigger>
        <Sheet.Popup detent="large">
          <Sheet.Header>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Sheet.Close render={<Toolbar.Button />}>
                  <Button.Label>Cancel</Button.Label>
                </Sheet.Close>
              </Toolbar.Leading>
              <Toolbar.Title>
                <Sheet.Title render={<span />}>New Event</Sheet.Title>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  prominent
                  form={formId}
                  type="submit"
                >
                  <Button.Label>Done</Button.Label>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Sheet.Header>
          <Sheet.Content>
            <Form
              id={formId}
              onFormSubmit={(values: Record<string, unknown>) => {
                addLog(`submitted: ${JSON.stringify(values)}`);
                setOpen(false);
              }}
            >
              <List.Root>
                <List.Section>
                  <List.Group>
                    <TextField.Root
                      name="title"
                      render={<List.Item />}
                    >
                      <TextField.Control
                        required
                        aria-label="Title"
                        placeholder="Title"
                      />
                      <TextField.Error match="valueMissing">
                        Enter a title.
                      </TextField.Error>
                    </TextField.Root>
                    <Field.Root
                      name="starts"
                      render={<List.Item />}
                    >
                      <List.Title>Starts</List.Title>
                      <DatePicker.Root
                        defaultValue={new Date(2025, 3, 20, 9, 41)}
                        mode="dateAndTime"
                      />
                    </Field.Root>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Form>
          </Sheet.Content>
        </Sheet.Popup>
      </Sheet.Root>
    </Component>
  );
};

/** A reminder: its date's fieldset enabled by a switch. */
const ASwitchRevealingAFieldset: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [remind, setRemind] = useState(false);

  return (
    <Component
      center
      inline
      inputGuards
      id="form-composition-disclosure"
      log={log}
      title="Form: a switch revealing a fieldset"
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
                name="remind"
                render={<List.Item onClick={forwardClick('[role=switch]')} />}
              >
                <List.Title>Remind Me</List.Title>
                <Switch.Root
                  aria-label="Remind me"
                  checked={remind}
                  onCheckedChange={(checked: boolean) => setRemind(checked)}
                >
                  <Switch.Thumb />
                </Switch.Root>
              </Field.Root>
            </List.Group>
          </List.Section>
          <Fieldset.Root disabled={!remind}>
            <Fieldset.Legend>Reminder</Fieldset.Legend>
            <List.Group>
              <Field.Root
                name="date"
                render={<List.Item />}
              >
                <List.Title>Date</List.Title>
                <DatePicker.Root defaultValue={new Date(2025, 3, 20)} />
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
                <Button.Label>Save</Button.Label>
              </Button.Root>
            </List.Block>
          </List.Section>
        </List.Root>
      </Form>
    </Component>
  );
};

/** An order: a text field, a stepper, a slider, a date, a switch. */
const MixedControls: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      inputGuards
      id="form-composition-mixed"
      log={log}
      title="Form with mixed controls"
    >
      <Form
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root>
          <Fieldset.Root>
            <Fieldset.Legend>Order</Fieldset.Legend>
            <List.Group>
              <TextField.Root
                name="name"
                render={<List.Item />}
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Control placeholder="Name" />
              </TextField.Root>
              <Field.Root
                name="copies"
                render={<List.Item />}
              >
                <List.Title>Copies</List.Title>
                <Stepper.Root
                  defaultValue={1}
                  min={1}
                >
                  <Stepper.Group>
                    <Stepper.Input aria-label="Copies" />
                    <Stepper.Decrement />
                    <Stepper.Increment />
                  </Stepper.Group>
                </Stepper.Root>
              </Field.Root>
              <Field.Root
                name="quality"
                render={<List.Item />}
              >
                <Slider.Root defaultValue={80}>
                  <Slider.Label placement="block-start">Quality</Slider.Label>
                  <Slider.Value placement="block-start" />
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Indicator />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider.Control>
                </Slider.Root>
              </Field.Root>
              <Field.Root
                name="delivery"
                render={<List.Item />}
              >
                <List.Title>Delivery</List.Title>
                <DatePicker.Root defaultValue={new Date(2025, 3, 24)} />
              </Field.Root>
              <Field.Root
                name="gift"
                render={<List.Item onClick={forwardClick('[role=switch]')} />}
              >
                <List.Title>Gift Wrap</List.Title>
                <Switch.Root aria-label="Gift wrap">
                  <Switch.Thumb />
                </Switch.Root>
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
  ['validation-and-server-errors', 'Validation and server errors'],
  ['in-a-sheet-with-cancel-and-done', 'In a sheet with Cancel and Done'],
  ['a-switch-revealing-a-fieldset', 'A switch revealing a fieldset'],
  ['mixed-controls', 'Mixed controls'],
];

/** `/form/composition`: forms validating, in sheets, revealing, mixed. */
export const FormComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="validation-and-server-errors"
      level={2}
    >
      Validation and server errors
    </Heading>
    <ul>
      <li>
        Fields validate on submit (then on change): <code>required</code>, a{' '}
        <code>type</code>; their errors in{' '}
        <PartLink
          component="text-field"
          part="TextField.Error"
        />
        .
      </li>
      <li>
        A server’s errors after submitting: <code>errors</code>, by the fields’
        names (here: <code>taken@example.com</code> is taken).
      </li>
    </ul>
    <ValidationAndServerErrors />

    <Heading
      id="in-a-sheet-with-cancel-and-done"
      level={2}
    >
      In a sheet with Cancel and Done
    </Heading>
    <ul>
      <li>
        Creating something defers to Done (the guide’s{' '}
        <GuideLink to="commit-model">commit model</GuideLink>, §8.2): Cancel
        closes the <a href="sheet">Sheet</a>, Done submits the form.
      </li>
      <li>
        Done is in the sheet’s toolbar, outside the form: a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        of <code>type=&quot;submit&quot;</code> with the form’s id (
        <code>form</code>). Submitted (and valid), the app closes the sheet.
      </li>
    </ul>
    <InASheetWithCancelDone />

    <Heading
      id="a-switch-revealing-a-fieldset"
      level={2}
    >
      A switch revealing a fieldset
    </Heading>
    <ul>
      <li>
        Progressive disclosure, as the guide’s form example (a reminder’s date,{' '}
        <GuideLink to="section-8-2">§8.2</GuideLink>): a{' '}
        <a href="switch">Switch</a> enables the fieldset below it (
        <PartLink
          component="form"
          part="Fieldset.Root"
        />
        ’s <code>disabled</code>).
      </li>
      <li>Disabled, its fields can’t be changed.</li>
    </ul>
    <ASwitchRevealingAFieldset />

    <Heading
      id="mixed-controls"
      level={2}
    >
      Mixed controls
    </Heading>
    <ul>
      <li>
        Each value named by its field: text fields by{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />
        ’s <code>name</code>, other controls by{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>
        ’s, rendered as their rows.
      </li>
      <li>
        Submitted as: a string (text), a number (<a href="stepper">Stepper</a>,{' '}
        <a href="slider">Slider</a>), an ISO date (
        <a href="date-picker">Date picker</a>), a boolean (
        <a href="switch">Switch</a>).
      </li>
    </ul>
    <MixedControls />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const formCompositionDemos = [
  ValidationAndServerErrors,
  InASheetWithCancelDone,
  ASwitchRevealingAFieldset,
  MixedControls,
];
