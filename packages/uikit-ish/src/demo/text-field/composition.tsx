import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  Fieldset,
  Form,
  List,
  Symbol,
  TextField,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const validationCode = `<Form onFormSubmit={(values) => save(values)}>
  <List.Root>
    <List.Section>
      <List.Group>
        <TextField.Root
          name="username"
          render={<List.Item />}
          validate={(value) =>
            taken.includes(String(value)) ? 'This username is taken.' : null
          }
          validationMode="onBlur"
        >
          <TextField.Label>Username</TextField.Label>
          <TextField.Control required minLength={3} />
          <TextField.Error match="valueMissing">Required.</TextField.Error>
          <TextField.Error match="tooShort">At least 3 characters.</TextField.Error>
          <TextField.Error match="customError" />
        </TextField.Root>
        <TextField.Root name="email" render={<List.Item />} validationMode="onBlur">
          <TextField.Label>Email</TextField.Label>
          <TextField.Control required type="email" />
          <TextField.Error match="typeMismatch">Not an email address.</TextField.Error>
        </TextField.Root>
      </List.Group>
    </List.Section>
  </List.Root>
  <Button.Root fill size="large" type="submit" variant="bordered-prominent">
    <Button.Label>Sign Up</Button.Label>
  </Button.Root>
</Form>`;

const searchCode = `const [query, setQuery] = useState('');

<TextField.Root>
  <TextField.Search>
    <Symbol icon={sfMagnifyingglass} />
    <TextField.Control
      aria-label="Search"
      placeholder="Search"
      type="search"
      value={query}
      onValueChange={setQuery}
    />
    <TextField.Clear />
  </TextField.Search>
</TextField.Root>
<List.Root>…{/* the rows matching query */}</List.Root>`;

const formCode = `<List.Root>
  <Fieldset.Root>
    <Fieldset.Legend>Contact</Fieldset.Legend>
    <List.Group>
      <TextField.Root render={<List.Item />}>
        <TextField.Label>Name</TextField.Label>
        <TextField.Control autoComplete="name" placeholder="Required" />
        <TextField.Clear />
      </TextField.Root>
      <TextField.Root render={<List.Item />}>
        <TextField.Label>Phone</TextField.Label>
        <TextField.Control autoComplete="tel" type="tel" />
        <TextField.Clear />
      </TextField.Root>
    </List.Group>
  </Fieldset.Root>
  <Fieldset.Root>
    <Fieldset.Legend>Notes</Fieldset.Legend>
    <List.Group>
      {/* No label: the placeholder shows, aria-label names it. */}
      <TextField.Root render={<List.Item />}>
        <TextField.Control
          aria-label="Notes"
          placeholder="Anything else?"
          render={<textarea />}
        />
      </TextField.Root>
    </List.Group>
  </Fieldset.Root>
</List.Root>`;

const suggestionsCode = `const [to, setTo] = useState('');
const matching = to ? contacts.filter((name) => matches(name, to)) : [];

<TextField.Root render={<List.Item />}>
  <TextField.Label>To:</TextField.Label>
  <TextField.Control
    aria-autocomplete="list"
    autoComplete="off"
    value={to}
    onValueChange={setTo}
  />
  <TextField.Clear />
</TextField.Root>
{matching.map((name) => (
  <List.Item key={name}>
    <List.Title render={<button type="button" />} onClick={() => setTo(name)}>
      {name}
    </List.Title>
  </List.Item>
))}`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Usernames taken (for the custom validation). */
const taken = ['kate', 'john', 'anna'];

