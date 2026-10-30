import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  Fieldset,
  Form,
  List,
  Symbol,
  TextField,
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
import { GuideLink } from '../hig-guide/link.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const validationCode = `const taken = ['admin', 'root'];

<Form onFormSubmit={(values) => {…}}>
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
          <List.Content>
            <TextField.Label>Username</TextField.Label>
          </List.Content>
          <List.Trailing>
            <TextField.Control required minLength={3} />
          </List.Trailing>
          <List.Below>
            <TextField.Error match="valueMissing">Required.</TextField.Error>
            <TextField.Error match="tooShort">At least 3 characters.</TextField.Error>
            <TextField.Error match="customError" />
          </List.Below>
        </TextField.Root>
        <TextField.Root name="email" render={<List.Item />} validationMode="onBlur">
          <List.Content>
            <TextField.Label>Email</TextField.Label>
          </List.Content>
          <List.Trailing>
            <TextField.Control required type="email" />
          </List.Trailing>
          <List.Below>
            <TextField.Error match="typeMismatch">Not an email address.</TextField.Error>
          </List.Below>
        </TextField.Root>
      </List.Group>
      <List.Footer>Try “kate” as a username.</List.Footer>
      {/* Its actions: below the group, as wide as it. */}
      <List.Footer>
        <Button.Root fill size="large" type="submit" variant="bordered-prominent">
          <Button.Label>Sign Up</Button.Label>
        </Button.Root>
      </List.Footer>
    </List.Section>
  </List.Root>
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
    <Fieldset.Legend>
      <List.Title>Contact</List.Title>
    </Fieldset.Legend>
    <List.Group>
      <TextField.Root render={<List.Item />}>
        <List.Content>
          <TextField.Label>Name</TextField.Label>
        </List.Content>
        <List.Trailing>
          <TextField.Control autoComplete="name" placeholder="Required" />
          <TextField.Clear />
        </List.Trailing>
      </TextField.Root>
      <TextField.Root render={<List.Item />}>
        <List.Content>
          <TextField.Label>Phone</TextField.Label>
        </List.Content>
        <List.Trailing>
          <TextField.Control autoComplete="tel" type="tel" />
          <TextField.Clear />
        </List.Trailing>
      </TextField.Root>
    </List.Group>
  </Fieldset.Root>
  <Fieldset.Root>
    <Fieldset.Legend>
      <List.Title>Notes</List.Title>
    </Fieldset.Legend>
    <List.Group>
      {/* No label: the placeholder shows, aria-label names it. */}
      <TextField.Root render={<List.Item />}>
        <List.Span>
          <TextField.Control
            aria-label="Notes"
            placeholder="Anything else?"
            render={<textarea />}
          />
        </List.Span>
      </TextField.Root>
    </List.Group>
  </Fieldset.Root>
</List.Root>`;

const suggestionsCode = `const contacts = ['Anna Hall', 'Daniel Hughes', 'David Turner', 'Kate Brown'];
// Its words starting with the text typed.
const matches = (name, text) =>
  name
    .toLowerCase()
    .split(' ')
    .some((word) => word.startsWith(text.toLowerCase()));
const [to, setTo] = useState('');
const matching = to ? contacts.filter((name) => matches(name, to)) : [];

<TextField.Root render={<List.Item />}>
  <List.Content>
    <TextField.Label>To:</TextField.Label>
  </List.Content>
  <List.Trailing>
    <TextField.Control
      aria-autocomplete="list"
      autoComplete="off"
      value={to}
      onValueChange={setTo}
    />
    <TextField.Clear />
  </List.Trailing>
