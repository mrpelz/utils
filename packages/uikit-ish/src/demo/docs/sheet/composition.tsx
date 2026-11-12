import { FunctionComponent, useMemo, useState } from 'react';

import {
  ActionSheet,
  Button,
  Header,
  List,
  Navigation,
  Page,
  Sheet,
  Symbol,
  TextField,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  type PartProps,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfChevronBackward,
  sfEllipsis,
  sfSquareAndArrowUp,
  sfXmark,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { pages } from '../navigation/content.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import { getPropOptionsOpeningAtAStop } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const detentsCode = `<Viewport.Content>
  <Sheet.Root>
    <Sheet.Trigger render={<Button.Root variant="bordered" />}>
      <Button.Label>Medium</Button.Label>
    </Sheet.Trigger>
    {/* As high as its content: a glass panel. */}
    <Sheet.Popup compact detent="medium">
      <Sheet.Header>
        <Sheet.Grabber />…</Sheet.Header>
      <Sheet.Content>…</Sheet.Content>
    </Sheet.Popup>
  </Sheet.Root>
  <Sheet.Root>
    <Sheet.Trigger render={<Button.Root variant="bordered" />}>
      <Button.Label>Large</Button.Label>
    </Sheet.Trigger>
    {/* The whole screen but its top. */}
    <Sheet.Popup background="grouped" compact>
      …
    </Sheet.Popup>
  </Sheet.Root>
</Viewport.Content>`;

const cancelDoneCode = `const [isOpen, setIsOpen] = useState(false);
const [isConfirming, setIsConfirming] = useState(false);
const [name, setName] = useState('');
const edited = name !== '';
// Closing (Cancel, Escape, swiped down) while edited: confirm first.
const close = () => (edited ? setIsConfirming(true) : setIsOpen(false));
const save = () => {
  …
  setIsOpen(false);
};
const discard = () => {
  setName('');
  setIsOpen(false);
};

<Sheet.Root
  disablePointerDismissal={edited}
  open={isOpen}
  onOpenChange={(next) => (next ? setIsOpen(true) : close())}
>
  <Sheet.Trigger render={<Button.Root variant="bordered" />}>…</Sheet.Trigger>
  <Sheet.Popup background="grouped">
    <Sheet.Header>
      <Sheet.Grabber />
      <Toolbar.Root placement="block-start">
        <Toolbar.Leading>
          <Toolbar.Button onClick={close}>
            <Button.Label>Cancel</Button.Label>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Title>
          <Sheet.Title render={<span />}>New Contact</Sheet.Title>
        </Toolbar.Title>
        <Toolbar.Trailing>
          <Toolbar.Button disabled={!edited} prominent onClick={save}>
            <Button.Label>Done</Button.Label>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Sheet.Header>
    <Sheet.Content>
      <Viewport.Padding edge="block-start" />
      …{/* its fields */}
    </Sheet.Content>
    <ActionSheet.Root open={isConfirming} onOpenChange={setIsConfirming}>
      <ActionSheet.Popup>
        <ActionSheet.Actions>
          <ActionSheet.Action variant="destructive" onClick={discard}>
            Discard Changes
          </ActionSheet.Action>
          <ActionSheet.Action>Keep Editing</ActionSheet.Action>
        </ActionSheet.Actions>
      </ActionSheet.Popup>
    </ActionSheet.Root>
  </Sheet.Popup>
</Sheet.Root>`;

const navigationCode = `const [keys, setKeys] = useState(['settings']);
const pop = () => setKeys((current) => current.slice(0, -1));

<Sheet.Popup background="grouped">
  {/* Its grabber alone: the navigation has its bars. */}
  <Sheet.Header>
    <Sheet.Grabber />
  </Sheet.Header>
  <Sheet.Content>
    <Navigation.Root onBack={pop}>
      <Navigation.SwipeArea />
      <Navigation.Stack>
        {keys.map((key, index) => (
          <Header.Root key={key}>
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                {/* Each pushed page's back button, and every page's Done:
                   staying put between pages having them. */}
                {index > 0 ? (
                  <Toolbar.Leading>
                    <Navigation.Back … />
                  </Toolbar.Leading>
                ) : null}
                <Toolbar.Title>…</Toolbar.Title>
                <Toolbar.Trailing>
                  <Navigation.Persistent
                    persistentId="done"
                    render={<Sheet.Close render={<Toolbar.Button prominent />} />}
                  >
                    <Button.Label>Done</Button.Label>
                  </Navigation.Persistent>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Viewport.BlockStart>
            <Page.Root>
              <Viewport.Padding edge="block-start" />
              <List.Root>…{/* rows pushing a page */}</List.Root>
              <Viewport.Padding edge="block-end" />
            </Page.Root>
          </Header.Root>
        ))}
      </Navigation.Stack>
    </Navigation.Root>
  </Sheet.Content>
</Sheet.Popup>`;

const cardCode = `<Sheet.Popup compact={false} detent="medium" regular="card">
  <Sheet.Header>…</Sheet.Header>
  <Sheet.Content>
    <Sheet.SnapGroup value="header" />
    <Sheet.SnapGroup value="peek">…</Sheet.SnapGroup>
    <Sheet.SnapGroup value="details">…</Sheet.SnapGroup>
    <Sheet.SnapGroup value="all">…</Sheet.SnapGroup>
  </Sheet.Content>
</Sheet.Popup>`;

const formSheetCode = `<Sheet.Popup background="grouped" compact={false}>
  <Sheet.Header>
    <Sheet.Grabber />
    <Toolbar.Root placement="block-start">…</Toolbar.Root>
  </Sheet.Header>
  <Sheet.Content>…</Sheet.Content>
</Sheet.Popup>`;

const withoutAGrabberCode = `<Sheet.Popup compact detent="medium">
  {/* No Sheet.Grabber: the header is its toolbar alone. */}
  <Sheet.Header>
    <Toolbar.Root placement="block-start">
      <Toolbar.Title>
        <Sheet.Title render={<span />}>Filter</Sheet.Title>
      </Toolbar.Title>
      <Toolbar.Trailing>
        <Sheet.Close render={<Toolbar.Button prominent />}>
          <Button.Label>Done</Button.Label>
        </Sheet.Close>
      </Toolbar.Trailing>
    </Toolbar.Root>
  </Sheet.Header>
  <Sheet.Content>
    <Viewport.Padding edge="block-start" />
    <List.Root>…</List.Root>
    <Viewport.Padding edge="block-end" />
  </Sheet.Content>
</Sheet.Popup>`;

const openingAtAStopCode = `<Sheet.Root defaultSnapPoint="header">
  <Sheet.Trigger render={<Button.Root />}>
    <Button.Label>Show Place</Button.Label>
  </Sheet.Trigger>
  {/* Deep links: each opens it at a stop of its own. */}
  <Sheet.Trigger
    render={<Button.Root />}
    snapPoint="details"
  >
    <Button.Label>Contact</Button.Label>
  </Sheet.Trigger>
  …
  <Sheet.Popup compact detent="medium">
    <Sheet.Header>
      <Sheet.Grabber />
      <Toolbar.Root placement="block-start">…</Toolbar.Root>
    </Sheet.Header>
    <Sheet.Content>
      <Viewport.Padding edge="block-start" />
      {/* An empty group first: the header alone, a stop of its own. */}
      <Sheet.SnapGroup value="header" />
      <Sheet.SnapGroup value="peek">…</Sheet.SnapGroup>
      <Sheet.SnapGroup value="details">…</Sheet.SnapGroup>
      <Sheet.SnapGroup value="all">
        …
        <Viewport.Padding edge="block-end" />
      </Sheet.SnapGroup>
    </Sheet.Content>
  </Sheet.Popup>
</Sheet.Root>`;

const withoutAHeaderStopCode = `<Sheet.Root defaultSnapPoint="peek">
  <Sheet.Trigger render={<Button.Root />}>
    <Button.Label>Show Place</Button.Label>
  </Sheet.Trigger>
  <Sheet.Popup compact detent="medium">
    <Sheet.Header>…</Sheet.Header>
    <Sheet.Content>
      <Viewport.Padding edge="block-start" />
      {/* No empty group first: the lowest stop is the summary. */}
      <Sheet.SnapGroup value="peek">…</Sheet.SnapGroup>
      <Sheet.SnapGroup value="details">…</Sheet.SnapGroup>
      <Sheet.SnapGroup value="all">…</Sheet.SnapGroup>
    </Sheet.Content>
  </Sheet.Popup>
</Sheet.Root>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Two sheets: medium (a few rows), large (a list). */
const Detents: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact', 'detent'],
            'Sheet.Root': [],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sheet-composition-detents') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="sheet-composition-detents"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Medium and large sheets"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root {...partProps['Sheet.Root']}>
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Medium</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            detent="medium"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Sort By
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {['First Name', 'Last Name', 'Company'].map((order) => (
                      <List.Item
                        key={order}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            render={<button type="button" />}
                            onClick={() => addLog(`sort: ${order}`)}
                          >
                            {order}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
        <Sheet.Root {...partProps['Sheet.Root']}>
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Large</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Contacts
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A form in a sheet: Cancel and Done, discarding edits confirmed. */
const CancelDone: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [name, setName] = useState('');
  const isEdited = name !== '';
  const close = () => (isEdited ? setIsConfirming(true) : setIsOpen(false));

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'ActionSheet.Action': ['onClick', 'variant'],
            'ActionSheet.Actions': [],
            'ActionSheet.Popup': [],
            'ActionSheet.Root': ['onOpenChange', 'open'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Trailing': [],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['disablePointerDismissal', 'onOpenChange', 'open'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'TextField.Clear': [],
            'TextField.Control': [
              'aria-label',
              'onValueChange',
              'placeholder',
              'value',
            ],
            'TextField.Root': ['render'],
            'Toolbar.Button': ['disabled', 'onClick', 'prominent'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sheet-composition-cancel-done') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="sheet-composition-cancel-done"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="A sheet with Cancel and Done"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          disablePointerDismissal={isEdited}
          open={isOpen}
          onOpenChange={(isNextOpen: boolean) =>
            isNextOpen ? setIsOpen(true) : close()
          }
        >
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              New Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    onClick={close}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Toolbar.Button>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    New Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    prominent
                    disabled={!isEdited}
                    onClick={() => {
                      addLog(`saved: ${name}`);
                      setName('');
                      setIsOpen(false);
                    }}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Toolbar.Button>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    <TextField.Root
                      {...partProps['TextField.Root']}
                      render={<List.Item {...partProps['List.Item']} />}
                    >
                      <List.Trailing {...partProps['List.Trailing']}>
                        <TextField.Control
                          {...partProps['TextField.Control']}
                          aria-label="Name"
                          placeholder="Name"
                          value={name}
                          onValueChange={setName}
                        />
                        <TextField.Clear {...partProps['TextField.Clear']} />
                      </List.Trailing>
                    </TextField.Root>
                  </List.Group>
                  <List.Footer {...partProps['List.Footer']}>
                    Type a name, then Cancel (or drag the sheet down).
                  </List.Footer>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </Sheet.Content>
            <ActionSheet.Root
              {...partProps['ActionSheet.Root']}
              open={isConfirming}
              onOpenChange={setIsConfirming}
            >
              <ActionSheet.Popup {...partProps['ActionSheet.Popup']}>
                <ActionSheet.Actions {...partProps['ActionSheet.Actions']}>
                  <ActionSheet.Action
                    {...partProps['ActionSheet.Action']}
                    variant="destructive"
                    onClick={() => {
                      addLog('discarded');
                      setName('');
                      setIsOpen(false);
                    }}
                  >
                    Discard Changes
                  </ActionSheet.Action>
                  <ActionSheet.Action
                    {...partProps['ActionSheet.Action']}
                    onClick={() => addLog('keep editing')}
                  >
                    Keep Editing
                  </ActionSheet.Action>
                </ActionSheet.Actions>
              </ActionSheet.Popup>
            </ActionSheet.Root>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A medium sheet of filters: its toolbar only, no grabber. */
const WithoutAGrabber: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': ['onOpenChange'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sheet-composition-without-grabber') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="sheet-composition-without-grabber"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="A sheet without a grabber"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
        >
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Filter</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            detent="medium"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    Filter
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {['Unread', 'Flagged', 'With Attachments'].map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A stack in a sheet: settings drilled into, Done on every page. */
const NavigationInside: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(['settings']);
  const push = (key: string) => {
    addLog(`push: ${key}`);
    setKeys((current) => [...current, key]);
  };
  const pop = () => {
    addLog('pop');
    setKeys((current) => current.slice(0, -1));
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Persistent': ['persistentId', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': ['className'],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact'],
            'Sheet.Root': ['onOpenChangeComplete'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['prominent', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sheet-composition-navigation') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="sheet-composition-navigation"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="A navigation in a sheet"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          onOpenChangeComplete={(isOpen: boolean) => {
            if (!isOpen) setKeys(['settings']);
          }}
        >
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Settings</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            compact
            background="grouped"
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
            </Sheet.Header>
            <Sheet.Content
              {...partProps['Sheet.Content']}
              className="sheet-demo-stack"
            >
              <Navigation.Root
                {...partProps['Navigation.Root']}
                onBack={pop}
              >
                <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
                <Navigation.Stack {...partProps['Navigation.Stack']}>
                  {keys.map((key, depth) => (
                    <Header.Root key={key}>
                      <Viewport.BlockStart
                        {...partProps['Viewport.BlockStart']}
                      >
                        <Toolbar.Root
                          {...partProps['Toolbar.Root']}
                          placement="block-start"
                        >
                          {depth > 0 ? (
                            <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                              <Navigation.Back
                                {...partProps['Navigation.Back']}
                                aria-label={pages[keys[depth - 1] ?? '']?.title}
                                render={
                                  <Toolbar.Button
                                    {...partProps['Toolbar.Button']}
                                    shape="circle"
                                  />
                                }
                              >
                                <Button.Icon {...partProps['Button.Icon']}>
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={sfChevronBackward}
                                  />
                                </Button.Icon>
                              </Navigation.Back>
                            </Toolbar.Leading>
                          ) : null}
                          <Toolbar.Title {...partProps['Toolbar.Title']}>
                            {depth === 0 ? (
                              <Sheet.Title
                                {...partProps['Sheet.Title']}
                                render={<span />}
                              >
                                {pages[key]?.title}
                              </Sheet.Title>
                            ) : (
                              <span>{pages[key]?.title}</span>
                            )}
                          </Toolbar.Title>
                          {/* On every page, staying put (persistent). */}
                          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                            <Navigation.Persistent
                              {...partProps['Navigation.Persistent']}
                              persistentId="done"
                              render={
                                <Sheet.Close
                                  {...partProps['Sheet.Close']}
                                  render={
                                    <Toolbar.Button
                                      {...partProps['Toolbar.Button']}
                                      prominent
                                    />
                                  }
                                />
                              }
                            >
                              <Button.Label {...partProps['Button.Label']}>
                                Done
                              </Button.Label>
                            </Navigation.Persistent>
                          </Toolbar.Trailing>
                        </Toolbar.Root>
                      </Viewport.BlockStart>
                      <Page.Root {...partProps['Page.Root']}>
                        <Viewport.Padding
                          {...partProps['Viewport.Padding']}
                          edge="block-start"
                        />
                        <List.Root {...partProps['List.Root']}>
                          <List.Section {...partProps['List.Section']}>
                            <List.Group {...partProps['List.Group']}>
                              {pages[key]?.children.map((child) => (
                                <List.Item
                                  key={child}
                                  {...partProps['List.Item']}
                                >
                                  <List.Content {...partProps['List.Content']}>
                                    <List.Title
                                      {...partProps['List.Title']}
                                      render={<button type="button" />}
                                      onClick={() => push(child)}
                                    >
                                      {pages[child]?.title}
                                    </List.Title>
                                  </List.Content>
                                  <List.Trailing
                                    {...partProps['List.Trailing']}
                                  >
                                    <List.DrillIn
                                      {...partProps['List.DrillIn']}
                                    />
                                  </List.Trailing>
                                </List.Item>
                              ))}
                            </List.Group>
                          </List.Section>
                        </List.Root>
                        <Viewport.Padding
                          {...partProps['Viewport.Padding']}
                          edge="block-end"
                        />
                      </Page.Root>
                    </Header.Root>
                  ))}
                </Navigation.Stack>
              </Navigation.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A tablet's form sheet: centered over the page. */
const FormSheet: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Trailing': [],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['background', 'compact', 'detent', 'regular'],
            'Sheet.Root': [],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'TextField.Clear': [],
            'TextField.Control': ['placeholder', 'type'],
            'TextField.Label': [],
            'TextField.Root': ['render'],
            'Toolbar.Button': ['aria-label', 'onClick', 'prominent', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sheet-composition-form-sheet') },
  );

  return (
    <Component
      hasInputGuards
      isExpanded
      isInline
      controls={[partControls]}
      id="sheet-composition-form-sheet"
      log={log}
      screen="centered"
      stage="tablet"
      state={[partState]}
      title="A form sheet on a tablet"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root {...partProps['Sheet.Root']}>
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              New Contact
            </Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            {...partProps['Sheet.Popup']}
            background="grouped"
            compact={false}
          >
            <Sheet.Header {...partProps['Sheet.Header']}>
              <Sheet.Grabber {...partProps['Sheet.Grabber']} />
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={<Toolbar.Button {...partProps['Toolbar.Button']} />}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Cancel
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <Sheet.Title
                    {...partProps['Sheet.Title']}
                    render={<span />}
                  >
                    New Contact
                  </Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Sheet.Close
                    {...partProps['Sheet.Close']}
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        prominent
                        onClick={() => addLog('Done clicked')}
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Done
                    </Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content {...partProps['Sheet.Content']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root {...partProps['List.Root']}>
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
                          placeholder="Required"
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
                          type="tel"
                        />
                        <TextField.Clear {...partProps['TextField.Clear']} />
                      </List.Trailing>
                    </TextField.Root>
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/**
 * A place's sheet (medium: glass, snapping by its groups): its header a
 * stop of its own (`header`: an empty group, the capsule its bar alone;
 * not without `hasHeaderStop`), then a summary, its actions, its reviews;
 * a phone's, or (`isCard`) a tablet's card at the leading edge.
 */
const placePopup = (
  addLog: (entry: string) => void,
  isCard = false,
  hasHeaderStop = true,
  partProps: PartProps = {},
) => (
  <Sheet.Popup
    {...partProps['Sheet.Popup']}
    compact={!isCard}
    detent="medium"
    regular={isCard ? 'card' : undefined}
  >
    <Sheet.Header {...partProps['Sheet.Header']}>
      <Sheet.Grabber {...partProps['Sheet.Grabber']} />
      <Toolbar.Root
        {...partProps['Toolbar.Root']}
        placement="block-start"
      >
        <Toolbar.Leading {...partProps['Toolbar.Leading']}>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Share"
            shape="circle"
            onClick={() => addLog('Share clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndArrowUp}
              />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Title {...partProps['Toolbar.Title']}>
          <Sheet.Title
            {...partProps['Sheet.Title']}
            render={<span />}
          >
            Harbor Café
          </Sheet.Title>
        </Toolbar.Title>
        <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="More"
            shape="circle"
            onClick={() => addLog('More clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfEllipsis}
              />
            </Button.Icon>
          </Toolbar.Button>
          <Sheet.Close
            {...partProps['Sheet.Close']}
            render={
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Close"
                shape="circle"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfXmark}
              />
            </Button.Icon>
          </Sheet.Close>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Sheet.Header>
    <Sheet.Content {...partProps['Sheet.Content']}>
      <Viewport.Padding
        {...partProps['Viewport.Padding']}
        edge="block-start"
      />
      {hasHeaderStop ? (
        <Sheet.SnapGroup
          {...partProps['Sheet.SnapGroup']}
          value="header"
        />
      ) : null}
      <Sheet.SnapGroup
        {...partProps['Sheet.SnapGroup']}
        value="peek"
      >
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>
                    Open until 6 PM
                  </List.Title>
                  <List.Subtitle {...partProps['List.Subtitle']}>
                    Café · 300 m
                  </List.Subtitle>
                </List.Content>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </Sheet.SnapGroup>
      <Sheet.SnapGroup
        {...partProps['Sheet.SnapGroup']}
        value="details"
      >
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {['Call', 'Website', 'Directions'].map((action) => (
                <List.Item
                  key={action}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title
                      {...partProps['List.Title']}
                      render={<button type="button" />}
                      onClick={() => addLog(`${action} clicked`)}
                    >
                      {action}
                    </List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
      </Sheet.SnapGroup>
      <Sheet.SnapGroup
        {...partProps['Sheet.SnapGroup']}
        value="all"
      >
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {names.map((name) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
                    <List.Subtitle {...partProps['List.Subtitle']}>
                      Review
                    </List.Subtitle>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-end"
        />
      </Sheet.SnapGroup>
    </Sheet.Content>
  </Sheet.Popup>
);

/** Deep links into the place's sheet: a stop, a trigger's label. */
const links: readonly [string, string][] = [
  ['peek', 'Opening Hours'],
  ['details', 'Contact'],
  ['all', 'Reviews'],
];

/**
 * Opening at a stop: where (`defaultSnapPoint`) apart from whether it's
 * open at first (`defaultOpen`), and triggers linking into stops of their
 * own (`snapPoint`); its own (uncontrolled).
 */
const OpeningAtAStop: FunctionComponent = () => {
  const id = 'sheet-composition-opening-at-a-stop';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsOpeningAtAStop(addLog), [addLog]),
    { external, isOpen: true, title: 'Sheet.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': ['onClick', 'render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent', 'regular'],
            'Sheet.SnapGroup': ['value'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render', 'snapPoint'],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Opening at a stop"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          key={`${elementKey}`}
          {...props}
        >
          <div className="sheet-demo-links">
            <Sheet.Trigger
              {...partProps['Sheet.Trigger']}
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  size="large"
                  variant="bordered-prominent"
                />
              }
            >
              <Button.Label {...partProps['Button.Label']}>
                Show Place
              </Button.Label>
            </Sheet.Trigger>
            {/* Deep links: each opening it at a stop of its own. */}
            {links.map(([stop, label]) => (
              <Sheet.Trigger
                key={stop}
                {...partProps['Sheet.Trigger']}
                snapPoint={stop}
                render={
                  <Button.Root
                    {...partProps['Button.Root']}
                    size="large"
                    variant="bordered"
                  />
                }
              >
                <Button.Label {...partProps['Button.Label']}>
                  {label}
                </Button.Label>
              </Sheet.Trigger>
            ))}
          </div>
          {placePopup(addLog, undefined, undefined, partProps)}
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/**
 * Without a header stop: the place's sheet, its groups alone (scrolled
 * away, none below its top stop: swiped out from there).
 */
const WithoutAHeaderStop: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': ['onClick', 'render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent', 'regular'],
            'Sheet.Root': ['defaultSnapPoint'],
            'Sheet.SnapGroup': ['value'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sheet-composition-without-a-header-stop') },
  );

  return (
    <Component
      hasWallpaper
      isInline
      controls={[partControls]}
      id="sheet-composition-without-a-header-stop"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Without a header stop"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root
          {...partProps['Sheet.Root']}
          defaultSnapPoint="peek"
        >
          <div className="sheet-demo-links">
            <Sheet.Trigger
              {...partProps['Sheet.Trigger']}
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  size="large"
                  variant="bordered-prominent"
                />
              }
            >
              <Button.Label {...partProps['Button.Label']}>
                Show Place
              </Button.Label>
            </Sheet.Trigger>
          </div>
          {placePopup(addLog, false, false, partProps)}
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/**
 * A tablet's card (`regular` `card`): the place's sheet at the leading
 * edge, snapping as on a phone, over the page.
 */
const CardOnATablet: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': ['onClick', 'render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent', 'regular'],
            'Sheet.Root': [],
            'Sheet.SnapGroup': ['value'],
            'Sheet.Title': ['render'],
            'Sheet.Trigger': ['render'],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('sheet-composition-card') },
  );

  return (
    <Component
      hasWallpaper
      isExpanded
      isInline
      controls={[partControls]}
      id="sheet-composition-card"
      log={log}
      screen="centered"
      stage="tablet"
      state={[partState]}
      title="A card on a tablet"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Sheet.Root {...partProps['Sheet.Root']}>
          <Sheet.Trigger
            {...partProps['Sheet.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered-prominent"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Show Place
            </Button.Label>
          </Sheet.Trigger>
          {placePopup(addLog, true, undefined, partProps)}
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['medium-and-large', 'Medium and large'],
  ['cancel-and-done', 'Cancel and Done'],
  ['without-a-grabber', 'Without a grabber'],
  ['a-navigation-inside', 'A navigation inside'],
  ['a-form-sheet-on-a-tablet', 'A form sheet on a tablet'],
  ['opening-at-a-stop', 'Opening at a stop'],
  ['without-a-header-stop', 'Without a header stop'],
  ['a-card-on-a-tablet', 'A card on a tablet'],
];

/** `/sheet/composition`: sheets' detents, tasks, stacks and widths. */
export const SheetComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Each view is a screen of its own, and its sheets render inside it (it’s
        their portals’ default container, through{' '}
        <code>PortalContainerContext</code>). Whether they’re compact is set per
        sheet (<code>compact</code>), not by the window.
      </li>
    </ul>

    <Heading
      id="medium-and-large"
      level={2}
    >
      Medium and large
    </Heading>
    <ul>
      <li>
        Medium suits a few options for the page (Sort By): a glass panel as tall
        as its content, with the page above it still in view.
      </li>
      <li>
        Large (the default) suits a task with a lot to show: the whole screen
        except its top.
      </li>
      <li>The app picks the detent per sheet; swiping doesn’t change it.</li>
      <li>
        <strong>Library:</strong> the sheet (
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />
        ) at its medium or large detent, with its grabber, header and content.
      </li>
      <li>
        <strong>Demo:</strong> the options in each sheet.
      </li>
    </ul>
    <CodeView code={detentsCode} />
    <Detents />

    <Heading
      id="cancel-and-done"
      level={2}
    >
      Cancel and Done
    </Heading>
    <ul>
      <li>
        A task in a sheet: Cancel on the leading side, and Done (prominent) on
        the trailing side. Done stays disabled until there’s something to save.
      </li>
      <li>
        Once something is edited, closing it (by Cancel, Escape or a swipe down)
        asks first, with an <a href={publicUrl('action-sheet')}>Action Sheet</a>
        : Discard Changes or Keep Editing. A press outside it does nothing (
        <code>disablePointerDismissal</code>).
      </li>
      <li>
        It’s controlled (<code>open</code>), so <code>onOpenChange</code> asks
        for confirmation instead of closing. When a swipe down is kept open, the
        sheet springs back.
      </li>
      <li>
        A sheet is for a scoped task that keeps its parent in view, and the
        confirmation belongs to it (one transient surface at a time).
      </li>
      <li>
        <strong>Library:</strong> the sheet’s controlled <code>open</code> and{' '}
        <code>onOpenChange</code>, springing back when kept open,{' '}
        <code>disablePointerDismissal</code>, and the{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Root"
        />{' '}
        that asks.
      </li>
      <li>
        <strong>Demo:</strong> the name (the app’s state), whether it’s been
        edited, asking before discarding, and saving on Done.
      </li>
    </ul>
    <CodeView code={cancelDoneCode} />
    <CancelDone />

    <Heading
      id="without-a-grabber"
      level={2}
    >
      Without a grabber
    </Heading>
    <ul>
      <li>
        The grabber (
        <PartLink
          component="sheet"
          part="Sheet.Grabber"
        />
        ) is optional. Without it, the top is cleaner, and the header is only
        its toolbar.
      </li>
      <li>
        The sheet can still be swiped down (by any part of the header, while its
        content is scrolled to the top), and its Done closes it.
      </li>
      <li>
        <strong>Library:</strong> the sheet without its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Grabber"
        />
        , which can still be swiped down to close.
      </li>
      <li>
        <strong>Demo:</strong> the sheet’s content.
      </li>
    </ul>
    <CodeView code={withoutAGrabberCode} />
    <WithoutAGrabber />

    <Heading
      id="a-navigation-inside"
      level={2}
    >
      A navigation inside
    </Heading>
    <ul>
      <li>
        A task with several levels: a{' '}
        <a href={publicUrl('navigation')}>Navigation</a> is the sheet’s content.
        Each page’s bar holds its title, which moves with it. The back button
        (from the first pushed page on) and Done are persistent items (see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ), which stay put between pages that have them. So Done never moves, and
        the back button slides in and out with the first pushed page.
      </li>
      <li>
        Its header is only the grabber (a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />{' '}
        without children), above the pages’ bars. Swiped down, it closes.
      </li>
      <li>
        Once closed, the stack is reset to its root (
        <code>onOpenChangeComplete</code>).
      </li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />{' '}
        as the sheet’s content, the header’s grabber above the pages’ bars, and{' '}
        <code>onOpenChangeComplete</code>.
      </li>
      <li>
        <strong>Demo:</strong> the stack’s keys, and resetting them once closed.
      </li>
    </ul>
    <CodeView code={navigationCode} />
    <NavigationInside />

    <Heading
      id="a-form-sheet-on-a-tablet"
      level={2}
    >
      A form sheet on a tablet
    </Heading>
    <ul>
      <li>
        On a regular width, such as a tablet’s, it’s a form sheet in the center,
        up to 936px by 852px, with the page dimmed around it.
      </li>
      <li>
        The window decides (from 768px), or you set it, as here, with{' '}
        <code>compact={'{false}'}</code>.
      </li>
      <li>The same sheet adapts, and its task stays the same.</li>
      <li>
        <strong>Library:</strong> the form sheet (
        <code>
          compact={'{'}false{'}'}
        </code>
        ) in the center, with the page dimmed around it.
      </li>
      <li>
        <strong>Demo:</strong> the form’s fields.
      </li>
    </ul>
    <CodeView code={formSheetCode} />
    <FormSheet />

    <Heading
      id="opening-at-a-stop"
      level={2}
    >
      Opening at a stop
    </Heading>
    <ul>
      <li>
        A place’s sheet, revealed group by group (
        <PartLink
          component="sheet"
          part="Sheet.SnapGroup"
        />
        ). First comes its header alone (<code>header</code>, an empty group, so
        the capsule is just its bar, with its buttons in reach). Then a summary
        (<code>peek</code>), its actions (<code>details</code>) and its reviews
        (<code>all</code>).
      </li>
      <li>
        Where it opens (<code>defaultSnapPoint</code>) is separate from whether
        it’s open at first (<code>defaultOpen</code>). Each time it opens again,
        it’s at that stop again.
      </li>
      <li>
        Its other triggers are deep links that open it at a stop of their own (
        <PartLink
          component="sheet"
          part="Sheet.Trigger"
        >
          Sheet.Trigger snapPoint
        </PartLink>
        ): its hours (Opening Hours), its actions (Contact) and its reviews
        (Reviews). Show Place opens it at its default.
      </li>
      <li>
        Swiping moves one stop at a time, and swiping down from the lowest
        closes it. At <code>all</code>, its reviews scroll.
      </li>
      <li>
        <strong>Library:</strong> the stops made by its groups, opening at one
        (its default, or a trigger’s), and snapping within its glass capsule.
      </li>
      <li>
        <strong>Demo:</strong> the place, its groups’ names, its triggers’
        stops, and logging its stops and buttons.
      </li>
    </ul>
    <CodeView code={openingAtAStopCode} />
    <OpeningAtAStop />

    <Heading
      id="without-a-header-stop"
      level={2}
    >
      Without a header stop
    </Heading>
    <ul>
      <li>
        The place’s sheet with only its groups. There’s no empty{' '}
        <PartLink
          component="sheet"
          part="Sheet.SnapGroup"
        />{' '}
        first, so its lowest stop is its summary (<code>peek</code>).
      </li>
      <li>
        Once it’s fully extended with its reviews scrolled, no stop below the
        top one counts, because the groups scrolled away aren’t stops. Dragging
        its header down then swipes it out from there at once. Scrolled back to
        the start, its stops count again.
      </li>
    </ul>
    <CodeView code={withoutAHeaderStopCode} />
    <WithoutAHeaderStop />

    <Heading
      id="a-card-on-a-tablet"
      level={2}
    >
      A card on a tablet
    </Heading>
    <ul>
      <li>
        The place’s sheet on a regular width, such as a tablet’s: a card from
        the bottom at the leading edge, like a regular{' '}
        <PartLink
          component="island"
          part="Island.Root"
        />{' '}
        (375px wide, 10px in), up to 64px below the top, with the page next to
        it.
      </li>
      <li>
        It keeps its detent, swiping and snapping, as on a phone. That suits a
        panel above a full-screen view, such as a map or playback. For a task
        such as editing, use a form sheet instead (see{' '}
        <a href="#a-form-sheet-on-a-tablet">A form sheet on a tablet</a>).
      </li>
      <li>
        <strong>Library:</strong> the card (
        <code>regular=&quot;card&quot;</code>), set not to be compact here (
        <code>
          compact={'{'}false{'}'}
        </code>
        ; otherwise the window decides, from 768px).
      </li>
      <li>
        <strong>Demo:</strong> the place, and logging its buttons.
      </li>
    </ul>
    <CodeView code={cardCode} />
    <CardOnATablet />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetCompositionDemos = [
  Detents,
  CancelDone,
  WithoutAGrabber,
  NavigationInside,
  FormSheet,
  OpeningAtAStop,
  WithoutAHeaderStop,
  CardOnATablet,
];
