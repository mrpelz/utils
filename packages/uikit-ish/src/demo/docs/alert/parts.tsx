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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Title': [],
            'Alert.Trigger': ['render'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Viewport.Content': [],
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
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          key={elementKey}
          {...props}
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action': ['variant'],
          'Alert.Actions': [],
          'Alert.Description': [],
          'Alert.Header': [],
          'Alert.Popup': [],
          'Alert.Root': [],
          'Alert.Title': [],
          'Button.Label': [],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Trigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root {...partProps['Alert.Root']}>
          <Alert.Trigger {...props}>
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action': ['variant'],
          'Alert.Actions': [],
          'Alert.Description': [],
          'Alert.Header': [],
          'Alert.Root': [],
          'Alert.Title': [],
          'Alert.Trigger': ['render'],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Popup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...props}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action': ['variant'],
          'Alert.Actions': [],
          'Alert.Description': [],
          'Alert.Popup': [],
          'Alert.Root': [],
          'Alert.Title': [],
          'Alert.Trigger': ['render'],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Header"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...props}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action': ['variant'],
          'Alert.Actions': [],
          'Alert.Description': [],
          'Alert.Header': [],
          'Alert.Popup': [],
          'Alert.Root': [],
          'Alert.Trigger': ['render'],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Title"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...props}>Delete Note?</Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action': ['variant'],
          'Alert.Actions': [],
          'Alert.Header': [],
          'Alert.Popup': [],
          'Alert.Root': [],
          'Alert.Title': [],
          'Alert.Trigger': ['render'],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Description"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...props}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action': ['variant'],
          'Alert.Actions': [],
          'Alert.Description': [],
          'Alert.Field': ['aria-label', 'defaultValue', 'placeholder'],
          'Alert.Header': [],
          'Alert.Popup': [],
          'Alert.Root': [],
          'Alert.Title': [],
          'Alert.Trigger': ['render'],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Fields"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Rename Folder
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Rename Folder
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                Enter a name for this folder.
              </Alert.Description>
            </Alert.Header>
            <Alert.Fields {...props}>
              <Alert.Field
                {...partProps['Alert.Field']}
                aria-label="Name"
                defaultValue="Recipes"
                placeholder="Name"
              />
            </Alert.Fields>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="primary"
              >
                Save
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Fields': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Root': [],
            'Alert.Title': [],
            'Alert.Trigger': ['render'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Viewport.Content': [],
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
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Field"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Rename Folder
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Rename Folder
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                Enter a name for this folder.
              </Alert.Description>
            </Alert.Header>
            <Alert.Fields {...partProps['Alert.Fields']}>
              <Alert.Field
                aria-label="Name"
                {...props}
              />
            </Alert.Fields>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="primary"
              >
                Save
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action': ['variant'],
          'Alert.Description': [],
          'Alert.Header': [],
          'Alert.Popup': [],
          'Alert.Root': [],
          'Alert.Title': [],
          'Alert.Trigger': ['render'],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Actions"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...props}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Alert.Action (others)': [],
          'Alert.Actions': [],
          'Alert.Description': [],
          'Alert.Header': [],
          'Alert.Popup': [],
          'Alert.Root': [],
          'Alert.Title': [],
          'Alert.Trigger': ['render'],
          'Button.Label': [],
          'Button.Root': ['size', 'variant'],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isInline
      baseUiId="alert-dialog"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Alert.Action"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Root
          {...partProps['Alert.Root']}
          defaultOpen
        >
          <Alert.Trigger
            {...partProps['Alert.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Note
            </Button.Label>
          </Alert.Trigger>
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action (others)']}>
                Cancel
              </Alert.Action>
              <Alert.Action {...props}>Delete</Alert.Action>
            </Alert.Actions>
          </Alert.Popup>
        </Alert.Root>
      </Viewport.Content>
    </Component>
  );
};

// Its trigger and its button, outside the root: made once, here.
const deleteAlert = codeLabel(
  Alert.createHandle(),
  'deleteAlert',
  'const deleteAlert = Alert.createHandle(); // (at module level)',
);

/** `Alert.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'alert-parts-create-handle';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Root': ['handle', 'onOpenChange'],
            'Alert.Title': [],
            'Alert.Trigger': ['handle', 'render'],
            'Button.Label': [],
            'Button.Root': ['onClick', 'size', 'variant'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Alert.createHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Trigger
          {...partProps['Alert.Trigger']}
          handle={deleteAlert}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Delete Note
          </Button.Label>
        </Alert.Trigger>
        <Button.Root
          {...partProps['Button.Root']}
          variant="borderless"
          onClick={() => deleteAlert.open(null)}
        >
          <Button.Label {...partProps['Button.Label']}>
            Open Imperatively
          </Button.Label>
        </Button.Root>
        <Alert.Root
          {...partProps['Alert.Root']}
          handle={deleteAlert}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          <Alert.Popup {...partProps['Alert.Popup']}>
            <Alert.Header {...partProps['Alert.Header']}>
              <Alert.Title {...partProps['Alert.Title']}>
                Delete Note?
              </Alert.Title>
              <Alert.Description {...partProps['Alert.Description']}>
                This note will be deleted from all your devices.
              </Alert.Description>
            </Alert.Header>
            <Alert.Actions {...partProps['Alert.Actions']}>
              <Alert.Action {...partProps['Alert.Action']}>Cancel</Alert.Action>
              <Alert.Action
                {...partProps['Alert.Action']}
                variant="destructive"
              >
                Delete
              </Alert.Action>
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
    'const deleteItemAlert = useCreateAlertHandle<{ title: string }>();',
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Alert.Action': ['variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Root': ['handle', 'onOpenChange'],
            'Alert.Title': [],
            'Alert.Trigger': ['handle', 'payload', 'render'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="alert-dialog"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="useCreateAlertHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Alert.Trigger
          {...partProps['Alert.Trigger']}
          handle={deleteItemAlert}
          payload={{ title: 'Delete Note?' }}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Delete Note
          </Button.Label>
        </Alert.Trigger>
        <Alert.Trigger
          {...partProps['Alert.Trigger']}
          handle={deleteItemAlert}
          payload={{ title: 'Delete Folder?' }}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Delete Folder
          </Button.Label>
        </Alert.Trigger>
        <Alert.Root
          {...partProps['Alert.Root']}
          handle={deleteItemAlert}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          {({ payload }) => (
            <Alert.Popup {...partProps['Alert.Popup']}>
              <Alert.Header {...partProps['Alert.Header']}>
                <Alert.Title {...partProps['Alert.Title']}>
                  {payload?.title}
                </Alert.Title>
                <Alert.Description {...partProps['Alert.Description']}>
                  This note will be deleted from all your devices.
                </Alert.Description>
              </Alert.Header>
              <Alert.Actions {...partProps['Alert.Actions']}>
                <Alert.Action {...partProps['Alert.Action']}>
                  Cancel
                </Alert.Action>
                <Alert.Action
                  {...partProps['Alert.Action']}
                  variant="destructive"
                >
                  Delete
                </Alert.Action>
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
      <li>Root: holds its state (open) for its parts.</li>
      <li>Trigger: what opens it (or the app does, through a handle).</li>
      <li>Popup: the panel, centered, with the page dimmed behind it.</li>
      <li>
        Inside it: its header (title and description), its text fields, and its
        actions.
      </li>
      <li>Handles: triggers outside the root, and opening it from code.</li>
      <li>
        The views’ phone screens contain it (<code>container</code>). Press each
        view’s button to open its alert.
      </li>
    </ul>
    <ul className="demo-tree">
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
            (optional; or outside the root, through a handle)
          </li>
          <li>
            <PartLink
              component="alert"
              part="Alert.Popup"
            />{' '}
            (in its portal, with its backdrop behind it)
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
      <li>
        <PartLink
          component="alert"
          part="Alert.createHandle"
        />{' '}
        (an alert’s handle, for its triggers outside it, and for opening it from
        code)
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
        Holds its state: <code>open</code> or <code>defaultOpen</code>, and{' '}
        <code>onOpenChange</code> (with the reason: its trigger pressed, an
        action, or Escape).
      </li>
      <li>
        It’s always modal, so a press outside doesn’t close it (Base UI’s{' '}
        <code>AlertDialog</code>). Its actions do.
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
        What opens it, for example a <a href={publicUrl('button')}>Button</a> (
        <code>{'render={<Button.Root />}'}</code>). It’s optional: an alert the
        app opens itself (for example after a failed save) has none, and opens
        through a handle (see{' '}
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
        The panel (the menus’ glass, 300px wide, with 34px corners), centered in
        its <code>container</code>, with the page dimmed behind it (its
        backdrop). It scales in from 110%.
      </li>
      <li>
        While a field inside it (
        <PartLink
          component="alert"
          part="Alert.Field"
        />
        ) is typed into and the keyboard covers it, it’s lifted as a whole until
        it’s 8px above the keyboard, while its backdrop stays (like a{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        , in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        ).
      </li>
      <li>
        Renders its portal (a <code>div</code> without a box of its own), its
        backdrop’s <code>div</code>, its viewport’s <code>div</code> (Base UI’s{' '}
        <code>AlertDialog.Viewport</code>, which centers it), and its own{' '}
        <code>div</code> (an <code>alertdialog</code>).
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
      <li>Its title and description, at its start, 24px above what follows.</li>
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
        Its title (Headline): short, a question or a statement. It’s the alert’s
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
        Optional: its message (Body), a short, complete sentence. It’s the
        alert’s accessible description.
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
        Optional: its text fields, between separators, 19px above its actions.
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
        A text field (Base UI’s <code>Input</code>), 52px tall, on a gray fill
        with 26px corners. Name it with its <code>aria-label</code>; its
        placeholder shows.
      </li>
      <li>
        The app holds its value (<code>onValueChange</code>), and the action
        that uses it reads it.
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
        Its actions. Two sit side by side, 16px apart. More than two stack on
        their own, 10px apart. Use <code>stacked</code> for two whose labels
        don’t fit.
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
        A button that closes the alert (Base UI’s <code>Close</code>): a 48px
        capsule. Its <code>variant</code> is secondary (Cancel), primary (the
        default action, in the tint) or destructive (red).
      </li>
      <li>
        Its own action runs first (the app’s click handler), then it closes.
      </li>
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
        A handle that links an alert to its triggers outside its root, and opens
        or closes it from code (Base UI’s <code>AlertDialog.createHandle</code>
        ), for example after a failed save.
      </li>
      <li>
        Make it once, for example at a module’s top level (in a component, use{' '}
        <PartLink
          component="alert"
          part="useCreateAlertHandle"
        />
        ).
      </li>
      <li>
        Here, it’s made at the module’s top level, with a trigger before the
        root and a button that opens it from code (its <code>open(null)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
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
        Here, two triggers open one alert. Each passes its title as its{' '}
        <code>payload</code>, and the root’s children are a function of it.
      </li>
    </ul>
    <UseCreateAlertHandlePart />
    <h3>Type Parameters</h3>
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
        These are re-exported as they are, without styles (see{' '}
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
        <code>Alert.Portal</code>, <code>Alert.Backdrop</code> and{' '}
        <code>Alert.Viewport</code>:{' '}
        <PartLink
          component="alert"
          part="Alert.Popup"
        />{' '}
        renders them (its container, the dimmed page, and the box that centers
        it).
      </li>
      <li>
        <code>Alert.Close</code>: a button that closes it, without styles (its
        actions are{' '}
        <PartLink
          component="alert"
          part="Alert.Action"
        />
        s).
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
