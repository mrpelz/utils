import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  EditMenu,
  Menu,
  Symbol,
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
  sfBold,
  sfItalic,
  sfPhoto,
  sfSquareAndArrowUp,
  sfTextformat,
  sfTrash,
  sfUnderline,
} from '../../tooling/icons.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const elementCode = `const [isOpen, setIsOpen] = useState(false);
const photo = useRef<HTMLButtonElement>(null);
// A held press on it selects no text (no browser text menu over it).
useTextActionsPrevention(photo);

<EditMenu.Root open={isOpen} onOpenChange={setIsOpen}>
  <button ref={photo} type="button" onClick={() => setIsOpen(true)}>…</button>
  <EditMenu.Portal>
    <EditMenu.Positioner anchor={photo}>
      <EditMenu.Popup>
        <EditMenu.Item>Copy</EditMenu.Item>
        <EditMenu.Item>Share…</EditMenu.Item>
      </EditMenu.Popup>
    </EditMenu.Positioner>
  </EditMenu.Portal>
</EditMenu.Root>`;

const richCode = `const [isOpen, setIsOpen] = useState(false);
const word = useRef<HTMLButtonElement>(null);
// A held press on it selects no text (no browser text menu over it).
useTextActionsPrevention(word);

{/* A phone's: its menus' submenus over their trigger. */}
<EditMenu.Root open={isOpen} size="compact" onOpenChange={setIsOpen}>
  <button ref={word} type="button" onClick={() => setIsOpen(true)}>…</button>
  <EditMenu.Portal>
    <EditMenu.Positioner anchor={word}>
      <EditMenu.Popup>
        <EditMenu.Item>Cut</EditMenu.Item>
        <EditMenu.Item>Copy</EditMenu.Item>
        <EditMenu.SubmenuRoot>
          <EditMenu.More />
          <EditMenu.Portal>
            {/* A menu as any other: icons, a submenu, toggles, a choice. */}
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon><Symbol icon={sfTextformat} /></Menu.Icon>
                    <Menu.Label>Format</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup>
                        <Menu.CheckboxItem>
                          <Menu.CheckboxItemIndicator />
                          <Menu.Label>Bold</Menu.Label>
                          <Menu.Icon><Symbol icon={sfBold} /></Menu.Icon>
                        </Menu.CheckboxItem>
                        …
                        <Menu.Separator />
                        <Menu.Group>
                          <Menu.GroupLabel>Text Size</Menu.GroupLabel>
                          <Menu.RadioGroup defaultValue="body">
                            <Menu.RadioItem value="title">…</Menu.RadioItem>
                            …
                          </Menu.RadioGroup>
                        </Menu.Group>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Item>…{/* Share */}</Menu.Item>
                <Menu.Separator />
                <Menu.Item destructive>…{/* Delete */}</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </EditMenu.Portal>
        </EditMenu.SubmenuRoot>
      </EditMenu.Popup>
    </EditMenu.Positioner>
  </EditMenu.Portal>
</EditMenu.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A photo's actions, at the photo (no selection). */
const AtAnElement: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isOpen, setIsOpen] = useState(false);
  const photo = useLabelledRef<HTMLButtonElement>('photo', 'HTMLButtonElement');
  useTextActionsPrevention(photo);

  return (
    <Component
      isInline
      baseUiId="menu"
      id="edit-menu-composition-element"
      log={log}
      screen="centered"
      stage="phone"
      title="Edit menu at an element"
    >
      <Viewport.Content>
        <EditMenu.Root
          open={isOpen}
          onOpenChange={(isNextOpen: boolean) => setIsOpen(isNextOpen)}
        >
          <button
            ref={photo}
            aria-label="Photo"
            className="edit-menu-demo-photo"
            type="button"
            onClick={() => setIsOpen(true)}
          >
            <Symbol icon={sfPhoto} />
          </button>
          <EditMenu.Portal>
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
      </Viewport.Content>
    </Component>
  );
};

