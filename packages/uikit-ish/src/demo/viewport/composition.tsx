import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { FunctionComponent, RefObject, useState } from 'react';

import {
  Button,
  CheckboxGroup,
  collapsedSelection,
  forwardClick,
  List,
  Symbol,
  TabBar,
  TextField,
  Toolbar,
  useScrollDirection,
  Viewport,
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
import { messages } from '../list/content.js';
import { phoneTabs, phoneTabValues } from '../tab-bar/tabs.js';
import { names } from './content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const shellCode = `<Viewport.Provider>
  <TabBar.Root defaultValue="favorites">
    {/* The pages, scrolling. */}
    <Viewport.Content>
      <TabBar.Panel value="favorites">…</TabBar.Panel>
      <TabBar.Panel value="recents">…</TabBar.Panel>
      …
    </Viewport.Content>
    {/* The bar, at the bottom; the keyboard covers it. */}
    <Viewport.BlockEnd keyboard="cover">
      <TabBar.List>…</TabBar.List>
    </Viewport.BlockEnd>
  </TabBar.Root>
</Viewport.Provider>`;

const messageCode = `<Viewport.Provider>
  {/* Resized above the keyboard: its end stays in view. */}
  <Viewport.Content>
    <List.Root>…</List.Root>
  </Viewport.Content>
  {/* Pushed up by the keyboard (keyboard="push", the default). */}
  <Viewport.BlockEnd>
    <div className="message-bar">
      <TextField.Root>
        <TextField.Search>
          <TextField.Control
            aria-label="Message"
            enterKeyHint="send"
            placeholder="Message"
          />
          <TextField.Clear />
        </TextField.Search>
      </TextField.Root>
    </div>
  </Viewport.BlockEnd>
</Viewport.Provider>`;

const collapseCode = `const contentRef = useRef<HTMLDivElement>(null);

// Tracking the content layer's scrolling, not the document's.
<Viewport.Provider scroller={contentRef}>
  <App contentRef={contentRef} />
</Viewport.Provider>

// In App (inside the provider):
const { atTop, direction } = useScrollDirection();
const [value, setValue] = useState('contacts');
// Collapsed, its selected tab remains.
const [sections] = collapsedSelection([tabValues], value);

<TabBar.Root value={value} onValueChange={setValue}>
  <Viewport.Content ref={contentRef}>…</Viewport.Content>
  <Viewport.BlockEnd keyboard="cover">
    <TabBar.List collapsed={!atTop && direction === 'down'}>
      <TabBar.Group visibleWhenCollapsed>
        <TabBar.Indicator />
        {tabs.map(([tab, label, icon], index) => (
          <TabBar.Tab
            key={tab}
            value={tab}
            visibleWhenCollapsed={sections?.tab === index}
          >
            …
          </TabBar.Tab>
        ))}
      </TabBar.Group>
    </TabBar.List>
  </Viewport.BlockEnd>
</TabBar.Root>`;

const toolbarCode = `const [selected, setSelected] = useState<string[]>([]);

<Viewport.Content>
  <List.Root editing>
    <List.Section>
      <CheckboxGroup
        value={selected}
        render={<List.Group />}
        onValueChange={setSelected}
      >
        <List.Item onClick={forwardClick('[role=checkbox]')}>
          <List.Checkbox
            aria-label="Aaron"
            value="Aaron"
          />
          <List.Title>Aaron</List.Title>
        </List.Item>
        …
      </CheckboxGroup>
    </List.Section>
  </List.Root>
</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>
    <Toolbar.Leading />
    <Toolbar.Title>
      <span>{selected.length} Selected</span>
    </Toolbar.Title>
    <Toolbar.Trailing>
      <Toolbar.Button
        destructive
        disabled={selected.length === 0}
        onClick={…}
      >
        <Button.Label>Delete</Button.Label>
      </Toolbar.Button>
    </Toolbar.Trailing>
  </Toolbar.Root>
</Viewport.BlockEnd>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** An app's shell: pages in the content layer, a tab bar at the bottom. */
const Shell: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="viewport-composition-shell"
      log={log}
      title="Viewport with a tab bar"
    >
      <div className="viewport-demo-screen">
        <TabBar.Root
          defaultValue="favorites"
          onValueChange={(
            value: unknown,
            { reason }: BaseTabs.Root.ChangeEventDetails,
          ) => addLog(`value change: ${String(value)}/${reason}`)}
        >
          <Viewport.Content>
            {phoneTabs.map(([tab, label]) => (
              <TabBar.Panel
                key={tab}
                value={tab}
              >
                <List.Root className="viewport-demo-list">
                  <List.Section>
                    <List.Group>
                      {names.map((name) => (
                        <List.Item key={name}>
                          <List.Title>{name}</List.Title>
                          <List.Detail>{label}</List.Detail>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </TabBar.Panel>
            ))}
          </Viewport.Content>
          <Viewport.BlockEnd keyboard="cover">
            <TabBar.List>
              <TabBar.Group>
                <TabBar.Indicator />
                {phoneTabs.map(([tab, label, icon]) => (
                  <TabBar.Tab
                    key={tab}
                    value={tab}
                  >
                    <TabBar.Icon>
                      <Symbol icon={icon} />
                    </TabBar.Icon>
                    <TabBar.Label>{label}</TabBar.Label>
                  </TabBar.Tab>
                ))}
              </TabBar.Group>
            </TabBar.List>
          </Viewport.BlockEnd>
        </TabBar.Root>
      </div>
    </Component>
  );
};

/** A conversation: messages, a message field above the keyboard. */
const Message: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      inputGuards
      id="viewport-composition-message"
      log={log}
      title="Viewport with a message field"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content>
          <List.Root className="viewport-demo-list">
            <List.Section>
              <List.Group>
                {messages.map(({ from, preview }) => (
                  <List.Item key={from}>
                    <List.Title>{from}</List.Title>
                    <List.Text lines={3}>{preview}</List.Text>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.BlockEnd>
          <div className="viewport-demo-bar">
            <TextField.Root>
              <TextField.Search>
                <TextField.Control
                  aria-label="Message"
                  enterKeyHint="send"
                  placeholder="Message"
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    addLog(`send: ${event.currentTarget.value}`);
                    event.currentTarget.value = '';
                  }}
                />
                <TextField.Clear />
              </TextField.Search>
            </TextField.Root>
          </div>
        </Viewport.BlockEnd>
      </div>
    </Component>
  );
};

/**
 * A tab bar collapsing while the content layer scrolls down: the scroll
 * direction inside a provider tracking it (see `Collapse`).
 */
const CollapseView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
}> = ({ contentRef }) => {
  const { atTop, direction } = useScrollDirection();
  const [value, setValue] = useState('contacts');
  // Collapsed, its selected tab remains.
  const [sections] = collapsedSelection([phoneTabValues], value);

  return (
    <Component
      center
      inline
      id="viewport-composition-collapse"
      title="Viewport collapsing a tab bar"
    >
      <div className="viewport-demo-screen">
        <TabBar.Root
          value={value}
          onValueChange={setValue}
        >
          <Viewport.Content ref={contentRef}>
            <TabBar.Panel value="contacts">
              <List.Root className="viewport-demo-list">
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
            </TabBar.Panel>
          </Viewport.Content>
          <Viewport.BlockEnd keyboard="cover">
            <TabBar.List collapsed={!atTop && direction === 'down'}>
              <TabBar.Group visibleWhenCollapsed>
                <TabBar.Indicator />
                {phoneTabs.map(([tab, label, icon], index) => (
                  <TabBar.Tab
                    key={tab}
                    value={tab}
                    visibleWhenCollapsed={sections?.tab === index}
                  >
                    <TabBar.Icon>
                      <Symbol icon={icon} />
                    </TabBar.Icon>
                    <TabBar.Label>{label}</TabBar.Label>
                  </TabBar.Tab>
                ))}
              </TabBar.Group>
            </TabBar.List>
          </Viewport.BlockEnd>
        </TabBar.Root>
      </div>
    </Component>
  );
};

