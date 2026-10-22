import '../sheet/style.css';
import '../toolbar/style.css';
import './style.css';

import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfChevronUpChevronDown } from '@bradleyhodges/sfsymbols/sfChevronUpChevronDown';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfPencil } from '@bradleyhodges/sfsymbols/sfPencil';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  List,
  Menu,
  Page,
  Symbol,
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

const popUpCode = `const [sort, setSort] = useState('date');

<List.Item>
  <List.Title>Sort By</List.Title>
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
</List.Item>`;

const historyCode = `<Menu.Root>
  {/* A click goes back; a held press (or a right click) shows the pages. */}
  <Menu.Trigger
    aria-label="Back"
    openOn="secondaryClick"
    render={<Toolbar.Button shape="circle" />}
    onClick={goBack}
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
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="menu-composition-toolbar"
      log={log}
      title="Menu from a toolbar button"
    >
      <div
        ref={screen}
        className="toolbar-demo-screen"
      >
        <Page.Root>
          <Header.Root>
            <Header.Bar>
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
                  <Menu.Portal container={screen}>
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
            </Header.Bar>
          </Header.Root>
          <List.Root>
            <List.Section>
              <List.Group>
                <List.Item>
                  <List.Title>Groceries</List.Title>
                  <List.Subtitle>Milk, eggs, bread</List.Subtitle>
                </List.Item>
              </List.Group>
            </List.Section>
          </List.Root>
        </Page.Root>
      </div>
    </Component>
  );
};

/** A row's choice, shown on its button (a pop-up button). */
const APopUpButton: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [sort, setSort] = useState('date');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="menu-composition-pop-up"
      log={log}
      title="Menu as a pop-up button"
    >
      <div
        ref={screen}
        className="sheet-demo-phone"
      >
        <List.Root className="menu-demo-list">
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Title>Sort By</List.Title>
                <Menu.Root>
                  <Menu.Trigger render={<Button.Root />}>
                    <Button.Label>{sortLabels[sort]}</Button.Label>
                    <Button.Icon>
                      <Symbol icon={sfChevronUpChevronDown} />
                    </Button.Icon>
                  </Menu.Trigger>
                  <Menu.Portal container={screen}>
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
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </div>
    </Component>
  );
};

/** A back button: a click goes back, a held press shows the history. */
const AHistory: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="menu-composition-history"
      log={log}
      title="Menu on a held press"
    >
      <div
        ref={screen}
        className="toolbar-demo-screen"
      >
        <Page.Root>
          <Header.Root>
            <Header.Bar>
              <Toolbar.Leading>
                <Menu.Root>
                  <Menu.Trigger
                    aria-label="Back"
                    openOn="secondaryClick"
                    render={<Toolbar.Button shape="circle" />}
                    onClick={() => addLog('back clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfChevronBackward} />
                    </Button.Icon>
                  </Menu.Trigger>
                  <Menu.Portal container={screen}>
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
            </Header.Bar>
          </Header.Root>
          <List.Root>
            <List.Section>
              <List.Group>
                <List.Item>
                  <List.Title>Kate Bell</List.Title>
                  <List.Subtitle>Weekend photos</List.Subtitle>
                </List.Item>
              </List.Group>
            </List.Section>
          </List.Root>
        </Page.Root>
      </div>
    </Component>
  );
};

/** View options: toggles and a choice, the menu staying open. */
const ViewOptions: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="menu-composition-options"
      log={log}
      title="Menu of view options"
    >
      <div
        ref={screen}
        className="sheet-demo-phone demo-wallpaper"
      >
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
          <Menu.Portal container={screen}>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.CheckboxItem
                  defaultChecked
                  onCheckedChange={(checked: boolean) =>
                    addLog(`previews: ${String(checked)}`)
                  }
                >
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                </Menu.CheckboxItem>
                <Menu.CheckboxItem
                  onCheckedChange={(checked: boolean) =>
                    addLog(`hidden files: ${String(checked)}`)
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
      </div>
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
        chevrons after it (UIKit’s pop-up button), at a <a href="list">List</a>{' '}
        row’s end.
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
