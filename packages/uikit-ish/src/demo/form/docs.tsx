import { baseUiRows, code, PropRow, union } from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const formRows: readonly PropRow[] = [
  [
    'onFormSubmit',
    '(formValues, eventDetails) => void',
    undefined,
    <>
      Event handler called when the form is submitted, with its fields’ values
      by their <code>name</code> (<code>Field.Root</code>’s, or a control’s in
      one). <code>preventDefault()</code> is called on the native submit event
      when used.
    </>,
  ],
  [
    'validationMode',
    union('onSubmit', 'onBlur', 'onChange'),
    code('onSubmit'),
    <>
      Determines when the form should be validated: on submit (afterwards,
      fields re-validate on change), as a field loses focus, or on every change.
      A field’s own <code>validationMode</code> takes precedence.
    </>,
  ],
  [
    'errors',
    'Record<string, string | string[]>',
    undefined,
    <>
      Validation errors returned externally (e.g. by a server, after
      submitting), by the fields’ <code>name</code>s: shown on them (e.g. a{' '}
      <PartLink
        component="text-field"
        part="TextField.Error"
      />
      ).
    </>,
  ],
  [
    'actionsRef',
    'RefObject<{ validate }>',
    undefined,
    <>
      A ref to imperative actions: <code>validate()</code> validates all fields,
      or one by its name.
    </>,
  ],
  ...baseUiRows('form', 'HTMLFormElement'),
];

export const fieldsetRootRows: readonly PropRow[] = [
  ['disabled', 'boolean', code('false'), 'Disables its fields.'],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its legend (
      <PartLink
        component="form"
        part="Fieldset.Legend"
      />
      ), then its rows in a{' '}
      <PartLink
        component="list"
        part="List.Group"
      />
      .
    </>,
  ],
  [
    'render',
    'ReactElement | ((props, state) => ReactElement)',
    <>
      a{' '}
      <PartLink
        component="list"
        part="List.Section"
      />{' '}
      as a <code>fieldset</code>
    </>,
    'What it renders.',
  ],
  ...baseUiRows('fieldset', 'HTMLFieldSetElement').filter(
    ([name]) => name !== 'render',
  ),
];

export const fieldsetLegendRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its header’s parts (
      <PartLink
        component="list"
        part="List.Title"
      />
      , …): the section’s title; its text names the fieldset (its{' '}
      <code>aria-labelledby</code>).
    </>,
  ],
  [
    'render',
    'ReactElement | ((props, state) => ReactElement)',
    <>
      a{' '}
      <PartLink
        component="list"
        part="List.Header"
      />
    </>,
    <>
      What it renders: e.g. another prominence (
      <code>{'<List.Header prominence="nested" />'}</code>).
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement').filter(([name]) => name !== 'render'),
];