</TextField.Root>
{matching.map((name) => (
  <List.Item key={name}>
    <List.Content>
      <List.Title render={<button type="button" />} onClick={() => setTo(name)}>
        {name}
      </List.Title>
    </List.Content>
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
      hasInputGuards
      isCentered
      isInline
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
                <List.Content>
                  <TextField.Label>Username</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    required
                    autoCapitalize="none"
                    autoComplete="username"
                    minLength={3}
                  />
                  <TextField.Clear />
                </List.Trailing>
                <List.Below>
                  <TextField.Error match="valueMissing">
                    Required.
                  </TextField.Error>
                  <TextField.Error match="tooShort">
                    At least 3 characters.
                  </TextField.Error>
                  <TextField.Error match="customError" />
                </List.Below>
              </TextField.Root>
              <TextField.Root
                name="email"
                render={<List.Item />}
                validationMode="onBlur"
              >
                <List.Content>
                  <TextField.Label>Email</TextField.Label>
                </List.Content>
                <List.Trailing>
                  <TextField.Control
                    required
                    autoComplete="email"
                    type="email"
                  />
                  <TextField.Clear />
                </List.Trailing>
                <List.Below>
                  <TextField.Error match="valueMissing">
                    Required.
                  </TextField.Error>
                  <TextField.Error match="typeMismatch">
                    Not an email address.
                  </TextField.Error>
                </List.Below>
              </TextField.Root>
            </List.Group>
            <List.Footer>Try “kate” as a username.</List.Footer>
            <List.Footer>
              <Button.Root
                fill
                size="large"
                type="submit"
                variant="bordered-prominent"
              >
                <Button.Label>Sign Up</Button.Label>
              </Button.Root>
            </List.Footer>
          </List.Section>
        </List.Root>
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
      hasInputGuards
      isCentered
      isInline
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
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
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
      hasInputGuards
      isCentered
      isInline
      id="text-field-composition-form"
      log={log}
      title="Fields in a form list"
    >
      <List.Root className="text-field-demo-list">
        <Fieldset.Root>
          <Fieldset.Legend>
            <List.Title>Contact</List.Title>
          </Fieldset.Legend>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <List.Content>
                <TextField.Label>Name</TextField.Label>
              </List.Content>
              <List.Trailing>
                <TextField.Control
                  autoComplete="name"
                  placeholder="Required"
                  onValueChange={(value: string) => addLog(`name: ${value}`)}
                />
                <TextField.Clear />
              </List.Trailing>
            </TextField.Root>
            <TextField.Root render={<List.Item />}>
              <List.Content>
                <TextField.Label>Phone</TextField.Label>
              </List.Content>
              <List.Trailing>
                <TextField.Control
                  autoComplete="tel"
                  type="tel"
                  onValueChange={(value: string) => addLog(`phone: ${value}`)}
                />
                <TextField.Clear />
              </List.Trailing>
            </TextField.Root>
          </List.Group>
        </Fieldset.Root>
        <Fieldset.Root>
          <Fieldset.Legend>
            <List.Title>Address</List.Title>
          </Fieldset.Legend>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <List.Trailing>
                <TextField.Control
                  aria-label="Street"
                  autoComplete="street-address"
                  placeholder="Street"
                />
                <TextField.Clear />
              </List.Trailing>
            </TextField.Root>
            <TextField.Root render={<List.Item />}>
              <List.Trailing>
                <TextField.Control
                  aria-label="Postal code"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  placeholder="Postal code"
                />
                <TextField.Clear />
              </List.Trailing>
            </TextField.Root>
          </List.Group>
        </Fieldset.Root>
        <Fieldset.Root>
          <Fieldset.Legend>
            <List.Title>Notes</List.Title>
          </Fieldset.Legend>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <List.Span>
                <TextField.Control
                  aria-label="Notes"
                  placeholder="Anything else?"
                  render={<textarea />}
                />
              </List.Span>
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
      hasInputGuards
      isCentered
      isInline
      id="text-field-composition-suggestions"
      log={log}
      title="Suggestions"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <List.Content>
                <TextField.Label>To:</TextField.Label>
              </List.Content>
              <List.Trailing>
                <TextField.Control
                  aria-autocomplete="list"
                  autoComplete="off"
                  value={to}
                  onValueChange={setTo}
                />
                <TextField.Clear />
              </List.Trailing>
            </TextField.Root>
            {matching.map((name) => (
              <List.Item key={name}>
                <List.Content>
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => {
                      addLog(`to: ${name}`);
                      setTo(name);
                    }}
                  >
                    {name}
                  </List.Title>
                </List.Content>
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
      <li>
        <strong>Library:</strong> the field’s constraints and{' '}
        <code>validate</code>, its errors (
        <PartLink
          component="text-field"
          part="TextField.Error"
        />
        , one per reason), <code>validationMode</code> and Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />
        .
      </li>
      <li>
        <strong>Demo:</strong> the custom rule, and logging what’s submitted.
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
      <li>
        <strong>Library:</strong> the search field (
        <PartLink
          component="text-field"
          part="TextField.Search"
        />
        ): the capsule, magnifier and clear button (
        <PartLink
          component="text-field"
          part="TextField.Clear"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the query (the app’s state), filtering the rows
        and the footer when nothing’s found.
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
        Fields as rows (
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        ) of a grouped <a href="list">List</a>, in sections: a{' '}
        <a href="form">Form</a>’s{' '}
        <PartLink
          component="form"
          part="Fieldset.Root"
        >
          Fieldset
        </PartLink>{' '}
        (its legend the section’s header).
      </li>
      <li>
        A label as the row’s title, the value after it; or no label, the
        placeholder naming it (and an <code>aria-label</code>).
      </li>
      <li>
        <code>autoComplete</code>, <code>type</code> and <code>inputMode</code>:
        iOS’s autofill and keyboards; a <code>textarea</code> for notes.
      </li>
      <li>
        <strong>Library:</strong> the fields as rows of a grouped list in a{' '}
        <PartLink
          component="form"
          part="Fieldset.Root"
        />
        , their labels, <code>autoComplete</code>, <code>type</code> and{' '}
        <code>inputMode</code>.
      </li>
      <li>
        <strong>Demo:</strong> the fields and their names.
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
      <li>
        <strong>Library:</strong> the field and the list of rows below it.
      </li>
      <li>
        <strong>Demo:</strong> the recipient (the app’s state), matching
        contacts, and filling the field when a row is pressed.
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
