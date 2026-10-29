import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfArrowDown } from '@bradleyhodges/sfsymbols/sfArrowDown';
import { sfArrowUp } from '@bradleyhodges/sfsymbols/sfArrowUp';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { FunctionComponent, RefObject, useRef, useState } from 'react';

import {
  ActivityIndicator,
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
  useViewportScroll,
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
import { GuideLink } from '../hig-guide/link.js';
import { messages } from '../list/content.js';
import { phoneTabs, phoneTabValues } from '../tab-bar/tabs.js';
import { names, planets } from './content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const shellCode = `<Viewport.Provider>
  <TabBar.Root defaultValue="favorites">
    {/* The pages, scrolling. */}
    <Viewport.Content>
      <Viewport.Padding edge="block-start" />
      <TabBar.Panel value="favorites">…</TabBar.Panel>
      <TabBar.Panel value="recents">…</TabBar.Panel>
      …
      {/* Its end scrolling out from under the tab bar. */}
      <Viewport.Padding edge="block-end" />
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
    <Viewport.Padding edge="block-start" />
    <List.Root>…</List.Root>
    <Viewport.Padding edge="block-end" />
  </Viewport.Content>
  {/* Pushed up by the keyboard (keyboard="push", the default); a toolbar
      in it spacing the field. */}
  <Viewport.BlockEnd>
    <Toolbar.Root>
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
    </Toolbar.Root>
  </Viewport.BlockEnd>
</Viewport.Provider>`;

const collapseCode = `const contentRef = useRef<HTMLDivElement>(null);

// Tracking the content layer's scrolling, not the document's.
<Viewport.Provider scroller={contentRef}>
  <App contentRef={contentRef} />
</Viewport.Provider>

// In App (inside the provider):
const tabs = [
  ['favorites', 'Favorites', sfStarFill],
  ['recents', 'Recents', sfClockFill],
  ['contacts', 'Contacts', sfPersonCropCircleFill],
];
const tabValues = tabs.map(([tab]) => tab);
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
  <Viewport.Padding edge="block-start" />
  <List.Root editing="leading">
    <List.Section>
      <CheckboxGroup
        value={selected}
        render={<List.Group />}
        onValueChange={setSelected}
      >
        <List.Item onClick={forwardClick('[role=checkbox]')}>
          <List.Leading>
            <List.Checkbox
              aria-label="Aaron"
              value="Aaron"
            />
          </List.Leading>
          <List.Content>
            <List.Title>Aaron</List.Title>
          </List.Content>
        </List.Item>
        …
      </CheckboxGroup>
    </List.Section>
  </List.Root>
  <Viewport.Padding edge="block-end" />
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

const refreshCode = `const contentRef = useRef<HTMLDivElement>(null);

// Tracking the content layer's scrolling, not the document's.
<Viewport.Provider scroller={contentRef}>
  <App contentRef={contentRef} />
</Viewport.Provider>

// In App (inside the provider):
// Pulled this far past the top (px), released, it refreshes.
const refreshDistance = 60;
const [rows, setRows] = useState(names);
const [isRefreshing, setIsRefreshing] = useState(false);
// How far it's pulled (px; past the top: negative), for the spinner.
const [pull, setPull] = useState(0);
// Released past the distance: refreshing.
const isArmed = useRef(false);

useViewportScroll(({ isHeld, overscroll }) => {
  setPull(overscroll);
  // (Refreshing: not again, pulled meanwhile, e.g. by a wheel's inertia.)
  if (isHeld) {
    isArmed.current = !isRefreshing && -overscroll >= refreshDistance;
    return;
  }
  if (!isArmed.current || isRefreshing) return;
  isArmed.current = false;
  setIsRefreshing(true);
  setTimeout(() => {
    setRows((current) => [\`New Contact \${current.length + 1}\`, ...current]);
    setIsRefreshing(false);
  }, 1500);
});

{/* Beneath the content layer (before it), coming out past its start;
    kept shown while refreshing, the content making room for it. */}
<Viewport.Overscroll
  className="pull"
  open={isRefreshing}
>
  {/* Pulled, turning along (a turn to the refresh distance);
      refreshing, spinning on from there. */}
  <ActivityIndicator
    display={isRefreshing ? 'animate' : 'reset'}
    progress={-pull / refreshDistance}
  />
</Viewport.Overscroll>
<Viewport.Content ref={contentRef}>
  <Viewport.Padding edge="block-start" />
  <List.Root>…{/* rows */}</List.Root>
  <Viewport.Padding edge="block-end" />
</Viewport.Content>

/* Its pull's progress (0 to 1 of its size; open, 1): fading in. */
.pull {
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  opacity: var(--uikit-viewport-overscroll-progress);
}`;

const pagesCode = `const contentRef = useRef<HTMLDivElement>(null);

<Viewport.Provider scroller={contentRef}>
  <App contentRef={contentRef} />
</Viewport.Provider>

// In App (inside the provider):
// Pulled this far past an end (px), released, it turns the page.
const turnDistance = 80;
const [index, setIndex] = useState(0);
// The way it was turned: the page coming in from below (next) or above.
const [turned, setTurned] = useState();
const [overscroll, setOverscroll] = useState(0);
// Released past the distance: the page turned to (-1, 1), or none.
const turn = useRef(0);
const [isHeld, setIsHeld] = useState(false);
const [name, facts] = planets[index];
const previous = planets[index - 1]?.[0];
const next = planets[index + 1]?.[0];

useViewportScroll(({ isHeld: isHeldNow, overscroll: by }) => {
  setOverscroll(by);
  setIsHeld(isHeldNow);
  if (isHeldNow) {
    turn.current = 0;
    if (previous && by <= -turnDistance) turn.current = -1;
    if (next && by >= turnDistance) turn.current = 1;
    return;
  }
  // Released past the distance: turned at once, at its top (ending the old
  // page's bounce back), the new page sliding in on from the pull.
  if (turn.current === 0) return;
  setIndex(index + turn.current);
  setTurned(turn.current < 0 ? 'previous' : 'next');
  turn.current = 0;
  contentRef.current?.scrollTo({ top: 0 });
});

{/* Beneath the content layer (before it), coming out past its ends. */}
{previous && (
  <Viewport.Overscroll
    className="pull"
    data-armed={overscroll <= -turnDistance ? '' : undefined}
    data-released={isHeld ? undefined : ''}
  >
    <Symbol className="pull-arrow" icon={sfArrowDown} />
    {previous}
  </Viewport.Overscroll>
)}
{next && (
  <Viewport.Overscroll
    className="pull"
    data-armed={overscroll >= turnDistance ? '' : undefined}
    data-released={isHeld ? undefined : ''}
    edge="block-end"
  >
    <Symbol className="pull-arrow" icon={sfArrowUp} />
    {next}
  </Viewport.Overscroll>
)}
<Viewport.Content ref={contentRef}>
  <Viewport.Padding edge="block-start" />
  {/* A page each (its key): sliding in the way it was turned. Pluto's, not
      one of the eight: a night sky, and its heart. */}
  <List.Root
    key={name}
    className="page"
    data-color-scheme={name === 'Pluto' ? 'dark' : undefined}
    data-turned={turned}
  >
    <List.Section>
      <List.Header prominence="extraProminent">
        <List.Title render={<h2 />}>
          {name}
          {name === 'Pluto' ? <Symbol icon={sfHeartFill} /> : null}
        </List.Title>
      </List.Header>
      <List.Group>…{/* facts */}</List.Group>
    </List.Section>
  </List.Root>
  <Viewport.Padding edge="block-end" />
</Viewport.Content>

/* Its pull's progress (0 to 1 of its size): fading in; armed, its arrow
   turned. */
.pull {
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  gap: 6px;
  opacity: var(--uikit-viewport-overscroll-progress);
}

.pull-arrow {
  transition: rotate 200ms;
}

.pull[data-armed] > .pull-arrow {
  rotate: 180deg;
}

/* Released: gone at once (the page may have turned, its name changing
   while it snaps back). */
.pull[data-released] {
  opacity: 0;
}

/* Turned: the page sliding in from below (next) or above (previous). */
.page[data-turned='next'] {
  animation: page-in 400ms ease-out;
}

.page[data-turned='previous'] {
  animation: page-in 400ms ease-out;
  --page-from: -1;
}

@keyframes page-in {
  from {
    opacity: 0;
    translate: 0 calc(var(--page-from, 1) * 100px);
  }
}

/* Pluto's: a night sky (its rows dark: data-color-scheme). */
.page[data-color-scheme='dark'] {
  border-radius: 26px;
  margin: 0 8px;
  background:
    radial-gradient(circle at 20% 30%, #fff 1px, transparent 2px),
    radial-gradient(circle at 70% 12%, #fff 1px, transparent 2px),
    radial-gradient(circle at 85% 60%, #fff 1px, transparent 2px),
    radial-gradient(circle at 40% 80%, #fff 1px, transparent 2px),
    radial-gradient(circle at 95% 82%, #fff 1px, transparent 2px),
    #0b0b1e;
  color: #fff;
  padding-block: 8px;
}

/* Its rows: the sky showing through. */
.page[data-color-scheme='dark'] {
  --uikit-list-group-background: rgb(255 255 255 / 8%);
}

/* Its heart: Tombaugh Regio's pale ice. */
.page[data-color-scheme='dark'] h2 > .uikit-symbol {
  margin-inline-start: 0.25em;
  color: #f2d9c8;
}`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** An app's shell: pages in the content layer, a tab bar at the bottom. */
const Shell: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="viewport-composition-shell"
      log={log}
      stage="phone"
      title="Viewport with a tab bar"
    >
      <TabBar.Root
        defaultValue="favorites"
        onValueChange={(
          value: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => addLog(`value change: ${String(value)}/${reason}`)}
      >
        <Viewport.Content>
          <Viewport.Padding edge="block-start" />
          {phoneTabs.map(([tab, label]) => (
            <TabBar.Panel
              key={tab}
              value={tab}
            >
              <List.Root>
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.Detail>{label}</List.Detail>
                        </List.Trailing>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </TabBar.Panel>
          ))}
          <Viewport.Padding edge="block-end" />
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
    </Component>
  );
};

