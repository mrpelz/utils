import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
  Sheet,
  Toolbar,
  useCreateSheetHandle,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { codeLabel, useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from '../viewport/content.js';
import {
  sheetCloseRows,
  sheetContentRows,
  sheetDescriptionRows,
  sheetGrabberRows,
  sheetHandleRows,
  sheetHandleTypeRows,
  sheetHeaderRows,
  sheetPopupRows,
  sheetRootRows,
  sheetTitleRows,
  sheetTriggerRows,
} from './docs.js';
import {
  getPropOptionsGuideRoot,
  propOptionsGrabber,
  propOptionsGuidePopup,
  propOptionsHeader,
  propOptionsPart,
} from './props.js';

// Each view: a phone's screen, its button presenting the sheet (opened, the
// part is outlined; see its controls).

/** `Sheet.Root`: the sheet's state: its trigger and its popup (no element of its own). */
const RootPart: FunctionComponent = () => {
  const id = 'sheet-parts-root';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    'Sheet.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Root"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          key={elementKey}
          {...props}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Trigger`: its trigger, outlined. */
const TriggerPart: FunctionComponent = () => {
  const id = 'sheet-parts-trigger';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Sheet.Trigger',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Trigger"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            {...props}
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Popup`: the sheet, outlined. */
const PopupPart: FunctionComponent = () => {
  const id = 'sheet-parts-popup';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGuidePopup,
    'Sheet.Popup',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Popup"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            key={elementKey}
            container={screen}
            {...props}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Header`: its header, outlined. */
const HeaderPart: FunctionComponent = () => {
  const id = 'sheet-parts-header';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsHeader,
    'Sheet.Header',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Header"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header {...props}>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Grabber`: its grabber, outlined. */
const GrabberPart: FunctionComponent = () => {
  const id = 'sheet-parts-grabber';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGrabber,
    'Sheet.Grabber',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Grabber"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber {...props} />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Content`: its content, outlined. */
const ContentPart: FunctionComponent = () => {
  const id = 'sheet-parts-content';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Sheet.Content',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Content"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...props}>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Title`: its title, outlined. */
const TitlePart: FunctionComponent = () => {
  const id = 'sheet-parts-title';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Sheet.Title',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Title"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title
                    {...props}
                    render={<span />}
                  >
                    Add Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Description`: its description, outlined. */
const DescriptionPart: FunctionComponent = () => {
  const id = 'sheet-parts-description';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Sheet.Description',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Description"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description {...props}>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `Sheet.Close`: its Done button, outlined. */
const ClosePart: FunctionComponent = () => {
  const id = 'sheet-parts-close';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Sheet.Close',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Sheet.Close"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Add Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Sheet.Close render={<Toolbar.Button />}>
                    <Button.Label>Cancel</Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close
                    {...props}
                    render={<Toolbar.Button prominent />}
                  >
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                  <List.Footer>
                    <Sheet.Description>
                      Saved to your contacts.
                    </Sheet.Description>
                  </List.Footer>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

// Its trigger and its button, outside the root: made once, here.
const contactSheet = codeLabel(Sheet.createHandle(), 'contactSheet');

/** `Sheet.createHandle`: a trigger outside the root, and an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'sheet-parts-create-handle';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      id={id}
      log={log}
      title="Sheet.createHandle"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Trigger
          handle={contactSheet}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Add Contact</Button.Label>
        </Sheet.Trigger>
        <Button.Root
          variant="borderless"
          onClick={() => contactSheet.open(null)}
        >
          <Button.Label>Open Imperatively</Button.Label>
        </Button.Root>
        <Sheet.Root
          handle={contactSheet}
          onOpenChange={(open: boolean, { reason }) =>
            addLog(`open: ${String(open)} (${reason})`)
          }
        >
          <Sheet.Popup
            compact
            container={screen}
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading />
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Add Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close render={<Toolbar.Button prominent />}>
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.slice(0, 3).map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `useCreateSheetHandle`: two triggers, one sheet, its title theirs. */
const UseCreateSheetHandlePart: FunctionComponent = () => {
  const id = 'sheet-parts-use-create-sheet-handle';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  // Its triggers, outside the root, each with its payload: the title.
  const addSheet = codeLabel(
    useCreateSheetHandle<{ title: string }>(),
    'addSheet',
  );

  return (
    <Component
      center
      inline
      id={id}
      log={log}
      title="useCreateSheetHandle"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Trigger
          handle={addSheet}
          payload={{ title: 'Add Contact' }}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Add Contact</Button.Label>
        </Sheet.Trigger>
        <Sheet.Trigger
          handle={addSheet}
          payload={{ title: 'Add Group' }}
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>Add Group</Button.Label>
        </Sheet.Trigger>
        <Sheet.Root
          handle={addSheet}
          onOpenChange={(open: boolean, { reason }) =>
            addLog(`open: ${String(open)} (${reason})`)
          }
        >
          {({ payload }) => (
            <Sheet.Popup
              compact
              container={screen}
            >
              <Sheet.Header>
                <Sheet.Grabber />
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <Sheet.Title render={<span />}>
                      {payload?.title}
                    </Sheet.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Sheet.Close render={<Toolbar.Button prominent />}>
                      <Button.Label>Done</Button.Label>
                    </Sheet.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Sheet.Header>
              <Sheet.Content>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.slice(0, 3).map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Sheet.Content>
            </Sheet.Popup>
          )}
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** `/sheet/parts`: its root, trigger, popup, header, content, and Base UI's. */
export const SheetParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root (its state), its trigger, and its popup: a header (its grabber, a
        toolbar) above its content.
      </li>
      <li>
        Base UI’s <code>Drawer</code>, its parts re-exported: its title,
        description and close buttons; its portal, backdrop and viewport
        rendered by{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />
        .
      </li>
      <li>Press each view’s button to open its sheet.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />
        <ul>
          <li>
            <PartLink
              component="sheet"
              part="Sheet.Trigger"
            />
          </li>
          <li>
            <PartLink
              component="sheet"
              part="Sheet.Popup"
            />
            <ul>
              <li>
                <PartLink
                  component="sheet"
                  part="Sheet.Header"
                />{' '}
                (
                <PartLink
                  component="sheet"
                  part="Sheet.Grabber"
                />
                , optional; a toolbar:{' '}
                <PartLink
                  component="sheet"
                  part="Sheet.Close"
                />
                ,{' '}
                <PartLink
                  component="sheet"
                  part="Sheet.Title"
                />
                )
              </li>
              <li>
                <PartLink
                  component="sheet"
                  part="Sheet.Content"
                />{' '}
                (
                <PartLink
                  component="sheet"
                  part="Sheet.Description"
                />
                , optional)
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="sheet"
          part="Sheet.createHandle"
        />{' '}
        (a sheet’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="sheet"
              part="useCreateSheetHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="sheet-root"
      level={2}
    >
      <code>Sheet.Root</code>
    </Heading>
    <ul>
      <li>
        Its state: open (<code>open</code> or <code>defaultOpen</code>,{' '}
        <code>onOpenChange</code>), modal, dismissed by outside presses or not.
      </li>
      <li>Renders no element.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={sheetRootRows} />

    <Heading
      id="sheet-trigger"
      level={2}
    >
      <code>Sheet.Trigger</code>
    </Heading>
    <ul>
      <li>
        Opens the sheet; focus returns to it as it closes. Usually a{' '}
        <a href="button">Button</a> (its <code>render</code>).
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={sheetTriggerRows} />

    <Heading
      id="sheet-popup"
      level={2}
    >
      <code>Sheet.Popup</code>
    </Heading>
    <ul>
      <li>
        The sheet: <code>detent</code> (large, medium), or not{' '}
        <code>compact</code>, a form sheet; in its portal, the page dimmed
        behind it (Base UI’s <code>Portal</code> and <code>Backdrop</code>).
      </li>
      <li>
        <code>container</code>: here, the phone’s screen (a containing block, so
        it fills the screen, not the window).
      </li>
      <li>
        Renders a <code>div</code> (a <code>dialog</code>) in its viewport’s{' '}
        <code>div</code> (where it’s swiped), and its backdrop’s{' '}
        <code>div</code> before it.
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={sheetPopupRows} />

    <Heading
      id="sheet-header"
      level={2}
    >
      <code>Sheet.Header</code>
    </Heading>
    <ul>
      <li>
        Its grabber (
        <PartLink
          component="sheet"
          part="Sheet.Grabber"
        />
        ), above a toolbar of the app’s. (The sheet is swiped down by any of it,
        its content scrolled to its top.)
      </li>
      <li>With only a grabber, over the content (its own bars below it).</li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={sheetHeaderRows} />

    <Heading
      id="sheet-grabber"
      level={2}
    >
      <code>Sheet.Grabber</code>
    </Heading>
    <ul>
      <li>
        The grabber (36px by 5px, 5px from the top), first in its header:
        showing the sheet can be swiped (by any of it).
      </li>
      <li>Optional: left out, a cleaner top.</li>
      <li>
        Its <code>cursor</code>: <code>grab</code>, <code>grabbing</code> while
        the sheet is swiped.
      </li>
      <li>
        Renders a <code>div</code>, hidden from assistive tech.
      </li>
    </ul>
    <GrabberPart />
    <h3>Props</h3>
    <PropsTable rows={sheetGrabberRows} />

    <Heading
      id="sheet-content"
      level={2}
    >
      <code>Sheet.Content</code>
    </Heading>
    <ul>
      <li>
        What scrolls below the header, filling the sheet (medium: as high as it,
        up to the screen but 64px).
      </li>
      <li>
        Its end scrolls clear of the home indicator (padded by the bottom safe
        area inset; medium, 6px from the screen’s edge, what’s left of it), the
        sheet’s background reaching the edge.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ContentPart />
    <h3>Props</h3>
    <PropsTable rows={sheetContentRows} />

    <Heading
      id="sheet-title"
      level={2}
    >
      <code>Sheet.Title</code>
    </Heading>
    <ul>
      <li>
        Names the sheet; unstyled (Base UI’s), here as the toolbar’s title (
        <code>render</code>: a <code>span</code>).
      </li>
      <li>
        Renders an <code>h2</code>.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={sheetTitleRows} />

    <Heading
      id="sheet-description"
      level={2}
    >
      <code>Sheet.Description</code>
    </Heading>
    <ul>
      <li>Describes the sheet; unstyled (Base UI’s), here a list’s footer.</li>
      <li>
        Renders a <code>p</code>.
      </li>
    </ul>
    <DescriptionPart />
    <h3>Props</h3>
    <PropsTable rows={sheetDescriptionRows} />

    <Heading
      id="sheet-close"
      level={2}
    >
      <code>Sheet.Close</code>
    </Heading>
    <ul>
      <li>
        Closes the sheet: Cancel, Done (its own <code>onClick</code> first, e.g.
        saving); usually a toolbar’s button (its <code>render</code>).
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ClosePart />
    <h3>Props</h3>
    <PropsTable rows={sheetCloseRows} />

    <Heading
      id="sheet-createhandle"
      level={2}
    >
      <code>Sheet.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle linking a sheet to its triggers outside its root, and opening
        or closing it imperatively (Base UI’s <code>Drawer.createHandle</code>
        ).
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink
          component="sheet"
          part="useCreateSheetHandle"
        />
        ).
      </li>
      <li>
        Here: made at the module’s top level; a trigger before the root, and a
        button opening it imperatively (its <code>open()</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={sheetHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={sheetHandleRows} />

    <Heading
      id="usecreatesheethandle"
      level={2}
    >
      <code>useCreateSheetHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="sheet"
          part="Sheet.createHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here: two triggers, one sheet; each passes its title (its{' '}
        <code>payload</code>), the root’s children a function of it.
      </li>
    </ul>
    <UseCreateSheetHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={sheetHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={sheetHandleRows} />

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
          href="https://base-ui.com/react/components/drawer"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Drawer
        </a>
        ):
      </li>
      <li>
        <code>Sheet.Portal</code>, <code>Sheet.Backdrop</code>,{' '}
        <code>Sheet.Viewport</code>: rendered by{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        (its container, the dimmed page, where it’s swiped).
      </li>
      <li>
        <code>Sheet.SwipeArea</code>: an area a sheet is swiped open from (iOS’
        sheets aren’t: presented by the app).
      </li>
      <li>
        <code>Sheet.Provider</code>, <code>Sheet.Indent</code>,{' '}
        <code>Sheet.IndentBackground</code>: the page behind scaled back while a
        sheet is open (iOS’ stacked look; not used here, see the overview’s
        deviations).
      </li>
      <li>
        <code>Sheet.VirtualKeyboardProvider</code>: a sheet with fields kept
        above the software keyboard.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetPartsDemos = [
  RootPart,
  TriggerPart,
  PopupPart,
  HeaderPart,
  GrabberPart,
  ContentPart,
  TitlePart,
  DescriptionPart,
  ClosePart,
  CreateHandlePart,
  UseCreateSheetHandlePart,
];
