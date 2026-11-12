import '../docs/viewport/style.css';

import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Button,
  CheckboxGroup,
  forwardClick,
  List,
  Segmented,
  Symbol,
  TextField,
  Toolbar,
  useAnchorSize,
  useCreateViewportAnchorHandle,
  useViewportScroll,
  Viewport,
} from '../../components/index.js';
import { planets } from '../docs/viewport/content.js';
import {
  sfArrowDown,
  sfArrowUp,
  sfFolder,
  sfHeartFill,
  sfLine3HorizontalDecreaseCircle,
  sfPhoto,
  sfRecordingtape,
  sfSquareAndPencil,
} from '../tooling/icons.js';
import {
  BackButton,
  DrillRow,
  Row,
  Rows,
  type SinkPage,
  type SinkPages,
} from './shared.js';

// Viewport: its anchors (bars) and the paddings making room for them (as
// they change), its edge effects and tints, the keyboard, overscroll. Each
// a screen of its own (a bare page, see `isBare`): its own provider
// tracking its own content layer (as the docs' stages do), its own bar.

const names = [
  'Aaron',
  'Abigail',
  'Adrian',
  'Bella',
  'Benjamin',
  'Chloe',
  'Daniel',
  'Dylan',
  'Ella',
  'Emma',
  'Felix',
  'Grace',
  'Hannah',
  'Henry',
  'Isaac',
  'Jack',
  'Julia',
  'Leo',
  'Lily',
  'Mia',
];

/**
 * A screen of its own: filling the stack's frame, its provider tracking
 * its content layer (`contentRef`, for `render`).
 */
export const Screen: FunctionComponent<{
  render: (contentRef: RefObject<HTMLDivElement | null>) => ReactNode;
}> = ({ render }) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <div
        ref={screenRef}
        className="kitchen-sink-screen"
      >
        {render(contentRef)}
      </div>
    </Viewport.Provider>
  );
};

/** A screen's bar at the top: back, its title, its items. */
export const TopBar: FunctionComponent<{
  children?: ReactNode;
  title: string;
}> = ({ children, title }) => (
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading>
        <BackButton />
      </Toolbar.Leading>
      <Toolbar.Title>
        <span>{title}</span>
      </Toolbar.Title>
      {children}
    </Toolbar.Root>
  </Viewport.BlockStart>
);

/** Rows of names (with colored images: content to see under the bars). */
const NameRows: FunctionComponent<{ rows?: readonly string[] }> = ({
  rows = names,
}) => (
  <List.Root>
    <List.Section>
      <List.Group>
        {rows.map((name, index) => (
          <List.Item key={name}>
            <List.Leading>
              <List.Image
                variant="rounded"
                style={{
                  backgroundColor: `hsl(${String(index * 37)} 70% 50%)`,
                }}
              >
                <Symbol icon={sfPhoto} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title>{name}</List.Title>
            </List.Content>
          </List.Item>
        ))}
      </List.Group>
    </List.Section>
  </List.Root>
);

/** A bare page (see `isBare`) of a screen. */
const screenPage = (title: string, Content: FunctionComponent): SinkPage => ({
  Content,
  isBare: true,
  title,
});

/** Its bars' edge effects (and tints), at the top and the bottom. */
const edgeScreen = (
  title: string,
  edgeEffect: 'hard' | 'none' | 'soft',
  edgeTint?: string,
): SinkPage =>
  screenPage(title, () => (
    <Screen
      render={(contentRef) => (
        <>
          <Viewport.Content ref={contentRef}>
            <Viewport.Padding edge="block-start" />
            <NameRows />
            <Viewport.Padding edge="block-end" />
          </Viewport.Content>
          <Viewport.BlockStart
            edgeEffect={edgeEffect}
            edgeTint={edgeTint}
          >
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <BackButton />
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>{title}</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Viewport.BlockEnd
            edgeEffect={edgeEffect}
            edgeTint={edgeTint}
          >
            <Toolbar.Root>
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Folders"
                  disabled={false}
                  shape="circle"
                >
                  <Button.Icon>
                    <Symbol icon={sfFolder} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="Compose"
                  disabled={false}
                  shape="circle"
                >
                  <Button.Icon>
                    <Symbol icon={sfSquareAndPencil} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        </>
      )}
    />
  ));

