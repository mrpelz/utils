import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  CheckboxGroup,
  DatePicker,
  Field,
  Fieldset,
  Form,
  forwardClick,
  List,
  RadioGroup,
  TextField,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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
    { external: externalForm, isOpen: true, title: 'form' },
  );
  const [controlFieldset, propsFieldset, stateFieldset] = usePropControl(
    propOptionsFieldset,
    { external: externalFieldset, title: 'fieldset (contact)' },
  );
  const [controlLegend, propsLegend, stateLegend] = usePropControl(
    propOptionsLegend,
    { external: externalLegend, title: 'legend (contact)' },
  );
  const [
    controlCheckboxGroup,
    propsCheckboxGroup,
    stateCheckboxGroup,
    keyCheckboxGroup,
  ] = usePropControl(
    useMemo(() => getPropOptionsCheckboxGroup(addLog), [addLog]),
    { external: externalCheckboxGroup, isOpen: true, title: 'checkbox group' },
  );
  const [controlCheckbox, propsCheckbox, stateCheckbox, keyCheckbox] =
    usePropControl(propOptionsCheckbox, {
      external: externalCheckbox,
      title: 'checkbox (first)',
    });
  const [controlRadioGroup, propsRadioGroup, stateRadioGroup, keyRadioGroup] =
    usePropControl(
      useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
      { external: externalRadioGroup, isOpen: true, title: 'radio group' },
    );
  const [controlRadio, propsRadio, stateRadio, keyRadio] = usePropControl(
    propOptionsRadio,
    { external: externalRadio, title: 'radio (first)' },
  );

  return (
    <Component
      hasInputGuards
      isStretched
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
            <Fieldset.Legend {...propsLegend}>
              <List.Title>Contact</List.Title>
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
                    autoComplete="name"
                    placeholder="Name"
                  />
                  <TextField.Clear />
                </List.Trailing>
                <List.Below>
                  <TextField.Description>
                    As shown to others.
                  </TextField.Description>
                  <TextField.Error>Please enter a name.</TextField.Error>
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
                    autoComplete="email"
                    placeholder="Email"
                    type="email"
                  />
                  <TextField.Clear />
                </List.Trailing>
                <List.Below>
                  <TextField.Error>
                    Please enter an email address.
                  </TextField.Error>
                  {/* A server's error (see the form's `errors`). */}
                  <TextField.Error match="customError" />
                </List.Below>
              </TextField.Root>
              <TextField.Root
                name="phone"
                render={<List.Item />}
              >
                <List.Content>
                  <TextField.Label>Phone</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    autoComplete="tel"
                    placeholder="Phone"
                    type="tel"
                  />
                  <TextField.Clear />
                </List.Trailing>
              </TextField.Root>
              <TextField.Root
                name="website"
                render={<List.Item />}
              >
                <List.Content>
                  <TextField.Label>Website</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    autoComplete="url"
                    placeholder="Website"
                    type="url"
                  />
                  <TextField.Clear />
                </List.Trailing>
              </TextField.Root>
              <TextField.Root
                name="age"
                render={<List.Item />}
              >
                <List.Content>
                  <TextField.Label>Age</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    inputMode="numeric"
                    max={130}
                    min={0}
                    placeholder="Age"
                    type="number"
                  />
                  <TextField.Clear />
                </List.Trailing>
                <List.Below>
                  <TextField.Error>Between 0 and 130.</TextField.Error>
                </List.Below>
              </TextField.Root>
              <TextField.Root
                name="password"
                render={<List.Item />}
              >
                <List.Content>
                  <TextField.Label>Password</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="Password"
                    type="password"
                  />
                  <TextField.Clear />
                </List.Trailing>
                <List.Below>
                  <TextField.Error>At least 8 characters.</TextField.Error>
                </List.Below>
              </TextField.Root>
              {/* A date: the date picker (its value, as an ISO date, in its
                    hidden control: the field's by name). */}
              <Field.Root
                name="birthday"
                render={<List.Item />}
              >
                <List.Content>
                  <List.Title>Birthday</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root
                    max={new Date()}
                    popoverAlign="end"
                    value={birthday}
                    onValueChange={(next: Date) => {
                      addLog(`birthday: ${next.toLocaleDateString()}`);
                      setBirthday(next);
                    }}
                  />
                </List.Trailing>
              </Field.Root>
            </List.Group>
          </Fieldset.Root>

          <Fieldset.Root>
            <Fieldset.Legend>
              <List.Title>Notifications</List.Title>
            </Fieldset.Legend>
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
                  <List.Leading>
                    <List.Checkbox
                      aria-label="messages"
                      value="messages"
                      {...propsCheckbox}
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>Messages</List.Title>
                  </List.Content>
                </List.Item>
                <List.Item onClick={forwardClick('[role=checkbox]')}>
                  <List.Leading>
                    <List.Checkbox
                      aria-label="mentions"
                      value="mentions"
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>Mentions</List.Title>
                  </List.Content>
                </List.Item>
                <List.Item onClick={forwardClick('[role=checkbox]')}>
                  <List.Leading>
                    <List.Checkbox
                      aria-label="reminders"
                      value="reminders"
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>Reminders</List.Title>
                  </List.Content>
                </List.Item>
              </CheckboxGroup>
            </Field.Root>
          </Fieldset.Root>

          <Fieldset.Root>
            <Fieldset.Legend>
              <List.Title>Appearance</List.Title>
            </Fieldset.Legend>

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
                  <List.Leading>
                    <List.Radio
                      aria-label="light"
                      value="light"
                      {...propsRadio}
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>Light</List.Title>
                  </List.Content>
                </List.Item>
                <List.Item onClick={forwardClick('[role=radio]')}>
                  <List.Leading>
                    <List.Radio
                      aria-label="dark"
                      value="dark"
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>Dark</List.Title>
                  </List.Content>
                </List.Item>
                <List.Item onClick={forwardClick('[role=radio]')}>
                  <List.Leading>
                    <List.Radio
                      aria-label="automatic"
                      value="automatic"
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>Automatic</List.Title>
                  </List.Content>
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