/** More actions than fit: they scroll in the capsule. */
const ManyActions: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isOpen, setIsOpen] = useState(false);
  const word = useLabelledRef<HTMLButtonElement>('word', 'HTMLButtonElement');
  useTextActionsPrevention(word);

  return (
    <Component
      isInline
      baseUiId="menu"
      id="edit-menu-composition-many"
      log={log}
      screen="centered"
      stage="phone"
      title="Edit menu with many actions"
    >
      <Viewport.Content>
        <EditMenu.Root
          open={isOpen}
          onOpenChange={(isNextOpen: boolean) => setIsOpen(isNextOpen)}
        >
          <button
            ref={word}
            className="edit-menu-demo-word"
            type="button"
            onClick={() => setIsOpen(true)}
          >
            Show Actions
          </button>
          <EditMenu.Portal>
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
      </Viewport.Content>
    </Component>
  );
};

/** A word's actions, a full menu behind “more”: a submenu, toggles, a choice. */
const ARichMenuBehindMore: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isOpen, setIsOpen] = useState(false);
  const word = useLabelledRef<HTMLButtonElement>('word', 'HTMLButtonElement');
  useTextActionsPrevention(word);

  return (
    <Component
      isInline
      baseUiId="menu"
      id="edit-menu-composition-rich"
      log={log}
      screen="centered"
      stage="phone"
      title="Edit menu with a rich menu behind more"
    >
      <Viewport.Content>
        {/* A phone's: its menus' submenus over their trigger. */}
        <EditMenu.Root
          open={isOpen}
          size="compact"
          onOpenChange={(isNextOpen: boolean) => setIsOpen(isNextOpen)}
        >
          <button
            ref={word}
            className="edit-menu-demo-word"
            type="button"
            onClick={() => setIsOpen(true)}
          >
            Show Actions
          </button>
          <EditMenu.Portal>
            <EditMenu.Positioner anchor={word}>
              <EditMenu.Popup>
                <EditMenu.Item onClick={() => addLog('Cut clicked')}>
                  Cut
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Copy clicked')}>
                  Copy
                </EditMenu.Item>
                <EditMenu.SubmenuRoot>
                  <EditMenu.More />
                  <EditMenu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup>
                        <Menu.SubmenuRoot>
                          <Menu.SubmenuTrigger>
                            <Menu.Icon>
                              <Symbol icon={sfTextformat} />
                            </Menu.Icon>
                            <Menu.Label>Format</Menu.Label>
                          </Menu.SubmenuTrigger>
                          <Menu.Portal>
                            <Menu.Positioner>
                              <Menu.Popup>
                                <Menu.CheckboxItem
                                  onCheckedChange={(isChecked: boolean) =>
                                    addLog(`bold: ${String(isChecked)}`)
                                  }
                                >
                                  <Menu.CheckboxItemIndicator />
                                  <Menu.Label>Bold</Menu.Label>
                                  <Menu.Icon>
                                    <Symbol icon={sfBold} />
                                  </Menu.Icon>
                                </Menu.CheckboxItem>
                                <Menu.CheckboxItem
                                  onCheckedChange={(isChecked: boolean) =>
                                    addLog(`italic: ${String(isChecked)}`)
                                  }
                                >
                                  <Menu.CheckboxItemIndicator />
                                  <Menu.Label>Italic</Menu.Label>
                                  <Menu.Icon>
                                    <Symbol icon={sfItalic} />
                                  </Menu.Icon>
                                </Menu.CheckboxItem>
                                <Menu.CheckboxItem
                                  onCheckedChange={(isChecked: boolean) =>
                                    addLog(`underline: ${String(isChecked)}`)
                                  }
                                >
                                  <Menu.CheckboxItemIndicator />
                                  <Menu.Label>Underline</Menu.Label>
                                  <Menu.Icon>
                                    <Symbol icon={sfUnderline} />
                                  </Menu.Icon>
                                </Menu.CheckboxItem>
                                <Menu.Separator />
                                <Menu.Group>
                                  <Menu.GroupLabel>Text Size</Menu.GroupLabel>
                                  <Menu.RadioGroup
                                    defaultValue="body"
                                    onValueChange={(value: unknown) =>
                                      addLog(`text size: ${String(value)}`)
                                    }
                                  >
                                    <Menu.RadioItem value="title">
                                      <Menu.RadioItemIndicator />
                                      <Menu.Label>Title</Menu.Label>
                                    </Menu.RadioItem>
                                    <Menu.RadioItem value="body">
                                      <Menu.RadioItemIndicator />
                                      <Menu.Label>Body</Menu.Label>
                                    </Menu.RadioItem>
                                    <Menu.RadioItem value="caption">
                                      <Menu.RadioItemIndicator />
                                      <Menu.Label>Caption</Menu.Label>
                                    </Menu.RadioItem>
                                  </Menu.RadioGroup>
                                </Menu.Group>
                              </Menu.Popup>
                            </Menu.Positioner>
                          </Menu.Portal>
                        </Menu.SubmenuRoot>
                        <Menu.Item onClick={() => addLog('Share clicked')}>
                          <Menu.Icon>
                            <Symbol icon={sfSquareAndArrowUp} />
                          </Menu.Icon>
                          <Menu.Label>Share…</Menu.Label>
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
                  </EditMenu.Portal>
                </EditMenu.SubmenuRoot>
              </EditMenu.Popup>
            </EditMenu.Positioner>
          </EditMenu.Portal>
        </EditMenu.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['at-an-element', 'At an element'],
  ['many-actions', 'Many actions'],
  ['a-rich-menu-behind-more', 'A rich menu behind “more”'],
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
      <li>
        A held press on the button selects none of its text (no browser text
        menu over the edit menu:{' '}
        <PartLink
          component="viewport"
          part="useTextActionsPrevention"
        />
        ).
      </li>
      <li>
        <strong>Library:</strong> the capsule menu (
        <PartLink
          component="edit-menu"
          part="EditMenu.Root"
        />
        ) at an anchor element (
        <PartLink
          component="edit-menu"
          part="EditMenu.Positioner"
        />
        ), and closing it by an action, a press outside or Escape.
      </li>
      <li>
        <strong>Demo:</strong> opening it on a press (<code>open</code>, the
        app’s state), the photo as its anchor, and what each action does
        (logged).
      </li>
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
      <li>
        A held press on the button selects none of its text (no browser text
        menu over the edit menu:{' '}
        <PartLink
          component="viewport"
          part="useTextActionsPrevention"
        />
        ).
      </li>
      <li>
        <strong>Library:</strong> scrolling the actions inside the capsule,
        faded at its ends, and the more button.
      </li>
      <li>
        <strong>Demo:</strong> the open state and the many actions (logged).
      </li>
    </ul>
    <ManyActions />

    <Heading
      id="a-rich-menu-behind-more"
      level={2}
    >
      A rich menu behind “more”
    </Heading>
    <ul>
      <li>
        The “more” button’s submenu is a menu like any other (
        <PartLink
          component="menu"
          part="Menu.Popup"
        />
        ): icons, a submenu of its own (Format), toggles (
        <PartLink
          component="menu"
          part="Menu.CheckboxItem"
        />
        ), a choice (
        <PartLink
          component="menu"
          part="Menu.RadioGroup"
        />
        ), separators and a destructive action.
      </li>
      <li>
        On a phone, its menus are compact (
        <PartLink
          component="edit-menu"
          part="EditMenu.Root"
        />
        ’s <code>size</code>): Format’s submenu covers its trigger’s menu, as a
        compact one’s; regular (the default), beside it. Toggling keeps the
        menus open, an action closes them all.
      </li>
      <li>
        Without room below their triggers, the menus grow rather than scroll:
        shifted up over them as far as they need (Format’s, over its trigger).
      </li>
      <li>
        A held press on the button selects none of its text (no browser text
        menu over the edit menu:{' '}
        <PartLink
          component="viewport"
          part="useTextActionsPrevention"
        />
        ).
      </li>
      <li>
        <strong>Library:</strong> the more button (
        <PartLink
          component="edit-menu"
          part="EditMenu.More"
        />
        ) opening the menu, and the menu’s parts nested in it (
        <PartLink
          component="menu"
          part="Menu.SubmenuRoot"
        />
        ,{' '}
        <PartLink
          component="menu"
          part="Menu.CheckboxItem"
        />
        ,{' '}
        <PartLink
          component="menu"
          part="Menu.RadioGroup"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the open state, the word as its anchor, the
        actions and options offered, and logging what’s chosen.
      </li>
    </ul>
    <CodeView code={richCode} />
    <ARichMenuBehindMore />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const editMenuCompositionDemos = [
  AtAnElement,
  ManyActions,
  ARichMenuBehindMore,
];
