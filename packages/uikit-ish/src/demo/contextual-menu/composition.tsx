import '../sheet/style.css';
import './style.css';

import { sfArrowshapeTurnUpLeft } from '@bradleyhodges/sfsymbols/sfArrowshapeTurnUpLeft';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent } from 'react';

import { ContextualMenu, Symbol } from '../../components/index.js';
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

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const thumbnailsCode = `<ContextualMenu.Root>
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
  <ContextualMenu.Portal container={screen}>
    <ContextualMenu.Backdrop />
    <ContextualMenu.Positioner>
      <ContextualMenu.Popup>…</ContextualMenu.Popup>
    </ContextualMenu.Positioner>
  </ContextualMenu.Portal>
</ContextualMenu.Root>`;

const heldCode = `<ContextualMenu.Trigger
  openOn="secondaryClick"
  render={<button className="message" type="button" />}
  onClick={openMessage}
>
  …
</ContextualMenu.Trigger>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

// Photos (their names, their colors).
const photos = [
  ['Beach', 'var(--color-ios-system-orange)'],
  ['Forest', 'var(--color-ios-system-green)'],
  ['Lake', 'var(--color-ios-system-blue)'],
] as const;

/** Photos' thumbnails: each lifting into its preview, its menu below. */
const Thumbnails: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="contextual-menu-composition-thumbnails"
      log={log}
      title="Contextual menus on thumbnails"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered"
      >
        <div className="contextual-menu-demo-grid">
          {photos.map(([name, color]) => (
            <ContextualMenu.Root key={name}>
              <ContextualMenu.Trigger
                aria-label={name}
                className="contextual-menu-demo-thumbnail"
                render={<button type="button" />}
                style={{ backgroundColor: color }}
              >
                <Symbol icon={sfPhoto} />
              </ContextualMenu.Trigger>
              <ContextualMenu.Preview>
                <div
                  aria-label={name}
                  className="contextual-menu-demo-photo"
                  role="img"
                  style={{ backgroundImage: 'none', backgroundColor: color }}
                >
                  <Symbol icon={sfPhoto} />
                </div>
              </ContextualMenu.Preview>
              <ContextualMenu.Portal container={screen}>
                <ContextualMenu.Backdrop />
                <ContextualMenu.Positioner>
                  <ContextualMenu.Popup>
                    <ContextualMenu.Item
                      onClick={() => addLog(`share: ${name}`)}
                    >
                      <ContextualMenu.Icon>
                        <Symbol icon={sfSquareAndArrowUp} />
                      </ContextualMenu.Icon>
                      <ContextualMenu.Label>Share</ContextualMenu.Label>
                    </ContextualMenu.Item>
                    <ContextualMenu.Item
                      onClick={() => addLog(`favorite: ${name}`)}
                    >
                      <ContextualMenu.Icon>
                        <Symbol icon={sfHeart} />
                      </ContextualMenu.Icon>
                      <ContextualMenu.Label>Favorite</ContextualMenu.Label>
                    </ContextualMenu.Item>
                    <ContextualMenu.Separator />
                    <ContextualMenu.Item
                      destructive
                      onClick={() => addLog(`delete: ${name}`)}
                    >
                      <ContextualMenu.Icon>
                        <Symbol icon={sfTrash} />
                      </ContextualMenu.Icon>
                      <ContextualMenu.Label>Delete</ContextualMenu.Label>
                    </ContextualMenu.Item>
                  </ContextualMenu.Popup>
                </ContextualMenu.Positioner>
              </ContextualMenu.Portal>
            </ContextualMenu.Root>
          ))}
        </div>
      </div>
    </Component>
  );
};

/** A message: a press opens it, a held press shows its menu. */
const OnAHeldPress: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="contextual-menu-composition-held"
      log={log}
      title="Contextual menu on a held press"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root>
          <ContextualMenu.Trigger
            className="contextual-menu-demo-message"
            openOn="secondaryClick"
            render={<button type="button" />}
            onClick={() => addLog('message opened')}
          >
            <strong>Kate Bell</strong>
            <span>Here are the photos from the weekend!</span>
          </ContextualMenu.Trigger>
          <ContextualMenu.Portal container={screen}>
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner align="start">
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Reply clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfArrowshapeTurnUpLeft} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Reply</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Item
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <ContextualMenu.Icon>
                    <Symbol icon={sfTrash} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Delete</ContextualMenu.Label>
                </ContextualMenu.Item>
              </ContextualMenu.Popup>
            </ContextualMenu.Positioner>
          </ContextualMenu.Portal>
        </ContextualMenu.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['thumbnails-previewed', 'Thumbnails, previewed'],
  ['on-a-held-press', 'On a held press'],
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
        Photos’ grid: each thumbnail its own menu’s trigger (a plain{' '}
        <code>button</code>, named), turning into the photo, larger (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Preview"
        />
        ), lifted above the blurred page.
      </li>
      <li>The preview aligns as the menu does, and stays in the viewport.</li>
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
        A message: a press opens it (the trigger’s own <code>onClick</code>), a
        held press or a right click shows its menu (
        <code>openOn=&quot;secondaryClick&quot;</code>), the message itself
        lifting.
      </li>
      <li>
        Aligned with its start (
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Positioner"
        />
        ’s <code>align</code>).
      </li>
    </ul>
    <CodeView code={heldCode} />
    <OnAHeldPress />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const contextualMenuCompositionDemos = [Thumbnails, OnAHeldPress];
