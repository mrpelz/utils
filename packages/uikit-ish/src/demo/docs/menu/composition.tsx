import '../sheet/style.css';
import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  forwardClick,
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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

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

<List.Item onClick={forwardClick('[aria-haspopup]')}>
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
const viewOptionsCode = `<Menu.Root>
  <Menu.Trigger render={<Button.Root />}>
    <Button.Label>View</Button.Label>
  </Menu.Trigger>
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        {/* Toggles: the menu stays open while they change. */}
        <Menu.CheckboxItem defaultChecked>
          <Menu.CheckboxItemIndicator />
          <Menu.Label>Previews</Menu.Label>
        </Menu.CheckboxItem>
        <Menu.CheckboxItem>
          <Menu.CheckboxItemIndicator />
          <Menu.Label>Hidden Files</Menu.Label>
        </Menu.CheckboxItem>
        <Menu.Separator />
        <Menu.Group>
          <Menu.GroupLabel>Group By</Menu.GroupLabel>
          <Menu.RadioGroup defaultValue="kind">
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Trigger': ['aria-label', 'render'],
            'Page.Root': [],
            'Toolbar.Button': ['shape'],
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
    { provided: useProvidedState('menu-composition-toolbar') },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="menu-composition-toolbar"
      log={log}
      stage="phone"
      state={[partState]}
      title="Menu from a toolbar button"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Notes</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Menu.Root {...partProps['Menu.Root']}>
                  <Menu.Trigger
                    {...partProps['Menu.Trigger']}
                    aria-label="More"
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
                        icon={sfEllipsis}
                      />
                    </Button.Icon>
                  </Menu.Trigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Share clicked')}
                        >
                          <Menu.Icon {...partProps['Menu.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfSquareAndArrowUp}
                            />
                          </Menu.Icon>
                          <Menu.Label {...partProps['Menu.Label']}>
                            Share Note
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Rename clicked')}
                        >
                          <Menu.Icon {...partProps['Menu.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfPencil}
                            />
                          </Menu.Icon>
                          <Menu.Label {...partProps['Menu.Label']}>
                            Rename
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Separator {...partProps['Menu.Separator']} />
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          destructive
                          onClick={() => addLog('Delete clicked')}
                        >
                          <Menu.Icon {...partProps['Menu.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfTrash}
                            />
                          </Menu.Icon>
                          <Menu.Label {...partProps['Menu.Label']}>
                            Delete
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
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
                  <List.Item {...partProps['List.Item']}>
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>
                        Groceries
                      </List.Title>
                      <List.Subtitle {...partProps['List.Subtitle']}>
                        Milk, eggs, bread
                      </List.Subtitle>
                    </List.Content>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['className'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': ['align'],
            'Menu.RadioGroup': ['onValueChange', 'value'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Trigger': ['render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('menu-composition-pop-up') },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="menu-composition-pop-up"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Menu as a pop-up button"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <List.Root
          {...partProps['List.Root']}
          className="menu-demo-list"
        >
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item
                {...partProps['List.Item']}
                onClick={forwardClick('[aria-haspopup]')}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Sort By</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Menu.Root {...partProps['Menu.Root']}>
                    <Menu.Trigger
                      {...partProps['Menu.Trigger']}
                      render={<Button.Root {...partProps['Button.Root']} />}
                    >
                      <Button.Label {...partProps['Button.Label']}>
                        {sortLabels[sort]}
                      </Button.Label>
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfChevronUpChevronDown}
                        />
                      </Button.Icon>
                    </Menu.Trigger>
                    <Menu.Portal {...partProps['Menu.Portal']}>
                      <Menu.Positioner
                        {...partProps['Menu.Positioner']}
                        align="end"
                      >
                        <Menu.Popup {...partProps['Menu.Popup']}>
                          <Menu.RadioGroup
                            {...partProps['Menu.RadioGroup']}
                            value={sort}
                            onValueChange={(value: unknown) => {
                              addLog(`sort: ${String(value)}`);
                              setSort(String(value));
                            }}
                          >
                            <Menu.RadioItem
                              {...partProps['Menu.RadioItem']}
                              value="date"
                            >
                              <Menu.RadioItemIndicator
                                {...partProps['Menu.RadioItemIndicator']}
                              />
                              <Menu.Label {...partProps['Menu.Label']}>
                                Date
                              </Menu.Label>
                            </Menu.RadioItem>
                            <Menu.RadioItem
                              {...partProps['Menu.RadioItem']}
                              value="name"
                            >
                              <Menu.RadioItemIndicator
                                {...partProps['Menu.RadioItemIndicator']}
                              />
                              <Menu.Label {...partProps['Menu.Label']}>
                                Name
                              </Menu.Label>
                            </Menu.RadioItem>
                            <Menu.RadioItem
                              {...partProps['Menu.RadioItem']}
                              value="size"
                            >
                              <Menu.RadioItemIndicator
                                {...partProps['Menu.RadioItemIndicator']}
                              />
                              <Menu.Label {...partProps['Menu.Label']}>
                                Size
                              </Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'Menu.Item': ['onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': ['align'],
            'Menu.Root': [],
            'Menu.Trigger': [
              'aria-label',
              'onClick',
              'openOn',
              'ref',
              'render',
            ],
            'Page.Root': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('menu-composition-history') },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="menu-composition-history"
      log={log}
      stage="phone"
      state={[partState]}
      title="Menu on a held press"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Menu.Root {...partProps['Menu.Root']}>
                  <Menu.Trigger
                    {...partProps['Menu.Trigger']}
                    ref={back}
                    aria-label="Back"
                    openOn="secondaryClick"
                    render={
                      <Toolbar.Button
                        {...partProps['Toolbar.Button']}
                        shape="circle"
                      />
                    }
                    onClick={() => addLog('back clicked')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfChevronBackward}
                      />
                    </Button.Icon>
                  </Menu.Trigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner
                      {...partProps['Menu.Positioner']}
                      align="start"
                    >
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Inbox clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Inbox
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Mailboxes clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Mailboxes
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Message</span>
              </Toolbar.Title>
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
                  <List.Item {...partProps['List.Item']}>
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>
                        Kate Brown
                      </List.Title>
                      <List.Subtitle {...partProps['List.Subtitle']}>
                        Weekend photos
                      </List.Subtitle>
                    </List.Content>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** View options: toggles and a choice, the menu staying open. */
const ViewOptions: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': ['defaultChecked', 'onCheckedChange'],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.RadioGroup': ['defaultValue', 'onValueChange'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Trigger': ['render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('menu-composition-options') },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="menu-composition-options"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Menu of view options"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>View</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`previews: ${String(isChecked)}`)
                  }
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                </Menu.CheckboxItem>
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`hidden files: ${String(isChecked)}`)
                  }
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>
                    Hidden Files
                  </Menu.Label>
                </Menu.CheckboxItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Group By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="kind"
                    onValueChange={(value: unknown) =>
                      addLog(`group by: ${String(value)}`)
                    }
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="kind"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Kind</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
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
        A page’s secondary actions sit behind its bar’s “More” button. The
        trigger renders a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        (<code>render</code>) and has a name (<code>aria-label</code>).
      </li>
      <li>
        The destructive action comes last, after a{' '}
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
        , with its items, separator and popup), and its trigger rendering the
        toolbar’s button.
      </li>
      <li>
        <strong>Demo:</strong> the actions, and what each does (logged).
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
        A choice shown on its button: the trigger’s label is the chosen option,
        with chevrons after it (a pop-up button), at a{' '}
        <a href={publicUrl('list')}>List</a> row’s end.
      </li>
      <li>
        A{' '}
        <PartLink
          component="menu"
          part="Menu.RadioGroup"
        />{' '}
        holds the app’s value. The menu is aligned with the row’s end (
        <code>align=&quot;end&quot;</code>).
      </li>
      <li>It’s a collapsed choice of a few options.</li>
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
        ), the trigger’s chevrons, and aligning the menu with the row’s end.
      </li>
      <li>
        <strong>Demo:</strong> the sort order (the app’s state), shown on the
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
        <code>onClick</code>), and a held press or a right click shows the pages
        (<code>openOn=&quot;secondaryClick&quot;</code>).
      </li>
      <li>
        <strong>Library:</strong> opening on a held press or a right click (
        <code>openOn=&quot;secondaryClick&quot;</code>).
      </li>
      <li>
        <strong>Demo:</strong> the back button’s own click, and the history it
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
        ). The menu stays open while they change.
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
        <strong>Demo:</strong> the options offered, and logging their changes.
      </li>
    </ul>
    <CodeView code={viewOptionsCode} />
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
