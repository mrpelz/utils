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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Root"
    >
      <Viewport.Content>
        <ActionSheet.Root
          key={elementKey}
          {...props}
        >
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Trigger"
    >
      <Viewport.Content>
        <ActionSheet.Root>
          <ActionSheet.Trigger {...props}>
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Popup"
    >
      <Viewport.Content>
        <ActionSheet.Root defaultOpen>
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup {...props}>
            <ActionSheet.Header>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Header"
    >
      <Viewport.Content>
        <ActionSheet.Root defaultOpen>
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header {...props}>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Title"
    >
      <Viewport.Content>
        <ActionSheet.Root defaultOpen>
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title {...props}>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Description"
    >
      <Viewport.Content>
        <ActionSheet.Root defaultOpen>
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description {...props}>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Actions"
    >
      <Viewport.Content>
        <ActionSheet.Root defaultOpen>
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions {...props}>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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

  return (
    <Component
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      screen="centered"
      stage="phone"
      state={[state]}
      title="ActionSheet.Action"
    >
      <Viewport.Content>
        <ActionSheet.Root defaultOpen>
          <ActionSheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Delete Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action {...props}>Delete Photo</ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
            </ActionSheet.Actions>
          </ActionSheet.Popup>
        </ActionSheet.Root>
      </Viewport.Content>
    </Component>
  );
};

// Its trigger and its button, outside the root: made once, here.
const photoSheet = codeLabel(ActionSheet.createHandle(), 'photoSheet');

/** `ActionSheet.createHandle`: a trigger outside the root, opened by it. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'action-sheet-parts-create-handle';
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      baseUiId="popover"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="ActionSheet.createHandle"
    >
      <Viewport.Content>
        <ActionSheet.Trigger
          handle={photoSheet}
          id="action-sheet-parts-photo-trigger"
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Delete Photo</Button.Label>
        </ActionSheet.Trigger>
        <Button.Root
          variant="borderless"
          onClick={() => photoSheet.open('action-sheet-parts-photo-trigger')}
        >
          <Button.Label>Open Imperatively</Button.Label>
        </Button.Root>
        <ActionSheet.Root
          handle={photoSheet}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          <ActionSheet.Popup>
            <ActionSheet.Header>
              <ActionSheet.Title>Delete Photo?</ActionSheet.Title>
              <ActionSheet.Description>
                It will be deleted from all your devices.
              </ActionSheet.Description>
            </ActionSheet.Header>
            <ActionSheet.Actions>
              <ActionSheet.Action variant="destructive">
                Delete Photo
              </ActionSheet.Action>
              <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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
  );

  return (
    <Component
      isInline
      baseUiId="popover"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="useCreateActionSheetHandle"
    >
      <Viewport.Content>
        <div className="action-sheet-demo-triggers">
          <ActionSheet.Trigger
            handle={deleteSheet}
            payload={{ action: 'Delete Photo', title: 'Delete Photo?' }}
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Photo</Button.Label>
          </ActionSheet.Trigger>
          <ActionSheet.Trigger
            handle={deleteSheet}
            payload={{ action: 'Delete Video', title: 'Delete Video?' }}
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Video</Button.Label>
          </ActionSheet.Trigger>
        </div>
        <ActionSheet.Root
          handle={deleteSheet}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          {({ payload }) => (
            <ActionSheet.Popup>
              <ActionSheet.Header>
                <ActionSheet.Title>{payload?.title}</ActionSheet.Title>
                <ActionSheet.Description>
                  It will be deleted from all your devices.
                </ActionSheet.Description>
              </ActionSheet.Header>
              <ActionSheet.Actions>
                <ActionSheet.Action variant="destructive">
                  {payload?.action}
                </ActionSheet.Action>
                <ActionSheet.Action>Remove from Album</ActionSheet.Action>
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
      <li>Root: its state (open), for its parts.</li>
      <li>Trigger: the control it’s about, and shown at.</li>
      <li>
        Popup: the panel at its trigger (without one, at the bottom), the page
        dimmed behind it.
      </li>
      <li>In it: its header (title, description), its actions.</li>
      <li>Handles: triggers outside the root, opening it imperatively.</li>
      <li>
        The views’ phone screens contain it (<code>container</code>); press each
        view’s button to open its sheet.
      </li>
    </ul>
    <ul>
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
            (optional; or outside it, by a handle)
          </li>
          <li>
            <PartLink
              component="action-sheet"
              part="ActionSheet.Popup"
            />{' '}
            (in its portal, its backdrop behind it)
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
    </ul>
    <ul>
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
        Its state: <code>open</code> or <code>defaultOpen</code>,{' '}
        <code>onOpenChange</code> (with why: its trigger pressed, an action, a
        press outside, Escape); <code>modal</code> by default.
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
        The control its choices are about (e.g. a <a href="button">Button</a>:{' '}
        <code>{'render={<Button.Root />}'}</code>): the sheet shows at it.
      </li>
      <li>
        Optional: opened by the app (<code>open</code>), it shows at its
        container’s bottom.
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
        The panel (an <a href="alert">Alert</a>’s: the menus’ glass, 300px wide,
        34px corners): below its trigger, 8px from it (above it, if there’s no
        room), scaling in from it; without a trigger, at its{' '}
        <code>container</code>’s bottom, above its safe area.
      </li>
      <li>
        The page dimmed behind it; a press outside closes it. Taller than the
        room for it, it scrolls.
      </li>
      <li>
        Renders its portal (no box of its own), its backdrop’s and its
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
        Optional: its title and description, as an alert’s (24px above its
        actions). Many action sheets have only a description, or neither.
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
        Optional: its title (Headline); the sheet’s accessible name (without
        one, name the popup: <code>aria-label</code>).
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
        Optional: what the choice is about (Body); the sheet’s accessible
        description.
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
      <li>Its actions, stacked, 10px apart; a destructive one first.</li>
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
        A button closing the sheet (Base UI’s <code>Close</code>), 48px high, a
        capsule on a gray fill: its <code>variant</code> secondary or
        destructive (red).
      </li>
      <li>
        No Cancel: a press outside cancels (iOS 26’s anchored action sheets have
        none).
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
        A handle linking an action sheet to its triggers outside its root, and
        opening or closing it imperatively (Base UI’s{' '}
        <code>Popover.createHandle</code>).
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink
          component="action-sheet"
          part="useCreateActionSheetHandle"
        />
        ).
      </li>
      <li>
        Here: made at the module’s top level; a trigger before the root, and a
        button opening it at that trigger (its <code>open(triggerId)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
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
        Here: two triggers, one sheet, at whichever opened it; each passes what
        it deletes (its <code>payload</code>), the root’s children a function of
        it.
      </li>
    </ul>
    <UseCreateActionSheetHandlePart />
    <h3>Type parameters</h3>
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
        Re-exported as they are (unstyled; see{' '}
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
        <code>ActionSheet.Portal</code>, <code>ActionSheet.Backdrop</code>,{' '}
        <code>ActionSheet.Positioner</code>: rendered by{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Popup"
        />{' '}
        (its container, the dimmed page, its place).
      </li>
      <li>
        <code>ActionSheet.Close</code>: a button closing it, unstyled (its
        actions are{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Action"
        />
        s).
      </li>
      <li>
        <code>ActionSheet.Arrow</code>, <code>ActionSheet.Viewport</code>: not
        used (no arrow; nothing animated between triggers).
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
