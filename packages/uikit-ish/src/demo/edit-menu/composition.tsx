import '../sheet/style.css';
import './style.css';

import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { FunctionComponent, useState } from 'react';

import { EditMenu, Symbol } from '../../components/index.js';
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
const elementCode = `const [open, setOpen] = useState(false);
const photo = useRef<HTMLButtonElement>(null);

<EditMenu.Root open={open} onOpenChange={setOpen}>
  <button ref={photo} type="button" onClick={() => setOpen(true)}>…</button>
  <EditMenu.Portal>
    <EditMenu.Positioner anchor={photo}>
      <EditMenu.Popup>
        <EditMenu.Item>Copy</EditMenu.Item>
        <EditMenu.Item>Share…</EditMenu.Item>
      </EditMenu.Popup>
    </EditMenu.Positioner>
  </EditMenu.Portal>
</EditMenu.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A photo's actions, at the photo (no selection). */
const AtAnElement: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [open, setOpen] = useState(false);
  const photo = useLabelledRef<HTMLButtonElement>('photo');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="edit-menu-composition-element"
      log={log}
      title="Edit menu at an element"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered"
      >
        <EditMenu.Root
          open={open}
          onOpenChange={(next: boolean) => setOpen(next)}
        >
          <button
            ref={photo}
            aria-label="Photo"
            className="edit-menu-demo-photo"
            type="button"
            onClick={() => setOpen(true)}
          >
            <Symbol icon={sfPhoto} />
          </button>
          <EditMenu.Portal container={screen}>
            <EditMenu.Positioner anchor={photo}>
              <EditMenu.Popup>
                <EditMenu.Item onClick={() => addLog('Copy clicked')}>
                  Copy
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Share clicked')}>
                  Share…
                </EditMenu.Item>
              </EditMenu.Popup>
            </EditMenu.Positioner>
          </EditMenu.Portal>
        </EditMenu.Root>
      </div>
    </Component>
  );
};

/** More actions than fit: they scroll in the capsule. */
const ManyActions: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [open, setOpen] = useState(false);
  const word = useLabelledRef<HTMLButtonElement>('word');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id="edit-menu-composition-many"
      log={log}
      title="Edit menu with many actions"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered"
      >
        <EditMenu.Root
          open={open}
          onOpenChange={(next: boolean) => setOpen(next)}
        >
          <button
            ref={word}
            className="edit-menu-demo-word"
            type="button"
            onClick={() => setOpen(true)}
          >
            Show Actions
          </button>
          <EditMenu.Portal container={screen}>
            <EditMenu.Positioner anchor={word}>
              <EditMenu.Popup>
                <EditMenu.Item onClick={() => addLog('Cut clicked')}>
                  Cut
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Copy clicked')}>
                  Copy
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Paste clicked')}>
                  Paste
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Replace clicked')}>
                  Replace…
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Look Up clicked')}>
                  Look Up
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Translate clicked')}>
                  Translate
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Share clicked')}>
                  Share…
                </EditMenu.Item>
                <EditMenu.Item
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  Delete
                </EditMenu.Item>
              </EditMenu.Popup>
            </EditMenu.Positioner>
          </EditMenu.Portal>
        </EditMenu.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['at-an-element', 'At an element'],
  ['many-actions', 'Many actions'],
];

/** `/edit-menu/composition`: edit menus at selections and elements. */
export const EditMenuComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        At a text selection: see the <a href="edit-menu">overview</a> (
        <PartLink
          component="edit-menu"
          part="useSelectionAnchor"
        />
        ).
      </li>
    </ul>

    <Heading
      id="at-an-element"
      level={2}
    >
      At an element
    </Heading>
    <ul>
      <li>
        A photo’s actions (Copy, Share): opened by the app (here on a press),
        the photo the positioner’s <code>anchor</code> (a ref).
      </li>
      <li>Closed by an action, a press outside, or Escape.</li>
    </ul>
    <CodeView code={elementCode} />
    <AtAnElement />

    <Heading
      id="many-actions"
      level={2}
    >
      Many actions
    </Heading>
    <ul>
      <li>
        More actions than the screen is wide: they scroll in the capsule, faded
        at the ends with more beyond (drag them by touch, or scroll).
      </li>
      <li>
        Or fewer, the rest behind the “more” button (
        <PartLink
          component="edit-menu"
          part="EditMenu.More"
        />
        ).
      </li>
    </ul>
    <ManyActions />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const editMenuCompositionDemos = [AtAnElement, ManyActions];