/** The anchors' sizes (as the paddings make room for them). */
const AnchorSizes: FunctionComponent = () => {
  const top = useAnchorSize('block-start');
  const bottom = useAnchorSize('block-end');

  return (
    <List.Section>
      <List.Header>
        <List.Title>The Bars’ Sizes (the Paddings’ Room)</List.Title>
      </List.Header>
      <List.Group>
        <Row title="Top">
          <List.Detail className="kitchen-sink-value">{top}px</List.Detail>
        </Row>
        <Row title="Bottom">
          <List.Detail className="kitchen-sink-value">{bottom}px</List.Detail>
        </Row>
      </List.Group>
    </List.Section>
  );
};

/**
 * Anchors changing size (a filter bar added to the bottom one, a search to
 * the top one): the paddings following, the last row reachable still.
 */
const AnchorsScreen: FunctionComponent = () => {
  const [hasFilters, setHasFilters] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);

  return (
    <Screen
      render={(contentRef) => (
        <>
          <Viewport.Content ref={contentRef}>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <AnchorSizes />
              <List.Section>
                <List.Header>
                  <List.Title>Change the Bars</List.Title>
                </List.Header>
                <List.Group>
                  <List.Item>
                    <List.Content>
                      <List.Button onClick={() => setHasSearch(!hasSearch)}>
                        {hasSearch ? 'Remove the Search' : 'Add a Search'}
                      </List.Button>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Button onClick={() => setHasFilters(!hasFilters)}>
                        {hasFilters ? 'Remove the Filters' : 'Add Filters'}
                      </List.Button>
                    </List.Content>
                  </List.Item>
                </List.Group>
                <List.Footer>
                  The content’s paddings grow and shrink with the bars, so the
                  first and the last row stay reachable.
                </List.Footer>
              </List.Section>
            </List.Root>
            <NameRows />
            <Viewport.Padding edge="block-end" />
          </Viewport.Content>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <BackButton />
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Anchors</span>
              </Toolbar.Title>
            </Toolbar.Root>
            {hasSearch ? (
              <div className="kitchen-sink-bar-row">
                <TextField.Root>
                  <TextField.Frame>
                    <TextField.Control
                      aria-label="Search"
                      enterKeyHint="search"
                      placeholder="Search"
                      type="search"
                    />
                    <TextField.Clear />
                  </TextField.Frame>
                </TextField.Root>
              </div>
            ) : null}
          </Viewport.BlockStart>
          <Viewport.BlockEnd>
            {hasFilters ? (
              <div className="kitchen-sink-bar-row">
                <Segmented.Root
                  aria-label="Filter"
                  defaultValue="all"
                >
                  <Segmented.Item value="all">All</Segmented.Item>
                  <Segmented.Item value="favorites">Favorites</Segmented.Item>
                  <Segmented.Item value="recent">Recent</Segmented.Item>
                  <Segmented.Highlight />
                </Segmented.Root>
              </div>
            ) : null}
            <Toolbar.Root>
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Filters"
                  shape="circle"
                  onClick={() => setHasFilters(!hasFilters)}
                >
                  <Button.Icon>
                    <Symbol icon={sfLine3HorizontalDecreaseCircle} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>{names.length} Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="Compose"
                  disabled={false}
                  shape="circle"
                >
                  <Button.Icon>
                    <Symbol icon={sfSquareAndPencil} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        </>
      )}
    />
  );
};

/**
 * Two anchors at the bottom (a bar, a toast over the content): the padding
 * linked to the bar's alone (a handle), or to both.
 */
