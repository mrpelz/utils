import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  ContextualMenu,
  Symbol,
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
  sfArrowshapeTurnUpLeft,
  sfBackwardFill,
  sfForwardFill,
  sfHeart,
  sfOpticaldisc,
  sfPauseFill,
  sfPersonCropCircle,
  sfPhoto,
  sfPlusCircle,
  sfSquareAndArrowUp,
  sfTextBadgePlus,
  sfTrash,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const thumbnailsCode = `const photo = '/photos/beach.jpg';

<ContextualMenu.Root>
  <ContextualMenu.Trigger
    aria-label="Beach"
    render={<button className="thumbnail" type="button" />}
  >
    …
  </ContextualMenu.Trigger>
  {/* The photo, larger, in the thumbnail's place while the menu is open. */}
  <ContextualMenu.Preview>
    <img alt="Beach" src={photo} />
  </ContextualMenu.Preview>
  <ContextualMenu.Portal>
    <ContextualMenu.Backdrop />
    <ContextualMenu.Positioner>
      <ContextualMenu.Popup>…</ContextualMenu.Popup>
    </ContextualMenu.Positioner>
  </ContextualMenu.Portal>
</ContextualMenu.Root>`;

const heldCode = `const message = useRef<HTMLButtonElement>(null);
// A held press opens the menu, selecting no text (no browser text menu).
useTextActionsPrevention(message);

<ContextualMenu.Trigger
  ref={message}
  render={<button className="message" type="button" />}
  onClick={() => {…}}
>
  …
</ContextualMenu.Trigger>`;

const liveCode = `const tile = useRef<HTMLButtonElement>(null);
// A held press selects no text (no browser text menu).
useTextActionsPrevention(tile);

<ContextualMenu.Root>
  {/* No preview: the trigger itself lifts, its bars moving on. */}
  <ContextualMenu.Trigger
    ref={tile}
    render={<button className="playing" type="button" />}
  >
    <span aria-hidden className="bars">
      <span />
      <span />
      <span />
      <span />
    </span>
    <span>
      <strong>Now Playing</strong>
      <span>Clair de Lune</span>
    </span>
  </ContextualMenu.Trigger>
  <ContextualMenu.Portal>
    <ContextualMenu.Backdrop />
    <ContextualMenu.Positioner>
      <ContextualMenu.Popup>…</ContextualMenu.Popup>
    </ContextualMenu.Positioner>
  </ContextualMenu.Portal>
</ContextualMenu.Root>

/* Each bar rising and falling, on its own beat. */
.bars > span {
  animation: bar 900ms ease-in-out infinite alternate;
}

.bars > span:nth-child(2) { animation-delay: -300ms; }
.bars > span:nth-child(3) { animation-delay: -600ms; }
.bars > span:nth-child(4) { animation-delay: -150ms; }

@keyframes bar {
  from { scale: 1 0.2; }
  to { scale: 1 1; }
}`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

// Photos (their names, their colors).
const photos = [
  ['Beach', 'var(--color-ui-system-orange)'],
  ['Forest', 'var(--color-ui-system-green)'],
  ['Lake', 'var(--color-ui-system-blue)'],
] as const;