/** A sign-up form: required fields, a length, a type, a custom check. */
const Validation: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="text-field-composition-validation"
      log={log}
      title="Validation"
    >
      <Form
        className="text-field-demo-form"
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submit: ${JSON.stringify(values)}`)
        }
      >
        <List.Root>
          <List.Section>
            <List.Group>
              <TextField.Root
                name="username"
                render={<List.Item />}
                validationMode="onBlur"
                validate={(value: unknown) =>
                  taken.includes(String(value))
                    ? 'This username is taken.'
                    : null
                }
              >
                <TextField.Label>Username</TextField.Label>
                <TextField.Control
                  required
                  autoCapitalize="none"
                  autoComplete="username"
                  minLength={3}
                />
                <TextField.Clear />
                <TextField.Error match="valueMissing">
                  Required.
                </TextField.Error>
                <TextField.Error match="tooShort">
                  At least 3 characters.
                </TextField.Error>
                <TextField.Error match="customError" />
              </TextField.Root>
              <TextField.Root
                name="email"
                render={<List.Item />}
                validationMode="onBlur"
              >
                <TextField.Label>Email</TextField.Label>
                <TextField.Control
                  required
                  autoComplete="email"
                  type="email"
                />
                <TextField.Clear />
                <TextField.Error match="valueMissing">
                  Required.
                </TextField.Error>
                <TextField.Error match="typeMismatch">
                  Not an email address.
                </TextField.Error>
              </TextField.Root>
            </List.Group>
            <List.Footer>Try “kate” as a username.</List.Footer>
          </List.Section>
        </List.Root>
        <Button.Root
          fill
          size="large"
          type="submit"
          variant="bordered-prominent"
        >
          <Button.Label>Sign Up</Button.Label>
        </Button.Root>
      </Form>
    </Component>
  );
};

/** A search field filtering a list, cleared by its button. */
const SearchWithClear: FunctionComponent = () => {
  const [query, setQuery] = useState('');
  const matching = names.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Component
      center
      inline
      id="text-field-composition-search"
      title="A search field"
    >
      <div className="text-field-demo-search">
        <TextField.Root>
          <TextField.Search>
            <Symbol icon={sfMagnifyingglass} />
            <TextField.Control
              aria-label="Search"
              placeholder="Search"
              type="search"
              value={query}
              onValueChange={setQuery}
            />
            <TextField.Clear />
          </TextField.Search>
        </TextField.Root>
        <List.Root>
          <List.Section>
            <List.Group>
              {matching.map((name) => (
                <List.Item key={name}>
                  <List.Title>{name}</List.Title>
                </List.Item>
              ))}
            </List.Group>
            {matching.length === 0 ? (
              <List.Footer>No results for “{query}”.</List.Footer>
            ) : null}
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};

/** Fields as a form's rows, in sections (fieldsets). */
const InAFormList: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="text-field-composition-form"
      log={log}
      title="Fields in a form list"
    >
      <List.Root className="text-field-demo-list">
        <Fieldset.Root>
          <Fieldset.Legend>Contact</Fieldset.Legend>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Label>Name</TextField.Label>
              <TextField.Control
                autoComplete="name"
                placeholder="Required"
                onValueChange={(value: string) => addLog(`name: ${value}`)}
              />
              <TextField.Clear />
            </TextField.Root>
            <TextField.Root render={<List.Item />}>
              <TextField.Label>Phone</TextField.Label>
              <TextField.Control
                autoComplete="tel"
                type="tel"
                onValueChange={(value: string) => addLog(`phone: ${value}`)}
              />
              <TextField.Clear />
            </TextField.Root>
          </List.Group>
        </Fieldset.Root>
        <Fieldset.Root>
          <Fieldset.Legend>Address</Fieldset.Legend>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Control
                aria-label="Street"
                autoComplete="street-address"
                placeholder="Street"
              />
              <TextField.Clear />
            </TextField.Root>
            <TextField.Root render={<List.Item />}>
              <TextField.Control
                aria-label="Postal code"
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder="Postal code"
              />
              <TextField.Clear />
            </TextField.Root>
          </List.Group>
        </Fieldset.Root>
        <Fieldset.Root>
          <Fieldset.Legend>Notes</Fieldset.Legend>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Control
                aria-label="Notes"
                placeholder="Anything else?"
                render={<textarea />}
              />
            </TextField.Root>
          </List.Group>
        </Fieldset.Root>
      </List.Root>
    </Component>
  );
};

/** A recipient field, matching contacts suggested below it. */
const Suggestions: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [to, setTo] = useState('');
  const matching =
    to === '' || names.includes(to)
      ? []
      : names.filter((name) => name.toLowerCase().startsWith(to.toLowerCase()));

  return (
    <Component
      center
      inline
      id="text-field-composition-suggestions"
      log={log}
      title="Suggestions"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Label>To:</TextField.Label>
              <TextField.Control
                aria-autocomplete="list"
                autoComplete="off"
                value={to}
                onValueChange={setTo}
              />
              <TextField.Clear />
            </TextField.Root>
            {matching.map((name) => (
              <List.Item key={name}>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => {
                    addLog(`to: ${name}`);
                    setTo(name);
                  }}
                >
                  {name}
                </List.Title>
              </List.Item>
            ))}
          </List.Group>
          <List.Footer>Type a letter, e.g. “a”.</List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['validation', 'Validation'],
  ['a-search-field', 'A search field'],
  ['in-a-form-list', 'In a form list'],
  ['suggestions', 'Suggestions'],
];

/** `/text-field/composition`: fields in forms, searches and suggestions. */
export const TextFieldComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="validation"
      level={2}
    >
      Validation
    </Heading>
    <ul>
      <li>
        The browser’s constraints (<code>required</code>, <code>minLength</code>
        , <code>type=&quot;email&quot;</code>) and the app’s (
        <code>validate</code>: a message, or <code>null</code>).
      </li>
      <li>
        One{' '}
        <PartLink
          component="text-field"
          part="TextField.Error"
        />{' '}
        per reason (<code>match</code>); the custom one’s text is{' '}
        <code>validate</code>’s message.
      </li>
      <li>
        Checked on leaving a field (
        <code>validationMode=&quot;onBlur&quot;</code>
        ), and all on submitting the <a href="form">Form</a>: invalid, it isn’t
        submitted, its first invalid field focused; valid,{' '}
        <code>onFormSubmit</code> gets the values (by <code>name</code>).
      </li>
      <li>
        Inline, below the field: the lowest modality that works (guide{' '}
        <GuideLink to="rule-g5">G5</GuideLink>), no alert.
      </li>
    </ul>
    <CodeView code={validationCode} />
    <Validation />

    <Heading
      id="a-search-field"
      level={2}
    >
      A search field
    </Heading>
    <ul>
      <li>
        <PartLink
          component="text-field"
          part="TextField.Search"
        />
        : the capsule, a magnifier, the control (
        <code>type=&quot;search&quot;</code>: iOS’s Search key), its clear
        button.
      </li>
      <li>
        Controlled (<code>value</code>, <code>onValueChange</code>), filtering
        the rows as typed; nothing found, a footer says so.
      </li>
      <li>
        In a page’s header, a toolbar, a sidebar (see{' '}
        <a href="header/composition#a-search-field">Header</a>,{' '}
        <a href="toolbar/composition#a-search-field">Toolbar</a>).
      </li>
    </ul>
    <CodeView code={searchCode} />
    <SearchWithClear />

    <Heading
      id="in-a-form-list"
      level={2}
    >
      In a form list
    </Heading>
    <ul>
      <li>
        Fields as rows (<code>render={'{<List.Item />}'}</code>) of a grouped{' '}
        <a href="list">List</a>, in sections: a <a href="form">Form</a>’s{' '}
        <code>Fieldset</code> (its legend the section’s header).
      </li>
      <li>
        A label as the row’s title, the value after it; or no label, the
        placeholder naming it (and an <code>aria-label</code>).
      </li>
      <li>
        <code>autoComplete</code>, <code>type</code> and <code>inputMode</code>:
        iOS’s autofill and keyboards; a <code>textarea</code> for notes.
      </li>
    </ul>
    <CodeView code={formCode} />
    <InAFormList />

    <Heading
      id="suggestions"
      level={2}
    >
      Suggestions
    </Heading>
    <ul>
      <li>
        Mail’s recipients: matching contacts as rows below the field, pressed to
        fill it.
      </li>
      <li>
        Or the browser’s: a <code>{'<datalist>'}</code> by the control’s{' '}
        <code>list</code> (see the{' '}
        <a href="text-field/parts#textfield-control">control’s view</a>
        ).
      </li>
      <li>
        <code>autoComplete=&quot;off&quot;</code>: the rows instead of the
        browser’s autofill.
      </li>
    </ul>
    <CodeView code={suggestionsCode} />
    <Suggestions />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const textFieldCompositionDemos = [
  Validation,
  SearchWithClear,
  InAFormList,
  Suggestions,
];
