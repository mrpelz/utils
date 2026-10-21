import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { FunctionComponent, useMemo } from 'react';

import { List, Symbol, TextField } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  textFieldClearRows,
  textFieldControlRows,
  textFieldDescriptionRows,
  textFieldErrorRows,
  textFieldItemRows,
  textFieldLabelRows,
  textFieldRootRows,
  textFieldSearchRows,
  textFieldValidityRows,
} from './docs.js';
import {
  getPropOptionsClear,
  getPropOptionsControl,
  propOptionsError,
  propOptionsGuideLabel,
  propOptionsGuideRoot,
  propOptionsGuideSearch,
  propOptionsPart,
  suggestionsId,
} from './props.js';

/** `TextField.Root`, outlined, as a list row. */
const RootPart: FunctionComponent = () => {
  const id = 'text-field-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGuideRoot,
    'TextField.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="TextField.Root"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root
              key={elementKey}
              {...props}
            >
              <TextField.Label>Name</TextField.Label>
              <TextField.Control placeholder="Required" />
              <TextField.Clear />
              <TextField.Error />
            </TextField.Root>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `TextField.Label`, outlined: standalone, above its control. */
const LabelPart: FunctionComponent = () => {
  const id = 'text-field-parts-label';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideLabel,
    'TextField.Label',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="TextField.Label"
    >
      <TextField.Root className="text-field-demo-standalone">
        <TextField.Label {...props}>Name</TextField.Label>
        <TextField.Control placeholder="Required" />
      </TextField.Root>
    </Component>
  );
};

/** `TextField.Control`, outlined, with its props (and suggestions). */
const ControlPart: FunctionComponent = () => {
  const id = 'text-field-parts-control';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsControl(addLog), [addLog]),
    'TextField.Control',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="TextField.Control"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Label>Name</TextField.Label>
              <TextField.Control
                key={elementKey}
                {...props}
              />
              <TextField.Clear />
              <TextField.Error />
            </TextField.Root>
          </List.Group>
        </List.Section>
        {/* The suggestions of its `list` option. */}
        <datalist id={suggestionsId}>
          <option value="Kate Bell" />
          <option value="John Appleseed" />
          <option value="Anna Haro" />
        </datalist>
      </List.Root>
    </Component>
  );
};