/** Photos' thumbnails: each lifting into its preview, its menu below. */
const Thumbnails: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Preview': [],
            'ContextualMenu.Root': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': [
              'aria-label',
              'className',
              'render',
              'style',
            ],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('contextual-menu-composition-thumbnails') },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="contextual-menu-composition-thumbnails"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Contextual menus on thumbnails"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="contextual-menu-demo-grid">
          {photos.map(([name, color]) => (
            <ContextualMenu.Root
              key={name}
              {...partProps['ContextualMenu.Root']}
            >
              <ContextualMenu.Trigger
                {...partProps['ContextualMenu.Trigger']}
                aria-label={name}
                className="contextual-menu-demo-thumbnail"
                render={<button type="button" />}
                style={{ backgroundColor: color }}
              >
                <Symbol
                  {...partProps.Symbol}
                  icon={sfPhoto}
                />
              </ContextualMenu.Trigger>
              <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
                <div
                  aria-label={name}
                  className="contextual-menu-demo-photo"
                  role="img"
                  style={{ backgroundImage: 'none', backgroundColor: color }}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPhoto}
                  />
                </div>
              </ContextualMenu.Preview>
              <ContextualMenu.Portal {...partProps['ContextualMenu.Portal']}>
                <ContextualMenu.Backdrop
                  {...partProps['ContextualMenu.Backdrop']}
                />
                <ContextualMenu.Positioner
                  {...partProps['ContextualMenu.Positioner']}
                >
                  <ContextualMenu.Popup {...partProps['ContextualMenu.Popup']}>
                    <ContextualMenu.Item
                      {...partProps['ContextualMenu.Item']}
                      onClick={() => addLog(`share: ${name}`)}
                    >
                      <ContextualMenu.Icon
                        {...partProps['ContextualMenu.Icon']}
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfSquareAndArrowUp}
                        />
                      </ContextualMenu.Icon>
                      <ContextualMenu.Label
                        {...partProps['ContextualMenu.Label']}
                      >
                        Share
                      </ContextualMenu.Label>
                    </ContextualMenu.Item>
                    <ContextualMenu.Item
                      {...partProps['ContextualMenu.Item']}
                      onClick={() => addLog(`favorite: ${name}`)}
                    >
                      <ContextualMenu.Icon
                        {...partProps['ContextualMenu.Icon']}
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfHeart}
                        />
                      </ContextualMenu.Icon>
                      <ContextualMenu.Label
                        {...partProps['ContextualMenu.Label']}
                      >
                        Favorite
                      </ContextualMenu.Label>
                    </ContextualMenu.Item>
                    <ContextualMenu.Separator
                      {...partProps['ContextualMenu.Separator']}
                    />
                    <ContextualMenu.Item
                      {...partProps['ContextualMenu.Item']}
                      destructive
                      onClick={() => addLog(`delete: ${name}`)}
                    >
                      <ContextualMenu.Icon
                        {...partProps['ContextualMenu.Icon']}
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfTrash}
                        />
                      </ContextualMenu.Icon>
                      <ContextualMenu.Label
                        {...partProps['ContextualMenu.Label']}
                      >
                        Delete
                      </ContextualMenu.Label>
                    </ContextualMenu.Item>
                  </ContextualMenu.Popup>
                </ContextualMenu.Positioner>
              </ContextualMenu.Portal>
            </ContextualMenu.Root>
          ))}
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** A message: a press opens it, a held press shows its menu. */
const OnAHeldPress: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const message = useLabelledRef<HTMLButtonElement>(
    'message',
    'HTMLButtonElement',
  );
  useTextActionsPrevention(message);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': ['align'],
            'ContextualMenu.Root': [],
            'ContextualMenu.Trigger': ['className', 'onClick', 'ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('contextual-menu-composition-held') },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="contextual-menu-composition-held"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Contextual menu on a held press"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={message}
            className="contextual-menu-demo-message"
            render={<button type="button" />}
            onClick={() => addLog('message opened')}
          >
            <strong>Kate Brown</strong>
            <span>Here are the photos from the weekend!</span>
          </ContextualMenu.Trigger>
          <ContextualMenu.Portal {...partProps['ContextualMenu.Portal']}>
            <ContextualMenu.Backdrop
              {...partProps['ContextualMenu.Backdrop']}
            />
            <ContextualMenu.Positioner
              {...partProps['ContextualMenu.Positioner']}
              align="start"
            >
              <ContextualMenu.Popup {...partProps['ContextualMenu.Popup']}>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Reply clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfArrowshapeTurnUpLeft}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Reply
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Delete
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
              </ContextualMenu.Popup>
            </ContextualMenu.Positioner>
          </ContextualMenu.Portal>
        </ContextualMenu.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A playing song's tile, its bars moving: it lifts as itself. */
