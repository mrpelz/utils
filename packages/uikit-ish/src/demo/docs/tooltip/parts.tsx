import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Symbol,
  Tooltip,
  useCreateTooltipHandle,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfPlusSquareOnSquare,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  tooltipHandleRows,
  tooltipHandleTypeRows,
  tooltipPopupRows,
  tooltipPortalRows,
  tooltipPositionerRows,
  tooltipProviderRows,
  tooltipRootRows,
  tooltipTriggerRows,
} from './docs.js';
import {
  getPropOptionsGuideRoot,
  propOptionsGuidePositioner,
  propOptionsGuideTrigger,
  propOptionsPopup,
  propOptionsPortal,
  propOptionsProvider,
} from './props.js';

// Every view writes out its tooltip (a share button's), the part's props on
// that part, so its code shows as it'd be used.

/** `Tooltip.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'tooltip-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Tooltip.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Root': ['shape', 'size', 'variant'],
            'Tooltip.Popup': [],
            'Tooltip.Portal': [],
            'Tooltip.Positioner': [],
            'Tooltip.Trigger': ['aria-label', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Tooltip.Root"
    >
      <Tooltip.Root
        key={elementKey}
        {...props}
      >
        <Tooltip.Trigger
          {...partProps['Tooltip.Trigger']}
          aria-label="Share"
          render={
            <Button.Root
              {...partProps['Button.Root']}
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfSquareAndArrowUp}
            />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal {...partProps['Tooltip.Portal']}>
          <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
            <Tooltip.Popup {...partProps['Tooltip.Popup']}>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'tooltip-parts-trigger';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideTrigger, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Trigger',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Tooltip.Popup': [],
          'Tooltip.Portal': [],
          'Tooltip.Positioner': [],
          'Tooltip.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Tooltip.Trigger"
    >
      <Tooltip.Root {...partProps['Tooltip.Root']}>
        <Tooltip.Trigger
          aria-label="Share"
          {...props}
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfSquareAndArrowUp}
            />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal {...partProps['Tooltip.Portal']}>
          <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
            <Tooltip.Popup {...partProps['Tooltip.Popup']}>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const id = 'tooltip-parts-portal';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPortal, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Portal',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Root': ['shape', 'size', 'variant'],
          'Tooltip.Popup': [],
          'Tooltip.Positioner': [],
          'Tooltip.Root': [],
          'Tooltip.Trigger': ['aria-label', 'render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Tooltip.Portal"
    >
      <Tooltip.Root
        {...partProps['Tooltip.Root']}
        defaultOpen
      >
        <Tooltip.Trigger
          {...partProps['Tooltip.Trigger']}
          aria-label="Share"
          render={
            <Button.Root
              {...partProps['Button.Root']}
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfSquareAndArrowUp}
            />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal {...props}>
          <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
            <Tooltip.Popup {...partProps['Tooltip.Popup']}>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const id = 'tooltip-parts-positioner';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePositioner, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Positioner',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Root': ['shape', 'size', 'variant'],
          'Tooltip.Popup': [],
          'Tooltip.Portal': [],
          'Tooltip.Root': [],
          'Tooltip.Trigger': ['aria-label', 'render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Tooltip.Positioner"
    >
      <Tooltip.Root
        {...partProps['Tooltip.Root']}
        defaultOpen
      >
        <Tooltip.Trigger
          {...partProps['Tooltip.Trigger']}
          aria-label="Share"
          render={
            <Button.Root
              {...partProps['Button.Root']}
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfSquareAndArrowUp}
            />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal {...partProps['Tooltip.Portal']}>
          <Tooltip.Positioner {...props}>
            <Tooltip.Popup {...partProps['Tooltip.Popup']}>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'tooltip-parts-popup';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Tooltip.Popup',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Root': ['shape', 'size', 'variant'],
          'Tooltip.Portal': [],
          'Tooltip.Positioner': [],
          'Tooltip.Root': [],
          'Tooltip.Trigger': ['aria-label', 'render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Tooltip.Popup"
    >
      <Tooltip.Root
        {...partProps['Tooltip.Root']}
        defaultOpen
      >
        <Tooltip.Trigger
          {...partProps['Tooltip.Trigger']}
          aria-label="Share"
          render={
            <Button.Root
              {...partProps['Button.Root']}
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfSquareAndArrowUp}
            />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Portal {...partProps['Tooltip.Portal']}>
          <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
            <Tooltip.Popup {...props}>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `Tooltip.Provider`, with its props: three buttons' tooltips. */
