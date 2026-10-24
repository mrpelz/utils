import '../sheet/style.css';
import './style.css';

import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  ContextualMenu,
  Symbol,
  useCreateContextualMenuHandle,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { codeLabel, useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  getPropOptionsGuideRoot,
  getPropOptionsGuideTrigger,
  propOptionsPopup,
} from '../menu/props.js';
import {
  contextualMenuBackdropRows,
  contextualMenuHandleRows,
  contextualMenuHandleTypeRows,
  contextualMenuPopupRows,
  contextualMenuPortalRows,
  contextualMenuPositionerRows,
  contextualMenuPreviewRows,
  contextualMenuRootRows,
  contextualMenuTriggerRows,
} from './docs.js';
import {
  propOptionsGuideBackdrop,
  propOptionsGuidePortal,
  propOptionsGuidePositioner,
  propOptionsGuidePreview,
} from './props.js';

/** `ContextualMenu.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'ContextualMenu.Root' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ContextualMenu.Root"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root
          key={elementKey}
          {...props}
        >
          <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal container={screen}>
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
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

/** `ContextualMenu.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideTrigger(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'ContextualMenu.Trigger' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ContextualMenu.Trigger"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root>
          <ContextualMenu.Trigger {...props}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal container={screen}>
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
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

/** `ContextualMenu.Preview`, outlined, with its props. */
const PreviewPart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-preview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePreview, {
    external,
    open: true,
    outlined: true,
    title: 'ContextualMenu.Preview',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ContextualMenu.Preview"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root>
          <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...props}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal container={screen}>
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
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

/** `ContextualMenu.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-portal';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePortal, {
    external,
    open: true,
    outlined: true,
    title: 'ContextualMenu.Portal',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ContextualMenu.Portal"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root>
          <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal
            container={screen}
            {...props}
          >
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
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

/** `ContextualMenu.Backdrop`, outlined, with its props. */
const BackdropPart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-backdrop';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideBackdrop, {
    external,
    open: true,
    outlined: true,
    title: 'ContextualMenu.Backdrop',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ContextualMenu.Backdrop"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root>
          <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal container={screen}>
            <ContextualMenu.Backdrop {...props} />
            <ContextualMenu.Positioner>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
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

/** `ContextualMenu.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-positioner';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePositioner, {
    external,
    open: true,
    outlined: true,
    title: 'ContextualMenu.Positioner',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ContextualMenu.Positioner"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root>
          <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal container={screen}>
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner {...props}>
              <ContextualMenu.Popup>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
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

/** `ContextualMenu.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-popup';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    open: true,
    outlined: true,
    title: 'ContextualMenu.Popup',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="ContextualMenu.Popup"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <ContextualMenu.Root>
          <ContextualMenu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol icon={sfPhoto} />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal container={screen}>
            <ContextualMenu.Backdrop />
            <ContextualMenu.Positioner>
              <ContextualMenu.Popup {...props}>
                <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
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

// Its trigger's menu, opened by a button too: made once, here.
const photoMenu = codeLabel(ContextualMenu.createHandle(), 'photoMenu');

/** `ContextualMenu.createHandle`: opened imperatively, its trigger inside its root. */
const CreateHandlePart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-create-handle';
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id={id}
      log={log}
      title="ContextualMenu.createHandle"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <div className="contextual-menu-demo-triggers">
          <ContextualMenu.Root handle={photoMenu}>
            <ContextualMenu.Trigger
              handle={photoMenu}
              id="contextual-menu-parts-create-handle-trigger"
              render={<Button.Root variant="bordered" />}
            >
              <Button.Icon>
                <Symbol icon={sfPhoto} />
              </Button.Icon>
              <Button.Label>Photo</Button.Label>
            </ContextualMenu.Trigger>
            <ContextualMenu.Portal container={screen}>
              <ContextualMenu.Backdrop />
              <ContextualMenu.Positioner>
                <ContextualMenu.Popup>
                  <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                    <ContextualMenu.Icon>
                      <Symbol icon={sfSquareAndArrowUp} />
                    </ContextualMenu.Icon>
                    <ContextualMenu.Label>Share</ContextualMenu.Label>
                  </ContextualMenu.Item>
                </ContextualMenu.Popup>
              </ContextualMenu.Positioner>
            </ContextualMenu.Portal>
          </ContextualMenu.Root>
          <Button.Root
            variant="borderless"
            onClick={() =>
              photoMenu.open('contextual-menu-parts-create-handle-trigger')
            }
          >
            <Button.Label>Open Imperatively</Button.Label>
          </Button.Root>
        </div>
      </div>
    </Component>
  );
};

