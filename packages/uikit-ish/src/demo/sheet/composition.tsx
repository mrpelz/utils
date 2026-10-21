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
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { useLabelledRef } from '../frame/render-code.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { pages } from '../navigation/content.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const detentsCode = `const screen = useRef<HTMLDivElement>(null);

<div ref={screen} className="screen">
  <Sheet.Root>
    <Sheet.Trigger render={<Button.Root variant="bordered" />}>
      <Button.Label>Medium</Button.Label>
    </Sheet.Trigger>
    {/* As high as its content: a glass panel. */}
    <Sheet.Popup compact container={screen} detent="medium">
      <Sheet.Header>…</Sheet.Header>
      <Sheet.Content>…</Sheet.Content>
    </Sheet.Popup>
  </Sheet.Root>
  <Sheet.Root>
    <Sheet.Trigger render={<Button.Root variant="bordered" />}>
      <Button.Label>Large</Button.Label>
    </Sheet.Trigger>
    {/* The whole screen but its top. */}
    <Sheet.Popup compact container={screen}>…</Sheet.Popup>
  </Sheet.Root>
</div>`;

const cancelDoneCode = `const [open, setOpen] = useState(false);
const [confirming, setConfirming] = useState(false);
const [name, setName] = useState('');
const edited = name !== '';
// Closing (Cancel, Escape, swiped down) while edited: confirm first.
const close = () => (edited ? setConfirming(true) : setOpen(false));

<Sheet.Root
  disablePointerDismissal={edited}
  open={open}
  onOpenChange={(next) => (next ? setOpen(true) : close())}
>
  <Sheet.Trigger render={<Button.Root variant="bordered" />}>…</Sheet.Trigger>
  <Sheet.Popup>
    <Sheet.Header>
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
    <ActionSheet.Root open={confirming} onOpenChange={setConfirming}>
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

<Sheet.Popup>
  {/* Its grabber alone: each page has its own bar. */}
  <Sheet.Header />
  <Sheet.Content>
    <Navigation.Root onBack={pop}>
      {keys.map((key, depth) => (
        <Page.Root key={key}>
          <Header.Root>
            <Header.Bar>
              <Toolbar.Leading>{depth > 0 ? /* back */ … : null}</Toolbar.Leading>
              <Toolbar.Title>…</Toolbar.Title>
              <Toolbar.Trailing>
                <Sheet.Close render={<Toolbar.Button prominent />}>
                  <Button.Label>Done</Button.Label>
                </Sheet.Close>
              </Toolbar.Trailing>
            </Header.Bar>
          </Header.Root>
          <List.Root>…{/* rows pushing a page */}</List.Root>
        </Page.Root>
      ))}
    </Navigation.Root>
  </Sheet.Content>
</Sheet.Popup>`;

const formSheetCode = `<Sheet.Popup compact={false} container={screen}>
  <Sheet.Header>…</Sheet.Header>
  <Sheet.Content>…</Sheet.Content>
</Sheet.Popup>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Two sheets: medium (a few rows), large (a list). */
const Detents: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      id="sheet-composition-detents"
      log={log}
      title="Medium and large sheets"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
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
            container={screen}
            detent="medium"
          >
            <Sheet.Header>
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
            <Sheet.Content className="sheet-demo-short">
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
            container={screen}
          >
            <Sheet.Header>
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
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** A form in a sheet: Cancel and Done, discarding edits confirmed. */
const CancelDone: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [name, setName] = useState('');
  const edited = name !== '';
  const close = () => (edited ? setConfirming(true) : setOpen(false));

  return (
    <Component
      center
      inline
      id="sheet-composition-cancel-done"
      log={log}
      title="A sheet with Cancel and Done"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          disablePointerDismissal={edited}
          open={open}
          onOpenChange={(next: boolean) => (next ? setOpen(true) : close())}
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
            container={screen}
          >
            <Sheet.Header>
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
                    disabled={!edited}
                    onClick={() => {
                      addLog(`saved: ${name}`);
                      setName('');
                      setOpen(false);
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
            </Sheet.Content>
            <ActionSheet.Root
              open={confirming}
              onOpenChange={setConfirming}
            >
              <ActionSheet.Popup>
                <ActionSheet.Actions>
                  <ActionSheet.Action
                    variant="destructive"
                    onClick={() => {
                      addLog('discarded');
                      setName('');
                      setOpen(false);
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
      </div>
    </Component>
  );
};

/** A stack in a sheet: settings drilled into, Done on every page. */
const NavigationInside: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
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
      center
      inline
      id="sheet-composition-navigation"
      log={log}
      title="A navigation in a sheet"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <Sheet.Root
          onOpenChangeComplete={(open: boolean) => {
            if (!open) setKeys(['settings']);
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
            container={screen}
          >
            <Sheet.Header />
            <Sheet.Content className="sheet-demo-stack">
              <Navigation.Root onBack={pop}>
                {keys.map((key, depth) => (
                  <Page.Root key={key}>
                    <Header.Root>
                      <Header.Bar>
                        <Toolbar.Leading>
                          {depth > 0 ? (
                            <Navigation.Back
                              aria-label={pages[keys[depth - 1] ?? '']?.title}
                              render={<Toolbar.Button shape="circle" />}
                            >
                              <Button.Icon>
                                <Symbol icon={sfChevronBackward} />
                              </Button.Icon>
                            </Navigation.Back>
                          ) : null}
                        </Toolbar.Leading>
                        <Toolbar.Title>
                          {depth === 0 ? (
                            <Sheet.Title render={<span />}>
                              {pages[key]?.title}
                            </Sheet.Title>
                          ) : (
                            <span>{pages[key]?.title}</span>
                          )}
                        </Toolbar.Title>
                        <Toolbar.Trailing>
                          <Sheet.Close render={<Toolbar.Button prominent />}>
                            <Button.Label>Done</Button.Label>
                          </Sheet.Close>
                        </Toolbar.Trailing>
                      </Header.Bar>
                    </Header.Root>
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
                  </Page.Root>
                ))}
              </Navigation.Root>
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** A tablet's form sheet: centered over the page. */
const FormSheet: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      id="sheet-composition-form-sheet"
      log={log}
      title="A form sheet on a tablet"
    >
      <div
        ref={screen}
        className="sheet-demo-tablet"
      >
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
            compact={false}
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
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['medium-and-large', 'Medium and large'],
  ['cancel-and-done', 'Cancel and Done'],
  ['a-navigation-inside', 'A navigation inside'],
  ['a-form-sheet-on-a-tablet', 'A form sheet on a tablet'],
];

/** `/sheet/composition`: sheets' detents, tasks, stacks and widths. */
export const SheetComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Each view a screen of its own: its sheets in it (<code>container</code>
        ), compact or not as set (<code>compact</code>), not by the window.
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
    </ul>
    <CodeView code={cancelDoneCode} />
    <CancelDone />

    <Heading
      id="a-navigation-inside"
      level={2}
    >
      A navigation inside
    </Heading>
    <ul>
      <li>
        A task of several levels: a <a href="navigation">Navigation</a> as its
        content, each page with its bar (back, its title, Done).
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
    </ul>
    <CodeView code={formSheetCode} />
    <FormSheet />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sheetCompositionDemos = [
  Detents,
  CancelDone,
  NavigationInside,
  FormSheet,
];
