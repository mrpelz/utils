import { FunctionComponent, useMemo, useState } from 'react';

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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfMagnifyingglass } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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
  <TextField.Frame>
    <Symbol icon={sfMagnifyingglass} />
    <TextField.Control
      aria-label="Search"
      placeholder="Search"
      type="search"
      value={query}
      onValueChange={setQuery}
    />
    <TextField.Clear />
  </TextField.Frame>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['className', 'onFormSubmit'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'List.Below': [],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Trailing': [],
            'TextField.Clear': [],
            'TextField.Control': [
              'autoCapitalize',
              'autoComplete',
              'minLength',
              'required',
              'type',
            ],
            'TextField.Error': ['match'],
            'TextField.Label': [],
            'TextField.Root': ['name', 'render', 'validate', 'validationMode'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('text-field-composition-validation') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="text-field-composition-validation"
      log={log}
      state={[partState]}
      title="Validation"
    >
      <Form
        {...partProps.Form}
        className="text-field-demo-form"
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submit: ${JSON.stringify(values)}`)
        }
      >
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <TextField.Root
                {...partProps['TextField.Root']}
                name="username"
                render={<List.Item {...partProps['List.Item']} />}
                validationMode="onBlur"
                validate={(value: unknown) =>
                  taken.includes(String(value))
                    ? 'This username is taken.'
                    : null
                }
              >
                <List.Content {...partProps['List.Content']}>
                  <TextField.Label {...partProps['TextField.Label']}>
                    Username
                  </TextField.Label>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <TextField.Control
                    {...partProps['TextField.Control']}
                    required
                    autoCapitalize="none"
                    autoComplete="username"
                    minLength={3}
                  />
                  <TextField.Clear {...partProps['TextField.Clear']} />
                </List.Trailing>
                <List.Below {...partProps['List.Below']}>
                  <TextField.Error
                    {...partProps['TextField.Error']}
                    match="valueMissing"
                  >
                    Required.
                  </TextField.Error>
                  <TextField.Error
                    {...partProps['TextField.Error']}
                    match="tooShort"
                  >
                    At least 3 characters.
                  </TextField.Error>
                  <TextField.Error
                    {...partProps['TextField.Error']}
                    match="customError"
                  />
                </List.Below>
              </TextField.Root>
              <TextField.Root
                {...partProps['TextField.Root']}
                name="email"
                render={<List.Item {...partProps['List.Item']} />}
                validationMode="onBlur"
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
                    autoComplete="email"
                    type="email"
                  />
                  <TextField.Clear {...partProps['TextField.Clear']} />
                </List.Trailing>
                <List.Below {...partProps['List.Below']}>
                  <TextField.Error
                    {...partProps['TextField.Error']}
                    match="valueMissing"
                  >
                    Required.
                  </TextField.Error>
                  <TextField.Error
                    {...partProps['TextField.Error']}
                    match="typeMismatch"
                  >
                    Not an email address.
                  </TextField.Error>
                </List.Below>
              </TextField.Root>
            </List.Group>
            <List.Footer {...partProps['List.Footer']}>
              Try “kate” as a username.
            </List.Footer>
            <List.Footer {...partProps['List.Footer']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'TextField.Clear': [],
          'TextField.Control': [
            'aria-label',
            'onValueChange',
            'placeholder',
            'type',
            'value',
          ],
          'TextField.Frame': [],
          'TextField.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState('text-field-composition-search') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="text-field-composition-search"
      state={[partState]}
      title="A search field"
    >
      <div className="text-field-demo-search">
        <TextField.Root {...partProps['TextField.Root']}>
          <TextField.Frame {...partProps['TextField.Frame']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfMagnifyingglass}
            />
            <TextField.Control
              {...partProps['TextField.Control']}
              aria-label="Search"
              placeholder="Search"
              type="search"
              value={query}
              onValueChange={setQuery}
            />
            <TextField.Clear {...partProps['TextField.Clear']} />
          </TextField.Frame>
        </TextField.Root>
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {matching.map((name) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
            {matching.length === 0 ? (
              <List.Footer {...partProps['List.Footer']}>
                No results for “{query}”.
              </List.Footer>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Fieldset.Legend': [],
            'Fieldset.Root': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['className'],
            'List.Span': [],
            'List.Title': [],
            'List.Trailing': [],
            'TextField.Clear': [],
            'TextField.Control': [
              'aria-label',
              'autoComplete',
              'inputMode',
              'onValueChange',
              'placeholder',
              'render',
              'type',
            ],
            'TextField.Label': [],
            'TextField.Root': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('text-field-composition-form') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="text-field-composition-form"
      log={log}
      state={[partState]}
      title="Fields in a form list"
    >
      <List.Root
        {...partProps['List.Root']}
        className="text-field-demo-list"
      >
        <Fieldset.Root {...partProps['Fieldset.Root']}>
          <Fieldset.Legend {...partProps['Fieldset.Legend']}>
            <List.Title {...partProps['List.Title']}>Contact</List.Title>
          </Fieldset.Legend>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              {...partProps['TextField.Root']}
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
                  autoComplete="name"
                  placeholder="Required"
                  onValueChange={(value: string) => addLog(`name: ${value}`)}
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
            </TextField.Root>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Content {...partProps['List.Content']}>
                <TextField.Label {...partProps['TextField.Label']}>
                  Phone
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  autoComplete="tel"
                  type="tel"
                  onValueChange={(value: string) => addLog(`phone: ${value}`)}
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
            </TextField.Root>
          </List.Group>
        </Fieldset.Root>
        <Fieldset.Root {...partProps['Fieldset.Root']}>
          <Fieldset.Legend {...partProps['Fieldset.Legend']}>
            <List.Title {...partProps['List.Title']}>Address</List.Title>
          </Fieldset.Legend>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  aria-label="Street"
                  autoComplete="street-address"
                  placeholder="Street"
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
            </TextField.Root>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  aria-label="Postal code"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  placeholder="Postal code"
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
            </TextField.Root>
          </List.Group>
        </Fieldset.Root>
        <Fieldset.Root {...partProps['Fieldset.Root']}>
          <Fieldset.Legend {...partProps['Fieldset.Legend']}>
            <List.Title {...partProps['List.Title']}>Notes</List.Title>
          </Fieldset.Legend>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Span {...partProps['List.Span']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'TextField.Clear': [],
            'TextField.Control': [
              'aria-autocomplete',
              'autoComplete',
              'onValueChange',
              'value',
            ],
            'TextField.Label': [],
            'TextField.Root': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('text-field-composition-suggestions') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="text-field-composition-suggestions"
      log={log}
      state={[partState]}
      title="Suggestions"
    >
      <List.Root
        {...partProps['List.Root']}
        className="text-field-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Content {...partProps['List.Content']}>
                <TextField.Label {...partProps['TextField.Label']}>
                  To:
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  aria-autocomplete="list"
                  autoComplete="off"
                  value={to}
                  onValueChange={setTo}
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
            </TextField.Root>
            {matching.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title
                    {...partProps['List.Title']}
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
          <List.Footer {...partProps['List.Footer']}>
            Type a letter, e.g. “a”.
          </List.Footer>
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
        , <code>type=&quot;email&quot;</code>) and the app’s own (
        <code>validate</code>, which returns a message or <code>null</code>).
      </li>
      <li>
        There’s one{' '}
        <PartLink
          component="text-field"
          part="TextField.Error"
        />{' '}
        per reason (<code>match</code>). The custom one’s text is{' '}
        <code>validate</code>’s message.
      </li>
      <li>
        Each field is checked when focus leaves it (
        <code>validationMode=&quot;onBlur&quot;</code>), and all of them when
        the <a href={publicUrl('form')}>Form</a> is submitted. If anything is
        invalid, it isn’t submitted, and the first invalid field gets focus. If
        everything is valid, <code>onFormSubmit</code> gets the values (by{' '}
        <code>name</code>).
      </li>
      <li>
        The errors show inline, below the field. That’s the least interrupting
        way that works, without an alert.
      </li>
      <li>
        <strong>Library:</strong> the field’s constraints and{' '}
        <code>validate</code>, its errors (
        <PartLink
          component="text-field"
          part="TextField.Error"
        />
        , one per reason), <code>validationMode</code>, and Base UI’s{' '}
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
          part="TextField.Frame"
        />
        : the capsule, a magnifier, the control (
        <code>type=&quot;search&quot;</code>, for the keyboard’s Search key) and
        its clear button.
      </li>
      <li>
        It’s controlled (<code>value</code>, <code>onValueChange</code>) and
        filters the rows as you type. When nothing is found, a footer says so.
      </li>
      <li>
        It can sit in a page’s header, a toolbar or a sidebar (see{' '}
        <a href={publicUrl('header/composition#a-search-field')}>Header</a> and{' '}
        <a href={publicUrl('toolbar/composition#a-search-field')}>Toolbar</a>).
      </li>
      <li>
        Its look follows where it sits (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />{' '}
        <code>variant</code>). Only its look changes; it stays a search field.
        <ul>
          <li>
            <code>fill</code> (the default): the capsule on the tertiary fill,
            on a page or in a sidebar (as here).
          </li>
          <li>
            <code>row</code>: a list row’s background, height and corners, next
            to an inset grouped list, for example in a{' '}
            <PartLink
              component="header"
              part="Header.Accessory"
            />{' '}
            above it (
            <a href={publicUrl('header/composition#a-search-field')}>Header</a>
            ).
          </li>
          <li>
            <code>tab-bar</code>: a group’s glass capsule, as tall as its tabs,
            in a{' '}
            <PartLink
              component="tab-bar"
              part="TabBar.List"
            />{' '}
            next to a{' '}
            <PartLink
              component="tab-bar"
              part="TabBar.Group"
            />
            , taking the free space (
            <a
              href={publicUrl(
                'tab-bar/composition#a-search-field-beside-the-tabs',
              )}
            >
              Tab Bar
            </a>
            ).
          </li>
          <li>
            <code>tab-bar-collapsed</code>: no capsule of its own, on the glass
            of a{' '}
            <PartLink
              component="tab-bar"
              part="TabBar.Accessory"
            />{' '}
            shown in the collapsed bar, filling it (
            <a href={publicUrl('tab-bar/composition#search')}>Tab Bar</a>).
          </li>
          <li>
            <code>toolbar</code>: a glass capsule as tall as the bar’s buttons,
            in a{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Root"
            />{' '}
            between them, taking the free space (
            <a href={publicUrl('toolbar/composition#a-search-field')}>
              Toolbar
            </a>
            ).
          </li>
        </ul>
        Its glass takes the bar’s colors (its glass context). In a bar at the
        bottom, a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        tracks the keyboard and pushes the bar up.
      </li>
      <li>
        <strong>Library:</strong> the search field (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />
        ): the capsule, the magnifier and the clear button (
        <PartLink
          component="text-field"
          part="TextField.Clear"
        />
        ), and its looks (<code>variant</code>).
      </li>
      <li>
        <strong>Demo:</strong> the query (the app’s state), filtering the rows,
        and the footer when nothing is found.
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
        Fields are rows (
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        ) of a grouped <a href={publicUrl('list')}>List</a>, in sections: a{' '}
        <a href={publicUrl('form')}>Form</a>’s{' '}
        <PartLink
          component="form"
          part="Fieldset.Root"
        >
          Fieldset
        </PartLink>{' '}
        (with the section’s header as its legend).
      </li>
      <li>
        A label is the row’s title, with the value after it. Without a label,
        the placeholder names it (along with an <code>aria-label</code>).
      </li>
      <li>
        <code>autoComplete</code>, <code>type</code> and <code>inputMode</code>{' '}
        pick the autofill and the on-screen keyboard. Notes get a{' '}
        <code>textarea</code>.
      </li>
      <li>
        <strong>Library:</strong> the fields as rows of a grouped list in a{' '}
        <PartLink
          component="form"
          part="Fieldset.Root"
        />
        , their labels, and <code>autoComplete</code>, <code>type</code> and{' '}
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
        As for a mail app’s recipients: matching contacts show as rows below the
        field, and pressing one fills it.
      </li>
      <li>
        Or use the browser’s: a <code>{'<datalist>'}</code>, through the
        control’s <code>list</code> (see the{' '}
        <a href={publicUrl('text-field/parts#textfield-control')}>
          control’s view
        </a>
        ).
      </li>
      <li>
        <code>autoComplete=&quot;off&quot;</code> shows the rows instead of the
        browser’s autofill.
      </li>
      <li>
        <strong>Library:</strong> the field, and the list of rows below it.
      </li>
      <li>
        <strong>Demo:</strong> the recipient (the app’s state), the matching
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