const HandleScreen: FunctionComponent = () => {
  const bar = useCreateViewportAnchorHandle();
  const toast = useCreateViewportAnchorHandle();
  const [isLinked, setIsLinked] = useState(false);

  return (
    <Screen
      render={(contentRef) => (
        <>
          <Viewport.Content ref={contentRef}>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  <List.Item>
                    <List.Content>
                      <List.Button onClick={() => setIsLinked(!isLinked)}>
                        {isLinked
                          ? 'Room for the Bar Alone'
                          : 'Room for the Toast Too'}
                      </List.Button>
                    </List.Content>
                  </List.Item>
                </List.Group>
                <List.Footer>
                  The bottom padding is linked to the bar’s anchor
                  {isLinked ? ' and the toast’s' : ' alone'}: scroll to the end
                  to see the last row
                  {isLinked ? ' clear of both.' : ' under the toast.'}
                </List.Footer>
              </List.Section>
            </List.Root>
            <NameRows />
            <Viewport.Padding
              anchor={isLinked ? [bar, toast] : bar}
              edge="block-end"
            />
          </Viewport.Content>
          <TopBar title="Anchor Handles" />
          <Viewport.BlockEnd handle={bar}>
            <Toolbar.Root>
              <Toolbar.Title>
                <span>{names.length} Contacts</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockEnd>
          <Viewport.BlockEnd
            className="viewport-demo-toast-anchor"
            handle={toast}
          >
            <div
              className="viewport-demo-toast"
              role="status"
            >
              Contact deleted.
            </div>
          </Viewport.BlockEnd>
        </>
      )}
    />
  );
};

const messages = [
  ['Anna', 'Are we still on for lunch tomorrow? I found a new place.'],
  ['Ben', 'The photos from the weekend are up. Have a look when you can.'],
  ['Clara', 'Can you send me the slides from this morning’s meeting?'],
  ['Dev', 'Running ten minutes late, sorry! Save me a seat.'],
  ['Eve', 'Happy birthday! Hope you have a wonderful day.'],
  ['Finn', 'Did the package arrive? The tracking says delivered.'],
] as const;

/** A message field at the bottom, pushed up by the on-screen keyboard. */
const MessageScreen: FunctionComponent = () => {
  const [sent, setSent] = useState<readonly string[]>([]);

  return (
    <Screen
      render={(contentRef) => (
        <>
          <Viewport.Content ref={contentRef}>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  {messages.map(([from, text]) => (
                    <List.Item key={from}>
                      <List.Content>
                        <List.Title>{from}</List.Title>
                        <List.Text lines={3}>{text}</List.Text>
                      </List.Content>
                    </List.Item>
                  ))}
                  {sent.map((text, index) => (
                    <List.Item key={index}>
                      <List.Content>
                        <List.Title>Me</List.Title>
                        <List.Text lines={3}>{text}</List.Text>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Viewport.Content>
          <TopBar title="A Message Field" />
          <Viewport.BlockEnd>
            <Toolbar.Root>
              <TextField.Root>
                <TextField.Frame>
                  <TextField.Control
                    aria-label="Message"
                    enterKeyHint="send"
                    placeholder="Message"
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter') return;
                      const text = event.currentTarget.value.trim();
                      if (text) setSent((current) => [...current, text]);
                      event.currentTarget.value = '';
                    }}
                  />
                  <TextField.Clear />
                </TextField.Frame>
              </TextField.Root>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        </>
      )}
    />
  );
};

/**
 * A field at the end of the content (its section a keyboard accessory):
 * lifted above the keyboard while it's focused, as far as it covers it.
 */
const AccessoryScreen: FunctionComponent = () => (
  <Screen
    render={(contentRef) => (
      <>
        <Viewport.Content ref={contentRef}>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.slice(0, 8).map((name) => (
                  <Row
                    key={name}
                    title={name}
                  />
                ))}
              </List.Group>
              <List.Footer>
                When it has focus, the Note row below is lifted above the
                keyboard, as far as the keyboard covers it, while its place in
                the list is kept.
              </List.Footer>
            </List.Section>
            {/* (Its section, kept above the keyboard while focused.) */}
            <List.Section render={<Viewport.KeyboardAccessory />}>
              <List.Group>
                <TextField.Root render={<List.Item />}>
                  <List.Content>
                    <TextField.Label>Note</TextField.Label>
                  </List.Content>
                  <List.Trailing>
                    <TextField.Control placeholder="Kept above the keyboard" />
                  </List.Trailing>
                </TextField.Root>
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <TopBar title="A Field Kept Above the Keyboard" />
      </>
    )}
  />
);

