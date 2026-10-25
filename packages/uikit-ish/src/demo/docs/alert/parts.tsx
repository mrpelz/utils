import '../sheet/style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Alert,
  Button,
  useCreateAlertHandle,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  alertActionRows,
  alertActionsRows,
  alertDescriptionRows,
  alertFieldRows,
  alertFieldsRows,
  alertHandleRows,
  alertHandleTypeRows,
  alertHeaderRows,
  alertPopupRows,
  alertRootRows,
  alertTitleRows,
  alertTriggerRows,
} from './docs.js';
import {
  getPropOptionsField,
  getPropOptionsGuideRoot,
  propOptionsAction,
  propOptionsActions,
  propOptionsElement,
  propOptionsPart,
  propOptionsPopup,
  propOptionsTrigger,
} from './props.js';

// Every view writes out its alert (deleting a note; a folder renamed, for
// its fields), in a phone's screen (its container), the part's props on
// that part, so its code shows as it'd be used.

/** `Alert.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'alert-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Alert.Root' },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Root"
    >
      <Viewport.Content>
        <Alert.Root
          key={elementKey}
          {...props}
        >
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'alert-parts-trigger';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTrigger, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Trigger',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Trigger"
    >
      <Viewport.Content>
        <Alert.Root>
          <Alert.Trigger {...props}>
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'alert-parts-popup';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Popup',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Popup"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...props}>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Header`, outlined, with its props. */
const HeaderPart: FunctionComponent = () => {
  const id = 'alert-parts-header';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Header',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Header"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header {...props}>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Title`, outlined, with its props. */
const TitlePart: FunctionComponent = () => {
  const id = 'alert-parts-title';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Title',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Title"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title {...props}>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Description`, outlined, with its props. */
const DescriptionPart: FunctionComponent = () => {
  const id = 'alert-parts-description';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Description',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Description"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description {...props}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Fields`, outlined, with its props. */
const FieldsPart: FunctionComponent = () => {
  const id = 'alert-parts-fields';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Fields',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Fields"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Rename Folder</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Rename Folder</Alert.Title>
              <Alert.Description>
                Enter a name for this folder.
              </Alert.Description>
            </Alert.Header>
            <Alert.Fields {...props}>
              <Alert.Field
                aria-label="Name"
                defaultValue="Recipes"
                placeholder="Name"
              />
            </Alert.Fields>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="primary">Save</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Field`, outlined, with its props. */
const FieldPart: FunctionComponent = () => {
  const id = 'alert-parts-field';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsField(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Alert.Field' },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Field"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Rename Folder</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Rename Folder</Alert.Title>
              <Alert.Description>
                Enter a name for this folder.
              </Alert.Description>
            </Alert.Header>
            <Alert.Fields>
              <Alert.Field
                aria-label="Name"
                {...props}
              />
            </Alert.Fields>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="primary">Save</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Actions`, outlined, with its props. */
const ActionsPart: FunctionComponent = () => {
  const id = 'alert-parts-actions';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsActions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Actions',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Actions"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...props}>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `Alert.Action`, outlined, with its props. */
const ActionPart: FunctionComponent = () => {
  const id = 'alert-parts-action';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsAction, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Alert.Action',
  });

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Alert.Action"
    >
      <Viewport.Content>
        <Alert.Root defaultOpen>
          <Alert.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Note</Button.Label>
          </Alert.Trigger>
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action {...props}>Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

// Its trigger and its button, outside the root: made once, here.
const deleteAlert = codeLabel(Alert.createHandle(), 'deleteAlert');

/** `Alert.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'alert-parts-create-handle';
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="Alert.createHandle"
    >
      <Viewport.Content>
        <Alert.Trigger
          handle={deleteAlert}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Delete Note</Button.Label>
        </Alert.Trigger>
        <Button.Root
          variant="borderless"
          onClick={() => deleteAlert.open(null)}
        >
          <Button.Label>Open Imperatively</Button.Label>
        </Button.Root>
        <Alert.Root
          handle={deleteAlert}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          <Alert.Popup>
            <Alert.Header>
              <Alert.Title>Delete Note?</Alert.Title>
              <Alert.Description>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions>
              <Alert.Action>Cancel</Alert.Action>
              <Alert.Action variant="destructive">Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `useCreateAlertHandle`: two triggers, one alert, its title theirs. */
const UseCreateAlertHandlePart: FunctionComponent = () => {
  const id = 'alert-parts-use-create-alert-handle';
  const [log, addLog] = useLog();
  // Its triggers, outside the root, each with its payload: the title.
  const deleteItemAlert = codeLabel(
    useCreateAlertHandle<{ title: string }>(),
    'deleteItemAlert',
  );

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="useCreateAlertHandle"
    >
      <Viewport.Content>
        <Alert.Trigger
          handle={deleteItemAlert}
          payload={{ title: 'Delete Note?' }}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Delete Note</Button.Label>
        </Alert.Trigger>
        <Alert.Trigger
          handle={deleteItemAlert}
          payload={{ title: 'Delete Folder?' }}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Delete Folder</Button.Label>
        </Alert.Trigger>
        <Alert.Root
          handle={deleteItemAlert}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          {({ payload }) => (
            <Alert.Popup>
              <Alert.Header>
                <Alert.Title>{payload?.title}</Alert.Title>
                <Alert.Description>
                  This note will be deleted from all your devices.
                </Alert.Description>
              </Alert.Header>
              <Alert.Actions>
                <Alert.Action>Cancel</Alert.Action>
                <Alert.Action variant="destructive">Delete</Alert.Action>
              </Alert.Actions>
            </Alert.Popup>
          )}
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/alert/parts`: the root, its trigger, its popup's parts, handles. */
export const AlertParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: its state (open), for its parts.</li>
      <li>Trigger: what opens it (or the app, by a handle).</li>
      <li>Popup: the panel, centered, the page dimmed behind it.</li>
      <li>
        In it: its header (title, description), its text fields, its actions.
      </li>
      <li>Handles: triggers outside the root, opening it imperatively.</li>
      <li>
        The views’ phone screens contain it (<code>container</code>); press each
        view’s button to open its alert.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="alert"
          part="Alert.Root"
        />
        <ul>
          <li>
            <PartLink
              component="alert"
              part="Alert.Trigger"
            />{' '}
            (optional; or outside it, by a handle)
          </li>
          <li>
            <PartLink
              component="alert"
              part="Alert.Popup"
            />{' '}
            (in its portal, its backdrop behind it)
            <ul>
              <li>
                <PartLink
                  component="alert"
                  part="Alert.Header"
                />
                <ul>
                  <li>
                    <PartLink
                      component="alert"
                      part="Alert.Title"
                    />
                  </li>
                  <li>
                    <PartLink
                      component="alert"
                      part="Alert.Description"
                    />{' '}
                    (optional)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="alert"
                  part="Alert.Fields"
                />{' '}
                (optional)
                <ul>
                  <li>
                    <PartLink
                      component="alert"
                      part="Alert.Field"
                    />{' '}
                    (one or two)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="alert"
                  part="Alert.Actions"
                />
                <ul>
                  <li>
                    <PartLink
                      component="alert"
                      part="Alert.Action"
                    />{' '}
                    (one or more)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="alert"
          part="Alert.createHandle"
        />{' '}
        (an alert’s handle, for its triggers outside it, and opening it
        imperatively)
        <ul>
          <li>
            <PartLink
              component="alert"
              part="useCreateAlertHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="alert-root"
      level={2}
    >
      <code>Alert.Root</code>
    </Heading>
    <ul>
      <li>
        Its state: <code>open</code> or <code>defaultOpen</code>,{' '}
        <code>onOpenChange</code> (with why: its trigger pressed, an action,
        Escape).
      </li>
      <li>
        Always modal: a press outside doesn’t close it (Base UI’s{' '}
        <code>AlertDialog</code>); its actions do.
      </li>
      <li>Renders no element of its own.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={alertRootRows} />

    <Heading
      id="alert-trigger"
      level={2}
    >
      <code>Alert.Trigger</code>
    </Heading>
    <ul>
      <li>
        What opens it: e.g. a <a href="button">Button</a> (
        <code>{'render={<Button.Root />}'}</code>). Optional: an alert the app
        opens (e.g. after a failed save) has none, opened by a handle (see{' '}
        <PartLink
          component="alert"
          part="Alert.createHandle"
        />
        ) or <code>open</code>.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={alertTriggerRows} />

    <Heading
      id="alert-popup"
      level={2}
    >
      <code>Alert.Popup</code>
    </Heading>
    <ul>
      <li>
        The panel (the menus’ glass, 300px wide, 34px corners), centered in its{' '}
        <code>container</code>; the page dimmed behind it (its backdrop);
        scaling in from 110%.
      </li>
      <li>
        Renders its portal (a <code>div</code> with no box of its own), its
        backdrop’s <code>div</code>, and its own <code>div</code> (an{' '}
        <code>alertdialog</code>).
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={alertPopupRows} />

    <Heading
      id="alert-header"
      level={2}
    >
      <code>Alert.Header</code>
    </Heading>
    <ul>
      <li>
        Its title and description, at its start, 24px above what follows (Figma
        “Title and Description”).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={alertHeaderRows} />

    <Heading
      id="alert-title"
      level={2}
    >
      <code>Alert.Title</code>
    </Heading>
    <ul>
      <li>
        Its title (Headline): short, a question or a statement; the alert’s
        accessible name.
      </li>
      <li>
        Renders an <code>h2</code>.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={alertTitleRows} />

    <Heading
      id="alert-description"
      level={2}
    >
      <code>Alert.Description</code>
    </Heading>
    <ul>
      <li>
        Optional: its message (Body), a short, complete sentence; the alert’s
        accessible description.
      </li>
      <li>
        Renders a <code>p</code>.
      </li>
    </ul>
    <DescriptionPart />
    <h3>Props</h3>
    <PropsTable rows={alertDescriptionRows} />

    <Heading
      id="alert-fields"
      level={2}
    >
      <code>Alert.Fields</code>
    </Heading>
    <ul>
      <li>
        Optional: its text fields, between separators, 19px above its actions
        (UIKit’s <code>addTextField</code>).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <FieldsPart />
    <h3>Props</h3>
    <PropsTable rows={alertFieldsRows} />

    <Heading
      id="alert-field"
      level={2}
    >
      <code>Alert.Field</code>
    </Heading>
    <ul>
      <li>
        A text field (Base UI’s <code>Input</code>): 52px high, on a gray fill
        with 26px corners; named by its <code>aria-label</code> (its placeholder
        shows).
      </li>
      <li>
        Its value the app’s (<code>onValueChange</code>), read by the action
        that uses it.
      </li>
      <li>
        Renders an <code>input</code>.
      </li>
    </ul>
    <FieldPart />
    <h3>Props</h3>
    <PropsTable rows={alertFieldRows} />

    <Heading
      id="alert-actions"
      level={2}
    >
      <code>Alert.Actions</code>
    </Heading>
    <ul>
      <li>
        Its actions: two side by side, 16px apart; more than two stacked, 10px
        apart (UIKit’s rule, by itself); <code>stacked</code> for two whose
        labels don’t fit.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ActionsPart />
    <h3>Props</h3>
    <PropsTable rows={alertActionsRows} />

    <Heading
      id="alert-action"
      level={2}
    >
      <code>Alert.Action</code>
    </Heading>
    <ul>
      <li>
        A button closing the alert (Base UI’s <code>Close</code>), 48px high, a
        capsule: its <code>variant</code> secondary (Cancel), primary (the
        default action, in the tint), or destructive (red).
      </li>
      <li>Its own action: its click handler (the app’s), then it closes.</li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ActionPart />
    <h3>Props</h3>
    <PropsTable rows={alertActionRows} />

    <Heading
      id="alert-createhandle"
      level={2}
    >
      <code>Alert.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle linking an alert to its triggers outside its root, and opening
        or closing it imperatively (Base UI’s{' '}
        <code>AlertDialog.createHandle</code>): e.g. after a failed save.
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink
          component="alert"
          part="useCreateAlertHandle"
        />
        ).
      </li>
      <li>
        Here: made at the module’s top level; a trigger before the root, and a
        button opening it imperatively (its <code>open(null)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={alertHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={alertHandleRows} />

    <Heading
      id="usecreatealerthandle"
      level={2}
    >
      <code>useCreateAlertHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="alert"
          part="Alert.createHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here: two triggers, one alert; each passes its title (its{' '}
        <code>payload</code>), the root’s children a function of it.
      </li>
    </ul>
    <UseCreateAlertHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={alertHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={alertHandleRows} />

    <Heading
      id="base-ui-s-other-parts"
      level={2}
    >
      Base UI’s other parts
    </Heading>
    <ul>
      <li>
        Re-exported as they are (unstyled; see{' '}
        <a
          href="https://base-ui.com/react/components/alert-dialog"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Alert Dialog
        </a>
        ):
      </li>
      <li>
        <code>Alert.Portal</code>, <code>Alert.Backdrop</code>: rendered by{' '}
        <PartLink
          component="alert"
          part="Alert.Popup"
        />{' '}
        (its container, the dimmed page).
      </li>
      <li>
        <code>Alert.Close</code>: a button closing it, unstyled (its actions are{' '}
        <PartLink
          component="alert"
          part="Alert.Action"
        />
        s).
      </li>
      <li>
        <code>Alert.Viewport</code>: a container around the popup (not used: the
        popup is centered itself).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const alertPartsDemos = [
  RootPart,
  TriggerPart,
  PopupPart,
  HeaderPart,
  TitlePart,
  DescriptionPart,
  FieldsPart,
  FieldPart,
  ActionsPart,
  ActionPart,
  CreateHandlePart,
  UseCreateAlertHandlePart,
];