const LiveTrigger: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const tile = useLabelledRef<HTMLButtonElement>('tile', 'HTMLButtonElement');
  useTextActionsPrevention(tile);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Root': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['className', 'ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('contextual-menu-composition-live') },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="contextual-menu-composition-live"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Contextual menu on a live trigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={tile}
            className="contextual-menu-demo-playing"
            render={<button type="button" />}
          >
            <span
              aria-hidden
              className="contextual-menu-demo-bars"
            >
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              <strong>Now Playing</strong>
              <span>Clair de Lune</span>
            </span>
          </ContextualMenu.Trigger>
          <ContextualMenu.Portal {...partProps['ContextualMenu.Portal']}>
            <ContextualMenu.Backdrop
              {...partProps['ContextualMenu.Backdrop']}
            />
            <ContextualMenu.Positioner
              {...partProps['ContextualMenu.Positioner']}
            >
              <ContextualMenu.Popup {...partProps['ContextualMenu.Popup']}>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Previous clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfBackwardFill}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Previous
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Pause clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPauseFill}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Pause
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Next clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfForwardFill}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Next
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Add to Library clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPlusCircle}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Add to Library
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Love clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfHeart}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Love
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Play Last clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTextBadgePlus}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Play Last
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Go to Album clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfOpticaldisc}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Go to Album
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Go to Artist clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPersonCropCircle}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Go to Artist
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
                <ContextualMenu.Item
                  {...partProps['ContextualMenu.Item']}
                  onClick={() => addLog('Share clicked')}
                >
                  <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label {...partProps['ContextualMenu.Label']}>
                    Share
                  </ContextualMenu.Label>
                </ContextualMenu.Item>
              </ContextualMenu.Popup>
            </ContextualMenu.Positioner>
          </ContextualMenu.Portal>
        </ContextualMenu.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['thumbnails-previewed', 'Thumbnails, previewed'],
  ['on-a-held-press', 'On a held press'],
  ['a-live-trigger', 'A live trigger'],
];

/** `/contextual-menu/composition`: contextual menus on content. */
export const ContextualMenuComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="thumbnails-previewed"
      level={2}
    >
      Thumbnails, previewed
    </Heading>
    <ul>
      <li>
        As in a photos app’s grid: each thumbnail is its own menu’s trigger (a
        plain, named <code>button</code>). It turns into the photo, larger (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Preview"
        />
        ), lifted above the blurred page.
      </li>
      <li>The preview aligns like the menu, and stays in the viewport.</li>
      <li>
        <strong>Library:</strong> the menu at each trigger (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Root"
        />
        ), the lifted, larger preview (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Preview"
        />
        ) above the blurred backdrop, and keeping it in view.
      </li>
      <li>
        <strong>Demo:</strong> the photos, the thumbnails’ buttons, and what
        each item does (logged).
      </li>
    </ul>
    <CodeView code={thumbnailsCode} />
    <Thumbnails />

    <Heading
      id="on-a-held-press"
      level={2}
    >
      On a held press
    </Heading>
    <ul>
      <li>
        A message: a press opens it (the trigger’s own <code>onClick</code>),
        and a held press or a right click shows its menu (as by default), with
        the message itself lifting.
      </li>
      <li>
        It’s aligned with its start (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Positioner"
        />
        ’s <code>align</code>).
      </li>
      <li>
        <strong>Library:</strong> opening on a held press or a right click (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Trigger"
        />
        ), lifting the trigger itself, and aligning the menu (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Positioner"
        />
        ’s <code>align</code>).
      </li>
      <li>
        <strong>Demo:</strong> the message, what a plain press does (its{' '}
        <code>onClick</code>), and what each item does (logged).
      </li>
    </ul>
    <CodeView code={heldCode} />
    <OnAHeldPress />

    <Heading
      id="a-live-trigger"
      level={2}
    >
      A live trigger
    </Heading>
    <ul>
      <li>
        A playing song’s tile, with moving bars. Without a{' '}
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Preview"
        />
        , the trigger itself lifts, with the menu below it.
      </li>
      <li>
        It’s moved, not copied or re-inserted, so its bars keep moving and never
        start over (as a playing video, a running timer or a chart drawn in
        place would).
      </li>
      <li>
        Inside a <a href={publicUrl('viewport')}>Viewport</a>’s content layer
        (its own stacking context), it still shows through the blurred page,
        because the backdrop is cut out where it is.
      </li>
      <li>
        <strong>Library:</strong> lifting the live trigger (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Trigger"
        />
        ) with the menu (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Positioner"
        />
        ), and the backdrop’s cutout (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Backdrop"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the tile, its bars’ animation, and what each item
        does (logged).
      </li>
    </ul>
    <CodeView code={liveCode} />
    <LiveTrigger />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const contextualMenuCompositionDemos = [
  Thumbnails,
  OnAHeldPress,
  LiveTrigger,
];
