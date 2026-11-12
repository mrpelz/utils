import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  ActionSheet,
  Button,
  useCreateActionSheetHandle,
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
  actionSheetActionRows,
  actionSheetActionsRows,
  actionSheetDescriptionRows,
  actionSheetHandleRows,
  actionSheetHandleTypeRows,
  actionSheetHeaderRows,
  actionSheetPopupRows,
  actionSheetRootRows,
  actionSheetTitleRows,
  actionSheetTriggerRows,
} from './docs.js';
import {
  getPropOptionsGuideRoot,
  propOptionsAction,
  propOptionsElement,
  propOptionsPart,
  propOptionsPopup,
  propOptionsTrigger,
} from './props.js';

// Every view writes out its action sheet (deleting a photo), in a phone's
// screen (its container), the part's props on that part, so its code shows
// as it'd be used.

/** `ActionSheet.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'action-sheet-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'ActionSheet.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'ActionSheet.Action': ['variant'],
            'ActionSheet.Actions': [],
            'ActionSheet.Description': [],
            'ActionSheet.Header': [],
            'ActionSheet.Popup': [],
            'ActionSheet.Title': [],
            'ActionSheet.Trigger': ['render'],
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
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          key={elementKey}
          {...props}
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `ActionSheet.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'action-sheet-parts-trigger';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTrigger, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActionSheet.Trigger',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'ActionSheet.Action': ['variant'],
          'ActionSheet.Actions': [],
          'ActionSheet.Description': [],
          'ActionSheet.Header': [],
          'ActionSheet.Popup': [],
          'ActionSheet.Root': [],
          'ActionSheet.Title': [],
          'Button.Label': [],
          'Viewport.Content': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Trigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root {...partProps['ActionSheet.Root']}>
          <ActionSheet.Trigger {...props}>
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `ActionSheet.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'action-sheet-parts-popup';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActionSheet.Popup',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'ActionSheet.Action': ['variant'],
          'ActionSheet.Actions': [],
          'ActionSheet.Description': [],
          'ActionSheet.Header': [],
          'ActionSheet.Root': [],
          'ActionSheet.Title': [],
          'ActionSheet.Trigger': ['render'],
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
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Popup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          defaultOpen
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...props}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `ActionSheet.Header`, outlined, with its props. */
const HeaderPart: FunctionComponent = () => {
  const id = 'action-sheet-parts-header';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActionSheet.Header',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'ActionSheet.Action': ['variant'],
          'ActionSheet.Actions': [],
          'ActionSheet.Description': [],
          'ActionSheet.Popup': [],
          'ActionSheet.Root': [],
          'ActionSheet.Title': [],
          'ActionSheet.Trigger': ['render'],
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
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Header"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          defaultOpen
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...props}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `ActionSheet.Title`, outlined, with its props. */
const TitlePart: FunctionComponent = () => {
  const id = 'action-sheet-parts-title';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActionSheet.Title',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'ActionSheet.Action': ['variant'],
          'ActionSheet.Actions': [],
          'ActionSheet.Description': [],
          'ActionSheet.Header': [],
          'ActionSheet.Popup': [],
          'ActionSheet.Root': [],
          'ActionSheet.Trigger': ['render'],
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
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Title"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          defaultOpen
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...props}>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `ActionSheet.Description`, outlined, with its props. */
const DescriptionPart: FunctionComponent = () => {
  const id = 'action-sheet-parts-description';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActionSheet.Description',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'ActionSheet.Action': ['variant'],
          'ActionSheet.Actions': [],
          'ActionSheet.Header': [],
          'ActionSheet.Popup': [],
          'ActionSheet.Root': [],
          'ActionSheet.Title': [],
          'ActionSheet.Trigger': ['render'],
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
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Description"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          defaultOpen
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description {...props}>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `ActionSheet.Actions`, outlined, with its props. */
const ActionsPart: FunctionComponent = () => {
  const id = 'action-sheet-parts-actions';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActionSheet.Actions',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'ActionSheet.Action': ['variant'],
          'ActionSheet.Description': [],
          'ActionSheet.Header': [],
          'ActionSheet.Popup': [],
          'ActionSheet.Root': [],
          'ActionSheet.Title': [],
          'ActionSheet.Trigger': ['render'],
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
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Actions"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          defaultOpen
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...props}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `ActionSheet.Action`, outlined, with its props. */
const ActionPart: FunctionComponent = () => {
  const id = 'action-sheet-parts-action';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsAction, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActionSheet.Action',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'ActionSheet.Action (others)': [],
          'ActionSheet.Actions': [],
          'ActionSheet.Description': [],
          'ActionSheet.Header': [],
          'ActionSheet.Popup': [],
          'ActionSheet.Root': [],
          'ActionSheet.Title': [],
          'ActionSheet.Trigger': ['render'],
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
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="ActionSheet.Action"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          defaultOpen
        >
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Delete Photo
            </Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action {...props}>Delete Photo</ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action (others)']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

// Its trigger and its button, outside the root: made once, here.
const photoSheet = codeLabel(
  ActionSheet.createHandle(),
  'photoSheet',
  'const photoSheet = ActionSheet.createHandle(); // (at module level)',
);

/** `ActionSheet.createHandle`: a trigger outside the root, opened by it. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'action-sheet-parts-create-handle';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'ActionSheet.Action': ['variant'],
            'ActionSheet.Actions': [],
            'ActionSheet.Description': [],
            'ActionSheet.Header': [],
            'ActionSheet.Popup': [],
            'ActionSheet.Root': ['handle', 'onOpenChange'],
            'ActionSheet.Title': [],
            'ActionSheet.Trigger': ['handle', 'id', 'render'],
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
      baseUiId="popover"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="ActionSheet.createHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ActionSheet.Trigger
          {...partProps['ActionSheet.Trigger']}
          handle={photoSheet}
          id="action-sheet-parts-photo-trigger"
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Delete Photo
          </Button.Label>
        </ActionSheet.Trigger>
        <Button.Root
          {...partProps['Button.Root']}
          variant="borderless"
          onClick={() => photoSheet.open('action-sheet-parts-photo-trigger')}
        >
          <Button.Label {...partProps['Button.Label']}>
            Open Imperatively
          </Button.Label>
        </Button.Root>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          handle={photoSheet}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
            <ActionSheet.Header {...partProps['ActionSheet.Header']}>
              <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                Delete Photo?
              </ActionSheet.Title>
              <ActionSheet.Description
                {...partProps['ActionSheet.Description']}
              >
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
              <ActionSheet.Action
                {...partProps['ActionSheet.Action']}
                variant="destructive"
              >
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                Remove from Album
              </ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `useCreateActionSheetHandle`: two triggers, one sheet, at either. */
const UseCreateActionSheetHandlePart: FunctionComponent = () => {
  const id = 'action-sheet-parts-use-create-action-sheet-handle';
  const [log, addLog] = useLog();
  // Its triggers, outside the root, each with its payload: what it deletes.
  const deleteSheet = codeLabel(
    useCreateActionSheetHandle<{ action: string; title: string }>(),
    'deleteSheet',
    'const deleteSheet = useCreateActionSheetHandle<{ action: string; title: string }>();',
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'ActionSheet.Action': ['variant'],
            'ActionSheet.Actions': [],
            'ActionSheet.Description': [],
            'ActionSheet.Header': [],
            'ActionSheet.Popup': [],
            'ActionSheet.Root': ['handle', 'onOpenChange'],
            'ActionSheet.Title': [],
            'ActionSheet.Trigger': ['handle', 'payload', 'render'],
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
      baseUiId="popover"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="useCreateActionSheetHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="action-sheet-demo-triggers">
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            handle={deleteSheet}
            payload={{ action: 'Delete Photo', title: 'Delete Photo?' }}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Trigger
            {...partProps['ActionSheet.Trigger']}
            handle={deleteSheet}
            payload={{ action: 'Delete Video', title: 'Delete Video?' }}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Video</Button.Label>
          </ActionSheet.Trigger>
        </div>
        <ActionSheet.Root
          {...partProps['ActionSheet.Root']}
          handle={deleteSheet}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          {({ payload }) => (
            <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
              <ActionSheet.Header {...partProps['ActionSheet.Header']}>
                <ActionSheet.Title {...partProps['ActionSheet.Title']}>
                  {payload?.title}
                </ActionSheet.Title>
                <ActionSheet.Description
                  {...partProps['ActionSheet.Description']}
                >
                  It will be deleted from all your devices.
                </ActionSheet.Description>
              </ActionSheet.Header>
              <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
                <ActionSheet.Action
                  {...partProps['ActionSheet.Action']}
                  variant="destructive"
                >
                  {payload?.action}
                </ActionSheet.Action>
                <ActionSheet.Action {...partProps['ActionSheet.Action']}>
                  Remove from Album
                </ActionSheet.Action>
              </ActionSheet.Actions>
            </ActionSheet.Popup>
          )}
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/action-sheet/parts`: the root, its trigger, its popup's parts, handles. */
export const ActionSheetParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: holds its state (open) for its parts.</li>
      <li>Trigger: the control it’s about, where it shows.</li>
      <li>
        Popup: the panel at its trigger (or, without one, at the bottom), with
        the page dimmed behind it.
      </li>
      <li>Inside it: its header (title and description) and its actions.</li>
      <li>Handles: triggers outside the root, and opening it from code.</li>
      <li>
        The views’ phone screens contain it (<code>container</code>). Press each
        view’s button to open its sheet.
      </li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="action-sheet"
          part="ActionSheet.Root"
        />
        <ul>
          <li>
            <PartLink
              component="action-sheet"
              part="ActionSheet.Trigger"
            />{' '}
            (optional; or outside the root, through a handle)
          </li>
          <li>
            <PartLink
              component="action-sheet"
              part="ActionSheet.Popup"
            />{' '}
            (in its portal, with its backdrop behind it)
            <ul>
              <li>
                <PartLink
                  component="action-sheet"
                  part="ActionSheet.Header"
                />{' '}
                (optional)
                <ul>
                  <li>
                    <PartLink
                      component="action-sheet"
                      part="ActionSheet.Title"
                    />{' '}
                    (optional)
                  </li>
                  <li>
                    <PartLink
                      component="action-sheet"
                      part="ActionSheet.Description"
                    />{' '}
                    (optional)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="action-sheet"
                  part="ActionSheet.Actions"
                />
                <ul>
                  <li>
                    <PartLink
                      component="action-sheet"
                      part="ActionSheet.Action"
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
          component="action-sheet"
          part="ActionSheet.createHandle"
        />{' '}
        (an action sheet’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="action-sheet"
              part="useCreateActionSheetHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="actionsheet-root"
      level={2}
    >
      <code>ActionSheet.Root</code>
    </Heading>
    <ul>
      <li>
        Holds its state: <code>open</code> or <code>defaultOpen</code>, and{' '}
        <code>onOpenChange</code> (with the reason: its trigger pressed, an
        action, a press outside, or Escape). It’s <code>modal</code> by default.
      </li>
      <li>Renders no element of its own.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetRootRows} />

    <Heading
      id="actionsheet-trigger"
      level={2}
    >
      <code>ActionSheet.Trigger</code>
    </Heading>
    <ul>
      <li>
        The control its choices are about (for example a{' '}
        <a href={publicUrl('button')}>Button</a>,{' '}
        <code>{'render={<Button.Root />}'}</code>). The sheet shows at it.
      </li>
      <li>
        It’s optional. When the app opens the sheet (<code>open</code>), it
        shows at its container’s bottom.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetTriggerRows} />

    <Heading
      id="actionsheet-popup"
      level={2}
    >
      <code>ActionSheet.Popup</code>
    </Heading>
    <ul>
      <li>
        The panel, like an <a href={publicUrl('alert')}>Alert</a>’s (the menus’
        glass, 300px wide, with 34px corners). It sits below its trigger, 8px
        away (or above it, without room), and scales in from it. Without a
        trigger, it sits at its <code>container</code>’s bottom, above the safe
        area.
      </li>
      <li>
        The page is dimmed behind it, and a press outside closes it. When it’s
        taller than the room it has, it scrolls.
      </li>
      <li>
        Renders its portal (without a box of its own), its backdrop’s and its
        positioner’s <code>div</code>s, and its own <code>div</code> (a{' '}
        <code>dialog</code>).
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetPopupRows} />

    <Heading
      id="actionsheet-header"
      level={2}
    >
      <code>ActionSheet.Header</code>
    </Heading>
    <ul>
      <li>
        Optional: its title and description, like an{' '}
        <a href={publicUrl('alert')}>Alert</a>’s but closer to its actions (18px
        above them, where an alert has 34px). Many action sheets have only a
        description, or neither.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetHeaderRows} />

    <Heading
      id="actionsheet-title"
      level={2}
    >
      <code>ActionSheet.Title</code>
    </Heading>
    <ul>
      <li>
        Optional: its title (Headline), which is the sheet’s accessible name.
        Without one, name the popup with <code>aria-label</code>.
      </li>
      <li>
        Renders an <code>h2</code>.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetTitleRows} />

    <Heading
      id="actionsheet-description"
      level={2}
    >
      <code>ActionSheet.Description</code>
    </Heading>
    <ul>
      <li>
        Optional: what the choice is about (Body), which is the sheet’s
        accessible description.
      </li>
      <li>
        Renders a <code>p</code>.
      </li>
    </ul>
    <DescriptionPart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetDescriptionRows} />

    <Heading
      id="actionsheet-actions"
      level={2}
    >
      <code>ActionSheet.Actions</code>
    </Heading>
    <ul>
      <li>Its actions, stacked 10px apart, with a destructive one first.</li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ActionsPart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetActionsRows} />

    <Heading
      id="actionsheet-action"
      level={2}
    >
      <code>ActionSheet.Action</code>
    </Heading>
    <ul>
      <li>
        A button that closes the sheet (Base UI’s <code>Close</code>): a 48px
        capsule on a gray fill. Its <code>variant</code> is secondary or
        destructive (red).
      </li>
      <li>
        There’s no Cancel, because a press outside cancels (anchored action
        sheets don’t have one).
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ActionPart />
    <h3>Props</h3>
    <PropsTable rows={actionSheetActionRows} />

    <Heading
      id="actionsheet-createhandle"
      level={2}
    >
      <code>ActionSheet.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle that links an action sheet to its triggers outside its root,
        and opens or closes it from code (Base UI’s{' '}
        <code>Popover.createHandle</code>).
      </li>
      <li>
        Make it once, for example at a module’s top level (in a component, use{' '}
        <PartLink
          component="action-sheet"
          part="useCreateActionSheetHandle"
        />
        ).
      </li>
      <li>
        Here, it’s made at the module’s top level, with a trigger before the
        root and a button that opens it at that trigger (its{' '}
        <code>open(triggerId)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={actionSheetHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={actionSheetHandleRows} />

    <Heading
      id="usecreateactionsheethandle"
      level={2}
    >
      <code>useCreateActionSheetHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="action-sheet"
          part="ActionSheet.createHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here, two triggers share one sheet, which shows at whichever was
        pressed. Each passes what it deletes as its <code>payload</code>, and
        the root’s children are a function of it.
      </li>
    </ul>
    <UseCreateActionSheetHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={actionSheetHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={actionSheetHandleRows} />

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
          href="https://base-ui.com/react/components/popover"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Popover
        </a>
        ):
      </li>
      <li>
        <code>ActionSheet.Portal</code>, <code>ActionSheet.Backdrop</code> and{' '}
        <code>ActionSheet.Positioner</code>:{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Popup"
        />{' '}
        renders them (its container, the dimmed page, and its placement).
      </li>
      <li>
        <code>ActionSheet.Close</code>: a button that closes it, without styles
        (its actions are{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Action"
        />
        s).
      </li>
      <li>
        <code>ActionSheet.Arrow</code> and <code>ActionSheet.Viewport</code>:
        not used, since there’s no arrow and nothing animates between triggers.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const actionSheetPartsDemos = [
  RootPart,
  TriggerPart,
  PopupPart,
  HeaderPart,
  TitlePart,
  DescriptionPart,
  ActionsPart,
  ActionPart,
  CreateHandlePart,
  UseCreateActionSheetHandlePart,
];