/** `useCreateContextualMenuHandle`: opened imperatively, its trigger inside its root. */
const UseCreateContextualMenuHandlePart: FunctionComponent = () => {
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const id = 'contextual-menu-parts-use-create-contextual-menu-handle';
  const [log, addLog] = useLog();
  const imageMenu = codeLabel(useCreateContextualMenuHandle(), 'imageMenu');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id={id}
      log={log}
      title="useCreateContextualMenuHandle"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <div className="contextual-menu-demo-triggers">
          <ContextualMenu.Root handle={imageMenu}>
            <ContextualMenu.Trigger
              handle={imageMenu}
              id="contextual-menu-parts-use-create-contextual-menu-handle-trigger"
              render={<Button.Root variant="bordered" />}
            >
              <Button.Icon>
                <Symbol icon={sfPhoto} />
              </Button.Icon>
              <Button.Label>Photo</Button.Label>
            </ContextualMenu.Trigger>
            <ContextualMenu.Portal container={screen}>
              <ContextualMenu.Backdrop />
              <ContextualMenu.Positioner>
                <ContextualMenu.Popup>
                  <ContextualMenu.Item onClick={() => addLog('Share clicked')}>
                    <ContextualMenu.Icon>
                      <Symbol icon={sfSquareAndArrowUp} />
                    </ContextualMenu.Icon>
                    <ContextualMenu.Label>Share</ContextualMenu.Label>
                  </ContextualMenu.Item>
                </ContextualMenu.Popup>
              </ContextualMenu.Positioner>
            </ContextualMenu.Portal>
          </ContextualMenu.Root>
          <Button.Root
            variant="borderless"
            onClick={() =>
              imageMenu.open(
                'contextual-menu-parts-use-create-contextual-menu-handle-trigger',
              )
            }
          >
            <Button.Label>Open Imperatively</Button.Label>
          </Button.Root>
        </div>
      </div>
    </Component>
  );
};

