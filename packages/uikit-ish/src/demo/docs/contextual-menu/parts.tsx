import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  ContextualMenu,
  Symbol,
  useCreateContextualMenuHandle,
  useTextActionsPrevention,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel, useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfPhoto, sfSquareAndArrowUp, sfTrash } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import {
  getPropOptionsGuideRoot,
  getPropOptionsGuideTrigger,
  propOptionsPopup,
} from '../menu/props.js';
import { partPropMaps } from '../part-options.js';
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

/** Its trigger, held to open: selecting no text (no browser text menu). */
const useHeldTrigger = (isHeld = true) => {
  const trigger = useLabelledRef<HTMLButtonElement>(
    'trigger',
    'HTMLButtonElement',
  );
  useTextActionsPrevention(trigger, isHeld);
  return trigger;
};

// (Shown in the demos' code.)
const heldSetup = 'useTextActionsPrevention(trigger);';

/** `ContextualMenu.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-root';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'ContextualMenu.Root',
    },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Preview': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[state, partState]}
      title="ContextualMenu.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root
          key={elementKey}
          {...props}
        >
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={trigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
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
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
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

/** `ContextualMenu.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideTrigger(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'ContextualMenu.Trigger',
    },
  );
  const isHeld = props.openOn !== 'click';
  const trigger = useHeldTrigger(isHeld);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
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
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={isHeld ? heldSetup : undefined}
      stage="phone"
      state={[state, partState]}
      title="ContextualMenu.Trigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            ref={trigger}
            {...props}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
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
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
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

/** `ContextualMenu.Preview`, outlined, with its props. */
const PreviewPart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-preview';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePreview, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ContextualMenu.Preview',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Root': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[state, partState]}
      title="ContextualMenu.Preview"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={trigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...props}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
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
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
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

