import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useId, useMemo, useState } from 'react';

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
  useCreateDatePickerHandle,
  Viewport,
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

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const validationCode = `const [errors, setErrors] = useState({});

<Form
  errors={errors}
  onFormSubmit={(values) => {
    // The server: this address is taken.
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
            <TextField.Error match="valueMissing">Enter a name.</TextField.Error>
          </List.Below>
        </TextField.Root>
        <TextField.Root
          name="email"
          render={<List.Item />}
        >
          …
          <TextField.Control
            required
            type="email"
          />
          …
          {/* The browser's message, or the server's (errors.email). */}
          <List.Below>
            <TextField.Error />
          </List.Below>
        </TextField.Root>
      </List.Group>
    </Fieldset.Root>
    <List.Section>
      <List.Block>
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
</Form>`;

const sheetCode = `const [isOpen, setIsOpen] = useState(false);
const formId = useId();
const starts = useCreateDatePickerHandle();

<Sheet.Root
  open={isOpen}
  onOpenChange={setIsOpen}
>
  <Sheet.Trigger render={<Button.Root />}>…</Sheet.Trigger>
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
          {/* Outside the form: it submits it by its id. */}
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
      <Viewport.Padding edge="block-start" />
      <Form
        id={formId}
        onFormSubmit={() => setIsOpen(false)}
      >
        <List.Root>
          <List.Section>
            <List.Group>
              <TextField.Root
                name="title"
                render={<List.Item />}
              >…</TextField.Root>
              <Field.Root
                name="starts"
                render={<List.Item />}
              >
                <List.Content>
                  <List.Title>Starts</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root
                    handle={starts}
                    mode="dateAndTime"
                  />
                </List.Trailing>
              </Field.Root>
              {/* Its pickers in a row below, not in a popover. */}
              <DatePicker.Expandable handle={starts} />
            </List.Group>
          </List.Section>
        </List.Root>
      </Form>
      <Viewport.Padding edge="block-end" />
    </Sheet.Content>
  </Sheet.Popup>
</Sheet.Root>`;

const disclosureCode = `const save = (values) => console.log(values);
const [isReminding, setIsReminding] = useState(false);
const date = useCreateDatePickerHandle();

<Form onFormSubmit={save}>
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
              onCheckedChange={setIsReminding}
            >
              <Switch.Thumb />
            </Switch.Root>
          </List.Trailing>
        </Field.Root>
      </List.Group>
    </List.Section>
    {/* Enabled by the switch. */}
    <Fieldset.Root disabled={!isReminding}>
      <Fieldset.Legend>
        <List.Title>Reminder</List.Title>
      </Fieldset.Legend>
      <List.Group>
        <Field.Root
          name="date"
          render={<List.Item />}
        >
          …
          <DatePicker.Root handle={date} />
          …
        </Field.Root>
        <DatePicker.Expandable handle={date} />
      </List.Group>
    </Fieldset.Root>
    …
  </List.Root>
</Form>`;

