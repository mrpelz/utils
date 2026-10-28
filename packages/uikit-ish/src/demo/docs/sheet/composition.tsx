import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent, useState } from 'react';

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
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { pages } from '../navigation/content.js';
import { names } from '../viewport/content.js';

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
    <Sheet.Content>…{/* its fields */}</Sheet.Content>
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
      {/* What stays while the pages move: the back button, Done. */}
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          <Toolbar.Leading>
            {keys.length > 1 ? <Navigation.Back … /> : null}
          </Toolbar.Leading>
          <Toolbar.Trailing>
            <Sheet.Close render={<Toolbar.Button prominent />}>
              <Button.Label>Done</Button.Label>
            </Sheet.Close>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Navigation.Stack>
        {keys.map((key) => (
          <Header.Root key={key}>
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                <Toolbar.Title>…</Toolbar.Title>
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    {['First Name', 'Last Name', 'Company'].map((order) => (
                      <List.Item key={order}>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog(`sort: ${order}`)}
                        >
                          {order}
                        </List.Title>
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    <TextField.Root render={<List.Item />}>
                      <TextField.Control
                        aria-label="Name"
                        placeholder="Name"
                        value={name}
                        onValueChange={setName}
                      />
                      <TextField.Clear />
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    {['Unread', 'Flagged', 'With Attachments'].map((name) => (
                      <List.Item key={name}>
                        <List.Title>{name}</List.Title>
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
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Leading>
                      {keys.length > 1 ? (
                        <Navigation.Back
                          aria-label={pages[keys.at(-2) ?? '']?.title}
                          render={<Toolbar.Button shape="circle" />}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      ) : null}
                    </Toolbar.Leading>
                    <Toolbar.Trailing>
                      <Sheet.Close render={<Toolbar.Button prominent />}>
                        <Button.Label>Done</Button.Label>
                      </Sheet.Close>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Navigation.Stack>
                  {keys.map((key, depth) => (
                    <Header.Root key={key}>
                      <Viewport.BlockStart>
                        <Toolbar.Root placement="block-start">
                          <Toolbar.Title>
                            {depth === 0 ? (
                              <Sheet.Title render={<span />}>
                                {pages[key]?.title}
                              </Sheet.Title>
                            ) : (
                              <span>{pages[key]?.title}</span>
                            )}
                          </Toolbar.Title>
                        </Toolbar.Root>
                      </Viewport.BlockStart>
                      <Page.Root>
                        <Viewport.Padding edge="block-start" />
                        <List.Root>
                          <List.Section>
                            <List.Group>
                              {pages[key]?.children.map((child) => (
                                <List.Item key={child}>
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => push(child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                  <List.DrillIn />
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
              <List.Root>
                <List.Section>
                  <List.Group>
                    <TextField.Root render={<List.Item />}>
                      <TextField.Label>Name</TextField.Label>
                      <TextField.Control placeholder="Required" />
                      <TextField.Clear />
                    </TextField.Root>
                    <TextField.Root render={<List.Item />}>
                      <TextField.Label>Phone</TextField.Label>
                      <TextField.Control type="tel" />
                      <TextField.Clear />
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['medium-and-large', 'Medium and large'],
  ['cancel-and-done', 'Cancel and Done'],
  ['without-a-grabber', 'Without a grabber'],
  ['a-navigation-inside', 'A navigation inside'],
  ['a-form-sheet-on-a-tablet', 'A form sheet on a tablet'],
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
        <a href="action-sheet">Action sheet</a>, Discard Changes or Keep
        Editing; a press outside it does nothing (
        <code>disablePointerDismissal</code>).
      </li>
      <li>
        Controlled (<code>open</code>): <code>onOpenChange</code> confirms
        instead of closing; swiped down, kept open, the sheet springs back.
      </li>
      <li>
        A sheet is for a scoped task that keeps its parent in view (guide{' '}
        <GuideLink to="rule-a8">A8</GuideLink>); the confirmation is its own
        (guide <GuideLink to="rule-g3">G3</GuideLink>: one transient surface at
        a time).
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
        A task of several levels: a <a href="navigation">Navigation</a> as its
        content, each page’s bar its title (moving with it); the back button and
        Done in a bar that stays (in the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        , outside its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ).
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
        In a regular width (an iPad’s), a form sheet: centered, up to 936px by
        852px, the page dimmed around it.
      </li>
      <li>
        By the window (from 768px), or set: <code>compact={'{false}'}</code>, as
        here.
      </li>
      <li>
        The same sheet adapts, its task the same (guide{' '}
        <GuideLink to="rule-g4">G4</GuideLink>).
      </li>
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
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetCompositionDemos = [
  Detents,
  CancelDone,
  WithoutAGrabber,
  NavigationInside,
  FormSheet,
];