// Pulled this far past the top (px), released, it refreshes.
const refreshDistance = 60;

/** Pulled past the top and released: refreshing (a row added). */
const RefreshView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
}> = ({ contentRef }) => {
  const [rows, setRows] = useState<readonly string[]>(names);
  const [overscroll, setOverscroll] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isArmed = useRef(false);

  useViewportScroll(({ isHeld, overscroll: by }) => {
    setOverscroll(by);
    if (isHeld) {
      isArmed.current = !isRefreshing && -by >= refreshDistance;
      return;
    }
    if (!isArmed.current || isRefreshing) return;
    isArmed.current = false;
    setIsRefreshing(true);
    setTimeout(() => {
      setRows((current) => [
        `New Contact ${String(current.length - names.length + 1)}`,
        ...current,
      ]);
      setIsRefreshing(false);
    }, 1500);
  });

  return (
    <>
      <Viewport.Overscroll
        className="viewport-demo-pull"
        open={isRefreshing}
        safeArea="inline"
      >
        <ActivityIndicator
          display={isRefreshing ? 'animate' : 'reset'}
          progress={-overscroll / refreshDistance}
        />
      </Viewport.Overscroll>
      <Viewport.Content ref={contentRef}>
        <Viewport.Padding edge="block-start" />
        <NameRows rows={rows} />
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
      <TopBar title="Pull to Refresh" />
    </>
  );
};

// Pulled this far past an end (px), released, it turns the page.
const turnDistance = 80;

/**
 * The planets, a page each, turned by pulling past an end (and releasing),
 * as the Viewport docs' composition (Pluto's a night sky, and its heart).
 */
const PagesView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
}> = ({ contentRef }) => {
  const [index, setIndex] = useState(0);
  const [turned, setTurned] = useState<'next' | 'previous'>();
  const [scroll, setScroll] = useState({ isHeld: false, overscroll: 0 });
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
    if (turn.current === 0) return;
    setIndex(index + turn.current);
    setTurned(turn.current < 0 ? 'previous' : 'next');
    turn.current = 0;
    contentRef.current?.scrollTo({ top: 0 });
  });

  return (
    <>
      {previous ? (
        <Viewport.Overscroll
          className="viewport-demo-pull"
          data-armed={overscroll <= -turnDistance ? '' : undefined}
          data-released={scroll.isHeld ? undefined : ''}
          safeArea="inline"
        >
          <Symbol
            className="viewport-demo-pull-arrow"
            icon={sfArrowDown}
          />
          {previous}
        </Viewport.Overscroll>
      ) : null}
      {next ? (
        <Viewport.Overscroll
          className="viewport-demo-pull"
          data-armed={overscroll >= turnDistance ? '' : undefined}
          data-released={scroll.isHeld ? undefined : ''}
          edge="block-end"
          safeArea="inline"
        >
          <Symbol
            className="viewport-demo-pull-arrow"
            icon={sfArrowUp}
          />
          {next}
        </Viewport.Overscroll>
      ) : null}
      <Viewport.Content
        ref={contentRef}
        alwaysBounce
      >
        <Viewport.Padding edge="block-start" />
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
                <Row
                  key={fact}
                  title={fact}
                />
              ))}
            </List.Group>
            <List.Footer>
              Pull past the top or the bottom and let go to turn the page.
            </List.Footer>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
      <TopBar title="Pull to Turn Pages" />
    </>
  );
};