const mixedCode = `const order = (values) => console.log(values);
const [copies, setCopies] = useState(1);
const delivery = useCreateDatePickerHandle();

<Form onFormSubmit={order}>
  <List.Root>
    <Fieldset.Root>
      …
      <List.Group>
        {/* A string. */}
        <TextField.Root
          name="name"
          render={<List.Item />}
        >…</TextField.Root>
        {/* A number. */}
        <Field.Root
          name="copies"
          render={<List.Item />}
        >
          …
          <Stepper.Root
            min={1}
            value={copies}
            onValueChange={setCopies}
          >…</Stepper.Root>
        </Field.Root>
        {/* A number. */}
        <Field.Root
          name="quality"
          render={<List.Item />}
        >
          <List.Span>
            <Slider.Root defaultValue={80}>…</Slider.Root>
          </List.Span>
        </Field.Root>
        {/* An ISO date. */}
        <Field.Root
          name="delivery"
          render={<List.Item />}
        >
          …
          <DatePicker.Root handle={delivery} />
        </Field.Root>
        <DatePicker.Expandable handle={delivery} />
        {/* A boolean. */}
        <Field.Root
          name="gift"
          render={<List.Item onClick={forwardClick('[role=switch]')} />}
        >
          …
          <Switch.Root aria-label="Gift wrap">
            <Switch.Thumb />
          </Switch.Root>
        </Field.Root>
      </List.Group>
    </Fieldset.Root>
    …
  </List.Root>
</Form>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A sign-up: required fields, validated; a server's error, shown. */
const ValidationAndServerErrors: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['errors', 'onFormSubmit', 'style'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'Fieldset.Legend': [],
            'Fieldset.Root': [],
            'List.Below': [],
            'List.Block': ['style'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'TextField.Control': ['placeholder', 'required', 'type'],
            'TextField.Error': ['match'],
            'TextField.Label': [],
            'TextField.Root': ['name', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('form-composition-validation') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="form-composition-validation"
      log={log}
      state={[partState]}
      title="Form: validation and server errors"
    >
      <Form
        {...partProps.Form}
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
        <List.Root {...partProps['List.Root']}>
          <Fieldset.Root {...partProps['Fieldset.Root']}>
            <Fieldset.Legend {...partProps['Fieldset.Legend']}>
              <List.Title {...partProps['List.Title']}>Account</List.Title>
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
              <TextField.Root
                {...partProps['TextField.Root']}
                name="email"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Content {...partProps['List.Content']}>
                  <TextField.Label {...partProps['TextField.Label']}>
                    Email
                  </TextField.Label>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <TextField.Control
                    {...partProps['TextField.Control']}
                    required
                    placeholder="taken@example.com"
                    type="email"
                  />
                </List.Trailing>
                <List.Below {...partProps['List.Below']}>
                  <TextField.Error {...partProps['TextField.Error']} />
                </List.Below>
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
                <Button.Label {...partProps['Button.Label']}>
                  Sign Up
                </Button.Label>
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
  const starts = useCreateDatePickerHandle();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['id', 'onFormSubmit'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'DatePicker.Root': ['defaultValue', 'handle', 'mode'],
            'Field.Root': ['name', 'render'],
            'List.Below': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Span': [],
            'List.Title': [],
            'List.Trailing': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact', 'detent'],
            'Sheet.Root': ['onOpenChange', 'open'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'TextField.Control': ['aria-label', 'placeholder', 'required'],
            'TextField.Error': ['match'],
            'TextField.Root': ['name', 'render'],
            'Toolbar.Button': ['form', 'prominent', 'type'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('form-composition-sheet') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="form-composition-sheet"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Form in a sheet with Cancel and Done"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          open={isOpen}
          onOpenChange={(isNextOpen: boolean) => setIsOpen(isNextOpen)}
        >
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              New Event
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
            detent="large"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    New Event
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    prominent
                    form={formId}
                    type="submit"
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Toolbar.Button>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <Form
                {...partProps.Form}
                id={formId}
                onFormSubmit={(values: Record<string, unknown>) => {
                  addLog(`submitted: ${JSON.stringify(values)}`);
                  setIsOpen(false);
                }}
              >
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      <TextField.Root
                        {...partProps['TextField.Root']}
                        name="title"
                        render={<List.Item {...partProps['List.Item']} />}
                      >
                        <List.Span {...partProps['List.Span']}>
                          <TextField.Control
                            {...partProps['TextField.Control']}
                            required
                            aria-label="Title"
                            placeholder="Title"
                          />
                        </List.Span>
                        <List.Below {...partProps['List.Below']}>
                          <TextField.Error
                            {...partProps['TextField.Error']}
                            match="valueMissing"
                          >
                            Enter a title.
                          </TextField.Error>
                        </List.Below>
                      </TextField.Root>
                      <Field.Root
                        {...partProps['Field.Root']}
                        name="starts"
                        render={<List.Item {...partProps['List.Item']} />}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Starts
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <DatePicker.Root
                            {...partProps['DatePicker.Root']}
                            defaultValue={new Date(2025, 3, 20, 10, 0)}
                            handle={starts}
                            mode="dateAndTime"
                          />
                        </List.Trailing>
                      </Field.Root>
                      <DatePicker.Expandable handle={starts} />
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Form>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
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
  const date = useCreateDatePickerHandle();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['onFormSubmit', 'style'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'DatePicker.Root': ['defaultValue', 'handle'],
            'Field.Root': ['name', 'render'],
            'Fieldset.Legend': [],
            'Fieldset.Root': ['disabled'],
            'List.Block': ['style'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Switch.Root': ['aria-label', 'checked', 'onCheckedChange'],
            'Switch.Thumb': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('form-composition-disclosure') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="form-composition-disclosure"
      log={log}
      state={[partState]}
      title="Form: a switch revealing a fieldset"
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
                {...partProps['Field.Root']}
                name="remind"
                render={
                  <List.Item
                    {...partProps['List.Item']}
                    onClick={forwardClick('[role=switch]')}
                  />
                }
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>
                    Remind Me
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Switch.Root
                    {...partProps['Switch.Root']}
                    aria-label="Remind me"
                    checked={isReminding}
                    onCheckedChange={(isChecked: boolean) =>
                      setIsReminding(isChecked)
                    }
                  >
                    <Switch.Thumb {...partProps['Switch.Thumb']} />
                  </Switch.Root>
                </List.Trailing>
              </Field.Root>
            </List.Group>
          </List.Section>
          <Fieldset.Root
            {...partProps['Fieldset.Root']}
            disabled={!isReminding}
          >
            <Fieldset.Legend {...partProps['Fieldset.Legend']}>
              <List.Title {...partProps['List.Title']}>Reminder</List.Title>
            </Fieldset.Legend>
            <List.Group {...partProps['List.Group']}>
              <Field.Root
                {...partProps['Field.Root']}
                name="date"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Date</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <DatePicker.Root
                    {...partProps['DatePicker.Root']}
                    defaultValue={new Date(2025, 3, 20)}
                    handle={date}
                  />
                </List.Trailing>
              </Field.Root>
              <DatePicker.Expandable handle={date} />
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

/** An order: a text field, a stepper, a slider, a date, a switch. */
const MixedControls: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [copies, setCopies] = useState<number | null>(1);
  const delivery = useCreateDatePickerHandle();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['onFormSubmit', 'style'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'DatePicker.Root': ['defaultValue', 'handle'],
            'Field.Root': ['name', 'render'],
            'Fieldset.Legend': [],
            'Fieldset.Root': [],
            'List.Block': ['style'],
            'List.Content': [],
            'List.Detail': ['className'],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Span': [],
            'List.Title': [],
            'List.Trailing': [],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Label': ['placement'],
            'Slider.Root': ['defaultValue'],
            'Slider.Thumb': [],
            'Slider.Track': [],
            'Slider.Value': ['placement'],
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': ['min', 'onValueChange', 'value'],
            'Switch.Root': ['aria-label'],
            'Switch.Thumb': [],
            'TextField.Control': ['placeholder'],
            'TextField.Label': [],
            'TextField.Root': ['name', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('form-composition-mixed') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="form-composition-mixed"
      log={log}
      state={[partState]}
      title="Form with mixed controls"
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
                    placeholder="Name"
                  />
                </List.Trailing>
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
              <Field.Root
                {...partProps['Field.Root']}
                name="quality"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Span {...partProps['List.Span']}>
                  <Slider.Root
                    {...partProps['Slider.Root']}
                    defaultValue={80}
                  >
                    <Slider.Label
                      {...partProps['Slider.Label']}
                      placement="block-start"
                    >
                      Quality
                    </Slider.Label>
                    <Slider.Value
                      {...partProps['Slider.Value']}
                      placement="block-start"
                    />
                    <Slider.Control {...partProps['Slider.Control']}>
                      <Slider.Track {...partProps['Slider.Track']}>
                        <Slider.Indicator {...partProps['Slider.Indicator']} />
                        <Slider.Thumb {...partProps['Slider.Thumb']} />
                      </Slider.Track>
                    </Slider.Control>
                  </Slider.Root>
                </List.Span>
              </Field.Root>
              <Field.Root
                {...partProps['Field.Root']}
                name="delivery"
                render={<List.Item {...partProps['List.Item']} />}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Delivery</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <DatePicker.Root
                    {...partProps['DatePicker.Root']}
                    defaultValue={new Date(2025, 3, 24)}
                    handle={delivery}
                  />
                </List.Trailing>
              </Field.Root>
              <DatePicker.Expandable handle={delivery} />
              <Field.Root
                {...partProps['Field.Root']}
                name="gift"
                render={
                  <List.Item
                    {...partProps['List.Item']}
                    onClick={forwardClick('[role=switch]')}
                  />
                }
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>
                    Gift Wrap
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Switch.Root
                    {...partProps['Switch.Root']}
                    aria-label="Gift wrap"
                  >
                    <Switch.Thumb {...partProps['Switch.Thumb']} />
                  </Switch.Root>
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
        Fields validate on submit, and then on every change:{' '}
        <code>required</code>, and a <code>type</code>. Their errors show in{' '}
        <PartLink
          component="text-field"
          part="TextField.Error"
        />
        .
      </li>
      <li>
        A server’s errors come back after submitting, as <code>errors</code> by
        the fields’ names (here, <code>taken@example.com</code> is taken).
      </li>
      <li>
        <strong>Library:</strong> Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />{' '}
        (validating on submit, then on change, and its <code>errors</code>), the
        text fields, and their errors (
        <PartLink
          component="text-field"
          part="TextField.Error"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> checking the email against the “server”
        (taken@example.com), holding its errors, and logging what’s submitted.
      </li>
    </ul>
    <CodeView code={validationCode} />
    <ValidationAndServerErrors />

    <Heading
      id="in-a-sheet-with-cancel-and-done"
      level={2}
    >
      In a sheet with Cancel and Done
    </Heading>
    <ul>
      <li>
        Creating something defers to Done: Cancel closes the{' '}
        <a href={publicUrl('sheet')}>Sheet</a>, and Done submits the form.
      </li>
      <li>
        Done sits in the sheet’s toolbar, outside the form. It’s a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        with <code>type=&quot;submit&quot;</code> and the form’s id (
        <code>form</code>). Once the form is submitted and valid, the app closes
        the sheet.
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
        text field, and the date picker in its list mode. Its pickers open in a
        row below its own (
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        , through a handle from{' '}
        <PartLink
          component="date-picker"
          part="useCreateDatePickerHandle"
        />
        ), not in a popover above the sheet.
      </li>
      <li>
        <strong>Demo:</strong> the open state, the form’s id, and closing the
        sheet once it’s submitted.
      </li>
    </ul>
    <CodeView code={sheetCode} />
    <InASheetWithCancelDone />

    <Heading
      id="a-switch-revealing-a-fieldset"
      level={2}
    >
      A switch revealing a fieldset
    </Heading>
    <ul>
      <li>
        Progressive disclosure, for example a reminder’s date: a{' '}
        <a href={publicUrl('switch')}>Switch</a> enables the fieldset below it (
        <PartLink
          component="form"
          part="Fieldset.Root"
        />
        ’s <code>disabled</code>).
      </li>
      <li>While it’s disabled, its fields can’t be changed.</li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />
        , and the fieldset’s <code>disabled</code>, with Base UI’s fields
        submitting by name.
      </li>
      <li>
        <strong>Demo:</strong> holding whether to remind, and disabling the
        fieldset by it.
      </li>
    </ul>
    <CodeView code={disclosureCode} />
    <ASwitchRevealingAFieldset />

    <Heading
      id="mixed-controls"
      level={2}
    >
      Mixed controls
    </Heading>
    <ul>
      <li>
        Each value is named by its field: text fields by their{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />
        ’s <code>name</code>, and other controls by their{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>
        ’s, rendered as their rows.
      </li>
      <li>
        They’re submitted as a string (text), a number (
        <a href={publicUrl('stepper')}>Stepper</a>,{' '}
        <a href={publicUrl('slider')}>Slider</a>), an ISO date (
        <a href={publicUrl('date-picker')}>Date Picker</a>) or a boolean (
        <a href={publicUrl('switch')}>Switch</a>).
      </li>
      <li>
        <strong>Library:</strong> each control’s value in the form (text, a
        number, an ISO date, a boolean), under its field’s name.
      </li>
      <li>
        <strong>Demo:</strong> the fields, the copies count (the app’s state),
        and logging what’s submitted.
      </li>
    </ul>
    <CodeView code={mixedCode} />
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