/** A conversation: messages, a message field above the keyboard. */
const Message: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      hasInputGuards
      isInline
      id="viewport-composition-message"
      log={log}
      stage="phone"
      title="Viewport with a message field"
    >
      {/* Tracking the keyboard over its screen (see Viewport.Provider). */}
      <Viewport.Provider>
        <Viewport.Content>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {messages.map(({ from, preview }) => (
                  <List.Item key={from}>
                    <List.Content>
                      <List.Title>{from}</List.Title>
                      <List.Text lines={3}>{preview}</List.Text>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <Viewport.BlockEnd>
          <Toolbar.Root>
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
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </Viewport.Provider>
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
      isInline
      id="viewport-composition-collapse"
      stage="phone"
      title="Viewport collapsing a tab bar"
    >
      <TabBar.Root
        value={value}
        onValueChange={setValue}
      >
        <Viewport.Content ref={contentRef}>
          <Viewport.Padding edge="block-start" />
          <TabBar.Panel value="contacts">
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
          </TabBar.Panel>
          {/* (Following the bar as it collapses.) */}
          <Viewport.Padding edge="block-end" />
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
    </Component>
  );
};

/** `CollapseView`, in a provider tracking its screen's content layer. */
const Collapse: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );

  return (
    <Viewport.Provider scroller={contentRef}>
      <CollapseView contentRef={contentRef} />
    </Viewport.Provider>
  );
};