/** `/contextual-menu/parts`: a menu whose trigger lifts, its preview. */
export const ContextualMenuParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A <a href="menu">Menu</a> whose trigger lifts above the page as it opens
        (or turns into a preview), the menu below it.
      </li>
      <li>
        Its own parts: the root, the trigger, the preview, the backdrop, the
        positioner and the popup; everything in the popup is the Menu’s (the
        same parts, under <code>ContextualMenu</code>).
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="ContextualMenu.Root" />
        <ul>
          <li>
            <PartLink part="ContextualMenu.Trigger" />
          </li>
          <li>
            <PartLink part="ContextualMenu.Preview" /> (optional)
          </li>
          <li>
            <PartLink part="ContextualMenu.Portal" />
            <ul>
              <li>
                <PartLink part="ContextualMenu.Backdrop" /> (optional)
              </li>
              <li>
                <PartLink part="ContextualMenu.Positioner" />
                <ul>
                  <li>
                    <PartLink part="ContextualMenu.Popup" />
                    <ul>
                      <li>
                        a <a href="menu/parts">Menu</a>’s items, groups,
                        separators, quick actions (e.g.
                        <PartLink
                          component="menu"
                          part="Menu.Item"
                        >
                          ContextualMenu.Item
                        </PartLink>
                        )
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink part="ContextualMenu.createHandle" />
      </li>
      <li>
        <PartLink part="useCreateContextualMenuHandle" />
      </li>
    </ul>

    <Heading
      id="contextualmenu-root"
      level={2}
    >
      <code>ContextualMenu.Root</code>
    </Heading>
    <ul>
      <li>
        The menu’s state, and the lift: how far the trigger (or preview) rises
        for the menu to fit below it in the viewport.
      </li>
      <li>
        Its props are a <a href="menu">Menu</a>’s root’s (
        <PartLink
          component="menu"
          part="Menu.Root"
        />
        ): <code>size</code>, <code>open</code>, <code>onOpenChange</code>, …
      </li>
      <li>
        Released off the trigger (it lifted away under the finger), the menu
        stays open (as iOS’).
      </li>
      <li>Renders no element.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={contextualMenuRootRows} />
    <Heading
      id="contextualmenu-trigger"
      level={2}
    >
      <code>ContextualMenu.Trigger</code>
    </Heading>
    <ul>
      <li>
        What the menu is about (a photo’s thumbnail, a message): a press opens
        it (on touch, at touch down), lifting it above the blurred page.
      </li>
      <li>
        <code>openOn=&quot;secondaryClick&quot;</code>: a held press or a right
        click opens it; a press is the trigger’s own (opening the photo).
      </li>
      <li>
        Renders a <code>button</code> (in a wrapper that keeps its place while
        it lifts); usually a <a href="button">Button</a> (<code>render</code>).
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={contextualMenuTriggerRows} />
    <Heading
      id="contextualmenu-preview"
      level={2}
    >
      <code>ContextualMenu.Preview</code>
    </Heading>
    <ul>
      <li>
        What the trigger turns into while the menu is open (the photo, larger),
        in its place, lifted with it, aligned as the menu.
      </li>
      <li>
        Always in the viewport (at most as large); too tall with the menu, they
        scroll together.
      </li>
      <li>Takes no pointer events (iOS: pressing it would commit).</li>
    </ul>
    <PreviewPart />
    <h3>Props</h3>
    <PropsTable rows={contextualMenuPreviewRows} />
    <Heading
      id="contextualmenu-portal"
      level={2}
    >
      <code>ContextualMenu.Portal</code>
    </Heading>
    <ul>
      <li>
        Renders the backdrop and the menu into <code>document.body</code>, or
        its <code>container</code>.
      </li>
      <li>
        Its container is also the screen the trigger lifts within (as a
        device’s: e.g. these views’ frames): the menu fits in it, the preview
        stays in it. Without one, the viewport.
      </li>
      <li>
        No box of its own (<code>display: contents</code>): rendered into a
        screen laid out as a flex column, it doesn’t shift its content.
      </li>
    </ul>
    <PortalPart />
    <h3>Props</h3>
    <PropsTable rows={contextualMenuPortalRows} />

    <Heading
      id="contextualmenu-backdrop"
      level={2}
    >
      <code>ContextualMenu.Backdrop</code>
    </Heading>
    <ul>
      <li>
        The page blurred and dimmed behind the lifted trigger and the menu
        (iOS’); optional.
      </li>
    </ul>
    <BackdropPart />
    <h3>Props</h3>
    <PropsTable rows={contextualMenuBackdropRows} />
    <Heading
      id="contextualmenu-positioner"
      level={2}
    >
      <code>ContextualMenu.Positioner</code>
    </Heading>
    <ul>
      <li>
        Below the lifted trigger (or preview), 8px away; never above it (the
        trigger lifts instead).
      </li>
      <li>
        Aligned with it (<code>align</code>, the preview aligning too), shifted
        to stay in the viewport.
      </li>
    </ul>
    <PositionerPart />
    <h3>Props</h3>
    <PropsTable rows={contextualMenuPositionerRows} />
    <Heading
      id="contextualmenu-popup"
      level={2}
    >
      <code>ContextualMenu.Popup</code>
    </Heading>
    <ul>
      <li>
        A <a href="menu">Menu</a>’s popup (
        <PartLink
          component="menu"
          part="Menu.Popup"
        />
        ), its height deciding how far the trigger lifts.
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={contextualMenuPopupRows} />
    <Heading
      id="contextualmenu-createhandle"
      level={2}
    >
      <code>ContextualMenu.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle opening or closing the menu imperatively (Base UI’s{' '}
        <code>Menu.createHandle</code>): <code>handle.open(triggerId)</code>.
      </li>
      <li>
        Its trigger stays inside the root: a trigger outside it couldn’t lift.
      </li>
      <li>
        Made once, outside a component (in one:{' '}
        <PartLink part="useCreateContextualMenuHandle" />
        ).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={contextualMenuHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={contextualMenuHandleRows} />
    <Heading
      id="usecreatecontextualmenuhandle"
      level={2}
    >
      <code>useCreateContextualMenuHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink part="ContextualMenu.createHandle" /> in a component: made
        once, the same for its lifetime.
      </li>
    </ul>
    <UseCreateContextualMenuHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={contextualMenuHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={contextualMenuHandleRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const contextualMenuPartsDemos = [
  RootPart,
  TriggerPart,
  PreviewPart,
  PortalPart,
  BackdropPart,
  PositionerPart,
  PopupPart,
  CreateHandlePart,
  UseCreateContextualMenuHandlePart,
];
