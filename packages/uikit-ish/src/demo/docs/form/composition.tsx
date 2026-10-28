import '../sheet/style.css';
import './style.css';

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
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/** A sign-up: required fields, validated; a server's error, shown. */
const ValidationAndServerErrors: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
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
            <Fieldset.Legend>
              <List.Title>Account</List.Title>
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
              <TextField.Root
                name="email"
                render={<List.Item />}
              >
                <List.Content>
                  <TextField.Label>Email</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    required
                    placeholder="taken@example.com"
                    type="email"
                  />
                </List.Trailing>
                <List.Below>
                  <TextField.Error />
                </List.Below>
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
  const [isOpen, setIsOpen] = useState(false);
  const formId = useId();

  return (
    <Component
      hasInputGuards
      isInline
      id="form-composition-sheet"
      log={log}
      screen="centered"
      stage="phone"
      title="Form in a sheet with Cancel and Done"
    >
      <Viewport.Content>
        <Sheet.Root
          open={isOpen}
          onOpenChange={(isNextOpen: boolean) => setIsOpen(isNextOpen)}
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
          <Sheet.Popup
            compact
            background="grouped"
            detent="large"
          >
            <Sheet.Header>
              <Sheet.Grabber />
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
                  setIsOpen(false);
                }}
              >
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <TextField.Root
                        name="title"
                        render={<List.Item />}
                      >
                        <List.Span>
                          <TextField.Control
                            required
                            aria-label="Title"
                            placeholder="Title"
                          />
                        </List.Span>
                        <List.Below>
                          <TextField.Error match="valueMissing">
                            Enter a title.
                          </TextField.Error>
                        </List.Below>
                      </TextField.Root>
                      <Field.Root
                        name="starts"
                        render={<List.Item />}
                      >
                        <List.Content>
                          <List.Title>Starts</List.Title>
                        </List.Content>
                        <List.Trailing>
                          <DatePicker.Root
                            defaultValue={new Date(2025, 3, 20, 9, 41)}
                            mode="dateAndTime"
                            popoverAlign="end"
                          />
                        </List.Trailing>
                      </Field.Root>
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Form>
              <Viewport.Padding edge="block-end" />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A reminder: its date's fieldset enabled by a switch. */
const ASwitchRevealingAFieldset: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isReminding, setIsReminding] = useState(false);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
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
                <List.Content>
                  <List.Title>Remind Me</List.Title>
                </List.Content>
                <List.Trailing>
                  <Switch.Root
                    aria-label="Remind me"
                    checked={isReminding}
                    onCheckedChange={(isChecked: boolean) =>
                      setIsReminding(isChecked)
                    }
                  >
                    <Switch.Thumb />
                  </Switch.Root>
                </List.Trailing>
              </Field.Root>
            </List.Group>
          </List.Section>
          <Fieldset.Root disabled={!isReminding}>
            <Fieldset.Legend>
              <List.Title>Reminder</List.Title>
            </Fieldset.Legend>
            <List.Group>
              <Field.Root
                name="date"
                render={<List.Item />}
              >
                <List.Content>
                  <List.Title>Date</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root
                    defaultValue={new Date(2025, 3, 20)}
                    popoverAlign="end"
                  />
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
  const [copies, setCopies] = useState<number | null>(1);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
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
                  <TextField.Control placeholder="Name" />
                </List.Trailing>
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
              <Field.Root
                name="quality"
                render={<List.Item />}
              >
                <List.Span>
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
                </List.Span>
              </Field.Root>
              <Field.Root
                name="delivery"
                render={<List.Item />}
              >
                <List.Content>
                  <List.Title>Delivery</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root
                    defaultValue={new Date(2025, 3, 24)}
                    popoverAlign="end"
                  />
                </List.Trailing>
              </Field.Root>
              <Field.Root
                name="gift"
                render={<List.Item onClick={forwardClick('[role=switch]')} />}
              >
                <List.Content>
                  <List.Title>Gift Wrap</List.Title>
                </List.Content>
                <List.Trailing>
                  <Switch.Root aria-label="Gift wrap">
                    <Switch.Thumb />
                  </Switch.Root>
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
      <li>
        <strong>Library:</strong> Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />{' '}
        (validating on submit, then on change; its <code>errors</code>), the
        text fields and their errors (
        <PartLink
          component="text-field"
          part="TextField.Error"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> checking the email against the “server”
        (taken@example.com), holding its errors and logging what’s submitted.
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
      <li>
        <strong>Library:</strong> the sheet (
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />
        ,{' '}
        <PartLink
          component="sheet"
          part="Sheet.Close"
        />
        ), the toolbar’s submit button outside the form (<code>form</code>), the
        text field and the date picker.
      </li>
      <li>
        <strong>Demo:</strong> the open state, the form’s id, and closing the
        sheet once submitted.
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
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        and the fieldset’s <code>disabled</code>, with Base UI’s fields
        submitting by name.
      </li>
      <li>
        <strong>Demo:</strong> holding whether to remind and disabling the
        fieldset by it.
      </li>
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
      <li>
        <strong>Library:</strong> each control’s value in the form (text, a
        number, an ISO date, a boolean) by its field’s name.
      </li>
      <li>
        <strong>Demo:</strong> the fields, the copies count (the app’s state)
        and logging what’s submitted.
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