/** `TextField.Description`, outlined, below its control. */
const DescriptionPart: FunctionComponent = () => {
  const id = 'text-field-parts-description';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'TextField.Description',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="TextField.Description"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Label>Email</TextField.Label>
              <TextField.Control
                placeholder="name@example.com"
                type="email"
              />
              <TextField.Description {...props}>
                Used for receipts only.
              </TextField.Description>
            </TextField.Root>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `TextField.Error`, outlined: an email address, checked on leaving it. */
const ErrorPart: FunctionComponent = () => {
  const id = 'text-field-parts-error';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsError,
    'TextField.Error',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="TextField.Error"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root
              render={<List.Item />}
              validationMode="onBlur"
            >
              <TextField.Label>Email</TextField.Label>
              <TextField.Control
                required
                defaultValue="kate@"
                type="email"
              />
              <TextField.Error
                key={elementKey}
                {...props}
              >
                Not an email address.
              </TextField.Error>
            </TextField.Root>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `TextField.Clear`, outlined: focus the field to show it. */
const ClearPart: FunctionComponent = () => {
  const id = 'text-field-parts-clear';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsClear(addLog), [addLog]),
    'TextField.Clear',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="TextField.Clear"
    >
      <List.Root className="text-field-demo-list">
        <List.Section>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Label>Name</TextField.Label>
              <TextField.Control defaultValue="Kate Bell" />
              <TextField.Clear {...props} />
            </TextField.Root>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `TextField.Search`, outlined: a search field's capsule. */
const SearchPart: FunctionComponent = () => {
  const id = 'text-field-parts-search';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideSearch,
    'TextField.Search',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="TextField.Search"
    >
      <TextField.Root className="text-field-demo-standalone">
        <TextField.Search {...props}>
          <Symbol icon={sfMagnifyingglass} />
          <TextField.Control
            aria-label="Search"
            placeholder="Search"
            type="search"
          />
          <TextField.Clear />
        </TextField.Search>
      </TextField.Root>
    </Component>
  );
};

/** `/text-field/parts`: its root, label, control, messages and buttons. */
export const TextFieldParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root (a list row, or standalone), its label, its control, and its
        messages below.
      </li>
      <li>
        Its own: a clear button, and a search field’s capsule around the
        control.
      </li>
      <li>
        Base UI’s <code>Field</code>, its parts re-exported (also{' '}
        <code>Validity</code> and <code>Item</code>, unstyled).
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="text-field"
          part="TextField.Root"
        />
        <ul>
          <li>
            <PartLink
              component="text-field"
              part="TextField.Label"
            />{' '}
            (optional)
          </li>
          <li>
            <PartLink
              component="text-field"
              part="TextField.Control"
            />
            , or{' '}
            <PartLink
              component="text-field"
              part="TextField.Search"
            />{' '}
            around it
          </li>
          <li>
            <PartLink
              component="text-field"
              part="TextField.Clear"
            />{' '}
            (optional; in the search capsule, after its control)
          </li>
          <li>
            <PartLink
              component="text-field"
              part="TextField.Description"
            />{' '}
            (optional)
          </li>
          <li>
            <PartLink
              component="text-field"
              part="TextField.Error"
            />{' '}
            (optional)
          </li>
          <li>
            <PartLink
              component="text-field"
              part="TextField.Validity"
            />{' '}
            (optional)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="textfield-root"
      level={2}
    >
      <code>TextField.Root</code>
    </Heading>
    <ul>
      <li>
        The field: its state (disabled, invalid, touched, dirty, filled,
        focused) for its parts; its validation (<code>validate</code>,{' '}
        <code>validationMode</code>).
      </li>
      <li>
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        : a list row (its label the row’s title, its value at the row’s end);
        otherwise its parts stacked.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldRootRows} />

    <Heading
      id="textfield-label"
      level={2}
    >
      <code>TextField.Label</code>
    </Heading>
    <ul>
      <li>
        Names the control (it’s its <code>label</code>). In a row: the row’s
        title, in Body; standalone, above it, in Subheadline.
      </li>
      <li>
        Renders a <code>label</code>.
      </li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldLabelRows} />

    <Heading
      id="textfield-control"
      level={2}
    >
      <code>TextField.Control</code>
    </Heading>
    <ul>
      <li>
        The input: no box of its own (the row’s, or the capsule’s), its value
        17px; the browser’s input attributes, validation and keyboards.
      </li>
      <li>
        Value: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code>.
      </li>
      <li>
        Renders an <code>input</code> (<code>render</code>: a{' '}
        <code>textarea</code>).
      </li>
    </ul>
    <ControlPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldControlRows} />

    <Heading
      id="textfield-description"
      level={2}
    >
      <code>TextField.Description</code>
    </Heading>
    <ul>
      <li>
        What the field is for, below it (Caption 1, the secondary label color);
        describing the control.
      </li>
      <li>
        Renders a <code>p</code>.
      </li>
    </ul>
    <DescriptionPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldDescriptionRows} />

    <Heading
      id="textfield-error"
      level={2}
    >
      <code>TextField.Error</code>
    </Heading>
    <ul>
      <li>
        Shown while the field is invalid (or for one reason, <code>match</code>
        ), in red, below its description; describing the control.
      </li>
      <li>
        Here: an email address, checked as you leave it (
        <code>validationMode=&quot;onBlur&quot;</code>).
      </li>
      <li>
        Renders a <code>div</code> (none while hidden).
      </li>
    </ul>
    <ErrorPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldErrorRows} />

    <Heading
      id="textfield-clear"
      level={2}
    >
      <code>TextField.Clear</code>
    </Heading>
    <ul>
      <li>
        Empties the control (as typing would), focusing it; shown only while the
        field is filled, and by its <code>mode</code>: while it’s focused (the
        default: focus the field), while it isn’t, or always.
      </li>
      <li>Out of the tab order; its hit area 44px.</li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ClearPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldClearRows} />

    <Heading
      id="textfield-search"
      level={2}
    >
      <code>TextField.Search</code>
    </Heading>
    <ul>
      <li>
        A search field’s capsule (Figma “Search Field”): 36px high, on the
        tertiary fill; a magnifier, the control, a clear button.
      </li>
      <li>
        Pressed anywhere, it focuses its control; focused by keyboard, an
        outline in the tint.
      </li>
      <li>
        Renders a <code>label</code>.
      </li>
    </ul>
    <SearchPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldSearchRows} />

    <Heading
      id="textfield-validity"
      level={2}
    >
      <code>TextField.Validity</code>
    </Heading>
    <ul>
      <li>
        Base UI’s: renders its children function with the field’s validity (e.g.
        to show its own messages). Unstyled; no element of its own.
      </li>
    </ul>
    <h3>Props</h3>
    <PropsTable rows={textFieldValidityRows} />

    <Heading
      id="textfield-item"
      level={2}
    >
      <code>TextField.Item</code>
    </Heading>
    <ul>
      <li>
        Base UI’s: one of several controls in a field (a checkbox or radio
        group’s), not a text field’s. Unstyled; renders a <code>div</code>.
      </li>
    </ul>
    <h3>Props</h3>
    <PropsTable rows={textFieldItemRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const textFieldPartsDemos = [
  RootPart,
  LabelPart,
  ControlPart,
  DescriptionPart,
  ErrorPart,
  ClearPart,
  SearchPart,
];