/** `CollapseView`, in a provider tracking its screen's content layer. */
const Collapse: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>('contentRef');

  return (
    <Viewport.Provider scroller={contentRef}>
      <CollapseView contentRef={contentRef} />
    </Viewport.Provider>
  );
};

/** A list's selection, acted on by a toolbar at the bottom. */
const Selection: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [rows, setRows] = useState<readonly string[]>(names);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Component
      center
      inline
      id="viewport-composition-toolbar"
      log={log}
      title="Viewport with a toolbar"
    >
      <div className="viewport-demo-screen">
        <Viewport.Content>
          <List.Root
            editing
            className="viewport-demo-list"
          >
            <List.Section>
              <CheckboxGroup
                render={<List.Group />}
                value={selected}
                onValueChange={(value: string[]) => setSelected(value)}
              >
                {rows.map((name) => (
                  <List.Item
                    key={name}
                    onClick={forwardClick('[role=checkbox]')}
                  >
                    <List.Checkbox
                      aria-label={name}
                      value={name}
                    />
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </CheckboxGroup>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.BlockEnd>
          <Toolbar.Root>
            <Toolbar.Leading />
            <Toolbar.Title>
              <span>{selected.length} Selected</span>
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Toolbar.Button
                destructive
                disabled={selected.length === 0}
                onClick={() => {
                  addLog(`delete: ${selected.join(', ')}`);
                  setRows((current) =>
                    current.filter((name) => !selected.includes(name)),
                  );
                  setSelected([]);
                }}
              >
                <Button.Label>Delete</Button.Label>
              </Toolbar.Button>
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['an-app-shell-with-a-tab-bar', 'An app shell with a tab bar'],
  ['a-message-field-over-the-keyboard', 'A message field over the keyboard'],
  ['a-bar-collapsing-on-scroll', 'A bar collapsing on scroll'],
  ['a-bottom-toolbar-over-a-list', 'A bottom toolbar over a list'],
];

/** `/viewport/composition`: the viewport around an app's pages and bars. */
export const ViewportComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        The views’ phone screens contain the fixed layers (a{' '}
        <code>transform</code>); in an app, they’re the window’s.
      </li>
      <li>
        The on-screen keyboard only shows on devices with one: on a phone, the
        bars here move with it.
      </li>
    </ul>

    <Heading
      id="an-app-shell-with-a-tab-bar"
      level={2}
    >
      An app shell with a tab bar
    </Heading>
    <ul>
      <li>
        An app’s shell (guide <GuideLink to="shell-a">§7.4, shell A</GuideLink>
        ): its sections’ pages in the content layer, the tab bar floating over
        them at the bottom.
      </li>
      <li>
        The keyboard covers the tab bar (<code>keyboard=&quot;cover&quot;</code>
        ), as iOS’s.
      </li>
      <li>
        The panels as pages, with headers: see the{' '}
        <a href="tab-bar/composition">Tab bar’s composition</a>.
      </li>
    </ul>
    <CodeView code={shellCode} />
    <Shell />

    <Heading
      id="a-message-field-over-the-keyboard"
      level={2}
    >
      A message field over the keyboard
    </Heading>
    <ul>
      <li>
        A message field at the bottom, pushed up by the keyboard (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ’s default).
      </li>
      <li>
        The content layer resized above the keyboard (its default): the last
        message stays in view.
      </li>
    </ul>
    <CodeView code={messageCode} />
    <Message />

    <Heading
      id="a-bar-collapsing-on-scroll"
      level={2}
    >
      A bar collapsing on scroll
    </Heading>
    <ul>
      <li>
        The provider tracking the content layer (<code>scroller</code>, its
        ref), not the document.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="useScrollDirection"
        />{' '}
        collapses the tab bar while scrolling down, past the top (guide{' '}
        <GuideLink to="section-10">§10</GuideLink>: scroll position driving a
        Region’s behavior).
      </li>
      <li>
        Tracking the document’s scrolling instead: see the{' '}
        <a href="tab-bar/composition">Tab bar’s composition</a>.
      </li>
    </ul>
    <CodeView code={collapseCode} />
    <Collapse />

    <Heading
      id="a-bottom-toolbar-over-a-list"
      level={2}
    >
      A bottom toolbar over a list
    </Heading>
    <ul>
      <li>
        A toolbar at the bottom acting on the list’s selection (guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>: the list owns it).
      </li>
      <li>
        Rows scroll beneath it; the list keeps its last rows clear of it
        (padding).
      </li>
      <li>
        Entering and leaving edit mode: see the{' '}
        <a href="list/composition">List’s composition</a>.
      </li>
    </ul>
    <CodeView code={toolbarCode} />
    <Selection />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const viewportCompositionDemos = [Shell, Message, Collapse, Selection];
