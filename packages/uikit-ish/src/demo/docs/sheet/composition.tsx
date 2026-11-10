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
import { usePropControl } from '../../tooling/frame/prop-control.js';
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
    <Sheet.Grabber />…</Sheet.Header>
  <Sheet.Content>…</Sheet.Content>
</Sheet.Popup>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Two sheets: medium (a few rows), large (a list). */
const Detents: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="sheet-composition-detents"
      log={log}
      screen="centered"
      stage="phone"
      title="Medium and large sheets"
    >
      <Viewport.Content>
        <Sheet.Root>
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Medium</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            detent="medium"
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading />
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Sort By</Sheet.Title>
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    {['First Name', 'Last Name', 'Company'].map((order) => (
                      <List.Item key={order}>
                        <List.Content>
                          <List.Title
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
              <Viewport.Padding edge="block-end" />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
        <Sheet.Root>
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Large</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            background="grouped"
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading />
                <Toolbar.Title>
                  <Sheet.Title render={<span />}>Contacts</Sheet.Title>
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      hasInputGuards
      isInline
      id="sheet-composition-cancel-done"
      log={log}
      screen="centered"
      stage="phone"
      title="A sheet with Cancel and Done"
    >
      <Viewport.Content>
        <Sheet.Root
          disablePointerDismissal={isEdited}
          open={isOpen}
          onOpenChange={(isNextOpen: boolean) =>
            isNextOpen ? setIsOpen(true) : close()
          }
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>New Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            background="grouped"
          >
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
                  <Toolbar.Button
                    prominent
                    disabled={!isEdited}
                    onClick={() => {
                      addLog(`saved: ${name}`);
                      setName('');
                      setIsOpen(false);
                    }}
                  >
                    <Button.Label>Done</Button.Label>
                  </Toolbar.Button>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <Viewport.Padding edge="block-start" />
              <List.Root>
                <List.Section>
                  <List.Group>
                    <TextField.Root render={<List.Item />}>
                      <List.Trailing>
                        <TextField.Control
                          aria-label="Name"
                          placeholder="Name"
                          value={name}
                          onValueChange={setName}
                        />
                        <TextField.Clear />
                      </List.Trailing>
                    </TextField.Root>
                  </List.Group>
                  <List.Footer>
                    Type a name, then Cancel (or drag the sheet down).
                  </List.Footer>
                </List.Section>
              </List.Root>
              <Viewport.Padding edge="block-end" />
            </Sheet.Content>
            <ActionSheet.Root
              open={isConfirming}
              onOpenChange={setIsConfirming}
            >
              <ActionSheet.Popup>
                <ActionSheet.Actions>
                  <ActionSheet.Action
                    variant="destructive"
                    onClick={() => {
                      addLog('discarded');
                      setName('');
                      setIsOpen(false);
                    }}
                  >
                    Discard Changes
                  </ActionSheet.Action>
                  <ActionSheet.Action onClick={() => addLog('keep editing')}>
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

  return (
    <Component
      isInline
      id="sheet-composition-without-grabber"
      log={log}
      screen="centered"
      stage="phone"
      title="A sheet without a grabber"
    >
      <Viewport.Content>
        <Sheet.Root
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Filter</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            detent="medium"
          >
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    {['Unread', 'Flagged', 'With Attachments'].map((name) => (
                      <List.Item key={name}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      isInline
      id="sheet-composition-navigation"
      log={log}
      screen="centered"
      stage="phone"
      title="A navigation in a sheet"
    >
      <Viewport.Content>
        <Sheet.Root
          onOpenChangeComplete={(isOpen: boolean) => {
            if (!isOpen) setKeys(['settings']);
          }}
        >
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Settings</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            compact
            background="grouped"
          >
            <Sheet.Header>
              <Sheet.Grabber />
            </Sheet.Header>
            <Sheet.Content className="sheet-demo-stack">
              <Navigation.Root onBack={pop}>
                <Navigation.SwipeArea />
                <Navigation.Stack>
                  {keys.map((key, depth) => (
                    <Header.Root key={key}>
                      <Viewport.BlockStart>
                        <Toolbar.Root placement="block-start">
                          {depth > 0 ? (
                            <Toolbar.Leading>
                              <Navigation.Back
                                aria-label={pages[keys[depth - 1] ?? '']?.title}
                                render={<Toolbar.Button shape="circle" />}
                              >
                                <Button.Icon>
                                  <Symbol icon={sfChevronBackward} />
                                </Button.Icon>
                              </Navigation.Back>
                            </Toolbar.Leading>
                          ) : null}
                          <Toolbar.Title>
                            {depth === 0 ? (
                              <Sheet.Title render={<span />}>
                                {pages[key]?.title}
                              </Sheet.Title>
                            ) : (
                              <span>{pages[key]?.title}</span>
                            )}
                          </Toolbar.Title>
                          {/* On every page, staying put (persistent). */}
                          <Toolbar.Trailing>
                            <Navigation.Persistent
                              persistentId="done"
                              render={
                                <Sheet.Close
                                  render={<Toolbar.Button prominent />}
                                />
                              }
                            >
                              <Button.Label>Done</Button.Label>
                            </Navigation.Persistent>
                          </Toolbar.Trailing>
                        </Toolbar.Root>
                      </Viewport.BlockStart>
                      <Page.Root>
                        <Viewport.Padding edge="block-start" />
                        <List.Root>
                          <List.Section>
                            <List.Group>
                              {pages[key]?.children.map((child) => (
                                <List.Item key={child}>
                                  <List.Content>
                                    <List.Title
                                      render={<button type="button" />}
                                      onClick={() => push(child)}
                                    >
                                      {pages[child]?.title}
                                    </List.Title>
                                  </List.Content>
                                  <List.Trailing>
                                    <List.DrillIn />
                                  </List.Trailing>
                                </List.Item>
                              ))}
                            </List.Group>
                          </List.Section>
                        </List.Root>
                        <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      hasInputGuards
      isExpanded
      isInline
      id="sheet-composition-form-sheet"
      log={log}
      screen="centered"
      stage="tablet"
      title="A form sheet on a tablet"
    >
      <Viewport.Content>
        <Sheet.Root>
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>New Contact</Button.Label>
          </Sheet.Trigger>
          <Sheet.Popup
            background="grouped"
            compact={false}
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
                  <Sheet.Title render={<span />}>New Contact</Sheet.Title>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close
                    render={
                      <Toolbar.Button
                        prominent
                        onClick={() => addLog('Done clicked')}
                      />
                    }
                  >
                    <Button.Label>Done</Button.Label>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <Viewport.Padding edge="block-start" />
              <List.Root>
                <List.Section>
                  <List.Group>
                    <TextField.Root render={<List.Item />}>
                      <List.Content>
                        <TextField.Label>Name</TextField.Label>
                      </List.Content>
                      <List.Trailing>
                        <TextField.Control placeholder="Required" />
                        <TextField.Clear />
                      </List.Trailing>
                    </TextField.Root>
                    <TextField.Root render={<List.Item />}>
                      <List.Content>
                        <TextField.Label>Phone</TextField.Label>
                      </List.Content>
                      <List.Trailing>
                        <TextField.Control type="tel" />
                        <TextField.Clear />
                      </List.Trailing>
                    </TextField.Root>
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding edge="block-end" />
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
) => (
  <Sheet.Popup
    compact={!isCard}
    detent="medium"
    regular={isCard ? 'card' : undefined}
  >
    <Sheet.Header>
      <Sheet.Grabber />
      <Toolbar.Root placement="block-start">
        <Toolbar.Leading>
          <Toolbar.Button
            aria-label="Share"
            shape="circle"
            onClick={() => addLog('Share clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfSquareAndArrowUp} />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Title>
          <Sheet.Title render={<span />}>Harbor Café</Sheet.Title>
        </Toolbar.Title>
        <Toolbar.Trailing>
          <Toolbar.Button
            aria-label="More"
            shape="circle"
            onClick={() => addLog('More clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfEllipsis} />
            </Button.Icon>
          </Toolbar.Button>
          <Sheet.Close
            render={
              <Toolbar.Button
                aria-label="Close"
                shape="circle"
              />
            }
          >
            <Button.Icon>
              <Symbol icon={sfXmark} />
            </Button.Icon>
          </Sheet.Close>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Sheet.Header>
    <Sheet.Content>
      <Viewport.Padding edge="block-start" />
      {hasHeaderStop ? <Sheet.SnapGroup value="header" /> : null}
      <Sheet.SnapGroup value="peek">
        <List.Root>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Content>
                  <List.Title>Open until 6 PM</List.Title>
                  <List.Subtitle>Café · 300 m</List.Subtitle>
                </List.Content>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </Sheet.SnapGroup>
      <Sheet.SnapGroup value="details">
        <List.Root>
          <List.Section>
            <List.Group>
              {['Call', 'Website', 'Directions'].map((action) => (
                <List.Item key={action}>
                  <List.Content>
                    <List.Title
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
      <Sheet.SnapGroup value="all">
        <List.Root>
          <List.Section>
            <List.Group>
              {names.map((name) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                    <List.Subtitle>Review</List.Subtitle>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      hasWallpaper
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Opening at a stop"
    >
      <Viewport.Content>
        <Sheet.Root
          key={`${elementKey}`}
          {...props}
        >
          <div className="sheet-demo-links">
            <Sheet.Trigger
              render={
                <Button.Root
                  size="large"
                  variant="bordered-prominent"
                />
              }
            >
              <Button.Label>Show Place</Button.Label>
            </Sheet.Trigger>
            {/* Deep links: each opening it at a stop of its own. */}
            {links.map(([stop, label]) => (
              <Sheet.Trigger
                key={stop}
                snapPoint={stop}
                render={
                  <Button.Root
                    size="large"
                    variant="bordered"
                  />
                }
              >
                <Button.Label>{label}</Button.Label>
              </Sheet.Trigger>
            ))}
          </div>
          {placePopup(addLog)}
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

  return (
    <Component
      hasWallpaper
      isInline
      id="sheet-composition-without-a-header-stop"
      log={log}
      screen="centered"
      stage="phone"
      title="Without a header stop"
    >
      <Viewport.Content>
        <Sheet.Root defaultSnapPoint="peek">
          <div className="sheet-demo-links">
            <Sheet.Trigger
              render={
                <Button.Root
                  size="large"
                  variant="bordered-prominent"
                />
              }
            >
              <Button.Label>Show Place</Button.Label>
            </Sheet.Trigger>
          </div>
          {placePopup(addLog, false, false)}
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

  return (
    <Component
      hasWallpaper
      isExpanded
      isInline
      id="sheet-composition-card"
      log={log}
      screen="centered"
      stage="tablet"
      title="A card on a tablet"
    >
      <Viewport.Content>
        <Sheet.Root>
          <Sheet.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered-prominent"
              />
            }
          >
            <Button.Label>Show Place</Button.Label>
          </Sheet.Trigger>
          {placePopup(addLog, true)}
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
        Each view a screen of its own: its sheets in it (its portals’ default
        container, <code>PortalContainerContext</code>), compact or not as set (
        <code>compact</code>), not by the window.
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
        Medium: a few options for the page (Sort By), a glass panel as high as
        its content, the page above it in view.
      </li>
      <li>
        Large (the default): a task with a lot to show, the whole screen but its
        top.
      </li>
      <li>The detent is the app’s: chosen per sheet, not by swiping.</li>
      <li>
        <strong>Library:</strong> the sheet (
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />
        ) at its medium or large detent, its grabber, header and content.
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
        A task in a sheet: Cancel at the leading side, Done (prominent) at the
        trailing; Done disabled until there’s something to save.
      </li>
      <li>
        Edited, closing it (Cancel, Escape, swiped down) asks first: an{' '}
        <a href={publicUrl('action-sheet')}>Action sheet</a>, Discard Changes or
        Keep Editing; a press outside it does nothing (
        <code>disablePointerDismissal</code>).
      </li>
      <li>
        Controlled (<code>open</code>): <code>onOpenChange</code> confirms
        instead of closing; swiped down, kept open, the sheet springs back.
      </li>
      <li>
        A sheet is for a scoped task that keeps its parent in view; the
        confirmation is its own (one transient surface at a time).
      </li>
      <li>
        <strong>Library:</strong> the sheet’s controlled <code>open</code> and{' '}
        <code>onOpenChange</code>, springing back when kept open,{' '}
        <code>disablePointerDismissal</code>, and the{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Root"
        />{' '}
        asking.
      </li>
      <li>
        <strong>Demo:</strong> the name (the app’s state), whether it’s edited,
        asking before discarding, and saving on Done.
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
        ) is optional: left out, a cleaner top, the header only its toolbar.
      </li>
      <li>
        The sheet is still swiped down (by any of it, its content scrolled to
        its top), and closed by its Done.
      </li>
      <li>
        <strong>Library:</strong> the sheet without its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Grabber"
        />
        , still swiped down to close.
      </li>
      <li>
        <strong>Demo:</strong> the sheet’s content.
      </li>
    </ul>
    <WithoutAGrabber />

    <Heading
      id="a-navigation-inside"
      level={2}
    >
      A navigation inside
    </Heading>
    <ul>
      <li>
        A task of several levels: a{' '}
        <a href={publicUrl('navigation')}>Navigation</a> as its content, each
        page’s bar its title (moving with it), the back button (from the first
        pushed page) and Done: persistent items (see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ), staying put between pages having them, so Done never moves and the
        back button slides in and out with the first pushed page.
      </li>
      <li>
        Its header the grabber alone (
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />{' '}
        without children), over the pages’ bars; swiped down, it closes.
      </li>
      <li>
        Closed, the stack is reset to its root (
        <code>onOpenChangeComplete</code>).
      </li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />{' '}
        as the sheet’s content, the header’s grabber over the pages’ bars, and{' '}
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
        In a regular width (a tablet’s), a form sheet: centered, up to 936px by
        852px, the page dimmed around it.
      </li>
      <li>
        By the window (from 768px), or set: <code>compact={'{false}'}</code>, as
        here.
      </li>
      <li>The same sheet adapts, its task the same.</li>
      <li>
        <strong>Library:</strong> the form sheet (
        <code>
          compact={'{'}false{'}'}
        </code>
        ), centered, the page dimmed around it.
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
        ): its header alone (<code>header</code>, an empty group first: the
        capsule its bar, its buttons in reach), a summary (<code>peek</code>),
        its actions (<code>details</code>), its reviews (<code>all</code>).
      </li>
      <li>
        Where it opens (<code>defaultSnapPoint</code>) is apart from whether
        it’s open at first (<code>defaultOpen</code>): opened again, it’s at
        that stop again.
      </li>
      <li>
        Deep links: its other triggers open it at a stop of their own (
        <PartLink
          component="sheet"
          part="Sheet.Trigger"
        >
          Sheet.Trigger snapPoint
        </PartLink>
        ): its hours (Opening Hours), its actions (Contact), its reviews
        (Reviews); Show Place, at its default.
      </li>
      <li>
        Swiped, a stop at a time, down from its lowest closed; at{' '}
        <code>all</code>, its reviews scroll.
      </li>
      <li>
        <strong>Library:</strong> the stops by its groups, opening at one (its
        default, or a trigger’s), snapping within its glass capsule.
      </li>
      <li>
        <strong>Demo:</strong> the place, its groups’ names, its triggers’
        stops, and logging its stops and buttons.
      </li>
    </ul>
    <OpeningAtAStop />

    <Heading
      id="without-a-header-stop"
      level={2}
    >
      Without a header stop
    </Heading>
    <ul>
      <li>
        The place’s sheet, its groups alone: no empty{' '}
        <PartLink
          component="sheet"
          part="Sheet.SnapGroup"
        />{' '}
        first, so its lowest stop is its summary (<code>peek</code>).
      </li>
      <li>
        Fully extended, with its reviews scrolled, no stop below the top one
        counts (the groups scrolled away aren’t stops): dragging its header down
        swipes it out from there at once. Scrolled back to the start, its stops
        count again.
      </li>
    </ul>
    <WithoutAHeaderStop />

    <Heading
      id="a-card-on-a-tablet"
      level={2}
    >
      A card on a tablet
    </Heading>
    <ul>
      <li>
        The place’s sheet in a regular width (a tablet’s): a card from the
        bottom at the leading edge, as a regular{' '}
        <PartLink
          component="island"
          part="Island.Root"
        />{' '}
        (375px wide, 10px in), up to 64px below the top; the page beside it.
      </li>
      <li>
        Its detent, swiping and snapping kept, as on a phone: for a panel over a
        full-screen view (a map, playback). For a task (editing), a form sheet
        instead (
        <a href="#a-form-sheet-on-a-tablet">A form sheet on a tablet</a>).
      </li>
      <li>
        <strong>Library:</strong> the card (
        <code>regular=&quot;card&quot;</code>), not compact here (
        <code>
          compact={'{'}false{'}'}
        </code>
        ; by the window, from 768px).
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