const ProviderPart: FunctionComponent = () => {
  const id = 'tooltip-parts-provider';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsProvider, {
    external,
    title: 'Tooltip.Provider',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Root': ['shape', 'size', 'variant'],
          'Tooltip.Popup': [],
          'Tooltip.Portal': [],
          'Tooltip.Positioner': [],
          'Tooltip.Root': [],
          'Tooltip.Trigger': ['aria-label', 'render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Tooltip.Provider"
    >
      <Tooltip.Provider {...props}>
        <div className="tooltip-demo-buttons">
          <Tooltip.Root {...partProps['Tooltip.Root']}>
            <Tooltip.Trigger
              {...partProps['Tooltip.Trigger']}
              aria-label="Share"
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  shape="circle"
                  size="large"
                  variant="glass"
                />
              }
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfSquareAndArrowUp}
                />
              </Button.Icon>
            </Tooltip.Trigger>
            <Tooltip.Portal {...partProps['Tooltip.Portal']}>
              <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
                <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                  Share
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root {...partProps['Tooltip.Root']}>
            <Tooltip.Trigger
              {...partProps['Tooltip.Trigger']}
              aria-label="Duplicate"
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  shape="circle"
                  size="large"
                  variant="glass"
                />
              }
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfPlusSquareOnSquare}
                />
              </Button.Icon>
            </Tooltip.Trigger>
            <Tooltip.Portal {...partProps['Tooltip.Portal']}>
              <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
                <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                  Duplicate
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root {...partProps['Tooltip.Root']}>
            <Tooltip.Trigger
              {...partProps['Tooltip.Trigger']}
              aria-label="Delete"
              render={
                <Button.Root
                  {...partProps['Button.Root']}
                  shape="circle"
                  size="large"
                  variant="glass"
                />
              }
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfTrash}
                />
              </Button.Icon>
            </Tooltip.Trigger>
            <Tooltip.Portal {...partProps['Tooltip.Portal']}>
              <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
                <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                  Delete
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </Tooltip.Provider>
    </Component>
  );
};
// Its trigger and its button, outside the root: made once, here.
const shareTooltip = codeLabel(
  Tooltip.createHandle(),
  'shareTooltip',
  'const shareTooltip = Tooltip.createHandle(); // (at module level)',
);

