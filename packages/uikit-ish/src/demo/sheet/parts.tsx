import { FunctionComponent, useRef } from 'react';

import { Button, List, Sheet, Toolbar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { names } from '../viewport/content.js';
import {
  sheetCloseRows,
  sheetContentRows,
  sheetDescriptionRows,
  sheetHeaderRows,
  sheetPopupRows,
  sheetRootRows,
  sheetTitleRows,
  sheetTriggerRows,
} from './docs.js';
import {
  propOptionsGuidePopup,
  propOptionsGuideRoot,
  propOptionsPart,
} from './props.js';

// Each view: a phone's screen, its button presenting the sheet (opened, the
// part is outlined; see its controls).

/** `Sheet.Root`: the sheet's state: its trigger and its popup (no element of its own). */
const RootPart: FunctionComponent = () => {
  const id = 'sheet-parts-root';
  const [log, addLog] = useLog();
  const screen = useRef<HTMLDivElement>(null);
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGuideRoot,
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
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
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
  const screen = useRef<HTMLDivElement>(null);
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
  const screen = useRef<HTMLDivElement>(null);
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
  const screen = useRef<HTMLDivElement>(null);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
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
  const screen = useRef<HTMLDivElement>(null);
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
  const screen = useRef<HTMLDivElement>(null);
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
  const screen = useRef<HTMLDivElement>(null);
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
  const screen = useRef<HTMLDivElement>(null);
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

/** `/sheet/parts`: its root, trigger, popup, header, content, and Base UI's. */
export const SheetParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root (its state), its trigger, and its popup: a header (its grabber, a
        toolbar) above its content.
      </li>
      <li>
        Base UI’s <code>Dialog</code>, its parts re-exported: its title,
        description and close buttons; its portal and backdrop rendered by{' '}
        <code>Sheet.Popup</code>.
      </li>
      <li>Press each view’s button to open its sheet.</li>
    </ul>
    <ul>
      <li>
        <PartLink part="Sheet.Root" />
        <ul>
          <li>
            <PartLink part="Sheet.Trigger" />
          </li>
          <li>
            <PartLink part="Sheet.Popup" />
            <ul>
              <li>
                <PartLink part="Sheet.Header" /> (a toolbar:{' '}
                <PartLink part="Sheet.Close" />, <PartLink part="Sheet.Title" />
                )
              </li>
              <li>
                <PartLink part="Sheet.Content" /> (
                <PartLink part="Sheet.Description" />, optional)
              </li>
            </ul>
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
        Renders a <code>div</code> (a <code>dialog</code>), and its backdrop’s{' '}
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
        Its grabber (36px by 5px), above a toolbar of the app’s; dragged down
        (but by its buttons), it closes the sheet.
      </li>
      <li>
        Renders a <code>div</code> (and a hidden close button, for its drag).
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={sheetHeaderRows} />

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
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetPartsDemos = [
  RootPart,
  TriggerPart,
  PopupPart,
  HeaderPart,
  ContentPart,
  TitlePart,
  DescriptionPart,
  ClosePart,
];
