import '../sheet/style.css';
import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  List,
  Menu,
  Page,
  Symbol,
  Toolbar,
  useTextActionsPrevention,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfChevronBackward,
  sfChevronUpChevronDown,
  sfEllipsis,
  sfPencil,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import { GuideLink } from '../hig-guide/link.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const toolbarCode = `<Toolbar.Trailing>
  <Menu.Root>
    <Menu.Trigger
      aria-label="More"
      render={<Toolbar.Button shape="circle" />}
    >
      <Button.Icon>
        <Symbol icon={sfEllipsis} />
      </Button.Icon>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>…</Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</Toolbar.Trailing>`;

const popUpCode = `const labels = { date: 'Date', name: 'Name', size: 'Size' };
const [sort, setSort] = useState('date');

<List.Item>
  <List.Content>
    <List.Title>Sort By</List.Title>
  </List.Content>
  <List.Trailing>
    <Menu.Root>
      <Menu.Trigger render={<Button.Root />}>
        <Button.Label>{labels[sort]}</Button.Label>
        <Button.Icon>
          <Symbol icon={sfChevronUpChevronDown} />
        </Button.Icon>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end">
          <Menu.Popup>
            <Menu.RadioGroup value={sort} onValueChange={setSort}>
              <Menu.RadioItem value="date">
                <Menu.RadioItemIndicator />
                <Menu.Label>Date</Menu.Label>
              </Menu.RadioItem>
              …
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </List.Trailing>
</List.Item>`;

const historyCode = `const back = useRef<HTMLButtonElement>(null);
// A held press selects no text (no browser text menu).
useTextActionsPrevention(back);

<Menu.Root>
  {/* A click goes back; a held press (or a right click) shows the pages. */}
  <Menu.Trigger
    ref={back}
    aria-label="Back"
    openOn="secondaryClick"
    render={<Toolbar.Button shape="circle" />}
    onClick={() => {…}}
  >
    …
  </Menu.Trigger>
  …
</Menu.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sortLabels: Record<string, string> = {
  date: 'Date',
  name: 'Name',
  size: 'Size',
};

/** A page's “More” button, in its navigation bar. */
const FromAToolbarButton: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      baseUiId="menu"
      id="menu-composition-toolbar"
      log={log}
      stage="phone"
      title="Menu from a toolbar button"
    >
      <Viewport.Content>
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <span>Notes</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Menu.Root>
                  <Menu.Trigger
                    aria-label="More"
                    render={<Toolbar.Button shape="circle" />}
                  >
                    <Button.Icon>
                      <Symbol icon={sfEllipsis} />
                    </Button.Icon>
                  </Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup>
                        <Menu.Item onClick={() => addLog('Share clicked')}>
                          <Menu.Icon>
                            <Symbol icon={sfSquareAndArrowUp} />
                          </Menu.Icon>
                          <Menu.Label>Share Note</Menu.Label>
                        </Menu.Item>
                        <Menu.Item onClick={() => addLog('Rename clicked')}>
                          <Menu.Icon>
                            <Symbol icon={sfPencil} />
                          </Menu.Icon>
                          <Menu.Label>Rename</Menu.Label>
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item
                          destructive
                          onClick={() => addLog('Delete clicked')}
                        >
                          <Menu.Icon>
                            <Symbol icon={sfTrash} />
                          </Menu.Icon>
                          <Menu.Label>Delete</Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  <List.Item>
                    <List.Content>
                      <List.Title>Groceries</List.Title>
                      <List.Subtitle>Milk, eggs, bread</List.Subtitle>
                    </List.Content>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A row's choice, shown on its button (a pop-up button). */
const APopUpButton: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [sort, setSort] = useState('date');

  return (
    <Component
      isInline
      baseUiId="menu"
      id="menu-composition-pop-up"
      log={log}
      screen="centered"
      stage="phone"
      title="Menu as a pop-up button"
    >
      <Viewport.Content>
        <List.Root className="menu-demo-list">
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Content>
                  <List.Title>Sort By</List.Title>
                </List.Content>
                <List.Trailing>
                  <Menu.Root>
                    <Menu.Trigger render={<Button.Root />}>
                      <Button.Label>{sortLabels[sort]}</Button.Label>
                      <Button.Icon>
                        <Symbol icon={sfChevronUpChevronDown} />
                      </Button.Icon>
                    </Menu.Trigger>
                    <Menu.Portal>
                      <Menu.Positioner align="end">
                        <Menu.Popup>
                          <Menu.RadioGroup
                            value={sort}
                            onValueChange={(value: unknown) => {
                              addLog(`sort: ${String(value)}`);
                              setSort(String(value));
                            }}
                          >
                            <Menu.RadioItem value="date">
                              <Menu.RadioItemIndicator />
                              <Menu.Label>Date</Menu.Label>
                            </Menu.RadioItem>
                            <Menu.RadioItem value="name">
                              <Menu.RadioItemIndicator />
                              <Menu.Label>Name</Menu.Label>
                            </Menu.RadioItem>
                            <Menu.RadioItem value="size">
                              <Menu.RadioItemIndicator />
                              <Menu.Label>Size</Menu.Label>
                            </Menu.RadioItem>
                          </Menu.RadioGroup>
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                </List.Trailing>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A back button: a click goes back, a held press shows the history. */
const AHistory: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const back = useLabelledRef<HTMLButtonElement>('back', 'HTMLButtonElement');
  useTextActionsPrevention(back);

  return (
    <Component
      isInline
      baseUiId="menu"
      id="menu-composition-history"
      log={log}
      stage="phone"
      title="Menu on a held press"
    >
      <Viewport.Content>
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Menu.Root>
                  <Menu.Trigger
                    ref={back}
                    aria-label="Back"
                    openOn="secondaryClick"
                    render={<Toolbar.Button shape="circle" />}
                    onClick={() => addLog('back clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfChevronBackward} />
                    </Button.Icon>
                  </Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner align="start">
                      <Menu.Popup>
                        <Menu.Item onClick={() => addLog('Inbox clicked')}>
                          <Menu.Label>Inbox</Menu.Label>
                        </Menu.Item>
                        <Menu.Item onClick={() => addLog('Mailboxes clicked')}>
                          <Menu.Label>Mailboxes</Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Message</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  <List.Item>
                    <List.Content>
                      <List.Title>Kate Brown</List.Title>
                      <List.Subtitle>Weekend photos</List.Subtitle>
                    </List.Content>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** View options: toggles and a choice, the menu staying open. */
const ViewOptions: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      id="menu-composition-options"
      log={log}
      screen="centered"
      stage="phone"
      title="Menu of view options"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>View</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.CheckboxItem
                  defaultChecked
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`previews: ${String(isChecked)}`)
                  }
                >
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                </Menu.CheckboxItem>
                <Menu.CheckboxItem
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`hidden files: ${String(isChecked)}`)
                  }
                >
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Hidden Files</Menu.Label>
                </Menu.CheckboxItem>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Group By</Menu.GroupLabel>
                  <Menu.RadioGroup
                    defaultValue="kind"
                    onValueChange={(value: unknown) =>
                      addLog(`group by: ${String(value)}`)
                    }
                  >
                    <Menu.RadioItem value="kind">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Kind</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['from-a-toolbar-button', 'From a toolbar button'],
  ['a-pop-up-button', 'A pop-up button'],
  ['on-a-held-press', 'On a held press'],
  ['view-options', 'View options'],
];