/** `Tooltip.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'tooltip-parts-create-handle';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['onClick', 'shape', 'size', 'variant'],
            'Tooltip.Popup': [],
            'Tooltip.Portal': [],
            'Tooltip.Positioner': [],
            'Tooltip.Root': ['handle', 'onOpenChange'],
            'Tooltip.Trigger': ['aria-label', 'handle', 'id', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Tooltip.createHandle"
    >
      <div className="tooltip-demo-buttons">
        <Tooltip.Trigger
          {...partProps['Tooltip.Trigger']}
          aria-label="Share"
          handle={shareTooltip}
          id="tooltip-parts-share-trigger"
          render={
            <Button.Root
              {...partProps['Button.Root']}
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfSquareAndArrowUp}
            />
          </Button.Icon>
        </Tooltip.Trigger>
        <Button.Root
          {...partProps['Button.Root']}
          variant="borderless"
          onClick={() => shareTooltip.open('tooltip-parts-share-trigger')}
        >
          <Button.Label {...partProps['Button.Label']}>
            Open Imperatively
          </Button.Label>
        </Button.Root>
      </div>
      <Tooltip.Root
        {...partProps['Tooltip.Root']}
        handle={shareTooltip}
        onOpenChange={(isOpen: boolean, { reason }) =>
          addLog(`open change: ${String(isOpen)} (${reason})`)
        }
      >
        <Tooltip.Portal {...partProps['Tooltip.Portal']}>
          <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
            <Tooltip.Popup {...partProps['Tooltip.Popup']}>Share</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Component>
  );
};

/** `useCreateTooltipHandle`: two triggers, one tooltip, its text theirs. */
const UseCreateTooltipHandlePart: FunctionComponent = () => {
  const id = 'tooltip-parts-use-create-tooltip-handle';
  // Its triggers, outside the root, each with its payload: its text.
  const toolbarTooltip = codeLabel(
    useCreateTooltipHandle<{ text: string }>(),
    'toolbarTooltip',
    'const toolbarTooltip = useCreateTooltipHandle<{ text: string }>();',
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Button.Root': ['shape', 'size', 'variant'],
          'Tooltip.Popup': [],
          'Tooltip.Portal': [],
          'Tooltip.Positioner': [],
          'Tooltip.Root': ['handle'],
          'Tooltip.Trigger': ['aria-label', 'handle', 'payload', 'render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[partControls]}
      id={id}
      state={[partState]}
      title="useCreateTooltipHandle"
    >
      <div className="tooltip-demo-buttons">
        <Tooltip.Trigger
          {...partProps['Tooltip.Trigger']}
          aria-label="Duplicate"
          handle={toolbarTooltip}
          payload={{ text: 'Duplicate' }}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfPlusSquareOnSquare}
            />
          </Button.Icon>
        </Tooltip.Trigger>
        <Tooltip.Trigger
          {...partProps['Tooltip.Trigger']}
          aria-label="Delete"
          handle={toolbarTooltip}
          payload={{ text: 'Delete' }}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              shape="circle"
              size="large"
              variant="glass"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfTrash}
            />
          </Button.Icon>
        </Tooltip.Trigger>
      </div>
      <Tooltip.Root
        {...partProps['Tooltip.Root']}
        handle={toolbarTooltip}
      >
        {({ payload }) => (
          <Tooltip.Portal {...partProps['Tooltip.Portal']}>
            <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
              <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                {payload?.text}
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Component>
  );
};

/** `/tooltip/parts`: its provider, root, trigger, portal's parts, handles. */
export const TooltipParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Provider: shared delays for several tooltips (optional).</li>
      <li>Root: holds its state (open) for its parts.</li>
      <li>Trigger: the control it labels.</li>
      <li>
        Portal, Positioner and Popup: where it renders, where it’s placed, and
        the capsule itself.
      </li>
      <li>Handles: triggers outside the root, and opening it from code.</li>
      <li>Hover (or focus) each view’s button to show its tooltip.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="tooltip"
          part="Tooltip.Provider"
        />{' '}
        (optional, around several)
        <ul>
          <li>
            <PartLink
              component="tooltip"
              part="Tooltip.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="tooltip"
                  part="Tooltip.Trigger"
                />{' '}
                (optional; or outside the root, through a handle; or an{' '}
                <code>anchor</code>, held open)
              </li>
              <li>
                <PartLink
                  component="tooltip"
                  part="Tooltip.Portal"
                />
                <ul>
                  <li>
                    <PartLink
                      component="tooltip"
                      part="Tooltip.Positioner"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="tooltip"
                          part="Tooltip.Popup"
                        />
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
          component="tooltip"
          part="Tooltip.createHandle"
        />{' '}
        (a tooltip’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="tooltip"
              part="useCreateTooltipHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="tooltip-provider"
      level={2}
    >
      <code>Tooltip.Provider</code>
    </Heading>
    <ul>
      <li>
        Optional, around several tooltips (for example a toolbar’s). Once one
        has shown, the next one shows at once (within its <code>timeout</code>).
      </li>
      <li>
        Its <code>delay</code> applies to its triggers, unless they set their
        own. Without a provider, a trigger’s delay is 300ms.
      </li>
      <li>Renders no element of its own.</li>
    </ul>
    <ProviderPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipProviderRows} />

    <Heading
      id="tooltip-root"
      level={2}
    >
      <code>Tooltip.Root</code>
    </Heading>
    <ul>
      <li>
        Holds its state. It shows on hover, on keyboard focus and on a long
        press by touch, and calls <code>onOpenChange</code> with the reason.{' '}
        <code>open</code> holds it open.
      </li>
      <li>Renders no element of its own.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipRootRows} />

    <Heading
      id="tooltip-trigger"
      level={2}
    >
      <code>Tooltip.Trigger</code>
    </Heading>
    <ul>
      <li>
        The control it labels (for example a symbol{' '}
        <a href={publicUrl('button')}>Button</a>,{' '}
        <code>{'render={<Button.Root />}'}</code>). It shows when the control is
        hovered for its <code>delay</code> (300ms, or its provider’s), or
        focused by keyboard.
      </li>
      <li>
        On touch, a long press (held 500ms without moving) shows it until the
        finger lifts, like the labels on a tablet’s toolbar buttons. That press
        doesn’t activate the trigger. A shorter tap works on the trigger as
        before.
      </li>
      <li>
        The control’s own action stays the same, and a click closes the tooltip
        (<code>closeOnClick</code>).
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipTriggerRows} />

    <Heading
      id="tooltip-portal"
      level={2}
    >
      <code>Tooltip.Portal</code>
    </Heading>
    <ul>
      <li>
        It has no box of its own (<code>display: contents</code>), so rendering
        it into a container laid out as a flex column (such as a screen) doesn’t
        shift that container’s content.
      </li>
      <li>
        It renders into the document’s body (<code>container</code>). While
        closed, it renders nothing (or, with <code>keepMounted</code>, stays
        hidden).
      </li>
      <li>
        Renders a <code>div</code> in its container.
      </li>
    </ul>
    <PortalPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipPortalRows} />

    <Heading
      id="tooltip-positioner"
      level={2}
    >
      <code>Tooltip.Positioner</code>
    </Heading>
    <ul>
      <li>
        Places it above its trigger (<code>side</code>, logical), centered (
        <code>align</code>), 8px from the trigger and from the screen’s edges.
        Without room, it goes below.
      </li>
      <li>
        Renders a <code>div</code>, above the page’s layers.
      </li>
    </ul>
    <PositionerPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipPositionerRows} />

    <Heading
      id="tooltip-popup"
      level={2}
    >
      <code>Tooltip.Popup</code>
    </Heading>
    <ul>
      <li>
        The capsule: the menus’ glass, with Subheadline text, 6px by 12px in.
        One line is 32px tall; more lines get 16px corners. It scales in from
        its trigger.
      </li>
      <li>
        It can’t be hovered itself (it has no pointer events), since it’s a
        label with nothing to press.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={tooltipPopupRows} />

    <Heading
      id="tooltip-createhandle"
      level={2}
    >
      <code>Tooltip.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle that links a tooltip to its triggers outside its root, and
        opens or closes it from code (Base UI’s{' '}
        <code>Tooltip.createHandle</code>).
      </li>
      <li>
        Make it once, for example at a module’s top level (in a component, use{' '}
        <PartLink
          component="tooltip"
          part="useCreateTooltipHandle"
        />
        ).
      </li>
      <li>
        Here, there’s a trigger before the root, and a button that opens it at
        that trigger (its <code>open(triggerId)</code>).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={tooltipHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={tooltipHandleRows} />

    <Heading
      id="usecreatetooltiphandle"
      level={2}
    >
      <code>useCreateTooltipHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="tooltip"
          part="Tooltip.createHandle"
        />{' '}
        in a component: the same handle for the component’s lifetime.
      </li>
      <li>
        Here, two triggers share one tooltip. Each passes its text as its{' '}
        <code>payload</code>, and the root’s children are a function of it.
      </li>
    </ul>
    <UseCreateTooltipHandlePart />
    <h3>Type Parameters</h3>
    <PropsTable rows={tooltipHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={tooltipHandleRows} />

    <Heading
      id="base-ui-s-other-parts"
      level={2}
    >
      Base UI’s other parts
    </Heading>
    <ul>
      <li>
        These are re-exported as they are, without styles (see{' '}
        <a
          href="https://base-ui.com/react/components/tooltip"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Tooltip
        </a>
        ):
      </li>
      <li>
        <code>Tooltip.Arrow</code>: not used, since these glass capsules have no
        arrow.
      </li>
      <li>
        <code>Tooltip.Viewport</code>: goes around content that changes between
        triggers, so the app can animate it.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tooltipPartsDemos = [
  ProviderPart,
  RootPart,
  TriggerPart,
  PortalPart,
  PositionerPart,
  PopupPart,
  CreateHandlePart,
  UseCreateTooltipHandlePart,
];
