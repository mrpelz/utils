import './style.css';

import { Field } from '@base-ui/react/field';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  CheckboxGroup,
  DatePicker,
  Fieldset,
  Form,
  forwardClick,
  List,
  RadioGroup,
  TextField,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsCheckboxGroup,
  getPropOptionsForm,
  getPropOptionsRadioGroup,
  propOptionsCheckbox,
  propOptionsFieldset,
  propOptionsLegend,
  propOptionsRadio,
} from './props.js';

/**
 * A form (Base UI `Form`, `Fieldset`) as iOS lays it out: fieldsets are
 * list sections, their legends the headers, fields rows (text fields of
 * each input type, a date, checkboxes in a group, radios); submitted by a
 * button.
 */
export const FormDemo: FunctionComponent = () => {
  const id = 'form';

  const [log, addLog] = useLog();
  const [
    externalForm,
    externalFieldset,
    externalLegend,
    externalCheckboxGroup,
    externalCheckbox,
    externalRadioGroup,
    externalRadio,
  ] = useProvidedState(id);

  const [birthday, setBirthday] = useState<Date | null>(null);

  const [controlForm, propsForm, stateForm, keyForm] = usePropControl(
    useMemo(() => getPropOptionsForm(addLog), [addLog]),
    'form',
    externalForm,
    true,
  );
  const [controlFieldset, propsFieldset, stateFieldset] = usePropControl(
    propOptionsFieldset,
    'fieldset (contact)',
    externalFieldset,
  );
  const [controlLegend, propsLegend, stateLegend] = usePropControl(
    propOptionsLegend,
    'legend (contact)',
    externalLegend,
  );
  const [
    controlCheckboxGroup,
    propsCheckboxGroup,
    stateCheckboxGroup,
    keyCheckboxGroup,
  ] = usePropControl(
    useMemo(() => getPropOptionsCheckboxGroup(addLog), [addLog]),
    'checkbox group',
    externalCheckboxGroup,
    true,
  );
  const [controlCheckbox, propsCheckbox, stateCheckbox, keyCheckbox] =
    usePropControl(propOptionsCheckbox, 'checkbox (first)', externalCheckbox);
  const [controlRadioGroup, propsRadioGroup, stateRadioGroup, keyRadioGroup] =
    usePropControl(
      useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
      'radio group',
      externalRadioGroup,
      true,
    );
  const [controlRadio, propsRadio, stateRadio, keyRadio] = usePropControl(
    propOptionsRadio,
    'radio (first)',
    externalRadio,
  );

  return (
    <Component
      inputGuards
      stretch
      baseUiId="form"
      id={id}
      log={log}
      title="Form"
      controls={[
        controlForm,
        controlFieldset,
        controlLegend,
        controlCheckboxGroup,
        controlCheckbox,
        controlRadioGroup,
        controlRadio,
      ]}
      state={[
        stateForm,
        stateFieldset,
        stateLegend,
        stateCheckboxGroup,
        stateCheckbox,
        stateRadioGroup,
        stateRadio,
      ]}
    >
      <Form
        key={keyForm}
        {...propsForm}
      >
        <List.Root>
          <Fieldset.Root {...propsFieldset}>
            <Fieldset.Legend {...propsLegend}>Contact</Fieldset.Legend>
            <List.Group>
              <TextField.Root
                name="name"
                render={<List.Item />}
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Control
                  required
                  autoComplete="name"
                  placeholder="Name"
                />
                <TextField.Clear />
                <TextField.Description>
                  As shown to others.
                </TextField.Description>
                <TextField.Error>Please enter a name.</TextField.Error>
              </TextField.Root>
              <TextField.Root
                name="email"
                render={<List.Item />}
              >
                <TextField.Label>Email</TextField.Label>
                <TextField.Control
                  autoComplete="email"
                  placeholder="Email"
                  type="email"
                />
                <TextField.Clear />
                <TextField.Error>
                  Please enter an email address.
                </TextField.Error>
                {/* A server's error (see the form's `errors`). */}
                <TextField.Error match="customError" />
              </TextField.Root>
              <TextField.Root
                name="phone"
                render={<List.Item />}
              >
                <TextField.Label>Phone</TextField.Label>
                <TextField.Control
                  autoComplete="tel"
                  placeholder="Phone"
                  type="tel"
                />
                <TextField.Clear />
              </TextField.Root>
              <TextField.Root
                name="website"
                render={<List.Item />}
              >
                <TextField.Label>Website</TextField.Label>
                <TextField.Control
                  autoComplete="url"
                  placeholder="Website"
                  type="url"
                />
                <TextField.Clear />
              </TextField.Root>
              <TextField.Root
                name="age"
                render={<List.Item />}
              >
                <TextField.Label>Age</TextField.Label>
                <TextField.Control
                  inputMode="numeric"
                  max={130}
                  min={0}
                  placeholder="Age"
                  type="number"
                />
                <TextField.Clear />
                <TextField.Error>Between 0 and 130.</TextField.Error>
              </TextField.Root>
              <TextField.Root
                name="password"
                render={<List.Item />}
              >
                <TextField.Label>Password</TextField.Label>
                <TextField.Control
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="Password"
                  type="password"
                />
                <TextField.Clear />
                <TextField.Error>At least 8 characters.</TextField.Error>
              </TextField.Root>
              {/* A date: the date picker (its value, as an ISO date, in a
                    hidden control: the form's by name). */}
              <Field.Root
                name="birthday"
                render={<List.Item />}
              >
                <List.Title>Birthday</List.Title>
                <DatePicker
                  max={new Date()}
                  value={birthday}
                  onValueChange={(next: Date) => {
                    addLog(`birthday: ${next.toLocaleDateString()}`);
                    setBirthday(next);
                  }}
                />
                <Field.Control
                  type="hidden"
                  value={birthday?.toLocaleDateString('sv-SE') ?? ''}
                />
              </Field.Root>
            </List.Group>
          </Fieldset.Root>

          <Fieldset.Root>
            <Fieldset.Legend>Notifications</Fieldset.Legend>
            {/* Fields: their values are the form's (by name). */}

            <Field.Root
              key={`${keyCheckboxGroup}-${keyCheckbox}`}
              name="notifications"
              render={<div className="form-demo-field-contents" />}
            >
              <CheckboxGroup
                {...propsCheckboxGroup}
                allValues={['messages', 'mentions', 'reminders']}
                render={<List.Group />}
              >
                <List.Item onClick={forwardClick('[role=checkbox]')}>
                  <List.Checkbox
                    aria-label="messages"
                    value="messages"
                    {...propsCheckbox}
                  />
                  <List.Title>Messages</List.Title>
                </List.Item>
                <List.Item onClick={forwardClick('[role=checkbox]')}>
                  <List.Checkbox
                    aria-label="mentions"
                    value="mentions"
                  />
                  <List.Title>Mentions</List.Title>
                </List.Item>
                <List.Item onClick={forwardClick('[role=checkbox]')}>
                  <List.Checkbox
                    aria-label="reminders"
                    value="reminders"
                  />
                  <List.Title>Reminders</List.Title>
                </List.Item>
              </CheckboxGroup>
            </Field.Root>
          </Fieldset.Root>

          <Fieldset.Root>
            <Fieldset.Legend>Appearance</Fieldset.Legend>

            <Field.Root
              key={`${keyRadioGroup}-${keyRadio}`}
              name="appearance"
              render={<div className="form-demo-field-contents" />}
            >
              <RadioGroup
                {...propsRadioGroup}
                render={<List.Group />}
              >
                <List.Item onClick={forwardClick('[role=radio]')}>
                  <List.Radio
                    aria-label="light"
                    value="light"
                    {...propsRadio}
                  />
                  <List.Title>Light</List.Title>
                </List.Item>
                <List.Item onClick={forwardClick('[role=radio]')}>
                  <List.Radio
                    aria-label="dark"
                    value="dark"
                  />
                  <List.Title>Dark</List.Title>
                </List.Item>
                <List.Item onClick={forwardClick('[role=radio]')}>
                  <List.Radio
                    aria-label="automatic"
                    value="automatic"
                  />
                  <List.Title>Automatic</List.Title>
                </List.Item>
              </RadioGroup>
            </Field.Root>
          </Fieldset.Root>

          <List.Section>
            {/* As wide as the rows (the groups' edges, not their text). */}
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
