import { FunctionComponent, useMemo } from 'react';

import { List, Symbol, TextField } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfMagnifyingglass } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  textFieldClearRows,
  textFieldControlRows,
  textFieldDescriptionRows,
  textFieldErrorRows,
  textFieldFrameRows,
  textFieldItemRows,
  textFieldLabelRows,
  textFieldRootRows,
  textFieldValidityRows,
} from './docs.js';
import {
  getPropOptionsClear,
  getPropOptionsControl,
  propOptionsError,
  propOptionsGuideFrame,
  propOptionsGuideLabel,
  propOptionsGuideRoot,
  propOptionsPart,
  suggestionsId,
} from './props.js';

/** `TextField.Root`, outlined, as a list row. */
const RootPart: FunctionComponent = () => {
  const id = 'text-field-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGuideRoot,
    { external, isOpen: true, emphasize: 'outline', title: 'TextField.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Below': [],
          'List.Content': [],
          'List.Group': [],
          'List.Root': ['className'],
          'List.Section': [],
          'List.Trailing': [],
          'TextField.Clear': [],
          'TextField.Control': ['placeholder'],
          'TextField.Error': [],
          'TextField.Label': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="TextField.Root"
    >
      <List.Root
        {...partProps['List.Root']}
        className="text-field-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              key={elementKey}
              {...props}
            >
              <List.Content {...partProps['List.Content']}>
                <TextField.Label {...partProps['TextField.Label']}>
                  Name
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  placeholder="Required"
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <TextField.Error {...partProps['TextField.Error']} />
              </List.Below>
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
  const [control, props, state] = usePropControl(propOptionsGuideLabel, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'TextField.Label',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'TextField.Control': ['placeholder'],
          'TextField.Root': ['className'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="TextField.Label"
    >
      <TextField.Root
        {...partProps['TextField.Root']}
        className="text-field-demo-standalone"
      >
        <TextField.Label {...props}>Name</TextField.Label>
        <TextField.Control
          {...partProps['TextField.Control']}
          placeholder="Required"
        />
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
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'TextField.Control',
    },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Below': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Trailing': [],
            'TextField.Clear': [],
            'TextField.Error': [],
            'TextField.Label': [],
            'TextField.Root': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TextField.Control"
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
                  Name
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  key={elementKey}
                  {...props}
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <TextField.Error {...partProps['TextField.Error']} />
              </List.Below>
            </TextField.Root>
          </List.Group>
        </List.Section>
        {/* The suggestions of its `list` option. */}
        <datalist id={suggestionsId}>
          <option value="Kate Brown" />
          <option value="John Doe" />
          <option value="Anna Hall" />
        </datalist>
      </List.Root>
    </Component>
  );
};

/** `TextField.Description`, outlined, below its control. */
const DescriptionPart: FunctionComponent = () => {
  const id = 'text-field-parts-description';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'TextField.Description',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Below': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['className'],
          'List.Section': [],
          'List.Trailing': [],
          'TextField.Control': ['placeholder', 'type'],
          'TextField.Label': [],
          'TextField.Root': ['render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="TextField.Description"
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
                  Email
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  placeholder="name@example.com"
                  type="email"
                />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <TextField.Description {...props}>
                  Used for receipts only.
                </TextField.Description>
              </List.Below>
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
  const [control, props, state, elementKey] = usePropControl(propOptionsError, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'TextField.Error',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Below': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['className'],
          'List.Section': [],
          'List.Trailing': [],
          'TextField.Control': ['defaultValue', 'required', 'type'],
          'TextField.Label': [],
          'TextField.Root': ['render', 'validationMode'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="TextField.Error"
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
                  defaultValue="kate@"
                  type="email"
                />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <TextField.Error
                  key={elementKey}
                  {...props}
                >
                  Not an email address.
                </TextField.Error>
              </List.Below>
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
    { external, isOpen: true, emphasize: 'outline', title: 'TextField.Clear' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Trailing': [],
            'TextField.Control': ['defaultValue'],
            'TextField.Label': [],
            'TextField.Root': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TextField.Clear"
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
                  Name
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  defaultValue="Kate Brown"
                />
                <TextField.Clear {...props} />
              </List.Trailing>
            </TextField.Root>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `TextField.Frame`, outlined: a search field's capsule. */
const FramePart: FunctionComponent = () => {
  const id = 'text-field-parts-frame';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideFrame, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'TextField.Frame',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'TextField.Clear': [],
          'TextField.Control': ['aria-label', 'placeholder', 'type'],
          'TextField.Root': ['className', 'data-glass-context'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="TextField.Frame"
    >
      {/* (On glass's colors, as in a bar: its glass looks.) */}
      <TextField.Root
        {...partProps['TextField.Root']}
        className="text-field-demo-standalone"
        data-glass-context="auto"
      >
        <TextField.Frame {...props}>
          <Symbol
            {...partProps.Symbol}
            icon={sfMagnifyingglass}
          />
          <TextField.Control
            {...partProps['TextField.Control']}
            aria-label="Search"
            placeholder="Search"
            type="search"
          />
          <TextField.Clear {...partProps['TextField.Clear']} />
        </TextField.Frame>
      </TextField.Root>
    </Component>
  );
};

/** `/text-field/parts`: its root, label, control, messages and buttons. */
export const TextFieldParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root (a list row, or on its own), its label, its control, and its
        messages below.
      </li>
      <li>
        Its own parts: a clear button, and a search field’s capsule around the
        control.
      </li>
      <li>
        It’s Base UI’s <code>Field</code>, with its parts re-exported (also{' '}
        <code>Validity</code> and <code>Item</code>, without styles).
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="list"
          part="List.Group"
        />{' '}
        <span>(when it’s a list row)</span>
        <ul>
          <li>
            <PartLink
              component="text-field"
              part="TextField.Root"
            />{' '}
            (optional: rendering a{' '}
            <PartLink
              component="list"
              part="List.Item"
            />
            )
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
                , or a{' '}
                <PartLink
                  component="text-field"
                  part="TextField.Frame"
                />{' '}
                around it
                <ul>
                  <li className="demo-tree-context">
                    <PartLink
                      component="symbol"
                      part="Symbol"
                    />{' '}
                    <span>(in a search field’s frame: the magnifier)</span>
                  </li>
                  <li>
                    <PartLink
                      component="text-field"
                      part="TextField.Clear"
                    />{' '}
                    (optional; in the search capsule, after its control)
                  </li>
                </ul>
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
      </li>
      <li>
        Also re-exported, without styles: <PartLink part="TextField.Item" />{' '}
        (for several controls in one field, not a text field’s)
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
        The field. It holds its state (disabled, invalid, touched, dirty,
        filled, focused) for its parts, and its validation (
        <code>validate</code>, <code>validationMode</code>).
      </li>
      <li>
        With{' '}
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        , it’s a list row, with its label as the row’s title and its value at
        the row’s end. Otherwise, its parts are stacked.
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
        Names the control (it’s the control’s <code>label</code>). In a row,
        it’s the row’s title, in Body. On its own, it sits above the control, in
        Subheadline.
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
        The input. It has no box of its own (it uses the row’s, or the
        capsule’s), and its value is 17px. It takes the browser’s input
        attributes, validation and keyboards.
      </li>
      <li>
        Its value: <code>value</code> or <code>defaultValue</code>, and{' '}
        <code>onValueChange</code>.
      </li>
      <li>
        Renders an <code>input</code>, or a <code>textarea</code> through{' '}
        <code>render</code>.
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
        What the field is for, below it (in Caption 1 and the secondary label
        color). It describes the control.
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
        Shows while the field is invalid (or for one reason, with{' '}
        <code>match</code>), in red, below its description. It describes the
        control.
      </li>
      <li>
        Here, it checks an email address when focus leaves it (
        <code>validationMode=&quot;onBlur&quot;</code>).
      </li>
      <li>
        Renders a <code>div</code> (nothing while hidden).
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
        Empties the control (as typing would), and leaves focus as it was (if
        the control didn’t have focus, it doesn’t get it, so no keyboard opens).
        It shows only while the field is filled, and by its <code>mode</code>:
        while the field has focus (the default, which focuses the field), while
        it doesn’t, or always.
      </li>
      <li>It’s out of the tab order, with a 44px hit area.</li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ClearPart />
    <h3>Props</h3>
    <PropsTable rows={textFieldClearRows} />

    <Heading
      id="textfield-frame"
      level={2}
    >
      <code>TextField.Frame</code>
    </Heading>
    <ul>
      <li>
        A frame around a field’s control: 36px tall, on the tertiary fill. Here,
        it’s a search field’s, with a magnifier, the control and a clear button.
      </li>
      <li>
        Pressing it anywhere focuses its control. With keyboard focus, it gets
        an outline in the tint.
      </li>
      <li>
        Its look (<code>variant</code>) follows where it sits: the capsule, a
        list row’s look, a tab bar group’s glass capsule, the collapsed tab
        bar’s glass, or a toolbar’s glass capsule (see{' '}
        <a href={publicUrl('text-field/composition#a-search-field')}>
          Composition
        </a>
        ). When it changes, it morphs from one look to the other.
      </li>
      <li>
        Renders a <code>label</code>.
      </li>
    </ul>
    <FramePart />
    <h3>Props</h3>
    <PropsTable rows={textFieldFrameRows} />

    <Heading
      id="textfield-validity"
      level={2}
    >
      <code>TextField.Validity</code>
    </Heading>
    <ul>
      <li>
        Base UI’s: it renders its children function with the field’s validity
        (for example to show its own messages). It has no styles, and no element
        of its own.
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
        group’s), not a text field’s. It has no styles, and renders a{' '}
        <code>div</code>.
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
  FramePart,
];