/** `ContextualMenu.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-portal';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePortal, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ContextualMenu.Portal',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Preview': [],
            'ContextualMenu.Root': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[state, partState]}
      title="ContextualMenu.Portal"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={trigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal {...props}>
            <ContextualMenu.Backdrop
              {...partProps['ContextualMenu.Backdrop']}
            />
            <ContextualMenu.Positioner
              {...partProps['ContextualMenu.Positioner']}
            >
              <ContextualMenu.Popup {...partProps['ContextualMenu.Popup']}>
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
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
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

/** `ContextualMenu.Backdrop`, outlined, with its props. */
const BackdropPart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-backdrop';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideBackdrop, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ContextualMenu.Backdrop',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Preview': [],
            'ContextualMenu.Root': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[state, partState]}
      title="ContextualMenu.Backdrop"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={trigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
            >
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </div>
          </ContextualMenu.Preview>
          <ContextualMenu.Portal {...partProps['ContextualMenu.Portal']}>
            <ContextualMenu.Backdrop {...props} />
            <ContextualMenu.Positioner
              {...partProps['ContextualMenu.Positioner']}
            >
              <ContextualMenu.Popup {...partProps['ContextualMenu.Popup']}>
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
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
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

/** `ContextualMenu.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-positioner';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePositioner, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ContextualMenu.Positioner',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Preview': [],
            'ContextualMenu.Root': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[state, partState]}
      title="ContextualMenu.Positioner"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={trigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
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
            <ContextualMenu.Positioner {...props}>
              <ContextualMenu.Popup {...partProps['ContextualMenu.Popup']}>
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
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
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

/** `ContextualMenu.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-popup';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ContextualMenu.Popup',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['destructive', 'onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Preview': [],
            'ContextualMenu.Root': [],
            'ContextualMenu.Separator': [],
            'ContextualMenu.Trigger': ['ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[state, partState]}
      title="ContextualMenu.Popup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <ContextualMenu.Root {...partProps['ContextualMenu.Root']}>
          <ContextualMenu.Trigger
            {...partProps['ContextualMenu.Trigger']}
            ref={trigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPhoto}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
          </ContextualMenu.Trigger>
          <ContextualMenu.Preview {...partProps['ContextualMenu.Preview']}>
            <div
              aria-label="Photo"
              className="contextual-menu-demo-photo"
              role="img"
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
              <ContextualMenu.Popup {...props}>
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
                <ContextualMenu.Separator
                  {...partProps['ContextualMenu.Separator']}
                />
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

// Its trigger's menu, opened by a button too: made once, here.
const photoMenu = codeLabel(
  ContextualMenu.createHandle(),
  'photoMenu',
  'const photoMenu = ContextualMenu.createHandle(); // (at module level)',
);

/** `ContextualMenu.createHandle`: opened imperatively, its trigger inside its root. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-create-handle';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Root': ['handle'],
            'ContextualMenu.Trigger': ['handle', 'id', 'ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[partState]}
      title="ContextualMenu.createHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="contextual-menu-demo-triggers">
          <ContextualMenu.Root
            {...partProps['ContextualMenu.Root']}
            handle={photoMenu}
          >
            <ContextualMenu.Trigger
              {...partProps['ContextualMenu.Trigger']}
              ref={trigger}
              handle={photoMenu}
              id="contextual-menu-parts-create-handle-trigger"
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  variant="bordered"
                />
              }
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfPhoto}
                />
              </Button.Icon>
              <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
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
                    onClick={() => addLog('Share clicked')}
                  >
                    <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
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
                </ContextualMenu.Popup>
              </ContextualMenu.Positioner>
            </ContextualMenu.Portal>
          </ContextualMenu.Root>
          <Button.Root
            {...partProps['Button.Root']}
            variant="borderless"
            onClick={() =>
              photoMenu.open('contextual-menu-parts-create-handle-trigger')
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Open Imperatively
            </Button.Label>
          </Button.Root>
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `useCreateContextualMenuHandle`: opened imperatively, its trigger inside its root. */
const UseCreateContextualMenuHandlePart: FunctionComponent = () => {
  const id = 'contextual-menu-parts-use-create-contextual-menu-handle';
  const [log, addLog] = useLog();
  const trigger = useHeldTrigger();
  const imageMenu = codeLabel(
    useCreateContextualMenuHandle(),
    'imageMenu',
    'const imageMenu = useCreateContextualMenuHandle();',
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'ContextualMenu.Backdrop': [],
            'ContextualMenu.Icon': [],
            'ContextualMenu.Item': ['onClick'],
            'ContextualMenu.Label': [],
            'ContextualMenu.Popup': [],
            'ContextualMenu.Portal': [],
            'ContextualMenu.Positioner': [],
            'ContextualMenu.Root': ['handle'],
            'ContextualMenu.Trigger': ['handle', 'id', 'ref', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={heldSetup}
      stage="phone"
      state={[partState]}
      title="useCreateContextualMenuHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="contextual-menu-demo-triggers">
          <ContextualMenu.Root
            {...partProps['ContextualMenu.Root']}
            handle={imageMenu}
          >
            <ContextualMenu.Trigger
              {...partProps['ContextualMenu.Trigger']}
              ref={trigger}
              handle={imageMenu}
              id="contextual-menu-parts-use-create-contextual-menu-handle-trigger"
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  variant="bordered"
                />
              }
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfPhoto}
                />
              </Button.Icon>
              <Button.Label {...partProps['Button.Label']}>Photo</Button.Label>
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
                    onClick={() => addLog('Share clicked')}
                  >
                    <ContextualMenu.Icon {...partProps['ContextualMenu.Icon']}>
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
                </ContextualMenu.Popup>
              </ContextualMenu.Positioner>
            </ContextualMenu.Portal>
          </ContextualMenu.Root>
          <Button.Root
            {...partProps['Button.Root']}
            variant="borderless"
            onClick={() =>
              imageMenu.open(
                'contextual-menu-parts-use-create-contextual-menu-handle-trigger',
              )
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Open Imperatively
            </Button.Label>
          </Button.Root>
        </div>
      </Viewport.Content>
    </Component>
  );
};

/** `/contextual-menu/parts`: a menu whose trigger lifts, its preview. */
export const ContextualMenuParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A <a href={publicUrl('menu')}>Menu</a> whose trigger lifts above the
        page as it opens (or turns into a preview), with the menu below it.
      </li>
      <li>
        Its own parts are the root, the trigger, the preview, the backdrop, the
        positioner and the popup. Everything in the popup is the Menu’s (the
        same parts, under <code>ContextualMenu</code>).
      </li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.Root"
        />
        <ul>
          <li>
            <PartLink
              component="contextual-menu"
              part="ContextualMenu.Trigger"
            />
          </li>
          <li>
            <PartLink
              component="contextual-menu"
              part="ContextualMenu.Preview"
            />{' '}
            (optional)
          </li>
          <li>
            <PartLink
              component="contextual-menu"
              part="ContextualMenu.Portal"
            />
            <ul>
              <li>
                <PartLink
                  component="contextual-menu"
                  part="ContextualMenu.Backdrop"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="contextual-menu"
                  part="ContextualMenu.Positioner"
                />
                <ul>
                  <li>
                    <PartLink
                      component="contextual-menu"
                      part="ContextualMenu.Popup"
                    />
                    <ul>
                      <li className="demo-tree-context">
                        <span>a</span>{' '}
                        <a href={publicUrl('menu/parts')}>Menu</a>
                        <span>
                          ’s items, groups, separators and quick actions (for
                          example
                        </span>{' '}
                        <PartLink
                          component="menu"
                          part="Menu.Item"
                        >
                          ContextualMenu.Item
                        </PartLink>
                        <span>)</span>
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
        <PartLink
          component="contextual-menu"
          part="ContextualMenu.createHandle"
        />{' '}
        (a handle, for opening it from code)
        <ul>
          <li>
            <PartLink
              component="contextual-menu"
              part="useCreateContextualMenuHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
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
        Holds the menu’s state, and whether a preview is given (otherwise, the
        trigger lifts itself).
      </li>
      <li>
        Its props are a <a href={publicUrl('menu')}>Menu</a>’s root’s (
        <PartLink
          component="menu"
          part="Menu.Root"
        />
        ): <code>size</code>, <code>open</code>, <code>onOpenChange</code>, and
        so on.
      </li>
      <li>
        When the press is released off the trigger (because the trigger lifted
        away under the finger), the menu stays open.
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
        What the menu is about, such as a photo’s thumbnail or a message. A
        right click or a held press opens the menu, lifting the trigger above
        the blurred page. A press stays the trigger’s own (opening the photo).
      </li>
      <li>
        With <code>openOn=&quot;click&quot;</code>, a press opens it too (on
        touch, at touch down).
      </li>
      <li>
        Renders a <code>button</code>, in a wrapper that keeps its place while
        it lifts. Usually a <a href={publicUrl('button')}>Button</a> (
        <code>render</code>).
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
        What the trigger turns into while the menu is open (the photo, larger).
        It sits above the menu in the same popup (the positioner’s stack),
        starting from the trigger’s place, aligned like the menu.
      </li>
      <li>
        It renders as itself, live, not as a copy of the trigger. It takes at
        most the room the menu leaves (or, when the menu is taller, half of it),
        and is clipped.
      </li>
      <li>
        Without one, the trigger itself lifts into its place. Inside its
        ancestors’ stacking contexts (for example a{' '}
        <a href={publicUrl('viewport')}>Viewport</a>’s layers), its{' '}
        <code>z-index</code> can’t lift it above the backdrop, so the backdrop
        is cut out where it is, and it shows through.
      </li>
      <li>It takes no pointer events, because pressing it would choose.</li>
      <li>
        Here: open the menu (with a long press on its trigger, or a secondary
        click) to see it. One menu opens at a time.
      </li>
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
        into its <code>container</code>.
      </li>
      <li>
        Its container is also the screen the menu fits in (like a device’s, for
        example these views’ frames), clear of its safe area insets. Without
        one, that’s the viewport.
      </li>
      <li>
        It has no box of its own (<code>display: contents</code>), so rendering
        it into a screen laid out as a flex column doesn’t shift that screen’s
        content.
      </li>
      <li>
        Here: open the menu (with a long press on its trigger, or a secondary
        click) to see it. One menu opens at a time.
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
        The page, blurred and dimmed behind the lifted trigger and the menu
        (optional).
      </li>
      <li>
        Here: open the menu (with a long press on its trigger, or a secondary
        click) to see it. One menu opens at a time.
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
        The preview’s slot and the menu below it, 8px apart, starting from the
        trigger’s place. They’re one stack, shifted as far as it needs to fit on
        its screen (and never flipped above the trigger).
      </li>
      <li>
        It’s aligned with the trigger (<code>align</code>), and the preview
        aligns too.
      </li>
      <li>
        Here: open the menu (with a long press on its trigger, or a secondary
        click) to see it. One menu opens at a time.
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
        A <a href={publicUrl('menu')}>Menu</a>’s popup (
        <PartLink
          component="menu"
          part="Menu.Popup"
        />
        ), below the preview. When it’s taller than the room left, it scrolls.
      </li>
      <li>
        Here: open the menu (with a long press on its trigger, or a secondary
        click) to see it. One menu opens at a time.
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
        A handle that opens or closes the menu from code (Base UI’s{' '}
        <code>Menu.createHandle</code>): <code>handle.open(triggerId)</code>.
      </li>
      <li>
        Its trigger stays inside the root, because a trigger outside it couldn’t
        lift.
      </li>
      <li>
        Make it once, outside a component (inside one, use{' '}
        <PartLink part="useCreateContextualMenuHandle" />
        ).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
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
        once, the same for the component’s lifetime.
      </li>
    </ul>
    <UseCreateContextualMenuHandlePart />
    <h3>Type Parameters</h3>
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