// Pulled this far past the top (px), released, it refreshes.
const refreshDistance = 60;

/**
 * Contacts refreshed by pulling past the top (and releasing): an activity
 * indicator over the content coming in with the pull, spinning while
 * refreshing (inside a provider tracking the content layer, see `Refresh`).
 */
const RefreshView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
}> = ({ contentRef }) => {
  const [log, addLog] = useLog();
  const [rows, setRows] = useState<readonly string[]>(names);
  const [scroll, setScroll] = useState({ isHeld: false, overscroll: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Released past the distance: refreshing.
  const isArmed = useRef(false);

  useViewportScroll(({ isHeld, overscroll }) => {
    setScroll({ isHeld, overscroll });
    // (Refreshing: not again, pulled meanwhile, e.g. by a wheel's inertia.)
    if (isHeld) {
      isArmed.current = !isRefreshing && -overscroll >= refreshDistance;
      return;
    }
    if (!isArmed.current || isRefreshing) return;
    isArmed.current = false;
    setIsRefreshing(true);
    addLog('refreshing');
    setTimeout(() => {
      setRows((current) => [
        `New Contact ${String(current.length - names.length + 1)}`,
        ...current,
      ]);
      setIsRefreshing(false);
      addLog('refreshed');
    }, 1500);
  });

  return (
    <Component
      containsOverscroll
      isInline
      id="viewport-composition-refresh"
      log={log}
      stage="phone"
      title="Viewport pulled to refresh"
      diagnostics={
        <dl className="viewport-demo-metrics">
          <dt>overscroll</dt>
          <dd>{Math.round(scroll.overscroll)}px</dd>
          <dt>isHeld</dt>
          <dd>{String(scroll.isHeld)}</dd>
          <dt>armed</dt>
          <dd>
            {String(scroll.isHeld && -scroll.overscroll >= refreshDistance)}
          </dd>
        </dl>
      }
    >
      <>
        {/* Beneath the content layer (before it), coming out past its
            start; kept shown while refreshing, the content making room for
            it. */}
        <Viewport.Overscroll
          className="viewport-demo-pull"
          open={isRefreshing}
        >
          {/* Pulled, turning along (a turn to the refresh distance);
              refreshing, spinning on from there. */}
          <ActivityIndicator
            display={isRefreshing ? 'animate' : 'reset'}
            progress={-scroll.overscroll / refreshDistance}
          />
        </Viewport.Overscroll>
        <Viewport.Content ref={contentRef}>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {rows.map((name) => (
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
        </Viewport.Content>
      </>
    </Component>
  );
};

/** `RefreshView`, in a provider tracking its screen's content layer. */
const Refresh: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );

  return (
    <Viewport.Provider scroller={contentRef}>
      <RefreshView contentRef={contentRef} />
    </Viewport.Provider>
  );
};

// Pulled this far past an end (px), released, it turns the page.
const turnDistance = 80;

/**
 * The planets, a page each, turned by pulling past an end (and releasing):
 * on past the end, the next; back past the start, the previous; a hint at
 * the edge coming in with the pull (inside a provider tracking the content
 * layer, see `Pages`).
 */
const PagesView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
}> = ({ contentRef }) => {
  const [log, addLog] = useLog();
  const [index, setIndex] = useState(0);
  // The way it was turned: the page coming in from below (next) or above.
  const [turned, setTurned] = useState<'next' | 'previous'>();
  const [scroll, setScroll] = useState({ isHeld: false, overscroll: 0 });
  // Released past the distance: the page turned to (-1, 1), or none.
  const turn = useRef(0);
  const [name, facts] = planets[index] ?? ['', []];
  const previous = planets[index - 1]?.[0];
  const next = planets[index + 1]?.[0];
  const { overscroll } = scroll;

  useViewportScroll(({ isHeld, overscroll: by }) => {
    setScroll({ isHeld, overscroll: by });
    if (isHeld) {
      turn.current = 0;
      if (previous && by <= -turnDistance) turn.current = -1;
      if (next && by >= turnDistance) turn.current = 1;
      return;
    }
    // Released past the distance: turned at once, at its top (ending the
    // old page's bounce back), the new page sliding in on from the pull.
    if (turn.current === 0) return;
    addLog(`turned to: ${String(turn.current < 0 ? previous : next)}`);
    setIndex(index + turn.current);
    setTurned(turn.current < 0 ? 'previous' : 'next');
    turn.current = 0;
    contentRef.current?.scrollTo({ top: 0 });
  });

  return (
    <Component
      containsOverscroll
      isInline
      id="viewport-composition-pages"
      log={log}
      stage="phone"
      title="Viewport pulled to turn pages"
      diagnostics={
        <dl className="viewport-demo-metrics">
          <dt>overscroll</dt>
          <dd>{Math.round(overscroll)}px</dd>
          <dt>isHeld</dt>
          <dd>{String(scroll.isHeld)}</dd>
          <dt>page</dt>
          <dd>{name}</dd>
        </dl>
      }
    >
      <>
        {/* Beneath the content layer (before it), coming out past its
            ends. */}
        {previous && (
          <Viewport.Overscroll
            className="viewport-demo-pull"
            data-armed={overscroll <= -turnDistance ? '' : undefined}
            data-released={scroll.isHeld ? undefined : ''}
          >
            <Symbol
              className="viewport-demo-pull-arrow"
              icon={sfArrowDown}
            />
            {previous}
          </Viewport.Overscroll>
        )}
        {next && (
          <Viewport.Overscroll
            className="viewport-demo-pull"
            data-armed={overscroll >= turnDistance ? '' : undefined}
            data-released={scroll.isHeld ? undefined : ''}
            edge="block-end"
          >
            <Symbol
              className="viewport-demo-pull-arrow"
              icon={sfArrowUp}
            />
            {next}
          </Viewport.Overscroll>
        )}
        <Viewport.Content ref={contentRef}>
          <Viewport.Padding edge="block-start" />
          {/* A page each (its key): sliding in the way it was turned.
              Pluto's, not one of the eight: a night sky, and its heart. */}
          <List.Root
            key={name}
            className="viewport-demo-page"
            data-color-scheme={name === 'Pluto' ? 'dark' : undefined}
            data-turned={turned}
          >
            <List.Section>
              <List.Header prominence="extraProminent">
                <List.Title render={<h2 />}>
                  {name}
                  {name === 'Pluto' ? <Symbol icon={sfHeartFill} /> : null}
                </List.Title>
              </List.Header>
              <List.Group>
                {facts.map((fact) => (
                  <List.Item key={fact}>
                    <List.Content>
                      <List.Title>{fact}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
      </>
    </Component>
  );
};

/** `PagesView`, in a provider tracking its screen's content layer. */
const Pages: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );

  return (
    <Viewport.Provider scroller={contentRef}>
      <PagesView contentRef={contentRef} />
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
      isInline
      id="viewport-composition-toolbar"
      log={log}
      stage="phone"
      title="Viewport with a toolbar"
    >
      <>
        <Viewport.Content>
          <Viewport.Padding edge="block-start" />
          <List.Root editing="leading">
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
                    <List.Leading>
                      <List.Checkbox
                        aria-label={name}
                        value={name}
                      />
                    </List.Leading>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </CheckboxGroup>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
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
      </>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['an-app-shell-with-a-tab-bar', 'An app shell with a tab bar'],
  ['a-message-field-over-the-keyboard', 'A message field over the keyboard'],
  ['a-bar-collapsing-on-scroll', 'A bar collapsing on scroll'],
  ['a-bottom-toolbar-over-a-list', 'A bottom toolbar over a list'],
  ['pulling-to-refresh', 'Pulling to refresh'],
  ['pulling-to-turn-pages', 'Pulling to turn pages'],
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
      <li>
        <strong>Library:</strong> the content layer (
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        ), the bottom anchor (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ) with the tab bar, and the keyboard covering it (
        <code>keyboard=&quot;cover&quot;</code>).
      </li>
      <li>
        <strong>Demo:</strong> the sections and their rows.
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
      <li>
        The field in a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />{' '}
        in the anchor: the toolbar spaces it and fills its width with it (a text
        field in a toolbar takes its free space), no styles of the app’s.
      </li>
      <li>
        <strong>Library:</strong> pushing the bottom anchor up with the
        keyboard, resizing the content layer above it, and the toolbar spacing
        the field.
      </li>
      <li>
        <strong>Demo:</strong> the messages and the field.
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
      <li>
        <strong>Library:</strong> the provider tracking the content layer (
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        <code>scroller</code>) and the scroll direction hook (
        <PartLink
          component="viewport"
          part="useScrollDirection"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> collapsing the tab bar by it, and the selected
        tab.
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
        Rows scroll beneath it; a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at the content layer’s end keeps its last rows clear of it (and a row
        scrolled to, e.g. by focus).
      </li>
      <li>
        Entering and leaving edit mode: see the{' '}
        <a href="list/composition">List’s composition</a>.
      </li>
      <li>
        <strong>Library:</strong> the bottom anchor (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ) and the padding keeping the last rows clear of it (
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the rows, the selection (
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />
        ) and deleting the selected rows.
      </li>
    </ul>
    <CodeView code={toolbarCode} />
    <Selection />

    <Heading
      id="pulling-to-refresh"
      level={2}
    >
      Pulling to refresh
    </Heading>
    <ul>
      <li>
        Pulled past the top and released, the list refreshes (Mail’s,
        Contacts’), an{' '}
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />{' '}
        coming in with the pull, spinning while it does.
      </li>
      <li>
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ’s <code>overscroll</code> (negative past the top) and{' '}
        <code>isHeld</code> (still pulled: a touch, or a wheel’s fingers until
        quiet or its inertia starts: inertia never pulls); released past the
        distance, it refreshes.
      </li>
      <li>
        The indicator in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        />
        : beneath the content, coming out past its start with it, fading in with
        its pull’s progress (its custom properties); the indicator turning along
        (its <code>progress</code>: a turn to the refresh distance), then
        spinning on from there. While refreshing, it’s <code>open</code>: kept
        shown, the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        making room for it, the content settling there (and back).
      </li>
      <li>
        Safari bounces past the top by itself; elsewhere, the pull is the
        touch’s (or the wheel’s), rubber-banded, the content moved along as
        Safari’s.
      </li>
      <li>
        <strong>Library:</strong> the scroll hook’s <code>overscroll</code> and{' '}
        <code>isHeld</code> (
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ), the overscroll area (
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        />
        , its <code>open</code> and custom properties) and the{' '}
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />{' '}
        (its <code>display</code> and <code>progress</code>).
      </li>
      <li>
        <strong>Demo:</strong> the pull distance, arming and refreshing
        (prepending a row after a while), the pull as the indicator’s progress,
        and the area’s styles.
      </li>
    </ul>
    <CodeView code={refreshCode} />
    <Refresh />

    <Heading
      id="pulling-to-turn-pages"
      level={2}
    >
      Pulling to turn pages
    </Heading>
    <ul>
      <li>
        A page each (a story’s, an article’s): pulled on past the end and
        released, the next; back past the start, the previous.
      </li>
      <li>
        A hint past each end (a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        />{' '}
        at either edge), coming out with the pull, its arrow turning once far
        enough (released then, it turns the page).
      </li>
      <li>
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ’s <code>overscroll</code> at either end (positive past the end), and{' '}
        <code>isHeld</code>. Its <code>direction</code> doesn’t change bouncing
        back.
      </li>
      <li>
        Short pages too: the content layer bounces even when its content fits (
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        ’s <code>alwaysBounce</code>).
      </li>
      <li>
        <strong>Library:</strong> the scroll hook’s <code>overscroll</code> and{' '}
        <code>isHeld</code>, the overscroll areas at both edges (
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        />
        ) and the native bounce.
      </li>
      <li>
        <strong>Demo:</strong> the planets, turning the page (its index), the
        page sliding in (a keyed list’s animation), Pluto’s night sky and the
        hints’ styles.
      </li>
    </ul>
    <CodeView code={pagesCode} />
    <Pages />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const viewportCompositionDemos = [
  Shell,
  Message,
  Collapse,
  Selection,
  Refresh,
  Pages,
];
