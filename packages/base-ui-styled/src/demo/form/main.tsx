import { Field } from '@base-ui/react/field';
import { styled } from 'goober';
import {
  ComponentProps,
  forwardRef,
  FunctionComponent,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  CheckboxGroup,
  Fieldset,
  Form,
  List,
  RadioGroup,
  TextField,
} from '../../components/index.js';
import { buttonControlCount, useButtonDemo } from '../button/compose.js';
import {
  getPropOptionsRoot as getPropOptionsButtonRoot,
  propOptionsContent as propOptionsButtonContent,
} from '../button/props.js';
import { useDatePickerDemo } from '../date-picker/compose.js';
import { getPropOptionsDatePicker } from '../date-picker/props.js';
import { forwardClick } from '../list/props.js';
import {
  textFieldControlCount,
  useTextFieldDemo,
} from '../text-field/compose.js';
import {
  getPropOptionsControl,
  propOptionsRoot as propOptionsTextFieldRoot,
} from '../text-field/props.js';
import { AddLog, useLog } from '../utils/log.js';
import {
  Component,
  MappedProp,
  Remounters,
  usePropControl,
} from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  appearanceValues,
  getPropOptionsCheckboxGroup,
  getPropOptionsForm,
  getPropOptionsRadioGroup,
  notificationValues,
  propOptionsCheckbox,
  propOptionsFieldset,
  propOptionsLegend,
  propOptionsRadio,
} from './props.js';

// A field around a group of rows, without a box of its own.
const FieldContents = styled('div', forwardRef)`
  display: contents;
`;

const today = new Date();

// A date as an ISO date (local).
const isoDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

// The submit button: a button (its demo's props), a large prominent one,
// filling the row.
const submitContent = {
  ...propOptionsButtonContent,
  label: ['Submit', 'Save', undefined] as const,
  symbol: [undefined, ...propOptionsButtonContent.symbol.slice(1)] as const,
};

const getSubmitRoot = (addLog: AddLog) => ({
  ...getPropOptionsButtonRoot(addLog),
  variant: [
    'bordered-prominent',
    'bordered',
    'glass-prominent',
    'glass',
  ] as const,
  size: ['large', 'medium', 'small'] as const,
  fill: [true, false] as const,
});

// The name field: a text field (its demo's props), required, autocompleting
// a name.
const getNameControl = (addLog: AddLog) => ({
  ...getPropOptionsControl(addLog),
  placeholder: ['Name', 'Kate Bell', undefined] as const,
  type: ['text', undefined] as const,
  autoComplete: ['name', 'off', undefined] as const,
  required: [true, false] as const,
});

// The birthday: a date picker (its demo's props), of past dates only; its
// value the form's (see `FormDemo`).
const getBirthdayPicker = (addLog: AddLog) => {
  const { onValueChange: _logged, ...picker } = getPropOptionsDatePicker(
    'date',
    addLog,
  );
  return {
    ...picker,
    mode: ['date'] as const,
    max: [new MappedProp(today, '[today: past dates only]'), undefined],
    min: [undefined, new MappedProp(new Date(1900, 0, 1), '[January 1, 1900]')],
  };
};

type ContactField = Pick<
  ComponentProps<typeof TextField.Control>,
  | 'autoComplete'
  | 'inputMode'
  | 'max'
  | 'min'
  | 'minLength'
  | 'name'
  | 'required'
  | 'type'
> & { error?: string; label: string; name: string };

/**
 * The other fields of the contact fieldset (the name's has the text field
 * demo's options): input types and their hints.
 */
const contactFields: ContactField[] = [
  {
    autoComplete: 'email',
    error: 'Please enter an email address.',
    label: 'Email',
    name: 'email',
    type: 'email',
  },
  { autoComplete: 'tel', label: 'Phone', name: 'phone', type: 'tel' },
  { autoComplete: 'url', label: 'Website', name: 'website', type: 'url' },
  {
    error: 'Between 0 and 130.',
    inputMode: 'numeric',
    label: 'Age',
    max: 130,
    min: 0,
    name: 'age',
    type: 'number',
  },
  {
    autoComplete: 'new-password',
    error: 'At least 8 characters.',
    label: 'Password',
    minLength: 8,
    name: 'password',
    type: 'password',
  },
];