/** `/menu/composition`: menus with other components. */
export const MenuComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="from-a-toolbar-button"
      level={2}
    >
      From a toolbar button
    </Heading>
    <ul>
      <li>
        A page’s secondary actions behind its bar’s “More” button: the trigger
        renders a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        (<code>render</code>), named (<code>aria-label</code>).
      </li>
      <li>
        The destructive action last, after a{' '}
        <PartLink
          component="menu"
          part="Menu.Separator"
        />
        .
      </li>
      <li>
        <strong>Library:</strong> the menu (
        <PartLink
          component="menu"
          part="Menu.Root"
        />
        , its items, separator and popup) and its trigger rendering the
        toolbar’s button.
      </li>
      <li>
        <strong>Demo:</strong> the actions and what each does (logged).
      </li>
    </ul>
    <CodeView code={toolbarCode} />
    <FromAToolbarButton />

    <Heading
      id="a-pop-up-button"
      level={2}
    >
      A pop-up button
    </Heading>
    <ul>
      <li>
        A choice shown on its button: the trigger’s label the chosen option,
        chevrons after it (a pop-up button), at a <a href="list">List</a> row’s
        end.
      </li>
      <li>
        A{' '}
        <PartLink
          component="menu"
          part="Menu.RadioGroup"
        />{' '}
        holding the app’s value; aligned with the row’s end (
        <code>align=&quot;end&quot;</code>).
      </li>
      <li>
        Guide <GuideLink to="choice-family">choice family</GuideLink>: a
        collapsed choice of a few options.
      </li>
      <li>
        <strong>Library:</strong> the radio items (
        <PartLink
          component="menu"
          part="Menu.RadioGroup"
        />
        ,{' '}
        <PartLink
          component="menu"
          part="Menu.RadioItem"
        />
        ), the trigger’s chevrons and aligning the menu to the row’s end.
      </li>
      <li>
        <strong>Demo:</strong> the sort order (the app’s state) shown on the
        button.
      </li>
    </ul>
    <CodeView code={popUpCode} />
    <APopUpButton />

    <Heading
      id="on-a-held-press"
      level={2}
    >
      On a held press
    </Heading>
    <ul>
      <li>
        A back button’s history: a click goes back (the trigger’s own{' '}
        <code>onClick</code>), a held press or a right click shows the pages (
        <code>openOn=&quot;secondaryClick&quot;</code>).
      </li>
      <li>
        <strong>Library:</strong> opening on a held press or a right click (
        <code>openOn=&quot;secondaryClick&quot;</code>).
      </li>
      <li>
        <strong>Demo:</strong> the back button’s own click and the history it
        lists (logged).
      </li>
    </ul>
    <CodeView code={historyCode} />
    <AHistory />

    <Heading
      id="view-options"
      level={2}
    >
      View options
    </Heading>
    <ul>
      <li>
        Toggles (
        <PartLink
          component="menu"
          part="Menu.CheckboxItem"
        />
        ) and a named choice (a{' '}
        <PartLink
          component="menu"
          part="Menu.Group"
        />{' '}
        with a{' '}
        <PartLink
          component="menu"
          part="Menu.GroupLabel"
        />
        ): the menu stays open while they change.
      </li>
      <li>Every item keeps a column for the checkmark.</li>
      <li>
        <strong>Library:</strong> the checkbox and radio items (
        <PartLink
          component="menu"
          part="Menu.CheckboxItem"
        />
        ,{' '}
        <PartLink
          component="menu"
          part="Menu.RadioItem"
        />
        ), the groups, and the menu staying open while they change.
      </li>
      <li>
        <strong>Demo:</strong> the options offered and logging their changes.
      </li>
    </ul>
    <ViewOptions />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const menuCompositionDemos = [
  FromAToolbarButton,
  APopUpButton,
  AHistory,
  ViewOptions,
];