/** A list's selection, acted on by a toolbar at the bottom. */
const SelectionScreen: FunctionComponent = () => {
  const [rows, setRows] = useState<readonly string[]>(names);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Screen
      render={(contentRef) => (
        <>
          <Viewport.Content ref={contentRef}>
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
          <TopBar title="Selection" />
          <Viewport.BlockEnd>
            <Toolbar.Root>
              <Toolbar.Leading>
                <Toolbar.Button
                  disabled={rows.length === names.length}
                  onClick={() => setRows(names)}
                >
                  <Button.Label>Reset</Button.Label>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>{selected.length} Selected</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  destructive
                  disabled={selected.length === 0}
                  onClick={() => {
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
      )}
    />
  );
};

/** Recording: the bottom edge tinted while it goes on. */
const RecordingScreen: FunctionComponent = () => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <Screen
      render={(contentRef) => (
        <>
          <Viewport.Content ref={contentRef}>
            <Viewport.Padding edge="block-start" />
            <NameRows />
            <Viewport.Padding edge="block-end" />
          </Viewport.Content>
          <TopBar title="A Tinted Edge" />
          <Viewport.BlockEnd
            edgeTint={isRecording ? 'rgb(255 59 48 / 35%)' : undefined}
          >
            <Toolbar.Root>
              <Toolbar.Title>
                <span>{isRecording ? 'Recording…' : 'Not Recording'}</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label={isRecording ? 'Stop' : 'Record'}
                  destructive={isRecording}
                  shape="circle"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Button.Icon>
                    <Symbol icon={sfRecordingtape} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        </>
      )}
    />
  );
};

const screens = [
  [
    'Anchors and Paddings',
    [
      ['viewport/anchors', 'Bars Changing Size', AnchorsScreen],
      ['viewport/handles', 'Paddings Linked to Anchors', HandleScreen],
      ['viewport/message', 'A Message Field (Pushed Up)', MessageScreen],
      [
        'viewport/accessory',
        'A Field Kept Above the Keyboard',
        AccessoryScreen,
      ],
      [
        'viewport/selection',
        'A Bottom Bar Acting on a Selection',
        SelectionScreen,
      ],
    ],
  ],
  [
    'Overscroll',
    [
      [
        'viewport/refresh',
        'Pull to Refresh',
        () => <Screen render={(ref) => <RefreshView contentRef={ref} />} />,
      ],
      [
        'viewport/pages',
        'Pull to Turn Pages',
        () => <Screen render={(ref) => <PagesView contentRef={ref} />} />,
      ],
    ],
  ],
  ['Edges', [['viewport/tint', 'A Tinted Edge (Recording)', RecordingScreen]]],
] as const;

const edges = [
  ['viewport/soft', 'Soft', 'soft', undefined],
  ['viewport/hard', 'Hard', 'hard', undefined],
  ['viewport/none', 'None', 'none', undefined],
  ['viewport/tinted', 'Soft, Tinted', 'soft', 'var(--color-ui-system-blue)'],
  [
    'viewport/hard-tinted',
    'Hard, Tinted',
    'hard',
    'var(--color-ui-system-orange)',
  ],
] as const;

const ViewportContent: FunctionComponent = () => (
  <List.Root>
    {screens.map(([title, entries]) => (
      <Rows
        key={title}
        title={title}
      >
        {entries.map(([key, entryTitle]) => (
          <DrillRow
            key={key}
            pageKey={key}
            title={entryTitle}
          />
        ))}
      </Rows>
    ))}
    <Rows title="Edge Effects (Top and Bottom)">
      {edges.map(([key, title]) => (
        <DrillRow
          key={key}
          pageKey={key}
          title={title}
        />
      ))}
    </Rows>
  </List.Root>
);

export const viewportPages: SinkPages = {
  viewport: { Content: ViewportContent, title: 'Viewport' },
  ...Object.fromEntries(
    screens.flatMap(([, entries]) =>
      entries.map(([key, title, Content]) => [key, screenPage(title, Content)]),
    ),
  ),
  ...Object.fromEntries(
    edges.map(([key, title, effect, tint]) => [
      key,
      edgeScreen(title, effect, tint),
    ]),
  ),
};