/**
 * A form (Base UI `Form`, `Fieldset`) as iOS lays it out: fieldsets are
 * list sections, their legends the headers, fields rows (text fields of
 * each input type, checkboxes in a group, radios); submitted by a button.
 */
export const FormDemo: FunctionComponent = () => {
  const id = 'form';

  const [log, addLog] = useLog();
  const [birthday, setBirthday] = useState<Date | null>(null);

  const [
    externalForm,
    externalFieldset,
    externalLegend,
    externalCheckboxGroup,
    externalCheckbox,
    externalRadioGroup,
    externalRadio,
    ...externalComposed
  ] = useProvidedState(id);

  // Composed: the submit button, the name field, the birthday's picker
  // (all of their demos' options).
  const submit = useButtonDemo(externalComposed.slice(0, buttonControlCount), {
    content: submitContent,
    prefix: 'submit button: ',
    root: useMemo(() => getSubmitRoot(addLog), [addLog]),
  });
  const nameField = useTextFieldDemo(
    addLog,
    externalComposed.slice(
      buttonControlCount,
      buttonControlCount + textFieldControlCount,
    ),
    {
      control: useMemo(() => getNameControl(addLog), [addLog]),
      prefix: 'name field: ',
      root: propOptionsTextFieldRoot,
    },
  );
  const birthdayPicker = useDatePickerDemo(
    externalComposed.slice(buttonControlCount + textFieldControlCount),
    'date',
    {
      picker: useMemo(() => getBirthdayPicker(addLog), [addLog]),
      prefix: 'birthday: ',
    },
  );

  const [controlForm, propsForm, stateForm, RemounterForm] = usePropControl(
    useMemo(() => getPropOptionsForm(addLog), [addLog]),
    'form',
    externalForm,
    true,
  );
  const [controlFieldset, propsFieldset, stateFieldset] = usePropControl(
    propOptionsFieldset,
    'fieldset',
    externalFieldset,
  );
  const [controlLegend, propsLegend, stateLegend] = usePropControl(
    propOptionsLegend,
    'legend',
    externalLegend,
  );
  const [
    controlCheckboxGroup,
    propsCheckboxGroup,
    stateCheckboxGroup,
    RemounterCheckboxGroup,
  ] = usePropControl(
    useMemo(() => getPropOptionsCheckboxGroup(addLog), [addLog]),
    'checkbox group',
    externalCheckboxGroup,
    true,
  );
  const [controlCheckbox, propsCheckbox, stateCheckbox, RemounterCheckbox] =
    usePropControl(propOptionsCheckbox, 'checkbox (first)', externalCheckbox);
  const [
    controlRadioGroup,
    propsRadioGroup,
    stateRadioGroup,
    RemounterRadioGroup,
  ] = usePropControl(
    useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
    'radio group',
    externalRadioGroup,
    true,
  );
  const [controlRadio, propsRadio, stateRadio, RemounterRadio] = usePropControl(
    propOptionsRadio,
    'radio (first)',
    externalRadio,
  );

  return (
    <Component
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
        ...nameField.controls,
        ...birthdayPicker.controls,
        ...submit.controls,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateForm,
        stateFieldset,
        stateLegend,
        stateCheckboxGroup,
        stateCheckbox,
        stateRadioGroup,
        stateRadio,
        ...submit.states,
        ...nameField.states,
        ...birthdayPicker.states,
      ])}
    >
      <RemounterForm>
        <Form {...propsForm}>
          <List.Root>
            <Fieldset.Root {...propsFieldset}>
              <Fieldset.Legend {...propsLegend}>Contact</Fieldset.Legend>
              <List.Group>
                <nameField.Remounter>
                  <TextField.Root
                    name="name"
                    {...nameField.props.root}
                    render={<List.Item />}
                  >
                    <TextField.Label {...nameField.props.label}>
                      Name
                    </TextField.Label>
                    <TextField.Control {...nameField.props.control} />
                    <TextField.Clear {...nameField.props.clear} />
                    <TextField.Description {...nameField.props.description}>
                      As shown to others.
                    </TextField.Description>
                    <TextField.Error {...nameField.props.error}>
                      Please enter a name.
                    </TextField.Error>
                  </TextField.Root>
                </nameField.Remounter>
                {nameField.suggestions}
                {contactFields.map(({ error, label, ...control }) => (
                  <TextField.Root
                    key={control.name}
                    name={control.name}
                    render={<List.Item />}
                  >
                    <TextField.Label>{label}</TextField.Label>
                    <TextField.Control
                      {...control}
                      placeholder={label}
                    />
                    <TextField.Clear />
                    {error ? <TextField.Error>{error}</TextField.Error> : null}
                    {control.name === 'email' ? (
                      <TextField.Error match="customError" />
                    ) : null}
                  </TextField.Root>
                ))}
                {/* A date: the date picker (its value, as an ISO date, in a
                    hidden control: the form's by name). */}
                <Field.Root
                  name="birthday"
                  render={<List.Item />}
                >
                  <List.Title>Birthday</List.Title>
                  <birthdayPicker.Remounter>
                    {birthdayPicker.render({
                      onValueChange: (next) => {
                        addLog(`birthday: ${next.toLocaleDateString()}`);
                        setBirthday(next);
                      },
                      value: birthday,
                    })}
                  </birthdayPicker.Remounter>
                  <Field.Control
                    type="hidden"
                    value={birthday ? isoDate(birthday) : ''}
                  />
                </Field.Root>
              </List.Group>
            </Fieldset.Root>

            <Fieldset.Root>
              <Fieldset.Legend>Notifications</Fieldset.Legend>
              {/* Fields: their values are the form's (by name). */}
              {/* (Remounted as their defaults change.) */}
              <Remounters
                remounters={[RemounterCheckboxGroup, RemounterCheckbox]}
              >
                <Field.Root
                  name="notifications"
                  render={<FieldContents />}
                >
                  <CheckboxGroup
                    {...propsCheckboxGroup}
                    allValues={notificationValues}
                    render={<List.Group />}
                  >
                    {notificationValues.map((value, index) => (
                      <List.Item
                        key={value}
                        onClick={forwardClick('[role=checkbox]')}
                      >
                        <List.Checkbox
                          aria-label={value}
                          value={value}
                          {...(index === 0 ? propsCheckbox : {})}
                        />
                        <List.Title>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </List.Title>
                      </List.Item>
                    ))}
                  </CheckboxGroup>
                </Field.Root>
              </Remounters>
            </Fieldset.Root>

            <Fieldset.Root>
              <Fieldset.Legend>Appearance</Fieldset.Legend>
              <Remounters remounters={[RemounterRadioGroup, RemounterRadio]}>
                <Field.Root
                  name="appearance"
                  render={<FieldContents />}
                >
                  <RadioGroup
                    {...propsRadioGroup}
                    render={<List.Group />}
                  >
                    {appearanceValues.map((value, index) => (
                      <List.Item
                        key={value}
                        onClick={forwardClick('[role=radio]')}
                      >
                        <List.Radio
                          aria-label={value}
                          value={value}
                          {...(index === 0 ? propsRadio : {})}
                        />
                        <List.Title>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </List.Title>
                      </List.Item>
                    ))}
                  </RadioGroup>
                </Field.Root>
              </Remounters>
            </Fieldset.Root>

            <List.Section>
              {/* As wide as the rows (the groups' edges, not their text). */}
              <List.Block style={{ paddingInline: 0 }}>
                <Button.Root
                  {...submit.propsRoot}
                  type="submit"
                >
                  {submit.children}
                </Button.Root>
              </List.Block>
            </List.Section>
          </List.Root>
        </Form>
      </RemounterForm>
    </Component>
  );
};
